// Purpose: Emits standardized logs for inference attempts, matches, fallbacks, and drift scores
// Codex: Cursor-native, Codex-auditable
// Emits metrics for trace coverage, fallback usage, and emotional drift scoring

import { Logger } from '../../../utils/logger'

const CONTEXT = 'reverse-synthesis-core'
const logger = new Logger(CONTEXT)

export const emitObservability = {
  onInferenceStart: () => {
    logger.info('[observability] Inference started')
  },

  onMatchSuccess: (matchedPatterns: string[], confidence: number) => {
    logger.info('[observability] Successful pattern match', {
      matchedPatterns,
      confidence
    })
  },

  onFallbackTriggered: () => {
    logger.warn('[observability] Fallback path triggered')
  },

  onDriftScored: (driftScore: number) => {
    if (driftScore > 0.6) {
      logger.warn('[observability] High emotional drift detected', {
        driftScore
      })
    } else {
      logger.info('[observability] Drift score emitted', {
        driftScore
      })
    }
  },

  onError: (err: unknown) => {
    logger.error('[observability] Synthesis engine error', {
      error: err
    })
  }
}

