import { EventBus } from '../../utils/event-bus';
import { AgentMemory } from '../../agent-oversight/agent-memory';
import { TrustScorer } from '../../agents/trust-scorer/trust-scorer';
import { StrategicAgent, StrategyContext, StrategyResult } from '../strategic-agent-base';

/**
 * Agent responsible for selecting alternate strategies when stagnation is detected
 */
export class EvolutionPathfinderAgent extends StrategicAgent {
  constructor(
    eventBus: EventBus,
    agentMemory: AgentMemory,
    trustScorer: TrustScorer
  ) {
    super(eventBus, agentMemory, trustScorer);
  }

  /**
   * Determines if the agent should activate based on evolution metrics
   * @param context Current system context
   * @returns boolean indicating if agent should activate
   */
  public shouldActivate(context: StrategyContext): boolean {
    const { systemMetrics } = context;
    return (
      systemMetrics.stagnationFlags >= 1 ||
      systemMetrics.evolutionTriggers >= 2 ||
      systemMetrics.trustScore < this.TRUST_THRESHOLD
    );
  }

  /**
   * Executes the evolution pathfinding strategy
   * @param context Current system context
   * @returns Promise resolving to strategy execution results
   */
  public async executeStrategy(context: StrategyContext): Promise<StrategyResult> {
    try {
      // Analyze current evolution state
      const evolutionState = this.analyzeEvolutionState(context);
      
      // Identify potential evolution paths
      const paths = this.identifyEvolutionPaths(context, evolutionState);
      
      // Select optimal path
      const optimalPath = this.selectOptimalPath(paths);
      
      // Execute evolution actions
      const actions = [{
        type: 'evolution_path',
        target: 'system',
        parameters: {
          path: optimalPath,
          priority: this.calculatePriority(context, optimalPath)
        }
      }];

      // Calculate impacts
      const trustImpact = this.calculateTrustImpact(context, actions);
      const resourceImpact = this.calculateResourceImpact(context, actions);

      // Record metrics
      await this.recordMetrics('evolution_pathfinder', {
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
        agent: 'evolution_pathfinder',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  /**
   * Analyzes the current evolution state
   * @param context Current system context
   * @returns Object containing evolution state analysis
   */
  private analyzeEvolutionState(context: StrategyContext): Record<string, any> {
    return {
      stagnationLevel: context.systemMetrics.stagnationFlags,
      evolutionPressure: context.systemMetrics.evolutionTriggers,
      trustHealth: context.systemMetrics.trustScore,
      resourceAvailability: 1 - (context.resourceMetrics.cpuUsage + context.resourceMetrics.memoryUsage) / 2
    };
  }

  /**
   * Identifies potential evolution paths
   * @param context Current system context
   * @param state Evolution state
   * @returns Array of potential evolution paths
   */
  private identifyEvolutionPaths(
    context: StrategyContext,
    state: Record<string, any>
  ): Array<Record<string, any>> {
    const paths = [];

    // Trust-focused path
    if (state.trustHealth < this.TRUST_THRESHOLD) {
      paths.push({
        type: 'trust_optimization',
        priority: 0.8,
        expectedImpact: 0.2
      });
    }

    // Resource optimization path
    if (state.resourceAvailability < 0.3) {
      paths.push({
        type: 'resource_optimization',
        priority: 0.7,
        expectedImpact: 0.15
      });
    }

    // Evolution acceleration path
    if (state.stagnationLevel > 0) {
      paths.push({
        type: 'evolution_acceleration',
        priority: 0.9,
        expectedImpact: 0.25
      });
    }

    return paths;
  }

  /**
   * Selects the optimal evolution path
   * @param paths Array of potential evolution paths
   * @returns Selected evolution path
   */
  private selectOptimalPath(paths: Array<Record<string, any>>): Record<string, any> {
    if (paths.length === 0) {
      return {
        type: 'maintenance',
        priority: 0.5,
        expectedImpact: 0.1
      };
    }

    return paths.reduce((best, current) => 
      current.priority > best.priority ? current : best
    );
  }

  /**
   * Calculates priority for evolution path
   * @param context Current system context
   * @param path Evolution path
   * @returns number indicating priority
   */
  private calculatePriority(context: StrategyContext, path: Record<string, any>): number {
    return (
      path.priority * 0.6 +
      (1 - context.systemMetrics.trustScore) * 0.4
    );
  }

  /**
   * Calculates trust impact of evolution actions
   * @param context Current system context
   * @param actions Evolution actions
   * @returns number indicating trust impact
   */
  private calculateTrustImpact(context: StrategyContext, actions: any[]): number {
    const currentTrust = context.systemMetrics.trustScore;
    const targetTrust = Math.min(1, currentTrust + 0.25);
    return targetTrust - currentTrust;
  }

  /**
   * Calculates resource impact of evolution actions
   * @param context Current system context
   * @param actions Evolution actions
   * @returns number indicating resource impact
   */
  private calculateResourceImpact(context: StrategyContext, actions: any[]): number {
    return (context.resourceMetrics.cpuUsage + context.resourceMetrics.memoryUsage) / 2;
  }
} 