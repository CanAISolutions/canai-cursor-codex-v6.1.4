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
  public scan(content: string, location: string, type: ToneScanResult['type']): ToneScanResult {
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
    // TODO: Implement Ideal CX Reversal Test logic (empathy, respect, encouragement)
    return /you|your|together|let's|breakthrough|believe|progress|momentum|support|welcome/i.test(content);
  }

  private detectDrift(content: string): boolean {
    // TODO: Implement tone drift detection (generic, mechanical, or cold phrasing)
    return /error|failed|invalid|try again|generic|undefined|not found|system/i.test(content);
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