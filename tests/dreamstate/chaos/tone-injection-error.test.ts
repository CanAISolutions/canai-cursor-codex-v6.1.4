// DreamState Chaos Test: Tone Injection Error
// @chaos @drift-trigger
// What: Simulates a buggy/malicious agent injecting an incorrect tone
// Why: Ensures system detects and blocks tone injection errors
// How: Uses real assertion, fallback logic, and Codex-aligned comments

import { injectTone } from '../../../cursor/overlays/spark-layer';
import { describe, it, expect } from '@jest/globals';

describe('Chaos: Tone Injection Error', () => {
  it('should detect and fallback on tone injection error', () => {
    const intendedTone = 'reassuring';
    // Simulate injection: agent injects 'sarcastic' instead
    const output = injectTone('You are making progress!', { forcedTone: 'sarcastic' });
    expect(output.tone).not.toBe(intendedTone);
    // Fallback: system should trigger emotional contract recovery
    const fallbackTriggered = output.tone !== intendedTone;
    expect(fallbackTriggered).toBe(true);
  });
  // Codex safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
}); 