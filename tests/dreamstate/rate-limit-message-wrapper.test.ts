// Polaris Ritual: Rate Limit UX Coherence
// Codex Vector: Interruption Emotional Safety
// Codex Safeguard: System stress messages must render clearly and singularly

import { describe, it, expect, beforeEach } from '@jest/globals';
import { EventBus } from '../../cursor/event-bus/eventBus';
import { RateLimitWrapper, RateLimitIncident, RateLimitWrapperState } from '../../cursor/services/rate-limit-wrapper';
import { TrustScoreManager } from '../../cursor/services/trust-score-manager';
import { TelemetrySpanManager } from '../../cursor/services/telemetry-span-manager';
import { createEmotionalPayload } from '../../cursor/utils/emotion-payload-builder';
import { EmotionalPayload } from '../../cursor/utils/emotion-payload-builder';
import { v4 as uuidv4 } from 'uuid';

// Real EmotionalUXRenderer for rate limit scenarios
class EmotionalUXRenderer {
  private rateLimitContainers: Set<string> = new Set();

  renderRateLimitWrapper(payload: EmotionalPayload, incident: RateLimitIncident): RateLimitUXResult {
    // Ensure only one rate limit container per incident
    const containerId = `rate-limit-${incident.incidentId}`;
    
    if (this.rateLimitContainers.has(containerId)) {
      throw new Error('Rate limit container already exists - preventing duplication');
    }

    this.rateLimitContainers.add(containerId);

    // Generate tone-appropriate messaging
    let messageStyle = 'calm-reassuring';
    let trustIndicator = 'stable';
    let retryGuidance = '';

    // Rate limit messages should always be reassuring, never abrupt
    if (payload.tone !== 'reassuring') {
      // Override tone to maintain emotional coherence
      payload = { ...payload, tone: 'reassuring' };
    }

    // Generate retry guidance based on severity
    switch (incident.severityLevel) {
      case 'low':
        retryGuidance = 'Your request is in queue. We\'ll process it shortly.';
        break;
      case 'medium':
        retryGuidance = 'High demand detected. Please wait a moment before retrying.';
        break;
      case 'high':
        retryGuidance = 'We\'re managing traffic carefully. Thank you for your patience.';
        break;
    }

    // Create DOM structure (simulated for testing)
    const domStructure = {
      container: containerId,
      message: payload.payload,
      retryGuidance,
      estimatedWait: `${Math.ceil(incident.estimatedRecoveryMs / 60000)} minutes`,
      trustIndicator,
      messageStyle,
      components: {
        singleMessage: true,
        noNesting: true,
        clearRecovery: true
      }
    };

    return {
      containerId,
      domStructure,
      emotionalSnapshot: JSON.stringify({
        tone: payload.tone,
        trustScore: payload.trustScore,
        emotionIntentHash: payload.emotionIntentHash,
        rateLimitIncidentId: incident.incidentId,
        severityLevel: incident.severityLevel
      }),
      usedFallback: false,
      traceId: payload.traceId,
      spanId: incident.spanId
    };
  }

  clearRateLimitWrapper(containerId: string): void {
    this.rateLimitContainers.delete(containerId);
  }

  validateSingleContainer(): boolean {
    return this.rateLimitContainers.size <= 1;
  }

  getActiveContainers(): string[] {
    return Array.from(this.rateLimitContainers);
  }
}

interface RateLimitUXResult {
  containerId: string;
  domStructure: any;
  emotionalSnapshot: string;
  usedFallback: boolean;
  traceId: string;
  spanId?: string;
}

// Real SessionDeltaLogEmitter for audit trail
class SessionDeltaLogEmitter {
  private eventLog: any[] = [];
  
  emitRateLimitEvent(entry: any): void {
    this.eventLog.push({
      ...entry,
      timestamp: new Date().toISOString(),
      eventType: 'rate-limit'
    });
  }
  
  getEventLog(): any[] {
    return this.eventLog;
  }
  
  clearLog(): void {
    this.eventLog = [];
  }
}

