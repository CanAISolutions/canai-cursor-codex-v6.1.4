// Airtable Base TypeScript Interfaces
// Generated: 2025-05-30T19:32:40.941Z
// Base ID: apph8yM7gVc9QBFtx

export interface PromptTypesRecord {
  id: string;
  createdTime: string;
  fields: {
    "id"?: string;
    "promptType"?: string;
    "displayName"?: string;
    "description"?: string;
    "category"?: string;
    "isActive"?: boolean;
    "defaultTone"?: string;
    "estimatedTokens"?: number;
    "complexity"?: string;
    "fieldCount"?: number;
    "hasNestedObjects"?: boolean;
    "PromptLogs"?: string[];
    "AnalyticsAggregates"?: string[];
    "Total Usage Count"?: any;
    "Average Trust Score"?: any;
    "Average Cost Per Use"?: any;
  };
}

export interface EmotionalStatesRecord {
  id: string;
  createdTime: string;
  fields: {
    "id"?: string;
    "stateName"?: string;
    "category"?: string;
    "intensity"?: string;
    "description"?: string;
    "recommendedTone"?: string;
    "isActive"?: boolean;
  };
}

export interface TrustFactorsRecord {
  id: string;
  createdTime: string;
  fields: {
    "id"?: string;
    "factorName"?: string;
    "category"?: string;
    "impact"?: string;
    "description"?: string;
    "applicableProducts"?: string[];
    "isActive"?: boolean;
  };
}

export interface SystemConfigsRecord {
  id: string;
  createdTime: string;
  fields: {
    "id"?: string;
    "configKey"?: string;
    "configValue"?: string;
    "category"?: string;
    "description"?: string;
    "isActive"?: boolean;
    "updatedBy"?: string;
    "AirtableSync"?: string[];
    "SystemHealth"?: string[];
  };
}

export interface AnalyticsAggregatesRecord {
  id: string;
  createdTime: string;
  fields: {
    "id"?: string;
    "aggregateType"?: string;
    "promptType"?: string;
    "dateRange"?: string;
    "totalSessions"?: number;
    "averageTrustScore"?: number;
    "averageResonanceScore"?: number;
    "totalTokensUsed"?: number;
    "totalCostUSD"?: any;
    "Prompt Type Ref"?: string[];
    "displayName (from Prompt Type Ref)"?: any;
    "category (from Prompt Type Ref)"?: any;
    "complexity (from Prompt Type Ref)"?: any;
  };
}

export interface SessionAnalyticsRecord {
  id: string;
  createdTime: string;
  fields: {
    "id"?: string;
    "sessionId"?: string;
    "userId"?: string;
    "startTime"?: string;
    "endTime"?: string;
    "duration"?: number;
    "promptCount"?: number;
    "productsUsed"?: string[];
    "primaryProduct"?: string;
    "trustScoreBefore"?: number;
    "trustScoreAfter"?: number;
    "trustDelta"?: number;
    "emotionalDepth"?: number;
    "overrideCount"?: number;
    "timeToConfirmation"?: string;
    "dropOffSignal"?: string;
    "cohort"?: string;
    "status"?: string;
    "User"?: string[];
    "email (from User)"?: any;
    "timezone (from User)"?: any;
    "totalSessions (from User)"?: any;
    "trustScore (from User)"?: any;
    "engagementTrend (from User)"?: any;
    "PromptLogs"?: string[];
    "SparkSplitAnalytics"?: string[];
    "GoldmineOutput"?: string[];
    "EmotionalIntelligence"?: string[];
    "EmotionalIntelligence 2"?: string;
    "TrustMetrics"?: string[];
    "PerformanceMetrics"?: string[];
    "WebhookLogs"?: string[];
    "ErrorLogs"?: string[];
    "ProcessingResults"?: string[];
    "Total Prompts"?: any;
    "Average Trust Score"?: any;
    "Total Cost"?: any;
  };
}

export interface PromptLogsRecord {
  id: string;
  createdTime: string;
  fields: {
    "id"?: string;
    "sessionId"?: string;
    "timestamp"?: string;
    "userId"?: string;
    "promptType"?: string;
    "inputFields"?: string;
    "output"?: string;
    "tokensUsed"?: number;
    "costUSD"?: any;
    "trustScore"?: number;
    "resonanceScore"?: number;
    "smartPromptScore"?: number;
    "emotionalDepth"?: number;
    "aweScore"?: number;
    "ownershipScore"?: number;
    "wonderScore"?: number;
    "calmScore"?: number;
    "powerScore"?: number;
    "fallbackTriggered"?: string;
    "fallbackFields"?: string;
    "analyticsMeta"?: string;
    "consentGiven"?: boolean;
    "deletionRequested"?: string;
    "Session"?: string[];
    "userId (from Session)"?: any;
    "startTime (from Session)"?: any;
    "duration (from Session)"?: any;
    "status (from Session)"?: any;
    "UserContext"?: string[];
    "email (from UserContext)"?: any;
    "totalSessions (from UserContext)"?: any;
    "trustScore (from UserContext)"?: any;
    "engagementTrend (from UserContext)"?: any;
    "PromptTypes"?: string[];
    "displayName (from PromptTypes)"?: any;
    "category (from PromptTypes)"?: any;
    "complexity (from PromptTypes)"?: any;
    "fieldCount (from PromptTypes)"?: any;
  };
}

