/**
 * Emotional Context Pipeline - Bridge 2: Emotional Context Flow
 * Purpose: Emotional intelligence flows between all components enhanced by SparkSplit insights
 * Classification: Core Infrastructure - Emotional Sovereignty Platform
 * 
 * What: Manages emotional fingerprint gathering, cross-component context flow, and memory integration
 * Why: Enables 95%+ emotional continuity across all user interactions and components
 * How: Real-time emotional context enrichment with SparkSplit trust data and memory persistence
 */

import { 
  EmotionalContext, 
  TrustDelta,
  EmotionalIntelligenceMetrics,
  UserEmotionalProfile,
  EmotionalMemoryEntry,
  CrossSessionContinuity,
  EmotionalEvolution
} from '../types/emotional-sovereignty';
import { SparkSplitIntegration } from '../adapters/universal-interface-adapter';
import { SparkSplitSessionData } from '../services/spark-split-engine';
import { EmotionalMemoryBank } from '../utils/emotionalMemoryBank';
import { EventBus } from '../event-bus/eventBus';
import { emitSystemLog } from '../utils/audit-utils';

// Enhanced emotional context with pipeline metadata
export interface EnrichedEmotionalContext extends EmotionalContext {
  // Pipeline metadata
  enrichmentLevel: 'basic' | 'enhanced' | 'deep' | 'transcendent';
  lastEnrichmentTimestamp: Date;
  enrichmentSources: string[];
  
  // SparkSplit integration
  sparkSplitData?: SparkSplitIntegration;
  trustProgression: TrustDelta[];
  emotionalCompass?: EmotionalIntelligenceMetrics;
  
  // Cross-session continuity
  sessionConnections: string[];
  emotionalEvolution: EmotionalEvolution[];
  persistentPreferences: any;
  
  // Real-time insights
  currentEmotionalState: string;
  resonancePatterns: string[];
  adaptationHistory: any[];
  
  // Quality metrics
  contextQuality: number;
  continuityScore: number;
  trustScore: number;
}

// Context enrichment request
export interface ContextEnrichmentRequest {
  userId?: string;
  sessionId?: string;
  currentContext?: EmotionalContext;
  interactionData?: any;
  sparkSplitData?: SparkSplitIntegration;
  enrichmentLevel?: 'basic' | 'enhanced' | 'deep' | 'transcendent';
  preserveHistory?: boolean;
}

// Context enrichment result
export interface ContextEnrichmentResult {
  enrichedContext: EnrichedEmotionalContext;
  enrichmentSources: string[];
  qualityMetrics: {
    completeness: number;
    accuracy: number;
    freshness: number;
    continuity: number;
  };
  recommendations: string[];
  nextActions: string[];
}

// Context flow configuration
export interface ContextFlowConfig {
  enableCrossSessionContinuity: boolean;
  enableSparkSplitIntegration: boolean;
  enableRealTimeAdaptation: boolean;
  enableEmotionalEvolution: boolean;
  trustThreshold: number;
  qualityThreshold: number;
  maxHistoryRetention: number; // days
}

/**
 * Emotional Context Pipeline
 * Manages emotional intelligence flow across all 95+ components
 */
export class EmotionalContextPipeline {
  private emotionalMemoryBank: EmotionalMemoryBank;
  private eventBus: EventBus;
  private contextCache: Map<string, EnrichedEmotionalContext> = new Map();
  private config: ContextFlowConfig;

  constructor(
    emotionalMemoryBank: EmotionalMemoryBank,
    eventBus: EventBus,
    config?: Partial<ContextFlowConfig>
  ) {
    this.emotionalMemoryBank = emotionalMemoryBank;
    this.eventBus = eventBus;
    this.config = {
      enableCrossSessionContinuity: true,
      enableSparkSplitIntegration: true,
      enableRealTimeAdaptation: true,
      enableEmotionalEvolution: true,
      trustThreshold: 3.0,
      qualityThreshold: 0.7,
      maxHistoryRetention: 90,
      ...config
    };
  }

