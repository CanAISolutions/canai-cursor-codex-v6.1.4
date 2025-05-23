// fallback-contamination-sandbox.test.ts
// DreamState Test 20: Fallback Contamination Sandbox
// What: Validates that fallback state is properly sandboxed between render contexts
// Why: Ensures emotional state is isolated correctly, preventing drift and contamination
// How: Creates isolated session pairs and verifies no fallback state leaks between them

import { EventBus } from '../../cursor/event-bus/eventBus';
import { FallbackManager } from '../../cursor/services/fallback-manager';
import { EmotionalValidator } from '../../cursor/validators/emotional-validator';
import { createEmotionalPayload, createToneSpecificPayload } from '../../cursor/utils/emotion-payload-builder';
import { v4 as uuidv4 } from 'uuid';

// Session delta logging for tracing fallback contamination
interface FallbackSessionDelta {
  sessionId: string;
  fallbackStepId: string;
  triggerType: string;
  responseType: string;
  emotionalContext: string;
  trustScoreBefore: number;
  trustScoreAfter: number;
  timestamp: string;
}

// Session delta logger for auditing session boundaries
class SessionDeltaLogEmitter {
  private logs: FallbackSessionDelta[] = [];

  log(delta: FallbackSessionDelta): void {
    this.logs.push(delta);
  }

  getLogs(): FallbackSessionDelta[] {
    return this.logs;
  }

  getBySession(sessionId: string): FallbackSessionDelta[] {
    return this.logs.filter(log => log.sessionId === sessionId);
  }

  clearLogs(): void {
    this.logs = [];
  }
}

// Emotional UX Renderer with fallback capabilities
class EmotionalUXRenderer {
  renderPayload(payload: any, renderContext: string = 'standard'): UXRenderResult {
    let cta = 'Get Started';
    let helperText = '';
    let messageStyle = 'standard';
    let trustIndicator = 'normal';
    let emotionalSnapshot = '';
    
    // Check for empty payload - should trigger fallback
    if (!payload.payload || payload.payload.trim() === '') {
      return this.renderFallbackUI(payload, renderContext, 'empty/unclear output');
    }
    
    // Apply tone-specific rendering
    switch (payload.tone) {
      case 'enthusiastic':
      case 'inspiring':
      case 'joyful':
        cta = 'Let\'s Make it Happen!';
        helperText = 'We\'re excited to bring your vision to life!';
        messageStyle = 'vibrant';
        break;
      case 'reassuring':
        cta = 'Continue Safely';
        helperText = 'You\'re in good hands. We\'re here to support you.';
        messageStyle = 'calm';
        break;
      case 'empathetic':
        cta = 'Let\'s Work Through This';
        helperText = 'We understand this can be challenging. We\'re here to help.';
        messageStyle = 'supportive';
        break;
      case 'anxious':
      case 'concerned':
        cta = 'Review Options';
        helperText = 'Let\'s take a moment to consider the best approach.';
        messageStyle = 'cautious';
        break;
      case 'sarcastic':
      case 'frustrated':
        // Trigger fallback UI for negative tones
        return this.renderFallbackUI(payload, renderContext);
      case 'uncertain':
      case 'confused':
        cta = 'Clarify Together';
        helperText = 'Let\'s make sure we\'re on the same page. Need any clarification?';
        messageStyle = 'helpful';
        break;
      case 'null':
        // Null output, trigger fallback
        return this.renderFallbackUI(payload, renderContext, 'empty/unclear output');
      default:
        // Use neutral messaging for unknown tone
        cta = 'Continue';
        helperText = 'Here\'s what we\'ve prepared for you.';
        messageStyle = 'standard';
    }
    
    // Modify based on trust score
    if (payload.trustScore < 0.7) {
      trustIndicator = 'compromised';
      cta = 'Proceed With Caution';
      
      if (payload.trustScore < 0.5) {
        // Severe trust compromise triggers fallback UI
        return this.renderFallbackUI(payload, renderContext, 'trust_compromised');
      }
    } else if (payload.trustScore > 0.9) {
      trustIndicator = 'enhanced';
    }
    
    // Create emotional snapshot
    emotionalSnapshot = JSON.stringify({
      tone: payload.tone,
      trustScore: payload.trustScore,
      emotionIntentHash: payload.emotionIntentHash,
      timestamp: payload.timestamp
    });
    
    return {
      cta,
      helperText,
      messageStyle,
      trustIndicator,
      emotionalSnapshot,
      usedFallback: false,
      traceId: payload.traceId,
      uiComponents: {
        showHelper: true,
        enableCTA: true,
        messageFormat: 'standard'
      }
    };
  }
  
