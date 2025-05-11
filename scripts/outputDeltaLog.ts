/**
 * @file scripts/outputDeltaLog.ts
 * @description Output delta logger for tracking changes in prompt outputs
 * @version 6.2.1
 */

import { EventBus } from '../event-bus/eventBus';
import { TrustScoreCalculator } from '../cursor/validators/trust-score';
import { FidelityTracker } from '../cursor/memory/fidelity-tracker';
import { TrueMargin } from '../lib/true-margin';

interface OutputDelta {
  promptId: string;
  timestamp: number;
  previousOutput: string;
  currentOutput: string;
  metrics: {
    trustScore: number;
    memoryFidelity: number;
    emotionalResonance: number;
    costDelta: number;
    marginImpact: number;
  };
}

interface FidelityMetrics {
  consistency: number;
  accuracy: number;
  completeness: number;
  relevance: number;
}

export class OutputDeltaLogger {
  private eventBus: EventBus;
  private trustCalculator: TrustScoreCalculator;
  private fidelityTracker: FidelityTracker;
  private trueMargin: TrueMargin;
  private deltas: Map<string, OutputDelta[]>;
  private readonly MAX_DELTAS = 1000;

  constructor() {
    this.eventBus = EventBus.getInstance();
    this.trustCalculator = new TrustScoreCalculator();
    this.fidelityTracker = new FidelityTracker();
    this.trueMargin = new TrueMargin();
    this.deltas = new Map();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.eventBus.on('prompt.output.change', this.handleOutputChange.bind(this));
    this.eventBus.on('prompt.optimization', this.handleOptimization.bind(this));
    this.eventBus.on('cost.update', this.handleCostUpdate.bind(this));
  }

  public async logDelta(promptId: string, previousOutput: string, currentOutput: string): Promise<void> {
    const delta: OutputDelta = {
      promptId,
      timestamp: Date.now(),
      previousOutput,
      currentOutput,
      metrics: await this.calculateMetrics(previousOutput, currentOutput)
    };

    if (!this.deltas.has(promptId)) {
      this.deltas.set(promptId, []);
    }

    const promptDeltas = this.deltas.get(promptId)!;
    promptDeltas.push(delta);

    if (promptDeltas.length > this.MAX_DELTAS) {
      promptDeltas.shift();
    }

    await this.eventBus.emit('delta.logged', {
      promptId,
      delta
    });
  }

  private async calculateMetrics(previousOutput: string, currentOutput: string): Promise<OutputDelta['metrics']> {
    const trustScore = await this.trustCalculator.calculateTrustScore();
    const memoryFidelity = await this.calculateMemoryFidelity(previousOutput, currentOutput);
    const emotionalResonance = await this.calculateEmotionalResonance(previousOutput, currentOutput);
    const costDelta = await this.trueMargin.calculateCostDelta(previousOutput, currentOutput);
    const marginImpact = (await this.trueMargin.calculateMarginImpact(costDelta)).marginDelta;

    return {
      trustScore,
      memoryFidelity,
      emotionalResonance,
      costDelta,
      marginImpact
    };
  }

  private async calculateMemoryFidelity(previousOutput: string, currentOutput: string): Promise<number> {
    const key = `output_${Date.now()}`;
    await this.fidelityTracker.trackMemory(key, previousOutput, { source: 'previous', confidence: 1.0 });
    await this.fidelityTracker.trackMemory(key, currentOutput, { source: 'current', confidence: 1.0 });
    const metrics = await this.fidelityTracker.calculateFidelity(key);
    return Object.values(metrics as FidelityMetrics).reduce((sum: number, value: number) => sum + value, 0) / 4;
  }

  private async calculateEmotionalResonance(previousOutput: string, currentOutput: string): Promise<number> {
    // Implementation would use actual emotional analysis
    return 0.8;
  }

  private async handleOutputChange(data: any): Promise<void> {
    const { promptId, previousOutput, currentOutput } = data;
    await this.logDelta(promptId, previousOutput, currentOutput);
  }

  private async handleOptimization(data: any): Promise<void> {
    const { promptId, previousOutput, currentOutput } = data;
    await this.logDelta(promptId, previousOutput, currentOutput);
  }

  private async handleCostUpdate(data: any): Promise<void> {
    const { promptId, cost } = data;
    // Implementation would update cost metrics for the prompt
  }

  public async getDeltas(promptId: string): Promise<OutputDelta[]> {
    return this.deltas.get(promptId) || [];
  }

  public async analyzeChanges(promptId: string): Promise<any> {
    const deltas = await this.getDeltas(promptId);
    if (deltas.length < 2) return null;

    const metrics = deltas.map(d => d.metrics);
    const trends = {
      trustScore: this.calculateTrend(metrics.map(m => m.trustScore)),
      memoryFidelity: this.calculateTrend(metrics.map(m => m.memoryFidelity)),
      emotionalResonance: this.calculateTrend(metrics.map(m => m.emotionalResonance)),
      costDelta: this.calculateTrend(metrics.map(m => m.costDelta)),
      marginImpact: this.calculateTrend(metrics.map(m => m.marginImpact))
    };

    return {
      promptId,
      totalChanges: deltas.length,
      trends,
      latestMetrics: metrics[metrics.length - 1]
    };
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    const first = values[0];
    const last = values[values.length - 1];
    return (last - first) / first;
  }
} 