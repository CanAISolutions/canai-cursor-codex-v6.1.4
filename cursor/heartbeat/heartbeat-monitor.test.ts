/**
 * heartbeat/heartbeat-monitor.test.ts
 * 
 * Purpose:
 * Tests the heartbeat monitoring functionality.
 */

import { HeartbeatMonitor, HeartbeatEvent } from './heartbeat-monitor';
import { EventBus } from '../utils/event-bus';
import { TrustScorer } from '../agents/trust-scorer/trust-scorer';
import { ResourceMonitor } from '../optimization/resource-monitor';

describe('HeartbeatMonitor', () => {
  let monitor: HeartbeatMonitor;
  let eventBus: EventBus;
  let trustScorer: TrustScorer;
  let resourceMonitor: ResourceMonitor;
  let emittedEvents: HeartbeatEvent[];

  beforeEach(() => {
    eventBus = new EventBus();
    trustScorer = {
      getTrustScore: jest.fn().mockResolvedValue(0.8)
    } as any;
    resourceMonitor = {
      getResourceUsage: jest.fn().mockResolvedValue({
        cpu: 0.5,
        memory: 0.5
      })
    } as any;

    monitor = new HeartbeatMonitor(eventBus, trustScorer, resourceMonitor);
    emittedEvents = [];

    eventBus.on('heartbeat', (event: HeartbeatEvent) => {
      emittedEvents.push(event);
    });
  });

  afterEach(() => {
    monitor.stopMonitoring();
  });

  describe('registerAgent', () => {
    it('should register an agent with initial metrics', () => {
      monitor.registerAgent('test-agent');
      expect(emittedEvents).toHaveLength(0);
    });

    it('should throw error when registering same agent twice', () => {
      monitor.registerAgent('test-agent');
      expect(() => monitor.registerAgent('test-agent')).toThrow();
    });
  });

  describe('updateHeartbeat', () => {
    beforeEach(() => {
      monitor.registerAgent('test-agent');
    });

    it('should update agent heartbeat and emit ping event', async () => {
      await monitor.updateHeartbeat('test-agent');

      expect(emittedEvents).toHaveLength(1);
      expect(emittedEvents[0].type).toBe('ping');
      expect(emittedEvents[0].agentId).toBe('test-agent');
      expect(emittedEvents[0].metrics.responsiveness).toBe(1.0);
    });

    it('should throw error when updating unregistered agent', async () => {
      await expect(monitor.updateHeartbeat('unknown-agent')).rejects.toThrow();
    });
  });

  describe('monitoring', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      monitor.registerAgent('test-agent');
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should detect warning timeout', async () => {
      monitor.startMonitoring();
      
      // Fast-forward past warning threshold
      jest.advanceTimersByTime(35000);

      expect(emittedEvents).toHaveLength(1);
      expect(emittedEvents[0].type).toBe('warning');
      expect(emittedEvents[0].message).toContain('WARNING: Agent response delayed');
    });

    it('should detect critical timeout', async () => {
      monitor.startMonitoring();
      
      // Fast-forward past critical threshold
      jest.advanceTimersByTime(65000);

      expect(emittedEvents).toHaveLength(1);
      expect(emittedEvents[0].type).toBe('warning');
      expect(emittedEvents[0].message).toContain('CRITICAL: Agent timeout exceeded');
    });

    it('should detect low responsiveness', async () => {
      // Update heartbeat with low responsiveness
      await monitor.updateHeartbeat('test-agent');
      jest.advanceTimersByTime(40000);
      await monitor.updateHeartbeat('test-agent');

      monitor.startMonitoring();
      jest.advanceTimersByTime(5000);

      expect(emittedEvents).toHaveLength(3); // 2 pings + 1 warning
      const warningEvent = emittedEvents.find(e => e.type === 'warning');
      expect(warningEvent?.message).toContain('WARNING: Agent responsiveness below threshold');
    });
  });

  describe('resource monitoring', () => {
    beforeEach(() => {
      monitor.registerAgent('test-agent');
      resourceMonitor.getResourceUsage = jest.fn().mockResolvedValue({
        cpu: 0.95,
        memory: 0.95
      });
    });

    it('should detect high resource usage', async () => {
      await monitor.updateHeartbeat('test-agent');

      expect(emittedEvents).toHaveLength(2); // 1 ping + 1 warning
      const warningEvent = emittedEvents.find(e => e.type === 'warning');
      expect(warningEvent?.message).toContain('WARNING: High resource usage detected');
    });
  });

  describe('trust score monitoring', () => {
    beforeEach(() => {
      monitor.registerAgent('test-agent');
      trustScorer.getTrustScore = jest.fn().mockResolvedValue(0.6);
    });

    it('should detect low trust score', async () => {
      await monitor.updateHeartbeat('test-agent');

      expect(emittedEvents).toHaveLength(2); // 1 ping + 1 warning
      const warningEvent = emittedEvents.find(e => e.type === 'warning');
      expect(warningEvent?.message).toContain('WARNING: Trust score below threshold');
    });
  });
}); 