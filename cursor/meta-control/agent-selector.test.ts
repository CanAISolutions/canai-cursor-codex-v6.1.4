/**
 * meta-control/agent-selector.test.ts
 * 
 * Purpose:
 * Tests the AgentSelector's ability to choose appropriate agents based on system state.
 * Verifies trust-safe agent selection and prioritization.
 */

import { EventBus } from '../utils/event-bus';
import { AgentMemory } from '../agent-oversight/agent-memory';
import { AgentSelector, AgentSelection } from './agent-selector';
import { MetaControlContext } from './meta-controller';

describe('AgentSelector', () => {
  let eventBus: EventBus;
  let agentMemory: AgentMemory;
  let agentSelector: AgentSelector;

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
      },
      'recovery-optimizer': {
        status: 'active',
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
    agentSelector = new AgentSelector(eventBus, agentMemory);
  });

  describe('selectAgents', () => {
    it('should select agents meeting trust and success criteria', async () => {
      const context = createTestContext();
      const selectedAgents = await agentSelector.selectAgents(context);

      expect(selectedAgents).toContain('trust-restorer');
      expect(selectedAgents).not.toContain('recovery-optimizer');
    });

    it('should filter out agents with low trust scores', async () => {
      const context = createTestContext();
      context.agentStates['trust-restorer'].metrics.trustScore = 0.5;

      const selectedAgents = await agentSelector.selectAgents(context);

      expect(selectedAgents).not.toContain('trust-restorer');
    });

    it('should filter out agents with low success rates', async () => {
      const context = createTestContext();
      context.agentStates['trust-restorer'].metrics.successRate = 0.4;

      const selectedAgents = await agentSelector.selectAgents(context);

      expect(selectedAgents).not.toContain('trust-restorer');
    });

    it('should handle selection errors gracefully', async () => {
      const context = createTestContext();
      jest.spyOn(agentMemory, 'getAgentRecord').mockRejectedValue(new Error('Test error'));

      const selectedAgents = await agentSelector.selectAgents(context);

      expect(selectedAgents).toEqual([]);
      expect(eventBus.emit).toHaveBeenCalledWith('selection:error', expect.any(Object));
    });
  });

  describe('evaluateAgents', () => {
    it('should calculate correct confidence scores', async () => {
      const context = createTestContext();
      const selections = await agentSelector['evaluateAgents'](context);

      const trustRestorerSelection = selections.find(s => s.agentId === 'trust-restorer');
      expect(trustRestorerSelection?.confidence).toBeGreaterThan(0.8);
    });

    it('should calculate expected impacts', async () => {
      const context = createTestContext();
      const selections = await agentSelector['evaluateAgents'](context);

      const trustRestorerSelection = selections.find(s => s.agentId === 'trust-restorer');
      expect(trustRestorerSelection?.expectedImpact).toEqual({
        trust: expect.any(Number),
        resources: expect.any(Number),
        time: expect.any(Number)
      });
    });
  });

  describe('event handling', () => {
    it('should handle agent selection events', async () => {
      const event = {
        agentId: 'trust-restorer',
        confidence: 0.9
      };

      await agentSelector['handleAgentSelected'](event);

      expect(eventBus.emit).toHaveBeenCalledWith('selection:completed', expect.any(Object));
    });

    it('should handle agent deselection events', async () => {
      const event = {
        agentId: 'trust-restorer',
        reason: 'low_trust'
      };

      await agentSelector['handleAgentDeselected'](event);

      expect(eventBus.emit).toHaveBeenCalledWith('selection:completed', expect.any(Object));
    });
  });
}); 