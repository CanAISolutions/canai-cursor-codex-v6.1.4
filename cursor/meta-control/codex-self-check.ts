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

interface CodexValidationResult {
  isValid: boolean;
  corrections: {
    type: 'prompt' | 'response' | 'behavior';
    severity: 'low' | 'medium' | 'high';
    details: Record<string, any>;
  }[];
}

export class CodexSelfCheckBlock {
  private readonly eventBus: EventBus;
  private readonly agentMemory: AgentMemory;
  private readonly metricsTracker: MetaControlMetricsTracker;
  private readonly codexThresholds: {
    prompt: number;
    response: number;
    behavior: number;
  };

  constructor(
    eventBus: EventBus,
    agentMemory: AgentMemory,
    metricsTracker: MetaControlMetricsTracker
  ) {
    this.eventBus = eventBus;
    this.agentMemory = agentMemory;
    this.metricsTracker = metricsTracker;
    this.codexThresholds = {
      prompt: 0.8,
      response: 0.8,
      behavior: 0.8
    };

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
    await this.validateAgentBehavior(data.agentId, data.execution);
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
          agentId: agent.id,
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

  private async validateAgentBehavior(agentId: string, execution: any): Promise<void> {
    const validationResult = await this.validateAgainstCodex(execution);
    
    if (!validationResult.isValid) {
      await this.applyCorrections(agentId, validationResult.corrections);
    }

    await this.metricsTracker.trackMetric('codex:validation', validationResult.isValid ? 1 : 0, {
      source: 'codex-self-check',
      agentId,
      result: validationResult
    });
  }

  private async validateAgainstCodex(execution: any): Promise<CodexValidationResult> {
    const corrections = [];
    let isValid = true;

    // Validate prompt alignment
    const promptScore = await this.calculatePromptAlignment(execution.prompt);
    if (promptScore < this.codexThresholds.prompt) {
      isValid = false;
      corrections.push({
        type: 'prompt',
        severity: this.getSeverity(promptScore),
        details: { score: promptScore, threshold: this.codexThresholds.prompt }
      });
    }

    // Validate response alignment
    const responseScore = await this.calculateResponseAlignment(execution.response);
    if (responseScore < this.codexThresholds.response) {
      isValid = false;
      corrections.push({
        type: 'response',
        severity: this.getSeverity(responseScore),
        details: { score: responseScore, threshold: this.codexThresholds.response }
      });
    }

    // Validate behavior alignment
    const behaviorScore = await this.calculateBehaviorAlignment(execution.behavior);
    if (behaviorScore < this.codexThresholds.behavior) {
      isValid = false;
      corrections.push({
        type: 'behavior',
        severity: this.getSeverity(behaviorScore),
        details: { score: behaviorScore, threshold: this.codexThresholds.behavior }
      });
    }

    return { isValid, corrections };
  }

  private async applyCorrections(agentId: string, corrections: CodexValidationResult['corrections']): Promise<void> {
    for (const correction of corrections) {
      await this.eventBus.emit('codex:correction:applied', {
        agentId,
        correction,
        timestamp: Date.now()
      });

      await this.metricsTracker.trackMetric('codex:correction', 1, {
        source: 'codex-self-check',
        agentId,
        correction
      });
    }
  }

  private getSeverity(score: number): 'low' | 'medium' | 'high' {
    if (score < 0.6) return 'high';
    if (score < 0.7) return 'medium';
    return 'low';
  }

  private calculateVolatility(history: number[]): number {
    if (history.length < 2) return 0;
    const changes = history.slice(1).map((score, i) => Math.abs(score - history[i]));
    return changes.reduce((a, b) => a + b, 0) / changes.length;
  }

  private async getCurrentCPU(): Promise<number> {
    // Implementation for getting current CPU usage
    return 0.5;
  }

  private async getCurrentMemory(): Promise<number> {
    // Implementation for getting current memory usage
    return 0.6;
  }

  private async getActiveAgentCount(): Promise<number> {
    const agents = await this.agentMemory.getAllAgents();
    return agents.filter(a => a.status === 'active').length;
  }

  private async calculateAlignmentScore(): Promise<number> {
    // Implementation for calculating overall Codex alignment score
    return 0.85;
  }

  private async calculateDeviations(): Promise<AlignmentCheck['deviations']> {
    // Implementation for calculating deviations from Codex standards
    return {
      prompt: 0.1,
      response: 0.15,
      behavior: 0.1
    };
  }

  private async calculatePromptAlignment(prompt: string): Promise<number> {
    // Implementation for calculating prompt alignment with Codex
    return 0.85;
  }

  private async calculateResponseAlignment(response: string): Promise<number> {
    // Implementation for calculating response alignment with Codex
    return 0.9;
  }

  private async calculateBehaviorAlignment(behavior: any): Promise<number> {
    // Implementation for calculating behavior alignment with Codex
    return 0.95;
  }

  public validateTrustScore(check: TrustCheck): boolean {
    const isValid = (
      check.currentScore >= check.threshold &&
      check.volatility < 0.2 &&
      check.history.slice(-5).every(score => score >= check.threshold)
    );

    if (!isValid) {
      this.eventBus.emit('trust:violation', {
        type: 'threshold',
        value: check.currentScore,
        threshold: check.threshold
      });
    }

    return isValid;
  }

  public assessTrustImpact(impact: TrustImpact): boolean {
    const isValid = (
      impact.after >= impact.before &&
      Math.abs(impact.delta) <= impact.threshold
    );

    if (!isValid) {
      this.eventBus.emit('trust:violation', {
        type: 'impact',
        value: impact.delta,
        threshold: impact.threshold
      });
    }

    return isValid;
  }

  public validateResourceUtilization(check: ResourceCheck): boolean {
    const isValid = (
      check.cpu <= check.thresholds.cpu &&
      check.memory <= check.thresholds.memory &&
      check.activeAgents <= check.thresholds.agents
    );

    if (!isValid) {
      this.eventBus.emit('resource:warning', {
        resource: 'system',
        current: Math.max(check.cpu, check.memory),
        threshold: Math.min(check.thresholds.cpu, check.thresholds.memory)
      });
    }

    return isValid;
  }

  public assessResourceImpact(impact: ResourceImpact): boolean {
    const cpuDelta = impact.after.cpu - impact.before.cpu;
    const memoryDelta = impact.after.memory - impact.before.memory;
    
    const isValid = (
      cpuDelta <= impact.maxImpact &&
      memoryDelta <= impact.maxImpact
    );

    if (!isValid) {
      this.eventBus.emit('resource:degradation', {
        action: 'impact-assessment',
        impact: {
          before: impact.before,
          after: impact.after
        }
      });
    }

    return isValid;
  }

  public validateAlignment(check: AlignmentCheck): boolean {
    const isValid = (
      check.score >= check.threshold &&
      check.deviations.prompt < 0.2 &&
      check.deviations.response < 0.2 &&
      check.deviations.behavior < 0.2
    );

    if (!isValid) {
      this.eventBus.emit('alignment:deviation', {
        type: 'system',
        severity: 'high',
        details: {
          expected: check.threshold,
          actual: check.score,
          deviations: check.deviations
        }
      });
    }

    return isValid;
  }

  public assessCorrectionImpact(impact: CorrectionImpact): boolean {
    const scoreDelta = impact.after.score - impact.before.score;
    const deviationDelta = {
      prompt: impact.after.deviations.prompt - impact.before.deviations.prompt,
      response: impact.after.deviations.response - impact.before.deviations.response,
      behavior: impact.after.deviations.behavior - impact.before.deviations.behavior
    };

    const isValid = (
      scoreDelta >= 0 &&
      Math.abs(deviationDelta.prompt) <= impact.maxDisruption &&
      Math.abs(deviationDelta.response) <= impact.maxDisruption &&
      Math.abs(deviationDelta.behavior) <= impact.maxDisruption
    );

    if (!isValid) {
      this.eventBus.emit('alignment:deviation', {
        type: 'correction',
        severity: 'high',
        details: {
          expected: impact.maxDisruption,
          actual: Math.max(
            Math.abs(deviationDelta.prompt),
            Math.abs(deviationDelta.response),
            Math.abs(deviationDelta.behavior)
          )
        }
      });
    }

    return isValid;
  }

  public validateEvolutionTrigger(check: EvolutionCheck): boolean {
    const isValid = (
      check.confidence >= 0.8 &&
      check.impact.trust >= 0 &&
      check.impact.resources <= 0.3 &&
      check.impact.alignment >= 0 &&
      check.history.success / (check.history.success + check.history.failures) >= 0.7
    );

    if (!isValid) {
      this.eventBus.emit('evolution:triggered', {
        trigger: check.trigger,
        confidence: check.confidence,
        impact: check.impact,
        success: false
      });
    }

    return isValid;
  }

  public assessEvolutionImpact(impact: EvolutionImpact): boolean {
    const isValid = (
      impact.after.trust >= impact.before.trust &&
      impact.after.trust >= impact.thresholds.trust &&
      impact.after.resources <= impact.thresholds.resources &&
      impact.after.alignment >= impact.thresholds.alignment
    );

    if (!isValid) {
      this.eventBus.emit('evolution:completed', {
        success: false,
        impact: impact.after,
        reason: 'impact-threshold-violation'
      });
    }

    return isValid;
  }

  public validateRecoveryAttempt(check: RecoveryCheck): boolean {
    const now = Date.now();
    const isValid = (
      check.attempts < check.maxAttempts &&
      now - check.lastAttempt >= check.cooldown &&
      check.successRate >= 0.5
    );

    if (!isValid) {
      this.eventBus.emit('system:recovery-started', {
        trigger: 'recovery-validation',
        context: {
          attempts: check.attempts,
          maxAttempts: check.maxAttempts,
          cooldown: check.cooldown,
          successRate: check.successRate
        }
      });
    }

    return isValid;
  }

  public assessRecoveryImpact(impact: RecoveryImpact): boolean {
    const trustDelta = impact.after.trust - impact.before.trust;
    const resourceDelta = impact.after.resources - impact.before.resources;
    const alignmentDelta = impact.after.alignment - impact.before.alignment;

    const isValid = (
      trustDelta >= 0 &&
      Math.abs(resourceDelta) <= impact.maxImpact &&
      alignmentDelta >= 0
    );

    if (!isValid) {
      this.eventBus.emit('system:recovery-completed', {
        success: false,
        impact: impact.after,
        reason: 'impact-threshold-violation'
      });
    }

    return isValid;
  }

  public async executeCheck(checkType: string, check: any): Promise<boolean> {
    try {
      let isValid = false;

      switch (checkType) {
        case 'trust':
          isValid = this.validateTrustScore(check);
          break;
        case 'trust-impact':
          isValid = this.assessTrustImpact(check);
          break;
        case 'resource':
          isValid = this.validateResourceUtilization(check);
          break;
        case 'resource-impact':
          isValid = this.assessResourceImpact(check);
          break;
        case 'alignment':
          isValid = this.validateAlignment(check);
          break;
        case 'correction-impact':
          isValid = this.assessCorrectionImpact(check);
          break;
        case 'evolution':
          isValid = this.validateEvolutionTrigger(check);
          break;
        case 'evolution-impact':
          isValid = this.assessEvolutionImpact(check);
          break;
        case 'recovery':
          isValid = this.validateRecoveryAttempt(check);
          break;
        case 'recovery-impact':
          isValid = this.assessRecoveryImpact(check);
          break;
        default:
          throw new Error(`Unknown check type: ${checkType}`);
      }

      await this.metricsTracker.trackMetric('self-check', isValid ? 1 : 0, {
        source: 'codex-self-check',
        checkType,
        check
      });

      return isValid;
    } catch (error) {
      console.error(`Error executing ${checkType} check:`, error);
      this.eventBus.emit('self-check:error', {
        checkType,
        error,
        check
      });
      return false;
    }
  }
} 