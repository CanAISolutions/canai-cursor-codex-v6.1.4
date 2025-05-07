/**
 * utils/event-bus.ts
 * 
 * Purpose:
 * Provides a centralized event bus for system-wide event handling.
 */

type EventCallback = (data: any) => void | Promise<void>;

export class EventBus {
  private handlers: Map<string, Set<EventCallback>>;

  constructor() {
    this.handlers = new Map();
  }

  /**
   * Register an event handler
   */
  public on(eventType: string, handler: EventCallback): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)?.add(handler);
  }

  /**
   * Remove an event handler
   */
  public off(eventType: string, handler: EventCallback): void {
    this.handlers.get(eventType)?.delete(handler);
  }

  /**
   * Emit an event with data
   */
  public async emit(eventType: string, data: any): Promise<void> {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      await Promise.all(
        Array.from(handlers).map(handler => handler(data))
      );
    }
  }

  /**
   * Publish an event with priority
   */
  public async publish(event: {
    type: string;
    data: any;
    timestamp: string;
  }, priority: 'low' | 'medium' | 'high' = 'medium'): Promise<void> {
    await this.emit(event.type, {
      ...event.data,
      priority,
      timestamp: event.timestamp
    });
  }

  /**
   * Clear all event handlers
   */
  public clear(): void {
    this.handlers.clear();
  }
} 