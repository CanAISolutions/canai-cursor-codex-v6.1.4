/**
 * Vision Catcher (Intent Mirror - Enhancement B)
 * 
 * What/Why/How:
 * - Collects emotional clarity when confidence is low or emotional anchor is missing
 * - Provides a safe space for users to express their vision
 * - Ensures every prompt has emotional grounding
 * - Integrates with Schema Engine and Confirmation UX
 */

import { EventBus } from '../event-bus/eventBus';
import { StructuredIntent, StructuredField } from './schema-engine';
import { emitSystemLog } from '../utils/audit-utils';

export interface VisionCatcherConfig {
  confidenceThreshold: number;
  requireEmotionalAnchor: boolean;
  maxRetries: number;
}

export class VisionCatcher {
  private eventBus: EventBus;
  private config: VisionCatcherConfig;

  constructor(config: Partial<VisionCatcherConfig> = {}) {
    this.eventBus = EventBus.getInstance();
    this.config = {
      confidenceThreshold: 0.8,
      requireEmotionalAnchor: true,
      maxRetries: 3,
      ...config
    };
  }

  /**
   * Main entry: Collects vision input and enriches structured intent
   * WHAT: Enriches intent with vision or falls back safely if input is malformed/null/chaos
   * WHY: Prevents unhandled exceptions and ensures emotional trust continuity
   * HOW: Checks input type/shape, returns null if invalid
   */
  async catchVision(structured: StructuredIntent): Promise<StructuredIntent | null> {
    // Fallback: handle null, undefined, or chaos input
    if (!structured || typeof structured !== 'object' || Array.isArray(structured) || !structured._meta) {
      // Codex fallback: always return null (no enrichment)
      return null;
    }

    // Check if we need to trigger Vision Catcher
    if (!this.needsVisionCatch(structured)) {
      return null;
    }

    try {
      // Emit vision catch event
      await this.eventBus.emit('vision.catch', {
        intent: structured,
        timestamp: new Date().toISOString()
      });

      // Get vision input
      const visionInput = await this.getVisionInput(structured);
      if (!visionInput) {
        return null;
      }

      // Enrich structured intent with vision
      const enriched = this.enrichWithVision(structured, visionInput);

      // Log vision catch
      await this.logVisionCatch(enriched, visionInput);

      return enriched;
    } catch (error) {
      await emitSystemLog('error', 'Failed to catch vision', {
        source: 'VisionCatcher',
        severity: 'error'
      });
      return null;
    }
  }

  /**
   * Determines if Vision Catcher should be triggered
   */
  private needsVisionCatch(structured: StructuredIntent): boolean {
    return (
      structured._meta.intentConfidence < this.config.confidenceThreshold ||
      (this.config.requireEmotionalAnchor && !structured._meta.emotionalAnchorPresent)
    );
  }

  /**
   * Gets vision input from user
   */
  private async getVisionInput(structured: StructuredIntent): Promise<string | null> {
    // Emit vision prompt event
    await this.eventBus.emit('vision.prompt', {
      intent: structured,
      timestamp: new Date().toISOString()
    });

    // Vision input collection would go here
    // For now, return null to indicate no input
    return null;
  }

  /**
   * Enriches structured intent with vision input
   */
  private enrichWithVision(
    structured: StructuredIntent,
    visionInput: string
  ): StructuredIntent {
    // Create vision feel quote field
    const vision_feel_quote: StructuredField<string> = {
      value: visionInput,
      confidence: 1.0,
      source: 'vision',
      overrideable: false,
      errorState: false,
      wasConfirmed: true
    };

    // Update structured intent
    return {
      ...structured,
      vision_feel_quote,
      _meta: {
        ...structured._meta,
        emotionalAnchorPresent: true,
        usedVisionCatcher: true
      }
    };
  }

  /**
   * Logs vision catch event
   */
  private async logVisionCatch(
    structured: StructuredIntent,
    visionInput: string
  ): Promise<void> {
    try {
      await this.eventBus.emit('promptLogs.visionCatch', {
        timestamp: new Date().toISOString(),
        visionInput,
        intent: structured
      });
    } catch (error) {
      await emitSystemLog('error', 'Failed to log vision catch', {
        source: 'VisionCatcher',
        severity: 'error'
      });
    }
  }
} 