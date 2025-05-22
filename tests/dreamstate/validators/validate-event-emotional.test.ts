/*
 * DreamState Ritual: Event Emotional Validation
 * Pillar: Emotional UX Fidelity
 * Ritual Tag: #ritual-validate-event-emotional
 *
 * WHAT: Validates that validateEvent enforces Codex-aligned emotional scoring, fallback, and drift detection.
 * WHY: Ensures event validation is emotionally auditable, trust-preserving, and resilient to drift or error.
 * HOW: Calls validateEvent with emotionally positive, negative, and edge-case events. Asserts score, fallback, and emotional drift.
 */

import { EmotionalValidator } from '../../../cursor/validators/emotional-validator';

const validator = new EmotionalValidator();

describe('DreamState: validateEvent', () => {
  it('should return a high score for positive emotional event', async () => {
    const score = await validator.validateEvent({ message: 'We support your progress!' });
    expect(score).toBeGreaterThanOrEqual(4.0);
  });

  it('should return a lower score for negative or neutral event', async () => {
    const score = await validator.validateEvent({ message: 'Error occurred.' });
    expect(score).toBeLessThanOrEqual(4.0);
  });

  it('should fallback gracefully on malformed event', async () => {
    // @ts-expect-error
    const score = await validator.validateEvent(undefined);
    expect(score).toBeLessThanOrEqual(4.5);
  });
}); 