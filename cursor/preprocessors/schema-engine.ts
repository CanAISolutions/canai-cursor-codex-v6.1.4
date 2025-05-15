/**
 * Schema Engine (Intent Mirror Layer - Step 2)
 *
 * Accepts raw interpreted intent and returns a typed, structured intent object
 * with field-level metadata, dynamic field injection, and validation.
 * Output is ready for PromptLogs.enrichedInput and Smart Defaults.
 *
 * What/Why/How:
 * - Ensures predictable, clean structure for downstream prompt flows
 * - Dynamically adapts to user context (injects KPI, target_audience, etc.)
 * - Validates and annotates each field with confidence, source, and overrideability
 * - Lays groundwork for override tracking, friction alerts, and intent reuse
 */

import { EmotionalValidator } from '../validators/emotional-validator';
import { EventBus } from '../event-bus/eventBus';
import { emitSystemLog } from '../utils/audit-utils';
import { runtimeEnforceChecklistGuard } from '../runtime-hooks/enforce-checklist-guard';

// Field-level metadata for structured intent
export interface StructuredField<T> {
  value: T;
  confidence: number;
  source: 'rules' | 'tiny-llm' | 'fallback' | 'spark' | 'vision';
  overrideable: boolean;
  errorState: boolean;
  wasConfirmed: boolean;
  error?: string;
  _meta?: {
    emotionalAnchor?: {
      type: 'positive' | 'negative' | 'neutral';
      strength: number;
      source: 'user' | 'system' | 'vision';
    };
    sparkConfidence?: number;
    visionConfidence?: number;
  };
}

// Structured intent output type
export interface StructuredIntent {
  business_type: StructuredField<string>;
  primary_goal: StructuredField<string>;
  tone: StructuredField<string>;
  challenges: StructuredField<string[]>;
  motivator: StructuredField<string>;
  motivationHook?: StructuredField<string>;
  kpi?: StructuredField<string>;
  launch_timing?: StructuredField<string>;
  target_audience?: StructuredField<string>;
  founder_story?: StructuredField<string>;
  spark_feel_quote?: StructuredField<string>;
  vision_feel_quote?: StructuredField<string>;
  _meta: {
    allFields: string[];
    injectedFields: string[];
    validationPassed: boolean;
    errors: string[];
    usedSparkSignal?: boolean;
    usedVisionCatcher?: boolean;
    intentConfidence: number;
    fallbackSummary?: string;
    emotionalAnchorPresent: boolean;
    conflictDetected: boolean;
    conflictFields?: string[];
    hasMotivationHook: boolean;
  };
}

export class SchemaEngine {
  private emotionalValidator: EmotionalValidator;
  private eventBus: EventBus;
  private readonly toneWhitelist: Set<string>;
  private readonly KPI_REGEX = /^(?:increase|grow|achieve|reach|maintain)\s+\d+(?:%|x|\s+users|\s+customers|\s+revenue|\s+engagement)$/i;
  private readonly LAUNCH_TIMING_REGEX = /^(?:Q[1-4]|H[1-2])\s+\d{4}$/;

  constructor(emotionalValidator: EmotionalValidator) {
    this.emotionalValidator = emotionalValidator;
    this.eventBus = EventBus.getInstance();
    this.toneWhitelist = new Set([
      'playful', 'bold', 'calm', 'luxury', 'supportive', 'strategic',
      'inspiring', 'professional', 'friendly', 'authoritative'
    ]);
  }

