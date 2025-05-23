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

import { validateInput } from '../cursor/agents/input-validator';
import { scorePrompt } from '../cursor/agents/qa-scorer';
import { validateEmpathy } from '../cursor/agents/empathy-validator';
import { routeFailure } from '../cursor/self-healing/fallbackRouter';
import { logValidationStatus, logScoreBreakdown, logEmpathyMetrics } from '../cursor/logs/prompt-logs';

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
    const validationResult = await validateInput(enhancedInput, validationSchema);
    session.validationStatus = {
      isValid: validationResult.isValid,
      issues: [
        ...validationResult.missingFields,
        ...validationResult.invalidFields
      ]
    };

    if (!validationResult.isValid) {
      await routeFailure({
        type: 'validation',
        severity: 2,
        details: { input: enhancedInput, validationResult },
        timestamp: session.metadata.timestamp
      });
      return session;
    }

    // 2. Generate site audit (placeholder)
    const output: SiteAuditOutput = {
      audit: {
        overview: 'Comprehensive site analysis and recommendations',
        findings: {
          critical: [
            'Security vulnerabilities',
            'Performance bottlenecks'
          ],
          high: [
            'SEO optimization needed',
            'Mobile responsiveness issues'
          ],
          medium: [
            'Content gaps',
            'Navigation improvements'
          ],
          low: [
            'Minor UI tweaks',
            'Documentation updates'
          ]
        },
        recommendations: [
          'Implement security patches',
          'Optimize page load times',
          'Enhance mobile experience'
        ],
        metrics: [
          'Page speed score',
          'SEO ranking',
          'User engagement'
        ]
      },
      action: [
        'Prioritize critical fixes',
        'Schedule improvements',
        'Monitor metrics'
      ],
      timeline: [
        'Week 1: Critical fixes',
        'Week 2-3: High priority',
        'Week 4: Medium priority'
      ],
      resources: [
        'Development team',
        'Design resources',
        'Testing tools'
      ]
    };
    session.output = output;

    // 3. Score output
    const scoringResult = await scorePrompt(output, {
      promptType: 'site_audit',
      requiredFields: ['audit', 'action', 'timeline', 'resources'],
      validTones: validationSchema.validTones,
      minScore: 0.75
    });

    session.score = {
      overall: scoringResult.score,
      breakdown: scoringResult.scoreBreakdown
    };

    if (!scoringResult.isValid) {
      await routeFailure({
        type: 'scoring',
        severity: 1,
        details: { output, scoringResult },
        timestamp: session.metadata.timestamp
      });
      return session;
    }

    // 4. Validate empathy
    const empathyResult = await validateEmpathy(output, {
      targetTone: enhancedInput.tone,
      emotionalDepth: 0.7
    });

    session.empathyMetrics = empathyResult.metrics;

    if (!empathyResult.isValid) {
      await routeFailure({
        type: 'empathy',
        severity: 1,
        details: { output, empathyResult },
        timestamp: session.metadata.timestamp
      });
      return session;
    }

    // 5. Calculate trust score
    session.metadata.trustScore = (
      scoringResult.score * 0.6 +
      empathyResult.metrics.overall * 0.4
    );

    // 6. Log results
    await logValidationStatus(session.metadata.timestamp, {
      isValid: session.validationStatus.isValid,
      issues: session.validationStatus.issues,
      timestamp: session.metadata.timestamp
    });

    if (session.score) {
      await logScoreBreakdown({
        promptType: 'site_audit',
        scoreBreakdown: session.score.breakdown,
        feedback: scoringResult.feedback,
        timestamp: session.metadata.timestamp
      });
    }

    if (session.empathyMetrics) {
      await logEmpathyMetrics({
        metrics: session.empathyMetrics,
        feedback: empathyResult.feedback,
        timestamp: session.metadata.timestamp
      });
    }

    return session;
  } catch (error) {
    await routeFailure({
      type: 'system',
      severity: 3,
      details: { error, input: enhancedInput },
      timestamp: session.metadata.timestamp
    });
    throw error;
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

// Export singleton instance
export const siteAuditMCP = {
  generate: generateSiteAudit,
  version: '6.1.4',
  trustScoreThreshold: 4.2
}; 