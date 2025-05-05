/**
 * @file tests/evolution-driver.test.ts
 * @description Tests for the EvolutionDriver class
 */

import { describe, expect, it, beforeEach } from '@jest/globals';
import { EvolutionDriver } from '../index';
import { EvolutionDriverConfig } from '../types';

describe('EvolutionDriver', () => {
  let driver: EvolutionDriver;
  let config: EvolutionDriverConfig;

  beforeEach(() => {
    config = {
      patternRecognitionEnabled: true,
      refactoringEnabled: true,
      qualityTrackingEnabled: true,
      selfImprovementEnabled: true,
      minQualityThreshold: 0.7,
      maxRefactoringComplexity: 0.8,
      learningRate: 0.1,
      proposalFrequency: 'daily'
    };

    driver = new EvolutionDriver(config);
  });

  describe('analyzeSystem', () => {
    it('should analyze system and generate proposals', async () => {
      const codebase = [
        'function example() { return true; }',
        'function another() { return false; }'
      ];

      const proposals = await driver.analyzeSystem(codebase);

      expect(proposals).toBeDefined();
      expect(Array.isArray(proposals)).toBe(true);
    });

    it('should respect pattern recognition configuration', async () => {
      const codebase = ['function example() { return true; }'];
      config.patternRecognitionEnabled = false;

      driver.updateConfig(config);
      const proposals = await driver.analyzeSystem(codebase);

      expect(proposals).toHaveLength(0);
    });

    it('should respect refactoring configuration', async () => {
      const codebase = ['function example() { return true; }'];
      config.refactoringEnabled = false;

      driver.updateConfig(config);
      const proposals = await driver.analyzeSystem(codebase);

      expect(proposals).toHaveLength(0);
    });
  });

  describe('getMetrics', () => {
    it('should return evolution metrics', () => {
      const metrics = driver.getMetrics();

      expect(metrics).toBeDefined();
      expect(metrics.proposalsGenerated).toBe(0);
      expect(metrics.proposalsApplied).toBe(0);
      expect(metrics.qualityImprovements).toBe(0);
      expect(metrics.patternsIdentified).toBe(0);
      expect(metrics.learningOpportunities).toBe(0);
      expect(metrics.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('getMetricsBelowThreshold', () => {
    it('should return metrics below threshold', () => {
      const belowThreshold = driver.getMetricsBelowThreshold();

      expect(Array.isArray(belowThreshold)).toBe(true);
    });
  });

  describe('updateConfig', () => {
    it('should update configuration', () => {
      const newConfig = {
        patternRecognitionEnabled: false,
        refactoringEnabled: false
      };

      driver.updateConfig(newConfig);

      const updatedConfig = (driver as any).config;
      expect(updatedConfig.patternRecognitionEnabled).toBe(false);
      expect(updatedConfig.refactoringEnabled).toBe(false);
      expect(updatedConfig.qualityTrackingEnabled).toBe(true); // Unchanged
    });
  });
}); 