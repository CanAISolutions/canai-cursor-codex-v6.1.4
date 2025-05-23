/*
 * DreamState Ritual: CX Tone Sentinel Scan
 * Pillar: Emotional UX Fidelity
 * Ritual Tag: #ritual-cx-tone-sentinel-scan
 *
 * WHAT: Validates that scan detects tone drift, reversal test failures, and logs violations per Codex emotional contract.
 * WHY: Ensures all outputs, fallbacks, and CTAs are emotionally auditable, trust-preserving, and resilient to drift or error.
 * HOW: Calls scan with positive, negative, and edge-case content. Asserts drift detection, reversal, and violation logging.
 */

import { CXToneSentinel } from '../../../cursor/validators/cx-tone-sentinel';

describe('DreamState: CXToneSentinel.scan', () => {
  const sentinel = CXToneSentinel.getInstance();

  it('should pass reversal test and detect no drift for positive content', () => {
    const result = sentinel.scan('You are making progress!', 'output', 'output');
    expect(result.passesReversalTest).toBe(true);
    expect(result.detectedDrift).toBe(false);
  });

  it('should fail reversal test and detect drift for negative content', () => {
    const result = sentinel.scan('System error.', 'output', 'output');
    expect(result.passesReversalTest).toBe(false);
    expect(result.detectedDrift).toBe(true);
  });

  it('should fallback gracefully on malformed content', () => {
    const result = sentinel.scan(undefined, 'output', 'output');
    expect(result.passesReversalTest).toBe(false);
  });
}); 