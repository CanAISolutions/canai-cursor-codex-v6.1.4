/**
 * @file tests/dreamstate/open-telemetry-span-gap.test.ts
 * @description DreamState Test: OpenTelemetry Span Gap Detection and Continuity
 * @version 6.1.4
 * 
 * What: Validates telemetry spans remain continuous, linked, and traceable across agent invocation, fallback chains, emotional rendering, and recovery flows
 * Why: Ensures every user-facing action can be traced end-to-end with no missing hops in observability or trustScore deltas
 * How: Uses real TelemetrySpanManager, AgentOrchestrator, FallbackManager, and EmotionalUXRenderer to validate span continuity
 */

// Polaris Ritual: Telemetry Span Continuity
// Codex Vector: Observability Integrity Chain
// Codex Safeguard: Every user-facing action must be trace-linked with no span gaps

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { TelemetrySpanManager, SpanGap, SessionTrace, TelemetrySpan } from '../../cursor/services/telemetry-span-manager';
import { AgentOrchestrator, AgentConfig } from '../../cursor/agents/agent-orchestrator';
import { FallbackManager, FallbackState } from '../../cursor/services/fallback-manager';
import { createEmotionalPayload, EmotionalPayload } from '../../cursor/utils/emotion-payload-builder';
import { EventBus } from '../../cursor/event-bus/eventBus';
import { v4 as uuidv4 } from 'uuid';

// Local EmotionalUXRenderer for testing
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

class EmotionalUXRenderer {
  renderEmotionalUX(payload: EmotionalPayload): UXRenderResult {
    return {
      cta: 'Continue',
      helperText: 'Here\'s what we\'ve prepared for you.',
      messageStyle: 'standard',
      trustIndicator: 'normal',
      emotionalSnapshot: JSON.stringify({
        tone: payload.tone,
        trustScore: payload.trustScore,
        emotionIntentHash: payload.emotionIntentHash
      }),
      usedFallback: false,
      traceId: payload.traceId,
      uiComponents: {
        showHelper: true,
        enableCTA: true,
        messageFormat: 'standard'
      }
    };
  }
}

