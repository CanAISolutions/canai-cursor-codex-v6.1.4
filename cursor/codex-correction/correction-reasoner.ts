/**
 * codex-correction/correction-reasoner.ts
 * 
 * Purpose:
 * Determines why a correction is needed and generates correction plans.
 * Analyzes trust drops, violations, and alignment drift.
 */

import { EventBus } from '../utils/event-bus';
import { CodexRuleEngine } from '../rules/rule-engine';
import { PromptExecutionResult } from '../prompt-infrastructure/prompt-schema';
import { TrustScore } from '../trust/trust-types';
import { 
  CorrectionReason, 
  CorrectionPlan,
  CorrectionEngineConfig
} from './correction-contract';
import { v4 as uuidv4 } from 'uuid';

export class CorrectionReasoner {
  constructor(
    private eventBus: EventBus,
    private ruleEngine: CodexRuleEngine,
    private config: CorrectionEngineConfig
  ) {}

  /**
   * Determines if a correction is needed and generates a plan
   */
  async reasonCorrection(
    result: PromptExecutionResult,
    trustScore: TrustScore
  ): Promise<CorrectionPlan | null> {
    try {
      // Check for trust drop
      const trustDrop = this.detectTrustDrop(trustScore);
      if (trustDrop) {
        return this.createTrustDropPlan(result, trustDrop);
      }

      // Check for rule violations
      const violations = await this.detectViolations(result);
      if (violations.length > 0) {
        return this.createViolationPlan(result, violations);
      }

      // Check for alignment drift
      const drift = this.detectAlignmentDrift(result);
      if (drift) {
        return this.createDriftPlan(result, drift);
      }

      // Check for version expiration
      const expired = this.detectVersionExpiration(result);
      if (expired) {
        return this.createExpirationPlan(result);
      }

      return null;
    } catch (error) {
      this.eventBus.emit('correction.reasoning.error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        result: {
          promptId: result.promptId,
          version: result.version
        }
      });
      return null;
    }
  }

  /**
   * Detects trust score drop
   */
  private detectTrustDrop(trustScore: TrustScore): number | null {
    const drop = trustScore.factors.userHistory - trustScore.score;
    return drop > this.config.maxTrustDrop ? drop : null;
  }

  /**
   * Detects rule violations
   */
  private async detectViolations(result: PromptExecutionResult): Promise<string[]> {
    const violations = await this.ruleEngine.evaluateRules(result);
    return violations.map(v => v.context.value);
  }

  /**
   * Detects alignment drift
   */
  private detectAlignmentDrift(result: PromptExecutionResult): number | null {
    const drift = Math.abs(result.alignmentScore - result.originalAlignmentScore);
    return drift > this.config.maxAlignmentDrift ? drift : null;
  }

  /**
   * Detects version expiration
   */
  private detectVersionExpiration(result: PromptExecutionResult): boolean {
    const age = Date.now() - result.timestamp;
    return age > (this.config.maxVersionAge || 30 * 24 * 60 * 60 * 1000); // Default 30 days
  }

  /**
   * Creates a plan for trust drop correction
   */
  private createTrustDropPlan(
    result: PromptExecutionResult,
    trustDrop: number
  ): CorrectionPlan {
    return {
      id: uuidv4(),
      reason: CorrectionReason.TRUST_DROP,
      promptId: result.promptId,
      currentVersion: result.version,
      delta: {
        changes: ['Restore trust score to previous level'],
        trustImpact: trustDrop,
        alignmentImpact: 0,
        enforcedRules: []
      },
      priority: this.calculatePriority(trustDrop),
      requiresConfirmation: this.requiresConfirmation(trustDrop),
      timestamp: Date.now()
    };
  }

  /**
   * Creates a plan for violation correction
   */
  private createViolationPlan(
    result: PromptExecutionResult,
    violations: string[]
  ): CorrectionPlan {
    return {
      id: uuidv4(),
      reason: CorrectionReason.VIOLATION,
      promptId: result.promptId,
      currentVersion: result.version,
      delta: {
        changes: violations.map(v => `Fix violation: ${v}`),
        trustImpact: 0,
        alignmentImpact: 0,
        enforcedRules: []
      },
      priority: 5, // High priority for violations
      requiresConfirmation: true,
      timestamp: Date.now()
    };
  }

  /**
   * Creates a plan for alignment drift correction
   */
  private createDriftPlan(
    result: PromptExecutionResult,
    drift: number
  ): CorrectionPlan {
    return {
      id: uuidv4(),
      reason: CorrectionReason.ALIGNMENT_DRIFT,
      promptId: result.promptId,
      currentVersion: result.version,
      delta: {
        changes: ['Restore alignment to original intent'],
        trustImpact: 0,
        alignmentImpact: drift,
        enforcedRules: []
      },
      priority: this.calculatePriority(drift),
      requiresConfirmation: this.requiresConfirmation(drift),
      timestamp: Date.now()
    };
  }

  /**
   * Creates a plan for version expiration
   */
  private createExpirationPlan(result: PromptExecutionResult): CorrectionPlan {
    return {
      id: uuidv4(),
      reason: CorrectionReason.VERSION_EXPIRED,
      promptId: result.promptId,
      currentVersion: result.version,
      delta: {
        changes: ['Update to latest version'],
        trustImpact: 0,
        alignmentImpact: 0,
        enforcedRules: []
      },
      priority: 3,
      requiresConfirmation: false,
      timestamp: Date.now()
    };
  }

  /**
   * Calculates correction priority (1-5)
   */
  private calculatePriority(impact: number): number {
    if (impact > 0.8) return 5;
    if (impact > 0.6) return 4;
    if (impact > 0.4) return 3;
    if (impact > 0.2) return 2;
    return 1;
  }

  /**
   * Determines if correction requires user confirmation
   */
  private requiresConfirmation(impact: number): boolean {
    return this.config.requireUserConfirmation && impact > 0.5;
  }
} 