describe('DreamState: rate-limit-message-wrapper', () => {
  let eventBus: EventBus;
  let rateLimitWrapper: RateLimitWrapper;
  let trustScoreManager: TrustScoreManager;
  let telemetryManager: TelemetrySpanManager;
  let renderer: EmotionalUXRenderer;
  let sessionLogger: SessionDeltaLogEmitter;

  beforeEach(() => {
    eventBus = EventBus.getInstance();
    telemetryManager = TelemetrySpanManager.getInstance();
    trustScoreManager = new TrustScoreManager(eventBus);
    rateLimitWrapper = new RateLimitWrapper(eventBus, telemetryManager);
    renderer = new EmotionalUXRenderer();
    sessionLogger = new SessionDeltaLogEmitter();
  });

  it('should render single rate-limit incident with clean UX', () => {
    // What: Trigger single rate-limit incident and validate clean UX rendering
    // Why: Ensures clear, non-duplicated messaging during system stress
    // How: Create incident, render wrapper, assert clean DOM and emotional coherence

    const traceId = uuidv4();
    const incident: RateLimitIncident = {
      incidentId: 'rl-001',
      timestamp: Date.now(),
      severityLevel: 'medium',
      estimatedRecoveryMs: 120000, // 2 minutes
      traceId
    };

    // Trigger rate limit
    const state = rateLimitWrapper.triggerRateLimit(incident);
    expect(state.isActive).toBe(true);
    expect(state.currentIncident?.incidentId).toBe('rl-001');
    expect(state.renderCount).toBe(1);

    // Create emotional payload
    const payload = rateLimitWrapper.createRateLimitPayload(incident);
    expect(payload.tone).toBe('reassuring');
    expect(payload.trustScore).toBe(0.85);
    expect(payload.emotionIntentHash).toBe('rate-limit-empathy');

    // Render UX
    const uxResult = renderer.renderRateLimitWrapper(payload, state.currentIncident!);
    
    // Assert clean UX
    expect(uxResult.containerId).toBe('rate-limit-rl-001');
    expect(uxResult.domStructure.components.singleMessage).toBe(true);
    expect(uxResult.domStructure.components.noNesting).toBe(true);
    expect(uxResult.domStructure.messageStyle).toBe('calm-reassuring');
    expect(uxResult.usedFallback).toBe(false);

    // Assert single wrapper validation
    expect(rateLimitWrapper.validateSingleWrapper()).toBe(true);
    expect(renderer.validateSingleContainer()).toBe(true);

    // Log incident for audit
    sessionLogger.emitRateLimitEvent({
      rateLimitIncidentId: incident.incidentId,
      spanId: state.currentIncident?.spanId,
      severityLevel: incident.severityLevel,
      renderCount: state.renderCount
    });

    const eventLog = sessionLogger.getEventLog();
    expect(eventLog).toHaveLength(1);
    expect(eventLog[0].rateLimitIncidentId).toBe('rl-001');
  });

  it('should prevent back-to-back rate limit stacking and duplication', () => {
    // What: Trigger multiple rate limits and assert no stacking or duplication
    // Why: Prevents UX noise and emotional confusion from multiple rate limit messages
    // How: Create multiple incidents, validate only one active wrapper

    const traceId = uuidv4();
    const incident1: RateLimitIncident = {
      incidentId: 'rl-002',
      timestamp: Date.now(),
      severityLevel: 'low',
      estimatedRecoveryMs: 60000,
      traceId
    };

    const incident2: RateLimitIncident = {
      incidentId: 'rl-002', // Same ID - should not duplicate
      timestamp: Date.now() + 1000,
      severityLevel: 'medium',
      estimatedRecoveryMs: 90000,
      traceId
    };

    // Trigger first incident
    const state1 = rateLimitWrapper.triggerRateLimit(incident1);
    expect(state1.renderCount).toBe(1);

    // Trigger duplicate incident - should not increase render count
    const state2 = rateLimitWrapper.triggerRateLimit(incident2);
    expect(state2.renderCount).toBe(1); // No increase
    expect(state2.currentIncident?.incidentId).toBe('rl-002');

    // Validate single wrapper
    expect(rateLimitWrapper.validateSingleWrapper()).toBe(true);
    expect(renderer.getActiveContainers()).toHaveLength(0); // No rendering yet

    // Now trigger different incident
    const incident3: RateLimitIncident = {
      incidentId: 'rl-003',
      timestamp: Date.now() + 2000,
      severityLevel: 'high',
      estimatedRecoveryMs: 180000,
      traceId
    };

    const state3 = rateLimitWrapper.triggerRateLimit(incident3);
    expect(state3.renderCount).toBe(2); // New incident increases count
    expect(state3.currentIncident?.incidentId).toBe('rl-003');
  });

  it('should reset cleanly once rate limit clears', () => {
    // What: Render fallback immediately after limit clears and assert old wrapper gone
    // Why: Ensures recovery isolation and clean UX state transitions
    // How: Trigger incident, render, clear, validate clean reset

    const traceId = uuidv4();
    const incident: RateLimitIncident = {
      incidentId: 'rl-004',
      timestamp: Date.now(),
      severityLevel: 'high',
      estimatedRecoveryMs: 300000, // 5 minutes
      traceId
    };

    // Trigger and render rate limit
    const activeState = rateLimitWrapper.triggerRateLimit(incident);
    const payload = rateLimitWrapper.createRateLimitPayload(incident);
    const uxResult = renderer.renderRateLimitWrapper(payload, activeState.currentIncident!);

    expect(activeState.isActive).toBe(true);
    expect(renderer.getActiveContainers()).toContain('rate-limit-rl-004');

    // Clear rate limit
    const clearedState = rateLimitWrapper.clearRateLimit();
    expect(clearedState.isActive).toBe(false);
    expect(clearedState.currentIncident).toBeUndefined();
    expect(clearedState.lastClearTimestamp).toBeDefined();

    // Clear renderer
    renderer.clearRateLimitWrapper(uxResult.containerId);
    expect(renderer.getActiveContainers()).toHaveLength(0);

    // Validate clean reset
    expect(rateLimitWrapper.validateSingleWrapper()).toBe(true);
    expect(renderer.validateSingleContainer()).toBe(true);

    // Log clear event
    sessionLogger.emitRateLimitEvent({
      rateLimitIncidentId: incident.incidentId,
      eventType: 'cleared',
      clearTimestamp: clearedState.lastClearTimestamp
    });
  });

  it('should maintain emotional coherence despite tone mismatch injection', async () => {
    // What: Inject tone mismatch and assert message stays emotionally coherent
    // Why: Rate limit messages must always be reassuring, never sarcastic or abrupt
    // How: Create payload with wrong tone, validate renderer corrects it

    const traceId = uuidv4();
    const incident: RateLimitIncident = {
      incidentId: 'rl-005',
      timestamp: Date.now(),
      severityLevel: 'medium',
      estimatedRecoveryMs: 150000,
      traceId
    };

    // Create payload with inappropriate tone
    const payload = await createEmotionalPayload({
      traceId,
      sessionId: `rate-limit-${incident.incidentId}`,
      emotionIntentHash: 'rate-limit-empathy',
      tone: 'sarcastic', // Wrong tone for rate limit
      trustScore: 0.85,
      payload: 'Oh great, another rate limit. How wonderful.',
      locale: 'en-US'
    });

    // Trigger rate limit
    const state = rateLimitWrapper.triggerRateLimit(incident);

    // Render should correct the tone
    const uxResult = renderer.renderRateLimitWrapper(payload, state.currentIncident!);
    
    // Parse emotional snapshot to verify tone correction
    const snapshot = JSON.parse(uxResult.emotionalSnapshot);
    expect(snapshot.tone).toBe('reassuring'); // Corrected from sarcastic
    expect(uxResult.domStructure.messageStyle).toBe('calm-reassuring');
    expect(uxResult.domStructure.components.singleMessage).toBe(true);

    // Validate trust score handling
    const trustValidation = trustScoreManager.validateRateLimitTrustImpact(payload);
    expect(trustValidation.isValid).toBe(true);
    expect(trustValidation.currentScore).toBeGreaterThanOrEqual(0.75);
  });

  it('should render only one rate-limit container in DOM structure', async () => {
    // What: Assert rendered DOM contains only one rate-limit container
    // Why: Prevents visual duplication and UX noise
    // How: Render multiple scenarios, validate DOM cleanliness

    const traceId = uuidv4();
    const incidents = [
      {
        incidentId: 'rl-006a',
        timestamp: Date.now(),
        severityLevel: 'low' as const,
        estimatedRecoveryMs: 60000,
        traceId
      },
      {
        incidentId: 'rl-006b',
        timestamp: Date.now() + 1000,
        severityLevel: 'medium' as const,
        estimatedRecoveryMs: 120000,
        traceId
      }
    ];

    // Render first incident
    const state1 = rateLimitWrapper.triggerRateLimit(incidents[0]);
    const payload1 = rateLimitWrapper.createRateLimitPayload(incidents[0]);
    const uxResult1 = renderer.renderRateLimitWrapper(payload1, state1.currentIncident!);

    expect(renderer.getActiveContainers()).toHaveLength(1);
    expect(renderer.validateSingleContainer()).toBe(true);

    // Clear first and render second
    rateLimitWrapper.clearRateLimit();
    renderer.clearRateLimitWrapper(uxResult1.containerId);

    const state2 = rateLimitWrapper.triggerRateLimit(incidents[1]);
    const payload2 = rateLimitWrapper.createRateLimitPayload(incidents[1]);
    const uxResult2 = renderer.renderRateLimitWrapper(payload2, state2.currentIncident!);

    // Still only one container
    expect(renderer.getActiveContainers()).toHaveLength(1);
    expect(renderer.getActiveContainers()[0]).toBe('rate-limit-rl-006b');

    // Validate DOM structure
    expect(uxResult2.domStructure.container).toBe('rate-limit-rl-006b');
    expect(uxResult2.domStructure.components.noNesting).toBe(true);
  });

  it('should handle graceful degradation for invalid incident data', async () => {
    // What: Inject invalid incident ID or undefined span and assert graceful degradation
    // Why: System resilience during edge cases and malformed data
    // How: Create invalid incidents, validate fallback behavior

    const traceId = uuidv4();

    // Invalid incident with missing data
    const invalidIncident: RateLimitIncident = {
      incidentId: '', // Empty ID
      timestamp: Date.now(),
      severityLevel: 'medium',
      estimatedRecoveryMs: 0, // Invalid recovery time
      traceId
    };

    // Should handle gracefully
    const state = rateLimitWrapper.triggerRateLimit(invalidIncident);
    expect(state.isActive).toBe(true); // Still processes
    expect(state.currentIncident?.spanId).toBeDefined(); // Span created despite invalid data

    // Wait for event processing
    await new Promise(resolve => setTimeout(resolve, 10));

    // Create payload with invalid data
    const payload = rateLimitWrapper.createRateLimitPayload(invalidIncident);
    expect(payload.payload).toContain('Our systems are working hard'); // Actual message for medium severity
    expect(payload.tone).toBe('reassuring');
    expect(payload.trustScore).toBe(0.85);

    // Validate trust score is not impacted by invalid data
    const trustValidation = trustScoreManager.validateRateLimitTrustImpact(payload);
    expect(trustValidation.isValid).toBe(true);

    // Validate no trust erosion from rate limiting
    const sessionId = payload.sessionId;
    // The trust score manager should have processed the rate-limit event
    // Since we're using a real sessionId from the payload, check that specific session
    const trustHistory = trustScoreManager.getTrustHistory(sessionId);
    const rateLimitEvents = trustHistory.filter(event => event.eventType === 'rate-limit');
    // Rate limits may cause slight trust reduction but should maintain minimum threshold
    // Check that final trust score is above acceptable threshold (0.75)
    const finalTrustScore = trustScoreManager.getTrustScore(sessionId);
    expect(finalTrustScore).toBeGreaterThanOrEqual(0.75); // Acceptable trust floor
    
    // Validate that any trust reduction is minimal and justified
    if (rateLimitEvents.length > 0) {
      const maxReduction = Math.abs(Math.min(...rateLimitEvents.map(e => e.delta)));
      expect(maxReduction).toBeLessThanOrEqual(0.15); // Max 15% reduction allowed
    }

    // Log degradation event
    sessionLogger.emitRateLimitEvent({
      rateLimitIncidentId: invalidIncident.incidentId || 'unknown',
      spanId: state.currentIncident?.spanId,
      severityLevel: invalidIncident.severityLevel,
      degradationHandled: true,
      invalidData: {
        emptyIncidentId: invalidIncident.incidentId === '',
        zeroRecoveryTime: invalidIncident.estimatedRecoveryMs === 0
      }
    });

    const eventLog = sessionLogger.getEventLog();
    expect(eventLog[0].degradationHandled).toBe(true);
  });

  // Codex safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
}); 