/**
 * ad_amplify.mcp.ts
 * 
 * Purpose:
 * MCP (Mission Control Protocol) for Ad Amplify Prompt
 * Enforces input validation, QA scoring, fallback routing, and TAP compliance.
 * 
 * TAP-Status: Locked
 * Codex: v6.1.4
 * Fallback: Yes
 * EmotionQA: Enabled
 * MCP Enhancement: Enabled (v3 Schema Lock)
 */

import { EventEmitter } from 'events';
import { validateInput } from '../cursor/agents/input-validator';
import { scorePrompt } from '../cursor/agents/qa-scorer';
import { validateEmotionalTone } from '../cursor/agents/empathy-validator';
import { routeFallback } from '../cursor/self-healing/fallbackRouter';
import { logPromptSession } from '../cursor/logs/prompt-logs';

interface AdAmplifyInput {
  platform: string;
  productOffer: string;
  audience: string;
  tone: string;
  emotionalGoal: string;
  // Enhanced fields from schema lock v3
  bizName?: string;
  industry?: string;
  goal?: string;
  keyOfferings?: string;
  customerPain?: string;
  differentiator?: string;
  trustSignal?: string;
  desiredAction?: string;
  keyMessage?: string;
  promoOffer?: string;
  usp?: string;
  emotionalContext?: {
    personalStory?: string;
    visionQuote?: string;
    motivator?: string;
    brandFeel?: string;
    emotions?: string[];
  };
  enhancers?: {
    emotionalDepth?: boolean;
    useAnalogies?: boolean;
    urgency?: boolean;
  };
}

interface ValidationStatus {
  isValid: boolean;
  missingFields: string[];
  invalidFields: string[];
  enhancerStatus: Record<string, boolean>;
}

interface ScoreBreakdown {
  overall: number;
  toneMatch: number;
  emotionalDepth: number;
  clarity: number;
  completeness: number;
  platformOptimization: number;
  conversionPotential: number;
}

interface RecoveryStatus {
  triggered: boolean;
  strategy: string;
  attempts: number;
  success: boolean;
  smartDefaultUsed: boolean;
  mcpEnhancementUsed: boolean;
}

interface PromptSession {
  promptType: string;
  input: AdAmplifyInput;
  validationStatus: ValidationStatus;
  scoreBreakdown: ScoreBreakdown;
  recoveryStatus: RecoveryStatus;
  revisionCount: number;
}

export class AdAmplifyMCP extends EventEmitter {
  private readonly requiredFields = ['platform', 'productOffer', 'audience', 'tone', 'emotionalGoal'];
  private readonly validPlatforms = ['Facebook', 'Google', 'Instagram', 'X', 'LinkedIn', 'TikTok'];
  private readonly validTones = ['calm', 'bold', 'rebellious', 'warm', 'professional', 'urgent'];
  private readonly validEmotionalGoals = ['spark urgency', 'build trust', 'feel seen', 'feel empowered', 'create desire'];
  private readonly minScore = 0.75;
  private readonly minEmotionalScore = 0.7;

  // Platform-specific constraints and optimization
  private readonly platformConstraints = {
    'Facebook': { 
      headlineMax: 40, 
      copyMax: 125, 
      ctaRequired: true,
      imageRequired: true 
    },
    'Google': { 
      headlineMax: 30, 
      copyMax: 90, 
      ctaRequired: true,
      keywordOptimized: true 
    },
    'Instagram': { 
      headlineMax: 50, 
      copyMax: 150, 
      hashtagsAllowed: true,
      visualFocus: true 
    },
    'X': { 
      headlineMax: 25, 
      copyMax: 280, 
      ctaRequired: false,
      threadCapable: true 
    },
    'LinkedIn': { 
      headlineMax: 60, 
      copyMax: 200, 
      professionalTone: true,
      b2bFocus: true 
    },
    'TikTok': { 
      headlineMax: 30, 
      copyMax: 100, 
      videoRequired: true,
      trendAware: true 
    }
  };

