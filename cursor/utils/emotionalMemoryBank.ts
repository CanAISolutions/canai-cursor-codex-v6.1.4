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

export interface SparkSuccessRecord {
  userId: string;
  sparkConcept: string;
  successCount: number;
  lastUsed: string;
}

export interface UserPreference {
  userId: string;
  key: string;
  value: string;
  timestamp: string;
}

export interface FeedbackRecord {
  userId: string;
  feedback: string;
  type: string;
  timestamp: string;
  sessionId: string;
}

export class EmotionalMemoryBank {
  private readonly eventBus = EventBus.getInstance();
  private readonly patterns: Map<string, EmotionalPattern[]> = new Map();
  private readonly sparkSuccessRecords: Map<string, SparkSuccessRecord[]> = new Map();
  private readonly userPreferences: Map<string, UserPreference[]> = new Map();
  private readonly feedbackRecords: Map<string, FeedbackRecord[]> = new Map();
  private readonly sacredMoments: Map<string, any[]> = new Map();

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
    // Generate a session ID that works in both browser and Node.js environments
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
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
    this.eventBus.on('TONE_MATCHED', async (event: any) => {
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

  /**
   * Increment spark concept success count for user
   */
  async incrementSparkSuccess(userId: string, sparkConcept: string): Promise<void> {
    if (!this.sparkSuccessRecords.has(userId)) {
      this.sparkSuccessRecords.set(userId, []);
    }

    const userRecords = this.sparkSuccessRecords.get(userId)!;
    const existingRecord = userRecords.find(r => r.sparkConcept === sparkConcept);

    if (existingRecord) {
      existingRecord.successCount++;
      existingRecord.lastUsed = new Date().toISOString();
    } else {
      userRecords.push({
        userId,
        sparkConcept,
        successCount: 1,
        lastUsed: new Date().toISOString()
      });
    }

    this.emitAnalyticsEvent('spark-success-incremented', {
      userId,
      sparkConcept,
      successCount: existingRecord?.successCount || 1
    });
  }

  /**
   * Update user preference
   */
  async updateUserPreference(userId: string, key: string, value: string): Promise<void> {
    if (!this.userPreferences.has(userId)) {
      this.userPreferences.set(userId, []);
    }

    const userPrefs = this.userPreferences.get(userId)!;
    const existingPref = userPrefs.find(p => p.key === key);

    if (existingPref) {
      existingPref.value = value;
      existingPref.timestamp = new Date().toISOString();
    } else {
      userPrefs.push({
        userId,
        key,
        value,
        timestamp: new Date().toISOString()
      });
    }

    this.emitAnalyticsEvent('user-preference-updated', {
      userId,
      key,
      value
    });
  }

  /**
   * Store user feedback
   */
  async storeFeedback(userId: string, feedback: string, type: string): Promise<void> {
    if (!this.feedbackRecords.has(userId)) {
      this.feedbackRecords.set(userId, []);
    }

    const userFeedback = this.feedbackRecords.get(userId)!;
    userFeedback.push({
      userId,
      feedback,
      type,
      timestamp: new Date().toISOString(),
      sessionId: this.getCurrentSessionId()
    });

    // Keep only last 100 feedback records per user
    if (userFeedback.length > 100) {
      userFeedback.splice(0, userFeedback.length - 100);
    }

    this.emitAnalyticsEvent('feedback-stored', {
      userId,
      type,
      feedbackLength: feedback.length
    });
  }

  /**
   * Store sacred moment
   */
  async storeSacredMoment(userId: string, moment: any): Promise<void> {
    if (!this.sacredMoments.has(userId)) {
      this.sacredMoments.set(userId, []);
    }

    const userMoments = this.sacredMoments.get(userId)!;
    userMoments.push({
      ...moment,
      storedAt: new Date().toISOString()
    });

    // Keep only last 50 sacred moments per user
    if (userMoments.length > 50) {
      userMoments.splice(0, userMoments.length - 50);
    }

    this.emitAnalyticsEvent('sacred-moment-stored', {
      userId,
      momentType: moment.type,
      resonanceScore: moment.resonanceScore
    });
  }

  /**
   * Enhance memory based on moment type and resonance
   */
  async enhanceMemory(userId: string, momentType: string, resonanceScore: number): Promise<void> {
    // Enhance patterns based on successful moments
    if (resonanceScore >= 4.0) {
      const sessionId = this.getCurrentSessionId();
      const sessionPatterns = this.patterns.get(sessionId) || [];
      
      // Mark recent patterns as successful if they led to high resonance
      sessionPatterns.forEach(pattern => {
        pattern.success = true;
        pattern.intensity = Math.max(pattern.intensity, resonanceScore);
      });
    }

    this.emitAnalyticsEvent('memory-enhanced', {
      userId,
      momentType,
      resonanceScore
    });
  }

  /**
   * Get spark success records for user
   */
  getSparkSuccessRecords(userId: string): SparkSuccessRecord[] {
    return this.sparkSuccessRecords.get(userId) || [];
  }

  /**
   * Get user preferences
   */
  getUserPreferences(userId: string): UserPreference[] {
    return this.userPreferences.get(userId) || [];
  }

  /**
   * Get feedback records for user
   */
  getFeedbackRecords(userId: string): FeedbackRecord[] {
    return this.feedbackRecords.get(userId) || [];
  }

  /**
   * Get sacred moments for user
   */
  getSacredMoments(userId: string): any[] {
    return this.sacredMoments.get(userId) || [];
  }

  /**
   * Get user profile for emotional context enrichment
   */
  async getUserProfile(userId: string): Promise<any | null> {
    try {
      const preferences = this.getUserPreferences(userId);
      const sparkRecords = this.getSparkSuccessRecords(userId);
      const feedbackRecords = this.getFeedbackRecords(userId);
      
      if (preferences.length === 0 && sparkRecords.length === 0 && feedbackRecords.length === 0) {
        return null;
      }

      // Build user profile from available data
      const profile = {
        userId,
        languagePreferences: {
          preferredTone: preferences.find(p => p.key === 'preferredTone')?.value || 'professional',
          complexityLevel: preferences.find(p => p.key === 'complexityLevel')?.value || 'medium',
          emotionalStyle: preferences.find(p => p.key === 'emotionalStyle')?.value || 'supportive'
        },
        emotionalTriggers: this.extractEmotionalTriggers(feedbackRecords),
        industryContext: preferences.find(p => p.key === 'industry')?.value || 'general',
        culturalBackground: preferences.find(p => p.key === 'culture')?.value || 'western_business',
        trustLevel: this.calculateUserTrustLevel(sparkRecords, feedbackRecords),
        hasHistory: preferences.length > 0 || sparkRecords.length > 0 || feedbackRecords.length > 0
      };

      emitSystemLog('user-profile-retrieved', {
        userId,
        profileCompleteness: this.calculateProfileCompleteness(profile)
      });

      return profile;
    } catch (error) {
      emitSystemLog('user-profile-error', {
        userId,
        error: error instanceof Error ? error.message : String(error)
      });
      return null;
    }
  }

  /**
   * Get cross-session continuity data for emotional context
   */
  async getCrossSessionContinuity(userId: string): Promise<any | null> {
    try {
      const preferences = this.getUserPreferences(userId);
      const sparkRecords = this.getSparkSuccessRecords(userId);
      const sacredMoments = this.getSacredMoments(userId);
      
      if (preferences.length === 0 && sparkRecords.length === 0 && sacredMoments.length === 0) {
        return null;
      }

      // Build continuity data
      const continuityData = {
        userId,
        sessionConnections: this.extractSessionConnections(preferences, sparkRecords),
        persistentPreferences: this.buildPersistentPreferences(preferences),
        emotionalEvolution: this.trackEmotionalEvolution(sparkRecords, sacredMoments),
        lastInteractionDate: this.getLastInteractionDate(preferences, sparkRecords),
        continuityScore: this.calculateContinuityScore(preferences, sparkRecords, sacredMoments)
      };

      emitSystemLog('cross-session-continuity-retrieved', {
        userId,
        continuityScore: continuityData.continuityScore,
        sessionCount: continuityData.sessionConnections.length
      });

      return continuityData;
    } catch (error) {
      emitSystemLog('cross-session-continuity-error', {
        userId,
        error: error instanceof Error ? error.message : String(error)
      });
      return null;
    }
  }

  /**
   * Store emotional fingerprint for user
   */
  async storeEmotionalFingerprint(userId: string, fingerprint: any): Promise<void> {
    try {
      // Store fingerprint data as user preferences
      if (fingerprint.emotionalTriggers) {
        await this.updateUserPreference(userId, 'emotionalTriggers', JSON.stringify(fingerprint.emotionalTriggers));
      }
      
      if (fingerprint.languagePatterns) {
        await this.updateUserPreference(userId, 'languagePatterns', JSON.stringify(fingerprint.languagePatterns));
      }
      
      if (fingerprint.trustLevel) {
        await this.updateUserPreference(userId, 'trustLevel', fingerprint.trustLevel.toString());
      }

      if (fingerprint.hasHistory !== undefined) {
        await this.updateUserPreference(userId, 'hasHistory', fingerprint.hasHistory.toString());
      }

      emitSystemLog('emotional-fingerprint-stored', {
        userId,
        fingerprintKeys: Object.keys(fingerprint)
      });
    } catch (error) {
      emitSystemLog('emotional-fingerprint-storage-error', {
        userId,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  /**
   * Get emotional fingerprint for user
   */
  async getEmotionalFingerprint(userId: string): Promise<any | null> {
    try {
      const preferences = this.getUserPreferences(userId);
      
      if (preferences.length === 0) {
        return null;
      }

      const fingerprint = {
        userId,
        emotionalTriggers: this.parseJsonPreference(preferences, 'emotionalTriggers', []),
        languagePatterns: this.parseJsonPreference(preferences, 'languagePatterns', {}),
        trustLevel: parseFloat(preferences.find(p => p.key === 'trustLevel')?.value || '3.0'),
        hasHistory: preferences.find(p => p.key === 'hasHistory')?.value === 'true',
        emotionalArcs: this.buildEmotionalArcs(userId)
      };

      return fingerprint;
    } catch (error) {
      emitSystemLog('emotional-fingerprint-retrieval-error', {
        userId,
        error: error instanceof Error ? error.message : String(error)
      });
      return null;
    }
  }

  // Helper methods for new functionality
  private extractEmotionalTriggers(feedbackRecords: FeedbackRecord[]): string[] {
    const triggers = new Set<string>();
    
    feedbackRecords.forEach(record => {
      // Extract emotional keywords from feedback
      const emotionalWords = ['excited', 'frustrated', 'confused', 'satisfied', 'growth', 'success', 'clarity'];
      emotionalWords.forEach(word => {
        if (record.feedback.toLowerCase().includes(word)) {
          triggers.add(word);
        }
      });
    });
    
    return Array.from(triggers);
  }

  private calculateUserTrustLevel(sparkRecords: SparkSuccessRecord[], feedbackRecords: FeedbackRecord[]): number {
    let trustScore = 3.0; // Base trust level
    
    // Increase trust based on successful spark usage
    const totalSuccesses = sparkRecords.reduce((sum, record) => sum + record.successCount, 0);
    trustScore += Math.min(1.0, totalSuccesses * 0.1);
    
    // Adjust based on feedback sentiment (simplified)
    const positiveFeedback = feedbackRecords.filter(f => 
      f.feedback.toLowerCase().includes('good') || 
      f.feedback.toLowerCase().includes('great') ||
      f.feedback.toLowerCase().includes('excellent')
    ).length;
    
    trustScore += Math.min(0.5, positiveFeedback * 0.1);
    
    return Math.min(5.0, trustScore);
  }

  private calculateProfileCompleteness(profile: any): number {
    const fields = ['languagePreferences', 'emotionalTriggers', 'industryContext', 'culturalBackground'];
    const completedFields = fields.filter(field => profile[field] && 
      (Array.isArray(profile[field]) ? profile[field].length > 0 : true)
    ).length;
    
    return completedFields / fields.length;
  }

  private extractSessionConnections(preferences: UserPreference[], sparkRecords: SparkSuccessRecord[]): any[] {
    const sessions = new Set<string>();
    
    // Extract unique session identifiers from timestamps
    preferences.forEach(pref => {
      const sessionId = this.extractSessionFromTimestamp(pref.timestamp);
      if (sessionId) sessions.add(sessionId);
    });
    
    sparkRecords.forEach(record => {
      const sessionId = this.extractSessionFromTimestamp(record.lastUsed);
      if (sessionId) sessions.add(sessionId);
    });
    
    return Array.from(sessions).map(sessionId => ({
      previousSessionId: sessionId,
      connectionStrength: 0.8 // Default connection strength
    }));
  }

  private buildPersistentPreferences(preferences: UserPreference[]): any {
    const persistent: any = {};
    
    preferences.forEach(pref => {
      if (pref.key.startsWith('persistent_')) {
        persistent[pref.key.replace('persistent_', '')] = pref.value;
      }
    });
    
    return persistent;
  }

  private trackEmotionalEvolution(sparkRecords: SparkSuccessRecord[], sacredMoments: any[]): any[] {
    const evolution: any[] = [];
    
    // Track evolution based on spark usage patterns
    sparkRecords.forEach(record => {
      evolution.push({
        timestamp: record.lastUsed,
        evolutionType: 'spark_mastery',
        concept: record.sparkConcept,
        progressLevel: Math.min(5, record.successCount)
      });
    });
    
    return evolution.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  private getLastInteractionDate(preferences: UserPreference[], sparkRecords: SparkSuccessRecord[]): string {
    const allDates = [
      ...preferences.map(p => p.timestamp),
      ...sparkRecords.map(r => r.lastUsed)
    ];
    
    return allDates.sort().pop() || new Date().toISOString();
  }

  private calculateContinuityScore(preferences: UserPreference[], sparkRecords: SparkSuccessRecord[], sacredMoments: any[]): number {
    let score = 0;
    
    // Base score from data richness
    score += Math.min(0.3, preferences.length * 0.05);
    score += Math.min(0.3, sparkRecords.length * 0.1);
    score += Math.min(0.2, sacredMoments.length * 0.05);
    
    // Recency bonus
    const lastInteraction = this.getLastInteractionDate(preferences, sparkRecords);
    const daysSinceLastInteraction = (Date.now() - new Date(lastInteraction).getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastInteraction < 7) {
      score += 0.2;
    } else if (daysSinceLastInteraction < 30) {
      score += 0.1;
    }
    
    return Math.min(1.0, score);
  }

  private extractSessionFromTimestamp(timestamp: string): string | null {
    try {
      const date = new Date(timestamp);
      return `session-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    } catch {
      return null;
    }
  }

  private parseJsonPreference(preferences: UserPreference[], key: string, defaultValue: any): any {
    const pref = preferences.find(p => p.key === key);
    if (!pref) return defaultValue;
    
    try {
      return JSON.parse(pref.value);
    } catch {
      return defaultValue;
    }
  }

  private buildEmotionalArcs(userId: string): any[] {
    // Build emotional arcs from available data
    const sparkRecords = this.getSparkSuccessRecords(userId);
    const arcs: any[] = [];
    
    sparkRecords.forEach(record => {
      arcs.push({
        sessionId: this.extractSessionFromTimestamp(record.lastUsed),
        startTrustScore: 3.0,
        finalTrustScore: 3.0 + (record.successCount * 0.1),
        emotionalDelta: record.successCount * 0.1,
        arcType: 'spark_progression',
        keyMoments: [`spark_success_${record.sparkConcept}`],
        timestamp: record.lastUsed
      });
    });
    
    return arcs;
  }

  /**
   * Get emotional history for user
   */
  async getEmotionalHistory(userId: string): Promise<any[]> {
    try {
      const preferences = this.getUserPreferences(userId);
      const sparkRecords = this.getSparkSuccessRecords(userId);
      const feedbackRecords = this.getFeedbackRecords(userId);
      const sacredMoments = this.getSacredMoments(userId);
      
      const history: any[] = [];
      
      // Add preference changes as history entries
      preferences.forEach(pref => {
        history.push({
          timestamp: pref.timestamp,
          type: 'preference_change',
          data: {
            key: pref.key,
            value: pref.value,
            userId: pref.userId
          }
        });
      });
      
      // Add spark successes as history entries
      sparkRecords.forEach(record => {
        history.push({
          timestamp: record.lastUsed,
          type: 'spark_success',
          data: {
            sparkConcept: record.sparkConcept,
            successCount: record.successCount,
            userId: record.userId
          }
        });
      });
      
      // Add feedback as history entries
      feedbackRecords.forEach(record => {
        history.push({
          timestamp: record.timestamp,
          type: 'feedback',
          data: {
            feedback: record.feedback,
            feedbackType: record.type,
            sessionId: record.sessionId,
            userId: record.userId
          }
        });
      });
      
      // Add sacred moments as history entries
      sacredMoments.forEach(moment => {
        history.push({
          timestamp: moment.timestamp || new Date().toISOString(),
          type: 'sacred_moment',
          data: moment
        });
      });
      
      // Sort by timestamp
      return history.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    } catch (error) {
      emitSystemLog('emotional-history-error', {
        userId,
        error: error instanceof Error ? error.message : String(error)
      });
      return [];
    }
  }

  /**
   * Store memory entry
   */
  async storeMemory(memoryEntry: any): Promise<void> {
    try {
      const { userId, type, data } = memoryEntry;
      
      if (!userId || !type || !data) {
        throw new Error('Invalid memory entry: missing required fields');
      }
      
      switch (type) {
        case 'preference':
          await this.updateUserPreference(userId, data.key, data.value);
          break;
          
        case 'feedback':
          await this.storeFeedback(userId, data.feedback, data.type || 'general');
          break;
          
        case 'sacred_moment':
          await this.storeSacredMoment(userId, data);
          break;
          
        case 'spark_success':
          await this.incrementSparkSuccess(userId, data.sparkConcept);
          break;
          
        case 'emotional_pattern':
          this.recordPattern({
            tone: data.tone || 'neutral',
            intensity: data.intensity || 0.5,
            context: data.context || 'general',
            success: data.success || false
          });
          break;
          
        default:
          // Store as generic preference
          await this.updateUserPreference(userId, `memory_${type}`, JSON.stringify(data));
      }
      
      emitSystemLog('memory-stored', {
        userId,
        type,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      emitSystemLog('memory-storage-error', {
        userId: memoryEntry.userId,
        type: memoryEntry.type,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
} 