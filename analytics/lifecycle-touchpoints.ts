/**
 * Lifecycle Touchpoint Metrics
 * Tracks impact of Spark usage, Vision Catcher triggers, reused enrichment, tone reuse
 * Correlates lifecycle event timestamps with UX confirmation outcomes
 */

import { EventBus } from '../cursor/utils/event-bus';
import { PromptLogs } from '../cursor/types/prompt-logs';

export interface TouchpointMetrics {
  sessionId: string;
  timestamp: number;
  sparkUsed: boolean;
  visionCatcherTriggered: boolean;
  enrichmentReused: boolean;
  toneReused: boolean;
  confirmationOutcome: boolean;
  timeToConfirmation: number;
  emotionalDepth: number;
}

export interface LifecycleMetrics {
  current: TouchpointMetrics;
  history: TouchpointMetrics[];
  correlations: {
    sparkImpact: number;
    visionImpact: number;
    enrichmentImpact: number;
    toneImpact: number;
  };
}

export class LifecycleTouchpointTracker {
  private eventBus: EventBus;
  private touchpointMetrics: Map<string, TouchpointMetrics>;
  private sessionHistory: Map<string, TouchpointMetrics[]>;
  private correlationData: Map<string, {
    sparkImpact: number;
    visionImpact: number;
    enrichmentImpact: number;
    toneImpact: number;
  }>;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.touchpointMetrics = new Map();
    this.sessionHistory = new Map();
    this.correlationData = new Map();
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    this.eventBus.on('SPARK_USED', this.handleSparkUsed.bind(this));
    this.eventBus.on('VISION_CATCHER_TRIGGERED', this.handleVisionCatcher.bind(this));
    this.eventBus.on('ENRICHMENT_REUSED', this.handleEnrichmentReused.bind(this));
    this.eventBus.on('TONE_REUSED', this.handleToneReused.bind(this));
    this.eventBus.on('CONFIRMATION_COMPLETE', this.handleConfirmation.bind(this));
  }

  private handleSparkUsed(sessionId: string): void {
    const metrics = this.getOrCreateMetrics(sessionId);
    metrics.sparkUsed = true;
    this.updateMetrics(sessionId, metrics);
  }

  private handleVisionCatcher(sessionId: string): void {
    const metrics = this.getOrCreateMetrics(sessionId);
    metrics.visionCatcherTriggered = true;
    this.updateMetrics(sessionId, metrics);
  }

  private handleEnrichmentReused(sessionId: string): void {
    const metrics = this.getOrCreateMetrics(sessionId);
    metrics.enrichmentReused = true;
    this.updateMetrics(sessionId, metrics);
  }

  private handleToneReused(sessionId: string): void {
    const metrics = this.getOrCreateMetrics(sessionId);
    metrics.toneReused = true;
    this.updateMetrics(sessionId, metrics);
  }

  private handleConfirmation(sessionId: string, outcome: boolean, timeToConfirmation: number): void {
    const metrics = this.getOrCreateMetrics(sessionId);
    metrics.confirmationOutcome = outcome;
    metrics.timeToConfirmation = timeToConfirmation;
    this.updateMetrics(sessionId, metrics);
    this.updateCorrelations(sessionId, metrics);
  }

  private getOrCreateMetrics(sessionId: string): TouchpointMetrics {
    let metrics = this.touchpointMetrics.get(sessionId);
    if (!metrics) {
      metrics = {
        sessionId,
        timestamp: Date.now(),
        sparkUsed: false,
        visionCatcherTriggered: false,
        enrichmentReused: false,
        toneReused: false,
        confirmationOutcome: false,
        timeToConfirmation: 0,
        emotionalDepth: 0
      };
      this.touchpointMetrics.set(sessionId, metrics);
    }
    return metrics;
  }

  private updateMetrics(sessionId: string, metrics: TouchpointMetrics): void {
    this.touchpointMetrics.set(sessionId, metrics);
    const history = this.sessionHistory.get(sessionId) || [];
    history.push(metrics);
    this.sessionHistory.set(sessionId, history);
    this.emitAnalyticsMeta(sessionId, metrics);
  }

  private updateCorrelations(sessionId: string, metrics: TouchpointMetrics): void {
    const history = this.sessionHistory.get(sessionId) || [];
    const correlations = {
      sparkImpact: this.calculateImpact(history, 'sparkUsed'),
      visionImpact: this.calculateImpact(history, 'visionCatcherTriggered'),
      enrichmentImpact: this.calculateImpact(history, 'enrichmentReused'),
      toneImpact: this.calculateImpact(history, 'toneReused')
    };
    this.correlationData.set(sessionId, correlations);
  }

  private calculateImpact(history: TouchpointMetrics[], feature: keyof TouchpointMetrics): number {
    const withFeature = history.filter(m => m[feature]);
    const withoutFeature = history.filter(m => !m[feature]);
    
    if (withFeature.length === 0 || withoutFeature.length === 0) return 0;

    const withFeatureSuccess = withFeature.filter(m => m.confirmationOutcome).length / withFeature.length;
    const withoutFeatureSuccess = withoutFeature.filter(m => m.confirmationOutcome).length / withoutFeature.length;

    return withFeatureSuccess - withoutFeatureSuccess;
  }

  private emitAnalyticsMeta(sessionId: string, metrics: TouchpointMetrics): void {
    const analyticsMeta: PromptLogs['analyticsMeta'] = {
      touchpointMetrics: metrics,
      sessionHistory: this.sessionHistory.get(sessionId) || [],
      correlations: this.correlationData.get(sessionId) || {
        sparkImpact: 0,
        visionImpact: 0,
        enrichmentImpact: 0,
        toneImpact: 0
      }
    };

    this.eventBus.emit('ANALYTICS_META_UPDATED', analyticsMeta);
  }

  public getLifecycleMetrics(sessionId: string): LifecycleMetrics | null {
    const metrics = this.touchpointMetrics.get(sessionId);
    if (!metrics) return null;

    return {
      current: metrics,
      history: this.sessionHistory.get(sessionId) || [],
      correlations: this.correlationData.get(sessionId) || {
        sparkImpact: 0,
        visionImpact: 0,
        enrichmentImpact: 0,
        toneImpact: 0
      }
    };
  }
} 