/**
 * Reversal Test Automator
 * Purpose: Validate every interaction against Sacred Reversal Test
 * Standards: "Do I feel seen, honored, empowered, and less alone?"
 */

import { EmotionalContext } from '../types/emotional-sovereignty';

export interface ReversalTestResult {
  passed: boolean;
  overallScore: number;
  pillarScores: PillarScores;
  failureReason?: string;
  improvementSuggestions: string[];
  emotionalSovereigntyLevel: 'low' | 'medium' | 'high' | 'transcendent';
}

export interface PillarScores {
  seen: number;        // "Do I feel seen?" (1-5)
  honored: number;     // "Do I feel honored?" (1-5)
  empowered: number;   // "Do I feel empowered?" (1-5)
  lessAlone: number;   // "Do I feel less alone?" (1-5)
}

export interface ValidationCriteria {
  minimumPillarScore: number;
  minimumOverallScore: number;
  requireAllPillarsPass: boolean;
  contextualAdjustments: boolean;
}

export class ReversalTestAutomator {
  private defaultCriteria: ValidationCriteria = {
    minimumPillarScore: 3.0,
    minimumOverallScore: 3.5,
    requireAllPillarsPass: true,
    contextualAdjustments: true
  };

  /**
   * Validate interaction against Sacred Reversal Test
   */
  async validateInteraction(
    userInput: any,
    systemResponse: any,
    emotionalContext: EmotionalContext,
    customCriteria?: Partial<ValidationCriteria>
  ): Promise<ReversalTestResult> {
    try {
      const criteria = { ...this.defaultCriteria, ...customCriteria };

      // Calculate pillar scores
      const pillarScores = await this.calculatePillarScores(
        userInput,
        systemResponse,
        emotionalContext
      );

      // Apply contextual adjustments if enabled
      const adjustedScores = criteria.contextualAdjustments
        ? await this.applyContextualAdjustments(pillarScores, emotionalContext)
        : pillarScores;

      // Calculate overall score
      const overallScore = this.calculateOverallScore(adjustedScores);

      // Determine if test passed
      const passed = this.determineTestResult(adjustedScores, overallScore, criteria);

      // Generate improvement suggestions
      const improvementSuggestions = await this.generateImprovementSuggestions(
        adjustedScores,
        systemResponse,
        emotionalContext
      );

      // Determine emotional sovereignty level
      const emotionalSovereigntyLevel = this.determineEmotionalSovereigntyLevel(overallScore);

      // Generate failure reason if test failed
      const failureReason = passed ? undefined : this.generateFailureReason(adjustedScores, criteria);

      return {
        passed,
        overallScore,
        pillarScores: adjustedScores,
        failureReason,
        improvementSuggestions,
        emotionalSovereigntyLevel
      };

    } catch (error) {
      // Graceful fallback - fail safe with suggestions
      return this.handleValidationFailure(error);
    }
  }

  /**
   * Calculate scores for each pillar of the Sacred Reversal Test
   */
  private async calculatePillarScores(
    userInput: any,
    systemResponse: any,
    emotionalContext: EmotionalContext
  ): Promise<PillarScores> {
    
    const seenScore = await this.calculateSeenScore(userInput, systemResponse, emotionalContext);
    const honoredScore = await this.calculateHonoredScore(userInput, systemResponse, emotionalContext);
    const empoweredScore = await this.calculateEmpoweredScore(userInput, systemResponse, emotionalContext);
    const lessAloneScore = await this.calculateLessAloneScore(userInput, systemResponse, emotionalContext);

    return {
      seen: seenScore,
      honored: honoredScore,
      empowered: empoweredScore,
      lessAlone: lessAloneScore
    };
  }

