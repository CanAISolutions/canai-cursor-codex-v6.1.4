/**
 * Airtable API Types for CanAI Emotional Intelligence Platform
 * 
 * Comprehensive type definitions for all 18 tables in the revolutionary
 * emotional intelligence infrastructure, including SparkSplit trust transparency,
 * predictive analytics, and meta-intelligence capabilities.
 * 
 * @version 2.0.0 - 18-Table Optimized Architecture
 * @author CanAI Codex v6.1.4
 * @trust_score 4.7
 */

// Base Airtable Configuration
export interface AirtableConfig {
  baseId: string;
  apiKey: string;
  rateLimitMs?: number;
  retryAttempts?: number;
  timeout?: number;
}

// Common Airtable Field Types
export type AirtableFieldValue = string | number | boolean | string[] | Date | null;

export interface AirtableRecord<T = Record<string, AirtableFieldValue>> {
  id: string;
  fields: T;
  createdTime: string;
}

export interface AirtableResponse<T = Record<string, AirtableFieldValue>> {
  records: AirtableRecord<T>[];
  offset?: string;
}

// ===== REVOLUTIONARY TRUST ENGINE =====

export interface SparkSplitAnalytics {
  session_id: string;
  user_id: string;
  trust_score_before: number;
  trust_score_after: number;
  trust_delta: number;
  comparison_type: 'side_by_side' | 'sequential' | 'historical';
  comparison_data: string; // JSON
  transparency_level: number;
  trust_factors: string[]; // Multi-select
  evolution_stage: 'initial' | 'building' | 'established' | 'advanced';
  predictive_trust_score: number;
  confidence_interval: number;
  trust_trajectory: 'ascending' | 'stable' | 'declining';
  emotional_resonance: number;
  behavioral_consistency: number;
  value_alignment: number;
  communication_clarity: number;
  reliability_score: number;
}

export interface TrustMetrics {
  user_id: string;
  current_trust_score: number;
  trust_trend: 'increasing' | 'stable' | 'decreasing';
  trust_velocity: number;
  trust_consistency: number;
  last_updated: Date;
  trust_factors_breakdown: string; // JSON
  validation_status: 'validated' | 'pending' | 'flagged';
}

export interface TrustEvolution {
  user_id: string;
  timestamp: Date;
  trust_score: number;
  trust_event: string;
  event_impact: number;
  cumulative_trust: number;
  trust_milestone: string;
  evolution_pattern: string;
  prediction_accuracy: number;
  next_milestone_prediction: string;
}

export interface EmotionalCompass {
  session_id: string;
  emotional_state: string;
  emotional_intensity: number;
  emotional_stability: number;
  resonance_score: number;
  navigation_direction: string;
  compass_reading: string;
  emotional_trajectory: string;
}

// ===== CORE ANALYTICS PLATFORM =====

export interface PromptLogs {
  session_id: string;
  user_id: string;
  prompt_type: string;
  prompt_content: string;
  response_content: string;
  timestamp: Date;
  trust_score: number;
  emotional_intelligence_score: number;
  user_satisfaction: number;
  response_time_ms: number;
  token_usage: number;
  cost_usd: number;
  revision_count: number;
  confirmation_status: 'confirmed' | 'revised' | 'rejected';
  emotional_tone: string;
  confidence_level: number;
  behavioral_signals: string[]; // Multi-select
  context_richness: number;
  personalization_level: number;
  innovation_score: number;
  compound_value: number;
  reusability_score: number;
  learning_extraction: string;
  meta_insights: string; // JSON
  future_prediction: string;
}

export interface SessionAnalytics {
  session_id: string;
  user_id: string;
  start_time: Date;
  end_time: Date;
  duration_minutes: number;
  prompt_count: number;
  avg_trust_score: number;
  emotional_journey_summary: string;
  key_insights: string[];
  behavioral_patterns: string[];
  satisfaction_score: number;
  engagement_level: number;
  conversion_likelihood: number;
}

export interface UserContext {
  user_id: string;
  emotional_profile: string; // JSON
  trust_level: number;
  behavioral_patterns: string[]; // Multi-select
  preferences: string; // JSON
  interaction_history: string; // JSON
  predictive_insights: string; // JSON
  personalization_data: string; // JSON
  emotional_state: string;
  engagement_score: number;
  lifetime_value_prediction: number;
}

