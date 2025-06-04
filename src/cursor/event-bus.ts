/**
 * EventBus Class
 * 
 * Provides a central event bus for publish/subscribe pattern across the system.
 * Supports typed events, namespace filtering, and dynamic subscription management.
 */
import { Logger } from '../logger';

export class EventBus {
  private handlers: Map<string, EventHandler[]>;
  private logger?: Logger;
  
  /**
   * Creates a new event bus
   * 
   * @param logger - Optional logger instance
   */
  constructor(logger?: Logger) {
    this.handlers = new Map<string, EventHandler[]>();
    this.logger = logger;
    
    if (this.logger) {
      this.logger.debug('EventBus initialized');
    }
  }
  
  /**
   * Emits an event to all subscribers
   * 
   * @param eventName - Name of the event
   * @param data - Data associated with the event
   * @returns Whether any handlers were called
   */
  emit(eventName: string, data: any = {}): boolean {
    try {
      if (this.logger) {
        this.logger.debug(`Emitting event: ${eventName}`, { data });
      }
      
      // Get handlers for this event
      const handlers = this.handlers.get(eventName) || [];
      
      // Get wildcard handlers that should receive all events
      const wildcardHandlers = this.handlers.get('*') || [];
      
      // Combine specific and wildcard handlers
      const allHandlers = [...handlers, ...wildcardHandlers];
      
      if (allHandlers.length === 0) {
        return false;
      }
      
      // Create event object
      const event: Event = {
        name: eventName,
        data,
        timestamp: new Date()
      };
      
      // Call all handlers
      allHandlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          if (this.logger) {
            this.logger.error(`Error in event handler for ${eventName}`, {
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            });
          }
        }
      });
      
      return true;
    } catch (error) {
      if (this.logger) {
        this.logger.error(`Error emitting event: ${eventName}`, {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        });
      }
      return false;
    }
  }
  
  /**
   * Subscribes to an event
   * 
   * @param eventName - Name of the event or * for all events
   * @param handler - Handler function to call when event is emitted
   * @returns Subscription object for unsubscribing
   */
  on(eventName: string, handler: EventHandler): Subscription {
    try {
      if (!this.handlers.has(eventName)) {
        this.handlers.set(eventName, []);
      }
      
      this.handlers.get(eventName)!.push(handler);
      
      if (this.logger) {
        this.logger.debug(`Subscribed to event: ${eventName}`);
      }
      
      // Return subscription object for unsubscribing
      return {
        unsubscribe: () => this.off(eventName, handler)
      };
    } catch (error) {
      if (this.logger) {
        this.logger.error(`Error subscribing to event: ${eventName}`, {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        });
      }
      
      // Return dummy subscription
      return {
        unsubscribe: () => false
      };
    }
  }
  
  /**
   * Subscribes to an event for a single emission
   * 
   * @param eventName - Name of the event or * for all events
   * @param handler - Handler function to call when event is emitted
   * @returns Subscription object for unsubscribing
   */
  once(eventName: string, handler: EventHandler): Subscription {
    try {
      // Create wrapper that will unsubscribe after first call
      const wrappedHandler: EventHandler = (event: Event) => {
        // Unsubscribe first to prevent recursion if handler emits same event
        this.off(eventName, wrappedHandler);
        
        // Call original handler
        handler(event);
      };
      
      // Subscribe with wrapped handler
      return this.on(eventName, wrappedHandler);
    } catch (error) {
      if (this.logger) {
        this.logger.error(`Error subscribing once to event: ${eventName}`, {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        });
      }
      
      // Return dummy subscription
      return {
        unsubscribe: () => false
      };
    }
  }
  
  /**
   * Unsubscribes from an event
   * 
   * @param eventName - Name of the event
   * @param handler - Handler function to remove
   * @returns Whether the handler was removed
   */
  off(eventName: string, handler: EventHandler): boolean {
    try {
      if (!this.handlers.has(eventName)) {
        return false;
      }
      
      const handlers = this.handlers.get(eventName)!;
      const index = handlers.indexOf(handler);
      
      if (index === -1) {
        return false;
      }
      
      handlers.splice(index, 1);
      
      // Remove empty handler arrays
      if (handlers.length === 0) {
        this.handlers.delete(eventName);
      }
      
      if (this.logger) {
        this.logger.debug(`Unsubscribed from event: ${eventName}`);
      }
      
      return true;
    } catch (error) {
      if (this.logger) {
        this.logger.error(`Error unsubscribing from event: ${eventName}`, {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        });
      }
      
      return false;
    }
  }
  
  /**
   * Removes all subscriptions for an event
   * 
   * @param eventName - Name of the event or undefined for all events
   * @returns Whether any handlers were removed
   */
  removeAllListeners(eventName?: string): boolean {
    try {
      if (eventName) {
        // Remove all handlers for specific event
        const hadHandlers = this.handlers.has(eventName);
        this.handlers.delete(eventName);
        
        if (this.logger && hadHandlers) {
          this.logger.debug(`Removed all listeners for event: ${eventName}`);
        }
        
        return hadHandlers;
      } else {
        // Remove all handlers for all events
        const hadHandlers = this.handlers.size > 0;
        this.handlers.clear();
        
        if (this.logger && hadHandlers) {
          this.logger.debug('Removed all event listeners');
        }
        
        return hadHandlers;
      }
    } catch (error) {
      if (this.logger) {
        this.logger.error(`Error removing all listeners${eventName ? ` for event: ${eventName}` : ''}`, {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        });
      }
      
      return false;
    }
  }
  
  /**
   * Gets the number of handlers for an event
   * 
   * @param eventName - Name of the event or undefined for all events
   * @returns Number of handlers
   */
  listenerCount(eventName?: string): number {
    try {
      if (eventName) {
        // Get count for specific event
        return this.handlers.get(eventName)?.length || 0;
      } else {
        // Get count for all events
        let count = 0;
        
        this.handlers.forEach(handlers => {
          count += handlers.length;
        });
        
        return count;
      }
    } catch (error) {
      if (this.logger) {
        this.logger.error(`Error getting listener count${eventName ? ` for event: ${eventName}` : ''}`, {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        });
      }
      
      return 0;
    }
  }
  
  /**
   * Gets all event names with active subscriptions
   * 
   * @returns Array of event names
   */
  eventNames(): string[] {
    return Array.from(this.handlers.keys());
  }
}

/**
 * Event handler function type
 */
export type EventHandler = (event: Event) => void;

/**
 * Event object interface
 */
export interface Event {
  name: string;
  data: any;
  timestamp: Date;
}

/**
 * Subscription interface for unsubscribing
 */
export interface Subscription {
  unsubscribe: () => boolean;
} 