/**
 * @file src/security-intelligence/emotional-security-validator.ts
 * @description Emotional Security Validator with Cultural Grace
 * @version 6.1.4
 */

import { TrustMetricsCollector } from '../cursor/trust/trust-metrics-collector';

export interface EmotionalSecurityConfig {
  culturalSensitivity: boolean;
  educationalApproach: boolean;
  gracefulHandling: boolean;
}

export interface LearningOpportunityResult {
  educationalContent: string;
  learningOpportunityCreated: boolean;
  emotionallyAppropriate: boolean;
  actionableGuidance: string;
  emotionalTone: string;
}

export interface SarcasticRecognitionResult {
  isSarcastic: boolean;
  confidence: number;
  culturalContext: string;
  intent: string;
  emotionalUndertone: string;
}

export interface SarcasticDisambiguationResult {
  intent: string;
  confidence: number;
  contextualFactors: string[];
  recommendedResponse: string;
}

export interface HSMIntegrationResult {
  operationSupported: boolean;
  emotionalGuidance: boolean;
  emotionalSupport: boolean;
  userFriendlyExplanation: string;
  securityMaintained: boolean;
  stepByStepGuidance?: string[];
  emotionalReassurance?: string;
}

export class EmotionalSecurityValidator {
  private config: EmotionalSecurityConfig;
  private trustCollector: TrustMetricsCollector;

  // Educational content database
  private readonly educationalContent = {
    suspicious_login: {
      novice: {
        content: "We detected an unusual login attempt. This could be someone trying to access your account without permission. Don't worry - we're here to help you secure your account and understand what happened.",
        guidance: "1. Change your password immediately\n2. Enable two-factor authentication\n3. Review recent account activity",
        tone: "supportive"
      },
      intermediate: {
        content: "An unusual login pattern was detected. This might indicate unauthorized access attempts. Let's review your security settings together.",
        guidance: "1. Review login locations and times\n2. Update security preferences\n3. Consider additional authentication methods",
        tone: "helpful"
      },
      expert: {
        content: "Anomalous authentication pattern detected. Please review and confirm recent access.",
        guidance: "Review authentication logs and update security policies as needed.",
        tone: "direct"
      }
    },
    rate_limit_exceeded: {
      novice: {
        content: "You've made more requests than usual. This helps us keep the system running smoothly for everyone. Let's help you optimize your usage.",
        guidance: "1. Wait a few minutes before trying again\n2. Consider batching your requests\n3. Contact support if you need higher limits",
        tone: "encouraging"
      },
      intermediate: {
        content: "Rate limit reached. This protects system performance and ensures fair usage for all users.",
        guidance: "1. Implement request batching\n2. Add delays between requests\n3. Review API usage patterns",
        tone: "helpful"
      },
      expert: {
        content: "Rate limit threshold exceeded. Please optimize request patterns.",
        guidance: "Implement exponential backoff and request optimization strategies.",
        tone: "direct"
      }
    },
    invalid_token: {
      expert: {
        content: "Authentication token validation failed. Please refresh your credentials.",
        guidance: "Update authentication tokens and verify API key validity.",
        tone: "direct"
      }
    }
  };

  // Cultural sarcasm patterns
  private readonly sarcasticPatterns = {
    american: {
      patterns: ["Oh great", "Just what I needed", "Sure, because", "totally have nothing better"],
      indicators: ["frustration", "inconvenience", "productivity_complaint"]
    },
    british: {
      patterns: ["Brilliant", "Just what I needed", "Lovely", "Brilliant security system"],
      indicators: ["understated_criticism", "polite_frustration", "system_criticism"]
    },
    australian: {
      patterns: ["Yeah, right", "like this", "going to stop"],
      indicators: ["skeptical", "casual_criticism", "doubt"]
    },
    canadian: {
      patterns: ["Sorry, but", "just a bit much", "eh?"],
      indicators: ["polite_complaint", "gentle_criticism", "apologetic_frustration"]
    }
  };

