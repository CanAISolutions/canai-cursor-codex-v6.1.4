/**
 * agent-oversight/stagnation-detector.ts
 * 
 * Purpose:
 * Detects and flags agents that show no improvement in performance over time.
 * Monitors trust scores, evolution triggers, and recovery patterns.
 */

import { AgentMemory } from './agent-memory';
import { EventBus } from '../utils/event-bus';

export interface StagnationMetrics {
  trustScoreTrend: number;
  evolutionTriggerRate: number;
  recoverySuccessRate: number;
  patternSubstitutionRate: number;
}

export class StagnationDetector {
  private readonly TRUST_TREND_THRESHOLD = 0.01; // Minimum trust score improvement per session
  private readonly EVOLUTION_RATE_THRESHOLD = 0.2; // Minimum evolution trigger rate
  private readonly RECOVERY_RATE_THRESHOLD = 0.5; // Minimum recovery success rate
  private readonly PATTERN_RATE_THRESHOLD = 0.3; // Maximum pattern substitution rate

  constructor(
    private agentMemory: AgentMemory,
    private eventBus: EventBus
  ) {}

  public async checkStagnation(agentId: string): Promise<boolean> {
    const metrics = await this.calculateStagnationMetrics(agentId);
    const isStagnant = this.evaluateStagnation(metrics);

    if (isStagnant) {
      this.eventBus.emit('oversight:stagnation-detected', {
        agentId,
        metrics
      });
    }

    return isStagnant;
  }

  private async calculateStagnationMetrics(agentId: string): Promise<StagnationMetrics> {
    const record = await this.agentMemory.getAgentRecord(agentId);
    if (!record) {
      return {
        trustScoreTrend: 0,
        evolutionTriggerRate: 0,
        recoverySuccessRate: 0,
        patternSubstitutionRate: 0
      };
    }

    // Calculate trust score trend
    const trustScoreTrend = this.calculateTrustTrend(record);

    // Calculate evolution trigger rate
    const evolutionTriggerRate = this.calculateEvolutionRate(record);

    // Calculate recovery success rate
    const recoverySuccessRate = this.calculateRecoveryRate(record);

    // Calculate pattern substitution rate
    const patternSubstitutionRate = this.calculatePatternRate(record);

    return {
      trustScoreTrend,
      evolutionTriggerRate,
      recoverySuccessRate,
      patternSubstitutionRate
    };
  }

  private calculateTrustTrend(record: any): number {
    if (!record.recentTriggers || record.recentTriggers.length < 2) {
      return 0;
    }

    const recentDeltas = record.recentTriggers
      .filter((t: any) => t.type === 'trust:signal')
      .map((t: any) => t.trustDelta || 0);

    if (recentDeltas.length < 2) {
      return 0;
    }

    // Calculate average trust delta over recent sessions
    const avgDelta = recentDeltas.reduce((sum: number, delta: number) => sum + delta, 0) / recentDeltas.length;
    return avgDelta;
  }

  private calculateEvolutionRate(record: any): number {
    if (!record.recentTriggers || record.recentTriggers.length === 0) {
      return 0;
    }

    const evolutionTriggers = record.recentTriggers.filter((t: any) => 
      t.type.startsWith('evolution:')
    );

    return evolutionTriggers.length / record.recentTriggers.length;
  }

  private calculateRecoveryRate(record: any): number {
    if (!record.recentTriggers || record.recentTriggers.length === 0) {
      return 0;
    }

    const recoveryTriggers = record.recentTriggers.filter((t: any) => 
      t.type.startsWith('recovery:')
    );

    if (recoveryTriggers.length === 0) {
      return 1; // No recovery attempts means 100% success rate
    }

    const successfulRecoveries = recoveryTriggers.filter((t: any) => 
      t.type === 'recovery:succeeded'
    ).length;

    return successfulRecoveries / recoveryTriggers.length;
  }

  private calculatePatternRate(record: any): number {
    if (!record.recentTriggers || record.recentTriggers.length === 0) {
      return 0;
    }

    const patternTriggers = record.recentTriggers.filter((t: any) => 
      t.type === 'pattern:substitution'
    );

    return patternTriggers.length / record.recentTriggers.length;
  }

  private evaluateStagnation(metrics: StagnationMetrics): boolean {
    // Check if trust score is not improving
    const trustStagnant = metrics.trustScoreTrend < this.TRUST_TREND_THRESHOLD;

    // Check if evolution rate is too low
    const evolutionStagnant = metrics.evolutionTriggerRate < this.EVOLUTION_RATE_THRESHOLD;

    // Check if recovery success rate is too low
    const recoveryStagnant = metrics.recoverySuccessRate < this.RECOVERY_RATE_THRESHOLD;

    // Check if pattern substitution rate is too high
    const patternStagnant = metrics.patternSubstitutionRate > this.PATTERN_RATE_THRESHOLD;

    // Agent is considered stagnant if any of these conditions are met
    return trustStagnant || evolutionStagnant || recoveryStagnant || patternStagnant;
  }

  public async getStagnationMetrics(agentId: string): Promise<StagnationMetrics> {
    return this.calculateStagnationMetrics(agentId);
  }

  public async getAllStagnationMetrics(): Promise<Record<string, StagnationMetrics>> {
    const records = await this.agentMemory.getAllRecords();
    const metrics: Record<string, StagnationMetrics> = {};

    await Promise.all(
      Object.keys(records).map(async (agentId) => {
        metrics[agentId] = await this.calculateStagnationMetrics(agentId);
      })
    );

    return metrics;
  }
} 