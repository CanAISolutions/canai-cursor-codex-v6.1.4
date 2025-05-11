import { BaseScorer } from './base-scorer';

/**
 * EmotionalDriftDetector - Evaluates emotional consistency and tone alignment
 * Measures sentiment stability, tone consistency, emotional progression, and lexical alignment
 */
export class EmotionalDriftDetector extends BaseScorer {
  constructor() {
    super('emotional_drift');
  }

  /**
   * Calculates the emotional drift score for a result
   * @param result The result to score
   * @returns The emotional drift score and metrics
   */
  public async calculate(result: any): Promise<{
    score: number;
    metrics: Record<string, any>;
    flags: string[];
  }> {
    try {
      const flags: string[] = [];
      const metrics: Record<string, any> = {};

      // Calculate sentiment stability score
      const sentimentScore = this.calculateSentimentStability(result);
      metrics.sentiment = sentimentScore;

      // Calculate tone consistency score
      const toneScore = this.calculateToneConsistency(result);
      metrics.tone = toneScore;

      // Calculate emotional progression score
      const progressionScore = this.calculateEmotionalProgression(result);
      metrics.progression = progressionScore;

      // Calculate lexical alignment score
      const lexicalScore = this.calculateLexicalAlignment(result);
      metrics.lexical = lexicalScore;

      // Calculate overall emotional drift score (lower is better)
      const score = 1 - ((sentimentScore + toneScore + progressionScore + lexicalScore) / 4);

      // Add flags for high drift scores
      if (sentimentScore > 0.15) flags.push('sentiment_drift');
      if (toneScore > 0.15) flags.push('tone_drift');
      if (progressionScore > 0.15) flags.push('progression_drift');
      if (lexicalScore > 0.15) flags.push('lexical_drift');

      // Validate and emit score
      if (this.validateScore(score)) {
        this.emitScoreEvent(score, metrics, flags);
        this.logScore(score, metrics, flags);
      } else {
        throw new Error(`Invalid emotional drift score: ${score}`);
      }

      return { score, metrics, flags };
    } catch (error) {
      return this.handleScoringError(error);
    }
  }

  /**
   * Calculates the sentiment stability score
   * @param result The result to evaluate
   * @returns The sentiment stability score
   */
  private calculateSentimentStability(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 0.0;

      // Check for positive sentiment shifts
      const positivePhrases = [
        'positive', 'good', 'great', 'excellent',
        'wonderful', 'fantastic', 'amazing', 'brilliant'
      ];
      const hasPositiveShifts = positivePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasPositiveShifts) score += 0.3;

