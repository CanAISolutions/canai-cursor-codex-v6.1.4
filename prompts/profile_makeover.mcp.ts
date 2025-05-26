/**
 * profile_makeover.mcp.ts
 * 
 * Purpose:
 * MCP (Mission Control Protocol) for Profile Makeover Prompt
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

interface ProfileMakeoverInput {
  platform: string;
  currentBio?: string;
  businessType: string;
  tone: string;
  emotionalGoal: string;
  // Enhanced fields from schema lock v3
  bizName?: string;
  audience?: string;
  keyOfferings?: string;
  industry?: string;
  goal?: string;
  customerPain?: string;
  differentiator?: string;
  trustSignal?: string;
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
  input: ProfileMakeoverInput;
  validationStatus: ValidationStatus;
  scoreBreakdown: ScoreBreakdown;
  recoveryStatus: RecoveryStatus;
  revisionCount: number;
}

export class ProfileMakeoverMCP extends EventEmitter {
  private readonly requiredFields = ['platform', 'businessType', 'tone', 'emotionalGoal'];
  private readonly validPlatforms = ['LinkedIn', 'Instagram', 'X', 'TikTok', 'Twitter'];
  private readonly validTones = ['calm', 'bold', 'quirky', 'magnetic', 'professional', 'warm'];
  private readonly minScore = 0.75;
  private readonly minEmotionalScore = 0.7;

  // Platform-specific character limits
  private readonly platformLimits = {
    'LinkedIn': { min: 120, max: 2600 },
    'Instagram': { min: 50, max: 150 },
    'X': { min: 50, max: 160 },
    'TikTok': { min: 50, max: 80 },
    'Twitter': { min: 50, max: 160 }
  };

  // Industry-specific defaults
  private readonly industryDefaults = {
    'wellness': {
      emotionalGoal: 'feel seen and understood',
      tone: 'calm',
      trustSignal: 'certified wellness coach'
    },
    'tech': {
      emotionalGoal: 'feel innovative and forward-thinking',
      tone: 'bold',
      trustSignal: 'industry expertise'
    },
    'creative': {
      emotionalGoal: 'feel inspired and unique',
      tone: 'quirky',
      trustSignal: 'portfolio of work'
    },
    'consulting': {
      emotionalGoal: 'feel professional and trustworthy',
      tone: 'professional',
      trustSignal: 'years of experience'
    }
  };

  private validatePlatformCompliance(platform: string, content: string): boolean {
    const limits = this.platformLimits[platform];
    if (!limits) return true;
    
    const charCount = content.length;
    return charCount >= limits.min && charCount <= limits.max;
  }

  private applyIndustryDefaults(input: ProfileMakeoverInput): ProfileMakeoverInput {
    if (!input.industry) return input;

    const defaults = this.industryDefaults[input.industry.toLowerCase()];
    if (!defaults) return input;

    return {
      ...input,
      emotionalGoal: input.emotionalGoal || defaults.emotionalGoal,
      tone: input.tone || defaults.tone,
      trustSignal: input.trustSignal || defaults.trustSignal
    };
  }

  private applyMCPEnhancers(input: ProfileMakeoverInput): ProfileMakeoverInput {
    const enhanced = { ...input };

    // Infer missing fields using MCP enhancement logic
    if (!enhanced.audience && enhanced.businessType) {
      enhanced.audience = this.inferAudienceFromBusinessType(enhanced.businessType);
    }

    if (!enhanced.keyOfferings && enhanced.businessType) {
      enhanced.keyOfferings = this.inferOfferingsFromBusinessType(enhanced.businessType);
    }

    if (!enhanced.customerPain && enhanced.audience) {
      enhanced.customerPain = this.inferPainFromAudience(enhanced.audience);
    }

    if (!enhanced.differentiator && enhanced.usp) {
      enhanced.differentiator = enhanced.usp;
    }

    return enhanced;
  }

  private inferAudienceFromBusinessType(businessType: string): string {
    const audienceMap = {
      'freelance designer': 'small business owners needing design help',
      'wellness coach': 'busy professionals seeking balance',
      'consultant': 'businesses looking to optimize operations',
      'creative agency': 'brands needing creative solutions',
      'tech startup': 'early adopters and innovators'
    };
    return audienceMap[businessType.toLowerCase()] || 'potential clients';
  }

  private inferOfferingsFromBusinessType(businessType: string): string {
    const offeringsMap = {
      'freelance designer': 'brand design, web design, marketing materials',
      'wellness coach': 'coaching sessions, wellness programs, mindfulness training',
      'consultant': 'strategic consulting, process optimization, business analysis',
      'creative agency': 'branding, marketing campaigns, creative strategy',
      'tech startup': 'innovative software solutions, digital products'
    };
    return offeringsMap[businessType.toLowerCase()] || 'professional services';
  }

  private inferPainFromAudience(audience: string): string {
    const painMap = {
      'small business owners': 'struggling with professional brand presence',
      'busy professionals': 'feeling overwhelmed and unbalanced',
      'businesses': 'inefficient processes and missed opportunities',
      'brands': 'lack of creative direction and brand clarity',
      'early adopters': 'need for cutting-edge solutions'
    };
    
    for (const [key, pain] of Object.entries(painMap)) {
      if (audience.toLowerCase().includes(key)) {
        return pain;
      }
    }
    return 'unclear value proposition';
  }

  async processPrompt(input: ProfileMakeoverInput): Promise<PromptSession> {
    this.emit('processing_started', { promptType: 'profile_makeover', input });

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
      promptType: 'profile_makeover',
      input: enhancedInput,
      score: scoreBreakdown.overall,
      emotionalScore: scoreBreakdown.emotionalDepth
    });

    const session: PromptSession = {
      promptType: 'profile_makeover',
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

  private async validateInput(input: ProfileMakeoverInput): Promise<ValidationStatus> {
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

  private validateFieldTypes(input: ProfileMakeoverInput): string[] {
    const invalidFields: string[] = [];

    if (input.platform && !this.validPlatforms.includes(input.platform)) {
      invalidFields.push('platform');
    }

    if (input.tone && !this.validTones.includes(input.tone)) {
      invalidFields.push('tone');
    }

    return invalidFields;
  }

  private validateEnhancers(enhancers?: ProfileMakeoverInput['enhancers']): Record<string, boolean> {
    if (!enhancers) return {};

    return {
      emotionalDepth: typeof enhancers.emotionalDepth === 'boolean',
      useAnalogies: typeof enhancers.useAnalogies === 'boolean',
      urgency: typeof enhancers.urgency === 'boolean'
    };
  }

  private async scorePrompt(input: ProfileMakeoverInput): Promise<ScoreBreakdown> {
    const toneMatch = await this.scoreToneMatch(input.tone);
    const emotionalDepth = await this.scoreEmotionalDepth(input);
    const clarity = await this.scoreClarity(input);
    const completeness = await this.scoreCompleteness(input);
    const platformOptimization = await this.scorePlatformOptimization(input);

    const overall = (toneMatch + emotionalDepth + clarity + completeness + platformOptimization) / 5;

    return {
      overall,
      toneMatch,
      emotionalDepth,
      clarity,
      completeness,
      platformOptimization
    };
  }

  private async scoreToneMatch(tone: string): Promise<number> {
    return this.validTones.includes(tone) ? 1.0 : 0.5;
  }

  private async scoreEmotionalDepth(input: ProfileMakeoverInput): Promise<number> {
    let score = 0.5; // Base score

    if (input.emotionalGoal) score += 0.2;
    if (input.emotionalContext?.personalStory) score += 0.1;
    if (input.emotionalContext?.visionQuote) score += 0.1;
    if (input.emotionalContext?.motivator) score += 0.1;

    return Math.min(1.0, score);
  }

  private async scoreClarity(input: ProfileMakeoverInput): Promise<number> {
    let score = 0.5; // Base score

    if (input.businessType) score += 0.2;
    if (input.keyOfferings) score += 0.2;
    if (input.audience) score += 0.1;

    return Math.min(1.0, score);
  }

  private async scoreCompleteness(input: ProfileMakeoverInput): Promise<number> {
    const totalFields = Object.keys(input).length;
    const filledFields = Object.values(input).filter(value => 
      value !== undefined && value !== null && value !== ''
    ).length;

    return filledFields / totalFields;
  }

  private async scorePlatformOptimization(input: ProfileMakeoverInput): Promise<number> {
    if (!input.platform || !this.validPlatforms.includes(input.platform)) {
      return 0.5;
    }

    // Platform-specific optimization scoring
    let score = 0.8; // Base score for valid platform

    if (input.currentBio) {
      const isCompliant = this.validatePlatformCompliance(input.platform, input.currentBio);
      score += isCompliant ? 0.2 : 0.0;
    }

    return score;
  }

  private async handleInvalidInput(
    input: ProfileMakeoverInput,
    validationStatus: ValidationStatus
  ): Promise<PromptSession> {
    const recoveryAttempt = await routeFallback('profile_makeover', {
      missingFields: validationStatus.missingFields,
      invalidFields: validationStatus.invalidFields,
      input
    });

    return {
      promptType: 'profile_makeover',
      input,
      validationStatus,
      scoreBreakdown: {
        overall: 0,
        toneMatch: 0,
        emotionalDepth: 0,
        clarity: 0,
        completeness: 0,
        platformOptimization: 0
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
    input: ProfileMakeoverInput,
    validationStatus: ValidationStatus,
    scoreBreakdown: ScoreBreakdown
  ): Promise<PromptSession> {
    // Attempt recovery with enhanced input
    const enhancedInput = this.applyMCPEnhancers(input);
    const newScore = await this.scorePrompt(enhancedInput);

    return {
      promptType: 'profile_makeover',
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
    input: ProfileMakeoverInput,
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
      promptType: 'profile_makeover',
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

  private hasSmartDefaults(original: ProfileMakeoverInput, enhanced: ProfileMakeoverInput): boolean {
    return original.tone !== enhanced.tone || 
           original.emotionalGoal !== enhanced.emotionalGoal ||
           original.trustSignal !== enhanced.trustSignal;
  }

  private hasMCPEnhancements(original: ProfileMakeoverInput, enhanced: ProfileMakeoverInput): boolean {
    return original.audience !== enhanced.audience ||
           original.keyOfferings !== enhanced.keyOfferings ||
           original.customerPain !== enhanced.customerPain ||
           original.differentiator !== enhanced.differentiator;
  }
} 