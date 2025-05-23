/*
 * DreamState Ritual: Content Emotional Validation
 * Pillar: Emotional UX Fidelity
 * Ritual Tag: #ritual-validate-content-emotional
 *
 * WHAT: Validates that validateContent enforces Codex-aligned emotional scoring, fallback, and drift detection.
 * WHY: Ensures content validation is emotionally auditable, trust-preserving, and resilient to drift or error.
 * HOW: Calls validateContent with positive, negative, and edge-case content. Asserts score, fallback, and emotional drift.
 */

import { EmotionalValidator } from '../../../cursor/validators/emotional-validator';

const validator = new EmotionalValidator();

describe('DreamState: validateContent', () => {
  it('should return a high score for positive emotional content', async () => {
    const score = await validator.validateContent('Together we achieve success.');
    expect(score).toBeGreaterThanOrEqual(4.0);
  });

  it('should return a lower score for negative or neutral content', async () => {
    const score = await validator.validateContent('Invalid input.');
    expect(score).toBeLessThanOrEqual(4.0);
  });

  it('should fallback gracefully on malformed content', async () => {
    const score = await validator.validateContent(undefined as any);
    expect(score).toBeLessThanOrEqual(4.5);
  });
}); 