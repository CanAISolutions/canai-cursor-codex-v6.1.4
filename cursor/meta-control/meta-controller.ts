/**
 * meta-control/meta-controller.ts
 * 
 * Purpose:
 * Orchestrates strategic agent selection, fallback management, and Codex alignment.
 * Provides centralized control over agent execution and system evolution.
 */

import { EventBus } from '../utils/event-bus';
import { AgentMemory } from '../agent-oversight/agent-memory';
import { TrustScorer } from '../agents/trust-scorer/trust-scorer';
import { StrategyEngine } from '../strategic_agents/strategy-engine';
import { AgentMap } from '../strategic_agents/agent-map';
import { FallbackManager } from './fallback-manager';
import { AgentSelector } from './agent-selector';
import { CodexAligner } from './codex-aligner';

export interface SystemState {
  trustScore: number;
  resourceUtilization: {
    cpuUsage: number;
    memoryUsage: number;
    activeAgents: number;
  };
  evolutionStage: {
    stage: string;
    progress: number;
    stagnationFlags: number;
  };
  recoveryStatus: {
    attempts: number;
    successRate: number;
    lastAttempt: number;
  };
}

export interface AgentState {
  status: 'active' | 'inactive' | 'fallback' | 'recovering';
  metrics: {
    trustScore: number;
    executionCount: number;
    successRate: number;
  };
  lastExecution: {
    timestamp: number;
    result: {
      success: boolean;
      impact: number;
    };
  };
  fallbackCount: number;
}

export interface CodexAlignment {
  alignmentScore: number;
  deviationMetrics: {
    promptDeviation: number;
    responseDeviation: number;
    behaviorDeviation: number;
  };
  correctionHistory: Array<{
    timestamp: number;
    correction: string;
    impact: number;
  }>;
}

export interface MetaControlContext {
  systemState: SystemState;
  agentStates: Record<string, AgentState>;
  codexAlignment: CodexAlignment;
  fallbackHistory: Array<{
    timestamp: number;
    agentId: string;
    reason: string;
    resolution: string;
  }>;
}

export class MetaController {
  private readonly ALIGNMENT_THRESHOLD = 0.8;
  private readonly TRUST_THRESHOLD = 0.7;
  private readonly RESOURCE_THRESHOLD = 0.8;
  private readonly FALLBACK_LIMIT = 3;

  constructor(
    private readonly eventBus: EventBus,
    private readonly agentMemory: AgentMemory,
    private readonly trustScorer: TrustScorer,
    private readonly strategyEngine: StrategyEngine,
    private readonly agentMap: AgentMap,
    private readonly fallbackManager: FallbackManager,
    private readonly agentSelector: AgentSelector,
    private readonly codexAligner: CodexAligner
  ) {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.eventBus.on('strategy:completed', this.handleStrategyComplete.bind(this));
    this.eventBus.on('strategy:failed', this.handleStrategyFailure.bind(this));
    this.eventBus.on('trust:violation', this.handleTrustViolation.bind(this));
    this.eventBus.on('resource:warning', this.handleResourceWarning.bind(this));
  }

  public async processContext(context: MetaControlContext): Promise<void> {
    try {
      // Check system health
      if (!this.isSystemHealthy(context)) {
        await this.handleSystemUnhealthy(context);
        return;
      }

      // Check Codex alignment
      if (!this.isCodexAligned(context)) {
        await this.handleCodexMisalignment(context);
        return;
      }

      // Select and execute appropriate agents
      const selectedAgents = await this.agentSelector.selectAgents(context);
      for (const agent of selectedAgents) {
        if (this.canExecuteAgent(agent, context)) {
          await this.executeAgent(agent, context);
        }
      }
    } catch (error) {
      this.handleError(error, context);
    }
  }

  private isSystemHealthy(context: MetaControlContext): boolean {
    const { systemState } = context;
    return (
      systemState.trustScore >= this.TRUST_THRESHOLD &&
      systemState.resourceUtilization.cpuUsage < this.RESOURCE_THRESHOLD &&
      systemState.resourceUtilization.memoryUsage < this.RESOURCE_THRESHOLD &&
      systemState.recoveryStatus.successRate > 0.5
    );
  }

  private isCodexAligned(context: MetaControlContext): boolean {
    return context.codexAlignment.alignmentScore >= this.ALIGNMENT_THRESHOLD;
  }

  private canExecuteAgent(agentId: string, context: MetaControlContext): boolean {
    const agentState = context.agentStates[agentId];
    return (
      agentState.status === 'active' &&
      agentState.fallbackCount < this.FALLBACK_LIMIT &&
      agentState.metrics.trustScore >= this.TRUST_THRESHOLD
    );
  }

