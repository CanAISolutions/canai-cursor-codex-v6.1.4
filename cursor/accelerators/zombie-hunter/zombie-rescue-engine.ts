// cursor/accelerators/zombie-hunter/zombie-rescue-engine.ts

import rules from './zombie-detection-rules.jsonc'
import { getSessionLog, triggerPromptReplay } from '../../self-healing/promptReplay'
import { logZombieEvent } from '../../system-intel/loggers/sessionDeltaLogEmitter'

export async function detectZombieSession(sessionId: string): Promise<string | null> {
  const log = getSessionLog(sessionId)
  const { revisionCount, emotionScore, outputDelta, recentOutputs } = log

  const isFlatEmotion = emotionScore < rules.thresholds.minEmotionScore
  const isDeadOutput = outputDelta < rules.thresholds.minOutputDelta
  const tooManyRevisions = revisionCount > rules.thresholds.maxRevisionCount
  const repeated = new Set(recentOutputs).size === 1

  if ((isFlatEmotion && isDeadOutput) || tooManyRevisions || repeated) {
    await logZombieEvent(sessionId, {
      reason: "zombie_detected",
      score: { emotionScore, outputDelta }
    })

    const replayStatus = await triggerPromptReplay(sessionId)
    return `🧟 Zombie detected → Prompt replay triggered: ${replayStatus}`
  }

  return null
}