  /**
   * Main entry: Accepts interpreted intent, optional sparkIntentRaw, and optional visionCatcher input.
   * Enforces emotional chain-of-custody and field-level metadata requirements.
   */
  async structureIntent(
    interpreted: {
      businessType: string;
      primaryGoal: string;
      tone: string;
      challenges: string[];
      motivator: string;
      confidence: number;
      modelTier: 'rules' | 'tiny-llm' | 'fallback';
      [key: string]: any;
    },
    opts?: {
      sparkIntentRaw?: string;
      visionCatcherInput?: string;
    }
  ): Promise<StructuredIntent> {
    // --- Codex Enforcement Guard (Schema Mutation Entry) ---
    // This will eventually be mounted at the entry of all schema mutation flows (/flows/schema/),
    // blocking any mutation if enforcement is not complete. Activation requires schema intelligence,
    // session anchoring, and Codex contract registry lock.
    const enforcementResult = await runtimeEnforceChecklistGuard({
      flow: 'schema',
      extra: { interpreted, opts }
    });
    if (enforcementResult.status === 'blocked') {
      // Log Codex intent and halt mutation
      throw new Error(
        `[Codex Enforcement] Schema mutation blocked: ${enforcementResult.fallbackMessage}`
      );
    }

    const errors: string[] = [];
    const injectedFields: string[] = [];
    const allFields: string[] = [
      'business_type', 'primary_goal', 'tone', 'challenges', 'motivator'
    ];
    let usedSparkSignal = false;
    let usedVisionCatcher = false;
    let fallbackSummary = '';
    let emotionalAnchorPresent = false;
    let conflictDetected = false;
    let conflictFields: string[] = [];

    // --- Spark Signal Injection (2.7-A) ---
    let sparkTone: string | undefined;
    let sparkMotivator: string | undefined;
    if (opts?.sparkIntentRaw) {
      // Use Spark only if structured field is missing/ambiguous
      if (!interpreted.tone || interpreted.tone === 'unknown') {
        sparkTone = this.extractToneFromSpark(opts.sparkIntentRaw);
        if (sparkTone) {
          usedSparkSignal = true;
          emotionalAnchorPresent = true;
        }
      }
      if (!interpreted.motivator || interpreted.motivator === 'unknown') {
        sparkMotivator = this.extractMotivatorFromSpark(opts.sparkIntentRaw);
        if (sparkMotivator) {
          usedSparkSignal = true;
          emotionalAnchorPresent = true;
        }
      }
    }

    // --- Vision Catcher (2.7-B) ---
    let spark_feel_quote: StructuredField<string> | undefined;
    let vision_feel_quote: StructuredField<string> | undefined;
    const intentConfidence = interpreted.confidence;
    const needsVisionCatcher =
      intentConfidence < 0.8 ||
      !interpreted.primaryGoal || interpreted.primaryGoal === 'unknown' ||
      !interpreted.tone || interpreted.tone === 'unknown' ||
      !interpreted.motivator || interpreted.motivator === 'unknown';
    
    if (needsVisionCatcher && opts?.visionCatcherInput) {
      spark_feel_quote = this.wrapField(
        opts.visionCatcherInput,
        1.0,
        'vision',
        false,
        false,
        true,
        !!opts.visionCatcherInput && opts.visionCatcherInput.trim().length > 0
      );
      vision_feel_quote = this.wrapField(
        opts.visionCatcherInput,
        1.0,
        'vision',
        false,
        false,
        true,
        !!opts.visionCatcherInput && opts.visionCatcherInput.trim().length > 0
      );
      usedVisionCatcher = true;
      emotionalAnchorPresent = true;
      injectedFields.push('spark_feel_quote');
      injectedFields.push('vision_feel_quote');
      allFields.push('spark_feel_quote');
      allFields.push('vision_feel_quote');
    }

    // --- Conflict Detection ---
    if (sparkTone && interpreted.tone !== 'unknown' && sparkTone !== interpreted.tone) {
      conflictDetected = true;
      conflictFields.push('tone');
    }
    if (sparkMotivator && interpreted.motivator !== 'unknown' && sparkMotivator !== interpreted.motivator) {
      conflictDetected = true;
      conflictFields.push('motivator');
    }

    // Core fields (use spark/vision fallback if needed)
    const business_type = this.wrapField(
      interpreted.businessType,
      interpreted.confidence,
      interpreted.modelTier,
      true,
      false,
      false,
      this.validateNonEmpty(interpreted.businessType, 'business_type', errors)
    );

    const primary_goal = this.wrapField(
      interpreted.primaryGoal,
      interpreted.confidence,
      interpreted.modelTier,
      true,
      false,
      false,
      this.validateNonEmpty(interpreted.primaryGoal, 'primary_goal', errors)
    );

    const toneValue: string = interpreted.tone !== 'unknown' ? interpreted.tone : (sparkTone || (vision_feel_quote ? '' : 'unknown'));
    const motivatorValue: string = interpreted.motivator !== 'unknown' ? interpreted.motivator : (sparkMotivator || (vision_feel_quote ? '' : 'unknown'));

    const tone = this.wrapField(
      toneValue !== undefined && toneValue !== '' ? toneValue : 'unknown',
      interpreted.confidence,
      interpreted.modelTier,
      true,
      false,
      false,
      this.validateTone(
        toneValue !== undefined && toneValue !== '' ? toneValue : 'unknown',
        errors
      )
    );

    const challenges = this.wrapField(
      interpreted.challenges,
      interpreted.confidence,
      interpreted.modelTier,
      true,
      false,
      false,
      Array.isArray(interpreted.challenges) && interpreted.challenges.length > 0
    );

    const motivator = this.wrapField(
      motivatorValue !== undefined && motivatorValue !== '' ? motivatorValue : 'unknown',
      interpreted.confidence,
      interpreted.modelTier,
      true,
      false,
      false,
      this.validateNonEmpty(motivatorValue, 'motivator', errors)
    );

    // --- Motivation Hook Extraction ---
    let motivationHook: StructuredField<string> | undefined;
    if (sparkMotivator || vision_feel_quote?.value) {
      const hookValue = this.extractMotivationHook(sparkMotivator, vision_feel_quote?.value);
      if (hookValue) {
        motivationHook = this.wrapField(
          hookValue,
          0.9,
          sparkMotivator ? 'spark' : 'vision',
          false,
          false,
          false,
          true
        );
        injectedFields.push('motivationHook');
        allFields.push('motivationHook');
      }
    }

    // --- Conditional Fields ---
    let kpi: StructuredField<string> | undefined;
    let launch_timing: StructuredField<string> | undefined;
    let target_audience: StructuredField<string> | undefined;
    let founder_story: StructuredField<string> | undefined;

    const detectedKPI = this.detectKPI(interpreted);
    if (detectedKPI) {
      kpi = this.wrapField(
        detectedKPI,
        interpreted.confidence,
        interpreted.modelTier,
        true,
        false,
        false,
        this.validateKPI(detectedKPI, errors)
      );
      injectedFields.push('kpi');
      allFields.push('kpi');
    }

    const detectedLaunchTiming = this.detectLaunchTiming(interpreted);
    if (detectedLaunchTiming) {
      launch_timing = this.wrapField(
        detectedLaunchTiming,
        interpreted.confidence,
        interpreted.modelTier,
        true,
        false,
        false,
        this.validateLaunchTiming(detectedLaunchTiming, errors)
      );
      injectedFields.push('launch_timing');
      allFields.push('launch_timing');
    }

    if (interpreted.targetAudience) {
      target_audience = this.wrapField(
        interpreted.targetAudience,
        interpreted.confidence,
        interpreted.modelTier,
        true,
        false,
        false,
        this.validateNonEmpty(interpreted.targetAudience, 'target_audience', errors)
      );
      injectedFields.push('target_audience');
      allFields.push('target_audience');
    }

    if (interpreted.founderStory) {
      founder_story = this.wrapField(
        interpreted.founderStory,
        interpreted.confidence,
        interpreted.modelTier,
        true,
        false,
        false,
        this.validateNonEmpty(interpreted.founderStory, 'founder_story', errors)
      );
      injectedFields.push('founder_story');
      allFields.push('founder_story');
    }

    // --- Fallback summary phrasing ---
    fallbackSummary = this.generateFallbackSummary({
      businessType: interpreted.businessType,
      primaryGoal: interpreted.primaryGoal,
      tone: interpreted.tone !== 'unknown' ? interpreted.tone : sparkTone,
      motivator: interpreted.motivator !== 'unknown' ? interpreted.motivator : sparkMotivator,
      visionFeel: vision_feel_quote?.value
    });

    // Compose output
    const structured: StructuredIntent = {
      business_type,
      primary_goal,
      tone,
      challenges,
      motivator,
      ...(kpi ? { kpi } : {}),
      ...(launch_timing ? { launch_timing } : {}),
      ...(target_audience ? { target_audience } : {}),
      ...(founder_story ? { founder_story } : {}),
      ...(spark_feel_quote ? { spark_feel_quote } : {}),
      ...(vision_feel_quote ? { vision_feel_quote } : {}),
      ...(motivationHook ? { motivationHook } : {}),
      _meta: {
        allFields,
        injectedFields,
        validationPassed: errors.length === 0,
        errors,
        usedSparkSignal,
        usedVisionCatcher,
        intentConfidence,
        fallbackSummary,
        emotionalAnchorPresent,
        conflictDetected,
        ...(conflictFields.length > 0 ? { conflictFields } : {}),
        hasMotivationHook: !!motivationHook
      }
    };

    // Log to PromptLogs.enrichedInput
    await this.logToPromptLogs(structured);

    return structured;
  }

