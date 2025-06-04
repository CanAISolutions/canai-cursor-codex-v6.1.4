/**
 * Sacred Moments Orchestrator
 * Purpose: Orchestrate the 10 Sacred Moments journey with emotional resonance tracking
 * Integration: SparkSplit, Emotional Intelligence, Trust Building
 */

import { EmotionalContext } from '../types/emotional-sovereignty';
import { EmotionalMemoryBank } from '../utils/emotionalMemoryBank';
import { EventBus } from '../event-bus/eventBus';

export type SacredMomentType = 
  | 'first_breath'           // Discovery recognition
  | 'intent_awakening'       // Smart defaults that feel like mind-reading
  | 'spark_ignition'         // Concepts using user's own words
  | 'creation_moment'        // Electric anticipation building
  | 'spark_revelation'       // SparkSplit comparison moment
  | 'evolution_moment'       // Creative communion partnership
  | 'momentum'               // Unstoppable possibility feeling
  | 'grace_under_fire'       // Failures transformed to wisdom
  | 'remembrance'            // Strategic intimacy in follow-ups
  | 'homecoming';            // Warm sovereignty on return

export interface SacredMoment {
  type: SacredMomentType;
  timestamp: Date;
  userId: string;
  sessionId: string;
  emotionalContext: EmotionalContext;
  systemResponse: any;
  resonanceScore: number;
  transformationIndicators: TransformationIndicator[];
  nextMomentPrediction?: SacredMomentType;
}

export interface TransformationIndicator {
  type: 'belief_shift' | 'trust_increase' | 'emotional_resonance' | 'sovereignty_growth';
  intensity: number; // 1-5 scale
  description: string;
  evidence: string[];
}

export interface SacredMomentResult {
  moment: SacredMoment;
  emotionalImpact: EmotionalImpact;
  nextActions: NextAction[];
  trustDelta: number;
}

export interface EmotionalImpact {
  aweLevel: number;
  ownershipFeeling: number;
  wonderSense: number;
  calmness: number;
  empowerment: number;
  overallResonance: number;
}

export interface NextAction {
  type: 'trigger_sparksplit' | 'enhance_memory' | 'adjust_tone' | 'celebrate_growth' | 'prepare_next_moment';
  priority: 'high' | 'medium' | 'low';
  data: any;
}

export class SacredMomentsOrchestrator {
  private emotionalMemoryBank: EmotionalMemoryBank;
  private eventBus: EventBus;
  private momentHistory: Map<string, SacredMoment[]> = new Map();

  constructor(
    emotionalMemoryBank: EmotionalMemoryBank,
    eventBus: EventBus
  ) {
    this.emotionalMemoryBank = emotionalMemoryBank;
    this.eventBus = eventBus;
  }

  /**
   * Orchestrate a sacred moment in the user's journey
   */
  async orchestrateSacredMoment(
    momentType: SacredMomentType,
    emotionalContext: EmotionalContext,
    systemResponse: any
  ): Promise<SacredMomentResult> {
    try {
      // Calculate emotional resonance for this moment
      const resonanceScore = await this.calculateMomentResonance(
        momentType,
        emotionalContext,
        systemResponse
      );

      // Identify transformation indicators
      const transformationIndicators = await this.identifyTransformationIndicators(
        momentType,
        emotionalContext,
        systemResponse,
        resonanceScore
      );

      // Create sacred moment record
      const moment: SacredMoment = {
        type: momentType,
        timestamp: new Date(),
        userId: emotionalContext.userId || 'anonymous',
        sessionId: emotionalContext.sessionId || 'unknown',
        emotionalContext,
        systemResponse,
        resonanceScore,
        transformationIndicators,
        nextMomentPrediction: this.predictNextMoment(momentType, transformationIndicators)
      };

      // Calculate emotional impact
      const emotionalImpact = await this.calculateEmotionalImpact(moment);

      // Determine next actions
      const nextActions = await this.determineNextActions(moment, emotionalImpact);

      // Calculate trust delta
      const trustDelta = await this.calculateTrustDelta(moment, emotionalImpact);

      // Store moment in history
      await this.storeMomentInHistory(moment);

      // Emit event for other systems
      await this.eventBus.emit('sacred_moment_orchestrated', {
        moment,
        emotionalImpact,
        trustDelta
      });

      // Execute immediate actions
      await this.executeImmediateActions(nextActions);

      return {
        moment,
        emotionalImpact,
        nextActions,
        trustDelta
      };

    } catch (error) {
      // Graceful fallback - still create a moment but with reduced functionality
      return await this.handleOrchestrationFailure(momentType, emotionalContext, systemResponse, error);
    }
  }

