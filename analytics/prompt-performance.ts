/**
 * PromptPerformance Tracker
 * Aggregates metrics by promptType
 * Tracks confirmation rate, revision rate, tone conflict rate, delta confidence
 * Exports monthly and rolling 30-day stats
 */

import { EventBus } from '../cursor/utils/event-bus';
import { PromptLogs } from '../cursor/types/prompt-logs';

export interface PromptMetrics {
  promptType: string;
  timestamp: number;
  confirmationRate: number;
  revisionRate: number;
  toneConflictRate: number;
  deltaConfidence: number;
  totalSessions: number;
  successfulSessions: number;
}

export interface PromptPerformance {
  current: PromptMetrics;
  monthly: PromptMetrics[];
  rolling30Day: PromptMetrics[];
}

export class PromptPerformanceTracker {
  private eventBus: EventBus;
  private promptMetrics: Map<string, PromptMetrics>;
  private monthlyData: Map<string, PromptMetrics[]>;
  private rollingData: Map<string, PromptMetrics[]>;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.promptMetrics = new Map();
    this.monthlyData = new Map();
    this.rollingData = new Map();
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    this.eventBus.on('PROMPT_COMPLETE', this.handlePromptComplete.bind(this));
    this.eventBus.on('PROMPT_REVISION', this.handlePromptRevision.bind(this));
    this.eventBus.on('TONE_CONFLICT', this.handleToneConflict.bind(this));
  }

  private handlePromptComplete(promptType: string, success: boolean): void {
    const metrics = this.getOrCreateMetrics(promptType);
    metrics.totalSessions++;
    if (success) metrics.successfulSessions++;
    this.updateMetrics(promptType, metrics);
  }

  private handlePromptRevision(promptType: string): void {
    const metrics = this.getOrCreateMetrics(promptType);
    metrics.revisionRate = (metrics.revisionRate * metrics.totalSessions + 1) / (metrics.totalSessions + 1);
    this.updateMetrics(promptType, metrics);
  }

  private handleToneConflict(promptType: string): void {
    const metrics = this.getOrCreateMetrics(promptType);
    metrics.toneConflictRate = (metrics.toneConflictRate * metrics.totalSessions + 1) / (metrics.totalSessions + 1);
    this.updateMetrics(promptType, metrics);
  }

  private getOrCreateMetrics(promptType: string): PromptMetrics {
    let metrics = this.promptMetrics.get(promptType);
    if (!metrics) {
      metrics = {
        promptType,
        timestamp: Date.now(),
        confirmationRate: 0,
        revisionRate: 0,
        toneConflictRate: 0,
        deltaConfidence: 0,
        totalSessions: 0,
        successfulSessions: 0
      };
      this.promptMetrics.set(promptType, metrics);
    }
    return metrics;
  }

  private updateMetrics(promptType: string, metrics: PromptMetrics): void {
    // Update current metrics
    this.promptMetrics.set(promptType, metrics);

    // Update monthly data
    const monthKey = new Date().toISOString().slice(0, 7);
    const monthlyData = this.monthlyData.get(monthKey) || [];
    monthlyData.push(metrics);
    this.monthlyData.set(monthKey, monthlyData);

    // Update rolling 30-day data
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const rollingData = this.rollingData.get(promptType) || [];
    const filteredData = rollingData.filter(m => m.timestamp > thirtyDaysAgo);
    filteredData.push(metrics);
    this.rollingData.set(promptType, filteredData);

    // Emit analytics meta
    this.emitAnalyticsMeta(promptType, metrics);
  }

  private emitAnalyticsMeta(promptType: string, metrics: PromptMetrics): void {
    const analyticsMeta: PromptLogs['analyticsMeta'] = {
      promptMetrics: metrics,
      monthlyStats: Array.from(this.monthlyData.values()).flat(),
      rollingStats: Array.from(this.rollingData.get(promptType) || [])
    };

    this.eventBus.emit('ANALYTICS_META_UPDATED', analyticsMeta);
  }

  public getPromptPerformance(promptType: string): PromptPerformance | null {
    const metrics = this.promptMetrics.get(promptType);
    if (!metrics) return null;

    const monthKey = new Date().toISOString().slice(0, 7);
    return {
      current: metrics,
      monthly: this.monthlyData.get(monthKey) || [],
      rolling30Day: this.rollingData.get(promptType) || []
    };
  }

  public exportMonthlyStats(): PromptMetrics[] {
    const monthKey = new Date().toISOString().slice(0, 7);
    return this.monthlyData.get(monthKey) || [];
  }

  public exportRollingStats(): Map<string, PromptMetrics[]> {
    return this.rollingData;
  }
} 