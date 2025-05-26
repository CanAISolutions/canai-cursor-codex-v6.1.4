/**
 * @file event-bus.ts
 * @description Pub/sub with telemetry enrichment.
 * @pillar Compoundable Leverage
 * @maturity Stable
 * @status Active
 */
import { EventBus as CanonicalEventBus } from '../../event-bus/eventBus';
import { appendToFixContextAsync } from '../../context/fix-context-utils';
import { logInnovationMetric } from '../../utils/telemetry';
import { loadConfig } from '../../utils/config-manager';

export type EventCallback = (event: Event) => void | Promise<void>;

export interface Event {
  type: string;
  data: unknown;
  timestamp: string;
  sessionId?: string;
  agentVersion?: string;
  metricSeverity?: 'low' | 'medium' | 'high';
}

export class EventBus {
  private canonicalEventBus: CanonicalEventBus;
  private agentHandlers: Map<string, Set<EventCallback>>;

  constructor() {
    this.canonicalEventBus = CanonicalEventBus.getInstance();
    this.agentHandlers = new Map();
  }

  // Delegate to canonical EventBus for standard functionality
  public on(event: string, handler: (data: any) => Promise<void>): void {
    this.canonicalEventBus.on(event, handler);
  }

  public off(event: string, handler: (data: any) => Promise<void>): void {
    this.canonicalEventBus.off(event, handler);
  }

  public async emit(event: string, data: any, source?: string): Promise<void> {
    await this.canonicalEventBus.emit(event, data, source);
  }

  public clear(event?: string): void {
    this.canonicalEventBus.clear(event);
  }

  public clearAll(): void {
    this.canonicalEventBus.clearAll();
  }

  // Agent-specific functionality
  public onAgent(eventType: string, handler: EventCallback): void {
    if (!this.agentHandlers.has(eventType)) {
      this.agentHandlers.set(eventType, new Set());
    }
    this.agentHandlers.get(eventType)!.add(handler);
  }

  public offAgent(eventType: string, handler: EventCallback): void {
    const handlers = this.agentHandlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.agentHandlers.delete(eventType);
      }
    }
  }

  public async emitAgent(eventType: string, data: unknown): Promise<void> {
    const event: Event = {
      type: eventType,
      data,
      timestamp: new Date().toISOString()
    };

    const handlers = this.agentHandlers.get(eventType);
    if (handlers) {
      await Promise.all(Array.from(handlers).map(handler => handler(event)));
    }
  }

  public async publish(event: Event, priority: 'high' | 'medium' | 'low' = 'medium'): Promise<void> {
    const handlers = this.agentHandlers.get(event.type);
    if (handlers) {
      const promises = Array.from(handlers).map(async handler => {
        try {
          await handler(event);
        } catch (error) {
          // Codex: Always catch and log errors from handlers for all priorities
          // This ensures robust error handling in all environments
          console.error('Error in event handler:', error);
        }
      });
      await Promise.all(promises);
    }
  }

  public subscribe(eventType: string, handler: EventCallback): void {
    this.onAgent(eventType, handler);
  }

  public clearAgent(): void {
    this.agentHandlers.clear();
  }
}

export class EventBusAgent extends EventBus {
  constructor() {
    super();
  }

  public async handleEvent(event: Event): Promise<void> {
    await this.publish(event, event.metricSeverity || 'medium');
  }

  public async handleError(error: Error): Promise<void> {
    await this.publish({
      type: 'error',
      data: {
        message: error.message,
        stack: error.stack
      },
      timestamp: new Date().toISOString(),
      metricSeverity: 'high'
    }, 'high');
  }
} 