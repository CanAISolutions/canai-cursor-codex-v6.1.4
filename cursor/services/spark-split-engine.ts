/**
 * SparkSplit: Codex Canonical Experience Blueprint (v7.2.0)
 * Classification: Immutable Emotional Trust Engine
 * Purpose: Transparent, non-coercive comparison fostering trust through demonstration
 */

import { EmotionalContext, TrustDelta, SparkConcept } from '../types/emotional-sovereignty';
import { ReversalTestAutomator } from '../validators/reversal-test-automator';
import { SacredMomentsOrchestrator } from './sacred-moments-orchestrator';
import { EmotionalMemoryBank } from '../ai-memories/emotional-memory-bank';

export interface SparkSplitInput {
  prompt: string;
  sessionId: string;
  userId: string;
  toneContext: string;
  sparkConcept: SparkConcept;
  emotionalContext: EmotionalContext;
  canaiOutput: string;
}

export interface SparkSplitOutput {
  sterileOutput: string;
  canaiOutput: string;
  emotionalCompass: EmotionalCompassVisualization;
  trustDelta: number;
  comparisonMetrics: ComparisonMetrics;
  sessionData: SparkSplitSessionData;
}

export interface EmotionalCompassVisualization {
  awe: number;
  ownership: number;
  wonder: number;
  calm: number;
  power: number;
  dominantAxis: string;
  colorGradient: string;
  accessibleLabel: string;
}

export interface ComparisonMetrics {
  aweScore: number;
  ownershipScore: number;
  wonderScore: number;
  toneConsistencyScore: number;
  emotionalImpactScore: number;
  sparkResonanceScore: number;
}

export interface SparkSplitSessionData {
  prompt: string;
  sessionId: string;
  userId: string;
  promptTimestamp: Date;
  sterileOutput: string;
  canaiOutput: string;
  toneContext: string;
  sparkConcept: string;
  trustDelta: number;
  comparisonMetrics: ComparisonMetrics;
  userPreferredOutput?: 'sterile' | 'canai' | 'both' | 'neither' | 'skip';
  finalFeedbackText?: string;
  userRecoveryApproval?: boolean;
  recoveredTrustDelta?: number;
  emotionalSatisfactionScore?: number;
  wouldRefer?: boolean;
  sharedOutput?: boolean;
  sharedOutputReason?: string;
  skippedComparison?: boolean;
  fallbackTriggered: boolean;
  fallbackMessage?: string;
}

export class SparkSplitEngine {
  private reversalTestAutomator: ReversalTestAutomator;
  private sacredMomentsOrchestrator: SacredMomentsOrchestrator;
  private emotionalMemoryBank: EmotionalMemoryBank;
  private circuitBreakerThreshold = 1.0;
  private circuitBreakerSessionCount = 50;

  constructor(
    reversalTestAutomator: ReversalTestAutomator,
    sacredMomentsOrchestrator: SacredMomentsOrchestrator,
    emotionalMemoryBank: EmotionalMemoryBank
  ) {
    this.reversalTestAutomator = reversalTestAutomator;
    this.sacredMomentsOrchestrator = sacredMomentsOrchestrator;
    this.emotionalMemoryBank = emotionalMemoryBank;
  }

