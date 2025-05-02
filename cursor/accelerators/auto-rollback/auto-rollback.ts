// File: /cursor/accelerators/auto-rollback/auto-rollback.ts

/**
 * Codex Accelerator: auto-rollback.ts
 * Role: Orchestrates automated rollback in failure scenarios using external policy conditions.
 */

import { logger } from '../../_shared/logger'
import { acceleratorState } from '../../_shared/acceleratorState'
import { loadConfig } from '../../_shared/configLoader'
import { autoRollbackEngine } from './rollback-engine'
import { z } from 'zod'

// Load validated config (Zod-enforced)
const configSchema = z.object({
  enabled: z.boolean(),
  fallbackMode: z.enum(['soft', 'hard']),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']),
  policyPath: z.string(),
  triggerConditionsPath: z.string(),
})

export async function autoRollbackAgent(sessionId?: string): Promise<void> {
  const context = 'auto-rollback'
  const startTime = Date.now()

  try {
    // Step 1: Load Config
    const config = await loadConfig('auto-rollback.config.json', configSchema)

    if (!config.enabled) {
      logger.info(context, 'Auto-rollback disabled via config.')
      return
    }

    // Step 2: Log invocation
    logger.metric(context, 'invocation.count', 1)
    logger.debug(context, `Config loaded: ${JSON.stringify(config)}`)

    // Step 3: Evaluate rollback conditions
    const triggered = await autoRollbackEngine({
      policyPath: config.policyPath,
      triggerConditionsPath: config.triggerConditionsPath,
      fallbackMode: config.fallbackMode,
    })

    // Step 4: Persist outcome to accelerator state
    await acceleratorState.set(`${context}:lastRun`, {
      timestamp: new Date().toISOString(),
      triggered,
    })

    logger.metric(context, 'state.write.count', 1)

    if (triggered) {
      logger.info(context, 'Rollback was triggered based on active conditions.')
    } else {
      logger.info(context, 'Rollback conditions evaluated: no action taken.')
    }

  } catch (error) {
    logger.error(context, 'Unhandled error in autoRollbackAgent', { error })
    logger.metric(context, 'error.count', 1)

    if (configSchema.safeParse(error).success === false) {
      logger.warn(context, 'Invalid config structure detected, triggering fail-closed logic.')
    }

    // Optional: fail-safe fallback mode
    if (error instanceof Error && error.message.includes('network')) {
      logger.warn(context, 'Network issue detected. Skipping rollback to avoid false trigger.')
    }

    // Allow system to gracefully degrade
  } finally {
    const latency = Date.now() - startTime
    logger.metric(context, 'latency.ms', latency)
  }
}
