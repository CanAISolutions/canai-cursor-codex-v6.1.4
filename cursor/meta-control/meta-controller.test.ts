/**
 * meta-control/meta-controller.test.ts
 * 
 * Purpose:
 * Tests the MetaController's ability to orchestrate agent selection, fallback management,
 * and Codex alignment. Verifies trust-safe decision making and system health monitoring.
 */

import { EventBus } from '../utils/event-bus';
import { AgentMemory } from '../agent-oversight/agent-memory';
import { TrustScorer } from '../agents/trust-scorer/trust-scorer';
import { StrategyEngine } from '../strategic_agents/strategy-engine';
import { AgentMap } from '../strategic_agents/agent-map';
import { MetaController, MetaControlContext } from './meta-controller';
import { FallbackManager } from './fallback-manager';
import { AgentSelector } from './agent-selector';
import { CodexAligner } from './codex-aligner';

describe('MetaController', () => {
  let eventBus: EventBus;
  let agentMemory: AgentMemory;
  let trustScorer: TrustScorer;
  let strategyEngine: StrategyEngine;
  let agentMap: AgentMap;
  let fallbackManager: FallbackManager;
  let agentSelector: AgentSelector;
  let codexAligner: CodexAligner;
  let metaController: MetaController;

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
        status: 'active',
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
        fallbackCount: 0
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
    trustScorer = new TrustScorer(eventBus);
    strategyEngine = new StrategyEngine(eventBus, agentMemory, trustScorer, agentMap);
    agentMap = new AgentMap(eventBus, agentMemory, trustScorer);
    fallbackManager = new FallbackManager(eventBus, agentMemory);
    agentSelector = new AgentSelector(eventBus, agentMemory);
    codexAligner = new CodexAligner(eventBus, agentMemory);
    metaController = new MetaController(
      eventBus,
      agentMemory,
      trustScorer,
      strategyEngine,
      agentMap,
      fallbackManager,
      agentSelector,
      codexAligner
    );
  });

  describe('processContext', () => {
    it('should process healthy and aligned context', async () => {
      const context = createTestContext();
      await metaController.processContext(context);
      // Verify no fallback or alignment actions were triggered
      expect(eventBus.emit).not.toHaveBeenCalledWith('fallback:triggered');
      expect(eventBus.emit).not.toHaveBeenCalledWith('alignment:required');
    });

    it('should handle unhealthy system state', async () => {
      const context = createTestContext();
      context.systemState.trustScore = 0.5; // Below threshold
      
      await metaController.processContext(context);
      
      expect(eventBus.emit).toHaveBeenCalledWith('fallback:triggered');
    });

    it('should handle Codex misalignment', async () => {
      const context = createTestContext();
      context.codexAlignment.alignmentScore = 0.5; // Below threshold
      
      await metaController.processContext(context);
      
      expect(eventBus.emit).toHaveBeenCalledWith('alignment:required');
    });
  });

  describe('event handling', () => {
    it('should handle strategy completion', async () => {
      const event = {
        agentId: 'trust-restorer',
        result: { success: true, impact: 0.1 }
      };
      
      await metaController['handleStrategyComplete'](event);
      
      expect(agentMemory.updateAgentRecord).toHaveBeenCalledWith(
        'trust-restorer',
        expect.objectContaining({
          status: 'active',
          metrics: expect.objectContaining({
            successRate: expect.any(Number)
          })
        })
      );
    });

    it('should handle strategy failure', async () => {
      const event = {
        agentId: 'trust-restorer',
        error: 'Test error'
      };
      
      await metaController['handleStrategyFailure'](event);
      
      expect(agentMemory.updateAgentRecord).toHaveBeenCalledWith(
        'trust-restorer',
        expect.objectContaining({
          status: 'fallback',
          fallbackCount: expect.any(Number)
        })
      );
    });

    it('should handle trust violations', async () => {
      const event = {
        agentId: 'trust-restorer',
        violation: { type: 'threshold', value: 0.5 }
      };
      
      await metaController['handleTrustViolation'](event);
      
      expect(eventBus.emit).toHaveBeenCalledWith('fallback:triggered');
    });

    it('should handle resource warnings', async () => {
      const event = {
        type: 'high_utilization',
        metrics: { cpu: 0.9, memory: 0.8 }
      };
      
      await metaController['handleResourceWarning'](event);
      
      expect(eventBus.emit).toHaveBeenCalledWith('fallback:triggered');
    });
  });

  describe('error handling', () => {
    it('should handle processing errors gracefully', async () => {
      const context = createTestContext();
      const error = new Error('Test error');
      
      jest.spyOn(agentSelector, 'selectAgents').mockRejectedValue(error);
      
      await metaController.processContext(context);
      
      expect(eventBus.emit).toHaveBeenCalledWith('meta:error', expect.objectContaining({
        error: 'Test error'
      }));
    });
  });
}); 