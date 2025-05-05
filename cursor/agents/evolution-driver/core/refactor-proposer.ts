/**
 * @file core/refactor-proposer.ts
 * @description Refactor proposer for generating and managing refactoring proposals
 */

import { ImprovementProposal, PatternAnalysis, SystemMetrics } from '../types';

export class RefactorProposer {
  private metrics: SystemMetrics;
  private maxComplexity: number;

  constructor(initialMetrics: SystemMetrics, maxComplexity: number) {
    this.metrics = initialMetrics;
    this.maxComplexity = maxComplexity;
  }

  /**
   * Generates refactoring proposals based on pattern analysis
   * @param patterns Identified code patterns
   * @returns Array of improvement proposals
   */
  public async generateProposals(patterns: Map<string, PatternAnalysis>): Promise<ImprovementProposal[]> {
    try {
      const proposals: ImprovementProposal[] = [];

      for (const [pattern, analysis] of patterns) {
        if (this.shouldProposeRefactor(analysis)) {
          const proposal = await this.createProposal(pattern, analysis);
          proposals.push(proposal);
        }
      }

      return this.prioritizeProposals(proposals);
    } catch (error) {
      console.error('Error generating proposals:', error);
      throw new Error('Proposal generation failed');
    }
  }

  /**
   * Updates system metrics for proposal generation
   * @param metrics New system metrics
   */
  public updateMetrics(metrics: SystemMetrics): void {
    this.metrics = metrics;
  }

  /**
   * Determines if a pattern should be refactored
   * @param analysis Pattern analysis to evaluate
   * @returns Whether to propose refactoring
   */
  private shouldProposeRefactor(analysis: PatternAnalysis): boolean {
    return (
      analysis.impact > 0.5 && // High impact
      analysis.occurrences >= 3 && // Multiple occurrences
      this.metrics.codeQuality < 0.8 // Room for improvement
    );
  }

  /**
   * Creates a refactoring proposal for a pattern
   * @param pattern Pattern identifier
   * @param analysis Pattern analysis
   * @returns Improvement proposal
   */
  private async createProposal(
    pattern: string,
    analysis: PatternAnalysis
  ): Promise<ImprovementProposal> {
    // TODO: Implement proposal generation logic
    // This would include:
    // 1. Code change generation
    // 2. Impact assessment
    // 3. Complexity calculation
    // 4. Reasoning generation

    return {
      id: `refactor-${Date.now()}`,
      type: 'refactor',
      description: `Refactor ${pattern} pattern`,
      impact: analysis.impact,
      complexity: 0.5, // Placeholder
      changes: [], // Placeholder
      reasoning: analysis.suggestion,
      confidence: 0.8, // Placeholder
      metadata: {
        pattern,
        occurrences: analysis.occurrences,
        files: analysis.files
      }
    };
  }

  /**
   * Prioritizes proposals based on impact and complexity
   * @param proposals Array of proposals to prioritize
   * @returns Prioritized proposals
   */
  private prioritizeProposals(proposals: ImprovementProposal[]): ImprovementProposal[] {
    return proposals.sort((a, b) => {
      const scoreA = this.calculatePriorityScore(a);
      const scoreB = this.calculatePriorityScore(b);
      return scoreB - scoreA;
    });
  }

  /**
   * Calculates priority score for a proposal
   * @param proposal Proposal to score
   * @returns Priority score
   */
  private calculatePriorityScore(proposal: ImprovementProposal): number {
    const impactWeight = 0.7;
    const complexityWeight = 0.3;

    const normalizedComplexity = 1 - proposal.complexity;
    return proposal.impact * impactWeight + normalizedComplexity * complexityWeight;
  }
} 