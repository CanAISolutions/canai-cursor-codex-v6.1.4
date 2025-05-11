import { BaseScorer } from './base-scorer';

/**
 * BiasScorer - Evaluates potential biases in outputs
 * Measures demographic bias, cultural bias, language bias, and perspective bias
 */
export class BiasScorer extends BaseScorer {
  constructor() {
    super('bias');
  }

  /**
   * Calculates the bias score for a result
   * @param result The result to score
   * @returns The bias score and metrics
   */
  public async calculate(result: any): Promise<{
    score: number;
    metrics: Record<string, any>;
    flags: string[];
  }> {
    try {
      const flags: string[] = [];
      const metrics: Record<string, any> = {};

      // Calculate demographic bias score
      const demographicScore = this.calculateDemographicBias(result);
      metrics.demographic = demographicScore;

      // Calculate cultural bias score
      const culturalScore = this.calculateCulturalBias(result);
      metrics.cultural = culturalScore;

      // Calculate language bias score
      const languageScore = this.calculateLanguageBias(result);
      metrics.language = languageScore;

      // Calculate perspective bias score
      const perspectiveScore = this.calculatePerspectiveBias(result);
      metrics.perspective = perspectiveScore;

      // Calculate overall bias score (lower is better)
      const score = 1 - ((demographicScore + culturalScore + languageScore + perspectiveScore) / 4);

      // Add flags for high bias scores
      if (demographicScore > 0.15) flags.push('demographic_bias');
      if (culturalScore > 0.15) flags.push('cultural_bias');
      if (languageScore > 0.15) flags.push('language_bias');
      if (perspectiveScore > 0.15) flags.push('perspective_bias');

      // Validate and emit score
      if (this.validateScore(score)) {
        this.emitScoreEvent(score, metrics, flags);
        this.logScore(score, metrics, flags);
      } else {
        throw new Error(`Invalid bias score: ${score}`);
      }

      return { score, metrics, flags };
    } catch (error) {
      return this.handleScoringError(error);
    }
  }

  /**
   * Calculates the demographic bias score
   * @param result The result to evaluate
   * @returns The demographic bias score
   */
  private calculateDemographicBias(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 0.0;

      // Check for age bias
      const agePhrases = [
        'young', 'old', 'elderly', 'senior',
        'millennial', 'boomer', 'gen z', 'gen x'
      ];
      const hasAgeBias = agePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasAgeBias) score += 0.3;

      // Check for gender bias
      const genderPhrases = [
        'he', 'she', 'his', 'her',
        'man', 'woman', 'male', 'female'
      ];
      const hasGenderBias = genderPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasGenderBias) score += 0.3;

      // Check for socioeconomic bias
      const socioeconomicPhrases = [
        'rich', 'poor', 'wealthy', 'poverty',
        'affluent', 'underprivileged', 'privileged', 'disadvantaged'
      ];
      const hasSocioeconomicBias = socioeconomicPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasSocioeconomicBias) score += 0.2;

      // Check for education bias
      const educationPhrases = [
        'educated', 'uneducated', 'degree', 'diploma',
        'academic', 'scholar', 'expert', 'professional'
      ];
      const hasEducationBias = educationPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasEducationBias) score += 0.2;

      return Math.min(1, score);
    } catch (error) {
      this.logger.error('Failed to calculate demographic bias', error);
      return 1;
    }
  }

  /**
   * Calculates the cultural bias score
   * @param result The result to evaluate
   * @returns The cultural bias score
   */
  private calculateCulturalBias(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 0.0;

      // Check for cultural assumptions
      const culturalPhrases = [
        'western', 'eastern', 'traditional', 'modern',
        'conventional', 'progressive', 'conservative', 'liberal'
      ];
      const hasCulturalAssumptions = culturalPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasCulturalAssumptions) score += 0.3;

      // Check for religious bias
      const religiousPhrases = [
        'religious', 'spiritual', 'faith', 'belief',
        'sacred', 'divine', 'holy', 'pious'
      ];
      const hasReligiousBias = religiousPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasReligiousBias) score += 0.3;

      // Check for regional bias
      const regionalPhrases = [
        'american', 'european', 'asian', 'african',
        'global', 'local', 'national', 'international'
      ];
      const hasRegionalBias = regionalPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasRegionalBias) score += 0.2;

      // Check for social norm bias
      const socialNormPhrases = [
        'normal', 'abnormal', 'standard', 'deviant',
        'conventional', 'unconventional', 'proper', 'improper'
      ];
      const hasSocialNormBias = socialNormPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasSocialNormBias) score += 0.2;

      return Math.min(1, score);
    } catch (error) {
      this.logger.error('Failed to calculate cultural bias', error);
      return 1;
    }
  }

  /**
   * Calculates the language bias score
   * @param result The result to evaluate
   * @returns The language bias score
   */
  private calculateLanguageBias(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 0.0;

      // Check for jargon bias
      const jargonPhrases = [
        'jargon', 'terminology', 'vocabulary', 'lexicon',
        'technical', 'specialized', 'professional', 'expert'
      ];
      const hasJargonBias = jargonPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasJargonBias) score += 0.3;

      // Check for formality bias
      const formalityPhrases = [
        'formal', 'informal', 'casual', 'professional',
        'official', 'unofficial', 'proper', 'improper'
      ];
      const hasFormalityBias = formalityPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasFormalityBias) score += 0.3;

      // Check for complexity bias
      const complexityPhrases = [
        'complex', 'simple', 'basic', 'advanced',
        'sophisticated', 'elementary', 'fundamental', 'rudimentary'
      ];
      const hasComplexityBias = complexityPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasComplexityBias) score += 0.2;

      // Check for tone bias
      const tonePhrases = [
        'tone', 'mood', 'attitude', 'demeanor',
        'manner', 'style', 'approach', 'method'
      ];
      const hasToneBias = tonePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasToneBias) score += 0.2;

      return Math.min(1, score);
    } catch (error) {
      this.logger.error('Failed to calculate language bias', error);
      return 1;
    }
  }

  /**
   * Calculates the perspective bias score
   * @param result The result to evaluate
   * @returns The perspective bias score
   */
  private calculatePerspectiveBias(result: any): number {
    try {
      const text = result.content || result.text || '';
      let score = 0.0;

      // Check for viewpoint bias
      const viewpointPhrases = [
        'viewpoint', 'perspective', 'standpoint', 'position',
        'opinion', 'view', 'stance', 'attitude'
      ];
      const hasViewpointBias = viewpointPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasViewpointBias) score += 0.3;

      // Check for value bias
      const valuePhrases = [
        'value', 'belief', 'principle', 'ethic',
        'moral', 'virtue', 'ideal', 'standard'
      ];
      const hasValueBias = valuePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasValueBias) score += 0.3;

      // Check for assumption bias
      const assumptionPhrases = [
        'assume', 'presume', 'suppose', 'imply',
        'suggest', 'indicate', 'hint', 'insinuate'
      ];
      const hasAssumptionBias = assumptionPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasAssumptionBias) score += 0.2;

      // Check for judgment bias
      const judgmentPhrases = [
        'judge', 'evaluate', 'assess', 'appraise',
        'criticize', 'praise', 'commend', 'condemn'
      ];
      const hasJudgmentBias = judgmentPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (hasJudgmentBias) score += 0.2;

      return Math.min(1, score);
    } catch (error) {
      this.logger.error('Failed to calculate perspective bias', error);
      return 1;
    }
  }
} 