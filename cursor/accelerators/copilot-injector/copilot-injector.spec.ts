// cursor/accelerators/copilot-injector/copilot-injector.spec.ts
// ✅ Integration + Snapshot QA – Copilot Injector
// Validates schema integrity, max injection enforcement, and cross-system readiness

import rules from './copilot-trigger-rules.jsonc'
import { injectCopilotFeedback } from './inject-feedback-suggestion'

describe('🔒 Copilot Injector – Integration QA', () => {
  it('ensures all triggers are schema-valid', () => {
    rules.triggers.forEach(trigger => {
      expect(typeof trigger.id).toBe('string')
      expect(Array.isArray(trigger.conditions)).toBe(true)
      trigger.conditions.forEach(condition => {
        expect(typeof condition).toBe('string')
      })
      expect(typeof trigger.copilotMessage).toBe('string')
    })
  })

  it('does not inject if sessionTurn - injectionsSoFar is too close', () => {
    const result = injectCopilotFeedback({
      emotionScore: 0.1,
      sessionTurn: 3,
      injectionsSoFar: 3
    })
    expect(result).toBeNull()
  })

  it('injects a valid Copilot suggestion when conditions match', () => {
    const result = injectCopilotFeedback({
      score: 60,
      clarityScore: 0.4,
      sessionTurn: 3,
      injectionsSoFar: 0
    })
    expect(result).toEqual(
      expect.objectContaining({
        message: expect.stringMatching(/clarity|tone|fix/i),
        reason: expect.stringContaining('score'),
        triggerId: expect.any(String)
      })
    )
  })

  it('respects session boundaries – does not fire post-exit', () => {
    const result = injectCopilotFeedback({
      score: 85,
      sessionTurn: 10,
      injectionsSoFar: 2
    })
    expect(result).toBeNull()
  })

  it('does not error if input signal object is partial or malformed', () => {
    const result = injectCopilotFeedback({} as any)
    expect(result === null || typeof result?.message === 'string').toBe(true)
  })
})
