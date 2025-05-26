/**
 * blogblitz.mcp.ts
 * 
 * Purpose:
 * MCP (Mission Control Protocol) for BlogBlitz Prompt
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

interface BlogBlitzInput {
  topic: string;
  audience: string;
  tone: string;
  emotionalOutcome: string;
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
  seoOptimization: number;
  engagementPotential: number;
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
  input: BlogBlitzInput;
  validationStatus: ValidationStatus;
  scoreBreakdown: ScoreBreakdown;
  recoveryStatus: RecoveryStatus;
  revisionCount: number;
}

export class BlogBlitzMCP extends EventEmitter {
  private readonly requiredFields = ['topic', 'audience', 'tone', 'emotionalOutcome'];
  private readonly validTones = ['warm', 'bold', 'calm', 'motivating', 'professional', 'conversational'];
  private readonly validEmotionalOutcomes = ['feel confident', 'feel inspired', 'feel in control', 'feel understood', 'feel empowered'];
  private readonly minScore = 0.75;
  private readonly minEmotionalScore = 0.7;

  // Word count requirements for blog sections
  private readonly wordCountLimits = {
    total: { min: 500, max: 600 },
    intro: { min: 80, max: 120 },
    sections: { min: 150, max: 200 },
    closing: { min: 80, max: 120 }
  };

  // Industry-specific content defaults
  private readonly industryDefaults = {
    'wellness': {
      emotionalOutcome: 'feel balanced and centered',
      tone: 'calm',
      keyMessage: 'sustainable wellness practices'
    },
    'tech': {
      emotionalOutcome: 'feel innovative and ahead',
      tone: 'bold',
      keyMessage: 'cutting-edge solutions'
    },
    'business': {
      emotionalOutcome: 'feel confident and strategic',
      tone: 'professional',
      keyMessage: 'strategic business growth'
    },
    'creative': {
      emotionalOutcome: 'feel inspired and unique',
      tone: 'warm',
      keyMessage: 'creative expression and authenticity'
    }
  };

  // Audience-specific pain point mapping
  private readonly audiencePainMap = {
    'solo service providers': 'struggling with client acquisition and burnout',
    'ecommerce brands': 'difficulty standing out in crowded marketplace',
    'small business owners': 'overwhelmed by marketing and operations',
    'entrepreneurs': 'uncertainty about scaling and growth strategies',
    'coaches': 'challenge of attracting ideal clients consistently'
  };

  private validateWordCount(content: string, section: 'total' | 'intro' | 'sections' | 'closing'): boolean {
    const limits = this.wordCountLimits[section];
    const wordCount = content.trim().split(/\s+/).length;
    return wordCount >= limits.min && wordCount <= limits.max;
  }

  private applyIndustryDefaults(input: BlogBlitzInput): BlogBlitzInput {
    if (!input.industry) return input;

    const defaults = this.industryDefaults[input.industry.toLowerCase()];
    if (!defaults) return input;

    return {
      ...input,
      emotionalOutcome: input.emotionalOutcome || defaults.emotionalOutcome,
      tone: input.tone || defaults.tone,
      keyMessage: input.keyMessage || defaults.keyMessage
    };
  }

  private applyMCPEnhancers(input: BlogBlitzInput): BlogBlitzInput {
    const enhanced = { ...input };

    // Infer missing fields using MCP enhancement logic
    if (!enhanced.customerPain && enhanced.audience) {
      enhanced.customerPain = this.inferPainFromAudience(enhanced.audience);
    }

    if (!enhanced.keyOfferings && enhanced.topic) {
      enhanced.keyOfferings = this.inferOfferingsFromTopic(enhanced.topic);
    }

    if (!enhanced.desiredAction && enhanced.emotionalOutcome) {
      enhanced.desiredAction = this.inferActionFromOutcome(enhanced.emotionalOutcome);
    }

    if (!enhanced.trustSignal && enhanced.industry) {
      enhanced.trustSignal = this.inferTrustFromIndustry(enhanced.industry);
    }

    return enhanced;
  }

  private inferPainFromAudience(audience: string): string {
    for (const [audienceType, pain] of Object.entries(this.audiencePainMap)) {
      if (audience.toLowerCase().includes(audienceType)) {
        return pain;
      }
    }
    return 'unclear direction and overwhelm';
  }

  private inferOfferingsFromTopic(topic: string): string {
    const topicKeywords = topic.toLowerCase();
    
    if (topicKeywords.includes('marketing')) return 'marketing strategy and implementation';
    if (topicKeywords.includes('productivity')) return 'productivity systems and tools';
    if (topicKeywords.includes('wellness')) return 'wellness programs and coaching';
    if (topicKeywords.includes('business')) return 'business consulting and strategy';
    if (topicKeywords.includes('design')) return 'design services and creative solutions';
    
    return 'expert guidance and solutions';
  }

  private inferActionFromOutcome(emotionalOutcome: string): string {
    const outcomeMap = {
      'feel confident': 'book a consultation to build confidence',
      'feel inspired': 'download our inspiration guide',
      'feel in control': 'get our control framework',
      'feel understood': 'join our community of like-minded people',
      'feel empowered': 'start your empowerment journey today'
    };
    
    return outcomeMap[emotionalOutcome] || 'take the next step with us';
  }

  private inferTrustFromIndustry(industry: string): string {
    const trustMap = {
      'wellness': 'certified wellness expertise',
      'tech': 'proven technical track record',
      'business': 'years of business success',
      'creative': 'award-winning creative work',
      'consulting': 'trusted by industry leaders'
    };
    
    return trustMap[industry.toLowerCase()] || 'proven expertise and results';
  }

  async processPrompt(input: BlogBlitzInput): Promise<PromptSession> {
    this.emit('processing_started', { promptType: 'blogblitz', input });

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
      promptType: 'blogblitz',
      input: enhancedInput,
      score: scoreBreakdown.overall,
      emotionalScore: scoreBreakdown.emotionalDepth
    });

    const session: PromptSession = {
      promptType: 'blogblitz',
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

  private async validateInput(input: BlogBlitzInput): Promise<ValidationStatus> {
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

  private validateFieldTypes(input: BlogBlitzInput): string[] {
    const invalidFields: string[] = [];

    if (input.tone && !this.validTones.includes(input.tone)) {
      invalidFields.push('tone');
    }

    if (input.emotionalOutcome && !this.validEmotionalOutcomes.includes(input.emotionalOutcome)) {
      invalidFields.push('emotionalOutcome');
    }

    return invalidFields;
  }

  private validateEnhancers(enhancers?: BlogBlitzInput['enhancers']): Record<string, boolean> {
    if (!enhancers) return {};

    return {
      emotionalDepth: typeof enhancers.emotionalDepth === 'boolean',
      useAnalogies: typeof enhancers.useAnalogies === 'boolean',
      urgency: typeof enhancers.urgency === 'boolean'
    };
  }

  private async scorePrompt(input: BlogBlitzInput): Promise<ScoreBreakdown> {
    const toneMatch = await this.scoreToneMatch(input.tone);
    const emotionalDepth = await this.scoreEmotionalDepth(input);
    const clarity = await this.scoreClarity(input);
    const completeness = await this.scoreCompleteness(input);
    const seoOptimization = await this.scoreSEOOptimization(input);
    const engagementPotential = await this.scoreEngagementPotential(input);

    const overall = (toneMatch + emotionalDepth + clarity + completeness + seoOptimization + engagementPotential) / 6;

    return {
      overall,
      toneMatch,
      emotionalDepth,
      clarity,
      completeness,
      seoOptimization,
      engagementPotential
    };
  }

  private async scoreToneMatch(tone: string): Promise<number> {
    return this.validTones.includes(tone) ? 1.0 : 0.5;
  }

  private async scoreEmotionalDepth(input: BlogBlitzInput): Promise<number> {
    let score = 0.5; // Base score

    if (input.emotionalOutcome) score += 0.2;
    if (input.emotionalContext?.personalStory) score += 0.1;
    if (input.emotionalContext?.visionQuote) score += 0.1;
    if (input.customerPain) score += 0.1;

    return Math.min(1.0, score);
  }

  private async scoreClarity(input: BlogBlitzInput): Promise<number> {
    let score = 0.5; // Base score

    if (input.topic) score += 0.2;
    if (input.audience) score += 0.2;
    if (input.keyMessage) score += 0.1;

    return Math.min(1.0, score);
  }

  private async scoreCompleteness(input: BlogBlitzInput): Promise<number> {
    const totalFields = Object.keys(input).length;
    const filledFields = Object.values(input).filter(value => 
      value !== undefined && value !== null && value !== ''
    ).length;

    return filledFields / totalFields;
  }

  private async scoreSEOOptimization(input: BlogBlitzInput): Promise<number> {
    let score = 0.6; // Base score

    // Check for keyword-rich topic
    if (input.topic && input.topic.length > 10) score += 0.2;
    
    // Check for target audience specificity
    if (input.audience && input.audience.includes('specific')) score += 0.1;
    
    // Check for actionable content indicators
    if (input.desiredAction) score += 0.1;

    return Math.min(1.0, score);
  }

  private async scoreEngagementPotential(input: BlogBlitzInput): Promise<number> {
    let score = 0.5; // Base score

    // Emotional engagement factors
    if (input.emotionalOutcome) score += 0.2;
    if (input.customerPain) score += 0.1;
    if (input.emotionalContext?.personalStory) score += 0.1;
    if (input.enhancers?.useAnalogies) score += 0.1;

    return Math.min(1.0, score);
  }

  private async handleInvalidInput(
    input: BlogBlitzInput,
    validationStatus: ValidationStatus
  ): Promise<PromptSession> {
    const recoveryAttempt = await routeFallback('blogblitz', {
      missingFields: validationStatus.missingFields,
      invalidFields: validationStatus.invalidFields,
      input
    });

    return {
      promptType: 'blogblitz',
      input,
      validationStatus,
      scoreBreakdown: {
        overall: 0,
        toneMatch: 0,
        emotionalDepth: 0,
        clarity: 0,
        completeness: 0,
        seoOptimization: 0,
        engagementPotential: 0
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
    input: BlogBlitzInput,
    validationStatus: ValidationStatus,
    scoreBreakdown: ScoreBreakdown
  ): Promise<PromptSession> {
    // Attempt recovery with enhanced input
    const enhancedInput = this.applyMCPEnhancers(input);
    const newScore = await this.scorePrompt(enhancedInput);

    return {
      promptType: 'blogblitz',
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
    input: BlogBlitzInput,
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
      promptType: 'blogblitz',
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

  private hasSmartDefaults(original: BlogBlitzInput, enhanced: BlogBlitzInput): boolean {
    return original.tone !== enhanced.tone || 
           original.emotionalOutcome !== enhanced.emotionalOutcome ||
           original.keyMessage !== enhanced.keyMessage;
  }

  private hasMCPEnhancements(original: BlogBlitzInput, enhanced: BlogBlitzInput): boolean {
    return original.customerPain !== enhanced.customerPain ||
           original.keyOfferings !== enhanced.keyOfferings ||
           original.desiredAction !== enhanced.desiredAction ||
           original.trustSignal !== enhanced.trustSignal;
  }
} 