/**
 * SupabaseSchemaMapping.ts
 * 
 * Comprehensive TypeScript mapping of the Supabase database schema
 * Generated from workspace-organization/supabase-sql.md
 * 
 * Purpose: Provides type-safe database interactions, query builders,
 * and schema documentation for future development.
 * 
 * Sacred Reversal Test: Does this make database development feel
 * empowering and error-free for developers?
 * 
 * Trust Building: Every type here builds confidence in database operations
 */

// ============================================================================
// CORE DATABASE TYPES
// ============================================================================

export type DatabaseTimestamp = string; // ISO timestamp
export type UUID = string;
export type JSONB = Record<string, any>;

// ============================================================================
// ENUMS AND CONSTRAINTS
// ============================================================================

export enum PromptType {
  AD_AMPLIFY = 'ad_amplify',
  BLOGBLITZ = 'blogblitz',
  PROFILE_MAKEOVER = 'profile_makeover',
  BUSINESS_PLAN = 'business_plan',
  EMAIL_CAMPAIGN = 'email_campaign',
  SITE_AUDIT = 'site_audit',
  SOCIAL_CONTENT = 'social_content',
  REVERSE_STRATEGY = 'reverse_strategy',
  AI_BLUEPRINT = 'ai_blueprint',
  AI_BRAND_IDENTITY = 'ai_brand_identity',
  SPARK_SPLIT = 'spark_split'
}

export enum UserSelection {
  STERILE = 'sterile',
  CANAI = 'canai',
  BOTH = 'both',
  NEITHER = 'neither',
  SKIP = 'skip',
  PENDING = 'pending'
}

export enum SessionStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned'
}

export enum TrustTrend {
  INCREASING = 'increasing',
  DECREASING = 'decreasing',
  STABLE = 'stable',
  VOLATILE = 'volatile'
}

// ============================================================================
// CORE TABLE INTERFACES
// ============================================================================

