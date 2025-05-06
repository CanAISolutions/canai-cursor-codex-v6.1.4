/**
 * heartbeat/heartbeat-monitor.ts
 * 
 * Purpose:
 * Monitors agent responsiveness in real-time and tracks health metrics.
 */

import { EventBus } from '../utils/event-bus';
import { TrustScorer } from '../agents/trust-scorer/trust-scorer';
import { ResourceMonitor } from '../optimization/resource-monitor';

/**
 * Interface for agent health metrics
 */
export interface AgentHealthMetrics {
  agentId: string;
  lastSeen: number;
  responsiveness: number;
  readiness: boolean;
  resourceUsage: {
    cpu: number;
    memory: number;
  };
  trustScore: number;
}

/**
 * Interface for heartbeat events
 */
export interface HeartbeatEvent {
  type: 'ping' | 'warning' | 'recovery';
  agentId: string;
  timestamp: number;
  metrics: Partial<AgentHealthMetrics>;
  message?: string;
}

export class HeartbeatMonitor {
  private readonly agents: Map<string, AgentHealthMetrics> = new Map();
  private readonly PING_INTERVAL = 5000; // 5 seconds
  private readonly RESPONSIVENESS_THRESHOLD = 0.7;
  private readonly WARNING_THRESHOLD = 30000; // 30 seconds
  private readonly CRITICAL_THRESHOLD = 60000; // 60 seconds
  private pingInterval: NodeJS.Timeout | null = null;

  constructor(
    private eventBus: EventBus,
    private trustScorer: TrustScorer,
    private resourceMonitor: ResourceMonitor
  ) {}

  /**
   * Starts monitoring agent heartbeats
   */
  startMonitoring(): void {
    if (this.pingInterval) {
      return;
    }

    this.pingInterval = setInterval(() => {
      this.checkAgentHealth();
    }, this.PING_INTERVAL);
  }

  /**
   * Stops monitoring agent heartbeats
   */
  stopMonitoring(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Registers an agent for heartbeat monitoring
   */
  registerAgent(agentId: string): void {
    this.agents.set(agentId, {
      agentId,
      lastSeen: Date.now(),
      responsiveness: 1.0,
      readiness: true,
      resourceUsage: {
        cpu: 0,
        memory: 0
      },
      trustScore: 1.0
    });
  }

  /**
   * Updates agent heartbeat
   */
  async updateHeartbeat(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not registered for heartbeat monitoring`);
    }

    // Update metrics
    const now = Date.now();
    const timeSinceLastSeen = now - agent.lastSeen;
    const responsiveness = this.calculateResponsiveness(timeSinceLastSeen);
    const resourceUsage = await this.resourceMonitor.getResourceUsage();
    const trustScore = await this.trustScorer.getTrustScore(agentId);

    // Update agent metrics
    this.agents.set(agentId, {
      ...agent,
      lastSeen: now,
      responsiveness,
      resourceUsage,
      trustScore
    });

    // Emit heartbeat event
    this.emitHeartbeatEvent('ping', agentId, {
      lastSeen: now,
      responsiveness,
      resourceUsage,
      trustScore
    });

    // Check for warnings
    this.checkAgentWarnings(agentId);
  }

  /**
   * Checks health of all registered agents
   */
  private async checkAgentHealth(): Promise<void> {
    for (const [agentId, metrics] of this.agents.entries()) {
      const now = Date.now();
      const timeSinceLastSeen = now - metrics.lastSeen;

      // Check for critical timeout
      if (timeSinceLastSeen > this.CRITICAL_THRESHOLD) {
        await this.handleCriticalTimeout(agentId, metrics);
      }
      // Check for warning timeout
      else if (timeSinceLastSeen > this.WARNING_THRESHOLD) {
        await this.handleWarningTimeout(agentId, metrics);
      }
      // Check responsiveness
      else if (metrics.responsiveness < this.RESPONSIVENESS_THRESHOLD) {
        await this.handleLowResponsiveness(agentId, metrics);
      }
    }
  }

  /**
   * Checks for agent warnings
   */
  private async checkAgentWarnings(agentId: string): Promise<void> {
    const metrics = this.agents.get(agentId);
    if (!metrics) return;

    // Check readiness
    if (!metrics.readiness) {
      await this.handleReadinessFailure(agentId, metrics);
    }

    // Check resource usage
    if (metrics.resourceUsage.cpu > 0.9 || metrics.resourceUsage.memory > 0.9) {
      await this.handleHighResourceUsage(agentId, metrics);
    }

    // Check trust score
    if (metrics.trustScore < 0.7) {
      await this.handleLowTrustScore(agentId, metrics);
    }
  }

  /**
   * Handles critical timeout
   */
  private async handleCriticalTimeout(agentId: string, metrics: AgentHealthMetrics): Promise<void> {
    this.emitHeartbeatEvent('warning', agentId, metrics, 'CRITICAL: Agent timeout exceeded');
    
    // Trigger recovery
    await this.triggerRecovery(agentId, 'critical_timeout');
  }

  /**
   * Handles warning timeout
   */
  private async handleWarningTimeout(agentId: string, metrics: AgentHealthMetrics): Promise<void> {
    this.emitHeartbeatEvent('warning', agentId, metrics, 'WARNING: Agent response delayed');
  }

  /**
   * Handles low responsiveness
   */
  private async handleLowResponsiveness(agentId: string, metrics: AgentHealthMetrics): Promise<void> {
    this.emitHeartbeatEvent('warning', agentId, metrics, 'WARNING: Agent responsiveness below threshold');
  }

  /**
   * Handles readiness failure
   */
  private async handleReadinessFailure(agentId: string, metrics: AgentHealthMetrics): Promise<void> {
    this.emitHeartbeatEvent('warning', agentId, metrics, 'WARNING: Agent readiness check failed');
    
    // Trigger recovery
    await this.triggerRecovery(agentId, 'readiness_failure');
  }

  /**
   * Handles high resource usage
   */
  private async handleHighResourceUsage(agentId: string, metrics: AgentHealthMetrics): Promise<void> {
    this.emitHeartbeatEvent('warning', agentId, metrics, 'WARNING: High resource usage detected');
  }

  /**
   * Handles low trust score
   */
  private async handleLowTrustScore(agentId: string, metrics: AgentHealthMetrics): Promise<void> {
    this.emitHeartbeatEvent('warning', agentId, metrics, 'WARNING: Trust score below threshold');
  }

  /**
   * Triggers agent recovery
   */
  private async triggerRecovery(agentId: string, reason: string): Promise<void> {
    // TODO: Implement recovery logic
    console.log(`Triggering recovery for agent ${agentId}: ${reason}`);
  }

  /**
   * Calculates agent responsiveness
   */
  private calculateResponsiveness(timeSinceLastSeen: number): number {
    if (timeSinceLastSeen <= this.PING_INTERVAL) {
      return 1.0;
    }
    return Math.max(0, 1 - (timeSinceLastSeen / this.CRITICAL_THRESHOLD));
  }

  /**
   * Emits heartbeat event
   */
  private emitHeartbeatEvent(
    type: HeartbeatEvent['type'],
    agentId: string,
    metrics: Partial<AgentHealthMetrics>,
    message?: string
  ): void {
    const event: HeartbeatEvent = {
      type,
      agentId,
      timestamp: Date.now(),
      metrics,
      message
    };

    this.eventBus.emit('heartbeat', event);
  }
} 