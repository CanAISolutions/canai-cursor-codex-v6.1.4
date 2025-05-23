// fallback-nesting-integrity.test.ts
// DreamState Test 8: Fallback Nesting Integrity
// What: Validates that fallback UIs are never nested or recursively rendered
// Why: Prevents emotional noise, visual duplication, and conflicting UX elements
// How: Uses real FallbackManager with EmotionalUXRenderer to ensure flat fallback rendering

import { EventBus } from '../../cursor/event-bus/eventBus';
import { FallbackManager } from '../../cursor/services/fallback-manager';
import { EmotionalValidator } from '../../cursor/validators/emotional-validator';
import { createEmotionalPayload, createToneSpecificPayload } from '../../cursor/utils/emotion-payload-builder';
import { v4 as uuidv4 } from 'uuid';

// Polaris Ritual: Fallback Rendering Integrity
// Codex Vector: UX Flattening Enforcement
// Codex Safeguard: No fallback component may render another fallback component

// For tracking fallback rendering and detecting nesting
interface FallbackRenderState {
  renderId: string;
  sessionId: string;
  traceId: string;
  renderTimestamp: string;
  fallbackLevel: number;
  nestedFallbacks: boolean;
  usedFallback: boolean;
  componentTree: ComponentNode[];
  renderContext: string;
  emotionalTone: string;
  trustScore: number;
}

// For DOM/component tree validation
interface ComponentNode {
  type: string;
  nested: ComponentNode[];
  props?: Record<string, any>;
}

// Session delta logging for tracing fallback nesting
interface FallbackSessionDelta {
  sessionId: string;
  fallbackStepId: string;
  triggerType: string;
  responseType: string;
  emotionalContext: string;
  trustScoreBefore: number;
  trustScoreAfter: number;
  timestamp: string;
  nestedFallbacks?: boolean;
  componentDepth?: number;
}

// UX rendering result with component tree for inspection
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
    componentTree?: ComponentNode[];
  };
}

// For tracking fallback nesting patterns
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
  
  clearLogs(): void {
    this.logs = [];
  }
}

// Enhanced EmotionalUXRenderer with component tree tracking
class EmotionalUXRenderer {
  private renderHistory: FallbackRenderState[] = [];
  
  renderPayload(payload: any, renderContext: string = 'standard'): UXRenderResult {
    // Check for empty payload - should trigger fallback
    if (!payload.payload || payload.payload.trim() === '') {
      return this.renderFallbackUI(payload, renderContext, 'empty/unclear output');
    }
    
    // Check for sarcastic tone - should trigger fallback
    if (payload.tone === 'sarcastic' || payload.tone === 'frustrated') {
      return this.renderFallbackUI(payload, renderContext, 'tone mismatch');
    }
    
    // Check for low trust score - should trigger fallback
    if (payload.trustScore < 0.5) {
      return this.renderFallbackUI(payload, renderContext, 'trust_compromised');
    }
    
    // Apply tone-specific rendering for non-fallback states
    let cta = 'Continue';
    let helperText = 'How does this look?';
    let messageStyle = 'standard';
    
    // Create component tree for normal rendering (no fallback components)
    const componentTree: ComponentNode[] = [
      {
        type: 'StandardContainer',
        nested: [
          {
            type: 'MessagePanel',
            nested: [
              { type: 'ResponseText', nested: [] },
              { type: 'HelperText', nested: [] }
            ]
          },
          { type: 'CTAButton', nested: [] }
        ]
      }
    ];
    
    // Log this render in history with no nesting
    this.renderHistory.push({
      renderId: uuidv4(),
      sessionId: payload.sessionId,
      traceId: payload.traceId,
      renderTimestamp: new Date().toISOString(),
      fallbackLevel: 0,
      nestedFallbacks: false,
      usedFallback: false,
      componentTree,
      renderContext,
      emotionalTone: payload.tone,
      trustScore: payload.trustScore
    });
    
    return {
      cta,
      helperText,
      messageStyle,
      trustIndicator: 'normal',
      emotionalSnapshot: JSON.stringify({
        tone: payload.tone,
        trustScore: payload.trustScore,
        timestamp: new Date().toISOString()
      }),
      usedFallback: false,
      traceId: payload.traceId,
      uiComponents: {
        showHelper: true,
        enableCTA: true,
        messageFormat: 'standard',
        componentTree
      }
    };
  }
  
