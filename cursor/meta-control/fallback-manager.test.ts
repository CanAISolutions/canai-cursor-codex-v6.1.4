/**
 * meta-control/fallback-manager.test.ts
 * 
 * Purpose:
 * Tests the FallbackManager's ability to handle system recovery and fallback strategies.
 * Verifies trust-safe fallback execution and recovery mechanisms.
 */

import { EventBus } from '../utils/event-bus';
import { AgentMemory } from '../agent-oversight/agent-memory';
import { FallbackManager, FallbackPlan } from './fallback-manager';
import { MetaControlContext } from './meta-controller';

// Mock interfaces for better type safety
interface MockEventBus extends EventBus {
  publish: jest.Mock;
  on: jest.Mock;
}

interface MockAgentMemory extends AgentMemory {
  getAgentRecord: jest.Mock;
  updateTrustMetrics: jest.Mock;
}

describe('FallbackManager', () => {
  let eventBus: MockEventBus;
  let agentMemory: MockAgentMemory;
  let fallbackManager: FallbackManager;

  const createTestContext = (): MetaControlContext => ({
    systemState: {
      trustScore: 0.8,
      resourceUtilization: {
        cpuUsage: 0.5,
        memoryUsage: 0.6,
        activeAgents: 2
      },
      evolutionStage: {
        stage: 'stable',
        progress: 0.7,
        stagnationFlags: 0
      },
      recoveryStatus: {
        attempts: 0,
        successRate: 1.0,
        lastAttempt: Date.now()
      }
    },
    agentStates: {
      'trust-restorer': {
        status: 'fallback',
        metrics: {
          trustScore: 0.85,
          executionCount: 10,
          successRate: 0.9
        },
        lastExecution: {
          timestamp: Date.now(),
          result: {
            success: true,
            impact: 0.1
          }
        },
        fallbackCount: 1
      }
    },
    codexAlignment: {
      alignmentScore: 0.9,
      deviationMetrics: {
        promptDeviation: 0.1,
        responseDeviation: 0.1,
        behaviorDeviation: 0.1
      },
      correctionHistory: []
    },
    fallbackHistory: []
  });

  beforeEach(() => {
    eventBus = {
      publish: jest.fn(),
      on: jest.fn()
    } as unknown as MockEventBus;

    agentMemory = {
      getAgentRecord: jest.fn(),
      updateTrustMetrics: jest.fn()
    } as unknown as MockAgentMemory;

    fallbackManager = new FallbackManager(eventBus, agentMemory);
  });

  describe('createFallbackPlan', () => {
    it('should create a plan for unhealthy agents', async () => {
      const context = createTestContext();
      const plan = await fallbackManager.createFallbackPlan(context);

      expect(plan.actions).toContainEqual(expect.objectContaining({
        type: 'recovery',
        target: 'trust-restorer'
      }));
    });

    it('should include degradation actions for high resource usage', async () => {
      const context = createTestContext();
      context.systemState.resourceUtilization.cpuUsage = 0.9;
      
      const plan = await fallbackManager.createFallbackPlan(context);

      expect(plan.actions).toContainEqual(expect.objectContaining({
        type: 'degradation',
        target: 'system'
      }));
    });

    it('should calculate correct priority based on system state', async () => {
      const context = createTestContext();
      context.systemState.trustScore = 0.5;
      context.systemState.resourceUtilization.cpuUsage = 0.9;
      
      const plan = await fallbackManager.createFallbackPlan(context);

      expect(plan.priority).toBeGreaterThan(5);
    });

    it('should handle multiple unhealthy agents', async () => {
      const context = createTestContext();
      context.agentStates['trust-restorer'].status = 'fallback';
      context.agentStates['resource-monitor'] = {
        status: 'recovering',
        metrics: {
          trustScore: 0.75,
          executionCount: 5,
          successRate: 0.8
        },
        lastExecution: {
          timestamp: Date.now(),
          result: {
            success: true,
            impact: 0.05
          }
        },
        fallbackCount: 0
      };

      const plan = await fallbackManager.createFallbackPlan(context);

      expect(plan.actions).toHaveLength(2);
      expect(plan.actions).toContainEqual(expect.objectContaining({
        type: 'recovery',
        target: 'trust-restorer'
      }));
      expect(plan.actions).toContainEqual(expect.objectContaining({
        type: 'recovery',
        target: 'resource-monitor'
      }));
    });

    it('should cap priority at maximum value', async () => {
      const context = createTestContext();
      context.systemState.trustScore = 0.3;
      context.systemState.resourceUtilization.cpuUsage = 0.95;
      context.systemState.resourceUtilization.memoryUsage = 0.95;
      context.systemState.recoveryStatus.successRate = 0.2;

      const plan = await fallbackManager.createFallbackPlan(context);

      expect(plan.priority).toBeLessThanOrEqual(9);
    });
  });

  describe('executeFallbackPlan', () => {
    it('should execute recovery actions', async () => {
      const plan: FallbackPlan = {
        priority: 5,
        actions: [{
          type: 'recovery',
          target: 'trust-restorer',
          parameters: {
            maxAttempts: 3,
            cooldown: 1000
          }
        }],
        expectedOutcome: {
          trustImpact: 0.2,
          resourceImpact: 0.1,
          recoveryTime: 1000
        }
      };

      agentMemory.getAgentRecord.mockResolvedValue({
        recoveryAttempts: 0
      });

      await fallbackManager.executeFallbackPlan(plan);

      expect(eventBus.publish).toHaveBeenCalledWith('recovery:attempted', expect.any(Object));
      expect(agentMemory.updateTrustMetrics).toHaveBeenCalled();
    });

    it('should execute degradation actions', async () => {
      const plan: FallbackPlan = {
        priority: 5,
        actions: [{
          type: 'degradation',
          target: 'system',
          parameters: {
            targetUtilization: 0.5,
            gracefulShutdown: true
          }
        }],
        expectedOutcome: {
          trustImpact: 0.1,
          resourceImpact: -0.3,
          recoveryTime: 1000
        }
      };

      await fallbackManager.executeFallbackPlan(plan);

      expect(eventBus.publish).toHaveBeenCalledWith('degradation:started', expect.any(Object));
    });

    it('should handle execution errors gracefully', async () => {
      const plan: FallbackPlan = {
        priority: 5,
        actions: [{
          type: 'recovery',
          target: 'trust-restorer',
          parameters: {
            maxAttempts: 3,
            cooldown: 1000
          }
        }],
        expectedOutcome: {
          trustImpact: 0.2,
          resourceImpact: 0.1,
          recoveryTime: 1000
        }
      };

      agentMemory.getAgentRecord.mockRejectedValue(new Error('Test error'));

      await fallbackManager.executeFallbackPlan(plan);

      expect(eventBus.publish).toHaveBeenCalledWith('fallback:error', expect.objectContaining({
        error: 'Test error'
      }));
    });

    it('should handle max recovery attempts reached', async () => {
      const plan: FallbackPlan = {
        priority: 5,
        actions: [{
          type: 'recovery',
          target: 'trust-restorer',
          parameters: {
            maxAttempts: 3,
            cooldown: 1000
          }
        }],
        expectedOutcome: {
          trustImpact: 0.2,
          resourceImpact: 0.1,
          recoveryTime: 1000
        }
      };

      agentMemory.getAgentRecord.mockResolvedValue({
        recoveryAttempts: 3
      });

      await fallbackManager.executeFallbackPlan(plan);

      expect(eventBus.publish).toHaveBeenCalledWith('fallback:error', expect.objectContaining({
        error: expect.stringContaining('Max attempts reached')
      }));
    });

    it('should execute multiple actions in sequence', async () => {
      const plan: FallbackPlan = {
        priority: 5,
        actions: [
          {
            type: 'recovery',
            target: 'trust-restorer',
            parameters: {
              maxAttempts: 3,
              cooldown: 1000
            }
          },
          {
            type: 'degradation',
            target: 'system',
            parameters: {
              targetUtilization: 0.5,
              gracefulShutdown: true
            }
          }
        ],
        expectedOutcome: {
          trustImpact: 0.3,
          resourceImpact: -0.2,
          recoveryTime: 2000
        }
      };

      agentMemory.getAgentRecord.mockResolvedValue({
        recoveryAttempts: 0
      });

      await fallbackManager.executeFallbackPlan(plan);

      expect(eventBus.publish).toHaveBeenCalledWith('recovery:attempted', expect.any(Object));
      expect(eventBus.publish).toHaveBeenCalledWith('degradation:started', expect.any(Object));
      expect(eventBus.publish).toHaveBeenCalledWith('fallback:completed', expect.any(Object));
    });
  });

  describe('event handling', () => {
    it('should handle fallback triggers', async () => {
      const event = {
        agentId: 'trust-restorer',
        reason: 'trust_violation'
      };

      await fallbackManager['handleFallbackTrigger'](event);

      expect(eventBus.publish).toHaveBeenCalledWith('fallback:started', expect.any(Object));
    });

    it('should handle recovery completion', async () => {
      const event = {
        agentId: 'trust-restorer',
        success: true
      };

      await fallbackManager['handleRecoveryComplete'](event);

      expect(agentMemory.updateTrustMetrics).toHaveBeenCalledWith(
        'trust-restorer',
        expect.any(Object)
      );
    });

    it('should handle recovery failure', async () => {
      const event = {
        agentId: 'trust-restorer',
        success: false,
        error: 'Recovery failed'
      };

      await fallbackManager['handleRecoveryComplete'](event);

      expect(eventBus.publish).toHaveBeenCalledWith('fallback:error', expect.objectContaining({
        error: 'Recovery failed'
      }));
    });
  });
}); 