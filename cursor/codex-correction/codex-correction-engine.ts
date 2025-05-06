/**
 * codex-correction/codex-correction-engine.ts
 * 
 * Purpose:
 * Evaluates prompt execution results and applies corrections when needed.
 * Acts as the last defense layer before degraded prompts cause harm.
 */

import { EventBus } from '../utils/event-bus';
import { CodexRuleEngine } from '../rules/rule-engine';
import { PromptExecutionResult } from '../prompt-infrastructure/prompt-schema';
import { TrustScore } from '../trust/trust-types';
import { CorrectionReasoner } from './correction-reasoner';
import {
  CorrectionEngineConfig,
  CorrectionPlan,
  CodexCorrectionResult,
  PromptCorrectionEvent
} from './correction-contract';

export class CodexCorrectionEngine {
  private reasoner: CorrectionReasoner;

  constructor(
    private eventBus: EventBus,
    private ruleEngine: CodexRuleEngine,
    private config: CorrectionEngineConfig
  ) {
    this.reasoner = new CorrectionReasoner(eventBus, ruleEngine, config);
  }

  /**
   * Evaluates a prompt execution result and applies corrections if needed
   */
  async evaluateAndCorrect(
    result: PromptExecutionResult,
    trustScore: TrustScore
  ): Promise<CodexCorrectionResult> {
    try {
      // Check if correction is already in place
      if (await this.isCorrectionInPlace(result)) {
        return this.createAlreadyCorrectedResult(result);
      }

      // Determine if correction is needed
      const plan = await this.reasoner.reasonCorrection(result, trustScore);
      if (!plan) {
        return this.createNoCorrectionNeededResult(result);
      }

      // Validate correction plan
      const validationResult = await this.validateCorrectionPlan(plan);
      if (!validationResult.valid) {
        return this.createRejectionResult(plan, validationResult.reason);
      }

      // Apply correction
      const correctionResult = await this.applyCorrection(result, plan);
      
      // Emit events
      this.emitCorrectionEvents(plan, correctionResult);

      return correctionResult;
    } catch (error) {
      return this.createErrorResult(error);
    }
  }

  /**
   * Checks if a correction is already in place
   */
  private async isCorrectionInPlace(result: PromptExecutionResult): Promise<boolean> {
    // Implementation would check if the current state matches a previous correction
    return false;
  }

  /**
   * Creates a result for when correction is already in place
   */
  private createAlreadyCorrectedResult(result: PromptExecutionResult): CodexCorrectionResult {
    return {
      success: true,
      updatedResult: result,
      timestamp: Date.now(),
      metadata: {
        reason: 'Correction already in place'
      }
    };
  }

  /**
   * Creates a result for when no correction is needed
   */
  private createNoCorrectionNeededResult(result: PromptExecutionResult): CodexCorrectionResult {
    return {
      success: true,
      updatedResult: result,
      timestamp: Date.now(),
      metadata: {
        reason: 'No correction needed'
      }
    };
  }

  /**
   * Validates a correction plan
   */
  private async validateCorrectionPlan(plan: CorrectionPlan): Promise<{ valid: boolean; reason?: string }> {
    // Validate against rule engine
    const violations = await this.ruleEngine.evaluateRules(plan);
    if (violations.length > 0) {
      return {
        valid: false,
        reason: violations.map(v => v.context.value).join(', ')
      };
    }

    return { valid: true };
  }

  /**
   * Creates a rejection result
   */
  private createRejectionResult(
    plan: CorrectionPlan,
    reason: string
  ): CodexCorrectionResult {
    return {
      success: false,
      plan,
      rejectionReason: {
        code: 'VALIDATION_FAILED',
        message: reason
      },
      timestamp: Date.now()
    };
  }

  /**
   * Applies a correction plan
   */
  private async applyCorrection(
    result: PromptExecutionResult,
    plan: CorrectionPlan
  ): Promise<CodexCorrectionResult> {
    // Implementation would apply the correction and update the result
    return {
      success: true,
      plan,
      updatedResult: result,
      timestamp: Date.now()
    };
  }

  /**
   * Creates an error result
   */
  private createErrorResult(error: unknown): CodexCorrectionResult {
    return {
      success: false,
      rejectionReason: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      timestamp: Date.now()
    };
  }

  /**
   * Emits correction events
   */
  private emitCorrectionEvents(
    plan: CorrectionPlan,
    result: CodexCorrectionResult
  ): void {
    if (!this.config.emitEvents) {
      return;
    }

    const event: PromptCorrectionEvent = {
      type: result.success ? 'codex.correction.applied' : 'codex.correction.rejected',
      plan,
      result,
      timestamp: Date.now()
    };

    this.eventBus.emit(event.type, event);
  }
} 