/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Event bus for system-wide communication"
 * @EmotionQA false
 * @FallbackReady true
 */

type EventHandler = (event: any) => void;

export class EventBus {
  private static instance: EventBus;
  private handlers: Map<string, EventHandler[]>;

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

  public emit(event: string, data: any): void {
    const handlers = this.handlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
} 