/**
 * @file trust-scorer.test.ts
 * @description Unit tests for trust-scorer.ts — Trust evaluation engine for fix proposals.
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { computeTrustScore } from '../trust-scorer';
import { recordMetric } from '../../utils/telemetry';
import { appendToFixContextAsync } from '../../context/fix-context-utils';
import { runESLintAnalysis } from '../../utils/eslint-runner';
import { BugContext, FixProposal, AIProvider } from '../../engines/ai-provider';

jest.mock('../../utils/telemetry');
jest.mock('../../context/fix-context-utils');
jest.mock('../../utils/eslint-runner');

// Extend AIProvider to include evaluateFixTrustScore
interface TrustScoringAIProvider extends AIProvider {
  evaluateFixTrustScore(fix: FixProposal, bug: BugContext): Promise<number>;
}

describe('computeTrustScore', () => {
  const mockFixProposal: FixProposal = {
    patch: 'diff --git a/test.ts b/test.ts\nindex 123..456 789\n--- a/test.ts\n+++ b/test.ts\n@@ -1,1 +1,1 @@\n-old\n+new',
    filepath: 'test.ts',
    reason: 'Fix the bug',
    confidence: 0.8
  };

  const mockBugContext: BugContext = {
    message: 'Test error',
    type: 'TypeError',
    likelihood: 'high',
    impact: ['test.ts']
  };

  const mockEslintConfig = {
    enabled: true,
    configFile: '.eslintrc.js',
    maxErrors: 5,
    errorPenalty: 0.5
  };

  const mockAIProvider = {
    ping: () => Promise.resolve(true),
    detectBug: () => Promise.resolve(mockBugContext),
    proposeFix: () => Promise.resolve(mockFixProposal),
    generateEscalationTicket: () => Promise.resolve(),
    evaluateFixTrustScore: () => Promise.resolve(8.0)
  } as TrustScoringAIProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(runESLintAnalysis).mockResolvedValue({ errorCount: 0 });
  });

  it('should compute base score with no penalties or bonuses', async () => {
    const score = await computeTrustScore(
      mockFixProposal,
      mockBugContext,
      mockEslintConfig,
      'test-trace-123'
    );

    expect(score).toBe(5.0); // Base score
    expect(appendToFixContextAsync).toHaveBeenCalled();
    expect(recordMetric).toHaveBeenCalledWith('trust_computed', expect.any(Object));
  });

  it('should penalize oversized patches', async () => {
    const largeFixProposal = {
      ...mockFixProposal,
      patch: 'diff' + '\n'.repeat(101) // Over 100 lines
    };

    const score = await computeTrustScore(
      largeFixProposal,
      mockBugContext,
      mockEslintConfig,
      'test-trace-123'
    );

    expect(score).toBe(3.0); // Base 5.0 - 2.0 penalty
    expect(appendToFixContextAsync).toHaveBeenCalledWith(expect.stringContaining('Patch size penalty'));
  });

  it('should reward matching bug context', async () => {
    const score = await computeTrustScore(
      mockFixProposal,
      mockBugContext,
      mockEslintConfig,
      'test-trace-123'
    );

    expect(score).toBe(6.5); // Base 5.0 + 1.5 bonus
    expect(appendToFixContextAsync).toHaveBeenCalledWith(expect.stringContaining('impact match bonus'));
  });

  it('should penalize missing rationale', async () => {
    const noReasonFix = {
      ...mockFixProposal,
      reason: ''
    };

    const score = await computeTrustScore(
      noReasonFix,
      mockBugContext,
      mockEslintConfig,
      'test-trace-123'
    );

    expect(score).toBe(4.0); // Base 5.0 - 1.0 penalty
    expect(appendToFixContextAsync).toHaveBeenCalledWith(expect.stringContaining('Weak reasoning penalty'));
  });

  it('should handle ESLint errors', async () => {
    jest.mocked(runESLintAnalysis).mockResolvedValue({ errorCount: 2 });

    const score = await computeTrustScore(
      mockFixProposal,
      mockBugContext,
      mockEslintConfig,
      'test-trace-123'
    );

    expect(score).toBe(4.0); // Base 5.0 - (2 errors * 0.5 penalty)
    expect(appendToFixContextAsync).toHaveBeenCalledWith(expect.stringContaining('ESLint penalty'));
  });

  it('should handle ESLint analysis failure gracefully', async () => {
    jest.mocked(runESLintAnalysis).mockRejectedValue(new Error('ESLint failed'));

    const score = await computeTrustScore(
      mockFixProposal,
      mockBugContext,
      mockEslintConfig,
      'test-trace-123'
    );

    expect(score).toBe(5.0); // Base score, no penalty on failure
    expect(appendToFixContextAsync).toHaveBeenCalledWith(expect.stringContaining('ESLint analysis failed'));
    expect(recordMetric).toHaveBeenCalledWith('trust_eslint_failed', expect.any(Object));
  });

  it('should use AI provider for additional scoring if available', async () => {
    const score = await computeTrustScore(
      mockFixProposal,
      mockBugContext,
      mockEslintConfig,
      'test-trace-123',
      mockAIProvider
    );

    expect(score).toBe(9.0); // Base 5.0 + (8.0/2) AI bonus
    expect(appendToFixContextAsync).toHaveBeenCalledWith(expect.stringContaining('AI trust score bonus'));
  });

  it('should handle AI scoring failure gracefully', async () => {
    const failingAIProvider = {
      ...mockAIProvider,
      evaluateFixTrustScore: () => Promise.reject(new Error('AI failed'))
    };

    const score = await computeTrustScore(
      mockFixProposal,
      mockBugContext,
      mockEslintConfig,
      'test-trace-123',
      failingAIProvider
    );

    expect(score).toBe(5.0); // Base score, no bonus on failure
    expect(appendToFixContextAsync).toHaveBeenCalledWith(expect.stringContaining('AI trust score failed'));
    expect(recordMetric).toHaveBeenCalledWith('trust_ai_failed', expect.any(Object));
  });

  it('should cap final score between 0 and 10', async () => {
    const highScoringAIProvider = {
      ...mockAIProvider,
      evaluateFixTrustScore: () => Promise.resolve(20.0) // Unreasonably high
    };

    const score = await computeTrustScore(
      mockFixProposal,
      mockBugContext,
      mockEslintConfig,
      'test-trace-123',
      highScoringAIProvider
    );

    expect(score).toBe(10.0); // Capped at maximum
    expect(appendToFixContextAsync).toHaveBeenCalledWith(expect.stringContaining('Final trust score: 10.00'));
  });
}); 