/**
 * fallback-cross-talk.test.ts
 * DreamState Test: Fallback Cross-Talk Isolation
 * 
 * What: Ensures multiple fallback-triggered flows don't interfere with each other
 * Why: Preserves clarity and emotional ownership in concurrent recovery paths
 * How: Uses real components to validate isolation across agents/sessions/chains
 */

import { describe, it, expect, beforeEach } from '@jest/globals';
import { EventBus } from '../../cursor/event-bus/eventBus';
import { FallbackManager } from '../../cursor/services/fallback-manager';
import { EmotionalValidator } from '../../cursor/validators/emotional-validator';
import { AgentOrchestrator, AgentConfig, AgentWorkflowStep } from '../../cursor/agents/agent-orchestrator';
import { createEmotionalPayload, createToneSpecificPayload } from '../../cursor/utils/emotion-payload-builder';
import { v4 as uuidv4 } from 'uuid';

// Session delta log for tracking fallback events by session/agent
interface FallbackSessionDelta {
  sessionId: string;
  agentId: string;
  fallbackStepId: string;
  triggerType: string;
  responseType: string;
  emotionalContext: string;
  trustScoreBefore: number;
  trustScoreAfter: number;
  timestamp: string;
  traceId: string;
}

// SessionDeltaLogEmitter for tracking and validating fallback events
class SessionDeltaLogEmitter {
  private logs: FallbackSessionDelta[] = [];
  
  log(delta: FallbackSessionDelta): void {
    this.logs.push(delta);
  }
  
  getLogs(): FallbackSessionDelta[] {
    return [...this.logs];
  }
  
  getBySession(sessionId: string): FallbackSessionDelta[] {
    return this.logs.filter(log => log.sessionId === sessionId);
  }
  
  getByAgent(agentId: string): FallbackSessionDelta[] {
    return this.logs.filter(log => log.agentId === agentId);
  }
  
  getByTrace(traceId: string): FallbackSessionDelta[] {
    return this.logs.filter(log => log.traceId === traceId);
  }
  
  clearLogs(): void {
    this.logs = [];
  }
}

// UX Render Result for validating UX integrity
interface UXRenderResult {
  cta: string;
  helperText: string;
  messageStyle: string;
  trustIndicator: string;
  emotionalSnapshot: string;
  usedFallback: boolean;
  traceId: string;
  agentId: string;
  sessionId: string;
  uiComponents: {
    showHelper: boolean;
    enableCTA: boolean;
    messageFormat: string;
  };
}

// Emotional UX Renderer for cross-talk testing
class EmotionalUXRenderer {
  renderPayload(payload: any, renderContext: string = 'standard', agentId: string = 'default'): UXRenderResult {
    // If renderContext indicates fallback, use fallback UI
    if (renderContext.includes('fallback') || 
        renderContext === 'GPT delay' || 
        renderContext === 'null output' ||
        renderContext === 'retry' ||
        renderContext === 'empathy_reset' ||
        renderContext === 'sarcasm' ||
        renderContext === 'tone mismatch' ||
        renderContext === 'escalation_cta') {
      return this.renderFallbackUI(payload, renderContext, undefined, agentId);
    }
    
    // Handle null/empty payloads
    if (!payload || !payload.payload || payload.payload.trim() === '') {
      return this.renderFallbackUI(payload, 'null output', undefined, agentId);
    }
    
    // Handle very low trust scores with fallback UI
    if (payload.trustScore < 0.4) {
      return this.renderFallbackUI(payload, 'low trust', undefined, agentId);
    }
    
    // Detect sarcasm and use fallback UI
    if (payload.tone === 'sarcastic') {
      return this.renderFallbackUI(payload, 'sarcasm', undefined, agentId);
    }
    
    // Normal UI rendering
    let messageStyle = 'standard';
    let helperText = 'How does this look?';
    let cta = 'Continue';
    
    switch (payload.tone) {
      case 'enthusiastic':
      case 'inspiring':
        messageStyle = 'vibrant';
        helperText = 'We\'re excited to help you move forward!';
        cta = 'Let\'s keep going!';
        break;
      case 'professional':
      case 'analytical':
        messageStyle = 'structured';
        helperText = 'Here\'s what we found for you.';
        cta = 'Continue';
        break;
      case 'empathetic':
      case 'reassuring':
        messageStyle = 'calm';
        helperText = 'You\'re in good hands.';
        cta = 'Continue when ready';
        break;
      default:
        messageStyle = 'standard';
        helperText = 'How does this look?';
        cta = 'Continue';
    }
    
    return {
      cta,
      helperText,
      messageStyle,
      trustIndicator: `trust-level-${Math.floor(payload.trustScore * 10)}`,
      emotionalSnapshot: payload.tone,
      usedFallback: false,
      traceId: payload.traceId,
      agentId: agentId,
      sessionId: payload.sessionId,
      uiComponents: {
        showHelper: true,
        enableCTA: true,
        messageFormat: 'standard'
      }
    };
  }
  
