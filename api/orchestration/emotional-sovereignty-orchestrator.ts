/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Central orchestration hub for emotional sovereignty system"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Connects Intent Mirror, Spark Sovereignty, Emotional Intelligence, and Make.com automation
 */

import { SchemaEngine, StructuredIntent } from '../../cursor/preprocessors/schema-engine';
import { VisionCatcher } from '../../cursor/preprocessors/vision-catcher';
import { ConfirmationUX } from '../../cursor/preprocessors/confirmation-ux';
import { MotivationHook } from '../../cursor/preprocessors/motivation-hook';
import { EmotionalValidator } from '../../cursor/validators/emotional-validator';
import { SmartDefaultsEngine } from '../../cursor/utils/smartDefaultsEngine';
import { SessionReuseEngine } from '../../cursor/utils/sessionReuseEngine';
import { EventBus } from '../../cursor/event-bus/eventBus';
import { emitSystemLog } from '../../cursor/utils/audit-utils';

export interface EmotionalSovereigntyRequest {
  userInput: any;
  sessionId: string;
  userId?: string;
  productType: string;
  context?: string;
}

export interface EmotionalSovereigntyResponse {
  structuredIntent: StructuredIntent;
  emotionalContext: any;
  sparkResonance: any;
  confirmationMeta: any;
  emotionalArc: any;
  readyForExecution: boolean;
  makeWebhookData: any;
}

export class EmotionalSovereigntyOrchestrator {
  private schemaEngine: SchemaEngine;
  private visionCatcher: VisionCatcher;
  private confirmationUX: ConfirmationUX;
  private motivationHook: MotivationHook;
  private emotionalValidator: EmotionalValidator;
  private smartDefaults: SmartDefaultsEngine;
  private sessionEngine: SessionReuseEngine;
  private eventBus: EventBus;

  constructor() {
    this.emotionalValidator = new EmotionalValidator();
    this.schemaEngine = new SchemaEngine(this.emotionalValidator);
    this.visionCatcher = new VisionCatcher();
    this.confirmationUX = new ConfirmationUX();
    this.motivationHook = new MotivationHook();
    this.smartDefaults = new SmartDefaultsEngine();
    this.sessionEngine = new SessionReuseEngine();
    this.eventBus = EventBus.getInstance();
    
    this.initializeEventListeners();
  }

  /**
   * Main orchestration method - processes complete emotional sovereignty flow
   */
  async processEmotionalSovereignty(request: EmotionalSovereigntyRequest): Promise<EmotionalSovereigntyResponse> {
    try {
      emitSystemLog('emotional-sovereignty-started', {
        sessionId: request.sessionId,
        productType: request.productType,
        timestamp: new Date().toISOString()
      });

      // Step 1: Get smart defaults and emotional context
      const emotionalContext = await this.getEmotionalContext(request);
      
      // Step 2: Structure intent with emotional awareness
      const structured = await this.schemaEngine.structureIntent(request.userInput, {
        sparkIntentRaw: emotionalContext.sparkSignal,
        visionCatcherInput: emotionalContext.visionInput
      });

      // Step 3: Enhance with vision if needed
      const withVision = await this.visionCatcher.catchVision(structured) || structured;

      // Step 4: Extract motivation hook
      const withHook = await this.motivationHook.inferHook(withVision);

      // Step 5: Generate spark resonance
      const sparkResonance = await this.generateSparkResonance(withHook, emotionalContext);

      // Step 6: Confirm intent with emotional trust building
      const confirmed = await this.confirmationUX.confirmIntent(withHook);

      // Step 7: Calculate emotional arc progression
      const emotionalArc = await this.calculateEmotionalArc(emotionalContext, confirmed);

      // Step 8: Prepare Make.com webhook data
      const makeWebhookData = await this.prepareMakeWebhookData({
        structuredIntent: confirmed.updatedIntent || withHook,
        emotionalContext,
        sparkResonance,
        confirmationMeta: confirmed.meta,
        emotionalArc,
        productType: request.productType
      });

      // Step 9: Record successful processing
      await this.recordSuccessfulProcessing(request, emotionalArc);

      const response: EmotionalSovereigntyResponse = {
        structuredIntent: confirmed.updatedIntent || withHook,
        emotionalContext,
        sparkResonance,
        confirmationMeta: confirmed.meta,
        emotionalArc,
        readyForExecution: confirmed.confirmed,
        makeWebhookData
      };

      emitSystemLog('emotional-sovereignty-completed', {
        sessionId: request.sessionId,
        emotionalTrustScore: emotionalArc.finalTrustScore,
        sparkResonance: sparkResonance.overallResonance,
        timestamp: new Date().toISOString()
      });

      return response;

    } catch (error) {
      emitSystemLog('emotional-sovereignty-error', {
        sessionId: request.sessionId,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });

      // Return graceful fallback
      return this.createFallbackResponse(request);
    }
  }

