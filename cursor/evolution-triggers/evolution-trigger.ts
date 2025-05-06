/**
 * evolution-triggers/evolution-trigger.ts
 * 
 * Purpose:
 * Core evolution trigger system that monitors system metrics and triggers
 * evolution events when thresholds are exceeded or patterns indicate need.
 */

import { TrustEvolutionTracker } from '../agents/trust-scorer/evolution-tracker';
import { PerformanceOptimizer } from '../optimization/performance-optimizer';
import { EmotionalIntelligenceEngine } from '../agents/emotional-intelligence/pipeline';
import { ResourceMonitor } from '../optimization/resource-monitor';
import { HeartbeatEvent } from '../heartbeat/heartbeat-monitor';

/**
 * Interface for evolution triggers
 */
export interface EvolutionTrigger {
  type: string;
  threshold: number;
  priority: number;
  check: () => Promise<TriggerResult | null>;
}

/**
 * Interface for trigger results
 */
export interface TriggerResult {
  type: string;
  metrics: Record<string, number>;
  timestamp: number;
}

export class EvolutionTriggerManager {
  private readonly triggers: Map<string, EvolutionTrigger> = new Map();
  private readonly DEFAULT_TIMEOUT = 1000 * 60 * 5; // 5 minutes
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor(
    private trustTracker: TrustEvolutionTracker,
    private performanceOptimizer: PerformanceOptimizer,
    private emotionalEngine: EmotionalIntelligenceEngine,
    private resourceMonitor: ResourceMonitor
  ) {
    this.initializeTriggers();
  }

  /**
   * Initializes default evolution triggers
   */
  private initializeTriggers(): void {
    // Trust score triggers
    this.triggers.set('trust-score-drop', {
      type: 'trust',
      threshold: 0.7,
      priority: 3,
      check: this.checkTrustTriggers.bind(this)
    });

    // Performance triggers
    this.triggers.set('performance-degradation', {
      type: 'performance',
      threshold: 0.8,
      priority: 2,
      check: this.checkPerformanceTriggers.bind(this)
    });

    // Emotional triggers
    this.triggers.set('emotional-drift', {
      type: 'emotional',
      threshold: 0.75,
      priority: 3,
      check: this.checkEmotionalTriggers.bind(this)
    });

    // Resource triggers
    this.triggers.set('resource-strain', {
      type: 'resource',
      threshold: 0.9,
      priority: 3,
      check: this.checkResourceTriggers.bind(this)
    });
  }

  /**
   * Starts monitoring for evolution triggers
   */
  startMonitoring(): void {
    if (this.monitoringInterval) {
      return;
    }

    this.monitoringInterval = setInterval(async () => {
      await this.checkTriggers();
    }, this.DEFAULT_TIMEOUT);
  }

  /**
   * Stops monitoring for evolution triggers
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  /**
   * Checks all evolution triggers
   */
  private async checkTriggers(): Promise<void> {
    const results: TriggerResult[] = [];

    // Check trust score triggers
    const trustMetrics = await this.checkTrustTriggers();
    if (trustMetrics) results.push(trustMetrics);

    // Check performance triggers
    const performanceMetrics = await this.checkPerformanceTriggers();
    if (performanceMetrics) results.push(performanceMetrics);

    // Check emotional triggers
    const emotionalMetrics = await this.checkEmotionalTriggers();
    if (emotionalMetrics) results.push(emotionalMetrics);

    // Check resource triggers
    const resourceMetrics = await this.checkResourceTriggers();
    if (resourceMetrics) results.push(resourceMetrics);

    // Handle triggered events
    if (results.length > 0) {
      await this.handleTriggeredEvents(results);
    }
  }

  /**
   * Checks trust score triggers
   */
  private async checkTrustTriggers(): Promise<TriggerResult | null> {
    const trigger = this.triggers.get('trust-score-drop');
    if (!trigger) return null;

    const metrics = await this.trustTracker.calculateEvolutionMetrics('system');
    const currentScore = metrics.baselineScore;

    if (currentScore < trigger.threshold) {
      return {
        type: trigger.type,
        metrics: {
          current: currentScore,
          threshold: trigger.threshold,
          delta: trigger.threshold - currentScore
        },
        timestamp: Date.now()
      };
    }

    return null;
  }

  /**
   * Checks performance triggers
   */
  private async checkPerformanceTriggers(): Promise<TriggerResult | null> {
    const trigger = this.triggers.get('performance-degradation');
    if (!trigger) return null;

    const stats = this.performanceOptimizer.getPerformanceStats();
    const currentPerformance = (stats.cacheHitRate + (1 - stats.averageResponseTime / 1000)) / 2;

    if (currentPerformance < trigger.threshold) {
      return {
        type: trigger.type,
        metrics: {
          current: currentPerformance,
          threshold: trigger.threshold,
          delta: trigger.threshold - currentPerformance
        },
        timestamp: Date.now()
      };
    }

    return null;
  }

