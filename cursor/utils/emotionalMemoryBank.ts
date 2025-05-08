/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Emotional pattern memory and matching"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Track and match emotional patterns for tone selection
 */

import { EventBus } from '../event-bus/eventBus';
import { emitSystemLog } from './audit-utils';

export interface EmotionalPattern {
  tone: string;
  intensity: number;
  context: string;
  success: boolean;
  timestamp: string;
  sessionId: string;
}

export class EmotionalMemoryBank {
  private readonly eventBus = EventBus.getInstance();
  private readonly patterns: Map<string, EmotionalPattern[]> = new Map();

  constructor() {
    this.initializeEventListeners();
  }

  /**
   * Records an emotional pattern for future matching
   */
  recordPattern(pattern: Omit<EmotionalPattern, 'timestamp' | 'sessionId'>): void {
    const sessionId = this.getCurrentSessionId();
    const fullPattern: EmotionalPattern = {
      ...pattern,
      timestamp: new Date().toISOString(),
      sessionId
    };

    if (!this.patterns.has(sessionId)) {
      this.patterns.set(sessionId, []);
    }

    this.patterns.get(sessionId)?.push(fullPattern);
    this.emitAnalyticsEvent('pattern-recorded', fullPattern);
  }

  /**
   * Finds the best tone match for a given context
   */
  findToneMatch(context: string): { tone: string; confidence: number } {
    const sessionId = this.getCurrentSessionId();
    const sessionPatterns = this.patterns.get(sessionId) || [];
    
    const relevantPatterns = sessionPatterns.filter(pattern => 
      pattern.context === context && pattern.success
    );

    if (relevantPatterns.length === 0) {
      return {
        tone: 'supportive',
        confidence: 0.5
      };
    }

    // Calculate weighted average of successful patterns
    const toneScores = new Map<string, { total: number; count: number }>();
    
    relevantPatterns.forEach(pattern => {
      const existing = toneScores.get(pattern.tone) || { total: 0, count: 0 };
      toneScores.set(pattern.tone, {
        total: existing.total + pattern.intensity,
        count: existing.count + 1
      });
    });

    let bestTone = 'supportive';
    let highestScore = 0;

    toneScores.forEach((score, tone) => {
      const averageScore = score.total / score.count;
      if (averageScore > highestScore) {
        highestScore = averageScore;
        bestTone = tone;
      }
    });

    return {
      tone: bestTone,
      confidence: Math.min(1, highestScore)
    };
  }

  /**
   * Gets all patterns for a specific session
   */
  getSessionPatterns(sessionId: string): EmotionalPattern[] {
    return this.patterns.get(sessionId) || [];
  }

  /**
   * Records the outcome of a tone match
   */
  recordOutcomeAndAdjustDefaults(patternId: string, success: boolean, intensity: number): void {
    const sessionId = this.getCurrentSessionId();
    const sessionPatterns = this.patterns.get(sessionId) || [];
    const pattern = sessionPatterns.find(p => p.timestamp === patternId);

    if (pattern) {
      pattern.success = success;
      pattern.intensity = intensity;

      this.emitAnalyticsEvent('pattern-outcome-recorded', {
        patternId,
        success,
        intensity,
        timestamp: new Date().toISOString()
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
    this.eventBus.on('TONE_MATCHED', (event: any) => {
      if (event.patternId) {
        const sessionId = this.getCurrentSessionId();
        const sessionPatterns = this.patterns.get(sessionId) || [];
        const pattern = sessionPatterns.find(p => p.timestamp === event.patternId);
        
        if (pattern) {
          this.emitAnalyticsEvent('tone-matched', pattern);
        }
      }
    });
  }
} 