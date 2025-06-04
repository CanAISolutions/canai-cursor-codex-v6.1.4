/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Emotional State Reconstructor"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Reconstruct emotional states from interaction traces and validate transitions
 */

export interface EmotionalStateReconstructorConfig {
  reconstructionDepth: 'basic' | 'complete' | 'transcendent';
  traceAnalysis: 'simple' | 'advanced' | 'quantum';
  emotionalMapping: boolean;
}

export interface InteractionTrace {
  timestamp: number;
  action: string;
  emotionalMarkers?: string[];
  trustIndicators?: {
    openness: number;
    vulnerability: number;
  };
  context: string;
}

export interface ReconstructedState {
  emotionalJourney: any[];
  currentEmotionalState: any;
  trustEvolution: any;
  reconstructionQuality: number;
  emotionalVelocity: number;
  predictedNextState: any;
  confidenceLevel?: number;
  inferredStates?: any[];
  dataCompleteness?: number;
}

export interface EmotionalTransition {
  from: string;
  to: string;
  intensity: number;
  timeGap: number;
}

export interface TransitionValidation {
  overallNaturalness: number;
  transitionAnalysis: any[];
  unnaturalTransitions: any[];
  emotionalCoherence: number;
  journeyValidity: boolean;
}

export class EmotionalStateReconstructor {
  private config: EmotionalStateReconstructorConfig;

  constructor(config: EmotionalStateReconstructorConfig) {
    this.config = config;
  }

  /**
   * Reconstruct emotional state from interaction traces
   */
  async reconstructFromTraces(traces: InteractionTrace[]): Promise<ReconstructedState> {
    // What: Analyze interaction traces to reconstruct emotional journey
    // Why: Enable understanding of emotional progression from behavioral data
    // How: Apply pattern recognition and emotional mapping algorithms

    const emotionalJourney = this.buildEmotionalJourney(traces);
    const currentEmotionalState = this.determineCurrentState(traces);
    const trustEvolution = this.analyzeTrustEvolution(traces);
    const reconstructionQuality = this.calculateReconstructionQuality(traces, emotionalJourney);
    const emotionalVelocity = this.calculateEmotionalVelocity(emotionalJourney);
    const predictedNextState = this.predictNextState(emotionalJourney);

    // Handle incomplete data
    const dataCompleteness = this.assessDataCompleteness(traces);
    const confidenceLevel = this.calculateConfidenceLevel(traces, dataCompleteness);
    const inferredStates = this.inferMissingStates(traces);

    return {
      emotionalJourney,
      currentEmotionalState,
      trustEvolution,
      reconstructionQuality,
      emotionalVelocity,
      predictedNextState,
      confidenceLevel,
      inferredStates,
      dataCompleteness
    };
  }

  /**
   * Validate emotional transitions for naturalness
   */
  async validateEmotionalTransitions(transitions: EmotionalTransition[]): Promise<TransitionValidation> {
    const transitionAnalysis = transitions.map(transition => this.analyzeTransition(transition));
    const unnaturalTransitions = transitionAnalysis.filter(analysis => analysis.naturalness < 0.6);
    const overallNaturalness = transitionAnalysis.reduce((sum, analysis) => sum + analysis.naturalness, 0) / transitionAnalysis.length;
    const emotionalCoherence = this.calculateEmotionalCoherence(transitions);
    const journeyValidity = overallNaturalness > 0.7 && emotionalCoherence > 0.8;

    return {
      overallNaturalness,
      transitionAnalysis,
      unnaturalTransitions,
      emotionalCoherence,
      journeyValidity
    };
  }

  // Private helper methods

  private buildEmotionalJourney(traces: InteractionTrace[]): any[] {
    return traces.map((trace, index) => {
      const emotionalState = this.extractEmotionalState(trace);
      const trustState = this.extractTrustState(trace);
      
      return {
        timestamp: trace.timestamp,
        action: trace.action,
        emotionalState,
        trustState,
        context: trace.context,
        sequenceIndex: index
      };
    });
  }

