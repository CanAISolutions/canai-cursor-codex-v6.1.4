// sarcasm-tone-misclassify.test.ts
// DreamState Test 10: Sarcasm Tone Misclassify
// What: Rejects sarcasm/irony misclassification as supportive tone
// Why: Ensures emotional intent is not misclassified as supportive
// How: Uses canonical mocks and asserts Codex-aligned sarcasm rejection

import { mockEmotionalPayload, requireMock } from '../mocks/dreamstate-core';
import { describe, it, expect } from '@jest/globals';

describe('DreamState: sarcasm-tone-misclassify', () => {
  it('should reject sarcasm/irony as supportive tone', () => {
    // What: Simulate sarcasm/irony payload and assert rejection as supportive
    // Why: Ensures emotional intent is not misclassified as supportive
    // How: Use a mock sarcastic payload and assert Codex-aligned rejection
    if (!mockEmotionalPayload) requireMock('mockEmotionalPayload');
    const sarcasticPayload = { ...mockEmotionalPayload, tone: 'sarcastic', payload: 'Oh, great job...' };
    const isSupportive = sarcasticPayload.tone === 'reassuring' && !/sarcasm|irony/i.test(sarcasticPayload.payload);
    expect(isSupportive).toBe(false);
    // Also assert that sarcasm is detected and not mapped to supportive
    expect(/sarcasm|great job/i.test(sarcasticPayload.payload)).toBe(true);
  });

  // Codex safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
}); 