export interface SparkSplitAnalyticsRecord {
  id: string;
  createdTime: string;
  fields: {
    "id"?: string;
    "sessionId"?: string;
    "timestamp"?: number;
    "promptType"?: string;
    "comparisonId"?: string;
    "trustDelta"?: number;
    "userSelection"?: string;
    "timeToSelection"?: number;
    "aweScore"?: number;
    "ownershipScore"?: number;
    "wonderScore"?: number;
    "calmScore"?: number;
    "powerScore"?: number;
    "competitiveAdvantage"?: number;
    "trustTransparencyScore"?: number;
    "emotionalEducationScore"?: number;
    "wouldRefer"?: boolean;
    "sharedOutput"?: boolean;
    "circuitBreakerTriggered"?: string;
    "testId"?: string;
    "variantType"?: string;
    "conversionLift"?: any;
    "statisticalSignificance"?: number;
    "marketingReady"?: boolean;
    "sterileOutput"?: string;
    "enhancedOutput"?: string;
    "educationalMoment"?: boolean;
    "transparencyTrust"?: number;
    "viralPotential"?: number;
    "Session"?: string[];
    "userId (from Session)"?: any;
    "startTime (from Session)"?: any;
    "duration (from Session)"?: any;
    "status (from Session)"?: any;
  };
}

export interface UserContextRecord {
  id: string;
  createdTime: string;
  fields: {
    "id"?: string;
    "userId"?: string;
    "email"?: string;
    "timezone"?: string;
    "totalSessions"?: number;
    "preferredProducts"?: string[];
    "preferredTone"?: string;
    "industryFocus"?: string[];
    "businessGoals"?: string;
    "personalizationScore"?: number;
    "emotionalBaseline"?: string;
    "trustScore"?: number;
    "lifetimeValue"?: any;
    "churnRisk"?: number;
    "engagementTrend"?: string;
    "preferences"?: string;
    "emotionalProfile"?: string;
    "sparkResonance"?: string;
    "createdAt"?: string;
    "updatedAt"?: string;
    "SessionAnalytics"?: string[];
    "PromptLogs"?: string[];
    "GoldmineOutput"?: string[];
    "EmotionalIntelligence"?: string[];
    "TrustMetrics"?: string[];
    "Total Sessions Calculated"?: any;
    "Average Session Duration"?: any;
    "Total Prompts Created"?: any;
    "Average Trust Score Calculated"?: any;
    "Total Spend"?: any;
  };
}

export interface EmotionalIntelligenceRecord {
  id: string;
  createdTime: string;
  fields: {
    "id"?: string;
    "sessionId"?: string;
    "userId"?: string;
    "promptType"?: string;
    "emotionalState"?: string;
    "aweScore"?: number;
    "ownershipScore"?: number;
    "wonderScore"?: number;
    "calmScore"?: number;
    "powerScore"?: number;
    "overallResonance"?: number;
    "trustScore"?: number;
    "confidenceScore"?: number;
    "timestamp"?: string;
    "createdAt"?: string;
    "Session"?: string[];
    "userId (from Session)"?: any;
    "duration (from Session)"?: any;
    "status (from Session)"?: any;
    "User"?: string[];
    "email (from User)"?: any;
    "timezone (from User)"?: any;
    "trustScore (from User)"?: any;
  };
}

export interface TrustMetricsRecord {
  id: string;
  createdTime: string;
  fields: {
    "id"?: string;
    "sessionId"?: string;
    "userId"?: string;
    "promptType"?: string;
    "trustScore"?: number;
    "previousScore"?: number;
    "trustDelta"?: number;
    "source"?: string;
    "component"?: string;
    "reason"?: string;
    "confidenceScore"?: number;
    "timestamp"?: string;
    "createdAt"?: string;
    "Session"?: string[];
    "userId (from Session)"?: any;
    "duration (from Session)"?: any;
    "status (from Session)"?: any;
    "User"?: string[];
    "email (from User)"?: any;
    "trustScore (from User)"?: any;
    "engagementTrend (from User)"?: any;
  };
}

