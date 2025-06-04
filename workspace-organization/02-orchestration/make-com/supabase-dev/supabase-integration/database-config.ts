/**
 * Supabase Database Configuration for Make.com Integration
 * 
 * Purpose: Type-safe database configuration and connection management
 * Framework: Emotional Sovereignty + Test-First Truth + Supabase JSONB
 * 
 * Sacred Reversal Test: Does this configuration make database operations
 * feel empowering and error-free for developers?
 */

// Import from relative path to avoid complex path resolution
// Note: Import will be updated based on actual file structure

// ============================================================================
// SUPABASE CONNECTION CONFIGURATION
// ============================================================================

export interface SupabaseConfig {
  url: string;
  key: string;
  schema: string;
  maxConnections: number;
  timeout: number;
  retryAttempts: number;
}

export const SUPABASE_CONFIG: SupabaseConfig = {
  url: process.env.SUPABASE_URL || '',
  key: process.env.SUPABASE_ANON_KEY || '',
  schema: 'public',
  maxConnections: 10,
  timeout: 30000,
  retryAttempts: 3,
};

// ============================================================================
// MAKE.COM WEBHOOK ENDPOINTS
// ============================================================================

export interface MakeWebhookEndpoint {
  name: string;
  url: string;
  table: string; // TableName type will be imported later
  priority: 'high' | 'medium' | 'low';
  emotionalSovereignty: boolean;
  trustThreshold: number;
}

export const MAKE_WEBHOOK_ENDPOINTS: MakeWebhookEndpoint[] = [
  // High Priority - Core Analytics
  {
    name: 'prompt-logs',
    url: '/webhook/prompt-logs',
    table: 'prompt_logs',
    priority: 'high',
    emotionalSovereignty: true,
    trustThreshold: 4.2,
  },
  {
    name: 'sparksplit-comparisons',
    url: '/webhook/sparksplit-comparisons',
    table: 'sparksplit_comparisons',
    priority: 'high',
    emotionalSovereignty: true,
    trustThreshold: 3.0,
  },
  {
    name: 'user-context',
    url: '/webhook/user-context',
    table: 'user_context',
    priority: 'high',
    emotionalSovereignty: true,
    trustThreshold: 4.2,
  },
  {
    name: 'session-analytics',
    url: '/webhook/session-analytics',
    table: 'session_analytics',
    priority: 'high',
    emotionalSovereignty: true,
    trustThreshold: 4.0,
  },
  
  // Medium Priority - Content Intelligence
  {
    name: 'goldmine-output',
    url: '/webhook/goldmine-output',
    table: 'goldmine_output',
    priority: 'medium',
    emotionalSovereignty: true,
    trustThreshold: 3.5,
  },
  {
    name: 'emotional-intelligence',
    url: '/webhook/emotional-intelligence',
    table: 'emotional_intelligence',
    priority: 'medium',
    emotionalSovereignty: true,
    trustThreshold: 4.0,
  },
  
  // System Monitoring
  {
    name: 'webhook-logs',
    url: '/webhook/webhook-logs',
    table: 'webhook_logs',
    priority: 'low',
    emotionalSovereignty: false,
    trustThreshold: 0,
  },
  {
    name: 'error-logs',
    url: '/webhook/error-logs',
    table: 'error_logs',
    priority: 'high',
    emotionalSovereignty: false,
    trustThreshold: 0,
  },
];

// ============================================================================
// EMOTIONAL SOVEREIGNTY VALIDATION
// ============================================================================

export interface EmotionalSovereigntyValidation {
  sacred_reversal_passed: boolean;
  user_empowerment_increased: boolean;
  emotional_sovereignty_preserved: boolean;
  trust_score: number;
  trust_threshold_met: boolean;
}

export function validateEmotionalSovereignty(
  data: any,
  endpoint: MakeWebhookEndpoint
): EmotionalSovereigntyValidation {
  const validation: EmotionalSovereigntyValidation = {
    sacred_reversal_passed: data.sacred_reversal_passed === true,
    user_empowerment_increased: data.user_empowerment_increased === true,
    emotional_sovereignty_preserved: data.emotional_sovereignty_preserved === true,
    trust_score: data.trust_score || 0,
    trust_threshold_met: (data.trust_score || 0) >= endpoint.trustThreshold,
  };

  return validation;
}

