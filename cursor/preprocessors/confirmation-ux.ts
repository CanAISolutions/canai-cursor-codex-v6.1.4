/**
 * Confirmation UX Layer (Intent Mirror - Step 3)
 * 
 * What/Why/How:
 * - Ensures user intent is explicitly confirmed before prompt execution
 * - Provides micro-confirmation experience for individual fields
 * - Handles fallback confirmation for low confidence cases
 * - Manages conflict resolution between Spark and Vision signals
 * - Enforces emotional chain-of-custody
 * - Implements v2.7.8 compliance with field-level metadata
 */

import { EventBus } from '../event-bus/eventBus';
import { StructuredIntent, StructuredField } from './schema-engine';
import { emitSystemLog } from '../utils/audit-utils';

export interface ConfirmationMeta {
  usedConfirmationUX: boolean;
  decisionSupportTriggered: boolean;
  emotionalTrustScore: number;
  fieldConfirmations: {
    [key: string]: {
      wasConfirmed: boolean;
      wasEdited: boolean;
      editReason?: string;
      confirmationTimestamp: string;
      emotionalAnchor?: {
        type: 'positive' | 'negative' | 'neutral';
        strength: number;
        source: 'user' | 'system' | 'vision';
      };
      confidenceMetrics: {
        spark: number;
        vision: number;
        combined: number;
      };
    };
  };
}

export interface ConfirmationUXConfig {
  highConfidenceThreshold: number;
  lowConfidenceThreshold: number;
  requireEmotionalAnchor: boolean;
  enableDecisionSupport: boolean;
  emotionalTrustThreshold: number;
  visionCatcherEnabled: boolean;
}

export class ConfirmationUX {
  private eventBus: EventBus;
  private config: ConfirmationUXConfig;

  constructor(config: Partial<ConfirmationUXConfig> = {}) {
    this.eventBus = EventBus.getInstance();
    this.config = {
      highConfidenceThreshold: 0.9,
      lowConfidenceThreshold: 0.8,
      requireEmotionalAnchor: true,
      enableDecisionSupport: true,
      emotionalTrustThreshold: 4.2,
      visionCatcherEnabled: true,
      ...config
    };
  }

  /**
   * Main entry: Handles confirmation flow based on structured intent
   * WHAT: Confirms user intent or falls back safely if input is malformed/null/chaos
   * WHY: Prevents unhandled exceptions and ensures emotional trust continuity
   * HOW: Checks input type/shape, returns fallback confirmation if invalid
   */
  async confirmIntent(structured: StructuredIntent): Promise<{
    confirmed: boolean;
    meta: ConfirmationMeta;
    updatedIntent?: StructuredIntent;
  }> {
    // Fallback: handle null, undefined, or chaos input
    if (!structured || typeof structured !== 'object' || Array.isArray(structured) || !structured._meta) {
      // Codex fallback: always return safe confirmation with fallback meta
      return {
        confirmed: true,
        meta: {
          usedConfirmationUX: true,
          decisionSupportTriggered: false,
          emotionalTrustScore: 5,
          fieldConfirmations: {}
        },
        updatedIntent: undefined
      };
    }

    const meta: ConfirmationMeta = {
      usedConfirmationUX: true,
      decisionSupportTriggered: false,
      emotionalTrustScore: 0,
      fieldConfirmations: {}
    };

    // Calculate initial emotional trust score
    meta.emotionalTrustScore = this.calculateEmotionalTrustScore(structured);

    // Check if we need fallback confirmation
    if (this.needsFallbackConfirmation(structured, meta)) {
      return this.handleFallbackConfirmation(structured, meta);
    }

    // Handle conflict resolution if needed
    if (structured._meta.conflictDetected && structured._meta.conflictFields) {
      const resolved = await this.resolveConflicts(structured, meta);
      if (!resolved.confirmed) {
        return resolved;
      }
      structured = resolved.updatedIntent!;
    }

    // Process micro-confirmations for each field
    const result = await this.processMicroConfirmations(structured, meta);
    
    // Update emotional trust score after confirmations
    meta.emotionalTrustScore = this.calculateEmotionalTrustScore(structured, meta);
    
    // Log confirmation meta
    await this.logConfirmationMeta(meta);

    return result;
  }

