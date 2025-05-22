/**
 * @file tests/evolution-driver.test.ts
 * @description Tests for the EvolutionDriver class
 */

import { describe, expect, it, beforeEach } from '@jest/globals';
import { EvolutionDriver } from '../core/evolution-driver';
import { EvolutionDriverConfig, SystemMetrics, PatternAnalysis } from '../types';

describe('EvolutionDriver', () => {
  let driver: EvolutionDriver;
  let config: EvolutionDriverConfig;

  beforeEach(() => {
    config = {
      patternRecognitionEnabled: true,
      refactoringEnabled: true,
      qualityTrackingEnabled: true,
      selfImprovementEnabled: true,
      minQualityThreshold: 0.8,
      maxRefactoringComplexity: 0.9,
      learningRate: 0.1,
      proposalFrequency: 'daily'
    };

    driver = new EvolutionDriver(config);
  });

  describe('analyzeCodebase', () => {
    it('should analyze codebase patterns', async () => {
      const codebase = [
        'function test() {}',
        'class Test {}',
        'const test = () => {}'
      ];

      const result = await driver.analyzeCodebase(codebase);
      expect(result.patterns).toBeDefined();
      expect(result.metrics).toBeDefined();
      expect(result.patterns.size).toBeGreaterThan(0);
    });

    it('should handle empty codebase', async () => {
      await expect(driver.analyzeCodebase([])).rejects.toThrow();
    });
  });

  describe('analyzeSystem', () => {
    it('should generate improvement proposals', async () => {
      const codebase = [
        'function test() {}',
        'class Test {}',
        'const test = () => {}'
      ];

      const proposals = await driver.analyzeSystem(codebase);
      expect(proposals).toBeDefined();
      expect(Array.isArray(proposals)).toBe(true);
    });

    it('should respect pattern recognition setting', async () => {
      config.patternRecognitionEnabled = false;
      driver = new EvolutionDriver(config);

      const codebase = [
        'function test() {}',
        'class Test {}',
        'const test = () => {}'
      ];

      const proposals = await driver.analyzeSystem(codebase);
      expect(proposals).toHaveLength(0);
    });
  });

  describe('generateProposals', () => {
    it('should generate valid proposals', async () => {
      const codebase = [
        'function test() {}',
        'class Test {}',
        'const test = () => {}'
      ];

      const proposals = await driver.generateProposals(codebase);
      expect(proposals).toBeDefined();
      expect(Array.isArray(proposals)).toBe(true);
      expect(proposals.length).toBeGreaterThan(0);
    });
  });

  describe('trackQuality', () => {
    it('should track system quality', async () => {
      const codebase = [
        'function test() {}',
        'class Test {}',
        'const test = () => {}'
      ];

      const metrics = await driver.trackQuality(codebase);
      expect(metrics).toBeDefined();
      expect(metrics.codeQuality).toBeDefined();
      expect(metrics.testCoverage).toBeDefined();
      expect(metrics.performance).toBeDefined();
      expect(metrics.maintainability).toBeDefined();
      expect(metrics.timestamp).toBeDefined();
    });
  });

  describe('getMetrics', () => {
    it('should return current metrics', () => {
      const metrics = driver.getMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.proposalsGenerated).toBeDefined();
      expect(metrics.proposalsApplied).toBeDefined();
      expect(metrics.qualityImprovements).toBeDefined();
      expect(metrics.patternsIdentified).toBeDefined();
      expect(metrics.learningOpportunities).toBeDefined();
      expect(metrics.timestamp).toBeDefined();
    });
  });

  describe('getMetricsBelowThreshold', () => {
    it('should identify metrics below threshold', () => {
      const belowThreshold = driver.getMetricsBelowThreshold();
      expect(Array.isArray(belowThreshold)).toBe(true);
    });
  });
}); 