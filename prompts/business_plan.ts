/**
 * business_plan.ts
 * 
 * Purpose:
 * Enhanced MCP (Mission Control Protocol) for Business Plan Builder
 * Implements standardized 10-field structure with strategic framework enhancement
 * Provides 5-8 field inference for professional business planning
 * 
 * TAP-Status: Enhanced
 * Codex: v6.1.4
 * Fallback: Yes
 * EmotionQA: Enabled
 * MCP Enhancement: Enabled (Strategic Framework)
 * Core Differentiator: Professional Business Strategy
 */

import { EventEmitter } from 'events';
import { composePrompt } from "../lib/composePrompt"
import { estimateTokens } from "../lib/estimateTokens"
import { scorePromptOutput } from "../lib/smartPromptScore"

// Standardized Business Plan Interface (10 Fields - Professional Strategy)
export interface BusinessPlanPrompt {
  // Core 3 fields (required)
  businessName: string;
  targetAudience: string;
  primaryGoal: string;
  
  // Strategic framework fields (7 additional)
  competitiveContext?: string;
  brandVoice?: string;
  resourceConstraints?: string;
  currentStatus?: string;
  businessDescription?: string;
  revenueModel?: string;
  planPurpose?: string;
  
  // Enhanced fields from strategic framework inference (5-8 auto-enhanced)
  industryAnalysis?: string;
  marketOpportunity?: string;
  valueProposition?: string;
  operationalPlan?: string;
  financialProjections?: string;
  riskAssessment?: string;
  implementationTimeline?: string;
  successMetrics?: string;
  
  // Emotional sovereignty integration
  emotionalContext?: {
    founderStory?: string;
    visionStatement?: string;
    motivationalDrivers?: string;
    stakeholderImpact?: string;
    emotionalResonance?: string[];
  };
  
  // Enhancement flags
  enhancers?: {
    strategicDepth?: boolean;
    competitiveAnalysis?: boolean;
    financialDetail?: boolean;
    emotionalSovereignty?: boolean;
    culturalAdaptation?: boolean;
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
  strategicFramework: number;
  competitiveClarity: number;
  financialViability: number;
  emotionalResonance: number;
  implementationFeasibility: number;
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
  input: BusinessPlanPrompt;
  validationStatus: ValidationStatus;
  scoreBreakdown: ScoreBreakdown;
  recoveryStatus: RecoveryStatus;
  revisionCount: number;
}

export class BusinessPlanMCP extends EventEmitter {
  private readonly requiredFields = ['businessName', 'targetAudience', 'primaryGoal'];
  private readonly minScore = 0.75; // Professional business planning threshold
  private readonly minEmotionalScore = 0.8; // Emotional sovereignty requirement
  private readonly minStrategicScore = 4.0; // Strategic framework score out of 5.0

  constructor() {
    super();
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.on('processing_started', (data) => {
      console.log('Business Plan MCP processing started', { 
        businessName: data.input.businessName 
      });
    });

    this.on('processing_completed', (session) => {
      console.log('Business Plan MCP completed', { 
        strategicScore: session.scoreBreakdown.overall 
      });
    });

    this.on('enhancement_applied', (data) => {
      console.log('Business Plan MCP enhancement applied', { 
        enhancementType: data.enhancementType 
      });
    });
  }

