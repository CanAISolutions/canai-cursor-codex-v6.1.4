/*
 * DreamState Ritual: Trust Score Threshold Validation
 * Pillar: Trust & Operational Resilience
 * Ritual Tag: #ritual-validate-trust-score-threshold
 *
 * WHAT: Validates that validateTrustScore enforces Codex-aligned trust threshold, fallback, and breach detection.
 * WHY: Ensures trust validation is emotionally auditable, trust-preserving, and resilient to drift or error.
 * HOW: Calls validateTrustScore with above, below, and edge-case scores. Asserts threshold, fallback, and trust breach.
 */

import { TrustScoreCalculator } from '../../../cursor/validators/trust-score';

describe('DreamState: validateTrustScore', () => {
  const calculator = new TrustScoreCalculator();

  it('should return true for score above threshold', async () => {
    const result = await calculator.validateTrustScore(4.5);
    expect(result).toBe(true);
  });

  it('should return false for score below threshold', async () => {
    const result = await calculator.validateTrustScore(3.5);
    expect(result).toBe(false);
  });

  it('should fallback gracefully on malformed score', async () => {
    const result = await calculator.validateTrustScore(undefined);
    expect(result).toBe(false);
  });
}); 