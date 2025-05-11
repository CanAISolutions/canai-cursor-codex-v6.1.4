import { BaseScorer } from './base-scorer';

/**
 * ReadabilityScorer - Evaluates text readability using various metrics
 * Measures Flesch-Kincaid, sentence complexity, vocabulary level, and structural clarity
 */
export class ReadabilityScorer extends BaseScorer {
  constructor() {
    super('readability');
  }

  /**
   * Calculates the readability score for a result
   * @param result The result to score
   * @returns The readability score and metrics
   */
  public async calculate(result: any): Promise<{
    score: number;
    metrics: Record<string, any>;
    flags: string[];
  }> {
    try {
      const flags: string[] = [];
      const metrics: Record<string, any> = {};

      // Calculate Flesch-Kincaid score
      const fleschKincaidScore = this.calculateFleschKincaid(result);
      metrics.fleschKincaid = fleschKincaidScore;

      // Calculate sentence complexity score
      const complexityScore = this.calculateSentenceComplexity(result);
      metrics.complexity = complexityScore;

      // Calculate vocabulary level score
      const vocabularyScore = this.calculateVocabularyLevel(result);
      metrics.vocabulary = vocabularyScore;

      // Calculate structural clarity score
      const structureScore = this.calculateStructuralClarity(result);
      metrics.structure = structureScore;

      // Calculate overall readability score
      const score = (fleschKincaidScore + complexityScore + vocabularyScore + structureScore) / 4;

      // Add flags for low scores
      if (fleschKincaidScore < 0.85) flags.push('low_flesch_kincaid');
      if (complexityScore < 0.85) flags.push('high_complexity');
      if (vocabularyScore < 0.85) flags.push('complex_vocabulary');
      if (structureScore < 0.85) flags.push('poor_structure');

      // Validate and emit score
      if (this.validateScore(score)) {
        this.emitScoreEvent(score, metrics, flags);
        this.logScore(score, metrics, flags);
      } else {
        throw new Error(`Invalid readability score: ${score}`);
      }

      return { score, metrics, flags };
    } catch (error) {
      return this.handleScoringError(error);
    }
  }

  /**
   * Calculates the Flesch-Kincaid score
   * @param result The result to evaluate
   * @returns The Flesch-Kincaid score
   */
  private calculateFleschKincaid(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Count sentences
      const sentences = text.split(/[.!?]+/).filter(Boolean);
      const avgSentenceLength = sentences.reduce((sum: number, sentence: string) => 
        sum + sentence.split(/\s+/).length, 0) / sentences.length;

      // Count syllables
      const words = text.split(/\s+/);
      const totalSyllables = words.reduce((sum: number, word: string) => 
        sum + this.countSyllables(word), 0);
      const avgSyllablesPerWord = totalSyllables / words.length;

      // Calculate Flesch-Kincaid score
      // Formula: 206.835 - 1.015(total words/total sentences) - 84.6(total syllables/total words)
      const fleschScore = 206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord;

      // Normalize score to 0-1 range (assuming typical range of 0-100)
      const normalizedScore = Math.max(0, Math.min(1, fleschScore / 100));

      // Adjust score based on readability level
      if (normalizedScore < 0.3) score -= 0.3; // Very difficult
      else if (normalizedScore < 0.5) score -= 0.2; // Difficult
      else if (normalizedScore < 0.7) score -= 0.1; // Moderate
      // 0.7+ is considered good readability

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate Flesch-Kincaid score', error);
      return 0;
    }
  }

  /**
   * Calculates the sentence complexity score
   * @param result The result to evaluate
   * @returns The sentence complexity score
   */
  private calculateSentenceComplexity(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Check for complex sentence structures
      const complexPhrases = [
        'although', 'because', 'despite', 'however',
        'nevertheless', 'therefore', 'thus', 'whereas'
      ];
      const hasComplexStructures = complexPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasComplexStructures) score -= 0.3;

      // Check for long sentences
      const sentences = text.split(/[.!?]+/).filter(Boolean);
      const hasLongSentences = sentences.some((sentence: string) => 
        sentence.split(/\s+/).length > 20
      );
      if (hasLongSentences) score -= 0.3;

      // Check for nested clauses
      const nestedPhrases = [
        'which', 'that', 'who', 'whom',
        'whose', 'where', 'when', 'why'
      ];
      const hasNestedClauses = nestedPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasNestedClauses) score -= 0.2;

      // Check for passive voice
      const passivePhrases = [
        'is', 'are', 'was', 'were',
        'be', 'been', 'being', 'have'
      ];
      const hasPassiveVoice = passivePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasPassiveVoice) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate sentence complexity', error);
      return 0;
    }
  }

  /**
   * Calculates the vocabulary level score
   * @param result The result to evaluate
   * @returns The vocabulary level score
   */
  private calculateVocabularyLevel(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Check for technical terms
      const technicalPhrases = [
        'technical', 'specialized', 'expert', 'professional',
        'sophisticated', 'advanced', 'complex', 'detailed'
      ];
      const hasTechnicalTerms = technicalPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasTechnicalTerms) score -= 0.3;

      // Check for jargon
      const jargonPhrases = [
        'jargon', 'terminology', 'vocabulary', 'lexicon',
        'phraseology', 'wording', 'expression', 'language'
      ];
      const hasJargon = jargonPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasJargon) score -= 0.3;

      // Check for uncommon words
      const uncommonPhrases = [
        'uncommon', 'rare', 'obscure', 'esoteric',
        'arcane', 'abstruse', 'recondite', 'cryptic'
      ];
      const hasUncommonWords = uncommonPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasUncommonWords) score -= 0.2;

      // Check for domain-specific terms
      const domainPhrases = [
        'domain', 'field', 'area', 'subject',
        'discipline', 'specialty', 'expertise', 'knowledge'
      ];
      const hasDomainTerms = domainPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasDomainTerms) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate vocabulary level', error);
      return 0;
    }
  }

  /**
   * Calculates the structural clarity score
   * @param result The result to evaluate
   * @returns The structural clarity score
   */
  private calculateStructuralClarity(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Check for clear structure
      const structurePhrases = [
        'first', 'second', 'third', 'finally',
        'step', 'phase', 'stage', 'part'
      ];
      const hasClearStructure = structurePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasClearStructure) score -= 0.3;

      // Check for organization
      const organizationPhrases = [
        'organize', 'arrange', 'structure', 'format',
        'layout', 'composition', 'configuration', 'design'
      ];
      const hasOrganization = organizationPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasOrganization) score -= 0.3;

      // Check for transitions
      const transitionPhrases = [
        'transition', 'shift', 'change', 'transform',
        'evolve', 'develop', 'progress', 'advance'
      ];
      const hasTransitions = transitionPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasTransitions) score -= 0.2;

      // Check for coherence
      const coherencePhrases = [
        'coherent', 'logical', 'consistent', 'unified',
        'connected', 'related', 'linked', 'associated'
      ];
      const hasCoherence = coherencePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasCoherence) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate structural clarity', error);
      return 0;
    }
  }

  /**
   * Counts the number of syllables in a word
   * @param word The word to count syllables for
   * @returns The number of syllables
   */
  private countSyllables(word: string): number {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;

    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace('^y', '');

    const syllables = word.match(/[aeiouy]{1,2}/g);
    return syllables ? syllables.length : 1;
  }
} 