  /**
   * Checks emotional triggers
   */
  private async checkEmotionalTriggers(): Promise<TriggerResult | null> {
    const trigger = this.triggers.get('emotional-drift');
    if (!trigger) return null;

    const emotionalAnalysis = await this.emotionalEngine.processInput(
      'system_state',
      { userState: 0.5, conversationHistory: 0.5, environmentalFactors: 0.5 }
    );

    const currentResonance = emotionalAnalysis.adaptiveResponse.empathyLevel;

    if (currentResonance < trigger.threshold) {
      return {
        type: trigger.type,
        metrics: {
          current: currentResonance,
          threshold: trigger.threshold,
          delta: trigger.threshold - currentResonance
        },
        timestamp: Date.now()
      };
    }

    return null;
  }

  /**
   * Checks resource triggers
   */
  private async checkResourceTriggers(): Promise<TriggerResult | null> {
    const trigger = this.triggers.get('resource-strain');
    if (!trigger) return null;

    const usage = await this.resourceMonitor.getResourceUsage();
    const currentUsage = Math.max(usage.cpu, usage.memory);

    if (currentUsage > trigger.threshold) {
      return {
        type: trigger.type,
        metrics: {
          current: currentUsage,
          threshold: trigger.threshold,
          delta: currentUsage - trigger.threshold
        },
        timestamp: Date.now()
      };
    }

    return null;
  }

  /**
   * Handles triggered evolution events
   */
  private async handleTriggeredEvents(results: TriggerResult[]): Promise<void> {
    // Sort by priority
    const sortedResults = results.sort((a, b) => {
      const priorityA = this.triggers.get(a.type!)?.priority;
      const priorityB = this.triggers.get(b.type!)?.priority;
      return this.getPriorityWeight(priorityB!) - this.getPriorityWeight(priorityA!);
    });

    // Handle each trigger in priority order
    for (const result of sortedResults) {
      await this.executeEvolutionEvent(result);
    }
  }

  /**
   * Executes an evolution event
   */
  private async executeEvolutionEvent(result: TriggerResult): Promise<void> {
    const trigger = this.triggers.get(result.type);
    if (!trigger) return;

    console.log(`Evolution trigger activated: ${trigger.type}`);
    console.log(`Current metrics:`, result.metrics);

    // TODO: Implement evolution event execution
    // This will be expanded in future iterations to include:
    // - Evolution strategy selection
    // - Resource allocation
    // - Execution coordination
    // - Result validation
  }

  /**
   * Gets priority weight for sorting
   */
  private getPriorityWeight(priority: number): number {
    return priority;
  }

  /**
   * Handles an external event from the heartbeat module
   * @param event The heartbeat event to process
   */
  public async handleEvent(event: HeartbeatEvent): Promise<void> {
    // Convert heartbeat event to evolution trigger result
    const result: TriggerResult = {
      type: this.determineTriggerType(event),
      metrics: this.extractMetrics(event),
      timestamp: event.timestamp
    };

    // Execute the evolution event
    await this.executeEvolutionEvent(result);
  }

  /**
   * Determines the appropriate trigger type based on the heartbeat event
   */
  private determineTriggerType(event: HeartbeatEvent): string {
    const metrics = event.metrics;
    
    if (metrics.responsiveness && metrics.responsiveness < 0.3) {
      return 'performance';
    }
    
    if (metrics.resourceUsage) {
      if (metrics.resourceUsage.cpu > 0.9 || metrics.resourceUsage.memory > 0.9) {
        return 'resource';
      }
    }
    
    if (metrics.trustScore && metrics.trustScore < 0.5) {
      return 'trust';
    }

    return 'emotional';
  }

  /**
   * Extracts relevant metrics from the heartbeat event
   */
  private extractMetrics(event: HeartbeatEvent): Record<string, number> {
    const metrics: Record<string, number> = {};
    
    if (event.metrics.responsiveness) {
      metrics.responsiveness = event.metrics.responsiveness;
    }
    
    if (event.metrics.resourceUsage) {
      metrics.cpu = event.metrics.resourceUsage.cpu;
      metrics.memory = event.metrics.resourceUsage.memory;
    }
    
    if (event.metrics.trustScore) {
      metrics.trustScore = event.metrics.trustScore;
    }

    return metrics;
  }
} 