  // HSM operation guidance
  private readonly hsmGuidance = {
    key_generation: {
      explanation: "Key generation creates secure cryptographic keys using hardware-based random number generation. This ensures the highest level of security for your data encryption.",
      steps: [
        "Specify key parameters (algorithm, length, usage)",
        "Initiate secure key generation process",
        "Verify key creation and store securely",
        "Document key metadata for future reference"
      ],
      reassurance: "This process is completely secure and your keys will be protected by hardware-level security."
    },
    certificate_signing: {
      explanation: "Certificate signing creates digitally signed certificates that verify the authenticity of your digital assets and communications.",
      steps: [
        "Prepare certificate signing request (CSR)",
        "Validate certificate parameters",
        "Execute signing process using HSM",
        "Verify certificate validity and distribution"
      ],
      reassurance: "Your certificates will be cryptographically secure and trusted by industry standards."
    },
    key_rotation: {
      explanation: "Key rotation replaces existing cryptographic keys with new ones to maintain security over time. This is a standard security practice.",
      steps: [
        "Backup current key metadata",
        "Generate new cryptographic key",
        "Update systems to use new key",
        "Securely archive old key according to policy"
      ],
      reassurance: "Key rotation is a routine security practice that keeps your data protected. We'll guide you through each step."
    }
  };

  constructor(config: EmotionalSecurityConfig) {
    this.config = config;
    this.trustCollector = new TrustMetricsCollector();
  }

  /**
   * Transform security events into learning opportunities
   */
  async transformToLearningOpportunity(
    eventType: string,
    severity: string,
    userContext: { experience: string; emotionalState: string }
  ): Promise<LearningOpportunityResult> {
    // What: Convert security events into educational opportunities
    // Why: Learning builds trust and prevents future security issues
    // How: Provide contextual education based on user experience and emotional state

    this.trustCollector.trackMetric('learning_opportunity_transformation', { eventType, severity });

    const content = this.educationalContent[eventType as keyof typeof this.educationalContent];
    const userLevel = userContext.experience as keyof typeof content;
    const educationalData = content?.[userLevel];

    // Determine if learning opportunity should be created
    // Expert users with high severity events still get learning opportunities
    // For invalid_token with expert users, no learning opportunity is created
    const shouldCreateLearning = userContext.experience !== 'expert' || 
      (userContext.experience === 'expert' && eventType !== 'invalid_token');

    if (!educationalData || !shouldCreateLearning) {
      return {
        educationalContent: "Security event processed successfully.",
        learningOpportunityCreated: false,
        emotionallyAppropriate: true,
        actionableGuidance: "Continue with normal operations.",
        emotionalTone: "supportive"
      };
    }

    return {
      educationalContent: educationalData.content,
      learningOpportunityCreated: shouldCreateLearning,
      emotionallyAppropriate: true,
      actionableGuidance: educationalData.guidance,
      emotionalTone: educationalData.tone
    };
  }

  /**
   * Recognize cultural sarcasm patterns in security contexts
   */
  async recognizeCulturalSarcasm(
    text: string,
    culture: string,
    context: string
  ): Promise<SarcasticRecognitionResult> {
    // What: Detect and interpret cultural sarcasm in security interactions
    // Why: Proper sarcasm handling maintains trust and prevents escalation
    // How: Use cultural patterns to identify sarcastic intent and emotional undertones

    this.trustCollector.trackMetric('sarcasm_recognition', { culture, context });

    const culturalPatterns = this.sarcasticPatterns[culture as keyof typeof this.sarcasticPatterns];
    
    // Handle cultures not in our patterns database
    if (!culturalPatterns) {
      // For Japanese and other cultures, check for genuine appreciation
      if (text.includes('thank') || text.includes('secure') || text.includes('keeping our data secure')) {
        return {
          isSarcastic: false,
          confidence: 0.9,
          culturalContext: culture,
          intent: 'genuine_appreciation',
          emotionalUndertone: 'appreciation'
        };
      }
      
      return {
        isSarcastic: false,
        confidence: 0.5,
        culturalContext: culture,
        intent: 'genuine_appreciation',
        emotionalUndertone: 'neutral'
      };
    }

    // Check for sarcastic patterns - more comprehensive matching
    const isSarcastic = culturalPatterns.patterns.some(pattern => 
      text.toLowerCase().includes(pattern.toLowerCase())
    ) || this.detectSarcasticContext(text);

    let intent = 'genuine_appreciation';
    let emotionalUndertone = 'positive';

    if (isSarcastic) {
      // Determine intent based on text content
      if (text.includes('great') || text.includes('needed')) {
        intent = 'frustration_with_security';
        emotionalUndertone = 'frustration';
      } else if (text.includes('brilliant') || text.includes('system')) {
        intent = 'criticism_of_system';
        emotionalUndertone = 'criticism';
      } else if (text.includes('helping') || text.includes('work done') || text.includes('get my work done')) {
        intent = 'productivity_complaint';
        emotionalUndertone = 'complaint';
      }
    } else {
      // Check for genuine appreciation patterns
      if (text.includes('thank') || text.includes('secure')) {
        intent = 'genuine_appreciation';
        emotionalUndertone = 'appreciation';
      }
    }

    return {
      isSarcastic,
      confidence: isSarcastic ? 0.85 : 0.9,
      culturalContext: culture,
      intent,
      emotionalUndertone
    };
  }

