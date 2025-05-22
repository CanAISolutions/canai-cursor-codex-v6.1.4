/**
 * @file trust-scorer.test.ts
 * @description Tests for the TrustScorer class
 */

// Codex: Legacy TrustFactors-based tests removed as part of AIProvider interface standardization (2025-05-15). All trust logic now uses canonical AIProvider from engines/ai-provider. See failure tracker for audit trail.

import { TrustScorer } from './trust-scorer';
import { EventBus } from '../event-bus/event-bus';
import { AIProvider } from '../../agents/debug/engines/ai-provider';

describe('TrustScorer', () => {
  let trustScorer: TrustScorer;
  let eventBus: EventBus;
  let aiProvider: AIProvider;

  beforeEach(() => {
    eventBus = {
      emit: jest.fn(),
      publish: jest.fn(),
      subscribe: jest.fn(),
      unsubscribe: jest.fn()
    } as unknown as EventBus;

    aiProvider = {
      ping: jest.fn().mockResolvedValue(true),
      detectBug: jest.fn().mockResolvedValue({ message: '', type: '', likelihood: 'high', impact: [] }),
      proposeFix: jest.fn().mockResolvedValue({ patch: '', filepath: '', reason: '' }),
      generateEscalationTicket: jest.fn().mockResolvedValue(undefined)
    } as unknown as AIProvider;

    trustScorer = new TrustScorer(eventBus, aiProvider);
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
      expect(history[0].score).toBeCloseTo(score, 5);
      expect(history[0].timestamp).toBeDefined();
    });
  });
}); 