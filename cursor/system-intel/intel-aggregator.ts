/**
 * system-intel/intel-aggregator.ts
 * 
 * Purpose:
 * Core orchestrator for system telemetry collection and aggregation.
 * Ingests logs and events from various sources to provide a unified view
 * of system health, trust scores, and agent status.
 */

import { EventBus } from '../utils/event-bus';
import { TrustScorer } from '../agents/trust-scorer/trust-scorer';
import { HeartbeatMonitor } from '../heartbeat/heartbeat-monitor';
import { EvolutionTriggerManager } from '../evolution-triggers/evolution-trigger';
import { ResourceMonitor } from '../optimization/resource-monitor';
import { AgentStatusSurface } from './agent-status-surface';
import { SnapshotEmitter } from './snapshot-emitter';
import { TrustTimeline } from './trust-timeline';

export interface SystemIntelMetrics {
  timestamp: string;
  agents: Record<string, AgentMetrics>;
  recentViolations: TrustViolation[];
  trustTimeline: TrustDelta[];
  systemHealth: SystemHealth;
}

export interface AgentMetrics {
  status: 'healthy' | 'warning' | 'critical' | 'unknown' | 'recovering';
  trustScore: number;
  lastHeartbeat?: string;
  resourceUsage?: {
    cpu: number;
    memory: number;
    responseTime: number;
  };
  lastTrigger?: string;
  lastError?: string;
}

export interface TrustViolation {
  agentId: string;
  timestamp: string;
  violationType: string;
  details: string;
}

export interface TrustDelta {
  agentId: string;
  timestamp: string;
  previousScore: number;
  currentScore: number;
  delta: number;
  reason?: string;
}

export interface ResourceMetrics {
  cpu: number;
  memory: number;
  responseTime: number;
}

export type AgentStatus = 'healthy' | 'warning' | 'critical' | 'recovering';
export type SystemHealth = 'stable' | 'degraded' | 'critical';

export class IntelAggregator {
  private eventBus: EventBus;
  private trustScorer: TrustScorer;
  private heartbeatMonitor: HeartbeatMonitor;
  private evolutionManager: EvolutionTriggerManager;
  private resourceMonitor: ResourceMonitor;
  private statusSurface: AgentStatusSurface;
  private snapshotEmitter: SnapshotEmitter;
  private trustTimeline: TrustTimeline;
  private metrics: SystemIntelMetrics;

  constructor(
    eventBus: EventBus,
    trustScorer: TrustScorer,
    heartbeatMonitor: HeartbeatMonitor,
    evolutionManager: EvolutionTriggerManager,
    resourceMonitor: ResourceMonitor
  ) {
    this.eventBus = eventBus;
    this.trustScorer = trustScorer;
    this.heartbeatMonitor = heartbeatMonitor;
    this.evolutionManager = evolutionManager;
    this.resourceMonitor = resourceMonitor;
    
    this.statusSurface = new AgentStatusSurface();
    this.snapshotEmitter = new SnapshotEmitter();
    this.trustTimeline = new TrustTimeline();
    
    this.metrics = this.initializeMetrics();
    this.setupEventListeners();
  }

  private initializeMetrics(): SystemIntelMetrics {
    return {
      timestamp: new Date().toISOString(),
      agents: {},
      recentViolations: [],
      trustTimeline: [],
      systemHealth: 'stable'
    };
  }

  private setupEventListeners(): void {
    // Trust score events
    this.eventBus.on('trust:signal', this.handleTrustSignal.bind(this));
    this.eventBus.on('trust:warning', this.handleTrustWarning.bind(this));
    this.eventBus.on('trust:violation', this.handleTrustViolation.bind(this));

    // Heartbeat events
    this.eventBus.on('heartbeat:ping', this.handleHeartbeatPing.bind(this));
    this.eventBus.on('heartbeat:warning', this.handleHeartbeatWarning.bind(this));
    this.eventBus.on('heartbeat:critical', this.handleHeartbeatCritical.bind(this));

    // Evolution events
    this.eventBus.on('evolution:triggered', this.handleEvolutionTrigger.bind(this));
    this.eventBus.on('evolution:completed', this.handleEvolutionComplete.bind(this));

    // Resource events
    this.eventBus.on('resource:warning', this.handleResourceWarning.bind(this));
    this.eventBus.on('resource:critical', this.handleResourceCritical.bind(this));
  }

