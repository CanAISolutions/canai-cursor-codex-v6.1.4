// Purpose: Emits standardized observability metrics for conversion scoring agent
// Codex: Cursor-safe, Codex-mandated
// Emits Codex-standard metrics to support scoring transparency and performance audit

import { Logger } from '../../../utils/logger'

const CONTEXT = 'conversion-predictor-lite'
const logger = new Logger(CONTEXT)

export const emitObservability = {
  onStart: () => {
    logger.info('[observability] Scoring engine started.')
  },

  onSuccess: (latencyMs: number, confidence: number, verdict: string) => {
    logger.info(`[observability] Output scored as ${verdict} (confidence=${confidence.toFixed(2)})`)
  },

  onError: (err: unknown) => {
    logger.error('[observability] Scoring failed', { error: err })
  }
}