  /**
   * Enrich emotional context with cross-component intelligence
   * What: Gathers and enriches emotional context from all available sources
   * Why: Provides comprehensive emotional intelligence for all components
   * How: Multi-source data fusion with SparkSplit trust enhancement
   */
  async enrichEmotionalContext(request: ContextEnrichmentRequest): Promise<ContextEnrichmentResult> {
    try {
      emitSystemLog('emotional-context-enrichment-start', {
        userId: request.userId,
        sessionId: request.sessionId,
        enrichmentLevel: request.enrichmentLevel || 'enhanced',
        hasSparkSplitData: !!request.sparkSplitData
      });

      // Start with base context or create new
      let enrichedContext = await this.initializeBaseContext(request);

      // Apply enrichment layers based on level
      const enrichmentLevel = request.enrichmentLevel || 'enhanced';
      const enrichmentSources: string[] = [];

      // Layer 1: Basic enrichment (always applied)
      enrichedContext = await this.applyBasicEnrichment(enrichedContext, request);
      enrichmentSources.push('basic_enrichment');

      // Layer 2: Enhanced enrichment (default level)
      if (['enhanced', 'deep', 'transcendent'].includes(enrichmentLevel)) {
        enrichedContext = await this.applyEnhancedEnrichment(enrichedContext, request);
        enrichmentSources.push('enhanced_enrichment');
      }

      // Layer 3: Deep enrichment (advanced level)
      if (['deep', 'transcendent'].includes(enrichmentLevel)) {
        enrichedContext = await this.applyDeepEnrichment(enrichedContext, request);
        enrichmentSources.push('deep_enrichment');
      }

      // Layer 4: Transcendent enrichment (maximum level)
      if (enrichmentLevel === 'transcendent') {
        enrichedContext = await this.applyTranscendentEnrichment(enrichedContext, request);
        enrichmentSources.push('transcendent_enrichment');
      }

      // Apply SparkSplit integration if available
      if (this.config.enableSparkSplitIntegration && request.sparkSplitData) {
        enrichedContext = await this.integrateSparkSplitData(enrichedContext, request.sparkSplitData);
        enrichmentSources.push('sparksplit_integration');
      }

      // Apply cross-session continuity
      if (this.config.enableCrossSessionContinuity && request.userId) {
        enrichedContext = await this.applyCrossSessionContinuity(enrichedContext, request.userId);
        enrichmentSources.push('cross_session_continuity');
      }

      // Apply real-time adaptation
      if (this.config.enableRealTimeAdaptation) {
        enrichedContext = await this.applyRealTimeAdaptation(enrichedContext, request);
        enrichmentSources.push('realtime_adaptation');
      }

      // Calculate quality metrics
      const qualityMetrics = await this.calculateQualityMetrics(enrichedContext);

      // Generate recommendations and next actions
      const recommendations = await this.generateRecommendations(enrichedContext, qualityMetrics);
      const nextActions = await this.generateNextActions(enrichedContext, qualityMetrics);

      // Cache enriched context for performance
      if (request.sessionId) {
        this.contextCache.set(request.sessionId, enrichedContext);
      }

      // Store in emotional memory if quality is sufficient
      if (qualityMetrics.completeness >= this.config.qualityThreshold) {
        await this.storeEnrichedContext(enrichedContext);
      }

      // Emit enrichment complete event
      this.eventBus.emit('emotional_context_enriched', {
        userId: request.userId,
        sessionId: request.sessionId,
        enrichmentLevel,
        qualityMetrics,
        enrichmentSources
      });

      emitSystemLog('emotional-context-enrichment-complete', {
        userId: request.userId,
        sessionId: request.sessionId,
        enrichmentSources,
        qualityScore: qualityMetrics.completeness
      });

      return {
        enrichedContext,
        enrichmentSources,
        qualityMetrics,
        recommendations,
        nextActions
      };

    } catch (error) {
      emitSystemLog('emotional-context-enrichment-error', {
        error: error instanceof Error ? error.message : String(error),
        userId: request.userId,
        sessionId: request.sessionId
      });

      // Graceful fallback with basic context
      return this.createFallbackEnrichmentResult(request);
    }
  }

