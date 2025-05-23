/**
 * ToneCorrectionManager - Handles tone misclassification recovery and correction
 * 
 * What: Detects and corrects tone misclassifications with proper logging and UX recovery
 * Why: Prevents emotional betrayal when sarcasm is misread as trust-safe tones
 * How: Applies tone overrides, generates recovery messages, and logs correction incidents
 */

import { ToneClassificationResult, ToneCorrectionIncident } from '../validators/tone-classifier';
import { EventBus } from '../event-bus/eventBus';

export interface ToneCorrectionResult {
  correctedTone: string;
  recoveryMessage: string;
  incident: ToneCorrectionIncident;
  trustScoreAdjustment: number;
  requiresUXUpdate: boolean;
}

export class ToneCorrectionManager {
  private eventBus: EventBus;
  private correctionIncidents: ToneCorrectionIncident[] = [];

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
  }

  correctTone(
    originalPayload: string,
    classificationResult: ToneClassificationResult,
    traceId: string
  ): ToneCorrectionResult {
    const { tone, confidence, semanticDrift, alternativeTones, metadata } = classificationResult;
    
    // Determine corrected tone
    const correctedTone = this.determineCorrectedTone(originalPayload, classificationResult);
    
    // Generate recovery message
    const recoveryMessage = this.generateRecoveryMessage(tone, correctedTone, originalPayload);
    
    // Calculate trust score adjustment
    const trustScoreAdjustment = this.calculateTrustScoreAdjustment(tone, correctedTone, confidence);
    
    // Create correction incident
    const incident: ToneCorrectionIncident = {
      toneBefore: tone,
      toneAfter: correctedTone,
      confidenceDelta: this.calculateConfidenceDelta(confidence, correctedTone),
      recoveryStep: this.getRecoveryStep(tone, correctedTone),
      timestamp: new Date().toISOString(),
      traceId
    };
    
    // Log the incident
    this.logCorrectionIncident(incident, originalPayload, metadata);
    
    // Store for audit trail
    this.correctionIncidents.push(incident);
    
    return {
      correctedTone,
      recoveryMessage,
      incident,
      trustScoreAdjustment,
      requiresUXUpdate: tone !== correctedTone
    };
  }

  private determineCorrectedTone(payload: string, result: ToneClassificationResult): string {
    const { tone, metadata, alternativeTones } = result;
    
    // If sarcasm detected but misclassified as trust-safe, correct to sarcastic
    if (metadata.sarcasticIndicators.length > 0 && this.isTrustSafeTone(tone)) {
      return 'sarcastic';
    }
    
    // If high emotional ambiguity, default to neutral
    if (metadata.emotionalAmbiguity > 0.7) {
      return 'neutral';
    }
    
    // Use first alternative if available and more appropriate
    if (alternativeTones.length > 0 && result.semanticDrift > 0.6) {
      return alternativeTones[0];
    }
    
    return tone; // No correction needed
  }

  private generateRecoveryMessage(originalTone: string, correctedTone: string, payload: string): string {
    if (originalTone === correctedTone) {
      return ''; // No recovery needed
    }
    
    // Specific misclassification recovery messages (prioritize these)
    if (originalTone === 'gratitude' && correctedTone === 'sarcastic') {
      return "Let me recalibrate that response. I sense there might be some frustration here.";
    }
    
    if (originalTone === 'empathy' && correctedTone === 'sarcastic') {
      return "I may have misread your tone. Let's approach this differently.";
    }
    
    // General sarcasm misclassified as trust-safe (fallback)
    if (this.isTrustSafeTone(originalTone) && correctedTone === 'sarcastic') {
      return "I want to make sure I understand you correctly. Let's try that again with clarity.";
    }
    
    // Default neutral recovery
    return "Let's take a fresh approach to make sure we're on the same page.";
  }

  private calculateTrustScoreAdjustment(originalTone: string, correctedTone: string, confidence: number): number {
    if (originalTone === correctedTone) {
      return 0; // No adjustment needed
    }
    
    // Penalty for misclassifying sarcasm as trust-safe
    if (this.isTrustSafeTone(originalTone) && correctedTone === 'sarcastic') {
      return -0.15; // Moderate penalty for emotional betrayal
    }
    
    // Smaller penalty for other misclassifications
    if (confidence < 0.5) {
      return -0.05; // Small penalty for low-confidence misclassification
    }
    
    return -0.1; // Standard misclassification penalty
  }

  private calculateConfidenceDelta(originalConfidence: number, correctedTone: string): number {
    // Higher confidence for corrected sarcastic tone
    if (correctedTone === 'sarcastic') {
      return 0.85 - originalConfidence;
    }
    
    // Moderate confidence for neutral corrections
    if (correctedTone === 'neutral') {
      return 0.7 - originalConfidence;
    }
    
    return 0.75 - originalConfidence; // Default confidence improvement
  }

  private getRecoveryStep(originalTone: string, correctedTone: string): string {
    if (originalTone === correctedTone) {
      return 'no_correction_needed';
    }
    
    if (this.isTrustSafeTone(originalTone) && correctedTone === 'sarcastic') {
      return 'sarcasm_correction_from_trust_safe';
    }
    
    if (originalTone === 'neutral' && correctedTone === 'sarcastic') {
      return 'sarcasm_detection_enhancement';
    }
    
    return `tone_override_${originalTone}_to_${correctedTone}`;
  }

  private logCorrectionIncident(
    incident: ToneCorrectionIncident,
    originalPayload: string,
    metadata: any
  ): void {
    const logData = {
      type: 'sarcasmCorrectionIncident',
      incident,
      originalPayload,
      sarcasticIndicators: metadata.sarcasticIndicators,
      trustSafetyRisk: metadata.trustSafetyRisk,
      emotionalAmbiguity: metadata.emotionalAmbiguity,
      timestamp: incident.timestamp
    };
    
    // Emit event for logging systems
    this.eventBus.emit('tone-correction', logData);
    
    // Console log for development/debugging
    console.log(`[ToneCorrection] ${incident.toneBefore} → ${incident.toneAfter}`, {
      traceId: incident.traceId,
      confidenceDelta: incident.confidenceDelta,
      recoveryStep: incident.recoveryStep
    });
  }

  private isTrustSafeTone(tone: string): boolean {
    const trustSafeTones = ['gratitude', 'empathy', 'reassuring', 'supportive', 'encouraging'];
    return trustSafeTones.includes(tone);
  }

  // Get correction incidents for audit
  getCorrectionIncidents(): ToneCorrectionIncident[] {
    return [...this.correctionIncidents];
  }

  // Get incidents by trace ID
  getIncidentsByTrace(traceId: string): ToneCorrectionIncident[] {
    return this.correctionIncidents.filter(incident => incident.traceId === traceId);
  }

  // Clear incidents (for testing)
  clearIncidents(): void {
    this.correctionIncidents = [];
  }
} 