// Phantom Prompt Summarizer: Summarizes phantom prompt results and generates drift trend visualizations
// What/Why/How: Provides a comprehensive summary of phantom prompt performance, logs detailed actions for traceability

import * as fs from 'fs';
import * as path from 'path';
import { EventBus } from '../../cursor/event-bus/eventBus';
import { Logger } from '../../cursor/utils/logger';
import { TrustMetricsCollector } from '../../cursor/metrics/trust-metrics-collector';
import { VisualizationEngine } from '../utils/visualization-engine';
import { DriftTrendAnalyzer } from '../delta-logging/drift-trend-analyzer';

/**
 * PhantomPromptSummarizer - Summarizes phantom prompt results and generates drift trend visualizations
 * - Aggregates phantom prompt results
 * - Generates drift trend visualizations
 * - Logs detailed actions through structured Logger
 * - Emits events for tracking and analytics
 */
export class PhantomPromptSummarizer {
  private readonly resultsDir: string;
  private readonly logPath: string;
  private readonly logger: Logger;
  private readonly eventBus: EventBus;
  private readonly vizEngine: VisualizationEngine;
  private readonly driftAnalyzer: DriftTrendAnalyzer;
  private readonly metricsCollector: TrustMetricsCollector;

  constructor(
    resultsDir: string = path.resolve('phantom-prompts/results'),
    logPath: string = path.resolve('cursor/auto-actions.log.md'),
    eventBus: EventBus = new EventBus(),
    logger: Logger = new Logger('PhantomPromptSummarizer'),
    vizEngine: VisualizationEngine = new VisualizationEngine(),
    driftAnalyzer: DriftTrendAnalyzer = new DriftTrendAnalyzer(),
    metricsCollector: TrustMetricsCollector = new TrustMetricsCollector()
  ) {
    this.resultsDir = resultsDir;
    this.logPath = logPath;
    this.eventBus = eventBus;
    this.logger = logger;
    this.vizEngine = vizEngine;
    this.driftAnalyzer = driftAnalyzer;
    this.metricsCollector = metricsCollector;
  }

  /**
   * Main entry: summarizes phantom prompt results and generates visualizations
   */
  public async run(): Promise<{ summary: any, visualizations: any[] }> {
    try {
      this.logger.info('Starting Phantom Prompt Summarizer run');
      this.eventBus.emit('phantom:summarizer:started', {
        timestamp: new Date().toISOString(),
        resultsDir: this.resultsDir
      }, 'PhantomPromptSummarizer');

      const results = this.loadResults();
      const summary = this.summarizeResults(results);
      const visualizations = await this.generateVisualizations(summary);

      // Track metrics for the summary
      this.trackMetrics(summary);

      this.logger.info('Phantom Prompt Summarizer run complete', { 
        totalPrompts: summary.total_prompts,
        averageTrust: summary.average_trust,
        averageDrift: summary.average_drift
      });
      
      this.eventBus.emit('phantom:summarizer:completed', {
        timestamp: new Date().toISOString(),
        summary: summary,
        visualizationCount: visualizations.length
      }, 'PhantomPromptSummarizer');

      return { summary, visualizations };
    } catch (error) {
      const errorContext = {
        phase: 'run',
        error: error.message,
        stack: error.stack,
        resultsDir: this.resultsDir
      };
      
      this.logger.error('Phantom Prompt Summarizer failed', errorContext);
      this.eventBus.emit('phantom:summarizer:error', errorContext, 'PhantomPromptSummarizer');
      
      throw error;
    }
  }

