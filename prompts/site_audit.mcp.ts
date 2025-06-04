/**
 * site_audit.mcp.ts
 * 
 * Purpose:
 * Manages site audit generation with TAP-enhanced validation,
 * scoring, and recovery mechanisms.
 * 
 * TAP-Status: Locked
 * Codex: v6.1.4
 * MCP Enhancement: Enabled (v3 Schema Lock)
 */

import { validateInputSchema } from '../cursor/prompt-infrastructure/validation/input-validator';
import { scorePromptQuality } from '../cursor/prompt-infrastructure/prompt-score/quality-scorer';
import { EmotionalToneValidator } from '../cursor/emotional-sovereignty/tone-validator';
import { FallbackRouter } from '../cursor/self-healing/fallback-router';
import { Logger } from '../utils/logger';
import { EventBus } from '../cursor/event-bus/event-bus';
import { PromptSchemaValidator } from '../cursor/prompt-infrastructure/validation/schema-validator';
import { EmotionalMemoryBank } from '../cursor/memory/emotional-memory-bank';
import { PromptScoringManager } from '../cursor/prompt-infrastructure/prompt-score/scoring-manager';
import { TrustMetricsCollector } from '../cursor/trust/trust-metrics-collector';

interface SiteAuditInput {
  siteUrl: string;
  auditType: string;
  focusAreas: string[];
  goals: string[];
  tone: string;
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
  enhancers?: Record<string, boolean>;
}

interface SiteAuditOutput {
  audit: {
    overview: string;
    findings: {
      critical: string[];
      high: string[];
      medium: string[];
      low: string[];
    };
    recommendations: string[];
    metrics: string[];
  };
  action: string[];
  timeline: string[];
  resources: string[];
}

