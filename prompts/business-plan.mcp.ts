/**
 * business-plan.mcp.ts
 * 
 * Purpose:
 * MCP (Mission Control Protocol) for Business Plan Prompt
 * Enforces input validation, QA scoring, fallback routing, and TAP compliance.
 * 
 * TAP-Status: Locked
 * Codex: v6.1.4
 * Fallback: Yes
 * EmotionQA: Enabled
 */

import { EventEmitter } from 'events';
import { validateInput } from '../cursor/agents/input-validator';
import { scorePrompt } from '../cursor/agents/qa-scorer';
import { validateEmotionalTone } from '../cursor/agents/empathy-validator';
import { routeFallback } from '../cursor/self-healing/fallbackRouter';
import { logPromptSession } from '../cursor/logs/prompt-logs';

interface BusinessPlanInput {
  industry: string;
  goal: string;
  tone: string;
  targetMarket?: string;
  budget?: number;
  timeline?: string;
  enhancers?: {
    emotionalDepth?: boolean;
    useAnalogies?: boolean;
    urgency?: boolean;
  };
}

interface ValidationStatus {
  isValid: boolean;
  missingFields: string[];
  invalidFields: string[];
  enhancerStatus: Record<string, boolean>;
}

interface ScoreBreakdown {
  overall: number;
  toneMatch: number;
  emotionalDepth: number;
  clarity: number;
  completeness: number;
}

interface RecoveryStatus {
  triggered: boolean;
  strategy: string;
  attempts: number;
  success: boolean;
}

interface PromptSession {
  promptType: string;
  input: BusinessPlanInput;
  validationStatus: ValidationStatus;
  scoreBreakdown: ScoreBreakdown;
  recoveryStatus: RecoveryStatus;
  revisionCount: number;
}

export class BusinessPlanMCP extends EventEmitter {
  private readonly requiredFields = ['industry', 'goal', 'tone'];
  private readonly validTones = ['professional', 'conversational', 'enthusiastic', 'analytical'];
  private readonly minScore = 0.75;

  async processPrompt(input: BusinessPlanInput): Promise<PromptSession> {
    // 1. Input Validation
    const validationStatus = await this.validateInput(input);
    if (!validationStatus.isValid) {
      this.emit('validationFailed', validationStatus);
      return this.handleInvalidInput(input, validationStatus);
    }

    // 2. QA Scoring
    const scoreBreakdown = await this.scorePrompt(input);
    if (scoreBreakdown.overall < this.minScore) {
      this.emit('scoreBelowThreshold', scoreBreakdown);
      return this.handleLowScore(input, validationStatus, scoreBreakdown);
    }

    // 3. Emotional Validation
    const emotionalScore = await validateEmotionalTone(input.tone);
    if (emotionalScore < this.minScore) {
      this.emit('emotionalMismatch', emotionalScore);
      return this.handleEmotionalMismatch(input, validationStatus, scoreBreakdown);
    }

    // 4. Log Session
    const session: PromptSession = {
      promptType: 'business_plan',
      input,
      validationStatus,
      scoreBreakdown,
      recoveryStatus: { triggered: false, strategy: '', attempts: 0, success: true },
      revisionCount: 0
    };

    await logPromptSession(session);
    this.emit('sessionLogged', session);

    return session;
  }

  private async validateInput(input: BusinessPlanInput): Promise<ValidationStatus> {
    const missingFields = this.requiredFields.filter(field => !input[field]);
    const invalidFields = this.validateFieldTypes(input);
    const enhancerStatus = this.validateEnhancers(input.enhancers);

    return {
      isValid: missingFields.length === 0 && invalidFields.length === 0,
      missingFields,
      invalidFields,
      enhancerStatus
    };
  }

  private validateFieldTypes(input: BusinessPlanInput): string[] {
    const invalid: string[] = [];
    
    if (input.industry && typeof input.industry !== 'string') {
      invalid.push('industry');
    }
    if (input.goal && typeof input.goal !== 'string') {
      invalid.push('goal');
    }
    if (input.tone && !this.validTones.includes(input.tone)) {
      invalid.push('tone');
    }
    if (input.budget && typeof input.budget !== 'number') {
      invalid.push('budget');
    }
    if (input.timeline && typeof input.timeline !== 'string') {
      invalid.push('timeline');
    }

    return invalid;
  }

  private validateEnhancers(enhancers?: BusinessPlanInput['enhancers']): Record<string, boolean> {
    if (!enhancers) return {};
    
    return {
      emotionalDepth: typeof enhancers.emotionalDepth === 'boolean',
      useAnalogies: typeof enhancers.useAnalogies === 'boolean',
      urgency: typeof enhancers.urgency === 'boolean'
    };
  }

  private async scorePrompt(input: BusinessPlanInput): Promise<ScoreBreakdown> {
    return await scorePrompt({
      promptType: 'business_plan',
      input,
      context: {
        requiredFields: this.requiredFields,
        validTones: this.validTones
      }
    });
  }

  private async handleInvalidInput(
    input: BusinessPlanInput,
    validationStatus: ValidationStatus
  ): Promise<PromptSession> {
    const recoveryStatus = await routeFallback('validation', {
      promptType: 'business_plan',
      input,
      validationStatus
    });

    return {
      promptType: 'business_plan',
      input,
      validationStatus,
      scoreBreakdown: {
        overall: 0,
        toneMatch: 0,
        emotionalDepth: 0,
        clarity: 0,
        completeness: 0
      },
      recoveryStatus,
      revisionCount: 0
    };
  }

  private async handleLowScore(
    input: BusinessPlanInput,
    validationStatus: ValidationStatus,
    scoreBreakdown: ScoreBreakdown
  ): Promise<PromptSession> {
    const recoveryStatus = await routeFallback('scoring', {
      promptType: 'business_plan',
      input,
      scoreBreakdown
    });

    return {
      promptType: 'business_plan',
      input,
      validationStatus,
      scoreBreakdown,
      recoveryStatus,
      revisionCount: 0
    };
  }

  private async handleEmotionalMismatch(
    input: BusinessPlanInput,
    validationStatus: ValidationStatus,
    scoreBreakdown: ScoreBreakdown
  ): Promise<PromptSession> {
    const recoveryStatus = await routeFallback('emotional', {
      promptType: 'business_plan',
      input,
      scoreBreakdown
    });

    return {
      promptType: 'business_plan',
      input,
      validationStatus,
      scoreBreakdown,
      recoveryStatus,
      revisionCount: 0
    };
  }
}

// Export singleton instance
export const businessPlanMCP = new BusinessPlanMCP();