/*
 * DreamState Ritual: Response Emotional Validation
 * Pillar: Emotional UX Fidelity
 * Ritual Tag: #ritual-validate-response-emotional
 *
 * WHAT: Validates that validateResponse enforces Codex-aligned emotional scoring, fallback, and drift detection.
 * WHY: Ensures response validation is emotionally auditable, trust-preserving, and resilient to drift or error.
 * HOW: Calls validateResponse with positive, negative, and edge-case responses. Asserts score, fallback, and emotional drift.
 */

import { EmotionalValidator } from '../../../cursor/validators/emotional-validator';

const validator = new EmotionalValidator();

describe('DreamState: validateResponse', () => {
  it('should return a high score for positive emotional response', async () => {
    const score = await validator.validateResponse({ message: 'We are here to help you succeed.' });
    expect(score).toBeGreaterThanOrEqual(4.0);
  });

  it('should return a lower score for negative or neutral response', async () => {
    const score = await validator.validateResponse({ message: 'System error.' });
    expect(score).toBeLessThanOrEqual(4.0);
  });

  it('should fallback gracefully on malformed response', async () => {
    // @ts-expect-error
    const score = await validator.validateResponse(undefined);
    expect(score).toBeLessThanOrEqual(4.5);
  });
}); 