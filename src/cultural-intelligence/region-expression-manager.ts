/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Region-Specific Emotional Expression Manager"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Manage and adapt region-specific emotional expression patterns
 */

import { MetricsCollector } from '../../cursor/services/metrics-collector';
import { TrustMetricsCollector } from '../../src/cursor/trust/trust-metrics-collector';
import { CulturalContext } from './cultural-adapter';

export interface RegionExpressionConfig {
  regionSpecificity: 'low' | 'medium' | 'high';
  culturalAccuracy: boolean;
  expressionCalibration: 'basic' | 'standard' | 'precise';
}

export interface ExpressionPatternResult {
  detectedPattern: string;
  confidence: number;
  culturalSignificance: string;
  regionalVariation: {
    intensityModifier: number;
    expressionStyle: string;
    contextualFactors: string[];
  };
}

export interface SubregionalVariationResult {
  variation: string;
  primaryPattern: string;
  distinctiveness: number;
  culturalContext: {
    historicalInfluence: string;
    socialDynamics: string[];
    communicationStyle: string;
  };
}

export interface RegionalExpressionAdaptation {
  adaptedEmotion: string;
  adaptedIntensity: number;
  culturallyAppropriate: boolean;
  adaptationDetails: {
    [key: string]: any;
  };
}

export interface EmotionalIntentPreservation {
  originalEmotion: string;
  adaptedExpression: string;
  corePreservation: number;
  emotionalEssence: string;
}

export class RegionExpressionManager {
  private config: RegionExpressionConfig;
  private metricsCollector: MetricsCollector;
  private trustCollector: TrustMetricsCollector;
  
  // Regional expression pattern database - mapping emotions to region-specific patterns
  private readonly expressionPatterns = {
    east_asia: {
      pride: 'collective_achievement',
      happiness: 'harmonious_contentment',
      respect: 'hierarchical_deference',
      apology: 'responsibility_acknowledgment',
      gratitude: 'humble_appreciation',
      disagreement: 'harmony_preservation'
    },
    northern_europe: {
      happiness: 'reserved_contentment',
      pride: 'achievement_acknowledgment',
      respect: 'competence_recognition',
      disagreement: 'direct_factual_counterpoint',
      concern: 'practical_problem_focus',
      enthusiasm: 'measured_interest'
    },
    latin_america: {
      excitement: 'expressive_enthusiasm',
      pride: 'passionate_achievement',
      happiness: 'vibrant_joy',
      respect: 'warm_admiration',
      gratitude: 'effusive_appreciation',
      concern: 'expressive_worry'
    },
    middle_east: {
      respect: 'honorific_deference',
      pride: 'family_honor_achievement',
      gratitude: 'elaborate_appreciation',
      hospitality: 'generous_welcome',
      disagreement: 'respectful_alternative',
      concern: 'protective_attention'
    },
    south_asia: {
      gratitude: 'humble_appreciation',
      respect: 'status_acknowledgment',
      pride: 'familial_achievement',
      happiness: 'serene_contentment',
      concern: 'supportive_worry',
      disagreement: 'differential_perspective'
    },
    africa_subsaharan: {
      celebration: 'communal_joy',
      respect: 'elder_reverence',
      pride: 'community_achievement',
      gratitude: 'reciprocal_appreciation',
      concern: 'community_wellbeing',
      disagreement: 'consensus_seeking'
    },
    eastern_europe: {
      resilience: 'stoic_strength',
      pride: 'earned_achievement',
      respect: 'competence_recognition',
      hospitality: 'generous_hosting',
      disagreement: 'direct_counterpoint',
      concern: 'protective_worry'
    },
    oceania: {
      welcome: 'inclusive_openness',
      pride: 'understated_achievement',
      happiness: 'relaxed_contentment',
      respect: 'egalitarian_regard',
      concern: 'direct_care',
      disagreement: 'straightforward_feedback'
    },
    north_america: {
      pride: 'individual_achievement',
      enthusiasm: 'expressive_optimism',
      disagreement: 'constructive_feedback',
      happiness: 'cheerful_expression',
      concern: 'supportive_problem_solving',
      gratitude: 'appreciative_acknowledgment'
    },
    western_europe: {
      pride: 'dignified_accomplishment',
      respect: 'professional_regard',
      gratitude: 'measured_appreciation',
      concern: 'attentive_consideration',
      enthusiasm: 'considered_interest',
      disagreement: 'reasoned_alternative'
    },
    southeast_asia: {
      respect: 'harmonious_deference',
      gratitude: 'gracious_appreciation',
      pride: 'modest_achievement',
      disagreement: 'indirect_suggestion',
      concern: 'gentle_consideration',
      happiness: 'peaceful_contentment'
    }
  };
  
