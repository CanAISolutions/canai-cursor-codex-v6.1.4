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
import { RecoveryPlan, RecoveryStep, RecoveryContext } from './recovery-types';

// Mock dependencies with proper typing
jest.mock('../utils/event-bus');
jest.mock('../agent-oversight/agent-memory');
jest.mock('./metrics-tracker');
jest.mock('./codex-self-check');

describe('MetaRecoveryEngine', () => {
  let eventBus: jest.Mocked<EventBus>;
  let agentMemory: jest.Mocked<AgentMemory>;
  let metricsTracker: jest.Mocked<MetaControlMetricsTracker>;
  let selfCheckBlock: jest.Mocked<CodexSelfCheckBlock>;
  let recoveryEngine: MetaRecoveryEngine;

  beforeEach(() => {
    // Initialize mocks with proper typing
    eventBus = {
      publish: jest.fn().mockResolvedValue(undefined),
      on: jest.fn(),
      off: jest.fn(),
      once: jest.fn(),
      removeAllListeners: jest.fn()
    } as unknown as jest.Mocked<EventBus>;

    agentMemory = {
      getAgentMetrics: jest.fn().mockResolvedValue({
        trustScore: 0.7,
        recoveryAttempts: 2,
        patternSubstitutions: 1,
        trustVolatility: 0.1
      }),
      updateAgentMetrics: jest.fn().mockResolvedValue(undefined),
      getSystemMetrics: jest.fn().mockResolvedValue({
        trustScore: 0.7,
        resourceUsage: 0.6,
        alignmentScore: 0.8
      }),
      updateSystemMetrics: jest.fn().mockResolvedValue(undefined),
      recordTrustEvent: jest.fn().mockResolvedValue(undefined),
      recordRecoveryAttempt: jest.fn().mockResolvedValue(undefined),
      cleanupOldRecords: jest.fn().mockResolvedValue(undefined)
    } as unknown as jest.Mocked<AgentMemory>;

    metricsTracker = {
      trackMetric: jest.fn().mockResolvedValue(undefined),
      getMetricHistory: jest.fn().mockResolvedValue([]),
      getMetricAggregates: jest.fn().mockResolvedValue({
        min: 0,
        max: 1,
        avg: 0.5,
        p95: 0.9,
        p99: 0.95
      }),
      clearMetrics: jest.fn().mockResolvedValue(undefined)
    } as unknown as jest.Mocked<MetaControlMetricsTracker>;

    selfCheckBlock = {
      handleSystemPulse: jest.fn().mockResolvedValue(undefined),
      handleAgentExecutionReview: jest.fn().mockResolvedValue(undefined),
      executeCheck: jest.fn().mockResolvedValue(true),
      validateRecoveryPlan: jest.fn().mockResolvedValue(true),
      verifyRecoveryOutcome: jest.fn().mockResolvedValue(true)
    } as unknown as jest.Mocked<CodexSelfCheckBlock>;

    recoveryEngine = new MetaRecoveryEngine(
      eventBus,
      agentMemory,
      metricsTracker,
      selfCheckBlock
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Trust Recovery', () => {
    it('should create and execute trust recovery plan', async () => {
      const data = {
        type: 'trust:violation',
        timestamp: new Date().toISOString(),
        data: {
          type: 'threshold',
          value: 0.7,
          threshold: 0.8
        }
      };

      await eventBus.publish(data, 'high');

      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'recovery:started',
          data: expect.objectContaining({
            type: 'trust',
            plan: expect.objectContaining({
              trigger: 'trust-violation',
              steps: expect.arrayContaining([
                expect.objectContaining({ action: 'degrade-untrusted-agents' }),
                expect.objectContaining({ action: 'restore-trust-metrics' }),
                expect.objectContaining({ action: 'verify-trust-restoration' })
              ])
            })
          })
        }),
        'high'
      );

      expect(metricsTracker.trackMetric).toHaveBeenCalledWith(
        'recovery.attempt',
        expect.any(Number),
        expect.objectContaining({
          type: 'trust',
          trigger: 'trust-violation'
        })
      );
    });

    it('should execute trust recovery steps in correct order', async () => {
      const data = {
        type: 'trust:violation',
        timestamp: new Date().toISOString(),
        data: {
          type: 'threshold',
          value: 0.7,
          threshold: 0.8
        }
      };

      await eventBus.publish(data, 'high');

      const stepStartedCalls = (eventBus.publish as jest.Mock).mock.calls.filter(
        call => call[0].type === 'recovery:step-started'
      );

      expect(stepStartedCalls[0][0].data.step).toBe('degrade-untrusted-agents');
      expect(stepStartedCalls[1][0].data.step).toBe('restore-trust-metrics');
      expect(stepStartedCalls[2][0].data.step).toBe('verify-trust-restoration');

      expect(metricsTracker.trackMetric).toHaveBeenCalledWith('recovery-step', expect.any(Object));
    });

    it('should execute fallback actions when trust recovery fails', async () => {
      const data = {
        type: 'trust:violation',
        timestamp: new Date().toISOString(),
        data: {
          type: 'threshold',
          value: 0.7,
          threshold: 0.8
        }
      };

      // Mock event bus to emit failure
      (eventBus.publish as jest.Mock).mockImplementation((event, priority) => {
        if (event.type === 'recovery:step-started' && event.data.step === 'verify-trust-restoration') {
          throw new Error('Trust verification failed');
        }
        return Promise.resolve();
      });

      await eventBus.publish(data, 'high');

      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'recovery:fallback-started',
          data: expect.objectContaining({
            step: 'emergency-trust-restoration'
          })
        }),
        'high'
      );

      expect(metricsTracker.trackMetric).toHaveBeenCalledWith(
        'recovery.failure',
        expect.any(Number),
        expect.objectContaining({
          type: 'trust',
          error: 'Trust verification failed'
        })
      );
    });
  });

  describe('Resource Recovery', () => {
    it('should create and execute resource recovery plan', async () => {
      const data = {
        type: 'resource:warning',
        timestamp: new Date().toISOString(),
        data: {
          resource: 'system',
          current: 0.9,
          threshold: 0.8
        }
      };

      await eventBus.publish(data, 'high');

      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'recovery:started',
          data: expect.objectContaining({
            type: 'resource',
            plan: expect.objectContaining({
              trigger: 'resource-warning',
              steps: expect.arrayContaining([
                expect.objectContaining({ action: 'reduce-resource-usage' }),
                expect.objectContaining({ action: 'optimize-resource-allocation' }),
                expect.objectContaining({ action: 'verify-resource-stability' })
              ])
            })
          })
        }),
        'high'
      );

      expect(metricsTracker.trackMetric).toHaveBeenCalledWith(
        'recovery.attempt',
        expect.any(Number),
        expect.objectContaining({
          type: 'resource',
          trigger: 'resource-warning'
        })
      );
    });

    it('should execute resource recovery steps in correct order', async () => {
      const data = {
        type: 'resource:warning',
        timestamp: new Date().toISOString(),
        data: {
          resource: 'system',
          current: 0.9,
          threshold: 0.8
        }
      };

      await eventBus.publish(data, 'high');

      const stepStartedCalls = (eventBus.publish as jest.Mock).mock.calls.filter(
        call => call[0].type === 'recovery:step-started'
      );

      expect(stepStartedCalls[0][0].data.step).toBe('reduce-resource-usage');
      expect(stepStartedCalls[1][0].data.step).toBe('optimize-resource-allocation');
      expect(stepStartedCalls[2][0].data.step).toBe('verify-resource-stability');

      expect(metricsTracker.trackMetric).toHaveBeenCalledWith('recovery-step', expect.any(Object));
    });

    it('should execute fallback actions when resource recovery fails', async () => {
      const data = {
        type: 'resource:warning',
        timestamp: new Date().toISOString(),
        data: {
          resource: 'system',
          current: 0.9,
          threshold: 0.8
        }
      };

      // Mock event bus to emit failure
      (eventBus.publish as jest.Mock).mockImplementation((event, priority) => {
        if (event.type === 'recovery:step-started' && event.data.step === 'verify-resource-stability') {
          throw new Error('Resource verification failed');
        }
        return Promise.resolve();
      });

      await eventBus.publish(data, 'high');

      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'recovery:fallback-started',
          data: expect.objectContaining({
            step: 'emergency-resource-reduction'
          })
        }),
        'high'
      );

      expect(metricsTracker.trackMetric).toHaveBeenCalledWith(
        'recovery.failure',
        expect.any(Number),
        expect.objectContaining({
          type: 'resource',
          error: 'Resource verification failed'
        })
      );
    });
  });

  describe('Alignment Recovery', () => {
    it('should create and execute alignment recovery plan', async () => {
      const data = {
        type: 'alignment:deviation',
        timestamp: new Date().toISOString(),
        data: {
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
        }
      };

      await eventBus.publish(data, 'high');

      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'recovery:started',
          data: expect.objectContaining({
            type: 'alignment',
            plan: expect.objectContaining({
              trigger: 'alignment-deviation',
              steps: expect.arrayContaining([
                expect.objectContaining({ action: 'align-prompts' }),
                expect.objectContaining({ action: 'align-responses' }),
                expect.objectContaining({ action: 'verify-alignment' })
              ])
            })
          })
        }),
        'high'
      );

      expect(metricsTracker.trackMetric).toHaveBeenCalledWith(
        'recovery.attempt',
        expect.any(Number),
        expect.objectContaining({
          type: 'alignment',
          trigger: 'alignment-deviation'
        })
      );
    });

    it('should execute alignment recovery steps in correct order', async () => {
      const data = {
        type: 'alignment:deviation',
        timestamp: new Date().toISOString(),
        data: {
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
        }
      };

      await eventBus.publish(data, 'high');

      const stepStartedCalls = (eventBus.publish as jest.Mock).mock.calls.filter(
        call => call[0].type === 'recovery:step-started'
      );

      expect(stepStartedCalls[0][0].data.step).toBe('align-prompts');
      expect(stepStartedCalls[1][0].data.step).toBe('align-responses');
      expect(stepStartedCalls[2][0].data.step).toBe('verify-alignment');

      expect(metricsTracker.trackMetric).toHaveBeenCalledWith('recovery-step', expect.any(Object));
    });

    it('should execute fallback actions when alignment recovery fails', async () => {
      const data = {
        type: 'alignment:deviation',
        timestamp: new Date().toISOString(),
        data: {
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
        }
      };

      // Mock event bus to emit failure
      (eventBus.publish as jest.Mock).mockImplementation((event, priority) => {
        if (event.type === 'recovery:step-started' && event.data.step === 'verify-alignment') {
          throw new Error('Alignment verification failed');
        }
        return Promise.resolve();
      });

      await eventBus.publish(data, 'high');

      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'recovery:fallback-started',
          data: expect.objectContaining({
            step: 'emergency-alignment-restoration'
          })
        }),
        'high'
      );

      expect(metricsTracker.trackMetric).toHaveBeenCalledWith(
        'recovery.failure',
        expect.any(Number),
        expect.objectContaining({
          type: 'alignment',
          error: 'Alignment verification failed'
        })
      );
    });
  });

  describe('Evolution Recovery', () => {
    it('should create and execute evolution recovery plan', async () => {
      const data = {
        type: 'evolution:failed',
        timestamp: new Date().toISOString(),
        data: {
          trigger: 'performance-improvement',
          confidence: 0.7,
          impact: {
            trust: 0.1,
            resources: 0.2,
            alignment: 0.1
          }
        }
      };

      await eventBus.publish(data, 'high');

      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'recovery:started',
          data: expect.objectContaining({
            type: 'evolution',
            plan: expect.objectContaining({
              trigger: 'evolution-failure',
              steps: expect.arrayContaining([
                expect.objectContaining({ action: 'rollback-evolution' }),
                expect.objectContaining({ action: 'restore-previous-state' }),
                expect.objectContaining({ action: 'verify-state-restoration' })
              ])
            })
          })
        }),
        'high'
      );

      expect(metricsTracker.trackMetric).toHaveBeenCalledWith(
        'recovery.attempt',
        expect.any(Number),
        expect.objectContaining({
          type: 'evolution',
          trigger: 'evolution-failure'
        })
      );
    });

    it('should execute evolution recovery steps in correct order', async () => {
      const data = {
        type: 'evolution:failed',
        timestamp: new Date().toISOString(),
        data: {
          trigger: 'performance-improvement',
          confidence: 0.7,
          impact: {
            trust: 0.1,
            resources: 0.2,
            alignment: 0.1
          }
        }
      };

      await eventBus.publish(data, 'high');

      const stepStartedCalls = (eventBus.publish as jest.Mock).mock.calls.filter(
        call => call[0].type === 'recovery:step-started'
      );

      expect(stepStartedCalls[0][0].data.step).toBe('rollback-evolution');
      expect(stepStartedCalls[1][0].data.step).toBe('restore-previous-state');
      expect(stepStartedCalls[2][0].data.step).toBe('verify-state-restoration');

      expect(metricsTracker.trackMetric).toHaveBeenCalledWith('recovery-step', expect.any(Object));
    });

    it('should execute fallback actions when evolution recovery fails', async () => {
      const data = {
        type: 'evolution:failed',
        timestamp: new Date().toISOString(),
        data: {
          trigger: 'performance-improvement',
          confidence: 0.7,
          impact: {
            trust: 0.1,
            resources: 0.2,
            alignment: 0.1
          }
        }
      };

      // Mock event bus to emit failure
      (eventBus.publish as jest.Mock).mockImplementation((event, priority) => {
        if (event.type === 'recovery:step-started' && event.data.step === 'verify-state-restoration') {
          throw new Error('State verification failed');
        }
        return Promise.resolve();
      });

      await eventBus.publish(data, 'high');

      expect(eventBus.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'recovery:fallback-started',
          data: expect.objectContaining({
            step: 'emergency-state-restoration'
          })
        }),
        'high'
      );

      expect(metricsTracker.trackMetric).toHaveBeenCalledWith(
        'recovery.failure',
        expect.any(Number),
        expect.objectContaining({
          type: 'evolution',
          error: 'State verification failed'
        })
      );
    });
  });
}); 