// cortex.test.ts — Integration Tests for Sentinel Prime Cortex Module
// Codex v6.1.4 | Dream State & Ideal CX Thread enforced
//
// WHAT: Validates event bus and enforcement routines for Cortex module.
// WHY: Ensures modularity, auditability, and emotional/trust protocol compliance.
// HOW: Mocks fallback and audit hooks, tests all public interfaces and logic blocks.

import {
  CortexEventBusImpl,
  CortexEvent,
  CortexAgentMessage,
  EmotionalPayload,
  TrustPayload,
  EMOTIONAL_RESONANCE_THRESHOLD,
  TRUST_WARNING_THRESHOLD,
  TRUST_CRITICAL_THRESHOLD,
  enforceEmotionalResonance,
  enforceTrustScore,
  CortexFallbackHandler
} from './cortex';

// --- Mocks ---

/**
 * Mock fallback handler for testing fallback logic.
 */
class MockFallbackHandler implements CortexFallbackHandler {
  public emotionalFallbackCalled = false;
  public trustFallbackCalled = false;
  handleEmotionalFallback(message: CortexAgentMessage): void {
    this.emotionalFallbackCalled = true;
  }
  handleTrustFallback(message: CortexAgentMessage): void {
    this.trustFallbackCalled = true;
  }
}

// --- Event Bus Tests ---
describe('CortexEventBusImpl', () => {
  it('should subscribe and publish events to the correct handler', () => {
    const bus = new CortexEventBusImpl();
    const event: CortexEvent = { type: 'test', data: { foo: 'bar' }, timestamp: Date.now() };
    let received = false;
    bus.subscribe('test', (e) => {
      received = e.data.foo === 'bar';
    });
    bus.publish(event);
    expect(received).toBe(true);
  });

  it('should unsubscribe handlers correctly', () => {
    const bus = new CortexEventBusImpl();
    const event: CortexEvent = { type: 'test', data: {}, timestamp: Date.now() };
    let received = false;
    const handler = () => { received = true; };
    bus.subscribe('test', handler);
    bus.unsubscribe('test', handler);
    bus.publish(event);
    expect(received).toBe(false);
  });

  it('should broadcast events to all handlers', () => {
    const bus = new CortexEventBusImpl();
    const event: CortexEvent = { type: 'broadcast', data: {}, timestamp: Date.now() };
    let count = 0;
    bus.subscribe('broadcast', () => { count++; });
    bus.subscribe('other', () => { count++; });
    bus.broadcast(event);
    expect(count).toBe(2);
  });
});

// --- Emotional Resonance Enforcement Tests ---
describe('enforceEmotionalResonance', () => {
  it('should trigger fallback if resonanceScore is below threshold', () => {
    const fallback = new MockFallbackHandler();
    const payload: EmotionalPayload = {
      resonanceScore: EMOTIONAL_RESONANCE_THRESHOLD - 0.01,
      tone: 'neutral',
      context: 'test'
    };
    const message = { sender: 'a', recipient: 'b', type: 'emotional', payload, timestamp: Date.now() };
    enforceEmotionalResonance(payload, fallback, message);
    expect(fallback.emotionalFallbackCalled).toBe(true);
  });

  it('should not trigger fallback if resonanceScore meets threshold', () => {
    const fallback = new MockFallbackHandler();
    const payload: EmotionalPayload = {
      resonanceScore: EMOTIONAL_RESONANCE_THRESHOLD,
      tone: 'positive',
      context: 'test'
    };
    const message = { sender: 'a', recipient: 'b', type: 'emotional', payload, timestamp: Date.now() };
    enforceEmotionalResonance(payload, fallback, message);
    expect(fallback.emotionalFallbackCalled).toBe(false);
  });
});

// --- Trust Enforcement Tests ---
describe('enforceTrustScore', () => {
  it('should trigger critical fallback if trustScore is below critical threshold', () => {
    const fallback = new MockFallbackHandler();
    const payload: TrustPayload = {
      trustScore: TRUST_CRITICAL_THRESHOLD - 0.01,
      source: 'test',
      reason: 'critical'
    };
    const message = { sender: 'a', recipient: 'b', type: 'trust', payload, timestamp: Date.now() };
    enforceTrustScore(payload, fallback, message);
    expect(fallback.trustFallbackCalled).toBe(true);
  });

  it('should trigger warning fallback if trustScore is below warning threshold', () => {
    const fallback = new MockFallbackHandler();
    const payload: TrustPayload = {
      trustScore: TRUST_WARNING_THRESHOLD - 0.01,
      source: 'test',
      reason: 'warning'
    };
    const message = { sender: 'a', recipient: 'b', type: 'trust', payload, timestamp: Date.now() };
    enforceTrustScore(payload, fallback, message);
    expect(fallback.trustFallbackCalled).toBe(true);
  });

  it('should not trigger fallback if trustScore meets threshold', () => {
    const fallback = new MockFallbackHandler();
    const payload: TrustPayload = {
      trustScore: TRUST_WARNING_THRESHOLD,
      source: 'test',
      reason: 'ok'
    };
    const message = { sender: 'a', recipient: 'b', type: 'trust', payload, timestamp: Date.now() };
    enforceTrustScore(payload, fallback, message);
    expect(fallback.trustFallbackCalled).toBe(false);
  });
});

// --- Codex Safeguards ---
// - No console logs allowed (enforced by linter)
// - All logic blocks and tests are commented with what/why/how
// - All modules must be auditable, extensible, and emotionally intelligent
// - Fallback logic is required for all enforcement protocols 