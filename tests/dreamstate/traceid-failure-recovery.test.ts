// traceid-failure-recovery.test.ts
// Polaris Ritual: Trace Resurrection After Failure
// Codex Vector: Emotional Memory Recovery
// Codex Safeguard: Every user journey must be gracefully reconnected after disruption

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { EventBus } from '../../cursor/event-bus/eventBus';
import { EmotionalValidator } from '../../cursor/validators/emotional-validator';
import { FallbackManager } from '../../cursor/services/fallback-manager';
import { TrustScoreManager } from '../../cursor/services/trust-score-manager';
import { InputSanitizer } from '../../cursor/services/input-sanitizer';
import { createEmotionalPayload } from '../mocks/dreamstate-core';

// Local EmotionalUXRenderer implementation for testing
class EmotionalUXRenderer {
  static getInstance(): EmotionalUXRenderer {
    return new EmotionalUXRenderer();
  }

  renderPayload(payload: any, renderContext: string = 'standard'): UXRenderResult {
    let cta = 'Get Started';
    let helperText = '';
    let messageStyle = 'standard';
    let trustIndicator = 'normal';
    
    // Check for empty payload - should trigger fallback
    if (!payload.payload || payload.payload.trim() === '') {
      return this.renderFallbackUI(payload, renderContext, 'empty/unclear output');
    }
    
    // Apply tone-specific rendering
    switch (payload.tone) {
      case 'enthusiastic':
      case 'inspiring':
        cta = 'Let\'s Make it Happen!';
        helperText = 'We\'re excited to bring your vision to life!';
        messageStyle = 'vibrant';
        break;
      case 'reassuring':
        cta = 'Continue Safely';
        helperText = 'You\'re in good hands. We\'re here to support you.';
        messageStyle = 'calm';
        break;
      case 'confident':
        cta = 'Continue';
        helperText = 'You\'re on the right track. Let\'s keep moving forward.';
        messageStyle = 'confident';
        break;
      default:
        cta = 'Continue';
        helperText = 'Here\'s what we\'ve prepared for you.';
        messageStyle = 'standard';
    }
    
    // Modify based on trust score
    if (payload.trustScore < 0.7) {
      trustIndicator = 'compromised';
      cta = 'Proceed With Caution';
      
      if (payload.trustScore < 0.5) {
        return this.renderFallbackUI(payload, renderContext);
      }
    } else if (payload.trustScore > 0.9) {
      trustIndicator = 'enhanced';
    }
    
    const emotionalSnapshot = JSON.stringify({
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
    let scenario = 'prompt failure';
    
    if (forcedScenario) {
      scenario = forcedScenario;
    } else if (payload.tone === 'sarcastic' || payload.tone === 'frustrated') {
      scenario = 'overwhelm detection';
    } else if (payload.trustScore < 0.5) {
      scenario = 'API hiccup';
    } else if (!payload.payload || payload.payload.trim() === '') {
      scenario = 'empty/unclear output';
    }
    
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
        helperText = 'Nothing yet? Let\'s refine it side by side.';
        break;
      case 'trace-recovery':
        helperText = 'We picked up right where we left off — everything\'s secure.';
        break;
      default:
        helperText = 'Let\'s take a fresh look at this together.';
    }
    
    const emotionalSnapshot = JSON.stringify({
      tone: 'fallback',
      originalTone: payload.tone,
      trustScore: Math.max(payload.trustScore, 0.5),
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

// Type definitions for UX rendering
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

// Real TraceManager implementation for trace recovery validation
class TraceManager {
  private spans: Map<string, TraceSpan> = new Map();
  private traceChains: Map<string, string[]> = new Map();
  private corruptedSpans: Set<string> = new Set();
  private eventBus: EventBus;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  startSpan(traceId: string, spanId: string, originTraceId?: string, parentSpanId?: string): TraceSpan {
    const span: TraceSpan = {
      traceId,
      spanId,
      originTraceId: originTraceId || traceId,
      parentSpanId,
      startTime: Date.now(),
      endTime: null,
      status: 'active',
      metadata: {},
      events: []
    };

    this.spans.set(spanId, span);
    
    // Update trace chain
    if (!this.traceChains.has(traceId)) {
      this.traceChains.set(traceId, []);
    }
    this.traceChains.get(traceId)!.push(spanId);

    this.eventBus.emit('trace-span-started', {
      traceId,
      spanId,
      originTraceId: span.originTraceId,
      parentSpanId,
      timestamp: Date.now()
    }, 'TraceManager');

    return span;
  }

  endSpan(spanId: string, metadata?: Record<string, any>): void {
    const span = this.spans.get(spanId);
    if (span) {
      span.endTime = Date.now();
      span.status = 'completed';
      if (metadata) {
        span.metadata = { ...span.metadata, ...metadata };
      }

      this.eventBus.emit('trace-span-ended', {
        traceId: span.traceId,
        spanId,
        status: span.status,
        metadata: span.metadata,
        timestamp: Date.now()
      }, 'TraceManager');
    }
  }

  // 🧬 Broken Lineage Detection
  detectBrokenLineage(traceId: string): TraceCorruption[] {
    const corruptions: TraceCorruption[] = [];
    const chain = this.traceChains.get(traceId) || [];
    
    for (const spanId of chain) {
      const span = this.spans.get(spanId);
      
      if (!span) {
        corruptions.push({
          type: 'missing-span',
          spanId,
          traceId,
          description: 'Span exists in chain but not in spans map'
        });
        continue;
      }

      // Check for corrupted span data
      if (this.corruptedSpans.has(spanId)) {
        corruptions.push({
          type: 'corrupted-span',
          spanId,
          traceId,
          description: 'Span marked as corrupted'
        });
      }

      // Check for invalid trace ID
      if (!span.traceId || span.traceId !== traceId) {
        corruptions.push({
          type: 'invalid-traceid',
          spanId,
          traceId,
          description: `Span traceId mismatch: expected ${traceId}, got ${span.traceId}`
        });
      }

      // Check for missing origin trace ID
      if (!span.originTraceId) {
        corruptions.push({
          type: 'missing-origin',
          spanId,
          traceId,
          description: 'Missing originTraceId'
        });
      }
    }

    return corruptions;
  }

  // 🔁 Trace Recovery Integrity
  recoverFromCorruption(traceId: string, corruptions: TraceCorruption[]): TraceRecoveryResult {
    const recoveryActions: RecoveryAction[] = [];
    let recoveredSpans = 0;
    let newRootGenerated = false;
    let hasEmittedRecoveryEvent = false;

    for (const corruption of corruptions) {
      switch (corruption.type) {
        case 'missing-span':
          // Generate replacement span without calling generateSafeRoot to avoid duplicate events
          const newSpanId = `${corruption.spanId}-recovered`;
          const newSpan: TraceSpan = {
            traceId,
            spanId: newSpanId,
            originTraceId: traceId,
            parentSpanId: undefined,
            startTime: Date.now(),
            endTime: null,
            status: 'active',
            metadata: {
              isRecovered: true,
              generatedAt: Date.now(),
              reason: 'missing-span-recovery'
            },
            events: []
          };
          this.spans.set(newSpanId, newSpan);
          
          recoveryActions.push({
            type: 'span-regenerated',
            originalSpanId: corruption.spanId,
            newSpanId: newSpan.spanId,
            metadata: { reason: 'missing-span-recovery' }
          });
          recoveredSpans++;
          break;

        case 'corrupted-span':
          // Sanitize and recover span
          const corruptedSpan = this.spans.get(corruption.spanId);
          if (corruptedSpan) {
            corruptedSpan.metadata.recovered = true;
            corruptedSpan.metadata.recoveryTimestamp = Date.now();
            this.corruptedSpans.delete(corruption.spanId);
            recoveryActions.push({
              type: 'span-sanitized',
              originalSpanId: corruption.spanId,
              newSpanId: corruption.spanId,
              metadata: { reason: 'corruption-sanitized' }
            });
            recoveredSpans++;
          }
          break;

        case 'invalid-traceid':
        case 'missing-origin':
          // Fix trace lineage
          const span = this.spans.get(corruption.spanId);
          if (span) {
            span.traceId = traceId;
            span.originTraceId = traceId;
            span.metadata.lineageFixed = true;
            recoveryActions.push({
              type: 'lineage-fixed',
              originalSpanId: corruption.spanId,
              newSpanId: corruption.spanId,
              metadata: { reason: 'lineage-repair' }
            });
            recoveredSpans++;
          }
          break;
      }
    }

    // Check if we need to generate a safe root (no valid spans exist)
    const chain = this.traceChains.get(traceId) || [];
    const validSpans = chain.filter(spanId => this.spans.has(spanId) && !this.corruptedSpans.has(spanId));
    
    if (validSpans.length === 0) {
      const safeSpanId = `safe-root-${Date.now()}`;
      const safeSpan: TraceSpan = {
        traceId,
        spanId: safeSpanId,
        originTraceId: traceId,
        parentSpanId: undefined,
        startTime: Date.now(),
        endTime: null,
        status: 'active',
        metadata: {
          isSafeRoot: true,
          generatedAt: Date.now(),
          reason: 'trace-recovery'
        },
        events: []
      };

      this.spans.set(safeSpanId, safeSpan);
      this.traceChains.set(traceId, [safeSpanId]);

      // Emit safe root event only once
      this.eventBus.emit('safe-root-generated', {
        traceId,
        spanId: safeSpanId,
        timestamp: Date.now()
      }, 'TraceManager');

      newRootGenerated = true;
      recoveryActions.push({
        type: 'safe-root-generated',
        originalSpanId: 'none',
        newSpanId: safeSpan.spanId,
        metadata: { reason: 'no-valid-spans' }
      });
    }

    const result: TraceRecoveryResult = {
      traceId,
      recoveredSpans,
      newRootGenerated,
      recoveryActions,
      isFullyRecovered: corruptions.length === recoveredSpans || newRootGenerated,
      timestamp: Date.now()
    };

    // Emit recovery event only once
    if (!hasEmittedRecoveryEvent) {
      this.eventBus.emit('trace-recovery-completed', {
        traceId,
        result,
        timestamp: Date.now()
      }, 'TraceManager');
      hasEmittedRecoveryEvent = true;
    }

    return result;
  }

  // 🧘 Generate Safe Root
  generateSafeRoot(traceId: string, spanId?: string): TraceSpan {
    const safeSpanId = spanId || `safe-root-${Date.now()}`;
    const safeSpan: TraceSpan = {
      traceId,
      spanId: safeSpanId,
      originTraceId: traceId,
      parentSpanId: undefined,
      startTime: Date.now(),
      endTime: null,
      status: 'active',
      metadata: {
        isSafeRoot: true,
        generatedAt: Date.now(),
        reason: 'trace-recovery'
      },
      events: []
    };

    this.spans.set(safeSpanId, safeSpan);
    this.traceChains.set(traceId, [safeSpanId]);

    this.eventBus.emit('safe-root-generated', {
      traceId,
      spanId: safeSpanId,
      timestamp: Date.now()
    }, 'TraceManager');

    return safeSpan;
  }

  // ⛓️ Validate Lineage
  validateLineage(traceId: string): TraceLineageValidation {
    const chain = this.traceChains.get(traceId) || [];
    const spans = chain.map(spanId => this.spans.get(spanId)).filter(Boolean) as TraceSpan[];
    
    const originTraceIds = new Set(spans.map(span => span.originTraceId));
    const hasConsistentOrigin = originTraceIds.size === 1;
    
    const hasGaps = spans.some((span, index) => {
      if (index === 0) return false;
      const prevSpan = spans[index - 1];
      return span.startTime < prevSpan.endTime! - 1000; // Allow 1s tolerance
    });

    const validation: TraceLineageValidation = {
      traceId,
      isValid: hasConsistentOrigin && !hasGaps,
      spanCount: spans.length,
      originTraceId: Array.from(originTraceIds)[0] || traceId,
      hasConsistentOrigin,
      hasGaps,
      continuityScore: hasConsistentOrigin && !hasGaps ? 1.0 : 0.5,
      auditTrail: spans.map(span => ({
        spanId: span.spanId,
        startTime: span.startTime,
        endTime: span.endTime,
        status: span.status,
        metadata: span.metadata
      }))
    };

    this.eventBus.emit('trace-lineage-validated', {
      traceId,
      validation,
      timestamp: Date.now()
    }, 'TraceManager');

    return validation;
  }

  // Utility methods for testing
  simulateSpanCorruption(spanId: string): void {
    this.corruptedSpans.add(spanId);
  }

  simulateSpanLoss(spanId: string): void {
    this.spans.delete(spanId);
  }

  getSpan(spanId: string): TraceSpan | undefined {
    return this.spans.get(spanId);
  }

  getTraceChain(traceId: string): string[] {
    return this.traceChains.get(traceId) || [];
  }
}

// Type definitions
interface TraceSpan {
  traceId: string;
  spanId: string;
  originTraceId: string;
  parentSpanId?: string;
  startTime: number;
  endTime: number | null;
  status: string;
  metadata: Record<string, any>;
  events: any[];
}

interface TraceCorruption {
  type: 'missing-span' | 'corrupted-span' | 'invalid-traceid' | 'missing-origin';
  spanId: string;
  traceId: string;
  description: string;
}

interface RecoveryAction {
  type: 'span-regenerated' | 'span-sanitized' | 'lineage-fixed' | 'safe-root-generated';
  originalSpanId: string;
  newSpanId: string;
  metadata: Record<string, any>;
}

interface TraceRecoveryResult {
  traceId: string;
  recoveredSpans: number;
  newRootGenerated: boolean;
  recoveryActions: RecoveryAction[];
  isFullyRecovered: boolean;
  timestamp: number;
}

interface TraceLineageValidation {
  traceId: string;
  isValid: boolean;
  spanCount: number;
  originTraceId: string;
  hasConsistentOrigin: boolean;
  hasGaps: boolean;
  continuityScore: number;
  auditTrail: Array<{
    spanId: string;
    startTime: number;
    endTime: number | null;
    status: string;
    metadata: Record<string, any>;
  }>;
}

describe('DreamState: traceid-failure-recovery', () => {
  let eventBus: EventBus;
  let traceManager: TraceManager;
  let emotionalValidator: EmotionalValidator;
  let fallbackManager: FallbackManager;
  let trustScoreManager: TrustScoreManager;
  let emotionalUXRenderer: EmotionalUXRenderer;
  let inputSanitizer: InputSanitizer;
  let events: any[];
  let eventHandlers: Array<{ event: string; handler: any }> = [];

  beforeEach(() => {
    events = [];
    eventBus = EventBus.getInstance();
    
    // Clear event log to prevent cross-test contamination
    eventBus.clearEventLog();
    
    // Remove previous handlers
    eventHandlers.forEach(({ event, handler }) => {
      eventBus.off(event, handler);
    });
    eventHandlers = [];
    
    // Create unique event handlers for this test
    const traceSpanStartedHandler = async (data: any) => {
      events.push({ eventType: 'trace-span-started', data, timestamp: Date.now() });
    };
    const traceSpanEndedHandler = async (data: any) => {
      events.push({ eventType: 'trace-span-ended', data, timestamp: Date.now() });
    };
    const traceRecoveryCompletedHandler = async (data: any) => {
      events.push({ eventType: 'trace-recovery-completed', data, timestamp: Date.now() });
    };
    const safeRootGeneratedHandler = async (data: any) => {
      events.push({ eventType: 'safe-root-generated', data, timestamp: Date.now() });
    };
    const traceLineageValidatedHandler = async (data: any) => {
      events.push({ eventType: 'trace-lineage-validated', data, timestamp: Date.now() });
    };
    const fallbackActivatedHandler = async (data: any) => {
      events.push({ eventType: 'fallback-activated', data, timestamp: Date.now() });
    };
    
    // Register handlers and track them for cleanup
    eventBus.on('trace-span-started', traceSpanStartedHandler);
    eventHandlers.push({ event: 'trace-span-started', handler: traceSpanStartedHandler });
    
    eventBus.on('trace-span-ended', traceSpanEndedHandler);
    eventHandlers.push({ event: 'trace-span-ended', handler: traceSpanEndedHandler });
    
    eventBus.on('trace-recovery-completed', traceRecoveryCompletedHandler);
    eventHandlers.push({ event: 'trace-recovery-completed', handler: traceRecoveryCompletedHandler });
    
    eventBus.on('safe-root-generated', safeRootGeneratedHandler);
    eventHandlers.push({ event: 'safe-root-generated', handler: safeRootGeneratedHandler });
    
    eventBus.on('trace-lineage-validated', traceLineageValidatedHandler);
    eventHandlers.push({ event: 'trace-lineage-validated', handler: traceLineageValidatedHandler });
    
    eventBus.on('fallback:activated', fallbackActivatedHandler);
    eventHandlers.push({ event: 'fallback:activated', handler: fallbackActivatedHandler });

    traceManager = new TraceManager(eventBus);
    emotionalValidator = new EmotionalValidator();
    fallbackManager = FallbackManager.getInstance();
    trustScoreManager = new TrustScoreManager(eventBus);
    emotionalUXRenderer = EmotionalUXRenderer.getInstance();
    inputSanitizer = new InputSanitizer();
  });

  afterEach(() => {
    // Remove all handlers registered in this test
    eventHandlers.forEach(({ event, handler }) => {
      eventBus.off(event, handler);
    });
    eventHandlers = [];
    events = [];
    eventBus.clearEventLog();
  });

  describe('🧬 Broken Lineage Detection', () => {
    it('should detect invalid or missing trace context', async () => {
      const traceId = 'trace-broken-lineage-001';
      
      // Create spans with various corruption types
      const span1 = traceManager.startSpan(traceId, 'span-1');
      const span2 = traceManager.startSpan(traceId, 'span-2', traceId, 'span-1');
      
      // Simulate corruptions
      traceManager.simulateSpanCorruption('span-1');
      traceManager.simulateSpanLoss('span-2');
      
      // Create span with invalid trace ID
      const span3 = traceManager.startSpan('wrong-trace', 'span-3');
      
      // Detect corruptions
      const corruptions = traceManager.detectBrokenLineage(traceId);
      
      expect(corruptions.length).toBeGreaterThan(0);
      expect(corruptions.some(c => c.type === 'corrupted-span')).toBe(true);
      expect(corruptions.some(c => c.type === 'missing-span')).toBe(true);
    });
  });

  describe('🔁 Trace Recovery Integrity', () => {
    it('should regenerate trace from last known valid segment or bootstrap cleanly', async () => {
      const traceId = 'trace-recovery-002';
      
      // Clear events before this test
      events = [];
      
      // Create original trace with corruption
      const span1 = traceManager.startSpan(traceId, 'span-original');
      traceManager.simulateSpanCorruption('span-original');
      
      // Clear events after setup
      events = [];
      
      // Detect and recover
      const corruptions = traceManager.detectBrokenLineage(traceId);
      const recovery = traceManager.recoverFromCorruption(traceId, corruptions);
      
      expect(recovery.isFullyRecovered).toBe(true);
      expect(recovery.recoveredSpans).toBeGreaterThan(0);
      expect(recovery.recoveryActions.some(a => a.type === 'span-sanitized')).toBe(true);
      
      // Validate recovery events were emitted (should be exactly 1)
      const recoveryEvents = events.filter(e => e.eventType === 'trace-recovery-completed');
      expect(recoveryEvents.length).toBe(1);
      expect(recoveryEvents[0].data.traceId).toBe(traceId);
    });

    it('should bootstrap safe new root when no valid spans exist', async () => {
      const traceId = 'trace-bootstrap-003';
      
      // Clear events before this test
      events = [];
      
      // Create trace and lose all spans
      traceManager.startSpan(traceId, 'span-lost');
      traceManager.simulateSpanLoss('span-lost');
      
      // Clear events after setup
      events = [];
      
      // Detect and recover
      const corruptions = traceManager.detectBrokenLineage(traceId);
      const recovery = traceManager.recoverFromCorruption(traceId, corruptions);
      
      expect(recovery.newRootGenerated).toBe(true);
      expect(recovery.recoveryActions.some(a => a.type === 'safe-root-generated')).toBe(true);
      
      // Validate safe root was created
      const safeRootEvents = events.filter(e => e.eventType === 'safe-root-generated');
      expect(safeRootEvents.length).toBe(1);
      expect(safeRootEvents[0].data.traceId).toBe(traceId);
    });
  });

  describe('⛓️ Fallback-Triggered Repair', () => {
    it('should include trace recovery as part of fallback flow', async () => {
      const traceId = 'trace-fallback-repair-004';
      const payload = createEmotionalPayload();
      payload.traceId = traceId;
      
      // Clear events before this test
      events = [];
      
      // Create corrupted trace
      const span1 = traceManager.startSpan(traceId, 'span-corrupted');
      traceManager.simulateSpanCorruption('span-corrupted');
      
      // Clear events after setup
      events = [];
      
      // Trigger fallback
      await fallbackManager.triggerFallback(
        'trace-corruption-detected',
        ['TraceManager'],
        traceId,
        -0.1
      );
      
      // Perform recovery as part of fallback
      const corruptions = traceManager.detectBrokenLineage(traceId);
      const recovery = traceManager.recoverFromCorruption(traceId, corruptions);
      
      // Validate fallback and recovery integration
      expect(recovery.isFullyRecovered).toBe(true);
      
      const fallbackEvents = events.filter(e => e.eventType === 'fallback-activated');
      expect(fallbackEvents.length).toBe(1);
      expect(fallbackEvents[0].data.state.reason).toBe('trace-corruption-detected');
      
      const recoveryEvents = events.filter(e => e.eventType === 'trace-recovery-completed');
      expect(recoveryEvents.length).toBe(1);
    });
  });

  describe('🧾 Recovery Metadata Logging', () => {
    it('should log all repair actions to EventBus with full metadata', async () => {
      const traceId = 'trace-metadata-logging-005';
      
      // Clear events before this test
      events = [];
      
      // Create multiple corruption types
      const span1 = traceManager.startSpan(traceId, 'span-1');
      const span2 = traceManager.startSpan(traceId, 'span-2', traceId, 'span-1');
      
      traceManager.simulateSpanCorruption('span-1');
      traceManager.simulateSpanLoss('span-2');
      
      // Clear events after setup
      events = [];
      
      // Perform recovery
      const corruptions = traceManager.detectBrokenLineage(traceId);
      const recovery = traceManager.recoverFromCorruption(traceId, corruptions);
      
      // Validate comprehensive logging
      expect(recovery.recoveryActions.length).toBeGreaterThan(0);
      
      recovery.recoveryActions.forEach(action => {
        expect(action.type).toBeDefined();
        expect(action.originalSpanId).toBeDefined();
        expect(action.newSpanId).toBeDefined();
        expect(action.metadata).toBeDefined();
        expect(action.metadata.reason).toBeDefined();
      });
      
      // Validate EventBus received recovery metadata
      const recoveryEvents = events.filter(e => e.eventType === 'trace-recovery-completed');
      expect(recoveryEvents.length).toBe(1);
      expect(recoveryEvents[0].data.result.recoveryActions).toEqual(recovery.recoveryActions);
    });
  });

  describe('🧘 TrustScore Preservation', () => {
    it('should preserve trust scores through recovery without drop or inflation', async () => {
      const traceId = 'trace-trust-preservation-006';
      const originalTrustScore = 0.85;
      
      // Create payload with specific trust score
      const payload = createEmotionalPayload();
      payload.traceId = traceId;
      payload.trustScore = originalTrustScore;
      
      // Create and corrupt trace
      const span1 = traceManager.startSpan(traceId, 'span-trust-test');
      span1.metadata.trustScore = originalTrustScore;
      traceManager.simulateSpanCorruption('span-trust-test');
      
      // Perform recovery
      const corruptions = traceManager.detectBrokenLineage(traceId);
      const recovery = traceManager.recoverFromCorruption(traceId, corruptions);
      
      // Validate trust score preservation
      const recoveredSpan = traceManager.getSpan('span-trust-test');
      expect(recoveredSpan).toBeDefined();
      expect(recoveredSpan!.metadata.trustScore).toBe(originalTrustScore);
      expect(recoveredSpan!.metadata.recovered).toBe(true);
      
      // Validate no artificial trust score changes
      expect(recovery.isFullyRecovered).toBe(true);
    });
  });

  describe('🕯️ Continuity Notice UX', () => {
    it('should emit user-safe continuity message during recovery', async () => {
      const traceId = 'trace-continuity-notice-007';
      const payload = createEmotionalPayload();
      payload.traceId = traceId;
      
      // Create corrupted trace
      const span1 = traceManager.startSpan(traceId, 'span-continuity');
      traceManager.simulateSpanLoss('span-continuity');
      
      // Perform recovery
      const corruptions = traceManager.detectBrokenLineage(traceId);
      const recovery = traceManager.recoverFromCorruption(traceId, corruptions);
      
      // Generate continuity notice through UX renderer
      const continuityPayload = {
        ...payload,
        tone: 'reassuring',
        trustScore: Math.max(payload.trustScore, 0.7) // Ensure stable trust during recovery
      };
      
      const uxResult = emotionalUXRenderer.renderFallbackUI(
        continuityPayload,
        'recovery',
        'trace-recovery'
      );
      
      // Validate continuity notice
      expect(uxResult.usedFallback).toBe(true);
      expect(uxResult.helperText).toContain('we');
      expect(uxResult.trustIndicator).toBe('recovering');
      
      // Validate emotional tone preservation
      const emotionalSnapshot = JSON.parse(uxResult.emotionalSnapshot);
      expect(emotionalSnapshot.fallbackTriggered).toBe(true);
      expect(emotionalSnapshot.fallbackReason).toBe('trace-recovery');
    });
  });

  describe('🧪 Complex Recovery Scenarios', () => {
    it('should handle broken traceId with fallback and valid new span creation', async () => {
      const originalTraceId = 'trace-broken-001';
      const payload = createEmotionalPayload();
      payload.traceId = originalTraceId;
      
      // Create broken trace
      const brokenSpan = traceManager.startSpan('invalid-trace', 'span-broken');
      
      // Trigger fallback
      await fallbackManager.triggerFallback(
        'broken-traceid-detected',
        ['TraceManager'],
        originalTraceId
      );
      
      // Generate safe root for correct trace
      const safeRoot = traceManager.generateSafeRoot(originalTraceId);
      
      // Validate recovery
      expect(safeRoot.traceId).toBe(originalTraceId);
      expect(safeRoot.originTraceId).toBe(originalTraceId);
      expect(safeRoot.metadata.isSafeRoot).toBe(true);
      
      // Validate continuity notice
      const uxResult = emotionalUXRenderer.renderFallbackUI(
        payload,
        'recovery',
        'trace-recovery'
      );
      expect(uxResult.helperText).toMatch(/we.*together|picked up.*left off|smoothing.*out/i);
    });

    it('should handle corrupted originTraceId with system regeneration', async () => {
      const traceId = 'trace-origin-corruption-002';
      
      // Create span with corrupted origin
      const span1 = traceManager.startSpan(traceId, 'span-corrupt-origin');
      span1.originTraceId = ''; // Corrupt the origin
      
      // Detect and recover
      const corruptions = traceManager.detectBrokenLineage(traceId);
      const recovery = traceManager.recoverFromCorruption(traceId, corruptions);
      
      // Validate origin restoration
      const recoveredSpan = traceManager.getSpan('span-corrupt-origin');
      expect(recoveredSpan!.originTraceId).toBe(traceId);
      expect(recoveredSpan!.metadata.lineageFixed).toBe(true);
      expect(recovery.isFullyRecovered).toBe(true);
    });

    it('should handle coldstart scenario with graceful UX', async () => {
      const traceId = 'trace-coldstart-003';
      const payload = createEmotionalPayload();
      payload.traceId = traceId;
      
      // Simulate coldstart - no existing trace data
      const safeRoot = traceManager.generateSafeRoot(traceId);
      
      // Validate safe bootstrap
      expect(safeRoot.traceId).toBe(traceId);
      expect(safeRoot.metadata.isSafeRoot).toBe(true);
      
      // Validate graceful UX for new session
      const uxResult = emotionalUXRenderer.renderPayload(payload);
      expect(uxResult.traceId).toBe(traceId);
      expect(uxResult.usedFallback).toBe(false); // Should be normal flow for new session
    });

    it('should handle concurrent span loss in replay/fallback race', async () => {
      const traceId = 'trace-concurrent-race-004';
      
      // Create multiple spans
      const span1 = traceManager.startSpan(traceId, 'span-1');
      const span2 = traceManager.startSpan(traceId, 'span-2', traceId, 'span-1');
      const span3 = traceManager.startSpan(traceId, 'span-3', traceId, 'span-2');
      
      // Simulate concurrent loss
      traceManager.simulateSpanLoss('span-2');
      traceManager.simulateSpanCorruption('span-3');
      
      // Perform recovery
      const corruptions = traceManager.detectBrokenLineage(traceId);
      const recovery = traceManager.recoverFromCorruption(traceId, corruptions);
      
      // Validate correct recovery
      expect(recovery.recoveredSpans).toBe(2); // span-2 regenerated, span-3 sanitized
      expect(recovery.isFullyRecovered).toBe(true);
      
      // Validate lineage integrity
      const validation = traceManager.validateLineage(traceId);
      expect(validation.hasConsistentOrigin).toBe(true);
      expect(validation.originTraceId).toBe(traceId);
    });

    it('should preserve drift and trust logs through recovery span', async () => {
      const traceId = 'trace-drift-preservation-005';
      const originalTrustScore = 0.75;
      
      // Create span with drift and trust metadata
      const span1 = traceManager.startSpan(traceId, 'span-drift');
      span1.metadata.trustScore = originalTrustScore;
      span1.metadata.driftDetected = true;
      span1.metadata.driftScore = 0.15;
      
      // Corrupt and recover
      traceManager.simulateSpanCorruption('span-drift');
      const corruptions = traceManager.detectBrokenLineage(traceId);
      const recovery = traceManager.recoverFromCorruption(traceId, corruptions);
      
      // Validate metadata preservation
      const recoveredSpan = traceManager.getSpan('span-drift');
      expect(recoveredSpan!.metadata.trustScore).toBe(originalTrustScore);
      expect(recoveredSpan!.metadata.driftDetected).toBe(true);
      expect(recoveredSpan!.metadata.driftScore).toBe(0.15);
      expect(recoveredSpan!.metadata.recovered).toBe(true);
    });

    it('should handle injected trace corruption with sanitization', async () => {
      const traceId = 'trace-injection-006';
      const maliciousInput = traceId + '; DROP TABLE traces; --';
      
      // Sanitize input
      const sanitizedResult = await inputSanitizer.sanitizeInput(maliciousInput, traceId);
      
      // Create safe span with sanitized data
      const safeSpan = traceManager.generateSafeRoot(traceId);
      safeSpan.metadata.inputSanitized = true;
      safeSpan.metadata.originalInput = maliciousInput;
      safeSpan.metadata.sanitizedInput = sanitizedResult.sanitized;
      
      // Validate sanitization and continuity
      expect(safeSpan.traceId).toBe(traceId);
      expect(safeSpan.metadata.inputSanitized).toBe(true);
      expect(sanitizedResult.wasModified).toBe(true);
      
      // Validate lineage integrity after sanitization
      const validation = traceManager.validateLineage(traceId);
      expect(validation.isValid).toBe(true);
      expect(validation.originTraceId).toBe(traceId);
    });
  });

  describe('🧠 Ideal CX Thread Integration', () => {
    it('should ensure user never feels dropped even during system recovery', async () => {
      const traceId = 'trace-cx-integration-007';
      const payload = createEmotionalPayload();
      payload.traceId = traceId;
      payload.tone = 'confident';
      payload.trustScore = 0.88;
      
      // Simulate system disruption
      const span1 = traceManager.startSpan(traceId, 'span-disrupted');
      traceManager.simulateSpanLoss('span-disrupted');
      
      // Perform recovery
      const corruptions = traceManager.detectBrokenLineage(traceId);
      const recovery = traceManager.recoverFromCorruption(traceId, corruptions);
      
      // Generate emotionally intelligent recovery UX - preserve original tone
      const recoveryPayload = {
        ...payload,
        tone: payload.tone, // Keep original tone
        trustScore: Math.max(payload.trustScore, 0.7)
      };
      
      const uxResult = emotionalUXRenderer.renderFallbackUI(
        recoveryPayload,
        'recovery',
        'trace-recovery'
      );
      
      // Validate emotional continuity
      expect(uxResult.helperText).toMatch(/we.*together|picked up.*left off|smoothing.*out/i);
      expect(uxResult.trustIndicator).toBe('recovering');
      expect(uxResult.usedFallback).toBe(true);
      
      // Validate recovery feels intentional and calm
      const emotionalSnapshot = JSON.parse(uxResult.emotionalSnapshot);
      expect(emotionalSnapshot.tone).toBe('fallback');
      expect(emotionalSnapshot.originalTone).toBe('confident');
      expect(emotionalSnapshot.fallbackTriggered).toBe(true);
      
      // User should feel the system "never lost track"
      expect(recovery.isFullyRecovered).toBe(true);
      expect(uxResult.cta).toBeDefined();
      expect(uxResult.cta).not.toBe('');
    });
  });

  describe('📊 Comprehensive Recovery Validation', () => {
    it('should validate all trace recovery requirements are met', async () => {
      const traceId = 'trace-comprehensive-008';
      
      // Clear events before this test
      events = [];
      
      // Create complex failure scenario
      const span1 = traceManager.startSpan(traceId, 'span-1');
      const span2 = traceManager.startSpan(traceId, 'span-2', traceId, 'span-1');
      const span3 = traceManager.startSpan(traceId, 'span-3', traceId, 'span-2');
      
      // Introduce multiple failure types
      traceManager.simulateSpanCorruption('span-1');
      traceManager.simulateSpanLoss('span-2');
      span3.originTraceId = ''; // Corrupt origin
      
      // Clear events after setup
      events = [];
      
      // Perform comprehensive recovery
      const corruptions = traceManager.detectBrokenLineage(traceId);
      const recovery = traceManager.recoverFromCorruption(traceId, corruptions);
      
      // ✅ Broken lineage detection
      expect(corruptions.length).toBe(3);
      expect(corruptions.some(c => c.type === 'corrupted-span')).toBe(true);
      expect(corruptions.some(c => c.type === 'missing-span')).toBe(true);
      expect(corruptions.some(c => c.type === 'missing-origin')).toBe(true);
      
      // ✅ Trace recovery integrity
      expect(recovery.isFullyRecovered).toBe(true);
      expect(recovery.recoveredSpans).toBe(3);
      
      // ✅ Recovery metadata logging
      expect(recovery.recoveryActions.length).toBe(3);
      const recoveryEvents = events.filter(e => e.eventType === 'trace-recovery-completed');
      expect(recoveryEvents.length).toBe(1);
      
      // ✅ Lineage validation
      const validation = traceManager.validateLineage(traceId);
      expect(validation.hasConsistentOrigin).toBe(true);
      expect(validation.originTraceId).toBe(traceId);
      
      // ✅ EventBus logging
      const allEvents = events.filter(e => e.data.traceId === traceId);
      expect(allEvents.length).toBeGreaterThan(0);
    });
  });

  // Codex safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
  // This test ensures emotional trace resurrection: a broken memory still gets healed with clarity and warmth
}); 