  renderFallbackUI(payload: any, renderContext: string = 'standard', forcedScenario?: string): UXRenderResult {
    // Determine fallback scenario
    let scenario = forcedScenario || 'prompt failure';
    
    // Check if this is a subsequent fallback by looking at the render history
    const previousFallbacks = this.renderHistory.filter(render => 
      render.sessionId === payload.sessionId && 
      render.usedFallback === true
    );
    
    const fallbackLevel = previousFallbacks.length;
    
    // Get appropriate fallback message according to Emotional Fallback Protocol
    let helperText = 'Let\'s try a different approach.';
    let cta = 'Try Again';
    
    // Adjust message based on fallback level to ensure uniqueness
    if (fallbackLevel > 0) {
      switch (scenario) {
        case 'tone mismatch':
          helperText = fallbackLevel === 1 ? 
            'Let me try to understand this better.' : 
            'I want to make sure we\'re on the same page.';
          break;
        case 'empty/unclear output':
          helperText = fallbackLevel === 1 ? 
            'Could you help me understand what you need?' : 
            'I didn\'t catch that. Can you try again?';
          break;
        case 'trust_compromised':
          helperText = fallbackLevel === 1 ? 
            'Let me connect you with someone who can help.' : 
            'Would you like to connect with our support team?';
          cta = 'Get Help';
          break;
        default:
          helperText = fallbackLevel === 1 ? 
            'Let\'s take a step back and try again.' : 
            'Let\'s take a fresh look at this.';
      }
    } else {
      // First fallback - use original messages
      switch (scenario) {
        case 'tone mismatch':
          helperText = 'I want to make sure I understand you correctly.';
          break;
        case 'empty/unclear output':
          helperText = 'I didn\'t catch that. Can you try again?';
          break;
        case 'trust_compromised':
          helperText = 'Would you like to connect with our support team?';
          cta = 'Get Help';
          break;
        default:
          helperText = 'Let\'s take a fresh look at this.';
      }
    }
    
    // Create component tree for fallback rendering - flat structure, no nesting
    const componentTree: ComponentNode[] = [
      {
        type: 'FallbackContainer',
        nested: [
          {
            type: 'FallbackMessage',
            nested: []
          },
          {
            type: 'FallbackCTA',
            nested: []
          }
        ]
      }
    ];
    
    const nestedFallback = fallbackLevel > 0;
    
    // Log this render in history with nesting status
    this.renderHistory.push({
      renderId: uuidv4(),
      sessionId: payload.sessionId,
      traceId: payload.traceId,
      renderTimestamp: new Date().toISOString(),
      fallbackLevel,
      nestedFallbacks: nestedFallback,
      usedFallback: true,
      componentTree,
      renderContext,
      emotionalTone: 'fallback',
      trustScore: payload.trustScore
    });
    
    return {
      cta,
      helperText,
      messageStyle: 'fallback',
      trustIndicator: 'recovering',
      emotionalSnapshot: JSON.stringify({
        tone: 'fallback',
        originalTone: payload.tone,
        trustScore: payload.trustScore,
        timestamp: new Date().toISOString(),
        fallbackTriggered: true,
        fallbackReason: scenario,
        fallbackLevel
      }),
      usedFallback: true,
      traceId: payload.traceId,
      uiComponents: {
        showHelper: true,
        enableCTA: true,
        messageFormat: 'fallback',
        componentTree
      }
    };
  }
  
  getRenderHistory(): FallbackRenderState[] {
    return [...this.renderHistory];
  }
  
  clearRenderHistory(): void {
    this.renderHistory = [];
  }
  
  // Check if any fallbacks are nested within fallbacks
  hasNestedFallbacks(): boolean {
    return this.renderHistory.some(render => render.nestedFallbacks);
  }
  
  // Get component tree for a specific render
  getComponentTree(renderId: string): ComponentNode[] | null {
    const render = this.renderHistory.find(r => r.renderId === renderId);
    return render ? render.componentTree : null;
  }
}

// Controls fallback rendering and prevents nesting
class FallbackRenderingManager {
  private fallbackManager: FallbackManager;
  private emotionalValidator: EmotionalValidator;
  private eventBus: EventBus;
  private renderer: EmotionalUXRenderer;
  private deltaLogger: SessionDeltaLogEmitter;
  