  private async handleTrustSignal(event: any): Promise<void> {
    const { component, score } = event.data;
    await this.trustTimeline.recordDelta(component, score);
    this.updateAgentMetrics(component, { trustScore: score });
  }

  private async handleTrustWarning(event: any): Promise<void> {
    const { component, score } = event.data;
    this.updateAgentMetrics(component, { 
      status: 'warning',
      trustScore: score 
    });
  }

  private async handleTrustViolation(event: any): Promise<void> {
    const { component, score } = event.data;
    this.metrics.recentViolations.push({
      agentId: component,
      timestamp: new Date().toISOString(),
      violationType: 'trust',
      details: `Trust score ${score} below minimum threshold`
    });
    this.updateAgentMetrics(component, { 
      status: 'critical',
      trustScore: score 
    });
  }

  private async handleHeartbeatPing(event: any): Promise<void> {
    const { agentId, metrics } = event.data;
    this.updateAgentMetrics(agentId, {
      status: 'healthy',
      lastHeartbeat: new Date().toISOString(),
      resourceUsage: metrics.resourceUsage
    });
  }

  private async handleHeartbeatWarning(event: any): Promise<void> {
    const { agentId, metrics } = event.data;
    this.updateAgentMetrics(agentId, {
      status: 'warning',
      lastHeartbeat: new Date().toISOString(),
      resourceUsage: metrics.resourceUsage
    });
  }

  private async handleHeartbeatCritical(event: any): Promise<void> {
    const { agentId, metrics } = event.data;
    this.updateAgentMetrics(agentId, {
      status: 'critical',
      lastHeartbeat: new Date().toISOString(),
      resourceUsage: metrics.resourceUsage
    });
  }

  private async handleEvolutionTrigger(event: any): Promise<void> {
    const { agentId, triggerType } = event.data;
    this.updateAgentMetrics(agentId, {
      lastTrigger: triggerType
    });
  }

  private async handleEvolutionComplete(event: any): Promise<void> {
    const { agentId, success } = event.data;
    if (success) {
      this.updateAgentMetrics(agentId, {
        status: 'recovering'
      });
    }
  }

  private async handleResourceWarning(event: any): Promise<void> {
    const { agentId, metrics } = event.data;
    this.updateAgentMetrics(agentId, {
      status: 'warning',
      resourceUsage: metrics
    });
  }

  private async handleResourceCritical(event: any): Promise<void> {
    const { agentId, metrics } = event.data;
    this.updateAgentMetrics(agentId, {
      status: 'critical',
      resourceUsage: metrics
    });
  }

  private updateAgentMetrics(agentId: string, updates: Partial<AgentMetrics>): void {
    this.metrics.agents[agentId] = {
      ...this.metrics.agents[agentId],
      ...updates
    };
    this.updateSystemHealth();
  }

  private updateSystemHealth(): void {
    const agentStatuses = Object.values(this.metrics.agents).map(a => a.status);
    const criticalCount = agentStatuses.filter(s => s === 'critical').length;
    const warningCount = agentStatuses.filter(s => s === 'warning').length;

    if (criticalCount > 0) {
      this.metrics.systemHealth = 'critical';
    } else if (warningCount > 0) {
      this.metrics.systemHealth = 'degraded';
    } else {
      this.metrics.systemHealth = 'stable';
    }
  }

  public async generateSnapshot(): Promise<void> {
    this.metrics.timestamp = new Date().toISOString();
    this.metrics.trustTimeline = await this.trustTimeline.getRecentDeltas();
    await this.snapshotEmitter.emitSnapshot(this.metrics);
  }

  public getCurrentMetrics(): SystemIntelMetrics {
    return { ...this.metrics };
  }

  public getAgentStatus(agentId: string): AgentMetrics | undefined {
    return this.metrics.agents[agentId];
  }

  public getSystemHealth(): SystemHealth {
    return this.metrics.systemHealth;
  }

  public getRecentViolations(): TrustViolation[] {
    return [...this.metrics.recentViolations];
  }

  public getTrustTimeline(): TrustDelta[] {
    return [...this.metrics.trustTimeline];
  }
} 