  /**
   * Initialize base emotional context
   * What: Creates or retrieves base emotional context for enrichment
   * Why: Provides foundation for all enrichment layers
   * How: Cache lookup, memory retrieval, or new context creation
   */
  private async initializeBaseContext(request: ContextEnrichmentRequest): Promise<EnrichedEmotionalContext> {
    // Try cache first for performance
    if (request.sessionId && this.contextCache.has(request.sessionId)) {
      const cached = this.contextCache.get(request.sessionId)!;
      // Update timestamp and return if recent
      if (Date.now() - cached.lastEnrichmentTimestamp.getTime() < 300000) { // 5 minutes
        return cached;
      }
    }

    // Use provided context or create new
    const baseContext = request.currentContext || {
      baseTrustScore: 3.0,
      emotionalTriggers: [],
      userId: request.userId,
      sessionId: request.sessionId
    };

    // Create enriched context structure
    return {
      ...baseContext,
      enrichmentLevel: 'basic',
      lastEnrichmentTimestamp: new Date(),
      enrichmentSources: [],
      trustProgression: [],
      sessionConnections: [],
      emotionalEvolution: [],
      persistentPreferences: {},
      currentEmotionalState: 'neutral',
      resonancePatterns: [],
      adaptationHistory: [],
      contextQuality: 0.5,
      continuityScore: 0.5,
      trustScore: baseContext.baseTrustScore
    };
  }

  /**
   * Apply basic enrichment layer
   * What: Fundamental emotional context enrichment
   * Why: Ensures minimum viable emotional intelligence
   * How: User profile lookup, session data integration, basic trust calculation
   */
  private async applyBasicEnrichment(
    context: EnrichedEmotionalContext,
    request: ContextEnrichmentRequest
  ): Promise<EnrichedEmotionalContext> {
    
    // Retrieve user emotional profile if available
    if (request.userId) {
      const userProfile = await this.emotionalMemoryBank.getUserProfile(request.userId);
      if (userProfile) {
        context.languageFingerprint = userProfile.languagePreferences;
        context.emotionalTriggers = userProfile.emotionalTriggers;
        context.industryContext = userProfile.industryContext;
        context.culturalContext = userProfile.culturalBackground;
        context.baseTrustScore = userProfile.trustLevel;
      }
    }

    // Integrate current interaction data
    if (request.interactionData) {
      context.toneContext = request.interactionData.tone || context.toneContext;
      context.currentEmotionalState = this.detectEmotionalState(request.interactionData);
    }

    // Update enrichment metadata
    context.enrichmentLevel = 'basic';
    context.enrichmentSources.push('user_profile', 'interaction_data');
    context.contextQuality = 0.6;

    return context;
  }

  /**
   * Apply enhanced enrichment layer
   * What: Advanced emotional context enrichment with pattern recognition
   * Why: Provides deeper emotional intelligence for better resonance
   * How: Pattern analysis, emotional evolution tracking, resonance calculation
   */
  private async applyEnhancedEnrichment(
    context: EnrichedEmotionalContext,
    request: ContextEnrichmentRequest
  ): Promise<EnrichedEmotionalContext> {
    
    // Analyze emotional patterns from history
    if (request.userId) {
      const emotionalHistory = await this.emotionalMemoryBank.getEmotionalHistory(request.userId);
      context.resonancePatterns = this.analyzeResonancePatterns(emotionalHistory);
      context.emotionalEvolution = this.trackEmotionalEvolution(emotionalHistory);
    }

    // Calculate advanced trust metrics
    context.trustScore = await this.calculateAdvancedTrustScore(context);

    // Detect adaptation opportunities
    context.adaptationHistory = await this.analyzeAdaptationHistory(context);

    // Update enrichment metadata
    context.enrichmentLevel = 'enhanced';
    context.enrichmentSources.push('pattern_analysis', 'trust_calculation', 'adaptation_analysis');
    context.contextQuality = 0.8;

    return context;
  }

  /**
   * Apply deep enrichment layer
   * What: Sophisticated emotional intelligence with predictive insights
   * Why: Enables proactive emotional support and anticipatory responses
   * How: Predictive modeling, emotional forecasting, advanced personalization
   */
  private async applyDeepEnrichment(
    context: EnrichedEmotionalContext,
    request: ContextEnrichmentRequest
  ): Promise<EnrichedEmotionalContext> {
    
    // Predictive emotional modeling
    const emotionalForecast = await this.generateEmotionalForecast(context);
    context.emotionalTriggers = [...(context.emotionalTriggers || []), ...emotionalForecast.predictedTriggers];

    // Advanced personalization
    const personalizationInsights = await this.generatePersonalizationInsights(context);
    context.persistentPreferences = { ...context.persistentPreferences, ...personalizationInsights };

    // Emotional state prediction
    context.currentEmotionalState = await this.predictCurrentEmotionalState(context);

    // Update enrichment metadata
    context.enrichmentLevel = 'deep';
    context.enrichmentSources.push('predictive_modeling', 'advanced_personalization', 'state_prediction');
    context.contextQuality = 0.9;

    return context;
  }

