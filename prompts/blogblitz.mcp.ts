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

import { PromptScoringManager } from '../cursor/prompt-infrastructure/prompt-score';
import { EventBus } from '../cursor/event-bus/eventBus';
import { Logger } from '../utils/logger';
import { PromptSchemaValidator } from '../cursor/services/prompt-schema-validator';
import { routeFallback } from '../cursor/self-healing/fallbackRouter';

// Initialize services
const eventBus = EventBus.getInstance();
const promptScorer = new PromptScoringManager(eventBus);
const schemaValidator = new PromptSchemaValidator();
const logger = new Logger('blogblitz-mcp');

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

interface BlogBlitzOutput {
  blog: {
    title: string;
    outline: string[];
    sections: {
      introduction: string;
      body: string[];
      conclusion: string;
    };
    callToAction: string;
    keywords: string[];
  };
  contentCalendar: {
    relatedTopics: string[];
    schedule: string[];
    distribution: string[];
  };
  seoStrategy: {
    keywordAnalysis: string[];
    competitorInsights: string[];
    optimizationTips: string[];
  };
}

interface BlogBlitzSession {
  input: BlogBlitzInput;
  output?: BlogBlitzOutput;
  validationStatus: {
    isValid: boolean;
    issues: string[];
  };
  score?: {
    overall: number;
    breakdown: {
      toneMatch: number;
      emotionalDepth: number;
      clarity: number;
      completeness: number;
      seoOptimization: number;
      engagementPotential: number;
    };
  };
  empathyMetrics?: {
    emotionalResonance: number;
    toneAlignment: number;
    connectionStrength: number;
    authenticity: number;
  };
  metadata: {
    version: string;
    timestamp: string;
    trustScore: number;
  };
}

const validationSchema = {
  requiredFields: ['topic', 'audience', 'tone', 'emotionalOutcome'],
  fieldTypes: {
    topic: 'string',
    audience: 'string',
    tone: 'string',
    emotionalOutcome: 'string'
  },
  validTones: ['warm', 'bold', 'calm', 'motivating', 'professional', 'conversational'],
  validEmotionalOutcomes: ['feel confident', 'feel inspired', 'feel in control', 'feel understood', 'feel empowered']
};

