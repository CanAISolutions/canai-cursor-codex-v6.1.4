/**
 * trust-scorer/evolution-tracker.ts
 * 
 * Purpose:
 * Tracks and analyzes how trust scores evolve over time, providing insights into
 * system trustworthiness and recovery effectiveness.
 */

import { TrustScorer } from './trust-scorer';

interface TrustEvolutionMetrics {
  baselineScore: number;      // Initial trust score
  improvementRate: number;    // Rate of trust score improvement
  stabilityIndex: number;     // Measure of score stability
  recoveryEfficiency: number; // Efficiency of recovery processes
  adaptationSpeed: number;    // Speed of trust score adaptation
}

interface TrustScoreSnapshot {
  timestamp: number;
  score: number;
  component: string;
  context: string;
  recoveryAttempted: boolean;
  recoverySuccessful?: boolean;
}

export class TrustEvolutionTracker {
  private readonly HISTORY_WINDOW = 1000 * 60 * 60 * 24; // 24 hours
  private readonly MIN_SAMPLES = 10;
  private scoreHistory: Map<string, TrustScoreSnapshot[]> = new Map();

  constructor(private trustScorer: TrustScorer) {}

  /**
   * Records a new trust score snapshot
   */
  async recordTrustScore(
    component: string,
    score: number,
    context: string,
    recoveryAttempted: boolean,
    recoverySuccessful?: boolean
  ): Promise<void> {
    const snapshot: TrustScoreSnapshot = {
      timestamp: Date.now(),
      score,
      component,
      context,
      recoveryAttempted,
      recoverySuccessful
    };

    const history = this.scoreHistory.get(component) || [];
    history.push(snapshot);
    this.scoreHistory.set(component, history);

    // Clean up old entries
    this.cleanupOldEntries(component);
  }

  /**
   * Calculates evolution metrics for a component
   */
  async calculateEvolutionMetrics(component: string): Promise<TrustEvolutionMetrics> {
    const history = this.scoreHistory.get(component) || [];
    if (history.length < this.MIN_SAMPLES) {
      throw new Error(`Insufficient history for ${component}`);
    }

    const baselineScore = this.calculateBaselineScore(history);
    const improvementRate = this.calculateImprovementRate(history);
    const stabilityIndex = this.calculateStabilityIndex(history);
    const recoveryEfficiency = this.calculateRecoveryEfficiency(history);
    const adaptationSpeed = this.calculateAdaptationSpeed(history);

    return {
      baselineScore,
      improvementRate,
      stabilityIndex,
      recoveryEfficiency,
      adaptationSpeed
    };
  }

  /**
   * Gets the trust score history for a component
   */
  getTrustHistory(component: string): TrustScoreSnapshot[] {
    return this.scoreHistory.get(component) || [];
  }

  /**
   * Cleans up old entries from the history
   */
  private cleanupOldEntries(component: string): void {
    const history = this.scoreHistory.get(component) || [];
    const cutoff = Date.now() - this.HISTORY_WINDOW;
    
    const filteredHistory = history.filter(snapshot => snapshot.timestamp >= cutoff);
    this.scoreHistory.set(component, filteredHistory);
  }

  /**
   * Calculates the baseline trust score
   */
  private calculateBaselineScore(history: TrustScoreSnapshot[]): number {
    const oldestScores = history
      .slice(0, Math.min(5, history.length))
      .map(snapshot => snapshot.score);
    
    return oldestScores.reduce((sum, score) => sum + score, 0) / oldestScores.length;
  }

  /**
   * Calculates the rate of trust score improvement
   */
  private calculateImprovementRate(history: TrustScoreSnapshot[]): number {
    const sortedHistory = [...history].sort((a, b) => a.timestamp - b.timestamp);
    const firstScore = sortedHistory[0].score;
    const lastScore = sortedHistory[sortedHistory.length - 1].score;
    const timeSpan = sortedHistory[sortedHistory.length - 1].timestamp - sortedHistory[0].timestamp;

    return (lastScore - firstScore) / (timeSpan / (1000 * 60 * 60)); // Improvement per hour
  }

  /**
   * Calculates the stability index of trust scores
   */
  private calculateStabilityIndex(history: TrustScoreSnapshot[]): number {
    const scores = history.map(snapshot => snapshot.score);
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    
    return 1 / (1 + Math.sqrt(variance)); // Higher variance = lower stability
  }

  /**
   * Calculates the efficiency of recovery processes
   */
  private calculateRecoveryEfficiency(history: TrustScoreSnapshot[]): number {
    const recoveryAttempts = history.filter(snapshot => snapshot.recoveryAttempted);
    if (recoveryAttempts.length === 0) return 1;

    const successfulRecoveries = recoveryAttempts.filter(
      snapshot => snapshot.recoverySuccessful === true
    );

    return successfulRecoveries.length / recoveryAttempts.length;
  }

  /**
   * Calculates the speed of trust score adaptation
   */
  private calculateAdaptationSpeed(history: TrustScoreSnapshot[]): number {
    const sortedHistory = [...history].sort((a, b) => a.timestamp - b.timestamp);
    const adaptations: number[] = [];

    for (let i = 1; i < sortedHistory.length; i++) {
      const timeDiff = sortedHistory[i].timestamp - sortedHistory[i - 1].timestamp;
      const scoreDiff = Math.abs(sortedHistory[i].score - sortedHistory[i - 1].score);
      adaptations.push(scoreDiff / (timeDiff / 1000)); // Score change per second
    }

    return adaptations.reduce((sum, speed) => sum + speed, 0) / adaptations.length;
  }
} 