      // Check for negative sentiment shifts
      const negativePhrases = [
        'negative', 'bad', 'poor', 'terrible',
        'awful', 'horrible', 'dreadful', 'atrocious'
      ];
      const hasNegativeShifts = negativePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasNegativeShifts) score += 0.3;

      // Check for neutral sentiment shifts
      const neutralPhrases = [
        'neutral', 'balanced', 'moderate', 'temperate',
        'calm', 'composed', 'collected', 'steady'
      ];
      const hasNeutralShifts = neutralPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasNeutralShifts) score += 0.2;

      // Check for emotional intensity shifts
      const intensityPhrases = [
        'intense', 'strong', 'powerful', 'forceful',
        'mild', 'gentle', 'soft', 'subtle'
      ];
      const hasIntensityShifts = intensityPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasIntensityShifts) score += 0.2;

      return Math.min(1, score);
    } catch (error) {
      this.logger.error('Failed to calculate sentiment stability', error);
      return 1;
    }
  }

  /**
   * Calculates the tone consistency score
   * @param result The result to evaluate
   * @returns The tone consistency score
   */
  private calculateToneConsistency(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 0.0;

      // Check for formal tone shifts
      const formalPhrases = [
        'formal', 'professional', 'official', 'proper',
        'correct', 'appropriate', 'suitable', 'fitting'
      ];
      const hasFormalShifts = formalPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasFormalShifts) score += 0.3;

      // Check for informal tone shifts
      const informalPhrases = [
        'informal', 'casual', 'relaxed', 'easygoing',
        'laid-back', 'unpretentious', 'natural', 'spontaneous'
      ];
      const hasInformalShifts = informalPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasInformalShifts) score += 0.3;

      // Check for technical tone shifts
      const technicalPhrases = [
        'technical', 'specialized', 'expert', 'professional',
        'sophisticated', 'advanced', 'complex', 'detailed'
      ];
      const hasTechnicalShifts = technicalPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasTechnicalShifts) score += 0.2;

      // Check for conversational tone shifts
      const conversationalPhrases = [
        'conversational', 'chatty', 'friendly', 'approachable',
        'accessible', 'relatable', 'engaging', 'interactive'
      ];
      const hasConversationalShifts = conversationalPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasConversationalShifts) score += 0.2;

      return Math.min(1, score);
    } catch (error) {
      this.logger.error('Failed to calculate tone consistency', error);
      return 1;
    }
  }

  /**
   * Calculates the emotional progression score
   * @param result The result to evaluate
   * @returns The emotional progression score
   */
  private calculateEmotionalProgression(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 0.0;

      // Check for emotional escalation
      const escalationPhrases = [
        'escalate', 'intensify', 'heighten', 'increase',
        'amplify', 'magnify', 'augment', 'enhance'
      ];
      const hasEmotionalEscalation = escalationPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasEmotionalEscalation) score += 0.3;

      // Check for emotional de-escalation
      const deescalationPhrases = [
        'de-escalate', 'reduce', 'decrease', 'diminish',
        'lessen', 'mitigate', 'alleviate', 'ease'
      ];
      const hasEmotionalDeescalation = deescalationPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasEmotionalDeescalation) score += 0.3;

      // Check for emotional transition
      const transitionPhrases = [
        'transition', 'shift', 'change', 'transform',
        'evolve', 'develop', 'progress', 'advance'
      ];
      const hasEmotionalTransition = transitionPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasEmotionalTransition) score += 0.2;

      // Check for emotional stability
      const stabilityPhrases = [
        'stable', 'steady', 'consistent', 'constant',
        'uniform', 'regular', 'reliable', 'dependable'
      ];
      const hasEmotionalStability = stabilityPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasEmotionalStability) score += 0.2;

      return Math.min(1, score);
    } catch (error) {
      this.logger.error('Failed to calculate emotional progression', error);
      return 1;
    }
  }

  /**
   * Calculates the lexical alignment score
   * @param result The result to evaluate
   * @returns The lexical alignment score
   */
  private calculateLexicalAlignment(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 0.0;

      // Check for vocabulary shifts
      const vocabularyPhrases = [
        'vocabulary', 'terminology', 'lexicon', 'diction',
        'phraseology', 'wording', 'expression', 'language'
      ];
      const hasVocabularyShifts = vocabularyPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasVocabularyShifts) score += 0.3;

      // Check for style shifts
      const stylePhrases = [
        'style', 'manner', 'approach', 'method',
        'technique', 'procedure', 'process', 'strategy'
      ];
      const hasStyleShifts = stylePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasStyleShifts) score += 0.3;

      // Check for register shifts
      const registerPhrases = [
        'register', 'level', 'tier', 'grade',
        'category', 'class', 'type', 'form'
      ];
      const hasRegisterShifts = registerPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasRegisterShifts) score += 0.2;

      // Check for domain shifts
      const domainPhrases = [
        'domain', 'field', 'area', 'subject',
        'discipline', 'specialty', 'expertise', 'knowledge'
      ];
      const hasDomainShifts = domainPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasDomainShifts) score += 0.2;

      return Math.min(1, score);
    } catch (error) {
      this.logger.error('Failed to calculate lexical alignment', error);
      return 1;
    }
  }
} 