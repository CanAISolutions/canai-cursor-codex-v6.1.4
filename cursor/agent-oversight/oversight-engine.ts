/**
 * agent-oversight/oversight-engine.ts
 * 
 * Purpose:
 * Monitors agent behavior, learning patterns, and evolution usage across sessions.
 * Detects stagnation, overcorrection, and misuse of recovery logic.
 */

import { EventBus } from '../utils/event-bus';
import { TrustScorer } from '../agents/trust-scorer/trust-scorer';
import { EvolutionTriggerManager } from '../evolution-triggers/evolution-trigger';
import { AgentMemory } from './agent-memory';
import { StagnationDetector } from './stagnation-detector';

export interface AgentOversightRecord {
  agentName: string;
  sessionsTracked: number;
  avgTrustDelta: number;
  recoveryAttempts: number;
  patternSubstitutions: number;
  stagnantSince?: string;
  lastEvolutionTrigger?: string;
  trustVolatility: number;
  recentTriggers: Array<{
    type: string;
    timestamp: string;
    success: boolean;
  }>;
}

export interface OversightMetrics {
  timestamp: string;
  agents: Record<string, AgentOversightRecord>;
  systemWide: {
    totalRecoveryAttempts: number;
    avgTrustVolatility: number;
    evolutionTriggerRate: number;
  };
}

export class OversightEngine {
  private readonly TRUST_VOLATILITY_THRESHOLD = 0.1;
  private readonly RECOVERY_FATIGUE_THRESHOLD = 3;
  private readonly STAGNATION_SESSIONS = 5;

  constructor(
    private eventBus: EventBus,
    private trustScorer: TrustScorer,
    private evolutionManager: EvolutionTriggerManager,
    private agentMemory: AgentMemory,
    private stagnationDetector: StagnationDetector
  ) {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Trust events
    this.eventBus.on('trust:signal', this.handleTrustSignal.bind(this));
    this.eventBus.on('trust:warning', this.handleTrustWarning.bind(this));
    this.eventBus.on('trust:violation', this.handleTrustViolation.bind(this));

    // Evolution events
    this.eventBus.on('evolution:triggered', this.handleEvolutionTrigger.bind(this));
    this.eventBus.on('evolution:completed', this.handleEvolutionComplete.bind(this));

    // Recovery events
    this.eventBus.on('recovery:attempted', this.handleRecoveryAttempt.bind(this));
    this.eventBus.on('recovery:succeeded', this.handleRecoverySuccess.bind(this));
    this.eventBus.on('recovery:failed', this.handleRecoveryFailure.bind(this));
  }

  private async handleTrustSignal(event: any): Promise<void> {
    const { component, score } = event.data;
    const record = await this.agentMemory.getAgentRecord(component);
    
    // Update trust metrics
    const trustDelta = score - (record?.avgTrustDelta || 1.0);
    await this.agentMemory.updateTrustMetrics(component, {
      avgTrustDelta: trustDelta,
      trustVolatility: this.calculateTrustVolatility(component, trustDelta)
    });

    // Check for stagnation
    if (await this.stagnationDetector.checkStagnation(component)) {
      await this.handleStagnation(component);
    }
  }

  private async handleTrustWarning(event: any): Promise<void> {
    const { component, score } = event.data;
    await this.agentMemory.incrementRecoveryAttempts(component);
    
    // Check for recovery fatigue
    const record = await this.agentMemory.getAgentRecord(component);
    if (record && record.recoveryAttempts >= this.RECOVERY_FATIGUE_THRESHOLD) {
      await this.handleRecoveryFatigue(component);
    }
  }

  private async handleTrustViolation(event: any): Promise<void> {
    const { component } = event.data;
    await this.agentMemory.incrementRecoveryAttempts(component);
    
    // Check for pattern substitution
    const record = await this.agentMemory.getAgentRecord(component);
    if (record && record.patternSubstitutions > 0) {
      await this.handlePatternSubstitution(component);
    }
  }

