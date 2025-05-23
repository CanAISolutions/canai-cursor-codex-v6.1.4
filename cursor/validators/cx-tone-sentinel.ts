// cx-tone-sentinel.ts
// WHAT: CX Tone Sentinel Validator (Codex CX Alchemy Protocol)
// WHY: Auto-detect tone drift, generic phrasing, and emotional disconnects in all user-facing content
// HOW: Scans outputs, fallbacks, CTAs, emails, previews; flags and logs violations
// Persona: Cursor, Echo
// Version: v1.0.0

import { EventBus } from '../event-bus/eventBus';

export interface ToneScanResult {
  content: string;
  location: string;
  type: 'output' | 'fallback' | 'cta' | 'email' | 'preview';
  passesReversalTest: boolean;
  detectedDrift: boolean;
  notes?: string;
}

export class CXToneSentinel {
  private static instance: CXToneSentinel;
  private eventBus: EventBus;

  private constructor() {
    this.eventBus = EventBus.getInstance();
  }

  static getInstance(): CXToneSentinel {
    if (!CXToneSentinel.instance) {
      CXToneSentinel.instance = new CXToneSentinel();
    }
    return CXToneSentinel.instance;
  }

  /**
   * Scans content for tone drift and reversal test failure
   */
  public scan(content: string | undefined | null, location: string, type: ToneScanResult['type']): ToneScanResult {
    // Handle malformed content gracefully
    if (!content || typeof content !== 'string') {
      return {
        content: content || '',
        location,
        type,
        passesReversalTest: false,
        detectedDrift: true,
        notes: 'Invalid content provided'
      };
    }
    
    const passesReversalTest = this.reversalTest(content);
    const detectedDrift = this.detectDrift(content);
    const result: ToneScanResult = {
      content,
      location,
      type,
      passesReversalTest,
      detectedDrift,
      notes: !passesReversalTest ? 'Fails Ideal CX Reversal Test' : detectedDrift ? 'Tone drift detected' : undefined
    };
    if (!passesReversalTest || detectedDrift) {
      this.logViolation(result);
    }
    return result;
  }

  private reversalTest(content: string): boolean {
    // Ideal CX Reversal Test: Check for empathy, respect, encouragement, and positive engagement
    
    // Check if content appears to be non-English
    const isNonEnglish = 
      // Special characters (French, German, Spanish accents, Japanese)
      /[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]|[¡¿]|[ñç]|[äöüß]|[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/i.test(content) ||
      // Common non-English words
      /\b(merci|gracias|muchas|danke|vielen|nous|vous|pour|por|para|und|oder|aber|que|esta|esto|cette|cette|arigato|arigatou)\b/i.test(content) ||
      // Non-English sentence patterns
      /\b(je comprends|nous avons|hemos preparado|vielen dank|muchas gracias)\b/i.test(content);
    
    if (isNonEnglish) {
      // For non-English content, use more lenient criteria
      // Check for positive sentiment indicators that work across languages
      return content.length > 10 && // Has substantial content
             !/error|failed|invalid|undefined|not found/i.test(content) && // No obvious error messages
             !/oh sure|yeah right|of course|obviously/i.test(content); // No obvious sarcasm
    }
    
    // For English content, use the full reversal test
    return /you|your|together|let's|breakthrough|believe|progress|momentum|support|welcome|excited|amazing|accomplish|understand|difficult|overcome|challenges|succeed|excellent|great|wonderful|fantastic|love|appreciate|help|care|thank|hopeful|solution|find|address/i.test(content);
  }

  private detectDrift(content: string): boolean {
    // Detect tone drift: generic, mechanical, cold phrasing, sarcasm, and negative patterns
    return /error|failed|invalid|try again|generic|undefined|not found|system|oh sure|yeah right|of course|obviously|always works|never works|great job|perfect|wonderful.*not|sure.*that|because.*always|right.*sure|unacceptable|absolutely|everything.*wrong|wrong/i.test(content);
  }

  private logViolation(result: ToneScanResult): void {
    // Emit violation to soulfire-drift.md
    this.eventBus.emit('cxToneViolation', result);
    // TODO: Append to /cursor/system-intel/soulfire-drift.md
  }
}

// Example usage:
// const sentinel = CXToneSentinel.getInstance();
// sentinel.scan('We're crafting your breakthrough…', 'submission', 'output'); 