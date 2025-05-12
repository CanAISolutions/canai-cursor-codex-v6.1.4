/**
 * Event Bus
 * 
 * Central event management system for CanAI's interaction layer.
 * Handles event emission, subscription, and logging.
 */

type EventHandler = (data: any) => Promise<void>;

interface EventSubscription {
  handler: EventHandler;
  once: boolean;
}

export class EventBus {
  private static instance: EventBus;
  private handlers: Map<string, EventSubscription[]>;
  private eventLog: Array<{
    event: string;
    data: any;
    timestamp: string;
  }>;

  private constructor() {
    this.handlers = new Map();
    this.eventLog = [];
  }

  /**
   * Get singleton instance
   */
  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Subscribe to an event
   */
  on(event: string, handler: EventHandler): void {
    this.addHandler(event, handler, false);
  }

  /**
   * Subscribe to an event once
   */
  once(event: string, handler: EventHandler): void {
    this.addHandler(event, handler, true);
  }

  /**
   * Unsubscribe from an event
   */
  off(event: string, handler: EventHandler): void {
    const subscriptions = this.handlers.get(event);
    if (subscriptions) {
      const index = subscriptions.findIndex(sub => sub.handler === handler);
      if (index !== -1) {
        subscriptions.splice(index, 1);
      }
    }
  }

  /**
   * Emit an event
   */
  async emit(event: string, data: any): Promise<void> {
    // Log event
    this.logEvent(event, data);

    // Get handlers
    const subscriptions = this.handlers.get(event) || [];
    
    // Execute handlers
    const promises = subscriptions.map(async (subscription) => {
      try {
        await subscription.handler(data);
        
        // Remove one-time handlers
        if (subscription.once) {
          this.off(event, subscription.handler);
        }
      } catch (error: unknown) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });

    await Promise.all(promises);
  }

  /**
   * Get event log
   */
  getEventLog(): Array<{
    event: string;
    data: any;
    timestamp: string;
  }> {
    return [...this.eventLog];
  }

  /**
   * Clear event log
   */
  clearEventLog(): void {
    this.eventLog = [];
  }

  /**
   * Add event handler
   */
  private addHandler(event: string, handler: EventHandler, once: boolean): void {
    const subscriptions = this.handlers.get(event) || [];
    subscriptions.push({ handler, once });
    this.handlers.set(event, subscriptions);
  }

  /**
   * Log event
   */
  private logEvent(event: string, data: any): void {
    this.eventLog.push({
      event,
      data,
      timestamp: new Date().toISOString()
    });

    // Keep log size manageable
    if (this.eventLog.length > 1000) {
      this.eventLog = this.eventLog.slice(-1000);
    }
  }
} 