/**
 * @file event-bus.test.ts
 * @description Tests for the EventBus class
 */

import { EventBus, EventCallback, Event } from './event-bus';

describe('EventBus', () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  describe('subscribe', () => {
    it('should subscribe to events', () => {
      const handler = jest.fn();
      eventBus.subscribe('test', handler);
      eventBus.publish({ type: 'test', data: {}, timestamp: new Date().toISOString() }, 'low');
      expect(handler).toHaveBeenCalled();
    });

    it('should handle multiple subscribers', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      eventBus.subscribe('test', handler1);
      eventBus.subscribe('test', handler2);
      eventBus.publish({ type: 'test', data: {}, timestamp: new Date().toISOString() }, 'low');
      expect(handler1).toHaveBeenCalled();
      expect(handler2).toHaveBeenCalled();
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe from events', () => {
      const handler = jest.fn();
      eventBus.subscribe('test', handler);
      eventBus.off('test', handler);
      eventBus.publish({ type: 'test', data: {}, timestamp: new Date().toISOString() }, 'low');
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('publish', () => {
    it('should publish events to subscribers', () => {
      const handler = jest.fn();
      eventBus.subscribe('test', handler);
      const event: Event = { type: 'test', data: { value: 42 }, timestamp: new Date().toISOString() };
      eventBus.publish(event, 'low');
      expect(handler).toHaveBeenCalledWith(event);
    });

    it('should handle events without subscribers', () => {
      const event: Event = { type: 'test', data: {}, timestamp: new Date().toISOString() };
      expect(() => eventBus.publish(event, 'low')).not.toThrow();
    });

    it('should handle errors in subscribers', async () => {
      // Codex: Ensure publish completes without throwing and error is logged
      const errorHandler = jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      });
      eventBus.subscribe('test', errorHandler);
      const event: Event = { type: 'test', data: {}, timestamp: new Date().toISOString() };
      let threw = false;
      try {
        await eventBus.publish(event, 'low');
      } catch (e) {
        threw = true;
      }
      expect(threw).toBe(false);
      expect(errorHandler).toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    it('should clear all subscribers', () => {
      const handler = jest.fn();
      eventBus.subscribe('test', handler);
      eventBus.clear();
      eventBus.publish({ type: 'test', data: {}, timestamp: new Date().toISOString() }, 'low');
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('event types', () => {
    it('should handle different event types', () => {
      const handler = jest.fn();
      eventBus.subscribe('type1', handler);
      eventBus.subscribe('type2', handler);

      eventBus.publish({ type: 'type1', data: {}, timestamp: new Date().toISOString() }, 'low');
      eventBus.publish({ type: 'type2', data: {}, timestamp: new Date().toISOString() }, 'low');

      expect(handler).toHaveBeenCalledTimes(2);
    });
  });

  describe('event data', () => {
    it('should pass event data to subscribers', () => {
      const handler = jest.fn();
      eventBus.subscribe('test', handler);

      const event: Event = {
        type: 'test',
        data: { value: 42, message: 'test' },
        timestamp: new Date().toISOString()
      };

      eventBus.publish(event, 'low');
      expect(handler).toHaveBeenCalledWith(event);
    });
  });
}); 