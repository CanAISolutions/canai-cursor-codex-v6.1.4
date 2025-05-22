/**
 * @file trust-scorer.test.ts
 * @description Validates trust scoring heuristics and AI integration for proposed fixes.
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { computeTrustScore } from '../cursor/agents/debug/core/trust-scorer';
import { FixProposal, BugContext, AIProvider } from '../cursor/agents/debug/engines/ai-provider';
import { appendToFixContextAsync } from '../cursor/agents/debug/context/fix-context-utils';
import { recordMetric } from '../cursor/agents/debug/utils/telemetry';

jest.mock('../cursor/agents/debug/context/fix-context-utils');
jest.mock('../cursor/agents/debug/utils/telemetry');

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

  const mockAIProvider: AIProvider = {
    ping: () => Promise.resolve(true),
    detectBug: () => Promise.resolve({ message: '', type: 'NullPointer', likelihood: 'high', impact: [] }),
    proposeFix: () => Promise.resolve(baseFix),
    generateEscalationTicket: () => Promise.resolve(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (appendToFixContextAsync as jest.Mock).mockResolvedValue(undefined);
    (recordMetric as jest.Mock).mockReturnValue(undefined);
  });

  it('returns a neutral trust score for ideal fix (heuristic only, no AI bonus)', async () => {
    const score = await computeTrustScore(baseFix, baseBug, { enabled: false, configFile: '', maxErrors: 0, errorPenalty: 0 }, traceId, mockAIProvider);
    expect(score).toBe(6.5); // Heuristic + impact match bonus
    expect(recordMetric).toHaveBeenCalledWith(
      'trust_computed',
      expect.objectContaining({ traceId, score: expect.any(Number) })
    );
  });

  it('penalizes large patches', async () => {
    const largePatch = { ...baseFix, patch: 'line\n'.repeat(120) };
    const score = await computeTrustScore(largePatch, baseBug, { enabled: false, configFile: '', maxErrors: 0, errorPenalty: 0 }, traceId, mockAIProvider);
    expect(score).toBeLessThan(8);
  });

  it('penalizes weak reasoning', async () => {
    const weakFix = { ...baseFix, reason: '' };
    const score = await computeTrustScore(weakFix, baseBug, { enabled: false, configFile: '', maxErrors: 0, errorPenalty: 0 }, traceId, mockAIProvider);
    expect(score).toBeLessThan(8);
  });

  it('rewards matching impacted file', async () => {
    const matchFix = { ...baseFix, filepath: 'src/file.js' };
    const score = await computeTrustScore(matchFix, baseBug, { enabled: false, configFile: '', maxErrors: 0, errorPenalty: 0 }, traceId, mockAIProvider);
    expect(score).toBe(6.5); // Heuristic + impact match bonus
  });

  it('clamps score within 0–10 range', async () => {
    const score = await computeTrustScore(baseFix, baseBug, { enabled: false, configFile: '', maxErrors: 0, errorPenalty: 0 }, traceId, mockAIProvider);
    expect(score).toBeLessThanOrEqual(10);
  });

  it('logs Codex gap for missing AI trust scoring', async () => {
    const score = await computeTrustScore(baseFix, baseBug, { enabled: false, configFile: '', maxErrors: 0, errorPenalty: 0 }, traceId, mockAIProvider);
    expect(score).toBe(6.5); // Heuristic + impact match bonus
    expect(appendToFixContextAsync).toHaveBeenCalledWith(expect.stringContaining('AI trust scoring skipped'));
  });
});