  // MCP Enhancer Logic - Auto-fill missing fields for strategic framework (5-8 field inference)
  private applyMCPEnhancers(input: BusinessPlanPrompt): BusinessPlanPrompt {
    const enhanced = { ...input };

    // Infer industryAnalysis from businessDescription and targetAudience
    if (!enhanced.industryAnalysis && enhanced.businessDescription) {
      enhanced.industryAnalysis = this.inferIndustryAnalysis(enhanced.businessDescription, enhanced.targetAudience);
    }

    // Infer marketOpportunity from targetAudience and competitiveContext
    if (!enhanced.marketOpportunity && enhanced.targetAudience) {
      enhanced.marketOpportunity = this.inferMarketOpportunity(enhanced.targetAudience, enhanced.competitiveContext || '');
    }

    // Infer valueProposition from primaryGoal and competitiveContext
    if (!enhanced.valueProposition && enhanced.primaryGoal) {
      enhanced.valueProposition = this.inferValueProposition(enhanced.primaryGoal, enhanced.competitiveContext || '');
    }

    // Infer operationalPlan from businessDescription and resourceConstraints
    if (!enhanced.operationalPlan && enhanced.businessDescription) {
      enhanced.operationalPlan = this.inferOperationalPlan(enhanced.businessDescription, enhanced.resourceConstraints || '');
    }

    // Infer financialProjections from revenueModel and resourceConstraints
    if (!enhanced.financialProjections && enhanced.revenueModel) {
      enhanced.financialProjections = this.inferFinancialProjections(enhanced.revenueModel, enhanced.resourceConstraints || '');
    }

    // Infer riskAssessment from competitiveContext and currentStatus
    if (!enhanced.riskAssessment && enhanced.competitiveContext) {
      enhanced.riskAssessment = this.inferRiskAssessment(enhanced.competitiveContext, enhanced.currentStatus || '');
    }

    // Infer implementationTimeline from primaryGoal and resourceConstraints
    if (!enhanced.implementationTimeline && enhanced.primaryGoal) {
      enhanced.implementationTimeline = this.inferImplementationTimeline(enhanced.primaryGoal, enhanced.resourceConstraints || '');
    }

    // Infer successMetrics from primaryGoal and planPurpose
    if (!enhanced.successMetrics && enhanced.primaryGoal) {
      enhanced.successMetrics = this.inferSuccessMetrics(enhanced.primaryGoal, enhanced.planPurpose || '');
    }

    // Auto-generate emotional context if missing
    if (!enhanced.emotionalContext) {
      enhanced.emotionalContext = this.generateEmotionalContext(enhanced);
    }

    // Auto-enable strategic enhancers
    if (!enhanced.enhancers) {
      enhanced.enhancers = {
        strategicDepth: true,
        competitiveAnalysis: true,
        financialDetail: true,
        emotionalSovereignty: true,
        culturalAdaptation: true
      };
    }

    this.emit('enhancement_applied', { 
      enhancementType: 'strategic_framework',
      fieldsEnhanced: this.getEnhancedFields(input, enhanced)
    });

    return enhanced;
  }

  // Strategic Framework Inference Methods (5-8 field inference)
  private inferIndustryAnalysis(businessDescription: string, targetAudience: string): string {
    const industries = ['technology', 'healthcare', 'finance', 'retail', 'manufacturing', 'services', 'education'];
    const detectedIndustry = industries.find(industry => 
      businessDescription.toLowerCase().includes(industry) || 
      targetAudience.toLowerCase().includes(industry)
    ) || 'general business';
    
    return `${detectedIndustry.charAt(0).toUpperCase() + detectedIndustry.slice(1)} industry analysis with market trends, growth opportunities, and competitive landscape assessment.`;
  }

  private inferMarketOpportunity(targetAudience: string, competitiveContext: string): string {
    const audienceSize = targetAudience.length > 100 ? 'large' : targetAudience.length > 50 ? 'medium' : 'niche';
    const competitiveLevel = competitiveContext.toLowerCase().includes('competitive') ? 'high competition' : 'emerging market';
    
    return `${audienceSize.charAt(0).toUpperCase() + audienceSize.slice(1)} market opportunity in ${competitiveLevel} environment with significant growth potential.`;
  }

  private inferValueProposition(primaryGoal: string, competitiveContext: string): string {
    const goalKeywords = ['increase', 'improve', 'reduce', 'optimize', 'enhance', 'streamline'];
    const detectedAction = goalKeywords.find(keyword => primaryGoal.toLowerCase().includes(keyword)) || 'deliver value';
    
    return `Unique value proposition focused on ${detectedAction} for customers while differentiating from competitors through innovative approach.`;
  }

  private inferOperationalPlan(businessDescription: string, resourceConstraints: string): string {
    const hasConstraints = resourceConstraints && resourceConstraints.length > 0;
    const planType = hasConstraints ? 'resource-optimized' : 'comprehensive';
    
    return `${planType.charAt(0).toUpperCase() + planType.slice(1)} operational plan covering key business processes, team structure, and execution strategy.`;
  }

  private inferFinancialProjections(revenueModel: string, resourceConstraints: string): string {
    const hasModel = revenueModel && revenueModel.length > 0;
    const projectionType = hasModel ? 'detailed revenue-based' : 'conservative growth';
    
    return `${projectionType.charAt(0).toUpperCase() + projectionType.slice(1)} financial projections with 3-year outlook, break-even analysis, and funding requirements.`;
  }