  /**
   * Helper: Wraps a value in field metadata
   */
  private wrapField<T>(
    value: T,
    confidence: number,
    source: 'rules' | 'tiny-llm' | 'fallback' | 'spark' | 'vision',
    overrideable: boolean,
    errorState: boolean,
    wasConfirmed: boolean,
    valid: boolean,
    error?: string
  ): StructuredField<T> {
    return {
      value,
      confidence,
      source,
      overrideable,
      errorState,
      wasConfirmed,
      ...(error ? { error } : {})
    };
  }

  /**
   * Extracts motivation hook from Spark or Vision signals
   */
  private extractMotivationHook(
    sparkMotivator?: string,
    visionFeel?: string
  ): string | undefined {
    if (sparkMotivator) {
      // Extract hook from Spark motivator
      const hookMatch = sparkMotivator.match(/break free from|finally|ready to|want to|need to/i);
      if (hookMatch) {
        return sparkMotivator;
      }
    }
    if (visionFeel) {
      // Extract hook from Vision feel quote
      const hookMatch = visionFeel.match(/feel|want to feel|need to feel|ready to/i);
      if (hookMatch) {
        return visionFeel;
      }
    }
    return undefined;
  }

  /**
   * Logs structured intent to PromptLogs.enrichedInput
   */
  private async logToPromptLogs(structured: StructuredIntent): Promise<void> {
    try {
      await this.eventBus.emit('promptLogs.enrichedInput', {
        timestamp: new Date().toISOString(),
        structuredIntent: structured,
        metadata: {
          version: 'v2.7.8',
          emotionalAnchorPresent: structured._meta.emotionalAnchorPresent,
          conflictDetected: structured._meta.conflictDetected,
          validationPassed: structured._meta.validationPassed
        }
      });
    } catch (error) {
      await emitSystemLog('error', 'Failed to log to PromptLogs.enrichedInput', { 
        source: 'SchemaEngine',
        severity: 'error'
      });
    }
  }

