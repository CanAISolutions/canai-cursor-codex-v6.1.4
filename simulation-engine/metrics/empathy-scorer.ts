import { BaseScorer } from './base-scorer';

/**
 * EmpathyScorer - Evaluates emotional intelligence and empathy in outputs
 * Measures emotional resonance, understanding, and support
 */
export class EmpathyScorer extends BaseScorer {
  constructor() {
    super('empathy');
  }

  /**
   * Calculates the empathy score for a result
   * @param result The result to score
   * @returns The empathy score and metrics
   */
  public async calculate(result: any): Promise<{
    score: number;
    metrics: Record<string, any>;
    flags: string[];
  }> {
    try {
      const flags: string[] = [];
      const metrics: Record<string, any> = {};

      // Calculate emotional resonance score
      const resonanceScore = this.calculateEmotionalResonance(result);
      metrics.resonance = resonanceScore;

      // Calculate understanding score
      const understandingScore = this.calculateUnderstanding(result);
      metrics.understanding = understandingScore;

      // Calculate support score
      const supportScore = this.calculateSupport(result);
      metrics.support = supportScore;

      // Calculate overall empathy score
      const score = (resonanceScore + understandingScore + supportScore) / 3;

      // Add flags for low scores
      if (resonanceScore < 0.85) flags.push('low_resonance');
      if (understandingScore < 0.85) flags.push('poor_understanding');
      if (supportScore < 0.85) flags.push('insufficient_support');

      // Validate and emit score
      if (this.validateScore(score)) {
        this.emitScoreEvent(score, metrics, flags);
        this.logScore(score, metrics, flags);
      } else {
        throw new Error(`Invalid empathy score: ${score}`);
      }

      return { score, metrics, flags };
    } catch (error) {
      return this.handleScoringError(error);
    }
  }

  /**
   * Calculates the emotional resonance score
   * @param result The result to evaluate
   * @returns The emotional resonance score
   */
  private calculateEmotionalResonance(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Check for emotional language
      const emotionalPhrases = [
        'feel', 'emotion', 'experience', 'sense',
        'understand', 'appreciate', 'value', 'care'
      ];
      const hasEmotionalLanguage = emotionalPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasEmotionalLanguage) score -= 0.3;

      // Check for personal connection
      const personalPhrases = [
        'you', 'your', 'we', 'our',
        'together', 'collaborate', 'partner'
      ];
      const hasPersonalConnection = personalPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasPersonalConnection) score -= 0.3;

      // Check for positive framing
      const positivePhrases = [
        'opportunity', 'potential', 'growth', 'improvement',
        'progress', 'advancement', 'development'
      ];
      const hasPositiveFraming = positivePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasPositiveFraming) score -= 0.2;

      // Check for emotional validation
      const validationPhrases = [
        'valid', 'legitimate', 'reasonable', 'understandable',
        'natural', 'normal', 'expected'
      ];
      const hasEmotionalValidation = validationPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasEmotionalValidation) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate emotional resonance', error);
      return 0;
    }
  }

  /**
   * Calculates the understanding score
   * @param result The result to evaluate
   * @returns The understanding score
   */
  private calculateUnderstanding(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Check for context awareness
      const contextPhrases = [
        'context', 'situation', 'circumstance', 'background',
        'environment', 'setting', 'condition'
      ];
      const hasContextAwareness = contextPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasContextAwareness) score -= 0.3;

      // Check for perspective taking
      const perspectivePhrases = [
        'perspective', 'viewpoint', 'standpoint', 'position',
        'angle', 'approach', 'outlook'
      ];
      const hasPerspectiveTaking = perspectivePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasPerspectiveTaking) score -= 0.3;

      // Check for needs recognition
      const needsPhrases = [
        'need', 'requirement', 'necessity', 'essential',
        'important', 'critical', 'vital'
      ];
      const hasNeedsRecognition = needsPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasNeedsRecognition) score -= 0.2;

      // Check for challenge acknowledgment
      const challengePhrases = [
        'challenge', 'difficulty', 'obstacle', 'barrier',
        'hurdle', 'setback', 'struggle'
      ];
      const hasChallengeAcknowledgment = challengePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasChallengeAcknowledgment) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate understanding', error);
      return 0;
    }
  }

  /**
   * Calculates the support score
   * @param result The result to evaluate
   * @returns The support score
   */
  private calculateSupport(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Check for encouragement
      const encouragementPhrases = [
        'encourage', 'support', 'motivate', 'inspire',
        'empower', 'boost', 'strengthen'
      ];
      const hasEncouragement = encouragementPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasEncouragement) score -= 0.3;

      // Check for guidance
      const guidancePhrases = [
        'guide', 'direct', 'lead', 'steer',
        'navigate', 'orient', 'position'
      ];
      const hasGuidance = guidancePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasGuidance) score -= 0.3;

      // Check for reassurance
      const reassurancePhrases = [
        'reassure', 'assure', 'confirm', 'verify',
        'validate', 'affirm', 'endorse'
      ];
      const hasReassurance = reassurancePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasReassurance) score -= 0.2;

      // Check for practical help
      const helpPhrases = [
        'help', 'assist', 'aid', 'support',
        'facilitate', 'enable', 'empower'
      ];
      const hasPracticalHelp = helpPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasPracticalHelp) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate support', error);
      return 0;
    }
  }
} 