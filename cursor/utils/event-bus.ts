/**
 * EventBus - Canonical Export with Standardized Interface
 * 
 * Provides standardized interface and mock implementation to resolve type conflicts
 * across the entire codebase.
 */

// Standardized EventBus interface
export interface IEventBus {
  on(event: string, handler: (data: any) => Promise<void>): void;
  emit(event: string, data: any, source?: string): Promise<void>;
  off(event: string, handler: (data: any) => Promise<void>): void;
  clear(event?: string): void;
}

// Production EventBus implementation
export class EventBus implements IEventBus {
  private handlers: Map<string, Array<(data: any) => Promise<void>>> = new Map();

  public on(event: string, handler: (data: any) => Promise<void>): void {
    const handlers = this.handlers.get(event) || [];
    handlers.push(handler);
    this.handlers.set(event, handlers);
  }

  public async emit(event: string, data: any): Promise<void> {
    const handlers = this.handlers.get(event) || [];
    for (const handler of handlers) {
      await handler(data);
    }
  }

  public off(event: string, handler: (data: any) => Promise<void>): void {
    const handlers = this.handlers.get(event) || [];
    this.handlers.set(event, handlers.filter(h => h !== handler));
  }

  public clear(event?: string): void {
    if (event) {
      this.handlers.delete(event);
    } else {
      this.handlers.clear();
    }
  }
}

// Mock EventBus for testing
export class MockEventBus implements IEventBus {
  private handlers: Map<string, Array<(data: any) => Promise<void>>> = new Map();

  public on(event: string, handler: (data: any) => Promise<void>): void {
    const handlers = this.handlers.get(event) || [];
    handlers.push(handler);
    this.handlers.set(event, handlers);
  }

  public async emit(event: string, data: any): Promise<void> {
    const handlers = this.handlers.get(event) || [];
    for (const handler of handlers) {
      await handler(data);
    }
  }

  public off(event: string, handler: (data: any) => Promise<void>): void {
    const handlers = this.handlers.get(event) || [];
    this.handlers.set(event, handlers.filter(h => h !== handler));
  }

  public clear(event?: string): void {
    if (event) {
      this.handlers.delete(event);
    } else {
      this.handlers.clear();
    }
  }
}

export default EventBus; 