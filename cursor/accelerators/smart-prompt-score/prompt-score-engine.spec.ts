// cursor/accelerators/smart-prompt-score/prompt-score-engine.spec.ts
// 🧪 Snapshot Tests – prompt-score-engine.ts

import { scorePrompt } from './prompt-score-engine'

describe('🧠 Prompt Scoring Engine', () => {
  it('computes a passing score from typical inputs', () => {
    const result = scorePrompt({
      clarityScore: 0.8,
      emotionScore: 0.6,
      outputDelta: 0.4,
      revisionCount: 2,
      reuseRate: 0.7
    })

    expect(result.totalScore).toBeGreaterThan(70)
    expect(result.grade).toBe('pass')
    expect(result.normalizedSignals.clarityScore).toBeCloseTo(0.8)
    expect(result.reasoning.length).toBeGreaterThan(0)
  })

  it('flags a gold-level prompt on excellent scores', () => {
    const result = scorePrompt({
      clarityScore: 1.0,
      emotionScore: 0.95,
      outputDelta: 0.9,
      revisionCount: 0,
      reuseRate: 0.95
    })

    expect(result.totalScore).toBeGreaterThanOrEqual(90)
    expect(result.grade).toBe('gold')
  })

  it('flags a fallback score for low input', () => {
    const result = scorePrompt({
      clarityScore: 0.2,
      emotionScore: 0.1,
      outputDelta: 0.1,
      revisionCount: 8,
      reuseRate: 0.05
    })

    expect(result.totalScore).toBeLessThan(50)
    expect(result.grade).toBe('fallback')
  })

  it('handles partial signal input gracefully', () => {
    const result = scorePrompt({
      clarityScore: 0.6,
      emotionScore: 0.7
      // missing outputDelta, revisionCount, reuseRate
    })

    expect(result.totalScore).toBeGreaterThan(0)
    expect(result.grade).toMatch(/pass|fallback/)
    expect(result.reasoning.length).toBeGreaterThan(0)
  })

  it('normalizes revisionCount correctly (goal: minimize)', () => {
    const lowRev = scorePrompt({ revisionCount: 0 }).normalizedSignals.revisionCount
    const highRev = scorePrompt({ revisionCount: 10 }).normalizedSignals.revisionCount

    expect(lowRev).toBeCloseTo(1.0)
    expect(highRev).toBeCloseTo(0.0)
  })
})
