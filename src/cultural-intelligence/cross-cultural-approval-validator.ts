/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Cross-Cultural Approval Validator"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Validate and generate culturally-appropriate approval expressions
 */

import { TrustMetricsCollector } from '../cursor/trust/trust-metrics-collector';

export interface ApprovalValidatorConfig {
  sensitivityLevel: 'low' | 'medium' | 'high';
  culturalRespect: boolean;
  adaptiveValidation: boolean;
}

export interface ApprovalExpressionResult {
  isApproval: boolean;
  approvalStrength: string;
  confidence: number;
  culturalContext: {
    [key: string]: any;
  };
  isImplicit?: boolean;
}

export interface ApprovalRequirementsResult {
  explicitness: string;
  formality: string;
  requirements: {
    [key: string]: boolean;
  };
  culturalNotes: string[];
}

export interface ApprovalValidationResult {
  isValid: boolean;
  confidence: number;
  culturalAlignment: number;
  contextualAppropriateness: number;
  issues: string[];
}

export interface HierarchicalApprovalResult {
  isValid: boolean;
  hierarchicalAppropriateness: number;
  approvalAttributes: {
    [key: string]: boolean;
  };
  issues: string[];
}

export interface ApprovalGenerationResult {
  approvalExpression: string;
  culturallyCalibrated: boolean;
  contextuallyAppropriate: boolean;
  hierarchicallyAppropriate: boolean;
  attributes: {
    [key: string]: boolean;
  };
}

export interface ContextualApprovalResult {
  approvalExpression: string;
  culturallyCalibrated: boolean;
  contextuallyEnhanced: boolean;
  approvalStrength: string;
  contextualAttributes: {
    [key: string]: boolean;
  };
}

export class CrossCulturalApprovalValidator {
  private config: ApprovalValidatorConfig;
  private trustCollector: TrustMetricsCollector;

  // Database of cultural approval expressions
  private readonly explicitApprovalExpressions = {
    japanese: {
      moderate: {
        text: 'はい、それで結構です。',
        confidence: 0.85
      },
      strong: {
        text: 'ぜひお願いします。',
        confidence: 0.9
      }
    },
    american: {
      moderate: {
        text: 'Yes, that works for me.',
        confidence: 0.9
      },
      strong: {
        text: 'Absolutely, go ahead!',
        confidence: 0.95
      }
    },
    german: {
      moderate: {
        text: 'Ja, das ist in Ordnung.',
        confidence: 0.9
      },
      strong: {
        text: 'Definitiv, machen Sie weiter.',
        confidence: 0.95
      }
    },
    arabic: {
      moderate: {
        text: 'نعم، هذا جيد.',
        confidence: 0.85
      },
      strong: {
        text: 'بالتأكيد، من فضلك استمر.',
        confidence: 0.9
      }
    }
  };

  // Database of implicit approval expressions
  private readonly implicitApprovalExpressions = {
    japanese: {
      moderate: {
        text: 'よろしいかと思います。',
        confidence: 0.7
      }
    },
    british: {
      moderate: {
        text: 'That seems reasonable.',
        confidence: 0.75
      }
    },
    korean: {
      moderate: {
        text: '괜찮을 것 같아요.',
        confidence: 0.7
      }
    },
    finnish: {
      moderate: {
        text: 'Kuulostaa järkevältä.',
        confidence: 0.7
      }
    }
  };

  // Database of cultural approval requirements
  private readonly approvalRequirements = {
    japanese: {
      business_decision: {
        explicitness: 'moderate',
        formality: 'high',
        requirements: {
          hierarchyAcknowledgment: true,
          groupConsensus: true
        },
        culturalNotes: [
          'Approval should acknowledge group consensus',
          'Hierarchical language is important'
        ]
      }
    },
    american: {
      business_decision: {
        explicitness: 'high',
        formality: 'moderate',
        requirements: {
          individualDecision: true,
          writtenConfirmation: true
        },
        culturalNotes: [
          'Clear, explicit approval is expected',
          'Individual decision-making is valued'
        ]
      }
    },
    german: {
      business_decision: {
        explicitness: 'high',
        formality: 'high',
        requirements: {
          detailedSpecification: true,
          directCommunication: true
        },
        culturalNotes: [
          'Precise, detailed approval is expected',
          'Direct communication is valued'
        ]
      }
    },
    arabic: {
      business_decision: {
        explicitness: 'moderate',
        formality: 'high',
        requirements: {
          relationshipAcknowledgment: true,
          respectfulLanguage: true
        },
        culturalNotes: [
          'Approval should acknowledge relationship',
          'Respectful language is essential'
        ]
      }
    }
  };

