/**
 * @file trust-scorer.test.ts
 * @description Tests for trust-scorer.ts.
 */
import { TrustScorer } from './trust-scorer';
import { EventBusAgent } from '../event-bus/event-bus';
import * as fs from 'fs';
import * as path from 'path';
import { TrustEventType, TrustEventData, TrustViolationData, TrustWarningData, TrustSignalData } from './types';
import { recordMetric } from '../debug/utils/telemetry';

jest.mock('../debug/utils/telemetry', () => ({
  recordMetric: jest.fn(),
}));

jest.mock('../event-bus/event-bus');

describe('[DreamState] TrustScorer', () => {
  const traceId = 'test-trace';
  const contextDir = path.join('.canai-context');
  const trustScoresPath = path.join(contextDir, 'trust-scores.json');
  let trustScorer: TrustScorer;
  let eventBus: jest.Mocked<EventBusAgent>;

  beforeEach(() => {
    if (fs.existsSync(contextDir)) {
      fs.rmSync(contextDir, { recursive: true });
    }
    fs.mkdirSync(contextDir, { recursive: true });
    eventBus = new EventBusAgent(traceId) as jest.Mocked<EventBusAgent>;
    trustScorer = new TrustScorer(eventBus);
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (fs.existsSync(contextDir)) {
      fs.rmSync(contextDir, { recursive: true });
    }
  });

  it('calculates trust scores correctly with weighted factors', async () => {
    const factors = {
      reliability: 0.9,
      safety: 0.95,
      performance: 0.85,
      ethical: 1.0
    };

    const score = await trustScorer.evaluateTrust('test-component', factors);
    expect(score).toBeGreaterThanOrEqual(0.9);
    expect(score).toBeLessThanOrEqual(1.0);
  });

  it('handles trust violations when score is below threshold', async () => {
    const factors = {
      reliability: 0.5,
      safety: 0.6,
      performance: 0.7,
      ethical: 0.8
    };

    await expect(trustScorer.evaluateTrust('low-trust-component', factors))
      .rejects.toThrow();
  });

  it('records trust scores and maintains history', async () => {
    const factors = {
      reliability: 0.95,
      safety: 0.95,
      performance: 0.95,
      ethical: 0.95
    };

    await trustScorer.evaluateTrust('test-component', factors);
    const history = trustScorer.getTrustHistory('test-component');
    expect(history).toHaveLength(1);
    expect(history[0].score).toBeGreaterThanOrEqual(0.9);
  });

  it('emits trust signals through event bus', async () => {
    const factors = {
      reliability: 0.95,
      safety: 0.95,
      performance: 0.95,
      ethical: 0.95
    };

    await trustScorer.evaluateTrust('test-component', factors);
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'trust:signal',
        data: expect.objectContaining({
          component: 'test-component',
          score: expect.any(Number)
        }),
        timestamp: expect.any(String)
      }),
      'high'
    );
  });

  it('evaluates task trust based on outcome', async () => {
    const outcome = {
      success: true,
      duration: 500,
      quality: 0.95,
      error: undefined
    };

    await trustScorer.evaluateTaskTrust('task-1', outcome);
    const score = trustScorer.getTrustScore('task:task-1');
    expect(score).toBeGreaterThanOrEqual(0.9);
  });

  it('handles task failures appropriately', async () => {
    const outcome = {
      success: false,
      duration: 1000,
      quality: 0.5,
      error: 'Task failed'
    };

    await expect(trustScorer.evaluateTaskTrust('task-1', outcome))
      .rejects.toThrow();
  });

  it('maintains trust thresholds for different components', async () => {
    const highTrustFactors = {
      reliability: 0.95,
      safety: 0.95,
      performance: 0.95,
      ethical: 0.95
    };

    const lowTrustFactors = {
      reliability: 0.5,
      safety: 0.6,
      performance: 0.7,
      ethical: 0.8
    };

    await expect(trustScorer.evaluateTrust('high-trust-component', highTrustFactors))
      .resolves.toBeGreaterThanOrEqual(0.9);

    await expect(trustScorer.evaluateTrust('low-trust-component', lowTrustFactors))
      .rejects.toThrow();
  });

  it('emits warnings for scores below warning threshold', async () => {
    const factors = {
      reliability: 0.85,
      safety: 0.85,
      performance: 0.85,
      ethical: 0.85
    };

    await trustScorer.evaluateTrust('warning-component', factors);
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'trust:warning',
        data: expect.objectContaining({
          component: 'warning-component',
          score: expect.any(Number)
        }),
        timestamp: expect.any(String)
      }),
      'medium'
    );
  });

  describe('Event Sequencing', () => {
    it('emits warning before violation when score drops below both thresholds', async () => {
      const factors = {
        reliability: 0.8,
        safety: 0.8,
        performance: 0.8,
        ethical: 0.8
      };

      const publishCalls: Array<{ type: TrustEventType; data: TrustEventData }> = [];
      eventBus.publish.mockImplementation(async (event) => {
        publishCalls.push({ type: event.type as TrustEventType, data: event.data as TrustEventData });
        return Promise.resolve();
      });

      await expect(trustScorer.evaluateTrust('test-component', factors)).rejects.toThrow();

      expect(publishCalls).toHaveLength(2);
      expect(publishCalls[0].type).toBe('trust:warning');
      expect(publishCalls[1].type).toBe('trust:violation');
    });

    it('maintains correct event order with multiple evaluations', async () => {
      const publishCalls: Array<{ type: TrustEventType; data: TrustEventData }> = [];
      eventBus.publish.mockImplementation(async (event) => {
        publishCalls.push({ type: event.type as TrustEventType, data: event.data as TrustEventData });
        return Promise.resolve();
      });

      // First evaluation - high score
      await trustScorer.evaluateTrust('test-component', {
        reliability: 0.95,
        safety: 0.95,
        performance: 0.95,
        ethical: 0.95
      });

      // Second evaluation - warning threshold
      await trustScorer.evaluateTrust('test-component', {
        reliability: 0.85,
        safety: 0.85,
        performance: 0.85,
        ethical: 0.85
      });

      // Third evaluation - violation threshold
      await expect(trustScorer.evaluateTrust('test-component', {
        reliability: 0.8,
        safety: 0.8,
        performance: 0.8,
        ethical: 0.8
      })).rejects.toThrow();

      expect(publishCalls).toHaveLength(4); // signal, signal, warning, violation
      expect(publishCalls[0].type).toBe('trust:signal');
      expect(publishCalls[1].type).toBe('trust:signal');
      expect(publishCalls[2].type).toBe('trust:warning');
      expect(publishCalls[3].type).toBe('trust:violation');
    });
  });

  describe('Type Safety', () => {
    it('validates event data structure for trust signals', async () => {
      const factors = {
        reliability: 0.95,
        safety: 0.95,
        performance: 0.95,
        ethical: 0.95
      };

      await trustScorer.evaluateTrust('test-component', factors);

      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'trust:signal',
          data: expect.objectContaining({
            component: 'test-component',
            score: expect.any(Number),
            timestamp: expect.any(String),
            factors: expect.objectContaining({
              reliability: expect.any(Number),
              safety: expect.any(Number),
              performance: expect.any(Number),
              ethical: expect.any(Number)
            })
          })
        }),
        'high'
      );
    });

    it('validates event data structure for trust violations', async () => {
      const factors = {
        reliability: 0.5,
        safety: 0.5,
        performance: 0.5,
        ethical: 0.5
      };

      await expect(trustScorer.evaluateTrust('test-component', factors)).rejects.toThrow();

      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'trust:violation',
          data: expect.objectContaining({
            component: 'test-component',
            score: expect.any(Number),
            timestamp: expect.any(String),
            threshold: expect.any(Number)
          })
        }),
        'high'
      );
    });
  });

  describe('Integration Scenarios', () => {
    it('handles rapid trust score changes with correct event sequencing', async () => {
      const publishCalls: Array<{ type: TrustEventType; data: TrustEventData }> = [];
      eventBus.publish.mockImplementation(async (event) => {
        publishCalls.push({ type: event.type as TrustEventType, data: event.data as TrustEventData });
        return Promise.resolve();
      });

      // Rapid sequence of evaluations
      await Promise.all([
        trustScorer.evaluateTrust('component-1', {
          reliability: 0.95,
          safety: 0.95,
          performance: 0.95,
          ethical: 0.95
        }),
        trustScorer.evaluateTrust('component-2', {
          reliability: 0.85,
          safety: 0.85,
          performance: 0.85,
          ethical: 0.85
        }),
        expect(trustScorer.evaluateTrust('component-3', {
          reliability: 0.5,
          safety: 0.5,
          performance: 0.5,
          ethical: 0.5
        })).rejects.toThrow()
      ]);

      // Verify event order and types
      const eventTypes = publishCalls.map(call => call.type);
      expect(eventTypes).toContain('trust:signal');
      expect(eventTypes).toContain('trust:warning');
      expect(eventTypes).toContain('trust:violation');
    });

    it('maintains trust history across multiple evaluations', async () => {
      const component = 'test-component';
      const evaluations = [
        { factors: { reliability: 0.95, safety: 0.95, performance: 0.95, ethical: 0.95 }, expectedScore: 0.95 },
        { factors: { reliability: 0.85, safety: 0.85, performance: 0.85, ethical: 0.85 }, expectedScore: 0.85 },
        { factors: { reliability: 0.75, safety: 0.75, performance: 0.75, ethical: 0.75 }, expectedScore: 0.75 }
      ];

      for (const evaluation of evaluations) {
        await trustScorer.evaluateTrust(component, evaluation.factors);
      }

      const history = trustScorer.getTrustHistory(component);
      expect(history).toHaveLength(3);
      expect(history[0].score).toBeCloseTo(evaluations[0].expectedScore, 2);
      expect(history[1].score).toBeCloseTo(evaluations[1].expectedScore, 2);
      expect(history[2].score).toBeCloseTo(evaluations[2].expectedScore, 2);
    });
  });

  describe('Edge Cases', () => {
    it('handles boundary conditions around warning threshold', async () => {
      const publishCalls: Array<{ type: TrustEventType; data: TrustEventData }> = [];
      eventBus.publish.mockImplementation(async (event) => {
        publishCalls.push({ type: event.type as TrustEventType, data: event.data as TrustEventData });
        return Promise.resolve();
      });

      // Just above warning threshold
      await trustScorer.evaluateTrust('test-component', {
        reliability: 0.86,
        safety: 0.86,
        performance: 0.86,
        ethical: 0.86
      });

      // Just below warning threshold
      await trustScorer.evaluateTrust('test-component', {
        reliability: 0.84,
        safety: 0.84,
        performance: 0.84,
        ethical: 0.84
      });

      expect(publishCalls).toHaveLength(3); // signal, signal, warning
      expect(publishCalls[0].type).toBe('trust:signal');
      expect(publishCalls[1].type).toBe('trust:signal');
      expect(publishCalls[2].type).toBe('trust:warning');
    });

    it('handles boundary conditions around minimum threshold', async () => {
      const publishCalls: Array<{ type: TrustEventType; data: TrustEventData }> = [];
      eventBus.publish.mockImplementation(async (event) => {
        publishCalls.push({ type: event.type as TrustEventType, data: event.data as TrustEventData });
        return Promise.resolve();
      });

      // Just above minimum threshold
      await trustScorer.evaluateTrust('test-component', {
        reliability: 0.91,
        safety: 0.91,
        performance: 0.91,
        ethical: 0.91
      });

      // Just below minimum threshold
      await expect(trustScorer.evaluateTrust('test-component', {
        reliability: 0.89,
        safety: 0.89,
        performance: 0.89,
        ethical: 0.89
      })).rejects.toThrow();

      expect(publishCalls).toHaveLength(3); // signal, warning, violation
      expect(publishCalls[0].type).toBe('trust:signal');
      expect(publishCalls[1].type).toBe('trust:warning');
      expect(publishCalls[2].type).toBe('trust:violation');
    });
  });
});