  // Subregional variations database
  private readonly subregionalVariations = {
    east_asia: {
      japan: {
        apology: {
          variation: 'ritualized_remorse',
          distinctiveness: 0.8,
          context: {
            historicalInfluence: 'hierarchical_society',
            socialDynamics: ['face_preservation', 'group_harmony'],
            communicationStyle: 'indirect_high_context'
          }
        },
        gratitude: {
          variation: 'obligation_acknowledgment',
          distinctiveness: 0.7,
          context: {
            historicalInfluence: 'reciprocal_obligation',
            socialDynamics: ['debt_recognition', 'hierarchical_respect'],
            communicationStyle: 'formal_ritualized'
          }
        }
      },
      china: {
        apology: {
          variation: 'face_preservation',
          distinctiveness: 0.7,
          context: {
            historicalInfluence: 'confucian_values',
            socialDynamics: ['face_concept', 'hierarchical_relationships'],
            communicationStyle: 'indirect_relationship_focused'
          }
        },
        pride: {
          variation: 'collective_honor',
          distinctiveness: 0.6,
          context: {
            historicalInfluence: 'communal_values',
            socialDynamics: ['family_reputation', 'group_achievement'],
            communicationStyle: 'modest_collective_focused'
          }
        }
      },
      korea: {
        apology: {
          variation: 'hierarchical_contrition',
          distinctiveness: 0.75,
          context: {
            historicalInfluence: 'confucian_hierarchy',
            socialDynamics: ['nunchi_awareness', 'age_hierarchy'],
            communicationStyle: 'status_conscious_formal'
          }
        },
        gratitude: {
          variation: 'jeong_based_appreciation',
          distinctiveness: 0.65,
          context: {
            historicalInfluence: 'jeong_concept',
            socialDynamics: ['reciprocal_emotional_bonds', 'long_term_relationships'],
            communicationStyle: 'warm_relational'
          }
        }
      }
    },
    europe: {
      mediterranean: {
        affection: {
          variation: 'tactile_warmth',
          distinctiveness: 0.8,
          context: {
            historicalInfluence: 'classical_expressiveness',
            socialDynamics: ['physical_closeness', 'emotional_openness'],
            communicationStyle: 'expressive_passionate'
          }
        }
      },
      nordic: {
        affection: {
          variation: 'practical_care',
          distinctiveness: 0.75,
          context: {
            historicalInfluence: 'protestant_pragmatism',
            socialDynamics: ['respect_for_autonomy', 'emotional_restraint'],
            communicationStyle: 'understated_action_oriented'
          }
        }
      },
      eastern: {
        affection: {
          variation: 'depth_of_connection',
          distinctiveness: 0.7,
          context: {
            historicalInfluence: 'post_soviet_values',
            socialDynamics: ['friendship_depth', 'loyalty_emphasis'],
            communicationStyle: 'restrained_but_profound'
          }
        }
      }
    },
    middle_east: {
      gulf: {
        hospitality: {
          variation: 'honor_based_generosity',
          distinctiveness: 0.8,
          context: {
            historicalInfluence: 'bedouin_traditions',
            socialDynamics: ['family_honor', 'tribal_relationships'],
            communicationStyle: 'elaborate_ceremonial'
          }
        }
      },
      levant: {
        hospitality: {
          variation: 'abundant_offering',
          distinctiveness: 0.7,
          context: {
            historicalInfluence: 'mediterranean_cultures',
            socialDynamics: ['community_bonds', 'food_as_connection'],
            communicationStyle: 'effusive_welcoming'
          }
        }
      }
    }
  };
  
