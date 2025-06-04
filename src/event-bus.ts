/**
 * EventBus Class
 * 
 * Provides a simple pub/sub event system for cross-component communication.
 * Components can subscribe to events and publish events to this central bus.
 */
export class EventBus {
  private events: Map<string, Function[]> = new Map();
  
  /**
   * Subscribe to an event
   * 
   * @param eventName - Name of the event to subscribe to
   * @param callback - Function to call when event is emitted
   * @returns Unsubscribe function
   */
  on(eventName: string, callback: Function): () => void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    
    const handlers = this.events.get(eventName)!;
    handlers.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = handlers.indexOf(callback);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    };
  }
  
  /**
   * Emit an event with data
   * 
   * @param eventName - Name of the event to emit
   * @param data - Data to pass to subscribers
   */
  emit(eventName: string, data?: any): void {
    if (!this.events.has(eventName)) {
      return;
    }
    
    const handlers = this.events.get(eventName)!;
    handlers.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event handler for ${eventName}:`, error);
      }
    });
  }
  
  /**
   * Remove all subscribers for an event
   * 
   * @param eventName - Name of the event to clear
   */
  clear(eventName: string): void {
    this.events.delete(eventName);
  }
  
  /**
   * Remove all event subscribers
   */
  clearAll(): void {
    this.events.clear();
  }
  
  /**
   * Get count of subscribers for an event
   * 
   * @param eventName - Name of the event
   * @returns Number of subscribers
   */
  subscriberCount(eventName: string): number {
    return this.events.has(eventName) ? this.events.get(eventName)!.length : 0;
  }
} 