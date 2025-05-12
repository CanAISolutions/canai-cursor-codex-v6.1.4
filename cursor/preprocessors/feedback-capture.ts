/**
 * Feedback Capture Layer (Intent Mirror - Enhancement C)
 * 
 * What/Why/How:
 * - Tracks edits to confirmed fields
 * - Logs deltas in PromptLogs.feedbackDelta
 * - Creates baseline for Smart Defaults refinement
 * - Enables override heatmap logic
 */

import { EventBus } from '../event-bus/eventBus';
import { StructuredIntent, StructuredField } from './schema-engine';
import { emitSystemLog } from '../utils/audit-utils';

export interface FeedbackDelta {
  field: string;
  oldValue: any;
  newValue: any;
  timestamp: string;
  source: 'user' | 'system';
  confidence: number;
}

export interface FeedbackCaptureConfig {
  trackAllFields: boolean;
  minConfidenceForTracking: number;
  enableHeatmap: boolean;
}

export class FeedbackCapture {
  private eventBus: EventBus;
  private config: FeedbackCaptureConfig;
  private deltas: FeedbackDelta[] = [];

  constructor(config: Partial<FeedbackCaptureConfig> = {}) {
    this.eventBus = EventBus.getInstance();
    this.config = {
      trackAllFields: false,
      minConfidenceForTracking: 0.7,
      enableHeatmap: true,
      ...config
    };
  }

  /**
   * Main entry: Captures feedback for a field change
   */
  async captureFeedback(
    field: string,
    oldValue: any,
    newValue: any,
    source: 'user' | 'system' = 'user',
    confidence: number = 1.0
  ): Promise<void> {
    try {
      const delta: FeedbackDelta = {
        field,
        oldValue,
        newValue,
        timestamp: new Date().toISOString(),
        source,
        confidence
      };

      // Store delta
      this.deltas.push(delta);

      // Emit feedback event
      await this.eventBus.emit('feedback.capture', {
        delta,
        timestamp: new Date().toISOString()
      });

      // Log to PromptLogs
      await this.logFeedbackDelta(delta);
    } catch (error) {
      await emitSystemLog('error', 'Failed to capture feedback', {
        source: 'FeedbackCapture',
        severity: 'error'
      });
    }
  }

  /**
   * Tracks changes between two structured intents
   */
  async trackIntentChanges(
    oldIntent: StructuredIntent,
    newIntent: StructuredIntent
  ): Promise<void> {
    try {
      // Get all fields to track
      const fields = this.getFieldsToTrack(oldIntent, newIntent);

      // Track changes for each field
      for (const field of fields) {
        const oldField = oldIntent[field as keyof StructuredIntent] as StructuredField<any> | undefined;
        const newField = newIntent[field as keyof StructuredIntent] as StructuredField<any> | undefined;

        if (oldField?.value !== newField?.value) {
          await this.captureFeedback(
            field,
            oldField?.value,
            newField?.value,
            'system',
            newField?.confidence || 1.0
          );
        }
      }
    } catch (error) {
      await emitSystemLog('error', 'Failed to track intent changes', {
        source: 'FeedbackCapture',
        severity: 'error'
      });
    }
  }

  /**
   * Gets fields to track based on config
   */
  private getFieldsToTrack(
    oldIntent: StructuredIntent,
    newIntent: StructuredIntent
  ): string[] {
    if (this.config.trackAllFields) {
      return Object.keys(newIntent).filter(key => !key.startsWith('_'));
    }

    return Object.keys(newIntent).filter(key => {
      if (key.startsWith('_')) return false;
      const field = newIntent[key as keyof StructuredIntent] as StructuredField<any>;
      return (
        field.wasConfirmed &&
        field.confidence >= this.config.minConfidenceForTracking
      );
    });
  }

  /**
   * Logs feedback delta to PromptLogs
   */
  private async logFeedbackDelta(delta: FeedbackDelta): Promise<void> {
    try {
      await this.eventBus.emit('promptLogs.feedbackDelta', {
        timestamp: new Date().toISOString(),
        delta
      });
    } catch (error) {
      await emitSystemLog('error', 'Failed to log feedback delta', {
        source: 'FeedbackCapture',
        severity: 'error'
      });
    }
  }

  /**
   * Gets heatmap data for field overrides
   */
  async getOverrideHeatmap(): Promise<Record<string, number>> {
    if (!this.config.enableHeatmap) {
      return {};
    }

    const heatmap: Record<string, number> = {};
    const fieldCounts: Record<string, number> = {};

    // Count overrides per field
    for (const delta of this.deltas) {
      fieldCounts[delta.field] = (fieldCounts[delta.field] || 0) + 1;
    }

    // Calculate heatmap values
    const maxCount = Math.max(...Object.values(fieldCounts));
    for (const [field, count] of Object.entries(fieldCounts)) {
      heatmap[field] = count / maxCount;
    }

    return heatmap;
  }
} 