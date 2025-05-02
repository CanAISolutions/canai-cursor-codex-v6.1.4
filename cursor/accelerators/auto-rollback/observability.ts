# ✅ File: `observability.ts`  
@location: `/cursor/accelerators/auto-rollback/observability.ts`  
@purpose: Emits all standardized metrics required by the Codex Checkpoint Directive  
@drop-type: Copy/paste-safe (Cursor compliant)

```ts
// File: /cursor/accelerators/auto-rollback/observability.ts
// Emits standardized observability metrics for the auto-rollback agent

import { logger } from '../../_shared/logger'

const CONTEXT = 'auto-rollback'

export const emitObservability = {
  onStart: () => {
    logger.metric(CONTEXT, 'invocation.count', 1)
    logger.debug(CONTEXT, '[observability] Rollback evaluation started')
  },

  onSuccess: (latencyMs: number, triggered: boolean) => {
    logger.metric(CONTEXT, 'latency.ms', latencyMs)
    logger.metric(CONTEXT, 'state.write.count', 1)

    if (triggered) {
      logger.info(CONTEXT, '[observability] Rollback was triggered.')
    } else {
      logger.info(CONTEXT, '[observability] Rollback evaluated: no action taken.')
    }
  },

  onError: (err: unknown) => {
    logger.metric(CONTEXT, 'error.count', 1)
    logger.error(CONTEXT, '[observability] Rollback agent failed', { error: err })
  },

  onOverride: () => {
    logger.metric(CONTEXT, 'override.rate', 1)
    logger.warn(CONTEXT, '[observability] Manual override triggered rollback.')
  }
}
```
