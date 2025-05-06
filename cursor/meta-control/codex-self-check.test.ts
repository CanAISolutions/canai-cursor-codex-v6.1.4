/**
 * meta-control/codex-self-check.test.ts
 * 
 * Purpose:
 * Tests the CodexSelfCheckBlock class for proper validation and correction.
 */

import { EventBus } from '../utils/event-bus';
import { AgentMemory } from '../agent-oversight/agent-memory';
import { MetaControlMetricsTracker } from './metrics-tracker';
import { CodexSelfCheckBlock } from './codex-self-check';

describe('CodexSelfCheckBlock', () => {
  let eventBus: EventBus;
  let agentMemory: AgentMemory;
  let metricsTracker: MetaControlMetricsTracker;
  let codexSelfCheck: CodexSelfCheckBlock;

  beforeEach(() => {
    eventBus = new EventBus();
    agentMemory = new AgentMemory(eventBus);
    metricsTracker = new MetaControlMetricsTracker(eventBus, agentMemory);
    codexSelfCheck = new CodexSelfCheckBlock(eventBus, agentMemory, metricsTracker);
  });

  describe('validateTrustDrift', () => {
    it('should return valid for new agents with no trust history', async () => {
      const agentId = 'test-agent';
      await agentMemory.addAgent({
        agentName: agentId,
        trustScore: 0.5,
        trustHistory: [],
        failureRate: 0,
        lastUsed: Date.now(),
        status: 'active',
        metadata: {},
        avgTrustDelta: 0,
        trustVolatility: 0,
        sessionsTracked: 0,
        recoveryAttempts: 0,
        recentTriggers: []
      });

      const result = await (codexSelfCheck as any).validateTrustDrift(agentId);
      expect(result.isValid).toBe(true);
      expect(result.corrections).toHaveLength(0);
      expect(result.metrics.alignmentScore).toBe(1.0);
    });

    it('should detect trust drift above threshold', async () => {
      const agentId = 'test-agent';
      await agentMemory.addAgent({
        agentName: agentId,
        trustScore: 0.5,
        trustHistory: [0.3, 0.4, 0.5, 0.6, 0.7],
        failureRate: 0,
        lastUsed: Date.now(),
        status: 'active',
        metadata: {},
        avgTrustDelta: 0,
        trustVolatility: 0,
        sessionsTracked: 0,
        recoveryAttempts: 0,
        recentTriggers: []
      });

      const result = await (codexSelfCheck as any).validateTrustDrift(agentId);
      expect(result.isValid).toBe(false);
      expect(result.corrections).toHaveLength(1);
      expect(result.corrections[0].type).toBe('trust');
      expect(result.metrics.alignmentScore).toBeLessThan(1.0);
    });
  });

  describe('validateAgentBehavior', () => {
    it('should validate Codex-aligned behavior patterns', async () => {
      const agentId = 'test-agent';
      const executionData = {
        actions: [
          { type: 'tool', target: 'codebase', intent: 'search' },
          { type: 'tool', target: 'read', intent: 'file' },
          { type: 'tool', target: 'edit', intent: 'file' }
        ],
        output: {
          format: 'markdown',
          content: 'Test output'
        }
      };

      const result = await (codexSelfCheck as any).validateAgentBehavior(agentId, executionData);
      expect(result.isValid).toBe(true);
      expect(result.corrections).toHaveLength(0);
      expect(result.metrics.behaviorDeviation).toBeLessThan(0.3);
    });

    it('should detect non-Codex-aligned behavior patterns', async () => {
      const agentId = 'test-agent';
      const executionData = {
        actions: [
          { type: 'unknown', target: 'unknown', intent: 'unknown' },
          { type: 'unknown', target: 'unknown', intent: 'unknown' },
          { type: 'unknown', target: 'unknown', intent: 'unknown' }
        ],
        output: {
          format: 'markdown',
          content: 'Test output'
        }
      };

      const result = await (codexSelfCheck as any).validateAgentBehavior(agentId, executionData);
      expect(result.isValid).toBe(false);
      expect(result.corrections).toHaveLength(1);
      expect(result.corrections[0].type).toBe('behavior');
      expect(result.metrics.behaviorDeviation).toBeGreaterThan(0.3);
    });

    it('should validate output alignment', async () => {
      const agentId = 'test-agent';
      const executionData = {
        actions: [
          { type: 'tool', target: 'codebase', intent: 'search' }
        ],
        output: {
          format: 'markdown',
          content: 'Test output'
        }
      };

      const result = await (codexSelfCheck as any).validateAgentBehavior(agentId, executionData);
      expect(result.isValid).toBe(true);
      expect(result.corrections).toHaveLength(0);
    });

    it('should detect non-aligned output', async () => {
      const agentId = 'test-agent';
      const executionData = {
        actions: [
          { type: 'tool', target: 'codebase', intent: 'search' }
        ],
        output: {
          format: 'invalid',
          content: null
        }
      };

      const result = await (codexSelfCheck as any).validateAgentBehavior(agentId, executionData);
      expect(result.isValid).toBe(false);
      expect(result.corrections).toHaveLength(1);
      expect(result.corrections[0].type).toBe('output');
    });
  });

  describe('applyCorrections', () => {
    it('should apply trust corrections', async () => {
      const agentId = 'test-agent';
      await agentMemory.addAgent({
        agentName: agentId,
        trustScore: 0.5,
        trustHistory: [0.3, 0.4, 0.5, 0.6, 0.7],
        failureRate: 0,
        lastUsed: Date.now(),
        status: 'active',
        metadata: {},
        avgTrustDelta: 0,
        trustVolatility: 0,
        sessionsTracked: 0,
        recoveryAttempts: 0,
        recentTriggers: []
      });

      const corrections = [{
        type: 'trust' as const,
        description: 'Trust drift exceeds threshold',
        severity: 'high' as const,
        context: {
          agentId,
          trustHistory: [0.3, 0.4, 0.5, 0.6, 0.7],
          drift: 0.4
        }
      }];

      const eventPromise = new Promise<any>(resolve => {
        eventBus.on('codex:correction:applied', resolve);
      });

      await (codexSelfCheck as any).applyCorrections(agentId, corrections);

      const event = await eventPromise;
      expect(event.agentId).toBe(agentId);
      expect(event.correction).toEqual(corrections[0]);

      const agent = await agentMemory.getAgent(agentId);
      expect(agent?.status).toBe('degraded');
      expect(agent?.trustScore).toBe(0.3); // Minimum trust score from history
    });

    it('should apply behavior corrections', async () => {
      const agentId = 'test-agent';
      await agentMemory.addAgent({
        agentName: agentId,
        trustScore: 0.5,
        trustHistory: [],
        failureRate: 0,
        lastUsed: Date.now(),
        status: 'active',
        metadata: {},
        avgTrustDelta: 0,
        trustVolatility: 0,
        sessionsTracked: 0,
        recoveryAttempts: 0,
        recentTriggers: []
      });

      const corrections = [{
        type: 'behavior' as const,
        description: 'Behavior deviation exceeds threshold',
        severity: 'medium' as const,
        context: {
          agentId,
          actionPatterns: {},
          deviation: 0.5
        }
      }];

      const eventPromise = new Promise<any>(resolve => {
        eventBus.on('codex:correction:applied', resolve);
      });

      await (codexSelfCheck as any).applyCorrections(agentId, corrections);

      const event = await eventPromise;
      expect(event.agentId).toBe(agentId);
      expect(event.correction).toEqual(corrections[0]);

      const agent = await agentMemory.getAgent(agentId);
      expect(agent?.status).toBe('degraded');
      expect(agent?.metadata.lastBehaviorCorrection).toBeDefined();
    });

    it('should apply output corrections', async () => {
      const agentId = 'test-agent';
      await agentMemory.addAgent({
        agentName: agentId,
        trustScore: 0.5,
        trustHistory: [],
        failureRate: 0,
        lastUsed: Date.now(),
        status: 'active',
        metadata: {},
        avgTrustDelta: 0,
        trustVolatility: 0,
        sessionsTracked: 0,
        recoveryAttempts: 0,
        recentTriggers: []
      });

      const corrections = [{
        type: 'output' as const,
        description: 'Output not Codex-aligned',
        severity: 'high' as const,
        context: {
          agentId,
          output: {},
          issues: ['Invalid format']
        }
      }];

      const eventPromise = new Promise<any>(resolve => {
        eventBus.on('codex:correction:applied', resolve);
      });

      await (codexSelfCheck as any).applyCorrections(agentId, corrections);

      const event = await eventPromise;
      expect(event.agentId).toBe(agentId);
      expect(event.correction).toEqual(corrections[0]);

      const agent = await agentMemory.getAgent(agentId);
      expect(agent?.status).toBe('degraded');
      expect(agent?.metadata.lastOutputCorrection).toBeDefined();
    });
  });

  describe('event handling', () => {
    it('should execute system checks on system:pulse event', async () => {
      const executeSystemChecksSpy = jest.spyOn(codexSelfCheck as any, 'executeSystemChecks');
      
      await eventBus.emit('system:pulse', { timestamp: Date.now() });
      
      expect(executeSystemChecksSpy).toHaveBeenCalled();
    });

    it('should validate agent behavior on agent:execution-review event', async () => {
      const validateAgentBehaviorSpy = jest.spyOn(codexSelfCheck as any, 'validateAgentBehavior');
      const agentId = 'test-agent';
      const executionData = {
        actions: [
          { type: 'tool', target: 'codebase', intent: 'search' }
        ],
        output: {
          format: 'markdown',
          content: 'Test output'
        }
      };

      await eventBus.emit('agent:execution-review', { agentId, executionData });
      
      expect(validateAgentBehaviorSpy).toHaveBeenCalledWith(agentId, executionData);
    });
  });
}); 