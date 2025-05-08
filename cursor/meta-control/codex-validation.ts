/**
 * meta-control/codex-validation.ts
 * 
 * Purpose:
 * Implements validation logic for Codex alignment checks.
 */

import { EventBus } from '../utils/event-bus';
import { AgentMemory } from '../agent-oversight/agent-memory';
import { MetaControlMetricsTracker } from './metrics-tracker';

export type CorrectionType = 'prompt' | 'response' | 'behavior' | 'trust' | 'output';
export type CorrectionSeverity = 'low' | 'medium' | 'high';

export interface Correction {
  type: CorrectionType;
  severity: CorrectionSeverity;
  description: string;
  context: Record<string, any>;
}

export interface CodexValidationResult {
  isValid: boolean;
  corrections: Correction[];
  metrics?: Record<string, number>;
}

export class CodexValidation {
  private readonly eventBus: EventBus;
  private readonly agentMemory: AgentMemory;
  private readonly metricsTracker: MetaControlMetricsTracker;
  private readonly codexThresholds: {
    prompt: number;
    response: number;
    behavior: number;
  };

  constructor(
    eventBus: EventBus,
    agentMemory: AgentMemory,
    metricsTracker: MetaControlMetricsTracker
  ) {
    this.eventBus = eventBus;
    this.agentMemory = agentMemory;
    this.metricsTracker = metricsTracker;
    this.codexThresholds = {
      prompt: 0.8,
      response: 0.8,
      behavior: 0.8
    };
  }

  public async validateTrustDrift(agentId: string): Promise<CodexValidationResult> {
    const agent = await this.agentMemory.getAgent(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    // For new agents with no history, trust is valid by default
    if (!agent.trustHistory || agent.trustHistory.length === 0) {
      return {
        isValid: true,
        corrections: [],
        metrics: { alignmentScore: 1.0 }
      };
    }

    const drift = Math.max(...agent.trustHistory) - Math.min(...agent.trustHistory);
    const isValid = drift <= 0.3; // Threshold for acceptable trust drift

    return {
      isValid,
      corrections: isValid ? [] : [{
        type: 'trust',
        description: 'Trust drift exceeds threshold',
        severity: 'high',
        context: {
          agentId: agent.agentName,
          trustHistory: agent.trustHistory,
          drift
        }
      }],
      metrics: {
        alignmentScore: isValid ? 1.0 : 1.0 - drift
      }
    };
  }

  public async validateAgentBehavior(agentId: string, executionData: any): Promise<CodexValidationResult> {
    const behaviorDeviation = await this.calculateBehaviorDeviation(executionData);
    const outputAlignment = await this.validateOutput(executionData.output);
    const isValid = behaviorDeviation < 0.3 && outputAlignment;

    const corrections: Correction[] = [];
    if (behaviorDeviation >= 0.3) {
      corrections.push({
        type: 'behavior',
        description: 'Behavior deviation exceeds threshold',
        severity: 'medium',
        context: {
          agentId,
          actionPatterns: executionData.actions,
          deviation: behaviorDeviation
        }
      });
    }

    if (!outputAlignment) {
      corrections.push({
        type: 'output',
        description: 'Output format or content is invalid',
        severity: 'medium',
        context: {
          agentId,
          output: executionData.output
        }
      });
    }

    return {
      isValid,
      corrections,
      metrics: { behaviorDeviation }
    };
  }

  private async calculateBehaviorDeviation(executionData: any): Promise<number> {
    if (!executionData.actions || !Array.isArray(executionData.actions)) {
      return 1.0;
    }

    const validActions = executionData.actions.filter((action: any) =>
      action.type === 'tool' &&
      ['codebase', 'read', 'edit'].includes(action.target)
    );

    return 1 - (validActions.length / executionData.actions.length);
  }

  private async validateOutput(output: any): Promise<boolean> {
    if (!output) return false;
    if (output.format !== 'markdown') return false;
    if (!output.content) return false;
    return true;
  }

  public async applyCorrections(agentId: string, corrections: Correction[]): Promise<void> {
    const agent = await this.agentMemory.getAgent(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    for (const correction of corrections) {
      switch (correction.type) {
        case 'trust':
          agent.status = 'degraded';
          agent.trustScore = Math.min(...agent.trustHistory);
          break;
        case 'behavior':
          agent.status = 'degraded';
          agent.metadata.lastBehaviorCorrection = {
            timestamp: Date.now(),
            details: correction.context
          };
          break;
        case 'output':
          agent.status = 'degraded';
          agent.metadata.lastOutputCorrection = {
            timestamp: Date.now(),
            details: correction.context
          };
          break;
      }

      await this.eventBus.emit('codex:correction:applied', {
        agentId,
        correction
      });
    }

    await this.agentMemory.updateAgentRecord(agent.agentName, agent);
  }

  private getSeverity(score: number): CorrectionSeverity {
    if (score < 0.3) return 'high';
    if (score < 0.6) return 'medium';
    return 'low';
  }
} 