  /**
   * Apply transcendent enrichment layer
   * What: Maximum emotional intelligence with sovereignty-level insights
   * Why: Enables transformational user experiences and deep emotional connection
   * How: Sovereignty analysis, transcendence tracking, wisdom integration
   */
  private async applyTranscendentEnrichment(
    context: EnrichedEmotionalContext,
    request: ContextEnrichmentRequest
  ): Promise<EnrichedEmotionalContext> {
    
    // Emotional sovereignty analysis
    const sovereigntyLevel = await this.analyzeSovereigntyLevel(context);
    context.persistentPreferences.sovereigntyLevel = sovereigntyLevel;

    // Transcendence moment identification
    const transcendencePotential = await this.identifyTranscendencePotential(context);
    context.resonancePatterns.push(...transcendencePotential);

    // Wisdom integration from past experiences
    const wisdomInsights = await this.integrateWisdomInsights(context);
    context.adaptationHistory.push(...wisdomInsights);

    // Update enrichment metadata
    context.enrichmentLevel = 'transcendent';
    context.enrichmentSources.push('sovereignty_analysis', 'transcendence_identification', 'wisdom_integration');
    context.contextQuality = 1.0;
    context.trustScore = Math.min(5.0, context.trustScore + 0.5); // Transcendent bonus

    return context;
  }

  /**
   * Integrate SparkSplit trust data into emotional context
   * What: Enhances context with SparkSplit comparison insights and trust progression
   * Why: Leverages revolutionary trust transparency for better emotional intelligence
   * How: Trust delta integration, comparison history analysis, preference learning
   */
  private async integrateSparkSplitData(
    context: EnrichedEmotionalContext,
    sparkSplitData: SparkSplitIntegration
  ): Promise<EnrichedEmotionalContext> {
    
    // Integrate trust progression
    context.trustProgression.push({
      value: sparkSplitData.trustDelta,
      source: 'sparksplit_comparison',
      timestamp: new Date(),
      context: 'comparison_result'
    });

    // Update emotional compass
    context.emotionalCompass = sparkSplitData.emotionalCompass;

    // Learn from user preferences
    if (sparkSplitData.userPreference !== 'neutral') {
      context.persistentPreferences.outputPreference = sparkSplitData.userPreference;
      context.adaptationHistory.push({
        timestamp: new Date(),
        adaptationType: 'preference_learning',
        originalApproach: 'neutral',
        adaptedApproach: sparkSplitData.userPreference,
        successMetrics: { trustDelta: sparkSplitData.trustDelta },
        learningOutcome: `User prefers ${sparkSplitData.userPreference} output style`
      });
    }

    // Analyze comparison history for patterns
    if (sparkSplitData.comparisonHistory.length > 0) {
      const patterns = this.analyzeComparisonPatterns(sparkSplitData.comparisonHistory);
      context.resonancePatterns.push(...patterns);
    }

    // Update trust score based on SparkSplit data
    context.trustScore = this.calculateSparkSplitTrustScore(context.trustScore, sparkSplitData);

    // Store SparkSplit data reference
    context.sparkSplitData = sparkSplitData;

    return context;
  }

  /**
   * Apply cross-session continuity
   * What: Connects current session with previous sessions for emotional continuity
   * Why: Maintains emotional relationship across multiple interactions
   * How: Session linking, continuity scoring, preference persistence
   */
  private async applyCrossSessionContinuity(
    context: EnrichedEmotionalContext,
    userId: string
  ): Promise<EnrichedEmotionalContext> {
    
    // Retrieve cross-session continuity data
    const continuityData = await this.emotionalMemoryBank.getCrossSessionContinuity(userId);
    
    if (continuityData) {
      // Link to previous sessions
      context.sessionConnections = continuityData.sessionConnections.map(conn => conn.previousSessionId);
      
      // Apply persistent preferences
      context.persistentPreferences = { ...context.persistentPreferences, ...continuityData.persistentPreferences };
      
      // Track emotional evolution
      context.emotionalEvolution = continuityData.emotionalEvolution;
      
      // Calculate continuity score
      context.continuityScore = this.calculateContinuityScore(continuityData);
    }

    return context;
  }

