// cursor/accelerators/auto-rollback/rollback-engine.ts

/**
 * 🧠 rollback-engine.ts
 * ---------------------
 * Purpose: Executes automated rollback when system integrity is compromised.
 * Triggers: Loaded from `trigger-conditions.jsonc`
 * Outputs: Emits rollback log, replays last stable prompt state
 * Integrated With: zombie-hunter, self-healing, emotional-foresight-lite
 * Version: 1.0.0
 * Status: Codex-Hardened — supports AI copilots, delta tracing, and self-repair hooks
 */

import { triggerConditions } from './trigger-conditions.jsonc'
import { emitDeltaLog } from '../../system-intel/loggers/sessionDeltaLogEmitter'
import { replayLastStablePrompt } from '../../self-healing/ai-refactor-scripts/promptReplay'
import { analyzeOutputDelta } from '../../self-healing/ai-refactor-scripts/output-delta-analyzer'

export const agentVersion = '1.0.0'

/** cursor:input
 * @param sessionId - Unique session identifier
 * @param currentDelta - Calculated output delta score
 * @param triggerLog - Array of trigger types encountered (e.g., ['emotionalDrift'])
 */
export async function initiateRollback(
  sessionId: string,
  currentDelta: number,
  triggerLog: string[]
): Promise<string> {
  const {
    deltaScoreThreshold,
    emotionalDrift,
    modularityBreak,
    manualOverride
  } = triggerConditions

  const triggerDetected =
    currentDelta > deltaScoreThreshold ||
    triggerLog.includes(emotionalDrift) ||
    triggerLog.includes(modularityBreak) ||
    triggerLog.includes(manualOverride)

  if (!triggerDetected) {
    emitDeltaLog(sessionId, {
      event: 'rollback_skipped',
      reason: 'Threshold not met',
      score: currentDelta,
      version: agentVersion
    })
    return '✅ No rollback needed.'
  }

  emitDeltaLog(sessionId, {
    event: 'rollback_initiated',
    reason: triggerLog,
    score: currentDelta,
    version: agentVersion
  })

  const replayStatus = await replayLastStablePrompt(sessionId)

  emitDeltaLog(sessionId, {
    event: 'rollback_completed',
    result: replayStatus,
    timestamp: new Date().toISOString(),
    version: agentVersion
  })

  /** cursor:output
   * Returns a string describing rollback outcome for logging or fallback UX
   */
  return `⚠️ Rollback triggered.\n→ Replay status: ${replayStatus}`
}
