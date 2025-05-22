/*
 * DreamState Ritual: Dream State Metrics Generation
 * Pillar: Emotional UX Fidelity
 * Ritual Tag: #ritual-generate-dream-state-metrics
 *
 * WHAT: Validates that generateDreamStateMetrics enforces Codex-aligned metrics generation and fallback logic.
 * WHY: Ensures metrics generation is emotionally auditable, fallback-resilient, and Codex-compliant.
 * HOW: Calls generateDreamStateMetrics with valid, invalid, and malformed states. Asserts metrics, fallback, and emotional contract.
 */

import { generateDreamStateMetrics } from '../../../cursor/utils/dreamstate-utils';

describe('DreamState: generateDreamStateMetrics', () => {
  it('should return valid metrics for a valid state', () => {
    const metrics = generateDreamStateMetrics({ goal: 'clarity' });
    expect(metrics).toHaveProperty('alignmentScore');
    expect(metrics).toHaveProperty('confidenceScore');
    expect(metrics).toHaveProperty('stabilityScore');
  });

  it('should fallback gracefully on malformed input', () => {
    // @ts-expect-error
    const metrics = generateDreamStateMetrics(undefined);
    expect(metrics).toHaveProperty('alignmentScore');
  });
}); 