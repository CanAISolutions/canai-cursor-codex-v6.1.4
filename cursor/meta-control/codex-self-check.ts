/**
 * meta-control/codex-self-check.ts
 * 
 * Purpose:
 * Implements self-check blocks for ensuring system health, trust safety, and Codex alignment.
 * These checks are executed at various points in the system lifecycle.
 */

import { EventBus } from '../utils/event-bus';
import { AgentMemory } from '../agent-oversight/agent-memory';
import { MetaControlMetricsTracker } from './metrics-tracker';
import { CodexValidation } from './codex-validation';

interface TrustCheck {
  currentScore: number;
  threshold: number;
  volatility: number;
  history: number[];
}

interface TrustImpact {
  before: number;
  after: number;
  delta: number;
  threshold: number;
}

interface ResourceCheck {
  cpu: number;
  memory: number;
  activeAgents: number;
  thresholds: {
    cpu: number;
    memory: number;
    agents: number;
  };
}

interface ResourceImpact {
  before: ResourceCheck;
  after: ResourceCheck;
  maxImpact: number;
}

interface AlignmentCheck {
  score: number;
  threshold: number;
  deviations: {
    prompt: number;
    response: number;
    behavior: number;
  };
}

interface CorrectionImpact {
  before: AlignmentCheck;
  after: AlignmentCheck;
  maxDisruption: number;
}

interface EvolutionCheck {
  trigger: string;
  confidence: number;
  impact: {
    trust: number;
    resources: number;
    alignment: number;
  };
  history: {
    success: number;
    failures: number;
    lastAttempt: number;
  };
}

interface EvolutionImpact {
  before: {
    trust: number;
    resources: number;
    alignment: number;
  };
  after: {
    trust: number;
    resources: number;
    alignment: number;
  };
  thresholds: {
    trust: number;
    resources: number;
    alignment: number;
  };
}

interface RecoveryCheck {
  attempts: number;
  maxAttempts: number;
  cooldown: number;
  lastAttempt: number;
  successRate: number;
}

interface RecoveryImpact {
  before: {
    trust: number;
    resources: number;
    alignment: number;
  };
  after: {
    trust: number;
    resources: number;
    alignment: number;
  };
  maxImpact: number;
}

interface AgentOversightRecord {
  agentName: string;
  trustScore: number;
  trustHistory: number[];
  failureRate: number;
  lastUsed: number;
  status: 'active' | 'degraded';
  metadata: Record<string, any>;
  avgTrustDelta: number;
  trustVolatility: number;
  sessionsTracked: number;
  recoveryAttempts: number;
  recentTriggers: string[];
}

type CorrectionType = 'prompt' | 'response' | 'behavior' | 'trust' | 'output';
type CorrectionSeverity = 'low' | 'medium' | 'high';

interface Correction {
  type: CorrectionType;
  severity: CorrectionSeverity;
  description: string;
  context: Record<string, any>;
}

interface CodexValidationResult {
  isValid: boolean;
  corrections: Correction[];
  metrics?: Record<string, number>;
}

export class CodexSelfCheckBlock {
  private readonly eventBus: EventBus;
  private readonly agentMemory: AgentMemory;
  private readonly metricsTracker: MetaControlMetricsTracker;
  private readonly codexValidation: CodexValidation;

  constructor(
    eventBus: EventBus,
    agentMemory: AgentMemory,
    metricsTracker: MetaControlMetricsTracker
  ) {
    this.eventBus = eventBus;
    this.agentMemory = agentMemory;
    this.metricsTracker = metricsTracker;
    this.codexValidation = new CodexValidation(eventBus, agentMemory, metricsTracker);

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.eventBus.on('system:pulse', this.handleSystemPulse.bind(this));
    this.eventBus.on('agent:execution-review', this.handleAgentExecutionReview.bind(this));
  }

  private async handleSystemPulse(): Promise<void> {
    await this.executeSystemChecks();
  }

  private async handleAgentExecutionReview(data: any): Promise<void> {
    const result = await this.codexValidation.validateAgentBehavior(data.agentId, data.execution);
    if (!result.isValid) {
      await this.codexValidation.applyCorrections(data.agentId, result.corrections);
    }
  }

  private async executeSystemChecks(): Promise<void> {
    const checks = [
      this.validateTrustScores(),
      this.validateResourceUtilization(),
      this.validateCodexAlignment()
    ];

    await Promise.all(checks);
  }

  private async validateTrustScores(): Promise<void> {
    const agents = await this.agentMemory.getAllAgents();
    for (const agent of agents) {
      const check: TrustCheck = {
        currentScore: agent.trustScore,
        threshold: 0.8,
        volatility: this.calculateVolatility(agent.trustHistory),
        history: agent.trustHistory
      };

      const isValid = this.validateTrustScore(check);
      if (!isValid) {
        await this.metricsTracker.trackMetric('trust:violation', 1, {
          source: 'codex-self-check',
          agentId: agent.agentName,
          check
        });
      }
    }
  }

  private async validateResourceUtilization(): Promise<void> {
    const check: ResourceCheck = {
      cpu: await this.getCurrentCPU(),
      memory: await this.getCurrentMemory(),
      activeAgents: await this.getActiveAgentCount(),
      thresholds: {
        cpu: 0.8,
        memory: 0.8,
        agents: 10
      }
    };

    const isValid = this.validateResourceUtilization(check);
    if (!isValid) {
      await this.metricsTracker.trackMetric('resource:warning', 1, {
        source: 'codex-self-check',
        check
      });
    }
  }

  private async validateCodexAlignment(): Promise<void> {
    const check: AlignmentCheck = {
      score: await this.calculateAlignmentScore(),
      threshold: 0.8,
      deviations: await this.calculateDeviations()
    };

    const isValid = this.validateAlignment(check);
    if (!isValid) {
      await this.metricsTracker.trackMetric('alignment:deviation', 1, {
        source: 'codex-self-check',
        check
      });
    }
  }

  private calculateVolatility(history: number[]): number {
    if (history.length < 2) return 0;
    const deltas = history.slice(1).map((val, i) => Math.abs(val - history[i]));
    return deltas.reduce((sum, delta) => sum + delta, 0) / deltas.length;
  }

  private async getCurrentCPU(): Promise<number> {
    // Mock implementation for now
    return 0.5;
  }

  private async getCurrentMemory(): Promise<number> {
    // Mock implementation for now
    return 0.4;
  }

  private async getActiveAgentCount(): Promise<number> {
    const agents = await this.agentMemory.getActiveAgents();
    return agents.length;
  }

  private async calculateAlignmentScore(): Promise<number> {
    // Mock implementation for now
    return 0.85;
  }

  private async calculateDeviations(): Promise<AlignmentCheck['deviations']> {
    // Mock implementation for now
    return {
      prompt: 0.1,
      response: 0.1,
      behavior: 0.1
    };
  }

  public validateTrustScore(check: TrustCheck): boolean {
    return (
      check.currentScore >= check.threshold &&
      check.volatility <= 0.2
    );
  }

  public validateResourceUtilization(check: ResourceCheck): boolean {
    return (
      check.cpu <= check.thresholds.cpu &&
      check.memory <= check.thresholds.memory &&
      check.activeAgents <= check.thresholds.agents
    );
  }

  public validateAlignment(check: AlignmentCheck): boolean {
    return (
      check.score >= check.threshold &&
      check.deviations.prompt <= 0.2 &&
      check.deviations.response <= 0.2 &&
      check.deviations.behavior <= 0.2
    );
  }
} 