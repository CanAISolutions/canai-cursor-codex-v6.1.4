// Purpose: Emits metrics for memory resolution, fallback use, and rejection causes
// Codex: Copy/paste-safe, Cursor-native
// Tracks usage patterns, fallback rates, and resolution quality

import { Logger } from '../../../utils/logger'

const CONTEXT = 'federated-memory-lite'
const logger = new Logger(CONTEXT)

export const emitObservability = {
  onStart: (intent: string) => {
    logger.info(`[observability] Resolving memory for: ${intent}`)
  },

  onResolution: (sourceUsed: string, fallbackTriggered: boolean) => {
    if (fallbackTriggered) {
      logger.warn(`[observability] Fallback used for memory resolution`)
    } else {
      logger.info(`[observability] Memory resolved from: ${sourceUsed}`)
    }
  },

  onReject: (rejectedSources: string[]) => {
    logger.warn(`[observability] Memory sources rejected:`, { rejectedSources })
  },

  onError: (err: unknown) => {
    logger.error('[observability] Memory federation error', { error: err })
  }
}

