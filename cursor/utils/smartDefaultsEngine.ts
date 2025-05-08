/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Provide personalized smart defaults for Discovery Funnel"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Integrates session reuse and emotional memory for personalized pre-fill
 */

import { EventBus } from '../event-bus/eventBus';
import { emitSystemLog } from './audit-utils';
import { SessionReuseEngine, SparkAnalytics } from './sessionReuseEngine';
import { EmotionalMemoryBank } from './emotionalMemoryBank';
import { AirtableLogger } from './airtableLogger';

export interface SmartDefaults {
  tone: string;
  industry?: string;
  intent?: string;
  confidence: number;
  source: 'session' | 'emotional' | 'default';
}

export interface CrossSessionPattern {
  tone: string;
  industry?: string;
  intent?: string;
  frequency: number;
  successRate: number;
  lastUsed: string;
}

export class SmartDefaultsEngine {
  private readonly sessionEngine: SessionReuseEngine;
  private readonly emotionalBank: EmotionalMemoryBank;
  private readonly airtableLogger: AirtableLogger;
  private readonly eventBus = EventBus.getInstance();
  private readonly TRUST_THRESHOLD = 4.2;

  constructor() {
    this.sessionEngine = new SessionReuseEngine();
    this.emotionalBank = new EmotionalMemoryBank();
    this.airtableLogger = new AirtableLogger();
    this.initializeEventListeners();
  }

  /**
   * Gets smart defaults for a given context
   */
  async getSmartDefaults(context: string): Promise<SmartDefaults> {
    // Try session-based defaults first
    const sessionDefaults = this.getSessionDefaults(context);
    if (sessionDefaults.confidence >= 0.8) {
      return sessionDefaults;
    }

    // Fall back to emotional memory
    const emotionalDefaults = this.getEmotionalDefaults(context);
    if (emotionalDefaults.confidence >= 0.6) {
      return emotionalDefaults;
    }

    // Return safe defaults if no strong signals
    return this.getSafeDefaults();
  }