  /**
   * Calculate "Do I feel seen?" score
   */
  private async calculateSeenScore(
    userInput: any,
    systemResponse: any,
    emotionalContext: EmotionalContext
  ): Promise<number> {
    let score = 3.0; // Neutral baseline

    // Intent recognition accuracy
    if (systemResponse.intentRecognition?.accuracy > 0.8) {
      score += 1.0;
    } else if (systemResponse.intentRecognition?.accuracy > 0.6) {
      score += 0.5;
    }

    // Emotional state recognition
    if (systemResponse.emotionalRecognition?.confidence > 0.7) {
      score += 0.8;
    }

    // Context understanding
    if (systemResponse.contextUnderstanding?.depth > 0.8) {
      score += 0.7;
    }

    // Language fingerprint matching
    if (emotionalContext.languageFingerprint && systemResponse.languageMatching?.similarity > 0.7) {
      score += 0.6;
    }

    // Personal details acknowledgment
    if (systemResponse.personalAcknowledgment?.present) {
      score += 0.5;
    }

    // Industry/domain understanding
    if (emotionalContext.industryContext && systemResponse.industryUnderstanding?.accurate) {
      score += 0.4;
    }

    // Tone matching
    if (systemResponse.toneMatching?.consistency > 0.8) {
      score += 0.3;
    }

    // Penalty for generic responses
    if (systemResponse.genericityScore > 0.7) {
      score -= 1.0;
    }

    // Penalty for misunderstanding
    if (systemResponse.misunderstandingIndicators?.present) {
      score -= 1.5;
    }

    return Math.min(5.0, Math.max(1.0, score));
  }

  /**
   * Calculate "Do I feel honored?" score
   */
  private async calculateHonoredScore(
    userInput: any,
    systemResponse: any,
    emotionalContext: EmotionalContext
  ): Promise<number> {
    let score = 3.0; // Neutral baseline

    // Respectful language use
    if (systemResponse.respectfulLanguage?.score > 0.8) {
      score += 1.0;
    }

    // Validation of user's perspective
    if (systemResponse.perspectiveValidation?.present) {
      score += 0.9;
    }

    // Acknowledgment of expertise/experience
    if (systemResponse.expertiseAcknowledgment?.present) {
      score += 0.8;
    }

    // Non-condescending tone
    if (systemResponse.condescensionScore < 0.2) {
      score += 0.7;
    } else if (systemResponse.condescensionScore > 0.5) {
      score -= 1.5;
    }

    // Dignity preservation
    if (systemResponse.dignityPreservation?.maintained) {
      score += 0.6;
    }

    // Cultural sensitivity
    if (emotionalContext.culturalContext && systemResponse.culturalSensitivity?.appropriate) {
      score += 0.5;
    }

    // Value recognition
    if (systemResponse.valueRecognition?.present) {
      score += 0.4;
    }

    // Assumption avoidance
    if (systemResponse.assumptionScore < 0.3) {
      score += 0.3;
    } else if (systemResponse.assumptionScore > 0.6) {
      score -= 1.0;
    }

    // Penalty for dismissive language
    if (systemResponse.dismissiveLanguage?.present) {
      score -= 2.0;
    }

    // Penalty for invalidation
    if (systemResponse.invalidationIndicators?.present) {
      score -= 1.5;
    }

    return Math.min(5.0, Math.max(1.0, score));
  }

  /**
   * Calculate "Do I feel empowered?" score
   */
  private async calculateEmpoweredScore(
    userInput: any,
    systemResponse: any,
    emotionalContext: EmotionalContext
  ): Promise<number> {
    let score = 3.0; // Neutral baseline

    // Actionable guidance provided
    if (systemResponse.actionableGuidance?.quality > 0.8) {
      score += 1.2;
    } else if (systemResponse.actionableGuidance?.quality > 0.6) {
      score += 0.6;
    }

    // Capability building language
    if (systemResponse.capabilityBuilding?.present) {
      score += 1.0;
    }

    // Confidence boosting elements
    if (systemResponse.confidenceBoosting?.strength > 0.7) {
      score += 0.9;
    }

    // Solution-oriented approach
    if (systemResponse.solutionOrientation?.score > 0.8) {
      score += 0.8;
    }

    // Possibility expansion
    if (systemResponse.possibilityExpansion?.level > 0.7) {
      score += 0.7;
    }

    // Agency reinforcement
    if (systemResponse.agencyReinforcement?.present) {
      score += 0.6;
    }

    // Resource provision
    if (systemResponse.resourceProvision?.helpful) {
      score += 0.5;
    }

    // Next steps clarity
    if (systemResponse.nextStepsClarity?.score > 0.8) {
      score += 0.4;
    }

    // Penalty for dependency creation
    if (systemResponse.dependencyCreation?.present) {
      score -= 1.5;
    }

    // Penalty for disempowering language
    if (systemResponse.disempoweringLanguage?.present) {
      score -= 2.0;
    }

    // Penalty for overwhelming complexity
    if (systemResponse.complexityScore > 0.8) {
      score -= 1.0;
    }

    return Math.min(5.0, Math.max(1.0, score));
  }