export interface UserContext {
  id: UUID;
  user_id: string;
  email?: string;
  name?: string;
  total_sessions: number;
  preferred_tone?: string;
  industry_focus?: string[];
  business_goals?: string[];
  emotional_profile?: JSONB;
  spark_resonance?: JSONB;
  personalization_score?: number; // 0-1
  predictive_insights?: JSONB;
  lifetime_value?: number;
  churn_risk?: number; // 0-1
  engagement_trend?: string;
  trust_history?: JSONB;
  trust_score_current?: number; // 0-5
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

export interface SessionAnalytics {
  id: UUID;
  session_id: string;
  user_id?: string;
  start_time: DatabaseTimestamp;
  end_time?: DatabaseTimestamp;
  duration?: number;
  prompt_count: number;
  products_used: string[];
  primary_product?: PromptType;
  trust_score_before?: number; // 0-5
  trust_score_after?: number; // 0-5
  trust_delta?: number; // -5 to 5
  emotional_depth?: number; // 0-1
  awe_score?: number; // 0-1
  ownership_score?: number; // 0-1
  wonder_score?: number; // 0-1
  calm_score?: number; // 0-1
  power_score?: number; // 0-1
  override_count: number;
  time_to_confirmation?: number;
  drop_off_signal: boolean;
  cohort?: string;
  status: SessionStatus;
  webhook_triggered: boolean;
  webhook_scenario?: string;
  webhook_response?: JSONB;
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

export interface PromptLogs {
  id: UUID;
  timestamp: DatabaseTimestamp;
  session_id: string;
  user_id: string;
  prompt_type: PromptType;
  input_fields: JSONB;
  output?: JSONB;
  tokens_used?: number;
  cost_usd?: number;
  trust_score?: number; // 0-5
  resonance_score?: number; // 0-1
  smart_prompt_score?: number; // 0-1
  emotional_depth?: number; // 0-1
  awe_score?: number; // 0-1
  ownership_score?: number; // 0-1
  wonder_score?: number; // 0-1
  calm_score?: number; // 0-1
  power_score?: number; // 0-1
  content_vector?: any; // Vector type
  fallback_triggered: boolean;
  fallback_fields?: string[];
  analytics_meta?: JSONB;
  consent_given: boolean;
  deletion_requested: boolean;
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

export interface SparkSplitComparisons {
  id: UUID;
  session_id: string;
  user_id?: string;
  prompt_type: string;
  user_input: JSONB;
  user_context: JSONB;
  canai_output: JSONB;
  sterile_output: JSONB;
  canai_awe_score: number;
  canai_ownership_score: number;
  canai_wonder_score: number;
  canai_calm_score: number;
  canai_power_score: number;
  sterile_awe_score: number;
  sterile_ownership_score: number;
  sterile_wonder_score: number;
  sterile_calm_score: number;
  sterile_power_score: number;
  trust_delta: number; // -1.0 to 1.0
  competitive_advantage: number; // 0-1
  trust_transparency_score: number;
  emotional_education_score: number;
  revolutionary_positioning: number;
  sacred_reversal_passed: boolean;
  user_empowerment_increased: boolean;
  emotional_sovereignty_preserved: boolean;
  user_selection?: UserSelection;
  time_to_selection?: number;
  would_refer?: boolean;
  shared_output: boolean;
  viral_potential_score: number;
  circuit_breaker_triggered: boolean;
  generation_time_ms?: number;
  canai_generation_time_ms?: number;
  sterile_generation_time_ms?: number;
  trust_building_moments: JSONB;
  competitive_insights: JSONB;
  educational_value: number;
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
  completed_at?: DatabaseTimestamp;
}

export interface EmotionalIntelligence {
  id: UUID;
  session_id: string;
  user_id: string;
  emotional_state?: string;
  confidence_level?: number; // 0-1
  stress_indicators?: string[];
  motivation_factors?: string[];
  emotional_journey?: JSONB;
  peak_moments?: JSONB;
  growth_indicators?: JSONB;
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

export interface TrustMetrics {
  id: UUID;
  session_id: string;
  user_id: string;
  consistency_score?: number; // 0-1
  reliability_score?: number; // 0-1
  transparency_score?: number; // 0-1
  safety_score?: number; // 0-1
  trust_score?: number; // 0-5
  trust_trend?: TrustTrend;
  trust_events?: JSONB;
  recovery_events?: JSONB;
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

export interface CompetitiveAdvantageMetrics {
  id: UUID;
  comparison_id?: UUID;
  trust_transparency_advantage: number;
  emotional_intelligence_advantage: number;
  user_empowerment_advantage: number;
  competitive_differentiation: number;
  unbeatable_factors: JSONB;
  replication_difficulty: number;
  market_leadership_score: number;
  user_loyalty_impact: number;
  word_of_mouth_potential: number;
  competitive_moat_strength: number;
  created_at: DatabaseTimestamp;
}

export interface TrustTransparencyMetrics {
  id: UUID;
  comparison_id?: UUID;
  trust_moment_type: string;
  trust_impact_score: number;
  educational_value: number;
  transparency_level: number;
  concept_clarity_score: number;
  emotional_resonance_score: number;
  practical_applicability: number;
  makes_user_feel_seen: boolean;
  makes_user_feel_empowered: boolean;
  makes_user_feel_less_alone: boolean;
  builds_trust_with_dreams: boolean;
  created_at: DatabaseTimestamp;
}

export interface GoldmineOutput {
  id: UUID;
  session_id: string;
  user_id?: string;
  prompt_type?: string;
  output_content: string;
  output_hash?: string;
  resonance_score?: number; // 0-1
  trust_score?: number; // 0-5
  emotional_fingerprint?: JSONB;
  industry_cluster?: string;
  intent_summary?: string;
  spark_concept?: string;
  reuse_category?: string;
  reuse_potential?: number; // 0-1
  compound_value?: number;
  content_vector?: any; // Vector type
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

export interface PerformanceMetrics {
  id: UUID;
  session_id: string;
  response_time?: number;
  token_efficiency?: number;
  error_rate?: number;
  uptime_percentage?: number;
  cpu_usage?: number;
  memory_usage?: number;
  api_calls?: number;
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

export interface ErrorLogs {
  id: UUID;
  session_id?: string;
  error_type?: string;
  error_message?: string;
  error_stack?: string;
  error_context?: JSONB;
  recovery_attempted: boolean;
  recovery_successful: boolean;
  recovery_method?: string;
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

export interface WebhookLogs {
  id: UUID;
  session_id: string;
  webhook_url?: string;
  webhook_type?: string;
  payload?: JSONB;
  response_status?: number;
  response_body?: string;
  sent_at?: DatabaseTimestamp;
  response_time?: number;
  retry_count: number;
  max_retries: number;
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

export interface SystemConfigs {
  id: UUID;
  config_key: string;
  config_value?: JSONB;
  config_type?: string;
  description?: string;
  is_active: boolean;
  validation_schema?: JSONB;
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

export interface SystemHealth {
  id: UUID;
  component_name: string;
  status: string;
  uptime_percentage?: number;
  last_check: DatabaseTimestamp;
  config_id?: UUID;
  metrics?: JSONB;
  alerts?: JSONB;
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

export interface AirtableSync {
  id: UUID;
  table_name: string;
  last_sync?: DatabaseTimestamp;
  sync_status?: string;
  records_synced?: number;
  errors_count?: number;
  config_id?: UUID;
  sync_log?: JSONB;
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

export interface PromptTypes {
  id: UUID;
  prompt_type: string;
  display_name?: string;
  description?: string;
  category?: string;
  complexity_level?: string;
  input_schema?: JSONB;
  output_schema?: JSONB;
  total_usage_count: number;
  average_trust_score?: number;
  average_cost_per_use?: number;
  is_active: boolean;
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

export interface SparkSplitAnalytics {
  id: UUID;
  session_id: string;
  timestamp: number;
  prompt_type?: string;
  comparison_id?: string;
  trust_delta?: number; // -5 to 5
  user_selection?: UserSelection;
  time_to_selection?: number;
  awe_score?: number; // 0-1
  ownership_score?: number; // 0-1
  wonder_score?: number; // 0-1
  calm_score?: number; // 0-1
  power_score?: number; // 0-1
  competitive_advantage?: number; // 0-1
  trust_transparency_score?: number; // 0-1
  emotional_education_score?: number; // 0-1
  would_refer?: boolean;
  shared_output: boolean;
  circuit_breaker_triggered: boolean;
  sterile_output?: string;
  canai_output?: string;
  educational_moment: boolean;
  comprehension_score?: number; // 0-1
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

export interface AnalyticsAggregates {
  id: UUID;
  aggregate_type: string;
  period_start?: DatabaseTimestamp;
  period_end?: DatabaseTimestamp;
  granularity?: string;
  metrics?: JSONB;
  prompt_type_id?: UUID;
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

export interface EmotionalStates {
  id: UUID;
  state_name: string;
  description?: string;
  category?: string;
  intensity_level?: number; // 1-10
  awe_influence?: number;
  ownership_influence?: number;
  wonder_influence?: number;
  calm_influence?: number;
  power_influence?: number;
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

export interface TrustFactors {
  id: UUID;
  factor_name: string;
  description?: string;
  category?: string;
  weight?: number; // 0-1
  positive_impact?: number;
  negative_impact?: number;
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

export interface ProcessingResults {
  id: UUID;
  session_id: string;
  pipeline_stage?: string;
  processing_time?: number;
  success_rate?: number;
  output_quality?: number;
  results?: JSONB;
  metadata?: JSONB;
  created_at: DatabaseTimestamp;
  updated_at: DatabaseTimestamp;
}

// ============================================================================
// DATABASE SCHEMA MAPPING
// ============================================================================

export interface SupabaseSchema {
  airtable_sync: AirtableSync;
  analytics_aggregates: AnalyticsAggregates;
  competitive_advantage_metrics: CompetitiveAdvantageMetrics;
  emotional_intelligence: EmotionalIntelligence;
  emotional_states: EmotionalStates;
  error_logs: ErrorLogs;
  goldmine_output: GoldmineOutput;
  performance_metrics: PerformanceMetrics;
  processing_results: ProcessingResults;
  prompt_logs: PromptLogs;
  prompt_types: PromptTypes;
  session_analytics: SessionAnalytics;
  sparksplit_analytics: SparkSplitAnalytics;
  sparksplit_comparisons: SparkSplitComparisons;
  system_configs: SystemConfigs;
  system_health: SystemHealth;
  trust_factors: TrustFactors;
  trust_metrics: TrustMetrics;
  trust_transparency_metrics: TrustTransparencyMetrics;
  user_context: UserContext;
  webhook_logs: WebhookLogs;
}

export type TableName = keyof SupabaseSchema;
export type TableRecord<T extends TableName> = SupabaseSchema[T];

// ============================================================================
// RELATIONSHIP MAPPING
// ============================================================================

export interface DatabaseRelationships {
  // User-centric relationships
  user_context: {
    sessions: 'session_analytics.user_id';
    prompt_logs: 'prompt_logs.user_id';
    emotional_intelligence: 'emotional_intelligence.user_id';
    trust_metrics: 'trust_metrics.user_id';
    goldmine_output: 'goldmine_output.user_id';
  };
  
