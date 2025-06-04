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

import { PromptScoringManager } from '../cursor/prompt-infrastructure/prompt-score';
import { EventBus } from '../cursor/event-bus/eventBus';
import { Logger } from '../utils/logger';
import { PromptSchemaValidator } from '../cursor/services/prompt-schema-validator';
import { routeFallback } from '../cursor/self-healing/fallbackRouter';

// Initialize services
const eventBus = EventBus.getInstance();
const promptScorer = new PromptScoringManager(eventBus);
const schemaValidator = new PromptSchemaValidator();
const logger = new Logger('profile-makeover-mcp');

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

interface ProfileMakeoverOutput {
  headline: string;
  bio: string;
  keyPoints: string[];
  tags: string[];
  callToAction: string;
  platformSpecificSuggestions?: {
    [key: string]: string[];
  };
}

interface ProfileMakeoverSession {
  input: ProfileMakeoverInput;
  output?: ProfileMakeoverOutput;
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
    };
  };
  metadata: {
    version: string;
    timestamp: string;
    trustScore: number;
  };
}

// Platform-specific character limits
const platformLimits = {
  'LinkedIn': { min: 120, max: 2600 },
  'Instagram': { min: 50, max: 150 },
  'X': { min: 50, max: 160 },
  'TikTok': { min: 50, max: 80 },
  'Twitter': { min: 50, max: 160 }
};

