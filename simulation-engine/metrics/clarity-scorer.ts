import { BaseScorer } from './base-scorer';

/**
 * ClarityScorer - Evaluates the clarity of prompt outputs
 * Measures readability, structure, and coherence
 */
export class ClarityScorer extends BaseScorer {
  constructor() {
    super('clarity');
  }

  /**
   * Calculates the clarity score for a result
   * @param result The result to score
   * @returns The clarity score and metrics
   */
  public async calculate(result: any): Promise<{
    score: number;
    metrics: Record<string, any>;
    flags: string[];
  }> {
    try {
      const flags: string[] = [];
      const metrics: Record<string, any> = {};

      // Calculate readability score
      const readabilityScore = this.calculateReadability(result);
      metrics.readability = readabilityScore;

      // Calculate structure score
      const structureScore = this.calculateStructure(result);
      metrics.structure = structureScore;

      // Calculate coherence score
      const coherenceScore = this.calculateCoherence(result);
      metrics.coherence = coherenceScore;

      // Calculate overall clarity score
      const score = (readabilityScore + structureScore + coherenceScore) / 3;

      // Add flags for low scores
      if (readabilityScore < 0.7) flags.push('low_readability');
      if (structureScore < 0.7) flags.push('poor_structure');
      if (coherenceScore < 0.7) flags.push('low_coherence');

      // Validate and emit score
      if (this.validateScore(score)) {
        this.emitScoreEvent(score, metrics, flags);
        this.logScore(score, metrics, flags);
      } else {
        throw new Error(`Invalid clarity score: ${score}`);
      }

      return { score, metrics, flags };
    } catch (error) {
      return this.handleScoringError(error);
    }
  }

  /**
   * Calculates the readability score
   * @param result The result to evaluate
   * @returns The readability score
   */
  private calculateReadability(result: any): number {
    try {
      const text = result.content || result.text || '';
      
      // Calculate average sentence length
      const sentences = text.split(/[.!?]+/).filter(Boolean);
      const avgSentenceLength = sentences.reduce((sum, sentence) => 
        sum + sentence.split(' ').length, 0) / sentences.length;

      // Calculate word complexity
      const words = text.split(/\s+/);
      const complexWords = words.filter(word => word.length > 6).length;
      const complexityRatio = complexWords / words.length;

      // Calculate Flesch-Kincaid score
      const fleschScore = 206.835 - 1.015 * avgSentenceLength - 84.6 * complexityRatio;
      
      // Normalize to 0-1 range
      return Math.max(0, Math.min(1, fleschScore / 100));
    } catch (error) {
      this.logger.error('Failed to calculate readability', error);
      return 0;
    }
  }

  /**
   * Calculates the structure score
   * @param result The result to evaluate
   * @returns The structure score
   */
  private calculateStructure(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Check for headings
      const hasHeadings = /^#+\s/m.test(text);
      if (!hasHeadings) score -= 0.2;

      // Check for paragraphs
      const paragraphs = text.split(/\n\s*\n/);
      if (paragraphs.length < 2) score -= 0.2;

      // Check for lists
      const hasLists = /^[-*]\s/m.test(text);
      if (!hasLists) score -= 0.1;

      // Check for code blocks
      const hasCodeBlocks = /```[\s\S]*?```/m.test(text);
      if (!hasCodeBlocks) score -= 0.1;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate structure', error);
      return 0;
    }
  }

  /**
   * Calculates the coherence score
   * @param result The result to evaluate
   * @returns The coherence score
   */
  private calculateCoherence(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Check for transition words
      const transitionWords = [
        'however', 'therefore', 'furthermore', 'moreover',
        'consequently', 'thus', 'hence', 'accordingly'
      ];
      const hasTransitions = transitionWords.some(word => 
        new RegExp(`\\b${word}\\b`, 'i').test(text)
      );
      if (!hasTransitions) score -= 0.2;

      // Check for topic consistency
      const sentences = text.split(/[.!?]+/).filter(Boolean);
      const topics = sentences.map(sentence => 
        sentence.split(' ').slice(0, 3).join(' ')
      );
      const uniqueTopics = new Set(topics);
      const topicConsistency = uniqueTopics.size / topics.length;
      score -= (1 - topicConsistency) * 0.3;

      // Check for logical flow
      const hasLogicalFlow = /first|second|third|finally|in conclusion/i.test(text);
      if (!hasLogicalFlow) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate coherence', error);
      return 0;
    }
  }
} 