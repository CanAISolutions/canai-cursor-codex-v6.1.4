/**
 * @file tests/quality-tracker.test.ts
 * @description Tests for the QualityTracker class
 */

import { describe, expect, it, beforeEach } from '@jest/globals';
import { QualityTracker } from '../core/quality-tracker';
import { SystemMetrics } from '../types';

describe('QualityTracker', () => {
  let tracker: QualityTracker;
  const minQualityScore = 0.8;

  beforeEach(() => {
    tracker = new QualityTracker(minQualityScore);
  });

  describe('trackMetrics', () => {
    it('should track metrics correctly', () => {
      const metrics: SystemMetrics = {
        codeQuality: 0.9,
        testCoverage: 0.85,
        performance: 0.95,
        maintainability: 0.9,
        timestamp: new Date().toISOString()
      };

      tracker.trackMetrics(metrics);
      const trends = tracker.getTrends();
      expect(trends.length).toBeGreaterThan(0);
      expect(trends[0].metric).toBeDefined();
      expect(trends[0].value).toBeDefined();
      expect(trends[0].trend).toBeDefined();
      expect(trends[0].confidence).toBeDefined();
      expect(trends[0].timestamp).toBeDefined();
    });

    it('should detect degrading metrics', () => {
      // First metrics
      tracker.trackMetrics({
        codeQuality: 0.9,
        testCoverage: 0.85,
        performance: 0.95,
        maintainability: 0.9,
        timestamp: new Date().toISOString()
      });

      // Second metrics with degraded values
      tracker.trackMetrics({
        codeQuality: 0.8,
        testCoverage: 0.75,
        performance: 0.85,
        maintainability: 0.8,
        timestamp: new Date().toISOString()
      });

      const trends = tracker.getTrends();
      const degradingMetrics = trends.filter(t => t.trend === 'degrading');
      expect(degradingMetrics.length).toBeGreaterThan(0);
    });

    it('should detect improving metrics', () => {
      // First metrics
      tracker.trackMetrics({
        codeQuality: 0.8,
        testCoverage: 0.75,
        performance: 0.85,
        maintainability: 0.8,
        timestamp: new Date().toISOString()
      });

      // Second metrics with improved values
      tracker.trackMetrics({
        codeQuality: 0.9,
        testCoverage: 0.85,
        performance: 0.95,
        maintainability: 0.9,
        timestamp: new Date().toISOString()
      });

      const trends = tracker.getTrends();
      const improvingMetrics = trends.filter(t => t.trend === 'improving');
      expect(improvingMetrics.length).toBeGreaterThan(0);
    });
  });

  describe('getTrends', () => {
    it('should return valid trend data', () => {
      const metrics: SystemMetrics = {
        codeQuality: 0.9,
        testCoverage: 0.85,
        performance: 0.95,
        maintainability: 0.9,
        timestamp: new Date().toISOString()
      };

      tracker.trackMetrics(metrics);
      const trends = tracker.getTrends();

      expect(trends.every(t => 
        t.metric && 
        typeof t.value === 'number' && 
        t.timestamp && 
        ['improving', 'stable', 'degrading'].includes(t.trend) &&
        typeof t.confidence === 'number'
      )).toBe(true);
    });
  });
}); 