/**
 * @file bridge.ts
 * @description Core bridge implementation connecting debug agent with copilot system
 */

import { DebugCopilotConfig } from '../types';
import { TrustScorer } from './trust-scorer';
import { SelfHealing } from './self-healing';
import { DebugContext } from '../../agents/debug/types';
import { CopilotSuggestion } from '../../types';

export class DebugCopilotBridge {
  private trustScorer: TrustScorer;
  private selfHealing: SelfHealing;
  private config: DebugCopilotConfig;

  constructor(config: DebugCopilotConfig) {
    this.config = config;
    this.trustScorer = new TrustScorer({
      threshold: config.trustScoreThreshold
    });
    this.selfHealing = new SelfHealing({
      enabled: config.enableSelfHealing,
      strategies: config.healingStrategies
    });
  }

  /**
   * Enhances a copilot suggestion with debug context and trust scoring
   */
  async enhanceCopilotSuggestion(
    suggestion: CopilotSuggestion,
    context: DebugContext
  ): Promise<CopilotSuggestion> {
    // Get trust score for the suggestion
    const trustScore = await this.trustScorer.computeScore(suggestion, context);

    // If trust score is below threshold, attempt self-healing
    if (trustScore < this.config.trustScoreThreshold) {
      const healedSuggestion = await this.selfHealing.attemptHealing(
        suggestion,
        context
      );
      
      if (healedSuggestion) {
        return {
          ...healedSuggestion,
          metadata: {
            ...healedSuggestion.metadata,
            trustScore: await this.trustScorer.computeScore(healedSuggestion, context),
            healingApplied: true
          }
        };
      }
    }

    // Return enhanced suggestion with trust score
    return {
      ...suggestion,
      metadata: {
        ...suggestion.metadata,
        trustScore,
        healingApplied: false
      }
    };
  }

  /**
   * Analyzes code context for potential issues
   */
  async analyzeContext(context: DebugContext): Promise<{
    issues: string[];
    suggestions: string[];
    trustScore: number;
  }> {
    const analysis = await this.trustScorer.analyzeContext(context);
    const healingSuggestions = await this.selfHealing.getSuggestions(context);

    return {
      issues: analysis.issues,
      suggestions: healingSuggestions,
      trustScore: analysis.trustScore
    };
  }

  /**
   * Updates the bridge configuration
   */
  updateConfig(newConfig: Partial<DebugCopilotConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig
    };

    // Update components with new config
    this.trustScorer.updateConfig({
      threshold: this.config.trustScoreThreshold
    });

    this.selfHealing.updateConfig({
      enabled: this.config.enableSelfHealing,
      strategies: this.config.healingStrategies
    });
  }

  /**
   * Gets the current debug context
   */
  getDebugContext(): DebugContext {
    return this.trustScorer.getCurrentContext();
  }
} 