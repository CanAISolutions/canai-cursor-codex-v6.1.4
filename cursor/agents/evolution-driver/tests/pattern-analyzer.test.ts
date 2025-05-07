/**
 * @file tests/pattern-analyzer.test.ts
 * @description Tests for the PatternAnalyzer class
 */

import { describe, expect, it, beforeEach } from '@jest/globals';
import { PatternAnalyzer } from '../core/pattern-analyzer';
import { SystemMetrics, PatternAnalysis } from '../types';

describe('PatternAnalyzer', () => {
  let analyzer: PatternAnalyzer;
  let mockMetrics: SystemMetrics;

  beforeEach(() => {
    mockMetrics = {
      codeQuality: 0.8,
      testCoverage: 0.75,
      performance: 0.9,
      maintainability: 0.85,
      timestamp: new Date().toISOString()
    };

    analyzer = new PatternAnalyzer(mockMetrics);
  });

  describe('analyzePatterns', () => {
    it('should analyze patterns in codebase', async () => {
      const codebase = [
        'function test() {}',
        'class Test {}',
        'const test = () => {}'
      ];

      const patterns = await analyzer.analyzePatterns(codebase);
      expect(patterns).toBeDefined();
      expect(patterns.size).toBeGreaterThan(0);
      expect(patterns.has('function-declaration')).toBe(true);
      expect(patterns.has('class-declaration')).toBe(true);
      expect(patterns.has('arrow-function')).toBe(true);
    });

    it('should handle empty codebase', async () => {
      await expect(analyzer.analyzePatterns([])).rejects.toThrow('Invalid codebase format');
    });

    it('should handle invalid codebase', async () => {
      await expect(analyzer.analyzePatterns([''])).rejects.toThrow('No patterns found in codebase');
    });

    it('should detect pattern changes', async () => {
      const oldPatterns = new Map<string, PatternAnalysis>([
        ['function-declaration', {
          occurrences: 1,
          files: ['file1.ts'],
          impact: 0.5,
          suggestions: ['Consider using arrow functions']
        }]
      ]);

      const newPatterns = new Map<string, PatternAnalysis>([
        ['function-declaration', {
          occurrences: 2,
          files: ['file1.ts', 'file2.ts'],
          impact: 0.6,
          suggestions: ['Consider using arrow functions']
        }]
      ]);

      const changes = analyzer.detectPatternChanges(oldPatterns, newPatterns);
      expect(changes).toBeDefined();
      expect(changes.size).toBeGreaterThan(0);
    });
  });

  describe('getMetrics', () => {
    it('should return current metrics', () => {
      const metrics = analyzer.getMetrics();
      expect(metrics).toEqual(mockMetrics);
    });
  });
}); 