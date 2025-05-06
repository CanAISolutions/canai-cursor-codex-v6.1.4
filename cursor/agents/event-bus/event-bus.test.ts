/**
 * @file event-bus.test.ts
 * @description Tests for event-bus.ts.
 */
import { EventBusAgent } from './event-bus';
import { loadConfig } from '../../utils/config-manager';

jest.mock('../../context/fix-context-utils', () => ({
  appendToFixContextAsync: jest.fn(),
}));

jest.mock('../../utils/telemetry', () => ({
  logInnovationMetric: jest.fn(),
}));

jest.mock('../../utils/config-manager', () => ({
  loadConfig: jest.fn(() => ({ SESSION_ID: 'test-session', AGENT_VERSION: '1.1.0' })),
}));

describe('[DreamState] EventBusAgent', () => {
  const traceId = 'test-trace';

  it('publishes and subscribes with enriched telemetry', async () => {
    const eventBus = new EventBusAgent(traceId);
    let receivedEvent: any = null;
    
    await eventBus.subscribe('test:event', (event) => {
      receivedEvent = event;
    });

    await eventBus.publish({
      type: 'test:event',
      data: { value: 42 },
      timestamp: new Date().toISOString()
    }, 'medium');

    expect(receivedEvent).toMatchObject({
      type: 'test:event',
      data: { value: 42 },
      sessionId: 'test-session',
      agentVersion: '1.1.0',
      metricSeverity: 'medium'
    });
  });

  it('handles multiple subscribers for the same event', async () => {
    const eventBus = new EventBusAgent(traceId);
    const receivedEvents: any[] = [];
    
    await eventBus.subscribe('test:event', (event) => {
      receivedEvents.push({ subscriber: 1, event });
    });

    await eventBus.subscribe('test:event', (event) => {
      receivedEvents.push({ subscriber: 2, event });
    });

    await eventBus.publish({
      type: 'test:event',
      data: { value: 42 },
      timestamp: new Date().toISOString()
    });

    expect(receivedEvents).toHaveLength(2);
    expect(receivedEvents[0].subscriber).toBe(1);
    expect(receivedEvents[1].subscriber).toBe(2);
  });

  it('handles events with no subscribers gracefully', async () => {
    const eventBus = new EventBusAgent(traceId);
    
    await expect(eventBus.publish({
      type: 'unsubscribed:event',
      data: { value: 42 },
      timestamp: new Date().toISOString()
    })).resolves.toBeUndefined();
  });

  it('enriches events with session and version information', async () => {
    const eventBus = new EventBusAgent(traceId);
    let receivedEvent: any = null;
    
    await eventBus.subscribe('test:event', (event) => {
      receivedEvent = event;
    });

    await eventBus.publish({
      type: 'test:event',
      data: { value: 42 },
      timestamp: new Date().toISOString()
    });

    expect(receivedEvent.sessionId).toBe('test-session');
    expect(receivedEvent.agentVersion).toBe('1.1.0');
  });
}); 