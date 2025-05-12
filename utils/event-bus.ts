/**
 * Event Bus for handling system-wide events
 * 
 * Purpose: Provides a centralized event handling system for cross-component
 *          communication and state management.
 * 
 * TAP-Status: Locked
 * Codex: v2.7.8
 * Trust Score: 4.2
 */

type EventHandler = (data: any) => void;

export class EventBus {
  private handlers: Map<string, EventHandler[]>;

  constructor() {
    this.handlers = new Map();
  }

  /**
   * Subscribe to an event
   * @param event Event name to subscribe to
   * @param handler Function to call when event is emitted
   */
  subscribe(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
  }

  /**
   * Unsubscribe from an event
   * @param event Event name to unsubscribe from
   * @param handler Handler function to remove
   */
  unsubscribe(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) return;
    
    const handlers = this.handlers.get(event)!;
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
  }

  /**
   * Emit an event
   * @param event Event name to emit
   * @param data Data to pass to handlers
   */
  emit(event: string, data: any): void {
    if (!this.handlers.has(event)) return;
    
    const handlers = this.handlers.get(event)!;
    handlers.forEach(handler => handler(data));
  }

  /**
   * Subscribes to an event
   * @param event The event name to subscribe to
   * @param listener The callback function to execute when the event occurs
   * @returns A function to unsubscribe from the event
   */
  public on(event: string, listener: Function): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    
    const eventHandlers = this.handlers.get(event)!;
    eventHandlers.push(listener as EventHandler);

    // Return unsubscribe function
    return () => {
      this.unsubscribe(event, listener as EventHandler);
    };
  }

  /**
   * Unsubscribes from an event
   * @param event The event name to unsubscribe from
   * @param listener The callback function to remove
   */
  public off(event: string, listener: Function): void {
    if (!this.handlers.has(event)) return;
    
    const eventHandlers = this.handlers.get(event)!;
    const index = eventHandlers.indexOf(listener as EventHandler);
    if (index !== -1) {
      eventHandlers.splice(index, 1);
    }
  }

  /**
   * Subscribes to an event once
   * @param event The event name to subscribe to
   * @param listener The callback function to execute when the event occurs
   * @returns A function to unsubscribe from the event
   */
  public once(event: string, listener: Function): () => void {
    const onceListener = (data: any) => {
      listener(data);
      this.off(event, onceListener);
    };
    return this.on(event, onceListener);
  }

  /**
   * Gets the number of listeners for an event
   * @param event The event name to check
   * @returns The number of listeners
   */
  public listenerCount(event: string): number {
    return this.handlers.get(event)?.length || 0;
  }

  /**
   * Removes all listeners for an event
   * @param event The event name to clear
   */
  public removeAllListeners(event: string): void {
    this.handlers.delete(event);
  }

  /**
   * Gets all registered event names
   * @returns Array of event names
   */
  public eventNames(): string[] {
    return Array.from(this.handlers.keys());
  }
} 