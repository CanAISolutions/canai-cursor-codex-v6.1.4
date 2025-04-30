// /tests/sessionRefactorLogWriter.test.ts

import fs from 'fs';
import path from 'path';
import { appendSessionRefactorLog, loadSessionRefactorLog, SessionRefactorEntry } from '../cursor/system-intel/sessionRefactorLogWriter';

const TEST_LOG_PATH = path.resolve(__dirname, '../cursor/system-intel/sessionRefactorLog.json');

describe('sessionRefactorLogWriter', () => {
  const testSessionId = `test-${Date.now()}`;
  const beforeAudit = {
    modularityScore: 0.82,
    emotionalResonanceScore: 78,
    uxConsistencyScore: 0.72,
    directiveCoverage: {
      total: 10,
      covered: 8,
      percent: 80.0,
      missing: ['Tone Enforcement', 'Golden Rule Enforcement']
    },
    summary: ['Low cohesion', 'Tone underpowered']
  };

  const afterAudit = {
    modularityScore: 0.91,
    emotionalResonanceScore: 90,
    uxConsistencyScore: 0.87,
    directiveCoverage: {
      total: 10,
      covered: 10,
      percent: 100.0,
      missing: []
    },
    summary: ['Modularity restored', 'Emotional tone upgraded']
  };

  it('should append a valid session refactor log entry', () => {
    appendSessionRefactorLog({
      sessionId: testSessionId,
      promptType: 'ai_blueprint',
      revisionType: 'prompt-evolution',
      initiator: 'unit-test',
      before: beforeAudit,
      after: afterAudit,
      notes: ['Test run with synthetic values']
    });

    const log = loadSessionRefactorLog();
    const latest: SessionRefactorEntry = log[log.length - 1];

    expect(latest.sessionId).toBe(testSessionId);
    expect(latest.revisionId).toBeDefined();
    expect(latest.timestamp).toBeGreaterThan(0);
    expect(latest.timestampIso).toMatch(/^20/);
    expect(latest.deltaSummary.modularityDelta).toBeCloseTo(0.09, 2);
    expect(latest.deltaSummary.emotionalDelta).toBe(12);
    expect(latest.deltaSummary.directiveDelta).toBeCloseTo(20.0, 1);
    expect(latest.notes.length).toBeGreaterThan(0);
  });

  afterAll(() => {
    // Optional cleanup: remove test log entry
    const log = loadSessionRefactorLog();
    const trimmed = log.filter(e => e.sessionId !== testSessionId);
    fs.writeFileSync(TEST_LOG_PATH, JSON.stringify(trimmed, null, 2));
  });
});
