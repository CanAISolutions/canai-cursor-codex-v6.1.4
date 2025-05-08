import { EventBus } from '../../utils/event-bus';
import { AgentMemory } from '../../agent-oversight/agent-memory';
import { TrustScorer } from '../../agents/trust-scorer/trust-scorer';
import { StrategicAgent, StrategyContext, StrategyResult } from '../strategic-agent-base';

/**
 * RecoveryOptimizerAgent is responsible for adjusting recovery loops and fatigue thresholds
 * based on system performance and recovery attempt patterns.
 */
export class RecoveryOptimizerAgent extends StrategicAgent {
  protected readonly RECOVERY_ATTEMPT_THRESHOLD = 3;
  private readonly PATTERN_SUBSTITUTION_THRESHOLD = 2;
  private readonly TRUST_VOLATILITY_THRESHOLD = 0.15;

  constructor(
    eventBus: EventBus,
    agentMemory: AgentMemory,
    trustScorer: TrustScorer
  ) {
    super(eventBus, agentMemory, trustScorer);
  }

  /**
   * Determines if the agent should activate based on current system context
   * @param context Current system context including recovery metrics
   * @returns boolean indicating if agent should activate
   */
  public shouldActivate(context: StrategyContext): boolean {
    const { systemMetrics } = context;
    return (
      systemMetrics.recoveryAttempts > this.RECOVERY_ATTEMPT_THRESHOLD ||
      this.hasExcessivePatternSubstitutions(context) ||
      systemMetrics.trustVolatility > this.TRUST_VOLATILITY_THRESHOLD
    );
  }

  /**
   * Executes the recovery optimization strategy
   * @param context Current system context
   * @returns Promise resolving to strategy execution results
   */
  public async executeStrategy(context: StrategyContext): Promise<StrategyResult> {
    const startTime = Date.now();
    const actions = [];

    try {
      // Analyze recovery patterns
      const patterns = this.analyzeRecoveryPatterns(context);
      
      // Calculate optimal thresholds
      const thresholds = this.calculateOptimalThresholds(context, patterns);
      
      // Execute optimization action
      const action = {
        type: 'recovery_optimization',
        target: 'system',
        parameters: {
          thresholdAdjustment: thresholds,
          cooldownPeriod: this.calculateCooldownPeriod(context),
          maxAttempts: this.calculateMaxAttempts(context)
        }
      };
      actions.push(action);

      // Emit optimization event
      this.eventBus.emit('recovery:optimize', {
        thresholds,
        timestamp: Date.now()
      });

      // Calculate execution metrics
      const executionTime = Date.now() - startTime;
      const trustImpact = this.calculateTrustImpact(context, thresholds);
      const resourceImpact = this.calculateResourceImpact(context);

      return {
        success: true,
        actions,
        metrics: {
          trustImpact,
          resourceImpact,
          executionTime
        }
      };
    } catch (error) {
      this.eventBus.emit('strategy:error', {
        agent: 'RecoveryOptimizerAgent',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      });

      return {
        success: false,
        actions,
        metrics: {
          trustImpact: 0,
          resourceImpact: 0,
          executionTime: Date.now() - startTime
        }
      };
    }
  }

  /**
   * Checks if any agents have excessive pattern substitutions
   * @param context Current system context
   * @returns boolean indicating if pattern substitutions exceed threshold
   */
  private hasExcessivePatternSubstitutions(context: StrategyContext): boolean {
    const { agentMetrics } = context;
    return Object.values(agentMetrics).some(
      metrics => metrics.patternSubstitutions > this.PATTERN_SUBSTITUTION_THRESHOLD
    );
  }