  /**
   * Calculate emotional resonance for a specific moment
   */
  private async calculateMomentResonance(
    momentType: SacredMomentType,
    emotionalContext: EmotionalContext,
    systemResponse: any
  ): Promise<number> {
    let baseResonance = 3.0; // Neutral baseline

    // Moment-specific resonance calculations
    switch (momentType) {
      case 'first_breath':
        // Discovery recognition - how well we understood their need
        baseResonance += this.calculateDiscoveryResonance(emotionalContext, systemResponse);
        break;

      case 'intent_awakening':
        // Smart defaults feeling like mind-reading
        baseResonance += this.calculateMindReadingResonance(emotionalContext, systemResponse);
        break;

      case 'spark_ignition':
        // Concepts using user's own words
        baseResonance += this.calculateLanguageResonance(emotionalContext, systemResponse);
        break;

      case 'creation_moment':
        // Electric anticipation building
        baseResonance += this.calculateAnticipationResonance(emotionalContext, systemResponse);
        break;

      case 'spark_revelation':
        // SparkSplit comparison moment
        baseResonance += this.calculateComparisonResonance(emotionalContext, systemResponse);
        break;

      case 'evolution_moment':
        // Creative communion partnership
        baseResonance += this.calculatePartnershipResonance(emotionalContext, systemResponse);
        break;

      case 'momentum':
        // Unstoppable possibility feeling
        baseResonance += this.calculateMomentumResonance(emotionalContext, systemResponse);
        break;

      case 'grace_under_fire':
        // Failures transformed to wisdom
        baseResonance += this.calculateGraceResonance(emotionalContext, systemResponse);
        break;

      case 'remembrance':
        // Strategic intimacy in follow-ups
        baseResonance += this.calculateIntimacyResonance(emotionalContext, systemResponse);
        break;

      case 'homecoming':
        // Warm sovereignty on return
        baseResonance += this.calculateSovereigntyResonance(emotionalContext, systemResponse);
        break;
    }

    // Trust level amplification
    if (emotionalContext.baseTrustScore > 4.0) {
      baseResonance += 0.5;
    }

    // Past moment success amplification
    const pastMoments = await this.getUserMomentHistory(emotionalContext.userId || 'anonymous');
    const successfulMoments = pastMoments.filter(m => m.resonanceScore >= 4.0);
    if (successfulMoments.length > 0) {
      baseResonance += Math.min(1.0, successfulMoments.length * 0.1);
    }

    return Math.min(5.0, Math.max(1.0, baseResonance));
  }

  /**
   * Calculate discovery resonance (first breath moment)
   */
  private calculateDiscoveryResonance(emotionalContext: EmotionalContext, systemResponse: any): number {
    let resonance = 0;

    // Check if we captured their true intent
    if (systemResponse.intentCapture?.accuracy > 0.8) {
      resonance += 1.0;
    }

    // Check if we understood their emotional state
    if (systemResponse.emotionalRecognition?.confidence > 0.7) {
      resonance += 0.8;
    }

    // Check if we provided immediate value
    if (systemResponse.immediateValue?.present) {
      resonance += 0.7;
    }

    return resonance;
  }

  /**
   * Calculate mind-reading resonance (intent awakening)
   */
  private calculateMindReadingResonance(emotionalContext: EmotionalContext, systemResponse: any): number {
    let resonance = 0;

    // Check smart defaults accuracy
    if (systemResponse.smartDefaults?.userAcceptanceRate > 0.8) {
      resonance += 1.2;
    }

    // Check anticipation of needs
    if (systemResponse.needAnticipation?.accuracy > 0.7) {
      resonance += 1.0;
    }

    // Check contextual understanding
    if (systemResponse.contextualUnderstanding?.depth > 0.8) {
      resonance += 0.8;
    }

    return resonance;
  }

  /**
   * Calculate language resonance (spark ignition)
   */
  private calculateLanguageResonance(emotionalContext: EmotionalContext, systemResponse: any): number {
    let resonance = 0;

    // Check language fingerprint matching
    if (emotionalContext.languageFingerprint && systemResponse.languageMatching) {
      const matchScore = systemResponse.languageMatching.similarity || 0;
      resonance += matchScore * 1.5;
    }

    // Check use of user's own words
    if (systemResponse.userWordUsage?.percentage > 0.6) {
      resonance += 1.0;
    }

    // Check tone consistency
    if (systemResponse.toneConsistency?.score > 0.8) {
      resonance += 0.8;
    }

    return resonance;
  }

