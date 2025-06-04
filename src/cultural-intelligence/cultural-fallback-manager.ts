/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Cultural Fallback Manager"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Manage culturally-appropriate fallback messaging when primary communication fails
 */

import { TrustMetricsCollector } from '../../cursor/trust/trust-metrics-collector';

export interface CulturalFallbackConfig {
  culturalSensitivity: 'low' | 'medium' | 'high';
  fallbackDepth: 'basic' | 'standard' | 'comprehensive';
  recoveryOptimization: boolean;
}

export interface CulturalFallbackResult {
  fallbackMessage: string;
  culturallyCalibrated: boolean;
  fallbackTone: string;
  recoveryProbability: number;
  trustPreservation: number;
}

export interface ContextualFallbackResult extends CulturalFallbackResult {
  contextuallyEnhanced: boolean;
  messageAttributes: {
    [key: string]: boolean;
  };
}

export interface RecoveryStrategyResult {
  recoveryMessage: string;
  suggestedActions: string[];
  culturallyCalibrated: boolean;
  recoveryAttributes: {
    [key: string]: boolean;
  };
  successProbability: number;
}

export interface TrustImpactResult {
  newTrustScore: number;
  trustChange: number;
  recoveryFactor: number;
  culturalFactors: {
    [key: string]: number;
  };
}

export interface TrustRecoveryFollowUp {
  followUpMessage: string;
  culturallyCalibrated: boolean;
  trustRecoveryPotential: number;
  followUpActions: string[];
  followUpAttributes: {
    [key: string]: boolean;
  };
}

export interface RegionalCulturalFallbackResult extends CulturalFallbackResult {
  regionallyAdapted: boolean;
  regionalInfluence: number;
  culturalInfluence: number;
}

export class CulturalFallbackManager {
  private config: CulturalFallbackConfig;
  private trustCollector: TrustMetricsCollector;

  // Database of culturally-appropriate fallback tones
  private readonly fallbackTones = {
    japanese: {
      ambiguous_input: 'respectful_clarification',
      misunderstood_intent: 'humble_clarification',
      incorrect_information: 'apologetic_correction',
      technical_error: 'patient_explanation',
      complete_failure: 'deeply_apologetic'
    },
    american: {
      ambiguous_input: 'direct_clarification',
      misunderstood_intent: 'straightforward_clarification',
      incorrect_information: 'transparent_correction',
      technical_error: 'helpful_explanation',
      complete_failure: 'accountable_apology'
    },
    arabic: {
      ambiguous_input: 'courteous_clarification',
      misunderstood_intent: 'dignified_clarification',
      incorrect_information: 'respectful_correction',
      technical_error: 'supportive_explanation',
      complete_failure: 'honorable_apology'
    },
    german: {
      ambiguous_input: 'precise_clarification',
      misunderstood_intent: 'structured_clarification',
      incorrect_information: 'factual_correction',
      technical_error: 'detailed_explanation',
      complete_failure: 'direct_apology'
    }
  };

  // Database of culturally-appropriate fallback messages
  private readonly fallbackMessages = {
    japanese: {
      respectful_clarification: 'I apologize, but I'm not entirely certain I understood correctly. Could you please provide a bit more detail?',
      humble_clarification: 'I'm very sorry, but I may have misunderstood your intention. May I respectfully ask for clarification?',
      apologetic_correction: 'I sincerely apologize for the incorrect information. Please allow me to provide the correct details.',
      patient_explanation: 'I regret to inform you that we've encountered a technical issue. May I explain the situation?',
      deeply_apologetic: 'I deeply apologize for this failure on our part. Please accept my sincere regrets for the inconvenience caused.'
    },
    american: {
      direct_clarification: 'I'm not completely sure what you mean. Could you clarify that for me?',
      straightforward_clarification: 'I think I might have misunderstood your intent. What specifically are you looking for?',
      transparent_correction: 'I need to correct my previous information. Here's the accurate data.',
      helpful_explanation: 'We're experiencing a technical issue at the moment. Let me explain what's happening.',
      accountable_apology: 'I apologize for this problem. We'll get it fixed as quickly as possible.'
    },
    arabic: {
      courteous_clarification: 'With all respect, I would be grateful if you could provide additional details to ensure I understand correctly.',
      dignified_clarification: 'With your permission, may I kindly ask for clarification on your request?',
      respectful_correction: 'With respect, I must correct the previous information to ensure accuracy.',
      supportive_explanation: 'I respectfully inform you of a technical matter that requires attention.',
      honorable_apology: 'Please accept my sincere apologies for this situation. It is with deep regret that we face this difficulty.'
    },
    german: {
      precise_clarification: 'For complete accuracy, I need more specific information. Could you provide additional details?',
      structured_clarification: 'To proceed efficiently, I require clarification on the exact requirements.',
      factual_correction: 'The previous information requires correction. Here are the accurate facts.',
      detailed_explanation: 'A technical issue has occurred. Here is a precise explanation of the situation.',
      direct_apology: 'I apologize for this error. We will resolve it systematically.'
    }
  };

