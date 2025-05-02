# ✅ File: `observability.ts`  
@location: `/cursor/accelerators/federated-memory-lite/observability.ts`  
@purpose: Emits metrics for memory resolution, fallback use, and rejection causes  
@drop-type: Codex copy/paste-safe, Cursor-native

// File: /cursor/accelerators/federated-memory-lite/observability.ts
// Tracks usage patterns, fallback rates, and resolution quality

import { logger } from '../../_shared/logger'

const CONTEXT = 'federated-memory-lite'

export const emitObservability = {
  onStart: (intent: string) => {
    logger.metric(CONTEXT, 'invocation.count', 1)
    logger.metric(CONTEXT, `intent.${intent}`, 1)
    logger.debug(CONTEXT, `[observability] Resolving memory for: ${intent}`)
  },

  onResolution: (sourceUsed: string, fallbackTriggered: boolean) => {
    logger.metric(CONTEXT, `resolved.${sourceUsed}`, 1)
    if (fallbackTriggered) {
      logger.metric(CONTEXT, 'fallback.count', 1)
      logger.warn(CONTEXT, `[observability] Fallback used for memory resolution`)
    } else {
      logger.info(CONTEXT, `[observability] Memory resolved from: ${sourceUsed}`)
    }
  },

  onReject: (rejectedSources: string[]) => {
    rejectedSources.forEach(source => {
      logger.metric(CONTEXT, `rejected.${source}`, 1)
    })
    logger.warn(CONTEXT, `[observability] Memory sources rejected:`, { rejectedSources })
  },

  onError: (err: unknown) => {
    logger.metric(CONTEXT, 'error.count', 1)
    logger.error(CONTEXT, '[observability] Memory federation error', { error: err })
  }
}

