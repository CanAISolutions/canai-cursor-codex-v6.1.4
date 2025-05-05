/**
 * @file fix-log.test.ts
 * @description Validates structured trace logging and telemetry metrics for debugging pipeline.
 */

import { runCursorDebugAgent } from '../cursor/agents/debug/cursor-debug-agent';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const CONTEXT_DIR = '.canai-context';
const FIX_LOG = 'fix.log';
const METRICS_FILE = 'metrics.json';

describe('FixContext + Telemetry Logging', () => {
  const rawLog = 'TypeError: Cannot read properties of undefined\n    at src/test.ts:10:5';
  const traceId = `test-${Date.now()}`;

  it('writes entries to fix.log with correct traceId', async () => {
    await runCursorDebugAgent({ rawLog, traceId });

    const filePath = join(CONTEXT_DIR, FIX_LOG);
    expect(existsSync(filePath)).toBe(true);

    const content = readFileSync(filePath, 'utf8');
    expect(content).toContain(`[${traceId}]`);
    expect(content).toMatch(/bug|patch|PR|score/i);
  });

  it('writes structured metrics to metrics.json', () => {
    const filePath = join(CONTEXT_DIR, METRICS_FILE);
    expect(existsSync(filePath)).toBe(true);

    const content = readFileSync(filePath, 'utf8').trim();
    const lines = content.split('\n').filter(Boolean);

    expect(lines.length).toBeGreaterThan(0);

    const sample = JSON.parse(lines[lines.length - 1]);
    expect(sample).toHaveProperty('timestamp');
    expect(sample).toHaveProperty('metricName');
    expect(sample).toHaveProperty('traceId');
  });
});
