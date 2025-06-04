import { AdvancedAnalyticsInsightsEngine } from './advanced-analytics-insights-engine';
import { EventBus } from '../../../cursor/utils/event-bus';
import { SparkSplitAnalyticsEngine } from '../../../analytics/sparksplit-analytics';
import { GoldmineIntelligenceEngine } from '../../../analytics/goldmine-intelligence-engine';

describe('AdvancedAnalyticsInsightsEngine', () => {
  let engine: AdvancedAnalyticsInsightsEngine;
  let mockEventBus: EventBus;
  let mockSparkSplitEngine: SparkSplitAnalyticsEngine;
  let mockGoldmineEngine: GoldmineIntelligenceEngine;

  beforeEach(() => {
    mockEventBus = new EventBus();
    mockSparkSplitEngine = new SparkSplitAnalyticsEngine();
    mockGoldmineEngine = new GoldmineIntelligenceEngine();
    engine = new AdvancedAnalyticsInsightsEngine(
      mockEventBus,
      mockSparkSplitEngine,
      mockGoldmineEngine
    );
  });

  describe('Sacred Reversal Test', () => {
    test('should pass with valid emotional context', async () => {
      const mockData = {
        sessionId: 'test-session',
        analytics: {
          current: {
            emotionalCompass: {
              powerScore: 0.95,
              trustScore: 0.98
            }
          },
          competitiveMetrics: {
            trustTransparencyAdvantage: 0.97
          }
        }
      };

      await engine.generateInsights(mockData);
      const result = await engine.validateSacredReversalTest();
      expect(result).toBe(true);
    });

    test('should handle empty insights gracefully', async () => {
      const result = await engine.validateSacredReversalTest();
      expect(result).toBe(true); // Should return 0.975 compliance
    });

    test('should fail with invalid emotional context', async () => {
      const mockData = {
        sessionId: 'test-session',
        analytics: {
          current: {},
          competitiveMetrics: {}
        }
      };

      await engine.generateInsights(mockData);
      const result = await engine.validateSacredReversalTest();
      expect(result).toBe(false);
    });
  });

  describe('SparkSplit Update Handling', () => {
    test('should handle null data gracefully', async () => {
      await expect(engine.generateInsights(null)).resolves.not.toThrow();
    });

    test('should handle missing fields gracefully', async () => {
      const mockData = {
        sessionId: 'test-session'
        // Missing analytics field
      };

      await expect(engine.generateInsights(mockData)).resolves.not.toThrow();
    });

    test('should process valid data correctly', async () => {
      const mockData = {
        sessionId: 'test-session',
        analytics: {
          current: {
            emotionalCompass: {
              powerScore: 0.92,
              trustScore: 0.95
            }
          },
          competitiveMetrics: {
            trustTransparencyAdvantage: 0.94
          }
        }
      };

      await expect(engine.generateInsights(mockData)).resolves.not.toThrow();
    });
  });

  describe('User Behavior Insights', () => {
    test('should process user behavior data', async () => {
      const mockData = {
        userId: 'test-user',
        behavior: {
          interactions: 10,
          engagement: 0.85
        }
      };

      await expect(engine.generateInsights(mockData)).resolves.not.toThrow();
    });
  });

  describe('Competitive Shift Insights', () => {
    test('should process competitive shift data', async () => {
      const mockData = {
        marketId: 'test-market',
        shifts: {
          trustTransparency: 0.93,
          emotionalIntelligence: 0.91
        }
      };

      await expect(engine.generateInsights(mockData)).resolves.not.toThrow();
    });
  });

  describe('ULID Generation', () => {
    test('should generate unique IDs', async () => {
      const insights1 = await engine.generateInsights();
      const insights2 = await engine.generateInsights();
      expect(insights1[0]?.insightId).not.toBe(insights2[0]?.insightId);
    });

    test('should generate valid format', async () => {
      const insights = await engine.generateInsights();
      expect(insights[0]?.insightId).toMatch(/^[a-zA-Z0-9]+$/);
    });
  });
}); 