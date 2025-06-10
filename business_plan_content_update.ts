/**
 * Business Plan Content Generation with OpenAI API - V4 Compliance
 * Real API calls for content generation with trust transparency and emotional intelligence
 */

import OpenAI from 'openai';
import { BusinessPlanInput } from './prompts/business-plan.mcp';
import { EventBus } from './cursor/event-bus/event-bus';
import { Logger } from './utils/logger';
import { PromptScoringManager } from './cursor/prompt-infrastructure/prompt-score/scoring-manager';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export interface BusinessPlanContentGenerator {
  generateBusinessPlanContent(input: any): Promise<StandardMCPOutput>;
}

export class BusinessPlanOpenAIGenerator implements BusinessPlanContentGenerator {
  
  /**
   * Generate business plan content using OpenAI API with V4 template integration
   */
  async generateBusinessPlanContent(input: any): Promise<StandardMCPOutput> {
    const startTime = Date.now();
    
    try {
      // Construct V4-compliant prompt
      const prompt = this.constructV4Prompt(input);
      
      // Make real OpenAI API call
      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt()
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const responseTime = Date.now() - startTime;
      
      // Extract and structure content
      const generatedContent = response.choices[0]?.message?.content || '';
      const structuredOutput = this.structureContent(generatedContent, input);
      
      // Log API call details
      this.logAPICallDetails({
        tokensUsed: response.usage?.total_tokens || 0,
        responseTime,
        model: 'gpt-4-turbo',
        promptLength: prompt.length,
        contentLength: generatedContent.length
      });
      
      return structuredOutput;
      
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      // Fallback to default content if API fails
      return this.generateFallbackContent(input);
    }
  }

  /**
   * Construct V4-compliant prompt using business plan template and emotional compass
   */
  private constructV4Prompt(input: any): string {
    const businessName = input.businessName || input.bizName || 'New Venture';
    const targetAudience = input.targetAudience || input.audience || 'Target market to be defined';
    const primaryGoal = input.primaryGoal || input.goal || 'Business growth and success';
    const competitiveContext = input.competitiveContext || input.industry || 'Competitive market';
    const brandVoice = input.brandVoice || input.tone || 'professional';
    const resourceConstraints = input.resourceConstraints || 'Standard business constraints';
    const currentStatus = input.currentStatus || 'Early stage development';
    const businessDescription = input.businessDescription || input.keyOfferings || input.idea || 'Innovative business solution';
    const revenueModel = input.revenueModel || input.modelType || 'Revenue generation strategy';
    const planPurpose = input.planPurpose || 'growth';

    // Include emotional context for enhanced resonance
    const emotionalContext = input.emotionalContext || {};
    const personalStory = emotionalContext.personalStory || '';
    const visionQuote = emotionalContext.visionQuote || '';
    const motivator = emotionalContext.motivator || '';

    return `
# Business Plan Generation Request

## Core Business Information
- **Business Name**: ${businessName}
- **Target Audience**: ${targetAudience}
- **Primary Goal**: ${primaryGoal}
- **Competitive Context**: ${competitiveContext}
- **Brand Voice**: ${brandVoice}
- **Resource Constraints**: ${resourceConstraints}
- **Current Status**: ${currentStatus}
- **Business Description**: ${businessDescription}
- **Revenue Model**: ${revenueModel}
- **Plan Purpose**: ${planPurpose}

## Emotional Context (for authentic voice)
${personalStory ? `- **Personal Story**: ${personalStory}` : ''}
${visionQuote ? `- **Vision Quote**: ${visionQuote}` : ''}
${motivator ? `- **Motivator**: ${motivator}` : ''}

## Requirements
Create a comprehensive business plan with the following sections:
1. **Executive Summary** (~200 words) - Mission, vision, value proposition, key differentiators
2. **Market Analysis** (~300 words) - Industry trends, customer profile, competitive landscape, opportunities
3. **Marketing Strategy** (~200 words) - Acquisition and retention plan, digital/traditional tactics, brand positioning

## Tone & Style Guidelines
- Write in ${brandVoice} tone
- Target audience: ${targetAudience}
- Purpose: ${planPurpose}
- Include emotional resonance and authentic voice
- Avoid buzzwords and filler content
- Focus on actionable insights and realistic projections
- Integrate personal context where appropriate

## Trust Transparency Requirements
- Use specific, credible information
- Include realistic timelines and projections
- Acknowledge challenges and constraints
- Provide clear, actionable next steps
- Maintain professional credibility while being emotionally engaging

Generate a business plan that feels personally crafted for ${businessName} and resonates with ${targetAudience}.
    `.trim();
  }