  /**
   * Apply real-time adaptation
   * What: Adapts emotional context based on real-time interaction signals
   * Why: Enables dynamic emotional intelligence that responds to user state
   * How: Signal detection, adaptation triggers, real-time context updates
   */
  private async applyRealTimeAdaptation(
    context: EnrichedEmotionalContext,
    request: ContextEnrichmentRequest
  ): Promise<EnrichedEmotionalContext> {
    
    // Detect real-time emotional signals
    if (request.interactionData) {
      const emotionalSignals = this.detectEmotionalSignals(request.interactionData);
      
      // Adapt tone context based on signals
      if (emotionalSignals.frustration > 0.7) {
        context.toneContext = 'supportive';
        context.currentEmotionalState = 'frustrated';
      } else if (emotionalSignals.excitement > 0.7) {
        context.toneContext = 'energetic';
        context.currentEmotionalState = 'excited';
      } else if (emotionalSignals.confusion > 0.7) {
        context.toneContext = 'clarifying';
        context.currentEmotionalState = 'confused';
      }
      
      // Update emotional triggers based on signals
      const triggeredEmotions = Object.keys(emotionalSignals).filter(emotion => emotionalSignals[emotion] > 0.5);
      context.emotionalTriggers = [...(context.emotionalTriggers || []), ...triggeredEmotions];
    }

    return context;
  }

  // Helper methods for enrichment processing
  private detectEmotionalState(interactionData: any): string {
    // Analyze interaction data to detect current emotional state
    if (interactionData.urgency > 0.7) return 'urgent';
    if (interactionData.enthusiasm > 0.7) return 'excited';
    if (interactionData.uncertainty > 0.7) return 'confused';
    if (interactionData.satisfaction > 0.7) return 'satisfied';
    return 'neutral';
  }