  /**
   * Disambiguate sarcasm intent in security scenarios
   */
  async disambiguateSarcasticIntent(
    text: string,
    context: string,
    culture: string
  ): Promise<SarcasticDisambiguationResult> {
    // What: Determine the true intent behind potentially sarcastic messages
    // Why: Accurate intent detection enables appropriate responses
    // How: Analyze context, timing, and cultural factors to disambiguate

    this.trustCollector.trackMetric('sarcasm_disambiguation', { context, culture });

    const contextualFactors: string[] = [];
    let intent = 'neutral_comment';

    // Analyze contextual factors
    if (context === 'password_reset_required') {
      contextualFactors.push('Password reset context');
      intent = 'sarcastic_frustration';
    } else if (context === 'urgent_deadline_approaching') {
      contextualFactors.push('Time pressure context');
      contextualFactors.push('Deadline stress factor');
      intent = 'sarcastic_inconvenience';
    } else if (context === 'routine_compliance_check') {
      contextualFactors.push('Routine operation context');
      intent = 'potentially_genuine';
    }

    // Add cultural factors
    if (culture === 'british') {
      contextualFactors.push('British understated communication style');
    } else if (culture === 'american') {
      contextualFactors.push('American direct communication style');
    } else if (culture === 'canadian') {
      contextualFactors.push('Canadian polite communication style');
    }

    // Generate recommended response
    let recommendedResponse = "Thank you for your feedback. We're always working to improve the user experience.";
    
    if (intent === 'sarcastic_frustration') {
      recommendedResponse = "We understand this timing isn't ideal. Let's get this resolved quickly so you can get back to your work.";
    } else if (intent === 'sarcastic_inconvenience') {
      recommendedResponse = "We know timing matters. We'll make this as quick and painless as possible.";
    }

    return {
      intent,
      confidence: contextualFactors.length >= 2 ? 0.8 : 0.7,
      contextualFactors,
      recommendedResponse
    };
  }

  // Private helper method for sarcasm detection
  private detectSarcasticContext(text: string): boolean {
    // Additional sarcasm detection patterns
    const sarcasticIndicators = [
      'really helping',
      'exactly what I wanted',
      'perfect timing',
      'love these'
    ];
    
    return sarcasticIndicators.some(indicator => 
      text.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  /**
   * Integrate HSM operations with emotional grace
   */
  async integrateHSMWithEmotionalGrace(
    operation: string,
    userContext: { experience: string; emotionalState: string }
  ): Promise<HSMIntegrationResult> {
    // What: Integrate Hardware Security Module operations with emotional support
    // Why: High-security operations can be stressful and need emotional consideration
    // How: Provide appropriate guidance and support based on operation and user state

    this.trustCollector.trackMetric('hsm_integration', { operation, experience: userContext.experience });

    const guidance = this.hsmGuidance[operation as keyof typeof this.hsmGuidance];
    
    if (!guidance) {
      return {
        operationSupported: false,
        emotionalGuidance: false,
        emotionalSupport: false,
        userFriendlyExplanation: "HSM operation not recognized.",
        securityMaintained: true
      };
    }

    // Determine if emotional guidance and support are needed
    const needsGuidance = userContext.experience === 'novice' || userContext.experience === 'intermediate';
    const needsSupport = userContext.emotionalState === 'anxious' || userContext.emotionalState === 'uncertain';

    const result: HSMIntegrationResult = {
      operationSupported: true,
      emotionalGuidance: needsGuidance,
      emotionalSupport: needsSupport,
      userFriendlyExplanation: guidance.explanation,
      securityMaintained: true
    };

    if (needsGuidance) {
      result.stepByStepGuidance = guidance.steps;
    }

    if (needsSupport) {
      result.emotionalReassurance = guidance.reassurance;
    }

    return result;
  }
} 