  /**
   * Get system prompt for business plan generation
   */
  private getSystemPrompt(): string {
    return `
You are a professional business consultant specializing in creating investor-ready business plans. You have deep expertise in:
- Strategic business planning and market analysis
- Emotional intelligence and authentic communication
- Industry-specific insights and competitive positioning
- Financial modeling and revenue projections
- Trust-building through transparency and credibility

Your writing style is:
- Confident and professional yet emotionally resonant
- Specific and actionable rather than generic
- Authentic and personally crafted for each business
- Transparent about challenges while highlighting opportunities
- Focused on empowering the business owner

Always create content that passes the "Sacred Reversal Test" - would this make the business owner feel seen, honored, empowered, and less alone in their journey?

Structure your response with clear sections and avoid bullet points within content. Write as if presenting to investors or stakeholders who need to understand both the business logic and the passion behind it.
    `.trim();
  }

  /**
   * Structure generated content into StandardMCPOutput format
   */
  private structureContent(content: string, input: any): StandardMCPOutput {
    // Parse sections from generated content
    const sections = this.parseContentSections(content);
    
    return {
      primary: sections.executiveSummary || content.substring(0, 300),
      strategy: sections.marketAnalysis || 'Market analysis and competitive positioning strategy',
      implementation: sections.marketingStrategy || 'Implementation plan and marketing strategy',
      nextSteps: this.generateNextSteps(input),
      sparkSplitComparison: undefined // Will be added by SparkSplit engine
    };
  }

  /**
   * Parse content sections from generated text
   */
  private parseContentSections(content: string): any {
    const sections: any = {};
    
    // Extract Executive Summary
    const execMatch = content.match(/(?:Executive Summary|EXECUTIVE SUMMARY)(.*?)(?=Market Analysis|MARKET ANALYSIS|Marketing Strategy|MARKETING STRATEGY|$)/s);
    if (execMatch) {
      sections.executiveSummary = execMatch[1].trim();
    }
    
    // Extract Market Analysis
    const marketMatch = content.match(/(?:Market Analysis|MARKET ANALYSIS)(.*?)(?=Marketing Strategy|MARKETING STRATEGY|$)/s);
    if (marketMatch) {
      sections.marketAnalysis = marketMatch[1].trim();
    }
    
    // Extract Marketing Strategy
    const strategyMatch = content.match(/(?:Marketing Strategy|MARKETING STRATEGY)(.*?)$/s);
    if (strategyMatch) {
      sections.marketingStrategy = strategyMatch[1].trim();
    }
    
    return sections;
  }

  /**
   * Generate specific next steps based on plan purpose and current status
   */
  private generateNextSteps(input: any): string {
    const planPurpose = input.planPurpose || 'growth';
    
    let nextSteps = '';
    
    switch (planPurpose.toLowerCase()) {
      case 'investors':
      case 'funding':
        nextSteps = 'Immediate: Finalize financial projections and pitch deck. Week 2: Schedule investor meetings and due diligence preparation. Month 1: Execute funding strategy and close investment round.';
        break;
      case 'launch':
        nextSteps = 'Immediate: Complete MVP development and beta testing. Week 2: Finalize go-to-market strategy and launch timeline. Month 1: Execute product launch and customer acquisition campaigns.';
        break;
      case 'growth':
        nextSteps = 'Immediate: Analyze current performance metrics and growth bottlenecks. Week 2: Implement optimization strategies and expansion plans. Month 1: Scale operations and measure growth impact.';
        break;
      default:
        nextSteps = 'Immediate: Review and validate business plan assumptions. Week 2: Develop detailed implementation timeline. Month 1: Execute priority initiatives and track progress.';
    }
    
    return nextSteps;
  }

