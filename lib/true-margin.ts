/**
 * @file lib/true-margin.ts
 * @description TrueMargin integration for cost mapping and profitability analysis
 * @version 6.2.1
 */

import { EventBus } from '../event-bus/eventBus';
import { TrustScoreCalculator } from '../cursor/validators/trust-score';

interface CostMetrics {
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
  margin: number;
  roi: number;
}

interface MarginImpact {
  costDelta: number;
  marginDelta: number;
  roiDelta: number;
  confidence: number;
}

export class TrueMargin {
  private eventBus: EventBus;
  private trustCalculator: TrustScoreCalculator;
  private readonly TOKEN_COST_RATE = 0.0001; // Cost per token
  private readonly MIN_MARGIN = 0.3; // 30% minimum margin
  private readonly TARGET_ROI = 2.0; // 200% target ROI

  constructor() {
    this.eventBus = new EventBus();
    this.trustCalculator = new TrustScoreCalculator();
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.eventBus.on('prompt.cost', this.handleCostUpdate.bind(this));
    this.eventBus.on('margin.threshold', this.handleMarginThreshold.bind(this));
  }

  async calculateCostDelta(previousOutput: string, currentOutput: string): Promise<number> {
    const previousCost = await this.calculateCost(previousOutput);
    const currentCost = await this.calculateCost(currentOutput);
    return currentCost.totalCost - previousCost.totalCost;
  }

  async calculateMarginImpact(costDelta: number): Promise<MarginImpact> {
    const currentMetrics = await this.getCurrentMetrics();
    const projectedMetrics = await this.projectMetrics(costDelta);

    return {
      costDelta,
      marginDelta: projectedMetrics.margin - currentMetrics.margin,
      roiDelta: projectedMetrics.roi - currentMetrics.roi,
      confidence: await this.calculateConfidence(projectedMetrics)
    };
  }

  private async calculateCost(output: string): Promise<CostMetrics> {
    const inputTokens = this.countTokens(output);
    const outputTokens = this.estimateOutputTokens(output);
    const totalCost = (inputTokens + outputTokens) * this.TOKEN_COST_RATE;
    const margin = await this.calculateMargin(totalCost);
    const roi = await this.calculateROI(totalCost, margin);

    return {
      inputTokens,
      outputTokens,
      totalCost,
      margin,
      roi
    };
  }

  private async calculateMargin(cost: number): Promise<number> {
    const trustScore = await this.trustCalculator.calculateTrustScore();
    const baseMargin = this.MIN_MARGIN;
    const trustBonus = (trustScore - 4.2) * 0.1; // 10% bonus per point above threshold
    return Math.max(baseMargin, baseMargin + trustBonus);
  }

  private async calculateROI(cost: number, margin: number): Promise<number> {
    const revenue = cost / (1 - margin);
    return (revenue - cost) / cost;
  }

  private async calculateConfidence(metrics: CostMetrics): Promise<number> {
    const trustScore = await this.trustCalculator.calculateTrustScore();
    const marginConfidence = metrics.margin >= this.MIN_MARGIN ? 1 : 0.5;
    const roiConfidence = metrics.roi >= this.TARGET_ROI ? 1 : 0.5;
    const trustConfidence = trustScore >= 4.2 ? 1 : 0.5;

    return (marginConfidence + roiConfidence + trustConfidence) / 3;
  }

  private async getCurrentMetrics(): Promise<CostMetrics> {
    // Implementation would fetch current metrics from storage
    return {
      inputTokens: 0,
      outputTokens: 0,
      totalCost: 0,
      margin: this.MIN_MARGIN,
      roi: this.TARGET_ROI
    };
  }

  private async projectMetrics(costDelta: number): Promise<CostMetrics> {
    const current = await this.getCurrentMetrics();
    const projectedCost = current.totalCost + costDelta;
    const projectedMargin = await this.calculateMargin(projectedCost);
    const projectedROI = await this.calculateROI(projectedCost, projectedMargin);

    return {
      ...current,
      totalCost: projectedCost,
      margin: projectedMargin,
      roi: projectedROI
    };
  }

  private countTokens(text: string): number {
    // Implementation would use actual tokenizer
    return text.split(/\s+/).length;
  }

  private estimateOutputTokens(input: string): number {
    // Implementation would use actual estimation model
    return Math.ceil(input.length * 1.5);
  }

  private async handleCostUpdate(data: any): Promise<void> {
    const { promptId, cost } = data;
    const metrics = await this.calculateCost(cost);
    
    await this.eventBus.emit('margin.update', {
      promptId,
      metrics
    });
  }

  private async handleMarginThreshold(data: any): Promise<void> {
    const { promptId, margin } = data;
    
    if (margin < this.MIN_MARGIN) {
      await this.eventBus.emit('margin.alert', {
        promptId,
        threshold: this.MIN_MARGIN,
        current: margin
      });
    }
  }
} 