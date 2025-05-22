/**
 * strategic_agents/strategic_agents.test.ts
 * 
 * Purpose:
 * Test suite for strategic agents, covering agent activation, strategy execution,
 * and system-wide coordination.
 */

import { EventBus } from '../utils/event-bus';
import { AgentMemory } from '../agent-oversight/agent-memory';
import { TrustScorer } from '../agents/trust-scorer/trust-scorer';
import { AgentMap } from './agent-map';
import { StrategyEngine } from './strategy-engine';
import { TrustRestorerAgent } from './agents/trust-restorer-agent';
import { RecoveryOptimizerAgent } from './agents/recovery-optimizer-agent';
import { EvolutionPathfinderAgent } from './agents/evolution-pathfinder-agent';
import { StrategyContext } from './strategic-agent-base';

// Mock implementations with proper typing
jest.mock('../utils/event-bus');
jest.mock('../agent-oversight/agent-memory');
jest.mock('../agents/trust-scorer/trust-scorer');

interface MockEventBus extends EventBus {
  emit: jest.Mock;
  on: jest.Mock;
  off: jest.Mock;
  once: jest.Mock;
  removeAllListeners: jest.Mock;
}

interface MockAgentMemory extends AgentMemory {
  getAllRecords: jest.Mock;
  updateTrustMetrics: jest.Mock;
  updateAgentRecord: jest.Mock;
  getAgentRecord: jest.Mock;
  recordTrustEvent: jest.Mock;
  cleanupOldRecords: jest.Mock;
  getSystemMetrics: jest.Mock;
  updateSystemMetrics: jest.Mock;
}

interface MockTrustScorer extends TrustScorer {
  calculateTrustScore: jest.Mock;
  trackTrustEvent: jest.Mock;
  getTrustHistory: jest.Mock;
  getTrustTrend: jest.Mock;
  getTrustVolatility: jest.Mock;
  getTrustStability: jest.Mock;
  validateTrustThreshold: jest.Mock;
}