  // Cultural context adaptation database for business settings
  private readonly businessContextAttributes = {
    east_asia: {
      pride: {
        collectiveAcknowledgment: true,
        teamReferencing: true,
        modestIntensity: true,
        hierarchicalAwareness: true,
        achievementDownplaying: true
      }
    },
    latin_america: {
      pride: {
        personalExpression: true,
        expressiveLanguage: true,
        relationshipReinforcement: true,
        emotionalOpenness: true,
        statusRecognition: true
      }
    },
    northern_europe: {
      pride: {
        factualFocus: true,
        achievementMetrics: true,
        reservedExpression: true,
        objectiveEmphasis: true,
        understatement: true
      }
    }
  };

  constructor(config: RegionExpressionConfig) {
    this.config = config;
    this.metricsCollector = new MetricsCollector();
    this.trustCollector = new TrustMetricsCollector();
  }

  /**
   * Detect region-specific emotional expression pattern
   */
  async detectExpressionPattern(emotion: string, region: string): Promise<ExpressionPatternResult> {
    // What: Detect how a particular emotion is typically expressed in a specific region
    // Why: Different regions have culturally distinct ways of expressing the same emotions
    // How: Use region-specific pattern database with confidence scoring

    this.metricsCollector.recordMetric('region_pattern_detection', { region, emotion });
    
    const regionalPatterns = this.expressionPatterns[region as keyof typeof this.expressionPatterns] || {};
    const detectedPattern = regionalPatterns[emotion as keyof typeof regionalPatterns] || 'global_standard';
    
    // Calculate confidence based on region specificity setting
    let confidence = 0.85;
    if (this.config.regionSpecificity === 'high') {
      confidence += 0.1;
    } else if (this.config.regionSpecificity === 'low') {
      confidence -= 0.1;
    }
    
    // Apply calibration precision factor
    if (this.config.expressionCalibration === 'precise') {
      confidence += 0.05;
    } else if (this.config.expressionCalibration === 'basic') {
      confidence -= 0.05;
    }
    
    // Calculate regional intensity modifier
    let intensityModifier = 1.0;
    if (region === 'east_asia' || region === 'northern_europe') {
      intensityModifier = 0.7; // More reserved cultures
    } else if (region === 'latin_america' || region === 'middle_east') {
      intensityModifier = 1.3; // More expressive cultures
    }
    
    // Determine expression style
    let expressionStyle = 'balanced';
    if (region === 'east_asia' || region === 'south_asia') {
      expressionStyle = 'indirect_contextual';
    } else if (region === 'northern_europe' || region === 'north_america') {
      expressionStyle = 'direct_factual';
    } else if (region === 'latin_america' || region === 'middle_east') {
      expressionStyle = 'expressive_relational';
    }
    
    // Identify contextual factors
    const contextualFactors = this.getRegionalContextualFactors(region, emotion);
    
    // Track for trust metrics
    this.trustCollector.recordMetric('cultural_understanding', confidence);

    return {
      detectedPattern,
      confidence: Math.min(1.0, confidence),
      culturalSignificance: this.getCulturalSignificance(region, emotion),
      regionalVariation: {
        intensityModifier,
        expressionStyle,
        contextualFactors
      }
    };
  }

