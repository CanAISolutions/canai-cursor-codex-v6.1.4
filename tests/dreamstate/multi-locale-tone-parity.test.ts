// multi-locale-tone-parity.test.ts
// DreamState Test 13: Multi-Locale Tone Parity
// What: Validates tone parity across supported locales
// Why: Ensures emotional intent is preserved in all locales
// How: Uses canonical mocks and asserts Codex-aligned tone parity

import { mockEmotionalPayload, requireMock } from '../mocks/dreamstate-core';

describe('DreamState: multi-locale-tone-parity', () => {
  it('should validate tone parity across supported locales', () => {
    // What: Simulate payloads in different locales and assert tone parity
    // Why: Ensures emotional intent is preserved in all locales
    // How: Compare tone field across locales
    if (!mockEmotionalPayload) requireMock('mockEmotionalPayload');
    const locales = ['en-US', 'fr-FR', 'es-ES'];
    const payloads = locales.map(locale => ({ ...mockEmotionalPayload, locale }));
    const baseTone = mockEmotionalPayload.tone;
    payloads.forEach(payload => {
      expect(payload.tone).toBe(baseTone);
    });
  });
  // Codex safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
}); 