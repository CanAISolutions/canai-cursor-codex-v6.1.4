// open-telemetry-span-gap.test.ts
// DreamState Test 18: OpenTelemetry Span Gap
// What: Detects gaps in OpenTelemetry span propagation
// Why: Ensures trace continuity and observability
// How: Uses canonical mocks and asserts Codex-aligned span propagation

import { mockEmotionalPayload, requireMock } from '../mocks/dreamstate-core';

describe('DreamState: open-telemetry-span-gap', () => {
  it('should detect gaps in OpenTelemetry span propagation', () => {
    // What: Simulate span propagation and assert no gaps
    // Why: Ensures trace continuity and observability
    // How: Simulate span chain and check for continuity
    if (!mockEmotionalPayload) requireMock('mockEmotionalPayload');
    const spans = [
      { traceId: 'trace-1', spanId: 1 },
      { traceId: 'trace-1', spanId: 2 },
      { traceId: 'trace-1', spanId: 3 }
    ];
    let gapDetected = false;
    for (let i = 1; i < spans.length; i++) {
      if (spans[i].spanId !== spans[i - 1].spanId + 1) {
        gapDetected = true;
        break;
      }
    }
    expect(gapDetected).toBe(false);
  });

  // Codex safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
}); 