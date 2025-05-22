/**
 * prompt-infrastructure/prompt-schema.ts
 * 
 * Purpose:
 * Defines core types and interfaces for prompt management, evolution, and scoring.
 */

import { EventBus } from '../event-bus/eventBus';

// Core prompt types
export type PromptType = 
  | 'test'
  | 'production'
  | 'experimental'
  | 'fallback'
  | 'system'
  | 'user'
  | 'agent'
  | 'memory'
  | 'evolution';

export type PromptStatus = 'active' | 'deprecated' | 'experimental' | 'archived';
export type PromptContractType = 
  | 'tone'
  | 'length'
  | 'memory'
  | 'evolution';

export interface PromptMetadata {
  author: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  dependencies: string[];
  minTokens?: number;
  maxTokens?: number;
  targetLatency?: number;
  trustScore: number;
  alignmentScore: number;
  performanceScore: number;
}

export interface PromptDefinition {
  id: string;
  type: PromptType;
  version: string;
  status: PromptStatus;
  name: string;
  description: string;
  content: string;
  metadata: PromptMetadata;
  contracts: PromptContract[];
  constraints: PromptConstraint[];
  evolution: PromptEvolution;
}

export interface PromptContract {
  id: string;
  type: PromptContractType;
  description: string;
  validation: {
    regex?: string;
    schema?: Record<string, unknown>;
    function?: string;
    threshold?: number;
  };
}

export interface PromptConstraint {
  id: string;
  type: 'token' | 'latency' | 'memory' | 'trust';
  value: number;
  operator: 'lt' | 'lte' | 'eq' | 'gte' | 'gt';
  description: string;
}

export interface PromptEvolution {
  id: string;
  version: string;
  timestamp: number;
  changes: Array<{
    field: string;
    oldValue: unknown;
    newValue: unknown;
    reason: string;
  }>;
  metadata: {
    author: string;
    reason: string;
    trustImpact: number;
    performanceImpact: number;
    alignmentImpact: number;
  };
}

export interface PromptDelta {
  id: string;
  promptId: string;
  fromVersion: string;
  toVersion: string;
  changes: Array<{
    field: string;
    oldValue: unknown;
    newValue: unknown;
    reason: string;
  }>;
  metadata: {
    author: string;
    reason: string;
    trustImpact: number;
    performanceImpact: number;
    alignmentImpact: number;
  };
}

export interface PromptScore {
  id: string;
  promptId: string;
  version: string;
  timestamp: number;
  metrics: {
    trust: {
      score: number;
      feedback: number;
      fallbackUsage: number;
      violations: number;
    };
    performance: {
      tokens: number;
      latency: number;
      quality: number;
      consistency: number;
    };
    alignment: {
      codexScore: number;
      contractCompliance: number;
      constraintSatisfaction: number;
    };
  };
  metadata: {
    sessionId: string;
    environment: string;
    context: Record<string, any>;
  };
}

export interface PromptContractViolation {
  id: string;
  promptId: string;
  version: string;
  timestamp: number;
  contract: PromptContract;
  context: {
    input: any;
    output: any;
    session: Record<string, any>;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: 'warned' | 'failed' | 'fallback' | 'blocked';
}

// Event types
export type PromptEventType = 
  | 'prompt:loaded'
  | 'prompt:invalid'
  | 'prompt:evolved'
  | 'prompt:scored'
  | 'prompt:violation'
  | 'prompt:deprecated'
  | 'prompt:archived';

export interface PromptEvent {
  type: PromptEventType;
  timestamp: number;
  data: {
    promptId: string;
    version?: string;
    details?: any;
  };
}

// Service interfaces
export interface PromptLoader {
  eventBus: EventBus;
  loadPrompt(path: string): Promise<PromptDefinition>;
  validatePrompt(prompt: PromptDefinition): Promise<boolean>;
  refreshPrompts(): Promise<void>;
}

export interface PromptEvolver {
  eventBus: EventBus;
  evolvePrompt(
    prompt: PromptDefinition,
    context: {
      feedback?: any;
      metrics?: any;
      triggers?: any;
    }
  ): Promise<PromptDefinition>;
  validateEvolution(
    original: PromptDefinition,
    evolved: PromptDefinition
  ): Promise<boolean>;
}

export interface PromptScorer {
  eventBus: EventBus;
  scorePrompt(
    prompt: PromptDefinition,
    session: {
      input: any;
      output: any;
      metrics: any;
    }
  ): Promise<PromptScore>;
  validateScore(score: PromptScore): Promise<boolean>;
}

/**
 * Represents the result of a prompt execution
 */
export interface PromptExecutionResult {
  /** Unique identifier for the prompt */
  promptId: string;
  
  /** Version of the prompt */
  version: string;
  
  /** Timestamp of execution */
  timestamp: number;
  
  /** Alignment score (0-1) */
  alignmentScore: number;
  
  /** Original alignment score before any modifications */
  originalAlignmentScore: number;
  
  /** Trust score (0-1) */
  trustScore: number;
  
  /** Performance score (0-1) */
  performanceScore: number;
  
  /** The output of the prompt execution */
  output: string;
  
  /** Additional metadata */
  metadata?: {
    /** Author of the prompt */
    author?: string;
    
    /** Tags associated with the prompt */
    tags?: string[];
    
    /** Source of the prompt */
    source?: string;
    
    /** Additional metadata */
    [key: string]: unknown;
  };
} 