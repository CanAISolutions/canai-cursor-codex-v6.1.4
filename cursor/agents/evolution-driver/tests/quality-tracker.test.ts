/**
 * @file tests/quality-tracker.test.ts
 * @description Tests for the QualityTracker class
 */

import { describe, expect, it, beforeEach } from '@jest/globals';
import { QualityTracker } from '../core/quality-tracker';
import { SystemMetrics } from '../types';

describe('QualityTracker', () => {
  let tracker: QualityTracker;
  let minQualityThreshold: number;

  beforeEach(() => {
    minQualityThreshold = 0.7;
    tracker = new QualityTracker(minQualityThreshold);
  });

  describe('updateMetrics', () => {
    it('should update quality metrics', () => {
      const metrics: SystemMetrics = {
        codeQuality: 0.8,
        testCoverage: 0.8,
        performance: 0.8,
        maintainability: 0.8,
        timestamp: new Date()
      };

      const trends = tracker.updateMetrics(metrics);

      expect(trends).toBeDefined();
      expect(trends instanceof Map).toBe(true);
      expect(trends.size).toBe(4); // One for each metric
    });

    it('should track trends over time', () => {
      const metrics1: SystemMetrics = {
        codeQuality: 0.7,
        testCoverage: 0.7,
        performance: 0.7,
        maintainability: 0.7,
        timestamp: new Date()
      };

      const metrics2: SystemMetrics = {
        codeQuality: 0.8,
        testCoverage: 0.8,
        performance: 0.8,
        maintainability: 0.8,
        timestamp: new Date()
      };

      tracker.updateMetrics(metrics1);
      const trends = tracker.updateMetrics(metrics2);

      for (const [metric, trend] of trends) {
        expect(trend.metric).toBe(metric);
        expect(trend.values.length).toBe(2);
        expect(trend.timestamps.length).toBe(2);
        expect(trend.trend).toBe('improving');
      }
    });
  });

  describe('getTrend', () => {
    it('should get trend for a metric', () => {
      const metrics: SystemMetrics = {
        codeQuality: 0.8,
        testCoverage: 0.8,
        performance: 0.8,
        maintainability: 0.8,
        timestamp: new Date()
      };

      tracker.updateMetrics(metrics);
      const trend = tracker.getTrend('codeQuality');

      expect(trend).toBeDefined();
      expect(trend.metric).toBe('codeQuality');
      expect(trend.values).toHaveLength(1);
      expect(trend.timestamps).toHaveLength(1);
      expect(trend.trend).toBe('stable');
    });

    it('should throw error for invalid metric', () => {
      expect(() => tracker.getTrend('invalid' as keyof SystemMetrics)).toThrow();
    });
  });

  describe('getMetricsBelowThreshold', () => {
    it('should identify metrics below threshold', () => {
      const metrics: SystemMetrics = {
        codeQuality: 0.6, // Below threshold
        testCoverage: 0.8,
        performance: 0.6, // Below threshold
        maintainability: 0.8,
        timestamp: new Date()
      };

      tracker.updateMetrics(metrics);
      const belowThreshold = tracker.getMetricsBelowThreshold();

      expect(belowThreshold).toContain('codeQuality');
      expect(belowThreshold).toContain('performance');
      expect(belowThreshold).not.toContain('testCoverage');
      expect(belowThreshold).not.toContain('maintainability');
    });

    it('should return empty array when all metrics are above threshold', () => {
      const metrics: SystemMetrics = {
        codeQuality: 0.8,
        testCoverage: 0.8,
        performance: 0.8,
        maintainability: 0.8,
        timestamp: new Date()
      };

      tracker.updateMetrics(metrics);
      const belowThreshold = tracker.getMetricsBelowThreshold();

      expect(belowThreshold).toHaveLength(0);
    });
  });
}); 