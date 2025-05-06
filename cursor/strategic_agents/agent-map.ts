/**
 * strategic_agents/agent-map.ts
 * 
 * Purpose:
 * Defines the mapping of available strategic agents and their activation conditions.
 * Provides a registry for agent types and their configuration.
 */

import { EventBus } from '../utils/event-bus';
import { AgentMemory } from '../agent-oversight/agent-memory';
import { TrustScorer } from '../agents/trust-scorer/trust-scorer';
import { StrategicAgent, StrategyContext } from './strategic-agent-base';
import { TrustRestorerAgent } from './agents/trust-restorer-agent';
import { RecoveryOptimizerAgent } from './agents/recovery-optimizer-agent';
import { EvolutionPathfinderAgent } from './agents/evolution-pathfinder-agent';

export interface AgentConfig {
  type: string;
  priority: number;
  activationThreshold: number;
  cooldownPeriod: number;
  maxConcurrentExecutions: number;
}

export const AGENT_CONFIGS: Record<string, AgentConfig> = {
  trustRestorer: {
    type: 'trustRestorer',
    priority: 1,
    activationThreshold: 0.6,
    cooldownPeriod: 300000, // 5 minutes
    maxConcurrentExecutions: 1
  },
  recoveryOptimizer: {
    type: 'recoveryOptimizer',
    priority: 2,
    activationThreshold: 0.7,
    cooldownPeriod: 600000, // 10 minutes
    maxConcurrentExecutions: 2
  },
  evolutionPathfinder: {
    type: 'evolutionPathfinder',
    priority: 3,
    activationThreshold: 0.8,
    cooldownPeriod: 900000, // 15 minutes
    maxConcurrentExecutions: 1
  }
};

export class AgentMap {
  private agents: Map<string, StrategicAgent> = new Map();
  private lastExecution: Map<string, number> = new Map();
  private activeExecutions: Map<string, number> = new Map();

  constructor(
    private readonly eventBus: EventBus,
    private readonly agentMemory: AgentMemory,
    private readonly trustScorer: TrustScorer
  ) {
    this.initializeAgents();
  }

  private initializeAgents(): void {
    // Initialize TrustRestorerAgent
    this.agents.set('trustRestorer', new TrustRestorerAgent(
      this.eventBus,
      this.agentMemory,
      this.trustScorer,
      'trust-restorer'
    ));

    // Initialize RecoveryOptimizerAgent
    this.agents.set('recoveryOptimizer', new RecoveryOptimizerAgent(
      this.eventBus,
      this.agentMemory,
      this.trustScorer,
      'recovery-optimizer'
    ));

    // Initialize EvolutionPathfinderAgent
    this.agents.set('evolutionPathfinder', new EvolutionPathfinderAgent(
      this.eventBus,
      this.agentMemory,
      this.trustScorer,
      'evolution-pathfinder'
    ));
  }

  public getAgent(type: string): StrategicAgent | undefined {
    return this.agents.get(type);
  }

  public canExecute(type: string): boolean {
    const config = AGENT_CONFIGS[type];
    if (!config) return false;

    const now = Date.now();
    const lastExec = this.lastExecution.get(type) || 0;
    const activeCount = this.activeExecutions.get(type) || 0;

    return (
      now - lastExec >= config.cooldownPeriod &&
      activeCount < config.maxConcurrentExecutions
    );
  }

  public recordExecution(type: string): void {
    this.lastExecution.set(type, Date.now());
    const currentCount = this.activeExecutions.get(type) || 0;
    this.activeExecutions.set(type, currentCount + 1);
  }

  public recordCompletion(type: string): void {
    const currentCount = this.activeExecutions.get(type) || 0;
    this.activeExecutions.set(type, Math.max(0, currentCount - 1));
  }

  public getAvailableAgents(context: StrategyContext): StrategicAgent[] {
    return Array.from(this.agents.values())
      .filter(agent => {
        const type = agent.constructor.name.toLowerCase();
        return (
          this.canExecute(type) &&
          agent.shouldActivate(context)
        );
      })
      .sort((a, b) => {
        const configA = AGENT_CONFIGS[a.constructor.name.toLowerCase()];
        const configB = AGENT_CONFIGS[b.constructor.name.toLowerCase()];
        return configA.priority - configB.priority;
      });
  }

  public getAgentMetrics(): Record<string, {
    lastExecution: number;
    activeExecutions: number;
  }> {
    const metrics: Record<string, { lastExecution: number; activeExecutions: number }> = {};
    
    for (const [type, agent] of this.agents.entries()) {
      metrics[type] = {
        lastExecution: this.lastExecution.get(type) || 0,
        activeExecutions: this.activeExecutions.get(type) || 0
      };
    }

    return metrics;
  }
} 