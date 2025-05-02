# ✅ File: `observability.ts`  
@location: `/cursor/accelerators/emotional-foresight-lite/observability.ts`  
@purpose: Emits structured foresight evaluation metrics to the session analytics pipeline  
@drop-type: Codex-standard, Cursor-compatible

// File: /cursor/accelerators/emotional-foresight-lite/observability.ts
// Emits metrics on foresight evaluations, degradation warnings, and fallback use

import { logger } from '../../_shared/logger'

const CONTEXT = 'emotional-foresight-lite'

export const emitObservability = {
  onStart: () => {
    logger.metric(CONTEXT, 'invocation.count', 1)
    logger.debug(CONTEXT, '[observability] Foresight evaluation started.')
  },

  onPrediction: (
    foresightLabel: 'low-risk' | 'at-risk' | 'degrading',
    triggeredBy: string[]
  ) => {
    logger.metric(CONTEXT, `foresight.${foresightLabel}`, 1)
    triggeredBy.forEach(trigger =>
      logger.metric(CONTEXT, `trigger.${trigger}`, 1)
    )
    logger.info(CONTEXT, `[observability] Prediction: ${foresightLabel}`, {
      triggeredBy
    })
  },

  onFallback: (type: 'soft' | 'hard' | 'warn') => {
    logger.metric(CONTEXT, `fallback.${type}`, 1)
    logger.warn(CONTEXT, `[observability] Fallback triggered: ${type}`)
  },

  onError: (err: unknown) => {
    logger.metric(CONTEXT, 'error.count', 1)
    logger.error(CONTEXT, '[observability] Foresight evaluation failed.', {
      error: err
    })
  }
}