// ============================================================================
// SUPABASE OPERATION HELPERS
// ============================================================================

export interface SupabaseOperation {
  table: string; // TableName type will be imported later
  operation: 'INSERT' | 'UPDATE' | 'UPSERT' | 'SELECT';
  data?: any;
  filters?: Record<string, any>;
  emotionalValidation?: EmotionalSovereigntyValidation;
}

export function createSupabaseOperation(
  table: string,
  operation: 'INSERT',
  data: any,
  endpoint?: MakeWebhookEndpoint
): SupabaseOperation {
  const op: SupabaseOperation = {
    table,
    operation,
    data: {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  };

  // Add emotional sovereignty validation if required
  if (endpoint?.emotionalSovereignty) {
    op.emotionalValidation = validateEmotionalSovereignty(data, endpoint);
    
    // Ensure data includes emotional sovereignty fields
    op.data = {
      ...op.data,
      sacred_reversal_passed: op.emotionalValidation.sacred_reversal_passed,
      user_empowerment_increased: op.emotionalValidation.user_empowerment_increased,
      emotional_sovereignty_preserved: op.emotionalValidation.emotional_sovereignty_preserved,
    };
  }

  return op;
}

// ============================================================================
// MAKE.COM SCENARIO CONFIGURATION
// ============================================================================

export interface MakeScenarioConfig {
  name: string;
  triggerUrl: string;
  modules: MakeModule[];
  emotionalSovereignty: boolean;
  trustGates: TrustGate[];
}

export interface MakeModule {
  id: number;
  type: 'webhook' | 'router' | 'supabase' | 'http' | 'conditional';
  name: string;
  config: any;
}

export interface TrustGate {
  moduleId: number;
  condition: string;
  trustThreshold: number;
  recoveryAction: string;
}

export const SPARKSPLIT_SCENARIO_CONFIG: MakeScenarioConfig = {
  name: 'SparkSplit Trust Engine',
  triggerUrl: '/webhook/sparksplit-trigger',
  emotionalSovereignty: true,
  modules: [
    {
      id: 1,
      type: 'webhook',
      name: 'Receive User Request',
      config: {
        validation: 'interface-catalog',
        requiredFields: ['sessionId', 'userId', 'userInput', 'trustContext'],
      },
    },
    {
      id: 2,
      type: 'router',
      name: 'Trust Score Assessment',
      config: {
        routes: [
          {
            condition: 'trust_score >= 4.2',
            path: 'standard_processing',
          },
          {
            condition: 'trust_score >= 3.0 && trust_score < 4.2',
            path: 'enhanced_processing',
          },
          {
            condition: 'trust_score < 3.0',
            path: 'emotional_recovery',
          },
        ],
      },
    },
    {
      id: 3,
      type: 'http',
      name: 'Generate SparkSplit Comparison',
      config: {
        endpoint: '/api/sparksplit/generate',
        method: 'POST',
        timeout: 30000,
        retryAttempts: 3,
      },
    },
    {
      id: 4,
      type: 'supabase',
      name: 'Log SparkSplit Results',
      config: {
        table: 'sparksplit_comparisons',
        operation: 'INSERT',
        emotionalValidation: true,
      },
    },
  ],
  trustGates: [
    {
      moduleId: 2,
      condition: 'trust_score < 3.0',
      trustThreshold: 3.0,
      recoveryAction: 'emotional_recovery',
    },
    {
      moduleId: 4,
      condition: 'sacred_reversal_passed = false',
      trustThreshold: 4.2,
      recoveryAction: 'sovereignty_restoration',
    },
  ],
};

// ============================================================================
// NOTES
// ============================================================================

/**
 * This configuration file provides type-safe Supabase integration for Make.com
 * scenarios with emotional sovereignty validation and trust transparency.
 * 
 * Integration with schema mapping will be added once file structure is finalized.
 */ 