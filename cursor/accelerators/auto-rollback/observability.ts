// Purpose: Emits all standardized metrics required by the Codex Checkpoint Directive
// Codex: Copy/paste-safe (Cursor compliant)
// Emits standardized observability metrics for the auto-rollback agent

import { Logger } from '../../../utils/logger'

const CONTEXT = 'auto-rollback'
const logger = new Logger(CONTEXT)

export const emitObservability = {
  onStart: () => {
    logger.info('[observability] Rollback evaluation started')
  },

  onSuccess: (latencyMs: number, triggered: boolean) => {
    if (triggered) {
      logger.info('[observability] Rollback was triggered.')
    } else {
      logger.info('[observability] Rollback evaluated: no action taken.')
    }
  },

  onError: (err: unknown) => {
    logger.error('[observability] Rollback agent failed', { error: err })
  },

  onOverride: () => {
    logger.warn('[observability] Manual override triggered rollback.')
  }
}