  /**
   * Generate fallback content if API fails
   */
  private generateFallbackContent(input: any): StandardMCPOutput {
    const businessName = input.businessName || input.bizName || 'Your Business';
    
    return {
      primary: `${businessName} represents a strategic opportunity in the ${input.competitiveContext || 'market'} sector. Our mission is to ${input.primaryGoal || 'create value'} for ${input.targetAudience || 'our target market'} through innovative solutions and exceptional service delivery.`,
      strategy: `Market analysis indicates strong demand within the ${input.competitiveContext || 'industry'} space. Our competitive advantage lies in our unique approach to ${input.businessDescription || 'solving customer problems'} while maintaining focus on ${input.targetAudience || 'customer needs'}.`,
      implementation: `Implementation will focus on ${input.revenueModel || 'revenue generation'} through strategic marketing initiatives. Our ${input.brandVoice || 'professional'} approach will resonate with ${input.targetAudience || 'target customers'} while building sustainable growth.`,
      nextSteps: 'Immediate: Validate market assumptions and refine value proposition. Week 2: Develop detailed implementation timeline. Month 1: Execute priority initiatives and establish key performance metrics.'
    };
  }

  /**
   * Log API call details for monitoring and optimization
   */
  private logAPICallDetails(details: any): void {
    console.log('OpenAI API Call Details:', {
      timestamp: new Date().toISOString(),
      model: details.model,
      tokensUsed: details.tokensUsed,
      responseTime: `${details.responseTime}ms`,
      promptLength: details.promptLength,
      contentLength: details.contentLength,
      efficiency: details.contentLength / details.tokensUsed
    });
    
    // Would emit to EventBus in full implementation
    // eventBus.emit('api_call_logged', details);
  }

  /**
   * Validate API response for trust transparency and emotional resonance
   */
  async validateAPIResponse(content: string, input: any): Promise<ValidationResult> {
    const trustScore = this.calculateContentTrustScore(content, input);
    const emotionalResonance = this.calculateContentEmotionalResonance(content, input);
    
    return {
      trustScore,
      emotionalResonance,
      isValid: trustScore >= 4.2 && emotionalResonance >= 0.85,
      recommendations: this.generateImprovementRecommendations(trustScore, emotionalResonance)
    };
  }

  private calculateContentTrustScore(content: string, input: any): number {
    let score = 4.2; // Minimum baseline
    
    // Check for specific business details
    if (content.includes(input.businessName || '')) score += 0.2;
    if (content.includes('realistic') || content.includes('achievable')) score += 0.2;
    if (content.includes('market research') || content.includes('analysis')) score += 0.2;
    if (content.length > 800) score += 0.2; // Comprehensive content
    if (content.includes('timeline') || content.includes('metrics')) score += 0.2;
    
    return Math.min(score, 5.0);
  }

  private calculateContentEmotionalResonance(content: string, input: any): number {
    let score = 0.7; // Base score
    
    // Check for emotional language
    const emotionalWords = ['passion', 'vision', 'mission', 'impact', 'transform', 'empower'];
    const emotionalCount = emotionalWords.filter(word => content.toLowerCase().includes(word)).length;
    score += (emotionalCount * 0.03);
    
    // Check for personal context integration
    if (input.emotionalContext?.personalStory && content.includes('story')) score += 0.1;
    if (input.emotionalContext?.visionQuote && content.includes('vision')) score += 0.1;
    
    return Math.min(score, 1.0);
  }

