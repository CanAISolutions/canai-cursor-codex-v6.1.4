// cursor/accelerators/zombie-hunter/zombie-rescue-engine.spec.ts
// 🧪 Snapshot Tests – Zombie Rescue Engine
// Validates pattern detection and safe prompt replay logic

import { detectZombieSession } from './zombie-rescue-engine'
import * as promptReplay from '../../self-healing/promptReplay'
import * as logEmitter from '../../system-intel/loggers/sessionDeltaLogEmitter'

// 🔧 Mocks
jest.mock('../../self-healing/promptReplay', () => ({
  getSessionLog: jest.fn(),
  triggerPromptReplay: jest.fn().mockResolvedValue('✅ replay-triggered')
}))
jest.mock('../../system-intel/loggers/sessionDeltaLogEmitter', () => ({
  logZombieEvent: jest.fn()
}))

const mockLog = promptReplay.getSessionLog as jest.Mock

describe('🧟 Zombie Session Detection', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('detects no-change-loop pattern', async () => {
    mockLog.mockReturnValue({
      sessionId: 'abc',
      emotionScore: 0.6,
      outputDelta: 0.1,
      revisionCount: 3,
      tone: 'neutral',
      recentOutputs: ['X', 'X', 'X']
    })

    const result = await detectZombieSession('abc')
    expect(result).toContain('no-change-loop')
    expect(promptReplay.triggerPromptReplay).toHaveBeenCalled()
    expect(logEmitter.logZombieEvent).toHaveBeenCalledWith('abc', expect.objectContaining({
      matchedPatterns: expect.arrayContaining(['no-change-loop'])
    }))
  })

  it('detects emotion-flatline pattern', async () => {
    mockLog.mockReturnValue({
      sessionId: 'def',
      emotionScore: 0.1,
      outputDelta: 0.2,
      revisionCount: 2,
      tone: 'flat',
      recentOutputs: ['Y', 'Y']
    })

    const result = await detectZombieSession('def')
    expect(result).toContain('emotion-flatline')
  })

  it('detects drift-deadzone pattern', async () => {
    mockLog.mockReturnValue({
      sessionId: 'ghi',
      emotionScore: 0.4,
      outputDelta: 0.01,
      revisionCount: 2,
      tone: 'flat',
      recentOutputs: ['A', 'B']
    })

    const result = await detectZombieSession('ghi')
    expect(result).toContain('drift-deadzone')
  })

  it('flags revision threshold overflow as zombie even if no pattern matched', async () => {
    mockLog.mockReturnValue({
      sessionId: 'jkl',
      emotionScore: 0.9,
      outputDelta: 0.9,
      revisionCount: 10,
      tone: 'inspiring',
      recentOutputs: ['Q', 'R', 'S']
    })

    const result = await detectZombieSession('jkl')
    expect(result).toContain('Recovery triggered')
  })

  it('returns null when no zombie condition is met', async () => {
    mockLog.mockReturnValue({
      sessionId: 'mno',
      emotionScore: 0.8,
      outputDelta: 0.9,
      revisionCount: 1,
      tone: 'aligned',
      recentOutputs: ['U', 'V']
    })

    const result = await detectZombieSession('mno')
    expect(result).toBeNull()
    expect(promptReplay.triggerPromptReplay).not.toHaveBeenCalled()
  })
})