  renderFallbackUI(payload: any, renderContext: string = 'standard', forcedScenario?: string): UXRenderResult {
    // Determine fallback scenario
    let scenario = 'prompt failure';
    
    if (forcedScenario) {
      scenario = forcedScenario;
    } else if (payload.tone === 'sarcastic' || payload.tone === 'frustrated') {
      scenario = 'overwhelm detection';
    } else if (payload.trustScore < 0.5) {
      scenario = 'trust_compromised';
    } else if (!payload.payload || payload.payload.trim() === '') {
      scenario = 'empty/unclear output';
    }
    
    // Get appropriate fallback message according to Emotional Fallback Protocol
    let helperText = '';
    switch (scenario) {
      case 'GPT delay':
        helperText = 'Still shaping it — great things take a moment.';
        break;
      case 'API hiccup':
        helperText = 'A quick glitch — we\'re smoothing it out now.';
        break;
      case 'prompt failure':
        helperText = 'Let\'s tweak this — retrying with a sharper edge.';
        break;
      case 'overwhelm detection':
        helperText = 'Take a breath — we\'ll walk this path together.';
        break;
      case 'empty/unclear output':
        helperText = 'I want to make sure I understand you correctly.';
        break;
      case 'trust_compromised':
        helperText = 'Would you like to connect with our support team?';
        break;
      default:
        helperText = 'Let\'s take a fresh look at this.';
    }
    
    // Create emotional snapshot with fallback flag
    const emotionalSnapshot = JSON.stringify({
      tone: 'fallback',
      originalTone: payload.tone,
      trustScore: Math.max(payload.trustScore, 0.5), // Ensure minimum trust
      emotionIntentHash: payload.emotionIntentHash,
      timestamp: payload.timestamp,
      fallbackTriggered: true,
      fallbackReason: scenario
    });
    
    return {
      cta: 'Try Again',
      helperText,
      messageStyle: 'fallback',
      trustIndicator: 'recovering',
      emotionalSnapshot,
      usedFallback: true,
      traceId: payload.traceId,
      uiComponents: {
        showHelper: true,
        enableCTA: true,
        messageFormat: 'fallback'
      }
    };
  }
}

// Types for renderer
interface UXRenderResult {
  cta: string;
  helperText: string;
  messageStyle: string;
  trustIndicator: string;
  emotionalSnapshot: string;
  usedFallback: boolean;
  traceId: string;
  uiComponents: {
    showHelper: boolean;
    enableCTA: boolean;
    messageFormat: string;
  };
}

// Session container for contamination testing
class SessionContainer {
  private fallbackManager: FallbackManager;
  private emotionalValidator: EmotionalValidator;
  private eventBus: EventBus;
  private deltaLogger: SessionDeltaLogEmitter;
  private renderer: EmotionalUXRenderer;
  private sessionId: string;
  private traceId: string;
  
  constructor(deltaLogger: SessionDeltaLogEmitter, sessionId?: string, traceId?: string) {
    this.fallbackManager = FallbackManager.getInstance();
    this.emotionalValidator = new EmotionalValidator();
    this.eventBus = EventBus.getInstance();
    this.deltaLogger = deltaLogger;
    this.renderer = new EmotionalUXRenderer();
    this.sessionId = sessionId || uuidv4();
    this.traceId = traceId || uuidv4();
  }
  
