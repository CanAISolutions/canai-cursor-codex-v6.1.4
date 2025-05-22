/**
 * rules/circuit-breaker.ts
 * 
 * Purpose:
 * Implements trust-aware execution suppression.
 * Triggers when trust decay or rule violations exceed thresholds.
 * Integrates with MetaControl for system-wide circuit breaking.
 */

import { EventBus } from '../event-bus/eventBus';
import { 
  CircuitBreaker, 
  CircuitBreakerManager, 
  CircuitBreakerState,
  Violation,
  RuleEventType
} from './rules-schema';
import { v4 as uuidv4 } from 'uuid';

export class TrustCircuitBreaker implements CircuitBreakerManager {
  private breakers: Map<string, CircuitBreaker> = new Map();
  private readonly defaultDecayRate = 0.1;
  private readonly halfOpenTimeout = 5000; // 5 seconds

  constructor(
    private eventBus: EventBus,
    private defaultThreshold: number = 0.8
  ) {}

  /**
   * Checks if a target's circuit is closed
   */
  async check(target: string): Promise<boolean> {
    const breaker = this.getOrCreateBreaker(target);
    
    if (breaker.state === 'closed') {
      return true;
    }

    if (breaker.state === 'half-open') {
      return this.attemptHalfOpen(breaker);
    }

    return false;
  }

  /**
   * Records a violation and updates circuit state
   */
  recordViolation(violation: Violation): void {
    const breaker = this.getOrCreateBreaker(violation.ruleId);
    
    breaker.violationCount++;
    breaker.lastViolation = Date.now();
    breaker.metadata.trustScore = this.calculateTrustScore(breaker);

    if (this.shouldOpenCircuit(breaker)) {
      this.openCircuit(breaker);
    }
  }

  /**
   * Resets a circuit breaker
   */
  reset(target: string): void {
    const breaker = this.breakers.get(target);
    if (breaker) {
      breaker.state = 'closed';
      breaker.violationCount = 0;
      breaker.metadata.trustScore = 1.0;
      breaker.metadata.updatedAt = Date.now();
      
      this.emitEvent('circuit:closed', {
        circuitId: target,
        state: 'closed'
      });
    }
  }

  /**
   * Gets the current state of a circuit breaker
   */
  getState(target: string): CircuitBreakerState {
    return this.breakers.get(target)?.state || 'closed';
  }

  /**
   * Gets or creates a circuit breaker for a target
   */
  private getOrCreateBreaker(target: string): CircuitBreaker {
    if (!this.breakers.has(target)) {
      const breaker: CircuitBreaker = {
        id: uuidv4(),
        state: 'closed',
        threshold: this.defaultThreshold,
        decayRate: this.defaultDecayRate,
        lastViolation: 0,
        violationCount: 0,
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
          trustScore: 1.0
        }
      };
      this.breakers.set(target, breaker);
    }
    return this.breakers.get(target)!;
  }

  /**
   * Attempts to transition a circuit to half-open state
   */
  private async attemptHalfOpen(breaker: CircuitBreaker): Promise<boolean> {
    const timeSinceLastViolation = Date.now() - breaker.lastViolation;
    
    if (timeSinceLastViolation < this.halfOpenTimeout) {
      return false;
    }

    breaker.state = 'half-open';
    breaker.metadata.updatedAt = Date.now();
    
    this.emitEvent('circuit:half-open', {
      circuitId: breaker.id,
      state: 'half-open'
    });

    return true;
  }

  /**
   * Opens a circuit breaker
   */
  private openCircuit(breaker: CircuitBreaker): void {
    breaker.state = 'open';
    breaker.metadata.updatedAt = Date.now();
    breaker.metadata.reason = 'Trust threshold exceeded';
    
    this.emitEvent('circuit:opened', {
      circuitId: breaker.id,
      state: 'open'
    });
  }

  /**
   * Determines if a circuit should be opened
   */
  private shouldOpenCircuit(breaker: CircuitBreaker): boolean {
    const trustScore = this.calculateTrustScore(breaker);
    return trustScore < breaker.threshold;
  }

  /**
   * Calculates trust score based on violations and decay
   */
  private calculateTrustScore(breaker: CircuitBreaker): number {
    const timeSinceLastViolation = Date.now() - breaker.lastViolation;
    const decay = Math.min(1, timeSinceLastViolation * breaker.decayRate);
    
    return Math.max(0, breaker.metadata.trustScore - decay);
  }

  /**
   * Emits a circuit breaker event
   */
  private emitEvent(type: RuleEventType, data: { circuitId: string; state: CircuitBreakerState }): void {
    this.eventBus.emit(`rule.${type}`, {
      type,
      data: {
        ...data,
        timestamp: Date.now()
      }
    });
  }
} 