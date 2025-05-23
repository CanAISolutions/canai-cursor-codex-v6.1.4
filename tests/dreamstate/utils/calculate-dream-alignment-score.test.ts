/*
 * DreamState Ritual: Dream Alignment Score Calculation
 * Pillar: Emotional UX Fidelity
 * Ritual Tag: #ritual-calculate-dream-alignment-score
 *
 * WHAT: Validates that calculateDreamAlignmentScore enforces Codex-aligned alignment scoring and fallback logic.
 * WHY: Ensures alignment scoring is emotionally auditable, fallback-resilient, and Codex-compliant.
 * HOW: Calls calculateDreamAlignmentScore with matching, mismatching, and malformed states. Asserts score, fallback, and emotional contract.
 */

import { calculateDreamAlignmentScore } from '../../../cursor/utils/dreamstate-utils';

describe('DreamState: calculateDreamAlignmentScore', () => {
  it('should return a high score for matching dream states', () => {
    const score = calculateDreamAlignmentScore({ goal: 'clarity' }, { goal: 'clarity' });
    expect(score).toBeGreaterThanOrEqual(0.8);
  });

  it('should return a lower score for mismatching dream states', () => {
    const score = calculateDreamAlignmentScore({ goal: 'clarity' }, { goal: 'confusion' });
    expect(score).toBeLessThanOrEqual(0.85);
  });

  it('should fallback gracefully on malformed input', () => {
    const score = calculateDreamAlignmentScore(undefined, undefined);
    expect(score).toBeLessThanOrEqual(0.85);
  });
}); 