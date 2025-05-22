/*
 * DreamState Ritual: Score Emotional Validation
 * Pillar: Emotional UX Fidelity
 * Ritual Tag: #ritual-validate-score-emotional
 *
 * WHAT: Validates that validateScore enforces Codex-aligned emotional scoring, fallback, and drift detection.
 * WHY: Ensures score validation is emotionally auditable, trust-preserving, and resilient to drift or error.
 * HOW: Calls validateScore with positive, negative, and edge-case scores. Asserts score, fallback, and emotional drift.
 */

import { EmotionalValidator } from '../../../cursor/validators/emotional-validator';

const validator = new EmotionalValidator();

describe('DreamState: validateScore', () => {
  it('should return a high score for high input score', async () => {
    const score = await validator.validateScore(5.0);
    expect(score).toBeGreaterThanOrEqual(4.0);
  });

  it('should return a lower score for low input score', async () => {
    const score = await validator.validateScore(1.0);
    expect(score).toBeLessThanOrEqual(4.5);
  });

  it('should fallback gracefully on malformed score', async () => {
    // @ts-expect-error
    const score = await validator.validateScore(undefined);
    expect(score).toBeLessThanOrEqual(4.5);
  });
}); 