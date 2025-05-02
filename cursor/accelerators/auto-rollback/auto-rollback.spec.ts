// File: /cursor/accelerators/auto-rollback/auto-rollback.spec.ts
// [DreamState] Full test suite for autoRollbackAgent

import { describe, it, expect, beforeAll, vi } from 'vitest'
import { autoRollbackAgent } from './auto-rollback'
import * as logger from '../../_shared/logger'
import * as configLoader from '../../_shared/configLoader'
import * as acceleratorState from '../../_shared/acceleratorState'
import fs from 'fs'

describe('[DreamState] autoRollbackAgent', () => {
  const MOCK_CONFIG_PATH = './__mocks__/auto-rollback.config.json'
  const mockConfig = {
    enabled: true,
    fallbackMode: 'soft',
    logLevel: 'info',
    policyPath: './rollback-policy.md',
    triggerConditionsPath: './trigger-conditions.jsonc',
    metricsEnabled: true,
    feedbackCapture: {
      enabled: true,
      logPath: './feedback_log.json'
    }
  }

  beforeAll(() => {
    vi.spyOn(configLoader, 'loadConfig').mockResolvedValue(mockConfig as any)
    vi.spyOn(logger, 'logger').mockImplementation({
      info: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      metric: vi.fn()
    } as any)
    vi.spyOn(acceleratorState, 'acceleratorState').mockImplementation({
      set: vi.fn().mockResolvedValue(undefined)
    } as any)
  })

  it('executes without error', async () => {
    await expect(autoRollbackAgent('test-session')).resolves.not.toThrow()
  })

  it('logs required metrics', async () => {
    const metricSpy = vi.spyOn(logger.logger, 'metric')
    await autoRollbackAgent('test-session')
    expect(metricSpy).toHaveBeenCalledWith('auto-rollback', 'invocation.count', 1)
    expect(metricSpy).toHaveBeenCalledWith('auto-rollback', 'latency.ms', expect.any(Number))
  })

  it('writes namespaced state', async () => {
    const stateSpy = vi.spyOn(acceleratorState.acceleratorState, 'set')
    await autoRollbackAgent('test-session')
    expect(stateSpy).toHaveBeenCalledWith('auto-rollback:lastRun', expect.objectContaining({
      triggered: expect.any(Boolean)
    }))
  })

  it('rejects console usage', async () => {
    const file = fs.readFileSync('./cursor/accelerators/auto-rollback/auto-rollback.ts', 'utf-8')
    expect(file.includes('console.')).toBe(false)
  })

  it('passes OWASP injection smoke test', async () => {
    const attackInput = `"; DROP TABLE sessions; --`
    await expect(autoRollbackAgent(attackInput)).resolves.not.toThrow()
  })

  it('has no stray files', async () => {
    const allowedFiles = new Set([
      'auto-rollback.ts',
      'auto-rollback.spec.ts',
      'behavior-contract.md',
      'purpose.md',
      'integration-contract.md',
      'future-integration.md',
      'observability.ts',
      'pattern-insights.ts',
      'system-readiness.ts',
      'self-check-blocks.md',
      'folder-checklist.md',
      'file-manifest.md',
      'version.lock',
      'config-notes.md'
    ])
    const allFiles = fs.readdirSync('./cursor/accelerators/auto-rollback')
    const stray = allFiles.filter(f => !allowedFiles.has(f))
    expect(stray).toEqual([])
  })

  it('matches version.lock with current git commit SHA', async () => {
    const execSync = await import('node:child_process').then(mod => mod.execSync)
    const currentSHA = execSync('git rev-parse HEAD').toString().trim()
    const lockedSHA = fs.readFileSync('./cursor/accelerators/auto-rollback/version.lock', 'utf-8').trim()
    expect(lockedSHA).toBe(currentSHA)
  })
})