export interface OutputGoldmine {
  output_id: string;
  session_id: string;
  content_type: string;
  content_value: string;
  reusability_score: number;
  compound_intelligence: string; // JSON
  pattern_recognition: string; // JSON
  future_applications: string[];
  value_multiplier: number;
  intelligence_category: string;
  extraction_confidence: number;
  meta_learning: string; // JSON
}

// ===== PREDICTIVE INTELLIGENCE SUITE =====

export interface PredictiveInsights {
  user_id: string;
  prediction_type: string;
  prediction_value: string;
  confidence_score: number;
  time_horizon: string;
  contributing_factors: string[]; // Multi-select
  prediction_accuracy: number;
  business_impact: string;
  recommendation: string;
}

export interface RevenueAttribution {
  session_id: string;
  user_id: string;
  revenue_amount: number;
  attribution_confidence: number;
  conversion_path: string; // JSON
  touchpoint_influence: string; // JSON
  emotional_factors: string[]; // Multi-select
  trust_contribution: number;
  prediction_accuracy: number;
}

export interface ConversionFunnels {
  funnel_stage: string;
  user_id: string;
  entry_timestamp: Date;
  exit_timestamp: Date;
  stage_duration: number;
  conversion_probability: number;
  drop_off_risk: number;
  optimization_opportunities: string[];
  emotional_barriers: string[];
  trust_requirements: number;
}

export interface GrowthMetrics {
  metric_name: string;
  metric_value: number;
  measurement_date: Date;
  growth_rate: number;
  trend_direction: 'up' | 'down' | 'stable';
  contributing_factors: string[]; // Multi-select
  target_value: number;
  achievement_probability: number;
  optimization_recommendations: string[];
}

// ===== EMOTIONAL INTELLIGENCE CORE =====

export interface EmotionalIntelligence {
  session_id: string;
  emotional_state: string;
  emotional_intensity: number;
  emotional_stability: number;
  empathy_score: number;
  emotional_growth: number;
  resonance_quality: string;
}

export interface EmotionalJourney {
  user_id: string;
  journey_stage: string;
  emotional_milestone: string;
  milestone_timestamp: Date;
  emotional_progression: number;
  journey_satisfaction: number;
  emotional_challenges: string[];
  growth_opportunities: string[];
  next_milestone_prediction: string;
  journey_personalization: string; // JSON
  emotional_support_needs: string[];
  resonance_optimization: string; // JSON
}

export interface SentimentAnalysis {
  content_id: string;
  content_type: string;
  sentiment_score: number;
  sentiment_category: 'positive' | 'neutral' | 'negative';
  emotional_nuances: string[]; // Multi-select
  confidence_level: number;
  contextual_factors: string; // JSON
  sentiment_evolution: string; // JSON
  predictive_sentiment: number;
  emotional_triggers: string[];
  sentiment_stability: number;
}

export interface BehavioralPatterns {
  user_id: string;
  pattern_type: string;
  pattern_description: string;
  pattern_frequency: number;
  pattern_strength: number;
  behavioral_triggers: string[]; // Multi-select
  pattern_evolution: string; // JSON
  predictive_behavior: string;
  intervention_opportunities: string[];
  pattern_optimization: string; // JSON
}

// ===== META-INTELLIGENCE SYSTEM =====

export interface SystemEvolution {
  evolution_id: string;
  timestamp: Date;
  system_component: string;
  evolution_type: string;
  improvement_description: string;
  impact_score: number;
  learning_extraction: string;
  future_implications: string;
  evolution_confidence: number;
  meta_learning: string; // JSON
  system_intelligence_gain: number;
  compound_evolution: string; // JSON
}

export interface MetaIntelligence {
  intelligence_id: string;
  intelligence_type: string;
  intelligence_value: string; // JSON
  meta_level: number;
  intelligence_confidence: number;
  learning_depth: number;
  application_potential: string[];
  intelligence_evolution: string; // JSON
  compound_intelligence: string; // JSON
  future_intelligence_prediction: string;
}

export interface InnovationMetrics {
  innovation_id: string;
  innovation_type: string;
  innovation_value: number;
  creativity_score: number;
  implementation_feasibility: number;
  business_impact_potential: number;
  innovation_timeline: string;
  success_probability: number;
}