  /**
   * Generate SparkSplit comparison after paid product delivery
   * Triggers as post-fulfillment sacred moment
   */
  async generateSparkSplit(input: SparkSplitInput): Promise<SparkSplitOutput> {
    try {
      // Check circuit breaker status
      const circuitBreakerStatus = await this.checkCircuitBreaker();
      if (!circuitBreakerStatus.isHealthy) {
        throw new Error(`SparkSplit temporarily unavailable: ${circuitBreakerStatus.message}`);
      }

      // Generate sterile baseline output
      const sterileOutput = await this.generateSterileOutput(input.prompt);

      // Calculate emotional compass visualization
      const emotionalCompass = await this.generateEmotionalCompass(
        input.emotionalContext,
        input.toneContext,
        input.sparkConcept
      );

      // Calculate comparison metrics
      const comparisonMetrics = await this.calculateComparisonMetrics(
        sterileOutput,
        input.canaiOutput,
        input.emotionalContext,
        input.toneContext
      );

      // Calculate trust delta
      const trustDelta = await this.calculateTrustDelta(
        comparisonMetrics,
        input.emotionalContext
      );

      // Validate outputs meet sovereignty standards
      const reversalTestResult = await this.reversalTestAutomator.validateInteraction(
        input.prompt,
        input.canaiOutput,
        input.emotionalContext
      );

      if (!reversalTestResult.passed) {
        throw new Error(`CanAI output failed reversal test: ${reversalTestResult.failureReason}`);
      }

      // Create session data for logging
      const sessionData: SparkSplitSessionData = {
        prompt: input.prompt,
        sessionId: input.sessionId,
        userId: input.userId,
        promptTimestamp: new Date(),
        sterileOutput,
        canaiOutput: input.canaiOutput,
        toneContext: input.toneContext,
        sparkConcept: input.sparkConcept.name,
        trustDelta,
        comparisonMetrics,
        fallbackTriggered: false
      };

      // Trigger sacred moment for SparkSplit revelation
      await this.sacredMomentsOrchestrator.orchestrateSacredMoment(
        'spark_revelation',
        input.emotionalContext,
        { sparkSplitData: sessionData }
      );

      return {
        sterileOutput,
        canaiOutput: input.canaiOutput,
        emotionalCompass,
        trustDelta,
        comparisonMetrics,
        sessionData
      };

    } catch (error) {
      // Graceful fallback with emotional dignity
      return await this.handleSparkSplitFailure(input, error);
    }
  }

  /**
   * Generate sterile baseline output mimicking generic GPT-3.5/4o
   * Stripped of emotional context and personalization
   */
  private async generateSterileOutput(prompt: string): Promise<string> {
    // Simulate generic AI response by:
    // 1. Removing emotional context
    // 2. Using standard templates
    // 3. Avoiding personalization
    // 4. Maintaining factual accuracy but losing emotional resonance

    const sterilePrompt = `Provide a direct, factual response to: ${prompt}`;
    
    // This would integrate with a basic AI model or use stripped-down processing
    // For now, we'll create a template-based sterile response
    return await this.generateBasicResponse(sterilePrompt);
  }

  /**
   * Generate basic response without emotional enrichment
   */
  private async generateBasicResponse(prompt: string): Promise<string> {
    // This would call a basic AI model or use template responses
    // Implementation would depend on available AI services
    return `Here's a straightforward response to your request: [Basic AI processing of: ${prompt}]`;
  }

  /**
   * Generate emotional compass visualization based on tone and context
   */
  private async generateEmotionalCompass(
    emotionalContext: EmotionalContext,
    toneContext: string,
    sparkConcept: SparkConcept
  ): Promise<EmotionalCompassVisualization> {
    
    // Calculate emotional axis scores based on tone and context
    const awe = this.calculateAxisScore('awe', toneContext, emotionalContext);
    const ownership = this.calculateAxisScore('ownership', toneContext, emotionalContext);
    const wonder = this.calculateAxisScore('wonder', toneContext, emotionalContext);
    const calm = this.calculateAxisScore('calm', toneContext, emotionalContext);
    const power = this.calculateAxisScore('power', toneContext, emotionalContext);

    // Determine dominant axis
    const scores = { awe, ownership, wonder, calm, power };
    const dominantAxis = Object.keys(scores).reduce((a, b) => 
      scores[a] > scores[b] ? a : b
    );

    // Generate color gradient based on dominant emotion
    const colorGradient = this.getEmotionalColorGradient(dominantAxis, toneContext);

    return {
      awe,
      ownership,
      wonder,
      calm,
      power,
      dominantAxis,
      colorGradient,
      accessibleLabel: `This output aims to connect with you emotionally through ${dominantAxis} and ${toneContext} tone, based on your unique style and prompt.`
    };
  }