describe('Strategic Agents Module', () => {
  let eventBus: MockEventBus;
  let agentMemory: MockAgentMemory;
  let trustScorer: MockTrustScorer;
  let agentMap: AgentMap;
  let strategyEngine: StrategyEngine;

  const createTestContext = (overrides: Partial<StrategyContext> = {}): StrategyContext => ({
    systemMetrics: {
      trustScore: 0.4,
      trustVolatility: 0.2,
      recoveryAttempts: 5,
      evolutionTriggers: 2,
      stagnationFlags: 1,
      ...(overrides.systemMetrics || {})
    },
    agentMetrics: {
      'agent-1': {
        trustScore: 0.5,
        recoveryAttempts: 2,
        patternSubstitutions: 1,
        ...(overrides.agentMetrics?.['agent-1'] || {})
      }
    },
    resourceMetrics: {
      cpuUsage: 0.5,
      memoryUsage: 0.6,
      activeAgents: 2,
      ...(overrides.resourceMetrics || {})
    }
  });

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Initialize mocks with proper typing
    eventBus = {
      emit: jest.fn().mockResolvedValue(undefined),
      on: jest.fn(),
      off: jest.fn(),
      once: jest.fn(),
      removeAllListeners: jest.fn()
    } as unknown as MockEventBus;

    agentMemory = {
      getAllRecords: jest.fn().mockResolvedValue({
        'agent-1': {
          avgTrustDelta: 0.5,
          recoveryAttempts: 2,
          patternSubstitutions: 1,
          trustVolatility: 0.1,
          recentTriggers: []
        },
        'agent-2': {
          avgTrustDelta: 0.3,
          recoveryAttempts: 3,
          patternSubstitutions: 2,
          trustVolatility: 0.2,
          recentTriggers: []
        }
      }),
      updateTrustMetrics: jest.fn().mockResolvedValue(undefined),
      updateAgentRecord: jest.fn().mockResolvedValue(undefined),
      getAgentRecord: jest.fn().mockResolvedValue({
        avgTrustDelta: 0.5,
        recoveryAttempts: 2,
        patternSubstitutions: 1,
        trustVolatility: 0.1,
        recentTriggers: []
      }),
      recordTrustEvent: jest.fn().mockResolvedValue(undefined),
      cleanupOldRecords: jest.fn().mockResolvedValue(undefined),
      getSystemMetrics: jest.fn().mockResolvedValue({
        trustScore: 0.8,
        resourceUsage: 0.6,
        alignmentScore: 0.9
      }),
      updateSystemMetrics: jest.fn().mockResolvedValue(undefined)
    } as unknown as MockAgentMemory;

    trustScorer = {
      calculateTrustScore: jest.fn().mockResolvedValue(0.5),
      trackTrustEvent: jest.fn().mockResolvedValue(undefined),
      getTrustHistory: jest.fn().mockResolvedValue([]),
      getTrustTrend: jest.fn().mockResolvedValue({ trend: 'stable', averageDelta: 0 }),
      getTrustVolatility: jest.fn().mockResolvedValue(0.1),
      getTrustStability: jest.fn().mockResolvedValue(0.95),
      validateTrustThreshold: jest.fn().mockResolvedValue(true)
    } as unknown as MockTrustScorer;

    agentMap = new AgentMap(eventBus, agentMemory, trustScorer);
    strategyEngine = new StrategyEngine(eventBus, agentMemory, trustScorer, agentMap);
  });

  describe('TrustRestorerAgent', () => {
    let agent: TrustRestorerAgent;

    beforeEach(() => {
      agent = new TrustRestorerAgent(eventBus, agentMemory, trustScorer);
    });

    describe('Activation Conditions', () => {
      it('should activate when trust score is below threshold', () => {
        const context = createTestContext({
          systemMetrics: { 
            trustScore: 0.4,
            trustVolatility: 0.2,
            recoveryAttempts: 5,
            evolutionTriggers: 2,
            stagnationFlags: 1
          }
        });
        expect(agent.shouldActivate(context)).toBe(true);
      });

      it('should activate when trust volatility is high', () => {
        const context = createTestContext({
          systemMetrics: { 
            trustScore: 0.4,
            trustVolatility: 0.3,
            recoveryAttempts: 5,
            evolutionTriggers: 2,
            stagnationFlags: 1
          }
        });
        expect(agent.shouldActivate(context)).toBe(true);
      });

      it('should activate when recovery attempts exceed threshold', () => {
        const context = createTestContext({
          systemMetrics: { 
            trustScore: 0.4,
            trustVolatility: 0.2,
            recoveryAttempts: 4,
            evolutionTriggers: 2,
            stagnationFlags: 1
          }
        });
        expect(agent.shouldActivate(context)).toBe(true);
      });

      it('should not activate when all metrics are healthy', () => {
        const context = createTestContext({
          systemMetrics: {
            trustScore: 0.8,
            trustVolatility: 0.1,
            recoveryAttempts: 1,
            evolutionTriggers: 2,
            stagnationFlags: 1
          }
        });
        expect(agent.shouldActivate(context)).toBe(false);
      });
    });

    describe('Strategy Execution', () => {
      it('should execute trust restoration strategy successfully', async () => {
        const context = createTestContext();
        const result = await agent.executeStrategy(context);

        expect(result.success).toBe(true);
        expect(result.actions).toHaveLength(1);
        expect(result.actions[0].type).toBe('trust_restoration');
        expect(result.metrics.trustImpact).toBeGreaterThan(0);
      });

      it('should handle execution errors gracefully', async () => {
        const context = createTestContext();
        (agentMemory.updateTrustMetrics as jest.Mock).mockRejectedValue(new Error('Test error'));

        await expect(agent.executeStrategy(context)).rejects.toThrow('Test error');
        expect(eventBus.emit).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'strategy_error',
            data: expect.objectContaining({
              agent: 'trust_restorer',
              error: 'Test error'
            })
          }),
          'high'
        );
      });

      it('should record metrics after successful execution', async () => {
        const context = createTestContext();
        await agent.executeStrategy(context);

        expect(agentMemory.updateTrustMetrics).toHaveBeenCalledWith(
          'trust_restorer',
          expect.objectContaining({
            avgTrustDelta: expect.any(Number),
            trustVolatility: expect.any(Number)
          })
        );
      });
    });
  });

  describe('RecoveryOptimizerAgent', () => {
    let agent: RecoveryOptimizerAgent;

    beforeEach(() => {
      agent = new RecoveryOptimizerAgent(eventBus, agentMemory, trustScorer);
    });

    describe('Activation Conditions', () => {
      it('should activate when recovery attempts are high', () => {
        const context = createTestContext({
          systemMetrics: { 
            trustScore: 0.4,
            trustVolatility: 0.2,
            recoveryAttempts: 4,
            evolutionTriggers: 2,
            stagnationFlags: 1
          }
        });
        expect(agent.shouldActivate(context)).toBe(true);
      });

      it('should not activate when recovery attempts are low', () => {
        const context = createTestContext({
          systemMetrics: {
            trustScore: 0.4,
            trustVolatility: 0.2,
            recoveryAttempts: 1,
            evolutionTriggers: 2,
            stagnationFlags: 1
          }
        });
        expect(agent.shouldActivate(context)).toBe(false);
      });
    });

    describe('Strategy Execution', () => {
      it('should optimize recovery parameters successfully', async () => {
        const context = createTestContext();
        const result = await agent.executeStrategy(context);

        expect(result.success).toBe(true);
        expect(result.actions).toHaveLength(1);
        expect(result.actions[0].type).toBe('recovery_optimization');
        expect(result.metrics.trustImpact).toBeGreaterThan(0);
      });

      it('should handle resource constraints', async () => {
        const context = createTestContext({
          resourceMetrics: {
            cpuUsage: 0.9,
            memoryUsage: 0.9,
            activeAgents: 5
          }
        });
        const result = await agent.executeStrategy(context);

        expect(result.success).toBe(true);
        expect(result.metrics.resourceImpact).toBeGreaterThan(0.8);
      });
    });
  });

  describe('EvolutionPathfinderAgent', () => {
    let agent: EvolutionPathfinderAgent;

    beforeEach(() => {
      agent = new EvolutionPathfinderAgent(eventBus, agentMemory, trustScorer);
    });

    describe('Activation Conditions', () => {
      it('should activate when stagnation is detected', () => {
        const context = createTestContext({
          systemMetrics: { 
            trustScore: 0.4,
            trustVolatility: 0.2,
            recoveryAttempts: 5,
            evolutionTriggers: 2,
            stagnationFlags: 2
          }
        });
        expect(agent.shouldActivate(context)).toBe(true);
      });

      it('should activate when evolution triggers are low', () => {
        const context = createTestContext({
          systemMetrics: { 
            trustScore: 0.4,
            trustVolatility: 0.2,
            recoveryAttempts: 5,
            evolutionTriggers: 1,
            stagnationFlags: 1
          }
        });
        expect(agent.shouldActivate(context)).toBe(true);
      });

      it('should not activate when system is evolving normally', () => {
        const context = createTestContext({
          systemMetrics: {
            trustScore: 0.8,
            trustVolatility: 0.1,
            recoveryAttempts: 2,
            evolutionTriggers: 3,
            stagnationFlags: 0
          }
        });
        expect(agent.shouldActivate(context)).toBe(false);
      });
    });

    describe('Strategy Execution', () => {
      it('should propose evolution paths successfully', async () => {
        const context = createTestContext();
        const result = await agent.executeStrategy(context);

        expect(result.success).toBe(true);
        expect(result.actions).toHaveLength(1);
        expect(result.actions[0].type).toBe('evolution_path');
        expect(result.metrics.trustImpact).toBeGreaterThan(0);
      });

      it('should select optimal path based on context', async () => {
        const context = createTestContext({
          systemMetrics: {
            trustScore: 0.3,
            trustVolatility: 0.2,
            recoveryAttempts: 5,
            evolutionTriggers: 2,
            stagnationFlags: 2
          }
        });
        const result = await agent.executeStrategy(context);

        expect(result.actions[0].parameters.path.priority).toBeGreaterThan(0.5);
      });
    });
  });

  describe('StrategyEngine', () => {
    describe('Context Processing', () => {
      it('should update context periodically', async () => {
        jest.useFakeTimers();
        await strategyEngine['updateContext']();
        expect(agentMemory.getAllRecords).toHaveBeenCalled();
        jest.useRealTimers();
      });

      it('should route context to appropriate agents', async () => {
        const context = createTestContext();
        await strategyEngine['updateContext']();
        await strategyEngine['processContext']();

        expect(eventBus.emit).toHaveBeenCalledWith(
          'strategy:context-updated',
          expect.objectContaining({
            metrics: expect.any(Object)
          })
        );
      });
    });

    describe('Strategy Execution', () => {
      it('should handle strategy execution results', async () => {
        const result = {
          success: true,
          actions: [{
            type: 'test:action',
            target: 'agent-1',
            parameters: { test: true }
          }],
          metrics: {
            trustImpact: 0.1,
            resourceImpact: 0.2,
            executionTime: 100
          }
        };

        await strategyEngine['handleStrategyResult']('test-agent', result);

        expect(eventBus.emit).toHaveBeenCalledWith(
          'strategy:action:test:action',
          expect.objectContaining({
            agentId: 'test-agent',
            action: result.actions[0]
          })
        );
      });

      it('should handle strategy failures', async () => {
        const result = {
          success: false,
          actions: [],
          metrics: {
            trustImpact: 0,
            resourceImpact: 0,
            executionTime: 100
          }
        };

        await strategyEngine['handleStrategyResult']('test-agent', result);

        expect(eventBus.emit).toHaveBeenCalledWith(
          'strategy:failed',
          expect.objectContaining({
            agentId: 'test-agent',
            result
          })
        );
      });
    });

    describe('Event Handling', () => {
      it('should handle trust events', async () => {
        await strategyEngine['handleTrustSignal']({});
        expect(agentMemory.getAllRecords).toHaveBeenCalled();
      });

      it('should handle recovery events', async () => {
        await strategyEngine['handleRecoveryAttempt']({});
        expect(agentMemory.getAllRecords).toHaveBeenCalled();
      });

      it('should handle evolution events', async () => {
        await strategyEngine['handleEvolutionTrigger']({});
        expect(agentMemory.getAllRecords).toHaveBeenCalled();
      });
    });
  });
}); 