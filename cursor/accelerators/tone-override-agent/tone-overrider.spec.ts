/**
 * @file /cursor/accelerators/tone-override-agent/tone-overrider.spec.ts
 * @purpose Ensure tone overrides trigger only when justified and resolve emotional decay safely
 * @invokedBy tone-overrider.ts (QA layer), upstream agents: zombie-hunter, Copilot, replay flows
 * @outputs ToneOverrideResult or null
 * @integration Validates tone-profiles.jsonc + emotionScore + drift safety logic
 * @codex Prevents misaligned tone override injections, ensures UX stability under fallback pressure
 */

import { getToneOverride } from './tone-overrider'

describe('🧠 Tone Overrider – Signal QA', () => {
  it('does not trigger override if emotion and drift are healthy', () => {
    const result = getToneOverride({
      emotionScore: 0.8,
      outputDrift: 0.1,
      revisionCount: 1
    })
    expect(result).toBeNull()
  })

  it('suggests override when emotionScore is below threshold', () => {
    const result = getToneOverride({
      emotionScore: 0.2,
      outputDrift: 0.1,
      revisionCount: 0
    })

    expect(result?.overrideId).toBeDefined()
    expect(result?.reason).toBe('emotion flatline')
  })

  it('suggests override when drift is high even if emotion is okay', () => {
    const result = getToneOverride({
      emotionScore: 0.5,
      outputDrift: 0.85,
      revisionCount: 0
    })

    expect(result?.overrideId).toBeDefined()
    expect(result?.reason).toBe('high drift')
  })

  it('filters out tone profiles that exceed allowed revisionCount', () => {
    const result = getToneOverride({
      emotionScore: 0.2,
      outputDrift: 0.2,
      revisionCount: 5
    })

    expect(result).toBeNull()
  })

  it('returns null safely if no matching tone profiles exist', () => {
    const result = getToneOverride({
      emotionScore: 0.1,
      outputDrift: 0.1,
      revisionCount: 99
    })
    expect(result).toBeNull()
  })
})