  /**
   * Calculate anticipation resonance (creation moment)
   */
  private calculateAnticipationResonance(emotionalContext: EmotionalContext, systemResponse: any): number {
    let resonance = 0;

    // Check excitement building
    if (systemResponse.excitementIndicators?.present) {
      resonance += 1.0;
    }

    // Check possibility expansion
    if (systemResponse.possibilityExpansion?.level > 0.7) {
      resonance += 1.2;
    }

    // Check anticipation language
    if (systemResponse.anticipationLanguage?.effectiveness > 0.8) {
      resonance += 0.8;
    }

    return resonance;
  }

  /**
   * Calculate comparison resonance (spark revelation - SparkSplit)
   */
  private calculateComparisonResonance(emotionalContext: EmotionalContext, systemResponse: any): number {
    let resonance = 0;

    // Check trust delta from SparkSplit
    if (systemResponse.sparkSplitData?.trustDelta > 1.0) {
      resonance += systemResponse.sparkSplitData.trustDelta;
    }

    // Check user preference for CanAI
    if (systemResponse.sparkSplitData?.userPreference === 'canai') {
      resonance += 1.5;
    }

    // Check emotional satisfaction score
    if (systemResponse.sparkSplitData?.emotionalSatisfactionScore >= 4) {
      resonance += 1.0;
    }

    return resonance;
  }

  /**
   * Calculate partnership resonance (evolution moment)
   */
  private calculatePartnershipResonance(emotionalContext: EmotionalContext, systemResponse: any): number {
    let resonance = 0;

    // Check collaboration feeling
    if (systemResponse.collaborationIndicators?.strength > 0.8) {
      resonance += 1.2;
    }

    // Check creative communion
    if (systemResponse.creativeCommunion?.present) {
      resonance += 1.0;
    }

    // Check partnership language
    if (systemResponse.partnershipLanguage?.effectiveness > 0.7) {
      resonance += 0.8;
    }

    return resonance;
  }

  /**
   * Calculate momentum resonance (momentum moment)
   */
  private calculateMomentumResonance(emotionalContext: EmotionalContext, systemResponse: any): number {
    let resonance = 0;

    // Check possibility feeling
    if (systemResponse.possibilityFeeling?.intensity > 0.8) {
      resonance += 1.3;
    }

    // Check unstoppable energy
    if (systemResponse.unstoppableEnergy?.present) {
      resonance += 1.0;
    }

    // Check momentum language
    if (systemResponse.momentumLanguage?.power > 0.7) {
      resonance += 0.7;
    }

    return resonance;
  }

  /**
   * Calculate grace resonance (grace under fire)
   */
  private calculateGraceResonance(emotionalContext: EmotionalContext, systemResponse: any): number {
    let resonance = 0;

    // Check wisdom transformation
    if (systemResponse.wisdomTransformation?.present) {
      resonance += 1.5;
    }

    // Check dignity preservation
    if (systemResponse.dignityPreservation?.maintained) {
      resonance += 1.2;
    }

    // Check learning opportunity creation
    if (systemResponse.learningOpportunity?.created) {
      resonance += 1.0;
    }

    return resonance;
  }

  /**
   * Calculate intimacy resonance (remembrance)
   */
  private calculateIntimacyResonance(emotionalContext: EmotionalContext, systemResponse: any): number {
    let resonance = 0;

    // Check strategic memory use
    if (systemResponse.strategicMemory?.effectiveness > 0.8) {
      resonance += 1.2;
    }

    // Check intimacy feeling
    if (systemResponse.intimacyFeeling?.strength > 0.7) {
      resonance += 1.0;
    }

    // Check personal connection
    if (systemResponse.personalConnection?.depth > 0.8) {
      resonance += 0.8;
    }

    return resonance;
  }

  /**
   * Calculate sovereignty resonance (homecoming)
   */
  private calculateSovereigntyResonance(emotionalContext: EmotionalContext, systemResponse: any): number {
    let resonance = 0;

    // Check sovereignty feeling
    if (systemResponse.sovereigntyFeeling?.strength > 0.8) {
      resonance += 1.3;
    }

    // Check warm welcome
    if (systemResponse.warmWelcome?.present) {
      resonance += 1.0;
    }

    // Check belonging sense
    if (systemResponse.belongingSense?.intensity > 0.7) {
      resonance += 0.7;
    }

    return resonance;
  }

