# ✅ File: `observability.ts`  
@location: `/cursor/accelerators/copilot-injector/observability.ts`  
@purpose: Emits standardized metrics for Copilot feedback injection activity  
@drop-type: Codex copy/paste-safe, Cursor-ready


// File: /cursor/accelerators/copilot-injector/observability.ts
// Emits usage, severity, and drift metrics to shared logger

import { logger } from '../../_shared/logger'

const CONTEXT = 'copilot-injector'

export const emitObservability = {
  onStart: () => {
    logger.metric(CONTEXT, 'invocation.count', 1)
    logger.debug(CONTEXT, '[observability] Copilot injection evaluation started.')
  },

  onInjection: (triggerId: string, severity: 'info' | 'warn' | 'critical') => {
    logger.metric(CONTEXT, `trigger.${triggerId}`, 1)
    logger.metric(CONTEXT, `severity.${severity}`, 1)
    logger.info(CONTEXT, `[observability] Suggestion injected: ${triggerId} (${severity})`)
  },

  onBypass: () => {
    logger.metric(CONTEXT, 'manual-bypass.count', 1)
    logger.warn(CONTEXT, '[observability] Injection bypassed by manual override.')
  },

  onError: (err: unknown) => {
    logger.metric(CONTEXT, 'error.count', 1)
    logger.error(CONTEXT, '[observability] Injection failed', { error: err })
  }
}

