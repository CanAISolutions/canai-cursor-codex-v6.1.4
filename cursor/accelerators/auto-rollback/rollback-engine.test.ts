// cursor/accelerators/auto-rollback/rollback-engine.test.ts

/**
 * 🧪 rollback-engine.test.ts
 * --------------------------
 * Unit tests for the `initiateRollback()` function.
 * Validates rollback trigger logic, delta scoring, and replay integration.
 * Codex-enforced: Copilot-safe, deterministic, upgrade-compatible.
 */

import { initiateRollback } from './rollback-engine'

jest.mock('../../system-intel/loggers/sessionDeltaLogEmitter', () => ({
  emitDeltaLog: jest.fn()
}))

jest.mock('../../self-healing/ai-refactor-scripts/promptReplay', () => ({
  replayLastStablePrompt: jest.fn().mockResolvedValue('✅ Prompt replayed')
}))

const sessionId = 'test-session-123'

describe('initiateRollback()', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  /** cursor:test
   * ✅ Scenario 1: Triggers rollback due to high delta
   */
  it('should trigger rollback when deltaScore is above threshold', async () => {
    const result = await initiateRollback(sessionId, 0.95, [])
    expect(result).toContain('⚠️ Rollback triggered')
  })

  /** cursor:test
   * ✅ Scenario 2: Triggers rollback due to manual override
   */
  it('should trigger rollback when triggerLog includes manual override', async () => {
    const result = await initiateRollback(sessionId, 0.1, ['manualOverride'])
    expect(result).toContain('⚠️ Rollback triggered')
  })

  /** cursor:test
   * ✅ Scenario 3: Skips rollback when all conditions are false
   */
  it('should skip rollback when no conditions are met', async () => {
    const result = await initiateRollback(sessionId, 0.1, [])
    expect(result).toBe('✅ No rollback needed.')
  })

  /** cursor:test
   * ✅ Scenario 4: Handles unexpected input gracefully
   */
  it('should handle unexpected input without crashing', async () => {
    const result = await initiateRollback(sessionId, NaN, ['unknownTrigger'])
    expect(typeof result).toBe('string')
  })
})