  private determineCurrentState(traces: InteractionTrace[]): any {
    if (traces.length === 0) {
      return { primaryEmotion: 'neutral', intensity: 0.5, confidence: 0.3 };
    }

    const lastTrace = traces[traces.length - 1];
    const emotionalMarkers = lastTrace.emotionalMarkers || [];
    
    // Determine primary emotion from markers
    const primaryEmotion = this.determinePrimaryEmotion(emotionalMarkers);
    const intensity = this.calculateEmotionalIntensity(lastTrace);
    const confidence = this.calculateStateConfidence(lastTrace);

    return {
      primaryEmotion,
      intensity,
      confidence,
      context: lastTrace.context,
      timestamp: lastTrace.timestamp
    };
  }

  private analyzeTrustEvolution(traces: InteractionTrace[]): any {
    const trustProgression = traces
      .filter(trace => trace.trustIndicators)
      .map(trace => ({
        timestamp: trace.timestamp,
        openness: trace.trustIndicators!.openness,
        vulnerability: trace.trustIndicators!.vulnerability,
        overallTrust: (trace.trustIndicators!.openness + trace.trustIndicators!.vulnerability) / 2
      }));

    if (trustProgression.length === 0) {
      return { direction: 'unknown', velocity: 0, currentLevel: 0.5 };
    }

    const direction = this.calculateTrustDirection(trustProgression);
    const velocity = this.calculateTrustVelocity(trustProgression);
    const currentLevel = trustProgression[trustProgression.length - 1].overallTrust;

    return {
      direction,
      velocity,
      currentLevel,
      progression: trustProgression
    };
  }

  private calculateReconstructionQuality(traces: InteractionTrace[], journey: any[]): number {
    // Base quality on data completeness and consistency
    const dataCompleteness = this.assessDataCompleteness(traces);
    const journeyConsistency = this.assessJourneyConsistency(journey);
    const temporalCoherence = this.assessTemporalCoherence(traces);
    
    return (dataCompleteness + journeyConsistency + temporalCoherence) / 3;
  }

  private calculateEmotionalVelocity(journey: any[]): number {
    if (journey.length < 2) return 0;

    const emotionalChanges = [];
    for (let i = 1; i < journey.length; i++) {
      const prev = journey[i - 1];
      const curr = journey[i];
      
      const emotionalDistance = this.calculateEmotionalDistance(
        prev.emotionalState,
        curr.emotionalState
      );
      
      const timeGap = curr.timestamp - prev.timestamp;
      const velocity = emotionalDistance / (timeGap / 1000); // per second
      
      emotionalChanges.push(velocity);
    }

    return emotionalChanges.reduce((sum, v) => sum + v, 0) / emotionalChanges.length;
  }

  private predictNextState(journey: any[]): any {
    if (journey.length === 0) {
      return { emotion: 'neutral', intensity: 0.5, confidence: 0.3 };
    }

    const currentState = journey[journey.length - 1].emotionalState;
    const emotionalTrend = this.calculateEmotionalTrend(journey);
    
    // Predict based on current emotion and trend
    const nextEmotion = this.predictNextEmotion(currentState.primaryEmotion, emotionalTrend);
    const nextIntensity = this.predictNextIntensity(currentState.intensity, emotionalTrend);
    
    return {
      emotion: nextEmotion,
      intensity: nextIntensity,
      confidence: 0.75,
      predictionBasis: 'trend_analysis'
    };
  }

  private assessDataCompleteness(traces: InteractionTrace[]): number {
    if (traces.length === 0) return 0;

    // Check for significant gaps in trace data
    if (traces.length < 3) {
      return 0.4; // Incomplete data with gaps
    }

    let completenessScore = 0;
    let totalFields = 0;

    traces.forEach(trace => {
      totalFields += 4; // action, emotionalMarkers, trustIndicators, context
      
      if (trace.action) completenessScore += 1;
      if (trace.emotionalMarkers && trace.emotionalMarkers.length > 0) completenessScore += 1;
      if (trace.trustIndicators) completenessScore += 1;
      if (trace.context) completenessScore += 1;
    });

    return completenessScore / totalFields;
  }

  private calculateConfidenceLevel(traces: InteractionTrace[], dataCompleteness: number): number {
    const traceCount = traces.length;
    const countScore = Math.min(traceCount / 5, 1); // Optimal at 5+ traces
    const qualityScore = dataCompleteness;
    const temporalScore = this.assessTemporalDistribution(traces);
    
    return (countScore + qualityScore + temporalScore) / 3;
  }

