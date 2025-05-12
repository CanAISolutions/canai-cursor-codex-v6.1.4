/**
 * SessionAnalytics Engine
 * Tracks per-session emotional depth, trust score, override count, time-to-confirmation, drop-off signal
 * Supports time-series and cohort comparison
 */

import { EventBus } from '../cursor/utils/event-bus';
import { PromptLogs } from '../cursor/types/prompt-logs';

export interface SessionMetrics {
  sessionId: string;
  timestamp: number;
  emotionalDepth: number;
  trustScore: number;
  overrideCount: number;
  timeToConfirmation: number;
  dropOffSignal: boolean;
  promptType: string;
  cohort: string;
}

export interface SessionAnalytics {
  metrics: SessionMetrics;
  timeSeries: SessionMetrics[];
  cohortComparison: {
    [cohort: string]: SessionMetrics[];
  };
}

export class SessionAnalyticsEngine {
  private eventBus: EventBus;
  private sessionMetrics: Map<string, SessionMetrics>;
  private timeSeriesData: Map<string, SessionMetrics[]>;
  private cohortData: Map<string, SessionMetrics[]>;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.sessionMetrics = new Map();
    this.timeSeriesData = new Map();
    this.cohortData = new Map();
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    this.eventBus.on('SESSION_START', this.handleSessionStart.bind(this));
    this.eventBus.on('SESSION_END', this.handleSessionEnd.bind(this));
    this.eventBus.on('CONFIRMATION_COMPLETE', this.handleConfirmation.bind(this));
    this.eventBus.on('OVERRIDE_DETECTED', this.handleOverride.bind(this));
  }

  private handleSessionStart(sessionId: string, promptType: string): void {
    const metrics: SessionMetrics = {
      sessionId,
      timestamp: Date.now(),
      emotionalDepth: 0,
      trustScore: 0,
      overrideCount: 0,
      timeToConfirmation: 0,
      dropOffSignal: false,
      promptType,
      cohort: this.determineCohort(promptType)
    };

    this.sessionMetrics.set(sessionId, metrics);
    this.updateTimeSeries(sessionId, metrics);
    this.updateCohort(sessionId, metrics);
  }

  private handleSessionEnd(sessionId: string): void {
    const metrics = this.sessionMetrics.get(sessionId);
    if (metrics) {
      metrics.dropOffSignal = true;
      this.updateTimeSeries(sessionId, metrics);
      this.updateCohort(sessionId, metrics);
      this.emitAnalyticsMeta(metrics);
    }
  }

  private handleConfirmation(sessionId: string, timeToConfirmation: number): void {
    const metrics = this.sessionMetrics.get(sessionId);
    if (metrics) {
      metrics.timeToConfirmation = timeToConfirmation;
      this.updateTimeSeries(sessionId, metrics);
      this.updateCohort(sessionId, metrics);
    }
  }

  private handleOverride(sessionId: string): void {
    const metrics = this.sessionMetrics.get(sessionId);
    if (metrics) {
      metrics.overrideCount++;
      this.updateTimeSeries(sessionId, metrics);
      this.updateCohort(sessionId, metrics);
    }
  }

  private determineCohort(promptType: string): string {
    // Implement cohort determination logic based on promptType and other factors
    return `${promptType}_${new Date().toISOString().slice(0, 7)}`;
  }

  private updateTimeSeries(sessionId: string, metrics: SessionMetrics): void {
    const series = this.timeSeriesData.get(sessionId) || [];
    series.push(metrics);
    this.timeSeriesData.set(sessionId, series);
  }

  private updateCohort(sessionId: string, metrics: SessionMetrics): void {
    const cohort = metrics.cohort;
    const cohortData = this.cohortData.get(cohort) || [];
    cohortData.push(metrics);
    this.cohortData.set(cohort, cohortData);
  }

  private emitAnalyticsMeta(metrics: SessionMetrics): void {
    const analyticsMeta: PromptLogs['analyticsMeta'] = {
      sessionMetrics: metrics,
      timeSeries: this.timeSeriesData.get(metrics.sessionId) || [],
      cohortComparison: Object.fromEntries(
        Array.from(this.cohortData.entries()).map(([cohort, data]) => [cohort, data])
      )
    };

    this.eventBus.emit('ANALYTICS_META_UPDATED', analyticsMeta);
  }

  public getSessionAnalytics(sessionId: string): SessionAnalytics | null {
    const metrics = this.sessionMetrics.get(sessionId);
    if (!metrics) return null;

    return {
      metrics,
      timeSeries: this.timeSeriesData.get(sessionId) || [],
      cohortComparison: Object.fromEntries(
        Array.from(this.cohortData.entries()).map(([cohort, data]) => [cohort, data])
      )
    };
  }
} 