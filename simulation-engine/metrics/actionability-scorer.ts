import { BaseScorer } from './base-scorer';

/**
 * ActionabilityScorer - Evaluates how actionable and practical outputs are
 * Measures clarity, specificity, feasibility, and implementation guidance
 */
export class ActionabilityScorer extends BaseScorer {
  constructor() {
    super('actionability');
  }

  /**
   * Calculates the actionability score for a result
   * @param result The result to score
   * @returns The actionability score and metrics
   */
  public async calculate(result: any): Promise<{
    score: number;
    metrics: Record<string, any>;
    flags: string[];
  }> {
    try {
      const flags: string[] = [];
      const metrics: Record<string, any> = {};

      // Calculate clarity score
      const clarityScore = this.calculateClarity(result);
      metrics.clarity = clarityScore;

      // Calculate specificity score
      const specificityScore = this.calculateSpecificity(result);
      metrics.specificity = specificityScore;

      // Calculate feasibility score
      const feasibilityScore = this.calculateFeasibility(result);
      metrics.feasibility = feasibilityScore;

      // Calculate implementation score
      const implementationScore = this.calculateImplementation(result);
      metrics.implementation = implementationScore;

      // Calculate overall actionability score
      const score = (clarityScore + specificityScore + feasibilityScore + implementationScore) / 4;

      // Add flags for low scores
      if (clarityScore < 0.85) flags.push('low_clarity');
      if (specificityScore < 0.85) flags.push('low_specificity');
      if (feasibilityScore < 0.85) flags.push('low_feasibility');
      if (implementationScore < 0.85) flags.push('poor_implementation');

      // Validate and emit score
      if (this.validateScore(score)) {
        this.emitScoreEvent(score, metrics, flags);
        this.logScore(score, metrics, flags);
      } else {
        throw new Error(`Invalid actionability score: ${score}`);
      }

      return { score, metrics, flags };
    } catch (error) {
      return this.handleScoringError(error);
    }
  }

  /**
   * Calculates the clarity score
   * @param result The result to evaluate
   * @returns The clarity score
   */
  private calculateClarity(result: any): number {
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

      // Check for clear language
      const clarityPhrases = [
        'clearly', 'specifically', 'explicitly', 'precisely',
        'directly', 'concisely', 'simply', 'plainly'
      ];
      const hasClearLanguage = clarityPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasClearLanguage) score -= 0.3;

      // Check for clear purpose
      const purposePhrases = [
        'purpose', 'goal', 'objective', 'aim',
        'target', 'intention', 'reason', 'why'
      ];
      const hasClearPurpose = purposePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasClearPurpose) score -= 0.2;

      // Check for clear outcomes
      const outcomePhrases = [
        'outcome', 'result', 'effect', 'impact',
        'consequence', 'benefit', 'advantage', 'value'
      ];
      const hasClearOutcomes = outcomePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasClearOutcomes) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate clarity', error);
      return 0;
    }
  }

  /**
   * Calculates the specificity score
   * @param result The result to evaluate
   * @returns The specificity score
   */
  private calculateSpecificity(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Check for specific details
      const detailPhrases = [
        'specifically', 'particularly', 'especially', 'notably',
        'specifically', 'in particular', 'to be specific', 'namely'
      ];
      const hasSpecificDetails = detailPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasSpecificDetails) score -= 0.3;

      // Check for concrete examples
      const examplePhrases = [
        'example', 'instance', 'case', 'illustration',
        'sample', 'demonstration', 'showcase', 'exemplar'
      ];
      const hasConcreteExamples = examplePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasConcreteExamples) score -= 0.3;

      // Check for specific metrics
      const metricPhrases = [
        'metric', 'measure', 'indicator', 'gauge',
        'benchmark', 'standard', 'criterion', 'parameter'
      ];
      const hasSpecificMetrics = metricPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasSpecificMetrics) score -= 0.2;

      // Check for specific timelines
      const timelinePhrases = [
        'timeline', 'schedule', 'deadline', 'milestone',
        'timeframe', 'duration', 'period', 'interval'
      ];
      const hasSpecificTimelines = timelinePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasSpecificTimelines) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate specificity', error);
      return 0;
    }
  }

  /**
   * Calculates the feasibility score
   * @param result The result to evaluate
   * @returns The feasibility score
   */
  private calculateFeasibility(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Check for resource consideration
      const resourcePhrases = [
        'resource', 'budget', 'cost', 'investment',
        'funding', 'capital', 'expense', 'allocation'
      ];
      const hasResourceConsideration = resourcePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasResourceConsideration) score -= 0.3;

      // Check for capability assessment
      const capabilityPhrases = [
        'capability', 'capacity', 'ability', 'skill',
        'expertise', 'competence', 'proficiency', 'readiness'
      ];
      const hasCapabilityAssessment = capabilityPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasCapabilityAssessment) score -= 0.3;

      // Check for risk assessment
      const riskPhrases = [
        'risk', 'challenge', 'obstacle', 'barrier',
        'threat', 'vulnerability', 'exposure', 'liability'
      ];
      const hasRiskAssessment = riskPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasRiskAssessment) score -= 0.2;

      // Check for dependency consideration
      const dependencyPhrases = [
        'dependency', 'requirement', 'prerequisite', 'condition',
        'necessity', 'essential', 'mandatory', 'compulsory'
      ];
      const hasDependencyConsideration = dependencyPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasDependencyConsideration) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate feasibility', error);
      return 0;
    }
  }

  /**
   * Calculates the implementation score
   * @param result The result to evaluate
   * @returns The implementation score
   */
  private calculateImplementation(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Check for step-by-step guidance
      const stepPhrases = [
        'step', 'phase', 'stage', 'process',
        'procedure', 'method', 'approach', 'strategy'
      ];
      const hasStepByStepGuidance = stepPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasStepByStepGuidance) score -= 0.3;

      // Check for success criteria
      const successPhrases = [
        'success', 'achievement', 'accomplishment', 'attainment',
        'fulfillment', 'realization', 'completion', 'execution'
      ];
      const hasSuccessCriteria = successPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasSuccessCriteria) score -= 0.3;

      // Check for progress tracking
      const progressPhrases = [
        'progress', 'track', 'monitor', 'measure',
        'evaluate', 'assess', 'review', 'analyze'
      ];
      const hasProgressTracking = progressPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasProgressTracking) score -= 0.2;

      // Check for adjustment guidance
      const adjustmentPhrases = [
        'adjust', 'adapt', 'modify', 'change',
        'alter', 'revise', 'update', 'refine'
      ];
      const hasAdjustmentGuidance = adjustmentPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasAdjustmentGuidance) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate implementation', error);
      return 0;
    }
  }
} 