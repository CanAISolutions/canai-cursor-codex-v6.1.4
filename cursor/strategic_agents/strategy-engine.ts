/**
 * strategic_agents/strategy-engine.ts
 * 
 * Purpose:
 * Routes system context to appropriate strategic agents and manages strategy execution.
 * Coordinates agent activation and handles strategy results.
 */

import { EventBus } from '../utils/event-bus';
import { AgentMemory } from '../agent-oversight/agent-memory';
import { TrustScorer } from '../agents/trust-scorer/trust-scorer';
import { AgentMap } from './agent-map';
import { StrategyContext, StrategyResult } from './strategic-agent-base';

export class StrategyEngine {
  private readonly contextUpdateInterval = 60000; // 1 minute
  private currentContext: StrategyContext | null = null;
  private isProcessing = false;

  constructor(
    private readonly eventBus: EventBus,
    private readonly agentMemory: AgentMemory,
    private readonly trustScorer: TrustScorer,
    private readonly agentMap: AgentMap
  ) {
    this.setupEventListeners();
    this.startContextUpdates();
  }

  private setupEventListeners(): void {
    // Trust events
    this.eventBus.on('trust:signal', this.handleTrustSignal.bind(this));
    this.eventBus.on('trust:warning', this.handleTrustWarning.bind(this));
    this.eventBus.on('trust:violation', this.handleTrustViolation.bind(this));

    // Recovery events
    this.eventBus.on('recovery:attempted', this.handleRecoveryAttempt.bind(this));
    this.eventBus.on('recovery:succeeded', this.handleRecoverySuccess.bind(this));
    this.eventBus.on('recovery:failed', this.handleRecoveryFailure.bind(this));

    // Evolution events
    this.eventBus.on('evolution:triggered', this.handleEvolutionTrigger.bind(this));
    this.eventBus.on('evolution:completed', this.handleEvolutionComplete.bind(this));
  }

  private startContextUpdates(): void {
    setInterval(async () => {
      await this.updateContext();
    }, this.contextUpdateInterval);
  }

  private async updateContext(): Promise<void> {
    const systemMetrics = await this.getSystemMetrics();
    const agentMetrics = await this.getAgentMetrics();
    const resourceMetrics = await this.getResourceMetrics();

    this.currentContext = {
      systemMetrics,
      agentMetrics,
      resourceMetrics
    };

    this.eventBus.emit('strategy:context-updated', {
      timestamp: new Date().toISOString(),
      metrics: this.currentContext
    });
  }

  private async getSystemMetrics(): Promise<StrategyContext['systemMetrics']> {
    const records = await this.agentMemory.getAllRecords();
    const totalAgents = Object.keys(records).length;

    return {
      trustScore: this.calculateAverageTrust(records),
      trustVolatility: this.calculateTrustVolatility(records),
      recoveryAttempts: this.calculateTotalRecoveryAttempts(records),
      evolutionTriggers: this.calculateTotalEvolutionTriggers(records),
      stagnationFlags: this.calculateStagnationFlags(records)
    };
  }

  private async getAgentMetrics(): Promise<StrategyContext['agentMetrics']> {
    const records = await this.agentMemory.getAllRecords();
    const metrics: StrategyContext['agentMetrics'] = {};

    for (const [agentId, record] of Object.entries(records)) {
      metrics[agentId] = {
        trustScore: record.avgTrustDelta,
        recoveryAttempts: record.recoveryAttempts,
        patternSubstitutions: record.patternSubstitutions
      };
    }

    return metrics;
  }

  private async getResourceMetrics(): Promise<StrategyContext['resourceMetrics']> {
    // This would typically come from a resource monitor
    return {
      cpuUsage: 0.5,
      memoryUsage: 0.6,
      activeAgents: Object.keys(await this.agentMemory.getAllRecords()).length
    };
  }

  private calculateAverageTrust(records: Record<string, any>): number {
    const scores = Object.values(records).map(r => r.avgTrustDelta);
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  private calculateTrustVolatility(records: Record<string, any>): number {
    const volatilities = Object.values(records).map(r => r.trustVolatility);
    return volatilities.reduce((sum, vol) => sum + vol, 0) / volatilities.length;
  }

  private calculateTotalRecoveryAttempts(records: Record<string, any>): number {
    return Object.values(records).reduce((sum, r) => sum + r.recoveryAttempts, 0);
  }

  private calculateTotalEvolutionTriggers(records: Record<string, any>): number {
    return Object.values(records).reduce((sum, r) => 
      sum + (r.recentTriggers?.filter((t: any) => t.type.startsWith('evolution:')).length || 0), 0
    );
  }

  private calculateStagnationFlags(records: Record<string, any>): number {
    return Object.values(records).filter(r => r.stagnantSince).length;
  }

  public async processContext(): Promise<void> {
    if (!this.currentContext || this.isProcessing) return;

    this.isProcessing = true;
    try {
      const availableAgents = this.agentMap.getAvailableAgents(this.currentContext);
      
      for (const agent of availableAgents) {
        const type = agent.constructor.name.toLowerCase();
        this.agentMap.recordExecution(type);

        try {
          const result = await agent.executeStrategy(this.currentContext);
          await this.handleStrategyResult(type, result);
        } catch (error: unknown) {
          this.eventBus.emit('strategy:error', {
            agentId: type,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        } finally {
          this.agentMap.recordCompletion(type);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private async handleStrategyResult(type: string, result: StrategyResult): Promise<void> {
    if (!result.success) {
      this.eventBus.emit('strategy:failed', {
        agentId: type,
        result
      });
      return;
    }

    // Execute strategy actions
    for (const action of result.actions) {
      this.eventBus.emit(`strategy:action:${action.type}`, {
        agentId: type,
        action
      });
    }

    // Record metrics
    this.eventBus.emit('strategy:completed', {
      agentId: type,
      result
    });
  }

  private async handleTrustSignal(event: any): Promise<void> {
    await this.updateContext();
    await this.processContext();
  }

  private async handleTrustWarning(event: any): Promise<void> {
    await this.updateContext();
    await this.processContext();
  }

  private async handleTrustViolation(event: any): Promise<void> {
    await this.updateContext();
    await this.processContext();
  }

  private async handleRecoveryAttempt(event: any): Promise<void> {
    await this.updateContext();
    await this.processContext();
  }

  private async handleRecoverySuccess(event: any): Promise<void> {
    await this.updateContext();
    await this.processContext();
  }

  private async handleRecoveryFailure(event: any): Promise<void> {
    await this.updateContext();
    await this.processContext();
  }

  private async handleEvolutionTrigger(event: any): Promise<void> {
    await this.updateContext();
    await this.processContext();
  }

  private async handleEvolutionComplete(event: any): Promise<void> {
    await this.updateContext();
    await this.processContext();
  }
} 