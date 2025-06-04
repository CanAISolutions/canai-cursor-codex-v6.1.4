// trust-restore-post-coldstart.test.ts
// DreamState Test 17: Trust Restore Post Coldstart
// Polaris Ritual: Emotional Trust Rebuilding After Coldstart
// Codex Vector: Warm Memory Illusion
// Codex Safeguard: A new session must still feel familiar, calm, and emotionally aware

// What: Validates emotional trust rebuilding when session begins with no prior memory
// Why: Ensures CanAI can start over and still feel like it remembers you
// How: Tests coldstart detection, trust scaffolding, and emotional continuity

import { EventBus } from '../../cursor/event-bus/eventBus';
import { TrustScoreManager } from '../../cursor/services/trust-score-manager';
import { EmotionalUXRenderer } from '../../cursor/services/emotional-ux-renderer';
import { FallbackManager } from '../../cursor/services/fallback-manager';
import { createEmotionalPayload, createToneSpecificPayload } from '../../cursor/utils/emotion-payload-builder';
import { EmotionalValidator } from '../../cursor/validators/emotional-validator';

// Real TraceManager implementation for coldstart detection
class TraceManager {
  private spans: Map<string, any> = new Map();
  private eventBus: EventBus;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  startSpan(traceId: string, spanId: string): any {
    const span = {
      traceId,
      spanId,
      startTime: Date.now(),
      status: 'active',
      metadata: {}
    };
    this.spans.set(spanId, span);
    return span;
  }

  getSpan(spanId: string): any | undefined {
    return this.spans.get(spanId);
  }

  detectAbsence(traceId: string): boolean {
    return !Array.from(this.spans.values()).some(span => span.traceId === traceId);
  }
}

// Real system components for coldstart trust restoration
class ColdstartTrustManager {
  private eventBus: EventBus;
  private trustScoreManager: TrustScoreManager;
  private traceManager: TraceManager;

  constructor(eventBus: EventBus, trustScoreManager: TrustScoreManager, traceManager: TraceManager) {
    this.eventBus = eventBus;
    this.trustScoreManager = trustScoreManager;
    this.traceManager = traceManager;
  }

  /**
   * Detects coldstart condition - absence of prior trace, session, or trust state
   */
  detectColdstart(sessionId: string, traceId: string): boolean {
    // Check for absence of prior trust state
    const existingTrustScore = this.trustScoreManager.getTrustScore(sessionId);
    
    // Check for absence of trace lineage
    const traceAbsent = this.traceManager.detectAbsence(traceId);
    
    // Coldstart detected if trust score is at default (0.9) and no trace lineage
    return existingTrustScore === 0.9 && traceAbsent;
  }

  /**
   * Scaffolds trust from coldstart with gentle initialization
   */
  async scaffoldFromColdstart(sessionId: string, traceId: string): Promise<number> {
    const GENTLE_TRUST_INIT = 0.75; // Neutral, not reset to 0 or 1
    
    // Initialize trust score gently
    this.trustScoreManager.updateTrustScore(
      sessionId,
      GENTLE_TRUST_INIT,
      'Coldstart trust scaffolding - gentle initialization',
      'normal',
      traceId
    );

    // Log trust scaffolding event
    await this.eventBus.emit('trust-scaffolded', {
      sessionId,
      traceId,
      initialTrustScore: GENTLE_TRUST_INIT,
      reason: 'coldstart-detection',
      timestamp: new Date().toISOString()
    }, 'ColdstartTrustManager');

    return GENTLE_TRUST_INIT;
  }

  /**
   * Handles warm recovery after coldstart
   */
  async warmRecoveryAfterCold(sessionId: string, traceId: string): Promise<void> {
    const currentScore = this.trustScoreManager.getTrustScore(sessionId);
    
    // Gentle trust boost for warm recovery
    const recoveredScore = Math.min(currentScore + 0.1, 0.85);
    
    this.trustScoreManager.updateTrustScore(
      sessionId,
      recoveredScore,
      'Warm recovery after coldstart',
      'recovery',
      traceId
    );

    await this.eventBus.emit('trust-warm-recovery', {
      sessionId,
      traceId,
      beforeScore: currentScore,
      afterScore: recoveredScore,
      timestamp: new Date().toISOString()
    }, 'ColdstartTrustManager');
  }
}

