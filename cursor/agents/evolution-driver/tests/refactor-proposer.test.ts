/**
 * @file tests/refactor-proposer.test.ts
 * @description Tests for the RefactorProposer class
 */

import { describe, expect, it, beforeEach } from '@jest/globals';
import { RefactorProposer } from '../core/refactor-proposer';
import { SystemMetrics, PatternAnalysis, ImprovementProposal } from '../types';

describe('RefactorProposer', () => {
  let proposer: RefactorProposer;
  let mockMetrics: SystemMetrics;

  beforeEach(() => {
    mockMetrics = {
      codeQuality: 0.8,
      testCoverage: 0.75,
      performance: 0.9,
      maintainability: 0.85,
      timestamp: new Date().toISOString()
    };

    proposer = new RefactorProposer(mockMetrics, 0.8);
  });

  describe('generateProposals', () => {
    it('should generate valid proposals', async () => {
      const patterns = new Map<string, PatternAnalysis>([
        ['function-declaration', {
          occurrences: 5,
          files: ['file1.ts', 'file2.ts'],
          impact: 0.8,
          suggestions: ['Consider refactoring into smaller functions']
        }]
      ]);

      const proposals = await proposer.generateProposals(patterns);
      expect(proposals).toBeDefined();
      expect(Array.isArray(proposals)).toBe(true);
      expect(proposals.length).toBeGreaterThan(0);

      const proposal = proposals[0];
      expect(proposal.pattern).toBe('function-declaration');
      expect(proposal.impact).toBe(0.8);
      expect(proposal.complexity).toBeLessThanOrEqual(0.8);
      expect(proposal.files).toHaveLength(2);
      expect(proposal.suggestions).toHaveLength(1);
    });

    it('should handle empty pattern set', async () => {
      const patterns = new Map<string, PatternAnalysis>();
      const proposals = await proposer.generateProposals(patterns);
      expect(proposals).toBeDefined();
      expect(Array.isArray(proposals)).toBe(true);
      expect(proposals.length).toBe(0);
    });

    it('should filter out low impact patterns', async () => {
      const patterns = new Map<string, PatternAnalysis>([
        ['low-impact', {
          occurrences: 1,
          files: ['file1.ts'],
          impact: 0.3,
          suggestions: ['Minor improvement']
        }]
      ]);

      const proposals = await proposer.generateProposals(patterns);
      expect(proposals).toHaveLength(0);
    });
  });

  describe('getMetrics', () => {
    it('should return current metrics', () => {
      const metrics = proposer.getMetrics();
      expect(metrics).toEqual(mockMetrics);
    });
  });
}); 