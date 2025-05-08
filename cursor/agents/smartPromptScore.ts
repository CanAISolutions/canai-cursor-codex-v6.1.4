/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Enhance prompt quality through emotional scoring"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Scores prompt quality based on emotional fidelity and revision signals
 */

import { EventBus } from '../event-bus/eventBus';
import { emitSystemLog } from '../utils/audit-utils';
import { calculateEmotionalResonanceScore } from '../utils/dreamstate-utils';

interface PromptScore {
  emotionalFidelity: number;
  clarity: number;
  trustSignals: number;
  revisionNeeded: boolean;
  suggestions: string[];
}

interface RevisionSignal {
  type: 'emotional' | 'clarity' | 'trust';
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestedAction: string;
}

export class SmartPromptScore {
  private readonly eventBus = EventBus.getInstance();
  private readonly EMOTIONAL_THRESHOLD = 0.85;
  private readonly CLARITY_THRESHOLD = 0.80;
  private readonly TRUST_THRESHOLD = 0.90;

  constructor() {
    this.initializeEventListeners();
  }

  /**
   * Scores a prompt based on emotional fidelity and other metrics
   */
  async scorePrompt(prompt: string): Promise<PromptScore> {
    const emotionalResonance = await calculateEmotionalResonanceScore();
    
    const score: PromptScore = {
      emotionalFidelity: this.calculateEmotionalFidelity(emotionalResonance),
      clarity: this.calculateClarity(prompt),
      trustSignals: this.calculateTrustSignals(emotionalResonance),
      revisionNeeded: false,
      suggestions: []
    };

    // Check if revision is needed
    const revisionSignals = this.checkRevisionNeeded(score);
    score.revisionNeeded = revisionSignals.length > 0;
    score.suggestions = revisionSignals.map(signal => signal.suggestedAction);

    // Log score
    emitSystemLog('prompt-scored', {
      score,
      prompt: prompt.substring(0, 100) + '...' // Log first 100 chars
    });

    return score;
  }

  /**
   * Gets revision suggestions for a prompt
   */
  async getRevisionSuggestions(prompt: string): Promise<RevisionSignal[]> {
    const score = await this.scorePrompt(prompt);
    return this.checkRevisionNeeded(score);
  }

  /**
   * Logs prompt score to prompt-logs
   */
  async logPromptScore(prompt: string, score: PromptScore): Promise<void> {
    emitSystemLog('prompt-score-logged', {
      timestamp: new Date().toISOString(),
      prompt: prompt.substring(0, 100) + '...',
      score
    });
  }

  private initializeEventListeners(): void {
    this.eventBus.on('PROMPT_REVISED', this.handlePromptRevision.bind(this));
    this.eventBus.on('EMOTIONAL_STATE_CHANGED', this.handleEmotionalStateChange.bind(this));
  }

  private handlePromptRevision(event: any): void {
    // Handle prompt revision events
    emitSystemLog('prompt-revision-handled', {
      originalScore: event.originalScore,
      newScore: event.newScore,
      changes: event.changes
    });
  }

  private handleEmotionalStateChange(event: any): void {
    // Handle emotional state changes
    emitSystemLog('emotional-state-updated', {
      previousState: event.previousState,
      newState: event.newState
    });
  }

  private calculateEmotionalFidelity(resonance: any): number {
    // Implementation for emotional fidelity calculation
    return Math.min(1, resonance.score * 1.1);
  }

  private calculateClarity(prompt: string): number {
    // Implementation for clarity calculation
    const clarityFactors = {
      structure: this.assessStructure(prompt),
      readability: this.assessReadability(prompt),
      coherence: this.assessCoherence(prompt)
    };

    return (
      clarityFactors.structure * 0.4 +
      clarityFactors.readability * 0.3 +
      clarityFactors.coherence * 0.3
    );
  }

  private calculateTrustSignals(resonance: any): number {
    // Implementation for trust signals calculation
    return Math.min(1, resonance.score * 1.15);
  }

  private checkRevisionNeeded(score: PromptScore): RevisionSignal[] {
    const signals: RevisionSignal[] = [];

    if (score.emotionalFidelity < this.EMOTIONAL_THRESHOLD) {
      signals.push({
        type: 'emotional',
        severity: this.getSeverity(score.emotionalFidelity),
        description: 'Emotional fidelity below threshold',
        suggestedAction: 'Enhance emotional resonance in prompt'
      });
    }

    if (score.clarity < this.CLARITY_THRESHOLD) {
      signals.push({
        type: 'clarity',
        severity: this.getSeverity(score.clarity),
        description: 'Clarity below threshold',
        suggestedAction: 'Improve prompt structure and readability'
      });
    }

    if (score.trustSignals < this.TRUST_THRESHOLD) {
      signals.push({
        type: 'trust',
        severity: this.getSeverity(score.trustSignals),
        description: 'Trust signals below threshold',
        suggestedAction: 'Strengthen trust-building elements'
      });
    }

    return signals;
  }

  private getSeverity(score: number): 'low' | 'medium' | 'high' {
    if (score < 0.6) return 'high';
    if (score < 0.8) return 'medium';
    return 'low';
  }

  private assessStructure(prompt: string): number {
    // Implementation for structure assessment
    return 0.9; // Placeholder
  }

  private assessReadability(prompt: string): number {
    // Implementation for readability assessment
    return 0.85; // Placeholder
  }

  private assessCoherence(prompt: string): number {
    // Implementation for coherence assessment
    return 0.95; // Placeholder
  }
} 