  /**
   * Detect subregional variations within broader cultural regions
   */
  async detectSubregionalVariation(
    emotion: string,
    region: string,
    subregion: string
  ): Promise<SubregionalVariationResult> {
    // What: Detect more specific emotional expression variations within subregions
    // Why: Even within regions, there are important cultural distinctions in emotional expression
    // How: Apply subregional variation database with cultural context information

    this.metricsCollector.recordMetric('subregional_variation_detection', { 
      region, 
      subregion, 
      emotion 
    });
    
    // Get region-specific pattern as the baseline
    const regionalPattern = await this.detectExpressionPattern(emotion, region);
    const primaryPattern = regionalPattern.detectedPattern;
    
    // Check if we have specific subregional data
    let variation = primaryPattern;
    let distinctiveness = 0.3; // Default distinctiveness
    let culturalContext = {
      historicalInfluence: 'regional_standard',
      socialDynamics: ['typical_regional_dynamics'],
      communicationStyle: regionalPattern.regionalVariation.expressionStyle
    };
    
    // Look for specific subregional variation data
    const regionData = this.subregionalVariations[region as keyof typeof this.subregionalVariations];
    if (regionData) {
      const subregionData = regionData[subregion as keyof typeof regionData];
      if (subregionData) {
        const emotionData = subregionData[emotion as keyof typeof subregionData];
        if (emotionData) {
          variation = emotionData.variation;
          distinctiveness = emotionData.distinctiveness;
          culturalContext = emotionData.context;
        }
      }
    }
    
    // Apply accuracy enhancement based on configuration
    if (this.config.culturalAccuracy) {
      distinctiveness += 0.1;
    }
    
    // Track for trust metrics
    this.trustCollector.recordMetric('cultural_nuance', distinctiveness);

    return {
      variation,
      primaryPattern,
      distinctiveness,
      culturalContext
    };
  }

  /**
   * Adapt emotional expression for region-specific appropriateness
   */
  async adaptRegionalExpression(
    emotion: string,
    intensity: number,
    sourceRegion: string,
    targetRegion: string,
    businessContext: boolean
  ): Promise<RegionalExpressionAdaptation> {
    // What: Adapt emotional expressions between regions while maintaining appropriateness
    // Why: Cross-cultural communication requires region-appropriate expression
    // How: Apply regional adaptation rules with context-specific calibration

    this.metricsCollector.recordMetric('regional_expression_adaptation', {
      sourceRegion,
      targetRegion,
      emotion,
      businessContext
    });
    
    // Get source and target expression patterns
    const sourcePattern = await this.detectExpressionPattern(emotion, sourceRegion);
    const targetPattern = await this.detectExpressionPattern(emotion, targetRegion);
    
    // Adapt emotion based on target region patterns
    const adaptedEmotion = this.adaptEmotionForTargetRegion(
      emotion, 
      targetRegion, 
      businessContext
    );
    
    // Adapt intensity based on regional differences
    const adaptedIntensity = this.calculateAdaptedIntensity(
      intensity,
      sourceRegion,
      targetRegion,
      businessContext
    );
    
    // Prepare adaptation details
    const adaptationDetails: {[key: string]: any} = {
      originalPattern: sourcePattern.detectedPattern,
      targetPattern: targetPattern.detectedPattern,
      intensityAdjustment: adaptedIntensity / intensity
    };
    
    // Add business context adaptations
    if (businessContext) {
      adaptationDetails.formalityLevel = this.calculateFormalityLevel(targetRegion);
      adaptationDetails.professionalTone = true;
    }
    
    // Add region-specific adaptation details
    if (targetRegion === 'east_asia') {
      adaptationDetails.collectiveFraming = true;
      adaptationDetails.statusAwareness = true;
      adaptationDetails.indirectApproach = emotion === 'disagreement' || emotion === 'concern';
    } else if (targetRegion === 'southeast_asia') {
      adaptationDetails.harmonyPreservation = true;
      adaptationDetails.indirectApproach = emotion === 'disagreement' || emotion === 'concern';
      adaptationDetails.respectfulTone = true;
    } else if (targetRegion === 'northern_europe') {
      adaptationDetails.directApproach = true;
      adaptationDetails.factualEmphasis = true;
    } else if (targetRegion === 'latin_america') {
      adaptationDetails.expressiveStyle = true;
      adaptationDetails.personalConnection = true;
    }
    
    // Track for trust metrics
    this.trustCollector.recordMetric('cultural_adaptation', 0.9);

    return {
      adaptedEmotion,
      adaptedIntensity,
      culturallyAppropriate: true,
      adaptationDetails
    };
  }

