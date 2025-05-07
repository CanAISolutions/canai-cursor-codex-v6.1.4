/**
 * @file integration.test.ts
 * @description Integration tests for TrustScorer
 */

import { describe, expect, it, beforeEach } from '@jest/globals';
import { TrustScorer } from './trust-scorer';
import { EventBus } from '../event-bus/event-bus';
import { AIProvider } from '../debug/core/ai-provider';
import { TrustFactors } from './types';

describe('TrustScorer Integration', () => {
  let trustScorer: TrustScorer;
  let eventBus: EventBus;
  let aiProvider: AIProvider;

  beforeEach(() => {
    eventBus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn()
    } as unknown as EventBus;

    aiProvider = {
      evaluateTrust: jest.fn().mockResolvedValue(0.9)
    } as unknown as AIProvider;

    trustScorer = new TrustScorer(eventBus, aiProvider);
  });

  describe('trust evaluation', () => {
    it('should evaluate trust score from factors', async () => {
      const factors: TrustFactors = {
        reliability: 0.95,
        safety: 0.95,
        performance: 0.95,
        ethical: 0.95
      };

      const score = await trustScorer.evaluateTrust(factors);
      expect(score).toBeGreaterThanOrEqual(0.9);
    });

    it('should emit warning for low trust score', async () => {
      const factors: TrustFactors = {
        reliability: 0.85,
        safety: 0.85,
        performance: 0.85,
        ethical: 0.85
      };

      await expect(trustScorer.evaluateTrust(factors)).rejects.toThrow();
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'trust:warning'
        }),
        'medium'
      );
    });

    it('should emit violation for critical trust score', async () => {
      const factors: TrustFactors = {
        reliability: 0.5,
        safety: 0.5,
        performance: 0.5,
        ethical: 0.5
      };

      await expect(trustScorer.evaluateTrust(factors)).rejects.toThrow();
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'trust:violation'
        }),
        'high'
      );
    });
  });

  describe('trust persistence', () => {
    it('should persist trust scores', async () => {
      const component = 'test-component';
      const score = 0.9;
      await trustScorer.adjustTrustScore(component, score - 0.8, 'test');

      const newTrustScorer = new TrustScorer(eventBus, aiProvider);
      const persistedScore = newTrustScorer.getTrustScore(component);
      expect(persistedScore).toBe(score);
    });
  });

  describe('trust metrics', () => {
    it('should record trust metrics', async () => {
      const component = 'test-component';
      const score = 0.9;
      await trustScorer.adjustTrustScore(component, score - 0.8, 'test');

      const history = trustScorer.getTrustHistory(component);
      expect(history).toHaveLength(1);
      expect(history[0].score).toBe(score);
      expect(history[0].timestamp).toBeDefined();
    });
  });
}); 