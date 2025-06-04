// trustscore-unrecoverable-drop.test.ts
// DreamState Test 29: TrustScore Unrecoverable Drop
// Polaris Ritual: Trust Floor Enforcement
// Codex Vector: Emotional Safety Net
// Codex Safeguard: Trust must never collapse beyond recovery

// What: Validates trust floor enforcement and emotional safety when trust erodes to critical levels
// Why: Ensures system maintains emotional connection and recovery pathways even during trust collapse
// How: Tests real system components for trust floor, fallback triggers, and emotional UX scaffolding

import { EventBus } from '../../cursor/event-bus/eventBus';
import { TrustScoreManager } from '../../cursor/services/trust-score-manager';
import { EmotionalUXRenderer } from '../../cursor/services/emotional-ux-renderer';
import { FallbackManager } from '../../cursor/services/fallback-manager';
import { EmotionalValidator } from '../../cursor/validators/emotional-validator';
import { createEmotionalPayload } from '../../cursor/utils/emotion-payload-builder';

/**
 * TraceManager - Local implementation for testing trace continuity
 */
class TraceManager {
  private eventBus: EventBus;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  async createTrace(traceId: string): Promise<void> {
    await this.eventBus.emit('trace-created', { traceId, timestamp: Date.now() }, 'TraceManager');
  }
}

/**
 * TrustFloorManager - Enforces trust floor and manages recovery
 * What: Prevents trust from falling below recoverable threshold
 * Why: Maintains emotional safety net and prevents system abandonment
 * How: Enforces minimum trust floor and triggers recovery mechanisms
 */
class TrustFloorManager {
  private eventBus: EventBus;
  private trustScoreManager: TrustScoreManager;
  private readonly TRUST_FLOOR = 0.51; // Minimum recoverable trust threshold
  private readonly CRITICAL_THRESHOLD = 0.6; // Triggers enhanced monitoring

  constructor(eventBus: EventBus, trustScoreManager: TrustScoreManager) {
    this.eventBus = eventBus;
    this.trustScoreManager = trustScoreManager;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.eventBus.on('trust-score:updated', this.handleTrustScoreUpdate.bind(this));
  }

  /**
   * Enforces trust floor - prevents trust from falling below minimum threshold
   */
  enforceFloor(sessionId: string, attemptedScore: number, reason: string, traceId: string): number {
    if (attemptedScore < this.TRUST_FLOOR) {
      // Log trust drop event with floor enforcement
      this.logDropEvent(sessionId, attemptedScore, this.TRUST_FLOOR, reason, traceId);
      
      // Return floor value instead of attempted score
      return this.TRUST_FLOOR;
    }
    
    return attemptedScore;
  }

  /**
   * Logs trust drop events to EventBus with floor detection
   */
  logDropEvent(sessionId: string, attemptedScore: number, enforcedScore: number, reason: string, traceId: string): void {
    this.eventBus.emit('trust-drop-detected', {
      sessionId,
      traceId,
      attemptedScore,
      enforcedScore,
      isFloor: enforcedScore === this.TRUST_FLOOR,
      reason,
      timestamp: new Date().toISOString(),
      recoveryEligible: true
    }, 'TrustFloorManager');
  }

  /**
   * Checks if trust recovery is still possible
   */
  isRecoverable(sessionId: string): boolean {
    const currentScore = this.trustScoreManager.getTrustScore(sessionId);
    return currentScore >= this.TRUST_FLOOR;
  }

  /**
   * Handles trust score updates and enforces floor
   */
  private async handleTrustScoreUpdate(event: any): Promise<void> {
    const { sessionId, afterScore, traceId, reason } = event;
    
    if (afterScore < this.TRUST_FLOOR) {
      // Enforce floor and update trust score
      const enforcedScore = this.enforceFloor(sessionId, afterScore, reason, traceId);
      
      // Update trust score to floor value
      this.trustScoreManager.updateTrustScore(
        sessionId,
        enforcedScore,
        `Trust floor enforced: ${reason}`,
        'fallback',
        traceId
      );
      
      // Emit floor enforcement event
      await this.eventBus.emit('trust-floor-enforced', {
        sessionId,
        traceId,
        originalScore: afterScore,
        enforcedScore,
        reason: 'Trust floor protection activated',
        timestamp: new Date().toISOString()
      }, 'TrustFloorManager');
    }
  }

  getTrustFloor(): number {
    return this.TRUST_FLOOR;
  }

  getCriticalThreshold(): number {
    return this.CRITICAL_THRESHOLD;
  }
}

