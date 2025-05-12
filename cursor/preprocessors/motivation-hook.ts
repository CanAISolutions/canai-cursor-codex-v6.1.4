/**
 * MotivationHook Engine (Intent Mirror - Enhancement A)
 * 
 * What/Why/How:
 * - Infers emotional clarity from Spark or Vision inputs
 * - Stores as motivationHook in StructuredIntent
 * - Never overrides confirmed fields
 * - Surfaces as UX preview element during confirmation
 */

import { EventBus } from '../event-bus/eventBus';
import { StructuredIntent, StructuredField } from './schema-engine';
import { emitSystemLog } from '../utils/audit-utils';

export interface MotivationHookConfig {
  minConfidence: number;
  requireEmotionalAnchor: boolean;
  maxHookLength: number;
}

export class MotivationHook {
  private eventBus: EventBus;
  private config: MotivationHookConfig;

  constructor(config: Partial<MotivationHookConfig> = {}) {
    this.eventBus = EventBus.getInstance();
    this.config = {
      minConfidence: 0.8,
      requireEmotionalAnchor: true,
      maxHookLength: 200,
      ...config
    };
  }

  /**
   * Main entry: Infers motivation hook from structured intent
   */
  async inferHook(structured: StructuredIntent): Promise<StructuredIntent> {
    try {
      // Check if we can infer a hook
      if (!this.canInferHook(structured)) {
        return structured;
      }

      // Get hook from spark or vision
      const hook = await this.getHookFromInput(structured);
      if (!hook) {
        return structured;
      }

      // Create motivation hook field
      const motivationHook: StructuredField<string> = {
        value: hook,
        confidence: 1.0,
        source: 'spark',
        overrideable: false,
        errorState: false,
        wasConfirmed: false
      };

      // Update structured intent
      const updated = {
        ...structured,
        motivationHook,
        _meta: {
          ...structured._meta,
          hasMotivationHook: true
        }
      };

      // Log hook inference
      await this.logHookInference(updated, hook);

      return updated;
    } catch (error) {
      await emitSystemLog('error', 'Failed to infer motivation hook', {
        source: 'MotivationHook',
        severity: 'error'
      });
      return structured;
    }
  }

  /**
   * Determines if we can infer a hook
   */
  private canInferHook(structured: StructuredIntent): boolean {
    return (
      structured._meta.intentConfidence >= this.config.minConfidence &&
      (!this.config.requireEmotionalAnchor || structured._meta.emotionalAnchorPresent)
    );
  }

  /**
   * Gets hook from spark or vision input
   */
  private async getHookFromInput(structured: StructuredIntent): Promise<string | null> {
    // Try spark first
    if (structured.spark_feel_quote?.value) {
      return this.formatHook(structured.spark_feel_quote.value);
    }

    // Try vision next
    if (structured.vision_feel_quote?.value) {
      return this.formatHook(structured.vision_feel_quote.value);
    }

    return null;
  }

  /**
   * Formats hook to meet requirements
   */
  private formatHook(input: string): string {
    // Truncate if too long
    if (input.length > this.config.maxHookLength) {
      input = input.slice(0, this.config.maxHookLength) + '...';
    }

    // Ensure it ends with a period
    if (!input.endsWith('.')) {
      input += '.';
    }

    return input;
  }

  /**
   * Logs hook inference
   */
  private async logHookInference(
    structured: StructuredIntent,
    hook: string
  ): Promise<void> {
    try {
      await this.eventBus.emit('promptLogs.hookInference', {
        timestamp: new Date().toISOString(),
        hook,
        intent: structured
      });
    } catch (error) {
      await emitSystemLog('error', 'Failed to log hook inference', {
        source: 'MotivationHook',
        severity: 'error'
      });
    }
  }
} 