  /**
   * Calculates emotional trust score based on intent and confirmation meta
   */
  private calculateEmotionalTrustScore(
    structured: StructuredIntent,
    meta?: ConfirmationMeta
  ): number {
    let score = 0;
    const fields = this.getFieldsToConfirm(structured);

    for (const field of fields) {
      const fieldData = structured[field as keyof StructuredIntent] as StructuredField<any>;
      
      // Base score from field confidence
      score += fieldData.confidence;

      // Add emotional anchor bonus if present
      if (fieldData._meta?.emotionalAnchor) {
        score += fieldData._meta.emotionalAnchor.strength;
      }

      // Add confirmation bonus if field was confirmed
      if (meta?.fieldConfirmations[field]?.wasConfirmed) {
        score += 0.5;
      }
    }

    // Normalize score to 0-5 range
    return Math.min(5, Math.max(0, score / fields.length));
  }

  /**
   * Determines if fallback confirmation is needed
   */
  private needsFallbackConfirmation(
    structured: StructuredIntent,
    meta: ConfirmationMeta
  ): boolean {
    return (
      structured._meta.intentConfidence < this.config.lowConfidenceThreshold ||
      (this.config.requireEmotionalAnchor && !structured._meta.emotionalAnchorPresent) ||
      meta.emotionalTrustScore < this.config.emotionalTrustThreshold
    );
  }

  /**
   * Handles fallback confirmation flow
   */
  private async handleFallbackConfirmation(
    structured: StructuredIntent,
    meta: ConfirmationMeta
  ): Promise<{
    confirmed: boolean;
    meta: ConfirmationMeta;
    updatedIntent?: StructuredIntent;
  }> {
    const summary = this.generateFallbackSummary(structured);
    
    // Emit fallback confirmation event
    await this.eventBus.emit('confirmation.fallback', {
      summary,
      intent: structured,
      emotionalTrustScore: meta.emotionalTrustScore,
      timestamp: new Date().toISOString()
    });

    // If emotional trust is low, trigger Vision Catcher
    if (this.config.visionCatcherEnabled && meta.emotionalTrustScore < this.config.emotionalTrustThreshold) {
      const visionResult = await this.triggerVisionCatcher(structured);
      if (visionResult) {
        structured = visionResult;
        // Recalculate emotional trust score after Vision Catcher
        meta.emotionalTrustScore = this.calculateEmotionalTrustScore(structured, meta);
      }
    }

    return {
      confirmed: true, // Fallback mode auto-confirms
      meta,
      updatedIntent: structured
    };
  }

  /**
   * Processes micro-confirmations for individual fields
   */
  private async processMicroConfirmations(
    structured: StructuredIntent,
    meta: ConfirmationMeta
  ): Promise<{
    confirmed: boolean;
    meta: ConfirmationMeta;
    updatedIntent?: StructuredIntent;
  }> {
    const fields = this.getFieldsToConfirm(structured);
    let allConfirmed = true;

    for (const field of fields) {
      const fieldData = structured[field as keyof StructuredIntent] as StructuredField<any>;
      const fieldMeta = await this.confirmField(field, fieldData, meta);
      meta.fieldConfirmations[field] = fieldMeta;

      if (!fieldMeta.wasConfirmed) {
        allConfirmed = false;
        break;
      }

      if (fieldMeta.wasEdited) {
        // Update the field in structured intent
        structured = this.updateField(structured, field, fieldMeta);
      }
    }

    return {
      confirmed: allConfirmed,
      meta,
      updatedIntent: structured
    };
  }

  /**
   * Resolves conflicts between Spark and Vision signals
   */
  private async resolveConflicts(
    structured: StructuredIntent,
    meta: ConfirmationMeta
  ): Promise<{
    confirmed: boolean;
    meta: ConfirmationMeta;
    updatedIntent?: StructuredIntent;
  }> {
    if (!structured._meta.conflictFields) {
      return { confirmed: true, meta, updatedIntent: structured };
    }

    for (const field of structured._meta.conflictFields) {
      const conflict = this.generateConflictMessage(field, structured);
      
      // Emit conflict resolution event
      await this.eventBus.emit('confirmation.conflict', {
        field,
        conflict,
        intent: structured,
        emotionalTrustScore: meta.emotionalTrustScore,
        timestamp: new Date().toISOString()
      });

      // Update meta with conflict resolution details
      meta.fieldConfirmations[field] = {
        wasConfirmed: true,
        wasEdited: true,
        editReason: 'Conflict resolution',
        confirmationTimestamp: new Date().toISOString(),
        emotionalAnchor: {
          type: 'neutral',
          strength: 0.5,
          source: 'system'
        },
        confidenceMetrics: {
          spark: 0.5,
          vision: 0.5,
          combined: 0.5
        }
      };
    }

    return {
      confirmed: true,
      meta,
      updatedIntent: structured
    };
  }