  // Cultural recovery strategy attributes
  private readonly recoveryAttributes = {
    japanese: {
      respectfulRedirection: true,
      optionsPresented: true,
      facePreservation: true,
      hierarchyAwareness: true,
      indirectApproach: true
    },
    american: {
      directAlternatives: true,
      clearOptions: true,
      efficientResolution: true,
      transparency: true,
      proactiveSolutions: true
    },
    arabic: {
      courteousRedirection: true,
      relationshipMaintenance: true,
      honorPreservation: true,
      dignifiedOptions: true,
      respectfulAlternatives: true
    },
    german: {
      structuredAlternatives: true,
      efficientProcess: true,
      clarityFocus: true,
      systematicApproach: true,
      preciseOptions: true
    }
  };

  constructor(config: CulturalFallbackConfig) {
    this.config = config;
    this.trustCollector = TrustMetricsCollector.getInstance();
  }

  /**
   * Generate culturally appropriate fallback message
   */
  async generateCulturalFallback(
    failureType: string,
    culture: string,
    context: string,
    severity: string = 'medium'
  ): Promise<CulturalFallbackResult> {
    // What: Generate culturally-appropriate fallback messages when communication fails
    // Why: Different cultures require different approaches to failure recovery
    // How: Use culture-specific tone and messaging with contextual calibration

    if (!failureType || !culture) {
      throw new Error('Missing required parameters for cultural fallback generation');
    }

    // Record metric for this action
    this.trustCollector.recordMetric('cultural_fallback_generation', { 
      culture, 
      failureType, 
      context, 
      severity 
    });

    // Get appropriate fallback tone for this culture and failure type
    const fallbackTone = this.getFallbackTone(culture, failureType);
    
    // Get base fallback message
    let fallbackMessage = this.getFallbackMessage(culture, fallbackTone);
    
    // Adjust for severity
    fallbackMessage = this.adjustForSeverity(fallbackMessage, culture, failureType, severity);
    
    // Calculate recovery probability
    const recoveryProbability = this.calculateRecoveryProbability(culture, failureType, severity);
    
    // Calculate trust preservation
    const trustPreservation = this.calculateTrustPreservation(culture, failureType, context, severity);

    return {
      fallbackMessage,
      culturallyCalibrated: true,
      fallbackTone,
      recoveryProbability,
      trustPreservation
    };
  }