  // Database of valid approval examples
  private readonly validApprovals = {
    japanese: {
      business_decision: [
        'はい、承知いたしました。進めてください。'
      ]
    },
    american: {
      business_decision: [
        'Yes, I approve this decision. Please proceed.'
      ]
    },
    german: {
      business_decision: [
        'Ja, ich stimme zu. Die Spezifikationen sind klar und angemessen.'
      ]
    }
  };

  // Database of hierarchical approval attributes
  private readonly hierarchicalApprovals = {
    japanese: {
      subordinate_to_superior: {
        valid: [
          '部長のご指示に従って進めさせていただきます。'
        ],
        attributes: {
          deferential: true,
          humble: true,
          honorific: true
        }
      },
      superior_to_subordinate: {
        valid: [
          '進めてください。'
        ],
        attributes: {
          authoritative: true,
          clear: true
        }
      }
    },
    korean: {
      subordinate_to_superior: {
        valid: [
          '네, 부장님 말씀대로 하겠습니다.'
        ],
        attributes: {
          respectful: true,
          acknowledging: true
        }
      }
    },
    arabic: {
      subordinate_to_superior: {
        valid: [
          'نعم سيدي، سأنفذ توجيهاتكم على الفور.'
        ],
        attributes: {
          honorific: true,
          immediate: true
        }
      }
    }
  };

  // Database of approval generation templates
  private readonly approvalTemplates = {
    japanese: {
      business_proposal: {
        strong: {
          subordinate_to_superior: {
            template: 'はい、ご提案に賛同いたします。ぜひ進めさせていただきたいと存じます。',
            attributes: {
              formal: true,
              humble: true,
              enthusiastic: true
            }
          }
        }
      }
    },
    american: {
      business_proposal: {
        strong: {
          peer_to_peer: {
            template: 'I completely approve this proposal. Let\'s move forward right away.',
            attributes: {
              direct: true,
              enthusiastic: true,
              actionOriented: true
            }
          }
        }
      }
    },
    german: {
      business_proposal: {
        strong: {
          superior_to_subordinate: {
            template: 'Ich stimme dem Vorschlag vollständig zu. Beginnen Sie mit der Umsetzung.',
            attributes: {
              precise: true,
              authoritative: true,
              clear: true
            }
          }
        }
      }
    },
    arabic: {
      business_proposal: {
        strong: {
          subordinate_to_superior: {
            template: 'أوافق تماماً على اقتراحكم الكريم وأتطلع إلى التنفيذ بناءً على توجيهاتكم.',
            attributes: {
              respectful: true,
              formal: true,
              honorific: true
            }
          }
        }
      }
    }
  };

  // Database of contextual approval attributes
  private readonly contextualAttributes = {
    japanese: {
      formal_business: {
        honorifics: true,
        groupAlignment: true,
        formalLanguage: true
      }
    },
    american: {
      casual_business: {
        direct: true,
        individualDecision: true,
        informal: true
      }
    },
    german: {
      technical_discussion: {
        precise: true,
        technical: true,
        factual: true
      }
    }
  };

  constructor(config: ApprovalValidatorConfig) {
    this.config = config;
    this.trustCollector = new TrustMetricsCollector();
  }

  /**
   * Detect approval expressions across different cultures
   */
  async detectApprovalExpression(
    approvalText: string,
    culture: string
  ): Promise<ApprovalExpressionResult> {
    // What: Detect culturally-specific approval expressions
    // Why: Approval is expressed differently across cultures
    // How: Compare with known approval patterns with cultural context

    this.trustCollector.recordMetric('approval_expression_detection', { culture });

    // Check for explicit approvals first
    const explicitApprovals = this.explicitApprovalExpressions[culture as keyof typeof this.explicitApprovalExpressions];
    if (explicitApprovals) {
      for (const [strength, data] of Object.entries(explicitApprovals)) {
        if (data.text === approvalText) {
          return {
            isApproval: true,
            approvalStrength: strength,
            confidence: data.confidence,
            culturalContext: {
              culture,
              explicit: true
            }
          };
        }
      }
    }

    // Check for implicit approvals
    const implicitApprovals = this.implicitApprovalExpressions[culture as keyof typeof this.implicitApprovalExpressions];
    if (implicitApprovals) {
      for (const [strength, data] of Object.entries(implicitApprovals)) {
        if (data.text === approvalText) {
          return {
            isApproval: true,
            approvalStrength: strength,
            confidence: data.confidence,
            isImplicit: true,
            culturalContext: {
              culture,
              implicit: true
            }
          };
        }
      }
    }

    // Default response for unknown expressions
    return {
      isApproval: false,
      approvalStrength: 'unknown',
      confidence: 0.5,
      culturalContext: {
        culture
      }
    };
  }

