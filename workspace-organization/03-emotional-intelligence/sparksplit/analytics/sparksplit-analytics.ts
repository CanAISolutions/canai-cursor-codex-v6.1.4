/**
 * SparkSplit Analytics Engine
 * Tracks trust transparency metrics, competitive advantage, and user education impact
 * Integrates with SparkSplit v7.2.0 revolutionary trust engine
 */

import { EventBus } from '../cursor/utils/event-bus';
import { PromptLogs } from '../cursor/types/prompt-logs';

export interface SparkSplitMetrics {
  sessionId: string;
  timestamp: number;
  promptType: string;
  comparisonId: string;
  trustDelta: number;
  userSelection: 'sterile' | 'canai' | 'both' | 'neither' | 'skip' | null;
  timeToSelection: number | null;
  emotionalCompass: {
    aweScore: number | null;
    ownershipScore: number | null;
    wonderScore: number | null;
    calmScore: number | null;
    powerScore: number | null;
  };
  competitiveAdvantage: number | null;
  trustTransparencyScore: number | null;
  emotionalEducationScore: number | null;
  wouldRefer: boolean | null;
  sharedOutput: boolean;
  circuitBreakerTriggered: boolean;
}

export interface SparkSplitAnalytics {
  current: SparkSplitMetrics;
  aggregates: {
    canaiSelectionRate: number;
    averageTrustDelta: number;
    averageTimeToSelection: number;
    referralRate: number;
    viralSharingRate: number;
    circuitBreakerRate: number;
  };
  competitiveMetrics: {
    trustTransparencyAdvantage: number;
    userEducationImpact: number;
    marketDifferentiation: number;
  };
}

export interface SparkSplitTrends {
  trustDeltaTrend: number[];
  selectionRateTrend: number[];
  competitiveAdvantageTrend: number[];
  userEducationTrend: number[];
}