  /**
   * Analyzes recovery patterns across agents
   * @param context Current system context
   * @returns Object containing pattern analysis results
   */
  private analyzeRecoveryPatterns(context: StrategyContext): Record<string, any> {
    const { agentMetrics } = context;
    const patterns = {
      averageAttempts: 0,
      successRate: 0,
      volatility: 0
    };

    const agentCount = Object.keys(agentMetrics).length;
    if (agentCount === 0) return patterns;

    let totalAttempts = 0;
    let totalSuccesses = 0;
    let totalVolatility = 0;

    Object.values(agentMetrics).forEach(metrics => {
      totalAttempts += metrics.recoveryAttempts;
      totalSuccesses += metrics.trustScore > 0.7 ? 1 : 0;
      totalVolatility += context.systemMetrics.trustVolatility;
    });

    patterns.averageAttempts = totalAttempts / agentCount;
    patterns.successRate = totalSuccesses / agentCount;
    patterns.volatility = totalVolatility / agentCount;

    return patterns;
  }

  /**
   * Calculates optimal thresholds based on recovery patterns
   * @param context Current system context
   * @param patterns Analyzed recovery patterns
   * @returns Object containing optimal threshold values
   */
  private calculateOptimalThresholds(
    context: StrategyContext,
    patterns: Record<string, any>
  ): Record<string, number> {
    const baseThresholds = {
      recoveryAttempts: this.RECOVERY_ATTEMPT_THRESHOLD,
      patternSubstitutions: this.PATTERN_SUBSTITUTION_THRESHOLD,
      trustVolatility: this.TRUST_VOLATILITY_THRESHOLD
    };

    // Adjust thresholds based on success rate
    if (patterns.successRate < 0.5) {
      baseThresholds.recoveryAttempts *= 1.5;
      baseThresholds.patternSubstitutions *= 1.2;
    } else if (patterns.successRate > 0.8) {
      baseThresholds.recoveryAttempts *= 0.8;
      baseThresholds.patternSubstitutions *= 0.9;
    }

    // Adjust for volatility
    if (patterns.volatility > 0.2) {
      baseThresholds.trustVolatility *= 1.2;
    }

    return baseThresholds;
  }

  /**
   * Calculates optimal cooldown period based on context
   * @param context Current system context
   * @returns number indicating cooldown period in milliseconds
   */
  private calculateCooldownPeriod(context: StrategyContext): number {
    const { systemMetrics } = context;
    const baseCooldown = 10 * 60 * 1000; // 10 minutes

    if (systemMetrics.recoveryAttempts > 5) {
      return baseCooldown * 1.5;
    } else if (systemMetrics.trustVolatility > 0.2) {
      return baseCooldown * 1.2;
    }

    return baseCooldown;
  }

  /**
   * Calculates maximum allowed recovery attempts
   * @param context Current system context
   * @returns number indicating maximum attempts
   */
  private calculateMaxAttempts(context: StrategyContext): number {
    const { systemMetrics } = context;
    const baseMaxAttempts = 5;

    if (systemMetrics.trustScore < 0.6) {
      return Math.min(baseMaxAttempts * 2, 10);
    } else if (systemMetrics.trustVolatility > 0.2) {
      return Math.min(baseMaxAttempts * 1.5, 8);
    }

    return baseMaxAttempts;
  }

  /**
   * Calculates the expected trust impact of the optimization
   * @param context Current system context
   * @param thresholds New threshold values
   * @returns number indicating expected trust impact
   */
  private calculateTrustImpact(
    context: StrategyContext,
    thresholds: Record<string, number>
  ): number {
    const { systemMetrics } = context;
    const currentVolatility = systemMetrics.trustVolatility;
    const newVolatility = thresholds.trustVolatility;

    return Math.max(0, currentVolatility - newVolatility);
  }

  /**
   * Calculates the resource impact of the optimization
   * @param context Current system context
   * @returns number indicating resource impact
   */
  private calculateResourceImpact(context: StrategyContext): number {
    const { resourceMetrics } = context;
    return (resourceMetrics.cpuUsage + resourceMetrics.memoryUsage) / 2;
  }
} 