/**
 * evolution-triggers/trigger-manager.ts
 * 
 * Purpose:
 * Coordinates between trigger detection and strategy execution, managing the evolution process.
 */

import { EvolutionTriggerManager } from './evolution-trigger';
import { EvolutionStrategyExecutor } from './strategy-executor';
import { TrustEvolutionTracker } from '../agents/trust-scorer/evolution-tracker';
import { PerformanceOptimizer } from '../optimization/performance-optimizer';
import { EmotionalIntelligenceEngine } from '../agents/emotional-intelligence/pipeline';
import { ResourceMonitor } from '../optimization/resource-monitor';

/**
 * Interface for evolution events
 */
export interface EvolutionEvent {
  type: string;
  priority: number;
  metrics: Record<string, number>;
  timestamp: number;
}

export class EvolutionTriggerCoordinator {
  private readonly triggerManager: EvolutionTriggerManager;
  private readonly strategyExecutor: EvolutionStrategyExecutor;
  private readonly eventQueue: EvolutionEvent[] = [];
  private isProcessing = false;

  constructor(
    trustTracker: TrustEvolutionTracker,
    performanceOptimizer: PerformanceOptimizer,
    emotionalEngine: EmotionalIntelligenceEngine,
    resourceMonitor: ResourceMonitor
  ) {
    this.triggerManager = new EvolutionTriggerManager(
      trustTracker,
      performanceOptimizer,
      emotionalEngine,
      resourceMonitor
    );
    this.strategyExecutor = new EvolutionStrategyExecutor(
      trustTracker,
      performanceOptimizer,
      emotionalEngine,
      resourceMonitor
    );
  }

  /**
   * Starts the evolution trigger coordination process
   */
  async start(): Promise<void> {
    // Start monitoring for triggers
    this.triggerManager.startMonitoring();

    // Process events in the background
    this.processEvents();
  }

  /**
   * Stops the evolution trigger coordination process
   */
  async stop(): Promise<void> {
    this.triggerManager.stopMonitoring();
    this.isProcessing = false;
  }

  /**
   * Processes evolution events in the queue
   */
  private async processEvents(): Promise<void> {
    this.isProcessing = true;

    while (this.isProcessing) {
      if (this.eventQueue.length > 0) {
        const event = this.eventQueue.shift();
        if (event) {
          await this.handleEvent(event);
        }
      }

      // Wait before processing next event
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  /**
   * Handles a single evolution event
   */
  private async handleEvent(event: EvolutionEvent): Promise<void> {
    try {
      // Execute the appropriate strategy
      const result = await this.strategyExecutor.executeStrategy(event.type, event.metrics);

      if (!result.success) {
        // Log failure and potentially retry with different strategy
        console.error(`Strategy execution failed for event ${event.type}:`, result.errors);
        
        // If trust-related event failed, try emotional stabilization
        if (event.type === 'trust-recovery' && !this.eventQueue.some(e => e.type === 'emotional-stabilization')) {
          this.eventQueue.push({
            type: 'emotional-stabilization',
            priority: event.priority + 1,
            metrics: event.metrics,
            timestamp: Date.now()
          });
        }
      } else {
        // Log success and metrics improvement
        console.log(`Strategy execution succeeded for event ${event.type}:`, {
          before: result.metrics.before,
          after: result.metrics.after,
          duration: result.duration
        });
      }
    } catch (error) {
      console.error(`Error handling evolution event ${event.type}:`, error);
    }
  }

  /**
   * Adds an evolution event to the queue
   */
  private addEvent(event: EvolutionEvent): void {
    // Insert event in priority order
    const insertIndex = this.eventQueue.findIndex(e => e.priority < event.priority);
    if (insertIndex === -1) {
      this.eventQueue.push(event);
    } else {
      this.eventQueue.splice(insertIndex, 0, event);
    }
  }

  /**
   * Handles a trigger event from the trigger manager
   */
  async handleTrigger(type: string, metrics: Record<string, number>): Promise<void> {
    const event: EvolutionEvent = {
      type,
      priority: this.getEventPriority(type),
      metrics,
      timestamp: Date.now()
    };

    this.addEvent(event);
  }

  /**
   * Gets the priority for an event type
   */
  private getEventPriority(type: string): number {
    switch (type) {
      case 'trust-recovery':
        return 1; // Highest priority
      case 'resource-optimization':
        return 2;
      case 'performance-optimization':
        return 3;
      case 'emotional-stabilization':
        return 4;
      default:
        return 5;
    }
  }
} 