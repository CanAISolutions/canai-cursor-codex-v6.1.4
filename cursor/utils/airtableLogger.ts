/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Structured logging for smart defaults"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Track and analyze defaults usage patterns
 */

import { EventBus } from '../event-bus/eventBus';
import { emitSystemLog } from './audit-utils';

interface DefaultsLogEntry {
  timestamp: string;
  defaults: {
    tone: string;
    industry?: string;
    intent?: string;
  };
  context: string;
  confidence: number;
  source: 'session' | 'emotional' | 'default';
  success: boolean;
  reason?: string;
}

export class AirtableLogger {
  private readonly eventBus = EventBus.getInstance();
  private readonly TABLE_NAME = 'SmartDefaultsLogs';
  private readonly BATCH_SIZE = 10;
  private logQueue: DefaultsLogEntry[] = [];

  constructor() {
    this.initializeEventListeners();
  }

  /**
   * Logs a successful defaults application
   */
  async logDefaultApplied(entry: Omit<DefaultsLogEntry, 'success'>): Promise<void> {
    const fullEntry: DefaultsLogEntry = {
      ...entry,
      success: true
    };

    await this.queueLogEntry(fullEntry);
    this.emitAnalyticsEvent('default_applied', fullEntry);
  }

  /**
   * Logs a rejected defaults attempt
   */
  async logDefaultRejection(entry: Omit<DefaultsLogEntry, 'success'> & { reason: string }): Promise<void> {
    const fullEntry: DefaultsLogEntry = {
      ...entry,
      success: false
    };

    await this.queueLogEntry(fullEntry);
    this.emitAnalyticsEvent('default_rejected', fullEntry);
  }

  /**
   * Queues a log entry for batch processing
   */
  private async queueLogEntry(entry: DefaultsLogEntry): Promise<void> {
    this.logQueue.push(entry);

    if (this.logQueue.length >= this.BATCH_SIZE) {
      await this.flushQueue();
    }
  }

  /**
   * Flushes the log queue to Airtable
   */
  private async flushQueue(): Promise<void> {
    if (this.logQueue.length === 0) return;

    try {
      // TODO: Implement actual Airtable API call
      // For now, we'll just emit system logs
      this.logQueue.forEach(entry => {
        emitSystemLog('defaults-log', {
          table: this.TABLE_NAME,
          entry,
          timestamp: new Date().toISOString()
        });
      });

      this.logQueue = [];
    } catch (error) {
      emitSystemLog('defaults-log-error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Emits analytics events for tracking
   */
  private emitAnalyticsEvent(type: string, data: DefaultsLogEntry): void {
    this.eventBus.emit('ANALYTICS_EVENT', {
      type,
      data: {
        ...data,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * Initializes event listeners for automatic logging
   */
  private initializeEventListeners(): void {
    this.eventBus.on('DEFAULTS_APPLIED', async (event: any) => {
      if (event.defaults && event.context) {
        await this.logDefaultApplied({
          defaults: event.defaults,
          context: event.context,
          confidence: event.confidence || 0.5,
          source: event.source || 'default',
          timestamp: new Date().toISOString()
        });
      }
    });

    this.eventBus.on('DEFAULTS_REJECTED', async (event: any) => {
      if (event.defaults && event.context && event.reason) {
        await this.logDefaultRejection({
          defaults: event.defaults,
          context: event.context,
          confidence: event.confidence || 0.5,
          source: event.source || 'default',
          reason: event.reason,
          timestamp: new Date().toISOString()
        });
      }
    });
  }
} 