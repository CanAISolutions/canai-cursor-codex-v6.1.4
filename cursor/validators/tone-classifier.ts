/**
 * ToneClassifier - Real tone classification with sarcasm detection and confidence scoring
 * 
 * What: Classifies emotional tone with confidence metrics and misclassification detection
 * Why: Prevents sarcasm from being misread as trust-safe tones like gratitude or empathy
 * How: Uses semantic analysis, confidence thresholds, and drift detection
 */

export interface ToneClassificationResult {
  tone: string;
  confidence: number;
  semanticDrift: number;
  alternativeTones: string[];
  requiresOverride: boolean;
  metadata: {
    sarcasticIndicators: string[];
    trustSafetyRisk: boolean;
    emotionalAmbiguity: number;
  };
}

export interface ToneCorrectionIncident {
  toneBefore: string;
  toneAfter: string;
  confidenceDelta: number;
  recoveryStep: string;
  timestamp: string;
  traceId: string;
}

export class ToneClassifier {
  private sarcasticPatterns = [
    /oh,?\s+(great|wonderful|fantastic|amazing|perfect)/i,
    /sure,?\s+(that'll|that will|that's)/i,
    /yeah,?\s+(right|sure|okay)/i,
    /\.\.\./,
    /really\?/i,
    /how\s+(wonderful|great|amazing)/i,
    /just\s+(what|exactly)/i
  ];

  private trustSafeTones = ['gratitude', 'empathy', 'reassuring', 'supportive', 'encouraging'];
  private volatileTones = ['sarcastic', 'frustrated', 'dismissive', 'cynical'];

  classifyTone(payload: string, context?: any): ToneClassificationResult {
    const sarcasticIndicators = this.detectSarcasticIndicators(payload);
    const isSarcastic = sarcasticIndicators.length > 0;
    
    // Base tone classification
    let tone = this.getBaseTone(payload, isSarcastic);
    let confidence = this.calculateConfidence(payload, tone, sarcasticIndicators);
    
    // Detect semantic drift (misclassification risk)
    const semanticDrift = this.calculateSemanticDrift(payload, tone, sarcasticIndicators);
    
    // Check if override is required
    const requiresOverride = this.shouldOverride(tone, sarcasticIndicators, semanticDrift);
    
    // Get alternative tones for fallback
    const alternativeTones = this.getAlternativeTones(payload, tone, sarcasticIndicators);
    
    return {
      tone,
      confidence,
      semanticDrift,
      alternativeTones,
      requiresOverride,
      metadata: {
        sarcasticIndicators,
        trustSafetyRisk: isSarcastic && this.trustSafeTones.includes(tone),
        emotionalAmbiguity: this.calculateEmotionalAmbiguity(payload, sarcasticIndicators)
      }
    };
  }

  private detectSarcasticIndicators(payload: string): string[] {
    const indicators: string[] = [];
    
    for (const pattern of this.sarcasticPatterns) {
      const match = payload.match(pattern);
      if (match) {
        indicators.push(match[0]);
      }
    }
    
    return indicators;
  }

  private getBaseTone(payload: string, isSarcastic: boolean): string {
    if (isSarcastic) {
      return 'sarcastic';
    }
    
    // Positive indicators
    if (/thank|grateful|appreciate|wonderful|amazing/i.test(payload)) {
      return 'gratitude';
    }
    
    if (/understand|feel|sorry|empathize/i.test(payload)) {
      return 'empathy';
    }
    
    if (/help|support|here for you|we've got/i.test(payload)) {
      return 'reassuring';
    }
    
    // Neutral/confused
    if (/confused|unclear|not sure|don't understand/i.test(payload)) {
      return 'confused';
    }
    
    return 'neutral';
  }

  private calculateConfidence(payload: string, tone: string, sarcasticIndicators: string[]): number {
    let confidence = 0.7; // Base confidence
    
    // High confidence for clear sarcastic indicators
    if (sarcasticIndicators.length > 0) {
      confidence = Math.min(0.95, 0.7 + (sarcasticIndicators.length * 0.1));
    }
    
    // Lower confidence for ambiguous cases
    if (tone === 'neutral' || payload.length < 10) {
      confidence *= 0.6;
    }
    
    // Higher confidence for clear emotional indicators
    if (/thank you|grateful|appreciate/i.test(payload) && sarcasticIndicators.length === 0) {
      confidence = 0.9;
    }
    
    return Math.round(confidence * 100) / 100;
  }

  private calculateSemanticDrift(payload: string, tone: string, sarcasticIndicators: string[]): number {
    // High drift if sarcastic indicators present but tone is trust-safe
    if (sarcasticIndicators.length > 0 && this.trustSafeTones.includes(tone)) {
      return 0.8 + (sarcasticIndicators.length * 0.1);
    }
    
    // Medium drift for ambiguous cases
    if (tone === 'neutral' && /great|wonderful|amazing/i.test(payload)) {
      return 0.5;
    }
    
    return 0.1; // Low drift for clear classifications
  }

  private shouldOverride(tone: string, sarcasticIndicators: string[], semanticDrift: number): boolean {
    // Override if sarcasm detected but classified as trust-safe
    if (sarcasticIndicators.length > 0 && this.trustSafeTones.includes(tone)) {
      return true;
    }
    
    // Override if high semantic drift
    if (semanticDrift > 0.6) {
      return true;
    }
    
    return false;
  }

  private getAlternativeTones(payload: string, currentTone: string, sarcasticIndicators: string[]): string[] {
    const alternatives: string[] = [];
    
    if (sarcasticIndicators.length > 0) {
      alternatives.push('sarcastic', 'frustrated', 'dismissive');
    }
    
    if (currentTone !== 'neutral') {
      alternatives.push('neutral');
    }
    
    if (/help|support/i.test(payload) && currentTone !== 'reassuring') {
      alternatives.push('reassuring');
    }
    
    return alternatives.slice(0, 3); // Limit to top 3 alternatives
  }

  private calculateEmotionalAmbiguity(payload: string, sarcasticIndicators: string[]): number {
    let ambiguity = 0.2; // Base ambiguity
    
    // Higher ambiguity for mixed signals
    if (sarcasticIndicators.length > 0 && /thank|appreciate|wonderful/i.test(payload)) {
      ambiguity = 0.8;
    }
    
    // Lower ambiguity for clear expressions
    if (sarcasticIndicators.length === 0 && payload.length > 20) {
      ambiguity = 0.1;
    }
    
    return Math.round(ambiguity * 100) / 100;
  }

  // Simulate misclassification for testing
  simulateMisclassification(payload: string, forcedTone: string): ToneClassificationResult {
    const result = this.classifyTone(payload);
    
    // Force the misclassification
    return {
      ...result,
      tone: forcedTone,
      confidence: 0.3, // Low confidence indicates potential misclassification
      semanticDrift: 0.9, // High drift indicates mismatch
      requiresOverride: true,
      metadata: {
        ...result.metadata,
        trustSafetyRisk: true
      }
    };
  }
} 