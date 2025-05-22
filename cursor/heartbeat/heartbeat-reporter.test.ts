/**
 * heartbeat/heartbeat-reporter.test.ts
 * 
 * Purpose:
 * Tests the heartbeat reporting functionality.
 */

import { HeartbeatReporter } from './heartbeat-reporter';
import { EventBus } from '../utils/event-bus';
import { TrustScorer } from '../agents/trust-scorer/trust-scorer';
import { EvolutionTriggerManager } from '../evolution-triggers/evolution-trigger';
import { HeartbeatEvent } from './heartbeat-monitor';

describe('HeartbeatReporter', () => {
  let reporter: HeartbeatReporter;
  let eventBus: EventBus;
  let trustScorer: TrustScorer;
  let evolutionTriggerManager: EvolutionTriggerManager;

  beforeEach(() => {
    eventBus = {
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      once: jest.fn(),
      removeAllListeners: jest.fn(),
    } as any;
    trustScorer = {
      adjustTrustScore: jest.fn().mockResolvedValue(undefined)
    } as any;
    evolutionTriggerManager = {
      handleEvent: jest.fn().mockResolvedValue(undefined)
    } as any;

    reporter = new HeartbeatReporter(eventBus, trustScorer, evolutionTriggerManager);
  });

  describe('event handling', () => {
    it('should log metrics for ping events', () => {
      const event: HeartbeatEvent = {
        type: 'ping',
        agentId: 'test-agent',
        timestamp: Date.now(),
        metrics: {
          responsiveness: 0.8,
          resourceUsage: {
            cpu: 0.5,
            memory: 0.5
          },
          trustScore: 0.9
        }
      };

      eventBus.emit('heartbeat', event);

      const metricsLog = reporter.getMetricsLog();
      expect(metricsLog).toHaveLength(1);
      expect(JSON.parse(metricsLog[0])).toMatchObject({
        type: 'ping',
        agentId: 'test-agent',
        metrics: {
          responsiveness: 0.8,
          resourceUsage: {
            cpu: 0.5,
            memory: 0.5
          },
          trustScore: 0.9
        }
      });
    });

    it('should log fixes for warning events', () => {
      const event: HeartbeatEvent = {
        type: 'warning',
        agentId: 'test-agent',
        timestamp: Date.now(),
        metrics: {
          responsiveness: 0.3,
          resourceUsage: {
            cpu: 0.95,
            memory: 0.95
          },
          trustScore: 0.6
        },
        message: 'WARNING: Agent responsiveness below threshold'
      };

      eventBus.emit('heartbeat', event);

      const fixLog = reporter.getFixLog();
      expect(fixLog).toHaveLength(1);
      expect(JSON.parse(fixLog[0])).toMatchObject({
        type: 'warning',
        agentId: 'test-agent',
        message: 'WARNING: Agent responsiveness below threshold',
        metrics: {
          responsiveness: 0.3,
          resourceUsage: {
            cpu: 0.95,
            memory: 0.95
          },
          trustScore: 0.6
        }
      });
    });
  });

  describe('trust score adjustment', () => {
    it('should adjust trust score for warning events', async () => {
      const event: HeartbeatEvent = {
        type: 'warning',
        agentId: 'test-agent',
        timestamp: Date.now(),
        metrics: {
          responsiveness: 0.3,
          resourceUsage: {
            cpu: 0.95,
            memory: 0.95
          },
          trustScore: 0.6
        },
        message: 'WARNING: Agent responsiveness below threshold'
      };

      eventBus.emit('heartbeat', event);

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(trustScorer.adjustTrustScore).toHaveBeenCalledWith('test-agent', expect.any(Number));
      const severity = (trustScorer.adjustTrustScore as jest.Mock).mock.calls[0][1];
      expect(severity).toBeGreaterThan(0);
      expect(severity).toBeLessThanOrEqual(0.5);
    });
  });

  describe('evolution triggering', () => {
    it('should trigger evolution for critical responsiveness', async () => {
      const event: HeartbeatEvent = {
        type: 'warning',
        agentId: 'test-agent',
        timestamp: Date.now(),
        metrics: {
          responsiveness: 0.2,
          resourceUsage: {
            cpu: 0.5,
            memory: 0.5
          },
          trustScore: 0.8
        },
        message: 'WARNING: Agent responsiveness below threshold'
      };

      eventBus.emit('heartbeat', event);

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(evolutionTriggerManager.handleEvent).toHaveBeenCalledWith({
        type: 'heartbeat',
        agentId: 'test-agent',
        metrics: {
          responsiveness: 0.2,
          resourceUsage: {
            cpu: 0.5,
            memory: 0.5
          },
          trustScore: 0.8
        },
        timestamp: expect.any(Number)
      });
    });

    it('should trigger evolution for high resource usage', async () => {
      const event: HeartbeatEvent = {
        type: 'warning',
        agentId: 'test-agent',
        timestamp: Date.now(),
        metrics: {
          responsiveness: 0.8,
          resourceUsage: {
            cpu: 0.95,
            memory: 0.95
          },
          trustScore: 0.8
        },
        message: 'WARNING: High resource usage detected'
      };

      eventBus.emit('heartbeat', event);

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(evolutionTriggerManager.handleEvent).toHaveBeenCalledWith({
        type: 'heartbeat',
        agentId: 'test-agent',
        metrics: {
          responsiveness: 0.8,
          resourceUsage: {
            cpu: 0.95,
            memory: 0.95
          },
          trustScore: 0.8
        },
        timestamp: expect.any(Number)
      });
    });

    it('should trigger evolution for low trust score', async () => {
      const event: HeartbeatEvent = {
        type: 'warning',
        agentId: 'test-agent',
        timestamp: Date.now(),
        metrics: {
          responsiveness: 0.8,
          resourceUsage: {
            cpu: 0.5,
            memory: 0.5
          },
          trustScore: 0.4
        },
        message: 'WARNING: Trust score below threshold'
      };

      eventBus.emit('heartbeat', event);

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 0));

      expect(evolutionTriggerManager.handleEvent).toHaveBeenCalledWith({
        type: 'heartbeat',
        agentId: 'test-agent',
        metrics: {
          responsiveness: 0.8,
          resourceUsage: {
            cpu: 0.5,
            memory: 0.5
          },
          trustScore: 0.4
        },
        timestamp: expect.any(Number)
      });
    });
  });

  describe('log management', () => {
    it('should limit log size', () => {
      // Fill logs beyond max size
      for (let i = 0; i < 1100; i++) {
        const event: HeartbeatEvent = {
          type: 'ping',
          agentId: 'test-agent',
          timestamp: Date.now(),
          metrics: {
            responsiveness: 0.8,
            resourceUsage: {
              cpu: 0.5,
              memory: 0.5
            },
            trustScore: 0.9
          }
        };
        eventBus.emit('heartbeat', event);
      }

      const metricsLog = reporter.getMetricsLog();
      expect(metricsLog).toHaveLength(1000);
    });

    it('should clear logs', () => {
      // Add some events
      const event: HeartbeatEvent = {
        type: 'ping',
        agentId: 'test-agent',
        timestamp: Date.now(),
        metrics: {
          responsiveness: 0.8,
          resourceUsage: {
            cpu: 0.5,
            memory: 0.5
          },
          trustScore: 0.9
        }
      };
      eventBus.emit('heartbeat', event);

      // Clear logs
      reporter.clearLogs();

      expect(reporter.getMetricsLog()).toHaveLength(0);
      expect(reporter.getFixLog()).toHaveLength(0);
    });
  });
}); 