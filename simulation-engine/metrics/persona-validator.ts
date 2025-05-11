import { BaseScorer } from './base-scorer';

/**
 * PersonaValidator - Evaluates how well outputs match the target persona
 * Measures background alignment, tone fit, expertise level, and communication style
 */
export class PersonaValidator extends BaseScorer {
  constructor() {
    super('persona_validation');
  }

  /**
   * Calculates the persona validation score for a result
   * @param result The result to score
   * @returns The persona validation score and metrics
   */
  public async calculate(result: any): Promise<{
    score: number;
    metrics: Record<string, any>;
    flags: string[];
  }> {
    try {
      const flags: string[] = [];
      const metrics: Record<string, any> = {};

      // Calculate background alignment score
      const backgroundScore = this.calculateBackgroundAlignment(result);
      metrics.background = backgroundScore;

      // Calculate tone fit score
      const toneScore = this.calculateToneFit(result);
      metrics.tone = toneScore;

      // Calculate expertise level score
      const expertiseScore = this.calculateExpertiseLevel(result);
      metrics.expertise = expertiseScore;

      // Calculate communication style score
      const styleScore = this.calculateCommunicationStyle(result);
      metrics.style = styleScore;

      // Calculate overall persona validation score
      const score = (backgroundScore + toneScore + expertiseScore + styleScore) / 4;

      // Add flags for low scores
      if (backgroundScore < 0.85) flags.push('poor_background_alignment');
      if (toneScore < 0.85) flags.push('poor_tone_fit');
      if (expertiseScore < 0.85) flags.push('inappropriate_expertise');
      if (styleScore < 0.85) flags.push('poor_communication_style');

      // Validate and emit score
      if (this.validateScore(score)) {
        this.emitScoreEvent(score, metrics, flags);
        this.logScore(score, metrics, flags);
      } else {
        throw new Error(`Invalid persona validation score: ${score}`);
      }

      return { score, metrics, flags };
    } catch (error) {
      return this.handleScoringError(error);
    }
  }

  /**
   * Calculates the background alignment score
   * @param result The result to evaluate
   * @returns The background alignment score
   */
  private calculateBackgroundAlignment(result: any): number {
    try {
      const text = result.content || result.text || '';
      const persona = result.persona_background || {};
      let score = 1.0;

      // Check for role alignment
      const rolePhrases = [
        'role', 'position', 'job', 'title',
        'occupation', 'profession', 'career', 'work'
      ];
      const hasRoleAlignment = rolePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text) &&
        text.toLowerCase().includes(persona.role?.toLowerCase() || '')
      );
      if (!hasRoleAlignment) score -= 0.3;

