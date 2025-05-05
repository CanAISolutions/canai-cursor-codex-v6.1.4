/**
 * @file cursor-debug-agent.test.ts
 * @description Codex v6.1.4 – Tests the full debugging pipeline (AI detection, patch, PR, telemetry).
 */

import { runCursorDebugAgent } from '../cursor/agents/debug/cursor-debug-agent';
import { testOverrides as aiTestOverrides } from '../cursor/agents/debug/engines/ai-provider';
import { recordMetric, readMetrics, clearMetrics } from '../cursor/agents/debug/utils/telemetry';
import * as fs from 'fs';
import { jest } from '@jest/globals';

jest.mock('../cursor/agents/debug/utils/telemetry');
jest.mock('../cursor/agents/debug/utils/fix-context-utils');
jest.mock('../cursor/agents/debug/utils/shell-utils');
jest.mock('../cursor/agents/debug/engines/ai-provider');

describe('runCursorDebugAgent', () => {
  const traceId = 'test-trace-001';

  beforeEach(async () => {
    aiTestOverrides.detectBugs = async () => ({
      message: 'Test bug',
      type: 'TypeError',
      impact: ['src/index.ts'],
      likelihood: 'high',
      retryAttempts: 0,
    });

    aiTestOverrides.proposeFix = async () => ({
      patch: 'diff --git a/src/index.ts b/src/index.ts\n--- a/src/index.ts\n+++ b/src/index.ts\n@@ ...',
      filepath: 'src/index.ts',
      reason: 'Fix example bug',
      confidence: 0.95,
    });

    aiTestOverrides.evaluateFixTrustScore = async () => 8.8;

    aiTestOverrides.generateEscalationTicket = async () => {};

    await clearMetrics();
  });

  it('should complete the full pipeline with valid input', async () => {
    const rawLog = 'TypeError: foo is not a function\n at src/index.ts:12:5';

    await runCursorDebugAgent({ rawLog, traceId });

    const metrics = await readMetrics();
    expect(metrics.length).toBeGreaterThan(0);
    expect(metrics.some(m => m.metricName === 'bug_detected')).toBe(true);
    expect(metrics.some(m => m.metricName === 'pipeline_completed')).toBe(true);
  });

  it('should fail on invalid log format', async () => {
    await expect(runCursorDebugAgent({ rawLog: '   ', traceId }))
      .rejects.toThrow('Invalid log format');
  });

  it('should escalate if trust score is below threshold', async () => {
    aiTestOverrides.evaluateFixTrustScore = async () => 2.0; // Simulate low trust

    await expect(runCursorDebugAgent({
      rawLog: 'ReferenceError: bar is undefined\n at x.ts:3:3',
      traceId,
    })).rejects.toThrow(/Trust score/);
  });

  it('should retry AI bug detection and fallback to inference', async () => {
    aiTestOverrides.detectBugs = async () => {
      throw new Error('AI failure');
    };

    await expect(runCursorDebugAgent({
      rawLog: 'SyntaxError: Unexpected token',
      traceId,
    })).resolves.toBeUndefined();
  });

  it('should throw on unsafe filepaths (e.g. /etc/passwd)', async () => {
    aiTestOverrides.proposeFix = async () => ({
      patch: 'diff --git a/etc/passwd b/etc/passwd\n@@ ...',
      filepath: '/etc/passwd',
      reason: 'Exploit test',
      confidence: 1,
    });

    await expect(runCursorDebugAgent({
      rawLog: 'Fake error targeting system file',
      traceId,
    })).rejects.toThrow('Patch modifies unexpected files');
  });
});
