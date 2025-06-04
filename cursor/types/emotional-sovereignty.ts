/**
 * Emotional Sovereignty Types
 * Purpose: Core type definitions for the emotional sovereignty platform
 * Used by: SparkSplit, Sacred Moments, Reversal Test, and all emotional intelligence components
 */

export interface EmotionalContext {
  userId?: string;
  sessionId?: string;
  baseTrustScore: number;
  emotionalTriggers?: string[];
  languageFingerprint?: any;
  pastSuccessPatterns?: any[];
  industryContext?: string;
  culturalContext?: string;
  toneContext?: string;
  emotionalFingerprint?: any;
}

export interface TrustDelta {
  value?: number;
  source?: string;
  timestamp: Date;
  context?: string;
  component?: string;
  previousScore?: number;
  newScore?: number;
  reason?: string;
}

export interface SparkConcept {
  name: string;
  description: string;
  resonanceScore?: number;
  personalizedName?: string;
  emotionalTriggers?: string[];
  industryRelevance?: number;
  languageStyle?: string;
  emotionalResonance?: number;
}

export interface EmotionalIntelligenceMetrics {
  aweScore: number;
  ownershipScore: number;
  wonderScore: number;
  calmScore: number;
  powerScore: number;
  overallResonance: number;
}

export interface EnrichedEmotionalContext {
  baseContext: EmotionalContext;
  enrichmentLevel: 'basic' | 'enhanced' | 'deep' | 'transcendent';
  contextQuality: number;
  emotionalInsights: any[];
  crossSessionContinuity: any;
  currentEmotionalState: string;
  trustTrajectory: string;
  userProfile?: UserEmotionalProfile;
  lastEnrichmentTimestamp?: Date;
  enrichmentSources?: string[];
  trustProgression?: TrustDelta[];
  sessionConnections?: SessionConnection[];
  emotionalEvolution?: EmotionalEvolution[];
  persistentPreferences?: any;
  resonancePatterns?: any[];
  adaptationHistory?: AdaptationRecord[];
  continuityScore?: number;
  trustScore?: number;
  emotionalCompass?: EmotionalIntelligenceMetrics;
}

export interface UserEmotionalProfile {
  userId: string;
  trustLevel: number;
  emotionalTriggers: string[];
  languagePreferences: LanguagePreferences;
  industryContext: string;
  culturalBackground?: string;
  communicationStyle: CommunicationStyle;
  pastInteractionHistory: InteractionHistory[];
}

export interface LanguagePreferences {
  formalityLevel: 'casual' | 'professional' | 'formal';
  emotionalIntensity: 'low' | 'medium' | 'high';
  directness: 'indirect' | 'balanced' | 'direct';
  supportLevel: 'minimal' | 'moderate' | 'high';
  vocabularyComplexity: 'simple' | 'moderate' | 'complex';
}

export interface CommunicationStyle {
  primaryTone: string;
  secondaryTones: string[];
  emotionalResonancePatterns: string[];
  preferredMetaphors: string[];
  avoidancePatterns: string[];
}

export interface InteractionHistory {
  timestamp: Date;
  interactionType: string;
  emotionalResonance: number;
  trustDelta: number;
  successIndicators: string[];
  improvementAreas: string[];
}

export interface EmotionalValidationResult {
  isValid: boolean;
  confidenceScore: number;
  emotionalResonance: number;
  trustImpact: number;
  improvementSuggestions: string[];
}

export interface SovereigntyMetrics {
  beliefGenerationRate: number;
  emotionalTrustScore: number;
  sparkResonanceScore: number;
  sacredPartnershipScore: number;
  transformationCatalystScore: number;
}

export interface EmotionalMemoryEntry {
  userId: string;
  timestamp: Date;
  emotionalContext: EmotionalContext;
  interactionSummary: string;
  resonanceScore: number;
  trustDelta: number;
  keyInsights: string[];
  futureRecommendations: string[];
}

export interface EmotionalFallbackStrategy {
  triggerConditions: string[];
  recoveryActions: RecoveryAction[];
  dignityPreservationMethods: string[];
  trustRebuildingSteps: string[];
  emotionalSupportMessages: string[];
}

export interface RecoveryAction {
  type: 'tone_adjustment' | 'content_regeneration' | 'empathy_boost' | 'clarification_request';
  priority: 'high' | 'medium' | 'low';
  implementation: string;
  expectedOutcome: string;
}

export interface EmotionalResonanceAnalysis {
  overallScore: number;
  dimensionScores: {
    authenticity: number;
    empathy: number;
    understanding: number;
    empowerment: number;
    connection: number;
  };
  improvementAreas: string[];
  strengthAreas: string[];
}

export interface ToneAnalysisResult {
  detectedTone: string;
  confidence: number;
  emotionalUndertones: string[];
  appropriatenessScore: number;
  suggestedAdjustments: string[];
}

export interface PersonalizationMetrics {
  languageMatchingScore: number;
  contextualRelevanceScore: number;
  emotionalAlignmentScore: number;
  industrySpecificityScore: number;
  personalConnectionScore: number;
}

export interface EmotionalJourneyStage {
  stage: 'discovery' | 'engagement' | 'trust_building' | 'collaboration' | 'mastery';
  currentPosition: number; // 0-1 scale
  nextMilestones: string[];
  recommendedActions: string[];
  emotionalNeeds: string[];
}

export interface SacredMomentTrigger {
  momentType: string;
  triggerConditions: TriggerCondition[];
  emotionalPrerequisites: string[];
  contextualRequirements: string[];
  successCriteria: string[];
}