  /**
   * Get emotional context including smart defaults and session memory
   */
  private async getEmotionalContext(request: EmotionalSovereigntyRequest): Promise<any> {
    // Get smart defaults for this context
    const smartDefaults = await this.smartDefaults.getSmartDefaults(request.context || request.productType);
    
    // Get session-based emotional patterns
    const sessionSparks = this.sessionEngine.getSessionSparks(request.sessionId);
    
    // Get emotional memory (placeholder - would integrate with actual emotional memory bank)
    const emotionalMemory = await this.getEmotionalMemory(request.userId);

    return {
      smartDefaults,
      sessionSparks,
      emotionalMemory,
      baseTrustScore: emotionalMemory?.baseTrustScore || 4.0,
      languageFingerprint: emotionalMemory?.languageFingerprint || {},
      emotionalTriggers: emotionalMemory?.emotionalTriggers || [],
      hasHistory: !!emotionalMemory,
      sparkSignal: this.extractSparkSignal(sessionSparks),
      visionInput: null // Would be populated from UI interaction
    };
  }

  /**
   * Generate spark resonance with emotional personalization
   */
  private async generateSparkResonance(structured: StructuredIntent, emotionalContext: any): Promise<any> {
    // Generate concepts based on structured intent and emotional context
    const concepts = await this.generateEmotionalConcepts(structured, emotionalContext);
    
    // Calculate resonance scores
    const resonantConcepts = concepts.map(concept => ({
      ...concept,
      resonanceScore: this.calculateResonanceScore(concept, emotionalContext),
      personalizedName: this.personalizeConceptName(concept, emotionalContext),
      emotionalHook: this.generateEmotionalHook(concept, emotionalContext)
    }));

    const selectedSpark = resonantConcepts.find(c => c.resonanceScore > 0.8) || resonantConcepts[0];
    const overallResonance = resonantConcepts.reduce((sum, c) => sum + c.resonanceScore, 0) / resonantConcepts.length;

    return {
      concepts: resonantConcepts,
      selectedSpark,
      overallResonance
    };
  }

  /**
   * Calculate emotional arc progression
   */
  private async calculateEmotionalArc(emotionalContext: any, confirmed: any): Promise<any> {
    const startTrustScore = emotionalContext.baseTrustScore;
    const finalTrustScore = confirmed.meta.emotionalTrustScore;
    const emotionalDelta = finalTrustScore - startTrustScore;
    
    let arcType = 'Maintained Trust';
    if (emotionalDelta > 1.0) arcType = 'Reclaimed Trust';
    else if (emotionalDelta > 0.5) arcType = 'Growing Confidence';
    else if (emotionalDelta > 0) arcType = 'Steady Progress';
    else if (emotionalDelta < 0) arcType = 'Needs Recovery';

    return {
      startTrustScore,
      finalTrustScore,
      emotionalDelta,
      arcType,
      progressionSteps: this.calculateProgressionSteps(startTrustScore, finalTrustScore)
    };
  }