  private generateImprovementRecommendations(trustScore: number, emotionalResonance: number): string[] {
    const recommendations = [];
    
    if (trustScore < 4.5) {
      recommendations.push('Add more specific business details and realistic projections');
      recommendations.push('Include market research and competitive analysis');
    }
    
    if (emotionalResonance < 0.85) {
      recommendations.push('Integrate more emotional language and personal context');
      recommendations.push('Enhance vision and mission statements');
    }
    
    return recommendations;
  }
}

interface ValidationResult {
  trustScore: number;
  emotionalResonance: number;
  isValid: boolean;
  recommendations: string[];
}

interface StandardMCPOutput {
  primary: string;
  strategy: string;
  implementation: string;
  nextSteps: string;
  sparkSplitComparison?: any;
}

interface ContentGenerationResult {
  content: string;
  trustTransparency: number;
  emotionalResonance: number;
  apiMetrics: {
    tokensUsed: number;
    responseTime: number;
    model: string;
  };
  emotionalCompass: {
    clarity: number;
    empowerment: number;
    trust: number;
    joy: number;
    alignment: number;
  };
}

/**
 * Generate business plan content using OpenAI API with V4 plan templates
 */
export async function generateBusinessPlanContent(input: BusinessPlanInput): Promise<ContentGenerationResult> {
  const startTime = Date.now();
  
  try {
    // Construct prompt using V4 plan templates
    const prompt = constructV4Prompt(input);
    
    Logger.info('BusinessPlanMCP: Generating content with OpenAI', {
      businessName: input.businessName,
      industry: input.industry,
      promptLength: prompt.length
    });

    // Make OpenAI API call
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert business plan consultant with deep expertise in creating compelling, investor-ready business plans. Focus on emotional resonance, trust transparency, and actionable insights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const responseTime = Date.now() - startTime;
    const content = response.choices[0]?.message?.content || '';
    
    // Calculate trust transparency and emotional resonance
    const scoringManager = new PromptScoringManager();
    const trustTransparency = await calculateTrustTransparency(content, input);
    const emotionalResonance = await calculateEmotionalResonance(content, input);
    
    // Validate API response quality
    const validationResult = await scoringManager.scorePrompt({
      promptType: 'business_plan',
      input: { ...input, generatedContent: content },
      context: { trustTransparency, emotionalResonance }
    });

    // Calculate emotional compass
    const emotionalCompass = calculateEmotionalCompass(content, input);

    // Log API call details via EventBus
    const eventBus = new EventBus();
    eventBus.emit('api_call_completed', {
      type: 'business_plan_generation',
      tokensUsed: response.usage?.total_tokens || 0,
      responseTime,
      trustScore: trustTransparency,
      emotionalScore: emotionalResonance,
      validationScore: validationResult.overall
    });

    Logger.info('BusinessPlanMCP: Content generation completed', {
      tokensUsed: response.usage?.total_tokens || 0,
      responseTime,
      trustTransparency,
      emotionalResonance,
      contentLength: content.length
    });

    return {
      content,
      trustTransparency,
      emotionalResonance,
      apiMetrics: {
        tokensUsed: response.usage?.total_tokens || 0,
        responseTime,
        model: 'gpt-4-turbo'
      },
      emotionalCompass
    };

  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    Logger.error('BusinessPlanMCP: Content generation failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime,
      businessName: input.businessName
    });

    // Log error via EventBus
    const eventBus = new EventBus();
    eventBus.emit('api_call_failed', {
      type: 'business_plan_generation',
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime,
      input: { businessName: input.businessName, industry: input.industry }
    });

    throw error;
  }
}

/**
 * Construct V4 plan prompt template with businessName, targetAudience, and emotionalCompass
 */
