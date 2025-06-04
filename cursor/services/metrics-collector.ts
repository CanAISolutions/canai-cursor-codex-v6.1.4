/**
 * MetricsCollector Class
 * 
 * General-purpose metrics collection system for the CanAI platform.
 * Collects and analyzes system performance, user interaction, and operational metrics.
 * Ensures emotional sovereignty compliance in all metric tracking.
 */
import { EventBus } from '../event-bus/eventBus';
import { Logger } from '../../utils/logger';

export class MetricsCollector {
  private metrics: Map<string, MetricEntry[]>;
  private eventBus?: EventBus;
  private logger: Logger;
  private sessionId: string;
  private performanceMetrics: Map<string, PerformanceMetric>;
  private aggregatedMetrics: Map<string, AggregatedMetric>;
  
  /**
   * Creates a new metrics collector
   * 
   * @param logger - Optional logger instance
   * @param eventBus - Optional event bus for metric events
   * @param sessionId - Session identifier
   */
  constructor(
    logger?: Logger,
    eventBus?: EventBus,
    sessionId: string = this.generateSessionId()
  ) {
    this.metrics = new Map<string, MetricEntry[]>();
    this.performanceMetrics = new Map<string, PerformanceMetric>();
    this.aggregatedMetrics = new Map<string, AggregatedMetric>();
    this.eventBus = eventBus;
    this.logger = logger || new Logger('MetricsCollector');
    this.sessionId = sessionId;
    
    // Initialize default performance metrics
    this.initializeDefaultMetrics();
  }
  
  /**
   * Tracks a metric for later analysis
   * 
   * @param metricName - Name of the metric to track
   * @param data - Data associated with the metric
   * @param category - Optional category for the metric
   */
  trackMetric(metricName: string, data: Record<string, any>, category?: string): void {
    try {
      const timestamp = new Date();
      
      const metricEntry: MetricEntry = {
        timestamp,
        sessionId: this.sessionId,
        metricName,
        category: category || 'general',
        data,
        emotionalImpact: this.assessEmotionalImpact(data)
      };
      
      // Store the metric
      if (!this.metrics.has(metricName)) {
        this.metrics.set(metricName, []);
      }
      
      this.metrics.get(metricName)?.push(metricEntry);
      
      // Update aggregated metrics
      this.updateAggregatedMetrics(metricName, data);
      
      // Emit metric event if event bus is available
      if (this.eventBus) {
        this.eventBus.emit('metric_tracked', metricEntry);
      }
      
      this.logger.debug(`Tracked metric: ${metricName}`, { 
        category: metricEntry.category,
        emotionalImpact: metricEntry.emotionalImpact
      });
    } catch (error) {
      this.handleError('trackMetric', error, { metricName, data });
    }
  }
  
  /**
   * Alias for trackMetric to maintain backward compatibility
   * 
   * @param metricName - Name of the metric to record
   * @param data - Data or score value for the metric
   * @param category - Optional category for the metric
   */
  recordMetric(metricName: string, dataOrScore: any, category?: string): void {
    // Convert simple score value to a data object if needed
    const data = typeof dataOrScore === 'object' ? 
      dataOrScore : 
      { score: dataOrScore };
    
    // Call the main metric tracking method
    this.trackMetric(metricName, data, category);
  }
  
  /**
   * Records a performance metric
   * 
   * @param metricName - Name of the performance metric
   * @param value - Performance value
   * @param unit - Unit of measurement (ms, bytes, etc.)
   * @param metadata - Additional metadata
   */
  recordPerformance(metricName: string, value: number, unit = 'ms', metadata?: Record<string, any>): void {
    try {
      const performanceMetric: PerformanceMetric = {
        name: metricName,
        value,
        unit,
        timestamp: new Date(),
        metadata: metadata || {}
      };
      
      this.performanceMetrics.set(metricName, performanceMetric);
      
      // Also track as a general metric
      this.trackMetric(`performance_${metricName}`, {
        value,
        unit,
        ...metadata
      }, 'performance');
      
      this.logger.debug(`Recorded performance metric: ${metricName}`, { value, unit });
    } catch (error) {
      this.handleError('recordPerformance', error, { metricName, value, unit });
    }
  }
  
  /**
   * Increments a counter metric
   * 
   * @param metricName - Name of the counter metric
   * @param increment - Amount to increment (default: 1)
   * @param tags - Optional tags for the metric
   */
  incrementCounter(metricName: string, increment = 1, tags?: Record<string, string>): void {
    const currentMetrics = this.metrics.get(metricName) || [];
    const currentValue = currentMetrics.length > 0 ? 
      (currentMetrics[currentMetrics.length - 1].data.count || 0) : 0;
    
    this.trackMetric(metricName, {
      count: currentValue + increment,
      increment,
      tags: tags || {}
    }, 'counter');
  }
  
  /**
   * Records a timing metric
   * 
   * @param metricName - Name of the timing metric
   * @param startTime - Start time (Date or timestamp)
   * @param endTime - End time (optional, defaults to now)
   */
  recordTiming(metricName: string, startTime: Date | number, endTime?: Date | number): void {
    const start = typeof startTime === 'number' ? startTime : startTime.getTime();
    const end = endTime ? (typeof endTime === 'number' ? endTime : endTime.getTime()) : Date.now();
    const duration = end - start;
    
    this.recordPerformance(`timing_${metricName}`, duration, 'ms', {
      startTime: new Date(start),
      endTime: new Date(end)
    });
  }
  
