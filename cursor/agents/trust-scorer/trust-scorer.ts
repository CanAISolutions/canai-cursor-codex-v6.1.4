/**
 * @file trust-scorer.ts
 * @description Evaluates and maintains trust scores for system components.
 * @pillar Trust & Ethical AI
 * @maturity Stable
 * @status Active
 */
import { EventBus, Event } from '../event-bus/event-bus';
import { AIProvider } from '../debug/core/ai-provider';
import { TrustFactors, TrustEvaluation, TrustEventType, TrustEventData } from './types';
import { recordMetric } from '../debug/utils/telemetry';
import * as fs from 'fs';
import * as path from 'path';
import { BugContext } from '../debug/engines/ai-provider';

export interface TrustScore {
  component: string;
  score: number;
  timestamp: number;
}

export interface TrustThreshold {
  minimum: number;
  warning: number;
  critical: number;
}

export interface TrustScoreConfig {
  minTrustScore: number;
  warningThreshold: number;
  maxAdjustment: number;
  persistPath: string;
}

/**
 * TrustScorer evaluates and maintains trust scores for system components
 */
export class TrustScorer {
  private readonly TRUST_FILE: string;
  private readonly MINIMUM_THRESHOLD = 0.9;
  private readonly MAXIMUM_SCORE = 1.0;
  private readonly MINIMUM_SCORE = 0.0;
  private readonly WARNING_THRESHOLD: number;
  private readonly MAX_ADJUSTMENT: number;
  private readonly eventBus: EventBus;
  private readonly aiProvider: AIProvider;
  private trustScores: Map<string, number>;
  private trustHistory: Map<string, Array<{ score: number; timestamp: number }>>;

  constructor(
    eventBus: EventBus,
    aiProvider: AIProvider,
    config: TrustScoreConfig = {
      minTrustScore: 0.9,
      warningThreshold: 0.85,
      maxAdjustment: 0.2,
      persistPath: '.canai-context/trust-scores.json'
    }
  ) {
    this.eventBus = eventBus;
    this.aiProvider = aiProvider;
    this.WARNING_THRESHOLD = config.warningThreshold;
    this.MAX_ADJUSTMENT = config.maxAdjustment;
    this.TRUST_FILE = path.resolve(process.cwd(), config.persistPath);
    
    this.trustScores = new Map();
    this.trustHistory = new Map();
    
    // Ensure context directory exists
    const contextDir = path.dirname(this.TRUST_FILE);
    if (!fs.existsSync(contextDir)) {
      fs.mkdirSync(contextDir, { recursive: true });
    }
    
    this.loadTrustScores();
  }

  /**
   * Evaluates trust for a component with precise floating point handling
   */
  public async evaluateTrust(factors: TrustFactors): Promise<number> {
    const bugContext: BugContext = {
      message: `Evaluating trust factors: ${JSON.stringify(factors)}`,
      type: 'trust-evaluation',
      likelihood: 'medium',
      impact: Object.keys(factors)
    };

    let score = this.MINIMUM_THRESHOLD;
    try {
      if (!this.aiProvider) {
        throw new Error('AIProvider is not implemented');
      }
      let evalFn = (this.aiProvider as any).evaluateFixTrust || (this.aiProvider as any).evaluateTrust;
      if (typeof evalFn !== 'function') {
        throw new Error('AIProvider.evaluateFixTrust or evaluateTrust is not implemented');
      }
      // Support both return types: number or { score: number }
      const result = await evalFn.call(this.aiProvider, factors, bugContext);
      score = typeof result === 'number' ? result : result.score;
    } catch (err: any) {
      // Codex fallback: log, emit warning, and use minimum threshold
      await recordMetric('trust_evaluation_failed', { error: err?.message || String(err), factors });
      await this.eventBus.emit('trust-scorer:event', {
        type: 'trust:warning',
        data: {
          message: 'AIProvider fallback: trust evaluation failed',
          score,
          threshold: this.MINIMUM_THRESHOLD
        },
        timestamp: new Date().toISOString()
      });
      // Fallback: return minimum threshold
      return score;
    }

    if (score < this.MINIMUM_THRESHOLD) {
      await recordMetric('trust_violation', { score, threshold: this.MINIMUM_THRESHOLD, factors });
      await this.eventBus.emit('trust-scorer:event', {
        type: 'trust:violation',
        data: {
          score,
          threshold: this.MINIMUM_THRESHOLD
        },
        timestamp: new Date().toISOString()
      });
      throw new Error(`Trust score ${score} below threshold ${this.MINIMUM_THRESHOLD}`);
    } else if (score < this.WARNING_THRESHOLD) {
      await recordMetric('trust_warning', { score, threshold: this.WARNING_THRESHOLD, factors });
      await this.eventBus.emit('trust-scorer:event', {
        type: 'trust:warning',
        data: {
          message: 'Low trust score',
          score,
          threshold: this.WARNING_THRESHOLD
        },
        timestamp: new Date().toISOString()
      });
    } else {
      await recordMetric('trust_evaluated', { score, factors });
    }

    return score;
  }