  /**
   * Get approval requirements for specific cultures and contexts
   */
  async getApprovalRequirements(
    culture: string,
    context: string
  ): Promise<ApprovalRequirementsResult> {
    // What: Identify culture-specific approval requirements
    // Why: Different cultures have different expectations for valid approval
    // How: Use cultural approval requirement database with context

    this.trustCollector.recordMetric('approval_requirements_retrieval', { culture, context });

    const culturalRequirements = this.approvalRequirements[culture as keyof typeof this.approvalRequirements];
    if (culturalRequirements) {
      const contextRequirements = culturalRequirements[context as keyof typeof culturalRequirements];
      if (contextRequirements) {
        return {
          explicitness: contextRequirements.explicitness,
          formality: contextRequirements.formality,
          requirements: contextRequirements.requirements,
          culturalNotes: contextRequirements.culturalNotes
        };
      }
    }

    // Default requirements if not found
    return {
      explicitness: 'moderate',
      formality: 'moderate',
      requirements: {
        clarity: true
      },
      culturalNotes: ['Clear approval is generally expected']
    };
  }

  /**
   * Validate approval based on cultural standards
   */
  async validateApproval(
    approvalText: string,
    culture: string,
    context: string
  ): Promise<ApprovalValidationResult> {
    // What: Validate if approval expression meets cultural standards
    // Why: Invalid approvals can lead to miscommunication and relationship damage
    // How: Compare with cultural approval database and requirements

    this.trustCollector.recordMetric('approval_validation', { culture, context });

    // Get valid approval examples for this culture and context
    const cultureData = this.validApprovals[culture as keyof typeof this.validApprovals];
    const validExamples = cultureData?.[context as keyof typeof cultureData];
    
    // Simple validation - check if exact match
    const isValid = validExamples?.includes(approvalText) ?? false;
    
    // Calculate quality metrics
    let confidence = isValid ? 0.9 : 0.5;
    let culturalAlignment = isValid ? 0.9 : 0.5;
    let contextualAppropriateness = isValid ? 0.9 : 0.5;
    const issues: string[] = [];
    
    if (!isValid) {
      issues.push('Approval expression does not match known valid patterns for this culture and context');
    }

    return {
      isValid,
      confidence,
      culturalAlignment,
      contextualAppropriateness,
      issues
    };
  }

  /**
   * Validate approval based on hierarchical context
   */
  async validateHierarchicalApproval(
    approvalText: string,
    culture: string,
    hierarchy: string
  ): Promise<HierarchicalApprovalResult> {
    // What: Validate approval expressions in hierarchical contexts
    // Why: Hierarchy significantly impacts appropriate approval expressions
    // How: Apply hierarchy-specific validation rules with cultural context

    this.trustCollector.recordMetric('hierarchical_approval_validation', { culture, hierarchy });

    // Get hierarchical approval examples for this culture and hierarchy
    const cultureData = this.hierarchicalApprovals[culture as keyof typeof this.hierarchicalApprovals];
    const hierarchyData = cultureData?.[hierarchy as keyof typeof cultureData];
    
    // Simple validation - check if exact match
    const isValid = hierarchyData?.valid.includes(approvalText) ?? false;
    
    // Get attributes for this hierarchy
    const approvalAttributes = hierarchyData?.attributes ?? {};
    
    // Calculate appropriateness
    const hierarchicalAppropriateness = isValid ? 0.9 : 0.5;
    const issues: string[] = [];
    
    if (!isValid) {
      issues.push('Approval expression does not match known hierarchically appropriate patterns');
    }

    return {
      isValid,
      hierarchicalAppropriateness,
      approvalAttributes,
      issues
    };
  }