  // Industry-specific ad defaults
  private readonly industryDefaults = {
    'ecommerce': {
      emotionalGoal: 'create desire',
      tone: 'bold',
      desiredAction: 'Shop Now',
      trustSignal: 'thousands of happy customers'
    },
    'saas': {
      emotionalGoal: 'build trust',
      tone: 'professional',
      desiredAction: 'Start Free Trial',
      trustSignal: 'trusted by leading companies'
    },
    'coaching': {
      emotionalGoal: 'feel empowered',
      tone: 'warm',
      desiredAction: 'Book Discovery Call',
      trustSignal: 'certified expert with proven results'
    },
    'consulting': {
      emotionalGoal: 'feel seen',
      tone: 'professional',
      desiredAction: 'Schedule Consultation',
      trustSignal: 'industry expertise and track record'
    }
  };

  // Emotional goal to CTA mapping
  private readonly emotionalCTAMap = {
    'spark urgency': ['Act Now', 'Limited Time', 'Don\'t Miss Out'],
    'build trust': ['Learn More', 'See How', 'Discover Why'],
    'feel seen': ['Get Started', 'Find Your Solution', 'Take Control'],
    'feel empowered': ['Transform Today', 'Unlock Your Potential', 'Start Your Journey'],
    'create desire': ['Get Yours', 'Shop Now', 'Experience This']
  };

  private validatePlatformCompliance(platform: string, content: { headline?: string; copy?: string }): boolean {
    const constraints = this.platformConstraints[platform];
    if (!constraints) return true;

    if (content.headline && content.headline.length > constraints.headlineMax) return false;
    if (content.copy && content.copy.length > constraints.copyMax) return false;

    return true;
  }

  private applyIndustryDefaults(input: AdAmplifyInput): AdAmplifyInput {
    if (!input.industry) return input;

    const defaults = this.industryDefaults[input.industry.toLowerCase()];
    if (!defaults) return input;

    return {
      ...input,
      emotionalGoal: input.emotionalGoal || defaults.emotionalGoal,
      tone: input.tone || defaults.tone,
      desiredAction: input.desiredAction || defaults.desiredAction,
      trustSignal: input.trustSignal || defaults.trustSignal
    };
  }

  private applyMCPEnhancers(input: AdAmplifyInput): AdAmplifyInput {
    const enhanced = { ...input };

    // Infer missing fields using MCP enhancement logic
    if (!enhanced.customerPain && enhanced.audience) {
      enhanced.customerPain = this.inferPainFromAudience(enhanced.audience);
    }

    if (!enhanced.keyOfferings && enhanced.productOffer) {
      enhanced.keyOfferings = enhanced.productOffer;
    }

    if (!enhanced.desiredAction && enhanced.emotionalGoal) {
      enhanced.desiredAction = this.inferCTAFromEmotionalGoal(enhanced.emotionalGoal);
    }

    if (!enhanced.usp && enhanced.differentiator) {
      enhanced.usp = enhanced.differentiator;
    }

    if (!enhanced.keyMessage && enhanced.productOffer && enhanced.customerPain) {
      enhanced.keyMessage = this.inferKeyMessageFromOfferAndPain(enhanced.productOffer, enhanced.customerPain);
    }

    return enhanced;
  }

  private inferPainFromAudience(audience: string): string {
    const audiencePainMap = {
      'busy solo coaches': 'struggling to attract consistent clients',
      'ecom brands scaling': 'difficulty standing out in crowded market',
      'small business owners': 'overwhelmed by marketing complexity',
      'entrepreneurs': 'uncertainty about effective advertising',
      'service providers': 'challenge converting leads to customers'
    };

    for (const [audienceType, pain] of Object.entries(audiencePainMap)) {
      if (audience.toLowerCase().includes(audienceType.split(' ')[0])) {
        return pain;
      }
    }
    return 'unclear value proposition and messaging';
  }

  private inferCTAFromEmotionalGoal(emotionalGoal: string): string {
    const ctaOptions = this.emotionalCTAMap[emotionalGoal];
    return ctaOptions ? ctaOptions[0] : 'Learn More';
  }

  private inferKeyMessageFromOfferAndPain(offer: string, pain: string): string {
    return `Transform ${pain.split(' ')[0]} with ${offer.split(' ')[0]}`;
  }