  /**
   * Generate contextually-enhanced fallback message
   */
  async generateContextualFallback(
    failureType: string,
    culture: string,
    enhancedContext: any
  ): Promise<ContextualFallbackResult> {
    // What: Generate fallback messages with enhanced contextual awareness
    // Why: Context (business, social, hierarchy) significantly impacts cultural appropriateness
    // How: Apply context-specific attributes and adjust messaging accordingly

    // Get base cultural fallback
    const baseFallback = await this.generateCulturalFallback(
      failureType,
      culture,
      enhancedContext.context || 'general'
    );
    
    // Initialize message attributes
    const messageAttributes: {[key: string]: boolean} = {};
    
    // Add attributes based on context and culture
    if (culture === 'japanese') {
      if (enhancedContext.context === 'formal_business') {
        messageAttributes.formalLanguage = true;
        messageAttributes.honorifics = true;
        messageAttributes.indirectApproach = true;
      }
      
      if (enhancedContext.hierarchy === 'speaking_to_superior') {
        messageAttributes.hierarchyAcknowledged = true;
        messageAttributes.deferentialTone = true;
      }
    } else if (culture === 'american') {
      if (enhancedContext.context === 'casual_conversation') {
        messageAttributes.formalLanguage = false;
        messageAttributes.directApproach = true;
        messageAttributes.casualTone = true;
      }
      
      if (enhancedContext.hierarchy === 'speaking_to_peer') {
        messageAttributes.equalityBased = true;
      }
    } else if (culture === 'arabic') {
      if (enhancedContext.context === 'formal_business') {
        messageAttributes.respectfulFormality = true;
        messageAttributes.elaborateCourtesy = true;
      }
      
      if (enhancedContext.hierarchy === 'speaking_to_superior') {
        messageAttributes.deferentialTone = true;
        messageAttributes.hierarchyAcknowledged = true;
      }
    } else if (culture === 'german') {
      if (enhancedContext.context === 'technical_discussion') {
        messageAttributes.preciseTone = true;
        messageAttributes.factualFocus = true;
        messageAttributes.structuredResponse = true;
      }
    }
    
    // Adjust message based on attributes if necessary
    let contextualMessage = baseFallback.fallbackMessage;
    
    // Simple example of adaptation - we would normally use more sophisticated NLP here
    if (messageAttributes.formalLanguage === true) {
      contextualMessage = contextualMessage.replace("I'm", "I am")
                                        .replace("we're", "we are")
                                        .replace("don't", "do not");
    }
    
    if (messageAttributes.hierarchyAcknowledged === true) {
      if (culture === 'japanese') {
        contextualMessage = contextualMessage.replace(
          "I apologize", 
          "I humbly apologize"
        );
      } else if (culture === 'arabic') {
        contextualMessage = contextualMessage.replace(
          "With all respect", 
          "With the utmost respect and deference"
        );
      }
    }

    return {
      ...baseFallback,
      fallbackMessage: contextualMessage,
      contextuallyEnhanced: true,
      messageAttributes
    };
  }

  /**
   * Generate culturally-appropriate recovery strategy
   */
  async generateRecoveryStrategy(
    failureType: string,
    culture: string,
    context: string
  ): Promise<RecoveryStrategyResult> {
    // What: Generate culturally-appropriate recovery strategies after communication failures
    // Why: Recovery approaches must align with cultural expectations for effectiveness
    // How: Apply culture-specific recovery attributes and suggested actions

    // Get recovery attributes for this culture
    const recoveryAttributes = this.recoveryAttributes[culture as keyof typeof this.recoveryAttributes] || {};
    
    // Generate recovery message based on culture and failure type
    let recoveryMessage = '';
    const suggestedActions: string[] = [];
    
    if (culture === 'japanese') {
      recoveryMessage = 'Perhaps we could approach this from a different perspective to better understand your needs.';
      suggestedActions.push(
        'Would you prefer more detailed information on this topic?',
        'May I suggest an alternative approach that might be helpful?',
        'Would a visual explanation be more useful in this situation?'
      );
    } else if (culture === 'american') {
      recoveryMessage = 'Let me suggest some alternatives that might work better for you.';
      suggestedActions.push(
        'I can provide more specific information if you tell me exactly what you need.',
        'Let\'s try a different approach to solve this more efficiently.',
        'Would you like me to connect you with a specialist for this topic?'
      );
    } else if (culture === 'arabic') {
      recoveryMessage = 'With your permission, I would like to suggest some alternative approaches that might better serve your needs.';
      suggestedActions.push(
        'Would you honor me by sharing more details about your specific requirements?',
        'May I respectfully suggest an alternative path that might be more suitable?',
        'Would you prefer to continue this discussion with additional information?'
      );
    } else if (culture === 'german') {
      recoveryMessage = 'I would like to propose a systematic approach to address this more effectively.';
      suggestedActions.push(
        'Would you like to provide precise parameters to better define the requirement?',
        'I can suggest an alternative method with higher efficiency for this task.',
        'Would a more structured approach with clear steps be helpful?'
      );
    } else {
      // Default recovery message
      recoveryMessage = 'Let me suggest some alternatives that might help us move forward.';
      suggestedActions.push(
        'Could you provide more details about what you're looking for?',
        'Would you like to try a different approach?',
        'Would additional information on this topic be helpful?'
      );
    }
    
    // Calculate success probability
    const successProbability = this.calculateRecoverySuccessProbability(culture, failureType, context);

    return {
      recoveryMessage,
      suggestedActions,
      culturallyCalibrated: true,
      recoveryAttributes,
      successProbability
    };
  }

