import { BaseScorer } from './base-scorer';

/**
 * MemoryFidelityScorer - Evaluates how well outputs maintain context and memory
 * Measures consistency, context retention, and reference accuracy
 */
export class MemoryFidelityScorer extends BaseScorer {
  constructor() {
    super('memory_fidelity');
  }

  /**
   * Calculates the memory fidelity score for a result
   * @param result The result to score
   * @returns The memory fidelity score and metrics
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

      // Calculate context retention score
      const contextScore = this.calculateContextRetention(result);
      metrics.contextRetention = contextScore;

      // Calculate reference accuracy score
      const referenceScore = this.calculateReferenceAccuracy(result);
      metrics.referenceAccuracy = referenceScore;

      // Calculate overall memory fidelity score
      const score = (consistencyScore + contextScore + referenceScore) / 3;

      // Add flags for low scores
      if (consistencyScore < 0.7) flags.push('inconsistent');
      if (contextScore < 0.7) flags.push('context_loss');
      if (referenceScore < 0.7) flags.push('reference_error');

      // Validate and emit score
      if (this.validateScore(score)) {
        this.emitScoreEvent(score, metrics, flags);
        this.logScore(score, metrics, flags);
      } else {
        throw new Error(`Invalid memory fidelity score: ${score}`);
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
   * Calculates the context retention score
   * @param result The result to evaluate
   * @returns The context retention score
   */
  private calculateContextRetention(result: any): number {
    try {
      const text = result.content || result.text || '';
      const context = result.context || {};
      let score = 1.0;

      // Check for context keywords
      const contextKeywords = Object.keys(context);
      const hasContextKeywords = contextKeywords.some(keyword => 
        new RegExp(`\\b${keyword}\\b`, 'i').test(text)
      );
      if (!hasContextKeywords) score -= 0.3;

      // Check for context values
      const contextValues = Object.values(context);
      const hasContextValues = contextValues.some(value => 
        typeof value === 'string' && new RegExp(`\\b${value}\\b`, 'i').test(text)
      );
      if (!hasContextValues) score -= 0.3;

      // Check for context relationships
      const hasContextRelationships = this.checkContextRelationships(text, context);
      if (!hasContextRelationships) score -= 0.2;

      // Check for context progression
      const hasContextProgression = this.checkContextProgression(text, context);
      if (!hasContextProgression) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate context retention', error);
      return 0;
    }
  }

  /**
   * Calculates the reference accuracy score
   * @param result The result to evaluate
   * @returns The reference accuracy score
   */
  private calculateReferenceAccuracy(result: any): number {
    try {
      const text = result.content || result.text || '';
      const references = result.references || {};
      let score = 1.0;

      // Check for reference presence
      const hasReferences = Object.keys(references).length > 0;
      if (!hasReferences) score -= 0.2;

      // Check for reference accuracy
      const referenceAccuracy = this.checkReferenceAccuracy(text, references);
      score -= (1 - referenceAccuracy) * 0.4;

      // Check for reference context
      const hasReferenceContext = this.checkReferenceContext(text, references);
      if (!hasReferenceContext) score -= 0.2;

      // Check for reference integration
      const hasReferenceIntegration = this.checkReferenceIntegration(text, references);
      if (!hasReferenceIntegration) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate reference accuracy', error);
      return 0;
    }
  }

  /**
   * Extracts key terms from text
   * @param text The text to analyze
   * @returns Array of key terms
   */
  private extractKeyTerms(text: string): string[] {
    // Extract terms that appear multiple times
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
    // Check for consistent heading levels
    const headingLevels = text.match(/^#+\s/gm) || [];
    const uniqueLevels = new Set(headingLevels.map(h => h.length));
    if (uniqueLevels.size > 2) return false;

    // Check for consistent list formatting
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

  /**
   * Checks context relationships
   * @param text The text to check
   * @param context The context to check against
   * @returns Whether context relationships are maintained
   */
  private checkContextRelationships(text: string, context: any): boolean {
    const relationships = Object.entries(context)
      .filter(([_, value]) => typeof value === 'object')
      .map(([key, value]) => ({
        key,
        value: Object.keys(value as object)
      }));

    return relationships.every(({ key, value }) => 
      value.some(v => new RegExp(`\\b${key}\\b.*\\b${v}\\b`, 'i').test(text))
    );
  }

  /**
   * Checks context progression
   * @param text The text to check
   * @param context The context to check against
   * @returns Whether context progression is maintained
   */
  private checkContextProgression(text: string, context: any): boolean {
    const sections = text.split(/\n\s*\n/);
    const contextKeywords = Object.keys(context);

    return sections.every((section, index) => {
      const prevKeywords = index > 0 ? 
        contextKeywords.filter(keyword => 
          new RegExp(`\\b${keyword}\\b`, 'i').test(sections[index - 1])
        ) : [];
      
      const currentKeywords = contextKeywords.filter(keyword => 
        new RegExp(`\\b${keyword}\\b`, 'i').test(section)
      );

      return currentKeywords.some(keyword => prevKeywords.includes(keyword));
    });
  }

  /**
   * Checks reference accuracy
   * @param text The text to check
   * @param references The references to check against
   * @returns The accuracy score
   */
  private checkReferenceAccuracy(text: string, references: any): number {
    const referenceEntries = Object.entries(references);
    if (referenceEntries.length === 0) return 1;

    const accuracyScores = referenceEntries.map(([key, value]) => {
      const hasKey = new RegExp(`\\b${key}\\b`, 'i').test(text);
      const hasValue = typeof value === 'string' && 
        new RegExp(`\\b${value}\\b`, 'i').test(text);
      
      return hasKey && hasValue ? 1 : 0;
    });

    return accuracyScores.reduce((sum: number, score: number) => sum + score, 0) / 
      accuracyScores.length;
  }

  /**
   * Checks reference context
   * @param text The text to check
   * @param references The references to check against
   * @returns Whether references have proper context
   */
  private checkReferenceContext(text: string, references: any): boolean {
    return Object.entries(references).every(([key, value]) => {
      const referencePattern = new RegExp(
        `\\b${key}\\b.*\\b${value}\\b|\\b${value}\\b.*\\b${key}\\b`,
        'i'
      );
      return referencePattern.test(text);
    });
  }

  /**
   * Checks reference integration
   * @param text The text to check
   * @param references The references to check against
   * @returns Whether references are well integrated
   */
  private checkReferenceIntegration(text: string, references: any): boolean {
    const sentences = text.split(/[.!?]+/).filter(Boolean);
    const referenceKeywords = Object.keys(references);

    return sentences.some(sentence => 
      referenceKeywords.every(keyword => 
        new RegExp(`\\b${keyword}\\b`, 'i').test(sentence)
      )
    );
  }
} 