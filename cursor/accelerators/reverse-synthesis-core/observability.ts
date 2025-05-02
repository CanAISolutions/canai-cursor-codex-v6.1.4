# ✅ File: `observability.ts`  
@location: `/cursor/accelerators/reverse-synthesis-core/observability.ts`  
@purpose: Emits standardized logs for inference attempts, matches, fallbacks, and drift scores  
@drop-type: Cursor-native, Codex-auditable

// File: /cursor/accelerators/reverse-synthesis-core/observability.ts
// Emits metrics for trace coverage, fallback usage, and emotional drift scoring

import { logger } from '../../_shared/logger'

const CONTEXT = 'reverse-synthesis-core'

export const emitObservability = {
  onInferenceStart: () => {
    logger.metric(CONTEXT, 'invocation.count', 1)
    logger.debug(CONTEXT, '[observability] Inference started')
  },

  onMatchSuccess: (matchedPatterns: string[], confidence: number) => {
    logger.metric(CONTEXT, 'match.success.count', 1)
    logger.metric(CONTEXT, 'confidence.score', confidence)
    matchedPatterns.forEach((patternId) => {
      logger.metric(CONTEXT, `pattern.${patternId}`, 1)
    })
    logger.info(CONTEXT, '[observability] Successful pattern match', {
      matchedPatterns,
      confidence
    })
  },

  onFallbackTriggered: () => {
    logger.metric(CONTEXT, 'fallback.count', 1)
    logger.warn(CONTEXT, '[observability] Fallback path triggered')
  },

  onDriftScored: (driftScore: number) => {
    logger.metric(CONTEXT, 'drift.score', driftScore)
    if (driftScore > 0.6) {
      logger.warn(CONTEXT, '[observability] High emotional drift detected', {
        driftScore
      })
    } else {
      logger.info(CONTEXT, '[observability] Drift score emitted', {
        driftScore
      })
    }
  },

  onError: (err: unknown) => {
    logger.metric(CONTEXT, 'error.count', 1)
    logger.error(CONTEXT, '[observability] Synthesis engine error', {
      error: err
    })
  }
}