export interface TriggerCondition {
  type: 'emotional_state' | 'trust_level' | 'interaction_quality' | 'time_based' | 'content_based';
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'matches';
  value: any;
  weight: number;
}

export interface EmotionalIntelligenceConfig {
  sensitivityLevel: 'low' | 'medium' | 'high' | 'maximum';
  adaptationSpeed: 'slow' | 'moderate' | 'fast' | 'immediate';
  personalizationDepth: 'surface' | 'moderate' | 'deep' | 'profound';
  emotionalMemoryRetention: number; // days
  trustBuildingStrategy: 'conservative' | 'balanced' | 'aggressive';
}

export interface EmotionalSovereigntyReport {
  userId: string;
  reportDate: Date;
  overallSovereigntyScore: number;
  pillarScores: {
    seen: number;
    honored: number;
    empowered: number;
    lessAlone: number;
  };
  progressMetrics: {
    trustGrowth: number;
    resonanceImprovement: number;
    engagementDepth: number;
  };
  recommendations: string[];
  nextActions: string[];
}

export interface EmotionalContextEnrichment {
  originalContext: EmotionalContext;
  enrichedContext: EmotionalContext;
  enrichmentSources: string[];
  confidenceScore: number;
  validationStatus: 'validated' | 'pending' | 'failed';
}

export interface CrossSessionContinuity {
  userId: string;
  sessionConnections: SessionConnection[];
  emotionalEvolution: EmotionalEvolution[];
  persistentPreferences: any;
  adaptationHistory: AdaptationRecord[];
}

export interface SessionConnection {
  previousSessionId: string;
  currentSessionId: string;
  connectionStrength: number;
  sharedContext: any;
  emotionalContinuity: number;
}

export interface EmotionalEvolution {
  timestamp: Date;
  evolutionType: 'trust_increase' | 'preference_change' | 'style_adaptation' | 'need_shift';
  beforeState: any;
  afterState: any;
  triggerEvent: string;
  confidence: number;
}

export interface AdaptationRecord {
  timestamp: Date;
  adaptationType: string;
  originalApproach: string;
  adaptedApproach: string;
  successMetrics: any;
  learningOutcome: string;
}

export interface EmotionalSafetyProtocol {
  protocolName: string;
  triggerConditions: string[];
  safetyMeasures: SafetyMeasure[];
  escalationProcedures: string[];
  recoveryStrategies: string[];
}

export interface SafetyMeasure {
  measureType: 'content_filter' | 'tone_adjustment' | 'empathy_boost' | 'professional_referral';
  implementation: string;
  activationThreshold: number;
  expectedOutcome: string;
}

export interface EmotionalIntelligenceAudit {
  auditDate: Date;
  systemComponents: ComponentAuditResult[];
  overallHealthScore: number;
  criticalIssues: string[];
  recommendations: string[];
  complianceStatus: 'compliant' | 'minor_issues' | 'major_issues' | 'non_compliant';
}

export interface ComponentAuditResult {
  componentName: string;
  healthScore: number;
  functionalityStatus: 'operational' | 'degraded' | 'failed';
  performanceMetrics: any;
  identifiedIssues: string[];
  recommendedActions: string[];
}

// Utility types for type safety
export type EmotionalState = 'calm' | 'excited' | 'frustrated' | 'curious' | 'confident' | 'vulnerable' | 'empowered';
export type TrustLevel = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
export type ResonanceLevel = 'poor' | 'fair' | 'good' | 'excellent' | 'transcendent';
export type SovereigntyLevel = 'emerging' | 'developing' | 'established' | 'advanced' | 'mastery';

// Event types for the emotional intelligence system
export interface EmotionalEvent {
  eventId: string;
  timestamp: Date;
  eventType: EmotionalEventType;
  userId: string;
  sessionId: string;
  data: any;
  impact: EmotionalImpact;
}

export type EmotionalEventType = 
  | 'trust_increase'
  | 'trust_decrease'
  | 'resonance_peak'
  | 'emotional_breakthrough'
  | 'sovereignty_milestone'
  | 'sacred_moment'
  | 'fallback_triggered'
  | 'recovery_success'
  | 'adaptation_learned';

export interface EmotionalImpact {
  magnitude: number; // 0-1 scale
  direction: 'positive' | 'negative' | 'neutral';
  duration: 'momentary' | 'session' | 'persistent';
  affectedDimensions: string[];
}

// Configuration interfaces
export interface EmotionalSovereigntyConfig {
  version: string;
  features: FeatureConfig;
  thresholds: ThresholdConfig;
  fallbacks: FallbackConfig;
  monitoring: MonitoringConfig;
}

export interface FeatureConfig {
  sparkSplitEnabled: boolean;
  sacredMomentsEnabled: boolean;
  reversalTestEnabled: boolean;
  emotionalMemoryEnabled: boolean;
  adaptiveLearningEnabled: boolean;
}

export interface ThresholdConfig {
  minimumTrustScore: number;
  minimumResonanceScore: number;
  sovereigntyPassingScore: number;
  fallbackTriggerScore: number;
  adaptationTriggerThreshold: number;
}

export interface FallbackConfig {
  gracefulDegradation: boolean;
  fallbackMessages: string[];
  recoveryStrategies: string[];
  escalationPaths: string[];
}

export interface MonitoringConfig {
  realTimeTracking: boolean;
  alertThresholds: any;
  reportingFrequency: string;
  auditSchedule: string;
} 