  /**
   * Prepare data for Make.com webhook
   */
  private async prepareMakeWebhookData(data: any): Promise<any> {
    return {
      sessionId: data.sessionId,
      structuredIntent: JSON.stringify(data.structuredIntent),
      emotionalContext: JSON.stringify(data.emotionalContext),
      sparkResonance: data.sparkResonance.overallResonance,
      selectedSparkName: data.sparkResonance.selectedSpark.personalizedName,
      emotionalArcType: data.emotionalArc.arcType,
      startTrustScore: data.emotionalArc.startTrustScore,
      finalTrustScore: data.emotionalArc.finalTrustScore,
      emotionalDelta: data.emotionalArc.emotionalDelta,
      usedEmotionalMemory: data.emotionalContext.hasHistory,
      languageFingerprint: JSON.stringify(data.emotionalContext.languageFingerprint),
      productType: data.productType,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Record successful processing for learning
   */
  private async recordSuccessfulProcessing(request: EmotionalSovereigntyRequest, emotionalArc: any): Promise<void> {
    // Record in session engine
    this.sessionEngine.recordSpark({
      id: `emotional-${request.sessionId}-${Date.now()}`,
      sparkName: 'emotional-sovereignty',
      promptType: request.productType,
      trustScore: emotionalArc.finalTrustScore,
      emotionalResonance: 0.8,
      context: request.context || request.productType,
      metrics: {
        engagement: 0.8,
        conversion: 0.8,
        emotionalResonance: 0.8
      },
      metadata: {
        tone: 'professional',
        industry: request.productType,
        challenge: 'emotional-sovereignty',
        arcType: emotionalArc.arcType,
        emotionalDelta: emotionalArc.emotionalDelta
      }
    });

    // Emit success event
    this.eventBus.emit('EMOTIONAL_SOVEREIGNTY_SUCCESS', {
      sessionId: request.sessionId,
      emotionalArc,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Create fallback response for error cases
   */
  private createFallbackResponse(request: EmotionalSovereigntyRequest): EmotionalSovereigntyResponse {
    return {
      structuredIntent: this.createFallbackIntent(request),
      emotionalContext: { hasHistory: false, baseTrustScore: 3.0 },
      sparkResonance: { overallResonance: 0.5, selectedSpark: { personalizedName: 'Your Project' } },
      confirmationMeta: { emotionalTrustScore: 3.0 },
      emotionalArc: { arcType: 'Needs Recovery', finalTrustScore: 3.0, emotionalDelta: 0 },
      readyForExecution: true,
      makeWebhookData: this.createFallbackWebhookData(request)
    };
  }

  // Helper methods (simplified implementations)
  private async getEmotionalMemory(userId?: string): Promise<any> {
    // Placeholder - would integrate with actual emotional memory system
    return null;
  }

  private extractSparkSignal(sessionSparks: any[]): string | undefined {
    return sessionSparks.find(s => s.sparkName)?.sparkName;
  }

  private async generateEmotionalConcepts(structured: StructuredIntent, emotionalContext: any): Promise<any[]> {
    // Placeholder - would generate actual concepts
    return [
      { name: 'Your Vision', type: 'concept' },
      { name: 'Your Strategy', type: 'concept' },
      { name: 'Your Growth Plan', type: 'concept' }
    ];
  }

  private calculateResonanceScore(concept: any, emotionalContext: any): number {
    return 0.8; // Placeholder
  }

  private personalizeConceptName(concept: any, emotionalContext: any): string {
    return concept.name; // Placeholder
  }

  private generateEmotionalHook(concept: any, emotionalContext: any): string {
    return 'Transform your vision into reality'; // Placeholder
  }

  private calculateProgressionSteps(start: number, end: number): string[] {
    return ['Initial Trust', 'Building Confidence', 'Strong Alignment']; // Placeholder
  }

  private createFallbackIntent(request: EmotionalSovereigntyRequest): StructuredIntent {
    // Create minimal valid structured intent matching the exact interface
    return {
      business_type: { value: 'business', confidence: 0.5, source: 'fallback', overrideable: true, errorState: false, wasConfirmed: false },
      primary_goal: { value: 'growth', confidence: 0.5, source: 'fallback', overrideable: true, errorState: false, wasConfirmed: false },
      tone: { value: 'professional', confidence: 0.5, source: 'fallback', overrideable: true, errorState: false, wasConfirmed: false },
      motivator: { value: 'success', confidence: 0.5, source: 'fallback', overrideable: true, errorState: false, wasConfirmed: false },
      challenges: { value: [], confidence: 0.5, source: 'fallback', overrideable: true, errorState: false, wasConfirmed: false },
      _meta: {
        allFields: ['business_type', 'primary_goal', 'tone', 'motivator', 'challenges'],
        injectedFields: [],
        validationPassed: true,
        errors: [],
        usedSparkSignal: false,
        usedVisionCatcher: false,
        intentConfidence: 0.5,
        emotionalAnchorPresent: false,
        conflictDetected: false,
        hasMotivationHook: false
      }
    };
  }

  private createFallbackWebhookData(request: EmotionalSovereigntyRequest): any {
    return {
      sessionId: request.sessionId,
      productType: request.productType,
      fallback: true,
      timestamp: new Date().toISOString()
    };
  }

  private initializeEventListeners(): void {
    this.eventBus.on('EMOTIONAL_SOVEREIGNTY_REQUEST', async (data) => {
      emitSystemLog('emotional-sovereignty-event-received', data);
    });
  }
} 