  /**
   * Calculate individual emotional axis score
   */
  private calculateAxisScore(
    axis: string,
    toneContext: string,
    emotionalContext: EmotionalContext
  ): number {
    let baseScore = 3.0; // Neutral baseline

    // Tone-based adjustments
    const toneAdjustments = {
      'calm': { calm: 2.0, wonder: 0.5 },
      'bold': { power: 2.0, awe: 1.0 },
      'playful': { wonder: 2.0, ownership: 1.0 },
      'luxury': { awe: 1.5, power: 1.5 },
      'supportive': { calm: 1.5, ownership: 1.0 },
      'strategic': { power: 1.5, ownership: 1.0 }
    };

    if (toneAdjustments[toneContext] && toneAdjustments[toneContext][axis]) {
      baseScore += toneAdjustments[toneContext][axis];
    }

    // Emotional context adjustments
    if (emotionalContext.emotionalTriggers?.includes(axis)) {
      baseScore += 1.0;
    }

    if (emotionalContext.baseTrustScore > 4.0) {
      baseScore += 0.5; // Higher trust enables stronger emotional connection
    }

    return Math.min(5.0, Math.max(1.0, baseScore));
  }

  /**
   * Get color gradient for emotional visualization
   */
  private getEmotionalColorGradient(dominantAxis: string, toneContext: string): string {
    const gradients = {
      'awe': 'radial-gradient(circle, rgba(255,215,0,0.1) 0%, rgba(255,215,0,0.05) 100%)', // Gold
      'ownership': 'radial-gradient(circle, rgba(76,175,80,0.1) 0%, rgba(76,175,80,0.05) 100%)', // Green
      'wonder': 'radial-gradient(circle, rgba(156,39,176,0.1) 0%, rgba(156,39,176,0.05) 100%)', // Purple
      'calm': 'radial-gradient(circle, rgba(33,150,243,0.1) 0%, rgba(33,150,243,0.05) 100%)', // Blue
      'power': 'radial-gradient(circle, rgba(244,67,54,0.1) 0%, rgba(244,67,54,0.05) 100%)' // Red
    };

    return gradients[dominantAxis] || gradients['calm'];
  }

  /**
   * Calculate comprehensive comparison metrics
   */
  private async calculateComparisonMetrics(
    sterileOutput: string,
    canaiOutput: string,
    emotionalContext: EmotionalContext,
    toneContext: string
  ): Promise<ComparisonMetrics> {
    
    // Analyze emotional resonance in CanAI output vs sterile
    const aweScore = await this.analyzeEmotionalResonance(canaiOutput, 'awe');
    const ownershipScore = await this.analyzeEmotionalResonance(canaiOutput, 'ownership');
    const wonderScore = await this.analyzeEmotionalResonance(canaiOutput, 'wonder');
    
    // Analyze tone consistency
    const toneConsistencyScore = await this.analyzeToneConsistency(canaiOutput, toneContext);
    
    // Calculate emotional impact differential
    const emotionalImpactScore = await this.calculateEmotionalImpact(
      sterileOutput,
      canaiOutput,
      emotionalContext
    );
    
    // Measure spark resonance (personalization effectiveness)
    const sparkResonanceScore = await this.measureSparkResonance(
      canaiOutput,
      emotionalContext
    );

    return {
      aweScore,
      ownershipScore,
      wonderScore,
      toneConsistencyScore,
      emotionalImpactScore,
      sparkResonanceScore
    };
  }

  /**
   * Analyze emotional resonance in output
   */
  private async analyzeEmotionalResonance(output: string, emotion: string): Promise<number> {
    // Analyze language patterns, word choice, and emotional triggers
    // This would use NLP analysis to detect emotional resonance
    
    const emotionalKeywords = {
      'awe': ['amazing', 'incredible', 'extraordinary', 'breathtaking', 'magnificent'],
      'ownership': ['your', 'yours', 'you', 'personal', 'unique', 'individual'],
      'wonder': ['discover', 'explore', 'imagine', 'possibility', 'potential']
    };

    const keywords = emotionalKeywords[emotion] || [];
    const matches = keywords.filter(keyword => 
      output.toLowerCase().includes(keyword.toLowerCase())
    ).length;

    // Base score + keyword matches + contextual analysis
    return Math.min(5.0, 3.0 + (matches * 0.3));
  }

