/**
 * codex-correction/correction-contract.ts
 * 
 * Purpose:
 * Defines core types and contracts for the codex correction system.
 * Provides type safety and validation for correction operations.
 */

import { PromptExecutionResult } from '../prompt-infrastructure/prompt-schema';
import { Rule } from '../rules/rules-schema';
import { TrustScore } from '../trust/trust-types';

/**
 * Represents the reason for a correction
 */
export enum CorrectionReason {
  TRUST_DROP = 'TRUST_DROP',
  VIOLATION = 'VIOLATION',
  ALIGNMENT_DRIFT = 'ALIGNMENT_DRIFT',
  VERSION_EXPIRED = 'VERSION_EXPIRED'
}

/**
 * Represents a plan for correcting a prompt
 */
export interface CorrectionPlan {
  /** Unique identifier for the correction plan */
  id: string;
  
  /** The reason for correction */
  reason: CorrectionReason;
  
  /** The prompt ID being corrected */
  promptId: string;
  
  /** The current prompt version */
  currentVersion: string;
  
  /** The proposed changes */
  delta: {
    /** Changes to apply */
    changes: string[];
    
    /** Expected impact on trust score */
    trustImpact: number;
    
    /** Expected impact on alignment */
    alignmentImpact: number;
    
    /** Rules that will be enforced */
    enforcedRules: Rule[];
  };
  
  /** Priority of the correction (1-5) */
  priority: number;
  
  /** Whether the correction requires user confirmation */
  requiresConfirmation: boolean;
  
  /** Timestamp when the plan was created */
  timestamp: number;
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Represents the result of a correction operation
 */
export interface CodexCorrectionResult {
  /** Whether the correction was successful */
  success: boolean;
  
  /** The correction plan that was applied */
  plan?: CorrectionPlan;
  
  /** If correction failed, the reason why */
  rejectionReason?: {
    code: string;
    message: string;
  };
  
  /** The updated prompt execution result */
  updatedResult?: PromptExecutionResult;
  
  /** The trust score after correction */
  trustScore?: TrustScore;
  
  /** Timestamp of the correction */
  timestamp: number;
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Represents a correction event
 */
export interface PromptCorrectionEvent {
  /** The type of correction event */
  type: 'codex.correction.proposed' | 'codex.correction.applied' | 'codex.correction.rejected';
  
  /** The correction plan */
  plan: CorrectionPlan;
  
  /** The result of the correction */
  result?: CodexCorrectionResult;
  
  /** Timestamp of the event */
  timestamp: number;
  
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Configuration for the correction engine
 */
export interface CorrectionEngineConfig {
  /** Minimum trust score threshold */
  minTrustScore: number;
  
  /** Maximum allowed trust score drop */
  maxTrustDrop: number;
  
  /** Maximum allowed alignment drift */
  maxAlignmentDrift: number;
  
  /** Whether to require user confirmation for high-impact corrections */
  requireUserConfirmation: boolean;
  
  /** Whether to emit correction events */
  emitEvents: boolean;
  
  /** Additional configuration */
  [key: string]: unknown;
} 