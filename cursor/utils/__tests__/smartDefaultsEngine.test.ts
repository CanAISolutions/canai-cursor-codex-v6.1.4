/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Test smart defaults engine functionality"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Validate smart defaults generation, recording, and cross-session learning
 */

import { SmartDefaultsEngine, SmartDefaults, CrossSessionPattern } from '../smartDefaultsEngine';
import { EventBus } from '../../event-bus/eventBus';
import { SessionReuseEngine, SparkAnalytics } from '../sessionReuseEngine';
import { EmotionalMemoryBank, EmotionalPattern } from '../emotionalMemoryBank';
import { AirtableLogger } from '../airtableLogger';

// Mock dependencies
jest.mock('../sessionReuseEngine');
jest.mock('../emotionalMemoryBank');
jest.mock('../airtableLogger');
jest.mock('../../event-bus/eventBus');
jest.mock('../audit-utils', () => ({
  emitSystemLog: jest.fn()
}));

describe('SmartDefaultsEngine', () => {
  let engine: SmartDefaultsEngine;
  let eventBus: jest.Mocked<EventBus>;
  let sessionEngine: jest.Mocked<SessionReuseEngine>;
  let emotionalBank: jest.Mocked<EmotionalMemoryBank>;
  let airtableLogger: jest.Mocked<AirtableLogger>;

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

    sessionEngine = {
      recordSpark: jest.fn(),
      getTopPerformingSpark: jest.fn(),
      getSessionSparks: jest.fn().mockReturnValue([])
    } as unknown as jest.Mocked<SessionReuseEngine>;

    emotionalBank = {
      recordPattern: jest.fn(),
      findToneMatch: jest.fn(),
      getSessionPatterns: jest.fn().mockReturnValue([])
    } as unknown as jest.Mocked<EmotionalMemoryBank>;

    airtableLogger = {
      logDefaultApplied: jest.fn()
    } as unknown as jest.Mocked<AirtableLogger>;

    // Create engine instance
    engine = new SmartDefaultsEngine();
  });

  describe('getSmartDefaults', () => {
    it('should return session defaults when confidence is high', async () => {
      const mockSpark: SparkAnalytics = {
        id: 'test-spark-1',
        sparkName: 'defaults',
        promptType: 'discovery_funnel',
        trustScore: 4.5,
        emotionalResonance: 0.9,
        context: 'test-context',
        timestamp: new Date().toISOString(),
        reused: false,
        metadata: {
          tone: 'professional',
          industry: 'tech',
          challenge: 'growth'
        },
        metrics: {
          emotionalResonance: 0.9,
          engagement: 0.85,
          conversion: 0.8
        }
      };

      sessionEngine.getTopPerformingSpark.mockReturnValue(mockSpark);

      const defaults = await engine.getSmartDefaults('test-context');

      expect(defaults).toEqual({
        tone: 'professional',
        industry: 'tech',
        intent: 'growth',
        confidence: expect.any(Number),
        source: 'session'
      });
      expect(defaults.confidence).toBeGreaterThan(0.8);
    });

    it('should fall back to emotional defaults when session confidence is low', async () => {
      sessionEngine.getTopPerformingSpark.mockReturnValue(null);
      emotionalBank.findToneMatch.mockReturnValue({
        tone: 'empathetic',
        confidence: 0.7
      });

      const defaults = await engine.getSmartDefaults('test-context');

      expect(defaults).toEqual({
        tone: 'empathetic',
        confidence: 0.7,
        source: 'emotional'
      });
    });

    it('should return safe defaults when no strong signals exist', async () => {
      sessionEngine.getTopPerformingSpark.mockReturnValue(null);
      emotionalBank.findToneMatch.mockReturnValue({
        tone: 'neutral',
        confidence: 0.4
      });

      const defaults = await engine.getSmartDefaults('test-context');

      expect(defaults).toEqual({
        tone: 'supportive',
        confidence: 0.5,
        source: 'default'
      });
    });
  });

  describe('recordSuccessfulDefaults', () => {
    it('should record defaults in all storage systems', () => {
      const defaults = {
        tone: 'professional',
        industry: 'tech',
        intent: 'growth'
      };

      engine.recordSuccessfulDefaults(defaults, 'test-context');

      expect(sessionEngine.recordSpark).toHaveBeenCalledWith(
        expect.objectContaining({
          sparkName: 'defaults',
          promptType: 'discovery_funnel',
          trustScore: 4.2,
          emotionalResonance: 0.8,
          context: 'test-context',
          metadata: defaults
        })
      );

      expect(emotionalBank.recordPattern).toHaveBeenCalledWith(
        expect.objectContaining({
          tone: defaults.tone,
          intensity: 0.8,
          context: 'test-context',
          success: true
        })
      );

      expect(airtableLogger.logDefaultApplied).toHaveBeenCalledWith(
        expect.objectContaining({
          defaults,
          context: 'test-context',
          confidence: 0.8,
          source: 'session'
        })
      );
    });
  });

  describe('getCrossSessionLearningHook', () => {
    it('should analyze patterns across multiple sessions', async () => {
      const mockSparks: SparkAnalytics[] = [
        {
          id: 'test-spark-1',
          sparkName: 'defaults',
          promptType: 'discovery_funnel',
          trustScore: 4.5,
          emotionalResonance: 0.9,
          context: 'test-context',
          timestamp: new Date().toISOString(),
          reused: false,
          metadata: {
            tone: 'professional',
            industry: 'tech',
            challenge: 'growth'
          },
          metrics: {
            emotionalResonance: 0.9,
            engagement: 0.85,
            conversion: 0.8
          }
        }
      ];

      const mockEmotionalPatterns: EmotionalPattern[] = [
        {
          tone: 'professional',
          intensity: 0.8,
          context: 'test-context',
          sessionId: 'session1',
          success: true,
          timestamp: new Date().toISOString()
        }
      ];

      sessionEngine.getSessionSparks.mockReturnValue(mockSparks);
      emotionalBank.getSessionPatterns.mockReturnValue(mockEmotionalPatterns);

      const hook = engine.getCrossSessionLearningHook();
      const patterns = await hook(['session1', 'session2']);

      expect(patterns).toHaveLength(1);
      expect(patterns[0]).toEqual(
        expect.objectContaining({
          tone: 'professional',
          industry: 'tech',
          intent: 'growth',
          frequency: expect.any(Number),
          successRate: expect.any(Number),
          lastUsed: expect.any(String)
        })
      );

      expect(eventBus.emit).toHaveBeenCalledWith(
        'CROSS_SESSION_PATTERNS_ANALYZED',
        expect.objectContaining({
          patterns,
          sessionCount: 2,
          timestamp: expect.any(String)
        })
      );
    });

    it('should handle errors gracefully', async () => {
      sessionEngine.getSessionSparks.mockImplementation(() => {
        throw new Error('Test error');
      });

      const hook = engine.getCrossSessionLearningHook();
      const patterns = await hook(['session1']);

      expect(patterns).toEqual([]);
      expect(eventBus.emit).not.toHaveBeenCalled();
    });
  });

  describe('Event Handling', () => {
    it('should handle DEFAULTS_APPLIED event', () => {
      const event = {
        type: 'DEFAULTS_APPLIED',
        data: {
          defaults: {
            tone: 'professional',
            industry: 'tech'
          },
          context: 'test-context'
        }
      };

      // Trigger event handler
      const eventHandler = eventBus.on.mock.calls[0][1];
      eventHandler(event);

      expect(sessionEngine.recordSpark).toHaveBeenCalled();
      expect(emotionalBank.recordPattern).toHaveBeenCalled();
      expect(airtableLogger.logDefaultApplied).toHaveBeenCalled();
    });

    it('should handle DEFAULTS_REJECTED event', () => {
      const event = {
        type: 'DEFAULTS_REJECTED',
        data: {
          defaults: {
            tone: 'professional',
            industry: 'tech'
          },
          context: 'test-context',
          reason: 'user_preference'
        }
      };

      // Trigger event handler
      const eventHandler = eventBus.on.mock.calls[1][1];
      eventHandler(event);

      expect(emotionalBank.recordPattern).toHaveBeenCalledWith(
        expect.objectContaining({
          tone: 'professional',
          success: false
        })
      );
    });
  });
}); 