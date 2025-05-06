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

interface Event {
  type: string;
  data: any;
  timestamp: string;
  sessionId?: string;
  agentVersion?: string;
  metricSeverity?: 'low' | 'medium' | 'high';
}

export class EventBusAgent {
  private traceId: string;
  private subscribers: Record<string, ((event: Event) => void)[]> = {};
  private sessionId: string;
  private agentVersion: string;

  constructor(traceId: string) {
    this.traceId = traceId;
    const config = loadConfig();
    this.sessionId = config.SESSION_ID || 'default';
    this.agentVersion = config.AGENT_VERSION || '1.1.0';
  }

  async publish(event: Event, severity: 'low' | 'medium' | 'high' = 'low'): Promise<void> {
    try {
      const enrichedEvent = {
        ...event,
        sessionId: this.sessionId,
        agentVersion: this.agentVersion,
        metricSeverity: severity,
      };
      await appendToFixContextAsync(`[${this.traceId}] Published event: ${event.type}`);
      await logInnovationMetric('event_published', { type: event.type, severity }, this.traceId);
      const callbacks = this.subscribers[event.type] || [];
      for (const callback of callbacks) {
        callback(enrichedEvent);
      }
    } catch (err) {
      await appendToFixContextAsync(`[${this.traceId}] Event publish failed: ${(err as Error).message}`);
      await logInnovationMetric('event_publish_failed', { error: (err as Error).message }, this.traceId);
    }
  }

  async subscribe(type: string, callback: (event: Event) => void): Promise<void> {
    if (!this.subscribers[type]) {
      this.subscribers[type] = [];
    }
    this.subscribers[type].push(callback);
    await appendToFixContextAsync(`[${this.traceId}] Subscribed to event: ${type}`);
    await logInnovationMetric('event_subscribed', { type }, this.traceId);
  }
} 