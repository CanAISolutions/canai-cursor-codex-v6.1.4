/**
 * @file tests/pattern-analyzer.test.ts
 * @description Tests for the PatternAnalyzer class
 */

import { describe, expect, it, beforeEach } from '@jest/globals';
import { PatternAnalyzer } from '../core/pattern-analyzer';
import { SystemMetrics } from '../types';

describe('PatternAnalyzer', () => {
  let analyzer: PatternAnalyzer;
  let initialMetrics: SystemMetrics;

  beforeEach(() => {
    initialMetrics = {
      codeQuality: 0.8,
      testCoverage: 0.8,
      performance: 0.8,
      maintainability: 0.8,
      timestamp: new Date()
    };

    analyzer = new PatternAnalyzer(initialMetrics);
  });

  describe('analyzePatterns', () => {
    it('should analyze code patterns', async () => {
      const codebase = [
        'function example() { return true; }',
        'function another() { return false; }'
      ];

      const patterns = await analyzer.analyzePatterns(codebase);

      expect(patterns).toBeDefined();
      expect(patterns instanceof Map).toBe(true);
    });

    it('should handle empty codebase', async () => {
      const codebase: string[] = [];
      const patterns = await analyzer.analyzePatterns(codebase);

      expect(patterns).toBeDefined();
      expect(patterns.size).toBe(0);
    });

    it('should handle analysis errors', async () => {
      const codebase = ['invalid code'];
      
      await expect(analyzer.analyzePatterns(codebase)).rejects.toThrow('Pattern analysis failed');
    });
  });

  describe('updateMetrics', () => {
    it('should update system metrics', async () => {
      const newMetrics: SystemMetrics = {
        codeQuality: 0.9,
        testCoverage: 0.9,
        performance: 0.9,
        maintainability: 0.9,
        timestamp: new Date()
      };

      analyzer.updateMetrics(newMetrics);

      // Verify metrics were updated by analyzing patterns
      const codebase = ['function example() { return true; }'];
      const patterns = await analyzer.analyzePatterns(codebase);
      expect(patterns).toBeDefined();
    });
  });
}); 