  /**
   * Assess trust impact of a cultural fallback
   */
  async assessTrustImpact(
    fallback: CulturalFallbackResult,
    culture: string,
    initialTrust: number
  ): Promise<TrustImpactResult> {
    // What: Calculate the impact on trust after applying a cultural fallback
    // Why: Different cultures have different trust dynamics during failures
    // How: Apply cultural trust factors to calculate new trust score

    // Default trust change factors
    let trustChange = -0.1; // Default negative impact
    const recoveryFactor = fallback.recoveryProbability;
    
    // Initialize cultural factors
    const culturalFactors: {[key: string]: number} = {
      apologyWeight: 0.5,
      transparencyFactor: 0.5,
      respectFactor: 0.5,
      solutionFactor: 0.5
    };
    
    // Adjust cultural factors based on culture
    if (culture === 'japanese') {
      culturalFactors.apologyWeight = 0.8;
      culturalFactors.respectFactor = 0.7;
      
      // Japanese culture values proper apologies highly
      if (fallback.fallbackMessage.includes('sincerely apologize') || 
          fallback.fallbackMessage.includes('deeply apologize')) {
        trustChange = -0.05; // Less negative impact with proper apology
      }
    } else if (culture === 'american') {
      culturalFactors.transparencyFactor = 0.7;
      culturalFactors.solutionFactor = 0.8;
      
      // American culture values solutions and transparency
      if (fallback.fallbackMessage.includes('fix') || 
          fallback.fallbackMessage.includes('resolve') ||
          fallback.fallbackMessage.includes('solution')) {
        trustChange = -0.08;
      }
    } else if (culture === 'arabic') {
      culturalFactors.respectFactor = 0.8;
      culturalFactors.apologyWeight = 0.6;
      
      // Arabic culture values respect and honor
      if (fallback.fallbackMessage.includes('respect') || 
          fallback.fallbackMessage.includes('honor')) {
        trustChange = -0.07;
      }
    } else if (culture === 'german') {
      culturalFactors.transparencyFactor = 0.8;
      culturalFactors.solutionFactor = 0.7;
      
      // German culture values precision and factual communication
      if (fallback.fallbackMessage.includes('precise') || 
          fallback.fallbackMessage.includes('accurate') ||
          fallback.fallbackMessage.includes('facts')) {
        trustChange = -0.06;
      }
    }
    
    // Apply recovery factor to reduce negative impact
    trustChange = trustChange * (1 - (recoveryFactor * 0.5));
    
    // Calculate new trust score
    const newTrustScore = Math.max(0, Math.min(1, initialTrust + trustChange));

    return {
      newTrustScore,
      trustChange,
      recoveryFactor,
      culturalFactors
    };
  }