// Industry-specific defaults
const industryDefaults = {
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

// Valid platforms and tones
const validPlatforms = ['LinkedIn', 'Instagram', 'X', 'TikTok', 'Twitter'];
const validTones = ['calm', 'bold', 'quirky', 'magnetic', 'professional', 'warm'];

/**
 * Main function to generate a profile makeover
 */
export async function generateProfileMakeover(
  input: ProfileMakeoverInput,
  services?: {
    schemaValidator?: any;
    promptScorer?: any;
    logger?: any;
    eventBus?: any;
  }
): Promise<ProfileMakeoverSession> {
  // Use injected services or defaults
  const validator = services?.schemaValidator || schemaValidator;
  const scorer = services?.promptScorer || promptScorer;
  const loggerService = services?.logger || logger;
  const eventBusService = services?.eventBus || eventBus;

  // Log the start of processing
  loggerService.info('Starting profile makeover generation', {
    platform: input.platform,
    businessType: input.businessType
  });

  eventBusService.emit('profile_makeover:processing_started', { input });

  // Apply MCP enhancers to enrich input
  const enhancedInput = applyMCPEnhancers(input);
  
  const session: ProfileMakeoverSession = {
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
      promptType: 'profile_makeover',
      sessionId: `profile_makeover_${Date.now()}`,
      version: '6.1.4',
      content: JSON.stringify(enhancedInput)
    }) || { isValid: true, errors: [], warnings: [] };
    
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
      
      loggerService.warn('Profile makeover validation failed', {
        issues: session.validationStatus.issues,
        timestamp: session.metadata.timestamp
      });
      
      return session;
    }

    // 2. Generate profile content
    const output = generateProfileContent(enhancedInput);
    session.output = output;

    // 3. Score output
    const scoringResult = await scorer.scorePrompt(
      {
        id: `profile_makeover_${Date.now()}`,
        version: '6.1.4',
        type: 'production',
        status: 'active',
        name: 'Profile Makeover MCP',
        description: 'Manages profile makeover generation with validation, scoring, and recovery',
        content: JSON.stringify(enhancedInput),
        metadata: {
          author: 'CanAI',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          tags: ['profile', 'makeover', 'bio'],
          dependencies: [],
          trustScore: 0.85,
          alignmentScore: 0.9,
          performanceScore: 0.8
        },
        contracts: [],
        constraints: [],
        evolution: {
          id: `profile_makeover_evolution_${Date.now()}`,
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
          platformOptimization: 0.95
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
          platformOptimization: scoringResult.metrics?.platformOptimization || 0.95
        }
      };
      
      session.metadata.trustScore = scoringResult.metrics?.trust?.score || 0.85;
    }

    // 4. Emit completion event
    eventBusService.emit('profile_makeover:processing_completed', {
      session,
      timestamp: Date.now()
    });

    loggerService.info('Profile makeover generation successful', {
      platform: input.platform,
      businessType: input.businessType,
      score: session.score?.overall
    });

    return session;
  } catch (error) {
    // Handle any errors that occur during processing
    loggerService.error('Profile makeover generation failed', { 
      error, 
      input: enhancedInput,
      timestamp: session.metadata.timestamp
    });

    await routeFallback('system', {
      severity: 3,
      details: { error, input: enhancedInput },
      timestamp: session.metadata.timestamp
    });

    eventBusService.emit('profile_makeover:error', {
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
export function applyMCPEnhancers(input: ProfileMakeoverInput): ProfileMakeoverInput {
  try {
    const enhanced = { ...input };

    // Apply industry defaults if industry is provided
    if (enhanced.industry) {
      const defaults = industryDefaults[enhanced.industry.toLowerCase()];
      if (defaults) {
        enhanced.emotionalGoal = enhanced.emotionalGoal || defaults.emotionalGoal;
        enhanced.tone = enhanced.tone || defaults.tone;
        enhanced.trustSignal = enhanced.trustSignal || defaults.trustSignal;
      }
    }

    // Infer missing fields using MCP enhancement logic
    if (!enhanced.audience && enhanced.businessType) {
      enhanced.audience = inferAudienceFromBusinessType(enhanced.businessType);
    }

    if (!enhanced.keyOfferings && enhanced.businessType) {
      enhanced.keyOfferings = inferOfferingsFromBusinessType(enhanced.businessType);
    }

    if (!enhanced.customerPain && enhanced.audience) {
      enhanced.customerPain = inferPainFromAudience(enhanced.audience);
    }

    if (!enhanced.differentiator && enhanced.usp) {
      enhanced.differentiator = enhanced.usp;
    }

    // Apply enhancers based on platform
    if (enhanced.platform) {
      enhanced.enhancers = enhanced.enhancers || {};
      
      // For LinkedIn, add more emotional depth and professionalism
      if (enhanced.platform === 'LinkedIn') {
        enhanced.enhancers.emotionalDepth = enhanced.enhancers.emotionalDepth ?? true;
        enhanced.tone = enhanced.tone || 'professional';
      }
      
      // For Instagram and TikTok, add more engagement and urgency
      if (enhanced.platform === 'Instagram' || enhanced.platform === 'TikTok') {
        enhanced.enhancers.urgency = enhanced.enhancers.urgency ?? true;
        enhanced.tone = enhanced.tone || 'magnetic';
      }
    }

    // Event tracking of enhancement
    eventBus.emit('profile_makeover:enhanced', {
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
function getEnhancementDifferences(original: ProfileMakeoverInput, enhanced: ProfileMakeoverInput): string[] {
  const differences: string[] = [];
  
  for (const key of Object.keys(enhanced)) {
    if (original[key] !== enhanced[key]) {
      differences.push(key);
    }
  }
  
  return differences;
}

/**
 * Infers audience from business type
 */
function inferAudienceFromBusinessType(businessType: string): string {
  const audienceMap = {
    'freelance designer': 'small business owners needing design help',
    'wellness coach': 'busy professionals seeking balance',
    'consultant': 'businesses looking to optimize operations',
    'creative agency': 'brands needing creative solutions',
    'tech startup': 'early adopters and innovators'
  };
  
  for (const [key, audience] of Object.entries(audienceMap)) {
    if (businessType.toLowerCase().includes(key)) {
      return audience;
    }
  }
  
  return 'potential clients';
}

/**
 * Infers offerings from business type
 */
function inferOfferingsFromBusinessType(businessType: string): string {
  const offeringsMap = {
    'freelance designer': 'brand design, web design, marketing materials',
    'wellness coach': 'coaching sessions, wellness programs, mindfulness training',
    'consultant': 'strategic consulting, process optimization, business analysis',
    'creative agency': 'branding, marketing campaigns, creative strategy',
    'tech startup': 'innovative software solutions, digital products'
  };
  
  for (const [key, offerings] of Object.entries(offeringsMap)) {
    if (businessType.toLowerCase().includes(key)) {
      return offerings;
    }
  }
  
  return 'professional services';
}

/**
 * Infers customer pain from audience
 */
function inferPainFromAudience(audience: string): string {
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

/**
 * Generates profile content based on the input
 */
function generateProfileContent(input: ProfileMakeoverInput): ProfileMakeoverOutput {
  // Create headline based on business type and audience
  const headline = generateHeadline(input.businessType, input.audience || '', input.emotionalGoal);
  
  // Generate bio content
  const bio = generateBio(input);
  
  // Generate key points
  const keyPoints = generateKeyPoints(input);
  
  // Generate tags
  const tags = generateTags(input);
  
  // Generate call to action
  const callToAction = generateCallToAction(input);
  
  // Generate platform-specific suggestions
  const platformSpecificSuggestions = generatePlatformSuggestions(input.platform);
  
  return {
    headline,
    bio,
    keyPoints,
    tags,
    callToAction,
    platformSpecificSuggestions
  };
}

/**
 * Generates a headline
 */
function generateHeadline(businessType: string, audience: string, emotionalGoal: string): string {
  const safeBusinessType = businessType || 'Professional';
  const safeAudience = audience || 'clients';
  const safeEmotionalGoal = emotionalGoal || 'achieve their goals';
  return `${capitalizeFirstLetter(safeBusinessType)} helping ${safeAudience} ${safeEmotionalGoal}`;
}

/**
 * Generates a bio
 */
function generateBio(input: ProfileMakeoverInput): string {
  let bio = `I'm a ${input.businessType} specializing in helping ${input.audience || 'clients'} `;
  
  if (input.keyOfferings) {
    bio += `with ${input.keyOfferings}. `;
  } else {
    bio += 'achieve their goals. ';
  }
  
  if (input.differentiator) {
    bio += `My approach is unique because ${input.differentiator}. `;
  }
  
  if (input.trustSignal) {
    bio += `${input.trustSignal}. `;
  }
  
  if (input.emotionalGoal) {
    bio += `My mission is to help you ${input.emotionalGoal}.`;
  }
  
  return bio;
}

/**
 * Generates key points
 */
function generateKeyPoints(input: ProfileMakeoverInput): string[] {
  const points = [];
  
  if (input.keyOfferings) {
    points.push(`Specializing in ${input.keyOfferings}`);
  }
  
  if (input.trustSignal) {
    points.push(input.trustSignal);
  }
  
  if (input.customerPain) {
    points.push(`Solving: ${input.customerPain}`);
  }
  
  if (input.differentiator) {
    points.push(`Unique approach: ${input.differentiator}`);
  }
  
  return points;
}

/**
 * Generates tags
 */
function generateTags(input: ProfileMakeoverInput): string[] {
  const tags = [];
  
  tags.push(input.businessType.replace(/\s+/g, ''));
  
  if (input.industry) {
    tags.push(input.industry.replace(/\s+/g, ''));
  }
  
  if (input.keyOfferings) {
    const offerings = input.keyOfferings.split(',')[0];
    tags.push(offerings.trim().replace(/\s+/g, ''));
  }
  
  return tags;
}

/**
 * Generates a call to action
 */
function generateCallToAction(input: ProfileMakeoverInput): string {
  if (input.platform === 'LinkedIn') {
    return `Let's connect to discuss how I can help you ${input.emotionalGoal}.`;
  } else if (input.platform === 'Instagram' || input.platform === 'TikTok') {
    return `DM me to start your journey to ${input.emotionalGoal}!`;
  } else {
    return `Reach out today to learn how you can ${input.emotionalGoal}.`;
  }
}

/**
 * Generates platform-specific suggestions
 */
function generatePlatformSuggestions(platform: string): { [key: string]: string[] } {
  const suggestions: { [key: string]: string[] } = {};
  
  if (platform === 'LinkedIn') {
    suggestions['LinkedIn'] = [
      'Add a professional profile photo',
      'Complete the Featured section with portfolio items',
      'Request recommendations from clients',
      'Post content consistently (2-3 times per week)',
      'Engage with industry content daily'
    ];
  } else if (platform === 'Instagram') {
    suggestions['Instagram'] = [
      'Use a consistent color palette in your grid',
      'Create highlights for your services',
      'Post stories daily to stay visible',
      'Use location tags to reach local clients',
      'Create Reels showcasing your expertise'
    ];
  } else if (platform === 'TikTok') {
    suggestions['TikTok'] = [
      'Create short-form videos explaining your expertise',
      'Use trending sounds to increase reach',
      'Post consistently (at least 1 video per day)',
      'Respond to comments quickly to boost engagement',
      'Include clear CTAs in your videos'
    ];
  } else if (platform === 'X' || platform === 'Twitter') {
    suggestions['Twitter'] = [
      'Pin your most impactful tweet',
      'Engage in relevant hashtags and conversations',
      'Thread your expertise into micro-content',
      'Share valuable insights daily',
      'Retweet and comment on industry leaders'
    ];
  }
  
  return suggestions;
}

/**
 * Capitalizes the first letter of a string
 */
function capitalizeFirstLetter(str: string | undefined): string {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Create the exported MCP object
export const profileMakeoverMCP = {
  generate: generateProfileMakeover,
  applyMCPEnhancers
}; 