  /**
   * Field Validators
   */
  private validateNonEmpty(value: any, field: string, errors: string[]): boolean {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors.push(`${field} is required.`);
      return false;
    }
    return true;
  }

  private validateTone(tone: string, errors: string[]): boolean {
    if (!this.toneWhitelist.has(tone.toLowerCase())) {
      errors.push(`Tone '${tone}' is not in the allowed whitelist.`);
      return false;
    }
    return true;
  }

  private validateKPI(kpi: string, errors: string[]): boolean {
    if (!this.KPI_REGEX.test(kpi)) {
      errors.push(`KPI '${kpi}' does not match required format.`);
      return false;
    }
    return true;
  }

  private validateLaunchTiming(launch: string, errors: string[]): boolean {
    if (!this.LAUNCH_TIMING_REGEX.test(launch)) {
      errors.push(`Launch timing '${launch}' does not match required format.`);
      return false;
    }
    return true;
  }

  /**
   * Dynamic Field Detection
   */
  private detectKPI(interpreted: any): string | undefined {
    // Search for KPI pattern in motivator, challenges, or extra fields
    const fields = [interpreted.motivator, ...(interpreted.challenges || []), interpreted.kpi];
    for (const field of fields) {
      if (typeof field === 'string' && this.KPI_REGEX.test(field)) {
        return field.match(this.KPI_REGEX)?.[0];
      }
    }
    return undefined;
  }

  private detectLaunchTiming(interpreted: any): string | undefined {
    // Search for launch timing pattern in motivator or extra fields
    const fields = [interpreted.motivator, interpreted.launchTiming];
    for (const field of fields) {
      if (typeof field === 'string' && this.LAUNCH_TIMING_REGEX.test(field)) {
        return field.match(this.LAUNCH_TIMING_REGEX)?.[0];
      }
    }
    return undefined;
  }

  // --- Spark extraction helpers ---
  private extractToneFromSpark(spark: string): string | undefined {
    // Simple heuristic: look for tone words in spark
    const tones = Array.from(this.toneWhitelist);
    for (const t of tones) {
      if (spark.toLowerCase().includes(t)) return t;
    }
    return undefined;
  }
  private extractMotivatorFromSpark(spark: string): string | undefined {
    // Heuristic: look for "because", "so I can", "to achieve", etc.
    const motivatorPatterns = [/because (.+?)(\.|$)/i, /so I can (.+?)(\.|$)/i, /to (achieve|reach|become|feel) (.+?)(\.|$)/i];
    for (const pattern of motivatorPatterns) {
      const match = spark.match(pattern);
      if (match) return match[1] || match[2];
    }
    return undefined;
  }

  // --- Fallback summary phrasing ---
  private generateFallbackSummary(opts: {
    businessType?: string;
    primaryGoal?: string;
    tone?: string;
    motivator?: string;
    visionFeel?: string;
  }): string {
    // Use as much emotional context as possible
    if (opts.visionFeel) {
      return `You want to feel: "${opts.visionFeel}". Let's make that happen.`;
    }
    let summary = 'Intent: ';
    if (opts.businessType && opts.businessType !== 'unknown') summary += `${opts.businessType}, `;
    if (opts.primaryGoal && opts.primaryGoal !== 'unknown') summary += `goal: ${opts.primaryGoal}, `;
    if (opts.tone && opts.tone !== 'unknown') summary += `tone: ${opts.tone}, `;
    if (opts.motivator && opts.motivator !== 'unknown') summary += `motivator: ${opts.motivator}, `;
    summary = summary.replace(/, $/, '');
    if (summary === 'Intent:') summary = 'Intent: [unspecified]';
    return summary;
  }
} 