  // Session-centric relationships
  session_analytics: {
    user: 'user_context.user_id';
    prompt_logs: 'prompt_logs.session_id';
    emotional_intelligence: 'emotional_intelligence.session_id';
    trust_metrics: 'trust_metrics.session_id';
    sparksplit_analytics: 'sparksplit_analytics.session_id';
    sparksplit_comparisons: 'sparksplit_comparisons.session_id';
    performance_metrics: 'performance_metrics.session_id';
    error_logs: 'error_logs.session_id';
    webhook_logs: 'webhook_logs.session_id';
    processing_results: 'processing_results.session_id';
    goldmine_output: 'goldmine_output.session_id';
  };
  
  // SparkSplit relationships
  sparksplit_comparisons: {
    competitive_advantage_metrics: 'competitive_advantage_metrics.comparison_id';
    trust_transparency_metrics: 'trust_transparency_metrics.comparison_id';
  };
  
  // Configuration relationships
  system_configs: {
    system_health: 'system_health.config_id';
    airtable_sync: 'airtable_sync.config_id';
  };
  
  // Prompt type relationships
  prompt_types: {
    analytics_aggregates: 'analytics_aggregates.prompt_type_id';
  };
}

// ============================================================================
// QUERY BUILDER TYPES
// ============================================================================

export interface QueryFilters {
  user_id?: string;
  session_id?: string;
  prompt_type?: PromptType;
  trust_score_min?: number;
  trust_score_max?: number;
  date_from?: DatabaseTimestamp;
  date_to?: DatabaseTimestamp;
  emotional_threshold?: number;
  competitive_advantage_min?: number;
}

export interface SortOptions {
  column: string;
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export interface QueryOptions {
  filters?: QueryFilters;
  sort?: SortOptions[];
  pagination?: PaginationOptions;
  include_relations?: string[];
}

// ============================================================================
// UTILITY TYPES AND FUNCTIONS
// ============================================================================

/**
 * Creates a new database record with proper defaults
 */
export function createRecord<T extends TableName>(
  tableName: T,
  data: Partial<TableRecord<T>>
): Omit<TableRecord<T>, 'id' | 'created_at' | 'updated_at'> {
  const timestamp = new Date().toISOString();
  
  return {
    ...data,
    created_at: timestamp,
    updated_at: timestamp,
  } as Omit<TableRecord<T>, 'id' | 'created_at' | 'updated_at'>;
}

/**
 * Emotional Sovereignty Score Calculator
 * Sacred Reversal Test: Does this make users feel empowered?
 */
export function calculateEmotionalSovereigntyScore(record: {
  awe_score?: number;
  ownership_score?: number;
  wonder_score?: number;
  calm_score?: number;
  power_score?: number;
}): number {
  const scores = [
    record.awe_score || 0,
    record.ownership_score || 0,
    record.wonder_score || 0,
    record.calm_score || 0,
    record.power_score || 0,
  ];
  
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

/**
 * Trust Score Validator
 * Ensures trust scores meet our 4.2+ threshold
 */
export function validateTrustScore(score?: number): boolean {
  return (score || 0) >= 4.2;
}

/**
 * Revolutionary Advantage Calculator
 * Determines competitive advantage strength
 */
export function calculateRevolutionaryAdvantage(comparison: SparkSplitComparisons): number {
  const factors = [
    comparison.trust_transparency_score,
    comparison.emotional_education_score,
    comparison.revolutionary_positioning,
    comparison.competitive_advantage,
  ];
  
  return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
}

/**
 * Generates test data for any table
 */
export function generateTestData<T extends TableName>(tableName: T): Partial<TableRecord<T>> {
  const timestamp = new Date().toISOString();
  const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Base test data that applies to all tables
  const baseData = {
    created_at: timestamp,
    updated_at: timestamp,
  };
  
  // Table-specific test data
  switch (tableName) {
    case 'user_context':
      return {
        ...baseData,
        user_id: `user_${testId}`,
        email: `${testId}@canai.so`,
        name: `Test User ${testId}`,
        total_sessions: 0,
        trust_score_current: 4.5,
        personalization_score: 0.8,
        churn_risk: 0.1,
      } as Partial<TableRecord<T>>;
      
    case 'session_analytics':
      return {
        ...baseData,
        session_id: `session_${testId}`,
        user_id: `user_${testId}`,
        start_time: timestamp,
        prompt_count: 0,
        products_used: [],
        trust_score_before: 4.0,
        trust_score_after: 4.5,
        trust_delta: 0.5,
        emotional_depth: 0.7,
        awe_score: 0.8,
        ownership_score: 0.9,
        wonder_score: 0.8,
        calm_score: 0.7,
        power_score: 0.9,
        override_count: 0,
        drop_off_signal: false,
        status: 'active',
        webhook_triggered: false,
      } as Partial<TableRecord<T>>;
      
    case 'sparksplit_comparisons':
      return {
        ...baseData,
        session_id: `session_${testId}`,
        user_id: `user_${testId}`,
        prompt_type: 'business_plan',
        user_input: { test: 'input' },
        user_context: { test: 'context' },
        canai_output: { content: 'Revolutionary CanAI output' },
        sterile_output: { content: 'Generic sterile output' },
        canai_awe_score: 0.9,
        canai_ownership_score: 0.9,
        canai_wonder_score: 0.8,
        canai_calm_score: 0.8,
        canai_power_score: 0.9,
        sterile_awe_score: 0.3,
        sterile_ownership_score: 0.2,
        sterile_wonder_score: 0.3,
        sterile_calm_score: 0.4,
        sterile_power_score: 0.3,
        trust_delta: 0.6,
        competitive_advantage: 0.9,
        trust_transparency_score: 0.85,
        emotional_education_score: 0.78,
        revolutionary_positioning: 0.9,
        sacred_reversal_passed: true,
        user_empowerment_increased: true,
        emotional_sovereignty_preserved: true,
        user_selection: 'canai',
        shared_output: false,
        viral_potential_score: 0.8,
        circuit_breaker_triggered: false,
        trust_building_moments: [],
        competitive_insights: {},
        educational_value: 0.8,
      } as Partial<TableRecord<T>>;
      
    default:
      return baseData as Partial<TableRecord<T>>;
  }
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const ValidationRules = {
  trust_score: { min: 0, max: 5, threshold: 4.2 },
  emotional_scores: { min: 0, max: 1 },
  trust_delta: { min: -5, max: 5 },
  competitive_advantage: { min: 0, max: 1 },
  user_selection: Object.values(UserSelection),
  prompt_types: Object.values(PromptType),
  session_status: Object.values(SessionStatus),
} as const;

/**
 * Sacred Validation: Ensures all data honors emotional sovereignty
 */
export function validateEmotionalSovereignty(record: any): boolean {
  // Trust score must meet threshold
  if (record.trust_score && !validateTrustScore(record.trust_score)) {
    return false;
  }
  
  // Sacred reversal test indicators must be true
  if (record.sacred_reversal_passed === false) {
    return false;
  }
  
  if (record.user_empowerment_increased === false) {
    return false;
  }
  
  if (record.emotional_sovereignty_preserved === false) {
    return false;
  }
  
  return true;
}

// ============================================================================
// EXPORT ALL TYPES FOR EXTERNAL USE
// ============================================================================

export type {
  // Core interfaces
  UserContext,
  SessionAnalytics,
  PromptLogs,
  SparkSplitComparisons,
  EmotionalIntelligence,
  TrustMetrics,
  
  // Utility types
  DatabaseTimestamp,
  UUID,
  JSONB,
  TableName,
  TableRecord,
  QueryFilters,
  QueryOptions,
};

export {
  // Enums
  PromptType,
  UserSelection,
  SessionStatus,
  TrustTrend,
  
  // Functions
  createRecord,
  calculateEmotionalSovereigntyScore,
  validateTrustScore,
  calculateRevolutionaryAdvantage,
  generateTestData,
  validateEmotionalSovereignty,
  
  // Constants
  ValidationRules,
}; 