interface SiteAuditSession {
  input: SiteAuditInput;
  output?: SiteAuditOutput;
  validationStatus: {
    isValid: boolean;
    issues: string[];
  };
  score?: {
    overall: number;
    breakdown: {
      clarity: number;
      structure: number;
      completeness: number;
      toneMatch: number;
      emotionalDepth: number;
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
    mcpEnhancementUsed: boolean;
  };
}

const validationSchema = {
  requiredFields: ['siteUrl', 'auditType', 'focusAreas', 'goals', 'tone'],
  fieldTypes: {
    siteUrl: 'string',
    auditType: 'string',
    focusAreas: 'array',
    goals: 'array',
    tone: 'string'
  },
  validTones: ['analytical', 'professional', 'technical', 'strategic', 'constructive']
};

// MCP Enhancer Logic - Auto-fill missing fields
function applyMCPEnhancers(input: SiteAuditInput): SiteAuditInput {
  const enhanced = { ...input };

  // Infer problemSolved from goals/auditType
  if (!enhanced.problemSolved && (enhanced.goals?.length || enhanced.auditType)) {
    enhanced.problemSolved = inferProblemFromGoals(enhanced.goals || [], enhanced.auditType);
  }

  // Infer customerContent from siteUrl analysis
  if (!enhanced.customerContent && enhanced.siteUrl) {
    enhanced.customerContent = inferContentFromSite(enhanced.siteUrl, enhanced.auditType);
  }

  // Infer differentiator from audit focus areas
  if (!enhanced.differentiator && enhanced.focusAreas?.length) {
    enhanced.differentiator = inferDifferentiatorFromFocus(enhanced.focusAreas);
  }

  // Infer founderBio from audit context
  if (!enhanced.founderBio) {
    enhanced.founderBio = inferFounderFromAudit(enhanced.auditType, enhanced.goals || []);
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

function inferProblemFromGoals(goals: string[], auditType: string): string {
  const problemTemplates = {
    'performance': 'Site performance issues affecting user experience and conversions',
    'seo': 'Poor search engine visibility limiting organic traffic growth',
    'security': 'Security vulnerabilities exposing business and customer data risks',
    'accessibility': 'Accessibility barriers preventing inclusive user experiences',
    'conversion': 'Low conversion rates due to UX and optimization gaps',
    'mobile': 'Mobile experience issues impacting user engagement'
  };

  const auditTypeLower = auditType.toLowerCase();
  for (const [key, problem] of Object.entries(problemTemplates)) {
    if (auditTypeLower.includes(key)) {
      return problem;
    }
  }

  if (goals.length > 0) {
    return `Addressing challenges related to: ${goals.join(', ')}`;
  }

  return 'Identifying and resolving key website performance and user experience issues';
}

function inferContentFromSite(siteUrl: string, auditType: string): string {
  const domain = siteUrl.replace(/^https?:\/\//, '').split('/')[0];
  
  return `Comprehensive analysis of ${domain} focusing on ${auditType} optimization. Content includes detailed findings, actionable recommendations, and implementation roadmap for improved performance and user experience.`;
}

function inferDifferentiatorFromFocus(focusAreas: string[]): string {
  const focusTemplates = {
    'performance': 'Advanced performance optimization with cutting-edge techniques',
    'seo': 'Comprehensive SEO strategy with data-driven insights',
    'security': 'Enterprise-grade security assessment and hardening',
    'accessibility': 'Inclusive design principles with WCAG compliance',
    'conversion': 'Conversion rate optimization with behavioral analysis',
    'mobile': 'Mobile-first optimization with responsive design excellence'
  };

  const primaryFocus = focusAreas[0]?.toLowerCase();
  if (primaryFocus && focusTemplates[primaryFocus as keyof typeof focusTemplates]) {
    return focusTemplates[primaryFocus as keyof typeof focusTemplates];
  }

  return `Specialized audit approach combining ${focusAreas.join(', ')} for maximum impact`;
}

function inferFounderFromAudit(auditType: string, goals: string[]): string {
  return `Experienced web optimization specialist with expertise in ${auditType} audits. Passionate about helping businesses achieve their digital goals through data-driven improvements and user-centered design.`;
}

// Create event bus for emitting events
const eventBus = new EventBus();
const emit = (event: string, data: any) => {
  Logger.info(`SiteAuditMCP: Emitting ${event} event`);
  eventBus.emit(event, { type: 'site_audit', data });
};

export async function generateSiteAudit(input: SiteAuditInput): Promise<SiteAuditSession> {
  // Apply MCP enhancers first
  const enhancedInput = applyMCPEnhancers(input);

  const session: SiteAuditSession = {
    input: enhancedInput,
    validationStatus: { isValid: false, issues: [] },
    metadata: {
      version: '6.1.4',
      timestamp: new Date().toISOString(),
      trustScore: 0,
      mcpEnhancementUsed: hasMCPEnhancements(input, enhancedInput)
    }
  };

  try {
    // 1. Validate input
    const validator = new PromptSchemaValidator();
    const validationResult = await validator.validateSchema({
      input: enhancedInput,
      schema: validationSchema,
      promptType: 'site_audit'
    });
    
    session.validationStatus = {
      isValid: validationResult.isValid,
      issues: validationResult.errors || []
    };

    Logger.info('SiteAuditMCP: Input validation completed', {
      isValid: session.validationStatus.isValid,
      issueCount: session.validationStatus.issues.length
    });

    if (!session.validationStatus.isValid) {
      emit('validationFailed', session.validationStatus);
      return handleInvalidInput(enhancedInput, session);
    }

    // 2. Generate output
    const output = await generateAuditOutput(enhancedInput);
    session.output = output;

    // 3. Score output
    const scoringManager = new PromptScoringManager();
    const scoringResult = await scoringManager.scorePrompt({
      promptType: 'site_audit',
      input: output,
      context: {
        requiredFields: ['audit', 'action', 'timeline', 'resources'],
        validTones: validationSchema.validTones
      }
    });

    session.score = {
      overall: scoringResult.overall,
      breakdown: {
        clarity: scoringResult.clarity,
        structure: scoringResult.structure || 0,
        completeness: scoringResult.completeness,
        toneMatch: scoringResult.toneMatch,
        emotionalDepth: scoringResult.emotionalDepth || 0
      }
    };

    Logger.info('SiteAuditMCP: Output scoring completed', {
      overallScore: session.score.overall,
      clarityScore: session.score.breakdown.clarity
    });

    if (session.score.overall < 0.7) {
      emit('lowScoreDetected', session.score);
      return handleLowScore(enhancedInput, output, session);
    }

    // 4. Evaluate empathy
    const emotionalToneValidator = new EmotionalToneValidator();
    const empathyResult = await emotionalToneValidator.validateFullEmpathy({
      tone: enhancedInput.tone,
      content: formatOutputForEmpathyCheck(output),
      context: {
        audienceType: enhancedInput.audience || 'business owner',
        industry: enhancedInput.auditType
      }
    });

    session.empathyMetrics = {
      emotionalResonance: empathyResult.emotionalResonance,
      toneAlignment: empathyResult.toneAlignment,
      connectionStrength: empathyResult.connectionStrength,
      authenticity: empathyResult.authenticity
    };

    Logger.info('SiteAuditMCP: Empathy validation completed', {
      toneAlignment: session.empathyMetrics.toneAlignment,
      resonance: session.empathyMetrics.emotionalResonance
    });

    if (empathyResult.toneAlignment < 0.7) {
      emit('empathyMismatch', session.empathyMetrics);
      return handleEmpathyMismatch(enhancedInput, output, session);
    }

    // 5. Calculate trust score
    session.metadata.trustScore = calculateTrustScore(session);
    
    // Store session data in emotional memory bank for future reference
    const memoryBank = new EmotionalMemoryBank();
    await memoryBank.storeMemory({
      type: 'site_audit',
      data: {
        url: enhancedInput.siteUrl,
        auditType: enhancedInput.auditType,
        trustScore: session.metadata.trustScore
      }
    });

    emit('sessionComplete', {
      sessionId: TrustMetricsCollector.generateSessionId(),
      trustScore: session.metadata.trustScore
    });

    return session;
  } catch (error) {
    Logger.error('SiteAuditMCP: Error generating site audit', {
      error: error.message,
      stack: error.stack,
      siteUrl: input.siteUrl
    });
    
    emit('processingError', { error: error.message });
    
    // Handle unexpected errors with fallback
    return handleError(enhancedInput, error, session);
  }
}

function hasMCPEnhancements(original: SiteAuditInput, enhanced: SiteAuditInput): boolean {
  return (
    (!original.problemSolved && !!enhanced.problemSolved) ||
    (!original.customerContent && !!enhanced.customerContent) ||
    (!original.differentiator && !!enhanced.differentiator) ||
    (!original.founderBio && !!enhanced.founderBio)
  );
}

// Helper function to handle invalid input
async function handleInvalidInput(input: SiteAuditInput, session: SiteAuditSession): Promise<SiteAuditSession> {
  const fallbackRouter = new FallbackRouter();
  const recoveryResult = await fallbackRouter.routeFallback('validation', {
    promptType: 'site_audit',
    input,
    validationStatus: session.validationStatus
  });
  
  Logger.warn('SiteAuditMCP: Input validation failed, using fallback', {
    issues: session.validationStatus.issues,
    recoverySuccess: recoveryResult.success
  });
  
  if (recoveryResult.success && recoveryResult.enhancedInput) {
    // Retry with enhanced input from fallback
    return generateSiteAudit(recoveryResult.enhancedInput as SiteAuditInput);
  }
  
  // Return original session with failure noted
  session.metadata.trustScore = 0.3; // Low trust score for invalid input
  return session;
}

// Helper function to handle low score
async function handleLowScore(input: SiteAuditInput, output: SiteAuditOutput, session: SiteAuditSession): Promise<SiteAuditSession> {
  const fallbackRouter = new FallbackRouter();
  const recoveryResult = await fallbackRouter.routeFallback('scoring', {
    promptType: 'site_audit',
    input,
    output,
    score: session.score
  });
  
  Logger.warn('SiteAuditMCP: Low score detected, using fallback', {
    score: session.score?.overall,
    recoverySuccess: recoveryResult.success
  });
  
  if (recoveryResult.success && recoveryResult.enhancedInput) {
    // Retry with enhanced input from fallback
    return generateSiteAudit(recoveryResult.enhancedInput as SiteAuditInput);
  }
  
  // Return original session with failure noted
  session.metadata.trustScore = 0.5; // Mediocre trust score for low quality
  return session;
}

// Helper function to handle empathy mismatch
async function handleEmpathyMismatch(input: SiteAuditInput, output: SiteAuditOutput, session: SiteAuditSession): Promise<SiteAuditSession> {
  const fallbackRouter = new FallbackRouter();
  const recoveryResult = await fallbackRouter.routeFallback('empathy', {
    promptType: 'site_audit',
    input,
    output,
    empathyMetrics: session.empathyMetrics
  });
  
  Logger.warn('SiteAuditMCP: Empathy mismatch detected, using fallback', {
    toneAlignment: session.empathyMetrics?.toneAlignment,
    recoverySuccess: recoveryResult.success
  });
  
  if (recoveryResult.success && recoveryResult.enhancedInput) {
    // Retry with enhanced input from fallback
    return generateSiteAudit(recoveryResult.enhancedInput as SiteAuditInput);
  }
  
  // Return original session with failure noted
  session.metadata.trustScore = 0.6; // Reduced trust score for empathy issues
  return session;
}

// Helper function to handle errors
async function handleError(input: SiteAuditInput, error: Error, session: SiteAuditSession): Promise<SiteAuditSession> {
  const fallbackRouter = new FallbackRouter();
  const recoveryResult = await fallbackRouter.routeFallback('system', {
    promptType: 'site_audit',
    input,
    error: error.message
  });
  
  Logger.error('SiteAuditMCP: Error during processing, using fallback', {
    error: error.message,
    recoverySuccess: recoveryResult.success
  });
  
  if (recoveryResult.success && recoveryResult.enhancedInput) {
    // Retry with enhanced input from fallback
    return generateSiteAudit(recoveryResult.enhancedInput as SiteAuditInput);
  }
  
  // Return session with error noted
  session.metadata.trustScore = 0.2; // Very low trust score for errors
  return session;
}

// Helper function to format output for empathy check
function formatOutputForEmpathyCheck(output: SiteAuditOutput): string {
  return `
    Overview: ${output.audit.overview}
    
    Critical Findings:
    ${output.audit.findings.critical.join('\n')}
    
    High Priority Findings:
    ${output.audit.findings.high.join('\n')}
    
    Recommendations:
    ${output.audit.recommendations.join('\n')}
    
    Action Steps:
    ${output.action.join('\n')}
  `;
}

// Helper function to calculate trust score
function calculateTrustScore(session: SiteAuditSession): number {
  if (!session.score || !session.empathyMetrics) {
    return 0.4; // Default low score if missing data
  }
  
  // Calculate weighted score based on quality and empathy
  const scoreWeight = 0.6;
  const empathyWeight = 0.4;
  
  const qualityScore = session.score.overall;
  const empathyScore = (
    session.empathyMetrics.emotionalResonance * 0.3 +
    session.empathyMetrics.toneAlignment * 0.3 +
    session.empathyMetrics.connectionStrength * 0.2 +
    session.empathyMetrics.authenticity * 0.2
  );
  
  const trustScore = (qualityScore * scoreWeight) + (empathyScore * empathyWeight);
  
  // Round to 2 decimal places
  return Math.round(trustScore * 100) / 100;
}

// Helper function to generate actual audit output
async function generateAuditOutput(input: SiteAuditInput): Promise<SiteAuditOutput> {
  // In a real implementation, this would call an AI service or other logic
  // to generate the actual audit content based on the input
  Logger.info('SiteAuditMCP: Generating audit output', {
    siteUrl: input.siteUrl,
    auditType: input.auditType
  });
  
  // This is a placeholder implementation that would be replaced with actual content generation
  return {
    audit: {
      overview: `Comprehensive analysis of ${input.siteUrl} focusing on ${input.auditType} optimization opportunities.`,
      findings: {
        critical: [
          `${input.auditType.toUpperCase()} security vulnerabilities detected`,
          'Performance bottlenecks affecting conversion rates'
        ],
        high: [
          'SEO optimization needed for better organic visibility',
          'Mobile responsiveness issues on key landing pages'
        ],
        medium: [
          'Content gaps in key product descriptions',
          'Navigation improvements for user journey optimization'
        ],
        low: [
          'Minor UI inconsistencies across pages',
          'Documentation updates for improved clarity'
        ]
      },
      recommendations: [
        `Implement ${input.auditType} security patches within 7 days`,
        'Optimize critical page load times to under 3 seconds',
        'Enhance mobile experience with responsive design updates'
      ],
      metrics: [
        'Page speed score improvement from 65 to 90+',
        'SEO ranking improvement for key terms',
        'User engagement increase by 25%'
      ]
    },
    action: [
      'Prioritize critical security and performance fixes',
      'Schedule SEO and mobile experience improvements',
      'Monitor key metrics with weekly reporting'
    ],
    timeline: [
      'Week 1: Address all critical findings',
      'Week 2-3: Implement high priority improvements',
      'Week 4: Handle medium priority items and measure results'
    ],
    resources: [
      'Development team allocation for security updates',
      'Design resources for mobile responsive improvements',
      'Testing tools for ongoing performance monitoring'
    ]
  };
}

// Export singleton instance
export const siteAuditMCP = {
  generate: generateSiteAudit,
  version: '6.1.4',
  trustScoreThreshold: 4.2,
  eventBus,
  utils: {
    applyMCPEnhancers,
    hasMCPEnhancements,
    calculateTrustScore,
    inferProblemFromGoals,
    inferContentFromSite,
    inferDifferentiatorFromFocus,
    inferFounderFromAudit
  }
}; 