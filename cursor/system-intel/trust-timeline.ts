/**
 * system-intel/trust-timeline.ts
 * 
 * Purpose:
 * Maintains historical trust deltas over time for trend analysis
 * and evolution tracking.
 */

import { TrustDelta } from './intel-aggregator';

export class TrustTimeline {
  private readonly maxHistorySize: number;
  private readonly history: Map<string, TrustDelta[]>;

  constructor(maxHistorySize: number = 1000) {
    this.maxHistorySize = maxHistorySize;
    this.history = new Map();
  }

  public async recordDelta(
    agentId: string,
    currentScore: number,
    reason?: string
  ): Promise<void> {
    const previousScore = this.getPreviousScore(agentId);
    const delta = currentScore - previousScore;

    const trustDelta: TrustDelta = {
      agentId,
      timestamp: new Date().toISOString(),
      previousScore,
      currentScore,
      delta,
      reason
    };

    this.addToHistory(agentId, trustDelta);
  }

  private getPreviousScore(agentId: string): number {
    const agentHistory = this.history.get(agentId);
    if (!agentHistory || agentHistory.length === 0) {
      return 1.0; // Default to maximum trust for new agents
    }
    return agentHistory[agentHistory.length - 1].currentScore;
  }

  private addToHistory(agentId: string, delta: TrustDelta): void {
    const agentHistory = this.history.get(agentId) || [];
    agentHistory.push(delta);

    // Maintain history size limit
    if (agentHistory.length > this.maxHistorySize) {
      agentHistory.shift();
    }

    this.history.set(agentId, agentHistory);
  }

  public async getRecentDeltas(
    agentId?: string,
    limit: number = 100
  ): Promise<TrustDelta[]> {
    if (agentId) {
      const agentHistory = this.history.get(agentId) || [];
      return agentHistory.slice(-limit);
    }

    // If no agent specified, return recent deltas for all agents
    const allDeltas: TrustDelta[] = [];
    for (const history of this.history.values()) {
      allDeltas.push(...history.slice(-limit));
    }
    return allDeltas.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, limit);
  }

  public async getDeltasInRange(
    startTime: string,
    endTime: string,
    agentId?: string
  ): Promise<TrustDelta[]> {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    if (agentId) {
      const agentHistory = this.history.get(agentId) || [];
      return agentHistory.filter(delta => {
        const time = new Date(delta.timestamp).getTime();
        return time >= start && time <= end;
      });
    }

    // If no agent specified, return deltas for all agents
    const allDeltas: TrustDelta[] = [];
    for (const history of this.history.values()) {
      allDeltas.push(...history.filter(delta => {
        const time = new Date(delta.timestamp).getTime();
        return time >= start && time <= end;
      }));
    }
    return allDeltas.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  public async getTrustTrend(
    agentId: string,
    windowSize: number = 10
  ): Promise<{
    trend: 'improving' | 'degrading' | 'stable';
    averageDelta: number;
    volatility: number;
  }> {
    const recentDeltas = await this.getRecentDeltas(agentId, windowSize);
    if (recentDeltas.length === 0) {
      return {
        trend: 'stable',
        averageDelta: 0,
        volatility: 0
      };
    }

    const deltas = recentDeltas.map(d => d.delta);
    const averageDelta = deltas.reduce((sum, d) => sum + d, 0) / deltas.length;
    const volatility = this.calculateVolatility(deltas);

    let trend: 'improving' | 'degrading' | 'stable';
    if (averageDelta > 0.01) {
      trend = 'improving';
    } else if (averageDelta < -0.01) {
      trend = 'degrading';
    } else {
      trend = 'stable';
    }

    return { trend, averageDelta, volatility };
  }

  private calculateVolatility(deltas: number[]): number {
    if (deltas.length < 2) return 0;

    const mean = deltas.reduce((sum, d) => sum + d, 0) / deltas.length;
    const squaredDiffs = deltas.map(d => Math.pow(d - mean, 2));
    const variance = squaredDiffs.reduce((sum, d) => sum + d, 0) / (deltas.length - 1);
    return Math.sqrt(variance);
  }

  public clearHistory(agentId?: string): void {
    if (agentId) {
      this.history.delete(agentId);
    } else {
      this.history.clear();
    }
  }
} 