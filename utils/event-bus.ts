/**
 * EventBus - Provides a simple event emitter/subscriber system
 * Allows components to communicate through events
 */
export class EventBus {
  private listeners: Map<string, Set<Function>>;

  constructor() {
    this.listeners = new Map();
  }

  /**
   * Emits an event with optional data
   * @param event The event name to emit
   * @param data Optional data to pass with the event
   */
  public emit(event: string, data?: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Subscribes to an event
   * @param event The event name to subscribe to
   * @param listener The callback function to execute when the event occurs
   * @returns A function to unsubscribe from the event
   */
  public on(event: string, listener: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    
    const eventListeners = this.listeners.get(event)!;
    eventListeners.add(listener);

    // Return unsubscribe function
    return () => {
      eventListeners.delete(listener);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
    };
  }

  /**
   * Unsubscribes from an event
   * @param event The event name to unsubscribe from
   * @param listener The callback function to remove
   */
  public off(event: string, listener: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(listener);
      if (eventListeners.size === 0) {
        this.listeners.delete(event);
      }
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
    return this.listeners.get(event)?.size || 0;
  }

  /**
   * Removes all listeners for an event
   * @param event The event name to clear
   */
  public removeAllListeners(event: string): void {
    this.listeners.delete(event);
  }

  /**
   * Gets all registered event names
   * @returns Array of event names
   */
  public eventNames(): string[] {
    return Array.from(this.listeners.keys());
  }
} 