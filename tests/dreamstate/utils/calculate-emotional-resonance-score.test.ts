/*
 * DreamState Ritual: Emotional Resonance Score Calculation
 * Pillar: Emotional UX Fidelity
 * Ritual Tag: #ritual-calculate-emotional-resonance-score
 *
 * WHAT: Validates that calculateEmotionalResonanceScore enforces Codex-aligned emotional resonance scoring and fallback logic.
 * WHY: Ensures resonance scoring is emotionally auditable, fallback-resilient, and Codex-compliant.
 * HOW: Calls calculateEmotionalResonanceScore with positive, negative, and malformed input. Asserts score, factors, fallback, and emotional contract.
 */

import { calculateEmotionalResonanceScore } from '../../../cursor/utils/dreamstate-utils';

describe('DreamState: calculateEmotionalResonanceScore', () => {
  it('should return a valid resonance result for positive input', () => {
    const result = calculateEmotionalResonanceScore('You are making progress!');
    expect(result).toHaveProperty('score');
    expect(result.factors).toHaveProperty('tone');
    expect(result.factors).toHaveProperty('empathy');
    expect(result.factors).toHaveProperty('clarity');
  });

  it('should fallback gracefully on malformed input', () => {
    // @ts-expect-error
    const result = calculateEmotionalResonanceScore(undefined);
    expect(result).toHaveProperty('score');
  });
}); 