  /**
   * Analyze tone consistency with requested tone
   */
  private async analyzeToneConsistency(output: string, requestedTone: string): Promise<number> {
    // Analyze if output matches requested tone
    // This would use tone analysis algorithms
    
    const toneIndicators = {
      'calm': ['peaceful', 'gentle', 'steady', 'balanced', 'serene'],
      'bold': ['powerful', 'strong', 'confident', 'decisive', 'impactful'],
      'playful': ['fun', 'creative', 'energetic', 'vibrant', 'dynamic'],
      'luxury': ['premium', 'exclusive', 'sophisticated', 'elegant', 'refined'],
      'supportive': ['helpful', 'encouraging', 'understanding', 'caring', 'supportive'],
      'strategic': ['strategic', 'analytical', 'systematic', 'methodical', 'planned']
    };

    const indicators = toneIndicators[requestedTone] || [];
    const matches = indicators.filter(indicator => 
      output.toLowerCase().includes(indicator.toLowerCase())
    ).length;

    return Math.min(5.0, 3.0 + (matches * 0.4));
  }

  /**
   * Calculate emotional impact differential between outputs
   */
  private async calculateEmotionalImpact(
    sterileOutput: string,
    canaiOutput: string,
    emotionalContext: EmotionalContext
  ): Promise<number> {
    // Compare emotional language density, personalization, and resonance
    const sterileEmotionalWords = this.countEmotionalWords(sterileOutput);
    const canaiEmotionalWords = this.countEmotionalWords(canaiOutput);
    
    const personalizedElements = this.countPersonalizedElements(canaiOutput);
    const contextualReferences = this.countContextualReferences(canaiOutput, emotionalContext);
    
    // Calculate impact score based on enhancement over sterile baseline
    const emotionalEnhancement = (canaiEmotionalWords - sterileEmotionalWords) / Math.max(1, sterileEmotionalWords);
    const personalizationScore = personalizedElements * 0.5;
    const contextualScore = contextualReferences * 0.3;
    
    return Math.min(5.0, 3.0 + emotionalEnhancement + personalizationScore + contextualScore);
  }

  /**
   * Count emotional words in text
   */
  private countEmotionalWords(text: string): number {
    const emotionalWords = [
      'feel', 'emotion', 'heart', 'soul', 'passion', 'love', 'joy', 'excitement',
      'inspire', 'motivate', 'empower', 'transform', 'amazing', 'incredible',
      'beautiful', 'wonderful', 'fantastic', 'brilliant', 'outstanding'
    ];
    
    return emotionalWords.filter(word => 
      text.toLowerCase().includes(word.toLowerCase())
    ).length;
  }

  /**
   * Count personalized elements in text
   */
  private countPersonalizedElements(text: string): number {
    const personalizedIndicators = [
      'your', 'you', 'yours', 'personal', 'unique', 'individual',
      'specifically', 'tailored', 'customized', 'designed for you'
    ];
    
    return personalizedIndicators.filter(indicator => 
      text.toLowerCase().includes(indicator.toLowerCase())
    ).length;
  }

  /**
   * Count contextual references based on emotional context
   */
  private countContextualReferences(text: string, emotionalContext: EmotionalContext): number {
    let count = 0;
    
    // Check for industry-specific language
    if (emotionalContext.industryContext && 
        text.toLowerCase().includes(emotionalContext.industryContext.toLowerCase())) {
      count++;
    }
    
    // Check for emotional trigger references
    if (emotionalContext.emotionalTriggers) {
      count += emotionalContext.emotionalTriggers.filter(trigger => 
        text.toLowerCase().includes(trigger.toLowerCase())
      ).length;
    }
    
    return count;
  }

