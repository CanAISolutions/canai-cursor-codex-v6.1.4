/**
 * @file cursor/services/performance-monitor.ts
 * @description PerformanceMonitor for tracking emotional rendering, fallback handling, and agent workflow performance
 * @version 6.1.4
 * @pillar Latency Trust Envelope
 */

import { EventBus } from '../event-bus/eventBus';
import { v4 as uuidv4 } from 'uuid';

export interface PerformanceMetric {
  metricId: string;
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  traceId: string;
  spanId?: string;
  stepId: string;
  metadata: Record<string, any>;
  threshold?: number;
  breached?: boolean;
}

export interface PerformanceBenchmark {
  operation: string;
  targetLatency: number; // ms
  maxLatency: number; // ms
  throughputTarget?: number; // operations per second
}

export interface PerformanceReport {
  totalOperations: number;
  averageLatency: number;
  maxLatency: number;
  minLatency: number;
  thresholdBreaches: number;
  throughput: number; // operations per second
  p95Latency: number;
  p99Latency: number;
  breachedOperations: PerformanceMetric[];
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private eventBus: EventBus;
  private activeMetrics: Map<string, PerformanceMetric>;
  private completedMetrics: PerformanceMetric[];
  private benchmarks: Map<string, PerformanceBenchmark>;

