/**
 * event-bus.ts
 * 
 * Purpose:
 * Provides a central event bus for the Codex system.
 * Handles event emission and subscription.
 */

type EventHandler<T = any> = (event: T) => void;

export class EventBus {
  private handlers: Map<string, Set<EventHandler>>;

  constructor() {
    this.handlers = new Map();
  }

  /**
   * Subscribes to an event type
   */
  on<T>(eventType: string, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(eventType) ?? new Set();
    handlers.add(handler);
    this.handlers.set(eventType, handlers);
  }

  /**
   * Unsubscribes from an event type
   */
  off<T>(eventType: string, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(eventType);
      }
    }
  }

  /**
   * Emits an event to all subscribers
   */
  emit<T>(eventType: string, event: T): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      for (const handler of handlers) {
        handler(event);
      }
    }
  }

  /**
   * Clears all event handlers
   */
  clear(): void {
    this.handlers.clear();
  }
} 