  /**
   * Measure spark resonance (personalization effectiveness)
   */
  private async measureSparkResonance(
    output: string,
    emotionalContext: EmotionalContext
  ): Promise<number> {
    // Measure how well output resonates with user's emotional fingerprint
    let resonanceScore = 3.0; // Base score
    
    // Language fingerprint matching
    if (emotionalContext.languageFingerprint) {
      const languageMatches = this.analyzeLanguageFingerprint(output, emotionalContext.languageFingerprint);
      resonanceScore += languageMatches * 0.5;
    }
    
    // Past success pattern matching
    if (emotionalContext.pastSuccessPatterns) {
      const patternMatches = this.analyzeSuccessPatterns(output, emotionalContext.pastSuccessPatterns);
      resonanceScore += patternMatches * 0.3;
    }
    
    // Trust level adjustment
    if (emotionalContext.baseTrustScore > 4.0) {
      resonanceScore += 0.5;
    }
    
    return Math.min(5.0, resonanceScore);
  }

  /**
   * Analyze language fingerprint matching
   */
  private analyzeLanguageFingerprint(output: string, languageFingerprint: any): number {
    // This would analyze writing style, vocabulary, sentence structure
    // For now, return a simulated score
    return Math.random() * 2; // 0-2 points for language matching
  }

  /**
   * Analyze success pattern matching
   */
  private analyzeSuccessPatterns(output: string, successPatterns: any[]): number {
    // This would analyze if output follows patterns that worked well before
    // For now, return a simulated score
    return Math.random() * 1.5; // 0-1.5 points for pattern matching
  }

  /**
   * Calculate trust delta between sterile and CanAI output
   */
  private async calculateTrustDelta(
    metrics: ComparisonMetrics,
    emotionalContext: EmotionalContext
  ): Promise<number> {
    // Weight different metrics based on importance
    const weights = {
      emotional: 0.3,
      personalization: 0.25,
      tone: 0.2,
      resonance: 0.15,
      context: 0.1
    };
    
    const emotionalScore = (metrics.aweScore + metrics.ownershipScore + metrics.wonderScore) / 3;
    const personalizationScore = metrics.sparkResonanceScore;
    const toneScore = metrics.toneConsistencyScore;
    const resonanceScore = metrics.emotionalImpactScore;
    const contextScore = emotionalContext.baseTrustScore;
    
    const weightedScore = 
      (emotionalScore * weights.emotional) +
      (personalizationScore * weights.personalization) +
      (toneScore * weights.tone) +
      (resonanceScore * weights.resonance) +
      (contextScore * weights.context);
    
    // Trust delta is improvement over baseline (3.0)
    return Math.max(0, weightedScore - 3.0);
  }

  /**
   * Handle user selection and feedback
   */
  async handleUserSelection(
    sessionData: SparkSplitSessionData,
    selection: 'sterile' | 'canai' | 'both' | 'neither' | 'skip',
    feedback?: {
      testimonialContent?: string;
      allowedForUse?: boolean;
      emotionType?: string;
      emotionalSatisfactionScore?: number;
      wouldRefer?: boolean;
      finalFeedbackText?: string;
      userRecoveryApproval?: boolean;
    }
  ): Promise<SparkSplitSessionData> {
    
    const updatedSessionData = { ...sessionData };
    updatedSessionData.userPreferredOutput = selection;
    
    if (feedback) {
      updatedSessionData.finalFeedbackText = feedback.finalFeedbackText;
      updatedSessionData.emotionalSatisfactionScore = feedback.emotionalSatisfactionScore;
      updatedSessionData.wouldRefer = feedback.wouldRefer;
      updatedSessionData.userRecoveryApproval = feedback.userRecoveryApproval;
    }
    
    // Handle specific selection outcomes
    switch (selection) {
      case 'canai':
        await this.handleCanAISelection(updatedSessionData, feedback);
        break;
      case 'sterile':
        await this.handleSterileSelection(updatedSessionData, feedback);
        break;
      case 'skip':
        updatedSessionData.skippedComparison = true;
        await this.handleSkipSelection(updatedSessionData);
        break;
      default:
        await this.handleNeutralSelection(updatedSessionData, feedback);
    }
    
    // Log session data to database
    await this.logSparkSplitSession(updatedSessionData);
    
    return updatedSessionData;
  }