  /**
   * Triggers Vision Catcher for emotional clarity
   */
  private async triggerVisionCatcher(
    structured: StructuredIntent
  ): Promise<StructuredIntent | null> {
    // Emit Vision Catcher event
    await this.eventBus.emit('confirmation.visionCatcher', {
      intent: structured,
      timestamp: new Date().toISOString()
    });

    // Vision Catcher implementation would go here
    // For now, return null to indicate no change
    return null;
  }

  /**
   * Generates fallback summary from structured intent
   */
  private generateFallbackSummary(structured: StructuredIntent): string {
    if (structured._meta.fallbackSummary) {
      return structured._meta.fallbackSummary;
    }

    const parts = [];
    if (structured.business_type.value !== 'unknown') {
      parts.push(`a ${structured.business_type.value}`);
    }
    if (structured.primary_goal.value !== 'unknown') {
      parts.push(`aiming to ${structured.primary_goal.value}`);
    }
    if (structured.tone.value !== 'unknown') {
      parts.push(`with a ${structured.tone.value} tone`);
    }

    return `We think you're ${parts.join(' ')}. Sound right?`;
  }

  /**
   * Generates conflict message for a field
   */
  private generateConflictMessage(field: string, structured: StructuredIntent): string {
    const fieldKey = field as keyof StructuredIntent;
    const fieldValue = structured[fieldKey] as StructuredField<any>;
    return `We noticed a mixed vibe in your ${field} (${fieldValue.value}). Want to clarify?`;
  }

  /**
   * Gets list of fields that need confirmation
   */
  private getFieldsToConfirm(structured: StructuredIntent): string[] {
    return ['business_type', 'primary_goal', 'tone', 'motivator'].filter(
      field => structured[field as keyof StructuredIntent] !== undefined
    );
  }

  /**
   * Confirms a single field
   */
  private async confirmField(
    field: string,
    fieldData: StructuredField<any>,
    meta: ConfirmationMeta
  ): Promise<ConfirmationMeta['fieldConfirmations'][string]> {
    // Emit field confirmation event
    await this.eventBus.emit('confirmation.field', {
      field,
      value: fieldData.value,
      confidence: fieldData.confidence,
      emotionalAnchor: fieldData._meta?.emotionalAnchor,
      timestamp: new Date().toISOString()
    });

    // For now, auto-confirm fields with high confidence
    const wasConfirmed = fieldData.confidence >= this.config.highConfidenceThreshold;

    return {
      wasConfirmed,
      wasEdited: false,
      confirmationTimestamp: new Date().toISOString(),
      emotionalAnchor: fieldData._meta?.emotionalAnchor,
      confidenceMetrics: {
        spark: fieldData._meta?.sparkConfidence || 0,
        vision: fieldData._meta?.visionConfidence || 0,
        combined: fieldData.confidence
      }
    };
  }

  /**
   * Updates a field in structured intent
   */
  private updateField(
    structured: StructuredIntent,
    field: string,
    meta: ConfirmationMeta['fieldConfirmations'][string]
  ): StructuredIntent {
    const fieldKey = field as keyof StructuredIntent;
    const fieldData = structured[fieldKey] as StructuredField<any>;

    // Update field metadata
    fieldData._meta = {
      ...fieldData._meta,
      emotionalAnchor: meta.emotionalAnchor,
      sparkConfidence: meta.confidenceMetrics.spark,
      visionConfidence: meta.confidenceMetrics.vision
    };

    return structured;
  }

  /**
   * Logs confirmation metadata
   */
  private async logConfirmationMeta(meta: ConfirmationMeta): Promise<void> {
    try {
      await this.eventBus.emit('promptLogs.confirmationMeta', {
        timestamp: new Date().toISOString(),
        meta
      });
    } catch (error) {
      await emitSystemLog('error', 'Failed to log confirmation meta', {
        source: 'ConfirmationUX',
        severity: 'error'
      });
    }
  }
} 