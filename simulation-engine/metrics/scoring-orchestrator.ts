import { BaseScorer } from './base-scorer';
import { ClarityScorer } from './clarity-scorer';
import { CoachingScorer } from './coaching-scorer';
import { MemoryFidelityScorer } from './memory-fidelity';
import { Logger } from '../../utils/logger';
import { EventBus } from '../../utils/event-bus';

/**
 * ScoringOrchestrator - Manages all scorers and aggregates their results
 * Provides a unified interface for scoring simulation results
 */
export class ScoringOrchestrator {
  private logger: Logger;
  private eventBus: EventBus;
  private scorers: Map<string, BaseScorer>;

  constructor() {
    this.logger = new Logger('scoring-orchestrator');
    this.eventBus = EventBus.getInstance();
    this.scorers = new Map();

    // Initialize scorers
    this.initializeScorers();
  }

  /**
   * Initializes all available scorers
   */
  private initializeScorers(): void {
    const scorerInstances = [
      new ClarityScorer(),
      new CoachingScorer(),
      new MemoryFidelityScorer()
    ];

    scorerInstances.forEach(scorer => {
      this.scorers.set(scorer.name, scorer);
    });

    this.logger.info(`Initialized ${this.scorers.size} scorers`);
  }

  /**
   * Scores a result using all available scorers
   * @param result The result to score
   * @returns Aggregated scoring results
   */
  public async scoreResult(result: any): Promise<{
    overallScore: number;
    scores: Record<string, number>;
    metrics: Record<string, any>;
    flags: string[];
  }> {
    try {
      const scores: Record<string, number> = {};
      const metrics: Record<string, any> = {};
      const flags: string[] = [];

      // Run all scorers in parallel
      const scoringPromises = Array.from(this.scorers.values()).map(async scorer => {
        const scoreResult = await scorer.calculate(result);
        scores[scorer.name] = scoreResult.score;
        metrics[scorer.name] = scoreResult.metrics;
        flags.push(...scoreResult.flags);
      });

      await Promise.all(scoringPromises);

      // Calculate overall score
      const overallScore = this.calculateOverallScore(scores);

      // Log scoring results
      this.logger.info('Scoring completed', {
        overallScore,
        scores,
        flagCount: flags.length
      });

      // Emit scoring event
      this.eventBus.emit('scoring:completed', {
        result,
        overallScore,
        scores,
        metrics,
        flags
      });

      return {
        overallScore,
        scores,
        metrics,
        flags
      };
    } catch (error) {
      this.logger.error('Failed to score result', error);
      throw error;
    }
  }

  /**
   * Calculates the overall score from individual scores
   * @param scores Individual scores from each scorer
   * @returns The overall score
   */
  private calculateOverallScore(scores: Record<string, number>): number {
    const scoreValues = Object.values(scores);
    if (scoreValues.length === 0) return 0;

    // Weight memory fidelity more heavily
    const weights = {
      memory_fidelity: 0.4,
      clarity: 0.3,
      coaching: 0.3
    };

    return scoreValues.reduce((sum, score, index) => {
      const scorerName = Object.keys(scores)[index];
      const weight = weights[scorerName as keyof typeof weights] || 1 / scoreValues.length;
      return sum + score * weight;
    }, 0);
  }

  /**
   * Gets a specific scorer by name
   * @param name The name of the scorer to get
   * @returns The requested scorer or undefined if not found
   */
  public getScorer(name: string): BaseScorer | undefined {
    return this.scorers.get(name);
  }

  /**
   * Gets all available scorer names
   * @returns Array of scorer names
   */
  public getScorerNames(): string[] {
    return Array.from(this.scorers.keys());
  }

  /**
   * Validates that all required scorers are present
   * @param requiredScorers Array of required scorer names
   * @returns Whether all required scorers are present
   */
  public validateScorers(requiredScorers: string[]): boolean {
    return requiredScorers.every(name => this.scorers.has(name));
  }
} 