/**
 * @file core/quality-tracker.ts
 * @description Quality tracker for monitoring and analyzing code quality trends
 */

import { QualityTrend, SystemMetrics } from '../types';

export class QualityTracker {
  private trends: Map<keyof SystemMetrics, QualityTrend>;
  private minQualityThreshold: number;
  private readonly maxHistoryLength: number = 100;

  constructor(minQualityThreshold: number) {
    this.trends = new Map();
    this.minQualityThreshold = minQualityThreshold;
    this.initializeTrends();
  }

  /**
   * Updates quality metrics and analyzes trends
   * @param metrics New system metrics
   * @returns Map of quality trends
   */
  public updateMetrics(metrics: SystemMetrics): Map<keyof SystemMetrics, QualityTrend> {
    try {
      for (const [key, value] of Object.entries(metrics)) {
        if (key !== 'timestamp') {
          this.updateTrend(key as keyof SystemMetrics, value, metrics.timestamp);
        }
      }

      return this.trends;
    } catch (error) {
      console.error('Error updating quality metrics:', error);
      throw new Error('Quality tracking failed');
    }
  }

  /**
   * Gets the current quality trend for a metric
   * @param metric Metric to get trend for
   * @returns Quality trend
   */
  public getTrend(metric: keyof SystemMetrics): QualityTrend {
    const trend = this.trends.get(metric);
    if (!trend) {
      throw new Error(`No trend data for metric: ${metric}`);
    }
    return trend;
  }

  /**
   * Checks if any metrics are below quality threshold
   * @returns Array of metrics below threshold
   */
  public getMetricsBelowThreshold(): (keyof SystemMetrics)[] {
    const belowThreshold: (keyof SystemMetrics)[] = [];

    for (const [metric, trend] of this.trends) {
      const latestValue = trend.values[trend.values.length - 1];
      if (latestValue < this.minQualityThreshold) {
        belowThreshold.push(metric);
      }
    }

    return belowThreshold;
  }

  /**
   * Initializes trend tracking for all metrics
   */
  private initializeTrends(): void {
    const metrics: (keyof SystemMetrics)[] = [
      'codeQuality',
      'testCoverage',
      'performance',
      'maintainability'
    ];

    for (const metric of metrics) {
      this.trends.set(metric, {
        metric,
        values: [],
        timestamps: [],
        trend: 'stable'
      });
    }
  }

  /**
   * Updates trend data for a metric
   * @param metric Metric to update
   * @param value New value
   * @param timestamp Timestamp of measurement
   */
  private updateTrend(
    metric: keyof SystemMetrics,
    value: number,
    timestamp: Date
  ): void {
    const trend = this.trends.get(metric);
    if (!trend) {
      throw new Error(`No trend data for metric: ${metric}`);
    }

    // Add new data point
    trend.values.push(value);
    trend.timestamps.push(timestamp);

    // Maintain history length
    if (trend.values.length > this.maxHistoryLength) {
      trend.values.shift();
      trend.timestamps.shift();
    }

    // Update trend direction
    trend.trend = this.calculateTrend(trend.values);
  }

  /**
   * Calculates trend direction from values
   * @param values Array of metric values
   * @returns Trend direction
   */
  private calculateTrend(values: number[]): 'improving' | 'degrading' | 'stable' {
    if (values.length < 2) {
      return 'stable';
    }

    const recentValues = values.slice(-5);
    const differences = recentValues.slice(1).map((value, index) => value - recentValues[index]);
    const averageDifference = differences.reduce((sum, diff) => sum + diff, 0) / differences.length;

    if (Math.abs(averageDifference) < 0.01) {
      return 'stable';
    }

    return averageDifference > 0 ? 'improving' : 'degrading';
  }
} 