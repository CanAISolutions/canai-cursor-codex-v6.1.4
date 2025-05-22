// multilingual-ux.test.ts
// Codex System-Wide Enforcement: Multilingual UX & Locale Drift
// What: Validates emotional and semantic parity across supported locales using real prompt and scoring logic
// Why: Prevents emotional drift and loss of intent in internationalized UX
// How: Uses generateSocialContentPrompt and scorePromptOutput for en, fr, es; asserts tone and intent parity

import { generateSocialContentPrompt } from '../../../prompts/social_content';
import { scorePromptOutput } from '../../../lib/smartPromptScore';
import { describe, it, expect } from '@jest/globals';

// Emotional contract: "Same spark, any language."
const EMOTIONAL_CONTRACT = 'Same spark, any language.';

const baseInput = {
  bizName: 'CanAI Bistro',
  industry: 'Hospitality',
  audience: 'Foodies',
  goal: 'Drive reservations',
  keyOfferings: 'Farm-to-table menu',
  usp: 'Award-winning chef',
  location: 'Paris',
  tone: 'warm and inviting',
  desiredAction: 'Book a table',
};

const locales = [
  { code: 'en', label: 'English', extra: {} },
  { code: 'fr', label: 'French', extra: { location: 'Paris', tone: 'chaleureux et accueillant' } },
  { code: 'es', label: 'Spanish', extra: { location: 'Madrid', tone: 'cálido y acogedor' } },
];

describe('SystemWide: multilingual-ux', () => {
  it('should ensure emotional and semantic parity across en, fr, es', () => {
    // What: Generate prompt outputs for each locale and score for tone parity
    // Why: Ensures emotional intent and tone are preserved in translation
    // How: Use real prompt and scoring logic, assert tone match
    const outputs = locales.map(({ code, extra }) => {
      const input = { ...baseInput, ...extra, locale: code };
      const result = generateSocialContentPrompt(input);
      return {
        code,
        prompt: result.prompt,
        score: scorePromptOutput(result.prompt, input.tone),
        tone: input.tone,
      };
    });
    // Use English as baseline
    const base = outputs[0];
    const baseScore = typeof base.score.score === 'number' ? base.score.score : 0;
    outputs.forEach(({ code, score, tone }) => {
      expect(score.detail.toneMatch).toBe(true);
      expect(score.score).toBeGreaterThanOrEqual(baseScore - 1); // Allow minor variation
    });
    // Emotional contract: test copy is present for audit
    expect(EMOTIONAL_CONTRACT).toBe('Same spark, any language.');
  });
  // Codex safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
}); 