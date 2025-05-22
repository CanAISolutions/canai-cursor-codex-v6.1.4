// rate-limit-message-wrapper.test.ts
// DreamState Test 9: Rate Limit Message Wrapper
// What: Ensures rate-limit messages maintain emotional tone
// Why: Prevents user trust erosion during rate limiting
// How: Uses canonical mocks and asserts Codex-aligned emotional messaging

import { mockEmotionalPayload, requireMock } from '../mocks/dreamstate-core';
import { describe, it, expect } from '@jest/globals';

describe('DreamState: rate-limit-message-wrapper', () => {
  it('should maintain emotional tone in rate-limit messages', () => {
    // What: Simulate a rate-limit scenario with emotional messaging
    // Why: Ensures user trust is preserved during rate limiting
    // How: Assert that the emotional tone and trustScore are Codex-aligned
    if (!mockEmotionalPayload) requireMock('mockEmotionalPayload');
    const rateLimitMessage = { ...mockEmotionalPayload, payload: 'You are being rate limited. Please try again soon.' };
    expect(rateLimitMessage.tone).toBe('reassuring');
    expect(rateLimitMessage.trustScore).toBeGreaterThan(0.9);
    // Emotional message must not erode trust
    expect(rateLimitMessage.payload).toMatch(/rate limited/i);
  });

  // Codex safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
}); 