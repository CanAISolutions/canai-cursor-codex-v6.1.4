/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Provide event bus for system-wide event handling"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Central event bus for system event handling
 */

type EventHandler = (event: any) => void;

interface EventSubscription {
  handler: EventHandler;
  once: boolean;
}

export class EventBus {
  private static instance: EventBus;
  private handlers: Map<string, EventSubscription[]>;

  private constructor() {
    this.handlers = new Map();
  }

  /**
   * Gets the singleton instance of EventBus
   */
  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Subscribes to an event
   */
  public on(event: string, handler: EventHandler): void {
    this.subscribe(event, handler, false);
  }

  /**
   * Subscribes to an event once
   */
  public once(event: string, handler: EventHandler): void {
    this.subscribe(event, handler, true);
  }

  /**
   * Unsubscribes from an event
   */
  public off(event: string, handler: EventHandler): void {
    const subscriptions = this.handlers.get(event);
    if (!subscriptions) return;

    const index = subscriptions.findIndex(sub => sub.handler === handler);
    if (index !== -1) {
      subscriptions.splice(index, 1);
    }

    if (subscriptions.length === 0) {
      this.handlers.delete(event);
    }
  }

  /**
   * Emits an event
   */
  public emit(event: string, data?: any): void {
    const subscriptions = this.handlers.get(event);
    if (!subscriptions) return;

    // Create a copy of the array to avoid issues with handlers modifying the array
    const handlersToCall = [...subscriptions];

    handlersToCall.forEach(subscription => {
      try {
        subscription.handler(data);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }

      // Remove one-time handlers
      if (subscription.once) {
        this.off(event, subscription.handler);
      }
    });
  }

  /**
   * Clears all event handlers
   */
  public clear(): void {
    this.handlers.clear();
  }

  /**
   * Gets the number of handlers for an event
   */
  public listenerCount(event: string): number {
    const subscriptions = this.handlers.get(event);
    return subscriptions ? subscriptions.length : 0;
  }

  /**
   * Gets all registered event names
   */
  public eventNames(): string[] {
    return Array.from(this.handlers.keys());
  }

  private subscribe(event: string, handler: EventHandler, once: boolean): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }

    const subscriptions = this.handlers.get(event)!;
    subscriptions.push({ handler, once });
  }
} 