  /**
   * Loads all phantom prompt result JSON files from resultsDir
   */
  private loadResults(): any[] {
    try {
      if (!fs.existsSync(this.resultsDir)) {
        this.logger.warn(`Results directory does not exist: ${this.resultsDir}`, {
          action: 'creating directory'
        });
        fs.mkdirSync(this.resultsDir, { recursive: true });
        return [];
      }

      const files = fs.readdirSync(this.resultsDir).filter(f => f.endsWith('.json'));
      const results: any[] = [];
      
      this.logger.info(`Loading ${files.length} result files`, {
        directory: this.resultsDir
      });

      for (const file of files) {
        try {
          const filePath = path.join(this.resultsDir, file);
          const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          results.push(data);
        } catch (error) {
          this.logger.warn(`Failed to parse result file: ${file}`, {
            error: error.message,
            path: path.join(this.resultsDir, file)
          });
          
          this.eventBus.emit('phantom:summarizer:file_error', {
            file,
            error: error.message,
            timestamp: new Date().toISOString()
          }, 'PhantomPromptSummarizer');
        }
      }
      
      return results;
    } catch (error) {
      const errorContext = {
        phase: 'loadResults',
        error: error.message,
        stack: error.stack,
        resultsDir: this.resultsDir
      };
      
      this.logger.error('Failed to load phantom prompt results', errorContext);
      this.eventBus.emit('phantom:summarizer:load_error', errorContext, 'PhantomPromptSummarizer');
      
      return [];
    }
  }

  /**
   * Summarizes phantom prompt results
   */
  private summarizeResults(results: any[]): any {
    try {
      this.logger.info(`Summarizing ${results.length} phantom prompt results`);
      
      if (results.length === 0) {
        this.logger.warn('No results to summarize', {
          action: 'returning empty summary'
        });
        
        return {
          total_prompts: 0,
          average_trust: 0,
          average_clarity: 0,
          average_empathy: 0,
          average_drift: 0,
          average_memory: 0,
          timestamp: new Date().toISOString(),
          is_empty: true
        };
      }

      // Extract metrics categories from first result to support dynamic metrics
      const metricCategories = Object.keys(results[0]).filter(key => 
        typeof results[0][key] === 'number' && 
        !['id', 'timestamp', 'scenario_id'].includes(key)
      );
      
      // Calculate averages for all numeric metrics
      const summary: any = {
        total_prompts: results.length,
        timestamp: new Date().toISOString(),
        is_empty: false,
        metrics_by_category: {},
        drift_trends: {},
        threshold_violations: 0
      };
      
      // Calculate averages for all found metrics
      metricCategories.forEach(metric => {
        summary[`average_${metric}`] = this.calculateAverage(results, metric);
        
        // Calculate additional statistics for core metrics
        if (['trust', 'clarity', 'empathy', 'drift', 'memory'].includes(metric)) {
          summary.metrics_by_category[metric] = {
            average: summary[`average_${metric}`],
            min: Math.min(...results.map(r => r[metric] || 0)),
            max: Math.max(...results.map(r => r[metric] || 0)),
            median: this.calculateMedian(results.map(r => r[metric] || 0)),
            stdDev: this.calculateStdDev(results.map(r => r[metric] || 0)),
            thresholdViolations: results.filter(r => {
              // Different thresholds for different metrics
              const thresholds = {
                trust: 3.0,
                clarity: 2.5,
                empathy: 3.0,
                drift: 0.3, // Lower is better for drift
                memory: 2.5
              };
              
              if (metric === 'drift') {
                return r[metric] > thresholds[metric];
              }
              return r[metric] < thresholds[metric];
            }).length
          };
          
          // Count total violations
          summary.threshold_violations += summary.metrics_by_category[metric].thresholdViolations;
        }
      });
      
      // Add drift trend analysis
      summary.drift_trends = this.driftAnalyzer.analyzeTrends(results);
      
      this.logger.info('Phantom prompt summarization complete', {
        totalPrompts: summary.total_prompts,
        averageTrust: summary.average_trust,
        thresholdViolations: summary.threshold_violations
      });
      
      this.eventBus.emit('phantom:summarizer:summary_generated', {
        timestamp: new Date().toISOString(),
        summary: {
          total_prompts: summary.total_prompts,
          average_trust: summary.average_trust,
          average_drift: summary.average_drift,
          threshold_violations: summary.threshold_violations
        }
      }, 'PhantomPromptSummarizer');
      
      return summary;
    } catch (error) {
      const errorContext = {
        phase: 'summarizeResults',
        error: error.message,
        stack: error.stack,
        resultCount: results.length
      };
      
      this.logger.error('Failed to summarize phantom prompt results', errorContext);
      this.eventBus.emit('phantom:summarizer:summary_error', errorContext, 'PhantomPromptSummarizer');
      
      // Return a minimal summary with error information
      return {
        total_prompts: results.length,
        error: error.message,
        timestamp: new Date().toISOString(),
        is_error: true
      };
    }
  }

