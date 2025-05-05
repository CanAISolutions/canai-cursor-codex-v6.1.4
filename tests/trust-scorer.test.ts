/**
 * @file trust-scorer.test.ts
 * @description Validates trust scoring heuristics and AI integration for proposed fixes.
 */

import { scoreFix } from '../trust-scorer';
import { FixProposal, BugContext, AIProvider } from '../ai-provider';
import { appendToFixContextAsync } from '../fix-context-utils';
import { recordMetric } from '../telemetry';
import { jest } from '@jest/globals';

jest.mock('../fix-context-utils');
jest.mock('../telemetry');

describe('scoreFix', () => {
  const traceId = 'test-trust';
  const baseFix: FixProposal = {
    patch: 'diff --git a/file.js b/file.js\n--- a/file.js\n+++ b/file.js\n@@ ...',
    filepath: 'src/file.js',
    reason: 'Fix null pointer exception',
    confidence: 0.9,
  };

  const baseBug: BugContext = {
    message: 'Null reference error',
    type: 'NullPointer',
    likelihood: 'high',
    impact: ['src/file.js'],
    retryAttempts: 0,
  };

  const mockAIProvider: Partial<AIProvider> = {
    evaluateFixTrustScore: jest.fn().mockResolvedValue(8.0),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (appendToFixContextAsync as jest.Mock).mockResolvedValue(undefined);
    (recordMetric as jest.Mock).mockReturnValue(undefined);
  });

  it('returns a high trust score for ideal fix', async () => {
    const score = await scoreFix(baseFix, baseBug, mockAIProvider as AIProvider, traceId);
    expect(score).toBeGreaterThan(8);
    expect(recordMetric).toHaveBeenCalledWith(
      'fix_scored',
      expect.objectContaining({ traceId, finalScore: expect.any(Number) })
    );
  });

  it('penalizes large patches', async () => {
    const largePatch = { ...baseFix, patch: 'line\n'.repeat(120) };
    const score = await scoreFix(largePatch, baseBug, mockAIProvider as AIProvider, traceId);
    expect(score).toBeLessThan(8);
  });

  it('penalizes weak reasoning', async () => {
    const weakFix = { ...baseFix, reason: '' };
    const score = await scoreFix(weakFix, baseBug, mockAIProvider as AIProvider, traceId);
    expect(score).toBeLessThan(8);
  });

  it('rewards matching impacted file', async () => {
    const matchFix = { ...baseFix, filepath: 'src/file.js' };
    const score = await scoreFix(matchFix, baseBug, mockAIProvider as AIProvider, traceId);
    expect(score).toBeGreaterThan(5);
  });

  it('clamps score within 0–10 range', async () => {
    (mockAIProvider.evaluateFixTrustScore as jest.Mock).mockResolvedValue(20.0);
    const score = await scoreFix(baseFix, baseBug, mockAIProvider as AIProvider, traceId);
    expect(score).toBeLessThanOrEqual(10);
  });

  it('gracefully handles AI failure and logs fallback', async () => {
    (mockAIProvider.evaluateFixTrustScore as jest.Mock).mockRejectedValue(new Error('API error'));
    const score = await scoreFix(baseFix, baseBug, mockAIProvider as AIProvider, traceId);
    expect(score).toBeGreaterThan(0); // Should still be clamped and non-crashing
    expect(recordMetric).toHaveBeenCalledWith(
      'fix_score_failed',
      expect.objectContaining({ traceId, error: expect.any(String) })
    );
  });
});
