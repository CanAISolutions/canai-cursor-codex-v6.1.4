// Purpose: Emits standardized metrics for Copilot feedback injection activity
// Codex: Copy/paste-safe, Cursor-ready
// Emits usage, severity, and drift metrics to shared logger

import { Logger } from '../../../utils/logger'

const CONTEXT = 'copilot-injector'
const logger = new Logger(CONTEXT)

export const emitObservability = {
  onStart: () => {
    logger.info('[observability] Copilot injection evaluation started.')
  },

  onInjection: (triggerId: string, severity: 'info' | 'warn' | 'critical') => {
    logger.info(`[observability] Suggestion injected: ${triggerId} (${severity})`)
  },

  onBypass: () => {
    logger.warn('[observability] Injection bypassed by manual override.')
  },

  onError: (err: unknown) => {
    logger.error('[observability] Injection failed', { error: err })
  }
}

