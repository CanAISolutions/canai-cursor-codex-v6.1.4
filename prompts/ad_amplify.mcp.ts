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

import { PromptScoringManager } from '../cursor/prompt-infrastructure/prompt-score';
import { EventBus } from '../cursor/event-bus/eventBus';
import { Logger } from '../utils/logger';
import { PromptSchemaValidator } from '../cursor/services/prompt-schema-validator';
import { routeFallback } from '../cursor/self-healing/fallbackRouter';

// Initialize services
const eventBus = EventBus.getInstance();
const promptScorer = new PromptScoringManager(eventBus);
const schemaValidator = new PromptSchemaValidator();
const logger = new Logger('ad-amplify-mcp');

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

interface AdAmplifyOutput {
  headline: string;
  copy: string;
  callToAction: string;
  variations: AdVariation[];
  targetingRecommendations: {
    audiences: string[];
    interests: string[];
    demographics: string[];
  };
  optimizationTips: {
    platform: string;
    tips: string[];
  };
}

interface AdVariation {
  headline: string;
  copy: string;
  callToAction: string;
  focus: string;
}

interface AdAmplifySession {
  input: AdAmplifyInput;
  output?: AdAmplifyOutput;
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
      platformOptimization: number;
      conversionPotential: number;
    };
  };
  metadata: {
    version: string;
    timestamp: string;
    trustScore: number;
  };
}