  /**
   * Identify transformation indicators for the moment
   */
  private async identifyTransformationIndicators(
    momentType: SacredMomentType,
    emotionalContext: EmotionalContext,
    systemResponse: any,
    resonanceScore: number
  ): Promise<TransformationIndicator[]> {
    const indicators: TransformationIndicator[] = [];

    // High resonance indicates transformation
    if (resonanceScore >= 4.0) {
      indicators.push({
        type: 'emotional_resonance',
        intensity: Math.min(5, Math.floor(resonanceScore)),
        description: `Strong emotional resonance achieved in ${momentType}`,
        evidence: [`Resonance score: ${resonanceScore.toFixed(2)}`]
      });
    }

    // Trust increase indicators
    if (emotionalContext.baseTrustScore && resonanceScore > emotionalContext.baseTrustScore) {
      indicators.push({
        type: 'trust_increase',
        intensity: Math.min(5, Math.floor(resonanceScore - emotionalContext.baseTrustScore + 1)),
        description: 'Trust level increased through positive experience',
        evidence: [
          `Previous trust: ${emotionalContext.baseTrustScore}`,
          `Current resonance: ${resonanceScore}`
        ]
      });
    }

    // Belief shift indicators (moment-specific)
    const beliefShiftIndicators = this.detectBeliefShifts(momentType, systemResponse);
    indicators.push(...beliefShiftIndicators);

    // Sovereignty growth indicators
    if (momentType === 'homecoming' || momentType === 'evolution_moment') {
      indicators.push({
        type: 'sovereignty_growth',
        intensity: Math.min(5, Math.floor(resonanceScore)),
        description: 'User experiencing increased emotional sovereignty',
        evidence: [`Moment type: ${momentType}`, `Resonance: ${resonanceScore}`]
      });
    }

    return indicators;
  }

  /**
   * Detect belief shifts based on moment type and response
   */
  private detectBeliefShifts(momentType: SacredMomentType, systemResponse: any): TransformationIndicator[] {
    const indicators: TransformationIndicator[] = [];

    // SparkSplit belief shifts
    if (momentType === 'spark_revelation' && systemResponse.sparkSplitData) {
      if (systemResponse.sparkSplitData.userPreference === 'canai') {
        indicators.push({
          type: 'belief_shift',
          intensity: 4,
          description: 'User recognizes CanAI\'s superior emotional intelligence',
          evidence: [
            'Selected CanAI over standard AI',
            `Trust delta: ${systemResponse.sparkSplitData.trustDelta}`
          ]
        });
      }
    }

    // Intent awakening belief shifts
    if (momentType === 'intent_awakening' && systemResponse.smartDefaults?.userAcceptanceRate > 0.8) {
      indicators.push({
        type: 'belief_shift',
        intensity: 3,
        description: 'User believes system truly understands their needs',
        evidence: [`Smart defaults acceptance: ${systemResponse.smartDefaults.userAcceptanceRate}`]
      });
    }

    return indicators;
  }

  /**
   * Predict the next likely sacred moment
   */
  private predictNextMoment(
    currentMoment: SacredMomentType,
    transformationIndicators: TransformationIndicator[]
  ): SacredMomentType | undefined {
    // Standard journey progression
    const journeyFlow: Record<SacredMomentType, SacredMomentType> = {
      'first_breath': 'intent_awakening',
      'intent_awakening': 'spark_ignition',
      'spark_ignition': 'creation_moment',
      'creation_moment': 'spark_revelation',
      'spark_revelation': 'evolution_moment',
      'evolution_moment': 'momentum',
      'momentum': 'remembrance',
      'remembrance': 'homecoming',
      'homecoming': 'first_breath', // Return journey
      'grace_under_fire': 'evolution_moment' // Recovery path
    };

    // Check for high-intensity transformation indicators that might skip steps
    const highIntensityIndicators = transformationIndicators.filter(i => i.intensity >= 4);
    
    if (highIntensityIndicators.length > 0) {
      // Accelerated journey for high-resonance users
      if (currentMoment === 'first_breath' && highIntensityIndicators.some(i => i.type === 'trust_increase')) {
        return 'spark_ignition'; // Skip intent_awakening
      }
      
      if (currentMoment === 'spark_revelation' && highIntensityIndicators.some(i => i.type === 'belief_shift')) {
        return 'momentum'; // Skip evolution_moment
      }
    }

    return journeyFlow[currentMoment];
  }