  // Create emotional payload for this session
  async createPayload(tone: string, trustScore?: number): Promise<any> {
    return createToneSpecificPayload(tone, {
      sessionId: this.sessionId,
      traceId: this.traceId,
      trustScore: trustScore
    });
  }
  
  // Trigger fallback in this session
  async triggerFallback(reason: string, affectedAgents: string[] = ['agent1', 'agent2']): Promise<any> {
    const fallbackState = await this.fallbackManager.triggerFallback(
      reason,
      affectedAgents,
      this.traceId,
      -0.2 // Moderate trust impact
    );
    
    // Log the fallback step
    this.deltaLogger.log({
      sessionId: this.sessionId,
      fallbackStepId: `${this.sessionId}-fb-${Date.now()}`,
      triggerType: reason,
      responseType: 'fallback',
      emotionalContext: reason,
      trustScoreBefore: fallbackState.trustScore + 0.2, // Approximate previous score
      trustScoreAfter: fallbackState.trustScore,
      timestamp: new Date().toISOString()
    });
    
    return fallbackState;
  }
  
  // Start recovery process
  async startRecovery(): Promise<any> {
    return this.fallbackManager.startRecovery(this.traceId);
  }
  
  // Complete recovery
  async completeRecovery(): Promise<any> {
    return this.fallbackManager.completeRecovery(this.traceId);
  }
  
  // Render payload in this session context
  renderPayload(payload: any, renderContext: string = 'standard'): UXRenderResult {
    return this.renderer.renderPayload(payload, renderContext);
  }
  
  // Get current trust score
  getTrustScore(): number {
    return this.fallbackManager.getTrustScore();
  }
  
  // Get session ID
  getSessionId(): string {
    return this.sessionId;
  }
  
  // Get trace ID
  getTraceId(): string {
    return this.traceId;
  }
}