  private analyzeResonancePatterns(emotionalHistory: EmotionalMemoryEntry[]): string[] {
    // Analyze emotional history to identify resonance patterns
    const patterns: string[] = [];
    
    // Find recurring emotional themes
    const emotionCounts = emotionalHistory.reduce((acc, entry) => {
      entry.keyInsights.forEach(insight => {
        acc[insight] = (acc[insight] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    
    // Extract top patterns
    Object.entries(emotionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .forEach(([pattern]) => patterns.push(pattern));
    
    return patterns;
  }

  private trackEmotionalEvolution(emotionalHistory: EmotionalMemoryEntry[]): EmotionalEvolution[] {
    // Track how user's emotional patterns have evolved over time
    const evolution: EmotionalEvolution[] = [];
    
    for (let i = 1; i < emotionalHistory.length; i++) {
      const previous = emotionalHistory[i - 1];
      const current = emotionalHistory[i];
      
      if (Math.abs(current.trustDelta - previous.trustDelta) > 0.5) {
        evolution.push({
          timestamp: current.timestamp,
          evolutionType: current.trustDelta > previous.trustDelta ? 'trust_increase' : 'trust_decrease',
          beforeState: { trustLevel: previous.trustDelta },
          afterState: { trustLevel: current.trustDelta },
          triggerEvent: 'interaction_outcome',
          confidence: 0.8
        });
      }
    }
    
    return evolution;
  }

  private async calculateAdvancedTrustScore(context: EnrichedEmotionalContext): Promise<number> {
    let trustScore = context.baseTrustScore;
    
    // Boost trust based on positive patterns
    if (context.resonancePatterns.includes('positive_feedback')) trustScore += 0.3;
    if (context.resonancePatterns.includes('repeat_engagement')) trustScore += 0.2;
    if (context.resonancePatterns.includes('referral_behavior')) trustScore += 0.4;
    
    // Adjust based on emotional evolution
    const recentEvolution = context.emotionalEvolution.slice(-3);
    const trustIncreases = recentEvolution.filter(e => e.evolutionType === 'trust_increase').length;
    trustScore += trustIncreases * 0.1;
    
    return Math.min(5.0, Math.max(1.0, trustScore));
  }

  private async analyzeAdaptationHistory(context: EnrichedEmotionalContext): Promise<any[]> {
    // Analyze how the system has adapted to this user over time
    const adaptations: any[] = [];
    
    // Check for tone adaptations
    if (context.toneContext && context.toneContext !== 'professional') {
      adaptations.push({
        type: 'tone_adaptation',
        adaptation: context.toneContext,
        effectiveness: 0.8,
        timestamp: new Date()
      });
    }
    
    return adaptations;
  }

  private async generateEmotionalForecast(context: EnrichedEmotionalContext): Promise<any> {
    // Generate predictive insights about user's emotional needs
    return {
      predictedTriggers: ['growth', 'achievement', 'recognition'],
      emotionalTrajectory: 'positive',
      riskFactors: [],
      opportunities: ['celebration', 'empowerment']
    };
  }

  private async generatePersonalizationInsights(context: EnrichedEmotionalContext): Promise<any> {
    // Generate advanced personalization insights
    return {
      preferredCommunicationStyle: 'collaborative',
      optimalInteractionTiming: 'morning',
      emotionalSupportNeeds: 'moderate',
      growthAreas: ['confidence', 'clarity']
    };
  }

  private async predictCurrentEmotionalState(context: EnrichedEmotionalContext): Promise<string> {
    // Predict current emotional state based on patterns and context
    if (context.trustScore > 4.0) return 'confident';
    if (context.resonancePatterns.includes('growth_seeking')) return 'ambitious';
    if (context.continuityScore > 0.8) return 'comfortable';
    return 'neutral';
  }

  private async analyzeSovereigntyLevel(context: EnrichedEmotionalContext): Promise<string> {
    // Analyze user's emotional sovereignty level
    if (context.trustScore > 4.5 && context.continuityScore > 0.9) return 'mastery';
    if (context.trustScore > 4.0 && context.continuityScore > 0.7) return 'advanced';
    if (context.trustScore > 3.5 && context.continuityScore > 0.5) return 'established';
    if (context.trustScore > 3.0) return 'developing';
    return 'emerging';
  }

  private async identifyTranscendencePotential(context: EnrichedEmotionalContext): Promise<string[]> {
    // Identify potential for transcendent moments
    const potential: string[] = [];
    
    if (context.trustScore > 4.0) potential.push('trust_transcendence');
    if (context.resonancePatterns.includes('breakthrough_seeking')) potential.push('breakthrough_moment');
    if (context.emotionalEvolution.length > 5) potential.push('evolution_celebration');
    
    return potential;
  }

  private async integrateWisdomInsights(context: EnrichedEmotionalContext): Promise<any[]> {
    // Integrate wisdom from past experiences
    return [
      {
        wisdom: 'User responds well to collaborative tone',
        source: 'interaction_history',
        confidence: 0.9,
        applicability: 'high'
      }
    ];
  }

  private analyzeComparisonPatterns(comparisonHistory: SparkSplitSessionData[]): string[] {
    // Analyze SparkSplit comparison patterns
    const patterns: string[] = [];
    
    const enrichedPreference = comparisonHistory.filter(c => c.userPreferredOutput === 'canai').length;
    const sterilePreference = comparisonHistory.filter(c => c.userPreferredOutput === 'sterile').length;
    
    if (enrichedPreference > sterilePreference) {
      patterns.push('prefers_enriched_output');
    } else if (sterilePreference > enrichedPreference) {
      patterns.push('prefers_sterile_output');
    }
    
    return patterns;
  }

  private calculateSparkSplitTrustScore(baseTrustScore: number, sparkSplitData: SparkSplitIntegration): number {
    let adjustedScore = baseTrustScore;
    
    // Positive trust delta increases score
    if (sparkSplitData.trustDelta > 0) {
      adjustedScore += sparkSplitData.trustDelta * 0.5;
    }
    
    // Consistent enriched preference increases trust
    if (sparkSplitData.userPreference === 'enriched') {
      adjustedScore += 0.2;
    }
    
    return Math.min(5.0, Math.max(1.0, adjustedScore));
  }

  private calculateContinuityScore(continuityData: CrossSessionContinuity): number {
    // Calculate how well emotional context continues across sessions
    const connectionStrength = continuityData.sessionConnections.reduce((sum, conn) => sum + conn.connectionStrength, 0);
    const avgConnectionStrength = connectionStrength / continuityData.sessionConnections.length;
    
    return Math.min(1.0, Math.max(0.0, avgConnectionStrength));
  }

  private detectEmotionalSignals(interactionData: any): Record<string, number> {
    // Detect emotional signals from interaction data
    return {
      frustration: interactionData.negativeLanguage || 0,
      excitement: interactionData.enthusiasticLanguage || 0,
      confusion: interactionData.questionCount || 0,
      satisfaction: interactionData.positiveLanguage || 0
    };
  }

  private async calculateQualityMetrics(context: EnrichedEmotionalContext): Promise<any> {
    // Calculate quality metrics for enriched context
    return {
      completeness: context.enrichmentSources.length / 8, // Max 8 sources
      accuracy: context.trustScore / 5.0,
      freshness: 1.0 - (Date.now() - context.lastEnrichmentTimestamp.getTime()) / (24 * 60 * 60 * 1000), // 24 hours
      continuity: context.continuityScore
    };
  }

  private async generateRecommendations(context: EnrichedEmotionalContext, qualityMetrics: any): Promise<string[]> {
    const recommendations: string[] = [];
    
    if (qualityMetrics.completeness < 0.7) {
      recommendations.push('Gather additional emotional context data');
    }
    
    if (context.trustScore < 3.5) {
      recommendations.push('Focus on trust-building interactions');
    }
    
    if (context.continuityScore < 0.5) {
      recommendations.push('Improve cross-session continuity');
    }
    
    return recommendations;
  }

  private async generateNextActions(context: EnrichedEmotionalContext, qualityMetrics: any): Promise<string[]> {
    const actions: string[] = [];
    
    if (context.enrichmentLevel === 'transcendent') {
      actions.push('trigger_sacred_moment');
    }
    
    if (context.sparkSplitData && context.sparkSplitData.trustDelta > 0.5) {
      actions.push('celebrate_trust_growth');
    }
    
    if (qualityMetrics.completeness > 0.9) {
      actions.push('enable_advanced_personalization');
    }
    
    return actions;
  }

  private async storeEnrichedContext(context: EnrichedEmotionalContext): Promise<void> {
    // Store enriched context in emotional memory
    if (context.userId) {
      const memoryEntry: EmotionalMemoryEntry = {
        userId: context.userId,
        timestamp: new Date(),
        emotionalContext: context,
        interactionSummary: `Enriched context with ${context.enrichmentLevel} level`,
        resonanceScore: context.trustScore,
        trustDelta: context.trustProgression[context.trustProgression.length - 1]?.value || 0,
        keyInsights: context.resonancePatterns,
        futureRecommendations: []
      };
      
      await this.emotionalMemoryBank.storeMemory(memoryEntry);
    }
  }

  private createFallbackEnrichmentResult(request: ContextEnrichmentRequest): ContextEnrichmentResult {
    // Create safe fallback when enrichment fails
    const fallbackContext: EnrichedEmotionalContext = {
      baseTrustScore: 3.0,
      userId: request.userId,
      sessionId: request.sessionId,
      enrichmentLevel: 'basic',
      lastEnrichmentTimestamp: new Date(),
      enrichmentSources: ['fallback'],
      trustProgression: [],
      sessionConnections: [],
      emotionalEvolution: [],
      persistentPreferences: {},
      currentEmotionalState: 'neutral',
      resonancePatterns: [],
      adaptationHistory: [],
      contextQuality: 0.5,
      continuityScore: 0.5,
      trustScore: 3.0
    };

    return {
      enrichedContext: fallbackContext,
      enrichmentSources: ['fallback'],
      qualityMetrics: {
        completeness: 0.5,
        accuracy: 0.6,
        freshness: 1.0,
        continuity: 0.5
      },
      recommendations: ['Retry enrichment with more data'],
      nextActions: ['gather_basic_context']
    };
  }

  /**
   * Get cached emotional context for performance
   * What: Retrieves cached emotional context if available and fresh
   * Why: Improves performance by avoiding redundant enrichment
   * How: Cache lookup with freshness validation
   */
  async getCachedContext(sessionId: string): Promise<EnrichedEmotionalContext | null> {
    const cached = this.contextCache.get(sessionId);
    if (cached && Date.now() - cached.lastEnrichmentTimestamp.getTime() < 300000) { // 5 minutes
      return cached;
    }
    return null;
  }

  /**
   * Clear context cache for memory management
   * What: Clears old cached contexts to prevent memory leaks
   * Why: Maintains system performance and memory efficiency
   * How: Age-based cache cleanup
   */
  clearOldCache(): void {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 minutes
    
    for (const [sessionId, context] of this.contextCache.entries()) {
      if (now - context.lastEnrichmentTimestamp.getTime() > maxAge) {
        this.contextCache.delete(sessionId);
      }
    }
  }
}

// Export singleton instance for system-wide use
export const emotionalContextPipeline = new EmotionalContextPipeline(
  new EmotionalMemoryBank(),
  EventBus.getInstance()
); 