  /**
   * Calculate emotional impact of the moment
   */
  private async calculateEmotionalImpact(moment: SacredMoment): Promise<EmotionalImpact> {
    const baseImpact = {
      aweLevel: 3.0,
      ownershipFeeling: 3.0,
      wonderSense: 3.0,
      calmness: 3.0,
      empowerment: 3.0,
      overallResonance: moment.resonanceScore
    };

    // Moment-specific emotional impacts
    switch (moment.type) {
      case 'first_breath':
        baseImpact.wonderSense += 1.0;
        baseImpact.calmness += 0.5;
        break;

      case 'intent_awakening':
        baseImpact.aweLevel += 1.2;
        baseImpact.ownershipFeeling += 0.8;
        break;

      case 'spark_ignition':
        baseImpact.ownershipFeeling += 1.5;
        baseImpact.wonderSense += 1.0;
        break;

      case 'creation_moment':
        baseImpact.empowerment += 1.3;
        baseImpact.wonderSense += 1.2;
        break;

      case 'spark_revelation':
        baseImpact.aweLevel += 1.5;
        baseImpact.ownershipFeeling += 1.3;
        break;

      case 'evolution_moment':
        baseImpact.empowerment += 1.5;
        baseImpact.ownershipFeeling += 1.2;
        break;

      case 'momentum':
        baseImpact.empowerment += 1.8;
        baseImpact.aweLevel += 1.0;
        break;

      case 'grace_under_fire':
        baseImpact.calmness += 1.5;
        baseImpact.empowerment += 1.0;
        break;

      case 'remembrance':
        baseImpact.ownershipFeeling += 1.3;
        baseImpact.calmness += 1.0;
        break;

      case 'homecoming':
        baseImpact.calmness += 1.5;
        baseImpact.ownershipFeeling += 1.5;
        break;
    }

    // Normalize to 1-5 scale
    Object.keys(baseImpact).forEach(key => {
      if (key !== 'overallResonance') {
        baseImpact[key] = Math.min(5.0, Math.max(1.0, baseImpact[key]));
      }
    });

    return baseImpact;
  }

  /**
   * Determine next actions based on the moment and impact
   */
  private async determineNextActions(
    moment: SacredMoment,
    emotionalImpact: EmotionalImpact
  ): Promise<NextAction[]> {
    const actions: NextAction[] = [];

    // High-resonance moments trigger SparkSplit
    if (moment.resonanceScore >= 4.0 && moment.type === 'creation_moment') {
      actions.push({
        type: 'trigger_sparksplit',
        priority: 'high',
        data: { moment, emotionalImpact }
      });
    }

    // Strong emotional impact enhances memory
    if (emotionalImpact.overallResonance >= 4.0) {
      actions.push({
        type: 'enhance_memory',
        priority: 'high',
        data: { 
          userId: moment.userId,
          momentType: moment.type,
          resonanceScore: moment.resonanceScore,
          emotionalFingerprint: moment.emotionalContext.languageFingerprint
        }
      });
    }

    // Transformation indicators trigger celebrations
    const significantTransformations = moment.transformationIndicators.filter(t => t.intensity >= 4);
    if (significantTransformations.length > 0) {
      actions.push({
        type: 'celebrate_growth',
        priority: 'medium',
        data: { transformations: significantTransformations }
      });
    }

    // Always prepare for next moment
    if (moment.nextMomentPrediction) {
      actions.push({
        type: 'prepare_next_moment',
        priority: 'low',
        data: { nextMoment: moment.nextMomentPrediction }
      });
    }

    // Tone adjustments for low resonance
    if (moment.resonanceScore < 3.0) {
      actions.push({
        type: 'adjust_tone',
        priority: 'high',
        data: { 
          currentTone: moment.emotionalContext.toneContext,
          suggestedAdjustments: this.suggestToneAdjustments(moment)
        }
      });
    }

    return actions;
  }

  /**
   * Suggest tone adjustments for low-resonance moments
   */
  private suggestToneAdjustments(moment: SacredMoment): string[] {
    const adjustments: string[] = [];

    if (moment.resonanceScore < 2.0) {
      adjustments.push('Increase empathy and understanding');
      adjustments.push('Reduce complexity and jargon');
      adjustments.push('Add more personal connection');
    } else if (moment.resonanceScore < 3.0) {
      adjustments.push('Enhance emotional resonance');
      adjustments.push('Improve language matching');
    }

    return adjustments;
  }