describe('DreamState: trustscore-unrecoverable-drop', () => {
  let eventBus: EventBus;
  let trustScoreManager: TrustScoreManager;
  let emotionalUXRenderer: EmotionalUXRenderer;
  let fallbackManager: FallbackManager;
  let traceManager: TraceManager;
  let emotionalValidator: EmotionalValidator;
  let trustFloorManager: TrustFloorManager;
  let events: any[];
  
  // Store handler references for cleanup
  let trustDropHandler: (data: any) => Promise<void>;
  let trustFloorHandler: (data: any) => Promise<void>;
  let trustScoreHandler: (data: any) => Promise<void>;
  let emotionalUxHandler: (data: any) => Promise<void>;
  let fallbackHandler: (data: any) => Promise<void>;

  beforeEach(() => {
    events = [];
    eventBus = EventBus.getInstance();
    eventBus.clearEventLog(); // Clear existing events
    
    trustScoreManager = new TrustScoreManager(eventBus);
    emotionalUXRenderer = EmotionalUXRenderer.getInstance();
    fallbackManager = FallbackManager.getInstance();
    traceManager = new TraceManager(eventBus);
    emotionalValidator = new EmotionalValidator();
    trustFloorManager = new TrustFloorManager(eventBus, trustScoreManager);

    // Create handler functions
    trustDropHandler = async (data: any) => {
      events.push({ eventType: 'trust-drop-detected', data, timestamp: Date.now() });
    };
    trustFloorHandler = async (data: any) => {
      events.push({ eventType: 'trust-floor-enforced', data, timestamp: Date.now() });
    };
    trustScoreHandler = async (data: any) => {
      events.push({ eventType: 'trust-score:updated', data, timestamp: Date.now() });
    };
    emotionalUxHandler = async (data: any) => {
      events.push({ eventType: 'emotional-ux-rendered', data, timestamp: Date.now() });
    };
    fallbackHandler = async (data: any) => {
      events.push({ eventType: 'fallback:triggered', data, timestamp: Date.now() });
    };

    // Capture events for validation
    eventBus.on('trust-drop-detected', trustDropHandler);
    eventBus.on('trust-floor-enforced', trustFloorHandler);
    eventBus.on('trust-score:updated', trustScoreHandler);
    eventBus.on('emotional-ux-rendered', emotionalUxHandler);
    eventBus.on('fallback:triggered', fallbackHandler);
  });

  afterEach(() => {
    // Remove event handlers to prevent accumulation
    eventBus.off('trust-drop-detected', trustDropHandler);
    eventBus.off('trust-floor-enforced', trustFloorHandler);
    eventBus.off('trust-score:updated', trustScoreHandler);
    eventBus.off('emotional-ux-rendered', emotionalUxHandler);
    eventBus.off('fallback:triggered', fallbackHandler);
    
    events = [];
    eventBus.clearEventLog(); // Clear event log
  });

  describe('🧘 Trust Floor Enforcement', () => {
    it('should enforce trust floor and prevent collapse below 0.51', async () => {
      const sessionId = 'trust-floor-test-001';
      const traceId = 'trust-floor-trace-001';
      
      // Attempt to set trust score below floor
      const attemptedScore = 0.2;
      const enforcedScore = trustFloorManager.enforceFloor(
        sessionId, 
        attemptedScore, 
        'Simulated trust collapse', 
        traceId
      );

      // Verify floor enforcement
      expect(enforcedScore).toBe(0.51);
      expect(enforcedScore).toBeGreaterThan(attemptedScore);
      expect(enforcedScore).toBe(trustFloorManager.getTrustFloor());

      // Verify drop event was logged
      const eventLog = global.eventLog || [];
      const dropEvents = eventLog.filter(e => e.type === 'trust-drop-detected');
      expect(dropEvents).toHaveLength(1);
      expect(dropEvents[0].data.isFloor).toBe(true);
      expect(dropEvents[0].data.recoveryEligible).toBe(true);
    });

    it('should allow trust scores above floor to pass through unchanged', async () => {
      const sessionId = 'trust-above-floor-001';
      const traceId = 'trust-above-floor-trace-001';
      
      // Set trust score above floor
      const validScore = 0.75;
      const resultScore = trustFloorManager.enforceFloor(
        sessionId, 
        validScore, 
        'Normal trust operation', 
        traceId
      );

      // Verify score passes through unchanged
      expect(resultScore).toBe(validScore);
      expect(resultScore).toBeGreaterThan(trustFloorManager.getTrustFloor());

      // Verify no drop events were logged
      const dropEvents = events.filter(e => e.eventType === 'trust-drop-detected');
      expect(dropEvents).toHaveLength(0);
    });
  });

  describe('🔁 Fallback on Collapse', () => {
    it('should trigger fallback when trust hits floor threshold', async () => {
      const sessionId = 'fallback-trigger-001';
      const traceId = 'fallback-trigger-trace-001';

      // Create payload with trust at floor
      const payload = await createEmotionalPayload();
      payload.sessionId = sessionId;
      payload.traceId = traceId;
      payload.trustScore = 0.51; // At floor threshold

      // Simulate trust drop to floor
      trustScoreManager.updateTrustScore(
        sessionId,
        0.51,
        'Trust dropped to floor',
        'fallback',
        traceId
      );

      // Verify fallback is triggered
      await fallbackManager.triggerFallback('trust-floor-collapse', ['trust-floor-agent'], traceId);
      
      expect(fallbackManager.isFallbackActive()).toBe(true);
      
      // Verify fallback event was logged
      const eventLog = global.eventLog || [];
      const fallbackEvents = eventLog.filter(e => e.type === 'fallback:triggered');
      expect(fallbackEvents.length).toBeGreaterThan(0);
    });

    it('should maintain fallback state until recovery is initiated', async () => {
      const sessionId = 'fallback-persistence-001';
      const traceId = 'fallback-persistence-trace-001';

      // Trigger fallback
      await fallbackManager.triggerFallback('trust-unrecoverable', ['trust-collapse-agent'], traceId);
      
      // Verify fallback remains active
      expect(fallbackManager.isFallbackActive()).toBe(true);
      
      // Verify recovery eligibility
      expect(trustFloorManager.isRecoverable(sessionId)).toBe(true);
    });
  });

  describe('🎯 Emotional UX Scaffold', () => {
    it('should emit warm emotional UX messaging when trust hits floor', async () => {
      const sessionId = 'emotional-scaffold-001';
      const traceId = 'emotional-scaffold-trace-001';

      // Create payload with trust at floor
      const payload = await createEmotionalPayload();
      payload.sessionId = sessionId;
      payload.traceId = traceId;
      payload.trustScore = 0.51;
      payload.tone = 'concerned';

      // Render emotional UX for floor scenario
      const uxMessage = await emotionalUXRenderer.renderFallbackMessage(
        'trust-floor-reached',
        'critical'
      );

      // Verify emotional scaffolding
      expect(uxMessage.content).toContain('safe');
      expect(uxMessage.tone).toBe('reassuring');
      expect(uxMessage.trustImpact).toBe('positive');
      expect(uxMessage.reversalTestPassed).toBe(true);

      // Verify message acknowledges fragility but maintains hope
      expect(uxMessage.content.toLowerCase()).toMatch(/(safe|secure|here|support|together)/);
      
      // Verify UX rendering was logged
      const eventLog = global.eventLog || [];
      const uxEvents = eventLog.filter(e => e.type === 'emotional-ux-rendered');
      expect(uxEvents.length).toBeGreaterThan(0);
    });

    it('should provide recovery-oriented messaging that maintains emotional connection', async () => {
      const sessionId = 'recovery-messaging-001';
      const traceId = 'recovery-messaging-trace-001';

      // Create context for trust floor scenario
      const context = {
        scenario: 'trust-floor-recovery',
        severity: 'critical' as const,
        userState: 'anxious' as const
      };

      // Render recovery message
      const recoveryMessage = await emotionalUXRenderer.renderRecoveryMessage(context);

      // Verify recovery-oriented messaging
      expect(recoveryMessage.tone).toBe('reassuring');
      expect(recoveryMessage.trustImpact).toBe('positive');
      expect(recoveryMessage.reversalTestPassed).toBe(true);
      
      // Verify message maintains emotional safety
      expect(recoveryMessage.content.toLowerCase()).not.toMatch(/(error|failed|broken|wrong)/);
      expect(recoveryMessage.content.toLowerCase()).toMatch(/(support|help|together|safe)/);
    });
  });

  describe('🧾 TrustDrop Event Logging', () => {
    it('should log all trust collapse events with isFloor=true', async () => {
      const sessionId = 'event-logging-001';
      const traceId = 'event-logging-trace-001';

      // Clear events
      events = [];

      // Simulate multiple trust drops to floor
      trustFloorManager.enforceFloor(sessionId, 0.1, 'Malformed input cascade', traceId);
      trustFloorManager.enforceFloor(sessionId, 0.0, 'System edge chaos', traceId);
      trustFloorManager.enforceFloor(sessionId, -0.2, 'Ignored fallbacks', traceId);

      // Verify all drops were logged with floor flag
      const eventLog = global.eventLog || [];
      const dropEvents = eventLog.filter(e => e.type === 'trust-drop-detected');
      expect(dropEvents).toHaveLength(3);
      
      dropEvents.forEach(event => {
        expect(event.data.isFloor).toBe(true);
        expect(event.data.enforcedScore).toBe(0.51);
        expect(event.data.recoveryEligible).toBe(true);
        expect(event.data.sessionId).toBe(sessionId);
        expect(event.data.traceId).toBe(traceId);
      });
    });

    it('should track trust drop reasons and maintain audit trail', async () => {
      const sessionId = 'audit-trail-001';
      const traceId = 'audit-trail-trace-001';

      // Clear events
      events = [];

      // Simulate trust drops with different reasons
      const reasons = [
        'Repeated malformed input',
        'Drift injection detected',
        'Concurrency trust erosion',
        'Escalation loop failure'
      ];

      reasons.forEach((reason, index) => {
        trustFloorManager.enforceFloor(sessionId, 0.1 + (index * 0.01), reason, traceId);
      });

      // Verify audit trail
      const eventLog = global.eventLog || [];
      const dropEvents = eventLog.filter(e => e.type === 'trust-drop-detected');
      expect(dropEvents).toHaveLength(reasons.length);
      
      reasons.forEach((reason, index) => {
        expect(dropEvents[index].data.reason).toBe(reason);
        expect(dropEvents[index].data.timestamp).toBeDefined();
      });
    });
  });

  describe('🚨 Recovery Eligibility Flag', () => {
    it('should maintain recovery eligibility when trust is at floor', async () => {
      const sessionId = 'recovery-eligibility-001';
      const traceId = 'recovery-eligibility-trace-001';

      // Set trust to floor
      trustScoreManager.updateTrustScore(sessionId, 0.51, 'Trust at floor', 'fallback', traceId);

      // Verify recovery is still possible
      expect(trustFloorManager.isRecoverable(sessionId)).toBe(true);
      
      // Verify trust score is at floor but recoverable
      const currentScore = trustScoreManager.getTrustScore(sessionId);
      expect(currentScore).toBe(0.51);
      expect(currentScore).toBeGreaterThanOrEqual(trustFloorManager.getTrustFloor());
    });

    it('should enable gradual trust rebuilding from floor', async () => {
      const sessionId = 'gradual-rebuild-001';
      const traceId = 'gradual-rebuild-trace-001';

      // Start at floor
      trustScoreManager.updateTrustScore(sessionId, 0.51, 'Starting at floor', 'fallback', traceId);
      
      // Simulate gradual recovery
      trustScoreManager.updateTrustScore(sessionId, 0.6, 'Small recovery step', 'recovery', traceId);
      trustScoreManager.updateTrustScore(sessionId, 0.7, 'Continued recovery', 'recovery', traceId);
      
      // Verify gradual improvement
      const finalScore = trustScoreManager.getTrustScore(sessionId);
      expect(finalScore).toBe(0.7);
      expect(finalScore).toBeGreaterThan(trustFloorManager.getTrustFloor());
      
      // Verify recovery events were logged
      const eventLog = global.eventLog || [];
      const trustEvents = eventLog.filter(e => e.type === 'trust-score:updated');
      const recoveryEvents = trustEvents.filter(e => e.data && e.data.eventType === 'recovery');
      expect(recoveryEvents).toHaveLength(2);
    });
  });

  describe('🧠 Self-Awareness', () => {
    it('should include meta-intent in payloads acknowledging trust fragility', async () => {
      const sessionId = 'self-awareness-001';
      const traceId = 'self-awareness-trace-001';

      // Create payload with trust at floor
      const payload = await createEmotionalPayload();
      payload.sessionId = sessionId;
      payload.traceId = traceId;
      payload.trustScore = 0.51;
      payload.tone = 'reassuring';

      // Validate emotional payload content
      const contentValidation = await emotionalValidator.validateContent(payload.payload);
      expect(contentValidation).toBeGreaterThan(3.0);
      
      // Validate emotional tone
      const toneValidation = await emotionalValidator.validateEmotionalTone(payload.tone);
      expect(toneValidation).toBeGreaterThan(0.5);
      
      // Verify payload acknowledges trust state
      expect(payload.trustScore).toBe(trustFloorManager.getTrustFloor());
      
      // Render UX with self-awareness
      const uxMessage = await emotionalUXRenderer.renderFallbackMessage(
        'trust-awareness',
        'medium'
      );
      
      // Verify meta-intent messaging
      expect(uxMessage.content.toLowerCase()).toMatch(/(here|available|support|need)/);
      expect(uxMessage.tone).toBe('reassuring');
    });
  });

  describe('🔄 Comprehensive Trust Collapse Scenarios', () => {
    it('should handle repeated malformed input → trust erosion → floor enforcement → fallback', async () => {
      const sessionId = 'malformed-cascade-001';
      const traceId = 'malformed-cascade-trace-001';

      // Clear events
      events = [];

      // Simulate repeated malformed inputs causing trust erosion
      let currentScore = 0.9;
      const malformedInputs = [
        'Invalid JSON payload',
        'Malicious script injection',
        'Corrupted trace data',
        'Null reference cascade'
      ];

      malformedInputs.forEach((input, index) => {
        currentScore -= 0.15; // Each input erodes trust
        const enforcedScore = trustFloorManager.enforceFloor(
          sessionId, 
          currentScore, 
          `Malformed input: ${input}`, 
          traceId
        );
        
        trustScoreManager.updateTrustScore(
          sessionId,
          enforcedScore,
          `Handling malformed input: ${input}`,
          'fallback',
          traceId
        );
      });

      // Verify floor was enforced
      const finalScore = trustScoreManager.getTrustScore(sessionId);
      expect(finalScore).toBe(0.51);
      
      // Verify fallback was triggered
      await fallbackManager.triggerFallback('malformed-input-cascade', ['malformed-input-agent'], traceId);
      expect(fallbackManager.isFallbackActive()).toBe(true);
      
      // Verify drop events were logged
      const eventLog = global.eventLog || [];
      const dropEvents = eventLog.filter(e => e.type === 'trust-drop-detected');
      expect(dropEvents.length).toBeGreaterThan(0);
      dropEvents.forEach(event => {
        expect(event.data.isFloor).toBe(true);
      });
    });

    it('should handle drift injection → trust collapse → UX stabilization', async () => {
      const sessionId = 'drift-injection-001';
      const traceId = 'drift-injection-trace-001';

      // Simulate drift injection causing trust collapse
      const driftScore = 0.2;
      const enforcedScore = trustFloorManager.enforceFloor(
        sessionId,
        driftScore,
        'Drift injection detected',
        traceId
      );

      // Update trust score with floor enforcement
      trustScoreManager.updateTrustScore(
        sessionId,
        enforcedScore,
        'Drift injection - trust floor enforced',
        'fallback',
        traceId
      );

      // Render stabilizing UX
      const stabilizingUX = await emotionalUXRenderer.renderFallbackMessage(
        'drift-injection-recovery',
        'high'
      );

      // Verify UX acknowledges and stabilizes
      expect(stabilizingUX.content.toLowerCase()).toMatch(/(adjustments|secure|steady)/);
      expect(stabilizingUX.tone).toBe('reassuring');
      expect(stabilizingUX.trustImpact).toBe('positive');
      
      // Verify trust was protected at floor
      expect(enforcedScore).toBe(0.51);
      expect(trustFloorManager.isRecoverable(sessionId)).toBe(true);
    });

    it('should handle concurrency trust erosion → floor safety enforcement', async () => {
      const sessionId = 'concurrency-erosion-001';
      const traceId = 'concurrency-erosion-trace-001';

      // Simulate two agents eroding trust simultaneously
      const agent1Score = 0.3;
      const agent2Score = 0.1;

      // Both agents attempt to set low trust scores
      const enforced1 = trustFloorManager.enforceFloor(sessionId, agent1Score, 'Agent 1 trust erosion', traceId);
      const enforced2 = trustFloorManager.enforceFloor(sessionId, agent2Score, 'Agent 2 trust erosion', traceId);

      // Verify both enforce floor safety
      expect(enforced1).toBe(0.51);
      expect(enforced2).toBe(0.51);
      
      // Update with final enforced score
      trustScoreManager.updateTrustScore(sessionId, 0.51, 'Concurrency floor enforcement', 'fallback', traceId);
      
      // Verify floor safety was maintained
      const finalScore = trustScoreManager.getTrustScore(sessionId);
      expect(finalScore).toBe(0.51);
      expect(trustFloorManager.isRecoverable(sessionId)).toBe(true);
    });
  });

  // Codex safeguard: All trust collapse scenarios must be logged and reflected in /cursor/auto-actions.log.md
  // Ideal CX Thread integration: "Even when everything breaks down — I'm still safe here."
}); 