/**
 * meta-control/event-router.ts
 * 
 * Purpose:
 * Implements the event router for managing and routing events within the meta-control layer,
 * ensuring consistent event handling and system-wide observability.
 */

import { EventBus } from '../utils/event-bus';
import { AgentMemory } from '../agent-oversight/agent-memory';
import { MetaControlMetricsTracker } from './metrics-tracker';

interface EventHandler {
  handler: (data: any) => Promise<void>;
  priority: number;
}

interface EventHistory {
  event: string;
  data: any;
  timestamp: number;
  handlers: string[];
}

export class MetaEventRouter {
  private readonly eventBus: EventBus;
  private readonly agentMemory: AgentMemory;
  private readonly metricsTracker: MetaControlMetricsTracker;
  private eventHandlers: Map<string, EventHandler[]>;
  private eventHistory: EventHistory[];
  private readonly maxHistorySize: number;

  constructor(
    eventBus: EventBus,
    agentMemory: AgentMemory,
    metricsTracker: MetaControlMetricsTracker
  ) {
    this.eventBus = eventBus;
    this.agentMemory = agentMemory;
    this.metricsTracker = metricsTracker;
    this.eventHandlers = new Map();
    this.eventHistory = [];
    this.maxHistorySize = 1000;

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // System Health Events
    this.registerHandler('system:health-check', this.handleSystemHealthCheck.bind(this), 1);
    this.registerHandler('system:recovery-started', this.handleSystemRecoveryStarted.bind(this), 1);
    this.registerHandler('system:recovery-completed', this.handleSystemRecoveryCompleted.bind(this), 1);

    // Trust Management Events
    this.registerHandler('trust:violation', this.handleTrustViolation.bind(this), 1);
    this.registerHandler('trust:restored', this.handleTrustRestored.bind(this), 1);

    // Resource Management Events
    this.registerHandler('resource:warning', this.handleResourceWarning.bind(this), 1);
    this.registerHandler('resource:degradation', this.handleResourceDegradation.bind(this), 1);

    // Agent Management Events
    this.registerHandler('agent:selected', this.handleAgentSelected.bind(this), 1);
    this.registerHandler('agent:deselected', this.handleAgentDeselected.bind(this), 1);
    this.registerHandler('agent:failure', this.handleAgentFailure.bind(this), 1);
    this.registerHandler('agent:timeout', this.handleAgentTimeout.bind(this), 1);

    // Codex Alignment Events
    this.registerHandler('alignment:deviation', this.handleAlignmentDeviation.bind(this), 1);
    this.registerHandler('alignment:correction', this.handleAlignmentCorrection.bind(this), 1);

    // Evolution Events
    this.registerHandler('evolution:triggered', this.handleEvolutionTriggered.bind(this), 1);
    this.registerHandler('evolution:completed', this.handleEvolutionCompleted.bind(this), 1);
  }

