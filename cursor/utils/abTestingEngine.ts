/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "A/B testing for smart defaults confidence thresholds"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Manage and track confidence threshold variants
 */

import { EventBus } from '../event-bus/eventBus';
import { emitSystemLog } from './audit-utils';
import { AirtableLogger } from './airtableLogger';

export interface ConfidenceVariant {
  id: string;
  sessionThreshold: number;
  emotionalThreshold: number;
  weight: number;
}

export class ABTestingEngine {
  private readonly eventBus = EventBus.getInstance();
  private readonly airtableLogger: AirtableLogger;
  private readonly STORAGE_KEY = 'defaultsVariant';
  private readonly VARIANTS: ConfidenceVariant[] = [
    {
      id: 'high',
      sessionThreshold: 0.8,
      emotionalThreshold: 0.6,
      weight: 0.33
    },
    {
      id: 'medium',
      sessionThreshold: 0.7,
      emotionalThreshold: 0.5,
      weight: 0.34
    },
    {
      id: 'low',
      sessionThreshold: 0.6,
      emotionalThreshold: 0.4,
      weight: 0.33
    }
  ];

  constructor() {
    this.airtableLogger = new AirtableLogger();
    this.initializeEventListeners();
  }

  /**
   * Gets the current confidence variant for a session
   */
  getCurrentVariant(): ConfidenceVariant {
    const storedVariant = localStorage.getItem(this.STORAGE_KEY);
    if (storedVariant) {
      const variant = this.VARIANTS.find(v => v.id === storedVariant);
      if (variant) return variant;
    }

    // Assign new variant based on weights
    const variant = this.assignVariant();
    localStorage.setItem(this.STORAGE_KEY, variant.id);
    
    this.emitVariantAssigned(variant);
    return variant;
  }

  /**
   * Records the outcome of a defaults application
   */
  recordOutcome(success: boolean, confidence: number, source: string): void {
    const variant = this.getCurrentVariant();
    
    this.airtableLogger.logDefaultApplied({
      defaults: {
        tone: 'default',
        confidence
      },
      context: window.location.pathname,
      confidence,
      source,
      timestamp: new Date().toISOString(),
      variant: variant.id,
      success
    });

    this.emitAnalyticsEvent('defaults-outcome', {
      variant: variant.id,
      success,
      confidence,
      source,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Forces a specific variant (for testing)
   */
  forceVariant(variantId: string): void {
    const variant = this.VARIANTS.find(v => v.id === variantId);
    if (variant) {
      localStorage.setItem(this.STORAGE_KEY, variant.id);
      this.emitVariantAssigned(variant);
    }
  }

  private assignVariant(): ConfidenceVariant {
    const random = Math.random();
    let cumulativeWeight = 0;

    for (const variant of this.VARIANTS) {
      cumulativeWeight += variant.weight;
      if (random <= cumulativeWeight) {
        return variant;
      }
    }

    return this.VARIANTS[0]; // Fallback to first variant
  }

  private emitVariantAssigned(variant: ConfidenceVariant): void {
    this.eventBus.emit('defaultsABGroupAssigned', {
      variant: variant.id,
      thresholds: {
        session: variant.sessionThreshold,
        emotional: variant.emotionalThreshold
      },
      timestamp: new Date().toISOString()
    });

    emitSystemLog('defaults-variant-assigned', {
      variant: variant.id,
      thresholds: {
        session: variant.sessionThreshold,
        emotional: variant.emotionalThreshold
      },
      timestamp: new Date().toISOString()
    });
  }

  private emitAnalyticsEvent(type: string, data: any): void {
    this.eventBus.emit('ANALYTICS_EVENT', {
      type,
      data: {
        ...data,
        timestamp: new Date().toISOString()
      }
    });
  }

  private initializeEventListeners(): void {
    this.eventBus.on('DEFAULTS_APPLIED', (event: any) => {
      if (event.success !== undefined && event.confidence) {
        this.recordOutcome(
          event.success,
          event.confidence,
          event.source || 'default'
        );
      }
    });
  }
} 