describe('TrustScorer', () => {
  let trustScorer: TrustScorer;
  let eventBus: EventBusAgent;
  let emittedEvents: any[];

  beforeEach(() => {
    emittedEvents = [];
    eventBus = {
      publish: jest.fn().mockImplementation(async (event) => {
        emittedEvents.push(event);
      })
    } as any;

    trustScorer = new TrustScorer(eventBus);
  });

  describe('adjustTrustScore', () => {
    const TEST_COMPONENT = 'test-component';

    beforeEach(() => {
      // Initialize with a base score
      trustScorer['trustScores'].set(TEST_COMPONENT, 0.8);
    });

    it('should increase trust score within bounds', async () => {
      await trustScorer.adjustTrustScore(TEST_COMPONENT, 0.1, 'positive behavior');
      
      expect(trustScorer.getTrustScore(TEST_COMPONENT)).toBe(0.9);
      expect(emittedEvents).toHaveLength(1);
      expect(emittedEvents[0].type).toBe('trust:signal');
    });

    it('should decrease trust score within bounds', async () => {
      await trustScorer.adjustTrustScore(TEST_COMPONENT, -0.1, 'negative behavior');
      
      expect(trustScorer.getTrustScore(TEST_COMPONENT)).toBe(0.7);
      expect(emittedEvents).toHaveLength(2); // signal + warning
      expect(emittedEvents[0].type).toBe('trust:signal');
      expect(emittedEvents[1].type).toBe('trust:warning');
    });

    it('should cap trust score at 1.0', async () => {
      await trustScorer.adjustTrustScore(TEST_COMPONENT, 0.3, 'excellent behavior');
      
      expect(trustScorer.getTrustScore(TEST_COMPONENT)).toBe(1.0);
      expect(emittedEvents).toHaveLength(1);
      expect(emittedEvents[0].type).toBe('trust:signal');
    });

    it('should floor trust score at 0.0', async () => {
      await trustScorer.adjustTrustScore(TEST_COMPONENT, -1.0, 'severe violation');
      
      expect(trustScorer.getTrustScore(TEST_COMPONENT)).toBe(0.0);
      expect(emittedEvents).toHaveLength(3); // signal + warning + violation
      expect(emittedEvents[0].type).toBe('trust:signal');
      expect(emittedEvents[1].type).toBe('trust:warning');
      expect(emittedEvents[2].type).toBe('trust:violation');
    });

    it('should emit warning when crossing warning threshold', async () => {
      await trustScorer.adjustTrustScore(TEST_COMPONENT, -0.1, 'crossing warning threshold');
      
      expect(emittedEvents).toHaveLength(2);
      expect(emittedEvents[1].type).toBe('trust:warning');
      expect(emittedEvents[1].data.warningThreshold).toBe(0.85);
    });

    it('should emit violation when crossing minimum threshold', async () => {
      await trustScorer.adjustTrustScore(TEST_COMPONENT, -0.2, 'crossing minimum threshold');
      
      expect(emittedEvents).toHaveLength(3);
      expect(emittedEvents[2].type).toBe('trust:violation');
      expect(emittedEvents[2].data.threshold).toBe(0.9);
    });

    it('should record metrics for all events', async () => {
      await trustScorer.adjustTrustScore(TEST_COMPONENT, -0.2, 'recording metrics');
      
      expect(recordMetric).toHaveBeenCalledWith('trust_signal', expect.any(Object));
      expect(recordMetric).toHaveBeenCalledWith('trust_warning', expect.any(Object));
      expect(recordMetric).toHaveBeenCalledWith('trust_violation', expect.any(Object));
    });

    it('should maintain trust history', async () => {
      await trustScorer.adjustTrustScore(TEST_COMPONENT, -0.1, 'updating history');
      
      const history = trustScorer.getTrustHistory(TEST_COMPONENT);
      expect(history).toHaveLength(1);
      expect(history[0].score).toBe(0.7);
      expect(history[0].timestamp).toBeLessThanOrEqual(Date.now());
    });
  });
}); 