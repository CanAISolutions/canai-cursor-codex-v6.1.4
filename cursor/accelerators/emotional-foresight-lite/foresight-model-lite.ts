// cursor/accelerators/emotional-foresight-lite/foresight-model-lite.ts

import signalSpec from './emotion-signal-spec.jsonc'
import { analyzeSessionDelta } from '../../self-healing/ai-refactor-scripts/output-delta-analyzer'
import { getEmotionalScore } from '../../system-intel/loggers/emotionDriftJournal'

export function predictEmotionalTrajectory(sessionId: string, history: any[]): string[] {
  const predictions: string[] = []
  const delta = analyzeSessionDelta(sessionId)
  const emotionScore = getEmotionalScore(sessionId)

  signalSpec.signals.forEach(signal => {
    const conditionsMet = signal.detectors.every(detector => {
      // Basic pattern match eval - future: convert to DSL
      if (detector.includes('revise-count') && history.length > signalSpec.thresholds.reviseCount) return true
      if (detector.includes('deltaScore') && delta > signalSpec.thresholds.deltaScore) return true
      if (detector.includes('emotionScore decline')) {
        const last = history.at(-1)?.emotionScore || 0
        const prev = history.at(-2)?.emotionScore || 0
        return prev - last > signalSpec.thresholds.emotionScoreDrop
      }
      return false
    })

    if (conditionsMet) predictions.push(signal.name)
  })

  return predictions
}
