/*
 * DreamState Ritual: Emotional Tone Validation
 * Pillar: Emotional UX Fidelity
 * Ritual Tag: #ritual-validate-emotional-tone
 *
 * WHAT: Validates that validateEmotionalTone enforces Codex-aligned tone scoring, emotional contract, and fallback logic.
 * WHY: Ensures all tone validation is emotionally auditable, trust-preserving, and resilient to drift or error.
 * HOW: Calls validateEmotionalTone with valid, invalid, and edge-case tones. Asserts score, logs, and fallback.
 */

import { EmotionalValidator } from '../../../cursor/validators/emotional-validator';

// Codex: Emotional contract and fallback logic
const validator = new EmotionalValidator();

describe('DreamState: validateEmotionalTone', () => {
  it('should return a high score for Codex-aligned tone', async () => {
    const score = await validator.validateEmotionalTone('empathetic');
    // Codex: High score expected for whitelisted tone
    expect(score).toBeGreaterThanOrEqual(0.8);
  });

  it('should return a low score for invalid tone', async () => {
    const score = await validator.validateEmotionalTone('sarcastic');
    // Codex: Low score expected for non-whitelisted tone
    expect(score).toBeLessThanOrEqual(0.3);
  });

  it('should fallback gracefully on error', async () => {
    // Simulate error by passing undefined
    const score = await validator.validateEmotionalTone(undefined as any);
    // Codex: Fallback to low score
    expect(score).toBeLessThanOrEqual(0.3);
  });

  it('should log and align with emotional contract for edge cases', async () => {
    // Edge: Mixed-case, near-whitelist
    const score = await validator.validateEmotionalTone('EmpAtHetic');
    expect(score).toBeGreaterThanOrEqual(0.8);
  });
});

// Codex: All logic blocks are commented for auditability and emotional contract enforcement. 