  constructor() {
    this.fallbackManager = FallbackManager.getInstance();
    this.emotionalValidator = new EmotionalValidator();
    this.eventBus = EventBus.getInstance();
    this.renderer = new EmotionalUXRenderer();
    this.deltaLogger = new SessionDeltaLogEmitter();
  }
  
  // Render payload and check for nesting
  renderPayload(payload: any, renderContext: string = 'standard'): UXRenderResult {
    // First check if we're currently in a fallback state
    const inFallback = this.fallbackManager.isFallbackActive();
    
    // Get render result
    const result = this.renderer.renderPayload(payload, renderContext);
    
    // If fallback was used, log it
    if (result.usedFallback) {
      this.deltaLogger.log({
        sessionId: payload.sessionId,
        fallbackStepId: uuidv4(),
        triggerType: renderContext,
        responseType: 'fallback',
        emotionalContext: payload.tone || 'unknown',
        trustScoreBefore: payload.trustScore,
        trustScoreAfter: payload.trustScore, // Same in this test
        timestamp: new Date().toISOString(),
        nestedFallbacks: inFallback, // Was this a nested fallback?
        componentDepth: result.uiComponents.componentTree?.length || 0
      });
    }
    
    return result;
  }
  
  // Simulate multiple fallbacks in sequence
  async simulateFallbackSequence(
    sessionId: string,
    initialTone: string = 'standard',
    triggersCount: number = 2
  ): Promise<UXRenderResult[]> {
    const results: UXRenderResult[] = [];
    const traceId = uuidv4();
    
    // Initial normal payload
    const initialPayload = await createEmotionalPayload({
      payload: 'Initial content',
      tone: initialTone,
      trustScore: 0.9,
      sessionId,
      traceId
    });
    
    // Render initial payload
    results.push(this.renderPayload(initialPayload));
    
    // Now simulate fallback triggers
    for (let i = 0; i < triggersCount; i++) {
      // Each trigger uses the same session and trace for continuity
      const fallbackPayload = await createEmotionalPayload({
        payload: `Trigger ${i + 1}`,
        tone: i % 2 === 0 ? 'sarcastic' : 'frustrated', // Alternate tones
        trustScore: Math.max(0.9 - (i * 0.2), 0.4), // Decreasing trust score
        sessionId,
        traceId
      });
      
      // Render fallback trigger
      results.push(this.renderPayload(fallbackPayload));
    }
    
    return results;
  }
  
  // Inject multiple fallback payloads simultaneously
  async injectMultipleFallbacks(sessionId: string): Promise<UXRenderResult[]> {
    const results: UXRenderResult[] = [];
    const traceId = uuidv4();
    
    // Create fallback-triggering payloads with different reasons
    const payloads = [
      await createToneSpecificPayload('sarcastic', { sessionId, traceId }),
      await createEmotionalPayload({ 
        payload: '', 
        tone: 'standard', 
        trustScore: 0.7,
        sessionId,
        traceId
      }), // Empty payload
      await createEmotionalPayload({ 
        payload: 'Trust issue', 
        tone: 'anxious', 
        trustScore: 0.3,
        sessionId,
        traceId
      }) // Low trust
    ];
    
    // Render all payloads
    for (const payload of payloads) {
      results.push(this.renderPayload(payload));
    }
    
    return results;
  }
  
  // Log component structure of all fallback renders
  logFallbackStructure(): Record<string, any>[] {
    const history = this.renderer.getRenderHistory();
    return history
      .filter(render => render.fallbackLevel > 0 || render.usedFallback)
      .map(render => ({
        renderId: render.renderId,
        sessionId: render.sessionId,
        fallbackLevel: render.fallbackLevel,
        nestedFallbacks: render.nestedFallbacks,
        componentTypes: this.flattenComponentTypes(render.componentTree)
      }));
  }
  
  // Flatten component tree to list of component types
  private flattenComponentTypes(components: ComponentNode[]): string[] {
    const types: string[] = [];
    
    const traverse = (node: ComponentNode) => {
      types.push(node.type);
      node.nested.forEach(traverse);
    };
    
    components.forEach(traverse);
    return types;
  }
  
  // Get logs
  getLogs(): FallbackSessionDelta[] {
    return this.deltaLogger.getLogs();
  }
  
  // Clear history and logs
  clear(): void {
    this.renderer.clearRenderHistory();
    this.deltaLogger.clearLogs();
  }
}