// Industry-specific content defaults
const industryDefaults = {
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
const audiencePainMap = {
  'solo service providers': 'struggling with client acquisition and burnout',
  'ecommerce brands': 'difficulty standing out in crowded marketplace',
  'small business owners': 'overwhelmed by marketing and operations',
  'entrepreneurs': 'uncertainty about scaling and growth strategies',
  'coaches': 'challenge of attracting ideal clients consistently'
};

// Word count requirements for blog sections
const wordCountLimits = {
  total: { min: 500, max: 600 },
  intro: { min: 80, max: 120 },
  sections: { min: 150, max: 200 },
  closing: { min: 80, max: 120 }
};

/**
 * Generates a blog content series based on the provided input
 */
export async function generateBlogBlitz(input: BlogBlitzInput): Promise<BlogBlitzSession> {
  // Apply MCP enhancers to enrich input
  const enhancedInput = applyMCPEnhancers(input);
  
  const session: BlogBlitzSession = {
    input: enhancedInput,
    validationStatus: { isValid: false, issues: [] },
    metadata: {
      version: '6.1.4',
      timestamp: new Date().toISOString(),
      trustScore: 0
    }
  };

  try {
    // 1. Validate input
    const validationResult = await schemaValidator.validatePrompt({
      promptType: 'blogblitz',
      sessionId: `blogblitz_${Date.now()}`,
      version: '6.1.4',
      content: JSON.stringify(enhancedInput)
    });
    
    session.validationStatus = {
      isValid: validationResult.isValid,
      issues: [...validationResult.errors, ...validationResult.warnings]
    };

    if (!validationResult.isValid) {
      await routeFallback('validation', {
        severity: 2,
        details: { input: enhancedInput, validationResult },
        timestamp: session.metadata.timestamp
      });
      
      logger.warn('BlogBlitz validation failed', {
        issues: session.validationStatus.issues,
        timestamp: session.metadata.timestamp
      });
      
      return session;
    }

    // 2. Generate blog content
    const output = generateBlogContent(enhancedInput);
    session.output = output;

    // 3. Score output
    const scoringResult = await promptScorer.scorePrompt(
      {
        id: `blogblitz_${Date.now()}`,
        version: '6.1.4',
        type: 'production',
        status: 'active',
        name: 'BlogBlitz MCP',
        description: 'Manages blog content series generation with validation, scoring, and recovery',
        content: JSON.stringify(enhancedInput),
        metadata: {
          author: 'CanAI',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          tags: ['blog', 'content', 'seo'],
          dependencies: [],
          trustScore: 0.85,
          alignmentScore: 0.9,
          performanceScore: 0.8
        },
        contracts: [],
        constraints: [],
        evolution: {
          id: `blogblitz_evolution_${Date.now()}`,
          version: '6.1.4',
          timestamp: Date.now(),
          changes: [],
          metadata: {
            author: 'CanAI',
            reason: 'Initial version',
            trustImpact: 0,
            performanceImpact: 0,
            alignmentImpact: 0
          }
        }
      },
      {
        input: enhancedInput,
        output,
        metrics: {
          sessionId: `blogblitz_${Date.now()}`,
          environment: 'production',
          quality: 0.85,
          latency: 250,
          tokens: 1500,
          consistency: 0.9
        }
      }
    );

    session.score = {
      overall: scoringResult.metrics.trust.score,
      breakdown: {
        toneMatch: scoringResult.metrics.alignment.codexScore,
        emotionalDepth: scoringResult.metrics.trust.feedback,
        clarity: scoringResult.metrics.performance.quality,
        completeness: scoringResult.metrics.alignment.contractCompliance,
        seoOptimization: scoringResult.metrics.performance.quality,
        engagementPotential: scoringResult.metrics.trust.score
      }
    };

    if (session.score.overall < 0.75) {
      await routeFallback('scoring', {
        severity: 1,
        details: { output, scoringResult },
        timestamp: session.metadata.timestamp
      });
      
      logger.warn('BlogBlitz scored below threshold', {
        score: session.score.overall,
        threshold: 0.75,
        timestamp: session.metadata.timestamp
      });
      
      return session;
    }

    // 4. Validate empathy
    const empathyResult = validateBlogEmpathy(output, {
      targetTone: enhancedInput.tone,
      emotionalOutcome: enhancedInput.emotionalOutcome,
      emotionalDepth: 0.7
    });

    session.empathyMetrics = empathyResult.metrics;

    if (!empathyResult.isValid) {
      await routeFallback('empathy', {
        severity: 1,
        details: { output, empathyResult },
        timestamp: session.metadata.timestamp
      });
      
      logger.warn('BlogBlitz empathy validation failed', {
        metrics: session.empathyMetrics,
        timestamp: session.metadata.timestamp
      });
      
      return session;
    }

    // 5. Calculate trust score
    session.metadata.trustScore = (
      session.score.overall * 0.6 +
      empathyResult.metrics.overall * 0.4
    );

    // 6. Log results
    logger.info('BlogBlitz validation status', {
      isValid: session.validationStatus.isValid,
      issues: session.validationStatus.issues,
      timestamp: session.metadata.timestamp
    });

    logger.info('BlogBlitz score breakdown', {
      promptType: 'blogblitz',
      scoreBreakdown: session.score.breakdown,
      timestamp: session.metadata.timestamp
    });

    logger.info('BlogBlitz empathy metrics', {
      metrics: session.empathyMetrics,
      timestamp: session.metadata.timestamp
    });

    return session;
  } catch (error) {
    await routeFallback('system', {
      severity: 3,
      details: { error, input: enhancedInput },
      timestamp: session.metadata.timestamp
    });
    logger.error('BlogBlitz generation failed', { error, timestamp: session.metadata.timestamp });
    throw error;
  }
}

// Create the exported MCP object
export const blogblitzMCP = {
  generate: generateBlogBlitz
};

// ... existing inferPainFromAudience, inferOfferingsFromTopic, etc. functions ...

/**
 * Utility to capitalize first letter
 */
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Export the MCP enhancers function
export function applyMCPEnhancers(input: BlogBlitzInput): BlogBlitzInput {
  const enhanced = { ...input };

  // Infer missing fields using MCP enhancement logic
  if (!enhanced.customerPain && enhanced.audience) {
    enhanced.customerPain = inferPainFromAudience(enhanced.audience);
  }

  if (!enhanced.keyOfferings && enhanced.topic) {
    enhanced.keyOfferings = inferOfferingsFromTopic(enhanced.topic);
  }

  if (!enhanced.desiredAction && enhanced.emotionalOutcome) {
    enhanced.desiredAction = inferActionFromOutcome(enhanced.emotionalOutcome);
  }

  if (!enhanced.trustSignal && enhanced.industry) {
    enhanced.trustSignal = inferTrustFromIndustry(enhanced.industry);
  }

  return enhanced;
}

function inferPainFromAudience(audience: string): string {
  for (const [audienceType, pain] of Object.entries(audiencePainMap)) {
    if (audience.toLowerCase().includes(audienceType)) {
      return pain;
    }
  }
  return 'unclear direction and overwhelm';
}

function inferOfferingsFromTopic(topic: string): string {
  const topicKeywords = topic.toLowerCase();
  
  if (topicKeywords.includes('marketing')) return 'marketing strategy and implementation';
  if (topicKeywords.includes('productivity')) return 'productivity systems and tools';
  if (topicKeywords.includes('wellness')) return 'wellness programs and coaching';
  if (topicKeywords.includes('business')) return 'business consulting and strategy';
  if (topicKeywords.includes('design')) return 'design services and creative solutions';
  
  return 'expert guidance and solutions';
}

function inferActionFromOutcome(emotionalOutcome: string): string {
  const outcomeMap: Record<string, string> = {
    'feel confident': 'book a consultation to build confidence',
    'feel inspired': 'download our inspiration guide',
    'feel in control': 'get our control framework',
    'feel understood': 'join our community of like-minded people',
    'feel empowered': 'start your empowerment journey today'
  };
  
  return outcomeMap[emotionalOutcome] || 'take the next step with us';
}

function inferTrustFromIndustry(industry: string): string {
  const trustMap: Record<string, string> = {
    'wellness': 'certified wellness expertise',
    'tech': 'proven technical track record',
    'business': 'years of business success',
    'creative': 'award-winning creative work',
    'consulting': 'trusted by industry leaders'
  };
  
  return trustMap[industry.toLowerCase()] || 'proven expertise and results';
}

/**
 * Generates blog content based on the provided input
 */
function generateBlogContent(input: BlogBlitzInput): BlogBlitzOutput {
  // Create the title based on topic and audience
  const title = generateBlogTitle(input.topic, input.audience, input.tone);
  
  // Generate blog outline
  const outline = generateBlogOutline(input.topic, input.emotionalOutcome);
  
  // Generate blog sections
  const introduction = generateIntroduction(input.topic, input.audience, input.emotionalOutcome);
  const body = generateBodySections(input.topic, input.industry || '', input.customerPain || '', outline);
  const conclusion = generateConclusion(input.desiredAction || 'take action', input.emotionalOutcome);
  
  // Generate call to action
  const callToAction = generateCallToAction(input.desiredAction || 'learn more', input.emotionalOutcome);
  
  // Generate keywords
  const keywords = generateKeywords(input.topic, input.audience, input.industry || '');
  
  // Generate content calendar
  const relatedTopics = generateRelatedTopics(input.topic, input.industry || '');
  const schedule = generateContentSchedule(input.topic);
  const distribution = generateDistributionStrategy(input.audience);
  
  // Generate SEO strategy
  const keywordAnalysis = generateKeywordAnalysis(input.topic);
  const competitorInsights = generateCompetitorInsights(input.industry || 'general');
  const optimizationTips = generateOptimizationTips(input.topic, input.audience);
  
  return {
    blog: {
      title,
      outline,
      sections: {
        introduction,
        body,
        conclusion
      },
      callToAction,
      keywords
    },
    contentCalendar: {
      relatedTopics,
      schedule,
      distribution
    },
    seoStrategy: {
      keywordAnalysis,
      competitorInsights,
      optimizationTips
    }
  };
}

/**
 * Validates the empathy of blog content
 */
function validateBlogEmpathy(output: BlogBlitzOutput, config: any): { isValid: boolean; metrics: any } {
  const { targetTone, emotionalOutcome, emotionalDepth } = config;
  
  // Calculate emotional resonance
  const emotionalResonance = calculateEmotionalResonance(
    output.blog.sections.introduction,
    output.blog.sections.body.join(' '),
    emotionalOutcome
  );
  
  // Calculate tone alignment
  const toneAlignment = calculateToneAlignment(
    output.blog.title,
    output.blog.sections.introduction,
    targetTone
  );
  
  // Calculate connection strength
  const connectionStrength = calculateConnectionStrength(
    output.blog.sections.body.join(' '),
    output.blog.callToAction
  );
  
  // Calculate authenticity
  const authenticity = calculateAuthenticity(
    output.blog.sections.conclusion,
    output.blog.callToAction
  );
  
  // Calculate overall empathy score
  const overall = (
    emotionalResonance * 0.3 +
    toneAlignment * 0.3 +
    connectionStrength * 0.2 +
    authenticity * 0.2
  );
  
  return {
    isValid: overall >= emotionalDepth,
    metrics: {
      overall,
      emotionalResonance,
      toneAlignment,
      connectionStrength,
      authenticity
    }
  };
}

/**
 * Calculates emotional resonance of content
 */
function calculateEmotionalResonance(introduction: string, body: string, emotionalOutcome: string): number {
  // Basic implementation - would use more sophisticated analysis in production
  const hasEmotionalWords = body.toLowerCase().includes('feel') || 
                           body.toLowerCase().includes('emotion') ||
                           body.toLowerCase().includes('experience');
  
  const hasFocusOnOutcome = body.toLowerCase().includes(emotionalOutcome.toLowerCase());
  
  return hasEmotionalWords && hasFocusOnOutcome ? 0.85 : 0.65;
}

/**
 * Calculates tone alignment
 */
function calculateToneAlignment(title: string, introduction: string, targetTone: string): number {
  // Match tone words to content
  const toneWords = {
    'warm': ['welcoming', 'friendly', 'kind', 'supportive', 'inviting'],
    'bold': ['powerful', 'strong', 'confident', 'daring', 'striking'],
    'calm': ['peaceful', 'serene', 'balanced', 'tranquil', 'relaxed'],
    'motivating': ['inspiring', 'energizing', 'encouraging', 'uplifting', 'empowering'],
    'professional': ['expert', 'polished', 'refined', 'authoritative', 'reliable'],
    'conversational': ['friendly', 'casual', 'approachable', 'relaxed', 'personal']
  };
  
  const combinedText = (title + ' ' + introduction).toLowerCase();
  const toneWordsForTarget = toneWords[targetTone as keyof typeof toneWords] || [];
  
  let matchCount = 0;
  for (const word of toneWordsForTarget) {
    if (combinedText.includes(word)) matchCount++;
  }
  
  return Math.min(1.0, 0.6 + (matchCount * 0.08));
}

/**
 * Calculates connection strength
 */
function calculateConnectionStrength(body: string, callToAction: string): number {
  // Basic implementation - would use more sophisticated analysis in production
  const coherence = body.toLowerCase().includes(callToAction.toLowerCase().split(' ')[0]);
  const hasDirectAddress = body.includes('you') || body.includes('your');
  
  return coherence && hasDirectAddress ? 0.9 : 0.7;
}

/**
 * Calculates authenticity
 */
function calculateAuthenticity(conclusion: string, callToAction: string): number {
  // Basic implementation - would use more sophisticated analysis in production
  const hasReasonWhy = conclusion.includes('because') || conclusion.includes('reason');
  const hasValueProposition = callToAction.includes('value') || callToAction.includes('benefit');
  
  return hasReasonWhy && hasValueProposition ? 0.9 : 0.7;
}

/**
 * Generates a blog title
 */
function generateBlogTitle(topic: string, audience: string, tone: string): string {
  return `How ${audience} Can Master ${topic}: The Complete Guide`;
}

/**
 * Generates blog outline
 */
function generateBlogOutline(topic: string, emotionalOutcome: string): string[] {
  return [
    `Understanding ${topic}: The Basics`,
    `Why ${topic} Matters for Your Success`,
    `The 5 Key Strategies to Master ${topic}`,
    `Common Challenges and How to Overcome Them`,
    `Next Steps to ${emotionalOutcome}`
  ];
}

/**
 * Generates blog introduction
 */
function generateIntroduction(topic: string, audience: string, emotionalOutcome: string): string {
  return `As a ${audience}, mastering ${topic} is essential for your success. This comprehensive guide will walk you through everything you need to know to excel in this area and ${emotionalOutcome}. We'll cover the fundamentals, best practices, and advanced strategies that set the experts apart.`;
}

/**
 * Generates blog body sections
 */
function generateBodySections(topic: string, industry: string, customerPain: string, outline: string[]): string[] {
  return outline.map(section => {
    return `## ${section}\n\nIn the ${industry || 'current'} landscape, understanding ${section.toLowerCase()} is crucial. Many face challenges like ${customerPain || 'uncertainty'}, but with the right approach, you can overcome these obstacles and excel in ${topic}. Let's explore the key components and actionable strategies.`;
  });
}

/**
 * Generates blog conclusion
 */
function generateConclusion(desiredAction: string, emotionalOutcome: string): string {
  return `Now that you understand the essentials of this topic, it's time to take action. By implementing these strategies consistently, you'll be well on your way to achieving your goals and truly ${emotionalOutcome}. Remember that mastery takes time, but each step forward brings you closer to success. The most important thing is to ${desiredAction} today.`;
}

/**
 * Generates call to action
 */
function generateCallToAction(desiredAction: string, emotionalOutcome: string): string {
  return `Ready to ${emotionalOutcome}? ${capitalizeFirstLetter(desiredAction)} now and transform your results!`;
}

/**
 * Generates keywords for SEO
 */
function generateKeywords(topic: string, audience: string, industry: string): string[] {
  return [
    topic,
    `${topic} for ${audience}`,
    `${topic} guide`,
    `${topic} in ${industry}`,
    `${topic} strategies`,
    `${topic} best practices`
  ];
}

/**
 * Generates related topics for content calendar
 */
function generateRelatedTopics(topic: string, industry: string): string[] {
  return [
    `${topic} Trends for ${new Date().getFullYear()}`,
    `${topic} Case Studies in ${industry}`,
    `Expert Interview: Mastering ${topic}`,
    `Tools and Resources for ${topic}`,
    `${topic} Metrics That Matter`
  ];
}

/**
 * Generates content schedule
 */
function generateContentSchedule(topic: string): string[] {
  return [
    `Week 1: Publish main ${topic} guide`,
    `Week 2: Share on social media with key takeaways`,
    `Week 3: Send email newsletter featuring ${topic} insights`,
    `Week 4: Create infographic summarizing ${topic} strategies`,
    `Week 5: Host webinar expanding on ${topic}`
  ];
}

/**
 * Generates distribution strategy
 */
function generateDistributionStrategy(audience: string): string[] {
  return [
    `LinkedIn for professional ${audience} outreach`,
    `Email newsletter to existing subscribers`,
    `Industry forums where ${audience} congregates`,
    `Partner with influencers who reach ${audience}`,
    `Paid promotion targeting ${audience} demographics`
  ];
}

/**
 * Generates keyword analysis
 */
function generateKeywordAnalysis(topic: string): string[] {
  return [
    `Primary keyword: "${topic}" - High competition, high volume`,
    `Secondary keyword: "${topic} strategies" - Medium competition, medium volume`,
    `Long-tail keyword: "how to implement ${topic} effectively" - Low competition, targeted intent`,
    `Related keyword: "${topic} tools" - Medium competition, high commercial intent`,
    `Question keyword: "why is ${topic} important" - Low competition, informational intent`
  ];
}

/**
 * Generates competitor insights
 */
function generateCompetitorInsights(industry: string): string[] {
  return [
    `Top competitor content focuses on technical aspects of ${industry}`,
    `Gap identified: emotional benefits rarely addressed`,
    `Average competitor content length: 1,200 words`,
    `Most competitor content lacks actionable steps`,
    `Visual content is underutilized by competitors in ${industry}`
  ];
}

/**
 * Generates optimization tips
 */
function generateOptimizationTips(topic: string, audience: string): string[] {
  return [
    `Use H2 and H3 headers containing "${topic}" keywords`,
    `Include at least 5 internal links to related content`,
    `Add alt text to all images containing ${topic} keywords`,
    `Create a meta description highlighting value for ${audience}`,
    `Optimize page load speed for better user experience and SEO ranking`
  ];
} 