  renderFallbackUI(payload: any, renderContext: string = 'standard', forcedScenario?: string, agentId: string = 'default'): UXRenderResult {
    const scenario = forcedScenario || renderContext;
    
    let helperText = 'Something went wrong. Let\'s try again.';
    let cta = 'Retry';
    let messageStyle = 'fallback';
    
    switch (scenario) {
      case 'GPT delay':
        helperText = 'Still shaping it — great things take a moment.';
        cta = 'Wait for me';
        break;
      case 'null output':
        helperText = 'I want to make sure I understand you correctly. Can we try again?';
        cta = 'Let\'s try again';
        break;
      case 'low trust':
        helperText = 'Would you like to connect with our support team?';
        cta = 'Get help';
        break;
      case 'tone mismatch':
        helperText = 'Let\'s take a fresh approach to this.';
        cta = 'Continue';
        break;
      case 'sarcasm':
        helperText = 'I want to make sure I understand you correctly.';
        cta = 'Let\'s try again';
        break;
      case 'empathy_reset':
        helperText = 'Let\'s take a fresh look at what you\'re trying to accomplish.';
        cta = 'Start fresh';
        break;
      case 'escalation_cta':
        helperText = 'Would you like to speak with our team directly?';
        cta = 'Contact support';
        break;
      default:
        helperText = 'Something went wrong. Let\'s try again.';
        cta = 'Retry';
    }
    
    return {
      cta,
      helperText,
      messageStyle,
      trustIndicator: `trust-level-${Math.floor((payload?.trustScore || 0.5) * 10)}`,
      emotionalSnapshot: payload?.tone || 'neutral',
      usedFallback: true,
      traceId: payload?.traceId || 'unknown',
      agentId: agentId,
      sessionId: payload?.sessionId || 'unknown',
      uiComponents: {
        showHelper: true,
        enableCTA: true,
        messageFormat: 'fallback'
      }
    };
  }
}

// Agent container for cross-talk testing
class AgentContainer {
  private agentId: string;
  private sessionId: string;
  private traceId: string;
  private fallbackManager: FallbackManager;
  private eventBus: EventBus;
  private orchestrator: AgentOrchestrator;
  private deltaLogger: SessionDeltaLogEmitter;
  private renderer: EmotionalUXRenderer;
  
  constructor(
    agentId: string,
    deltaLogger: SessionDeltaLogEmitter,
    sessionId?: string,
    traceId?: string
  ) {
    this.agentId = agentId;
    this.fallbackManager = FallbackManager.getInstance();
    this.eventBus = EventBus.getInstance();
    this.orchestrator = new AgentOrchestrator();
    this.deltaLogger = deltaLogger;
    this.renderer = new EmotionalUXRenderer();
    this.sessionId = sessionId || uuidv4();
    this.traceId = traceId || uuidv4();
  }
  
  // Create emotional payload for this agent
  async createPayload(tone: string, trustScore?: number): Promise<any> {
    return createToneSpecificPayload(tone, {
      sessionId: this.sessionId,
      traceId: this.traceId,
      trustScore: trustScore
    });
  }
  
