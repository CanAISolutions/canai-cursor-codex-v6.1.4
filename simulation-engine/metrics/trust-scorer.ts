import { BaseScorer } from './base-scorer';

/**
 * TrustScorer - Evaluates the trustworthiness of prompt outputs
 * Measures consistency, transparency, and reliability
 */
export class TrustScorer extends BaseScorer {
  constructor() {
    super('trust');
  }

  /**
   * Calculates the trust score for a result
   * @param result The result to score
   * @returns The trust score and metrics
   */
  public async calculate(result: any): Promise<{
    score: number;
    metrics: Record<string, any>;
    flags: string[];
  }> {
    try {
      const flags: string[] = [];
      const metrics: Record<string, any> = {};

      // Calculate consistency score
      const consistencyScore = this.calculateConsistency(result);
      metrics.consistency = consistencyScore;

      // Calculate transparency score
      const transparencyScore = this.calculateTransparency(result);
      metrics.transparency = transparencyScore;

      // Calculate reliability score
      const reliabilityScore = this.calculateReliability(result);
      metrics.reliability = reliabilityScore;

      // Calculate overall trust score
      const score = (consistencyScore + transparencyScore + reliabilityScore) / 3;

      // Add flags for low scores
      if (consistencyScore < 0.85) flags.push('inconsistent');
      if (transparencyScore < 0.85) flags.push('opaque');
      if (reliabilityScore < 0.85) flags.push('unreliable');

      // Validate and emit score
      if (this.validateScore(score)) {
        this.emitScoreEvent(score, metrics, flags);
        this.logScore(score, metrics, flags);
      } else {
        throw new Error(`Invalid trust score: ${score}`);
      }

      return { score, metrics, flags };
    } catch (error) {
      return this.handleScoringError(error);
    }
  }

  /**
   * Calculates the consistency score
   * @param result The result to evaluate
   * @returns The consistency score
   */
  private calculateConsistency(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Check for consistent terminology
      const terms = this.extractKeyTerms(text);
      const uniqueTerms = new Set(terms);
      const termConsistency = uniqueTerms.size / terms.length;
      score -= (1 - termConsistency) * 0.3;

      // Check for consistent formatting
      const hasConsistentFormatting = this.checkFormattingConsistency(text);
      if (!hasConsistentFormatting) score -= 0.2;

      // Check for consistent tone
      const hasConsistentTone = this.checkToneConsistency(text);
      if (!hasConsistentTone) score -= 0.2;

      // Check for consistent structure
      const hasConsistentStructure = this.checkStructureConsistency(text);
      if (!hasConsistentStructure) score -= 0.3;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate consistency', error);
      return 0;
    }
  }

  /**
   * Calculates the transparency score
   * @param result The result to evaluate
   * @returns The transparency score
   */
  private calculateTransparency(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Check for clear assumptions
      const hasAssumptions = /assume|assumption|presume|presumption/i.test(text);
      if (!hasAssumptions) score -= 0.2;

      // Check for limitations
      const hasLimitations = /limit|limitation|constraint|boundary/i.test(text);
      if (!hasLimitations) score -= 0.2;

      // Check for confidence levels
      const hasConfidence = /confidence|certainty|probability|likelihood/i.test(text);
      if (!hasConfidence) score -= 0.2;

      // Check for data sources
      const hasSources = /source|reference|citation|evidence/i.test(text);
      if (!hasSources) score -= 0.2;

      // Check for methodology
      const hasMethodology = /method|approach|process|procedure/i.test(text);
      if (!hasMethodology) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate transparency', error);
      return 0;
    }
  }

  /**
   * Calculates the reliability score
   * @param result The result to evaluate
   * @returns The reliability score
   */
  private calculateReliability(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Check for error handling
      const hasErrorHandling = /error|exception|fallback|recovery/i.test(text);
      if (!hasErrorHandling) score -= 0.2;

      // Check for validation
      const hasValidation = /validate|verify|check|confirm/i.test(text);
      if (!hasValidation) score -= 0.2;

      // Check for testing
      const hasTesting = /test|verify|validate|check/i.test(text);
      if (!hasTesting) score -= 0.2;

      // Check for monitoring
      const hasMonitoring = /monitor|track|observe|watch/i.test(text);
      if (!hasMonitoring) score -= 0.2;

      // Check for maintenance
      const hasMaintenance = /maintain|update|upgrade|improve/i.test(text);
      if (!hasMaintenance) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate reliability', error);
      return 0;
    }
  }

  /**
   * Extracts key terms from text
   * @param text The text to analyze
   * @returns Array of key terms
   */
  private extractKeyTerms(text: string): string[] {
    const words = text.toLowerCase().split(/\W+/);
    const termCounts = new Map<string, number>();
    
    words.forEach(word => {
      if (word.length > 3) {
        termCounts.set(word, (termCounts.get(word) || 0) + 1);
      }
    });

    return Array.from(termCounts.entries())
      .filter(([_, count]) => count > 1)
      .map(([term]) => term);
  }

  /**
   * Checks formatting consistency
   * @param text The text to check
   * @returns Whether formatting is consistent
   */
  private checkFormattingConsistency(text: string): boolean {
    const headingLevels = text.match(/^#+\s/gm) || [];
    const uniqueLevels = new Set(headingLevels.map(h => h.length));
    if (uniqueLevels.size > 2) return false;

    const listItems = text.match(/^[-*]\s/gm) || [];
    const hasConsistentLists = listItems.length === 0 || 
      listItems.every(item => item === listItems[0]);

    return hasConsistentLists;
  }

  /**
   * Checks tone consistency
   * @param text The text to check
   * @returns Whether tone is consistent
   */
  private checkToneConsistency(text: string): boolean {
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const tones = sentences.map(sentence => {
      if (/[A-Z]/.test(sentence[0])) return 'formal';
      if (/[a-z]/.test(sentence[0])) return 'casual';
      return 'neutral';
    });

    const uniqueTones = new Set(tones);
    return uniqueTones.size <= 2;
  }

  /**
   * Checks structure consistency
   * @param text The text to check
   * @returns Whether structure is consistent
   */
  private checkStructureConsistency(text: string): boolean {
    const sections = text.split(/\n\s*\n/);
    const sectionTypes = sections.map(section => {
      if (/^#+\s/.test(section)) return 'heading';
      if (/^[-*]\s/.test(section)) return 'list';
      if (/```[\s\S]*?```/.test(section)) return 'code';
      return 'paragraph';
    });

    const uniqueTypes = new Set(sectionTypes);
    return uniqueTypes.size <= 3;
  }
} 