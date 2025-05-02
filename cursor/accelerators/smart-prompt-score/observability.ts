# ✅ File: `observability.ts`  
@location: `/cursor/accelerators/smart-prompt-score/observability.ts`  
@purpose: Emits scoring telemetry, grade distribution, and emotional scoring patterns  
@drop-type: Codex copy/paste-safe, Cursor-auditable

// File: /cursor/accelerators/smart-prompt-score/observability.ts
// Emits composite score events, grade tags, and scoring signals for analytics

import { logger } from '../../_shared/logger'

const CONTEXT = 'smart-prompt-score'

export const emitScoreObservability = {
  onScoringComplete: (
    compositeScore: number,
    grade: 'gold' | 'pass' | 'fallback',
    trace: Record<string, any>
  ) => {
    logger.metric(CONTEXT, 'invocation.count', 1)
    logger.metric(CONTEXT, 'composite.score', compositeScore)
    logger.metric(CONTEXT, `grade.${grade}`, 1)

    logger.info(CONTEXT, '[observability] Score result', {
      compositeScore,
      grade,
      topSignal: trace?.topContributor,
      reasonSummary: trace?.reasoning?.[0] || 'N/A'
    })
  },

  onScoreAnomaly: (message: string, debug: Record<string, any>) => {
    logger.metric(CONTEXT, 'anomaly.count', 1)
    logger.warn(CONTEXT, '[observability] Scoring anomaly detected', {
      message,
      ...debug
    })
  },

  onError: (error: unknown) => {
    logger.metric(CONTEXT, 'error.count', 1)
    logger.error(CONTEXT, '[observability] Scoring engine failure', {
      error
    })
  }
}
