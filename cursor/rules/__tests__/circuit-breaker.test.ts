/**
 * rules/__tests__/circuit-breaker.test.ts
 * 
 * Purpose:
 * Tests circuit breaker functionality including trust-aware execution suppression.
 */

import { EventBus } from '../../utils/event-bus';
import { TrustCircuitBreaker } from '../circuit-breaker';
import { Violation, CircuitBreakerState } from '../rules-schema';

describe('TrustCircuitBreaker', () => {
  let eventBus: EventBus;
  let breaker: TrustCircuitBreaker;
  let mockViolation: Violation;

  beforeEach(() => {
    eventBus = new EventBus();
    breaker = new TrustCircuitBreaker(eventBus);

    // Create mock violation
    mockViolation = {
      id: 'test-violation',
      ruleId: 'test-rule',
      timestamp: Date.now(),
      severity: 'high',
      recoveryAction: 'circuit-break',
      context: {
        target: 'test-target',
        targetType: 'prompt',
        value: 'test value',
        expected: 'expected value'
      },
      metadata: {
        trustScore: 0.8
      }
    };
  });

  describe('check', () => {
    it('should allow execution when circuit is closed', async () => {
      const target = 'test-target';
      const isAllowed = await breaker.check(target);
      expect(isAllowed).toBe(true);
    });

    it('should block execution when circuit is open', async () => {
      const target = 'test-target';
      
      // Record violations to open circuit
      for (let i = 0; i < 5; i++) {
        breaker.recordViolation(mockViolation);
      }

      const isAllowed = await breaker.check(target);
      expect(isAllowed).toBe(false);
    });

    it('should attempt half-open state after timeout', async () => {
      const target = 'test-target';
      
      // Record violation to open circuit
      breaker.recordViolation(mockViolation);

      // Fast-forward time
      jest.advanceTimersByTime(6000);

      const isAllowed = await breaker.check(target);
      expect(isAllowed).toBe(true);
    });
  });

  describe('recordViolation', () => {
    it('should update circuit state on violation', () => {
      const target = 'test-target';
      breaker.recordViolation(mockViolation);

      const state = breaker.getState(target);
      expect(state).toBe('open');
    });

    it('should emit circuit opened event', () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      breaker.recordViolation(mockViolation);

      expect(eventSpy).toHaveBeenCalledWith(
        'rule.circuit:opened',
        expect.objectContaining({
          type: 'circuit:opened',
          data: expect.objectContaining({
            circuitId: mockViolation.ruleId,
            state: 'open'
          })
        })
      );
    });

    it('should track violation count', () => {
      const target = 'test-target';
      
      breaker.recordViolation(mockViolation);
      breaker.recordViolation(mockViolation);

      const state = breaker.getState(target);
      expect(state).toBe('open');
    });
  });

  describe('reset', () => {
    it('should reset circuit to closed state', () => {
      const target = 'test-target';
      
      // Open circuit
      breaker.recordViolation(mockViolation);
      
      // Reset circuit
      breaker.reset(target);

      const state = breaker.getState(target);
      expect(state).toBe('closed');
    });

    it('should emit circuit closed event', () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const target = 'test-target';
      
      breaker.recordViolation(mockViolation);
      breaker.reset(target);

      expect(eventSpy).toHaveBeenCalledWith(
        'rule.circuit:closed',
        expect.objectContaining({
          type: 'circuit:closed',
          data: expect.objectContaining({
            circuitId: target,
            state: 'closed'
          })
        })
      );
    });
  });

  describe('getState', () => {
    it('should return current circuit state', () => {
      const target = 'test-target';
      const initialState = breaker.getState(target);
      expect(initialState).toBe('closed');

      breaker.recordViolation(mockViolation);
      const openState = breaker.getState(target);
      expect(openState).toBe('open');
    });

    it('should return closed for unknown targets', () => {
      const state = breaker.getState('unknown-target');
      expect(state).toBe('closed');
    });
  });
}); 