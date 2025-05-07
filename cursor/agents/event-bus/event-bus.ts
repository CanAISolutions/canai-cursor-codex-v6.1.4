/**
 * @file event-bus.ts
 * @description Pub/sub with telemetry enrichment.
 * @pillar Compoundable Leverage
 * @maturity Stable
 * @status Active
 */
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
  private handlers: Map<string, Set<EventCallback>>;

  constructor() {
    this.handlers = new Map();
  }

  public on(eventType: string, handler: EventCallback): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);
  }

  public off(eventType: string, handler: EventCallback): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.handlers.delete(eventType);
      }
    }
  }

  public async emit(eventType: string, data: unknown): Promise<void> {
    const event: Event = {
      type: eventType,
      data,
      timestamp: new Date().toISOString()
    };

    const handlers = this.handlers.get(eventType);
    if (handlers) {
      await Promise.all(Array.from(handlers).map(handler => handler(event)));
    }
  }

  public async publish(event: Event, priority: 'high' | 'medium' | 'low' = 'medium'): Promise<void> {
    const handlers = this.handlers.get(event.type);
    if (handlers) {
      const promises = Array.from(handlers).map(handler => handler(event));
      if (priority === 'high') {
        await Promise.all(promises);
      } else {
        Promise.all(promises).catch(error => {
          console.error('Error in event handler:', error);
        });
      }
    }
  }

  public subscribe(eventType: string, handler: EventCallback): void {
    this.on(eventType, handler);
  }

  public clear(): void {
    this.handlers.clear();
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