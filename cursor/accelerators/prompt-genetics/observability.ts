# ✅ File: `observability.ts`  
@location: `/cursor/accelerators/prompt-genetics/observability.ts`  
@purpose: Emits metrics for variant generation, mutation logic, and fitness scoring  
@drop-type: Codex copy/paste-safe, Cursor-native

// File: /cursor/accelerators/prompt-genetics/observability.ts
// Tracks prompt mutation frequency, schema usage, and scoring events

import { logger } from '../../_shared/logger'

const CONTEXT = 'prompt-genetics'

export const emitObservability = {
  onMutationStart: (schemaVersion: string) => {
    logger.metric(CONTEXT, 'invocation.count', 1)
    logger.metric(CONTEXT, `schema.${schemaVersion}`, 1)
    logger.debug(CONTEXT, `[observability] Mutation run with schema: ${schemaVersion}`)
  },

  onMutationResult: (variantId: string, fitnessScore: number) => {
    logger.metric(CONTEXT, 'mutation.count', 1)
    logger.metric(CONTEXT, 'fitness.score', fitnessScore)
    logger.info(CONTEXT, `[observability] Variant generated`, {
      variantId,
      fitnessScore
    })
  },

  onReplayFallback: (reason: string) => {
    logger.metric(CONTEXT, 'replay.used', 1)
    logger.warn(CONTEXT, `[observability] Reused prior variant due to: ${reason}`)
  },

  onError: (err: unknown) => {
    logger.metric(CONTEXT, 'error.count', 1)
    logger.error(CONTEXT, '[observability] Prompt genetics error', {
      error: err
    })
  }
}

