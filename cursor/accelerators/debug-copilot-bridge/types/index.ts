/**
 * @file types/index.ts
 * @description Type definitions for the debug-copilot-bridge
 */

import { DebugContext } from '../../agents/debug/types';

export interface DebugCopilotConfig {
  trustScoreThreshold: number;
  enableSelfHealing: boolean;
  debugMode: 'basic' | 'enhanced' | 'full';
  maxSuggestionsPerContext: number;
  healingStrategies: string[];
}

export interface CopilotSuggestion {
  code: string;
  explanation: string;
  metadata: {
    trustScore?: number;
    healingApplied?: boolean;
    [key: string]: any;
  };
}

export interface TrustScorerConfig {
  threshold: number;
}

export interface SelfHealingConfig {
  enabled: boolean;
  strategies: string[];
}

export interface ContextAnalysis {
  issues: string[];
  trustScore: number;
  suggestions?: string[];
}

export interface HealingResult {
  success: boolean;
  suggestion?: CopilotSuggestion;
  explanation?: string;
} 