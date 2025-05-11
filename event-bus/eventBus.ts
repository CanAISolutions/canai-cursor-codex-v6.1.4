/**
 * @file event-bus/eventBus.ts
 * @description Event bus for system-wide event handling
 * @version 6.2.1
 */

type EventHandler = (data: any) => Promise<void> | void;

export class EventBus {
  private handlers: Map<string, EventHandler[]>;
  private static instance: EventBus;

  private constructor() {
    this.handlers = new Map();
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

  public off(event: string, handler: EventHandler): void {
    if (!this.handlers.has(event)) return;
    
    const handlers = this.handlers.get(event)!;
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
    }
  }

  public async emit(event: string, data: any): Promise<void> {
    if (!this.handlers.has(event)) return;

    const handlers = this.handlers.get(event)!;
    await Promise.all(handlers.map(handler => handler(data)));
  }

  public clear(): void {
    this.handlers.clear();
  }
} 