  /**
   * Generate trust recovery follow-up message
   */
  async generateTrustRecoveryFollowUp(
    failureType: string,
    culture: string,
    context: string,
    currentTrust: number
  ): Promise<TrustRecoveryFollowUp> {
    // What: Generate culturally-appropriate follow-up to recover trust after failure
    // Why: Trust recovery requires cultural sensitivity for effectiveness
    // How: Apply culture-specific trust recovery techniques with appropriate actions

    // Initialize follow-up attributes
    const followUpAttributes: {[key: string]: boolean} = {};
    let followUpMessage = '';
    const followUpActions: string[] = [];
    
    // Base recovery potential
    let trustRecoveryPotential = 0.08;
    
    if (culture === 'japanese') {
      followUpMessage = 'I've reviewed our previous interaction carefully and have taken steps to improve our service. May I demonstrate the improvements we've made?';
      followUpActions.push(
        'Present detailed explanation of improvements made',
        'Offer demonstration of corrected understanding',
        'Provide additional resources to support improved service'
      );
      followUpAttributes.formalFollowUp = true;
      followUpAttributes.demonstratedImprovement = true;
      followUpAttributes.respectfulTone = true;
      
      // Japanese culture values demonstrated improvement
      trustRecoveryPotential += 0.03;
    } else if (culture === 'american') {
      followUpMessage = 'I've fixed the issue we encountered earlier and improved our process. Let me show you how this works better now.';
      followUpActions.push(
        'Demonstrate improved functionality',
        'Explain changes made to prevent future issues',
        'Offer additional support options'
      );
      followUpAttributes.solutionFocused = true;
      followUpAttributes.futureImprovement = true;
      followUpAttributes.directApproach = true;
      
      // American culture values solution demonstration
      trustRecoveryPotential += 0.02;
    } else if (culture === 'arabic') {
      followUpMessage = 'With the greatest respect, I would like to demonstrate how we have addressed the previous matter and improved our service to better honor your needs.';
      followUpActions.push(
        'Present improvements with emphasis on respect',
        'Reaffirm commitment to excellent service',
        'Offer personalized assistance moving forward'
      );
      followUpAttributes.respectfulTone = true;
      followUpAttributes.relationshipReinforcement = true;
      followUpAttributes.honorFocused = true;
      
      // Arabic culture values relationship reinforcement
      trustRecoveryPotential += 0.02;
    } else {
      // Default follow-up for other cultures
      followUpMessage = 'I've addressed the issue we encountered earlier and would like to show you the improvements.';
      followUpActions.push(
        'Demonstrate improved functionality',
        'Explain changes made',
        'Offer continued assistance'
      );
      followUpAttributes.improved = true;
      followUpAttributes.helpful = true;
    }
    
    // Adjust recovery potential based on current trust
    if (currentTrust < 0.5) {
      // Higher recovery potential when trust is low
      trustRecoveryPotential += 0.02;
    }
    
    // Cap the maximum recovery to avoid unrealistic trust jumps
    trustRecoveryPotential = Math.min(trustRecoveryPotential, 0.15);

    return {
      followUpMessage,
      culturallyCalibrated: true,
      trustRecoveryPotential,
      followUpActions,
      followUpAttributes
    };
  }

  /**
   * Generate region and culture integrated fallback
   */
  async generateRegionalCulturalFallback(
    failureType: string,
    culture: string,
    region: string,
    context: string
  ): Promise<RegionalCulturalFallbackResult> {
    // What: Generate fallbacks that integrate both regional and cultural specifics
    // Why: Complete cultural adaptation requires both regional and specific cultural factors
    // How: Blend regional patterns with cultural specifics for optimal expression

    // Get base cultural fallback
    const culturalFallback = await this.generateCulturalFallback(
      failureType,
      culture,
      context
    );
    
    // Initialize influences
    let regionalInfluence = 0.4;
    let culturalInfluence = 0.6;
    
    // Adapt based on region-culture combination
    let fallbackMessage = culturalFallback.fallbackMessage;
    
    // Apply regional influences
    if (region === 'east_asia') {
      // East Asian regional patterns emphasize collective harmony
      fallbackMessage = fallbackMessage.replace(
        "I apologize", 
        "Our team apologizes"
      ).replace(
        "I need to", 
        "We need to"
      );
      
      fallbackMessage += " We value harmony and clear understanding in our communication.";
      regionalInfluence = 0.5; // Stronger regional influence
    } else if (region === 'latin_america') {
      // Latin American patterns emphasize relationship and expression
      fallbackMessage = fallbackMessage.replace(
        "I apologize", 
        "I sincerely apologize"
      );
      
      fallbackMessage += " I truly appreciate your patience and our continued communication.";
      regionalInfluence = 0.4;
    } else if (region === 'northern_europe') {
      // Northern European patterns emphasize clarity and facts
      fallbackMessage = fallbackMessage.replace(
        "I apologize", 
        "I need to clarify"
      );
      
      fallbackMessage += " To move forward precisely, I need specific information to address this correctly.";
      regionalInfluence = 0.5;
    }
    
    // Balance influences
    culturalInfluence = 1 - regionalInfluence;

    return {
      ...culturalFallback,
      fallbackMessage,
      regionallyAdapted: true,
      regionalInfluence,
      culturalInfluence
    };
  }

  // Private helper methods

  /**
   * Get appropriate fallback tone for culture and failure type
   */
  private getFallbackTone(culture: string, failureType: string): string {
    const cultureTones = this.fallbackTones[culture as keyof typeof this.fallbackTones];
    if (!cultureTones) {
      return 'neutral_clarification'; // Default fallback tone
    }
    
    return cultureTones[failureType as keyof typeof cultureTones] || 'neutral_clarification';
  }

