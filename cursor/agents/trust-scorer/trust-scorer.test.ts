/**
 * @file trust-scorer.test.ts
 * @description Tests for the TrustScorer class
 */

import { describe, expect, it, beforeEach } from '@jest/globals';
import { TrustScorer } from './trust-scorer';
import { EventBus } from '../event-bus/event-bus';
import { AIProvider } from '../debug/core/ai-provider';
import { TrustFactors } from './types';

describe('TrustScorer', () => {
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

  describe('evaluateTrust', () => {
    it('should evaluate trust score from factors', async () => {
      const factors: TrustFactors = {
        reliability: 0.9,
        safety: 0.85,
        performance: 0.8,
        ethical: 0.75
      };

      const score = await trustScorer.evaluateTrust(factors);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('should throw error for low trust score', async () => {
      const factors: TrustFactors = {
        reliability: 0.5,
        safety: 0.5,
        performance: 0.5,
        ethical: 0.5
      };

      await expect(trustScorer.evaluateTrust(factors)).rejects.toThrow();
    });
  });

  describe('adjustTrustScore', () => {
    it('should adjust trust score within bounds', async () => {
      const component = 'test-component';
      const initialScore = trustScorer.getTrustScore(component);
      const newScore = await trustScorer.adjustTrustScore(component, 0.1, 'test');
      expect(newScore).toBeGreaterThan(initialScore);
      expect(newScore).toBeLessThanOrEqual(1);
    });

    it('should not exceed maximum adjustment', async () => {
      const component = 'test-component';
      const initialScore = trustScorer.getTrustScore(component);
      const newScore = await trustScorer.adjustTrustScore(component, 0.5, 'test');
      expect(newScore - initialScore).toBeLessThanOrEqual(0.2);
    });
  });

  describe('trust thresholds', () => {
    it('should emit warning for low trust score', async () => {
      const factors: TrustFactors = {
        reliability: 0.8,
        safety: 0.8,
        performance: 0.8,
        ethical: 0.8
      };

      await expect(trustScorer.evaluateTrust(factors)).rejects.toThrow();
      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'trust:warning',
          data: expect.objectContaining({
            score: expect.any(Number)
          })
        }),
        'medium'
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