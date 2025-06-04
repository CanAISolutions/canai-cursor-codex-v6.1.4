/**
 * TrustMetricsCollector Class
 * 
 * Collects and analyzes trust-related metrics throughout the system.
 * Used for measuring trust levels, emotional resonance, and user experience quality.
 */
import { EventBus } from '../event-bus';
import { Logger } from '../../logger';

export class TrustMetricsCollector {
  private metrics: Map<string, MetricEntry[]>;
  private eventBus?: EventBus;
  private logger: Logger;
  private sessionId: string;
  private trustScores: Map<string, number>;
  private aggregatedMetrics: Map<string, AggregatedMetric>;
  
  /**
   * Creates a new trust metrics collector
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
    this.trustScores = new Map<string, number>();
    this.aggregatedMetrics = new Map<string, AggregatedMetric>();
    this.eventBus = eventBus;
    this.logger = logger || new Logger('TrustMetricsCollector');
    this.sessionId = sessionId;
    
    // Initialize default trust scores
    this.trustScores.set('overall', 5.0);
    this.trustScores.set('accuracy', 5.0);
    this.trustScores.set('emotional', 5.0);
    this.trustScores.set('cultural', 5.0);
    this.trustScores.set('transparency', 5.0);
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
        data
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
        this.eventBus.emit('metric', metricEntry);
      }
      
      this.logger.debug(`Tracked metric: ${metricName}`, { category: metricEntry.category });
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
   * Updates the trust score for a specific category
   * 
   * @param category - Trust score category
   * @param value - New trust score value
   * @param reason - Reason for the update
   */
  updateTrustScore(category: string, value: number, reason: string): void {
    try {
      // Ensure value is within bounds
      const boundedValue = Math.max(0, Math.min(10, value));
      
      // Store previous value for change tracking
      const previousValue = this.trustScores.get(category) || 5.0;
      
      // Update the trust score
      this.trustScores.set(category, boundedValue);
      
      // Track the update as a metric
      this.trackMetric('trustScoreUpdate', {
        category,
        previousValue,
        newValue: boundedValue,
        change: boundedValue - previousValue,
        reason
      }, 'trustScore');
      
      // Emit trust score update event if event bus is available
      if (this.eventBus) {
        this.eventBus.emit('trustScore', {
          category,
          value: boundedValue,
          previousValue,
          change: boundedValue - previousValue,
          reason,
          timestamp: new Date()
        });
      }
      
      this.logger.info(`Updated trust score: ${category}`, {
        previousValue,
        newValue: boundedValue,
        change: boundedValue - previousValue,
        reason
      });
    } catch (error) {
      this.handleError('updateTrustScore', error, { category, value, reason });
    }
  }
  
  /**
   * Gets the trust score for a specific category
   * 
   * @param category - Trust score category
   * @returns Trust score value
   */
  getTrustScore(category: string): number {
    return this.trustScores.get(category) || 5.0;
  }
  
  /**
   * Gets all trust scores
   * 
   * @returns Map of all trust scores
   */
  getAllTrustScores(): Map<string, number> {
    return this.trustScores;
  }
  
  /**
   * Calculates and returns the overall trust score
   * 
   * @returns Overall trust score
   */
  calculateOverallTrustScore(): number {
    try {
      let sum = 0;
      let count = 0;
      
      // Calculate weighted average of all trust scores except overall
      this.trustScores.forEach((value, category) => {
        if (category !== 'overall') {
          sum += value;
          count++;
        }
      });
      
      const overallScore = count > 0 ? sum / count : 5.0;
      
      // Update the overall trust score
      this.trustScores.set('overall', overallScore);
      
      return overallScore;
    } catch (error) {
      this.handleError('calculateOverallTrustScore', error);
      return 5.0; // Default fallback
    }
  }
  
  /**
   * Exports all metrics to a structured format
   * 
   * @returns Exported metrics
   */
  exportMetrics(): ExportedMetrics {
    const exportedMetrics: ExportedMetrics = {
      sessionId: this.sessionId,
      timestamp: new Date(),
      trustScores: Object.fromEntries(this.trustScores),
      metrics: {}
    };
    
    // Convert metrics to a plain object
    this.metrics.forEach((entries, name) => {
      exportedMetrics.metrics[name] = entries;
    });
    
    return exportedMetrics;
  }
  
  /**
   * Updates aggregated metrics
   * 
   * @param metricName - Name of the metric
   * @param data - Data associated with the metric
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
    
    const metric = this.aggregatedMetrics.get(metricName);
    if (!metric) return;
    
    // Update count
    metric.count++;
    
    // Update min, max, sum, and average for numeric values
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'number') {
        // Initialize if not exists
        if (metric.min[key] === undefined) {
          metric.min[key] = value;
          metric.max[key] = value;
          metric.sum[key] = 0;
          metric.average[key] = 0;
        }
        
        // Update min/max
        metric.min[key] = Math.min(metric.min[key], value);
        metric.max[key] = Math.max(metric.max[key], value);
        
        // Update sum
        metric.sum[key] = (metric.sum[key] || 0) + value;
        
        // Update average
        metric.average[key] = metric.sum[key] / metric.count;
      }
    });
  }
  
  /**
   * Generates a new session ID
   * 
   * @returns Generated session ID
   */
  private generateSessionId(): string {
    return 'trust-' + Date.now() + '-' + Math.random().toString(36).substring(2, 15);
  }
  
  /**
   * Error handling with context
   */
  private handleError(methodName: string, error: unknown, context: Record<string, any> = {}): void {
    this.logger.error(`Error in TrustMetricsCollector.${methodName}`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...context
    });
    
    // Emit error event if event bus is available
    if (this.eventBus) {
      this.eventBus.emit('trustMetricsCollector.error', {
        method: methodName,
        error: error instanceof Error ? error.message : String(error),
        context
      });
    }
  }
}

/**
 * Interface for a metric entry
 */
export interface MetricEntry {
  timestamp: Date;
  sessionId: string;
  metricName: string;
  category: string;
  data: Record<string, any>;
}

/**
 * Interface for aggregated metrics
 */
export interface AggregatedMetric {
  count: number;
  min: Record<string, number>;
  max: Record<string, number>;
  sum: Record<string, number>;
  average: Record<string, number>;
}

/**
 * Interface for exported metrics
 */
export interface ExportedMetrics {
  sessionId: string;
  timestamp: Date;
  trustScores: Record<string, number>;
  metrics: Record<string, MetricEntry[]>;
} 