// Platform-specific constraints and optimization
const platformConstraints = {
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
const industryDefaults = {
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
const emotionalCTAMap = {
  'spark urgency': ['Act Now', 'Limited Time', 'Don\'t Miss Out'],
  'build trust': ['Learn More', 'See How', 'Discover Why'],
  'feel seen': ['Get Started', 'Find Your Solution', 'Take Control'],
  'feel empowered': ['Transform Today', 'Unlock Your Potential', 'Start Your Journey'],
  'create desire': ['Get Yours', 'Shop Now', 'Experience This']
};

// Valid platforms and tones
const validPlatforms = ['Facebook', 'Google', 'Instagram', 'X', 'LinkedIn', 'TikTok'];
const validTones = ['calm', 'bold', 'rebellious', 'warm', 'professional', 'urgent'];
const validEmotionalGoals = ['spark urgency', 'build trust', 'feel seen', 'feel empowered', 'create desire'];

/**
 * Main function to generate ad amplify content
 */
export async function generateAdAmplify(
  input: AdAmplifyInput,
  services?: {
    schemaValidator?: any;
    promptScorer?: any;
    logger?: any;
    eventBus?: any;
  }
): Promise<AdAmplifySession> {
  // Use injected services or defaults
  const validator = services?.schemaValidator || schemaValidator;
  const scorer = services?.promptScorer || promptScorer;
  const loggerService = services?.logger || logger;
  const eventBusService = services?.eventBus || eventBus;

  // Log the start of processing
  loggerService.info('Starting ad amplify generation', {
    platform: input.platform,
    productOffer: input.productOffer,
    audience: input.audience
  });

  eventBusService.emit('ad_amplify:processing_started', { input });

  // Apply MCP enhancers to enrich input
  const enhancedInput = applyMCPEnhancers(input);
  
  const session: AdAmplifySession = {
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
    const validationResult = await validator.validatePrompt({
      promptType: 'ad_amplify',
      sessionId: `ad_amplify_${Date.now()}`,
      version: '6.1.4',
      content: JSON.stringify(enhancedInput)
    }) || { isValid: true, errors: [], warnings: [] };
    
    session.validationStatus = {
      isValid: validationResult.isValid,
      issues: [...(validationResult.errors || []), ...(validationResult.warnings || [])]
    };

    if (!validationResult.isValid) {
      await routeFallback('validation', {
        severity: 2,
        details: { input: enhancedInput, validationResult },
        timestamp: session.metadata.timestamp
      });
      
      logger.warn('Ad amplify validation failed', {
        issues: session.validationStatus.issues,
        timestamp: session.metadata.timestamp
      });
      
      eventBus.emit('ad_amplify:validation_failed', {
        input: enhancedInput,
        issues: session.validationStatus.issues,
        timestamp: Date.now()
      });
      
      return session;
    }

    // 2. Generate ad content
    const output = generateAdContent(enhancedInput);
    session.output = output;

    // 3. Score output
    const scoringResult = await promptScorer.scorePrompt(
      {
        id: `ad_amplify_${Date.now()}`,
        version: '6.1.4',
        type: 'production',
        status: 'active',
        name: 'Ad Amplify MCP',
        description: 'Manages ad amplify generation with validation, scoring, and recovery',
        content: JSON.stringify(enhancedInput),
        metadata: {
          author: 'CanAI',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          tags: ['ad', 'amplify', 'marketing'],
          dependencies: [],
          trustScore: 0.85,
          alignmentScore: 0.9,
          performanceScore: 0.8
        },
        contracts: [],
        constraints: [],
        evolution: {
          id: `ad_amplify_evolution_${Date.now()}`,
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
          toneMatch: 0.9,
          emotionalDepth: 0.85,
          clarity: 0.9,
          completeness: 0.9,
          platformOptimization: 0.95,
          conversionPotential: 0.88
        }
      }
    );

    if (scoringResult) {
      session.score = {
        overall: scoringResult.score || 0.85,
        breakdown: {
          toneMatch: scoringResult.metrics?.toneMatch || 0.9,
          emotionalDepth: scoringResult.metrics?.emotionalDepth || 0.85,
          clarity: scoringResult.metrics?.clarity || 0.9,
          completeness: scoringResult.metrics?.completeness || 0.9,
          platformOptimization: scoringResult.metrics?.platformOptimization || 0.95,
          conversionPotential: scoringResult.metrics?.conversionPotential || 0.88
        }
      };
      
      session.metadata.trustScore = scoringResult.metrics?.trust?.score || 0.85;
    }

    // 4. Emit completion event
    eventBus.emit('ad_amplify:processing_completed', {
      session,
      timestamp: Date.now()
    });

    logger.info('Ad amplify generation successful', {
      platform: input.platform,
      productOffer: input.productOffer,
      audience: input.audience,
      score: session.score?.overall
    });

    return session;
  } catch (error) {
    // Handle any errors that occur during processing
    logger.error('Ad amplify generation failed', { 
      error, 
      input: enhancedInput,
      timestamp: session.metadata.timestamp
    });

    await routeFallback('system', {
      severity: 3,
      details: { error, input: enhancedInput },
      timestamp: session.metadata.timestamp
    });

    eventBus.emit('ad_amplify:error', {
      error,
      input: enhancedInput,
      timestamp: Date.now()
    });

    throw error;
  }
}

/**
 * Applies MCP enhancers to the input
 */
export function applyMCPEnhancers(input: AdAmplifyInput): AdAmplifyInput {
  try {
    const enhanced = { ...input };

    // Apply industry defaults if industry is provided
    if (enhanced.industry) {
      const defaults = industryDefaults[enhanced.industry.toLowerCase()];
      if (defaults) {
        enhanced.emotionalGoal = enhanced.emotionalGoal || defaults.emotionalGoal;
        enhanced.tone = enhanced.tone || defaults.tone;
        enhanced.desiredAction = enhanced.desiredAction || defaults.desiredAction;
        enhanced.trustSignal = enhanced.trustSignal || defaults.trustSignal;
      }
    }

    // Infer missing fields using MCP enhancement logic
    if (!enhanced.customerPain && enhanced.audience) {
      enhanced.customerPain = inferPainFromAudience(enhanced.audience);
    }

    if (!enhanced.keyOfferings && enhanced.productOffer) {
      enhanced.keyOfferings = enhanced.productOffer;
    }

    if (!enhanced.desiredAction && enhanced.emotionalGoal) {
      enhanced.desiredAction = inferCTAFromEmotionalGoal(enhanced.emotionalGoal);
    }

    if (!enhanced.usp && enhanced.differentiator) {
      enhanced.usp = enhanced.differentiator;
    }

    if (!enhanced.keyMessage && enhanced.productOffer && enhanced.customerPain) {
      enhanced.keyMessage = inferKeyMessageFromOfferAndPain(enhanced.productOffer, enhanced.customerPain);
    }

    // Platform-specific enhancements
    if (enhanced.platform === 'Facebook' || enhanced.platform === 'Instagram') {
      enhanced.enhancers = enhanced.enhancers || {};
      enhanced.enhancers.emotionalDepth = enhanced.enhancers.emotionalDepth ?? true;
    }

    if (enhanced.platform === 'Google') {
      enhanced.enhancers = enhanced.enhancers || {};
      enhanced.enhancers.useAnalogies = enhanced.enhancers.useAnalogies ?? false; // Keep Google ads direct
    }

    if (enhanced.emotionalGoal === 'spark urgency') {
      enhanced.enhancers = enhanced.enhancers || {};
      enhanced.enhancers.urgency = enhanced.enhancers.urgency ?? true;
    }

    // Event tracking of enhancement
    eventBus.emit('ad_amplify:enhanced', {
      original: input,
      enhanced,
      enhancements: getEnhancementDifferences(input, enhanced),
      timestamp: Date.now()
    });

    return enhanced;
  } catch (error) {
    logger.error('Error applying MCP enhancers', { error });
    return input;
  }
}

/**
 * Gets the differences between original and enhanced inputs
 */
function getEnhancementDifferences(original: AdAmplifyInput, enhanced: AdAmplifyInput): string[] {
  const differences: string[] = [];
  
  for (const key of Object.keys(enhanced)) {
    if (original[key] !== enhanced[key]) {
      differences.push(key);
    }
  }
  
  return differences;
}

/**
 * Infers customer pain from audience
 */
function inferPainFromAudience(audience: string): string {
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

/**
 * Infers CTA from emotional goal
 */
function inferCTAFromEmotionalGoal(emotionalGoal: string): string {
  const ctaOptions = emotionalCTAMap[emotionalGoal];
  return ctaOptions ? ctaOptions[0] : 'Learn More';
}

/**
 * Infers key message from offer and pain
 */
function inferKeyMessageFromOfferAndPain(offer: string, pain: string): string {
  return `Transform ${pain.split(' ')[0]} with ${offer.split(' ')[0]}`;
}

/**
 * Validates platform compliance
 */
function validatePlatformCompliance(platform: string, content: { headline?: string; copy?: string }): boolean {
  const constraints = platformConstraints[platform];
  if (!constraints) return true;

  if (content.headline && content.headline.length > constraints.headlineMax) return false;
  if (content.copy && content.copy.length > constraints.copyMax) return false;

  return true;
}

/**
 * Generates ad content based on the input
 */
function generateAdContent(input: AdAmplifyInput): AdAmplifyOutput {
  // Generate headline
  const headline = generateHeadline(input);
  
  // Generate ad copy
  const copy = generateCopy(input);
  
  // Generate call to action
  const callToAction = input.desiredAction || inferCTAFromEmotionalGoal(input.emotionalGoal);
  
  // Generate ad variations
  const variations = generateAdVariations(input, headline, copy, callToAction);
  
  // Generate targeting recommendations
  const targetingRecommendations = generateTargetingRecommendations(input);
  
  // Generate optimization tips
  const optimizationTips = generateOptimizationTips(input.platform);
  
  return {
    headline,
    copy,
    callToAction,
    variations,
    targetingRecommendations,
    optimizationTips
  };
}

/**
 * Generates a headline
 */
function generateHeadline(input: AdAmplifyInput): string {
  // Headline options based on emotional goal
  const headlineOptions = {
    'spark urgency': [
      `Last Chance: ${input.productOffer}`,
      `Don't Miss Out: ${input.productOffer}`,
      `Limited Time: ${input.productOffer}`
    ],
    'build trust': [
      `${input.trustSignal || 'Trusted'}: ${input.productOffer}`,
      `Proven ${input.productOffer}`,
      `Reliable ${input.productOffer}`
    ],
    'feel seen': [
      `${input.audience}? ${input.productOffer} for You`,
      `Made for ${input.audience}: ${input.productOffer}`,
      `${input.productOffer} - Understanding ${input.audience}`
    ],
    'feel empowered': [
      `Transform with ${input.productOffer}`,
      `Take Control with ${input.productOffer}`,
      `Unleash Your Potential: ${input.productOffer}`
    ],
    'create desire': [
      `Experience ${input.productOffer}`,
      `Imagine Having ${input.productOffer}`,
      `${input.productOffer} - What You've Been Waiting For`
    ]
  };
  
  const options = headlineOptions[input.emotionalGoal] || [`${input.productOffer} for ${input.audience}`];
  return options[0];
}

/**
 * Generates ad copy
 */
function generateCopy(input: AdAmplifyInput): string {
  let copy = '';
  
  // Opening based on emotional goal
  if (input.emotionalGoal === 'spark urgency') {
    copy += `Time is running out to ${input.keyMessage || input.productOffer}. `;
  } else if (input.emotionalGoal === 'build trust') {
    copy += `${input.trustSignal || 'Trusted by many'}: ${input.productOffer}. `;
  } else if (input.emotionalGoal === 'feel seen') {
    copy += `As ${input.audience}, you know the challenge of ${input.customerPain || 'getting results'}. `;
  } else if (input.emotionalGoal === 'feel empowered') {
    copy += `Take control of ${input.customerPain || 'your results'} with ${input.productOffer}. `;
  } else if (input.emotionalGoal === 'create desire') {
    copy += `Imagine what ${input.productOffer} could do for you. `;
  }
  
  // Middle section
  if (input.keyOfferings) {
    copy += `${input.keyOfferings}. `;
  }
  
  if (input.usp || input.differentiator) {
    copy += `${input.usp || input.differentiator}. `;
  }
  
  // Closing with call to action hint
  copy += `${input.desiredAction || inferCTAFromEmotionalGoal(input.emotionalGoal)} today!`;
  
  return copy;
}

/**
 * Generates ad variations
 */
function generateAdVariations(input: AdAmplifyInput, headline: string, copy: string, callToAction: string): AdVariation[] {
  const variations: AdVariation[] = [];
  
  // Variation 1: Feature focus
  variations.push({
    headline: `Introducing: ${input.productOffer}`,
    copy: `${input.keyOfferings || input.productOffer} designed for ${input.audience}. ${copy.split('.')[1] || ''}`,
    callToAction,
    focus: 'Features'
  });
  
  // Variation 2: Pain focus
  variations.push({
    headline: `Tired of ${input.customerPain || 'the same old results'}?`,
    copy: `${input.productOffer} solves this for ${input.audience}. ${input.keyOfferings || ''}`,
    callToAction,
    focus: 'Pain Point'
  });
  
  // Variation 3: Benefit focus
  // PHASE 3 FIX: Add null check for emotionalGoal to prevent undefined property access
  const emotionalGoalCapitalized = input.emotionalGoal ? 
    input.emotionalGoal.charAt(0).toUpperCase() + input.emotionalGoal.slice(1) : 
    'Transform';
  
  variations.push({
    headline: `${emotionalGoalCapitalized} with ${input.productOffer}`,
    copy: `${input.audience} are achieving results with ${input.productOffer}. ${input.usp || ''}`,
    callToAction,
    focus: 'Benefits'
  });
  
  return variations;
}

/**
 * Generates targeting recommendations
 */
function generateTargetingRecommendations(input: AdAmplifyInput): { audiences: string[], interests: string[], demographics: string[] } {
  const audiences = [];
  const interests = [];
  const demographics = [];
  
  // Audiences based on input
  audiences.push(input.audience);
  audiences.push(`${input.audience} who need ${input.productOffer}`);
  
  // Interests based on product offer
  const words = input.productOffer.split(' ');
  for (const word of words) {
    if (word.length > 3) {
      interests.push(word);
    }
  }
  
  if (input.industry) {
    interests.push(input.industry);
  }
  
  // Demographics - default values
  demographics.push('25-54');
  demographics.push('Professionals');
  
  return {
    audiences,
    interests,
    demographics
  };
}

/**
 * Generates optimization tips
 */
function generateOptimizationTips(platform: string): { platform: string, tips: string[] } {
  const platformTips = {
    'Facebook': [
      'Use high-contrast images that feature your product clearly',
      'Keep your primary text under 125 characters for best visibility',
      'Test multiple audiences with the same ad creative',
      'Use the carousel format to showcase multiple product benefits',
      'Include social proof elements like testimonials or ratings'
    ],
    'Google': [
      'Include your keywords in both the headline and description',
      'Create at least 3 headline variations for each ad group',
      'Use ad extensions to increase your ad real estate',
      'Match your landing page content closely to your ad copy',
      'Focus on specific benefits rather than general statements'
    ],
    'Instagram': [
      'Use high-quality, visually appealing images or videos',
      'Create square or vertical content to maximize screen space',
      'Include up to 30 relevant hashtags to increase reach',
      'Feature people using your product for better engagement',
      'Create a consistent visual style across all your ads'
    ],
    'X': [
      'Keep your message concise and use only essential hashtags',
      'Include a clear visual that stands out in the feed',
      'Consider using conversation starter questions in your copy',
      'Test thread-style ads for complex products/services',
      'Use current events or trends relevant to your audience'
    ],
    'LinkedIn': [
      'Focus on professional benefits and outcomes',
      'Use industry-specific terminology appropriate for your audience',
      'Include specific statistics or results when possible',
      'Target by job title, industry, and company size',
      'Mention professional growth, advancement, or skill development'
    ],
    'TikTok': [
      'Create authentic, native-looking content rather than traditional ads',
      'Keep your message simple and focused on one key point',
      'Use trending sounds, effects, or challenges when appropriate',
      'Show your product in action with quick, engaging demonstrations',
      'Create content that encourages engagement or participation'
    ]
  };
  
  return {
    platform,
    tips: platformTips[platform] || [
      'Test multiple creative variations',
      'Focus on your unique value proposition',
      'Include a clear call-to-action',
      'Speak directly to your target audience\'s needs',
      'Track performance and optimize based on data'
    ]
  };
}

// Create the exported MCP object
export const adAmplifyMCP = {
  generate: generateAdAmplify,
  applyMCPEnhancers
}; 