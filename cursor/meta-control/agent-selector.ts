/**
 * meta-control/agent-selector.ts
 * 
 * Purpose:
 * Determines which agents should be activated based on system state and requirements.
 * Implements intelligent agent selection and prioritization.
 */

import { EventBus } from '../utils/event-bus';
import { AgentMemory } from '../agent-oversight/agent-memory';
import { MetaControlContext } from './meta-controller';

export interface AgentSelectionCriteria {
  trustScore: number;
  resourceEfficiency: number;
  successRate: number;
  specialization: string[];
  priority: number;
}

export interface AgentSelection {
  agentId: string;
  confidence: number;
  expectedImpact: {
    trust: number;
    resources: number;
    time: number;
  };
}

export class AgentSelector {
  private readonly MIN_TRUST_SCORE = 0.7;
  private readonly MIN_SUCCESS_RATE = 0.6;
  private readonly MAX_RESOURCE_IMPACT = 0.3;
  private readonly SELECTION_THRESHOLD = 0.8;

  constructor(
    private readonly eventBus: EventBus,
    private readonly agentMemory: AgentMemory
  ) {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.eventBus.on('agent:selected', this.handleAgentSelected.bind(this));
    this.eventBus.on('agent:deselected', this.handleAgentDeselected.bind(this));
  }

  public async selectAgents(context: MetaControlContext): Promise<string[]> {
    try {
      const selections = await this.evaluateAgents(context);
      const selectedAgents = this.filterAndPrioritizeSelections(selections);
      
      this.eventBus.emit('selection:completed', {
        selections: selectedAgents,
        timestamp: Date.now()
      });

      return selectedAgents.map(selection => selection.agentId);
    } catch (error) {
      this.handleError(error);
      return [];
    }
  }

  private async evaluateAgents(context: MetaControlContext): Promise<AgentSelection[]> {
    const selections: AgentSelection[] = [];

    for (const [agentId, state] of Object.entries(context.agentStates)) {
      if (state.status !== 'active') continue;

      const criteria = await this.getSelectionCriteria(agentId, state);
      const confidence = this.calculateConfidence(criteria);
      const expectedImpact = this.calculateExpectedImpact(criteria, context);

      if (confidence >= this.SELECTION_THRESHOLD) {
        selections.push({
          agentId,
          confidence,
          expectedImpact
        });
      }
    }

    return selections;
  }

  private async getSelectionCriteria(
    agentId: string,
    state: MetaControlContext['agentStates'][string]
  ): Promise<AgentSelectionCriteria> {
    const record = await this.agentMemory.getAgentRecord(agentId);
    
    return {
      trustScore: state.metrics.trustScore,
      resourceEfficiency: this.calculateResourceEfficiency(record),
      successRate: state.metrics.successRate,
      specialization: this.getAgentSpecialization(agentId),
      priority: this.calculatePriority(state)
    };
  }

  private calculateResourceEfficiency(record: any): number {
    if (!record || !record.resourceMetrics) return 0;

    const { cpuUsage, memoryUsage } = record.resourceMetrics;
    return 1 - ((cpuUsage + memoryUsage) / 2);
  }

  private getAgentSpecialization(agentId: string): string[] {
    // Map agent IDs to their specializations
    const specializationMap: Record<string, string[]> = {
      'trust-restorer': ['trust', 'recovery'],
      'recovery-optimizer': ['optimization', 'recovery'],
      'evolution-pathfinder': ['evolution', 'adaptation']
    };

    return specializationMap[agentId] || [];
  }

  private calculatePriority(state: MetaControlContext['agentStates'][string]): number {
    let priority = 0;

    // Trust score impact
    if (state.metrics.trustScore < 0.7) priority += 3;
    else if (state.metrics.trustScore < 0.8) priority += 2;
    else if (state.metrics.trustScore < 0.9) priority += 1;

    // Success rate impact
    if (state.metrics.successRate < 0.6) priority += 3;
    else if (state.metrics.successRate < 0.7) priority += 2;
    else if (state.metrics.successRate < 0.8) priority += 1;

    return Math.min(priority, 9); // Cap at 9
  }

  private calculateConfidence(criteria: AgentSelectionCriteria): number {
    let confidence = 0;

    // Trust score contribution
    if (criteria.trustScore >= this.MIN_TRUST_SCORE) {
      confidence += 0.3;
    }

    // Success rate contribution
    if (criteria.successRate >= this.MIN_SUCCESS_RATE) {
      confidence += 0.3;
    }

    // Resource efficiency contribution
    if (criteria.resourceEfficiency >= 0.7) {
      confidence += 0.2;
    }

    // Priority contribution
    confidence += (criteria.priority / 9) * 0.2;

    return confidence;
  }

  private calculateExpectedImpact(
    criteria: AgentSelectionCriteria,
    context: MetaControlContext
  ): AgentSelection['expectedImpact'] {
    const trustImpact = this.calculateTrustImpact(criteria, context);
    const resourceImpact = this.calculateResourceImpact(criteria);
    const timeImpact = this.calculateTimeImpact(criteria);

    return {
      trust: trustImpact,
      resources: resourceImpact,
      time: timeImpact
    };
  }

  private calculateTrustImpact(
    criteria: AgentSelectionCriteria,
    context: MetaControlContext
  ): number {
    const baseImpact = 0.2;
    const trustMultiplier = 1 - (context.systemState.trustScore - criteria.trustScore);
    const successMultiplier = criteria.successRate;

    return baseImpact * trustMultiplier * successMultiplier;
  }

  private calculateResourceImpact(criteria: AgentSelectionCriteria): number {
    return Math.min(criteria.resourceEfficiency, this.MAX_RESOURCE_IMPACT);
  }

  private calculateTimeImpact(criteria: AgentSelectionCriteria): number {
    // Time impact is inversely proportional to resource efficiency
    return 1 - criteria.resourceEfficiency;
  }

  private filterAndPrioritizeSelections(selections: AgentSelection[]): AgentSelection[] {
    return selections
      .filter(selection => 
        selection.expectedImpact.trust > 0 &&
        selection.expectedImpact.resources <= this.MAX_RESOURCE_IMPACT
      )
      .sort((a, b) => {
        // Sort by confidence first
        if (a.confidence !== b.confidence) {
          return b.confidence - a.confidence;
        }
        // Then by trust impact
        return b.expectedImpact.trust - a.expectedImpact.trust;
      });
  }

  private async handleAgentSelected(event: any): Promise<void> {
    // Implementation for agent selection handling
  }

  private async handleAgentDeselected(event: any): Promise<void> {
    // Implementation for agent deselection handling
  }

  private async handleError(error: any): Promise<void> {
    this.eventBus.emit('selection:error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now()
    });
  }
} 