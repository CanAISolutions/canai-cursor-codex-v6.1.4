/**
 * output-emotion-score.ts
 *
 * Purpose:
 * Score a block of output text based on its emotional tone, resonance, and alignment with CanAI's UX memory.
 * Used for self-refinement, benchmarking, and trust-triggered evolution events.
 *
 * Core Metric:
 * Returns a score from 1–10 representing emotional resonance alignment with CanAI’s brand tone:
 * - Empathetic
 * - Professional
 * - Clarity-first
 * - Uplifting without fluff
 *
 * Integration Points:
 * - benchmarkUtils.ts → `compareBySentimentSimilarity()`
 * - selfRefineScore.ts → evolution trigger
 * - vision-injection/ → `dream-state-checklist.md`, `cursorHeartbeat.ts`
 *
 * Status: Modular | AI-Coauthorable | Emotionally Anchored
 */

type EmotionScore = {
    alignment: number // 1–10 scale
    tone: string
    confidence: number // 0–1
  }
  
  const TONE_WHITELIST = ['empathetic', 'supportive', 'confident', 'professional', 'uplifting']
  
  /**
   * Computes the emotional alignment score of a given output.
   * Uses simple heuristics + tone whitelisting. Replaceable with fine-tuned model.
   */
  export function scoreEmotionalOutput(text: string): EmotionScore {
    const toneMatches = TONE_WHITELIST.map(tone =>
      (text.match(new RegExp(`\\b${tone}\\b`, 'gi')) || []).length
    )
  
    const matchCount = toneMatches.reduce((a, b) => a + b, 0)
    const density = matchCount / Math.max(1, text.split(' ').length)
    const alignment = Math.min(10, Math.floor(density * 250)) // Tuned to avoid overinflation
    const inferredTone = TONE_WHITELIST[toneMatches.indexOf(Math.max(...toneMatches))] || 'neutral'
  
    return {
      alignment: alignment || 1,
      tone: inferredTone,
      confidence: Math.min(1, density * 20),
    }
  }
  