export interface FutureInsights {
  insight_id: string;
  insight_category: string;
  insight_description: string;
  time_horizon: string;
  confidence_level: number;
  impact_assessment: string;
  preparation_recommendations: string[];
  insight_evolution: string; // JSON
  strategic_implications: string;
}

// ===== SUPPORTING INFRASTRUCTURE =====

export interface FeedbackLogs {
  feedback_id: string;
  session_id: string;
  user_id: string;
  feedback_type: string;
  feedback_content: string;
  satisfaction_rating: number;
  improvement_suggestions: string[];
  feedback_sentiment: number;
  actionable_insights: string[];
}

export interface DeliveryCostLogs {
  session_id: string;
  cost_type: string;
  cost_amount: number;
  cost_timestamp: Date;
  cost_optimization_potential: number;
}

export interface ReferralTriggers {
  user_id: string;
  trigger_type: string;
  trigger_timestamp: Date;
  trigger_effectiveness: number;
  referral_potential: number;
  viral_coefficient: number;
  trigger_optimization: string; // JSON
}

export interface AIMiningAgents {
  agent_id: string;
  agent_type: string;
  mining_target: string;
  extraction_quality: number;
  intelligence_value: number;
  agent_performance: number;
  learning_efficiency: number;
  compound_contribution: number;
  agent_evolution: string; // JSON
  future_capabilities: string[];
}

// ===== API OPERATION TYPES =====

export interface CreateRecordRequest<T> {
  fields: T;
}

export interface UpdateRecordRequest<T> {
  id: string;
  fields: Partial<T>;
}

export interface QueryOptions {
  filterByFormula?: string;
  maxRecords?: number;
  pageSize?: number;
  sort?: Array<{
    field: string;
    direction: 'asc' | 'desc';
  }>;
  view?: string;
  offset?: string;
}

export interface BulkOperationResult {
  successful: number;
  failed: number;
  errors: Array<{
    recordId?: string;
    error: string;
  }>;
}

// ===== TABLE MAPPING =====

export const AIRTABLE_TABLES = {
  // TIER 1: CORE TABLES (3 TABLES)
  PROMPT_LOGS: 'PromptLogs',
  SESSION_ANALYTICS: 'SessionAnalytics',
  SPARK_SPLIT_ANALYTICS: 'SparkSplitAnalytics',
  
  // TIER 2: INTELLIGENCE TABLES (5 TABLES)
  GOLDMINE_OUTPUT: 'GoldmineOutput',
  USER_CONTEXT: 'UserContext',
  EMOTIONAL_INTELLIGENCE: 'EmotionalIntelligence',
  TRUST_METRICS: 'TrustMetrics',
  PERFORMANCE_METRICS: 'PerformanceMetrics',
  
  // TIER 3: INTEGRATION INFRASTRUCTURE (5 TABLES)
  WEBHOOK_LOGS: 'WebhookLogs',
  AIRTABLE_SYNC: 'AirtableSync',
  ERROR_LOGS: 'ErrorLogs',
  PROCESSING_RESULTS: 'ProcessingResults',
  SYSTEM_HEALTH: 'SystemHealth',
  
  // TIER 4: REFERENCE TABLES (5 TABLES)
  PROMPT_TYPES: 'PromptTypes',
  EMOTIONAL_STATES: 'EmotionalStates',
  TRUST_FACTORS: 'TrustFactors',
  SYSTEM_CONFIGS: 'SystemConfigs',
  ANALYTICS_AGGREGATES: 'AnalyticsAggregates'
} as const;

export type TableName = typeof AIRTABLE_TABLES[keyof typeof AIRTABLE_TABLES];

// ===== ERROR TYPES =====

export class AirtableError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public airtableErrorType?: string
  ) {
    super(message);
    this.name = 'AirtableError';
  }
}

export class RateLimitError extends AirtableError {
  constructor(retryAfter?: number) {
    super(`Rate limit exceeded${retryAfter ? `, retry after ${retryAfter}s` : ''}`);
    this.name = 'RateLimitError';
  }
}

export class ValidationError extends AirtableError {
  constructor(field: string, value: any, expectedType: string) {
    super(`Validation failed for field '${field}': expected ${expectedType}, got ${typeof value}`);
    this.name = 'ValidationError';
  }
} 