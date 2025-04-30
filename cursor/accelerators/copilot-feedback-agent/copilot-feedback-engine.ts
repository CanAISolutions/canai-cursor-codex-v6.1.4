/**
 * @file /cursor/accelerators/copilot-feedback-agent/copilot-feedback-engine.ts
 * @purpose Evaluate session signals and trigger feedback when required
 * @invokedBy tone-override-agent, promptReplay, zombie-hunter
 * @outputs Copilot feedback message or null
 * @integration Reads copilot-feedback-rules.jsonc; works with emotionScore, drift, revisionCount
 * @codex Protects user experience with careful, context-aware interventions only when needed
 */

import rules from './copilot-feedback-rules.jsonc'

interface SessionSignals {
  emotionScore: number
  revisionCount: number
  outputDelta: number
  toneClarity: number
  outputDrift: number
}

interface FeedbackMessage {
  message: string
  context: string
}

export function evaluateCopilotFeedback(signals: SessionSignals): FeedbackMessage | null {
  for (const rule of rules.triggers) {
    let triggerMet = true

    // Check conditions
    if (rule.if.emotionScoreBelow && signals.emotionScore >= rule.if.emotionScoreBelow) {
      triggerMet = false
    }
    if (rule.if.revisionCountAtLeast && signals.revisionCount < rule.if.revisionCountAtLeast) {
      triggerMet = false
    }
    if (rule.if.revisionCountAbove && signals.revisionCount <= rule.if.revisionCountAbove) {
      triggerMet = false
    }
    if (rule.if.outputDeltaBelow && signals.outputDelta >= rule.if.outputDeltaBelow) {
      triggerMet = false
    }
    if (rule.if.outputDriftAbove && signals.outputDrift <= rule.if.outputDriftAbove) {
      triggerMet = false
    }
    if (rule.if.toneClarityBelow && signals.toneClarity >= rule.if.toneClarityBelow) {
      triggerMet = false
    }

    if (triggerMet) {
      return {
        message: rule.copilotSay,
        context: rule.name
      }
    }
  }

  return null
}
