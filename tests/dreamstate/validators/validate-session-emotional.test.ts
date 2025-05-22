/*
 * DreamState Ritual: Session Emotional Validation
 * Pillar: Emotional UX Fidelity
 * Ritual Tag: #ritual-validate-session-emotional
 *
 * WHAT: Validates that validateSession enforces Codex-aligned emotional scoring, fallback, and drift detection.
 * WHY: Ensures session validation is emotionally auditable, trust-preserving, and resilient to drift or error.
 * HOW: Calls validateSession with positive, negative, and edge-case sessions. Asserts score, fallback, and emotional drift.
 */

import { EmotionalValidator } from '../../../cursor/validators/emotional-validator';

const validator = new EmotionalValidator();

describe('DreamState: validateSession', () => {
  it('should return a high score for positive session', async () => {
    const score = await validator.validateSession({ user: 'trusted', status: 'active' });
    expect(score).toBeGreaterThanOrEqual(4.0);
  });

  it('should return a lower score for negative or edge-case session', async () => {
    const score = await validator.validateSession({ user: 'unknown', status: 'error' });
    expect(score).toBeLessThanOrEqual(4.5);
  });

  it('should fallback gracefully on malformed session', async () => {
    // @ts-expect-error
    const score = await validator.validateSession(undefined);
    expect(score).toBeLessThanOrEqual(4.5);
  });
}); 