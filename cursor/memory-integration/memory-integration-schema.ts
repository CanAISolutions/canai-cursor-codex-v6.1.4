/**
 * memory-integration/memory-integration-schema.ts
 * 
 * Purpose:
 * Defines types and interfaces for memory integration system.
 * Provides schema validation for memory injection requests and results.
 */

import { PromptDefinition } from '../prompt-infrastructure/prompt-schema';
import { MemoryRecord } from '../ai-memories/memory-schema';

/**
 * Types of memory injection
 */
export type MemoryInjectionType = 
  | 'tone'      // Inject tone/personality memory
  | 'goal'      // Inject goal/objective memory
  | 'behavior'  // Inject behavioral pattern memory
  | 'context'   // Inject contextual memory
  | 'preference'; // Inject user preference memory

/**
 * Memory injection request
 */
export interface MemoryInjectionRequest {
  promptId: string;
  promptVersion?: string;
  memoryType: MemoryInjectionType;
  userId: string;
  sessionId?: string;
  contextGoal?: string;
  topic?: string;
  metadata: {
    trustScore: number;
    alignmentScore: number;
    volatilityScore: number;
    timestamp: number;
    source: string;
    reason: string;
  };
}

/**
 * Memory injection result
 */
export interface MemoryInjectionResult {
  success: boolean;
  promptId: string;
  promptVersion?: string;
  injectedMemory?: {
    type: MemoryInjectionType;
    records: MemoryRecord[];
    influence: MemoryInfluenceScore;
  };
  rejectionReason?: InjectionRejectionReason;
  metadata: {
    timestamp: number;
    trustImpact: number;
    alignmentImpact: number;
    volatilityImpact: number;
  };
}

/**
 * Memory influence scoring
 */
export interface MemoryInfluenceScore {
  trust: number;      // Impact on prompt trust score
  alignment: number;  // Impact on prompt alignment
  volatility: number; // Impact on prompt stability
  relevance: number;  // Relevance to prompt context
  confidence: number; // Confidence in influence calculation
}

/**
 * Memory injection rejection reason
 */
export interface InjectionRejectionReason {
  code: 
    | 'TRUST_THRESHOLD'      // Below trust threshold
    | 'ALIGNMENT_VIOLATION'  // Violates alignment rules
    | 'VOLATILITY_HIGH'      // Too volatile for injection
    | 'SCHEMA_MISMATCH'      // Schema validation failed
    | 'RULE_VIOLATION'       // Rule engine rejection
    | 'VERSION_MISMATCH'     // Version compatibility issue
    | 'MEMORY_FILTERED'      // Filtered by safety rules
    | 'MEMORY_NOT_FOUND';    // No relevant memories found
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Memory filter configuration
 */
export interface MemoryFilterConfig {
  trustThreshold: number;
  alignmentThreshold: number;
  maxVolatilityScore: number;
  maxRecordsPerInjection: number;
  maxAgeInDays: number;
  blockedFields: string[];
  requiredFields: string[];
}

/**
 * Memory injection configuration
 */
export interface MemoryInjectionConfig {
  filterConfig: MemoryFilterConfig;
  influenceThresholds: {
    minTrust: number;
    minAlignment: number;
    maxVolatility: number;
  };
  eventConfig: {
    emitInjectionEvents: boolean;
    emitRejectionEvents: boolean;
    emitInfluenceEvents: boolean;
  };
} 