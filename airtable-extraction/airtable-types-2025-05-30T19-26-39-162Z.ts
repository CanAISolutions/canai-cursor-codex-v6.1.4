// Airtable Base TypeScript Interfaces
// Generated: 2025-05-30T19:26:31.145Z
// Base ID: apph8yM7gVc9QBFtx

export interface PromptTypesRecord {
  id: string;
  createdTime: string;
  fields: {
    "promptType"?: string;
    "displayName"?: string;
    "description"?: string;
    "category"?: string;
    "isActive"?: boolean;
    "defaultTone"?: string;
    "estimatedTokens"?: number;
    "complexity"?: string;
    "fieldCount"?: number;
    "id"?: string;
    "Total Usage Count"?: string[];
    "Average Trust Score"?: string;
    "Average Cost Per Use"?: string;
    "hasNestedObjects"?: boolean;
  };
}

export interface EmotionalStatesRecord {
  id: string;
  createdTime: string;
  fields: {
    "stateName"?: string;
    "category"?: string;
    "intensity"?: string;
    "description"?: string;
    "recommendedTone"?: string;
    "isActive"?: boolean;
    "id"?: string;
  };
}

export interface TrustFactorsRecord {
  id: string;
  createdTime: string;
  fields: {
    "factorName"?: string;
    "category"?: string;
    "impact"?: string;
    "description"?: string;
    "applicableProducts"?: string[];
    "isActive"?: boolean;
    "id"?: string;
  };
}

export interface SystemConfigsRecord {
  id: string;
  createdTime: string;
  fields: {
    "configKey"?: string;
    "configValue"?: string;
    "category"?: string;
    "description"?: string;
    "isActive"?: boolean;
    "updatedBy"?: string;
    "id"?: string;
  };
}

export interface AnalyticsAggregatesRecord {
  id: string;
  createdTime: string;
  fields: {
    "aggregateType"?: string;
    "promptType"?: string;
    "dateRange"?: string;
    "totalSessions"?: number;
    "averageTrustScore"?: number;
    "averageResonanceScore"?: number;
    "totalTokensUsed"?: number;
    "totalCostUSD"?: number;
    "id"?: string;
  };
}

export interface SessionAnalyticsRecord {
  id: string;
  createdTime: string;
  fields: {
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
    "id"?: string;
    "Total Prompts"?: string[];
    "Average Trust Score"?: string;
    "Total Cost"?: number;
  };
}

export interface PromptLogsRecord {
  id: string;
  createdTime: string;
  fields: {
    "timestamp"?: string;
    "sessionId"?: string;
    "userId"?: string;
    "promptType"?: string;
    "inputFields"?: string;
    "output"?: string;
    "tokensUsed"?: number;
    "costUSD"?: number;
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
    "analyticsMeta"?: string;
    "consentGiven"?: boolean;
    "deletionRequested"?: string;
    "id"?: string;
  };
}

export interface SparkSplitAnalyticsRecord {
  id: string;
  createdTime: string;
  fields: {
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
    "circuitBreakerTriggered"?: string;
    "testId"?: string;
    "variantType"?: string;
    "conversionLift"?: number;
    "statisticalSignificance"?: number;
    "marketingReady"?: boolean;
    "sterileOutput"?: string;
    "enhancedOutput"?: string;
    "educationalMoment"?: boolean;
    "transparencyTrust"?: number;
    "viralPotential"?: number;
    "id"?: string;
    "sharedOutput"?: boolean;
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
    "lifetimeValue"?: number;
    "churnRisk"?: number;
    "engagementTrend"?: string;
    "preferences"?: string;
    "emotionalProfile"?: string;
    "sparkResonance"?: string;
    "createdAt"?: string;
    "updatedAt"?: string;
    "Total Sessions Calculated"?: string[];
    "Average Session Duration"?: string;
    "Total Prompts Created"?: string[];
    "Average Trust Score Calculated"?: string;
    "Total Spend"?: number;
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
    "cost"?: number;
    "modelUsed"?: string;
    "success"?: boolean;
    "createdAt"?: string;
    "errorMessage"?: string;
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
    "createdAt"?: string;
    "alertTriggered"?: boolean;
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
    "timestamp"?: string;
    "createdAt"?: string;
    "resolved"?: boolean;
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
    "retryCount"?: number;
    "createdAt"?: string;
    "updatedAt"?: string;
    "errorMessage"?: string;
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
    "createdAt"?: string;
    "errorMessage"?: string;
  };
}

export interface DiscoveryFunnelInputRecord {
  id: string;
  createdTime: string;
  fields: {
  };
}