  /**
   * Calculates the average of a specific metric across all results
   */
  private calculateAverage(results: any[], metric: string): number {
    const validValues = results
      .map(result => result[metric])
      .filter(value => value !== undefined && value !== null && !isNaN(value));
      
    const sum = validValues.reduce((acc, val) => acc + val, 0);
    return validValues.length ? sum / validValues.length : 0;
  }
  
  /**
   * Calculates the median of an array of numbers
   */
  private calculateMedian(values: number[]): number {
    if (!values.length) return 0;
    
    const sortedValues = [...values].sort((a, b) => a - b);
    const midIndex = Math.floor(sortedValues.length / 2);
    
    if (sortedValues.length % 2 === 0) {
      return (sortedValues[midIndex - 1] + sortedValues[midIndex]) / 2;
    }
    
    return sortedValues[midIndex];
  }
  
  /**
   * Calculates the standard deviation of an array of numbers
   */
  private calculateStdDev(values: number[]): number {
    if (!values.length) return 0;
    
    const avg = values.reduce((acc, val) => acc + val, 0) / values.length;
    const squareDiffs = values.map(value => {
      const diff = value - avg;
      return diff * diff;
    });
    
    const avgSquareDiff = squareDiffs.reduce((acc, val) => acc + val, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
  }

  /**
   * Generates drift trend visualizations
   * @returns Array of visualization objects with data and metadata
   */
  private async generateVisualizations(summary: any): Promise<any[]> {
    try {
      this.logger.info('Generating visualizations for phantom prompt summary');

      if (summary.is_empty || summary.is_error) {
        this.logger.warn('Cannot generate visualizations for empty or error summary', {
          isError: summary.is_error || false,
          isEmpty: summary.is_empty || false
        });
        return [];
      }

      const visualizations = [];
      
      // Trust Score Distribution
      const trustDistribution = await this.vizEngine.createDistributionChart({
        title: 'Phantom Prompt Trust Score Distribution',
        metricName: 'Trust Scores',
        data: summary.metrics_by_category.trust,
        thresholdValue: 3.0,
        color: '#00CFFF',
        outputPath: path.join(this.resultsDir, '../visualizations/trust-distribution.png')
      });
      visualizations.push(trustDistribution);
      
      // Drift Trends Over Time
      const driftTrends = await this.vizEngine.createTimeSeriesChart({
        title: 'Phantom Prompt Drift Trends',
        metricName: 'Drift',
        data: summary.drift_trends.timeSeries || [],
        thresholdValue: 0.3,
        color: '#E6303D',
        outputPath: path.join(this.resultsDir, '../visualizations/drift-trends.png')
      });
      visualizations.push(driftTrends);
      
      // Metrics Comparison Radar Chart
      const metricsRadar = await this.vizEngine.createRadarChart({
        title: 'Phantom Prompt Metrics Comparison',
        metrics: Object.keys(summary.metrics_by_category).map(key => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value: summary.metrics_by_category[key].average,
          threshold: key === 'drift' ? 0.3 : 3.0
        })),
        color: '#00F0FF',
        outputPath: path.join(this.resultsDir, '../visualizations/metrics-radar.png')
      });
      visualizations.push(metricsRadar);
      
      // Threshold Violations by Metric
      const thresholdChart = await this.vizEngine.createBarChart({
        title: 'Threshold Violations by Metric',
        data: Object.entries(summary.metrics_by_category).map(([key, value]) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value: value.thresholdViolations,
          total: summary.total_prompts
        })),
        color: '#0A0F1C',
        outputPath: path.join(this.resultsDir, '../visualizations/threshold-violations.png')
      });
      visualizations.push(thresholdChart);
      
      // Emotional Metrics Correlation Heatmap
      if (summary.metrics_by_category.empathy && summary.metrics_by_category.clarity) {
        const correlationHeatmap = await this.vizEngine.createHeatmapChart({
          title: 'Emotional Metrics Correlation',
          metrics: ['trust', 'empathy', 'clarity', 'memory'].filter(m => summary.metrics_by_category[m]),
          data: summary.metrics_by_category,
          outputPath: path.join(this.resultsDir, '../visualizations/correlation-heatmap.png')
        });
        visualizations.push(correlationHeatmap);
      }
      
      this.logger.info(`Generated ${visualizations.length} visualizations`, {
        visualizationTypes: visualizations.map(v => v.type)
      });
      
      this.eventBus.emit('phantom:summarizer:visualizations_generated', {
        timestamp: new Date().toISOString(),
        count: visualizations.length,
        types: visualizations.map(v => v.type)
      }, 'PhantomPromptSummarizer');
      
      return visualizations;
    } catch (error) {
      const errorContext = {
        phase: 'generateVisualizations',
        error: error.message,
        stack: error.stack
      };
      
      this.logger.error('Failed to generate visualizations for phantom prompt summary', errorContext);
      this.eventBus.emit('phantom:summarizer:visualization_error', errorContext, 'PhantomPromptSummarizer');
      
      // Return empty array instead of throwing to allow summarization to continue
      return [];
    }
  }

  /**
   * Track metrics for analytics
   */
  private trackMetrics(summary: any): void {
    try {
      if (summary.is_empty || summary.is_error) return;
      
      this.metricsCollector.trackMetric('phantom_prompt_trust', summary.average_trust);
      this.metricsCollector.trackMetric('phantom_prompt_drift', summary.average_drift);
      this.metricsCollector.trackMetric('phantom_prompt_empathy', summary.average_empathy || 0);
      this.metricsCollector.trackMetric('phantom_prompt_clarity', summary.average_clarity || 0);
      this.metricsCollector.trackMetric('phantom_prompt_threshold_violations', summary.threshold_violations);
      
      this.logger.info('Tracked phantom prompt metrics', {
        metrics: ['trust', 'drift', 'empathy', 'clarity', 'threshold_violations']
      });
    } catch (error) {
      this.logger.warn('Failed to track phantom prompt metrics', {
        error: error.message
      });
    }
  }

  /**
   * Appends an action to the auto-actions log
   * Legacy method for backward compatibility, uses Logger primarily
   */
  private logAction(msg: string): void {
    try {
      // Use Logger first
      this.logger.info(msg);
      
      // Then append to log file for backward compatibility
      const entry = `\n[${new Date().toISOString()}] PhantomPromptSummarizer: ${msg}`;
      fs.appendFileSync(this.logPath, entry);
    } catch (error) {
      this.logger.warn('Failed to write to auto-actions log', {
        error: error.message,
        logPath: this.logPath
      });
    }
  }
}

// If run directly, execute the summarizer
if (require.main === module) {
  (async () => {
    try {
      const summarizer = new PhantomPromptSummarizer();
      await summarizer.run();
    } catch (error) {
      const logger = new Logger('PhantomPromptSummarizer');
      logger.error('Failed to run summarizer from command line', {
        error: error.message,
        stack: error.stack
      });
      process.exit(1);
    }
  })();
} 