  private async handleEvolutionTrigger(event: any): Promise<void> {
    const { agentId, triggerType } = event.data;
    await this.agentMemory.recordEvolutionTrigger(agentId, triggerType);
    
    // Check for trigger repetition
    const record = await this.agentMemory.getAgentRecord(agentId);
    if (record && this.hasRepeatedTriggers(record)) {
      await this.handleTriggerRepetition(agentId);
    }
  }

  private async handleEvolutionComplete(event: any): Promise<void> {
    const { agentId, success } = event.data;
    await this.agentMemory.updateEvolutionStatus(agentId, success);
  }

  private async handleRecoveryAttempt(event: any): Promise<void> {
    const { agentId } = event.data;
    await this.agentMemory.incrementRecoveryAttempts(agentId);
  }

  private async handleRecoverySuccess(event: any): Promise<void> {
    const { agentId } = event.data;
    await this.agentMemory.resetRecoveryAttempts(agentId);
  }

  private async handleRecoveryFailure(event: any): Promise<void> {
    const { agentId } = event.data;
    await this.agentMemory.incrementPatternSubstitutions(agentId);
  }

  private async handleStagnation(agentId: string): Promise<void> {
    const record = await this.agentMemory.getAgentRecord(agentId);
    if (!record) return;

    if (!record.stagnantSince) {
      await this.agentMemory.markStagnant(agentId);
      this.eventBus.emit('oversight:stagnation', {
        agentId,
        metrics: record
      });
    }
  }

  private async handleRecoveryFatigue(agentId: string): Promise<void> {
    this.eventBus.emit('oversight:recovery-fatigue', {
      agentId,
      attempts: (await this.agentMemory.getAgentRecord(agentId))?.recoveryAttempts
    });
  }

  private async handlePatternSubstitution(agentId: string): Promise<void> {
    this.eventBus.emit('oversight:pattern-substitution', {
      agentId,
      substitutions: (await this.agentMemory.getAgentRecord(agentId))?.patternSubstitutions
    });
  }

  private async handleTriggerRepetition(agentId: string): Promise<void> {
    this.eventBus.emit('oversight:trigger-repetition', {
      agentId,
      triggers: (await this.agentMemory.getAgentRecord(agentId))?.recentTriggers
    });
  }

  private calculateTrustVolatility(agentId: string, newDelta: number): number {
    // Implementation will be added in agent-memory.ts
    return 0;
  }

  private hasRepeatedTriggers(record: AgentOversightRecord): boolean {
    if (!record.recentTriggers || record.recentTriggers.length < this.RECOVERY_FATIGUE_THRESHOLD) {
      return false;
    }

    const lastTrigger = record.recentTriggers[record.recentTriggers.length - 1];
    const repeatedCount = record.recentTriggers.filter(t => 
      t.type === lastTrigger.type && 
      t.success === lastTrigger.success
    ).length;

    return repeatedCount >= this.RECOVERY_FATIGUE_THRESHOLD;
  }

  public async getOversightMetrics(): Promise<OversightMetrics> {
    const records = await this.agentMemory.getAllRecords();
    const systemWide = this.calculateSystemWideMetrics(records);

    return {
      timestamp: new Date().toISOString(),
      agents: records,
      systemWide
    };
  }

  private calculateSystemWideMetrics(records: Record<string, AgentOversightRecord>) {
    const agentCount = Object.keys(records).length;
    if (agentCount === 0) {
      return {
        totalRecoveryAttempts: 0,
        avgTrustVolatility: 0,
        evolutionTriggerRate: 0
      };
    }

    const totalRecoveryAttempts = Object.values(records)
      .reduce((sum, r) => sum + r.recoveryAttempts, 0);

    const avgTrustVolatility = Object.values(records)
      .reduce((sum, r) => sum + r.trustVolatility, 0) / agentCount;

    const evolutionTriggerRate = Object.values(records)
      .reduce((sum, r) => sum + (r.recentTriggers?.length || 0), 0) / agentCount;

    return {
      totalRecoveryAttempts,
      avgTrustVolatility,
      evolutionTriggerRate
    };
  }
} 