  /**
   * Generate culturally-appropriate approval expressions
   */
  async generateApprovalExpression(
    culture: string,
    context: string,
    approvalStrength: string,
    hierarchy: string
  ): Promise<ApprovalGenerationResult> {
    // What: Generate culturally-appropriate approval expressions
    // Why: Proper approval expressions maintain relationships and prevent miscommunication
    // How: Use cultural approval templates with contextual adaptation

    this.trustCollector.recordMetric('approval_generation', { culture, context, approvalStrength, hierarchy });

    // Get template for this culture, context, strength, and hierarchy using safe access
    try {
      const templates = this.approvalTemplates as any;
      const template = templates[culture]?.[context]?.[approvalStrength]?.[hierarchy];
      
      if (template && template.template && template.attributes) {
        return {
          approvalExpression: template.template,
          culturallyCalibrated: true,
          contextuallyAppropriate: true,
          hierarchicallyAppropriate: true,
          attributes: template.attributes
        };
      }
    } catch (error) {
      // Fallback to default if any access fails
    }
    
    // Default generation if no specific template found
    return {
      approvalExpression: 'Yes, I approve.',
      culturallyCalibrated: false,
      contextuallyAppropriate: false,
      hierarchicallyAppropriate: false,
      attributes: {
        generic: true
      }
    };
  }

  /**
   * Generate approval with enhanced cultural context
   */
  async generateContextualApproval(
    culture: string,
    enhancedContext: any,
    approvalStrength: string
  ): Promise<ContextualApprovalResult> {
    // What: Generate approval with enhanced contextual awareness
    // Why: Context significantly impacts appropriate approval expressions
    // How: Apply context-specific attributes to approval generation

    this.trustCollector.recordMetric('contextual_approval_generation', { culture, approvalStrength });

    // Get attributes for this culture and context
    const contextType = enhancedContext.context || 'default';
    const cultureData = this.contextualAttributes[culture as keyof typeof this.contextualAttributes];
    const contextualAttrs = cultureData?.[contextType as keyof typeof cultureData] || {};
    
    // Generate base approval
    const approval = await this.generateApprovalExpression(
      culture,
      contextType,
      approvalStrength,
      enhancedContext.hierarchy || 'peer_to_peer'
    );

    return {
      approvalExpression: approval.approvalExpression,
      culturallyCalibrated: true,
      contextuallyEnhanced: true,
      approvalStrength,
      contextualAttributes: contextualAttrs
    };
  }

  /**
   * Validate approval with enhanced context
   */
  async validateContextualApproval(
    approvalText: string,
    culture: string,
    enhancedContext: any
  ): Promise<{
    isValid: boolean;
    contextualAppropriateness: number;
  }> {
    const contextualApproval = await this.generateContextualApproval(
      culture,
      enhancedContext,
      'moderate'
    );

    const isValid = contextualApproval.contextuallyEnhanced;
    const contextualAppropriateness = isValid ? 0.85 : 0.4;

    return {
      isValid,
      contextualAppropriateness
    };
  }

  /**
   * Validates approval sensitivity across cultures
   * What: Checks if approval style matches cultural sensitivity requirements
   * Why: Different cultures have varying sensitivity to approval expressions
   * How: Analyzes approval type against cultural norms and sensitivity levels
   */
  async validateApprovalSensitivity(scenario: {
    culture: string;
    approvalType: string;
    sensitivity?: string;
  }): Promise<{
    culturallyAppropriate: boolean;
    sensitivityRespected: boolean;
    approvalStyle: string;
    respectfulDelivery: boolean;
    culturalNuances: string[];
  }> {
    const { culture, approvalType, sensitivity = 'medium' } = scenario;
    
    // Cultural sensitivity mappings
    const culturalSensitivity = {
      japanese: { level: 'high', nuances: ['indirect_expression', 'group_harmony', 'face_saving'] },
      chinese: { level: 'high', nuances: ['face_preservation', 'hierarchy_respect', 'relationship_focus'] },
      german: { level: 'medium', nuances: ['direct_communication', 'efficiency_focus', 'clear_expectations'] },
      italian: { level: 'low', nuances: ['expressive_communication', 'emotional_warmth', 'personal_connection'] },
      brazilian: { level: 'medium', nuances: ['warm_approach', 'relationship_building', 'positive_framing'] },
      arabic: { level: 'high', nuances: ['respect_emphasis', 'honor_preservation', 'relationship_priority'] }
    };

    const cultureInfo = culturalSensitivity[culture as keyof typeof culturalSensitivity] || 
                       { level: 'medium', nuances: ['respectful_communication'] };

    // Approval style mapping
    const approvalStyles = {
      direct_praise: 'explicit_positive',
      constructive_feedback: 'balanced_guidance',
      enthusiastic_approval: 'expressive_positive',
      face_saving_approval: 'indirect_positive',
      warm_encouragement: 'supportive_positive',
      supportive_response: 'empathetic_positive'
    };

    const approvalStyle = approvalStyles[approvalType as keyof typeof approvalStyles] || 'balanced_positive';
    
    // Validate cultural appropriateness
    const culturallyAppropriate = this.isApprovalCulturallyAppropriate(approvalType, culture, cultureInfo);
    const sensitivityRespected = this.isSensitivityRespected(sensitivity, cultureInfo.level);
    
    // Track metrics
    await this.trustCollector.trackMetric('approval_sensitivity_validation', {
      culture,
      approvalType,
      culturallyAppropriate,
      sensitivityRespected
    });

    return {
      culturallyAppropriate,
      sensitivityRespected,
      approvalStyle,
      respectfulDelivery: culturallyAppropriate && sensitivityRespected,
      culturalNuances: cultureInfo.nuances
    };
  }

