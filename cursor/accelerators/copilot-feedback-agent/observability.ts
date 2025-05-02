# ✅ File: `observability.ts`  
@location: `/cursor/accelerators/copilot-feedback-agent/observability.ts`  
@purpose: Emits standardized metrics for feedback trigger analysis and reliability  
@drop-type: Cursor-safe, Codex compliant

// File: /cursor/accelerators/copilot-feedback-agent/observability.ts
// Logs structured metrics for feedback agent lifecycle and system confidence

import { logger } from '../../_shared/logger'

const CONTEXT = 'copilot-feedback-agent'

export const emitObservability = {
  onStart: () => {
    logger.metric(CONTEXT, 'invocation.count', 1)
    logger.debug(CONTEXT, '[observability] Feedback agent triggered evaluation.')
  },

  onSuggestion: (reason: string, severity: 'info' | 'warn' | 'critical') => {
    logger.metric(CONTEXT, `feedback.reason.${reason}`, 1)
    logger.metric(CONTEXT, `feedback.severity.${severity}`, 1)
    logger.info(CONTEXT, `[observability] Feedback suggested due to: ${reason} (severity=${severity})`)
  },

  onError: (err: unknown) => {
    logger.metric(CONTEXT, 'error.count', 1)
    logger.error(CONTEXT, '[observability] Feedback engine failed', { error: err })
  }
}