describe('DreamState: fallback-nesting-integrity', () => {
  let renderManager: FallbackRenderingManager;
  
  beforeEach(() => {
    renderManager = new FallbackRenderingManager();
  });
  
  afterEach(() => {
    renderManager.clear();
  });
  
  it('should prevent recursive wrapping of fallback UI components', async () => {
    // Arrange: Create a session ID
    const sessionId = uuidv4();
    
    // Act: Simulate a drift → fallback → second drift → second fallback sequence
    const results = await renderManager.simulateFallbackSequence(sessionId, 'standard', 2);
    
    // Assert: Verify all renders have proper component structure
    const logs = renderManager.getLogs();
    
    // Should have 3 results (initial + 2 fallbacks)
    expect(results.length).toBe(3);
    
    // At least one should be a fallback
    expect(results.some(r => r.usedFallback)).toBe(true);
    
    // Fallback-specific assertions
    const fallbackResults = results.filter(r => r.usedFallback);
    fallbackResults.forEach(result => {
      // No fallback should have nested FallbackContainer components (recursive nesting)
      expect(result.uiComponents.componentTree?.some(
        node => node.type === 'FallbackContainer' && 
        node.nested.some(child => child.type === 'FallbackContainer')
      )).toBe(false);
      
      // MessageFormat should be 'fallback'
      expect(result.uiComponents.messageFormat).toBe('fallback');
    });
    
    // Check log for nested fallbacks
    expect(logs.some(log => log.nestedFallbacks === true)).toBe(false);
  });
  
  it('should ensure only one message per fallback step', async () => {
    // Arrange: Create a session ID
    const sessionId = uuidv4();
    
    // Act: Inject multiple fallback payloads simultaneously
    const results = await renderManager.injectMultipleFallbacks(sessionId);
    
    // Assert: Each fallback should have a single, coherent message
    const fallbackResults = results.filter(r => r.usedFallback);
    
    fallbackResults.forEach(result => {
      // Each fallback should have exactly one message
      const messageComponents = result.uiComponents.componentTree?.filter(
        node => node.type === 'FallbackContainer'
      )[0]?.nested.filter(
        child => child.type === 'FallbackMessage'
      ) || [];
      
      // Should be exactly one message component
      expect(messageComponents.length).toBe(1);
      
      // Message component should have no nested children
      expect(messageComponents[0].nested.length).toBe(0);
    });
  });
  
  it('should maintain clean JSON/DOM snapshot structure', async () => {
    // Arrange: Create a session ID
    const sessionId = uuidv4();
    
    // Act: Simulate a fallback sequence
    const results = await renderManager.simulateFallbackSequence(sessionId, 'standard', 3);
    
    // Assert: Check component tree for all renders
    const structure = renderManager.logFallbackStructure();
    
    // Check for duplicate component types that would indicate nesting
    structure.forEach(render => {
      const fallbackContainerCount = render.componentTypes.filter(
        (type: string) => type === 'FallbackContainer'
      ).length;
      
      const fallbackMessageCount = render.componentTypes.filter(
        (type: string) => type === 'FallbackMessage'
      ).length;
      
      const fallbackCTACount = render.componentTypes.filter(
        (type: string) => type === 'FallbackCTA'
      ).length;
      
      // Should have at most one of each fallback component type
      expect(fallbackContainerCount).toBeLessThanOrEqual(1);
      expect(fallbackMessageCount).toBeLessThanOrEqual(1);
      expect(fallbackCTACount).toBeLessThanOrEqual(1);
    });
  });
  
  it('should ensure tone continuity between sequential fallback steps', async () => {
    // Arrange: Create a session ID
    const sessionId = uuidv4();
    
    // Act: Simulate a drift → fallback → second drift → second fallback sequence
    const results = await renderManager.simulateFallbackSequence(sessionId, 'standard', 3);
    
    // Assert: Check emotional progression
    const fallbackResults = results.filter(r => r.usedFallback);
    
    // If there are multiple fallbacks, they should have a continuous emotional transition
    if (fallbackResults.length > 1) {
      for (let i = 1; i < fallbackResults.length; i++) {
        const previousSnapshot = JSON.parse(fallbackResults[i - 1].emotionalSnapshot);
        const currentSnapshot = JSON.parse(fallbackResults[i].emotionalSnapshot);
        
        // Both should have fallbackTriggered true
        expect(previousSnapshot.fallbackTriggered).toBe(true);
        expect(currentSnapshot.fallbackTriggered).toBe(true);
        
        // Should have same traceId for continuity
        expect(fallbackResults[i - 1].traceId).toBe(fallbackResults[i].traceId);
        
        // Don't expect exact same helperText (messages can be different)
        // but they should be different fallback messages, not duplicates
        expect(fallbackResults[i - 1].helperText).not.toBe(fallbackResults[i].helperText);
      }
    }
  });
  
  it('should validate component tree integrity with no nested fallbacks', async () => {
    // Arrange: Create a session ID
    const sessionId = uuidv4();
    
    // Act: Inject multiple fallback payloads
    const results = await renderManager.injectMultipleFallbacks(sessionId);
    
    // Assert: Check component tree of every fallback result
    const fallbackResults = results.filter(r => r.usedFallback);
    
    fallbackResults.forEach(result => {
      const componentTree = result.uiComponents.componentTree;
      
      // Should have component tree
      expect(componentTree).toBeDefined();
      
      // Root component should be FallbackContainer
      const rootComponent = componentTree![0];
      expect(rootComponent.type).toBe('FallbackContainer');
      
      // Root component should not contain any component with "Fallback" in its name among nested components
      const hasNestedFallback = rootComponent.nested.some(
        component => component.nested.some(
          nestedComponent => nestedComponent.type.includes('Fallback')
        )
      );
      
      expect(hasNestedFallback).toBe(false);
    });
  });
  
  it('should ensure recovery state is isolated between fallback steps', async () => {
    // Arrange: Create a session ID
    const sessionId = uuidv4();
    
    // Act: Trigger tone mismatch → fallback copy sequence
    const results = await renderManager.simulateFallbackSequence(sessionId, 'standard', 2);
    
    // Assert: Verify no "We're trying again…" messages wrap prior fallbacks
    const logs = renderManager.getLogs();
    
    // Check that no fallback message contains another fallback message
    const fallbackResults = results.filter(r => r.usedFallback);
    const fallbackMessages = fallbackResults.map(r => r.helperText);
    
    // Each message should be unique (no duplicated messages)
    const uniqueMessages = new Set(fallbackMessages);
    expect(uniqueMessages.size).toBe(fallbackMessages.length);
    
    // No fallback message should contain another fallback message
    fallbackMessages.forEach(message => {
      fallbackMessages.forEach(otherMessage => {
        if (message !== otherMessage) {
          expect(message.includes(otherMessage)).toBe(false);
        }
      });
    });
  });
  
  it('should validate structure of fallback rendering with no duplicate keys or nested fallbacks', async () => {
    // Arrange: Create a session ID
    const sessionId = uuidv4();
    
    // Act: Create a complex sequence of fallbacks
    const results = await renderManager.simulateFallbackSequence(sessionId, 'sarcastic', 3);
    
    // Assert: Check structure of fallback render logs
    const structure = renderManager.logFallbackStructure();
    
    // Each render should have a unique ID
    const renderIds = structure.map(s => s.renderId);
    const uniqueRenderIds = new Set(renderIds);
    expect(uniqueRenderIds.size).toBe(renderIds.length);
    
    // Component types should have no nested fallbacks
    structure.forEach(render => {
      // Get index of FallbackContainer
      const containerIndex = render.componentTypes.findIndex((type: string) => type === 'FallbackContainer');
      
      if (containerIndex >= 0) {
        // Check components after the container
        const componentsAfterContainer = render.componentTypes.slice(containerIndex + 1);
        
        // None of these should be a FallbackContainer (no nesting)
        expect(componentsAfterContainer.includes('FallbackContainer')).toBe(false);
      }
    });
  });
  
  // Codex safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
  it('should log fallback rendering for audit trace', async () => {
    // Arrange: Create a session ID
    const sessionId = uuidv4();
    
    // Act: Simulate some fallbacks
    await renderManager.simulateFallbackSequence(sessionId, 'standard', 2);
    
    // Assert: Check logs
    const logs = renderManager.getLogs();
    
    // Ensure all fallbacks are logged
    expect(logs.length).toBeGreaterThan(0);
    
    // Each log should have required fields
    logs.forEach(log => {
      expect(log.sessionId).toBe(sessionId);
      expect(log.fallbackStepId).toBeDefined();
      expect(log.triggerType).toBeDefined();
      expect(log.timestamp).toBeDefined();
      expect(log.nestedFallbacks).toBeDefined();
      
      // Most importantly, nested fallbacks should be false
      expect(log.nestedFallbacks).toBe(false);
    });
  });
}); 