  /**
   * Records successful defaults for future use
   */
  recordSuccessfulDefaults(defaults: Omit<SmartDefaults, 'confidence' | 'source'>, context: string): void {
    // Record in session engine
    this.sessionEngine.recordSpark({
      sparkName: 'defaults',
      promptType: 'discovery_funnel',
      trustScore: this.TRUST_THRESHOLD,
      emotionalResonance: 0.8,
      context,
      metrics: {
        engagement: 0.8,
        conversion: 0.8,
        emotionalResonance: 0.8
      },
      metadata: {
        tone: defaults.tone,
        industry: defaults.industry,
        challenge: defaults.intent
      }
    });

    // Record in emotional bank
    this.emotionalBank.recordPattern({
      tone: defaults.tone,
      intensity: 0.8,
      context,
      success: true
    });

    // Log to Airtable
    this.airtableLogger.logDefaultApplied({
      defaults,
      context,
      confidence: 0.8,
      source: 'session',
      timestamp: new Date().toISOString()
    });

    emitSystemLog('defaults-recorded', {
      defaults,
      context,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Gets the cross-session learning hook for pattern analysis
   */
  getCrossSessionLearningHook(): (sessionIds: string[]) => Promise<CrossSessionPattern[]> {
    return async (sessionIds: string[]) => {
      try {
        const patterns: CrossSessionPattern[] = [];
        
        // Analyze patterns across sessions
        for (const sessionId of sessionIds) {
          const sparks = this.sessionEngine.getSessionSparks(sessionId);
          const emotionalPatterns = this.emotionalBank.getSessionPatterns(sessionId);
          
          // Combine and analyze patterns
          const combinedPatterns = this.analyzeCrossSessionPatterns(sparks, emotionalPatterns);
          patterns.push(...combinedPatterns);
        }

        // Emit analytics event
        this.eventBus.emit('CROSS_SESSION_PATTERNS_ANALYZED', {
          patterns,
          sessionCount: sessionIds.length,
          timestamp: new Date().toISOString()
        });

        return patterns;
      } catch (error) {
        emitSystemLog('cross-session-analysis-error', {
          error: error instanceof Error ? error.message : 'Unknown error',
          sessionIds,
          timestamp: new Date().toISOString()
        });
        return [];
      }
    };
  }

  private getSessionDefaults(context: string): SmartDefaults {
    const topSpark = this.sessionEngine.getTopPerformingSpark(context);
    
    if (!topSpark) {
      return this.getSafeDefaults();
    }

    return {
      tone: topSpark.metadata.tone,
      industry: topSpark.metadata.industry,
      intent: topSpark.metadata.challenge,
      confidence: this.calculateConfidence(topSpark),
      source: 'session'
    };
  }

  private getEmotionalDefaults(context: string): SmartDefaults {
    const toneMatch = this.emotionalBank.findToneMatch(context);
    
    return {
      tone: toneMatch.tone,
      confidence: toneMatch.confidence,
      source: 'emotional'
    };
  }

  private getSafeDefaults(): SmartDefaults {
    return {
      tone: 'supportive',
      confidence: 0.5,
      source: 'default'
    };
  }

  private calculateConfidence(spark: SparkAnalytics): number {
    const weights = {
      trustScore: 0.4,
      emotionalResonance: 0.3,
      engagement: 0.2,
      conversion: 0.1
    };

    return (
      (spark.trustScore / 5) * weights.trustScore +
      spark.metrics.emotionalResonance * weights.emotionalResonance +
      spark.metrics.engagement * weights.engagement +
      spark.metrics.conversion * weights.conversion
    );
  }

  private analyzeCrossSessionPatterns(
    sparks: SparkAnalytics[],
    emotionalPatterns: any[]
  ): CrossSessionPattern[] {
    const patternMap = new Map<string, CrossSessionPattern>();

    // Analyze session sparks
    sparks.forEach(spark => {
      const key = `${spark.metadata.tone}-${spark.metadata.industry || ''}`;
      const existing = patternMap.get(key) || {
        tone: spark.metadata.tone,
        industry: spark.metadata.industry,
        intent: spark.metadata.challenge,
        frequency: 0,
        successRate: 0,
        lastUsed: spark.timestamp
      };

      existing.frequency++;
      existing.successRate = (existing.successRate * (existing.frequency - 1) + 
        (spark.metrics.conversion > 0.7 ? 1 : 0)) / existing.frequency;

      patternMap.set(key, existing);
    });

    // Analyze emotional patterns
    emotionalPatterns.forEach(pattern => {
      const key = `${pattern.tone}-`;
      const existing = patternMap.get(key) || {
        tone: pattern.tone,
        frequency: 0,
        successRate: 0,
        lastUsed: pattern.timestamp
      };

      existing.frequency++;
      existing.successRate = (existing.successRate * (existing.frequency - 1) + 
        (pattern.success ? 1 : 0)) / existing.frequency;

      patternMap.set(key, existing);
    });

    return Array.from(patternMap.values());
  }

  private initializeEventListeners(): void {
    this.eventBus.on('DEFAULTS_APPLIED', this.handleDefaultsApplied.bind(this));
    this.eventBus.on('DEFAULTS_REJECTED', this.handleDefaultsRejected.bind(this));
  }

  private handleDefaultsApplied(event: any): void {
    if (event.defaults && event.context) {
      this.recordSuccessfulDefaults(event.defaults, event.context);
    }
  }

  private handleDefaultsRejected(event: any): void {
    this.airtableLogger.logDefaultRejection({
      defaults: event.defaults,
      context: event.context,
      confidence: event.confidence || 0.5,
      source: event.source || 'default',
      reason: event.reason,
      timestamp: new Date().toISOString()
    });
  }
} 