  private inferRiskAssessment(competitiveContext: string, currentStatus: string): string {
    const riskLevel = competitiveContext.toLowerCase().includes('competitive') ? 'moderate to high' : 'low to moderate';
    
    return `Comprehensive risk assessment identifying ${riskLevel} risk factors with mitigation strategies and contingency planning.`;
  }

  private inferImplementationTimeline(primaryGoal: string, resourceConstraints: string): string {
    const hasConstraints = resourceConstraints && resourceConstraints.includes('budget') || resourceConstraints.includes('time');
    const timeframe = hasConstraints ? '12-18 month' : '6-12 month';
    
    return `${timeframe} implementation timeline with key milestones, dependencies, and resource allocation schedule.`;
  }

  private inferSuccessMetrics(primaryGoal: string, planPurpose: string): string {
    const isInvestorFocused = planPurpose && planPurpose.toLowerCase().includes('investor');
    const metricType = isInvestorFocused ? 'ROI and growth metrics' : 'operational and customer metrics';
    
    return `Comprehensive success metrics including ${metricType} with quarterly targets and performance indicators.`;
  }

  private generateEmotionalContext(input: BusinessPlanPrompt): any {
    return {
      founderStory: `Passionate entrepreneur driven by ${input.primaryGoal} with deep understanding of ${input.targetAudience} needs.`,
      visionStatement: `Creating lasting impact through ${input.businessName} while serving ${input.targetAudience} with excellence.`,
      motivationalDrivers: `Commitment to solving real problems and building sustainable business value.`,
      stakeholderImpact: `Positive impact on customers, team members, and broader community through business success.`,
      emotionalResonance: ['passion', 'determination', 'innovation', 'integrity', 'growth']
    };
  }

  private getEnhancedFields(original: BusinessPlanPrompt, enhanced: BusinessPlanPrompt): string[] {
    const enhancedFields: string[] = [];
    
    if (!original.industryAnalysis && enhanced.industryAnalysis) enhancedFields.push('industryAnalysis');
    if (!original.marketOpportunity && enhanced.marketOpportunity) enhancedFields.push('marketOpportunity');
    if (!original.valueProposition && enhanced.valueProposition) enhancedFields.push('valueProposition');
    if (!original.operationalPlan && enhanced.operationalPlan) enhancedFields.push('operationalPlan');
    if (!original.financialProjections && enhanced.financialProjections) enhancedFields.push('financialProjections');
    if (!original.riskAssessment && enhanced.riskAssessment) enhancedFields.push('riskAssessment');
    if (!original.implementationTimeline && enhanced.implementationTimeline) enhancedFields.push('implementationTimeline');
    if (!original.successMetrics && enhanced.successMetrics) enhancedFields.push('successMetrics');
    
    return enhancedFields;
  }

  // Main processing method
  async processPrompt(input: BusinessPlanPrompt): Promise<PromptSession> {
    this.emit('processing_started', { input });

    // Apply MCP enhancements (5-8 field inference)
    const enhancedInput = this.applyMCPEnhancers(input);

    // Validate enhanced input
    const validationStatus = await this.validateInput(enhancedInput);

    // Score the prompt
    const scoreBreakdown = await this.scorePrompt(enhancedInput);

    // Initialize recovery status
    const recoveryStatus: RecoveryStatus = {
      triggered: false,
      strategy: 'none',
      attempts: 0,
      success: true,
      smartDefaultUsed: false,
      mcpEnhancementUsed: this.hasMCPEnhancements(input, enhancedInput)
    };

    const session: PromptSession = {
      promptType: 'business_plan',
      input: enhancedInput,
      validationStatus,
      scoreBreakdown,
      recoveryStatus,
      revisionCount: 0
    };

    this.emit('processing_completed', session);
    return session;
  }

  private async validateInput(input: BusinessPlanPrompt): Promise<ValidationStatus> {
    const missingFields = this.requiredFields.filter(field => !input[field as keyof BusinessPlanPrompt]);
    const invalidFields = this.validateFieldTypes(input);
    const enhancerStatus = this.validateEnhancers(input.enhancers);

    return {
      isValid: missingFields.length === 0 && invalidFields.length === 0,
      missingFields,
      invalidFields,
      enhancerStatus
    };
  }