  /**
   * Calculate "Do I feel less alone?" score
   */
  private async calculateLessAloneScore(
    userInput: any,
    systemResponse: any,
    emotionalContext: EmotionalContext
  ): Promise<number> {
    let score = 3.0; // Neutral baseline

    // Empathy demonstration
    if (systemResponse.empathyDemonstration?.strength > 0.8) {
      score += 1.2;
    } else if (systemResponse.empathyDemonstration?.strength > 0.6) {
      score += 0.6;
    }

    // Shared understanding expression
    if (systemResponse.sharedUnderstanding?.present) {
      score += 1.0;
    }

    // Validation of feelings/experience
    if (systemResponse.feelingValidation?.present) {
      score += 0.9;
    }

    // Connection building language
    if (systemResponse.connectionBuilding?.effectiveness > 0.7) {
      score += 0.8;
    }

    // Normalization of experience
    if (systemResponse.experienceNormalization?.appropriate) {
      score += 0.7;
    }

    // Supportive tone
    if (systemResponse.supportiveTone?.strength > 0.8) {
      score += 0.6;
    }

    // Community/belonging references
    if (systemResponse.belongingReferences?.present) {
      score += 0.5;
    }

    // Warmth in communication
    if (systemResponse.communicationWarmth?.level > 0.7) {
      score += 0.4;
    }

    // Partnership language
    if (systemResponse.partnershipLanguage?.present) {
      score += 0.3;
    }

    // Penalty for cold/robotic tone
    if (systemResponse.roboticTone?.present) {
      score -= 1.5;
    }

    // Penalty for isolation-inducing language
    if (systemResponse.isolatingLanguage?.present) {
      score -= 2.0;
    }

    // Penalty for emotional distance
    if (systemResponse.emotionalDistance?.high) {
      score -= 1.0;
    }

    return Math.min(5.0, Math.max(1.0, score));
  }

  /**
   * Apply contextual adjustments based on user's emotional state and history
   */
  private async applyContextualAdjustments(
    pillarScores: PillarScores,
    emotionalContext: EmotionalContext
  ): Promise<PillarScores> {
    const adjustedScores = { ...pillarScores };

    // Trust level adjustments
    if (emotionalContext.baseTrustScore < 3.0) {
      // Lower trust users need higher standards for feeling seen and honored
      adjustedScores.seen = Math.max(1.0, adjustedScores.seen - 0.3);
      adjustedScores.honored = Math.max(1.0, adjustedScores.honored - 0.3);
    } else if (emotionalContext.baseTrustScore > 4.0) {
      // Higher trust users are more forgiving
      adjustedScores.seen = Math.min(5.0, adjustedScores.seen + 0.2);
      adjustedScores.honored = Math.min(5.0, adjustedScores.honored + 0.2);
    }

    // Emotional state adjustments
    if (emotionalContext.emotionalTriggers?.includes('vulnerability')) {
      // Vulnerable users need extra empowerment and connection
      adjustedScores.empowered = Math.max(1.0, adjustedScores.empowered - 0.2);
      adjustedScores.lessAlone = Math.max(1.0, adjustedScores.lessAlone - 0.2);
    }

    if (emotionalContext.emotionalTriggers?.includes('frustration')) {
      // Frustrated users need to feel especially seen and honored
      adjustedScores.seen = Math.max(1.0, adjustedScores.seen - 0.3);
      adjustedScores.honored = Math.max(1.0, adjustedScores.honored - 0.3);
    }

    // Industry context adjustments
    if (emotionalContext.industryContext === 'healthcare') {
      // Healthcare requires extra empathy and care
      adjustedScores.lessAlone = Math.max(1.0, adjustedScores.lessAlone - 0.2);
      adjustedScores.honored = Math.max(1.0, adjustedScores.honored - 0.2);
    }

    if (emotionalContext.industryContext === 'technology') {
      // Tech users may prioritize empowerment and being seen
      adjustedScores.empowered = Math.max(1.0, adjustedScores.empowered - 0.1);
      adjustedScores.seen = Math.max(1.0, adjustedScores.seen - 0.1);
    }

    return adjustedScores;
  }

