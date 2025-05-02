# ✅ File: `observability.ts`  
@location: `/cursor/accelerators/conversion-predictor-lite/observability.ts`  
@purpose: Emits standardized observability metrics for conversion scoring agent  
@drop-type: Cursor-safe, Codex-mandated


// File: /cursor/accelerators/conversion-predictor-lite/observability.ts
// Emits Codex-standard metrics to support scoring transparency and performance audit

import { logger } from '../../_shared/logger'

const CONTEXT = 'conversion-predictor-lite'

export const emitObservability = {
  onStart: () => {
    logger.metric(CONTEXT, 'invocation.count', 1)
    logger.debug(CONTEXT, '[observability] Scoring engine started.')
  },

  onSuccess: (latencyMs: number, confidence: number, verdict: string) => {
    logger.metric(CONTEXT, 'latency.ms', latencyMs)
    logger.metric(CONTEXT, 'score.confidence', confidence)
    logger.metric(CONTEXT, `verdict.${verdict}`, 1)
    logger.info(CONTEXT, `[observability] Output scored as ${verdict} (confidence=${confidence.toFixed(2)})`)
  },

  onError: (err: unknown) => {
    logger.metric(CONTEXT, 'error.count', 1)
    logger.error(CONTEXT, '[observability] Scoring failed', { error: err })
  }
}