  private inferMissingStates(traces: InteractionTrace[]): any[] {
    const inferredStates: any[] = [];
    
    for (let i = 1; i < traces.length; i++) {
      const prev = traces[i - 1];
      const curr = traces[i];
      const timeGap = curr.timestamp - prev.timestamp;
      
      // If there's a significant time gap, infer intermediate states
      if (timeGap > 5000) { // 5 seconds
        const inferredState = this.inferIntermediateState(prev, curr);
        inferredStates.push(inferredState);
      }
    }
    
    return inferredStates;
  }

  private analyzeTransition(transition: EmotionalTransition): any {
    const naturalness = this.calculateTransitionNaturalness(transition);
    const significance = this.calculateTransitionSignificance(transition);
    const transitionType = this.classifyTransition(transition);
    
    return {
      from: transition.from,
      to: transition.to,
      naturalness,
      significance,
      transitionType,
      timeGap: transition.timeGap,
      intensity: transition.intensity
    };
  }

  private calculateEmotionalCoherence(transitions: EmotionalTransition[]): number {
    // Measure overall coherence of emotional journey
    const coherenceScores = transitions.map(transition => 
      this.calculateTransitionNaturalness(transition)
    );
    
    return coherenceScores.reduce((sum, score) => sum + score, 0) / coherenceScores.length;
  }

  private extractEmotionalState(trace: InteractionTrace): any {
    const markers = trace.emotionalMarkers || [];
    const primaryEmotion = this.determinePrimaryEmotion(markers);
    const intensity = this.calculateEmotionalIntensity(trace);
    
    return {
      primaryEmotion,
      intensity,
      markers,
      confidence: markers.length > 0 ? 0.8 : 0.4
    };
  }

  private extractTrustState(trace: InteractionTrace): any {
    if (!trace.trustIndicators) {
      return { openness: 0.5, vulnerability: 0.5, overall: 0.5, confidence: 0.3 };
    }
    
    const { openness, vulnerability } = trace.trustIndicators;
    const overall = (openness + vulnerability) / 2;
    
    return {
      openness,
      vulnerability,
      overall,
      confidence: 0.8
    };
  }

  private determinePrimaryEmotion(markers: string[]): string {
    if (markers.length === 0) return 'neutral';
    
    // Priority-based emotion selection
    const emotionPriority: Record<string, number> = {
      'breakthrough': 10,
      'excited': 9,
      'accomplished': 9,
      'satisfied': 8,
      'confident': 8,
      'frustrated': 7,
      'interested': 6,
      'curious': 6,
      'engaged': 5,
      'cautious': 4,
      'grateful': 4,
      'determined': 5,
      'confusion': 4,
      'uncertainty': 2,
      'neutral': 1
    };
    
    const prioritizedEmotions = markers
      .filter(marker => emotionPriority[marker])
      .sort((a, b) => emotionPriority[b] - emotionPriority[a]);
    
    return prioritizedEmotions[0] || 'neutral';
  }

  private calculateEmotionalIntensity(trace: InteractionTrace): number {
    const markers = trace.emotionalMarkers || [];
    
    // Base intensity on number and type of emotional markers
    const intensityMap: Record<string, number> = {
      'breakthrough': 0.95,
      'excitement': 0.9,
      'frustration': 0.8,
      'confidence': 0.8,
      'curiosity': 0.7,
      'satisfaction': 0.75,
      'confusion': 0.6,
      'engagement': 0.7,
      'uncertainty': 0.5,
      'neutral': 0.5
    };
    
    if (markers.length === 0) return 0.5;
    
    const intensities = markers.map(marker => intensityMap[marker] || 0.5);
    return intensities.reduce((sum, intensity) => sum + intensity, 0) / intensities.length;
  }

