/**
 * @file cursor-debug-agent.test.ts
 * @description Codex v6.1.4 – Tests the full debugging pipeline (AI detection, patch, PR, telemetry).
 */

import { runCursorDebugAgent } from '../cursor/agents/debug/cursor-debug-agent';
import { testOverrides as aiTestOverrides } from '../cursor/agents/debug/engines/ai-provider';
import { recordMetric, readMetrics, clearMetrics } from '../cursor/agents/debug/utils/telemetry';
import * as fs from 'fs';
import { jest } from '@jest/globals';
import { loadConfig } from 'config/loadConfig';

jest.mock('../cursor/agents/debug/utils/telemetry');
jest.mock('../cursor/agents/debug/context/fix-context-utils');
jest.mock('../cursor/agents/debug/utils/shell-utils');
jest.mock('../cursor/agents/debug/engines/ai-provider');

describe('runCursorDebugAgent', () => {
  const traceId = 'test-trace-001';

  beforeEach(async () => {
    aiTestOverrides.aiProvider = {
      ping: async () => true,
      detectBug: async () => ({
        message: 'Test bug',
        type: 'TypeError',
        impact: ['src/index.ts'],
        likelihood: 'high',
        retryAttempts: 0,
      }),
      proposeFix: async () => ({
        patch: 'diff --git a/src/index.ts b/src/index.ts\n--- a/src/index.ts\n+++ b/src/index.ts\n@@ ...',
        filepath: 'src/index.ts',
        reason: 'Fix example bug',
        confidence: 0.95,
      }),
      generateEscalationTicket: async () => {},
      evaluateFixTrustScore: async () => 8.8 as any // Not in interface, but used in test
    } as any;
    await clearMetrics();
  });

  it('should complete the full pipeline with valid input', async () => {
    const rawLog = 'TypeError: foo is not a function\n at src/index.ts:12:5';

    await runCursorDebugAgent({ rawLog, traceId });

    const metrics = await readMetrics();
    expect(metrics.length).toBeGreaterThan(0);
    expect(metrics.some(m => m.event === 'bug_detected')).toBe(true);
    expect(metrics.some(m => m.event === 'pipeline_completed')).toBe(true);
  });

  it('should fail on invalid log format', async () => {
    await expect(runCursorDebugAgent({ rawLog: '   ', traceId }))
      .rejects.toThrow('Invalid log format');
  });

  it('should escalate if trust score is below threshold', async () => {
    aiTestOverrides.aiProvider = {
      ...aiTestOverrides.aiProvider,
      evaluateFixTrustScore: async () => 2.0 as any
    } as any;

    await expect(runCursorDebugAgent({
      rawLog: 'ReferenceError: bar is undefined\n at x.ts:3:3',
      traceId,
    })).rejects.toThrow(/Trust score/);
  });

  it('should retry AI bug detection and fallback to inference', async () => {
    aiTestOverrides.aiProvider = {
      ...aiTestOverrides.aiProvider,
      detectBug: async () => { throw new Error('AI failure'); }
    } as any;

    await expect(runCursorDebugAgent({
      rawLog: 'SyntaxError: Unexpected token',
      traceId,
    })).resolves.toBeUndefined();
  });

  it('should throw on unsafe filepaths (e.g. /etc/passwd)', async () => {
    aiTestOverrides.aiProvider = {
      ...aiTestOverrides.aiProvider,
      proposeFix: async () => ({
        patch: 'diff --git a/etc/passwd b/etc/passwd\n@@ ...',
        filepath: '/etc/passwd',
        reason: 'Exploit test',
        confidence: 1,
      })
    } as any;

    await expect(runCursorDebugAgent({
      rawLog: 'Fake error targeting system file',
      traceId,
    })).rejects.toThrow('Patch modifies unexpected files');
  });
});
