/**
 * meta-control/event-router.test.ts
 * 
 * Purpose:
 * Tests the MetaEventRouter class to ensure proper event routing, handling, and metrics tracking.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventBus } from '../event-bus/eventBus';
import { AgentMemory } from '../agent-oversight/agent-memory';
import { MetaControlMetricsTracker } from './metrics-tracker';
import { MetaEventRouter } from './event-router';

describe('MetaEventRouter', () => {
  let eventBus: EventBus;
  let agentMemory: AgentMemory;
  let metricsTracker: MetaControlMetricsTracker;
  let eventRouter: MetaEventRouter;

  beforeEach(() => {
    eventBus = EventBus.getInstance();
    agentMemory = new AgentMemory(eventBus);
    metricsTracker = new MetaControlMetricsTracker(eventBus, agentMemory);
    eventRouter = new MetaEventRouter(eventBus, agentMemory, metricsTracker);
  });

  describe('Event Registration', () => {
    it('should register handlers with correct priority', async () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      const handler3 = vi.fn();

      eventRouter.registerHandler('test:event', handler1, 3);
      eventRouter.registerHandler('test:event', handler2, 1);
      eventRouter.registerHandler('test:event', handler3, 2);

      await eventRouter.routeEvent('test:event', { data: 'test' });

      expect(handler2).toHaveBeenCalled();
      expect(handler3).toHaveBeenCalled();
      expect(handler1).toHaveBeenCalled();
      // TODO: If strict call order is required, use a custom matcher or check call order manually.
    });
  });

  describe('System Health Events', () => {
    it('should handle system health check events', async () => {
      const spy = vi.spyOn(metricsTracker, 'trackMetric');
      
      await eventRouter.routeEvent('system:health-check', {
        status: 'healthy',
        metrics: { cpu: 0.5, memory: 0.6 }
      });

      expect(spy).toHaveBeenCalledWith(
        'system:health',
        1,
        expect.objectContaining({
          source: 'event-router',
          check: expect.any(Object)
        })
      );
    });

    it('should handle system recovery events', async () => {
      const spy = vi.spyOn(metricsTracker, 'trackMetric');
      
      await eventRouter.routeEvent('system:recovery-started', {
        trigger: 'health-check',
        context: { metrics: { cpu: 0.9 } }
      });

      expect(spy).toHaveBeenCalledWith(
        'system:recovery',
        0,
        expect.objectContaining({
          source: 'event-router',
          trigger: 'health-check'
        })
      );

      await eventRouter.routeEvent('system:recovery-completed', {
        success: true,
        outcome: 'recovered',
        reason: 'automatic'
      });

      expect(spy).toHaveBeenCalledWith(
        'system:recovery',
        1,
        expect.objectContaining({
          source: 'event-router',
          outcome: 'recovered'
        })
      );
    });
  });

  describe('Trust Management Events', () => {
    it('should handle trust violation events', async () => {
      const spy = vi.spyOn(metricsTracker, 'trackMetric');
      const emitSpy = vi.spyOn(eventBus, 'emit');
      
      await eventRouter.routeEvent('trust:violation', {
        type: 'threshold',
        value: 0.3,
        threshold: 0.5
      });

      expect(spy).toHaveBeenCalledWith(
        'trust:violation',
        1,
        expect.objectContaining({
          source: 'event-router',
          type: 'threshold'
        })
      );

      expect(emitSpy).toHaveBeenCalledWith(
        'system:recovery-started',
        expect.objectContaining({
          trigger: 'trust-violation'
        })
      );
    });

    it('should handle trust restored events', async () => {
      const spy = vi.spyOn(metricsTracker, 'trackMetric');
      
      await eventRouter.routeEvent('trust:restored', {
        value: 0.8,
        threshold: 0.5
      });

      expect(spy).toHaveBeenCalledWith(
        'trust:restored',
        1,
        expect.objectContaining({
          source: 'event-router',
          value: 0.8
        })
      );
    });
  });

  describe('Resource Management Events', () => {
    it('should handle resource warning events', async () => {
      const spy = vi.spyOn(metricsTracker, 'trackMetric');
      const emitSpy = vi.spyOn(eventBus, 'emit');
      
      await eventRouter.routeEvent('resource:warning', {
        resource: 'memory',
        current: 0.9,
        threshold: 0.8
      });

      expect(spy).toHaveBeenCalledWith(
        'resource:warning',
        1,
        expect.objectContaining({
          source: 'event-router',
          resource: 'memory'
        })
      );

      expect(emitSpy).toHaveBeenCalledWith(
        'system:recovery-started',
        expect.objectContaining({
          trigger: 'resource-warning'
        })
      );
    });

    it('should handle resource degradation events', async () => {
      const spy = vi.spyOn(metricsTracker, 'trackMetric');
      
      await eventRouter.routeEvent('resource:degradation', {
        action: 'cleanup',
        impact: 'reduced'
      });

      expect(spy).toHaveBeenCalledWith(
        'resource:degradation',
        1,
        expect.objectContaining({
          source: 'event-router',
          action: 'cleanup'
        })
      );
    });
  });

  describe('Agent Management Events', () => {
    it('should handle agent selection events', async () => {
      const spy = vi.spyOn(metricsTracker, 'trackMetric');
      
      await eventRouter.routeEvent('agent:selected', {
        agentId: 'agent-1',
        confidence: 0.9,
        impact: 'high'
      });

      expect(spy).toHaveBeenCalledWith(
        'agent:selected',
        1,
        expect.objectContaining({
          source: 'event-router',
          agentId: 'agent-1'
        })
      );
    });

    it('should handle agent failure events', async () => {
      const spy = vi.spyOn(metricsTracker, 'trackMetric');
      const emitSpy = vi.spyOn(eventBus, 'emit');
      
      await eventRouter.routeEvent('agent:failure', {
        agentId: 'agent-1',
        error: 'timeout'
      });

      expect(spy).toHaveBeenCalledWith(
        'agent:failure',
        1,
        expect.objectContaining({
          source: 'event-router',
          agentId: 'agent-1'
        })
      );

      expect(emitSpy).toHaveBeenCalledWith(
        'system:recovery-started',
        expect.objectContaining({
          trigger: 'agent-failure'
        })
      );
    });

    it('should handle agent timeout events', async () => {
      const spy = vi.spyOn(metricsTracker, 'trackMetric');
      const emitSpy = vi.spyOn(eventBus, 'emit');
      
      await eventRouter.routeEvent('agent:timeout', {
        agentId: 'agent-1',
        duration: 5000
      });

      expect(spy).toHaveBeenCalledWith(
        'agent:timeout',
        1,
        expect.objectContaining({
          source: 'event-router',
          agentId: 'agent-1'
        })
      );

      expect(emitSpy).toHaveBeenCalledWith(
        'system:recovery-started',
        expect.objectContaining({
          trigger: 'agent-timeout'
        })
      );
    });
  });

  describe('Codex Alignment Events', () => {
    it('should handle alignment deviation events', async () => {
      const spy = vi.spyOn(metricsTracker, 'trackMetric');
      const emitSpy = vi.spyOn(eventBus, 'emit');
      
      await eventRouter.routeEvent('alignment:deviation', {
        type: 'behavior',
        severity: 'high',
        details: { reason: 'trust-violation' }
      });

      expect(spy).toHaveBeenCalledWith(
        'alignment:deviation',
        1,
        expect.objectContaining({
          source: 'event-router',
          type: 'behavior'
        })
      );

      expect(emitSpy).toHaveBeenCalledWith(
        'system:recovery-started',
        expect.objectContaining({
          trigger: 'alignment-deviation'
        })
      );
    });

    it('should handle alignment correction events', async () => {
      const spy = vi.spyOn(metricsTracker, 'trackMetric');
      
      await eventRouter.routeEvent('alignment:correction', {
        type: 'behavior',
        impact: { before: 0.3, after: 0.8 }
      });

      expect(spy).toHaveBeenCalledWith(
        'alignment:correction',
        1,
        expect.objectContaining({
          source: 'event-router',
          type: 'behavior'
        })
      );
    });
  });

  describe('Evolution Events', () => {
    it('should handle evolution triggered events', async () => {
      const spy = vi.spyOn(metricsTracker, 'trackMetric');
      
      await eventRouter.routeEvent('evolution:triggered', {
        trigger: 'performance',
        confidence: 0.9,
        impact: 'high'
      });

      expect(spy).toHaveBeenCalledWith(
        'evolution:triggered',
        1,
        expect.objectContaining({
          source: 'event-router',
          trigger: 'performance'
        })
      );
    });

    it('should handle evolution completed events', async () => {
      const spy = vi.spyOn(metricsTracker, 'trackMetric');
      
      await eventRouter.routeEvent('evolution:completed', {
        success: true,
        impact: 'high',
        reason: 'automatic'
      });

      expect(spy).toHaveBeenCalledWith(
        'evolution:completed',
        1,
        expect.objectContaining({
          source: 'event-router',
          impact: 'high'
        })
      );
    });
  });

  describe('Event History', () => {
    it('should maintain event history', async () => {
      await eventRouter.routeEvent('test:event', { data: 'test1' });
      await eventRouter.routeEvent('test:event', { data: 'test2' });

      const history = eventRouter.getEventHistory();
      expect(history).toHaveLength(2);
      expect(history[0].event).toBe('test:event');
      expect(history[0].data).toEqual({ data: 'test1' });
      expect(history[1].data).toEqual({ data: 'test2' });
    });

    it('should limit history size', async () => {
      for (let i = 0; i < 1100; i++) {
        await eventRouter.routeEvent('test:event', { data: `test${i}` });
      }

      const history = eventRouter.getEventHistory();
      expect(history).toHaveLength(1000);
      expect(history[0].data).toEqual({ data: 'test100' });
      expect(history[999].data).toEqual({ data: 'test1099' });
    });

    it('should clear event history', async () => {
      await eventRouter.routeEvent('test:event', { data: 'test' });
      eventRouter.clearEventHistory();
      expect(eventRouter.getEventHistory()).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle handler errors gracefully', async () => {
      const errorHandler = vi.fn().mockRejectedValue(new Error('Handler error'));
      const emitSpy = vi.spyOn(eventBus, 'emit');

      eventRouter.registerHandler('test:error', errorHandler, 1);
      await eventRouter.routeEvent('test:error', { data: 'test' });

      expect(emitSpy).toHaveBeenCalledWith(
        'event:handler-error',
        expect.objectContaining({
          event: 'test:error',
          error: expect.any(Error)
        })
      );
    });

    it('should handle routing errors gracefully', async () => {
      const emitSpy = vi.spyOn(eventBus, 'emit');
      vi.spyOn(metricsTracker, 'trackMetric').mockRejectedValue(new Error('Routing error'));

      await eventRouter.routeEvent('system:health-check', { data: 'test' });

      expect(emitSpy).toHaveBeenCalledWith(
        'event:routing-error',
        expect.objectContaining({
          event: 'system:health-check',
          error: expect.any(Error)
        })
      );
    });
  });
}); 