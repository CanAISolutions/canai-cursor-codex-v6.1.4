/**
 * @file event-bus/eventBus.ts
 * @description Event bus for system-wide event handling
 * @version 6.2.1
 */

type EventHandler = (data: any) => Promise<void> | void;

export class EventBus {
  private handlers: Map<string, EventHandler[]>;
  private static instance: EventBus;
  private eventLog: Array<{ event: string; data: any; timestamp: string }> = [];
  private static EVENT_VERSION = 'v1.0';

  private constructor() {
    this.handlers = new Map();
    this.eventLog = [];
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public on(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
  }

  /**
   * Subscribe to an event once
   */
  public once(event: string, handler: EventHandler): void {
    const onceHandler: EventHandler = async (data: any) => {
      await handler(data);
      this.off(event, onceHandler);
    };
    this.on(event, onceHandler);
  }

  public off(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) return;
    const handlers = this.handlers.get(event)!;
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
  }

  /**
   * Emit an event (logs event and supports source)
   */
  public async emit(event: string, data: any, source: string = 'unknown'): Promise<void> {
    // Compose event payload
    const payload = {
      ...data,
      source,
      version: EventBus.EVENT_VERSION,
      timestamp: new Date().toISOString(),
    };
    this.logEvent(event, payload);
    if (!this.handlers.has(event)) return;
    const handlers = this.handlers.get(event)!;
    await Promise.all(handlers.map(handler => handler(payload)));
  }

  public clear(): void {
    this.handlers.clear();
    this.eventLog = [];
  }

  /**
   * Get event log
   */
  public getEventLog(): Array<{ event: string; data: any; timestamp: string }> {
    return [...this.eventLog];
  }

  /**
   * Clear event log
   */
  public clearEventLog(): void {
    this.eventLog = [];
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

  /**
   * Add event handler (internal use for on/once)
   */
  private addHandler(event: string, handler: EventHandler, once: boolean): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    // For this implementation, 'once' is handled by the once() wrapper, so we just add the handler
    this.handlers.get(event)!.push(handler);
  }
} 