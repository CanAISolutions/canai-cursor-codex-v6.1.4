/**
 * @file trust-scorer.test.ts
 * @description Validates trust scoring heuristics and AI integration for proposed fixes.
 */

import { computeTrustScore } from '../cursor/agents/debug/core/trust-scorer';
import { FixProposal, BugContext } from '../cursor/agents/debug/engines/ai-provider';
import { appendToFixContextAsync } from '../cursor/agents/debug/context/fix-context-utils';
import { recordMetric } from '../cursor/agents/debug/utils/telemetry';
import { jest } from '@jest/globals';

jest.mock('../cursor/agents/debug/context/fix-context-utils');
jest.mock('../cursor/agents/debug/utils/telemetry');

interface AIProvider {
  evaluateFixTrustScore: (fix: FixProposal, bug: BugContext, traceId: string) => Promise<number>;
  ping: () => Promise<void>;
  detectBug: (log: string, traceId: string) => Promise<BugContext>;
  proposeFix: (bug: BugContext, traceId: string) => Promise<FixProposal>;
  generateEscalationTicket: (input: { summary: string; sourceFile?: string; priority?: 'low' | 'medium' | 'high'; traceId?: string; }) => Promise<void>;
}

describe('computeTrustScore', () => {
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
    evaluateFixTrustScore: jest.fn<() => Promise<number>>().mockResolvedValue(8.0),
    ping: jest.fn<() => Promise<boolean>>().mockResolvedValue(true),
    detectBug: jest.fn<() => Promise<BugContext>>().mockResolvedValue({ message: '', type: 'NullPointer', likelihood: 'high', impact: [] }),
    proposeFix: jest.fn<() => Promise<FixProposal>>().mockResolvedValue(baseFix),
    generateEscalationTicket: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (appendToFixContextAsync as jest.Mock).mockResolvedValue(undefined);
    (recordMetric as jest.Mock).mockReturnValue(undefined);
    (mockAIProvider.evaluateFixTrustScore as jest.Mock).mockResolvedValue(20.0);
    (mockAIProvider.evaluateFixTrustScore as jest.Mock).mockRejectedValue(new Error('API error'));
  });

  it('returns a high trust score for ideal fix', async () => {
    const score = await computeTrustScore(baseFix, baseBug, { enabled: false, configFile: '', maxErrors: 0, errorPenalty: 0 }, traceId, mockAIProvider as AIProvider);
    expect(score).toBeGreaterThan(8);
    expect(recordMetric).toHaveBeenCalledWith(
      'fix_scored',
      expect.objectContaining({ traceId, finalScore: expect.any(Number) })
    );
  });

  it('penalizes large patches', async () => {
    const largePatch = { ...baseFix, patch: 'line\n'.repeat(120) };
    const score = await computeTrustScore(largePatch, baseBug, { enabled: false, configFile: '', maxErrors: 0, errorPenalty: 0 }, traceId, mockAIProvider as AIProvider);
    expect(score).toBeLessThan(8);
  });

  it('penalizes weak reasoning', async () => {
    const weakFix = { ...baseFix, reason: '' };
    const score = await computeTrustScore(weakFix, baseBug, { enabled: false, configFile: '', maxErrors: 0, errorPenalty: 0 }, traceId, mockAIProvider as AIProvider);
    expect(score).toBeLessThan(8);
  });

  it('rewards matching impacted file', async () => {
    const matchFix = { ...baseFix, filepath: 'src/file.js' };
    const score = await computeTrustScore(matchFix, baseBug, { enabled: false, configFile: '', maxErrors: 0, errorPenalty: 0 }, traceId, mockAIProvider as AIProvider);
    expect(score).toBeGreaterThan(5);
  });

  it('clamps score within 0–10 range', async () => {
    const score = await computeTrustScore(baseFix, baseBug, { enabled: false, configFile: '', maxErrors: 0, errorPenalty: 0 }, traceId, mockAIProvider as AIProvider);
    expect(score).toBeLessThanOrEqual(10);
  });

  it('gracefully handles AI failure and logs fallback', async () => {
    const score = await computeTrustScore(baseFix, baseBug, { enabled: false, configFile: '', maxErrors: 0, errorPenalty: 0 }, traceId, mockAIProvider as AIProvider);
    expect(score).toBeGreaterThan(0); // Should still be clamped and non-crashing
    expect(recordMetric).toHaveBeenCalledWith(
      'fix_score_failed',
      expect.objectContaining({ traceId, error: expect.any(String) })
    );
  });
});
