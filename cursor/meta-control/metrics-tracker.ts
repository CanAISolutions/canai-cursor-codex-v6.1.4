/**
 * meta-control/metrics-tracker.ts
 * 
 * Purpose:
 * Tracks and manages metrics for the meta-control layer, ensuring consistent monitoring
 * and observability across the system.
 */

import { EventBus } from '../event-bus/eventBus';
import { AgentMemory } from '../agent-oversight/agent-memory';
import * as fs from 'fs';
import * as path from 'path';

interface MetricData {
  value: number;
  timestamp: number;
  source: string;
  context: Record<string, any>;
  metadata: Record<string, any>;
}

interface MetricThreshold {
  critical: number;
  warning: number;
  target: number;
}

export class MetaControlMetricsTracker {
  private readonly metricsDir: string;
  private readonly eventBus: EventBus;
  private readonly agentMemory: AgentMemory;
  private readonly thresholds: Record<string, MetricThreshold>;
  private metricsCache: Map<string, MetricData[]>;

  constructor(
    eventBus: EventBus,
    agentMemory: AgentMemory,
    metricsDir: string = 'logs/metrics'
  ) {
    this.eventBus = eventBus;
    this.agentMemory = agentMemory;
    this.metricsDir = metricsDir;
    this.metricsCache = new Map();
    this.thresholds = this.initializeThresholds();
    this.ensureMetricsDir();
    this.setupEventListeners();
  }

  private initializeThresholds(): Record<string, MetricThreshold> {
    return {
      'trust.score': {
        critical: 0.6,
        warning: 0.7,
        target: 0.8
      },
      'resource.utilization': {
        critical: 0.9,
        warning: 0.8,
        target: 0.7
      },
      'alignment.score': {
        critical: 0.6,
        warning: 0.7,
        target: 0.8
      },
      'evolution.progress': {
        critical: 0.3,
        warning: 0.5,
        target: 0.7
      }
    };
  }

  private ensureMetricsDir(): void {
    if (!fs.existsSync(this.metricsDir)) {
      fs.mkdirSync(this.metricsDir, { recursive: true });
    }
  }

  private setupEventListeners(): void {
    this.eventBus.on('agent:selected', this.handleAgentSelected.bind(this));
    this.eventBus.on('agent:deselected', this.handleAgentDeselected.bind(this));
    this.eventBus.on('trust:violation', this.handleTrustViolation.bind(this));
    this.eventBus.on('resource:warning', this.handleResourceWarning.bind(this));
    this.eventBus.on('alignment:deviation', this.handleAlignmentDeviation.bind(this));
  }

  public async trackMetric(
    metricName: string,
    value: number,
    context: Record<string, any>,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const metricData: MetricData = {
      value,
      timestamp: Date.now(),
      source: context.source || 'system',
      context,
      metadata
    };

    // Update cache
    if (!this.metricsCache.has(metricName)) {
      this.metricsCache.set(metricName, []);
    }
    this.metricsCache.get(metricName)?.push(metricData);

    // Check thresholds
    await this.checkThresholds(metricName, value);

    // Store metric
    await this.storeMetric(metricName, metricData);

    // Emit metric event
    this.eventBus.emit('metric:recorded', {
      metric: metricName,
      data: metricData
    });
  }

  private async checkThresholds(metricName: string, value: number): Promise<void> {
    const threshold = this.thresholds[metricName];
    if (!threshold) return;

    if (value <= threshold.critical) {
      this.eventBus.emit('metric:critical', {
        metric: metricName,
        value,
        threshold: threshold.critical
      });
    } else if (value <= threshold.warning) {
      this.eventBus.emit('metric:warning', {
        metric: metricName,
        value,
        threshold: threshold.warning
      });
    }
  }

  private async storeMetric(metricName: string, data: MetricData): Promise<void> {
    const filePath = path.join(this.metricsDir, `${metricName}.json`);
    const metrics = await this.loadMetrics(metricName);
    metrics.push(data);

    // Maintain history size
    if (metrics.length > 1000) {
      metrics.shift();
    }

    await fs.promises.writeFile(filePath, JSON.stringify(metrics, null, 2));
  }

  private async loadMetrics(metricName: string): Promise<MetricData[]> {
    const filePath = path.join(this.metricsDir, `${metricName}.json`);
    try {
      const data = await fs.promises.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  public async getMetricHistory(
    metricName: string,
    window: { start: number; end: number }
  ): Promise<MetricData[]> {
    const metrics = await this.loadMetrics(metricName);
    return metrics.filter(
      m => m.timestamp >= window.start && m.timestamp <= window.end
    );
  }

  public async getMetricAggregates(
    metricName: string,
    window: { start: number; end: number }
  ): Promise<{
    min: number;
    max: number;
    avg: number;
    p95: number;
    p99: number;
  }> {
    const metrics = await this.getMetricHistory(metricName, window);
    const values = metrics.map(m => m.value).sort((a, b) => a - b);

    return {
      min: values[0],
      max: values[values.length - 1],
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      p95: values[Math.floor(values.length * 0.95)],
      p99: values[Math.floor(values.length * 0.99)]
    };
  }

  private async handleAgentSelected(event: any): Promise<void> {
    await this.trackMetric('agent.selection', 1, {
      source: 'agent-selector',
      agentId: event.agentId,
      confidence: event.confidence
    });
  }

  private async handleAgentDeselected(event: any): Promise<void> {
    await this.trackMetric('agent.selection', 0, {
      source: 'agent-selector',
      agentId: event.agentId,
      reason: event.reason
    });
  }

  private async handleTrustViolation(event: any): Promise<void> {
    await this.trackMetric('trust.violation', event.violation.value, {
      source: 'trust-scorer',
      type: event.violation.type,
      threshold: event.violation.threshold
    });
  }

  private async handleResourceWarning(event: any): Promise<void> {
    await this.trackMetric('resource.warning', event.current, {
      source: 'resource-monitor',
      resource: event.resource,
      threshold: event.threshold
    });
  }

  private async handleAlignmentDeviation(event: any): Promise<void> {
    await this.trackMetric('alignment.deviation', 1, {
      source: 'codex-aligner',
      type: event.type,
      severity: event.severity
    });
  }

  public async clearMetrics(metricName?: string): Promise<void> {
    if (metricName) {
      const filePath = path.join(this.metricsDir, `${metricName}.json`);
      await fs.promises.unlink(filePath);
      this.metricsCache.delete(metricName);
    } else {
      const files = await fs.promises.readdir(this.metricsDir);
      await Promise.all(
        files.map(file => fs.promises.unlink(path.join(this.metricsDir, file)))
      );
      this.metricsCache.clear();
    }
  }
} 