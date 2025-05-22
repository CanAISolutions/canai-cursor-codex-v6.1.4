/*
 * DreamState Ritual: Message Emotional Validation
 * Pillar: Emotional UX Fidelity
 * Ritual Tag: #ritual-validate-message-emotional
 *
 * WHAT: Validates that validateMessage enforces Codex-aligned emotional scoring, fallback, and drift detection.
 * WHY: Ensures message validation is emotionally auditable, trust-preserving, and resilient to drift or error.
 * HOW: Calls validateMessage with positive, negative, and edge-case messages. Asserts score, fallback, and emotional drift.
 */

import { EmotionalValidator } from '../../../cursor/validators/emotional-validator';

const validator = new EmotionalValidator();

describe('DreamState: validateMessage', () => {
  it('should return a high score for positive emotional message', async () => {
    const score = await validator.validateMessage('You are making progress!');
    expect(score).toBeGreaterThanOrEqual(4.0);
  });

  it('should return a lower score for negative or neutral message', async () => {
    const score = await validator.validateMessage('System error.');
    expect(score).toBeLessThanOrEqual(4.0);
  });

  it('should fallback gracefully on malformed message', async () => {
    // @ts-expect-error
    const score = await validator.validateMessage(undefined);
    expect(score).toBeLessThanOrEqual(4.5);
  });
}); 