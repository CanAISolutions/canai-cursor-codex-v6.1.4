// 📁 /cursor/system-roles.ts — Registry of System Logic
// Purpose: Declare all known agents, prompt scaffolds, and critical role mappings
// Enforced by: Codex Checkpoint Directive — Phase Delta

export type PromptType =
  | 'ai_blueprint'
  | 'business_plan'
  | 'email_campaign'
  | 'site_audit'
  | 'social_content'
  | 'reverse_strategy'
  | 'ai_brand_identity'
  | 'profile_makeover'
  | 'blogblitz'
  | 'ad_amplify'
  | 'sparksplit';

export type AgentRole =
  | 'defaults-engine'
  | 'trust-score-enforcer'
  | 'emotion-validator'
  | 'spark-generator'
  | 'prompt-router'
  | 'session-reuse'
  | 'analytics-emitter'
  | 'ab-testing-engine'
  | 'continuous-improvement';

export interface AgentMetadata {
  id: string;
  file: string;
  promptTypesUsed: PromptType[] | ['all'];
  role: AgentRole;
  test: boolean;
  status: 'active' | 'legacy' | 'in-dev';
}

export const SystemAgents: AgentMetadata[] = [
  {
    id: 'smart-defaults',
    file: 'cursor/agents/smart-defaults-engine.ts',
    promptTypesUsed: ['business_plan', 'email_campaign', 'profile_makeover', 'blogblitz', 'ad_amplify', 'sparksplit'],
    role: 'defaults-engine',
    test: true,
    status: 'active',
  },
  {
    id: 'emotional-checker',
    file: 'cursor/agents/emotion-validator.ts',
    promptTypesUsed: ['social_content', 'ai_brand_identity', 'profile_makeover', 'blogblitz', 'ad_amplify', 'sparksplit'],
    role: 'emotion-validator',
    test: true,
    status: 'active',
  },
  {
    id: 'spark-layer',
    file: 'cursor/overlays/spark-layer.ts',
    promptTypesUsed: ['reverse_strategy'],
    role: 'spark-generator',
    test: true,
    status: 'active',
  },
  {
    id: 'sparksplit-engine',
    file: 'cursor/agents/sparksplit-trust-engine.ts',
    promptTypesUsed: ['sparksplit'],
    role: 'trust-score-enforcer',
    test: true,
    status: 'active',
  },
  {
    id: 'sparksplit-ab-testing',
    file: 'cursor/services/sparksplit-ab-testing-engine.ts',
    promptTypesUsed: ['all'],
    role: 'ab-testing-engine',
    test: true,
    status: 'active',
  },
  {
    id: 'continuous-improvement',
    file: 'cursor/services/sparksplit-continuous-improvement.ts',
    promptTypesUsed: ['all'],
    role: 'continuous-improvement',
    test: true,
    status: 'active',
  },
  {
    id: 'session-memory',
    file: 'cursor/agents/session-reuse-engine.ts',
    promptTypesUsed: ['business_plan', 'site_audit', 'profile_makeover', 'blogblitz', 'ad_amplify', 'sparksplit'],
    role: 'session-reuse',
    test: true,
    status: 'active',
  },
  {
    id: 'trust-gate',
    file: 'cursor/agents/trust-score-checker.ts',
    promptTypesUsed: ['all'],
    role: 'trust-score-enforcer',
    test: false,
    status: 'in-dev',
  }
];
