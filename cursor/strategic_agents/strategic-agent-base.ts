/**
 * strategic_agents/strategic-agent-base.ts
 * 
 * Purpose:
 * Defines the base class and execution contract for all strategic agents.
 * Provides common functionality for agent lifecycle and strategy execution.
 */

import { EventBus } from '../utils/event-bus';
import { AgentMemory } from '../agent-oversight/agent-memory';
import { TrustScorer } from '../agents/trust-scorer/trust-scorer';

/**
 * Interface defining the context for strategy execution
 */
export interface StrategyContext {
  systemMetrics: {
    trustScore: number;
    trustVolatility: number;
    recoveryAttempts: number;
    evolutionTriggers: number;
    stagnationFlags: number;
  };
  agentMetrics: Record<string, {
    trustScore: number;
    recoveryAttempts: number;
    patternSubstitutions: number;
  }>;
  resourceMetrics: {
    cpuUsage: number;
    memoryUsage: number;
    activeAgents: number;
  };
}

/**
 * Interface defining the result of strategy execution
 */
export interface StrategyResult {
  success: boolean;
  actions: Array<{
    type: string;
    target: string;
    parameters: Record<string, any>;
  }>;
  metrics: {
    trustImpact: number;
    resourceImpact: number;
    executionTime: number;
  };
}

/**
 * Base class for strategic agents that defines common functionality
 * and enforces the strategy execution contract.
 */
export abstract class StrategicAgent {
  protected readonly TRUST_THRESHOLD = 0.7;
  protected readonly VOLATILITY_THRESHOLD = 0.2;
  protected readonly RECOVERY_ATTEMPT_THRESHOLD = 3;

  constructor(
    protected readonly eventBus: EventBus,
    protected readonly agentMemory: AgentMemory,
    protected readonly trustScorer: TrustScorer
  ) {}

  /**
   * Determines if the agent should activate based on current system context
   * @param context Current system context
   * @returns boolean indicating if agent should activate
   */
  public abstract shouldActivate(context: StrategyContext): boolean;

  /**
   * Executes the agent's strategy
   * @param context Current system context
   * @returns Promise resolving to strategy execution results
   */
  public abstract executeStrategy(context: StrategyContext): Promise<StrategyResult>;

  /**
   * Validates the result of strategy execution
   * @param result Strategy execution result
   * @returns boolean indicating if result is valid
   */
  protected validateResult(result: StrategyResult): boolean {
    if (!result.success) return false;
    if (!result.actions || result.actions.length === 0) return false;
    if (!result.metrics) return false;
    return true;
  }

  /**
   * Emits an event with the given type and data
   * @param type Event type
   * @param data Event data
   */
  protected emitEvent(type: string, data: any): void {
    this.eventBus.emit(type, {
      ...data,
      timestamp: Date.now()
    });
  }

  /**
   * Records metrics for the agent's execution
   * @param agentId Agent identifier
   * @param metrics Execution metrics
   */
  protected async recordMetrics(agentId: string, metrics: Record<string, number>): Promise<void> {
    await this.agentMemory.updateTrustMetrics(agentId, {
      avgTrustDelta: metrics.trustImpact || 0,
      trustVolatility: metrics.resourceImpact || 0
    });
  }

  /**
   * Checks if there are sufficient resources for strategy execution
   * @param context Current system context
   * @returns boolean indicating if resources are sufficient
   */
  protected hasSufficientResources(context: StrategyContext): boolean {
    const { resourceMetrics } = context;
    return (
      resourceMetrics.cpuUsage < 0.8 &&
      resourceMetrics.memoryUsage < 0.8 &&
      resourceMetrics.activeAgents < 10
    );
  }

  /**
   * Calculates the potential impact of a strategy
   * @param context Current system context
   * @param strategy Strategy to evaluate
   * @returns Object containing impact metrics
   */
  protected calculatePotentialImpact(
    context: StrategyContext,
    strategy: Record<string, any>
  ): Record<string, number> {
    const { systemMetrics } = context;
    const impact = {
      trustImpact: 0,
      resourceImpact: 0
    };

    // Calculate trust impact
    if (strategy.metrics?.targetTrust) {
      impact.trustImpact = Math.max(0, strategy.metrics.targetTrust - systemMetrics.trustScore);
    }

    // Calculate resource impact
    impact.resourceImpact = (context.resourceMetrics.cpuUsage + context.resourceMetrics.memoryUsage) / 2;

    return impact;
  }
} 