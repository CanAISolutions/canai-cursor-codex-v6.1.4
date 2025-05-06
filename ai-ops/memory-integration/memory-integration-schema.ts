/**
 * Memory Integration Schema
 * Defines core types for memory injection and validation
 */

import { MemoryType, MemoryPayload } from '../ai-memories/memory-types';
import { PromptVersion } from '../prompt-registry/prompt-registry-types';
import { TrustScore } from '../trust/trust-types';

/**
 * Represents a request to inject memory into a prompt
 */
export interface MemoryInjectionRequest {
  /** The memory payload to be injected */
  memory: MemoryPayload;
  
  /** The target prompt version to inject into */
  targetPrompt: PromptVersion;
  
  /** Current trust score for validation */
  trustScore: TrustScore;
  
  /** Optional injection context */
  context?: {
    /** Whether this is a test injection */
    isTest?: boolean;
    /** Specific injection mode */
    mode?: 'tone' | 'goal' | 'behavior';
    /** Additional metadata */
    metadata?: Record<string, unknown>;
  };
}

/**
 * Represents the result of a memory injection attempt
 */
export interface MemoryInjectionResult {
  /** Whether the injection was successful */
  success: boolean;
  
  /** The modified prompt after injection */
  modifiedPrompt?: PromptVersion;
  
  /** If injection failed, the reason why */
  rejectionReason?: InjectionRejectionReason;
  
  /** Calculated influence score */
  influenceScore?: MemoryInfluenceScore;
  
  /** Timestamp of the injection */
  timestamp: number;
}

/**
 * Reasons why a memory injection might be rejected
 */
export enum InjectionRejectionReason {
  TRUST_THRESHOLD_NOT_MET = 'TRUST_THRESHOLD_NOT_MET',
  INVALID_MEMORY_TYPE = 'INVALID_MEMORY_TYPE',
  SCHEMA_VALIDATION_FAILED = 'SCHEMA_VALIDATION_FAILED',
  RULE_VIOLATION = 'RULE_VIOLATION',
  PROMPT_INCOMPATIBLE = 'PROMPT_INCOMPATIBLE',
  MEMORY_FILTER_REJECTED = 'MEMORY_FILTER_REJECTED'
}

/**
 * Represents the calculated influence of a memory injection
 */
export interface MemoryInfluenceScore {
  /** Overall influence score (0-1) */
  score: number;
  
  /** Breakdown of influence by aspect */
  aspects: {
    tone: number;
    goal: number;
    behavior: number;
  };
  
  /** Confidence in the influence calculation */
  confidence: number;
  
  /** Whether the influence is within acceptable bounds */
  isAcceptable: boolean;
}

/**
 * Configuration for memory filtering
 */
export interface MemoryFilterConfig {
  /** Maximum age of memories to consider (in ms) */
  maxAge?: number;
  
  /** Minimum trust score required */
  minTrustScore: number;
  
  /** Fields to exclude from injection */
  excludedFields?: string[];
  
  /** Whether to sanitize emotional content */
  sanitizeEmotionalContent?: boolean;
} 