  private calculateStateConfidence(trace: InteractionTrace): number {
    const hasEmotionalMarkers = trace.emotionalMarkers && trace.emotionalMarkers.length > 0;
    const hasTrustIndicators = !!trace.trustIndicators;
    const hasContext = !!trace.context;
    
    let confidence = 0.3; // Base confidence
    if (hasEmotionalMarkers) confidence += 0.4;
    if (hasTrustIndicators) confidence += 0.2;
    if (hasContext) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  private calculateTrustDirection(progression: any[]): string {
    if (progression.length < 2) return 'stable';
    
    const first = progression[0].overallTrust;
    const last = progression[progression.length - 1].overallTrust;
    const change = last - first;
    
    if (change > 0.1) return 'ascending';
    if (change < -0.1) return 'descending';
    return 'stable';
  }

  private calculateTrustVelocity(progression: any[]): number {
    if (progression.length < 2) return 0;
    
    const changes = [];
    for (let i = 1; i < progression.length; i++) {
      const prev = progression[i - 1];
      const curr = progression[i];
      const change = curr.overallTrust - prev.overallTrust;
      const timeGap = curr.timestamp - prev.timestamp;
      changes.push(change / (timeGap / 1000)); // per second
    }
    
    return changes.reduce((sum, change) => sum + change, 0) / changes.length;
  }

  private assessJourneyConsistency(journey: any[]): number {
    // Measure consistency of emotional progression
    if (journey.length < 2) return 0.8;
    
    let consistencyScore = 0.8;
    
    for (let i = 1; i < journey.length; i++) {
      const prev = journey[i - 1];
      const curr = journey[i];
      
      const transition = {
        from: prev.emotionalState.primaryEmotion,
        to: curr.emotionalState.primaryEmotion,
        intensity: curr.emotionalState.intensity,
        timeGap: curr.timestamp - prev.timestamp
      };
      
      const naturalness = this.calculateTransitionNaturalness(transition);
      consistencyScore = (consistencyScore + naturalness) / 2;
    }
    
    return consistencyScore;
  }

  private assessTemporalCoherence(traces: InteractionTrace[]): number {
    if (traces.length < 2) return 0.8;
    
    // Check for reasonable temporal distribution
    const timeGaps = [];
    for (let i = 1; i < traces.length; i++) {
      timeGaps.push(traces[i].timestamp - traces[i - 1].timestamp);
    }
    
    const avgGap = timeGaps.reduce((sum, gap) => sum + gap, 0) / timeGaps.length;
    const maxReasonableGap = 30000; // 30 seconds
    
    return Math.min(maxReasonableGap / avgGap, 1.0);
  }

  private calculateEmotionalDistance(state1: any, state2: any): number {
    // Calculate distance between emotional states
    const emotionDistance = state1.primaryEmotion === state2.primaryEmotion ? 0 : 0.5;
    const intensityDistance = Math.abs(state1.intensity - state2.intensity);
    
    return (emotionDistance + intensityDistance) / 2;
  }

  private calculateEmotionalTrend(journey: any[]): string {
    if (journey.length < 3) return 'stable';
    
    const recentJourney = journey.slice(-3);
    const intensities = recentJourney.map(j => j.emotionalState.intensity);
    
    const trend = intensities[intensities.length - 1] - intensities[0];
    
    if (trend > 0.1) return 'ascending';
    if (trend < -0.1) return 'descending';
    return 'stable';
  }

  private predictNextEmotion(currentEmotion: string, trend: string): string {
    const emotionProgression: Record<string, Record<string, string>> = {
      'curiosity': { 'ascending': 'engagement', 'stable': 'curiosity', 'descending': 'uncertainty' },
      'confusion': { 'ascending': 'understanding', 'stable': 'confusion', 'descending': 'frustration' },
      'frustration': { 'ascending': 'determination', 'stable': 'frustration', 'descending': 'overwhelm' },
      'understanding': { 'ascending': 'confidence', 'stable': 'understanding', 'descending': 'uncertainty' },
      'confidence': { 'ascending': 'mastery', 'stable': 'confidence', 'descending': 'doubt' }
    };
    
    return emotionProgression[currentEmotion]?.[trend] || currentEmotion;
  }

  private predictNextIntensity(currentIntensity: number, trend: string): number {
    const trendAdjustment: Record<string, number> = {
      'ascending': 0.1,
      'stable': 0,
      'descending': -0.1
    };
    
    const adjustment = trendAdjustment[trend] || 0;
    return Math.max(0.1, Math.min(1.0, currentIntensity + adjustment));
  }

  private assessTemporalDistribution(traces: InteractionTrace[]): number {
    if (traces.length < 2) return 0.5;
    
    const timeSpan = traces[traces.length - 1].timestamp - traces[0].timestamp;
    const avgInterval = timeSpan / (traces.length - 1);
    
    // Optimal interval is around 2-5 seconds
    const optimalInterval = 3000;
    const score = Math.exp(-Math.abs(avgInterval - optimalInterval) / optimalInterval);
    
    return score;
  }

  private inferIntermediateState(prev: InteractionTrace, curr: InteractionTrace): any {
    const intermediateTimestamp = prev.timestamp + (curr.timestamp - prev.timestamp) / 2;
    
    // Infer emotional state based on transition
    const prevEmotion = this.determinePrimaryEmotion(prev.emotionalMarkers || []);
    const currEmotion = this.determinePrimaryEmotion(curr.emotionalMarkers || []);
    
    const inferredEmotion = this.inferTransitionEmotion(prevEmotion, currEmotion);
    
    return {
      timestamp: intermediateTimestamp,
      emotion: inferredEmotion,
      intensity: 0.6,
      confidence: 0.4,
      inferred: true
    };
  }

  private calculateTransitionNaturalness(transition: EmotionalTransition): number {
    // Define natural emotional transitions
    const naturalTransitions: Record<string, string[]> = {
      'neutral': ['curious', 'engagement', 'uncertainty'],
      'curious': ['interested', 'confusion', 'excitement'],
      'interested': ['frustrated', 'engaged', 'excited'],
      'frustrated': ['excited', 'determined', 'understanding', 'overwhelm'],
      'excited': ['satisfied', 'accomplished', 'confident'],
      'satisfied': ['confident', 'accomplished', 'grateful'],
      'accomplished': ['satisfied', 'confident', 'grateful'],
      'confident': ['mastery', 'satisfied', 'excited'],
      'understanding': ['confident', 'satisfied', 'curious'],
      'confusion': ['frustrated', 'understanding', 'curious'],
      'determination': ['accomplished', 'understanding', 'confident']
    };
    
    const naturalNext = naturalTransitions[transition.from] || [];
    const isNatural = naturalNext.includes(transition.to);
    
    let naturalness = isNatural ? 0.85 : 0.6; // More generous base scoring
    
    // Adjust for intensity and time gap
    if (transition.intensity > 0.8) naturalness += 0.1;
    if (transition.timeGap < 5000) naturalness += 0.05; // Quick transitions are more natural
    
    // Special case for breakthrough transitions
    if (transition.to === 'excited' && transition.from === 'frustrated') {
      naturalness = 0.9; // Breakthrough moment is very natural
    }
    
    return Math.min(naturalness, 1.0);
  }

  private calculateTransitionSignificance(transition: EmotionalTransition): number {
    // Breakthrough transitions are highly significant
    if (transition.to === 'breakthrough' || transition.to === 'understanding') {
      return 0.9;
    }
    
    // Large intensity changes are significant
    if (transition.intensity > 0.8) {
      return 0.8;
    }
    
    return 0.5;
  }

  private classifyTransition(transition: EmotionalTransition): string {
    if (transition.to === 'breakthrough' || transition.to === 'understanding') {
      return 'breakthrough';
    }
    
    if (transition.from === 'frustration' && transition.to === 'understanding') {
      return 'breakthrough';
    }
    
    if (transition.intensity > 0.8) {
      return 'significant';
    }
    
    return 'normal';
  }

  private inferTransitionEmotion(fromEmotion: string, toEmotion: string): string {
    // Infer intermediate emotion in transition
    const transitionMap: Record<string, Record<string, string>> = {
      'curiosity': { 'understanding': 'engagement', 'confusion': 'uncertainty' },
      'confusion': { 'understanding': 'clarity', 'frustration': 'struggle' },
      'frustration': { 'understanding': 'breakthrough', 'confidence': 'relief' }
    };
    
    return transitionMap[fromEmotion]?.[toEmotion] || 'transitioning';
  }
} 