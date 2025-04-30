/**
 * @file /cursor/accelerators/copilot-feedback-agent/copilot-feedback-engine.spec.ts
 * @purpose Validate logic for Copilot feedback suggestions based on session signals
 * @invokedBy copilot-feedback-engine.ts
 * @outputs FeedbackMessage or null based on session signals and trigger conditions
 * @integration Tests against copilot-feedback-rules.jsonc and SessionSignals interface
 * @codex Ensures that feedback is only provided when appropriate and adheres to UX safeguards
 */

import { evaluateCopilotFeedback } from './copilot-feedback-engine'

describe('🧠 Copilot Feedback Engine – Trigger Validation', () => {
  const baseSignals = {
    emotionScore: 0.4,
    revisionCount: 3,
    outputDelta: 0.05,
    toneClarity: 0.75,
    outputDrift: 0.2
  }

  it('does not trigger feedback if conditions are not met', () => {
    const result = evaluateCopilotFeedback(baseSignals)
    expect(result).toBeNull()
  })

  it('triggers feedback when emotion score is below threshold', () => {
    const signals = { ...baseSignals, emotionScore: 0.2 }
    const result = evaluateCopilotFeedback(signals)
    expect(result).toBeTruthy()
    expect(result?.message).toBe('Want to try a warmer tone or a new angle?')
    expect(result?.context).toBe('emotion-flatline')
  })

  it('triggers feedback when output delta is below threshold', () => {
    const signals = { ...baseSignals, outputDelta: 0.03 }
    const result = evaluateCopilotFeedback(signals)
    expect(result).toBeTruthy()
    expect(result?.message).toBe('Want to try a warmer tone or a new angle?')
    expect(result?.context).toBe('drift-deadzone')
  })

  it('triggers feedback when revision count exceeds threshold', () => {
    const signals = { ...baseSignals, revisionCount: 5 }
    const result = evaluateCopilotFeedback(signals)
    expect(result).toBeTruthy()
    expect(result?.message).toBe('Looks like we’re circling. Want a fresh restart or ask differently?')
    expect(result?.context).toBe('revision-fatigue')
  })

  it('returns null when no feedback conditions are met', () => {
    const signals = { ...baseSignals, emotionScore: 0.5, outputDelta: 0.15, revisionCount: 2 }
    const result = evaluateCopilotFeedback(signals)
    expect(result).toBeNull()
  })
})