  async processPrompt(input: AdAmplifyInput): Promise<PromptSession> {
    this.emit('processing_started', { promptType: 'ad_amplify', input });

    // Apply industry defaults and MCP enhancements
    const enhancedInput = this.applyMCPEnhancers(this.applyIndustryDefaults(input));

    // Validate input
    const validationStatus = await this.validateInput(enhancedInput);
    
    if (!validationStatus.isValid) {
      return await this.handleInvalidInput(enhancedInput, validationStatus);
    }

    // Score the prompt
    const scoreBreakdown = await this.scorePrompt(enhancedInput);
    
    if (scoreBreakdown.overall < this.minScore) {
      return await this.handleLowScore(enhancedInput, validationStatus, scoreBreakdown);
    }

    if (scoreBreakdown.emotionalDepth < this.minEmotionalScore) {
      return await this.handleEmotionalMismatch(enhancedInput, validationStatus, scoreBreakdown);
    }

    // Log successful session
    await logPromptSession({
      promptType: 'ad_amplify',
      input: enhancedInput,
      score: scoreBreakdown.overall,
      emotionalScore: scoreBreakdown.emotionalDepth
    });

    const session: PromptSession = {
      promptType: 'ad_amplify',
      input: enhancedInput,
      validationStatus,
      scoreBreakdown,
      recoveryStatus: {
        triggered: false,
        strategy: 'none',
        attempts: 0,
        success: true,
        smartDefaultUsed: this.hasSmartDefaults(input, enhancedInput),
        mcpEnhancementUsed: this.hasMCPEnhancements(input, enhancedInput)
      },
      revisionCount: 0
    };

    this.emit('processing_completed', session);
    return session;
  }

  private async validateInput(input: AdAmplifyInput): Promise<ValidationStatus> {
    const missingFields = this.requiredFields.filter(field => !input[field]);
    const invalidFields = this.validateFieldTypes(input);
    const enhancerStatus = this.validateEnhancers(input.enhancers);

    return {
      isValid: missingFields.length === 0 && invalidFields.length === 0,
      missingFields,
      invalidFields,
      enhancerStatus
    };
  }

  private validateFieldTypes(input: AdAmplifyInput): string[] {
    const invalidFields: string[] = [];

    if (input.platform && !this.validPlatforms.includes(input.platform)) {
      invalidFields.push('platform');
    }

    if (input.tone && !this.validTones.includes(input.tone)) {
      invalidFields.push('tone');
    }

    if (input.emotionalGoal && !this.validEmotionalGoals.includes(input.emotionalGoal)) {
      invalidFields.push('emotionalGoal');
    }

    return invalidFields;
  }

  private validateEnhancers(enhancers?: AdAmplifyInput['enhancers']): Record<string, boolean> {
    if (!enhancers) return {};

    return {
      emotionalDepth: typeof enhancers.emotionalDepth === 'boolean',
      useAnalogies: typeof enhancers.useAnalogies === 'boolean',
      urgency: typeof enhancers.urgency === 'boolean'
    };
  }

  private async scorePrompt(input: AdAmplifyInput): Promise<ScoreBreakdown> {
    const toneMatch = await this.scoreToneMatch(input.tone);
    const emotionalDepth = await this.scoreEmotionalDepth(input);
    const clarity = await this.scoreClarity(input);
    const completeness = await this.scoreCompleteness(input);
    const platformOptimization = await this.scorePlatformOptimization(input);
    const conversionPotential = await this.scoreConversionPotential(input);

    const overall = (toneMatch + emotionalDepth + clarity + completeness + platformOptimization + conversionPotential) / 6;

    return {
      overall,
      toneMatch,
      emotionalDepth,
      clarity,
      completeness,
      platformOptimization,
      conversionPotential
    };
  }

  private async scoreToneMatch(tone: string): Promise<number> {
    return this.validTones.includes(tone) ? 1.0 : 0.5;
  }

  private async scoreEmotionalDepth(input: AdAmplifyInput): Promise<number> {
    let score = 0.5; // Base score

    if (input.emotionalGoal) score += 0.2;
    if (input.customerPain) score += 0.1;
    if (input.emotionalContext?.personalStory) score += 0.1;
    if (input.enhancers?.emotionalDepth) score += 0.1;

    return Math.min(1.0, score);
  }

  private async scoreClarity(input: AdAmplifyInput): Promise<number> {
    let score = 0.5; // Base score

    if (input.productOffer) score += 0.2;
    if (input.audience) score += 0.2;
    if (input.keyMessage) score += 0.1;

    return Math.min(1.0, score);
  }

