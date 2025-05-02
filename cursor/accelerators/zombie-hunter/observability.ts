# ✅ File: `observability.ts`  
@location: `/cursor/accelerators/zombie-hunter/observability.ts`  
@purpose: Emits metrics and analytics traces for zombie detection triggers  
@drop-type: Codex copy/paste-safe, logging-compliant

// File: /cursor/accelerators/zombie-hunter/observability.ts
// Emits detection metrics to logger for analytics, debugging, and cost auditing

import { logger } from '../../_shared/logger'
import { writeDeltaLog } from '../../_shared/deltaLogger'
import { writeSessionAnalytics } from '../../_shared/analyticsLogger'
import { writeDeliveryCostLog } from '../../_shared/costLogger'

type ZombieTrace = {
  sessionId: string
  matchedPattern: string
  emotionScore: number
  outputDelta: number
  revisionCount: number
  triggeredBy: 'zombie-hunter'
  timestamp: string
}

export async function emitZombieDetectionTrace(trace: ZombieTrace): Promise<void> {
  logger.metric('invocation.count', 'zombie-hunter')
  logger.metric('latency.ms', 'zombie-hunter') // optional: can time execution elsewhere

  if (trace) {
    logger.metric('state.write.count', 'zombie-hunter')

    if (trace.emotionScore < 0.2) {
      logger.metric('emotion.flatline.count', 'zombie-hunter')
    }

    if (trace.outputDelta < 0.05) {
      logger.metric('drift.deadzone.count', 'zombie-hunter')
    }

    logger.info(`[zombie-hunter] pattern "${trace.matchedPattern}" triggered in session ${trace.sessionId}`)

    await writeDeltaLog({
      type: 'zombie-session',
      trace
    })

    await writeSessionAnalytics({
      sessionId: trace.sessionId,
      tag: 'zombie_detected',
      details: {
        pattern: trace.matchedPattern,
        emotionScore: trace.emotionScore,
        outputDelta: trace.outputDelta
      }
    })

    await writeDeliveryCostLog({
      sessionId: trace.sessionId,
      agent: 'zombie-hunter',
      costTokens: 0, // pattern matching only, no LLM call
      status: 'triggered'
    })
  }
}
