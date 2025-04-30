// cursor/accelerators/copilot-injector/inject-feedback-suggestion.spec.ts

import { injectCopilotFeedback } from './inject-feedback-suggestion'

describe('🧠 Copilot Injection Engine', () => {
  it('triggers on low score + weak clarity', () => {
    const result = injectCopilotFeedback({
      score: 65,
      clarityScore: 0.4,
      emotionScore: 0.3,
      sessionTurn: 3,
      injectionsSoFar: 0
    })

    expect(result).toBeDefined()
    expect(result?.triggerId).toBe('low-score-feedback')
    expect(result?.message).toMatch(/tone fix|clarity boost/i)
  })

  it('respects maxInjectionsPerSession limit', () => {
    const result = injectCopilotFeedback({
      score: 50,
      emotionScore: 0.1,
      injectionsSoFar: 3,
      sessionTurn: 5
    })

    expect(result).toBeNull()
  })

  it('respects minTurnsBetweenInjections', () => {
    const result = injectCopilotFeedback({
      score: 60,
      clarityScore: 0.4,
      sessionTurn: 2,
      injectionsSoFar: 2 // too close in turn distance
    })

    expect(result).toBeNull()
  })

  it('injects when emotion flatlines', () => {
    const result = injectCopilotFeedback({
      emotionScore: 0.1,
      sessionTurn: 4,
      injectionsSoFar: 0
    })

    expect(result?.triggerId).toBe('emotion-flatline')
    expect(result?.message).toMatch(/emotionally aligned/i)
  })

  it('does not crash on missing signals', () => {
    const result = injectCopilotFeedback({
      score: 60,
      sessionTurn: 5,
      injectionsSoFar: 0
    })

    expect(result).toBeDefined()
    expect(result?.message).toBeDefined()
  })
})
