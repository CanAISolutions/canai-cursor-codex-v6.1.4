/**
 * self-healing/adaptive-thresholds.ts
 * 
 * Purpose:
 * Automatically adjusts system thresholds based on historical performance
 * and recovery effectiveness to optimize system behavior.
 */

import { TrustEvolutionTracker } from '../agents/trust-scorer/evolution-tracker';
import { SmartRevisionLoop } from './smart-revision-loop';

interface ThresholdConfig {
  trustScore: {
    min: number;
    target: number;
    max: number;
  };
  recoverySuccess: {
    min: number;
    target: number;
    max: number;
  };
  systemHealth: {
    min: number;
    target: number;
    max: number;
  };
}

interface PerformanceMetrics {
  trustScore: number;
  recoverySuccess: number;
  systemHealth: number;
  timestamp: number;
}

export class AdaptiveThresholds {
  private readonly HISTORY_WINDOW = 1000 * 60 * 60 * 24; // 24 hours
  private readonly MIN_SAMPLES = 10;
  private readonly ADJUSTMENT_RATE = 0.1; // 10% adjustment per update

  private currentConfig: ThresholdConfig = {
    trustScore: {
      min: 0.7,
      target: 0.9,
      max: 1.0
    },
    recoverySuccess: {
      min: 0.8,
      target: 0.95,
      max: 1.0
    },
    systemHealth: {
      min: 0.8,
      target: 0.95,
      max: 1.0
    }
  };

  private performanceHistory: PerformanceMetrics[] = [];

  constructor(
    private trustTracker: TrustEvolutionTracker,
    private revisionLoop: SmartRevisionLoop
  ) {
    this.startAdaptation();
  }

  /**
   * Gets current threshold configuration
   */
  getCurrentConfig(): ThresholdConfig {
    return { ...this.currentConfig };
  }

  /**
   * Records performance metrics
   */
  async recordPerformance(metrics: Omit<PerformanceMetrics, 'timestamp'>): Promise<void> {
    this.performanceHistory.push({
      ...metrics,
      timestamp: Date.now()
    });

    this.cleanupOldMetrics();
  }

  /**
   * Starts the adaptation loop
   */
  private startAdaptation(): void {
    setInterval(async () => {
      await this.adaptThresholds();
    }, 1000 * 60 * 5); // Every 5 minutes
  }

  /**
   * Adapts thresholds based on performance history
   */
  private async adaptThresholds(): Promise<void> {
    if (this.performanceHistory.length < this.MIN_SAMPLES) {
      return;
    }

    const recentMetrics = this.getRecentMetrics();
    const averages = this.calculateAverages(recentMetrics);

    // Adapt trust score thresholds
    this.adaptTrustScoreThresholds(averages.trustScore);

    // Adapt recovery success thresholds
    this.adaptRecoverySuccessThresholds(averages.recoverySuccess);

    // Adapt system health thresholds
    this.adaptSystemHealthThresholds(averages.systemHealth);
  }

  /**
   * Gets recent performance metrics
   */
  private getRecentMetrics(): PerformanceMetrics[] {
    const cutoff = Date.now() - this.HISTORY_WINDOW;
    return this.performanceHistory.filter(metric => metric.timestamp >= cutoff);
  }

  /**
   * Calculates average metrics
   */
  private calculateAverages(metrics: PerformanceMetrics[]): {
    trustScore: number;
    recoverySuccess: number;
    systemHealth: number;
  } {
    const sum = metrics.reduce(
      (acc, metric) => ({
        trustScore: acc.trustScore + metric.trustScore,
        recoverySuccess: acc.recoverySuccess + metric.recoverySuccess,
        systemHealth: acc.systemHealth + metric.systemHealth
      }),
      { trustScore: 0, recoverySuccess: 0, systemHealth: 0 }
    );

    const count = metrics.length;
    return {
      trustScore: sum.trustScore / count,
      recoverySuccess: sum.recoverySuccess / count,
      systemHealth: sum.systemHealth / count
    };
  }

  /**
   * Adapts trust score thresholds
   */
  private adaptTrustScoreThresholds(averageTrustScore: number): void {
    const { min, target, max } = this.currentConfig.trustScore;

    if (averageTrustScore < target) {
      // Lower thresholds if performance is below target
      this.currentConfig.trustScore = {
        min: Math.max(0.5, min - this.ADJUSTMENT_RATE),
        target: Math.max(0.7, target - this.ADJUSTMENT_RATE),
        max: Math.max(0.9, max - this.ADJUSTMENT_RATE)
      };
    } else if (averageTrustScore > target) {
      // Raise thresholds if performance is above target
      this.currentConfig.trustScore = {
        min: Math.min(0.8, min + this.ADJUSTMENT_RATE),
        target: Math.min(0.95, target + this.ADJUSTMENT_RATE),
        max: Math.min(1.0, max + this.ADJUSTMENT_RATE)
      };
    }
  }

  /**
   * Adapts recovery success thresholds
   */
  private adaptRecoverySuccessThresholds(averageRecoverySuccess: number): void {
    const { min, target, max } = this.currentConfig.recoverySuccess;

    if (averageRecoverySuccess < target) {
      // Lower thresholds if recovery success is below target
      this.currentConfig.recoverySuccess = {
        min: Math.max(0.6, min - this.ADJUSTMENT_RATE),
        target: Math.max(0.8, target - this.ADJUSTMENT_RATE),
        max: Math.max(0.9, max - this.ADJUSTMENT_RATE)
      };
    } else if (averageRecoverySuccess > target) {
      // Raise thresholds if recovery success is above target
      this.currentConfig.recoverySuccess = {
        min: Math.min(0.9, min + this.ADJUSTMENT_RATE),
        target: Math.min(0.98, target + this.ADJUSTMENT_RATE),
        max: Math.min(1.0, max + this.ADJUSTMENT_RATE)
      };
    }
  }

  /**
   * Adapts system health thresholds
   */
  private adaptSystemHealthThresholds(averageSystemHealth: number): void {
    const { min, target, max } = this.currentConfig.systemHealth;

    if (averageSystemHealth < target) {
      // Lower thresholds if system health is below target
      this.currentConfig.systemHealth = {
        min: Math.max(0.6, min - this.ADJUSTMENT_RATE),
        target: Math.max(0.8, target - this.ADJUSTMENT_RATE),
        max: Math.max(0.9, max - this.ADJUSTMENT_RATE)
      };
    } else if (averageSystemHealth > target) {
      // Raise thresholds if system health is above target
      this.currentConfig.systemHealth = {
        min: Math.min(0.9, min + this.ADJUSTMENT_RATE),
        target: Math.min(0.98, target + this.ADJUSTMENT_RATE),
        max: Math.min(1.0, max + this.ADJUSTMENT_RATE)
      };
    }
  }

  /**
   * Cleans up old performance metrics
   */
  private cleanupOldMetrics(): void {
    const cutoff = Date.now() - this.HISTORY_WINDOW;
    this.performanceHistory = this.performanceHistory.filter(
      metric => metric.timestamp >= cutoff
    );
  }
} 