  /**
   * Calculate trust delta from the moment
   */
  private async calculateTrustDelta(
    moment: SacredMoment,
    emotionalImpact: EmotionalImpact
  ): Promise<number> {
    let trustDelta = 0;

    // Base trust increase from resonance
    if (moment.resonanceScore > 3.0) {
      trustDelta += (moment.resonanceScore - 3.0) * 0.5;
    }

    // Transformation indicators boost trust
    moment.transformationIndicators.forEach(indicator => {
      if (indicator.type === 'trust_increase') {
        trustDelta += indicator.intensity * 0.2;
      }
    });

    // Emotional impact amplifies trust
    const emotionalAverage = (
      emotionalImpact.aweLevel +
      emotionalImpact.ownershipFeeling +
      emotionalImpact.wonderSense +
      emotionalImpact.calmness +
      emotionalImpact.empowerment
    ) / 5;

    if (emotionalAverage > 3.5) {
      trustDelta += (emotionalAverage - 3.5) * 0.3;
    }

    return Math.min(2.0, Math.max(0, trustDelta));
  }

  /**
   * Store moment in user's history
   */
  private async storeMomentInHistory(moment: SacredMoment): Promise<void> {
    const userId = moment.userId;
    
    if (!this.momentHistory.has(userId)) {
      this.momentHistory.set(userId, []);
    }
    
    const userHistory = this.momentHistory.get(userId)!;
    userHistory.push(moment);
    
    // Keep only last 50 moments per user
    if (userHistory.length > 50) {
      userHistory.splice(0, userHistory.length - 50);
    }

    // Also store in emotional memory bank
    await this.emotionalMemoryBank.storeSacredMoment(userId, moment);
  }

  /**
   * Execute immediate actions
   */
  private async executeImmediateActions(actions: NextAction[]): Promise<void> {
    const highPriorityActions = actions.filter(a => a.priority === 'high');
    
    for (const action of highPriorityActions) {
      try {
        await this.executeAction(action);
      } catch (error) {
        console.error(`Failed to execute action ${action.type}:`, error);
      }
    }
  }

  /**
   * Execute a specific action
   */
  private async executeAction(action: NextAction): Promise<void> {
    switch (action.type) {
      case 'enhance_memory':
        await this.emotionalMemoryBank.enhanceMemory(
          action.data.userId,
          action.data.momentType,
          action.data.resonanceScore
        );
        break;

      case 'adjust_tone':
        // Emit event for tone adjustment
        await this.eventBus.emit('tone_adjustment_needed', action.data);
        break;

      case 'celebrate_growth':
        // Emit event for growth celebration
        await this.eventBus.emit('celebrate_transformation', action.data);
        break;

      case 'prepare_next_moment':
        // Emit event for next moment preparation
        await this.eventBus.emit('prepare_sacred_moment', action.data);
        break;

      case 'trigger_sparksplit':
        // Emit event for SparkSplit trigger
        await this.eventBus.emit('trigger_sparksplit', action.data);
        break;
    }
  }

  /**
   * Get user's moment history
   */
  async getUserMomentHistory(userId: string): Promise<SacredMoment[]> {
    return this.momentHistory.get(userId) || [];
  }

  /**
   * Handle orchestration failure gracefully
   */
  private async handleOrchestrationFailure(
    momentType: SacredMomentType,
    emotionalContext: EmotionalContext,
    systemResponse: any,
    error: any
  ): Promise<SacredMomentResult> {
    // Create minimal moment record
    const fallbackMoment: SacredMoment = {
      type: momentType,
      timestamp: new Date(),
      userId: emotionalContext.userId || 'anonymous',
      sessionId: emotionalContext.sessionId || 'unknown',
      emotionalContext,
      systemResponse,
      resonanceScore: 2.5, // Neutral fallback
      transformationIndicators: [],
      nextMomentPrediction: undefined
    };

    // Minimal emotional impact
    const fallbackImpact: EmotionalImpact = {
      aweLevel: 3.0,
      ownershipFeeling: 3.0,
      wonderSense: 3.0,
      calmness: 3.0,
      empowerment: 3.0,
      overallResonance: 2.5
    };

    // Recovery action
    const recoveryActions: NextAction[] = [{
      type: 'adjust_tone',
      priority: 'high',
      data: { 
        error: error.message,
        fallbackActivated: true,
        momentType
      }
    }];

    return {
      moment: fallbackMoment,
      emotionalImpact: fallbackImpact,
      nextActions: recoveryActions,
      trustDelta: 0
    };
  }
} 