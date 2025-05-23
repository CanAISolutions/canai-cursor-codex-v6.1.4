import { EventBus } from '../event-bus/eventBus';
import { EmotionalPayload } from '../utils/emotion-payload-builder';

export interface TrustScoreEvent {
  traceId: string;
  sessionId: string;
  beforeScore: number;
  afterScore: number;
  delta: number;
  reason: string;
  timestamp: string;
  eventType: 'rate-limit' | 'fallback' | 'recovery' | 'normal' | 'tone-correction';
}

export interface TrustScoreValidation {
  isValid: boolean;
  currentScore: number;
  expectedScore: number;
  variance: number;
  reason: string;
}

export class TrustScoreManager {
  private eventBus: EventBus;
  private trustScores: Map<string, number>;
  private trustHistory: Map<string, TrustScoreEvent[]>;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.trustScores = new Map();
    this.trustHistory = new Map();
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    this.eventBus.on('trust-score:update', this.handleTrustScoreUpdate.bind(this));
    this.eventBus.on('rate-limit-triggered', this.handleRateLimitTriggered.bind(this));
    this.eventBus.on('rate-limit-cleared', this.handleRateLimitCleared.bind(this));
    this.eventBus.on('tone-correction', this.handleToneCorrection.bind(this));
  }

  /**
   * Applies trust score adjustment for tone correction
   * What: Adjusts trust score when tone misclassification is corrected
   * Why: Misclassifying sarcasm as trust-safe tone erodes trust and must be penalized
   * How: Applies adjustment and logs the correction incident
   */
  applyToneCorrectionAdjustment(
    sessionId: string,
    adjustment: number,
    toneBefore: string,
    toneAfter: string,
    traceId: string
  ): void {
    const currentScore = this.getTrustScore(sessionId);
    const newScore = Math.max(0.1, Math.min(1.0, currentScore + adjustment)); // Bound between 0.1 and 1.0
    
    this.updateTrustScore(
      sessionId,
      newScore,
      `Tone correction: ${toneBefore} → ${toneAfter}`,
      'tone-correction',
      traceId
    );
  }

  /**
   * Validates that trust score adjustments for tone corrections are appropriate
   * What: Ensures tone correction penalties are proportional and don't over-penalize
   * Why: Trust should be adjusted for misclassification but not destroyed
   * How: Validates adjustment is within acceptable bounds
   */
  validateToneCorrectionImpact(
    sessionId: string,
    originalTone: string,
    correctedTone: string,
    adjustment: number
  ): TrustScoreValidation {
    const currentScore = this.getTrustScore(sessionId);
    const expectedAdjustment = this.getExpectedToneCorrectionAdjustment(originalTone, correctedTone);
    const adjustmentVariance = Math.abs(adjustment - expectedAdjustment);
    const maxAllowedVariance = 0.05;

    const isValid = adjustmentVariance <= maxAllowedVariance && (currentScore + adjustment) >= 0.1;

    return {
      isValid,
      currentScore: currentScore + adjustment,
      expectedScore: currentScore + expectedAdjustment,
      variance: adjustmentVariance,
      reason: isValid 
        ? 'Tone correction adjustment is appropriate'
        : `Tone correction adjustment variance ${adjustmentVariance.toFixed(3)} exceeds threshold ${maxAllowedVariance}`
    };
  }

  private getExpectedToneCorrectionAdjustment(originalTone: string, correctedTone: string): number {
    const trustSafeTones = ['gratitude', 'empathy', 'reassuring', 'supportive', 'encouraging'];
    
    // Sarcasm misclassified as trust-safe should have moderate penalty
    if (trustSafeTones.includes(originalTone) && correctedTone === 'sarcastic') {
      return -0.15;
    }
    
    // Other misclassifications have smaller penalty
    if (originalTone !== correctedTone) {
      return -0.1;
    }
    
    return 0; // No adjustment needed
  }

  /**
   * Validates that rate limits don't cause trust score erosion
   * What: Ensures rate limit incidents maintain trust score stability
   * Why: Rate limits are system stress, not user fault - trust should not erode
   * How: Validates trust score remains within acceptable bounds during rate limiting
   */
  validateRateLimitTrustImpact(payload: EmotionalPayload): TrustScoreValidation {
    const sessionId = payload.sessionId;
    const currentScore = this.getTrustScore(sessionId);
    const expectedScore = 0.85; // Rate limit should maintain reassuring trust level
    const variance = Math.abs(currentScore - expectedScore);
    const maxAllowedVariance = 0.1;

    const isValid = variance <= maxAllowedVariance && currentScore >= 0.75;

    return {
      isValid,
      currentScore,
      expectedScore,
      variance,
      reason: isValid 
        ? 'Trust score maintained during rate limit'
        : `Trust score variance ${variance.toFixed(3)} exceeds threshold ${maxAllowedVariance}`
    };
  }

  /**
   * Updates trust score for a session
   * What: Records trust score changes with full audit trail
   * Why: Enables tracking of trust impact across different event types
   * How: Updates score and logs event with context
   */
  updateTrustScore(
    sessionId: string,
    newScore: number,
    reason: string,
    eventType: 'rate-limit' | 'fallback' | 'recovery' | 'normal' | 'tone-correction' = 'normal',
    traceId?: string
  ): void {
    const beforeScore = this.getTrustScore(sessionId);
    const delta = newScore - beforeScore;

    this.trustScores.set(sessionId, newScore);

    const event: TrustScoreEvent = {
      traceId: traceId || sessionId,
      sessionId,
      beforeScore,
      afterScore: newScore,
      delta,
      reason,
      timestamp: new Date().toISOString(),
      eventType
    };

    // Add to history
    if (!this.trustHistory.has(sessionId)) {
      this.trustHistory.set(sessionId, []);
    }
    this.trustHistory.get(sessionId)!.push(event);

    // Emit event
    this.eventBus.emit('trust-score:updated', event);
  }

  /**
   * Gets current trust score for a session
   */
  getTrustScore(sessionId: string): number {
    return this.trustScores.get(sessionId) || 0.9; // Default high trust
  }

  /**
   * Gets trust score history for a session
   */
  getTrustHistory(sessionId: string): TrustScoreEvent[] {
    return this.trustHistory.get(sessionId) || [];
  }

  /**
   * Validates that trust score has not been impacted by rate limiting
   * What: Ensures rate limit events don't cause trust degradation
   * Why: System stress should not penalize user trust
   * How: Checks that no rate-limit events caused trust drops
   */
  validateNoRateLimitTrustErosion(sessionId: string): boolean {
    const history = this.getTrustHistory(sessionId);
    const rateLimitEvents = history.filter(event => event.eventType === 'rate-limit');
    
    // No rate limit events should cause trust drops
    return rateLimitEvents.every(event => event.delta >= 0);
  }

  private async handleTrustScoreUpdate(event: TrustScoreEvent): Promise<void> {
    // Log trust score changes for audit
    console.log(`Trust score updated: ${event.sessionId} ${event.beforeScore} → ${event.afterScore} (${event.reason})`);
  }

  private async handleRateLimitTriggered(event: any): Promise<void> {
    const { incident } = event;
    const sessionId = `rate-limit-${incident.incidentId}`;
    
    // Rate limits should maintain trust, not erode it
    this.updateTrustScore(
      sessionId,
      0.85, // Slightly reduced but stable
      'Rate limit triggered - maintaining user trust',
      'rate-limit',
      incident.traceId
    );
  }

  private async handleRateLimitCleared(event: any): Promise<void> {
    const { previousIncident } = event;
    if (previousIncident) {
      const sessionId = `rate-limit-${previousIncident.incidentId}`;
      
      // Trust should recover when rate limit clears
      this.updateTrustScore(
        sessionId,
        0.9, // Back to normal trust level
        'Rate limit cleared - trust restored',
        'recovery',
        previousIncident.traceId
      );
    }
  }

  private async handleToneCorrection(event: any): Promise<void> {
    const { incident, originalPayload } = event;
    const sessionId = `tone-correction-${incident.traceId}`;
    
    // Apply trust score adjustment for tone correction
    const adjustment = this.getExpectedToneCorrectionAdjustment(incident.toneBefore, incident.toneAfter);
    this.applyToneCorrectionAdjustment(
      sessionId,
      adjustment,
      incident.toneBefore,
      incident.toneAfter,
      incident.traceId
    );
  }
} 