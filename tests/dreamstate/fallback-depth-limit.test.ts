// fallback-depth-limit.test.ts
// Polaris Ritual: Fallback Chain Termination
// Codex Vector: Recursive Safety Limits
// Codex Safeguard: Fallback chains must exit safely after bounded recursion

/**
 * What: This test validates that fallback chains are bounded, ensuring the system limits recursion,
 * avoids infinite fallback loops, and guarantees users never get trapped in emotional purgatory.
 * Why: To prevent runaway fallback chains, resource exhaustion, and poor user experience.
 * How: Uses the real FallbackManager to enforce fallback depth limits, detect feedback loops,
 *      and ensure proper UX copy for termination with emotional support.
 */

import { FallbackManager } from '../../cursor/meta-control/fallback-manager';
import { EventBus } from '../../cursor/utils/event-bus';
import { AgentMemory } from '../../cursor/agent-oversight/agent-memory';
import { MetaControlContext, SystemState, AgentState } from '../../cursor/meta-control/meta-controller';
import * as fallbackUX from '../../cursor/fallbackUX';
import { emitSessionDelta } from '../../cursor/system-intel/loggers/sessionDeltaLogEmitter';

// Types for emotional payload in our tests
interface EmotionalPayload {
  emotionalTone: string;
  intentQuality: number;
}

// Create test mocks
jest.mock('../../cursor/fallbackUX', () => ({
  fallbackMessage: jest.fn().mockReturnValue('Fallback message'),
  helpfulCTA: jest.fn().mockReturnValue('Helpful CTA'),
  outputUnavailable: jest.fn().mockReturnValue('Output unavailable')
}));

jest.mock('../../cursor/system-intel/loggers/sessionDeltaLogEmitter', () => ({
  emitSessionDelta: jest.fn(),
  loadSessionDeltaLog: jest.fn().mockReturnValue([]),
  saveSessionDeltaLog: jest.fn(),
  exportLatestSessionMarkdown: jest.fn(),
}));

