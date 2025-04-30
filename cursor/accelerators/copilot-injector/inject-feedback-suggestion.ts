// cursor/accelerators/copilot-injector/inject-feedback-suggestion.ts

import rules from './copilot-trigger-rules.jsonc'

interface SessionSignals {
  score?: number
  clarityScore?: number
  emotionScore?: number
  revisionCount?: number
  outputDelta?: number
  outputDrift?: number
  reuseRate?: number
  sessionTurn?: number
  injectionsSoFar?: number
}

interface CopilotSuggestion {
  message: string
  reason: string
  triggerId: string
}

export function injectCopilotFeedback(signals: SessionSignals): CopilotSuggestion | null {
  const injected = signals.injectionsSoFar || 0
  const turn = signals.sessionTurn || 0

  if (injected >= rules.defaults.maxInjectionsPerSession) return null
  if (turn > 0 && (turn - injected) < rules.defaults.minTurnsBetweenInjections) return null

  for (const trigger of rules.triggers) {
    const match = trigger.conditions.every(condition => {
      try {
        return Function(...Object.keys(signals), `return (${condition})`)(...Object.values(signals))
      } catch {
        return false
      }
    })

    if (match) {
      return {
        message: trigger.copilotMessage,
        reason: trigger.conditions.join(' AND '),
        triggerId: trigger.id
      }
    }
  }

  return null
}
