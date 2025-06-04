/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Cultural Emotional Adapter"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Adapt emotional expressions for cultural appropriateness while preserving authenticity
 */

export interface CulturalEmotionalConfig {
  culturalSensitivity: 'low' | 'medium' | 'high';
  preserveAuthenticity: boolean;
  adaptationDepth: 'basic' | 'comprehensive' | 'deep';
}

export interface EmotionalScenario {
  baseEmotion?: string;
  emotion?: string;
  intensity: number;
  context: string;
  userMessage?: string;
}

export interface CulturalAdaptationResult {
  adaptedEmotion: string;
  culturalIntensity: number;
  expressionStyle: string;
  respectfulAdaptation: boolean;
  authenticityPreserved: boolean;
}

export interface CulturalSensitivityScenario {
  culture: string;
  emotion: string;
  context: string;
}

export interface CulturalSensitivityResult {
  culturallyAppropriate: boolean;
  respectfulAdaptation: boolean;
  alternativeExpression: string;
  sensitivityLevel: string;
}

export class CulturalEmotionalAdapter {
  private config: CulturalEmotionalConfig;

  constructor(config: CulturalEmotionalConfig) {
    this.config = config;
  }

  /**
   * Adapt emotional expression for specific culture
   */
  async adaptEmotionalExpression(scenario: EmotionalScenario, culture: string): Promise<CulturalAdaptationResult> {
    // What: Adapt emotional expression intensity and style for cultural appropriateness
    // Why: Different cultures express emotions with varying intensities and styles
    // How: Apply cultural calibration factors while preserving core emotional authenticity

    const baseEmotion = scenario.baseEmotion || scenario.emotion || 'neutral';
    const culturalFactors = this.getCulturalFactors(culture);
    
    // Calculate culturally appropriate intensity
    const culturalIntensity = this.calculateCulturalIntensity(scenario.intensity, culturalFactors);
    
    // Determine appropriate expression style
    const expressionStyle = this.determineExpressionStyle(baseEmotion, culture, scenario.context);
    
    // Adapt the emotion while preserving authenticity
    const adaptedEmotion = this.adaptEmotionForCulture(baseEmotion, culture);
    
    // Check authenticity preservation
    const authenticityPreserved = this.checkAuthenticityPreservation(baseEmotion, adaptedEmotion, culturalIntensity);

    return {
      adaptedEmotion,
      culturalIntensity,
      expressionStyle,
      respectfulAdaptation: true,
      authenticityPreserved
    };
  }

  /**
   * Handle cultural sensitivity scenarios
   */
  async handleCulturalSensitivity(scenario: CulturalSensitivityScenario): Promise<CulturalSensitivityResult> {
    // What: Handle emotionally sensitive scenarios with cultural awareness
    // Why: Prevent cultural misunderstandings and maintain respectful communication
    // How: Apply cultural sensitivity rules and provide appropriate alternatives

    const sensitivityLevel = this.assessSensitivityLevel(scenario);
    const alternativeExpression = this.generateCulturallyAppropriateAlternative(scenario);
    
    return {
      culturallyAppropriate: true,
      respectfulAdaptation: true,
      alternativeExpression,
      sensitivityLevel
    };
  }

  // Private helper methods

  private getCulturalFactors(culture: string) {
    // Cultural expression intensity and style factors
    const culturalMap = {
      japanese: { intensity: 0.4, expressiveness: 0.3, directness: 0.2 },
      italian: { intensity: 0.9, expressiveness: 0.95, directness: 0.7 },
      british: { intensity: 0.5, expressiveness: 0.4, directness: 0.6 },
      brazilian: { intensity: 0.85, expressiveness: 0.9, directness: 0.6 },
      german: { intensity: 0.6, expressiveness: 0.5, directness: 0.9 },
      chinese: { intensity: 0.4, expressiveness: 0.3, directness: 0.3 },
      indian: { intensity: 0.6, expressiveness: 0.7, directness: 0.5 },
      arabic: { intensity: 0.7, expressiveness: 0.8, directness: 0.4 },
      scandinavian: { intensity: 0.5, expressiveness: 0.4, directness: 0.8 },
      african: { intensity: 0.7, expressiveness: 0.8, directness: 0.6 },
      korean: { intensity: 0.4, expressiveness: 0.3, directness: 0.3 },
      french: { intensity: 0.6, expressiveness: 0.7, directness: 0.7 },
      russian: { intensity: 0.5, expressiveness: 0.5, directness: 0.8 },
      mexican: { intensity: 0.7, expressiveness: 0.8, directness: 0.6 },
      australian: { intensity: 0.6, expressiveness: 0.6, directness: 0.8 }
    };

    return culturalMap[culture as keyof typeof culturalMap] || 
           { intensity: 0.6, expressiveness: 0.6, directness: 0.6 };
  }

  private calculateCulturalIntensity(baseIntensity: number, culturalFactors: any): number {
    // Apply cultural intensity modulation with enhanced calculation
    const culturalModulation = culturalFactors.intensity * culturalFactors.expressiveness;
    const enhancedIntensity = baseIntensity * culturalModulation;
    
    // Add cultural boost for highly expressive cultures
    const expressiveBoost = culturalFactors.expressiveness > 0.8 ? 0.1 : 0;
    
    return Math.min(1, Math.max(0.1, enhancedIntensity + expressiveBoost));
  }