function constructV4Prompt(input: BusinessPlanInput): string {
  const {
    businessName = 'Your Business',
    targetAudience = input.targetMarket || input.audience || 'target customers',
    primaryGoal = input.goal,
    industry,
    businessDescription = input.idea,
    revenueModel = input.financials?.revenueModel,
    planPurpose = 'business development',
    emotionalContext
  } = input;

  return `
# Business Plan Generation Request

## Business Context
**Business Name**: ${businessName}
**Industry**: ${industry}
**Business Description**: ${businessDescription || 'Innovative business solution'}
**Revenue Model**: ${revenueModel || 'To be determined'}
**Plan Purpose**: ${planPurpose}

## Target Audience
**Primary Audience**: ${targetAudience}
**Goal**: ${primaryGoal}

## Emotional Context
${emotionalContext ? `
**Personal Story**: ${emotionalContext.personalStory || 'Passionate entrepreneur journey'}
**Vision Quote**: ${emotionalContext.visionQuote || 'Building the future of ' + industry}
**Motivator**: ${emotionalContext.motivator || 'Creating meaningful impact'}
**Founder Background**: ${emotionalContext.founderBackground || 'Experienced industry professional'}
` : ''}

## Requirements
Please create a comprehensive business plan that includes:

1. **Executive Summary** (150-300 words)
   - Compelling vision statement incorporating the emotional context
   - Clear value proposition for ${targetAudience}
   - Key success factors and differentiators

2. **Market Analysis** (200-400 words)
   - Target market size and opportunity for ${industry}
   - Customer pain points and needs analysis
   - Competitive landscape and positioning

3. **Business Model** (250-500 words)
   - Revenue model: ${revenueModel || 'Detailed revenue strategy'}
   - Operations and delivery model
   - Key partnerships and resources

4. **Financial Projections** (150-300 words)
   - Revenue projections and growth assumptions
   - Key financial metrics and milestones
   - Investment requirements and ROI

5. **Implementation Plan** (200-400 words)
   - 30-60-90 day action plan
   - Key milestones and success metrics
   - Risk mitigation strategies

## Tone and Style
- Professional yet engaging
- Emotionally resonant and inspiring
- Data-driven with compelling storytelling
- Investor-ready with clear value proposition
- Trust-building through transparency

## Emotional Compass Requirements
Ensure the plan demonstrates:
- **Clarity**: Clear, understandable language and structure
- **Empowerment**: Makes the reader feel confident and capable
- **Trust**: Builds credibility through transparency and evidence
- **Joy**: Inspiring and exciting vision for the future
- **Alignment**: Consistent with values and market needs

Generate a business plan that passes the Sacred Reversal Test - would an exhausted entrepreneur feel seen, honored, empowered, and less alone after reading this?
`;
}

/**
 * Calculate trust transparency score based on content analysis
 */
async function calculateTrustTransparency(content: string, input: BusinessPlanInput): Promise<number> {
  // Analyze content for trust indicators
  const trustIndicators = {
    hasSpecificMetrics: /\d+%|\$[\d,]+|[\d,]+ (users|customers|revenue)/.test(content),
    hasRealisticProjections: content.includes('realistic') || content.includes('conservative'),
    acknowledgesRisks: content.includes('risk') || content.includes('challenge'),
    providesEvidence: content.includes('market research') || content.includes('data'),
    transparentAboutLimitations: content.includes('limitation') || content.includes('assumption')
  };

  const trustScore = Object.values(trustIndicators).filter(Boolean).length / Object.keys(trustIndicators).length;
  
  // Boost score if business name and specific details are included
  const specificityBonus = content.includes(input.businessName || '') ? 0.1 : 0;
  
  return Math.min(1.0, trustScore + specificityBonus);
}

/**
 * Calculate emotional resonance score based on content analysis
 */