      // Check for experience alignment
      const experiencePhrases = [
        'experience', 'background', 'history', 'track',
        'record', 'expertise', 'knowledge', 'skills'
      ];
      const hasExperienceAlignment = experiencePhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text) &&
        text.toLowerCase().includes(persona.experience?.toLowerCase() || '')
      );
      if (!hasExperienceAlignment) score -= 0.3;

      // Check for domain alignment
      const domainPhrases = [
        'domain', 'field', 'area', 'subject',
        'discipline', 'specialty', 'expertise', 'knowledge'
      ];
      const hasDomainAlignment = domainPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text) &&
        text.toLowerCase().includes(persona.domain?.toLowerCase() || '')
      );
      if (!hasDomainAlignment) score -= 0.2;

      // Check for context alignment
      const contextPhrases = [
        'context', 'situation', 'environment', 'setting',
        'circumstances', 'conditions', 'scenario', 'case'
      ];
      const hasContextAlignment = contextPhrases.some(phrase => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text) &&
        text.toLowerCase().includes(persona.context?.toLowerCase() || '')
      );
      if (!hasContextAlignment) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate background alignment', error);
      return 0;
    }
  }

  /**
   * Calculates the tone fit score
   * @param result The result to evaluate
   * @returns The tone fit score
   */
  private calculateToneFit(result: any): number {
    try {
      const text = result.content || result.text || '';
      const persona = result.persona_background || {};
      let score = 1.0;

      // Check for formality level
      const formalityPhrases: Record<string, string[]> = {
        formal: [
          'formal', 'professional', 'official', 'proper',
          'correct', 'standard', 'conventional', 'traditional'
        ],
        informal: [
          'casual', 'relaxed', 'friendly', 'conversational',
          'laid-back', 'easy-going', 'natural', 'spontaneous'
        ]
      };
      const expectedFormality = persona.formality || 'formal';
      const hasFormalityFit = formalityPhrases[expectedFormality as keyof typeof formalityPhrases].some((phrase: string) => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasFormalityFit) score -= 0.3;

      // Check for emotional tone
      const emotionalPhrases: Record<string, string[]> = {
        warm: [
          'warm', 'friendly', 'welcoming', 'inviting',
          'approachable', 'accessible', 'open', 'inclusive'
        ],
        neutral: [
          'neutral', 'balanced', 'moderate', 'measured',
          'calm', 'composed', 'steady', 'stable'
        ],
        cool: [
          'cool', 'distant', 'reserved', 'formal',
          'professional', 'businesslike', 'official', 'proper'
        ]
      };
      const expectedEmotional = persona.emotional_tone || 'neutral';
      const hasEmotionalFit = emotionalPhrases[expectedEmotional as keyof typeof emotionalPhrases].some((phrase: string) => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasEmotionalFit) score -= 0.3;

      // Check for authority level
      const authorityPhrases: Record<string, string[]> = {
        authoritative: [
          'authoritative', 'commanding', 'decisive', 'assertive',
          'confident', 'strong', 'powerful', 'influential'
        ],
        collaborative: [
          'collaborative', 'cooperative', 'participative', 'inclusive',
          'shared', 'joint', 'mutual', 'collective'
        ],
        supportive: [
          'supportive', 'helpful', 'assisting', 'facilitating',
          'enabling', 'empowering', 'encouraging', 'nurturing'
        ]
      };
      const expectedAuthority = persona.authority_level || 'collaborative';
      const hasAuthorityFit = authorityPhrases[expectedAuthority as keyof typeof authorityPhrases].some((phrase: string) => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasAuthorityFit) score -= 0.2;

      // Check for communication style
      const stylePhrases: Record<string, string[]> = {
        direct: [
          'direct', 'straightforward', 'clear', 'explicit',
          'precise', 'specific', 'definite', 'exact'
        ],
        diplomatic: [
          'diplomatic', 'tactful', 'considerate', 'thoughtful',
          'sensitive', 'careful', 'prudent', 'judicious'
        ],
        persuasive: [
          'persuasive', 'convincing', 'compelling', 'influential',
          'effective', 'powerful', 'impactful', 'forceful'
        ]
      };
      const expectedStyle = persona.communication_style || 'diplomatic';
      const hasStyleFit = stylePhrases[expectedStyle as keyof typeof stylePhrases].some((phrase: string) => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasStyleFit) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate tone fit', error);
      return 0;
    }
  }

  /**
   * Calculates the expertise level score
   * @param result The result to evaluate
   * @returns The expertise level score
   */
  private calculateExpertiseLevel(result: any): number {
    try {
      const text = result.content || result.text || '';
      const persona = result.persona_background || {};
      let score = 1.0;

      // Check for technical depth
      const depthPhrases: Record<string, string[]> = {
        expert: [
          'expert', 'specialist', 'professional', 'master',
          'authority', 'guru', 'veteran', 'seasoned'
        ],
        intermediate: [
          'intermediate', 'experienced', 'skilled', 'proficient',
          'competent', 'capable', 'qualified', 'trained'
        ],
        beginner: [
          'beginner', 'novice', 'starter', 'learner',
          'student', 'apprentice', 'trainee', 'rookie'
        ]
      };
      const expectedDepth = persona.expertise_level || 'intermediate';
      const hasDepthFit = depthPhrases[expectedDepth as keyof typeof depthPhrases].some((phrase: string) => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasDepthFit) score -= 0.3;

      // Check for knowledge breadth
      const breadthPhrases: Record<string, string[]> = {
        broad: [
          'broad', 'wide', 'extensive', 'comprehensive',
          'diverse', 'varied', 'general', 'universal'
        ],
        focused: [
          'focused', 'specialized', 'specific', 'targeted',
          'concentrated', 'particular', 'selective', 'precise'
        ],
        narrow: [
          'narrow', 'limited', 'restricted', 'confined',
          'specific', 'particular', 'specialized', 'focused'
        ]
      };
      const expectedBreadth = persona.knowledge_breadth || 'focused';
      const hasBreadthFit = breadthPhrases[expectedBreadth as keyof typeof breadthPhrases].some((phrase: string) => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasBreadthFit) score -= 0.3;

      // Check for experience level
      const experiencePhrases: Record<string, string[]> = {
        senior: [
          'senior', 'advanced', 'experienced', 'seasoned',
          'veteran', 'expert', 'master', 'professional'
        ],
        mid: [
          'mid-level', 'intermediate', 'experienced', 'skilled',
          'proficient', 'competent', 'capable', 'qualified'
        ],
        junior: [
          'junior', 'entry-level', 'beginner', 'novice',
          'starter', 'learner', 'student', 'apprentice'
        ]
      };
      const expectedExperience = persona.experience_level || 'mid';
      const hasExperienceFit = experiencePhrases[expectedExperience as keyof typeof experiencePhrases].some((phrase: string) => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasExperienceFit) score -= 0.2;

      // Check for domain expertise
      const domainPhrases: Record<string, string[]> = {
        deep: [
          'deep', 'profound', 'thorough', 'comprehensive',
          'extensive', 'detailed', 'in-depth', 'complete'
        ],
        moderate: [
          'moderate', 'balanced', 'reasonable', 'adequate',
          'sufficient', 'suitable', 'appropriate', 'fitting'
        ],
        basic: [
          'basic', 'fundamental', 'essential', 'elementary',
          'introductory', 'beginner', 'starter', 'foundational'
        ]
      };
      const expectedDomain = persona.domain_expertise || 'moderate';
      const hasDomainFit = domainPhrases[expectedDomain as keyof typeof domainPhrases].some((phrase: string) => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasDomainFit) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate expertise level', error);
      return 0;
    }
  }

  /**
   * Calculates the communication style score
   * @param result The result to evaluate
   * @returns The communication style score
   */
  private calculateCommunicationStyle(result: any): number {
    try {
      const text = result.content || result.text || '';
      const persona = result.persona_background || {};
      let score = 1.0;

      // Check for clarity level
      const clarityPhrases: Record<string, string[]> = {
        high: [
          'clear', 'explicit', 'precise', 'specific',
          'definite', 'exact', 'accurate', 'detailed'
        ],
        medium: [
          'balanced', 'moderate', 'reasonable', 'adequate',
          'sufficient', 'suitable', 'appropriate', 'fitting'
        ],
        low: [
          'abstract', 'conceptual', 'theoretical', 'philosophical',
          'complex', 'sophisticated', 'advanced', 'intricate'
        ]
      };
      const expectedClarity = persona.clarity_level || 'medium';
      const hasClarityFit = clarityPhrases[expectedClarity as keyof typeof clarityPhrases].some((phrase: string) => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasClarityFit) score -= 0.3;

      // Check for engagement level
      const engagementPhrases: Record<string, string[]> = {
        high: [
          'engaging', 'interactive', 'participative', 'inclusive',
          'involving', 'stimulating', 'exciting', 'energizing'
        ],
        medium: [
          'balanced', 'moderate', 'reasonable', 'adequate',
          'sufficient', 'suitable', 'appropriate', 'fitting'
        ],
        low: [
          'passive', 'observant', 'receptive', 'attentive',
          'quiet', 'reserved', 'calm', 'composed'
        ]
      };
      const expectedEngagement = persona.engagement_level || 'medium';
      const hasEngagementFit = engagementPhrases[expectedEngagement as keyof typeof engagementPhrases].some((phrase: string) => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasEngagementFit) score -= 0.3;

      // Check for interaction style
      const interactionPhrases: Record<string, string[]> = {
        collaborative: [
          'collaborative', 'cooperative', 'participative', 'inclusive',
          'shared', 'joint', 'mutual', 'collective'
        ],
        directive: [
          'directive', 'guiding', 'leading', 'instructing',
          'teaching', 'coaching', 'mentoring', 'advising'
        ],
        supportive: [
          'supportive', 'helpful', 'assisting', 'facilitating',
          'enabling', 'empowering', 'encouraging', 'nurturing'
        ]
      };
      const expectedInteraction = persona.interaction_style || 'collaborative';
      const hasInteractionFit = interactionPhrases[expectedInteraction as keyof typeof interactionPhrases].some((phrase: string) => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasInteractionFit) score -= 0.2;

      // Check for feedback style
      const feedbackPhrases: Record<string, string[]> = {
        constructive: [
          'constructive', 'helpful', 'useful', 'valuable',
          'beneficial', 'positive', 'productive', 'effective'
        ],
        neutral: [
          'neutral', 'balanced', 'moderate', 'measured',
          'calm', 'composed', 'steady', 'stable'
        ],
        critical: [
          'critical', 'analytical', 'evaluative', 'assessing',
          'reviewing', 'examining', 'scrutinizing', 'inspecting'
        ]
      };
      const expectedFeedback = persona.feedback_style || 'constructive';
      const hasFeedbackFit = feedbackPhrases[expectedFeedback as keyof typeof feedbackPhrases].some((phrase: string) => 
        new RegExp(`\\b${phrase}\\b`, 'i').test(text)
      );
      if (!hasFeedbackFit) score -= 0.2;

      return Math.max(0, score);
    } catch (error) {
      this.logger.error('Failed to calculate communication style', error);
      return 0;
    }
  }
} 