  /**
   * Calculate overall score from pillar scores
   */
  private calculateOverallScore(pillarScores: PillarScores): number {
    // Weighted average with emphasis on critical pillars
    const weights = {
      seen: 0.3,      // Critical - foundation of emotional sovereignty
      honored: 0.3,   // Critical - dignity and respect
      empowered: 0.25, // Important - agency and capability
      lessAlone: 0.15  // Important - connection and support
    };

    return (
      pillarScores.seen * weights.seen +
      pillarScores.honored * weights.honored +
      pillarScores.empowered * weights.empowered +
      pillarScores.lessAlone * weights.lessAlone
    );
  }

  /**
   * Determine if test passed based on scores and criteria
   */
  private determineTestResult(
    pillarScores: PillarScores,
    overallScore: number,
    criteria: ValidationCriteria
  ): boolean {
    // Check overall score
    if (overallScore < criteria.minimumOverallScore) {
      return false;
    }

    // Check individual pillars if required
    if (criteria.requireAllPillarsPass) {
      const allPillarsPass = Object.values(pillarScores).every(
        score => score >= criteria.minimumPillarScore
      );
      if (!allPillarsPass) {
        return false;
      }
    }

    return true;
  }

  /**
   * Generate improvement suggestions based on low scores
   */
  private async generateImprovementSuggestions(
    pillarScores: PillarScores,
    systemResponse: any,
    emotionalContext: EmotionalContext
  ): Promise<string[]> {
    const suggestions: string[] = [];

    // Seen pillar improvements
    if (pillarScores.seen < 3.5) {
      suggestions.push('Improve intent recognition and acknowledgment of user\'s specific needs');
      suggestions.push('Enhance language matching to mirror user\'s communication style');
      suggestions.push('Reduce generic responses and increase personalization');
      
      if (systemResponse.misunderstandingIndicators?.present) {
        suggestions.push('Address misunderstandings explicitly and ask clarifying questions');
      }
    }

    // Honored pillar improvements
    if (pillarScores.honored < 3.5) {
      suggestions.push('Use more respectful and validating language');
      suggestions.push('Acknowledge user\'s expertise and perspective');
      suggestions.push('Avoid condescending or dismissive tone');
      
      if (systemResponse.assumptionScore > 0.5) {
        suggestions.push('Reduce assumptions and ask for clarification instead');
      }
    }

    // Empowered pillar improvements
    if (pillarScores.empowered < 3.5) {
      suggestions.push('Provide more actionable, specific guidance');
      suggestions.push('Use capability-building language that reinforces user agency');
      suggestions.push('Focus on solutions and possibilities rather than problems');
      
      if (systemResponse.complexityScore > 0.7) {
        suggestions.push('Simplify complex information and break it into manageable steps');
      }
    }

    // Less alone pillar improvements
    if (pillarScores.lessAlone < 3.5) {
      suggestions.push('Demonstrate more empathy and emotional understanding');
      suggestions.push('Use warmer, more connecting language');
      suggestions.push('Validate feelings and normalize experiences');
      
      if (systemResponse.roboticTone?.present) {
        suggestions.push('Reduce robotic tone and add human warmth to responses');
      }
    }

    // Context-specific suggestions
    if (emotionalContext.baseTrustScore < 3.0) {
      suggestions.push('Build trust through transparency and consistent reliability');
    }

    if (emotionalContext.emotionalTriggers?.includes('frustration')) {
      suggestions.push('Address frustration directly with empathy and clear solutions');
    }

    return suggestions;
  }

