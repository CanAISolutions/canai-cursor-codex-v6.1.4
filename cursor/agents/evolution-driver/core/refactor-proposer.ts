/**
 * @file refactor-proposer.ts
 * @description Proposes code refactoring based on pattern analysis
 */

import { SystemMetrics, PatternAnalysis, ImprovementProposal } from '../types';

export class RefactorProposer {
  private metrics: SystemMetrics;
  private maxComplexity: number;

  constructor(metrics: SystemMetrics, maxComplexity: number) {
    this.metrics = metrics;
    this.maxComplexity = maxComplexity;
  }

  /**
   * Generates refactoring proposals based on patterns
   */
  public async generateProposals(patterns: Map<string, PatternAnalysis>): Promise<ImprovementProposal[]> {
    const proposals: ImprovementProposal[] = [];

    for (const [pattern, analysis] of patterns) {
      if (analysis.impact > 0.5) {
        proposals.push({
          pattern,
          description: this.generateDescription(pattern, analysis),
          impact: analysis.impact,
          complexity: this.calculateComplexity(analysis),
          files: analysis.files,
          suggestions: analysis.suggestions
        });
      }
    }

    return proposals.sort((a, b) => b.impact - a.impact);
  }

  private generateDescription(pattern: string, analysis: PatternAnalysis): string {
    const baseDescription = `Found ${analysis.occurrences} occurrences of ${pattern} pattern`;
    const impactDescription = `with ${Math.round(analysis.impact * 100)}% impact`;
    const fileDescription = `across ${analysis.files.length} files`;
    return `${baseDescription} ${impactDescription} ${fileDescription}`;
  }

  private calculateComplexity(analysis: PatternAnalysis): number {
    const baseComplexity = analysis.occurrences * 0.2;
    const fileComplexity = analysis.files.length * 0.1;
    const impactComplexity = analysis.impact * 0.3;
    return Math.min(baseComplexity + fileComplexity + impactComplexity, this.maxComplexity);
  }

  /**
   * Validates a refactoring proposal
   */
  public validateProposal(proposal: ImprovementProposal): boolean {
    if (!proposal.type || !proposal.description) {
      return false;
    }

    if (typeof proposal.priority !== 'number' || 
        proposal.priority < 0 || 
        proposal.priority > 1) {
      return false;
    }

    if (proposal.impact) {
      if (typeof proposal.impact.complexity !== 'number' ||
          typeof proposal.impact.maintainability !== 'number') {
        return false;
      }
    }

    return true;
  }

  /**
   * Updates system metrics
   */
  public updateMetrics(newMetrics: SystemMetrics): void {
    this.metrics = newMetrics;
  }

  public getMetrics(): SystemMetrics {
    return this.metrics;
  }
} 