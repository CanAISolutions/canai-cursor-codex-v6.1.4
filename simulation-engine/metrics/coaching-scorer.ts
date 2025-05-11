import { BaseScorer } from './base-scorer';

/**
 * CoachingScorer - Evaluates the coaching quality of prompt outputs
 * Measures guidance, actionability, and emotional support
 */
export class CoachingScorer extends BaseScorer {
  constructor() {
    super('coaching');
  }

  /**
   * Calculates the coaching score for a result
   * @param result The result to score
   * @returns The coaching score and metrics
   */
  public async calculate(result: any): Promise<{
    score: number;
    metrics: Record<string, any>;
    flags: string[];
  }> {
    try {
      const flags: string[] = [];
      const metrics: Record<string, any> = {};

      // Calculate guidance score
      const guidanceScore = this.calculateGuidance(result);
      metrics.guidance = guidanceScore;

      // Calculate actionability score
      const actionabilityScore = this.calculateActionability(result);
      metrics.actionability = actionabilityScore;

      // Calculate emotional support score
      const emotionalScore = this.calculateEmotionalSupport(result);
      metrics.emotionalSupport = emotionalScore;

      // Calculate overall coaching score
      const score = (guidanceScore + actionabilityScore + emotionalScore) / 3;

      // Add flags for low scores
      if (guidanceScore < 0.7) flags.push('weak_guidance');
      if (actionabilityScore < 0.7) flags.push('low_actionability');
      if (emotionalScore < 0.7) flags.push('insufficient_support');

      // Validate and emit score
      if (this.validateScore(score)) {
        this.emitScoreEvent(score, metrics, flags);
        this.logScore(score, metrics, flags);
      } else {
        throw new Error(`Invalid coaching score: ${score}`);
      }

      return { score, metrics, flags };
    } catch (error) {
      return this.handleScoringError(error);
    }
  }

  /**
   * Calculates the guidance score
   * @param result The result to evaluate
   * @returns The guidance score
   */
  private calculateGuidance(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Check for step-by-step guidance
      const hasSteps = /step|phase|stage|part|section/i.test(text);
      if (!hasSteps) score -= 0.2;

      // Check for clear instructions
      const hasInstructions = /how to|guide|instructions|process/i.test(text);
      if (!hasInstructions) score -= 0.2;

      // Check for best practices
      const hasBestPractices = /best practice|recommended|suggested|tip/i.test(text);
      if (!hasBestPractices) score -= 0.2;

      // Check for examples
      const hasExamples = /example|instance|case study|illustration/i.test(text);
      if (!hasExamples) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate guidance', error);
      return 0;
    }
  }

  /**
   * Calculates the actionability score
   * @param result The result to evaluate
   * @returns The actionability score
   */
  private calculateActionability(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Check for actionable verbs
      const actionVerbs = [
        'create', 'build', 'develop', 'implement', 'execute',
        'launch', 'optimize', 'improve', 'enhance', 'refine'
      ];
      const hasActionVerbs = actionVerbs.some(verb => 
        new RegExp(`\\b${verb}\\b`, 'i').test(text)
      );
      if (!hasActionVerbs) score -= 0.3;

      // Check for specific metrics
      const hasMetrics = /\d+%|\$\d+|\d+x|\d+ days/i.test(text);
      if (!hasMetrics) score -= 0.2;

      // Check for clear next steps
      const hasNextSteps = /next step|action item|to do|task/i.test(text);
      if (!hasNextSteps) score -= 0.3;

      // Check for timeline
      const hasTimeline = /timeline|schedule|deadline|milestone/i.test(text);
      if (!hasTimeline) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate actionability', error);
      return 0;
    }
  }

  /**
   * Calculates the emotional support score
   * @param result The result to evaluate
   * @returns The emotional support score
   */
  private calculateEmotionalSupport(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Check for encouraging language
      const encouragingPhrases = [
        'you can',
        'you will',
        'you have the power',
        'you are capable',
        'you are ready',
        'you have got this'
      ];
      const hasEncouragement = encouragingPhrases.some(phrase => 
        new RegExp(phrase, 'i').test(text)
      );
      if (!hasEncouragement) score -= 0.3;

      // Check for confidence building
      const confidencePhrases = [
        'proven', 'tested', 'successful', 'effective',
        'reliable', 'trusted', 'established'
      ];
      const hasConfidence = confidencePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasConfidence) score -= 0.2;

      // Check for empathy
      const empathyPhrases = [
        'understand', 'recognize', 'appreciate', 'acknowledge',
        'consider', 'realize', 'see'
      ];
      const hasEmpathy = empathyPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasEmpathy) score -= 0.3;

      // Check for positive framing
      const positivePhrases = [
        'opportunity', 'potential', 'growth', 'improvement',
        'progress', 'advancement', 'development'
      ];
      const hasPositive = positivePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasPositive) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate emotional support', error);
      return 0;
    }
  }
} 