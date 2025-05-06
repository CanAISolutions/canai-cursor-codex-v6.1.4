/**
 * prompt-registry/prompt-registry-schema.ts
 * 
 * Purpose:
 * Defines core types and interfaces for the prompt registry system.
 * Acts as the central source of truth for prompt definitions and versions.
 */

import { PromptDefinition } from '../prompt-infrastructure/prompt-schema';
import { Rule } from '../rules/rules-schema';

// Registry entry interface
export interface RegistryEntry {
  id: string;
  prompt: PromptDefinition;
  metadata: {
    createdAt: number;
    updatedAt: number;
    trustScore: number;
    alignmentScore: number;
    performanceScore: number;
    usageCount: number;
    lastUsed: number;
    tags: string[];
    dependencies: string[];
  };
  versionHistory: VersionHistory[];
  status: 'active' | 'deprecated' | 'archived';
}

// Version history interface
export interface VersionHistory {
  version: string;
  timestamp: number;
  delta: {
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
  };
  scores: {
    trust: number;
    performance: number;
    alignment: number;
  };
}

// Prompt index interface
export interface PromptIndex {
  byId: Map<string, RegistryEntry>;
  byType: Map<string, Set<string>>;
  byTrust: Map<number, Set<string>>;
  byVersion: Map<string, Map<string, RegistryEntry>>;
  byTag: Map<string, Set<string>>;
}

// Registry query options
export interface RegistryQueryOptions {
  type?: string;
  minTrustScore?: number;
  minAlignmentScore?: number;
  minPerformanceScore?: number;
  tags?: string[];
  version?: string;
  status?: RegistryEntry['status'];
  limit?: number;
  offset?: number;
}

// Registry event types
export type RegistryEventType = 
  | 'registry.prompt.loaded'
  | 'registry.prompt.evolved'
  | 'registry.prompt.invalid'
  | 'registry.prompt.deprecated';

export interface RegistryEvent {
  type: RegistryEventType;
  data: {
    promptId: string;
    version?: string;
    reason?: string;
    timestamp: number;
    metadata?: {
      trustScore?: number;
      alignmentScore?: number;
      performanceScore?: number;
    };
  };
}

// Registry service interfaces
export interface PromptRegistry {
  register(prompt: PromptDefinition): Promise<RegistryEntry>;
  get(promptId: string, version?: string): Promise<RegistryEntry | null>;
  query(options: RegistryQueryOptions): Promise<RegistryEntry[]>;
  evolve(promptId: string, delta: VersionHistory['delta']): Promise<RegistryEntry>;
  deprecate(promptId: string, reason: string): Promise<void>;
  validate(prompt: PromptDefinition): Promise<boolean>;
}

export interface PromptRegistryLoader {
  loadPrompts(directory: string): Promise<RegistryEntry[]>;
  validatePrompt(prompt: PromptDefinition): Promise<boolean>;
  registerPrompt(prompt: PromptDefinition): Promise<RegistryEntry>;
}

// Registry configuration
export interface RegistryConfig {
  trustThreshold: number;
  alignmentThreshold: number;
  performanceThreshold: number;
  maxVersions: number;
  validationRules: Rule[];
  cacheSize: number;
  updateInterval: number;
} 