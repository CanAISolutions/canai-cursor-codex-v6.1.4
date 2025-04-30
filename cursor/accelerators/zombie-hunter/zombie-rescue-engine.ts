// cursor/accelerators/zombie-hunter/zombie-rescue-engine.ts
// 🧟 Codex-Grade Zombie Detection Engine – CanAI v6.1.4
// Detects session stagnation and triggers safe prompt replay via self-healing.

import rules from './zombie-detection-rules.jsonc'
import { getSessionLog, triggerPromptReplay } from '../../self-healing/promptReplay'
import { logZombieEvent } from '../../system-intel/loggers/sessionDeltaLogEmitter'

export async function detectZombieSession(sessionId: string): Promise<string | null> {
  const { revisionCount, emotionScore, outputDelta, recentOutputs } = getSessionLog(sessionId)

  const matchedPatterns: string[] = []

  for (const pattern of rules.patterns) {
    const match = pattern.conditions.every(condition => {
      if (condition === 'same-output-3x') {
        return recentOutputs.slice(-3).filter(Boolean).length === 3 &&
               new Set(recentOutputs.slice(-3)).size === 1
      }

      if (condition === 'revise-count >= 3') {
        return revisionCount >= 3
      }

      if (condition === 'emotionScore < 0.2') {
        return emotionScore < rules.thresholds.minEmotionScore
      }

      if (condition === 'no-change-after-2-revisions') {
        const lastTwo = recentOutputs.slice(-2)
        return lastTwo.length === 2 && lastTwo[0] === lastTwo[1]
      }

      if (condition === 'outputDelta < 0.05') {
        return outputDelta < rules.thresholds.minOutputDelta
      }

      if (condition === 'tone = flat') {
        return getSessionLog(sessionId).tone === 'flat'
      }

      return false
    })

    if (match) {
      matchedPatterns.push(pattern.name)
    }
  }

  const isZombie =
    matchedPatterns.length > 0 ||
    revisionCount > rules.thresholds.maxRevisionCount

  if (!isZombie) return null

  await logZombieEvent(sessionId, {
    reason: 'zombie_detected',
    matchedPatterns,
    score: { emotionScore, outputDelta, revisionCount }
  })

  const replayResult = await triggerPromptReplay(sessionId)

  return `🧟 Zombie detected [${matchedPatterns.join(', ')}] → Recovery triggered: ${replayResult}`
}
