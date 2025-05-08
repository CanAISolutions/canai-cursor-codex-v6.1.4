/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Test emotional validation and integrity"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Validate emotional resonance, integrity, and alignment across system outputs
 */

import { EmotionalIntelligenceEngine } from '../emotional-intelligence/pipeline';
import { monitorEmotionalIntegrity } from '../emotionalIntegrityAgent';
import { SmartPromptScore } from '../smartPromptScore';
import { EventBus } from '../../event-bus/eventBus';
import { emitSystemLog } from '../../utils/audit-utils';
import { DreamStateManager } from '../../utils/dreamstate-utils';

// Mock dependencies
jest.mock('../../event-bus/eventBus');
jest.mock('../../utils/audit-utils');
jest.mock('../../utils/dreamstate-utils');

describe('Emotion Validation System', () => {
  let emotionalEngine: EmotionalIntelligenceEngine;
  let smartPromptScore: SmartPromptScore;
  let eventBus: jest.Mocked<EventBus>;
  let dreamStateManager: DreamStateManager;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup mock implementations
    eventBus = {
      getInstance: jest.fn().mockReturnThis(),
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      clear: jest.fn()
    } as unknown as jest.Mocked<EventBus>;

    // Mock emotional resonance calculation
    (DreamStateManager.prototype.calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue({
      score: 90,
      factors: {
        valence: 0.9,
        arousal: 0.8,
        dominance: 0.85
      },
      confidence: 0.95
    });

    // Create instances
    emotionalEngine = new EmotionalIntelligenceEngine();
    smartPromptScore = new SmartPromptScore();
    dreamStateManager = new DreamStateManager();
  });

  describe('Emotional Intelligence Pipeline', () => {
    it('should process input with proper emotional context', async () => {
      const input = 'Test input with emotional content';
      const context = {
        userState: 0.8,
        conversationHistory: 0.7,
        environmentalFactors: 0.9
      };

      const result = await emotionalEngine.processInput(input, context);

      expect(result).toEqual({
        semanticAnalysis: expect.objectContaining({
          alignment: 0.9,
          tone: 'professional',
          confidence: expect.any(Number),
          semanticConfidence: expect.any(Number),
          interpretationQuality: expect.any(Number),
          recoveryNeeded: expect.any(Boolean)
        }),
        contextAwareness: expect.objectContaining({
          userState: 0.8,
          conversationHistory: 0.7,
          environmentalFactors: 0.9
        }),
        adaptiveResponse: expect.objectContaining({
          toneAdjustment: expect.any(Number),
          empathyLevel: expect.any(Number),
          clarityScore: expect.any(Number)
        })
      });
    });

    it('should detect and handle low emotional resonance', async () => {
      (DreamStateManager.prototype.calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue({
        score: 50,
        factors: {
          valence: 0.5,
          arousal: 0.4,
          dominance: 0.45
        },
        confidence: 0.6
      });

      const input = 'Test input with low emotional content';
      const context = {
        userState: 0.3,
        conversationHistory: 0.4
      };

      const result = await emotionalEngine.processInput(input, context);

      expect(result.semanticAnalysis.recoveryNeeded).toBe(true);
      expect(result.adaptiveResponse.empathyLevel).toBeGreaterThan(0.5);
    });
  });

  describe('Emotional Integrity Monitoring', () => {
    it('should detect optimal emotional state', async () => {
      const result = await monitorEmotionalIntegrity();

      expect(result).toEqual({
        optimal: true,
        issues: undefined
      });

      expect(emitSystemLog).toHaveBeenCalledWith(
        'emotional-state-optimal',
        expect.any(Object)
      );
    });

    it('should detect and report emotional drift', async () => {
      (DreamStateManager.prototype.calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue({
        score: 80,
        factors: {
          valence: 0.8,
          arousal: 0.75,
          dominance: 0.8
        },
        confidence: 0.85
      });

      const result = await monitorEmotionalIntegrity();

      expect(result).toEqual({
        optimal: false,
        issues: expect.arrayContaining([
          expect.objectContaining({
            type: 'coldness-drift',
            description: expect.any(String),
            suggestedAction: expect.any(String)
          })
        ])
      });

      expect(emitSystemLog).toHaveBeenCalledWith(
        'emotional-drift-detected',
        expect.any(Object)
      );
    });

    it('should detect trust signal degradation', async () => {
      (DreamStateManager.prototype.calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue({
        score: 80,
        factors: {
          valence: 0.8,
          arousal: 0.75,
          dominance: 0.8
        },
        confidence: 0.85
      });

      const result = await monitorEmotionalIntegrity();

      expect(result).toEqual({
        optimal: false,
        issues: expect.arrayContaining([
          expect.objectContaining({
            type: 'trust-signal-degradation',
            description: expect.any(String),
            suggestedAction: expect.any(String)
          })
        ])
      });
    });
  });

  describe('Smart Prompt Scoring', () => {
    it('should score prompts with emotional fidelity', async () => {
      const prompt = 'Test prompt with emotional content';
      const score = await smartPromptScore.scorePrompt(prompt);

      expect(score).toEqual({
        emotionalFidelity: expect.any(Number),
        clarity: expect.any(Number),
        trustSignals: expect.any(Number),
        revisionNeeded: expect.any(Boolean),
        suggestions: expect.any(Array)
      });

      expect(score.emotionalFidelity).toBeGreaterThan(0.85);
    });

    it('should detect and suggest improvements for low emotional fidelity', async () => {
      (DreamStateManager.prototype.calculateEmotionalResonanceScore as jest.Mock).mockResolvedValue({
        score: 70,
        factors: {
          valence: 0.7,
          arousal: 0.65,
          dominance: 0.7
        },
        confidence: 0.75
      });

      const prompt = 'Test prompt with low emotional content';
      const score = await smartPromptScore.scorePrompt(prompt);

      expect(score.revisionNeeded).toBe(true);
      expect(score.suggestions).toContain(
        expect.stringContaining('emotional resonance')
      );
    });

    it('should handle emotional state changes', () => {
      const event = {
        previousState: { score: 80, tone: 'professional' },
        newState: { score: 90, tone: 'empathetic' }
      };

      smartPromptScore['handleEmotionalStateChange'](event);

      expect(emitSystemLog).toHaveBeenCalledWith(
        'emotional-state-updated',
        expect.objectContaining({
          previousState: event.previousState,
          newState: event.newState
        })
      );
    });
  });

  describe('Event Handling', () => {
    it('should handle emotional state changes', () => {
      const event = {
        type: 'EMOTIONAL_STATE_CHANGED',
        data: {
          previousState: { score: 80 },
          newState: { score: 90 }
        }
      };

      // Trigger event handler
      const eventHandler = eventBus.on.mock.calls[0][1];
      eventHandler(event);

      expect(emitSystemLog).toHaveBeenCalledWith(
        'emotional-state-updated',
        expect.objectContaining({
          previousState: event.data.previousState,
          newState: event.data.newState
        })
      );
    });

    it('should handle emotional drift events', () => {
      const event = {
        type: 'EMOTIONAL_DRIFT_DETECTED',
        data: {
          score: 70,
          delta: -10,
          context: 'test-context'
        }
      };

      // Trigger event handler
      const eventHandler = eventBus.on.mock.calls[1][1];
      eventHandler(event);

      expect(emitSystemLog).toHaveBeenCalledWith(
        'emotional-drift-detected',
        expect.objectContaining({
          score: event.data.score,
          delta: event.data.delta
        })
      );
    });
  });
}); 