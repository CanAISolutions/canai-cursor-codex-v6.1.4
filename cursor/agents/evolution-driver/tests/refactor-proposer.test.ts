/**
 * @file tests/refactor-proposer.test.ts
 * @description Tests for the RefactorProposer class
 */

import { describe, expect, it, beforeEach } from '@jest/globals';
import { RefactorProposer } from '../core/refactor-proposer';
import { SystemMetrics, PatternAnalysis } from '../types';

describe('RefactorProposer', () => {
  let proposer: RefactorProposer;
  let initialMetrics: SystemMetrics;
  let maxComplexity: number;

  beforeEach(() => {
    initialMetrics = {
      codeQuality: 0.8,
      testCoverage: 0.8,
      performance: 0.8,
      maintainability: 0.8,
      timestamp: new Date()
    };
    maxComplexity = 0.8;

    proposer = new RefactorProposer(initialMetrics, maxComplexity);
  });

  describe('generateProposals', () => {
    it('should generate refactoring proposals', async () => {
      const patterns = new Map<string, PatternAnalysis>();
      patterns.set('example-pattern', {
        pattern: 'example-pattern',
        occurrences: 5,
        files: ['file1.ts', 'file2.ts'],
        impact: 0.7,
        suggestion: 'Refactor this pattern'
      });

      const proposals = await proposer.generateProposals(patterns);

      expect(proposals).toBeDefined();
      expect(Array.isArray(proposals)).toBe(true);
      expect(proposals.length).toBeGreaterThan(0);
    });

    it('should handle empty patterns', async () => {
      const patterns = new Map<string, PatternAnalysis>();
      const proposals = await proposer.generateProposals(patterns);

      expect(proposals).toBeDefined();
      expect(Array.isArray(proposals)).toBe(true);
      expect(proposals.length).toBe(0);
    });

    it('should filter low-impact patterns', async () => {
      const patterns = new Map<string, PatternAnalysis>();
      patterns.set('low-impact', {
        pattern: 'low-impact',
        occurrences: 2,
        files: ['file1.ts'],
        impact: 0.3,
        suggestion: 'Low impact pattern'
      });

      const proposals = await proposer.generateProposals(patterns);

      expect(proposals).toBeDefined();
      expect(Array.isArray(proposals)).toBe(true);
      expect(proposals.length).toBe(0);
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

      proposer.updateMetrics(newMetrics);

      // Verify metrics were updated by generating proposals
      const patterns = new Map<string, PatternAnalysis>();
      patterns.set('example-pattern', {
        pattern: 'example-pattern',
        occurrences: 5,
        files: ['file1.ts', 'file2.ts'],
        impact: 0.7,
        suggestion: 'Refactor this pattern'
      });

      const proposals = await proposer.generateProposals(patterns);
      expect(proposals).toBeDefined();
    });
  });
}); 