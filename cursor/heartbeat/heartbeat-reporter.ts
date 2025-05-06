/**
 * heartbeat/heartbeat-reporter.ts
 * 
 * Purpose:
 * Handles logging and metrics reporting for heartbeat events.
 */

import { EventBus } from '../utils/event-bus';
import { HeartbeatEvent, AgentHealthMetrics } from './heartbeat-monitor';
import { TrustScorer } from '../agents/trust-scorer/trust-scorer';
import { EvolutionTriggerManager } from '../evolution-triggers/evolution-trigger';

export class HeartbeatReporter {
  private readonly metricsLog: string[] = [];
  private readonly fixLog: string[] = [];
  private readonly MAX_LOG_SIZE = 1000;

  constructor(
    private eventBus: EventBus,
    private trustScorer: TrustScorer,
    private evolutionTriggerManager: EvolutionTriggerManager
  ) {
    this.setupEventListeners();
  }

  /**
   * Sets up event listeners for heartbeat events
   */
  private setupEventListeners(): void {
    this.eventBus.on('heartbeat', (event: HeartbeatEvent) => {
      this.handleHeartbeatEvent(event);
    });
  }

  /**
   * Handles heartbeat events
   */
  private async handleHeartbeatEvent(event: HeartbeatEvent): Promise<void> {
    // Log to metrics
    this.logMetrics(event);

    // Handle warnings and recovery events
    if (event.type === 'warning' || event.type === 'recovery') {
      await this.handleWarningOrRecovery(event);
    }

    // Feed into evolution triggers if needed
    if (this.shouldTriggerEvolution(event)) {
      await this.feedToEvolutionTriggers(event);
    }
  }

  /**
   * Logs metrics to the metrics log
   */
  private logMetrics(event: HeartbeatEvent): void {
    const logEntry = this.formatMetricsLogEntry(event);
    this.metricsLog.push(logEntry);

    // Trim log if it exceeds max size
    if (this.metricsLog.length > this.MAX_LOG_SIZE) {
      this.metricsLog.shift();
    }
  }

  /**
   * Formats a metrics log entry
   */
  private formatMetricsLogEntry(event: HeartbeatEvent): string {
    const timestamp = new Date(event.timestamp).toISOString();
    const metrics = event.metrics;
    
    return JSON.stringify({
      timestamp,
      type: event.type,
      agentId: event.agentId,
      metrics: {
        responsiveness: metrics.responsiveness,
        resourceUsage: metrics.resourceUsage,
        trustScore: metrics.trustScore
      },
      message: event.message
    });
  }

  /**
   * Handles warning or recovery events
   */
  private async handleWarningOrRecovery(event: HeartbeatEvent): Promise<void> {
    const logEntry = this.formatFixLogEntry(event);
    this.fixLog.push(logEntry);

    // Trim log if it exceeds max size
    if (this.fixLog.length > this.MAX_LOG_SIZE) {
      this.fixLog.shift();
    }

    // Update trust score if it's a warning
    if (event.type === 'warning') {
      await this.updateTrustScore(event);
    }
  }

  /**
   * Formats a fix log entry
   */
  private formatFixLogEntry(event: HeartbeatEvent): string {
    const timestamp = new Date(event.timestamp).toISOString();
    
    return JSON.stringify({
      timestamp,
      type: event.type,
      agentId: event.agentId,
      message: event.message,
      metrics: event.metrics
    });
  }

  /**
   * Updates trust score based on warning
   */
  private async updateTrustScore(event: HeartbeatEvent): Promise<void> {
    const severity = this.calculateWarningSeverity(event);
    await this.trustScorer.adjustTrustScore(event.agentId, -severity);
  }

  /**
   * Calculates warning severity
   */
  private calculateWarningSeverity(event: HeartbeatEvent): number {
    const metrics = event.metrics;
    let severity = 0.1; // Base severity

    // Adjust based on metrics
    if (metrics.responsiveness && metrics.responsiveness < 0.5) {
      severity += 0.2;
    }
    if (metrics.resourceUsage) {
      if (metrics.resourceUsage.cpu > 0.9) severity += 0.1;
      if (metrics.resourceUsage.memory > 0.9) severity += 0.1;
    }
    if (metrics.trustScore && metrics.trustScore < 0.7) {
      severity += 0.2;
    }

    return Math.min(severity, 0.5); // Cap at 0.5
  }

  /**
   * Determines if event should trigger evolution
   */
  private shouldTriggerEvolution(event: HeartbeatEvent): boolean {
    const metrics = event.metrics;
    
    // Trigger if responsiveness is critically low
    if (metrics.responsiveness && metrics.responsiveness < 0.3) {
      return true;
    }

    // Trigger if resource usage is high
    if (metrics.resourceUsage) {
      if (metrics.resourceUsage.cpu > 0.9 || metrics.resourceUsage.memory > 0.9) {
        return true;
      }
    }

    // Trigger if trust score is critically low
    if (metrics.trustScore && metrics.trustScore < 0.5) {
      return true;
    }

    return false;
  }

  /**
   * Feeds event to evolution triggers
   */
  private async feedToEvolutionTriggers(event: HeartbeatEvent): Promise<void> {
    const metrics = event.metrics;
    
    // Create evolution event
    const evolutionEvent = {
      type: 'heartbeat',
      agentId: event.agentId,
      metrics: {
        responsiveness: metrics.responsiveness,
        resourceUsage: metrics.resourceUsage,
        trustScore: metrics.trustScore
      },
      timestamp: event.timestamp
    };

    // Trigger evolution
    await this.evolutionTriggerManager.handleEvent(evolutionEvent);
  }

  /**
   * Gets metrics log
   */
  getMetricsLog(): string[] {
    return [...this.metricsLog];
  }

  /**
   * Gets fix log
   */
  getFixLog(): string[] {
    return [...this.fixLog];
  }

  /**
   * Clears logs
   */
  clearLogs(): void {
    this.metricsLog.length = 0;
    this.fixLog.length = 0;
  }
} 