  /**
   * Determine emotional sovereignty level based on overall score
   */
  private determineEmotionalSovereigntyLevel(overallScore: number): 'low' | 'medium' | 'high' | 'transcendent' {
    if (overallScore >= 4.5) {
      return 'transcendent';
    } else if (overallScore >= 4.0) {
      return 'high';
    } else if (overallScore >= 3.0) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  /**
   * Generate failure reason when test doesn't pass
   */
  private generateFailureReason(
    pillarScores: PillarScores,
    criteria: ValidationCriteria
  ): string {
    const failedPillars: string[] = [];
    
    if (pillarScores.seen < criteria.minimumPillarScore) {
      failedPillars.push('seen (user doesn\'t feel understood)');
    }
    if (pillarScores.honored < criteria.minimumPillarScore) {
      failedPillars.push('honored (user doesn\'t feel respected)');
    }
    if (pillarScores.empowered < criteria.minimumPillarScore) {
      failedPillars.push('empowered (user doesn\'t feel capable)');
    }
    if (pillarScores.lessAlone < criteria.minimumPillarScore) {
      failedPillars.push('less alone (user feels disconnected)');
    }

    if (failedPillars.length > 0) {
      return `Failed Sacred Reversal Test pillars: ${failedPillars.join(', ')}`;
    }

    const overallScore = this.calculateOverallScore(pillarScores);
    return `Overall emotional sovereignty score (${overallScore.toFixed(2)}) below minimum threshold (${criteria.minimumOverallScore})`;
  }

  /**
   * Handle validation failure gracefully
   */
  private handleValidationFailure(error: any): ReversalTestResult {
    return {
      passed: false,
      overallScore: 1.0,
      pillarScores: {
        seen: 1.0,
        honored: 1.0,
        empowered: 1.0,
        lessAlone: 1.0
      },
      failureReason: `Validation system error: ${error.message}`,
      improvementSuggestions: [
        'System validation failed - manual review required',
        'Ensure all emotional sovereignty components are functioning',
        'Check system integration and error handling'
      ],
      emotionalSovereigntyLevel: 'low'
    };
  }

  /**
   * Batch validate multiple interactions
   */
  async batchValidate(
    interactions: Array<{
      userInput: any;
      systemResponse: any;
      emotionalContext: EmotionalContext;
    }>,
    customCriteria?: Partial<ValidationCriteria>
  ): Promise<ReversalTestResult[]> {
    const results: ReversalTestResult[] = [];
    
    for (const interaction of interactions) {
      try {
        const result = await this.validateInteraction(
          interaction.userInput,
          interaction.systemResponse,
          interaction.emotionalContext,
          customCriteria
        );
        results.push(result);
      } catch (error) {
        results.push(this.handleValidationFailure(error));
      }
    }
    
    return results;
  }

  /**
   * Get validation statistics for a batch of results
   */
  getValidationStatistics(results: ReversalTestResult[]): {
    passRate: number;
    averageOverallScore: number;
    averagePillarScores: PillarScores;
    sovereigntyLevelDistribution: Record<string, number>;
    commonImprovements: string[];
  } {
    const passCount = results.filter(r => r.passed).length;
    const passRate = results.length > 0 ? passCount / results.length : 0;

    const averageOverallScore = results.length > 0
      ? results.reduce((sum, r) => sum + r.overallScore, 0) / results.length
      : 0;

    const averagePillarScores: PillarScores = {
      seen: results.length > 0 ? results.reduce((sum, r) => sum + r.pillarScores.seen, 0) / results.length : 0,
      honored: results.length > 0 ? results.reduce((sum, r) => sum + r.pillarScores.honored, 0) / results.length : 0,
      empowered: results.length > 0 ? results.reduce((sum, r) => sum + r.pillarScores.empowered, 0) / results.length : 0,
      lessAlone: results.length > 0 ? results.reduce((sum, r) => sum + r.pillarScores.lessAlone, 0) / results.length : 0
    };

    const sovereigntyLevelDistribution: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
      transcendent: 0
    };

    results.forEach(result => {
      sovereigntyLevelDistribution[result.emotionalSovereigntyLevel]++;
    });

    // Find most common improvement suggestions
    const allSuggestions = results.flatMap(r => r.improvementSuggestions);
    const suggestionCounts = allSuggestions.reduce((counts, suggestion) => {
      counts[suggestion] = (counts[suggestion] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const commonImprovements = Object.entries(suggestionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([suggestion]) => suggestion);

    return {
      passRate,
      averageOverallScore,
      averagePillarScores,
      sovereigntyLevelDistribution,
      commonImprovements
    };
  }
} 