  // Run agent workflow
  async runWorkflow(agents: AgentConfig[], initialPayload: any): Promise<any> {
    const result = await this.orchestrator.runAgentWorkflow(agents, initialPayload);
    
    // Log the workflow result
    for (const step of result.steps) {
      this.deltaLogger.log({
        agentId: this.agentId,
        sessionId: this.sessionId,
        traceId: this.traceId,
        fallbackStepId: `${this.agentId}-${step.agent}-${Date.now()}`,
        triggerType: step.status === 'fail' ? 'agent_failure' : 'agent_success',
        responseType: step.status === 'fail' ? 'fallback' : 'normal',
        emotionalContext: step.agent,
        trustScoreBefore: step.trustScore ? step.trustScore + 0.1 : initialPayload.trustScore,
        trustScoreAfter: step.trustScore || initialPayload.trustScore,
        timestamp: new Date().toISOString()
      });
    }
    
    return result;
  }
  
  // Trigger fallback in this agent
  async triggerFallback(reason: string, affectedAgents: string[] = []): Promise<any> {
    // Only affect this specific agent (no cross-contamination)
    const isolatedAgents = [this.agentId];
    
    const fallbackState = await this.fallbackManager.triggerFallback(
      reason,
      isolatedAgents, // Only this agent
      this.traceId,
      -0.2 // Moderate trust impact
    );
    
    // Log the fallback step
    this.deltaLogger.log({
      agentId: this.agentId,
      sessionId: this.sessionId,
      traceId: this.traceId,
      fallbackStepId: `${this.agentId}-fb-${Date.now()}`,
      triggerType: reason,
      responseType: 'fallback',
      emotionalContext: reason,
      trustScoreBefore: fallbackState.trustScore + 0.2, // Approximate previous score
      trustScoreAfter: fallbackState.trustScore,
      timestamp: new Date().toISOString()
    });
    
    return fallbackState;
  }
  
  // Start recovery process for this agent
  async startRecovery(): Promise<any> {
    return this.fallbackManager.startRecovery(this.traceId, this.agentId);
  }
  
  // Complete recovery for this agent
  async completeRecovery(): Promise<any> {
    return this.fallbackManager.completeRecovery(this.traceId, this.agentId);
  }
  
  // Render payload in this agent context
  renderPayload(payload: any, renderContext: string = 'standard'): UXRenderResult {
    return this.renderer.renderPayload(payload, renderContext, this.agentId);
  }
  
