import { PromptLogs } from '../types/prompt-logs';

/**
 * Service responsible for calculating comprehensive metrics from prompt logs
 * Implements statistical analysis and trend detection for UX optimization
 */
export class MetricCalculator {
  private static readonly TRUST_THRESHOLD = 4.2;
  private static readonly EMOTIONAL_DEPTH_THRESHOLD = 0.7;
  private static readonly CONFIRMATION_RATE_THRESHOLD = 0.85;
  private static readonly OVERRIDE_RATE_THRESHOLD = 0.15;
  private static readonly TONE_CONFLICT_THRESHOLD = 0.1;

  /**
   * Calculates comprehensive metrics from prompt logs
   * @param logs Array of prompt logs to analyze
   * @returns Calculated metrics and analysis
   */
  public calculateMetrics(logs: PromptLogs[]): {
    sessionMetrics: Map<string, any>;
    timeSeries: any[];
    cohortComparison: Map<string, any[]>;
    promptMetrics: Map<string, any>;
    monthlyStats: any[];
    rollingStats: any[];
    touchpointMetrics: Map<string, any>;
    correlations: any;
    feedbackHeatmap: any;
    dashboardState: any;
  } {
    const sessionMetrics = this.calculateSessionMetrics(logs);
    const timeSeries = this.calculateTimeSeries(logs);
    const cohortComparison = this.calculateCohortComparison(logs);
    const promptMetrics = this.calculatePromptMetrics(logs);
    const monthlyStats = this.calculateMonthlyStats(logs);
    const rollingStats = this.calculateRollingStats(logs);
    const touchpointMetrics = this.calculateTouchpointMetrics(logs);
    const correlations = this.calculateCorrelations(logs);
    const feedbackHeatmap = this.calculateFeedbackHeatmap(logs);
    const dashboardState = this.calculateDashboardState(logs);

    return {
      sessionMetrics,
      timeSeries,
      cohortComparison,
      promptMetrics,
      monthlyStats,
      rollingStats,
      touchpointMetrics,
      correlations,
      feedbackHeatmap,
      dashboardState
    };
  }

  /**
   * Calculates per-session metrics including trust score and emotional depth
   */
  private calculateSessionMetrics(logs: PromptLogs[]): Map<string, any> {
    const metrics = new Map<string, any>();
    
    logs.forEach(log => {
      if (!log.analyticsMeta?.sessionMetrics) return;
      
      const { sessionId, emotionalDepth, trustScore, overrideCount, timeToConfirmation } = log.analyticsMeta.sessionMetrics;
      
      metrics.set(sessionId, {
        emotionalDepth,
        trustScore,
        overrideCount,
        timeToConfirmation,
        dropOffSignal: trustScore < MetricCalculator.TRUST_THRESHOLD,
        riskLevel: this.calculateRiskLevel(trustScore, emotionalDepth)
      });
    });

    return metrics;
  }

