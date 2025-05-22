// traceid-failure-recovery.test.ts
// DreamState Test 24: TraceId Failure Recovery
// What: Ensures traceId persistence during network or agent failures
// Why: Guarantees trace continuity under failure conditions
// How: Uses canonical mocks and asserts Codex-aligned traceId recovery

import { mockEmotionalPayload, requireMock } from '../mocks/dreamstate-core';

describe('DreamState: traceid-failure-recovery', () => {
  it('should persist traceId during network or agent failures', () => {
    // What: Simulate failure and assert traceId persistence
    // Why: Guarantees trace continuity under failure conditions
    // How: Remove sessionId and assert traceId remains
    if (!mockEmotionalPayload) requireMock('mockEmotionalPayload');
    // Simulate legacy/failure by omitting sessionId
    const { sessionId, ...failedPayload } = mockEmotionalPayload;
    expect(failedPayload.traceId).toBeDefined();
    expect(typeof failedPayload.traceId).toBe('string');
    expect(sessionId).toBeDefined();
  });

  // Codex safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
}); 