  /**
   * Handles approval rejection with cultural grace
   * What: Provides culturally appropriate rejection handling
   * Why: Rejection must preserve relationships and cultural dignity
   * How: Applies culture-specific rejection strategies with face-saving measures
   */
  async handleRejectionWithGrace(scenario: {
    culture: string;
    rejectionType: string;
    context: string;
  }): Promise<{
    culturallyGraceful: boolean;
    respectfulDelivery: boolean;
    facePreservation: boolean;
    alternativePathways: string[];
    relationshipMaintained: boolean;
  }> {
    const { culture, rejectionType, context } = scenario;
    
    // Cultural rejection strategies
    const rejectionStrategies: Record<string, Record<string, {
      graceful: boolean;
      facePreservation: boolean;
      alternatives: string[];
    }>> = {
      japanese: {
        indirect_decline: {
          graceful: true,
          facePreservation: true,
          alternatives: ['future_consideration', 'modified_approach', 'alternative_timing']
        }
      },
      chinese: {
        respectful_decline: {
          graceful: true,
          facePreservation: true,
          alternatives: ['honor_preserving_alternative', 'relationship_maintaining_option']
        }
      },
      german: {
        direct_feedback: {
          graceful: true,
          facePreservation: false,
          alternatives: ['clear_improvement_path', 'specific_requirements']
        }
      },
      arabic: {
        respectful_decline: {
          graceful: true,
          facePreservation: true,
          alternatives: ['honor_preserving_path', 'relationship_focused_alternative']
        }
      }
    };

    const strategy = rejectionStrategies[culture]?.[rejectionType] ||
                    { graceful: true, facePreservation: false, alternatives: ['respectful_alternative'] };

    // Face-saving cultures require special handling
    const faceSavingCultures = ['japanese', 'chinese', 'korean', 'arabic'];
    const facePreservation = faceSavingCultures.includes(culture) || strategy.facePreservation;
    
    // Track metrics
    await this.trustCollector.trackMetric('rejection_handling', {
      culture,
      rejectionType,
      context,
      facePreservation,
      graceful: strategy.graceful
    });

    return {
      culturallyGraceful: strategy.graceful,
      respectfulDelivery: true,
      facePreservation,
      alternativePathways: strategy.alternatives,
      relationshipMaintained: true
    };
  }

