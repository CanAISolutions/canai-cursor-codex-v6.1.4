/**
 * Live Intelligence Dashboard
 * Internal use only: Markdown or JSON output
 * Flags promptTypes with trust dips, edit surges, or signal decay
 * Summarizes top risk sessions and tone conflicts
 */

import { EventBus } from '../cursor/utils/event-bus';
import { PromptLogs } from '../cursor/types/prompt-logs';
import { SessionAnalyticsEngine } from './session';
import { PromptPerformanceTracker } from './prompt-performance';
import { LifecycleTouchpointTracker } from './lifecycle-touchpoints';
import { FeedbackDeltaTracker } from './feedback-heatmap';

export interface DashboardMetrics {
  timestamp: number;
  trustScore: number;
  emotionalDepth: number;
  confirmationRate: number;
  overrideRate: number;
  toneConflictRate: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface RiskSession {
  sessionId: string;
  promptType: string;
  riskFactors: string[];
  trustScore: number;
  emotionalDepth: number;
  timestamp: number;
}

export interface ToneConflict {
  promptType: string;
  fieldName: string;
  conflictCount: number;
  averageConfidenceGap: number;
  lastOccurrence: number;
}

export interface DashboardState {
  metrics: DashboardMetrics;
  riskSessions: RiskSession[];
  toneConflicts: ToneConflict[];
  fieldsNeedingTuning: string[];
  promptTypesAtRisk: string[];
}

export class LiveIntelligenceDashboard {
  private eventBus: EventBus;
  private sessionAnalytics: SessionAnalyticsEngine;
  private promptPerformance: PromptPerformanceTracker;
  private lifecycleTouchpoints: LifecycleTouchpointTracker;
  private feedbackDelta: FeedbackDeltaTracker;
  private dashboardState: DashboardState;

  constructor(
    eventBus: EventBus,
    sessionAnalytics: SessionAnalyticsEngine,
    promptPerformance: PromptPerformanceTracker,
    lifecycleTouchpoints: LifecycleTouchpointTracker,
    feedbackDelta: FeedbackDeltaTracker
  ) {
    this.eventBus = eventBus;
    this.sessionAnalytics = sessionAnalytics;
    this.promptPerformance = promptPerformance;
    this.lifecycleTouchpoints = lifecycleTouchpoints;
    this.feedbackDelta = feedbackDelta;
    this.dashboardState = this.initializeDashboardState();
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    this.eventBus.on('ANALYTICS_META_UPDATED', this.updateDashboard.bind(this));
  }

  private initializeDashboardState(): DashboardState {
    return {
      metrics: {
        timestamp: Date.now(),
        trustScore: 0,
        emotionalDepth: 0,
        confirmationRate: 0,
        overrideRate: 0,
        toneConflictRate: 0,
        riskLevel: 'low'
      },
      riskSessions: [],
      toneConflicts: [],
      fieldsNeedingTuning: [],
      promptTypesAtRisk: []
    };
  }

  private updateDashboard(): void {
    this.updateMetrics();
    this.updateRiskSessions();
    this.updateToneConflicts();
    this.updateFieldsNeedingTuning();
    this.updatePromptTypesAtRisk();
    this.emitDashboardState();
  }

  private updateMetrics(): void {
    const metrics = this.calculateMetrics();
    this.dashboardState.metrics = {
      ...metrics,
      riskLevel: this.determineRiskLevel(metrics)
    };
  }

  private calculateMetrics(): DashboardMetrics {
    // Implement metric calculation logic
    return {
      timestamp: Date.now(),
      trustScore: 0,
      emotionalDepth: 0,
      confirmationRate: 0,
      overrideRate: 0,
      toneConflictRate: 0,
      riskLevel: 'low'
    };
  }

  private determineRiskLevel(metrics: DashboardMetrics): 'low' | 'medium' | 'high' {
    if (metrics.trustScore < 4.0 || metrics.toneConflictRate > 0.3) return 'high';
    if (metrics.trustScore < 4.2 || metrics.toneConflictRate > 0.2) return 'medium';
    return 'low';
  }

  private updateRiskSessions(): void {
    // Implement risk session detection logic
    this.dashboardState.riskSessions = [];
  }

  private updateToneConflicts(): void {
    // Implement tone conflict detection logic
    this.dashboardState.toneConflicts = [];
  }

  private updateFieldsNeedingTuning(): void {
    this.dashboardState.fieldsNeedingTuning = this.feedbackDelta.getFieldsNeedingTuning();
  }

  private updatePromptTypesAtRisk(): void {
    // Implement prompt type risk detection logic
    this.dashboardState.promptTypesAtRisk = [];
  }

  private emitDashboardState(): void {
    const analyticsMeta: PromptLogs['analyticsMeta'] = {
      dashboardState: this.dashboardState
    };

    this.eventBus.emit('ANALYTICS_META_UPDATED', analyticsMeta);
  }

  public getDashboardState(): DashboardState {
    return this.dashboardState;
  }

  public exportMarkdown(): string {
    const { metrics, riskSessions, toneConflicts, fieldsNeedingTuning, promptTypesAtRisk } = this.dashboardState;

    return `# CanAI Live Intelligence Dashboard
Generated: ${new Date(metrics.timestamp).toISOString()}

## System Health
- Trust Score: ${metrics.trustScore.toFixed(2)}
- Emotional Depth: ${metrics.emotionalDepth.toFixed(2)}
- Confirmation Rate: ${(metrics.confirmationRate * 100).toFixed(1)}%
- Override Rate: ${(metrics.overrideRate * 100).toFixed(1)}%
- Tone Conflict Rate: ${(metrics.toneConflictRate * 100).toFixed(1)}%
- Risk Level: ${metrics.riskLevel.toUpperCase()}

## Risk Sessions (${riskSessions.length})
${riskSessions.map(session => `
### ${session.promptType} (${session.sessionId})
- Risk Factors: ${session.riskFactors.join(', ')}
- Trust Score: ${session.trustScore.toFixed(2)}
- Emotional Depth: ${session.emotionalDepth.toFixed(2)}
- Timestamp: ${new Date(session.timestamp).toISOString()}
`).join('\n')}

## Tone Conflicts (${toneConflicts.length})
${toneConflicts.map(conflict => `
### ${conflict.promptType} - ${conflict.fieldName}
- Conflict Count: ${conflict.conflictCount}
- Average Confidence Gap: ${conflict.averageConfidenceGap.toFixed(2)}
- Last Occurrence: ${new Date(conflict.lastOccurrence).toISOString()}
`).join('\n')}

## Fields Needing Tuning (${fieldsNeedingTuning.length})
${fieldsNeedingTuning.map(field => `- ${field}`).join('\n')}

## Prompt Types At Risk (${promptTypesAtRisk.length})
${promptTypesAtRisk.map(type => `- ${type}`).join('\n')}
`;
  }

  public exportJSON(): string {
    return JSON.stringify(this.dashboardState, null, 2);
  }
} 