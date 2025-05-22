// File: /cursor/accelerators/prompt-genetics/observability.ts
// Purpose: Emits metrics for variant generation, mutation logic, and fitness scoring
// Codex: Copy/paste-safe, Cursor-native
// Tracks prompt mutation frequency, schema usage, and scoring events

import { Logger } from '../../../utils/logger'

const CONTEXT = 'prompt-genetics'
const logger = new Logger(CONTEXT)

export const emitObservability = {
  onMutationStart: (schemaVersion: string) => {
    logger.info(`[observability] Mutation run with schema: ${schemaVersion}`)
  },

  onMutationResult: (variantId: string, fitnessScore: number) => {
    logger.info(`[observability] Variant generated`, {
      variantId,
      fitnessScore
    })
  },

  onReplayFallback: (reason: string) => {
    logger.warn(`[observability] Reused prior variant due to: ${reason}`)
  },

  onError: (err: unknown) => {
    logger.error('[observability] Prompt genetics error', {
      error: err
    })
  }
}

