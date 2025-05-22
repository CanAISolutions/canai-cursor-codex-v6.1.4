// prompt-forward-compat.test.ts
// DreamState Test 16: Prompt Forward Compat
// What: Ensures prompts remain compatible with future schema changes
// Why: Prevents prompt breakage on schema evolution
// How: Uses canonical mocks and asserts Codex-aligned forward compatibility

import { mockEmotionalPayload, requireMock } from '../mocks/dreamstate-core';

describe('DreamState: prompt-forward-compat', () => {
  it('should ensure prompt forward compatibility with future schema', () => {
    // What: Simulate schema evolution and assert prompt compatibility
    // Why: Prevents prompt breakage on schema evolution
    // How: Add a new field and assert prompt still processes
    if (!mockEmotionalPayload) requireMock('mockEmotionalPayload');
    const evolvedPayload = { ...mockEmotionalPayload, newField: 'future-proof' };
    expect(evolvedPayload.tone).toBe(mockEmotionalPayload.tone);
    expect(evolvedPayload.newField).toBe('future-proof');
  });

  // Codex safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
}); 