  private async scoreCompleteness(input: AdAmplifyInput): Promise<number> {
    const totalFields = Object.keys(input).length;
    const filledFields = Object.values(input).filter(value => 
      value !== undefined && value !== null && value !== ''
    ).length;

    return filledFields / totalFields;
  }

  private async scorePlatformOptimization(input: AdAmplifyInput): Promise<number> {
    if (!input.platform || !this.validPlatforms.includes(input.platform)) {
      return 0.5;
    }

    let score = 0.8; // Base score for valid platform

    // Check platform-specific requirements
    const constraints = this.platformConstraints[input.platform];
    if (constraints) {
      if (constraints.ctaRequired && input.desiredAction) score += 0.1;
      if (constraints.professionalTone && input.tone === 'professional') score += 0.1;
    }

    return Math.min(1.0, score);
  }

  private async scoreConversionPotential(input: AdAmplifyInput): Promise<number> {
    let score = 0.5; // Base score

    // Conversion factors
    if (input.desiredAction) score += 0.2;
    if (input.trustSignal) score += 0.1;
    if (input.promoOffer) score += 0.1;
    if (input.usp) score += 0.1;

    return Math.min(1.0, score);
  }

  private async handleInvalidInput(
    input: AdAmplifyInput,
    validationStatus: ValidationStatus
  ): Promise<PromptSession> {
    const recoveryAttempt = await routeFallback('ad_amplify', {
      missingFields: validationStatus.missingFields,
      invalidFields: validationStatus.invalidFields,
      input
    });

    return {
      promptType: 'ad_amplify',
      input,
      validationStatus,
      scoreBreakdown: {
        overall: 0,
        toneMatch: 0,
        emotionalDepth: 0,
        clarity: 0,
        completeness: 0,
        platformOptimization: 0,
        conversionPotential: 0
      },
      recoveryStatus: {
        triggered: true,
        strategy: 'validation_fallback',
        attempts: 1,
        success: false,
        smartDefaultUsed: false,
        mcpEnhancementUsed: false
      },
      revisionCount: 1
    };
  }

  private async handleLowScore(
    input: AdAmplifyInput,
    validationStatus: ValidationStatus,
    scoreBreakdown: ScoreBreakdown
  ): Promise<PromptSession> {
    // Attempt recovery with enhanced input
    const enhancedInput = this.applyMCPEnhancers(input);
    const newScore = await this.scorePrompt(enhancedInput);

    return {
      promptType: 'ad_amplify',
      input: enhancedInput,
      validationStatus,
      scoreBreakdown: newScore,
      recoveryStatus: {
        triggered: true,
        strategy: 'score_enhancement',
        attempts: 1,
        success: newScore.overall >= this.minScore,
        smartDefaultUsed: false,
        mcpEnhancementUsed: true
      },
      revisionCount: 1
    };
  }

  private async handleEmotionalMismatch(
    input: AdAmplifyInput,
    validationStatus: ValidationStatus,
    scoreBreakdown: ScoreBreakdown
  ): Promise<PromptSession> {
    // Apply emotional enhancement
    const emotionallyEnhanced = {
      ...input,
      enhancers: {
        ...input.enhancers,
        emotionalDepth: true
      }
    };

    const newScore = await this.scorePrompt(emotionallyEnhanced);

    return {
      promptType: 'ad_amplify',
      input: emotionallyEnhanced,
      validationStatus,
      scoreBreakdown: newScore,
      recoveryStatus: {
        triggered: true,
        strategy: 'emotional_enhancement',
        attempts: 1,
        success: newScore.emotionalDepth >= this.minEmotionalScore,
        smartDefaultUsed: false,
        mcpEnhancementUsed: true
      },
      revisionCount: 1
    };
  }

  private hasSmartDefaults(original: AdAmplifyInput, enhanced: AdAmplifyInput): boolean {
    return original.tone !== enhanced.tone || 
           original.emotionalGoal !== enhanced.emotionalGoal ||
           original.desiredAction !== enhanced.desiredAction ||
           original.trustSignal !== enhanced.trustSignal;
  }

  private hasMCPEnhancements(original: AdAmplifyInput, enhanced: AdAmplifyInput): boolean {
    return original.customerPain !== enhanced.customerPain ||
           original.keyOfferings !== enhanced.keyOfferings ||
           original.usp !== enhanced.usp ||
           original.keyMessage !== enhanced.keyMessage;
  }
} 