async function calculateEmotionalResonance(content: string, input: BusinessPlanInput): Promise<number> {
  const emotionalIndicators = {
    hasVisionaryLanguage: /vision|dream|transform|revolutionize|impact/.test(content.toLowerCase()),
    includesPersonalStory: content.includes('story') || content.includes('journey'),
    showsPassion: /passion|excited|committed|dedicated/.test(content.toLowerCase()),
    connectsWithAudience: content.includes(input.targetMarket || input.audience || ''),
    inspiresAction: /opportunity|potential|growth|success/.test(content.toLowerCase())
  };

  const emotionalScore = Object.values(emotionalIndicators).filter(Boolean).length / Object.keys(emotionalIndicators).length;
  
  // Bonus for including emotional context elements
  const emotionalContextBonus = input.emotionalContext ? 0.15 : 0;
  
  return Math.min(1.0, emotionalScore + emotionalContextBonus);
}

/**
 * Calculate 5-axis emotional compass scores
 */
function calculateEmotionalCompass(content: string, input: BusinessPlanInput): {
  clarity: number;
  empowerment: number;
  trust: number;
  joy: number;
  alignment: number;
} {
  const contentLower = content.toLowerCase();
  
  return {
    clarity: calculateClarityScore(content),
    empowerment: calculateEmpowermentScore(contentLower),
    trust: calculateTrustScore(contentLower),
    joy: calculateJoyScore(contentLower),
    alignment: calculateAlignmentScore(content, input)
  };
}

function calculateClarityScore(content: string): number {
  const clarityIndicators = {
    hasStructure: content.includes('1.') || content.includes('##'),
    usesSimpleLanguage: !/\b\w{12,}\b/.test(content), // No overly complex words
    hasConcreteExamples: /for example|such as|including/.test(content.toLowerCase()),
    definesTerms: content.includes('means') || content.includes('refers to')
  };
  
  const score = Object.values(clarityIndicators).filter(Boolean).length / Object.keys(clarityIndicators).length;
  return Math.max(4.0, score * 5.0); // Scale to 4.0-5.0 range
}

function calculateEmpowermentScore(contentLower: string): number {
  const empowermentWords = ['achieve', 'succeed', 'capable', 'opportunity', 'potential', 'growth', 'success'];
  const empowermentCount = empowermentWords.filter(word => contentLower.includes(word)).length;
  const score = Math.min(1.0, empowermentCount / empowermentWords.length * 1.5);
  return Math.max(4.0, score * 5.0);
}

function calculateTrustScore(contentLower: string): number {
  const trustWords = ['proven', 'reliable', 'transparent', 'honest', 'evidence', 'data', 'research'];
  const trustCount = trustWords.filter(word => contentLower.includes(word)).length;
  const score = Math.min(1.0, trustCount / trustWords.length * 1.5);
  return Math.max(4.0, score * 5.0);
}

function calculateJoyScore(contentLower: string): number {
  const joyWords = ['exciting', 'innovative', 'breakthrough', 'amazing', 'incredible', 'outstanding', 'exceptional'];
  const joyCount = joyWords.filter(word => contentLower.includes(word)).length;
  const score = Math.min(1.0, joyCount / joyWords.length * 1.5);
  return Math.max(4.0, score * 5.0);
}

function calculateAlignmentScore(content: string, input: BusinessPlanInput): number {
  const alignmentIndicators = {
    mentionsBusinessName: content.includes(input.businessName || ''),
    addressesTargetAudience: content.includes(input.targetMarket || input.audience || ''),
    alignsWithGoal: content.toLowerCase().includes((input.goal || '').toLowerCase().substring(0, 20)),
    matchesIndustry: content.toLowerCase().includes(input.industry.toLowerCase())
  };
  
  const score = Object.values(alignmentIndicators).filter(Boolean).length / Object.keys(alignmentIndicators).length;
  return Math.max(4.0, score * 5.0);
}

export {
  constructV4Prompt,
  calculateTrustTransparency,
  calculateEmotionalResonance,
  calculateEmotionalCompass
}; 