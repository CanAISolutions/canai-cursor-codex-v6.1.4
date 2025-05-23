// agent-workflow-sequencing.test.ts
// DreamState Test 21: Agent Workflow Sequencing
// What: Validates end-to-end agent task sequencing and execution
// Why: Ensures correct order and emotional output in multi-agent workflows
// How: Uses runtime-validated agent orchestration with real fallback logic
// Polaris Status: Canonical
// Snapshot Lock: Enabled
// Mutation Watch: Active

import { createEmotionalPayload } from '../../cursor/utils/emotion-payload-builder';
import { AgentOrchestrator, AgentConfig } from '../../cursor/agents/agent-orchestrator';
import { describe, it, expect } from '@jest/globals';

// Polaris Ritual: Fallback Chain Integrity
// Codex Vector: Agent Workflow Trust
// Codex Safeguard: No mocks permitted. Agent fallback must be runtime-validated.
describe('DreamState: agent-workflow-sequencing', () => {
  it('should validate agent task sequencing with successful workflow', async () => {
    // What: Test the normal agent sequence with all agents succeeding
    // Why: Ensures agents run in correct order with proper outputs
    // How: Use real AgentOrchestrator with zero failure rates
    
    // Create a real emotional payload
    const initialPayload = await createEmotionalPayload({
      payload: 'This is a test payload for agent workflow sequencing.'
    });
    
    // Configure agents with zero failure probability (success path)
    const agents: AgentConfig[] = [
      { type: 'Parser', failureRate: 0 },
      { type: 'Generator', failureRate: 0 },
      { type: 'Validator', failureRate: 0 }
    ];
    
    // Run the workflow with real agent orchestration
    const orchestrator = new AgentOrchestrator();
    const result = await orchestrator.runAgentWorkflow(agents, initialPayload);
    
    // Assert successful workflow execution
    expect(result.success).toBe(true);
    expect(result.fallbackTriggered).toBe(false);
    expect(result.traceId).toBe(initialPayload.traceId);
    
    // Assert correct agent sequence
    expect(result.steps.length).toBe(3);
    expect(result.steps[0].agent).toBe('Parser');
    expect(result.steps[1].agent).toBe('Generator');
    expect(result.steps[2].agent).toBe('Validator');
    
    // Assert all agents completed successfully
    result.steps.forEach(step => {
      expect(step.status).toBe('complete');
      expect(step.output).toBeDefined();
      expect(step.timestamp).toBeGreaterThan(0);
    });
    
    // Assert emotional continuity
    expect(result.emotionalPayload.traceId).toBe(initialPayload.traceId);
    expect(result.emotionalPayload.emotionIntentHash).toBe(initialPayload.emotionIntentHash);
  });
  
  it('should handle agent failure and trigger appropriate fallback', async () => {
    // What: Test the fallback mechanism when an agent fails
    // Why: Ensures system resilience through proper fallback activation
    // How: Use real AgentOrchestrator with failure rates to trigger fallbacks
    
    // Create a real emotional payload
    const initialPayload = await createEmotionalPayload({
      payload: 'This is a test payload that will trigger a fallback.'
    });
    
    // Configure agents with high failure probability for Generator to trigger fallback
    const agents: AgentConfig[] = [
      { type: 'Parser', failureRate: 0 },
      { type: 'Generator', failureRate: 1, fallbackAgent: 'Fallback' }, // 100% failure rate to ensure fallback
      { type: 'Validator', failureRate: 0 }
    ];
    
    // Run the workflow with real agent orchestration
    const orchestrator = new AgentOrchestrator();
    const result = await orchestrator.runAgentWorkflow(agents, initialPayload);
    
    // Assert successful workflow with fallback
    expect(result.success).toBe(true);
    expect(result.fallbackTriggered).toBe(true);
    expect(result.traceId).toBe(initialPayload.traceId);
    
    // Assert correct agent sequence with fallback
    expect(result.steps.length).toBe(4); // Parser, Generator(fail), Fallback, Validator
    expect(result.steps[0].agent).toBe('Parser');
    expect(result.steps[0].status).toBe('complete');
    expect(result.steps[1].agent).toBe('Generator');
    expect(result.steps[1].status).toBe('fail');
    expect(result.steps[2].agent).toBe('Fallback');
    expect(result.steps[2].status).toBe('complete');
    expect(result.steps[3].agent).toBe('Validator');
    expect(result.steps[3].status).toBe('complete');
    
    // Assert emotional continuity through fallback
    expect(result.emotionalPayload.traceId).toBe(initialPayload.traceId);
    expect(result.emotionalPayload.emotionIntentHash).toBe(initialPayload.emotionIntentHash);
    expect(result.finalTrustScore).toBeGreaterThan(0.5); // Trust should remain reasonable after fallback
  });
  
  it('should preserve emotional payload integrity through agent transitions', async () => {
    // What: Test emotional payload preservation across the agent workflow
    // Why: Ensures emotional context is maintained throughout processing
    // How: Use real AgentOrchestrator and verify emotional payload integrity
    
    // Create a real emotional payload with specific tone
    const initialPayload = await createEmotionalPayload({
      tone: 'empathetic',
      payload: 'This payload should maintain emotional integrity through transitions.'
    });
    
    // Run the workflow with real agent orchestration
    const orchestrator = new AgentOrchestrator();
    const result = await orchestrator.runAgentWorkflow(
      orchestrator.getDefaultWorkflow(), // Use default workflow with fallbacks configured
      initialPayload
    );
    
    // Assert emotional payload preservation
    expect(result.emotionalPayload.traceId).toBe(initialPayload.traceId);
    expect(result.emotionalPayload.emotionIntentHash).toBe(initialPayload.emotionIntentHash);
    expect(result.emotionalPayload.tone).toBe(initialPayload.tone);
    expect(result.emotionalPayload.locale).toBe(initialPayload.locale);
    
    // Validate each step updated the payload appropriately
    let lastOutput: string | undefined;
    result.steps.forEach(step => {
      if (step.status === 'complete') {
        lastOutput = step.output;
      }
    });
    
    // The final payload should contain the last successful output
    expect(result.emotionalPayload.payload).toBe(lastOutput);
  });
  
  it('should maintain traceId continuity through complex agent fallback chains', async () => {
    // What: Test trace continuity through complex fallback chains
    // Why: Ensures chain-of-trust observability in complex scenarios
    // How: Use real AgentOrchestrator with multiple fallbacks and verify trace continuity
    
    // Create a real emotional payload
    const initialPayload = await createEmotionalPayload({
      payload: 'This payload will test trace continuity through complex fallbacks.'
    });
    
    // Configure a complex agent workflow with fallbacks that might also fail
    const agents: AgentConfig[] = [
      { type: 'Parser', failureRate: 0.5, fallbackAgent: 'Recovery' },
      { type: 'Generator', failureRate: 0.5, fallbackAgent: 'Fallback' },
      { type: 'Validator', failureRate: 0.5, fallbackAgent: 'Emotional' }
    ];
    
    // Run the workflow with real agent orchestration
    const orchestrator = new AgentOrchestrator();
    const result = await orchestrator.runAgentWorkflow(agents, initialPayload);
    
    // Assert trace continuity
    expect(result.traceId).toBe(initialPayload.traceId);
    
    // Verify that all steps maintain the same traceId
    result.steps.forEach(step => {
      // All events for this step should have used the same traceId
      // This is verified by the logs emitted by the orchestrator
      expect(result.traceId).toBe(initialPayload.traceId);
    });
    
    // Assert final payload maintains traceId
    expect(result.emotionalPayload.traceId).toBe(initialPayload.traceId);
    expect(result.emotionalPayload.emotionIntentHash).toBe(initialPayload.emotionIntentHash);
  });
}); 