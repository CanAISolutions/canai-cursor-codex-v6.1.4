/**
 * @file trust-scorer.ts
 * @description Trust scoring integration for the debug-copilot-bridge
 */

import { TrustScorerConfig, ContextAnalysis, CopilotSuggestion } from '../types';
import { DebugContext } from '../../agents/debug/types';
import { computeTrustScore } from '../../agents/debug/core/trust-scorer';

export class TrustScorer {
  private config: TrustScorerConfig;
  private currentContext: DebugContext | null = null;

  constructor(config: TrustScorerConfig) {
    this.config = config;
  }

  /**
   * Computes trust score for a copilot suggestion
   */
  async computeScore(
    suggestion: CopilotSuggestion,
    context: DebugContext
  ): Promise<number> {
    this.currentContext = context;

    // Convert copilot suggestion to fix proposal format
    const fixProposal = {
      patch: suggestion.code,
      filepath: context.filepath,
      reason: suggestion.explanation,
      confidence: 0.8 // Default confidence
    };

    // Use the debug agent's trust scoring system
    const score = await computeTrustScore(
      fixProposal,
      context,
      {
        enabled: true,
        configFile: '.eslintrc.js',
        maxErrors: 5,
        errorPenalty: 0.5
      },
      'copilot-bridge'
    );

    return score;
  }

  /**
   * Analyzes the current context for potential issues
   */
  async analyzeContext(context: DebugContext): Promise<ContextAnalysis> {
    this.currentContext = context;

    const issues: string[] = [];
    let trustScore = 5.0; // Base score

    // Analyze code quality
    if (context.code) {
      const lines = context.code.split('\n');
      if (lines.length > 100) {
        issues.push('Code exceeds recommended length');
        trustScore -= 1.0;
      }
    }

    // Analyze error patterns
    if (context.error) {
      issues.push(`Error detected: ${context.error.message}`);
      trustScore -= 1.0;
    }

    // Analyze test coverage if available
    if (context.testCoverage && context.testCoverage < 0.8) {
      issues.push('Test coverage below recommended threshold');
      trustScore -= 0.5;
    }

    return {
      issues,
      trustScore: Math.max(0, Math.min(10, trustScore))
    };
  }

  /**
   * Updates the trust scorer configuration
   */
  updateConfig(newConfig: Partial<TrustScorerConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig
    };
  }

  /**
   * Gets the current debug context
   */
  getCurrentContext(): DebugContext | null {
    return this.currentContext;
  }
} 