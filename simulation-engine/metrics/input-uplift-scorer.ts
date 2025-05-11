import { BaseScorer } from './base-scorer';

/**
 * InputUpliftScorer - Evaluates how much the output improves upon the input
 * Measures value addition, clarity improvement, depth enhancement, and practical utility
 */
export class InputUpliftScorer extends BaseScorer {
  constructor() {
    super('input_uplift');
  }

  /**
   * Calculates the input uplift score for a result
   * @param result The result to score
   * @returns The input uplift score and metrics
   */
  public async calculate(result: any): Promise<{
    score: number;
    metrics: Record<string, any>;
    flags: string[];
  }> {
    try {
      const flags: string[] = [];
      const metrics: Record<string, any> = {};

      // Calculate value addition score
      const valueScore = this.calculateValueAddition(result);
      metrics.value = valueScore;

      // Calculate clarity improvement score
      const clarityScore = this.calculateClarityImprovement(result);
      metrics.clarity = clarityScore;

      // Calculate depth enhancement score
      const depthScore = this.calculateDepthEnhancement(result);
      metrics.depth = depthScore;

      // Calculate practical utility score
      const utilityScore = this.calculatePracticalUtility(result);
      metrics.utility = utilityScore;

      // Calculate overall input uplift score
      const score = (valueScore + clarityScore + depthScore + utilityScore) / 4;

      // Add flags for low scores
      if (valueScore < 0.85) flags.push('low_value_addition');
      if (clarityScore < 0.85) flags.push('poor_clarity_improvement');
      if (depthScore < 0.85) flags.push('insufficient_depth');
      if (utilityScore < 0.85) flags.push('low_practical_utility');

      // Validate and emit score
      if (this.validateScore(score)) {
        this.emitScoreEvent(score, metrics, flags);
        this.logScore(score, metrics, flags);
      } else {
        throw new Error(`Invalid input uplift score: ${score}`);
      }

      return { score, metrics, flags };
    } catch (error) {
      return this.handleScoringError(error);
    }
  }

  /**
   * Calculates the value addition score
   * @param result The result to evaluate
   * @returns The value addition score
   */
  private calculateValueAddition(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Check for new insights
      const insightPhrases = [
        'insight', 'perspective', 'viewpoint', 'analysis',
        'observation', 'finding', 'discovery', 'realization'
      ];
      const hasNewInsights = insightPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasNewInsights) score -= 0.3;

      // Check for value propositions
      const valuePhrases = [
        'value', 'benefit', 'advantage', 'improvement',
        'enhancement', 'optimization', 'refinement', 'upgrade'
      ];
      const hasValuePropositions = valuePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasValuePropositions) score -= 0.3;

      // Check for unique contributions
      const uniquePhrases = [
        'unique', 'distinct', 'novel', 'original',
        'innovative', 'creative', 'fresh', 'new'
      ];
      const hasUniqueContributions = uniquePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasUniqueContributions) score -= 0.2;

      // Check for strategic value
      const strategicPhrases = [
        'strategic', 'tactical', 'systematic', 'methodical',
        'planned', 'organized', 'structured', 'coordinated'
      ];
      const hasStrategicValue = strategicPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasStrategicValue) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate value addition', error);
      return 0;
    }
  }

  /**
   * Calculates the clarity improvement score
   * @param result The result to evaluate
   * @returns The clarity improvement score
   */
  private calculateClarityImprovement(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Check for structure improvement
      const structurePhrases = [
        'structure', 'organization', 'arrangement', 'layout',
        'format', 'composition', 'configuration', 'design'
      ];
      const hasStructureImprovement = structurePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasStructureImprovement) score -= 0.3;

      // Check for explanation quality
      const explanationPhrases = [
        'explain', 'clarify', 'elucidate', 'illustrate',
        'demonstrate', 'show', 'describe', 'detail'
      ];
      const hasExplanationQuality = explanationPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasExplanationQuality) score -= 0.3;

      // Check for simplification
      const simplificationPhrases = [
        'simplify', 'streamline', 'clarify', 'distill',
        'condense', 'summarize', 'synthesize', 'consolidate'
      ];
      const hasSimplification = simplificationPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasSimplification) score -= 0.2;

      // Check for accessibility
      const accessibilityPhrases = [
        'accessible', 'understandable', 'comprehensible', 'clear',
        'plain', 'simple', 'straightforward', 'uncomplicated'
      ];
      const hasAccessibility = accessibilityPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasAccessibility) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate clarity improvement', error);
      return 0;
    }
  }

  /**
   * Calculates the depth enhancement score
   * @param result The result to evaluate
   * @returns The depth enhancement score
   */
  private calculateDepthEnhancement(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Check for analysis depth
      const analysisPhrases = [
        'analyze', 'examine', 'investigate', 'explore',
        'study', 'research', 'evaluate', 'assess'
      ];
      const hasAnalysisDepth = analysisPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasAnalysisDepth) score -= 0.3;

      // Check for context depth
      const contextPhrases = [
        'context', 'background', 'framework', 'perspective',
        'viewpoint', 'standpoint', 'position', 'angle'
      ];
      const hasContextDepth = contextPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasContextDepth) score -= 0.3;

      // Check for detail depth
      const detailPhrases = [
        'detail', 'specific', 'particular', 'precise',
        'exact', 'accurate', 'thorough', 'comprehensive'
      ];
      const hasDetailDepth = detailPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasDetailDepth) score -= 0.2;

      // Check for insight depth
      const insightPhrases = [
        'insight', 'understanding', 'comprehension', 'grasp',
        'appreciation', 'recognition', 'awareness', 'consciousness'
      ];
      const hasInsightDepth = insightPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasInsightDepth) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate depth enhancement', error);
      return 0;
    }
  }

  /**
   * Calculates the practical utility score
   * @param result The result to evaluate
   * @returns The practical utility score
   */
  private calculatePracticalUtility(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 1.0;

      // Check for actionable guidance
      const actionPhrases = [
        'action', 'step', 'process', 'procedure',
        'method', 'approach', 'strategy', 'tactic'
      ];
      const hasActionableGuidance = actionPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasActionableGuidance) score -= 0.3;

      // Check for practical application
      const applicationPhrases = [
        'apply', 'implement', 'execute', 'perform',
        'carry out', 'put into practice', 'utilize', 'employ'
      ];
      const hasPracticalApplication = applicationPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasPracticalApplication) score -= 0.3;

      // Check for measurable outcomes
      const outcomePhrases = [
        'outcome', 'result', 'effect', 'impact',
        'consequence', 'benefit', 'advantage', 'value'
      ];
      const hasMeasurableOutcomes = outcomePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasMeasurableOutcomes) score -= 0.2;

      // Check for resource efficiency
      const efficiencyPhrases = [
        'efficient', 'effective', 'productive', 'optimized',
        'streamlined', 'simplified', 'refined', 'improved'
      ];
      const hasResourceEfficiency = efficiencyPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasResourceEfficiency) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate practical utility', error);
      return 0;
    }
  }
} 