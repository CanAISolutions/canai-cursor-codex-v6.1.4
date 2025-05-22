// Purpose: Emits scoring telemetry, grade distribution, and emotional scoring patterns
// Codex: Codex copy/paste-safe, Cursor-auditable
// Emits composite score events, grade tags, and scoring signals for analytics

import { Logger } from '../../../utils/logger'

const CONTEXT = 'smart-prompt-score'
const logger = new Logger(CONTEXT)

export const emitScoreObservability = {
  onScoringComplete: (
    compositeScore: number,
    grade: 'gold' | 'pass' | 'fallback',
    trace: Record<string, any>
  ) => {
    logger.info('[observability] Score result', {
      compositeScore,
      grade,
      topSignal: trace?.topContributor,
      reasonSummary: trace?.reasoning?.[0] || 'N/A'
    })
  },

  onScoreAnomaly: (message: string, debug: Record<string, any>) => {
    logger.warn('[observability] Scoring anomaly detected', {
      message,
      ...debug
    })
  },

  onError: (error: unknown) => {
    logger.error('[observability] Scoring engine failure', {
      error
    })
  }
}