  private validateFieldTypes(input: BusinessPlanPrompt): string[] {
    const invalidFields: string[] = [];
    
    if (input.businessName && typeof input.businessName !== 'string') invalidFields.push('businessName');
    if (input.targetAudience && typeof input.targetAudience !== 'string') invalidFields.push('targetAudience');
    if (input.primaryGoal && typeof input.primaryGoal !== 'string') invalidFields.push('primaryGoal');
    
    return invalidFields;
  }

  private validateEnhancers(enhancers?: BusinessPlanPrompt['enhancers']): Record<string, boolean> {
    if (!enhancers) return {};
    
    return {
      strategicDepth: enhancers.strategicDepth || false,
      competitiveAnalysis: enhancers.competitiveAnalysis || false,
      financialDetail: enhancers.financialDetail || false,
      emotionalSovereignty: enhancers.emotionalSovereignty || false,
      culturalAdaptation: enhancers.culturalAdaptation || false
    };
  }

  private async scorePrompt(input: BusinessPlanPrompt): Promise<ScoreBreakdown> {
    const strategicFramework = this.scoreStrategicFramework(input);
    const competitiveClarity = this.scoreCompetitiveClarity(input);
    const financialViability = this.scoreFinancialViability(input);
    const emotionalResonance = this.scoreEmotionalResonance(input);
    const implementationFeasibility = this.scoreImplementationFeasibility(input);

    const overall = (strategicFramework + competitiveClarity + financialViability + emotionalResonance + implementationFeasibility) / 5;

    return {
      overall,
      strategicFramework,
      competitiveClarity,
      financialViability,
      emotionalResonance,
      implementationFeasibility
    };
  }

  private scoreStrategicFramework(input: BusinessPlanPrompt): number {
    let score = 0.5; // Base score
    
    if (input.businessDescription) score += 0.1;
    if (input.industryAnalysis) score += 0.1;
    if (input.marketOpportunity) score += 0.1;
    if (input.valueProposition) score += 0.1;
    if (input.operationalPlan) score += 0.1;
    
    return Math.min(score, 1.0);
  }

  private scoreCompetitiveClarity(input: BusinessPlanPrompt): number {
    let score = 0.3; // Base score
    
    if (input.competitiveContext) score += 0.3;
    if (input.valueProposition) score += 0.2;
    if (input.riskAssessment) score += 0.2;
    
    return Math.min(score, 1.0);
  }

  private scoreFinancialViability(input: BusinessPlanPrompt): number {
    let score = 0.2; // Base score
    
    if (input.revenueModel) score += 0.3;
    if (input.financialProjections) score += 0.3;
    if (input.resourceConstraints) score += 0.2;
    
    return Math.min(score, 1.0);
  }

  private scoreEmotionalResonance(input: BusinessPlanPrompt): number {
    let score = 0.4; // Base score
    
    if (input.emotionalContext?.founderStory) score += 0.15;
    if (input.emotionalContext?.visionStatement) score += 0.15;
    if (input.emotionalContext?.motivationalDrivers) score += 0.15;
    if (input.emotionalContext?.stakeholderImpact) score += 0.15;
    
    return Math.min(score, 1.0);
  }

  private scoreImplementationFeasibility(input: BusinessPlanPrompt): number {
    let score = 0.3; // Base score
    
    if (input.implementationTimeline) score += 0.2;
    if (input.successMetrics) score += 0.2;
    if (input.resourceConstraints) score += 0.15;
    if (input.currentStatus) score += 0.15;
    
    return Math.min(score, 1.0);
  }

  private hasMCPEnhancements(original: BusinessPlanPrompt, enhanced: BusinessPlanPrompt): boolean {
    return this.getEnhancedFields(original, enhanced).length > 0;
  }
}

// Legacy function for backward compatibility
type BusinessInput = Record<string, any>

export function generateBusinessPlanPrompt(input: BusinessInput, version = "v1") {
  const result = composePrompt("business_plan", input, version)

  const tokenEstimate = estimateTokens(JSON.stringify(input), result.prompt)
  const score = scorePromptOutput(result.prompt)

  return {
    prompt: result.prompt,
    fallbackFields: result.fallbackFields,
    missingFields: result.missingFields,
    promptType: "business_plan",
    version,
    tokensEstimated: tokenEstimate.total,
    costUSD: tokenEstimate.costUSD,
    smartPromptScore: score.score,
    scoreDetails: score.reasons,
  }
}
