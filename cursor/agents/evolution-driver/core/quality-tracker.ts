/**
 * @file quality-tracker.ts
 * @description Tracks and analyzes system quality metrics
 */

import { SystemMetrics, QualityTrend } from '../types';

export class QualityTracker {
  private metrics: SystemMetrics[];
  private minQualityThreshold: number;
  private trends: QualityTrend[];

  constructor(minQualityThreshold: number) {
    this.metrics = [];
    this.minQualityThreshold = minQualityThreshold;
    this.trends = [];
  }

  public trackMetrics(metrics: SystemMetrics): void {
    this.metrics.push(metrics);

    for (const metric of Object.keys(metrics) as Array<keyof SystemMetrics>) {
      if (metric === 'timestamp') continue;

      const value = metrics[metric];
      if (typeof value !== 'number') continue;

      this.trackMetric(metric, value);
    }
  }

  public getTrends(): QualityTrend[] {
    return [...this.trends];
  }

  private trackMetric(metric: keyof SystemMetrics, value: number): void {
    const timestamp = new Date().toISOString();
    const trend = this.calculateTrend(metric, value);
    const confidence = this.calculateConfidence(metric);

    this.trends.push({
      metric,
      trend,
      confidence,
      value,
      timestamp
    });
  }

  private calculateTrend(metric: keyof SystemMetrics, value: number): 'improving' | 'stable' | 'degrading' {
    const recentTrends = this.trends
      .filter(t => t.metric === metric)
      .slice(-5);

    if (recentTrends.length < 2) {
      return 'stable';
    }

    const values = recentTrends.map(t => t.value);
    const currentValue = values[values.length - 1];
    const previousValue = values[values.length - 2];
    const change = currentValue - previousValue;
    const threshold = 0.05; // 5% change threshold

    if (change > threshold) return 'improving';
    if (change < -threshold) return 'degrading';
    return 'stable';
  }

  private calculateSlope(values: number[]): number {
    if (values.length < 2) return 0;
    const xMean = (values.length - 1) / 2;
    const yMean = values.reduce((a, b) => a + b, 0) / values.length;
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < values.length; i++) {
      const xDiff = i - xMean;
      const yDiff = values[i] - yMean;
      numerator += xDiff * yDiff;
      denominator += xDiff * xDiff;
    }
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  private calculateConfidence(metric: keyof SystemMetrics): number {
    const recentTrends = this.trends
      .filter(t => t.metric === metric)
      .slice(-3);

    if (recentTrends.length < 2) return 1.0;

    const values = recentTrends.map(t => t.value);
    const variations = values.map((val, i) => {
      if (i === 0) return 0;
      return Math.abs(val - values[i - 1]);
    });

    const avgVariation = variations.reduce((a, b) => a + b, 0) / variations.length;
    return Math.max(0, 1 - avgVariation);
  }
} 