  /**
   * Handle CanAI selection outcome
   */
  private async handleCanAISelection(
    sessionData: SparkSplitSessionData,
    feedback?: any
  ): Promise<void> {
    // Increment spark concept reuse if user loved it
    if (feedback?.emotionalSatisfactionScore >= 4) {
      sessionData.sparkReusedIncremented = true;
      await this.emotionalMemoryBank.incrementSparkSuccess(
        sessionData.userId,
        sessionData.sparkConcept
      );
    }
    
    // Track positive emotional outcome
    await this.sacredMomentsOrchestrator.orchestrateSacredMoment(
      'evolution_moment',
      { userId: sessionData.userId } as EmotionalContext,
      { sparkSplitSuccess: true, trustDelta: sessionData.trustDelta }
    );
  }

  /**
   * Handle sterile selection outcome (recovery opportunity)
   */
  private async handleSterileSelection(
    sessionData: SparkSplitSessionData,
    feedback?: any
  ): Promise<void> {
    if (feedback?.userRecoveryApproval) {
      // Trigger regeneration with updated context
      const recoveredOutput = await this.regenerateWithFeedback(
        sessionData.prompt,
        sessionData.toneContext,
        feedback.finalFeedbackText
      );
      
      // Calculate recovery trust delta
      const recoveredTrustDelta = await this.calculateRecoveryTrustDelta(
        sessionData.canaiOutput,
        recoveredOutput,
        feedback.finalFeedbackText
      );
      
      sessionData.recoveredTrustDelta = recoveredTrustDelta;
    }
    
    // Track recovery opportunity
    await this.sacredMomentsOrchestrator.orchestrateSacredMoment(
      'grace_under_fire',
      { userId: sessionData.userId } as EmotionalContext,
      { sparkSplitRecovery: true, feedback: feedback?.finalFeedbackText }
    );
  }

  /**
   * Handle skip selection (reduce frequency)
   */
  private async handleSkipSelection(sessionData: SparkSplitSessionData): Promise<void> {
    // Store user preference to show SparkSplit less frequently
    await this.emotionalMemoryBank.updateUserPreference(
      sessionData.userId,
      'sparkSplitFrequency',
      'reduced'
    );
  }

  /**
   * Handle neutral selection (both/neither)
   */
  private async handleNeutralSelection(
    sessionData: SparkSplitSessionData,
    feedback?: any
  ): Promise<void> {
    // Gather feedback for improvement without strong preference
    if (feedback?.finalFeedbackText) {
      await this.emotionalMemoryBank.storeFeedback(
        sessionData.userId,
        feedback.finalFeedbackText,
        'neutral_sparksplit'
      );
    }
  }

  /**
   * Regenerate output with user feedback
   */
  private async regenerateWithFeedback(
    prompt: string,
    toneContext: string,
    feedback: string
  ): Promise<string> {
    // This would integrate with the main generation pipeline
    // incorporating user feedback to improve output
    const enhancedPrompt = `${prompt}\n\nUser feedback for improvement: ${feedback}`;
    return await this.generateBasicResponse(enhancedPrompt);
  }

  /**
   * Calculate trust delta for recovered output
   */
  private async calculateRecoveryTrustDelta(
    originalOutput: string,
    recoveredOutput: string,
    feedback: string
  ): Promise<number> {
    // Measure improvement based on feedback incorporation
    const feedbackWords = feedback.toLowerCase().split(' ');
    const recoveredWords = recoveredOutput.toLowerCase().split(' ');
    
    const incorporatedFeedback = feedbackWords.filter(word => 
      recoveredWords.includes(word)
    ).length;
    
    // Base recovery score + feedback incorporation
    return Math.min(2.0, 0.5 + (incorporatedFeedback * 0.1));
  }

