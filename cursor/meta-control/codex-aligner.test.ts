/**
 * meta-control/codex-aligner.test.ts
 * 
 * Purpose:
 * Tests the CodexAligner's ability to ensure system behavior aligns with Codex principles.
 * Verifies trust-safe alignment and correction mechanisms.
 */

import { EventBus } from '../utils/event-bus';
import { AgentMemory } from '../agent-oversight/agent-memory';
import { CodexAligner, AlignmentPlan } from './codex-aligner';
import { MetaControlContext } from './meta-controller';

describe('CodexAligner', () => {
  let eventBus: EventBus;
  let agentMemory: AgentMemory;
  let codexAligner: CodexAligner;

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
    codexAligner = new CodexAligner(eventBus, agentMemory);
  });

  describe('createAlignmentPlan', () => {
    it('should create a plan for prompt deviations', async () => {
      const context = createTestContext();
      context.codexAlignment.deviationMetrics.promptDeviation = 0.3;
      
      const plan = await codexAligner.createAlignmentPlan(context);

      expect(plan.corrections).toContainEqual(expect.objectContaining({
        type: 'prompt',
        target: 'system'
      }));
    });

    it('should create a plan for response deviations', async () => {
      const context = createTestContext();
      context.codexAlignment.deviationMetrics.responseDeviation = 0.3;
      
      const plan = await codexAligner.createAlignmentPlan(context);

      expect(plan.corrections).toContainEqual(expect.objectContaining({
        type: 'response',
        target: 'system'
      }));
    });

    it('should create a plan for behavior deviations', async () => {
      const context = createTestContext();
      context.codexAlignment.deviationMetrics.behaviorDeviation = 0.3;
      
      const plan = await codexAligner.createAlignmentPlan(context);

      expect(plan.corrections).toContainEqual(expect.objectContaining({
        type: 'behavior',
        target: 'system'
      }));
    });

    it('should calculate correct priority based on deviations', async () => {
      const context = createTestContext();
      context.codexAlignment.alignmentScore = 0.5;
      context.codexAlignment.deviationMetrics.promptDeviation = 0.4;
      
      const plan = await codexAligner.createAlignmentPlan(context);

      expect(plan.priority).toBeGreaterThan(5);
    });
  });

  describe('executeAlignmentPlan', () => {
    it('should execute prompt corrections', async () => {
      const plan: AlignmentPlan = {
        priority: 5,
        corrections: [{
          type: 'prompt',
          target: 'system',
          parameters: {
            maxLength: 2000,
            requiredElements: ['purpose', 'context'],
            prohibitedElements: ['api_key']
          }
        }],
        expectedOutcome: {
          alignmentScore: 0.2,
          trustImpact: 0.1,
          resourceImpact: 0.05
        }
      };

      await codexAligner.executeAlignmentPlan(plan);

      expect(eventBus.emit).toHaveBeenCalledWith('correction:applying', expect.any(Object));
    });

    it('should execute response corrections', async () => {
      const plan: AlignmentPlan = {
        priority: 5,
        corrections: [{
          type: 'response',
          target: 'system',
          parameters: {
            maxLength: 4000,
            requiredElements: ['explanation', 'solution'],
            prohibitedElements: ['error_details']
          }
        }],
        expectedOutcome: {
          alignmentScore: 0.3,
          trustImpact: 0.2,
          resourceImpact: 0.1
        }
      };

      await codexAligner.executeAlignmentPlan(plan);

      expect(eventBus.emit).toHaveBeenCalledWith('correction:applying', expect.any(Object));
    });

    it('should execute behavior corrections', async () => {
      const plan: AlignmentPlan = {
        priority: 5,
        corrections: [{
          type: 'behavior',
          target: 'system',
          parameters: {
            maxResponseTime: 5000,
            requiredPatterns: ['clear_explanation'],
            prohibitedPatterns: ['unsafe_eval']
          }
        }],
        expectedOutcome: {
          alignmentScore: 0.4,
          trustImpact: 0.3,
          resourceImpact: 0.15
        }
      };

      await codexAligner.executeAlignmentPlan(plan);

      expect(eventBus.emit).toHaveBeenCalledWith('correction:applying', expect.any(Object));
    });

    it('should handle execution errors gracefully', async () => {
      const plan: AlignmentPlan = {
        priority: 5,
        corrections: [{
          type: 'prompt',
          target: 'system',
          parameters: {
            maxLength: 2000,
            requiredElements: ['purpose'],
            prohibitedElements: ['api_key']
          }
        }],
        expectedOutcome: {
          alignmentScore: 0.2,
          trustImpact: 0.1,
          resourceImpact: 0.05
        }
      };

      jest.spyOn(agentMemory, 'getAgentRecord').mockRejectedValue(new Error('Test error'));

      await codexAligner.executeAlignmentPlan(plan);

      expect(eventBus.emit).toHaveBeenCalledWith('alignment:error', expect.objectContaining({
        error: 'Test error'
      }));
    });
  });

  describe('event handling', () => {
    it('should handle alignment requirements', async () => {
      const event = {
        type: 'prompt_deviation',
        severity: 0.3
      };

      await codexAligner['handleAlignmentRequired'](event);

      expect(eventBus.emit).toHaveBeenCalledWith('alignment:started', expect.any(Object));
    });

    it('should handle correction applications', async () => {
      const event = {
        type: 'prompt',
        success: true
      };

      await codexAligner['handleCorrectionApplied'](event);

      expect(eventBus.emit).toHaveBeenCalledWith('alignment:completed', expect.any(Object));
    });
  });
}); 