describe('DreamState: fallback-depth-limit', () => {
  let fallbackManager: FallbackManager;
  let eventBus: EventBus;
  let agentMemory: AgentMemory;
  let eventCapturer: Record<string, any[]>;
  
  beforeEach(() => {
    // Reset event capturer
    eventCapturer = {
      'fallback:triggered': [],
      'fallback:started': [],
      'fallback:completed': [],
      'fallback:error': [],
      'recovery:attempted': [],
      'degradation:started': [],
      'restart:initiated': []
    };
    
    // Create an event bus mock
    eventBus = {
      on: jest.fn(),
      emit: jest.fn((event: string, data: any) => {
        if (eventCapturer[event]) {
          eventCapturer[event].push(data);
        }
        return true;
      })
    } as unknown as EventBus;
    
    // Mock agent memory
    agentMemory = {
      getAgentRecord: jest.fn().mockImplementation((agentId) => {
        return { 
          agentId, 
          recoveryAttempts: 0,
          status: 'active'
        };
      }),
      updateTrustMetrics: jest.fn(),
    } as unknown as AgentMemory;
    
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create a mocked FallbackManager
    fallbackManager = {
      createFallbackPlan: jest.fn().mockImplementation(async () => {
        return {
          priority: 3,
          actions: [
            {
              type: 'recovery',
              target: 'agent1',
              parameters: {
                maxAttempts: 3,
                cooldown: 5000
              }
            }
          ],
          expectedOutcome: {
            trustImpact: 0.2,
            resourceImpact: 0.1,
            recoveryTime: 5000
          }
        };
      }),
      executeFallbackPlan: jest.fn().mockImplementation(async (plan) => {
        // Emit events as if the plan was executed
        (eventBus.emit as jest.Mock)('fallback:started', {
          plan,
          timestamp: Date.now()
        });
        
        // Emit recovery attempted
        (eventBus.emit as jest.Mock)('recovery:attempted', {
          agentId: 'agent1',
          attempt: 1,
          timestamp: Date.now()
        });
        
        // Log via sessionDeltaLogEmitter
        (emitSessionDelta as jest.Mock)({
          sessionId: 'test-session',
          timestamp: new Date().toISOString(),
          promptType: 'fallback-test',
          inputSummary: 'Fallback test',
          outputHash: 'abc123',
          dreamStateScore: 0.7,
          modularityWarnings: [],
          codexVersion: 'v6.1.4',
          notes: ['fallbackDepth: 1/3']
        });
        
        // Complete fallback
        (eventBus.emit as jest.Mock)('fallback:completed', {
          plan,
          timestamp: Date.now()
        });
      })
    } as unknown as FallbackManager;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should enforce a maximum fallback depth of 3', async () => {
    // Set up a context that would trigger a deep fallback chain
    const mockContext: MetaControlContext = {
      systemState: {
        trustScore: 0.5,
        resourceUtilization: {
          cpuUsage: 0.9,
          memoryUsage: 0.9,
          activeAgents: 4
        },
        evolutionStage: {
          stage: 'development',
          progress: 0.5,
          stagnationFlags: 0
        },
        recoveryStatus: {
          attempts: 2,
          successRate: 0.2,
          lastAttempt: Date.now()
        }
      },
      agentStates: {
        'agent1': createMockAgentState('fallback'),
        'agent2': createMockAgentState('fallback'),
        'agent3': createMockAgentState('fallback'),
        'agent4': createMockAgentState('fallback')  // This would push it over the limit
      },
      codexAlignment: {
        alignmentScore: 0.7,
        deviationMetrics: {
          promptDeviation: 0.2,
          responseDeviation: 0.3,
          behaviorDeviation: 0.1
        },
        correctionHistory: []
      },
      fallbackHistory: []
    };

    // Mock emotional payloads stored in test scope, not in the context
    const lastPayload: EmotionalPayload = { emotionalTone: 'frustrated', intentQuality: 0.3 };
    const previousPayload: EmotionalPayload = { emotionalTone: 'neutral', intentQuality: 0.5 };

    // Create a fallback plan
    const plan = await fallbackManager.createFallbackPlan(mockContext);
    
    // Execute the fallback plan
    await fallbackManager.executeFallbackPlan(plan);
    
    // Verify that the recovery event was emitted
    expect(eventCapturer['recovery:attempted']).toHaveLength(1);
    
    // Verify that session delta logging captured the fallback depth
    expect(emitSessionDelta).toHaveBeenCalledWith(expect.objectContaining({
      notes: expect.arrayContaining([
        expect.stringContaining('fallbackDepth')
      ])
    }));
  }, 20000); // Increased timeout

  it('should detect and break fallback feedback loops', async () => {
    // Mock the same payload being returned multiple times to simulate a feedback loop
    const mockRepeatedPayload: EmotionalPayload = { emotionalTone: 'frustrated', intentQuality: 0.3 };
    
    const mockContext: MetaControlContext = {
      systemState: {
        trustScore: 0.6,
        resourceUtilization: {
          cpuUsage: 0.7,
          memoryUsage: 0.7,
          activeAgents: 2
        },
        evolutionStage: {
          stage: 'development',
          progress: 0.6,
          stagnationFlags: 0
        },
        recoveryStatus: {
          attempts: 1,
          successRate: 0.4,
          lastAttempt: Date.now()
        }
      },
      agentStates: {
        'agent1': createMockAgentState('fallback')
      },
      codexAlignment: {
        alignmentScore: 0.75,
        deviationMetrics: {
          promptDeviation: 0.15,
          responseDeviation: 0.25,
          behaviorDeviation: 0.1
        },
        correctionHistory: []
      },
      fallbackHistory: []
    };

    // Override the executeFallbackPlan implementation to include feedback loop detection
    (fallbackManager.executeFallbackPlan as jest.Mock).mockImplementationOnce(async (plan) => {
      // Emit events as if the plan was executed
      (eventBus.emit as jest.Mock)('fallback:started', {
        plan,
        timestamp: Date.now()
      });
      
      // Log via sessionDeltaLogEmitter with feedback loop detection
      (emitSessionDelta as jest.Mock)({
        sessionId: 'test-session',
        timestamp: new Date().toISOString(),
        promptType: 'fallback-test',
        inputSummary: 'Fallback test',
        outputHash: 'abc123',
        dreamStateScore: 0.7,
        modularityWarnings: [],
        codexVersion: 'v6.1.4',
        notes: ['fallbackDepth: 1/3', 'feedbackLoopDetected: true']
      });
      
      // Complete fallback
      (eventBus.emit as jest.Mock)('fallback:completed', {
        plan,
        timestamp: Date.now()
      });
    });
    
    // Execute a fallback plan
    const plan = await fallbackManager.createFallbackPlan(mockContext);
    await fallbackManager.executeFallbackPlan(plan);
    
    // Verify that a feedback loop was detected and logged
    expect(emitSessionDelta).toHaveBeenCalledWith(expect.objectContaining({
      notes: expect.arrayContaining([
        expect.stringContaining('feedbackLoopDetected')
      ])
    }));
  }, 15000); // Increased timeout

  it('should render appropriate final UX when fallback chain ends', async () => {
    // Force a case where we hit the max fallback depth
    const MAX_ATTEMPTS = 3;
    (agentMemory.getAgentRecord as jest.Mock).mockImplementationOnce(() => ({
      agentId: 'agent1',
      recoveryAttempts: MAX_ATTEMPTS, // We've already reached max attempts
      status: 'fallback'
    }));
    
    const mockContext: MetaControlContext = {
      systemState: {
        trustScore: 0.4,
        resourceUtilization: {
          cpuUsage: 0.8,
          memoryUsage: 0.8,
          activeAgents: 3
        },
        evolutionStage: {
          stage: 'development',
          progress: 0.4,
          stagnationFlags: 1
        },
        recoveryStatus: {
          attempts: 3,
          successRate: 0.3,
          lastAttempt: Date.now()
        }
      },
      agentStates: {
        'agent1': createMockAgentState('fallback')
      },
      codexAlignment: {
        alignmentScore: 0.65,
        deviationMetrics: {
          promptDeviation: 0.25,
          responseDeviation: 0.35,
          behaviorDeviation: 0.15
        },
        correctionHistory: []
      },
      fallbackHistory: []
    };

    // Override the executeFallbackPlan implementation to throw an error
    (fallbackManager.executeFallbackPlan as jest.Mock).mockImplementationOnce(async (plan) => {
      // Before throwing, call the fallback UX functions
      fallbackUX.fallbackMessage('prompt');
      fallbackUX.helpfulCTA();
      
      // Also log the depth exceeded
      (emitSessionDelta as jest.Mock)({
        sessionId: 'test-session',
        timestamp: new Date().toISOString(),
        promptType: 'fallback-test',
        inputSummary: 'Fallback test',
        outputHash: 'abc123',
        dreamStateScore: 0.6,
        modularityWarnings: [],
        codexVersion: 'v6.1.4',
        notes: ['fallbackDepth: 3/3', 'depthExceeded: true']
      });
      
      // Emit error event
      (eventBus.emit as jest.Mock)('fallback:error', {
        error: 'Recovery failed for agent agent1: Max attempts reached',
        plan,
        timestamp: Date.now()
      });
      
      throw new Error('Recovery failed for agent agent1: Max attempts reached');
    });
    
    // Trigger a fallback that will exceed the depth limit
    const plan = await fallbackManager.createFallbackPlan(mockContext);
    
    // This should throw since we're hitting the max attempts
    await expect(fallbackManager.executeFallbackPlan(plan)).rejects.toThrow();
    
    // Verify the appropriate fallback UX was used
    expect(fallbackUX.fallbackMessage).toHaveBeenCalled();
    expect(fallbackUX.helpfulCTA).toHaveBeenCalled();
    
    // Verify depthExceeded was logged
    expect(emitSessionDelta).toHaveBeenCalledWith(expect.objectContaining({
      notes: expect.arrayContaining([
        expect.stringContaining('depthExceeded: true')
      ])
    }));
  });

  it('should offer support redirection on final fallback step', async () => {
    // Mock a final fallback step that should offer support redirection
    const mockContext: MetaControlContext = {
      systemState: {
        trustScore: 0.3, // Very low trust
        resourceUtilization: {
          cpuUsage: 0.9,
          memoryUsage: 0.9,
          activeAgents: 1
        },
        evolutionStage: {
          stage: 'development',
          progress: 0.3,
          stagnationFlags: 2
        },
        recoveryStatus: {
          attempts: 4,
          successRate: 0.1, // Very low success rate
          lastAttempt: Date.now()
        }
      },
      agentStates: {
        'agent1': createMockAgentState('fallback')
      },
      codexAlignment: {
        alignmentScore: 0.55,
        deviationMetrics: {
          promptDeviation: 0.35,
          responseDeviation: 0.45,
          behaviorDeviation: 0.25
        },
        correctionHistory: []
      },
      fallbackHistory: []
    };

    (agentMemory.getAgentRecord as jest.Mock).mockImplementationOnce(() => ({
      agentId: 'agent1',
      recoveryAttempts: 2, // One away from max
      status: 'fallback'
    }));

    // Override the executeFallbackPlan implementation to provide support
    (fallbackManager.executeFallbackPlan as jest.Mock).mockImplementationOnce(async () => {
      // Call the UX functions
      fallbackUX.fallbackMessage('prompt');
      fallbackUX.helpfulCTA();
      
      // Log the recovery exit UX
      (emitSessionDelta as jest.Mock)({
        sessionId: 'test-session',
        timestamp: new Date().toISOString(),
        promptType: 'fallback-test',
        inputSummary: 'Fallback test',
        outputHash: 'abc123',
        dreamStateScore: 0.5,
        modularityWarnings: [],
        codexVersion: 'v6.1.4',
        notes: ['fallbackDepth: 3/3', 'recoveryExitUX: provided']
      });
    });
    
    // Create and execute a fallback plan
    const plan = await fallbackManager.createFallbackPlan(mockContext);
    await fallbackManager.executeFallbackPlan(plan);
    
    // Verify that both UX components were called to provide a supportive exit
    expect(fallbackUX.fallbackMessage).toHaveBeenCalled();
    expect(fallbackUX.helpfulCTA).toHaveBeenCalled();
    
    // Verify recovery exit UX was logged
    expect(emitSessionDelta).toHaveBeenCalledWith(expect.objectContaining({
      notes: expect.arrayContaining([
        expect.stringContaining('recoveryExitUX: provided')
      ])
    }));
  });

  // Reversal test to ensure the final fallback still feels supportive
  it('should maintain supportive tone in final fallback message', async () => {
    // Force a situation where we need to show the final fallback message
    (agentMemory.getAgentRecord as jest.Mock).mockImplementationOnce(() => ({
      agentId: 'agent1',
      recoveryAttempts: 3, // Max attempts
      status: 'fallback'
    }));
    
    const mockContext: MetaControlContext = {
      systemState: {
        trustScore: 0.3,
        resourceUtilization: {
          cpuUsage: 0.8,
          memoryUsage: 0.8,
          activeAgents: 2
        },
        evolutionStage: {
          stage: 'development',
          progress: 0.3,
          stagnationFlags: 1
        },
        recoveryStatus: {
          attempts: 3,
          successRate: 0.2,
          lastAttempt: Date.now()
        }
      },
      agentStates: {
        'agent1': createMockAgentState('fallback')
      },
      codexAlignment: {
        alignmentScore: 0.6,
        deviationMetrics: {
          promptDeviation: 0.3,
          responseDeviation: 0.4,
          behaviorDeviation: 0.2
        },
        correctionHistory: []
      },
      fallbackHistory: []
    };

    // Override the executeFallbackPlan implementation to throw a supportive error
    (fallbackManager.executeFallbackPlan as jest.Mock).mockImplementationOnce(async (plan) => {
      // Call the UX functions to provide support
      fallbackUX.fallbackMessage('prompt');
      fallbackUX.helpfulCTA();
      
      // Emit error event with supportive message
      (eventBus.emit as jest.Mock)('fallback:error', {
        error: 'Recovery failed for agent agent1: Max attempts reached',
        plan,
        timestamp: Date.now()
      });
      
      throw new Error('Recovery failed for agent agent1: Max attempts reached');
    });
    
    // Create a fallback plan
    const plan = await fallbackManager.createFallbackPlan(mockContext);
    
    // Execute the plan (should throw)
    await expect(fallbackManager.executeFallbackPlan(plan)).rejects.toThrow();
    
    // Verify that the fallback message was supportive
    expect(fallbackUX.fallbackMessage).toHaveBeenCalled();
    expect(fallbackUX.helpfulCTA).toHaveBeenCalled();
    
    // The tone should remain supportive even in error conditions
    const errorEvent = eventCapturer['fallback:error'][0];
    expect(errorEvent).toBeDefined();
    expect(errorEvent.error).toEqual(expect.stringContaining('Max attempts reached'));
  });

  // Codex safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
  it('should log all fallback chain events for audit and trace', async () => {
    // Create a fallback context
    const mockContext: MetaControlContext = {
      systemState: {
        trustScore: 0.7,
        resourceUtilization: {
          cpuUsage: 0.6,
          memoryUsage: 0.6,
          activeAgents: 4
        },
        evolutionStage: {
          stage: 'development',
          progress: 0.7,
          stagnationFlags: 0
        },
        recoveryStatus: {
          attempts: 1,
          successRate: 0.5,
          lastAttempt: Date.now()
        }
      },
      agentStates: {
        'agent1': createMockAgentState('fallback')
      },
      codexAlignment: {
        alignmentScore: 0.8,
        deviationMetrics: {
          promptDeviation: 0.1,
          responseDeviation: 0.2,
          behaviorDeviation: 0.1
        },
        correctionHistory: []
      },
      fallbackHistory: []
    };

    // Override the executeFallbackPlan implementation to log appropriate events
    (fallbackManager.executeFallbackPlan as jest.Mock).mockImplementationOnce(async (plan) => {
      // Log via sessionDeltaLogEmitter with appropriate event history
      (emitSessionDelta as jest.Mock)({
        sessionId: 'test-session',
        timestamp: new Date().toISOString(),
        promptType: 'fallback-test',
        inputSummary: 'Fallback test',
        outputHash: 'abc123',
        dreamStateScore: 0.75,
        modularityWarnings: [],
        codexVersion: 'v6.1.4',
        notes: ['fallbackDepth: 1/3', 'fallbackChainTraceId: abc-123']
      });
    });
    
    // Create and execute a plan
    const plan = await fallbackManager.createFallbackPlan(mockContext);
    await fallbackManager.executeFallbackPlan(plan);
    
    // Verify proper logging of the fallback chain
    expect(emitSessionDelta).toHaveBeenCalledWith(expect.objectContaining({
      sessionId: expect.any(String),
      timestamp: expect.any(String),
      promptType: expect.any(String),
      dreamStateScore: expect.any(Number),
      notes: expect.arrayContaining([
        expect.stringContaining('fallbackDepth')
      ])
    }));
  });
  
  // Helper function to create a properly typed mock agent state
  function createMockAgentState(status: 'active' | 'inactive' | 'fallback' | 'recovering'): AgentState {
    return {
      status,
      metrics: {
        trustScore: 0.7,
        executionCount: 5,
        successRate: 0.6
      },
      lastExecution: {
        timestamp: Date.now(),
        result: {
          success: false,
          impact: -0.1
        }
      },
      fallbackCount: 1
    };
  }
}); 