  private async executeAgent(agentId: string, context: MetaControlContext): Promise<void> {
    const agent = this.agentMap.getAgent(agentId);
    if (!agent) return;

    try {
      const result = await agent.executeStrategy(this.convertToStrategyContext(context));
      await this.handleExecutionResult(agentId, result, context);
    } catch (error) {
      await this.handleExecutionError(agentId, error, context);
    }
  }

  private async handleSystemUnhealthy(context: MetaControlContext): Promise<void> {
    const fallbackPlan = await this.fallbackManager.createFallbackPlan(context);
    await this.fallbackManager.executeFallbackPlan(fallbackPlan);
  }

  private async handleCodexMisalignment(context: MetaControlContext): Promise<void> {
    const alignmentPlan = await this.codexAligner.createAlignmentPlan(context);
    await this.codexAligner.executeAlignmentPlan(alignmentPlan);
  }

  private async handleExecutionResult(
    agentId: string,
    result: any,
    context: MetaControlContext
  ): Promise<void> {
    if (result.success) {
      await this.updateAgentState(agentId, {
        status: 'active',
        metrics: {
          ...context.agentStates[agentId].metrics,
          executionCount: context.agentStates[agentId].metrics.executionCount + 1,
          successRate: this.calculateSuccessRate(
            context.agentStates[agentId].metrics.successRate,
            true
          )
        },
        lastExecution: {
          timestamp: Date.now(),
          result: {
            success: true,
            impact: result.metrics.trustImpact
          }
        }
      });
    } else {
      await this.handleExecutionFailure(agentId, result, context);
    }
  }

  private async handleExecutionFailure(
    agentId: string,
    result: any,
    context: MetaControlContext
  ): Promise<void> {
    const fallbackCount = context.agentStates[agentId].fallbackCount + 1;
    if (fallbackCount >= this.FALLBACK_LIMIT) {
      await this.updateAgentState(agentId, {
        status: 'inactive',
        fallbackCount
      });
    } else {
      await this.updateAgentState(agentId, {
        status: 'fallback',
        fallbackCount,
        metrics: {
          ...context.agentStates[agentId].metrics,
          successRate: this.calculateSuccessRate(
            context.agentStates[agentId].metrics.successRate,
            false
          )
        }
      });
    }
  }

  private async handleExecutionError(
    agentId: string,
    error: any,
    context: MetaControlContext
  ): Promise<void> {
    this.eventBus.emit('meta:error', {
      agentId,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    });

    await this.updateAgentState(agentId, {
      status: 'recovering',
      metrics: {
        ...context.agentStates[agentId].metrics,
        successRate: this.calculateSuccessRate(
          context.agentStates[agentId].metrics.successRate,
          false
        )
      }
    });
  }

  private calculateSuccessRate(currentRate: number, success: boolean): number {
    const alpha = 0.1; // Smoothing factor
    return currentRate * (1 - alpha) + (success ? 1 : 0) * alpha;
  }

  private async updateAgentState(agentId: string, updates: Partial<AgentState>): Promise<void> {
    await this.agentMemory.updateAgentRecord(agentId, updates);
  }

  private convertToStrategyContext(context: MetaControlContext): any {
    return {
      systemMetrics: {
        trustScore: context.systemState.trustScore,
        trustVolatility: context.codexAlignment.deviationMetrics.behaviorDeviation,
        recoveryAttempts: context.systemState.recoveryStatus.attempts,
        evolutionTriggers: context.systemState.evolutionStage.progress,
        stagnationFlags: context.systemState.evolutionStage.stagnationFlags
      },
      agentMetrics: Object.entries(context.agentStates).reduce((acc, [id, state]) => ({
        ...acc,
        [id]: {
          trustScore: state.metrics.trustScore,
          recoveryAttempts: state.fallbackCount,
          patternSubstitutions: 0 // TODO: Implement pattern tracking
        }
      }), {}),
      resourceMetrics: context.systemState.resourceUtilization
    };
  }

  private async handleStrategyComplete(event: any): Promise<void> {
    // Implementation for strategy completion handling
  }

  private async handleStrategyFailure(event: any): Promise<void> {
    // Implementation for strategy failure handling
  }

  private async handleTrustViolation(event: any): Promise<void> {
    // Implementation for trust violation handling
  }

  private async handleResourceWarning(event: any): Promise<void> {
    // Implementation for resource warning handling
  }

  private async handleError(error: any, context: MetaControlContext): Promise<void> {
    this.eventBus.emit('meta:error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      context,
      timestamp: Date.now()
    });
  }
} 