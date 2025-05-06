/**
 * @file trust-scorer.ts
 * @description Evaluates and maintains trust scores for system components.
 * @pillar Trust & Ethical AI
 * @maturity Stable
 * @status Active
 */
import { EventBusAgent } from '../event-bus/event-bus';
import { recordMetric } from '../debug/utils/telemetry';
import * as fs from 'fs';
import * as path from 'path';

interface Event {
  type: string;
  data: any;
  timestamp: string;
  sessionId?: string;
  agentVersion?: string;
  metricSeverity?: 'low' | 'medium' | 'high';
}

interface TrustScore {
  component: string;
  score: number;
  timestamp: number;
}

interface TrustThreshold {
  minimum: number;
  warning: number;
  critical: number;
}

/**
 * TrustScorer evaluates and maintains trust scores for system components
 */
export class TrustScorer {
  private eventBus: EventBusAgent;
  private trustScores: Map<string, number>;
  private trustHistory: Map<string, Array<{ timestamp: number; score: number }>>;
  private readonly TRUST_FILE = '.canai-context/trust-scores.json';
  private readonly WARNING_THRESHOLD = 0.85;
  private readonly MINIMUM_THRESHOLD = 0.9;

  constructor(eventBus: EventBusAgent) {
    this.eventBus = eventBus;
    this.trustScores = new Map();
    this.trustHistory = new Map();
    this.initializeTrustScores();
  }

  /**
   * Initialize trust scores from file or create default scores
   */
  private initializeTrustScores(): void {
    try {
      if (fs.existsSync(this.TRUST_FILE)) {
        const data = JSON.parse(fs.readFileSync(this.TRUST_FILE, 'utf8'));
        this.trustScores = new Map(Object.entries(data.scores));
        this.trustHistory = new Map(Object.entries(data.history));
      }
    } catch (error) {
      console.error('Failed to initialize trust scores:', error);
      this.trustScores = new Map();
      this.trustHistory = new Map();
    }
  }

  /**
   * Save trust scores to file
   */
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
   * Evaluate trust score for a component based on various factors
   */
  public async evaluateTrust(component: string, factors: {
    reliability: number;
    safety: number;
    performance: number;
    ethical: number;
  }): Promise<number> {
    // Calculate weighted score
    const score = (
      factors.reliability * 0.4 +
      factors.safety * 0.3 +
      factors.performance * 0.2 +
      factors.ethical * 0.1
    );

    // Check warning threshold first
    if (score < this.WARNING_THRESHOLD) {
      await this.emitWarning(component, score);
    }

    // Then check minimum threshold
    if (score < this.MINIMUM_THRESHOLD) {
      console.error('Trust violation detected', { component, score, threshold: this.MINIMUM_THRESHOLD });
      await this.handleTrustViolation(component, score);
      throw new Error(`Trust score ${score} below threshold ${this.MINIMUM_THRESHOLD} for component ${component}`);
    }

    // Record score
    this.recordTrustScore(component, score);

    // Emit trust signal with factors
    await this.emitTrustSignal(component, score, factors);

    return score;
  }

  /**
   * Handle trust violation by logging and emitting event
   */
  private async handleTrustViolation(component: string, score: number): Promise<void> {
    await recordMetric('trust_violation', { component, score });
    await this.eventBus.publish({
      type: 'trust:violation',
      data: {
        component,
        score,
        timestamp: new Date().toISOString(),
        threshold: this.MINIMUM_THRESHOLD
      },
      timestamp: new Date().toISOString()
    }, 'high');
  }

  /**
   * Emit warning for low trust score
   */
  private async emitWarning(component: string, score: number): Promise<void> {
    await recordMetric('trust_warning', { component, score });
    await this.eventBus.publish({
      type: 'trust:warning',
      data: {
        component,
        score,
        timestamp: new Date().toISOString(),
        warningThreshold: this.WARNING_THRESHOLD
      },
      timestamp: new Date().toISOString()
    }, 'medium');
  }

  /**
   * Emit trust signal through event bus
   */
  private async emitTrustSignal(component: string, score: number, factors?: {
    reliability: number;
    safety: number;
    performance: number;
    ethical: number;
  }): Promise<void> {
    await recordMetric('trust_signal', { component, score });
    await this.eventBus.publish({
      type: 'trust:signal',
      data: {
        component,
        score,
        timestamp: new Date().toISOString(),
        factors
      },
      timestamp: new Date().toISOString()
    }, 'high');
  }

  /**
   * Record trust score and update history
   */
  private recordTrustScore(component: string, score: number): void {
    this.trustScores.set(component, score);
    
    if (!this.trustHistory.has(component)) {
      this.trustHistory.set(component, []);
    }
    
    this.trustHistory.get(component)?.push({
      timestamp: Date.now(),
      score
    });

    this.saveTrustScores();
  }

  /**
   * Get current trust score for a component
   */
  public getTrustScore(component: string): number {
    return this.trustScores.get(component) || 0;
  }

  /**
   * Get trust score history for a component
   */
  public getTrustHistory(component: string): Array<{ timestamp: number; score: number }> {
    return this.trustHistory.get(component) || [];
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
      await this.eventBus.publish({
        type: 'task:failed',
        data: { taskId, error: outcome.error },
        timestamp: new Date().toISOString()
      }, 'high');
      throw new Error(`Task ${taskId} failed: ${outcome.error}`);
    }

    const score = (
      (outcome.success ? 1 : 0) * 0.4 +
      (outcome.quality) * 0.4 +
      (outcome.duration < 1000 ? 1 : 0.5) * 0.2
    );

    await this.evaluateTrust(`task:${taskId}`, {
      reliability: outcome.success ? 1 : 0,
      safety: outcome.quality,
      performance: outcome.duration < 1000 ? 1 : 0.5,
      ethical: 1
    });
  }

  /**
   * Adjusts the trust score for a component
   * @param component The component to adjust the trust score for
   * @param delta The amount to adjust the score by (positive or negative)
   * @param reason Optional reason for the adjustment
   */
  public async adjustTrustScore(component: string, delta: number, reason?: string): Promise<void> {
    const currentScore = this.getTrustScore(component);
    const newScore = Math.max(0, Math.min(1, currentScore + delta));

    // Record the adjustment
    this.recordTrustScore(component, newScore);

    // Emit trust signal with adjustment info
    await this.emitTrustSignal(component, newScore);

    // If score dropped below warning threshold, emit warning
    if (newScore < this.WARNING_THRESHOLD) {
      await this.emitWarning(component, newScore);
    }

    // If score dropped below minimum threshold, handle violation
    if (newScore < this.MINIMUM_THRESHOLD) {
      await this.handleTrustViolation(component, newScore);
    }
  }
} 