export class SparkSplitAnalyticsEngine {
  private eventBus: EventBus;
  private sparkSplitMetrics: Map<string, SparkSplitMetrics>;
  private aggregatedData: Map<string, SparkSplitAnalytics>;
  private trendData: Map<string, SparkSplitTrends>;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.sparkSplitMetrics = new Map();
    this.aggregatedData = new Map();
    this.trendData = new Map();
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    this.eventBus.on('SPARKSPLIT_COMPARISON_GENERATED', this.handleComparisonGenerated.bind(this));
    this.eventBus.on('SPARKSPLIT_USER_SELECTION', this.handleUserSelection.bind(this));
    this.eventBus.on('SPARKSPLIT_CIRCUIT_BREAKER', this.handleCircuitBreaker.bind(this));
    this.eventBus.on('SPARKSPLIT_FEEDBACK_RECEIVED', this.handleFeedbackReceived.bind(this));
  }

  private handleComparisonGenerated(
    sessionId: string,
    comparisonData: {
      promptType: string;
      comparisonId: string;
      trustDelta: number;
      emotionalCompass: any;
      competitiveAdvantage: number;
      trustTransparencyScore: number;
      emotionalEducationScore: number;
    }
  ): void {
    const metrics: SparkSplitMetrics = {
      sessionId,
      timestamp: Date.now(),
      promptType: comparisonData.promptType,
      comparisonId: comparisonData.comparisonId,
      trustDelta: comparisonData.trustDelta,
      userSelection: null,
      timeToSelection: null,
      emotionalCompass: {
        aweScore: comparisonData.emotionalCompass.aweScore || null,
        ownershipScore: comparisonData.emotionalCompass.ownershipScore || null,
        wonderScore: comparisonData.emotionalCompass.wonderScore || null,
        calmScore: comparisonData.emotionalCompass.calmScore || null,
        powerScore: comparisonData.emotionalCompass.powerScore || null,
      },
      competitiveAdvantage: comparisonData.competitiveAdvantage,
      trustTransparencyScore: comparisonData.trustTransparencyScore,
      emotionalEducationScore: comparisonData.emotionalEducationScore,
      wouldRefer: null,
      sharedOutput: false,
      circuitBreakerTriggered: false
    };

    this.sparkSplitMetrics.set(sessionId, metrics);
    this.updateAggregates(sessionId, metrics);
    this.updateTrends(sessionId, metrics);
    this.emitAnalyticsMeta(sessionId, metrics);
  }

  private handleUserSelection(
    sessionId: string,
    selectionData: {
      userSelection: 'sterile' | 'canai' | 'both' | 'neither' | 'skip';
      timeToSelection: number;
      wouldRefer?: boolean;
      sharedOutput?: boolean;
    }
  ): void {
    const metrics = this.sparkSplitMetrics.get(sessionId);
    if (metrics) {
      metrics.userSelection = selectionData.userSelection;
      metrics.timeToSelection = selectionData.timeToSelection;
      metrics.wouldRefer = selectionData.wouldRefer || null;
      metrics.sharedOutput = selectionData.sharedOutput || false;

      this.updateAggregates(sessionId, metrics);
      this.updateTrends(sessionId, metrics);
      this.emitAnalyticsMeta(sessionId, metrics);
    }
  }

  private handleCircuitBreaker(sessionId: string): void {
    const metrics = this.sparkSplitMetrics.get(sessionId);
    if (metrics) {
      metrics.circuitBreakerTriggered = true;
      this.updateAggregates(sessionId, metrics);
      this.emitAnalyticsMeta(sessionId, metrics);
    }
  }

  private handleFeedbackReceived(
    sessionId: string,
    feedbackData: {
      userFeedback: string;
      wouldRefer: boolean;
    }
  ): void {
    const metrics = this.sparkSplitMetrics.get(sessionId);
    if (metrics) {
      metrics.wouldRefer = feedbackData.wouldRefer;
      this.updateAggregates(sessionId, metrics);
      this.emitAnalyticsMeta(sessionId, metrics);
    }
  }

  private updateAggregates(sessionId: string, metrics: SparkSplitMetrics): void {
    const allMetrics = Array.from(this.sparkSplitMetrics.values());
    const completedSessions = allMetrics.filter(m => m.userSelection !== null);

    if (completedSessions.length === 0) return;

    const canaiSelections = completedSessions.filter(m => m.userSelection === 'canai').length;
    const referrals = completedSessions.filter(m => m.wouldRefer === true).length;
    const shares = completedSessions.filter(m => m.sharedOutput === true).length;
    const circuitBreakers = allMetrics.filter(m => m.circuitBreakerTriggered === true).length;

    const aggregates: SparkSplitAnalytics = {
      current: metrics,
      aggregates: {
        canaiSelectionRate: canaiSelections / completedSessions.length,
        averageTrustDelta: completedSessions.reduce((sum, m) => sum + m.trustDelta, 0) / completedSessions.length,
        averageTimeToSelection: this.calculateAverageTimeToSelection(completedSessions),
        referralRate: referrals / completedSessions.length,
        viralSharingRate: shares / completedSessions.length,
        circuitBreakerRate: circuitBreakers / allMetrics.length
      },
      competitiveMetrics: {
        trustTransparencyAdvantage: this.calculateTrustTransparencyAdvantage(completedSessions),
        userEducationImpact: this.calculateUserEducationImpact(completedSessions),
        marketDifferentiation: this.calculateMarketDifferentiation(completedSessions)
      }
    };

    this.aggregatedData.set(sessionId, aggregates);
  }

  private calculateAverageTimeToSelection(sessions: SparkSplitMetrics[]): number {
    const validTimes = sessions.filter(s => s.timeToSelection !== null);
    if (validTimes.length === 0) return 0;
    return validTimes.reduce((sum, s) => sum + (s.timeToSelection || 0), 0) / validTimes.length;
  }

  private calculateTrustTransparencyAdvantage(sessions: SparkSplitMetrics[]): number {
    const validScores = sessions.filter(s => s.trustTransparencyScore !== null);
    if (validScores.length === 0) return 0;
    return validScores.reduce((sum, s) => sum + (s.trustTransparencyScore || 0), 0) / validScores.length;
  }

  private calculateUserEducationImpact(sessions: SparkSplitMetrics[]): number {
    const validScores = sessions.filter(s => s.emotionalEducationScore !== null);
    if (validScores.length === 0) return 0;
    return validScores.reduce((sum, s) => sum + (s.emotionalEducationScore || 0), 0) / validScores.length;
  }

  private calculateMarketDifferentiation(sessions: SparkSplitMetrics[]): number {
    const validScores = sessions.filter(s => s.competitiveAdvantage !== null);
    if (validScores.length === 0) return 0;
    return validScores.reduce((sum, s) => sum + (s.competitiveAdvantage || 0), 0) / validScores.length;
  }

  private updateTrends(sessionId: string, metrics: SparkSplitMetrics): void {
    let trends = this.trendData.get(sessionId);
    if (!trends) {
      trends = {
        trustDeltaTrend: [],
        selectionRateTrend: [],
        competitiveAdvantageTrend: [],
        userEducationTrend: []
      };
      this.trendData.set(sessionId, trends);
    }

    trends.trustDeltaTrend.push(metrics.trustDelta);
    if (metrics.competitiveAdvantage !== null) {
      trends.competitiveAdvantageTrend.push(metrics.competitiveAdvantage);
    }
    if (metrics.emotionalEducationScore !== null) {
      trends.userEducationTrend.push(metrics.emotionalEducationScore);
    }

    // Keep only last 30 data points for trends
    if (trends.trustDeltaTrend.length > 30) {
      trends.trustDeltaTrend = trends.trustDeltaTrend.slice(-30);
    }
    if (trends.competitiveAdvantageTrend.length > 30) {
      trends.competitiveAdvantageTrend = trends.competitiveAdvantageTrend.slice(-30);
    }
    if (trends.userEducationTrend.length > 30) {
      trends.userEducationTrend = trends.userEducationTrend.slice(-30);
    }
  }

  private emitAnalyticsMeta(sessionId: string, metrics: SparkSplitMetrics): void {
    const analyticsMeta: PromptLogs['analyticsMeta'] = {
      sparkSplitMetrics: metrics,
      sparkSplitAggregates: this.aggregatedData.get(sessionId),
      sparkSplitTrends: this.trendData.get(sessionId)
    };

    this.eventBus.emit('ANALYTICS_META_UPDATED', analyticsMeta);
  }

  public getSparkSplitAnalytics(sessionId: string): SparkSplitAnalytics | null {
    return this.aggregatedData.get(sessionId) || null;
  }

  public getSparkSplitTrends(sessionId: string): SparkSplitTrends | null {
    return this.trendData.get(sessionId) || null;
  }

  public exportSparkSplitReport(): string {
    const allMetrics = Array.from(this.sparkSplitMetrics.values());
    const completedSessions = allMetrics.filter(m => m.userSelection !== null);

    if (completedSessions.length === 0) {
      return "# SparkSplit Analytics Report\n\nNo completed SparkSplit sessions yet.";
    }

    const canaiSelections = completedSessions.filter(m => m.userSelection === 'canai').length;
    const averageTrustDelta = completedSessions.reduce((sum, m) => sum + m.trustDelta, 0) / completedSessions.length;
    const referrals = completedSessions.filter(m => m.wouldRefer === true).length;

    return `# SparkSplit Analytics Report
Generated: ${new Date().toISOString()}

## Revolutionary Trust Transparency Metrics
- **Total SparkSplit Sessions**: ${allMetrics.length}
- **Completed Comparisons**: ${completedSessions.length}
- **CanAI Selection Rate**: ${((canaiSelections / completedSessions.length) * 100).toFixed(1)}%
- **Average Trust Delta**: ${averageTrustDelta.toFixed(2)}
- **Referral Rate**: ${((referrals / completedSessions.length) * 100).toFixed(1)}%

## Competitive Advantage Impact
- **Trust Transparency Advantage**: ${this.calculateTrustTransparencyAdvantage(completedSessions).toFixed(2)}/10
- **User Education Impact**: ${this.calculateUserEducationImpact(completedSessions).toFixed(2)}/10
- **Market Differentiation**: ${this.calculateMarketDifferentiation(completedSessions).toFixed(2)}/10

## Circuit Breaker Protection
- **Circuit Breaker Activations**: ${allMetrics.filter(m => m.circuitBreakerTriggered).length}
- **Protection Rate**: ${((allMetrics.filter(m => m.circuitBreakerTriggered).length / allMetrics.length) * 100).toFixed(1)}%

## Revolutionary Breakthrough Status
${canaiSelections / completedSessions.length > 0.85 ? '✅ **REVOLUTIONARY SUCCESS**: CanAI selection rate exceeds 85% target' : '⚠️ **OPTIMIZATION NEEDED**: CanAI selection rate below 85% target'}
${averageTrustDelta > 2.0 ? '✅ **TRUST TRANSPARENCY WORKING**: Trust delta exceeds 2.0 target' : '⚠️ **TRUST OPTIMIZATION NEEDED**: Trust delta below 2.0 target'}
${referrals / completedSessions.length > 0.25 ? '✅ **VIRAL EFFECT ACHIEVED**: Referral rate exceeds 25% target' : '⚠️ **VIRAL OPTIMIZATION NEEDED**: Referral rate below 25% target'}
`;
  }
} 