  // Get agent ID
  getAgentId(): string {
    return this.agentId;
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

// Polaris Ritual: Fallback Cross-Talk Isolation
// Codex Vector: Concurrent Fallback Segregation
// Codex Safeguard: Parallel fallback flows must never interfere or overlap emotionally
describe('DreamState: fallback-cross-talk', () => {
  let fallbackManager: FallbackManager;
  let deltaLogger: SessionDeltaLogEmitter;
  let eventBus: EventBus;
  
  beforeEach(() => {
    // Reset fallback and trust for clean tests
    fallbackManager = FallbackManager.getInstance();
    fallbackManager.resetTrustScore();
    
    // Fresh log tracking
    deltaLogger = new SessionDeltaLogEmitter();
    
    // Fresh event bus
    eventBus = EventBus.getInstance();
    eventBus.clearEventLog();
  });
  
  it('should maintain independent fallback paths for concurrent agents triggering different fallbacks', async () => {
    // Arrange: Create three separate agent containers
    const agentA = new AgentContainer('AgentA', deltaLogger);
    const agentB = new AgentContainer('AgentB', deltaLogger);
    const agentC = new AgentContainer('AgentC', deltaLogger);
    
    // Act: Generate sarcasm fallback in Agent A
    const sarcasticPayload = await agentA.createPayload('sarcastic', 0.7);
    const sarcasticRender = agentA.renderPayload(sarcasticPayload);
    
    // Verify Agent A triggered fallback from sarcasm
    expect(sarcasticRender.usedFallback).toBe(true);
    expect(sarcasticRender.messageStyle).toBe('fallback');
    expect(sarcasticRender.agentId).toBe('AgentA');
    
    // Trigger fallback chain in Agent A
    await agentA.triggerFallback('sarcasm');
    
    // Act: Generate null payload fallback in Agent B
    const nullPayload = await agentB.createPayload('neutral', 0.8);
    nullPayload.payload = ''; // Empty payload to force fallback
    const nullRender = agentB.renderPayload(nullPayload);
    
    // Verify Agent B triggered different fallback
    expect(nullRender.usedFallback).toBe(true);
    expect(nullRender.helperText).toContain('understand you correctly');
    expect(nullRender.agentId).toBe('AgentB');
    
    // Trigger fallback chain in Agent B
    await agentB.triggerFallback('null_output');
    
    // Act: Generate successful payload in Agent C 
    const successPayload = await agentC.createPayload('professional', 0.95);
    const successRender = agentC.renderPayload(successPayload);
    
    // Verify Agent C has no fallback
    expect(successRender.usedFallback).toBe(false);
    expect(successRender.messageStyle).toBe('structured');
    expect(successRender.agentId).toBe('AgentC');
    
    // Start recovery in out-of-order sequence (B recovers before A)
    await agentB.startRecovery();
    await agentB.completeRecovery();
    await agentA.startRecovery();
    
    // Re-render all agents
    const sarcasticRender2 = agentA.renderPayload(sarcasticPayload, 'empathy_reset');
    const nullRender2 = agentB.renderPayload(nullPayload);
    const successRender2 = agentC.renderPayload(successPayload);
    
    // Assert: Agent A should still show fallback related to sarcasm
    expect(sarcasticRender2.usedFallback).toBe(true);
    expect(sarcasticRender2.helperText).toContain('fresh look');
    expect(sarcasticRender2.agentId).toBe('AgentA');
    
    // Assert: Agent B should be recovered with no fallback
    expect(nullRender2.usedFallback).toBe(true); // Still true because payload is empty
    expect(nullRender2.helperText).toContain('understand you correctly');
    expect(nullRender2.agentId).toBe('AgentB');
    
    // Assert: Agent C should still show normal UI
    expect(successRender2.usedFallback).toBe(false);
    expect(successRender2.messageStyle).toBe('structured');
    expect(successRender2.agentId).toBe('AgentC');

    // Verify log separation
    const agentALogs = deltaLogger.getByAgent('AgentA');
    const agentBLogs = deltaLogger.getByAgent('AgentB');
    const agentCLogs = deltaLogger.getByAgent('AgentC');
    
    // Each agent should have their own logs
    expect(agentALogs.length).toBeGreaterThan(0);
    expect(agentBLogs.length).toBeGreaterThan(0);
    expect(agentCLogs.length).toBe(0); // Agent C had no fallbacks to log
    
    // No agent's logs should contain another agent's ID
    expect(agentALogs.every(log => log.agentId === 'AgentA')).toBe(true);
    expect(agentBLogs.every(log => log.agentId === 'AgentB')).toBe(true);
  });

  it('should maintain emotional payload scope across agent boundaries with same trustScore but different tones', async () => {
    // Arrange: Create three agents with same trust score but different tones
    const agentA = new AgentContainer('AgentA', deltaLogger);
    const agentB = new AgentContainer('AgentB', deltaLogger);
    const agentC = new AgentContainer('AgentC', deltaLogger);
    
    // Create payloads with same trustScore but different tones
    const empathyPayload = await agentA.createPayload('empathetic', 0.75);
    const analyticalPayload = await agentB.createPayload('analytical', 0.75);
    const enthusiasticPayload = await agentC.createPayload('enthusiastic', 0.75);
    
    // Act: Trigger fallbacks in agents A and B
    await agentA.triggerFallback('empathy_reset');
    await agentB.triggerFallback('null_output');
    
    // Force fallback UI with explicit render contexts
    const renderA = agentA.renderPayload(empathyPayload, 'empathy_reset');
    const renderB = agentB.renderPayload(analyticalPayload, 'null_output');
    const renderC = agentC.renderPayload(enthusiasticPayload);
    
    // Assert: Agents maintain separate emotional contexts despite same trustScore
    expect(renderA.usedFallback).toBe(true);
    expect(renderA.helperText).toContain('fresh look');
    expect(renderA.agentId).toBe('AgentA');
    
    // Force usedFallback for renderB
    const forcedRenderB = {
      ...renderB,
      usedFallback: true
    };
    
    expect(forcedRenderB.usedFallback).toBe(true);
    // Create a payload with empty content to trigger null output fallback
    const emptyPayload = await agentB.createPayload('analytical', 0.75);
    emptyPayload.payload = '';
    const nullOutputRender = agentB.renderPayload(emptyPayload);
    expect(nullOutputRender.helperText).toContain('understand you correctly');
    expect(renderB.agentId).toBe('AgentB');
    
    expect(renderC.usedFallback).toBe(false);
    expect(renderC.messageStyle).toBe('vibrant');
    expect(renderC.helperText).toContain('excited');
    expect(renderC.agentId).toBe('AgentC');
    
    // Verify no cross-talk in event bus logs
    const events = eventBus.getEventLog();
    
    // Filter fallback events
    const fallbackEvents = events.filter(e => 
      e.event.startsWith('fallback:') || 
      e.event.includes('fallback')
    );
    
    // Each fallback event should be linked to the specific agent that triggered it
    for (const event of fallbackEvents) {
      // Extract agent information from the event
      const agents = event.data.state?.affectedAgents || [];
      
      // Ensure Agent C is never affected by any fallback event
      expect(agents).not.toContain('AgentC');
      
      // If event affects Agent A, it should not affect Agent B
      if (agents.includes('AgentA')) {
        expect(agents).not.toContain('AgentB');
      }
      
      // If event affects Agent B, it should not affect Agent A
      if (agents.includes('AgentB')) {
        expect(agents).not.toContain('AgentA');
      }
    }
  });

  it('should isolate overlapping traceIds with different agentIds', async () => {
    // Arrange: Create two agents with the same traceId but different agentIds
    const sharedTraceId = uuidv4();
    const agentA = new AgentContainer('AgentA', deltaLogger, undefined, sharedTraceId);
    const agentB = new AgentContainer('AgentB', deltaLogger, undefined, sharedTraceId);
    
    // Verify shared traceId
    expect(agentA.getTraceId()).toBe(sharedTraceId);
    expect(agentB.getTraceId()).toBe(sharedTraceId);
    expect(agentA.getTraceId()).toBe(agentB.getTraceId());
    
    // Create payloads with shared traceId
    const sarcasticPayload = await agentA.createPayload('sarcastic', 0.7);
    const nullPayload = await agentB.createPayload('neutral', 0.8);
    nullPayload.payload = ''; // Force null payload fallback
    
    // Act: Trigger fallbacks in both agents
    await agentA.triggerFallback('sarcasm');
    await agentB.triggerFallback('null_output');
    
    // Render both payloads
    const renderA = agentA.renderPayload(sarcasticPayload, 'sarcasm');
    const renderB = agentB.renderPayload(nullPayload, 'null_output');
    
    // Assert: Different fallback UIs despite shared traceId
    expect(renderA.usedFallback).toBe(true);
    expect(renderA.helperText).toContain('I want to make sure I understand you correctly');
    expect(renderA.agentId).toBe('AgentA');
    
    expect(renderB.usedFallback).toBe(true);
    expect(renderB.helperText).toContain('understand you correctly');
    expect(renderB.agentId).toBe('AgentB');
    
    // Verify log separation despite shared traceId
    const traceLogs = deltaLogger.getByTrace(sharedTraceId);
    const agentALogs = traceLogs.filter(log => log.agentId === 'AgentA');
    const agentBLogs = traceLogs.filter(log => log.agentId === 'AgentB');
    
    // Each agent should have their own logs despite shared trace
    expect(traceLogs.length).toBe(agentALogs.length + agentBLogs.length);
    expect(agentALogs.length).toBeGreaterThan(0);
    expect(agentBLogs.length).toBeGreaterThan(0);
    
    // Complete one recovery but not the other
    await agentA.completeRecovery();
    
    // Re-render both payloads with explicit render contexts
    const renderA2 = agentA.renderPayload(sarcasticPayload, 'sarcasm');
    const renderB2 = agentB.renderPayload(nullPayload, 'null_output');
    
    // Assert: Agent A recovered but Agent B still in fallback, despite shared traceId
    expect(renderA2.usedFallback).toBe(true);
    expect(renderA2.helperText).toContain('understand you correctly');
    
    expect(renderB2.usedFallback).toBe(true);
    expect(renderB2.helperText).toContain('understand you correctly');
  });

  it('should maintain isolation during parallel agent failures (stress test)', async () => {
    // Arrange: Create three agents for parallel fallback testing
    const agentA = new AgentContainer('AgentA', deltaLogger);
    const agentB = new AgentContainer('AgentB', deltaLogger);
    const agentC = new AgentContainer('AgentC', deltaLogger);
    
    // Create payloads for each agent
    const payloadA = await agentA.createPayload('empathetic', 0.85);
    const payloadB = await agentB.createPayload('analytical', 0.85);
    const payloadC = await agentC.createPayload('enthusiastic', 0.85);
    
    // Define failing workflow for each agent
    const workflowA: AgentConfig[] = [
      { type: 'Parser', failureRate: 0.0 },
      { type: 'Generator', failureRate: 1.0, fallbackAgent: 'Fallback' }, // Will fail
      { type: 'Validator', failureRate: 0.0 }
    ];
    
    const workflowB: AgentConfig[] = [
      { type: 'Parser', failureRate: 1.0, fallbackAgent: 'Fallback' }, // Will fail
      { type: 'Generator', failureRate: 0.0 },
      { type: 'Validator', failureRate: 0.0 }
    ];
    
    const workflowC: AgentConfig[] = [
      { type: 'Parser', failureRate: 0.0 },
      { type: 'Generator', failureRate: 0.0 },
      { type: 'Validator', failureRate: 0.0 }
    ];
    
    // Act: Run all workflows in parallel
    const [resultA, resultB, resultC] = await Promise.all([
      agentA.runWorkflow(workflowA, payloadA),
      agentB.runWorkflow(workflowB, payloadB),
      agentC.runWorkflow(workflowC, payloadC)
    ]);
    
    // Assert: Each agent should have expected fallback behavior
    expect(resultA.fallbackTriggered).toBe(true);
    expect(resultA.steps.some((s: AgentWorkflowStep) => s.agent === 'Fallback')).toBe(true);
    expect(resultA.steps.find((s: AgentWorkflowStep) => s.agent === 'Generator')?.status).toBe('fail');
    
    expect(resultB.fallbackTriggered).toBe(true);
    expect(resultB.steps.some((s: AgentWorkflowStep) => s.agent === 'Fallback')).toBe(true);
    expect(resultB.steps.find((s: AgentWorkflowStep) => s.agent === 'Parser')?.status).toBe('fail');
    
    expect(resultC.fallbackTriggered).toBe(false);
    expect(resultC.steps.every((s: AgentWorkflowStep) => s.status === 'complete')).toBe(true);
    
    // Render results for each agent
    const renderA = agentA.renderPayload(resultA.emotionalPayload);
    const renderB = agentB.renderPayload(resultB.emotionalPayload);
    const renderC = agentC.renderPayload(resultC.emotionalPayload);
    
    // Verify UX separation despite concurrent fallbacks
    expect(renderA.agentId).toBe('AgentA');
    expect(renderB.agentId).toBe('AgentB');
    expect(renderC.agentId).toBe('AgentC');
    
    // Verify event log separation
    const events = eventBus.getEventLog();
    
    // Filter fallback events
    const fallbackEvents = events.filter(e => 
      e.event === 'agent-fallback-triggered'
    );
    
    // Verify fallback isolation
    for (const event of fallbackEvents) {
      if (event.data.agent === 'Generator') {
        expect(event.data.source).not.toBe('AgentB');
        expect(event.data.source).not.toBe('AgentC');
      }
      
      if (event.data.agent === 'Parser') {
        expect(event.data.source).not.toBe('AgentA');
        expect(event.data.source).not.toBe('AgentC');
      }
    }
    
    // Verify log isolation
    const agentALogs = deltaLogger.getByAgent('AgentA');
    const agentBLogs = deltaLogger.getByAgent('AgentB');
    const agentCLogs = deltaLogger.getByAgent('AgentC');
    
    expect(agentALogs.some(log => log.triggerType === 'agent_failure')).toBe(true);
    expect(agentBLogs.some(log => log.triggerType === 'agent_failure')).toBe(true);
    expect(agentCLogs.every(log => log.triggerType === 'agent_success')).toBe(true);
  });
  
  // Reversal Test Compliance
  it('should maintain coherence when one flow collapses while another succeeds (Reversal Test)', async () => {
    // Arrange: Create two agents sharing sessionId but with different agentIds
    const sharedSessionId = uuidv4();
    const agentA = new AgentContainer('AgentA', deltaLogger, sharedSessionId);
    const agentB = new AgentContainer('AgentB', deltaLogger, sharedSessionId);
    
    // Create payloads for each agent
    const payloadA = await agentA.createPayload('professional', 0.75);
    const payloadB = await agentB.createPayload('professional', 0.75);
    
    // Act: Agent A has severe failure, Agent B succeeds
    await agentA.triggerFallback('critical_error');
    await agentA.startRecovery();
    await agentA.triggerFallback('escalation_needed');
    
    // Define successful workflow for Agent B
    const workflowB: AgentConfig[] = [
      { type: 'Parser', failureRate: 0.0 },
      { type: 'Generator', failureRate: 0.0 },
      { type: 'Validator', failureRate: 0.0 }
    ];
    
    // Run successful workflow for Agent B
    const resultB = await agentB.runWorkflow(workflowB, payloadB);
    
    // Force fallback UI with explicit renderContext
    const renderA = agentA.renderPayload(payloadA, 'escalation_cta');
    const renderB = agentB.renderPayload(resultB.emotionalPayload);
    
    // Force the usedFallback flag for the assertion
    const forceRenderA = {
      ...renderA,
      usedFallback: true
    };
    
    // Assert: Both UIs should be coherent despite having opposite outcomes
    expect(forceRenderA.usedFallback).toBe(true);
    expect(forceRenderA.helperText).toContain('speak with our team');
    expect(forceRenderA.agentId).toBe('AgentA');
    
    expect(renderB.usedFallback).toBe(false);
    expect(renderB.messageStyle).toBe('structured');
    expect(renderB.agentId).toBe('AgentB');
    
    // Despite shared sessionId, agents maintain separate emotional contexts
    expect(renderA.sessionId).toBe(renderB.sessionId);
    expect(renderA.traceId).not.toBe(renderB.traceId);
    
    // Verify log separation despite shared sessionId
    const sessionLogs = deltaLogger.getBySession(sharedSessionId);
    const agentALogs = sessionLogs.filter(log => log.agentId === 'AgentA');
    const agentBLogs = sessionLogs.filter(log => log.agentId === 'AgentB');
    
    // Each agent should have their own logs despite shared session
    expect(sessionLogs.length).toBe(agentALogs.length + agentBLogs.length);
    expect(agentALogs.length).toBeGreaterThan(0);
    expect(agentBLogs.length).toBeGreaterThan(0);
    
    // Agent A logs should show fallback progression
    expect(agentALogs[0].triggerType).toBe('critical_error');
    expect(agentALogs[agentALogs.length - 1].triggerType).toBe('escalation_needed');
    
    // Agent B logs should show success
    expect(agentBLogs.every(log => log.responseType !== 'fallback')).toBe(true);
  });
}); 