/**
 * @file /cursor/accelerators/tone-override-agent/tone-overrider.ts
 * @purpose Evaluate tone misalignment and suggest an override tone profile
 * @invokedBy zombie-hunter, promptReplay, CopilotFeedbackAgent
 * @outputs ToneOverrideResult object: { overrideId, traits, reason }
 * @integration Reads tone-profiles.jsonc; aligns with smart-prompt-score schema
 * @codex Safeguards emotional UX quality by resolving flat or misaligned tone in fallback flows
 */

import profiles from './tone-profiles.jsonc'

interface SessionToneSignals {
  emotionScore?: number
  outputDrift?: number
  revisionCount?: number
}

interface ToneOverrideResult {
  overrideId: string
  traits: Record<string, any>
  reason: string
}

export function getToneOverride(signals: SessionToneSignals): ToneOverrideResult | null {
  const emotion = signals.emotionScore ?? 1
  const drift = signals.outputDrift ?? 0
  const revs = signals.revisionCount ?? 0

  const forceOverride = drift > profiles.defaults.forceOverrideIfDriftAbove
  const weakEmotion = emotion < profiles.defaults.minEmotionScoreForOverride

  if (!forceOverride && !weakEmotion) return null

  const candidates = profiles.tones.filter(t => {
    const alignsWithEmotion = t.traits['emotional-resonance'] === 'aligned' || t.traits['emotional-resonance'] === 'inspiring'
    const clarityAbove = t.traits['tone-clarity'] >= 0.8
    const fewRevisions = (revs <= 1 && t.traits['revision-count'] <= 1)
    return alignsWithEmotion && clarityAbove && fewRevisions
  })

  if (!candidates.length) return null

  const chosen = candidates[0]
  return {
    overrideId: chosen.id,
    traits: chosen.traits,
    reason: forceOverride ? 'high drift' : 'emotion flatline'
  }
}