  /**
   * Calculates time series data for trend analysis
   */
  private calculateTimeSeries(logs: PromptLogs[]): any[] {
    return logs
      .filter(log => log.analyticsMeta?.timeSeries)
      .flatMap(log => log.analyticsMeta.timeSeries || [])
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Compares metrics across different cohorts
   */
  private calculateCohortComparison(logs: PromptLogs[]): Map<string, any[]> {
    const cohorts = new Map<string, any[]>();
    
    logs.forEach(log => {
      if (!log.analyticsMeta?.cohortComparison) return;
      
      Object.entries(log.analyticsMeta.cohortComparison).forEach(([cohort, data]) => {
        if (!cohorts.has(cohort)) {
          cohorts.set(cohort, []);
        }
        cohorts.get(cohort)?.push(...data);
      });
    });

    return cohorts;
  }

  /**
   * Calculates metrics specific to each prompt type
   */
  private calculatePromptMetrics(logs: PromptLogs[]): Map<string, any> {
    const metrics = new Map<string, any>();
    
    logs.forEach(log => {
      if (!log.analyticsMeta?.promptMetrics) return;
      
      const { promptType, confirmationRate, revisionRate, toneConflictRate } = log.analyticsMeta.promptMetrics;
      
      metrics.set(promptType, {
        confirmationRate,
        revisionRate,
        toneConflictRate,
        needsAttention: this.determineIfNeedsAttention(confirmationRate, revisionRate, toneConflictRate)
      });
    });

    return metrics;
  }

  /**
   * Calculates monthly statistics for trend analysis
   */
  private calculateMonthlyStats(logs: PromptLogs[]): any[] {
    return logs
      .filter(log => log.analyticsMeta?.monthlyStats)
      .flatMap(log => log.analyticsMeta.monthlyStats || [])
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Calculates rolling statistics for recent trend analysis
   */
  private calculateRollingStats(logs: PromptLogs[]): any[] {
    return logs
      .filter(log => log.analyticsMeta?.rollingStats)
      .flatMap(log => log.analyticsMeta.rollingStats || [])
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Calculates metrics for each touchpoint in the user journey
   */
  private calculateTouchpointMetrics(logs: PromptLogs[]): Map<string, any> {
    const metrics = new Map<string, any>();
    
    logs.forEach(log => {
      if (!log.analyticsMeta?.touchpointMetrics) return;
      
      const { sessionId, sparkUsed, visionCatcherTriggered, confirmationOutcome } = log.analyticsMeta.touchpointMetrics;
      
      metrics.set(sessionId, {
        sparkUsed,
        visionCatcherTriggered,
        confirmationOutcome,
        effectiveness: this.calculateTouchpointEffectiveness(sparkUsed, visionCatcherTriggered, confirmationOutcome)
      });
    });

    return metrics;
  }

  /**
   * Calculates correlations between different metrics
   */
  private calculateCorrelations(logs: PromptLogs[]): any {
    const correlations = {
      sparkImpact: 0,
      visionImpact: 0,
      enrichmentImpact: 0,
      toneImpact: 0
    };

    logs.forEach(log => {
      if (!log.analyticsMeta?.correlations) return;
      Object.assign(correlations, log.analyticsMeta.correlations);
    });

    return correlations;
  }

  /**
   * Calculates feedback heatmap for field-level analysis
   */
  private calculateFeedbackHeatmap(logs: PromptLogs[]): any {
    const heatmap = {
      fieldClusters: new Map(),
      sessionEdits: new Map(),
      promptTypeEdits: new Map()
    };

    logs.forEach(log => {
      if (!log.analyticsMeta?.feedbackHeatmap) return;
      Object.assign(heatmap, log.analyticsMeta.feedbackHeatmap);
    });

    return heatmap;
  }

  /**
   * Calculates current dashboard state with risk assessment
   */
  private calculateDashboardState(logs: PromptLogs[]): any {
    const state = {
      metrics: {
        timestamp: Date.now(),
        trustScore: 0,
        emotionalDepth: 0,
        confirmationRate: 0,
        overrideRate: 0,
        toneConflictRate: 0,
        riskLevel: 'low' as 'low' | 'medium' | 'high'
      },
      riskSessions: [] as any[],
      toneConflicts: [] as any[],
      fieldsNeedingTuning: [] as string[],
      promptTypesAtRisk: [] as string[]
    };

    logs.forEach(log => {
      if (!log.analyticsMeta?.dashboardState) return;
      Object.assign(state, log.analyticsMeta.dashboardState);
    });

    return state;
  }

  /**
   * Calculates risk level based on trust score and emotional depth
   */
  private calculateRiskLevel(trustScore: number, emotionalDepth: number): 'low' | 'medium' | 'high' {
    if (trustScore >= MetricCalculator.TRUST_THRESHOLD && emotionalDepth >= MetricCalculator.EMOTIONAL_DEPTH_THRESHOLD) {
      return 'low';
    } else if (trustScore >= MetricCalculator.TRUST_THRESHOLD * 0.8 && emotionalDepth >= MetricCalculator.EMOTIONAL_DEPTH_THRESHOLD * 0.8) {
      return 'medium';
    }
    return 'high';
  }

  /**
   * Determines if a prompt type needs attention based on metrics
   */
  private determineIfNeedsAttention(
    confirmationRate: number,
    revisionRate: number,
    toneConflictRate: number
  ): boolean {
    return (
      confirmationRate < MetricCalculator.CONFIRMATION_RATE_THRESHOLD ||
      revisionRate > MetricCalculator.OVERRIDE_RATE_THRESHOLD ||
      toneConflictRate > MetricCalculator.TONE_CONFLICT_THRESHOLD
    );
  }

  /**
   * Calculates touchpoint effectiveness based on feature usage and outcomes
   */
  private calculateTouchpointEffectiveness(
    sparkUsed: boolean,
    visionCatcherTriggered: boolean,
    confirmationOutcome: boolean
  ): number {
    let effectiveness = 0;
    if (sparkUsed) effectiveness += 0.4;
    if (visionCatcherTriggered) effectiveness += 0.3;
    if (confirmationOutcome) effectiveness += 0.3;
    return effectiveness;
  }
} 