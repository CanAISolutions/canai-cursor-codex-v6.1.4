/**
 * system-intel/agent-status-surface.ts
 * 
 * Purpose:
 * Produces current health, trust, and resource metrics per agent.
 * Provides a unified view of agent status for monitoring and reporting.
 */

import { AgentMetrics, ResourceMetrics } from './intel-aggregator';
import { TrustScorer } from '../agents/trust-scorer/trust-scorer';
import { HeartbeatMonitor } from '../heartbeat/heartbeat-monitor';
import { ResourceMonitor } from '../optimization/resource-monitor';

export class AgentStatusSurface {
  private trustScorer?: TrustScorer;
  private heartbeatMonitor?: HeartbeatMonitor;
  private resourceMonitor?: ResourceMonitor;
  private agentMetrics: Map<string, AgentMetrics>;
  private lastResponseTimes: Map<string, number>;

  constructor(
    trustScorer?: TrustScorer,
    heartbeatMonitor?: HeartbeatMonitor,
    resourceMonitor?: ResourceMonitor
  ) {
    this.trustScorer = trustScorer;
    this.heartbeatMonitor = heartbeatMonitor;
    this.resourceMonitor = resourceMonitor;
    this.agentMetrics = new Map();
    this.lastResponseTimes = new Map();
  }

  public async getAgentStatus(agentId: string): Promise<AgentMetrics> {
    const currentMetrics = await this.gatherAgentMetrics(agentId);
    this.agentMetrics.set(agentId, currentMetrics);
    return currentMetrics;
  }

  public async getAllAgentStatuses(): Promise<Map<string, AgentMetrics>> {
    const agentIds = await this.getActiveAgentIds();
    await Promise.all(
      agentIds.map(async (agentId) => {
        const metrics = await this.getAgentStatus(agentId);
        this.agentMetrics.set(agentId, metrics);
      })
    );
    return this.agentMetrics;
  }

  private async gatherAgentMetrics(agentId: string): Promise<AgentMetrics> {
    const [trustScore, heartbeat, resources] = await Promise.all([
      this.getTrustScore(agentId),
      this.getHeartbeatStatus(agentId),
      this.getResourceMetrics(agentId)
    ]);

    return {
      status: this.determineAgentStatus(heartbeat, trustScore, resources),
      trustScore,
      lastHeartbeat: heartbeat.lastSeen,
      resourceUsage: resources
    };
  }

  private async getTrustScore(agentId: string): Promise<number> {
    if (this.trustScorer) {
      return this.trustScorer.getTrustScore(agentId);
    }
    return 1.0; // Default to maximum trust if no scorer available
  }

  private async getHeartbeatStatus(agentId: string): Promise<{ lastSeen: string; isActive: boolean }> {
    if (this.heartbeatMonitor) {
      const metrics = this.heartbeatMonitor['agents'].get(agentId);
      if (metrics) {
        return {
          lastSeen: new Date(metrics.lastSeen).toISOString(),
          isActive: metrics.readiness
        };
      }
    }
    return {
      lastSeen: new Date().toISOString(),
      isActive: true
    };
  }

  private async getResourceMetrics(agentId: string): Promise<ResourceMetrics> {
    if (this.resourceMonitor) {
      const usage = await this.resourceMonitor.getResourceUsage();
      const now = Date.now();
      const lastResponseTime = this.lastResponseTimes.get(agentId) || now;
      const responseTime = now - lastResponseTime;
      this.lastResponseTimes.set(agentId, now);

      return {
        cpu: usage.cpu,
        memory: usage.memory,
        responseTime
      };
    }
    return {
      cpu: 0,
      memory: 0,
      responseTime: 0
    };
  }

  private determineAgentStatus(
    heartbeat: { lastSeen: string; isActive: boolean },
    trustScore: number,
    resources: ResourceMetrics
  ): AgentMetrics['status'] {
    if (!heartbeat.isActive) {
      return 'critical';
    }

    if (trustScore < 0.6) {
      return 'critical';
    }

    if (trustScore < 0.8 || resources.cpu > 0.9 || resources.memory > 0.9) {
      return 'warning';
    }

    return 'healthy';
  }

  private async getActiveAgentIds(): Promise<string[]> {
    if (this.heartbeatMonitor) {
      const agents = Array.from(this.heartbeatMonitor['agents'].keys());
      return agents;
    }
    return Array.from(this.agentMetrics.keys());
  }

  public getCachedMetrics(agentId: string): AgentMetrics | undefined {
    return this.agentMetrics.get(agentId);
  }

  public clearCache(): void {
    this.agentMetrics.clear();
    this.lastResponseTimes.clear();
  }
} 