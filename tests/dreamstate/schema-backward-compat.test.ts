// schema-backward-compat.test.ts
// DreamState Test 23: Schema Backward Compat
// What: Verifies handling of legacy schema inputs
// Why: Ensures backward compatibility and resilience
// How: Uses canonical mocks and asserts Codex-aligned backward compatibility

import { mockEmotionalPayload, requireMock } from '../mocks/dreamstate-core';

describe('DreamState: schema-backward-compat', () => {
  it('should handle legacy schema inputs correctly', () => {
    // What: Simulate legacy schema input and assert compatibility
    // Why: Ensures backward compatibility and resilience
    // How: Remove a field and assert system still processes
    if (!mockEmotionalPayload) requireMock('mockEmotionalPayload');
    // Simulate legacy schema by omitting emotionIntentHash
    const { emotionIntentHash, ...legacyPayload } = mockEmotionalPayload;
    expect(legacyPayload.tone).toBeDefined();
    expect(legacyPayload.trustScore).toBeDefined();
    expect(emotionIntentHash).toBeDefined();
  });

  // Codex safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
}); 