  private constructor() {
    this.eventBus = EventBus.getInstance();
    this.activeMetrics = new Map();
    this.completedMetrics = [];
    this.benchmarks = new Map();
    this.initializeBenchmarks();
    this.initializeEventListeners();
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeBenchmarks(): void {
    // Set performance benchmarks based on Ideal CX Thread requirements
    this.benchmarks.set('emotional-rendering', {
      operation: 'emotional-rendering',
      targetLatency: 300, // ms - "before frustration does"
      maxLatency: 500,
      throughputTarget: 10 // renders per second
    });

    this.benchmarks.set('fallback-recovery', {
      operation: 'fallback-recovery',
      targetLatency: 600, // ms - total recovery window
      maxLatency: 1000
    });

    this.benchmarks.set('agent-workflow', {
      operation: 'agent-workflow',
      targetLatency: 800, // ms - agent processing
      maxLatency: 1500,
      throughputTarget: 5 // workflows per second
    });

    this.benchmarks.set('trustscore-rendering', {
      operation: 'trustscore-rendering',
      targetLatency: 50, // ms - must not block UI
      maxLatency: 100
    });

    this.benchmarks.set('span-attribution', {
      operation: 'span-attribution',
      targetLatency: 10, // ms - metadata logging
      maxLatency: 25
    });
  }

  private initializeEventListeners(): void {
    this.eventBus.on('performance:start', this.handlePerformanceStart.bind(this));
    this.eventBus.on('performance:end', this.handlePerformanceEnd.bind(this));
    this.eventBus.on('performance:threshold-breach', this.handleThresholdBreach.bind(this));
  }

  /**
   * Starts performance tracking for an operation
   */
  public startTracking(
    operation: string,
    traceId: string,
    stepId: string,
    spanId?: string,
    metadata: Record<string, any> = {}
  ): string {
    const metricId = uuidv4();
    const startTime = performance.now();
    const benchmark = this.benchmarks.get(operation);

    const metric: PerformanceMetric = {
      metricId,
      operation,
      startTime,
      traceId,
      spanId,
      stepId,
      metadata,
      threshold: benchmark?.targetLatency
    };

    this.activeMetrics.set(metricId, metric);

    // Emit start event
    this.eventBus.emit('performance:start', {
      metricId,
      operation,
      traceId,
      spanId,
      stepId,
      startTime,
      threshold: benchmark?.targetLatency
    });

    return metricId;
  }

  /**
   * Ends performance tracking for an operation
   */
  public endTracking(metricId: string, additionalMetadata: Record<string, any> = {}): PerformanceMetric | null {
    const metric = this.activeMetrics.get(metricId);
    if (!metric) {
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - metric.startTime;
    const benchmark = this.benchmarks.get(metric.operation);

    // Update metric
    metric.endTime = endTime;
    metric.duration = duration;
    metric.metadata = { ...metric.metadata, ...additionalMetadata };

    // Check for threshold breach
    if (metric.threshold && duration > metric.threshold) {
      metric.breached = true;
      this.eventBus.emit('performance:threshold-breach', {
        metricId,
        operation: metric.operation,
        duration,
        threshold: metric.threshold,
        traceId: metric.traceId,
        spanId: metric.spanId,
        stepId: metric.stepId
      });
    }

    // Move to completed metrics
    this.activeMetrics.delete(metricId);
    this.completedMetrics.push(metric);

    // Emit end event
    this.eventBus.emit('performance:end', {
      metricId,
      operation: metric.operation,
      duration,
      breached: metric.breached,
      traceId: metric.traceId,
      spanId: metric.spanId,
      stepId: metric.stepId
    });

    return metric;
  }

  /**
   * Times a function execution
   */
  public async timeOperation<T>(
    operation: string,
    traceId: string,
    stepId: string,
    fn: () => Promise<T> | T,
    spanId?: string,
    metadata: Record<string, any> = {}
  ): Promise<{ result: T; metric: PerformanceMetric }> {
    const metricId = this.startTracking(operation, traceId, stepId, spanId, metadata);
    
    try {
      const result = await fn();
      const metric = this.endTracking(metricId, { success: true });
      return { result, metric: metric! };
    } catch (error) {
      const metric = this.endTracking(metricId, { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      throw error;
    }
  }

  /**
   * Measures throughput for batch operations
   */
  public async measureThroughput<T>(
    operation: string,
    traceId: string,
    operations: (() => Promise<T> | T)[],
    metadata: Record<string, any> = {}
  ): Promise<{ results: T[]; throughput: number; averageLatency: number }> {
    const startTime = performance.now();
    const results: T[] = [];
    const latencies: number[] = [];

    for (let i = 0; i < operations.length; i++) {
      const stepId = `${operation}-batch-${i}`;
      const { result, metric } = await this.timeOperation(
        operation,
        traceId,
        stepId,
        operations[i],
        undefined,
        { ...metadata, batchIndex: i, batchSize: operations.length }
      );
      results.push(result);
      latencies.push(metric.duration!);
    }

    const totalTime = performance.now() - startTime;
    const throughput = (operations.length / totalTime) * 1000; // operations per second
    const averageLatency = latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;

    return { results, throughput, averageLatency };
  }

  /**
   * Generates performance report for an operation
   */
  public generateReport(operation?: string): PerformanceReport {
    const metrics = operation 
      ? this.completedMetrics.filter(m => m.operation === operation)
      : this.completedMetrics;

    if (metrics.length === 0) {
      return {
        totalOperations: 0,
        averageLatency: 0,
        maxLatency: 0,
        minLatency: 0,
        thresholdBreaches: 0,
        throughput: 0,
        p95Latency: 0,
        p99Latency: 0,
        breachedOperations: []
      };
    }

    const durations = metrics.map(m => m.duration!).sort((a, b) => a - b);
    const breachedOperations = metrics.filter(m => m.breached);

    // Calculate percentiles
    const p95Index = Math.floor(durations.length * 0.95);
    const p99Index = Math.floor(durations.length * 0.99);

    return {
      totalOperations: metrics.length,
      averageLatency: durations.reduce((sum, d) => sum + d, 0) / durations.length,
      maxLatency: Math.max(...durations),
      minLatency: Math.min(...durations),
      thresholdBreaches: breachedOperations.length,
      throughput: this.calculateThroughput(metrics),
      p95Latency: durations[p95Index] || 0,
      p99Latency: durations[p99Index] || 0,
      breachedOperations
    };
  }

  /**
   * Checks if performance is within acceptable thresholds
   */
  public validatePerformance(operation: string): {
    isValid: boolean;
    violations: string[];
    report: PerformanceReport;
  } {
    const report = this.generateReport(operation);
    const benchmark = this.benchmarks.get(operation);
    const violations: string[] = [];

    if (!benchmark) {
      return {
        isValid: false,
        violations: [`No benchmark defined for operation: ${operation}`],
        report
      };
    }

    // Check average latency
    if (report.averageLatency > benchmark.targetLatency) {
      violations.push(
        `Average latency ${report.averageLatency.toFixed(2)}ms exceeds target ${benchmark.targetLatency}ms`
      );
    }

    // Check max latency
    if (report.maxLatency > benchmark.maxLatency) {
      violations.push(
        `Max latency ${report.maxLatency.toFixed(2)}ms exceeds limit ${benchmark.maxLatency}ms`
      );
    }

    // Check throughput if defined
    if (benchmark.throughputTarget && report.throughput < benchmark.throughputTarget) {
      violations.push(
        `Throughput ${report.throughput.toFixed(2)} ops/sec below target ${benchmark.throughputTarget} ops/sec`
      );
    }

    // Check threshold breaches
    const breachRate = (report.thresholdBreaches / report.totalOperations) * 100;
    if (breachRate > 10) { // More than 10% breach rate is concerning
      violations.push(
        `High threshold breach rate: ${breachRate.toFixed(1)}% (${report.thresholdBreaches}/${report.totalOperations})`
      );
    }

    return {
      isValid: violations.length === 0,
      violations,
      report
    };
  }

  /**
   * Clears all metrics (useful for testing)
   */
  public clearMetrics(): void {
    this.activeMetrics.clear();
    this.completedMetrics.length = 0;
  }

  /**
   * Gets current benchmark for an operation
   */
  public getBenchmark(operation: string): PerformanceBenchmark | undefined {
    return this.benchmarks.get(operation);
  }

  /**
   * Updates benchmark for an operation
   */
  public setBenchmark(operation: string, benchmark: PerformanceBenchmark): void {
    this.benchmarks.set(operation, benchmark);
  }

  private calculateThroughput(metrics: PerformanceMetric[]): number {
    if (metrics.length === 0) return 0;
    
    const timeSpan = Math.max(...metrics.map(m => m.endTime!)) - Math.min(...metrics.map(m => m.startTime));
    return (metrics.length / timeSpan) * 1000; // operations per second
  }

  private async handlePerformanceStart(event: any): Promise<void> {
    // Log performance start event
  }

  private async handlePerformanceEnd(event: any): Promise<void> {
    // Log performance end event
  }

  private async handleThresholdBreach(event: any): Promise<void> {
    // Log threshold breach for alerting
    console.warn(`Performance threshold breached: ${event.operation} took ${event.duration}ms (threshold: ${event.threshold}ms)`);
  }
} 