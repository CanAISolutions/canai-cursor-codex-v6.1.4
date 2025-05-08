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

// Mock dependencies
jest.mock('../utils/event-bus');
jest.mock('../agent-oversight/agent-memory');
jest.mock('../agents/trust-scorer/trust-scorer');
jest.mock('./codex-aligner');
jest.mock('./fallback-manager');
jest.mock('./agent-selector');

// Define mock interfaces
interface MockEventBus {
  publish: jest.Mock;
  on: jest.Mock;
  off: jest.Mock;
  once: jest.Mock;
  removeAllListeners: jest.Mock;
}

interface MockAgentMemory {
  getAgentMetrics: jest.Mock;
  updateAgentMetrics: jest.Mock;
  getSystemMetrics: jest.Mock;
  updateSystemMetrics: jest.Mock;
  updateAgentRecord: jest.Mock;
  recordTrustEvent: jest.Mock;
  recordRecoveryAttempt: jest.Mock;
  cleanupOldRecords: jest.Mock;
}

interface MockTrustScorer {
  calculateTrustScore: jest.Mock;
  validateTrustThreshold: jest.Mock;
  getTrustMetrics: jest.Mock;
  getTrustHistory: jest.Mock;
  getTrustTrend: jest.Mock;
  getTrustVolatility: jest.Mock;
  getTrustStability: jest.Mock;
}

interface MockCodexAligner {
  validateAlignment: jest.Mock;
  getAlignmentMetrics: jest.Mock;
  enforceAlignment: jest.Mock;
  validatePromptAlignment: jest.Mock;
  validateResponseAlignment: jest.Mock;
  validateBehaviorAlignment: jest.Mock;
}

interface MockFallbackManager {
  handleFallback: jest.Mock;
  getFallbackMetrics: jest.Mock;
  validateFallback: jest.Mock;
  createFallbackPlan: jest.Mock;
  executeFallbackPlan: jest.Mock;
  validateFallbackPlan: jest.Mock;
}

interface MockAgentSelector {
  selectAgent: jest.Mock;
  validateSelection: jest.Mock;
  getSelectionMetrics: jest.Mock;
  selectAgents: jest.Mock;
  validateAgentCapabilities: jest.Mock;
  validateAgentAvailability: jest.Mock;
}