  /**
   * Preserve core emotional intent while adapting to regional expression
   */
  async preserveCoreEmotionalIntent(
    emotion: string,
    sourceRegion: string,
    targetRegion: string
  ): Promise<EmotionalIntentPreservation> {
    // What: Ensure the core emotional intent is preserved during regional adaptation
    // Why: Cross-cultural communication should maintain emotional authenticity
    // How: Apply core preservation techniques with emotional essence extraction

    this.metricsCollector.recordMetric('emotional_intent_preservation', {
      emotion,
      sourceRegion,
      targetRegion
    });
    
    // Adapt emotion based on target region
    const adaptation = await this.adaptRegionalExpression(
      emotion,
      0.8, // Standard intensity
      sourceRegion,
      targetRegion,
      false // Non-business context
    );
    
    // Calculate core preservation score
    let corePreservation = 0.85; // Base preservation score
    
    // Adjust based on emotion type
    if (emotion === 'disagreement' || emotion === 'concern') {
      // These emotions undergo more transformation across cultures
      corePreservation -= 0.1;
    } else if (emotion === 'joy' || emotion === 'gratitude') {
      // These emotions tend to translate more universally
      corePreservation += 0.05;
    }
    
    // Adjust based on regional differences
    if ((sourceRegion === 'east_asia' && targetRegion === 'latin_america') ||
        (sourceRegion === 'latin_america' && targetRegion === 'east_asia')) {
      // Large cultural distance
      corePreservation -= 0.05;
    }
    
    // Extract emotional essence that's preserved across cultures
    const emotionalEssence = this.extractEmotionalEssence(emotion, adaptation.adaptedEmotion);
    
    // Track for trust metrics
    this.trustCollector.recordMetric('emotional_authenticity', corePreservation);

    return {
      originalEmotion: emotion,
      adaptedExpression: adaptation.adaptedEmotion,
      corePreservation: Math.min(1.0, Math.max(0.7, corePreservation)), // Keep within reasonable bounds
      emotionalEssence
    };
  }

  // Private helper methods

  private getRegionalContextualFactors(region: string, emotion: string): string[] {
    const regionalFactors: {[key: string]: {[key: string]: string[]}} = {
      east_asia: {
        pride: ['group_harmony', 'collective_achievement', 'hierarchical_respect'],
        gratitude: ['obligation_acknowledgment', 'reciprocal_relationship', 'status_recognition'],
        disagreement: ['face_saving', 'indirect_communication', 'harmony_preservation']
      },
      northern_europe: {
        pride: ['achievement_focus', 'understatement', 'competence_emphasis'],
        gratitude: ['practical_appreciation', 'balanced_reciprocity', 'sincere_acknowledgment'],
        disagreement: ['direct_factual', 'problem_solving', 'constructive_approach']
      },
      latin_america: {
        pride: ['expressive_joy', 'personal_connection', 'family_recognition'],
        gratitude: ['warm_expression', 'relationship_building', 'emotional_openness'],
        disagreement: ['relational_harmony', 'emotional_appeal', 'face_saving']
      }
    };
    
    return regionalFactors[region as keyof typeof regionalFactors]?.[emotion as keyof (typeof regionalFactors)[keyof typeof regionalFactors]] || 
           ['universal_human_expression'];
  }

  private getCulturalSignificance(region: string, emotion: string): string {
    const significanceMap: {[key: string]: {[key: string]: string}} = {
      east_asia: {
        pride: 'Reflects collective achievement and group harmony',
        gratitude: 'Establishes reciprocal obligations and relationship harmony',
        respect: 'Maintains hierarchical social order and face'
      },
      northern_europe: {
        pride: 'Acknowledges personal competence while maintaining equality',
        happiness: 'Values contentment through personal autonomy and space',
        disagreement: 'Prioritizes objective truth and direct problem-solving'
      },
      latin_america: {
        excitement: 'Strengthens social bonds through shared emotional expression',
        pride: 'Celebrates personal and family achievements with passion',
        respect: 'Builds warm relationships with appropriate recognition'
      }
    };
    
    return significanceMap[region as keyof typeof significanceMap]?.[emotion as keyof (typeof significanceMap)[keyof typeof significanceMap]] || 
           'Universal human expression with cultural variation';
  }

