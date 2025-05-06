/**
 * meta-control/recovery-engine.test.ts
 * 
 * Purpose:
 * Tests the MetaRecoveryEngine class to ensure proper handling of recovery procedures
 * and maintaining trust safety during system recovery.
 */

import { EventBus } from '../utils/event-bus';
import { AgentMemory } from '../agent-oversight/agent-memory';
import { MetaControlMetricsTracker } from './metrics-tracker';
import { CodexSelfCheckBlock } from './codex-self-check';
import { MetaRecoveryEngine } from './recovery-engine';

describe('MetaRecoveryEngine', () => {
  let eventBus: EventBus;
  let agentMemory: AgentMemory;
  let metricsTracker: MetaControlMetricsTracker;
  let selfCheckBlock: CodexSelfCheckBlock;
  let recoveryEngine: MetaRecoveryEngine;

  beforeEach(() => {
    eventBus = new EventBus();
    agentMemory = new AgentMemory();
    metricsTracker = new MetaControlMetricsTracker(eventBus, agentMemory);
    selfCheckBlock = new CodexSelfCheckBlock(eventBus, agentMemory, metricsTracker);
    recoveryEngine = new MetaRecoveryEngine(eventBus, agentMemory, metricsTracker, selfCheckBlock);
  });

  describe('Trust Recovery', () => {
    it('should create and execute trust recovery plan', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const data = {
        type: 'threshold',
        value: 0.7,
        threshold: 0.8
      };

      await eventBus.emit('trust:violation', data);

      expect(eventSpy).toHaveBeenCalledWith('recovery:started', expect.objectContaining({
        type: 'trust',
        plan: expect.objectContaining({
          trigger: 'trust-violation',
          steps: expect.arrayContaining([
            expect.objectContaining({ action: 'degrade-untrusted-agents' }),
            expect.objectContaining({ action: 'restore-trust-metrics' }),
            expect.objectContaining({ action: 'verify-trust-restoration' })
          ])
        })
      }));
    });

    it('should execute trust recovery steps in correct order', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const data = {
        type: 'threshold',
        value: 0.7,
        threshold: 0.8
      };

      await eventBus.emit('trust:violation', data);

      const stepStartedCalls = eventSpy.mock.calls.filter(
        call => call[0] === 'recovery:step-started'
      );

      expect(stepStartedCalls[0][1].step).toBe('degrade-untrusted-agents');
      expect(stepStartedCalls[1][1].step).toBe('restore-trust-metrics');
      expect(stepStartedCalls[2][1].step).toBe('verify-trust-restoration');
    });

    it('should execute fallback actions when trust recovery fails', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const data = {
        type: 'threshold',
        value: 0.7,
        threshold: 0.8
      };

      // Mock self-check to fail
      jest.spyOn(selfCheckBlock, 'executeCheck').mockResolvedValueOnce(false);

      await eventBus.emit('trust:violation', data);

      expect(eventSpy).toHaveBeenCalledWith('recovery:fallback-started', expect.objectContaining({
        step: 'emergency-trust-restoration'
      }));
    });
  });

  describe('Resource Recovery', () => {
    it('should create and execute resource recovery plan', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const data = {
        resource: 'system',
        current: 0.9,
        threshold: 0.8
      };

      await eventBus.emit('resource:warning', data);

      expect(eventSpy).toHaveBeenCalledWith('recovery:started', expect.objectContaining({
        type: 'resource',
        plan: expect.objectContaining({
          trigger: 'resource-warning',
          steps: expect.arrayContaining([
            expect.objectContaining({ action: 'reduce-resource-usage' }),
            expect.objectContaining({ action: 'optimize-resource-allocation' }),
            expect.objectContaining({ action: 'verify-resource-stability' })
          ])
        })
      }));
    });

    it('should execute resource recovery steps in correct order', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const data = {
        resource: 'system',
        current: 0.9,
        threshold: 0.8
      };

      await eventBus.emit('resource:warning', data);

      const stepStartedCalls = eventSpy.mock.calls.filter(
        call => call[0] === 'recovery:step-started'
      );

      expect(stepStartedCalls[0][1].step).toBe('reduce-resource-usage');
      expect(stepStartedCalls[1][1].step).toBe('optimize-resource-allocation');
      expect(stepStartedCalls[2][1].step).toBe('verify-resource-stability');
    });

    it('should execute fallback actions when resource recovery fails', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const data = {
        resource: 'system',
        current: 0.9,
        threshold: 0.8
      };

      // Mock self-check to fail
      jest.spyOn(selfCheckBlock, 'executeCheck').mockResolvedValueOnce(false);

      await eventBus.emit('resource:warning', data);

      expect(eventSpy).toHaveBeenCalledWith('recovery:fallback-started', expect.objectContaining({
        step: 'emergency-resource-reduction'
      }));
    });
  });

  describe('Alignment Recovery', () => {
    it('should create and execute alignment recovery plan', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const data = {
        type: 'system',
        severity: 'high',
        details: {
          expected: 0.8,
          actual: 0.7,
          deviations: {
            prompt: 0.3,
            response: 0.3,
            behavior: 0.3
          }
        }
      };

      await eventBus.emit('alignment:deviation', data);

      expect(eventSpy).toHaveBeenCalledWith('recovery:started', expect.objectContaining({
        type: 'alignment',
        plan: expect.objectContaining({
          trigger: 'alignment-deviation',
          steps: expect.arrayContaining([
            expect.objectContaining({ action: 'correct-alignment-deviations' }),
            expect.objectContaining({ action: 'restore-codex-alignment' }),
            expect.objectContaining({ action: 'verify-alignment-restoration' })
          ])
        })
      }));
    });

    it('should execute alignment recovery steps in correct order', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const data = {
        type: 'system',
        severity: 'high',
        details: {
          expected: 0.8,
          actual: 0.7,
          deviations: {
            prompt: 0.3,
            response: 0.3,
            behavior: 0.3
          }
        }
      };

      await eventBus.emit('alignment:deviation', data);

      const stepStartedCalls = eventSpy.mock.calls.filter(
        call => call[0] === 'recovery:step-started'
      );

      expect(stepStartedCalls[0][1].step).toBe('correct-alignment-deviations');
      expect(stepStartedCalls[1][1].step).toBe('restore-codex-alignment');
      expect(stepStartedCalls[2][1].step).toBe('verify-alignment-restoration');
    });

    it('should execute fallback actions when alignment recovery fails', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const data = {
        type: 'system',
        severity: 'high',
        details: {
          expected: 0.8,
          actual: 0.7,
          deviations: {
            prompt: 0.3,
            response: 0.3,
            behavior: 0.3
          }
        }
      };

      // Mock self-check to fail
      jest.spyOn(selfCheckBlock, 'executeCheck').mockResolvedValueOnce(false);

      await eventBus.emit('alignment:deviation', data);

      expect(eventSpy).toHaveBeenCalledWith('recovery:fallback-started', expect.objectContaining({
        step: 'emergency-alignment-restoration'
      }));
    });
  });

  describe('Evolution Recovery', () => {
    it('should create and execute evolution recovery plan', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const data = {
        trigger: 'performance-improvement',
        confidence: 0.7,
        impact: {
          trust: 0.1,
          resources: 0.2,
          alignment: 0.1
        }
      };

      await eventBus.emit('evolution:failed', data);

      expect(eventSpy).toHaveBeenCalledWith('recovery:started', expect.objectContaining({
        type: 'evolution',
        plan: expect.objectContaining({
          trigger: 'evolution-failure',
          steps: expect.arrayContaining([
            expect.objectContaining({ action: 'rollback-evolution' }),
            expect.objectContaining({ action: 'restore-previous-state' }),
            expect.objectContaining({ action: 'verify-state-restoration' })
          ])
        })
      }));
    });

    it('should execute evolution recovery steps in correct order', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const data = {
        trigger: 'performance-improvement',
        confidence: 0.7,
        impact: {
          trust: 0.1,
          resources: 0.2,
          alignment: 0.1
        }
      };

      await eventBus.emit('evolution:failed', data);

      const stepStartedCalls = eventSpy.mock.calls.filter(
        call => call[0] === 'recovery:step-started'
      );

      expect(stepStartedCalls[0][1].step).toBe('rollback-evolution');
      expect(stepStartedCalls[1][1].step).toBe('restore-previous-state');
      expect(stepStartedCalls[2][1].step).toBe('verify-state-restoration');
    });

    it('should execute fallback actions when evolution recovery fails', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const data = {
        trigger: 'performance-improvement',
        confidence: 0.7,
        impact: {
          trust: 0.1,
          resources: 0.2,
          alignment: 0.1
        }
      };

      // Mock self-check to fail
      jest.spyOn(selfCheckBlock, 'executeCheck').mockResolvedValueOnce(false);

      await eventBus.emit('evolution:failed', data);

      expect(eventSpy).toHaveBeenCalledWith('recovery:fallback-started', expect.objectContaining({
        step: 'emergency-state-restoration'
      }));
    });
  });

  describe('Recovery Verification', () => {
    it('should verify step outcome before proceeding', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const data = {
        type: 'threshold',
        value: 0.7,
        threshold: 0.8
      };

      // Mock self-check to fail step verification
      jest.spyOn(selfCheckBlock, 'executeCheck')
        .mockResolvedValueOnce(true)  // First step succeeds
        .mockResolvedValueOnce(false); // Step verification fails

      await eventBus.emit('trust:violation', data);

      expect(eventSpy).toHaveBeenCalledWith('recovery:fallback-started', expect.any(Object));
    });

    it('should verify recovery outcome before completion', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const data = {
        type: 'threshold',
        value: 0.7,
        threshold: 0.8
      };

      // Mock self-check to fail recovery verification
      jest.spyOn(selfCheckBlock, 'executeCheck')
        .mockResolvedValueOnce(true)  // Step succeeds
        .mockResolvedValueOnce(true)  // Step verification succeeds
        .mockResolvedValueOnce(false); // Recovery verification fails

      await eventBus.emit('trust:violation', data);

      expect(eventSpy).toHaveBeenCalledWith('recovery:fallback-started', expect.any(Object));
    });
  });

  describe('Error Handling', () => {
    it('should handle unknown step action gracefully', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const data = {
        type: 'threshold',
        value: 0.7,
        threshold: 0.8
      };

      // Mock recovery plan with unknown action
      jest.spyOn(recoveryEngine as any, 'createTrustRecoveryPlan').mockReturnValue({
        trigger: 'trust-violation',
        steps: [{ action: 'unknown-action', priority: 1, timeout: 30000, retryCount: 2, dependencies: [] }],
        expectedOutcome: { trust: 0.8, resources: 0.7, alignment: 0.8 },
        fallbackActions: []
      });

      await eventBus.emit('trust:violation', data);

      expect(eventSpy).toHaveBeenCalledWith('recovery:fallback-started', expect.any(Object));
    });

    it('should handle step execution error gracefully', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      const data = {
        type: 'threshold',
        value: 0.7,
        threshold: 0.8
      };

      // Mock step execution to throw error
      jest.spyOn(recoveryEngine as any, 'performStepAction').mockRejectedValueOnce(new Error('Step execution failed'));

      await eventBus.emit('trust:violation', data);

      expect(eventSpy).toHaveBeenCalledWith('recovery:fallback-started', expect.any(Object));
    });
  });
}); 