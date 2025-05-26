/**
 * Event Bus
 * 
 * Central event management system for CanAI's interaction layer.
 * Handles event emission, subscription, and logging.
 *
 * Event Payload Structure:
 * {
 *   event: string; // Event name
 *   data: any; // Event payload (should include source, version, etc.)
 *   source: string; // Source module or identifier
 *   version: string; // Event version (e.g., 'v1.0')
 *   timestamp: string; // ISO timestamp
 * }
 */

type EventHandler = (data: any) => Promise<void>;

interface EventSubscription {
  handler: EventHandler;
  once: boolean;
}

// Helper to safely emit system logs if available
function emitSystemLogIfAvailable(type: string, data: any) {
  if (typeof global !== 'undefined' && typeof (global as any).emitSystemLog === 'function') {
    (global as any).emitSystemLog(type, data);
  }
}

export class EventBus {
  private static instance: EventBus;
  private handlers: Map<string, EventSubscription[]>;
  private eventLog: Array<{
    event: string;
    data: any;
    timestamp: string;
  }>;
  private static EVENT_VERSION = 'v1.0';

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
        if (subscriptions.length === 0) {
          this.handlers.delete(event);
        }
      }
    }
  }

  /**
   * Emit an event
   * @param event Event name
   * @param data Event payload (should include source)
   * @param source Source module or identifier
   */
  async emit(event: string, data: any, source: string = 'unknown'): Promise<void> {
    // Compose event payload
    const payload = {
      ...data,
      source,
      version: EventBus.EVENT_VERSION,
      timestamp: new Date().toISOString(),
    };
    // Log event
    this.logEvent(event, payload);

    // Get handlers
    const subscriptions = this.handlers.get(event) || [];
    if (subscriptions.length === 0) {
      // Log broken pipe scenario to system-intel (if available)
      emitSystemLogIfAvailable('event-bus-broken-pipe', {
        event,
        source,
        timestamp: payload.timestamp,
      });
    }
    // Execute handlers with retry logic
    const promises = subscriptions.map(async (subscription) => {
      let attempts = 0;
      let success = false;
      let lastError: unknown = null;
      while (attempts < 2 && !success) {
        try {
          await subscription.handler(payload);
          success = true;
          // Remove one-time handlers
          if (subscription.once) {
            this.off(event, subscription.handler);
          }
        } catch (error: unknown) {
          attempts++;
          lastError = error;
          // Log handler error to system-intel (if available)
          emitSystemLogIfAvailable('event-bus-handler-error', {
            event,
            source,
            error: error instanceof Error ? error.message : String(error),
            attempts,
            timestamp: payload.timestamp,
          });
        }
      }
      if (!success && lastError) {
        // Final failure after retry
        emitSystemLogIfAvailable('event-bus-handler-failed', {
          event,
          source,
          error: lastError instanceof Error ? lastError.message : String(lastError),
          timestamp: payload.timestamp,
        });
      }
    });
    await Promise.all(promises);
  }

  /**
   * Clear all handlers for a specific event
   */
  clear(event?: string): void {
    if (event) {
      this.handlers.delete(event);
    } else {
      this.handlers.clear();
    }
  }

  /**
   * Clear all events and handlers
   */
  clearAll(): void {
    this.handlers.clear();
    this.eventLog = [];
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
      timestamp: data.timestamp || new Date().toISOString(),
    });
    // Keep log size manageable
    if (this.eventLog.length > 1000) {
      this.eventLog = this.eventLog.slice(-1000);
    }
  }
} 