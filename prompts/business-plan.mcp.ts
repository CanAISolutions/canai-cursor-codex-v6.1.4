/**
 * business-plan.mcp.ts
 * 
 * Purpose:
 * MCP (Mission Control Protocol) for Business Plan Prompt
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

interface BusinessPlanInput {
  industry: string;
  goal: string;
  tone: string;
  targetMarket?: string;
  budget?: number;
  timeline?: string;
  // Enhanced fields from schema lock v3
  idea?: string;
  audience?: string;
  problemSolved?: string;
  differentiator?: string;
  customerContent?: string;
  founderBio?: string;
  archetype?: string;
  voice?: string;
  vibe?: string;
  financials?: {
    revenueModel?: string;
    pricingNotes?: string;
    financialMaturity?: 'early' | 'growth' | 'mature';
    initialInvestment?: number;
    projectedRevenue?: number;
    breakEvenPoint?: number;
  };
  emotionalContext?: {
    personalStory?: string;
    visionQuote?: string;
    motivator?: string;
    founderBackground?: string;
    emotionalDrivers?: {
      marketNeed?: string;
      personalConnection?: string;
      impactDesire?: string;
    };
  };
  enhancers?: {
    emotionalDepth?: boolean;
    useAnalogies?: boolean;
    urgency?: boolean;
  };
}

// Add section word limits interface
interface SectionWordLimits {
  executiveSummary: { min: number; max: number };
  marketAnalysis: { min: number; max: number };
  businessModel: { min: number; max: number };
  financialProjections: { min: number; max: number };
  implementationPlan: { min: number; max: number };
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
  emotionalScores: {
    executiveSummary: number;
    marketAnalysis: number;
    businessModel: number;
    financialProjections: number;
    implementationPlan: number;
  };
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
  input: BusinessPlanInput;
  validationStatus: ValidationStatus;
  scoreBreakdown: ScoreBreakdown;
  recoveryStatus: RecoveryStatus;
  revisionCount: number;
}

export class BusinessPlanMCP extends EventEmitter {
  private readonly requiredFields = ['industry', 'goal', 'tone'];
  private readonly validTones = ['professional', 'conversational', 'enthusiastic', 'analytical'];
  private readonly minScore = 0.75;
  private readonly minEmotionalScore = 0.7;

  // Add section word limits
  private readonly sectionWordLimits: SectionWordLimits = {
    executiveSummary: { min: 150, max: 300 },
    marketAnalysis: { min: 200, max: 400 },
    businessModel: { min: 250, max: 500 },
    financialProjections: { min: 150, max: 300 },
    implementationPlan: { min: 200, max: 400 }
  };

  // Add emotional depth requirements
  private readonly emotionalRequirements = {
    executiveSummary: {
      requiredElements: ['visionQuote', 'personalStory'],
      minDepth: 0.8
    },
    marketAnalysis: {
      requiredElements: ['emotionalDrivers.marketNeed'],
      minDepth: 0.7
    },
    businessModel: {
      requiredElements: ['emotionalDrivers.personalConnection'],
      minDepth: 0.7
    },
    financialProjections: {
      requiredElements: ['emotionalDrivers.impactDesire'],
      minDepth: 0.6
    },
    implementationPlan: {
      requiredElements: ['motivator'],
      minDepth: 0.7
    }
  };

  // Add industry-specific financial defaults
  private readonly financialDefaults = {
    saas: {
      revenueModel: "Subscription-based with tiered pricing",
      pricingNotes: "Freemium model with premium features",
      financialMaturity: "growth" as const,
      initialInvestment: 500000,
      projectedRevenue: 2000000,
      breakEvenPoint: 18
    },
    ecommerce: {
      revenueModel: "Direct-to-consumer sales",
      pricingNotes: "Competitive pricing with premium positioning",
      financialMaturity: "early" as const,
      initialInvestment: 300000,
      projectedRevenue: 1500000,
      breakEvenPoint: 12
    },
    healthcare: {
      revenueModel: "Service-based with insurance billing",
      pricingNotes: "Value-based pricing model",
      financialMaturity: "mature" as const,
      initialInvestment: 1000000,
      projectedRevenue: 5000000,
      breakEvenPoint: 24
    },
    fintech: {
      revenueModel: "Transaction-based with subscription tiers",
      pricingNotes: "Usage-based pricing with enterprise options",
      financialMaturity: "growth" as const,
      initialInvestment: 750000,
      projectedRevenue: 3000000,
      breakEvenPoint: 20
    }
  };

  // Add word count validation method
  private validateSectionWordCount(section: string, content: string): boolean {
    const limits = this.sectionWordLimits[section as keyof SectionWordLimits];
    if (!limits) return true; // Skip validation for unknown sections
    
    const wordCount = content.trim().split(/\s+/).length;
    return wordCount >= limits.min && wordCount <= limits.max;
  }

  // Add smart defaults application method
  private applyFinancialDefaults(input: BusinessPlanInput): BusinessPlanInput {
    if (!input.financials) {
      input.financials = {};
    }

    const industryDefaults = this.financialDefaults[input.industry.toLowerCase() as keyof typeof this.financialDefaults] 
      || this.financialDefaults.saas; // Fallback to SaaS defaults

    // Apply defaults only for missing fields
    if (!input.financials.revenueModel) {
      input.financials.revenueModel = industryDefaults.revenueModel;
    }
    if (!input.financials.pricingNotes) {
      input.financials.pricingNotes = industryDefaults.pricingNotes;
    }
    if (!input.financials.financialMaturity) {
      input.financials.financialMaturity = industryDefaults.financialMaturity;
    }
    if (!input.financials.initialInvestment) {
      input.financials.initialInvestment = industryDefaults.initialInvestment;
    }
    if (!input.financials.projectedRevenue) {
      input.financials.projectedRevenue = industryDefaults.projectedRevenue;
    }
    if (!input.financials.breakEvenPoint) {
      input.financials.breakEvenPoint = industryDefaults.breakEvenPoint;
    }

    return input;
  }

  // MCP Enhancer Logic - Auto-fill missing fields
  private applyMCPEnhancers(input: BusinessPlanInput): BusinessPlanInput {
    const enhanced = { ...input };

    // Infer problemSolved from idea/goal
    if (!enhanced.problemSolved && (enhanced.idea || enhanced.goal)) {
      enhanced.problemSolved = this.inferProblemFromIdea(enhanced.idea || enhanced.goal);
    }

    // Infer customerContent from audience/targetMarket
    if (!enhanced.customerContent && (enhanced.audience || enhanced.targetMarket)) {
      enhanced.customerContent = this.inferContentFromAudience(enhanced.audience || enhanced.targetMarket || '');
    }

    // Infer differentiator from idea/industry
    if (!enhanced.differentiator && enhanced.idea) {
      enhanced.differentiator = this.inferDifferentiatorFromIdea(enhanced.idea, enhanced.industry);
    }

    // Infer founderBio from emotionalContext
    if (!enhanced.founderBio && enhanced.emotionalContext) {
      enhanced.founderBio = this.inferFounderFromContext(enhanced.emotionalContext);
    }

    // Apply emotional defaults if missing
    if (!enhanced.tone) {
      enhanced.tone = 'supportive';
    }
    if (!enhanced.voice) {
      enhanced.voice = 'empowering';
    }
    if (!enhanced.vibe) {
      enhanced.vibe = 'professional';
    }

    return enhanced;
  }

  private inferProblemFromIdea(idea: string): string {
    // Simple inference logic - can be enhanced with ML
    const problemKeywords = {
      'efficiency': 'Inefficient processes and wasted time',
      'communication': 'Poor communication and collaboration',
      'automation': 'Manual tasks consuming valuable resources',
      'analytics': 'Lack of data-driven insights',
      'customer': 'Difficulty understanding customer needs',
      'scale': 'Challenges scaling operations effectively',
      'cost': 'High operational costs and budget constraints'
    };

    const lowerIdea = idea.toLowerCase();
    for (const [keyword, problem] of Object.entries(problemKeywords)) {
      if (lowerIdea.includes(keyword)) {
        return problem;
      }
    }

    return 'Addressing key market inefficiencies and customer pain points';
  }

  private inferContentFromAudience(audience: string): string {
    const audienceTemplates = {
      'small business': 'Content focused on practical solutions for small business owners, emphasizing cost-effectiveness and ease of implementation.',
      'enterprise': 'Enterprise-grade content highlighting scalability, security, and ROI for large organizations.',
      'startup': 'Startup-focused content emphasizing agility, innovation, and rapid growth potential.',
      'healthcare': 'Healthcare-specific content addressing compliance, patient care, and operational efficiency.',
      'education': 'Educational content focusing on learning outcomes, accessibility, and institutional needs.'
    };

    const lowerAudience = audience.toLowerCase();
    for (const [key, template] of Object.entries(audienceTemplates)) {
      if (lowerAudience.includes(key)) {
        return template;
      }
    }

    return `Tailored content for ${audience}, addressing their specific needs and challenges.`;
  }

  private inferDifferentiatorFromIdea(idea: string, industry: string): string {
    const differentiatorTemplates = {
      'saas': 'Unique SaaS solution with innovative features and superior user experience',
      'ecommerce': 'Distinctive e-commerce platform with enhanced customer journey',
      'healthcare': 'Advanced healthcare solution improving patient outcomes',
      'fintech': 'Cutting-edge financial technology with enhanced security and usability',
      'education': 'Revolutionary educational platform transforming learning experiences'
    };

    const industryDiff = differentiatorTemplates[industry.toLowerCase() as keyof typeof differentiatorTemplates];
    if (industryDiff) {
      return industryDiff;
    }

    return `Innovative approach combining ${idea} with industry-leading practices`;
  }

  private inferFounderFromContext(emotionalContext: BusinessPlanInput['emotionalContext']): string {
    if (!emotionalContext) {
      return 'Experienced entrepreneur with deep industry knowledge and passion for innovation';
    }

    const { personalStory, founderBackground, motivator } = emotionalContext;
    
    if (founderBackground) {
      return founderBackground;
    }

    if (personalStory && motivator) {
      return `${personalStory} Driven by ${motivator} to create meaningful impact.`;
    }

    if (personalStory) {
      return personalStory;
    }

    return 'Passionate founder with vision to transform the industry through innovative solutions';
  }

  // Enhance processPrompt to include MCP enhancers
  async processPrompt(input: BusinessPlanInput): Promise<PromptSession> {
    // Apply MCP enhancers first
    const mcpEnhanced = this.applyMCPEnhancers(input);
    
    // Apply smart defaults after MCP enhancement
    const enhancedInput = this.applyFinancialDefaults(mcpEnhanced);

    // 1. Input Validation
    const validationStatus = await this.validateInput(enhancedInput);
    if (!validationStatus.isValid) {
      this.emit('validationFailed', validationStatus);
      return this.handleInvalidInput(enhancedInput, validationStatus);
    }

    // 2. QA Scoring
    const scoreBreakdown = await this.scorePrompt(enhancedInput);
    if (scoreBreakdown.overall < this.minScore) {
      this.emit('scoreBelowThreshold', scoreBreakdown);
      return this.handleLowScore(enhancedInput, validationStatus, scoreBreakdown);
    }

    // 3. Emotional Validation
    const emotionalScore = await validateEmotionalTone(enhancedInput.tone);
    if (emotionalScore < this.minScore) {
      this.emit('emotionalMismatch', emotionalScore);
      return this.handleEmotionalMismatch(enhancedInput, validationStatus, scoreBreakdown);
    }

    // 4. Log Session with enhancement flags
    const session: PromptSession = {
      promptType: 'business_plan',
      input: enhancedInput,
      validationStatus,
      scoreBreakdown,
      recoveryStatus: { 
        triggered: false, 
        strategy: '', 
        attempts: 0, 
        success: true,
        smartDefaultUsed: Object.keys(input.financials || {}).length < Object.keys(enhancedInput.financials || {}).length,
        mcpEnhancementUsed: this.hasMCPEnhancements(input, enhancedInput)
      },
      revisionCount: 0
    };

    await logPromptSession(session);
    this.emit('sessionLogged', session);

    return session;
  }

  private async validateInput(input: BusinessPlanInput): Promise<ValidationStatus> {
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

  private validateFieldTypes(input: BusinessPlanInput): string[] {
    const invalid: string[] = [];
    
    if (input.industry && typeof input.industry !== 'string') {
      invalid.push('industry');
    }
    if (input.goal && typeof input.goal !== 'string') {
      invalid.push('goal');
    }
    if (input.tone && !this.validTones.includes(input.tone)) {
      invalid.push('tone');
    }
    if (input.budget && typeof input.budget !== 'number') {
      invalid.push('budget');
    }
    if (input.timeline && typeof input.timeline !== 'string') {
      invalid.push('timeline');
    }

    return invalid;
  }

  private validateEnhancers(enhancers?: BusinessPlanInput['enhancers']): Record<string, boolean> {
    if (!enhancers) return {};
    
    return {
      emotionalDepth: typeof enhancers.emotionalDepth === 'boolean',
      useAnalogies: typeof enhancers.useAnalogies === 'boolean',
      urgency: typeof enhancers.urgency === 'boolean'
    };
  }

  private async validateEmotionalDepth(input: BusinessPlanInput, section: string): Promise<number> {
    const requirements = this.emotionalRequirements[section as keyof typeof this.emotionalRequirements];
    if (!requirements) return 1.0;

    const emotionalContext = input.emotionalContext || {};
    let score = 0;
    let totalElements = 0;

    // Check required emotional elements
    for (const element of requirements.requiredElements) {
      const value = element.split('.').reduce((obj, key) => obj?.[key], emotionalContext);
      if (value && typeof value === 'string' && value.trim().length > 0) {
        score++;
      }
      totalElements++;
    }

    // Calculate section emotional depth score
    const depthScore = totalElements > 0 ? score / totalElements : 1.0;
    return depthScore >= requirements.minDepth ? 1.0 : depthScore;
  }

  // Enhance scorePrompt method to include emotional depth validation
  private async scorePrompt(input: BusinessPlanInput): Promise<ScoreBreakdown> {
    const baseScore = await scorePrompt({
      promptType: 'business_plan',
      input,
      context: {
        requiredFields: this.requiredFields,
        validTones: this.validTones
      }
    });

    // Add word count validation to scoring
    const wordCountScore = this.validateWordCounts(baseScore.sections);
    
    // Calculate emotional depth scores for each section
    const emotionalScores = {
      executiveSummary: await this.validateEmotionalDepth(input, 'executiveSummary'),
      marketAnalysis: await this.validateEmotionalDepth(input, 'marketAnalysis'),
      businessModel: await this.validateEmotionalDepth(input, 'businessModel'),
      financialProjections: await this.validateEmotionalDepth(input, 'financialProjections'),
      implementationPlan: await this.validateEmotionalDepth(input, 'implementationPlan')
    };

    // Calculate overall emotional depth score
    const emotionalDepthScore = Object.values(emotionalScores).reduce((sum, score) => sum + score, 0) / 5;

    return {
      ...baseScore,
      clarity: baseScore.clarity * wordCountScore,
      emotionalDepth: emotionalDepthScore,
      emotionalScores
    };
  }

  // Add word count validation helper
  private validateWordCounts(sections: Record<string, string>): number {
    let validSections = 0;
    let totalSections = 0;

    for (const [section, content] of Object.entries(sections)) {
      if (this.validateSectionWordCount(section, content)) {
        validSections++;
      }
      totalSections++;
    }

    return totalSections > 0 ? validSections / totalSections : 1;
  }

  private async handleInvalidInput(
    input: BusinessPlanInput,
    validationStatus: ValidationStatus
  ): Promise<PromptSession> {
    const recoveryStatus = await routeFallback('validation', {
      promptType: 'business_plan',
      input,
      validationStatus
    });

    return {
      promptType: 'business_plan',
      input,
      validationStatus,
      scoreBreakdown: {
        overall: 0,
        toneMatch: 0,
        emotionalDepth: 0,
        clarity: 0,
        completeness: 0,
        emotionalScores: {
          executiveSummary: 0,
          marketAnalysis: 0,
          businessModel: 0,
          financialProjections: 0,
          implementationPlan: 0
        }
      },
      recoveryStatus,
      revisionCount: 0
    };
  }

  private async handleLowScore(
    input: BusinessPlanInput,
    validationStatus: ValidationStatus,
    scoreBreakdown: ScoreBreakdown
  ): Promise<PromptSession> {
    const recoveryStatus = await routeFallback('scoring', {
      promptType: 'business_plan',
      input,
      scoreBreakdown
    });

    return {
      promptType: 'business_plan',
      input,
      validationStatus,
      scoreBreakdown,
      recoveryStatus,
      revisionCount: 0
    };
  }

  private async handleEmotionalMismatch(
    input: BusinessPlanInput,
    validationStatus: ValidationStatus,
    scoreBreakdown: ScoreBreakdown
  ): Promise<PromptSession> {
    const recoveryStatus = await routeFallback('emotional', {
      promptType: 'business_plan',
      input,
      scoreBreakdown
    });

    return {
      promptType: 'business_plan',
      input,
      validationStatus,
      scoreBreakdown,
      recoveryStatus,
      revisionCount: 0
    };
  }

  private hasMCPEnhancements(original: BusinessPlanInput, enhanced: BusinessPlanInput): boolean {
    return (
      (!original.problemSolved && !!enhanced.problemSolved) ||
      (!original.customerContent && !!enhanced.customerContent) ||
      (!original.differentiator && !!enhanced.differentiator) ||
      (!original.founderBio && !!enhanced.founderBio)
    );
  }
}

// Export singleton instance
export const businessPlanMCP = new BusinessPlanMCP();