  /**
   * Get base fallback message for culture and tone
   */
  private getFallbackMessage(culture: string, tone: string): string {
    const cultureMessages = this.fallbackMessages[culture as keyof typeof this.fallbackMessages];
    if (!cultureMessages) {
      return 'I need to clarify something. Could you provide more details?'; // Default message
    }
    
    return cultureMessages[tone as keyof typeof cultureMessages] || 
           'I need to clarify something. Could you provide more details?';
  }

  /**
   * Adjust fallback message based on severity
   */
  private adjustForSeverity(
    message: string, 
    culture: string, 
    failureType: string, 
    severity: string
  ): string {
    if (severity === 'low') {
      // Less formal/apologetic for low severity
      return message.replace('apologize', 'would like to clarify')
                   .replace('regret', 'note')
                   .replace('sincerely', '')
                   .replace('deeply', '');
    } else if (severity === 'high') {
      // More apologetic for high severity
      if (culture === 'japanese') {
        return message.replace('apologize', 'deeply apologize')
                     .replace('regret', 'sincerely regret')
                     .replace('sorry', 'deeply sorry');
      } else {
        return message.replace('apologize', 'sincerely apologize')
                     .replace('regret', 'deeply regret');
      }
    }
    
    // Default - return original message for medium severity
    return message;
  }

  /**
   * Calculate recovery probability
   */
  private calculateRecoveryProbability(
    culture: string, 
    failureType: string, 
    severity: string
  ): number {
    // Base recovery probability
    let recoveryProbability = 0.8;
    
    // Adjust based on severity
    if (severity === 'low') {
      recoveryProbability += 0.1;
    } else if (severity === 'high') {
      recoveryProbability -= 0.15;
    }
    
    // Adjust based on failure type
    if (failureType === 'minor_misunderstanding') {
      recoveryProbability += 0.05;
    } else if (failureType === 'complete_failure') {
      recoveryProbability -= 0.1;
    }
    
    // Cultural adjustments
    if (culture === 'japanese' && failureType === 'incorrect_information') {
      // Japanese culture has higher standards for information accuracy
      recoveryProbability -= 0.05;
    } else if (culture === 'german' && failureType === 'technical_error') {
      // German culture expects technical competence
      recoveryProbability -= 0.05;
    }
    
    // Ensure within bounds
    return Math.max(0.5, Math.min(0.95, recoveryProbability));
  }

  /**
   * Calculate trust preservation
   */
  private calculateTrustPreservation(
    culture: string, 
    failureType: string, 
    context: string,
    severity: string
  ): number {
    // Base trust preservation
    let trustPreservation = 0.85;
    
    // Adjust based on severity
    if (severity === 'low') {
      trustPreservation += 0.05;
    } else if (severity === 'high') {
      trustPreservation -= 0.1;
    }
    
    // Adjust based on context importance
    if (context === 'important_business' || context === 'critical_decision') {
      trustPreservation -= 0.05;
    }
    
    // Cultural adjustments
    if (culture === 'japanese') {
      if (this.config.culturalSensitivity === 'high') {
        // With high cultural sensitivity, we're better at preserving trust
        trustPreservation += 0.03;
      }
    } else if (culture === 'american') {
      if (failureType === 'technical_error' && this.config.recoveryOptimization) {
        // Americans respond well to technical explanations with recovery plans
        trustPreservation += 0.02;
      }
    }
    
    // Ensure within bounds
    return Math.max(0.7, Math.min(0.95, trustPreservation));
  }

  /**
   * Calculate recovery success probability
   */
  private calculateRecoverySuccessProbability(
    culture: string, 
    failureType: string, 
    context: string
  ): number {
    // Base success probability
    let successProbability = 0.8;
    
    // Adjust based on failure type
    if (failureType === 'minor_misunderstanding') {
      successProbability += 0.1;
    } else if (failureType === 'complete_failure') {
      successProbability -= 0.15;
    }
    
    // Adjust based on context
    if (context === 'business_request') {
      successProbability += 0.05; // Business contexts have clearer pathways
    }
    
    // Cultural adjustments
    if (culture === 'japanese' && this.config.recoveryOptimization) {
      // Japanese culture responds well to carefully crafted recovery
      successProbability += 0.03;
    } else if (culture === 'american' && context === 'business_request') {
      // American business culture values efficiency in recovery
      successProbability += 0.02;
    }
    
    // Ensure within bounds
    return Math.max(0.6, Math.min(0.95, successProbability));
  }
} 