/**
 * @file gpt-templates/clarity-schema.ts
 * @description Core schema for Clarity Engine v6.2.1
 * @version 6.2.1
 * @emotionalResonance true
 * @dreamStateAlignment true
 */

import { EmotionalResonanceValidator } from '../cursor/emotional-ux/validator';
import { DreamStateAligner } from '../cursor/dream-state/aligner';
import { TrustScoreCalculator } from '../cursor/validators/trust-score';
import { MemoryFidelityTracker } from '../cursor/memory/fidelity-tracker';

export interface ClaritySchema {
  // Foundation Pillar
  promptType: string;
  tone: {
    primary: string;
    secondary?: string;
    driftThreshold: number;
  };
  fallback: {
    strategy: string;
    maxRetries: number;
    recoveryPath: string;
  };
  smartDefaults: {
    industry: string;
    persona: string;
    context: Record<string, any>;
  };
  author: {
    name: string;
    role: string;
    version: string;
  };
  impact_hypothesis: {
    expectedOutcome: string;
    successMetrics: string[];
    riskFactors: string[];
  };
  moral_hypothesis: {
    ethicalConsiderations: string[];
    culturalAlignment: string[];
    privacyImplications: string[];
  };

  // Intelligence Pillar
  emotional_metrics: {
    tone_drift: number;
    memory_fidelity: number;
    trust_delta: number;
    empathy_drift: number;
    fallback_coverage: number;
    emotional_joules: number;
  };

  // Transformation Pillar
  coaching: {
    clarity: {
      guidance: string[];
      examples: string[];
    };
    context: {
      personaDefaults: Record<string, any>;
      industryDefaults: Record<string, any>;
    };
    confidence: {
      fallbackPhrasing: string[];
      weakInputHandling: string[];
    };
  };

  // Story Arc Model
  storyArc: {
    hook: string;
    build: string[];
    close: string;
    tagline: string;
  };
}

export class ClarityEngine {
  private emotionalValidator: EmotionalResonanceValidator;
  private dreamStateAligner: DreamStateAligner;
  private trustCalculator: TrustScoreCalculator;
  private memoryTracker: MemoryFidelityTracker;

  constructor() {
    this.emotionalValidator = new EmotionalResonanceValidator();
    this.dreamStateAligner = new DreamStateAligner();
    this.trustCalculator = new TrustScoreCalculator();
    this.memoryTracker = new MemoryFidelityTracker();
  }

  async validateSchema(schema: ClaritySchema): Promise<ValidationResult> {
    const results = await Promise.all([
      this.validateFoundation(schema),
      this.validateIntelligence(schema),
      this.validateTransformation(schema),
      this.validateStoryArc(schema)
    ]);

    return this.aggregateResults(results);
  }

  private async validateFoundation(schema: ClaritySchema): Promise<ValidationResult> {
    const requiredFields = [
      'promptType',
      'tone',
      'fallback',
      'smartDefaults',
      'author',
      'impact_hypothesis',
      'moral_hypothesis'
    ];

    const missingFields = requiredFields.filter(field => !schema[field]);
    
    return {
      isValid: missingFields.length === 0,
      missingFields,
      severity: missingFields.length > 0 ? 'Critical' : 'Pass',
      message: missingFields.length > 0 
        ? `Missing required foundation fields: ${missingFields.join(', ')}`
        : 'Foundation validation passed'
    };
  }

  private async validateIntelligence(schema: ClaritySchema): Promise<ValidationResult> {
    const metrics = schema.emotional_metrics;
    const thresholds = {
      tone_drift: 10,
      memory_fidelity: 90,
      trust_delta: 95,
      empathy_drift: 5,
      fallback_coverage: 95
    };

    const violations = Object.entries(thresholds).filter(([key, threshold]) => {
      const value = metrics[key];
      return key.includes('drift') 
        ? Math.abs(value) > threshold
        : value < threshold;
    });

    return {
      isValid: violations.length === 0,
      violations: violations.map(([key]) => key),
      severity: violations.length > 0 ? 'High-Impact' : 'Pass',
      message: violations.length > 0
        ? `Intelligence metrics below threshold: ${violations.map(([key]) => key).join(', ')}`
        : 'Intelligence validation passed'
    };
  }

  private async validateTransformation(schema: ClaritySchema): Promise<ValidationResult> {
    const { clarity, context, confidence } = schema.coaching;
    
    const validation = {
      clarity: clarity.guidance.length > 0 && clarity.examples.length > 0,
      context: Object.keys(context.personaDefaults).length > 0 && 
               Object.keys(context.industryDefaults).length > 0,
      confidence: confidence.fallbackPhrasing.length > 0 && 
                 confidence.weakInputHandling.length > 0
    };

    const missing = Object.entries(validation)
      .filter(([, valid]) => !valid)
      .map(([key]) => key);

    return {
      isValid: missing.length === 0,
      missingElements: missing,
      severity: missing.length > 0 ? 'High-Impact' : 'Pass',
      message: missing.length > 0
        ? `Missing transformation elements: ${missing.join(', ')}`
        : 'Transformation validation passed'
    };
  }

  private async validateStoryArc(schema: ClaritySchema): Promise<ValidationResult> {
    const { hook, build, close, tagline } = schema.storyArc;
    
    const validation = {
      hook: typeof hook === 'string' && hook.length > 0,
      build: Array.isArray(build) && build.length > 0,
      close: typeof close === 'string' && close.length > 0,
      tagline: typeof tagline === 'string' && tagline.length > 0
    };

    const missing = Object.entries(validation)
      .filter(([, valid]) => !valid)
      .map(([key]) => key);

    return {
      isValid: missing.length === 0,
      missingElements: missing,
      severity: missing.length > 0 ? 'High-Impact' : 'Pass',
      message: missing.length > 0
        ? `Missing story arc elements: ${missing.join(', ')}`
        : 'Story arc validation passed'
    };
  }

  private aggregateResults(results: ValidationResult[]): ValidationResult {
    const critical = results.filter(r => r.severity === 'Critical');
    const highImpact = results.filter(r => r.severity === 'High-Impact');
    
    return {
      isValid: critical.length === 0,
      severity: critical.length > 0 ? 'Critical' : highImpact.length > 0 ? 'High-Impact' : 'Pass',
      details: results,
      message: critical.length > 0
        ? `Critical validation failures: ${critical.map(r => r.message).join('; ')}`
        : highImpact.length > 0
        ? `High-impact validation issues: ${highImpact.map(r => r.message).join('; ')}`
        : 'All validations passed'
    };
  }
}

interface ValidationResult {
  isValid: boolean;
  severity: 'Critical' | 'High-Impact' | 'Pass';
  message: string;
  missingFields?: string[];
  violations?: string[];
  missingElements?: string[];
  details?: ValidationResult[];
} 