import { EventBus } from '../../event-bus/eventBus';
import { Logger } from '../../utils/logger';

/**
 * BaseScorer - Abstract base class for all metric scorers
 * Provides common functionality and interface for scoring metrics
 */
export abstract class BaseScorer {
  protected readonly logger: Logger;
  protected readonly eventBus: EventBus;
  protected readonly metricName: string;
  public readonly name: string;

  constructor(name: string) {
    this.logger = new Logger(`Scorer.${name}`);
    this.eventBus = EventBus.getInstance();
    this.metricName = name;
    this.name = name;
  }

  /**
   * Calculates the score for a given result
   * @param result The result to score
   * @returns The calculated score and any additional metrics
   */
  public abstract calculate(result: any): Promise<{
    score: number;
    metrics: Record<string, any>;
    flags: string[];
  }>;

  /**
   * Validates the score is within acceptable bounds
   * @param score The score to validate
   * @returns Whether the score is valid
   */
  protected validateScore(score: number): boolean {
    return score >= 0 && score <= 1;
  }

  /**
   * Emits a scoring event
   * @param score The calculated score
   * @param metrics Additional metrics
   * @param flags Any scoring flags
   */
  protected emitScoreEvent(
    score: number,
    metrics: Record<string, any>,
    flags: string[]
  ): void {
    this.eventBus.emit('metric.scored', {
      metric: this.metricName,
      score,
      metrics,
      flags
    });
  }

  /**
   * Logs scoring results
   * @param score The calculated score
   * @param metrics Additional metrics
   * @param flags Any scoring flags
   */
  protected logScore(
    score: number,
    metrics: Record<string, any>,
    flags: string[]
  ): void {
    this.logger.info(`Scored ${this.metricName}: ${score}`, {
      metrics,
      flags
    });
  }

  /**
   * Handles scoring errors
   * @param error The error that occurred
   * @returns Default scoring result
   */
  protected handleScoringError(error: any): {
    score: number;
    metrics: Record<string, any>;
    flags: string[];
  } {
    this.logger.error(`Failed to score ${this.metricName}`, error);
    this.eventBus.emit('metric.error', {
      metric: this.metricName,
      error
    });

    return {
      score: 0,
      metrics: {},
      flags: ['scoring_error']
    };
  }
} 