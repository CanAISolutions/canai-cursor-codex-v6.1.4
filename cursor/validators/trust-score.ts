/**
 * @file cursor/validators/trust-score.ts
 * @description Trust score calculator for measuring system trustworthiness
 * @version 6.2.1
 */

import { EventBus } from '../../event-bus/eventBus';

interface TrustMetrics {
  consistency: number;
  reliability: number;
  transparency: number;
  safety: number;
}

export class TrustScoreCalculator {
  private eventBus: EventBus;
  private readonly TRUST_THRESHOLD = 4.2;
  private readonly METRICS_WEIGHTS = {
    consistency: 0.3,
    reliability: 0.3,
    transparency: 0.2,
    safety: 0.2
  };

  constructor() {
    this.eventBus = EventBus.getInstance();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.eventBus.on('trust.metrics.update', this.handleMetricsUpdate.bind(this));
  }

  public async calculateTrustScore(): Promise<number> {
    const metrics = await this.getCurrentMetrics();
    return this.computeTrustScore(metrics);
  }

  private computeTrustScore(metrics: TrustMetrics): number {
    // Codex-safe fallback: trust score computation skipped due to invalid input
    if (!metrics || typeof metrics !== 'object') {
      return 0;
    }
    const weightedSum = Object.entries(metrics).reduce((sum, [key, value]) => {
      return sum + (value * this.METRICS_WEIGHTS[key as keyof TrustMetrics]);
    }, 0);
    return Math.min(5, Math.max(0, weightedSum));
  }

  private async getCurrentMetrics(): Promise<TrustMetrics> {
    // Implementation would fetch current metrics from storage
    return {
      consistency: 4.5,
      reliability: 4.3,
      transparency: 4.0,
      safety: 4.8
    };
  }

  private async handleMetricsUpdate(data: any): Promise<void> {
    const { metrics } = data;
    const trustScore = this.computeTrustScore(metrics);

    if (trustScore < this.TRUST_THRESHOLD) {
      await this.eventBus.emit('trust.threshold.breach', {
        score: trustScore,
        threshold: this.TRUST_THRESHOLD
      });
    }
  }

  public async validateTrustScore(score: number | undefined | null): Promise<boolean> {
    if (score === undefined || score === null || typeof score !== 'number') {
      return false; // Fallback for invalid input
    }
    return score >= this.TRUST_THRESHOLD;
  }
} 