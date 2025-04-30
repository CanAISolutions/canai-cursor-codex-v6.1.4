// /tests/foresight/emotional-foresight-lite.spec.ts

/**
 * Test Suite: Emotional Foresight Lite
 * -------------------------------------
 * Validates signal prediction logic, detector clause accuracy,
 * fallback behavior, and logging emissions from:
 *
 * /cursor/accelerators/emotional-foresight-lite/foresight-model-lite.ts
 */

import { predictEmotionalTrajectory } from '../../cursor/accelerators/emotional-foresight-lite/foresight-model-lite'
import * as delta from '../../cursor/self-healing/ai-refactor-scripts/output-delta-analyzer'
import * as emotion from '../../cursor/system-intel/loggers/emotionDriftJournal'
import * as emitter from '../../cursor/system-intel/loggers/sessionDeltaLogEmitter'

describe('Emotional Foresight – Signal Prediction', () => {
  const mockSessionId = 'session-123'

  beforeAll(() => {
    // Mock delta and emotion functions
    jest.spyOn(delta, 'analyzeSessionDelta').mockReturnValue(0.35)
    jest.spyOn(emotion, 'getEmotionalScore').mockReturnValue(0.18)

    // Silence actual log emission
    jest.spyOn(emitter, 'emitDeltaLog').mockImplementation(() => {})
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('should detect "escalating-frustration" if revise count is high and tone is confused', () => {
    const history = [
      { input: '...', tone: 'neutral', emotionScore: 0.5 },
      { input: '...', tone: 'confused', emotionScore: 0.4 },
      { input: '...', tone: 'confused', emotionScore: 0.3 }
    ]

    const signals = predictEmotionalTrajectory(mockSessionId, history)
    expect(signals).toContain('escalating-frustration')
  })

  it('should fallback to default signal if no conditions match', () => {
    jest.spyOn(delta, 'analyzeSessionDelta').mockReturnValue(0.01)
    jest.spyOn(emotion, 'getEmotionalScore').mockReturnValue(0.8)

    const history = [
      { input: '...', tone: 'neutral', emotionScore: 0.8 }
    ]

    const signals = predictEmotionalTrajectory(mockSessionId, history)
    expect(signals).toEqual(['none-detected'])
  })

  it('should match "hope-signal" for clarity breakthrough', () => {
    const history = [
      { input: '...', outputClarityScore: 0.9, emotion: 'inspired' }
    ]

    const signals = predictEmotionalTrajectory(mockSessionId, history)
    expect(signals).toContain('hope-signal')
  })

  it('should emit a delta log when valid signals are detected', () => {
    const spy = jest.spyOn(emitter, 'emitDeltaLog')

    const history = [
      { input: '...', tone: 'confused', emotionScore: 0.3 },
      { input: '...', tone: 'confused', emotionScore: 0.2 },
      { input: '...', tone: 'confused', emotionScore: 0.15 }
    ]

    predictEmotionalTrajectory(mockSessionId, history)

    expect(spy).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
      event: 'emotional-foresight-signals',
      context: 'foresight-model-lite',
      signals: expect.arrayContaining(['escalating-frustration']),
      timestamp: expect.any(String)
    }))
  })

  it('should NOT emit delta log when only fallback signal is returned', () => {
    const spy = jest.spyOn(emitter, 'emitDeltaLog')
    jest.spyOn(delta, 'analyzeSessionDelta').mockReturnValue(0.01)

    const history = [
      { input: '...', emotionScore: 0.9 }
    ]

    const result = predictEmotionalTrajectory(mockSessionId, history)
    expect(result).toEqual(['none-detected'])
    expect(spy).not.toHaveBeenCalled()
  })
})
