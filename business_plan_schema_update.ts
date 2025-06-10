/**
 * Updated Business Plan Input Schema - V4 Compliance
 * Aligns with MCP-COMPREHENSIVE-STANDARDIZATION-PLAN-V4.md
 */

// V4 Standard Business Plan Input (10 Fields - Professional Strategy)
export interface BusinessPlanInputV4 {
  // Universal Core Fields (Required)
  businessName: string;           // Business name
  targetAudience: string;         // Customer demographics
  primaryGoal: string;           // Business objective
  
  // Business Plan Specific Fields (Required)
  competitiveContext: string;     // Differentiation
  brandVoice: string;            // Communication style
  resourceConstraints: string;    // Challenges, budget
  currentStatus: string;         // Business state
  businessDescription: string;    // Business concept
  revenueModel: string;          // Income generation
  planPurpose: string;           // Plan purpose (e.g., investors)
  
  // Universal Emotional Fields (Auto-Enhanced)
  emotionalResonance?: string;    // Emotional impact assessment
  trustScore?: number;           // Trust measurement (minimum 4.0/5.0)
  qualityIndicators?: string[];   // Clarity, professionalism markers
  viralPotential?: string;       // Shareability assessment
  
  // Backward Compatibility Fields (Legacy Support)
  industry?: string;             // Maps to competitiveContext
  goal?: string;                 // Maps to primaryGoal
  tone?: string;                 // Maps to brandVoice
  bizName?: string;              // Maps to businessName
  location?: string;             // Maps to currentStatus
  keyOfferings?: string;         // Maps to businessDescription
  modelType?: string;            // Maps to revenueModel
  audience?: string;             // Maps to targetAudience
  
  // Enhanced Context Fields (Optional)
  culturalContext?: string;      // Default: 'en-US' (English-only focus per V4)
  emotionalContext?: {
    personalStory?: string;
    visionQuote?: string;
    motivator?: string;
    founderBackground?: string;
  };
  financials?: {
    revenueModel?: string;
    pricingNotes?: string;
    financialMaturity?: 'early' | 'growth' | 'mature';
    initialInvestment?: number;
    projectedRevenue?: number;
    breakEvenPoint?: number;
  };
}

// Updated Validation Schema
export const businessPlanValidationSchema = {
  requiredFields: [
    'businessName',
    'targetAudience', 
    'primaryGoal',
    'competitiveContext',
    'brandVoice',
    'resourceConstraints',
    'currentStatus',
    'businessDescription',
    'revenueModel',
    'planPurpose'
  ],
  fieldTypes: {
    businessName: 'string',
    targetAudience: 'string',
    primaryGoal: 'string',
    competitiveContext: 'string',
    brandVoice: 'string',
    resourceConstraints: 'string',
    currentStatus: 'string',
    businessDescription: 'string',
    revenueModel: 'string',
    planPurpose: 'string',
    emotionalResonance: 'string',
    trustScore: 'number',
    qualityIndicators: 'array',
    viralPotential: 'string',
    culturalContext: 'string'
  },
  minFieldLengths: {
    businessName: 2,
    targetAudience: 10,
    primaryGoal: 10,
    competitiveContext: 10,
    brandVoice: 5,
    resourceConstraints: 10,
    currentStatus: 10,
    businessDescription: 20,
    revenueModel: 10,
    planPurpose: 5
  },
  validBrandVoices: [
    'professional', 'conversational', 'enthusiastic', 
    'analytical', 'supportive', 'empowering', 'authoritative'
  ],
  validPlanPurposes: [
    'investors', 'funding', 'internal', 'growth', 'launch', 'pivot'
  ]
};

// Backward Compatibility Mapping Function
export function mapLegacyFields(input: any): BusinessPlanInputV4 {
  const mapped: BusinessPlanInputV4 = {
    businessName: input.businessName || input.bizName || '',
    targetAudience: input.targetAudience || input.audience || input.targetMarket || '',
    primaryGoal: input.primaryGoal || input.goal || '',
    competitiveContext: input.competitiveContext || input.industry || '',
    brandVoice: input.brandVoice || input.tone || 'professional',
    resourceConstraints: input.resourceConstraints || `Budget: ${input.budget || 'TBD'}, Timeline: ${input.timeline || 'TBD'}`,
    currentStatus: input.currentStatus || input.location || 'Early stage',
    businessDescription: input.businessDescription || input.keyOfferings || input.idea || '',
    revenueModel: input.revenueModel || input.modelType || '',
    planPurpose: input.planPurpose || 'growth',
    culturalContext: input.culturalContext || 'en-US',
    
    // Preserve existing enhanced fields
    emotionalResonance: input.emotionalResonance,
    trustScore: input.trustScore,
    qualityIndicators: input.qualityIndicators,
    viralPotential: input.viralPotential,
    emotionalContext: input.emotionalContext,
    financials: input.financials
  };
  
  return mapped;
} 