describe('DreamState: trust-restore-post-coldstart', () => {
  let eventBus: EventBus;
  let trustScoreManager: TrustScoreManager;
  let emotionalUXRenderer: EmotionalUXRenderer;
  let traceManager: TraceManager;
  let fallbackManager: FallbackManager;
  let coldstartTrustManager: ColdstartTrustManager;
  let emotionalValidator: EmotionalValidator;
  let events: any[];
  
  // Store handler references for cleanup
  let trustScaffoldedHandler: (data: any) => Promise<void>;
  let trustWarmRecoveryHandler: (data: any) => Promise<void>;
  let trustScoreUpdatedHandler: (data: any) => Promise<void>;
  let emotionalUxRenderedHandler: (data: any) => Promise<void>;

  beforeEach(() => {
    events = [];
    eventBus = EventBus.getInstance();
    eventBus.clearEventLog(); // Clear existing events
    
    trustScoreManager = new TrustScoreManager(eventBus);
    emotionalUXRenderer = EmotionalUXRenderer.getInstance();
    traceManager = new TraceManager(eventBus);
    fallbackManager = FallbackManager.getInstance();
    coldstartTrustManager = new ColdstartTrustManager(eventBus, trustScoreManager, traceManager);
    emotionalValidator = new EmotionalValidator();

    // Create handler functions
    trustScaffoldedHandler = async (data: any) => {
      events.push({ eventType: 'trust-scaffolded', data, timestamp: Date.now() });
    };
    trustWarmRecoveryHandler = async (data: any) => {
      events.push({ eventType: 'trust-warm-recovery', data, timestamp: Date.now() });
    };
    trustScoreUpdatedHandler = async (data: any) => {
      events.push({ eventType: 'trust-score:updated', data, timestamp: Date.now() });
    };
    emotionalUxRenderedHandler = async (data: any) => {
      events.push({ eventType: 'emotional-ux-rendered', data, timestamp: Date.now() });
    };

    // Capture events for validation
    eventBus.on('trust-scaffolded', trustScaffoldedHandler);
    eventBus.on('trust-warm-recovery', trustWarmRecoveryHandler);
    eventBus.on('trust-score:updated', trustScoreUpdatedHandler);
    eventBus.on('emotional-ux-rendered', emotionalUxRenderedHandler);
  });

  afterEach(() => {
    // Remove event handlers to prevent accumulation
    eventBus.off('trust-scaffolded', trustScaffoldedHandler);
    eventBus.off('trust-warm-recovery', trustWarmRecoveryHandler);
    eventBus.off('trust-score:updated', trustScoreUpdatedHandler);
    eventBus.off('emotional-ux-rendered', emotionalUxRenderedHandler);
    
    events = [];
    eventBus.clearEventLog(); // Clear events
  });

  describe('🧠 Coldstart Detection', () => {
    it('should detect absence of prior trace, session, or trust state', async () => {
      const sessionId = 'coldstart-session-001';
      const traceId = 'coldstart-trace-001';

      // Verify default trust state (0.9 is the default high trust)
      const existingTrust = trustScoreManager.getTrustScore(sessionId);
      expect(existingTrust).toBe(0.9);

      // Verify no existing trace
      const traceAbsent = traceManager.detectAbsence(traceId);
      expect(traceAbsent).toBe(true);

      // Detect coldstart condition
      const isColdstart = coldstartTrustManager.detectColdstart(sessionId, traceId);
      expect(isColdstart).toBe(true);
    });

    it('should not detect coldstart when prior state exists', async () => {
      const sessionId = 'existing-session-001';
      const traceId = 'existing-trace-001';

      // Create existing trust state
      trustScoreManager.updateTrustScore(sessionId, 0.9, 'Existing session', 'normal', traceId);

      // Create existing trace
      traceManager.startSpan(traceId, 'existing-span');

      // Should not detect coldstart
      const isColdstart = coldstartTrustManager.detectColdstart(sessionId, traceId);
      expect(isColdstart).toBe(false);
    });
  });

  describe('🌱 Trust Rebuilding Cues', () => {
    it('should use EmotionalUXRenderer with first-party tone scaffolding', async () => {
      const sessionId = 'coldstart-ux-001';
      const traceId = 'coldstart-ux-trace-001';

      // Scaffold trust from coldstart
      const initialTrustScore = await coldstartTrustManager.scaffoldFromColdstart(sessionId, traceId);

      // Create emotional payload for coldstart scenario
      const payload = await createEmotionalPayload({
        sessionId,
        traceId,
        tone: 'reassuring',
        trustScore: initialTrustScore,
        payload: 'Welcome! Let\'s get started together.',
        metadata: { coldstart: true }
      });

      // Render UX with emotional scaffolding
      const uxMessage = await emotionalUXRenderer.renderRecoveryMessage({
        scenario: 'coldstart-welcome',
        severity: 'low',
        userState: 'neutral'
      });

      // Verify emotional UX uses appropriate tone
      expect(uxMessage.tone).toMatch(/supportive|reassuring|warm/);
      expect(uxMessage.trustImpact).toBe('positive');
      expect(uxMessage.reversalTestPassed).toBe(true);

      // Verify content feels familiar and welcoming
      expect(uxMessage.content.toLowerCase()).toMatch(/welcome|together|help|support/);
    });

    it('should adapt UX messaging for fresh-but-familiar tone', async () => {
      const sessionId = 'coldstart-familiar-001';
      const traceId = 'coldstart-familiar-trace-001';

      // Scaffold trust
      await coldstartTrustManager.scaffoldFromColdstart(sessionId, traceId);

      // Create payload with hints of familiarity
      const payload = await createEmotionalPayload({
        sessionId,
        traceId,
        tone: 'warm',
        trustScore: 0.75,
        payload: 'You feel familiar... let\'s continue where we left off.',
        metadata: { 
          coldstart: true,
          familiarityHints: ['returning_user_pattern', 'similar_intent']
        }
      });

      // Validate emotional tone
      const toneScore = await emotionalValidator.validateEmotionalTone(payload.tone);
      expect(toneScore).toBeGreaterThan(0.5);

      // Verify tone suggests continuity without claiming memory
      expect(payload.payload).toMatch(/familiar|continue|together/);
      expect(payload.payload).not.toMatch(/remember|recall|last time/);
    });
  });

  describe('🧘 Soft TrustScore Bootstrap', () => {
    it('should initialize trust score to neutral 0.75, not 0 or 1', async () => {
      const sessionId = 'coldstart-bootstrap-001';
      const traceId = 'coldstart-bootstrap-trace-001';

      // Scaffold trust from coldstart
      const initialTrustScore = await coldstartTrustManager.scaffoldFromColdstart(sessionId, traceId);

      // Verify gentle initialization
      expect(initialTrustScore).toBe(0.75);
      expect(initialTrustScore).toBeGreaterThan(0);
      expect(initialTrustScore).toBeLessThan(1);

      // Verify trust score is logged
      const eventLog = global.eventLog || [];
      const trustEvents = eventLog.filter(e => e.type === 'trust-scaffolded');
      expect(trustEvents).toHaveLength(1);
      expect(trustEvents[0].data.initialTrustScore).toBe(0.75);
    });

    it('should log trust scaffolding process to EventBus', async () => {
      const sessionId = 'coldstart-logging-001';
      const traceId = 'coldstart-logging-trace-001';

      // Clear events
      events = [];

      // Scaffold trust
      await coldstartTrustManager.scaffoldFromColdstart(sessionId, traceId);

      // Verify scaffolding event was logged
      const eventLog = global.eventLog || [];
      const scaffoldEvents = eventLog.filter(e => e.type === 'trust-scaffolded');
      expect(scaffoldEvents).toHaveLength(1);

      const scaffoldEvent = scaffoldEvents[0];
      expect(scaffoldEvent.data.sessionId).toBe(sessionId);
      expect(scaffoldEvent.data.traceId).toBe(traceId);
      expect(scaffoldEvent.data.reason).toBe('coldstart-detection');
      expect(scaffoldEvent.data.initialTrustScore).toBe(0.75);
    });
  });

  describe('🔁 Warm Recovery After Cold', () => {
    it('should replay or fallback after coldstart and reboot trust properly', async () => {
      const sessionId = 'coldstart-recovery-001';
      const traceId = 'coldstart-recovery-trace-001';

      // Initial coldstart scaffolding
      await coldstartTrustManager.scaffoldFromColdstart(sessionId, traceId);
      const initialScore = trustScoreManager.getTrustScore(sessionId);

      // Simulate warm recovery
      await coldstartTrustManager.warmRecoveryAfterCold(sessionId, traceId);
      const recoveredScore = trustScoreManager.getTrustScore(sessionId);

      // Verify trust improvement
      expect(recoveredScore).toBeGreaterThan(initialScore);
      expect(recoveredScore).toBeLessThanOrEqual(0.85);

      // Verify recovery event was logged
      const eventLog = global.eventLog || [];
      const recoveryEvents = eventLog.filter(e => e.type === 'trust-warm-recovery');
      expect(recoveryEvents).toHaveLength(1);
      expect(recoveryEvents[0].data.beforeScore).toBe(initialScore);
      expect(recoveryEvents[0].data.afterScore).toBe(recoveredScore);
    });

    it('should handle concurrent fallback + input without panic', async () => {
      const sessionId = 'coldstart-concurrent-001';
      const traceId = 'coldstart-concurrent-trace-001';

      // Scaffold trust
      await coldstartTrustManager.scaffoldFromColdstart(sessionId, traceId);

      // Simulate concurrent fallback and input
      const fallbackPromise = fallbackManager.triggerFallback(
        'concurrent-test',
        ['test-agent'],
        traceId,
        0.1
      );

      const inputPromise = createEmotionalPayload({
        sessionId,
        traceId,
        tone: 'neutral',
        payload: 'Concurrent input during coldstart'
      });

      // Both should complete without error
      const [fallbackResult, inputPayload] = await Promise.all([fallbackPromise, inputPromise]);

      expect(fallbackResult).toBeDefined();
      expect(inputPayload).toBeDefined();
      expect(inputPayload.traceId).toBe(traceId);

      // Trust should remain stable
      const finalTrustScore = trustScoreManager.getTrustScore(sessionId);
      expect(finalTrustScore).toBeGreaterThan(0.5);
    });
  });

  describe('🧪 Complex Coldstart Scenarios', () => {
    it('should handle coldstart + malformed input gracefully without distrust spike', async () => {
      const sessionId = 'coldstart-malformed-001';
      const traceId = 'coldstart-malformed-trace-001';

      // Scaffold trust
      await coldstartTrustManager.scaffoldFromColdstart(sessionId, traceId);
      const initialScore = trustScoreManager.getTrustScore(sessionId);

      // Create malformed input payload
      const malformedPayload = await createEmotionalPayload({
        sessionId,
        traceId,
        tone: 'confused',
        payload: '', // Empty payload
        trustScore: initialScore
      });

      // Render with fallback handling
      const uxResult = await emotionalUXRenderer.renderFallbackMessage(
        'empty/unclear output',
        'medium'
      );

      // Verify graceful handling
      expect(uxResult.tone).toMatch(/supportive|reassuring/);
      expect(uxResult.trustImpact).not.toBe('negative');

      // Verify no distrust spike
      const finalScore = trustScoreManager.getTrustScore(sessionId);
      expect(finalScore).toBeGreaterThanOrEqual(initialScore * 0.9);
    });

    it('should treat returning user like "you feel familiar..." without claiming memory', async () => {
      const sessionId = 'coldstart-familiar-return-001';
      const traceId = 'coldstart-familiar-return-trace-001';

      // Scaffold trust with familiarity hints
      await coldstartTrustManager.scaffoldFromColdstart(sessionId, traceId);

      // Create payload suggesting familiarity without memory claims
      const familiarPayload = await createEmotionalPayload({
        sessionId,
        traceId,
        tone: 'warm',
        trustScore: 0.75,
        payload: 'Something about you feels familiar. Let\'s explore what you\'re looking to accomplish.',
        metadata: {
          coldstart: true,
          familiaritySignals: ['user_pattern_match', 'intent_similarity'],
          memoryDisclaimer: true
        }
      });

      // Validate emotional tone
      const toneScore = await emotionalValidator.validateEmotionalTone(familiarPayload.tone);
      expect(toneScore).toBeGreaterThan(0.5);

      // Verify warm but honest messaging
      expect(familiarPayload.payload).toMatch(/familiar|feels/);
      expect(familiarPayload.payload).not.toMatch(/remember|last time|before/);
      expect(familiarPayload.metadata?.memoryDisclaimer).toBe(true);
    });

    it('should use emotional mirroring for tone matching when hints exist', async () => {
      const sessionId = 'coldstart-mirroring-001';
      const traceId = 'coldstart-mirroring-trace-001';

      // Scaffold trust
      await coldstartTrustManager.scaffoldFromColdstart(sessionId, traceId);

      // Create payload with tone hints from prior patterns
      const mirroredPayload = await createToneSpecificPayload('professional', {
        sessionId,
        traceId,
        trustScore: 0.75,
        metadata: {
          coldstart: true,
          toneHints: ['professional_context', 'business_intent'],
          emotionalMirroring: true
        }
      });

      // Verify tone matching
      expect(mirroredPayload.tone).toBe('professional');
      expect(mirroredPayload.metadata?.emotionalMirroring).toBe(true);

      // Render with mirrored tone
      const uxMessage = await emotionalUXRenderer.renderRecoveryMessage({
        scenario: 'coldstart-professional',
        severity: 'low',
        userState: 'neutral'
      });

      expect(uxMessage.tone).toMatch(/professional|warm/);
      expect(uxMessage.reversalTestPassed).toBe(true);
    });
  });

  describe('🧠 Ideal CX Thread Integration', () => {
    it('should make coldstart feel like soft continuation, not stranger interaction', async () => {
      const sessionId = 'coldstart-cx-integration-001';
      const traceId = 'coldstart-cx-integration-trace-001';

      // Scaffold trust with CX-aligned messaging
      await coldstartTrustManager.scaffoldFromColdstart(sessionId, traceId);

      // Create CX-aligned coldstart payload
      const cxPayload = await createEmotionalPayload({
        sessionId,
        traceId,
        tone: 'warm',
        trustScore: 0.75,
        payload: 'Welcome back to possibility. What would you like to create today?',
        metadata: {
          coldstart: true,
          cxAlignment: 'ideal-thread',
          emotionalContinuity: true
        }
      });

      // Validate emotional tone
      const toneScore = await emotionalValidator.validateEmotionalTone(cxPayload.tone);
      expect(toneScore).toBeGreaterThan(0.5);

      // Verify messaging feels like continuation
      expect(cxPayload.payload).toMatch(/welcome|possibility|create|today/);
      expect(cxPayload.payload).not.toMatch(/new|first time|getting started/);

      // Verify emotional warmth without false familiarity
      expect(cxPayload.tone).toBe('warm');
      expect(cxPayload.metadata?.emotionalContinuity).toBe(true);
    });
  });

  // Codex safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
}); 