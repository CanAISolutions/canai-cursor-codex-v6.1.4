// Purpose: Emits standardized metrics for feedback trigger analysis and reliability
// Codex: Cursor-safe, Codex compliant
// Logs structured metrics for feedback agent lifecycle and system confidence

import { Logger } from '../../../utils/logger'

const CONTEXT = 'copilot-feedback-agent'
const logger = new Logger(CONTEXT)

export const emitObservability = {
  onStart: () => {
    logger.info('[observability] Feedback agent triggered evaluation.')
  },

  onSuggestion: (reason: string, severity: 'info' | 'warn' | 'critical') => {
    logger.info(`[observability] Feedback suggested due to: ${reason} (severity=${severity})`)
  },

  onError: (err: unknown) => {
    logger.error('[observability] Feedback engine failed', { error: err })
  }
}