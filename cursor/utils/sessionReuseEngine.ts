/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Session-based spark reuse engine"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Track and reuse successful sparks across sessions
 */

import { EventBus } from '../event-bus/eventBus';
import { emitSystemLog } from './audit-utils';

export interface SparkAnalytics {
  id: string;
  sparkName: string;
  promptType: string;
  trustScore: number;
  emotionalResonance: number;
  context: string;
  timestamp: string;
  reused: boolean;
  metrics: {
    engagement: number;
    conversion: number;
    emotionalResonance: number;
  };
  metadata: {
    tone: string;
    industry?: string;
    challenge?: string;
    [key: string]: any;
  };
}

export class SessionReuseEngine {
  private readonly eventBus = EventBus.getInstance();
  private readonly TRUST_THRESHOLD = 4.2;
  private readonly sparks: Map<string, SparkAnalytics[]> = new Map();

  constructor() {
    this.initializeEventListeners();
  }

  /**
   * Records a new spark for potential reuse
   */
  recordSpark(spark: Omit<SparkAnalytics, 'timestamp' | 'reused'>): void {
    const sessionId = this.getCurrentSessionId();
    const fullSpark: SparkAnalytics = {
      ...spark,
      timestamp: new Date().toISOString(),
      reused: false
    };

    if (!this.sparks.has(sessionId)) {
      this.sparks.set(sessionId, []);
    }

    this.sparks.get(sessionId)?.push(fullSpark);
    this.emitAnalyticsEvent('spark-recorded', fullSpark);
  }

  /**
   * Gets the top performing spark for a given context
   */
  getTopPerformingSpark(context: string): SparkAnalytics | null {
    const sessionId = this.getCurrentSessionId();
    const sessionSparks = this.sparks.get(sessionId) || [];
    
    return sessionSparks
      .filter(spark => spark.context === context && spark.trustScore >= this.TRUST_THRESHOLD)
      .sort((a, b) => b.metrics.conversion - a.metrics.conversion)[0] || null;
  }

  /**
   * Gets all sparks for a specific session
   */
  getSessionSparks(sessionId: string): SparkAnalytics[] {
    return this.sparks.get(sessionId) || [];
  }

  /**
   * Records the outcome of a reused spark
   */
  recordOutcomeAndAdjustDefaults(sparkId: string, success: boolean, metrics: Partial<SparkAnalytics['metrics']>): void {
    const sessionId = this.getCurrentSessionId();
    const sessionSparks = this.sparks.get(sessionId) || [];
    const spark = sessionSparks.find(s => s.id === sparkId);

    if (spark) {
      // Update metrics
      spark.metrics = {
        ...spark.metrics,
        ...metrics
      };

      // Adjust trust score based on outcome
      if (success) {
        spark.trustScore = Math.min(5, spark.trustScore + 0.1);
      } else {
        spark.trustScore = Math.max(0, spark.trustScore - 0.2);
      }

      this.emitAnalyticsEvent('spark-outcome-recorded', {
        sparkId,
        success,
        metrics,
        newTrustScore: spark.trustScore
      });
    }
  }

  private getCurrentSessionId(): string {
    return window.location.pathname;
  }

  private emitAnalyticsEvent(type: string, data: any): void {
    this.eventBus.emit('ANALYTICS_EVENT', {
      type,
      data: {
        ...data,
        timestamp: new Date().toISOString()
      }
    });
  }

  private initializeEventListeners(): void {
    this.eventBus.on('SPARK_REUSED', (event: any) => {
      if (event.sparkId) {
        const sessionId = this.getCurrentSessionId();
        const sessionSparks = this.sparks.get(sessionId) || [];
        const spark = sessionSparks.find(s => s.id === event.sparkId);
        
        if (spark) {
          spark.reused = true;
          this.emitAnalyticsEvent('spark-reused', spark);
        }
      }
    });
  }
} 