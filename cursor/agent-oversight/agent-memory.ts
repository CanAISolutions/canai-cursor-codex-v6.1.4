/**
 * agent-oversight/agent-memory.ts
 * 
 * Purpose:
 * Manages agent records and their lifecycle within the system.
 */

import { EventBus } from '../utils/event-bus';
import * as fs from 'fs';
import * as path from 'path';

interface AgentOversightRecord {
  agentName: string;
  trustScore: number;
  trustHistory: number[];
  failureRate: number;
  lastUsed: number;
  status: 'active' | 'inactive' | 'degraded';
  metadata: Record<string, any>;
  avgTrustDelta: number;
  trustVolatility: number;
  sessionsTracked: number;
  recoveryAttempts: number;
  recentTriggers: string[];
}

export class AgentMemory {
  private readonly memoryDir: string;
  private readonly maxHistorySize: number;
  private memoryCache: Map<string, AgentOversightRecord>;
  private readonly eventBus: EventBus;
  private readonly maxTrustHistory: number;

  constructor(
    eventBus: EventBus,
    memoryDir: string = 'logs/agent-memory',
    maxHistorySize: number = 1000,
    maxTrustHistory: number = 100
  ) {
    this.memoryDir = memoryDir;
    this.maxHistorySize = maxHistorySize;
    this.memoryCache = new Map();
    this.eventBus = eventBus;
    this.maxTrustHistory = maxTrustHistory;
    this.ensureMemoryDir();
  }

  private ensureMemoryDir(): void {
    if (!fs.existsSync(this.memoryDir)) {
      fs.mkdirSync(this.memoryDir, { recursive: true });
    }
  }

  private getRecordPath(agentId: string): string {
    return path.join(this.memoryDir, `${agentId}.json`);
  }

  private async saveRecord(agentId: string, record: AgentOversightRecord): Promise<void> {
    const filePath = this.getRecordPath(agentId);
    await fs.promises.writeFile(filePath, JSON.stringify(record, null, 2));
  }

  private async deleteRecord(agentId: string): Promise<void> {
    const filePath = this.getRecordPath(agentId);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }

  private createNewRecord(agentId: string): AgentOversightRecord {
    return {
      agentName: agentId,
      trustScore: 0,
      trustHistory: [],
      failureRate: 0,
      lastUsed: Date.now(),
      status: 'active',
      metadata: {},
      avgTrustDelta: 0,
      trustVolatility: 0,
      sessionsTracked: 0,
      recoveryAttempts: 0,
      recentTriggers: []
    };
  }

  public async updateAgentRecord(agentId: string, updates: Partial<AgentOversightRecord>): Promise<void> {
    const record = this.memoryCache.get(agentId) || this.createNewRecord(agentId);
    if (!record) {
      throw new Error(`Agent ${agentId} not found`);
    }

    const updatedRecord = { ...record, ...updates };

    // Update trust history if trust score changed
    if (updates.trustScore !== undefined && updates.trustScore !== record.trustScore) {
      updatedRecord.trustHistory = [...record.trustHistory, updates.trustScore];
      if (updatedRecord.trustHistory.length > this.maxTrustHistory) {
        updatedRecord.trustHistory.shift();
      }
    }

    this.memoryCache.set(agentId, updatedRecord);
    await this.saveRecord(agentId, updatedRecord);

    // Emit event for observability
    await this.eventBus.emit('agent:record:updated', {
      agentId,
      updates,
      timestamp: Date.now(),
      previousState: record,
      newState: updatedRecord
    });

    // Track metrics for the update
    await this.eventBus.emit('metric:recorded', {
      metric: 'agent:record:update',
      value: 1,
      context: {
        agentId,
        updateTypes: Object.keys(updates),
        source: 'agent-memory'
      }
    });
  }

  public async getAgent(agentId: string): Promise<AgentOversightRecord | undefined> {
    return this.memoryCache.get(agentId);
  }

  public async getAllAgents(): Promise<AgentOversightRecord[]> {
    return Array.from(this.memoryCache.values());
  }

  public async addAgent(agent: AgentOversightRecord): Promise<void> {
    if (this.memoryCache.has(agent.agentName)) {
      throw new Error(`Agent ${agent.agentName} already exists`);
    }

    this.memoryCache.set(agent.agentName, agent);
    await this.saveRecord(agent.agentName, agent);

    await this.eventBus.emit('agent:added', {
      agentId: agent.agentName,
      timestamp: Date.now()
    });
  }

  public async removeAgent(agentId: string): Promise<void> {
    if (!this.memoryCache.has(agentId)) {
      throw new Error(`Agent ${agentId} not found`);
    }

    this.memoryCache.delete(agentId);
    await this.deleteRecord(agentId);

    await this.eventBus.emit('agent:removed', {
      agentId,
      timestamp: Date.now()
    });
  }

  public async getActiveAgents(): Promise<AgentOversightRecord[]> {
    return Array.from(this.memoryCache.values()).filter(agent => agent.status === 'active');
  }

  public async getDegradedAgents(): Promise<AgentOversightRecord[]> {
    return Array.from(this.memoryCache.values()).filter(agent => agent.status === 'degraded');
  }

  public async getAgentTrustScore(agentId: string): Promise<number> {
    const agent = this.memoryCache.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }
    return agent.trustScore;
  }

  public async getAgentFailureRate(agentId: string): Promise<number> {
    const agent = this.memoryCache.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }
    return agent.failureRate;
  }

  public async getAgentTrustHistory(agentId: string): Promise<number[]> {
    const agent = this.memoryCache.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }
    return [...agent.trustHistory];
  }
} 