  public registerHandler(event: string, handler: (data: any) => Promise<void>, priority: number): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }

    const handlers = this.eventHandlers.get(event)!;
    handlers.push({ handler, priority });
    handlers.sort((a, b) => a.priority - b.priority);
  }

  private async handleSystemHealthCheck(data: any): Promise<void> {
    await this.metricsTracker.trackMetric('system:health', 1, {
      source: 'event-router',
      check: data
    });
  }

  private async handleSystemRecoveryStarted(data: any): Promise<void> {
    await this.metricsTracker.trackMetric('system:recovery', 0, {
      source: 'event-router',
      trigger: data.trigger,
      context: data.context
    });
  }

  private async handleSystemRecoveryCompleted(data: any): Promise<void> {
    await this.metricsTracker.trackMetric('system:recovery', data.success ? 1 : 0, {
      source: 'event-router',
      outcome: data.outcome,
      reason: data.reason
    });
  }

  private async handleTrustViolation(data: any): Promise<void> {
    await this.metricsTracker.trackMetric('trust:violation', 1, {
      source: 'event-router',
      type: data.type,
      value: data.value,
      threshold: data.threshold
    });

    this.eventBus.emit('system:recovery-started', {
      trigger: 'trust-violation',
      context: data
    });
  }

  private async handleTrustRestored(data: any): Promise<void> {
    await this.metricsTracker.trackMetric('trust:restored', 1, {
      source: 'event-router',
      value: data.value,
      threshold: data.threshold
    });
  }

  private async handleResourceWarning(data: any): Promise<void> {
    await this.metricsTracker.trackMetric('resource:warning', 1, {
      source: 'event-router',
      resource: data.resource,
      current: data.current,
      threshold: data.threshold
    });

    this.eventBus.emit('system:recovery-started', {
      trigger: 'resource-warning',
      context: data
    });
  }

  private async handleResourceDegradation(data: any): Promise<void> {
    await this.metricsTracker.trackMetric('resource:degradation', 1, {
      source: 'event-router',
      action: data.action,
      impact: data.impact
    });
  }

  private async handleAgentSelected(data: any): Promise<void> {
    await this.metricsTracker.trackMetric('agent:selected', 1, {
      source: 'event-router',
      agentId: data.agentId,
      confidence: data.confidence,
      impact: data.impact
    });
  }

  private async handleAgentDeselected(data: any): Promise<void> {
    await this.metricsTracker.trackMetric('agent:deselected', 1, {
      source: 'event-router',
      agentId: data.agentId,
      reason: data.reason
    });
  }

  private async handleAgentFailure(data: any): Promise<void> {
    await this.metricsTracker.trackMetric('agent:failure', 1, {
      source: 'event-router',
      agentId: data.agentId,
      error: data.error
    });

    this.eventBus.emit('system:recovery-started', {
      trigger: 'agent-failure',
      context: data
    });
  }

  private async handleAgentTimeout(data: any): Promise<void> {
    await this.metricsTracker.trackMetric('agent:timeout', 1, {
      source: 'event-router',
      agentId: data.agentId,
      duration: data.duration
    });

    this.eventBus.emit('system:recovery-started', {
      trigger: 'agent-timeout',
      context: data
    });
  }

  private async handleAlignmentDeviation(data: any): Promise<void> {
    await this.metricsTracker.trackMetric('alignment:deviation', 1, {
      source: 'event-router',
      type: data.type,
      severity: data.severity,
      details: data.details
    });

    this.eventBus.emit('system:recovery-started', {
      trigger: 'alignment-deviation',
      context: data
    });
  }

  private async handleAlignmentCorrection(data: any): Promise<void> {
    await this.metricsTracker.trackMetric('alignment:correction', 1, {
      source: 'event-router',
      type: data.type,
      impact: data.impact
    });
  }

  private async handleEvolutionTriggered(data: any): Promise<void> {
    await this.metricsTracker.trackMetric('evolution:triggered', 1, {
      source: 'event-router',
      trigger: data.trigger,
      confidence: data.confidence,
      impact: data.impact
    });
  }

  private async handleEvolutionCompleted(data: any): Promise<void> {
    await this.metricsTracker.trackMetric('evolution:completed', data.success ? 1 : 0, {
      source: 'event-router',
      impact: data.impact,
      reason: data.reason
    });
  }

  public async routeEvent(event: string, data: any): Promise<void> {
    try {
      const handlers = this.eventHandlers.get(event) || [];
      const handlerNames: string[] = [];

      for (const { handler } of handlers) {
        try {
          await handler(data);
          handlerNames.push(handler.name);
        } catch (error) {
          console.error(`Error in event handler ${handler.name}:`, error);
          this.eventBus.emit('event:handler-error', {
            event,
            handler: handler.name,
            error
          });
        }
      }

      this.addToHistory(event, data, handlerNames);
    } catch (error) {
      console.error(`Error routing event ${event}:`, error);
      this.eventBus.emit('event:routing-error', {
        event,
        error
      });
    }
  }

  private addToHistory(event: string, data: any, handlers: string[]): void {
    this.eventHistory.push({
      event,
      data,
      timestamp: Date.now(),
      handlers
    });

    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
  }

  public getEventHistory(): EventHistory[] {
    return [...this.eventHistory];
  }

  public clearEventHistory(): void {
    this.eventHistory = [];
  }
} 