  private adaptEmotionForTargetRegion(emotion: string, targetRegion: string, businessContext: boolean): string {
    const emotionAdaptationMap: {[key: string]: {[key: string]: string}} = {
      east_asia: {
        excitement: 'measured_enthusiasm',
        disagreement: 'alternative_perspective',
        pride: 'collective_achievement',
        frustration: 'improvement_opportunity'
      },
      southeast_asia: {
        disagreement: 'harmonious_alternative',
        pride: 'grateful_accomplishment',
        frustration: 'patience_challenge',
        concern: 'thoughtful_consideration'
      },
      northern_europe: {
        excitement: 'positive_engagement',
        pride: 'quality_achievement',
        frustration: 'practical_challenge',
        disagreement: 'factual_counterpoint'
      },
      latin_america: {
        excitement: 'enthusiastic_celebration',
        pride: 'joyful_accomplishment',
        concern: 'caring_attention',
        frustration: 'passionate_concern'
      }
    };
    
    // Add business context modification
    if (businessContext) {
      if (targetRegion === 'east_asia' && emotion === 'disagreement') {
        return 'respectful_consideration';
      } else if (targetRegion === 'northern_europe' && emotion === 'excitement') {
        return 'professional_interest';
      }
    }
    
    return emotionAdaptationMap[targetRegion as keyof typeof emotionAdaptationMap]?.[emotion as keyof (typeof emotionAdaptationMap)[keyof typeof emotionAdaptationMap]] || 
           emotion;
  }

  private calculateAdaptedIntensity(
    originalIntensity: number,
    sourceRegion: string,
    targetRegion: string,
    businessContext: boolean
  ): number {
    // Region-specific intensity calibration factors
    const regionIntensityFactors: {[key: string]: number} = {
      east_asia: 0.7,
      southeast_asia: 0.75,
      south_asia: 0.8,
      northern_europe: 0.8,
      western_europe: 0.85,
      eastern_europe: 0.9,
      north_america: 1.0,
      latin_america: 1.2,
      middle_east: 1.1,
      africa_subsaharan: 1.1,
      oceania: 0.9
    };
    
    // Get region factors (default to 1.0 if not found)
    const sourceIntensityFactor = regionIntensityFactors[sourceRegion] || 1.0;
    const targetIntensityFactor = regionIntensityFactors[targetRegion] || 1.0;
    
    // Calculate adapted intensity
    let adaptedIntensity = originalIntensity * (targetIntensityFactor / sourceIntensityFactor);
    
    // Business context typically reduces emotional intensity
    if (businessContext) {
      adaptedIntensity *= 0.85;
      
      // Even more restrained in formal business settings in certain regions
      if (targetRegion === 'east_asia' || targetRegion === 'northern_europe') {
        adaptedIntensity *= 0.9;
      }
    }
    
    // Apply calibration based on configuration
    if (this.config.expressionCalibration === 'precise') {
      // More precise calibration applies finer adjustments
      const precisionAdjustment = 1.0 + ((targetIntensityFactor - sourceIntensityFactor) * 0.1);
      adaptedIntensity *= precisionAdjustment;
    }
    
    // Ensure the intensity stays within valid range
    return Math.min(1.0, Math.max(0.1, adaptedIntensity));
  }

  private calculateFormalityLevel(region: string): number {
    const formalityLevels: {[key: string]: number} = {
      east_asia: 0.9,
      southeast_asia: 0.85,
      south_asia: 0.85,
      middle_east: 0.85,
      northern_europe: 0.8,
      western_europe: 0.8,
      eastern_europe: 0.85,
      north_america: 0.75,
      latin_america: 0.8,
      africa_subsaharan: 0.8,
      oceania: 0.75
    };
    
    return formalityLevels[region] || 0.8;
  }

  private extractEmotionalEssence(originalEmotion: string, adaptedEmotion: string): string {
    // Map of emotional essences that should be preserved across cultures
    const emotionalEssenceMap: {[key: string]: string} = {
      joy: 'positive feeling of happiness',
      excitement: 'energetic enthusiasm about something positive',
      gratitude: 'appreciation for something received or experienced',
      concern: 'care and attention to potential problems',
      interest: 'engaged attention and curiosity',
      pride: 'positive feeling about achievements or qualities',
      frustration: 'feeling of being prevented from achieving goals',
      disagreement: 'different perspective or opinion'
    };
    
    return `${emotionalEssenceMap[originalEmotion] || originalEmotion} expressed as ${adaptedEmotion}`;
  }
} 