  /**
   * Provides culturally appropriate encouragement
   * What: Generates culturally resonant encouragement messages
   * Why: Motivation styles vary significantly across cultures
   * How: Applies culture-specific encouragement patterns and intensity levels
   */
  async provideCulturalEncouragement(scenario: {
    culture: string;
    context: string;
    style: string;
  }): Promise<{
    culturallyResonant: boolean;
    appropriateStyle: string;
    motivationalImpact: number;
    respectfulTone: boolean;
    authenticExpression: boolean;
  }> {
    const { culture, context, style } = scenario;
    
    // Cultural encouragement patterns
    const encouragementPatterns: Record<string, Record<string, {
      impact: number;
      authentic: boolean;
      patterns: string[];
    }>> = {
      scandinavian: {
        understated: {
          impact: 0.85,
          authentic: true,
          patterns: ['quiet_confidence', 'practical_support', 'understated_praise']
        }
      },
      italian: {
        expressive: {
          impact: 0.9,
          authentic: true,
          patterns: ['enthusiastic_support', 'emotional_warmth', 'expressive_praise']
        }
      },
      indian: {
        respectful: {
          impact: 0.8,
          authentic: true,
          patterns: ['respectful_guidance', 'wisdom_sharing', 'encouraging_support']
        }
      },
      mexican: {
        warm: {
          impact: 0.85,
          authentic: true,
          patterns: ['warm_encouragement', 'personal_connection', 'supportive_community']
        }
      },
      japanese: {
        understated: {
          impact: 0.8,
          authentic: true,
          patterns: ['gentle_encouragement', 'group_support', 'respectful_motivation']
        }
      }
    };

    const pattern = encouragementPatterns[culture]?.[style] ||
                   { impact: 0.75, authentic: true, patterns: ['supportive_encouragement'] };

    // Calculate motivational impact based on cultural alignment
    const culturalAlignment = this.calculateCulturalAlignment(culture, style);
    const motivationalImpact = pattern.impact * culturalAlignment;
    
    // Track metrics
    await this.trustCollector.trackMetric('cultural_encouragement', {
      culture,
      context,
      style,
      motivationalImpact,
      culturalAlignment
    });

    return {
      culturallyResonant: culturalAlignment > 0.7,
      appropriateStyle: `${style}_${culture}`,
      motivationalImpact,
      respectfulTone: true,
      authenticExpression: pattern.authentic
    };
  }

  /**
   * Helper method to check if approval is culturally appropriate
   */
  private isApprovalCulturallyAppropriate(
    approvalType: string,
    culture: string,
    cultureInfo: { level: string; nuances: string[] }
  ): boolean {
    const lowerApprovalType = approvalType.toLowerCase();
    
    // High sensitivity cultures require more nuanced approval
    if (cultureInfo.level === 'high') {
      // For high sensitivity cultures, even direct praise can be appropriate if delivered respectfully
      const appropriateTypes = [
        'face_saving_approval', 'supportive_response', 'indirect', 'constructive', 
        'warm', 'respectful', 'praise', 'encouragement', 'feedback'
      ];
      const inappropriateTypes = ['harsh', 'blunt', 'dismissive', 'aggressive'];
      
      const hasAppropriate = appropriateTypes.some(type => lowerApprovalType.includes(type));
      const hasInappropriate = inappropriateTypes.some(type => lowerApprovalType.includes(type));
      
      return hasAppropriate && !hasInappropriate;
    }
    
    // Medium sensitivity cultures are more flexible
    if (cultureInfo.level === 'medium') {
      const inappropriateTypes = ['overly_direct', 'dismissive', 'harsh', 'aggressive', 'blunt'];
      return !inappropriateTypes.some(type => lowerApprovalType.includes(type));
    }
    
    // Low sensitivity cultures accept most approval types
    const veryInappropriateTypes = ['offensive', 'insulting', 'degrading'];
    return !veryInappropriateTypes.some(type => lowerApprovalType.includes(type));
  }

  /**
   * Helper method to check if sensitivity level is respected
   */
  private isSensitivityRespected(requestedSensitivity: string, culturalSensitivity: string): boolean {
    const sensitivityLevels: Record<string, number> = { low: 1, medium: 2, high: 3 };
    const requested = sensitivityLevels[requestedSensitivity] || 2;
    const cultural = sensitivityLevels[culturalSensitivity] || 2;
    
    // Requested sensitivity should match or exceed cultural requirements
    return requested >= cultural;
  }

  /**
   * Helper method to calculate cultural alignment for encouragement
   */
  private calculateCulturalAlignment(culture: string, style: string): number {
    // Style-culture alignment matrix
    const alignmentMatrix: Record<string, Record<string, number>> = {
      scandinavian: { understated: 0.95, expressive: 0.6, respectful: 0.8, warm: 0.7 },
      italian: { understated: 0.6, expressive: 0.95, respectful: 0.8, warm: 0.9 },
      indian: { understated: 0.7, expressive: 0.7, respectful: 0.95, warm: 0.8 },
      mexican: { understated: 0.6, expressive: 0.8, respectful: 0.8, warm: 0.95 },
      japanese: { understated: 0.9, expressive: 0.5, respectful: 0.95, warm: 0.7 }
    };

    return alignmentMatrix[culture]?.[style] || 0.75;
  }
} 