  /**
   * Gets metrics by name
   * 
   * @param metricName - Name of the metric to retrieve
   * @returns Array of metric entries or undefined if not found
   */
  getMetrics(metricName: string): MetricEntry[] | undefined {
    return this.metrics.get(metricName);
  }
  
  /**
   * Gets all metrics
   * 
   * @returns Map of all metrics
   */
  getAllMetrics(): Map<string, MetricEntry[]> {
    return this.metrics;
  }
  
  /**
   * Gets performance metrics
   * 
   * @param metricName - Optional specific metric name
   * @returns Performance metrics
   */
  getPerformanceMetrics(metricName?: string): Map<string, PerformanceMetric> | PerformanceMetric | undefined {
    if (metricName) {
      return this.performanceMetrics.get(metricName);
    }
    return this.performanceMetrics;
  }
  
  /**
   * Gets aggregated metrics
   * 
   * @param metricName - Optional name of the metric to retrieve
   * @returns Aggregated metrics
   */
  getAggregatedMetrics(metricName?: string): Map<string, AggregatedMetric> | AggregatedMetric | undefined {
    if (metricName) {
      return this.aggregatedMetrics.get(metricName);
    }
    return this.aggregatedMetrics;
  }
  
  /**
   * Exports all metrics for analysis
   * 
   * @returns Exported metrics data
   */
  exportMetrics(): ExportedMetrics {
    return {
      sessionId: this.sessionId,
      timestamp: new Date(),
      metrics: Object.fromEntries(this.metrics),
      performanceMetrics: Object.fromEntries(this.performanceMetrics),
      aggregatedMetrics: Object.fromEntries(this.aggregatedMetrics)
    };
  }
  
  /**
   * Clears all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
    this.performanceMetrics.clear();
    this.aggregatedMetrics.clear();
    
    if (this.eventBus) {
      this.eventBus.emit('metrics_cleared', { sessionId: this.sessionId });
    }
    
    this.logger.info('All metrics cleared');
  }
  
  /**
   * Assesses the emotional impact of metric data
   * 
   * @param data - Metric data to assess
   * @returns Emotional impact assessment
   */
  private assessEmotionalImpact(data: Record<string, any>): 'positive' | 'neutral' | 'negative' {
    // Look for indicators of user empowerment vs frustration
    if (data.error || data.failure || data.timeout) {
      return 'negative';
    }
    
    if (data.success || data.achievement || data.improvement) {
      return 'positive';
    }
    
    return 'neutral';
  }
  
  /**
   * Updates aggregated metrics
   */
  private updateAggregatedMetrics(metricName: string, data: Record<string, any>): void {
    if (!this.aggregatedMetrics.has(metricName)) {
      this.aggregatedMetrics.set(metricName, {
        count: 0,
        min: {},
        max: {},
        sum: {},
        average: {}
      });
    }
    
    const aggregated = this.aggregatedMetrics.get(metricName)!;
    aggregated.count++;
    
    // Update numerical aggregations
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'number') {
        aggregated.min[key] = Math.min(aggregated.min[key] || value, value);
        aggregated.max[key] = Math.max(aggregated.max[key] || value, value);
        aggregated.sum[key] = (aggregated.sum[key] || 0) + value;
        aggregated.average[key] = aggregated.sum[key] / aggregated.count;
      }
    }
  }
  
  /**
   * Initializes default performance metrics
   */
  private initializeDefaultMetrics(): void {
    const defaultMetrics = [
      'response_time',
      'processing_time',
      'memory_usage',
      'user_satisfaction',
      'emotional_resonance'
    ];
    
    defaultMetrics.forEach(metric => {
      this.performanceMetrics.set(metric, {
        name: metric,
        value: 0,
        unit: 'ms',
        timestamp: new Date(),
        metadata: { initialized: true }
      });
    });
  }
  
  /**
   * Generates a unique session ID
   */
  private generateSessionId(): string {
    return `metrics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Handles errors gracefully
   */
  private handleError(methodName: string, error: unknown, context: Record<string, any> = {}): void {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    this.logger.error(`MetricsCollector.${methodName} failed: ${errorMessage}`, {
      error,
      context,
      sessionId: this.sessionId
    });
    
    // Emit error event if event bus is available
    if (this.eventBus) {
      this.eventBus.emit('metrics_error', {
        methodName,
        error: errorMessage,
        context,
        sessionId: this.sessionId
      });
    }
  }
}

export interface MetricEntry {
  timestamp: Date;
  sessionId: string;
  metricName: string;
  category: string;
  data: Record<string, any>;
  emotionalImpact: 'positive' | 'neutral' | 'negative';
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface AggregatedMetric {
  count: number;
  min: Record<string, number>;
  max: Record<string, number>;
  sum: Record<string, number>;
  average: Record<string, number>;
}

export interface ExportedMetrics {
  sessionId: string;
  timestamp: Date;
  metrics: Record<string, MetricEntry[]>;
  performanceMetrics: Record<string, PerformanceMetric>;
  aggregatedMetrics: Record<string, AggregatedMetric>;
} 