  /**
   * Check circuit breaker status
   */
  private async checkCircuitBreaker(): Promise<{ isHealthy: boolean; message?: string }> {
    // Check recent trust delta performance
    const recentSessions = await this.getRecentSparkSplitSessions(this.circuitBreakerSessionCount);
    
    if (recentSessions.length < this.circuitBreakerSessionCount) {
      return { isHealthy: true }; // Not enough data yet
    }
    
    const medianTrustDelta = this.calculateMedianTrustDelta(recentSessions);
    
    if (medianTrustDelta < this.circuitBreakerThreshold) {
      return {
        isHealthy: false,
        message: "We're polishing this experience to better reflect you. Try again soon!"
      };
    }
    
    return { isHealthy: true };
  }

  /**
   * Get recent SparkSplit sessions for circuit breaker analysis
   */
  private async getRecentSparkSplitSessions(count: number): Promise<SparkSplitSessionData[]> {
    // This would query the database for recent sessions
    // For now, return empty array
    return [];
  }

  /**
   * Calculate median trust delta from sessions
   */
  private calculateMedianTrustDelta(sessions: SparkSplitSessionData[]): number {
    const trustDeltas = sessions.map(session => session.trustDelta).sort((a, b) => a - b);
    const mid = Math.floor(trustDeltas.length / 2);
    
    return trustDeltas.length % 2 === 0
      ? (trustDeltas[mid - 1] + trustDeltas[mid]) / 2
      : trustDeltas[mid];
  }

  /**
   * Handle SparkSplit failure with emotional dignity
   */
  private async handleSparkSplitFailure(
    input: SparkSplitInput,
    error: any
  ): Promise<SparkSplitOutput> {
    const fallbackSessionData: SparkSplitSessionData = {
      prompt: input.prompt,
      sessionId: input.sessionId,
      userId: input.userId,
      promptTimestamp: new Date(),
      sterileOutput: "SparkSplit temporarily unavailable",
      canaiOutput: input.canaiOutput,
      toneContext: input.toneContext,
      sparkConcept: input.sparkConcept.name,
      trustDelta: 0,
      comparisonMetrics: {
        aweScore: 0,
        ownershipScore: 0,
        wonderScore: 0,
        toneConsistencyScore: 0,
        emotionalImpactScore: 0,
        sparkResonanceScore: 0
      },
      fallbackTriggered: true,
      fallbackMessage: "We're polishing this experience to better reflect you. Your output is ready below!"
    };

    // Trigger graceful fallback sacred moment
    await this.sacredMomentsOrchestrator.orchestrateSacredMoment(
      'grace_under_fire',
      input.emotionalContext,
      { sparkSplitFailure: true, error: error.message }
    );

    return {
      sterileOutput: "SparkSplit temporarily unavailable",
      canaiOutput: input.canaiOutput,
      emotionalCompass: {
        awe: 3.0,
        ownership: 3.0,
        wonder: 3.0,
        calm: 3.0,
        power: 3.0,
        dominantAxis: 'calm',
        colorGradient: 'radial-gradient(circle, rgba(33,150,243,0.1) 0%, rgba(33,150,243,0.05) 100%)',
        accessibleLabel: 'SparkSplit comparison temporarily unavailable'
      },
      trustDelta: 0,
      comparisonMetrics: fallbackSessionData.comparisonMetrics,
      sessionData: fallbackSessionData
    };
  }

  /**
   * Log SparkSplit session to database
   */
  private async logSparkSplitSession(sessionData: SparkSplitSessionData): Promise<void> {
    // This would log to tblPromptComparisons in Airtable
    // Implementation depends on database integration
    console.log('SparkSplit session logged:', {
      sessionId: sessionData.sessionId,
      trustDelta: sessionData.trustDelta,
      userPreference: sessionData.userPreferredOutput
    });
  }
} 