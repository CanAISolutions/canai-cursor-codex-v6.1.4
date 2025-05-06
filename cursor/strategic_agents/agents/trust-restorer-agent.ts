import { EventBus } from '../../utils/event-bus';
import { AgentMemory } from '../../agent-oversight/agent-memory';
import { TrustScorer } from '../../agents/trust-scorer/trust-scorer';
import { StrategicAgent, StrategyContext, StrategyResult } from '../strategic-agent-base';

/**
 * TrustRestorerAgent is responsible for restoring system trust when it drops below acceptable thresholds.
 * It monitors trust scores, volatility, and recovery attempts to determine when intervention is needed.
 */
export class TrustRestorerAgent extends StrategicAgent {
  constructor(
    eventBus: EventBus,
    agentMemory: AgentMemory,
    trustScorer: TrustScorer
  ) {
    super(eventBus, agentMemory, trustScorer);
  }

  /**
   * Determines if the agent should activate based on trust metrics
   * @param context Current system context
   * @returns boolean indicating if agent should activate
   */
  public shouldActivate(context: StrategyContext): boolean {
    const { systemMetrics } = context;
    return (
      systemMetrics.trustScore < this.TRUST_THRESHOLD ||
      systemMetrics.trustVolatility > this.VOLATILITY_THRESHOLD ||
      systemMetrics.recoveryAttempts >= this.RECOVERY_ATTEMPT_THRESHOLD
    );
  }

  /**
   * Executes the trust restoration strategy
   * @param context Current system context
   * @returns Promise resolving to strategy execution results
   */
  public async executeStrategy(context: StrategyContext): Promise<StrategyResult> {
    try {
      // Identify target agents for trust restoration
      const targetAgents = this.identifyTargetAgents(context);
      
      // Determine restoration method based on context
      const restorationMethod = this.determineRestorationMethod(context);
      
      // Execute restoration actions
      const actions = targetAgents.map(agentId => ({
        type: 'trust_restoration',
        target: agentId,
        parameters: {
          method: restorationMethod,
          priority: this.calculatePriority(context, agentId)
        }
      }));

      // Calculate impacts
      const trustImpact = this.calculateTrustImpact(context, actions);
      const resourceImpact = this.calculateResourceImpact(context, actions);

      // Record metrics
      await this.recordMetrics('trust_restorer', {
        trustImpact,
        resourceImpact
      });

      return {
        success: true,
        actions,
        metrics: {
          trustImpact,
          resourceImpact,
          executionTime: Date.now()
        }
      };
    } catch (error) {
      this.emitEvent('strategy_error', {
        agent: 'trust_restorer',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Identifies agents that need trust restoration
   * @param context Current system context
   * @returns Array of agent IDs requiring restoration
   */
  private identifyTargetAgents(context: StrategyContext): string[] {
    return Object.entries(context.agentMetrics)
      .filter(([_, metrics]) => metrics.trustScore < this.TRUST_THRESHOLD)
      .map(([agentId]) => agentId);
  }

  /**
   * Determines the appropriate restoration method based on context
   * @param context Current system context
   * @returns string indicating restoration method
   */
  private determineRestorationMethod(context: StrategyContext): string {
    if (context.systemMetrics.trustVolatility > this.VOLATILITY_THRESHOLD) {
      return 'stabilization';
    }
    if (context.systemMetrics.recoveryAttempts >= this.RECOVERY_ATTEMPT_THRESHOLD) {
      return 'reset';
    }
    return 'incremental';
  }

  /**
   * Calculates priority for trust restoration
   * @param context Current system context
   * @param agentId Target agent ID
   * @returns number indicating priority
   */
  private calculatePriority(context: StrategyContext, agentId: string): number {
    const agentMetrics = context.agentMetrics[agentId];
    return (
      (1 - agentMetrics.trustScore) * 0.6 +
      (agentMetrics.recoveryAttempts / this.RECOVERY_ATTEMPT_THRESHOLD) * 0.4
    );
  }

  /**
   * Calculates trust impact of restoration actions
   * @param context Current system context
   * @param actions Restoration actions
   * @returns number indicating trust impact
   */
  private calculateTrustImpact(context: StrategyContext, actions: any[]): number {
    const currentTrust = context.systemMetrics.trustScore;
    const targetTrust = Math.min(1, currentTrust + 0.2);
    return targetTrust - currentTrust;
  }

  /**
   * Calculates resource impact of restoration actions
   * @param context Current system context
   * @param actions Restoration actions
   * @returns number indicating resource impact
   */
  private calculateResourceImpact(context: StrategyContext, actions: any[]): number {
    return (context.resourceMetrics.cpuUsage + context.resourceMetrics.memoryUsage) / 2;
  }
} 