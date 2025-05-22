// Purpose: Emits structured foresight evaluation metrics to the session analytics pipeline
// Codex: Codex-standard, Cursor-compatible
// Emits metrics on foresight evaluations, degradation warnings, and fallback use

import { Logger } from '../../../utils/logger'

const CONTEXT = 'emotional-foresight-lite'
const logger = new Logger(CONTEXT)

export const emitObservability = {
  onStart: () => {
    logger.info('[observability] Foresight evaluation started.')
  },

  onPrediction: (
    foresightLabel: 'low-risk' | 'at-risk' | 'degrading',
    triggeredBy: string[]
  ) => {
    logger.info(`[observability] Prediction: ${foresightLabel}`, {
      triggeredBy
    })
  },

  onFallback: (type: 'soft' | 'hard' | 'warn') => {
    logger.warn(`[observability] Fallback triggered: ${type}`)
  },

  onError: (err: unknown) => {
    logger.error('[observability] Foresight evaluation failed.', {
      error: err
    })
  }
}

