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

describe('FallbackManager', () => {
  let eventBus: EventBus;
  let agentMemory: AgentMemory;
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
    eventBus = new EventBus();
    agentMemory = new AgentMemory();
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

      await fallbackManager.executeFallbackPlan(plan);

      expect(eventBus.emit).toHaveBeenCalledWith('recovery:attempted', expect.any(Object));
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

      expect(eventBus.emit).toHaveBeenCalledWith('degradation:started', expect.any(Object));
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

      jest.spyOn(agentMemory, 'getAgentRecord').mockRejectedValue(new Error('Test error'));

      await fallbackManager.executeFallbackPlan(plan);

      expect(eventBus.emit).toHaveBeenCalledWith('fallback:error', expect.objectContaining({
        error: 'Test error'
      }));
    });
  });

  describe('event handling', () => {
    it('should handle fallback triggers', async () => {
      const event = {
        agentId: 'trust-restorer',
        reason: 'trust_violation'
      };

      await fallbackManager['handleFallbackTrigger'](event);

      expect(eventBus.emit).toHaveBeenCalledWith('fallback:started', expect.any(Object));
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
  });
}); 