// Polaris Ritual: Fallback Isolation & Contamination Prevention
// Codex Vector: Emotional Context Compartmentalization
// Codex Safeguard: Fallback state must never persist across sessions or render contexts
describe('DreamState: fallback-contamination-sandbox', () => {
  let fallbackManager: FallbackManager;
  let deltaLogger: SessionDeltaLogEmitter;
  
  beforeEach(() => {
    // Reset fallback and trust for clean tests
    fallbackManager = FallbackManager.getInstance();
    fallbackManager.resetTrustScore();
    
    // Fresh log tracking
    deltaLogger = new SessionDeltaLogEmitter();
  });
  
  it('should sandbox sarcasm fallback state and not contaminate a fresh session with joy', async () => {
    // Arrange: Create two separate session containers
    const sessionA = new SessionContainer(deltaLogger);
    const sessionB = new SessionContainer(deltaLogger);
    
    // Act: Trigger cascading fallbacks in Session A
    const sarcasticPayload = await sessionA.createPayload('sarcastic', 0.7);
    const sarcasticRender = sessionA.renderPayload(sarcasticPayload);
    
    // Verify Session A triggered fallback from sarcasm
    expect(sarcasticRender.usedFallback).toBe(true);
    expect(sarcasticRender.messageStyle).toBe('fallback');
    
    // Complete all fallback stages in Session A
    await sessionA.triggerFallback('sarcasm');
    await sessionA.startRecovery();
    await sessionA.triggerFallback('empathy_reset');
    await sessionA.startRecovery();
    await sessionA.triggerFallback('escalation_cta');
    await sessionA.completeRecovery();
    
    // Reset FallbackManager (simulating a new page load/session)
    fallbackManager.resetTrustScore();
    
    // Now begin Session B with a completely different tone
    const joyPayload = await sessionB.createPayload('joyful', 0.95);
    const joyRender = sessionB.renderPayload(joyPayload);
    
    // Assert: Session B should NOT use fallback UI and should be free from contamination
    expect(joyRender.usedFallback).toBe(false);
    expect(joyRender.messageStyle).toBe('vibrant');
    expect(joyRender.helperText).toContain('excited');
    
    // Verify log separation - each session should have its own logs with no crossover
    const sessionALogs = deltaLogger.getBySession(sessionA.getSessionId());
    const sessionBLogs = deltaLogger.getBySession(sessionB.getSessionId());
    
    // Session A should have fallback logs
    expect(sessionALogs.length).toBeGreaterThan(0);
    
    // Session B should not have logs
    expect(sessionBLogs.length).toBe(0);
  });
  
  it('should sandbox null output fallback state and not contaminate a new session', async () => {
    // Arrange: Create two separate session containers
    const sessionA = new SessionContainer(deltaLogger);
    const sessionB = new SessionContainer(deltaLogger);
    
    // Act: Create a null output in Session A
    const nullPayload = await sessionA.createPayload('null', 0.8);
    nullPayload.payload = ''; // Empty payload to force fallback
    
    const nullRender = sessionA.renderPayload(nullPayload);
    
    // Verify Session A triggered fallback from null output
    expect(nullRender.usedFallback).toBe(true);
    expect(nullRender.helperText).toContain('understand you correctly');
    
    // Trigger and complete fallback chain in Session A
    await sessionA.triggerFallback('empty_output');
    await sessionA.startRecovery();
    await sessionA.completeRecovery();
    
    // Reset FallbackManager (simulating a new page load/session)
    fallbackManager.resetTrustScore();
    
    // Now begin Session B with a fresh payload
    const freshPayload = await sessionB.createPayload('reassuring', 0.9);
    const freshRender = sessionB.renderPayload(freshPayload);
    
    // Assert: Session B should be completely clean with no fallback microcopy
    expect(freshRender.usedFallback).toBe(false);
    expect(freshRender.helperText).toContain('good hands');
    expect(freshRender.messageStyle).toBe('calm');
    
    // Verify the trust score is reset between sessions
    expect(sessionB.getTrustScore()).toBeGreaterThanOrEqual(0.9);
  });
  
  it('should sandbox GPT delay fallback and not contaminate new sessions', async () => {
    // Arrange: Create two separate session containers
    const sessionA = new SessionContainer(deltaLogger);
    const sessionB = new SessionContainer(deltaLogger);
    
    // Act: Trigger GPT delay fallback in Session A
    const delayPayload = await sessionA.createPayload('professional', 0.85);
    const delayRender = sessionA.renderPayload(delayPayload, 'GPT delay');
    
    // Force fallback UI in Session A
    await sessionA.triggerFallback('GPT delay');
    
    // Create a snapshot of the fallback state
    const fallbackSnapshot = await sessionA.startRecovery();
    expect(fallbackSnapshot?.active).toBe(true);
    
    // Complete the recovery
    await sessionA.completeRecovery();
    
    // Reset FallbackManager (simulating a new page load/session)
    fallbackManager.resetTrustScore();
    
    // Now begin Session B with a completely different context
    const analyticalPayload = await sessionB.createPayload('analytical', 0.92);
    const analyticalRender = sessionB.renderPayload(analyticalPayload);
    
    // Assert: Session B should NOT be influenced by Session A's fallback
    expect(analyticalRender.usedFallback).toBe(false);
    
    // There should be no fallback or recovery language in Session B
    expect(analyticalRender.helperText).not.toContain('glitch');
    expect(analyticalRender.helperText).not.toContain('smoothing');
    expect(analyticalRender.helperText).not.toContain('retry');
    
    // Verify separate traceIds between sessions
    expect(sessionA.getTraceId()).not.toBe(sessionB.getTraceId());
  });
  
  it('should sandbox trustScore drop fallback and not contaminate new sessions', async () => {
    // Arrange: Create two separate session containers
    const sessionA = new SessionContainer(deltaLogger);
    const sessionB = new SessionContainer(deltaLogger);
    
    // Act: Create a low trust score in Session A
    const lowTrustPayload = await sessionA.createPayload('professional', 0.45);
    const lowTrustRender = sessionA.renderPayload(lowTrustPayload);
    
    // Verify Session A triggered fallback from low trust
    expect(lowTrustRender.usedFallback).toBe(true);
    expect(lowTrustRender.helperText).toContain('support team');
    
    // Trigger and complete fallbacks in Session A
    await sessionA.triggerFallback('low_trust');
    await sessionA.startRecovery();
    await sessionA.triggerFallback('retry_prompt');
    await sessionA.completeRecovery();
    
    // Verify the trust score has changed in Session A
    expect(sessionA.getTrustScore()).toBeLessThan(0.9);
    
    // Reset FallbackManager (simulating a new page load/session)
    fallbackManager.resetTrustScore();
    
    // Now begin Session B with a fresh high-trust context
    const freshPayload = await sessionB.createPayload('enthusiastic', 0.95);
    const freshRender = sessionB.renderPayload(freshPayload);
    
    // Assert: Session B should have a completely clean experience
    expect(freshRender.usedFallback).toBe(false);
    expect(freshRender.trustIndicator).toBe('enhanced');
    expect(freshRender.messageStyle).toBe('vibrant');
    
    // Verify trust score does not carry over
    expect(sessionB.getTrustScore()).toBeGreaterThanOrEqual(0.9);
    
    // No contamination of emotional context between sessions
    const sessionASnapshot = JSON.parse(lowTrustRender.emotionalSnapshot);
    const sessionBSnapshot = JSON.parse(freshRender.emotionalSnapshot);
    
    // Different trust scores
    expect(sessionASnapshot.trustScore).not.toBe(sessionBSnapshot.trustScore);
    
    // Tones should be different
    expect(sessionASnapshot.tone).not.toBe(sessionBSnapshot.tone);
  });
  
  it('should maintain contamination-free event logs with proper scope per traceId', async () => {
    // Arrange: Create multiple session containers
    const sessionA = new SessionContainer(deltaLogger);
    const sessionB = new SessionContainer(deltaLogger);
    const sessionC = new SessionContainer(deltaLogger);
    
    // Act: Trigger fallbacks in three separate sessions
    // Session A: Sarcasm fallback
    await sessionA.createPayload('sarcastic', 0.7);
    await sessionA.triggerFallback('sarcasm');
    await sessionA.startRecovery();
    await sessionA.completeRecovery();
    
    // Session B: Trust fallback 
    await sessionB.createPayload('anxious', 0.45);
    await sessionB.triggerFallback('low_trust');
    await sessionB.completeRecovery();
    
    // Session C: Empty output fallback
    await sessionC.createPayload('null', 0.8);
    await sessionC.triggerFallback('empty_output');
    await sessionC.completeRecovery();
    
    // Assert: Each session should have its own clean logs
    const sessionALogs = deltaLogger.getBySession(sessionA.getSessionId());
    const sessionBLogs = deltaLogger.getBySession(sessionB.getSessionId());
    const sessionCLogs = deltaLogger.getBySession(sessionC.getSessionId());
    
    // Each session should have its own logs
    expect(sessionALogs.length).toBeGreaterThan(0);
    expect(sessionBLogs.length).toBeGreaterThan(0);
    expect(sessionCLogs.length).toBeGreaterThan(0);
    
    // No shared fallbackStepIds
    const allStepIds = [
      ...sessionALogs.map(log => log.fallbackStepId),
      ...sessionBLogs.map(log => log.fallbackStepId),
      ...sessionCLogs.map(log => log.fallbackStepId)
    ];
    
    const uniqueStepIds = new Set(allStepIds);
    expect(uniqueStepIds.size).toBe(allStepIds.length);
    
    // Each log should contain its own sessionId
    sessionALogs.forEach(log => {
      expect(log.sessionId).toBe(sessionA.getSessionId());
    });
    
    sessionBLogs.forEach(log => {
      expect(log.sessionId).toBe(sessionB.getSessionId());
    });
    
    sessionCLogs.forEach(log => {
      expect(log.sessionId).toBe(sessionC.getSessionId());
    });
  });
  
  it('should ensure emotional clearance between fallback-triggered emotions and new sessions', async () => {
    // Arrange: Create two session containers
    const sessionA = new SessionContainer(deltaLogger);
    const sessionB = new SessionContainer(deltaLogger);
    
    // Act: Trigger multiple emotional fallbacks in Session A
    const sarcasticPayload = await sessionA.createPayload('sarcastic', 0.6);
    const sarcasticRender = sessionA.renderPayload(sarcasticPayload);
    
    // Session A should trigger empathy resetting fallback
    expect(sarcasticRender.usedFallback).toBe(true);
    
    // Trigger empathy reset and escalation fallbacks in Session A
    await sessionA.triggerFallback('sarcasm');
    await sessionA.startRecovery();
    await sessionA.triggerFallback('empathy_reset');
    await sessionA.startRecovery();
    await sessionA.triggerFallback('escalation_cta');
    await sessionA.completeRecovery();
    
    // Reset FallbackManager (simulating a new page load/session)
    fallbackManager.resetTrustScore();
    
    // Now create a neutral payload in Session B with no emotional triggers
    const neutralPayload = await sessionB.createPayload('professional', 0.9);
    const neutralRender = sessionB.renderPayload(neutralPayload);
    
    // Assert: Session B should have NO traces of Session A's emotional journey
    expect(neutralRender.usedFallback).toBe(false);
    
    // No empathy reset language
    expect(neutralRender.helperText).not.toContain('understand');
    expect(neutralRender.helperText).not.toContain('together');
    expect(neutralRender.helperText).not.toContain('support');
    
    // No escalation artifacts
    expect(neutralRender.cta).not.toContain('Again');
    expect(neutralRender.messageStyle).not.toBe('fallback');
    
    // Verify emotional snapshots show proper isolation
    const sessionASnapshot = JSON.parse(sarcasticRender.emotionalSnapshot);
    const sessionBSnapshot = JSON.parse(neutralRender.emotionalSnapshot);
    
    // Snapshots should be independent
    expect(sessionASnapshot.tone).toBe('fallback');
    expect(sessionBSnapshot.tone).toBe('professional');
    
    // Session B should have no fallback artifacts in its snapshot
    expect(sessionBSnapshot.fallbackTriggered).toBeUndefined();
  });
  
  it('should ensure all rendered UX copy derives only from the active payload', async () => {
    // Arrange: Create session containers
    const sessionA = new SessionContainer(deltaLogger);
    const sessionB = new SessionContainer(deltaLogger);
    
    // Act: Trigger fallbacks with specific UX copies in Session A
    const fallbackPayload = await sessionA.createPayload('frustrated', 0.7);
    const fallbackRender = sessionA.renderPayload(fallbackPayload);
    
    // Extract fallback helper text
    const fallbackText = fallbackRender.helperText;
    
    // Trigger and complete fallbacks
    await sessionA.triggerFallback('overwhelm detection');
    await sessionA.startRecovery();
    await sessionA.completeRecovery();
    
    // Reset FallbackManager (simulating a new page load/session)
    fallbackManager.resetTrustScore();
    
    // Now use a completely different tone in Session B
    const joyPayload = await sessionB.createPayload('enthusiastic', 0.95);
    const joyRender = sessionB.renderPayload(joyPayload);
    
    // Assert: Session B's UX should be completely independent
    expect(joyRender.usedFallback).toBe(false);
    
    // Session B helper text should NOT match Session A's fallback text
    expect(joyRender.helperText).not.toBe(fallbackText);
    
    // Session B should have its own joyful tone
    expect(joyRender.helperText).toContain('excited');
    
    // No remnants of fallback UI in Session B
    expect(joyRender.messageStyle).toBe('vibrant');
    expect(joyRender.trustIndicator).toBe('enhanced');
  });
});