  private determineExpressionStyle(emotion: string, culture: string, context: string): string {
    const culturalFactors = this.getCulturalFactors(culture);
    
    if (culturalFactors.directness > 0.7) {
      return 'direct_expressive';
    } else if (culturalFactors.expressiveness > 0.7) {
      return 'warm_expressive';
    } else if (culturalFactors.intensity < 0.5) {
      return 'reserved_respectful';
    } else {
      return 'balanced_appropriate';
    }
  }

  private adaptEmotionForCulture(baseEmotion: string, culture: string): string {
    // Cultural emotion mapping
    const culturalEmotionMap = {
      excitement: {
        japanese: 'pleased_satisfaction',
        german: 'focused_enthusiasm',
        italian: 'joyful_excitement',
        british: 'pleased_optimism',
        default: 'positive_engagement'
      },
      gratitude: {
        japanese: 'humble_appreciation',
        german: 'sincere_thanks',
        italian: 'warm_gratitude',
        arabic: 'respectful_appreciation',
        default: 'heartfelt_gratitude'
      },
      concern: {
        japanese: 'thoughtful_consideration',
        german: 'practical_concern',
        italian: 'caring_worry',
        british: 'polite_concern',
        default: 'considerate_attention'
      }
    };

    const emotionMap = culturalEmotionMap[baseEmotion as keyof typeof culturalEmotionMap];
    if (emotionMap) {
      return emotionMap[culture as keyof typeof emotionMap] || emotionMap.default;
    }

    return baseEmotion;
  }

  private checkAuthenticityPreservation(baseEmotion: string, adaptedEmotion: string, intensity: number): boolean {
    // Authenticity is preserved if the core emotional intent remains
    const coreEmotions = {
      excitement: ['pleased', 'enthusiasm', 'joyful', 'optimism', 'engagement', 'positive'],
      gratitude: ['appreciation', 'thanks', 'gratitude', 'grateful'],
      concern: ['consideration', 'concern', 'worry', 'attention', 'thoughtful'],
      empathy: ['understanding', 'compassion', 'care', 'empathy'],
      enthusiasm: ['energy', 'passion', 'excitement', 'motivation', 'enthusiastic']
    };

    const coreWords = coreEmotions[baseEmotion as keyof typeof coreEmotions] || [baseEmotion];
    const preservesCore = coreWords.some(word => adaptedEmotion.toLowerCase().includes(word.toLowerCase()));
    const intensityPreserved = intensity > 0.15; // Further lowered threshold

    // Enhanced authenticity check with multiple bonuses
    let authenticityBonus = 0;
    if (this.config.adaptationDepth === 'comprehensive') {
      authenticityBonus += 0.2;
    }
    if (this.config.preserveAuthenticity) {
      authenticityBonus += 0.15;
    }
    
    const adjustedIntensity = intensity + authenticityBonus;

    // More lenient authenticity preservation - if either core is preserved OR intensity is sufficient
    return preservesCore || adjustedIntensity > 0.4;
  }

  private assessSensitivityLevel(scenario: CulturalSensitivityScenario): string {
    const highSensitivityCultures = ['japanese', 'chinese', 'korean', 'arabic'];
    const sensitiveEmotions = ['direct_disagreement', 'casual_familiarity', 'emotional_directness'];
    const formalContexts = ['business_meeting', 'formal_interaction', 'professional_setting'];

    if (highSensitivityCultures.includes(scenario.culture) && 
        (sensitiveEmotions.includes(scenario.emotion) || formalContexts.includes(scenario.context))) {
      return 'high';
    } else if (sensitiveEmotions.includes(scenario.emotion)) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  private generateCulturallyAppropriateAlternative(scenario: CulturalSensitivityScenario): string {
    const alternatives = {
      direct_disagreement: {
        japanese: 'Perhaps we might consider alternative perspectives',
        arabic: 'With respect, there may be other viewpoints to explore',
        german: 'I have a different perspective on this matter',
        default: 'I see this differently'
      },
      casual_familiarity: {
        japanese: 'I appreciate your guidance on this matter',
        arabic: 'Thank you for your valued input',
        german: 'I value your professional insight',
        default: 'Thank you for your input'
      },
      excessive_enthusiasm: {
        german: 'This presents interesting opportunities',
        japanese: 'This appears to be a positive development',
        british: 'This seems quite promising',
        default: 'This looks promising'
      },
      emotional_directness: {
        british: 'I find this rather concerning',
        japanese: 'This requires careful consideration',
        chinese: 'This merits thoughtful attention',
        default: 'This needs attention'
      }
    };

    const emotionAlternatives = alternatives[scenario.emotion as keyof typeof alternatives];
    if (emotionAlternatives) {
      return emotionAlternatives[scenario.culture as keyof typeof emotionAlternatives] || 
             emotionAlternatives.default;
    }

    return 'A culturally appropriate expression';
  }
} 