describe('MetaController', () => {
  let eventBus: MockEventBus;
  let agentMemory: MockAgentMemory;
  let trustScorer: MockTrustScorer;
  let strategyEngine: StrategyEngine;
  let agentMap: AgentMap;
  let fallbackManager: MockFallbackManager;
  let agentSelector: MockAgentSelector;
  let codexAligner: MockCodexAligner;
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
    // Initialize mocks
    eventBus = {
      publish: jest.fn().mockResolvedValue(undefined),
      on: jest.fn(),
      off: jest.fn(),
      once: jest.fn(),
      removeAllListeners: jest.fn()
    };

    agentMemory = {
      getAgentMetrics: jest.fn().mockResolvedValue({
        trustScore: 0.8,
        executionCount: 10,
        successRate: 0.9
      }),
      updateAgentMetrics: jest.fn().mockResolvedValue(undefined),
      getSystemMetrics: jest.fn().mockResolvedValue({
        trustScore: 0.8,
        resourceUsage: 0.6,
        alignmentScore: 0.9
      }),
      updateSystemMetrics: jest.fn().mockResolvedValue(undefined),
      updateAgentRecord: jest.fn().mockResolvedValue(undefined),
      recordTrustEvent: jest.fn().mockResolvedValue(undefined),
      recordRecoveryAttempt: jest.fn().mockResolvedValue(undefined),
      cleanupOldRecords: jest.fn().mockResolvedValue(undefined)
    };

    trustScorer = {
      calculateTrustScore: jest.fn().mockResolvedValue(0.8),
      validateTrustThreshold: jest.fn().mockResolvedValue(true),
      getTrustMetrics: jest.fn().mockResolvedValue({
        currentScore: 0.8,
        volatility: 0.1,
        trend: 'stable'
      }),
      getTrustHistory: jest.fn().mockResolvedValue([]),
      getTrustTrend: jest.fn().mockResolvedValue('stable'),
      getTrustVolatility: jest.fn().mockResolvedValue(0.1),
      getTrustStability: jest.fn().mockResolvedValue(0.9)
    };

    codexAligner = {
      validateAlignment: jest.fn().mockResolvedValue(true),
      getAlignmentMetrics: jest.fn().mockResolvedValue({
        alignmentScore: 0.9,
        deviationMetrics: {
          promptDeviation: 0.1,
          responseDeviation: 0.1,
          behaviorDeviation: 0.1
        }
      }),
      enforceAlignment: jest.fn().mockResolvedValue(true),
      validatePromptAlignment: jest.fn().mockResolvedValue(true),
      validateResponseAlignment: jest.fn().mockResolvedValue(true),
      validateBehaviorAlignment: jest.fn().mockResolvedValue(true)
    };

    fallbackManager = {
      handleFallback: jest.fn().mockResolvedValue(undefined),
      getFallbackMetrics: jest.fn().mockResolvedValue({
        totalFallbacks: 0,
        successRate: 1.0
      }),
      validateFallback: jest.fn().mockResolvedValue(true),
      createFallbackPlan: jest.fn().mockResolvedValue({
        steps: [],
        priority: 'high'
      }),
      executeFallbackPlan: jest.fn().mockResolvedValue(true),
      validateFallbackPlan: jest.fn().mockResolvedValue(true)
    };

    agentSelector = {
      selectAgent: jest.fn().mockResolvedValue('trust-restorer'),
      validateSelection: jest.fn().mockResolvedValue(true),
      getSelectionMetrics: jest.fn().mockResolvedValue({
        totalSelections: 10,
        successRate: 0.9
      }),
      selectAgents: jest.fn().mockResolvedValue(['trust-restorer']),
      validateAgentCapabilities: jest.fn().mockResolvedValue(true),
      validateAgentAvailability: jest.fn().mockResolvedValue(true)
    };

    agentMap = new AgentMap(
      eventBus as unknown as EventBus,
      agentMemory as unknown as AgentMemory,
      trustScorer as unknown as TrustScorer
    );

    strategyEngine = new StrategyEngine(
      eventBus as unknown as EventBus,
      agentMemory as unknown as AgentMemory,
      trustScorer as unknown as TrustScorer,
      agentMap
    );

    metaController = new MetaController(
      eventBus as unknown as EventBus,
      agentMemory as unknown as AgentMemory,
      trustScorer as unknown as TrustScorer,
      strategyEngine,
      agentMap,
      fallbackManager as unknown as FallbackManager,
      agentSelector as unknown as AgentSelector,
      codexAligner as unknown as CodexAligner
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('processContext', () => {
    it('should process healthy and aligned context', async () => {
      const context = createTestContext();
      await metaController.processContext(context);
      // Verify no fallback or alignment actions were triggered
      expect(eventBus.publish).not.toHaveBeenCalledWith('fallback:triggered', expect.any(Object), 'high');
      expect(eventBus.publish).not.toHaveBeenCalledWith('alignment:required', expect.any(Object), 'high');
    });

    it('should handle unhealthy system state', async () => {
      const context = createTestContext();
      context.systemState.trustScore = 0.5; // Below threshold
      
      await metaController.processContext(context);
      
      expect(eventBus.publish).toHaveBeenCalledWith(
        'fallback:triggered',
        expect.objectContaining({
          type: 'trust',
          timestamp: expect.any(String),
          data: expect.objectContaining({
            currentScore: 0.5,
            threshold: expect.any(Number)
          })
        }),
        'high'
      );
    });

    it('should handle Codex misalignment', async () => {
      const context = createTestContext();
      context.codexAlignment.alignmentScore = 0.5; // Below threshold
      
      await metaController.processContext(context);
      
      expect(eventBus.publish).toHaveBeenCalledWith(
        'alignment:required',
        expect.objectContaining({
          type: 'codex',
          timestamp: expect.any(String),
          data: expect.objectContaining({
            currentScore: 0.5,
            threshold: expect.any(Number)
          })
        }),
        'high'
      );
    });

    it('should handle processing errors gracefully', async () => {
      const context = createTestContext();
      const error = new Error('Test error');
      
      agentSelector.selectAgents.mockRejectedValueOnce(error);
      
      await metaController.processContext(context);
      
      expect(eventBus.publish).toHaveBeenCalledWith(
        'meta:error',
        expect.objectContaining({
          type: 'processing',
          timestamp: expect.any(String),
          data: expect.objectContaining({
            error: 'Test error',
            context: expect.any(Object)
          })
        }),
        'high'
      );
    });
  });

  describe('event handling', () => {
    it('should handle strategy completion', async () => {
      const event = {
        agentId: 'trust-restorer',
        result: { success: true, impact: 0.1 },
        timestamp: new Date().toISOString()
      };
      
      await metaController['handleStrategyComplete'](event);
      
      expect(agentMemory.updateAgentRecord).toHaveBeenCalledWith(
        'trust-restorer',
        expect.objectContaining({
          status: 'active',
          metrics: expect.objectContaining({
            successRate: expect.any(Number)
          }),
          lastExecution: expect.objectContaining({
            timestamp: expect.any(String),
            result: expect.any(Object)
          })
        })
      );
    });

    it('should handle strategy failure', async () => {
      const event = {
        agentId: 'trust-restorer',
        error: 'Test error',
        timestamp: new Date().toISOString()
      };
      
      await metaController['handleStrategyFailure'](event);
      
      expect(agentMemory.updateAgentRecord).toHaveBeenCalledWith(
        'trust-restorer',
        expect.objectContaining({
          status: 'fallback',
          fallbackCount: expect.any(Number),
          lastExecution: expect.objectContaining({
            timestamp: expect.any(String),
            error: 'Test error'
          })
        })
      );
    });

    it('should handle trust violations', async () => {
      const event = {
        agentId: 'trust-restorer',
        violation: { type: 'threshold', value: 0.5 },
        timestamp: new Date().toISOString()
      };
      
      await metaController['handleTrustViolation'](event);
      
      expect(eventBus.publish).toHaveBeenCalledWith(
        'fallback:triggered',
        expect.objectContaining({
          type: 'trust',
          timestamp: expect.any(String),
          data: expect.objectContaining({
            agentId: 'trust-restorer',
            violation: expect.any(Object)
          })
        }),
        'high'
      );
    });

    it('should handle resource warnings', async () => {
      const event = {
        type: 'high_utilization',
        metrics: { cpu: 0.9, memory: 0.8 },
        timestamp: new Date().toISOString()
      };
      
      await metaController['handleResourceWarning'](event);
      
      expect(eventBus.publish).toHaveBeenCalledWith(
        'fallback:triggered',
        expect.objectContaining({
          type: 'resource',
          timestamp: expect.any(String),
          data: expect.objectContaining({
            metrics: expect.any(Object)
          })
        }),
        'high'
      );
    });
  });

  describe('Agent Selection', () => {
    it('should select appropriate agent based on request', async () => {
      const request = {
        type: 'business_plan',
        context: { complexity: 'high' },
        timestamp: new Date().toISOString()
      };

      await eventBus.publish('agent:request', request);

      expect(agentSelector.selectAgent).toHaveBeenCalledWith(request);
      expect(trustScorer.validateTrustThreshold).toHaveBeenCalled();
      expect(eventBus.publish).toHaveBeenCalledWith(
        'meta:agent-selected',
        expect.objectContaining({
          type: 'selection',
          timestamp: expect.any(String),
          data: expect.objectContaining({
            agentId: 'trust-restorer',
            request: expect.any(Object)
          })
        }),
        'medium'
      );
    });

    it('should handle agent selection failure', async () => {
      const request = {
        type: 'business_plan',
        context: { complexity: 'high' },
        timestamp: new Date().toISOString()
      };

      agentSelector.selectAgent.mockRejectedValueOnce(new Error('Selection failed'));

      await eventBus.publish('agent:request', request);

      expect(fallbackManager.handleFallback).toHaveBeenCalledWith('selection', expect.any(Object));
      expect(eventBus.publish).toHaveBeenCalledWith(
        'meta:selection-failed',
        expect.objectContaining({
          type: 'selection',
          timestamp: expect.any(String),
          data: expect.objectContaining({
            error: 'Selection failed',
            request: expect.any(Object)
          })
        }),
        'high'
      );
    });
  });

  describe('State Management', () => {
    it('should maintain consistent state across operations', async () => {
      const request = {
        type: 'business_plan',
        context: { complexity: 'high' },
        timestamp: new Date().toISOString()
      };

      await eventBus.publish('agent:request', request);
      await eventBus.publish('trust:violation', {
        type: 'threshold',
        value: 0.7,
        threshold: 0.8,
        timestamp: new Date().toISOString()
      });

      const metrics = await agentMemory.getSystemMetrics();
      expect(metrics).toBeDefined();
      expect(metrics.lastOperation).toBeDefined();
      expect(metrics.trustScore).toBeDefined();
    });

    it('should handle state update failures', async () => {
      agentMemory.updateSystemMetrics.mockRejectedValueOnce(new Error('Update failed'));

      const request = {
        type: 'business_plan',
        context: { complexity: 'high' },
        timestamp: new Date().toISOString()
      };

      await eventBus.publish('agent:request', request);

      expect(fallbackManager.handleFallback).toHaveBeenCalledWith('state', expect.any(Object));
      expect(eventBus.publish).toHaveBeenCalledWith(
        'meta:state-update-failed',
        expect.objectContaining({
          type: 'state',
          timestamp: expect.any(String),
          data: expect.objectContaining({
            error: 'Update failed',
            context: expect.any(Object)
          })
        }),
        'high'
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle event bus errors', async () => {
      eventBus.publish.mockRejectedValueOnce(new Error('Event bus error'));

      const request = {
        type: 'business_plan',
        context: { complexity: 'high' },
        timestamp: new Date().toISOString()
      };

      await eventBus.publish('agent:request', request);

      expect(fallbackManager.handleFallback).toHaveBeenCalledWith('event', expect.any(Object));
      expect(eventBus.publish).toHaveBeenCalledWith(
        'meta:error',
        expect.objectContaining({
          type: 'event',
          timestamp: expect.any(String),
          data: expect.objectContaining({
            error: 'Event bus error',
            context: expect.any(Object)
          })
        }),
        'high'
      );
    });

    it('should handle multiple concurrent errors', async () => {
      trustScorer.calculateTrustScore.mockRejectedValueOnce(new Error('Trust error'));
      codexAligner.validateAlignment.mockRejectedValueOnce(new Error('Alignment error'));

      await eventBus.publish('trust:violation', {
        type: 'threshold',
        value: 0.7,
        threshold: 0.8,
        timestamp: new Date().toISOString()
      });
      await eventBus.publish('alignment:deviation', {
        type: 'system',
        severity: 'high',
        timestamp: new Date().toISOString()
      });

      expect(fallbackManager.handleFallback).toHaveBeenCalledTimes(2);
      expect(eventBus.publish).toHaveBeenCalledWith(
        'meta:error',
        expect.objectContaining({
          type: 'concurrent',
          timestamp: expect.any(String),
          data: expect.objectContaining({
            errors: expect.arrayContaining([
              expect.objectContaining({ error: 'Trust error' }),
              expect.objectContaining({ error: 'Alignment error' })
            ])
          })
        }),
        'high'
      );
    });
  });
}); 