  /**
   * Adjusts trust score with bounds checking and precise rounding
   */
  public async adjustTrustScore(
    component: string,
    adjustment: number,
    reason: string
  ): Promise<number> {
    const currentScore = this.getTrustScore(component);
    const newScore = Math.max(
      this.MINIMUM_SCORE,
      Math.min(this.MAXIMUM_SCORE, currentScore + adjustment)
    );

    this.trustScores.set(component, newScore);
    this.recordTrustHistory(component, newScore);

    await this.eventBus.emit('trust-scorer:event', {
      type: 'trust:adjusted',
      data: {
        component,
        oldScore: currentScore,
        newScore,
        adjustment,
        reason
      },
      timestamp: new Date().toISOString()
    });

    return newScore;
  }

  /**
   * Gets current trust score for a component
   */
  public getTrustScore(component: string): number {
    return this.trustScores.get(component) || this.MINIMUM_THRESHOLD;
  }

  /**
   * Gets trust history for a component
   */
  public getTrustHistory(component: string): Array<{ score: number; timestamp: number }> {
    return this.trustHistory.get(component) || [];
  }

  private async handleTrustViolation(component: string, score: number): Promise<void> {
    await this.eventBus.emit('trust-scorer:event', {
      type: 'trust:violation',
      data: { component, score },
      timestamp: new Date().toISOString()
    });
  }

  private recordTrustHistory(component: string, score: number): void {
    if (!this.trustHistory.has(component)) {
      this.trustHistory.set(component, []);
    }

    this.trustHistory.get(component)!.push({
      score,
      timestamp: Date.now()
    });
  }

  private loadTrustScores(): void {
    try {
      if (fs.existsSync(this.TRUST_FILE)) {
        const data = JSON.parse(fs.readFileSync(this.TRUST_FILE, 'utf8'));
        this.trustScores = new Map(Object.entries(data.scores));
        this.trustHistory = new Map(Object.entries(data.history));
      }
    } catch (error) {
      // Initialize with empty state if load fails
      this.trustScores = new Map();
      this.trustHistory = new Map();
    }
  }

  private saveTrustScores(): void {
    try {
      const data = {
        scores: Object.fromEntries(this.trustScores),
        history: Object.fromEntries(this.trustHistory)
      };
      fs.writeFileSync(this.TRUST_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Failed to save trust scores:', error);
    }
  }

  /**
   * Evaluate trust for a task based on its outcome
   */
  public async evaluateTaskTrust(taskId: string, outcome: {
    success: boolean;
    error?: string;
    duration: number;
    quality: number;
  }): Promise<void> {
    if (!outcome.success) {
      await recordMetric('task_failed', { taskId, error: outcome.error });
      await this.eventBus.emit('trust-scorer:event', {
        type: 'task:failed',
        data: { taskId, error: outcome.error },
        timestamp: new Date().toISOString()
      });
      throw new Error(`Task ${taskId} failed: ${outcome.error}`);
    }

    const score = (
      (outcome.success ? 1 : 0) * 0.4 +
      (outcome.quality) * 0.4 +
      (outcome.duration < 1000 ? 1 : 0.5) * 0.2
    );

    await this.evaluateTrust({
      reliability: score,
      safety: score,
      performance: score,
      ethical: score
    });
  }
} 