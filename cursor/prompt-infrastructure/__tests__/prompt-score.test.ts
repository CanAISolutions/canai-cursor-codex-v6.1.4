/**
 * prompt-infrastructure/__tests__/prompt-score.test.ts
 * 
 * Purpose:
 * Tests prompt scoring functionality including trust, performance, and alignment metrics.
 */

import { EventBus } from '../../../event-bus/eventBus';
import { PromptScoringManager } from '../prompt-score';
import { PromptDefinition, PromptScore } from '../prompt-schema';

describe('PromptScoringManager', () => {
  let eventBus: EventBus;
  let scoringManager: PromptScoringManager;
  let mockPrompt: PromptDefinition;

  beforeEach(() => {
    eventBus = EventBus.getInstance();
    scoringManager = new PromptScoringManager(eventBus);

    // Create mock prompt
    mockPrompt = {
      id: 'test-prompt',
      type: 'system',
      version: '1.0.0',
      status: 'active',
      name: 'Test Prompt',
      description: 'A test prompt for scoring',
      content: 'Test content',
      metadata: {
        author: 'Test Author',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags: ['test'],
        dependencies: [],
        trustScore: 1,
        alignmentScore: 1,
        performanceScore: 1
      },
      contracts: [],
      constraints: [],
      evolution: {
        id: 'evo-1',
        version: '1.0.0',
        timestamp: Date.now(),
        changes: [],
        metadata: {
          author: 'Test Author',
          reason: 'Initial version',
          trustImpact: 0,
          performanceImpact: 0,
          alignmentImpact: 0
        }
      }
    };
  });

  describe('scorePrompt', () => {
    it('should generate valid scores for a prompt', async () => {
      const session = {
        input: { query: 'test query' },
        output: { response: 'test response' },
        metrics: {
          sessionId: 'test-session',
          environment: 'test',
          tokens: { used: 100, limit: 1000 },
          latency: 100,
          quality: 0.9,
          consistency: 0.8,
          feedback: { positive: 1, negative: 0 },
          fallbackUsage: 0,
          violations: []
        }
      };

      const score = await scoringManager.scorePrompt(mockPrompt, session);

      expect(score).toBeDefined();
      expect(score.promptId).toBe(mockPrompt.id);
      expect(score.version).toBe(mockPrompt.version);
      expect(score.metrics.trust).toBeDefined();
      expect(score.metrics.performance).toBeDefined();
      expect(score.metrics.alignment).toBeDefined();
    });

    it('should validate score ranges', async () => {
      const session = {
        input: { query: 'test query' },
        output: { response: 'test response' },
        metrics: {
          sessionId: 'test-session',
          environment: 'test',
          tokens: { used: 100, limit: 1000 },
          latency: 100,
          quality: 0.9,
          consistency: 0.8,
          feedback: { positive: 1, negative: 0 },
          fallbackUsage: 0,
          violations: []
        }
      };

      const score = await scoringManager.scorePrompt(mockPrompt, session);

      // Check trust metrics
      expect(score.metrics.trust.score).toBeGreaterThanOrEqual(0);
      expect(score.metrics.trust.score).toBeLessThanOrEqual(1);
      expect(score.metrics.trust.feedback).toBeGreaterThanOrEqual(0);
      expect(score.metrics.trust.feedback).toBeLessThanOrEqual(1);

      // Check performance metrics
      expect(score.metrics.performance.tokens).toBeGreaterThanOrEqual(0);
      expect(score.metrics.performance.tokens).toBeLessThanOrEqual(1);
      expect(score.metrics.performance.latency).toBeGreaterThanOrEqual(0);
      expect(score.metrics.performance.latency).toBeLessThanOrEqual(1);

      // Check alignment metrics
      expect(score.metrics.alignment.codexScore).toBeGreaterThanOrEqual(0);
      expect(score.metrics.alignment.codexScore).toBeLessThanOrEqual(1);
      expect(score.metrics.alignment.contractCompliance).toBeGreaterThanOrEqual(0);
      expect(score.metrics.alignment.contractCompliance).toBeLessThanOrEqual(1);
    });

    it('should detect score anomalies', async () => {
      // First score
      const session1 = {
        input: { query: 'test query' },
        output: { response: 'test response' },
        metrics: {
          sessionId: 'test-session-1',
          environment: 'test',
          tokens: { used: 100, limit: 1000 },
          latency: 100,
          quality: 0.9,
          consistency: 0.8,
          feedback: { positive: 1, negative: 0 },
          fallbackUsage: 0,
          violations: []
        }
      };

      await scoringManager.scorePrompt(mockPrompt, session1);

      // Second score with anomaly
      const session2 = {
        input: { query: 'test query' },
        output: { response: 'test response' },
        metrics: {
          sessionId: 'test-session-2',
          environment: 'test',
          tokens: { used: 100, limit: 1000 },
          latency: 100,
          quality: 0.1, // Significant drop in quality
          consistency: 0.8,
          feedback: { positive: 1, negative: 0 },
          fallbackUsage: 0,
          violations: []
        }
      };

      const score = await scoringManager.scorePrompt(mockPrompt, session2);
      expect(score.metrics.performance.quality).toBe(0.1);
    });

    it('should handle missing metrics gracefully', async () => {
      const session = {
        input: { query: 'test query' },
        output: { response: 'test response' },
        metrics: {
          sessionId: 'test-session',
          environment: 'test'
        }
      };

      const score = await scoringManager.scorePrompt(mockPrompt, session);

      expect(score).toBeDefined();
      expect(score.metrics.trust).toBeDefined();
      expect(score.metrics.performance).toBeDefined();
      expect(score.metrics.alignment).toBeDefined();
    });

    it('should emit events for scoring', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');

      const session = {
        input: { query: 'test query' },
        output: { response: 'test response' },
        metrics: {
          sessionId: 'test-session',
          environment: 'test',
          tokens: { used: 100, limit: 1000 },
          latency: 100,
          quality: 0.9,
          consistency: 0.8,
          feedback: { positive: 1, negative: 0 },
          fallbackUsage: 0,
          violations: []
        }
      };

      await scoringManager.scorePrompt(mockPrompt, session);

      expect(eventSpy).toHaveBeenCalledWith(
        'prompt.prompt:scored',
        expect.objectContaining({
          type: 'prompt:scored',
          data: expect.objectContaining({
            promptId: mockPrompt.id,
            version: mockPrompt.version
          })
        })
      );
    });
  });

  describe('validateScore', () => {
    it('should validate required fields', async () => {
      const invalidScore: PromptScore = {
        id: 'test-score',
        promptId: mockPrompt.id,
        version: mockPrompt.version,
        timestamp: Date.now(),
        metrics: {
          trust: {
            score: 0.8,
            feedback: 0.8,
            fallbackUsage: 0.8,
            violations: 0.8
          },
          performance: {
            tokens: 0.8,
            latency: 0.8,
            quality: 0.8,
            consistency: 0.8
          },
          alignment: {
            codexScore: 0.8,
            contractCompliance: 0.8,
            constraintSatisfaction: 0.8
          }
        },
        metadata: {
          sessionId: 'test-session',
          environment: 'test',
          context: {}
        }
      };

      const isValid = await scoringManager.validateScore(invalidScore);
      expect(isValid).toBe(true);
    });

    it('should reject scores with missing metrics', async () => {
      const invalidScore: PromptScore = {
        id: 'test-score',
        promptId: mockPrompt.id,
        version: mockPrompt.version,
        timestamp: Date.now(),
        metrics: {
          trust: {
            score: 0.8,
            feedback: 0.8,
            fallbackUsage: 0.8,
            violations: 0.8
          },
          performance: {
            tokens: 0.8,
            latency: 0.8,
            quality: 0.8,
            consistency: 0.8
          },
          alignment: {
            codexScore: 0.8,
            contractCompliance: 0.8,
            constraintSatisfaction: 0.8
          }
        },
        metadata: {
          sessionId: 'test-session',
          environment: 'test',
          context: {}
        }
      };

      // Remove performance and alignment metrics
      delete (invalidScore.metrics as any).performance;
      delete (invalidScore.metrics as any).alignment;

      const isValid = await scoringManager.validateScore(invalidScore);
      expect(isValid).toBe(false);
    });

    it('should reject scores with out-of-range values', async () => {
      const invalidScore: PromptScore = {
        id: 'test-score',
        promptId: mockPrompt.id,
        version: mockPrompt.version,
        timestamp: Date.now(),
        metrics: {
          trust: {
            score: 1.5, // Out of range
            feedback: 0.8,
            fallbackUsage: 0.8,
            violations: 0.8
          },
          performance: {
            tokens: 0.8,
            latency: 0.8,
            quality: 0.8,
            consistency: 0.8
          },
          alignment: {
            codexScore: 0.8,
            contractCompliance: 0.8,
            constraintSatisfaction: 0.8
          }
        },
        metadata: {
          sessionId: 'test-session',
          environment: 'test',
          context: {}
        }
      };

      const isValid = await scoringManager.validateScore(invalidScore);
      expect(isValid).toBe(false);
    });
  });
}); 