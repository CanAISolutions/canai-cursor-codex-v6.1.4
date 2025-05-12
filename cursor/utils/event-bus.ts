/**
 * EventBus utility for system-wide event handling
 * @version 2.7.9
 */

type EventHandler = (...args: any[]) => void;

class EventBusClass {
  private handlers: Map<string, EventHandler[]>;

  constructor() {
    this.handlers = new Map();
  }

  /**
   * Subscribe to an event
   * @param event - The event to subscribe to
   * @param handler - The handler function
   */
  on(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
  }

  /**
   * Unsubscribe from an event
   * @param event - The event to unsubscribe from
   * @param handler - The handler function to remove
   */
  off(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) return;
    const handlers = this.handlers.get(event)!;
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
  }

  /**
   * Emit an event
   * @param event - The event to emit
   * @param args - The arguments to pass to handlers
   */
  emit(event: string, ...args: any[]): void {
    if (!this.handlers.has(event)) return;
    this.handlers.get(event)!.forEach(handler => {
      try {
        handler(...args);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }

  /**
   * Clear all handlers for an event
   * @param event - The event to clear
   */
  clear(event: string): void {
    this.handlers.delete(event);
  }

  /**
   * Clear all events and handlers
   */
  clearAll(): void {
    this.handlers.clear();
  }
}

export const EventBus = new EventBusClass(); 