export interface PerformanceMetricsRecord {
  id: string;
  createdTime: string;
  fields: {
    "id"?: string;
    "sessionId"?: string;
    "promptType"?: string;
    "apiCallId"?: string;
    "timestamp"?: string;
    "responseTime"?: number;
    "tokensUsed"?: number;
    "cost"?: any;
    "modelUsed"?: string;
    "success"?: boolean;
    "errorMessage"?: string;
    "createdAt"?: string;
    "Session"?: string[];
    "userId (from Session)"?: any;
    "duration (from Session)"?: any;
    "status (from Session)"?: any;
  };
}

export interface GoldmineOutputRecord {
  id: string;
  createdTime: string;
  fields: {
    "recordId"?: string;
    "sessionId"?: string;
    "userId"?: string;
    "promptType"?: string;
    "outputContent"?: string;
    "outputHash"?: string;
    "resonanceScore"?: number;
    "trustScore"?: number;
    "industryCluster"?: string;
    "intentSummary"?: string;
    "sparkConcept"?: string;
    "reuseCategory"?: string;
    "reusePotential"?: number;
    "compoundValue"?: number;
    "emotionalTone"?: string;
    "emotionalEnergy"?: string;
    "emotionalStyle"?: string;
    "emotionalVocabulary"?: string;
    "createdAt"?: string;
    "id"?: string;
    "Session"?: string[];
    "userId (from Session)"?: any;
    "duration (from Session)"?: any;
    "status (from Session)"?: any;
    "User"?: string[];
    "email (from User)"?: any;
    "industryFocus (from User)"?: any;
    "trustScore (from User)"?: any;
    "engagementTrend (from User)"?: any;
  };
}

export interface SystemHealthRecord {
  id: string;
  createdTime: string;
  fields: {
    "id"?: string;
    "component"?: string;
    "healthStatus"?: string;
    "responseTime"?: number;
    "errorRate"?: number;
    "throughput"?: number;
    "lastCheck"?: string;
    "alertTriggered"?: boolean;
    "createdAt"?: string;
    "Component Config"?: string[];
    "configValue (from Component Config)"?: any;
    "category (from Component Config)"?: any;
    "isActive (from Component Config)"?: any;
  };
}

export interface ErrorLogsRecord {
  id: string;
  createdTime: string;
  fields: {
    "id"?: string;
    "sessionId"?: string;
    "promptType"?: string;
    "errorType"?: string;
    "errorMessage"?: string;
    "stackTrace"?: string;
    "severity"?: string;
    "resolved"?: boolean;
    "timestamp"?: string;
    "createdAt"?: string;
    "Session"?: string[];
    "userId (from Session)"?: any;
    "duration (from Session)"?: any;
    "status (from Session)"?: any;
  };
}

export interface ProcessingResultsRecord {
  id: string;
  createdTime: string;
  fields: {
    "id"?: string;
    "sessionId"?: string;
    "promptType"?: string;
    "processingStage"?: string;
    "status"?: string;
    "startTime"?: string;
    "endTime"?: string;
    "duration"?: number;
    "resultData"?: string;
    "errorMessage"?: string;
    "createdAt"?: string;
    "Session"?: string[];
    "userId (from Session)"?: any;
    "duration (from Session)"?: any;
    "status (from Session)"?: any;
  };
}

export interface AirtableSyncRecord {
  id: string;
  createdTime: string;
  fields: {
    "id"?: string;
    "sourceTable"?: string;
    "recordId"?: string;
    "syncStatus"?: string;
    "lastSyncAttempt"?: string;
    "syncDuration"?: number;
    "errorMessage"?: string;
    "retryCount"?: number;
    "createdAt"?: string;
    "updatedAt"?: string;
    "Source Table Ref"?: string[];
    "configValue (from Source Table Ref)"?: any;
    "category (from Source Table Ref)"?: any;
    "isActive (from Source Table Ref)"?: any;
  };
}

export interface WebhookLogsRecord {
  id: string;
  createdTime: string;
  fields: {
    "id"?: string;
    "sessionId"?: string;
    "promptType"?: string;
    "webhookType"?: string;
    "payload"?: string;
    "deliveryStatus"?: string;
    "responseCode"?: number;
    "responseTime"?: number;
    "retryCount"?: number;
    "timestamp"?: string;
    "errorMessage"?: string;
    "createdAt"?: string;
    "Session"?: string[];
    "userId (from Session)"?: any;
    "duration (from Session)"?: any;
    "status (from Session)"?: any;
  };
}