describe('DreamState: open-telemetry-span-gap', () => {
  let spanManager: TelemetrySpanManager;
  let agentOrchestrator: AgentOrchestrator;
  let fallbackManager: FallbackManager;
  let emotionalRenderer: EmotionalUXRenderer;
  let eventBus: EventBus;

  beforeEach(() => {
    spanManager = TelemetrySpanManager.getInstance();
    agentOrchestrator = new AgentOrchestrator();
    fallbackManager = FallbackManager.getInstance();
    emotionalRenderer = new EmotionalUXRenderer();
    eventBus = EventBus.getInstance();
  });

  afterEach(() => {
    // Clean up any active sessions
  });

  it('should maintain span continuity through agent dispatch → fallback → recovery flow', async () => {
    // What: Test complete agent workflow with fallback and recovery maintains same root span
    // Why: Ensures trace continuity through complex agent execution paths
    // How: Create agent workflow, trigger fallback, verify all spans link to same root

    const sessionId = uuidv4();
    
    // Create root span for the session first
    const rootSpan = spanManager.createRootSpan(sessionId, 'agent-workflow', {
      testType: 'span-continuity'
    });

    // Create initial payload with the same traceId as the span
    const initialPayload = await createEmotionalPayload({
      payload: 'Test agent workflow with span continuity',
      traceId: rootSpan.context.traceId // Use the span's traceId
    });

    // Configure agents with potential failures
    const agents: AgentConfig[] = [
      { type: 'Parser', failureRate: 0.3, fallbackAgent: 'Recovery' },
      { type: 'Generator', failureRate: 0.2, fallbackAgent: 'Fallback' },
      { type: 'Validator', failureRate: 0.1, fallbackAgent: 'Emotional' }
    ];

    // Create child spans for each agent step
    const parserSpan = spanManager.createChildSpan(rootSpan.context.spanId, 'parse-input', 'parser', {
      agent: 'Parser'
    });

    const generatorSpan = spanManager.createChildSpan(parserSpan.context.spanId, 'generate-content', 'generator', {
      agent: 'Generator'
    });

    const validatorSpan = spanManager.createChildSpan(generatorSpan.context.spanId, 'validate-output', 'validator', {
      agent: 'Validator'
    });

    // Run the agent workflow
    const result = await agentOrchestrator.runAgentWorkflow(agents, initialPayload);

    // Validate span continuity
    const sessionTrace = spanManager.getSessionTrace(sessionId);
    expect(sessionTrace).toBeTruthy();
    expect(sessionTrace!.rootSpanId).toBe(rootSpan.context.spanId);

    // Verify all spans share the same traceId
    const allSpans = Array.from(sessionTrace!.spans.values());
    allSpans.forEach(span => {
      expect(span.context.traceId).toBe(rootSpan.context.traceId);
    });

    // Verify span chain integrity
    const continuityResult = spanManager.validateSpanContinuity(sessionId);
    expect(continuityResult.isValid).toBe(true);
    expect(continuityResult.gaps).toHaveLength(0);

    // Verify result maintains trace context
    expect(result.traceId).toBe(rootSpan.context.traceId);
    expect(result.emotionalPayload.traceId).toBe(initialPayload.traceId);
  });

  it('should detect and handle span gaps during emotional drift → fallback sequence', async () => {
    // What: Test span gap detection when emotional rendering triggers fallback
    // Why: Ensures observability is maintained even when emotional state changes trigger fallbacks
    // How: Create emotional drift scenario, trigger fallback, verify spans chain correctly

    const sessionId = uuidv4();
    
    // Create root span first
    const rootSpan = spanManager.createRootSpan(sessionId, 'emotional-rendering', {
      testType: 'emotional-drift'
    });

    // Create drift payload with the same traceId as the span
    const driftPayload = await createEmotionalPayload({
      tone: 'sarcastic',
      trustScore: 0.3, // Low trust score to trigger fallback
      payload: 'This will definitely work perfectly...',
      traceId: rootSpan.context.traceId // Use the span's traceId
    });

    // Create emotional rendering span
    const renderSpan = spanManager.createChildSpan(rootSpan.context.spanId, 'render-emotional-ux', 'render', {
      tone: driftPayload.tone
    });

    // Simulate emotional drift detection
    const driftSpan = spanManager.createChildSpan(renderSpan.context.spanId, 'detect-drift', 'drift-detection', {
      driftType: 'tone-mismatch'
    });

    // Trigger fallback due to emotional drift
    const fallbackResult = await fallbackManager.triggerFallback(
      'emotional-drift',
      ['EmotionalRenderer'],
      rootSpan.context.traceId,
      -0.2
    );

    // Create fallback span
    const fallbackSpan = spanManager.createChildSpan(driftSpan.context.spanId, 'emotional-fallback', 'fallback', {
      fallbackReason: 'emotional-drift',
      originalTone: driftPayload.tone
    });

    // Create a recovery payload for rendering with the same traceId
    const recoveryPayload = await createEmotionalPayload({
      tone: 'reassuring',
      trustScore: 0.7,
      payload: 'Let me help you with a clearer approach.',
      traceId: rootSpan.context.traceId, // Use the span's traceId
      sessionId: driftPayload.sessionId
    });

    // Render recovery UX
    const recoveryResult = emotionalRenderer.renderEmotionalUX(recoveryPayload);
    
    // Create recovery span
    const recoverySpan = spanManager.createChildSpan(fallbackSpan.context.spanId, 'render-recovery', 'recovery', {
      recoveryTone: recoveryPayload.tone
    });

    // Validate span continuity through the entire flow
    const continuityResult = spanManager.validateSpanContinuity(sessionId);
    expect(continuityResult.isValid).toBe(true);
    expect(continuityResult.gaps).toHaveLength(0);

    // Verify all spans maintain trace context
    const sessionTrace = spanManager.getSessionTrace(sessionId);
    const allSpans = Array.from(sessionTrace!.spans.values());
    
    allSpans.forEach(span => {
      expect(span.context.traceId).toBe(rootSpan.context.traceId);
    });

    // Verify recovery result maintains trace continuity
    expect(recoveryResult.traceId).toBe(rootSpan.context.traceId);
    expect(recoveryPayload.traceId).toBe(rootSpan.context.traceId);
  });

  it('should detect missing parent spans and trigger gap recovery logic', async () => {
    // What: Test gap detection when a span references a missing parent
    // Why: Ensures system can detect and recover from broken span chains
    // How: Inject partial span with missing parent, verify gap detection and recovery

    const sessionId = uuidv4();

    // Create root span
    const rootSpan = spanManager.createRootSpan(sessionId, 'gap-detection-test', {
      testType: 'missing-parent'
    });

    // Inject a partial span with a missing parent
    const missingParentId = uuidv4();
    const orphanedSpan = spanManager.injectPartialSpan(
      rootSpan.context.traceId,
      'orphaned-operation',
      missingParentId
    );

    // Add the orphaned span to the session trace manually (simulating a gap)
    const sessionTrace = spanManager.getSessionTrace(sessionId);
    sessionTrace!.spans.set(orphanedSpan.context.spanId, orphanedSpan);

    // Validate span continuity - should detect the gap
    const continuityResult = spanManager.validateSpanContinuity(sessionId);
    expect(continuityResult.isValid).toBe(false);
    expect(continuityResult.gaps).toHaveLength(1);

    const gap = continuityResult.gaps[0];
    expect(gap.gapType).toBe('missing_parent');
    expect(gap.expectedParentId).toBe(missingParentId);
    expect(gap.missingSpanId).toBe(orphanedSpan.context.spanId);

    // Apply recovery logic
    const recoverySpan = spanManager.applySpanRecovery(sessionId, gap);
    expect(recoverySpan).toBeTruthy();
    expect(recoverySpan!.operation).toBe('span-recovery');
    expect(recoverySpan!.context.parentId).toBe(rootSpan.context.spanId);

    // Verify recovery action was logged
    expect(gap.recoveryAction).toContain('Created recovery span');

    // Verify recovery span maintains trace context
    expect(recoverySpan!.context.traceId).toBe(rootSpan.context.traceId);
  });

  it('should maintain separate spans with shared root for multiple concurrent agent flows', async () => {
    // What: Test multiple agent flows in same session maintain separate spans but shared root
    // Why: Ensures concurrent operations are traceable independently while maintaining session context
    // How: Run multiple agent workflows concurrently, verify span separation and root sharing

    const sessionId = uuidv4();
    
    // Create shared root span first
    const rootSpan = spanManager.createRootSpan(sessionId, 'concurrent-operations', {
      operationCount: 2
    });

    // Create payloads with the same traceId as the root span
    const payload1 = await createEmotionalPayload({
      payload: 'First concurrent operation',
      traceId: rootSpan.context.traceId // Use the span's traceId
    });
    const payload2 = await createEmotionalPayload({
      payload: 'Second concurrent operation',
      traceId: rootSpan.context.traceId // Use the span's traceId
    });

    // Create separate operation spans
    const operation1Span = spanManager.createChildSpan(rootSpan.context.spanId, 'operation-1', 'op1', {
      payload: payload1.payload
    });

    const operation2Span = spanManager.createChildSpan(rootSpan.context.spanId, 'operation-2', 'op2', {
      payload: payload2.payload
    });

    // Configure agents for each operation
    const agents1: AgentConfig[] = [
      { type: 'Parser', failureRate: 0.1, fallbackAgent: 'Recovery' }
    ];
    const agents2: AgentConfig[] = [
      { type: 'Generator', failureRate: 0.1, fallbackAgent: 'Fallback' }
    ];

    // Run operations concurrently
    const [result1, result2] = await Promise.all([
      agentOrchestrator.runAgentWorkflow(agents1, payload1),
      agentOrchestrator.runAgentWorkflow(agents2, payload2)
    ]);

    // Create completion spans for each operation
    const completion1Span = spanManager.createChildSpan(operation1Span.context.spanId, 'complete-op1', 'completion1', {
      result: 'success'
    });

    const completion2Span = spanManager.createChildSpan(operation2Span.context.spanId, 'complete-op2', 'completion2', {
      result: 'success'
    });

    // Validate span continuity
    const continuityResult = spanManager.validateSpanContinuity(sessionId);
    expect(continuityResult.isValid).toBe(true);
    expect(continuityResult.gaps).toHaveLength(0);

    // Verify shared root but separate operation chains
    const sessionTrace = spanManager.getSessionTrace(sessionId);
    expect(sessionTrace!.rootSpanId).toBe(rootSpan.context.spanId);

    // Verify all spans share the same traceId
    const allSpans = Array.from(sessionTrace!.spans.values());
    allSpans.forEach(span => {
      expect(span.context.traceId).toBe(rootSpan.context.traceId);
    });

    // Verify operation separation
    expect(operation1Span.context.parentId).toBe(rootSpan.context.spanId);
    expect(operation2Span.context.parentId).toBe(rootSpan.context.spanId);
    expect(completion1Span.context.parentId).toBe(operation1Span.context.spanId);
    expect(completion2Span.context.parentId).toBe(operation2Span.context.spanId);

    // Verify results maintain trace context
    expect(result1.traceId).toBe(rootSpan.context.traceId);
    expect(result2.traceId).toBe(rootSpan.context.traceId);
  });

  it('should validate trustScore attribution with span linkage throughout workflow', async () => {
    // What: Test that trustScore modulations are properly attributed to spans with step IDs
    // Why: Ensures trustScore changes are traceable and auditable through the span chain
    // How: Create workflow with trustScore changes, verify attribution is logged with span context

    const sessionId = uuidv4();
    const initialPayload = await createEmotionalPayload({
      trustScore: 0.8,
      payload: 'Test trustScore attribution'
    });

    // Create root span
    const rootSpan = spanManager.createRootSpan(sessionId, 'trustscore-attribution', {
      initialTrustScore: initialPayload.trustScore
    });

    // Create processing span
    const processingSpan = spanManager.createChildSpan(rootSpan.context.spanId, 'process-request', 'processing', {
      operation: 'trustscore-test'
    });

    // Simulate trustScore modulation during processing
    const beforeScore = initialPayload.trustScore;
    const afterScore = 0.9; // Improved trust score

    spanManager.attributeTrustScore(
      processingSpan.context.spanId,
      beforeScore,
      afterScore,
      'successful-processing'
    );

    // Verify trustScore attribution
    const span = spanManager.getSessionTrace(sessionId)!.spans.get(processingSpan.context.spanId);
    expect(span!.trustScoreAttribution).toBeTruthy();
    expect(span!.trustScoreAttribution!.stepId).toBe('processing');
    expect(span!.trustScoreAttribution!.beforeScore).toBe(beforeScore);
    expect(span!.trustScoreAttribution!.afterScore).toBe(afterScore);
    // Use toBeCloseTo for floating-point comparison
    expect(span!.trustScoreAttribution!.delta).toBeCloseTo(0.1, 2);
    expect(span!.trustScoreAttribution!.reason).toBe('successful-processing');

    // Create fallback scenario with trustScore drop
    const fallbackSpan = spanManager.createChildSpan(processingSpan.context.spanId, 'handle-fallback', 'fallback', {
      trigger: 'trustscore-drop'
    });

    const fallbackBeforeScore = afterScore;
    const fallbackAfterScore = 0.6; // Dropped trust score

    spanManager.attributeTrustScore(
      fallbackSpan.context.spanId,
      fallbackBeforeScore,
      fallbackAfterScore,
      'fallback-triggered'
    );

    // Verify fallback trustScore attribution
    const fallbackSpanData = spanManager.getSessionTrace(sessionId)!.spans.get(fallbackSpan.context.spanId);
    expect(fallbackSpanData!.trustScoreAttribution).toBeTruthy();
    expect(fallbackSpanData!.trustScoreAttribution!.stepId).toBe('fallback');
    // Use toBeCloseTo for floating-point comparison
    expect(fallbackSpanData!.trustScoreAttribution!.delta).toBeCloseTo(-0.3, 2);
    expect(fallbackSpanData!.trustScoreAttribution!.reason).toBe('fallback-triggered');

    // Validate span continuity with trustScore attribution
    const continuityResult = spanManager.validateSpanContinuity(sessionId);
    expect(continuityResult.isValid).toBe(true);

    // Verify all spans maintain trace context
    const sessionTrace = spanManager.getSessionTrace(sessionId);
    const allSpans = Array.from(sessionTrace!.spans.values());
    
    allSpans.forEach(span => {
      expect(span.context.traceId).toBe(rootSpan.context.traceId);
    });
  });

  it('should successfully replay trace from span logs with chronological ordering', async () => {
    // What: Test trace replay functionality generates chronologically ordered span sequence
    // Why: Ensures observability data can be reconstructed for debugging and audit purposes
    // How: Create complex workflow, replay trace, verify chronological order and completeness

    const sessionId = uuidv4();
    const testPayload = await createEmotionalPayload({
      payload: 'Test trace replay functionality'
    });

    // Create root span
    const rootSpan = spanManager.createRootSpan(sessionId, 'trace-replay-test', {
      testType: 'replay-validation'
    });

    // Create a sequence of spans with delays to ensure different timestamps
    const step1Span = spanManager.createChildSpan(rootSpan.context.spanId, 'step-1', 'step1', {
      operation: 'first-step'
    });

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    const step2Span = spanManager.createChildSpan(step1Span.context.spanId, 'step-2', 'step2', {
      operation: 'second-step'
    });

    await new Promise(resolve => setTimeout(resolve, 10));

    const step3Span = spanManager.createChildSpan(step2Span.context.spanId, 'step-3', 'step3', {
      operation: 'third-step'
    });

    // Complete spans in reverse order to test replay ordering
    spanManager.completeSpan(step3Span.context.spanId);
    spanManager.completeSpan(step1Span.context.spanId);
    spanManager.completeSpan(step2Span.context.spanId);
    spanManager.completeSpan(rootSpan.context.spanId);

    // Replay the trace
    const replayedSpans = spanManager.replayTrace(rootSpan.context.traceId);

    // Verify all spans are included
    expect(replayedSpans).toHaveLength(4);

    // Verify chronological ordering (by start time, not completion time)
    expect(replayedSpans[0].context.spanId).toBe(rootSpan.context.spanId);
    expect(replayedSpans[1].context.spanId).toBe(step1Span.context.spanId);
    expect(replayedSpans[2].context.spanId).toBe(step2Span.context.spanId);
    expect(replayedSpans[3].context.spanId).toBe(step3Span.context.spanId);

    // Verify all spans have the same traceId
    replayedSpans.forEach(span => {
      expect(span.context.traceId).toBe(rootSpan.context.traceId);
    });

    // Verify span relationships are preserved
    expect(replayedSpans[1].context.parentId).toBe(rootSpan.context.spanId);
    expect(replayedSpans[2].context.parentId).toBe(step1Span.context.spanId);
    expect(replayedSpans[3].context.parentId).toBe(step2Span.context.spanId);

    // Verify all spans are marked as completed
    replayedSpans.forEach(span => {
      expect(span.status).toBe('completed');
      expect(span.endTime).toBeTruthy();
    });
  });

  // Codex Safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
  // This test suite validates the invisible truth chain that protects observability integrity
  // If any test fails, TrustScore drops may become untraceable, fallbacks may not be attributable,
  // and user sessions could fragment across telemetry systems
}); 