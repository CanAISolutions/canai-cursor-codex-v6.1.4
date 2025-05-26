/**
 * PromptLogs type definition
 * @version 2.7.9
 */

export interface PromptLogs {
  timestamp: string;
  sessionId: string;
  promptType: string;
  trustScore: number;
  emotionalDepth: number;
  feedbackDelta?: FeedbackDelta;
  usedVisionCatcher?: boolean;
  motivationHook?: string;
  enrichedInput: StructuredIntent;
  overridePatterns?: OverridePattern[];
  emotionalAnchorPresent: boolean;
  analyticsMeta: {
    sessionMetrics?: {
      sessionId: string;
      timestamp: number;
      emotionalDepth: number;
      trustScore: number;
      overrideCount: number;
      timeToConfirmation: number;
      dropOffSignal: boolean;
      promptType: string;
      cohort: string;
    };
    timeSeries?: Array<{
      sessionId: string;
      timestamp: number;
      emotionalDepth: number;
      trustScore: number;
      overrideCount: number;
      timeToConfirmation: number;
      dropOffSignal: boolean;
      promptType: string;
      cohort: string;
    }>;
    cohortComparison?: {
      [cohort: string]: Array<{
        sessionId: string;
        timestamp: number;
        emotionalDepth: number;
        trustScore: number;
        overrideCount: number;
        timeToConfirmation: number;
        dropOffSignal: boolean;
        promptType: string;
        cohort: string;
      }>;
    };
    promptMetrics?: {
      promptType: string;
      timestamp: number;
      confirmationRate: number;
      revisionRate: number;
      toneConflictRate: number;
      deltaConfidence: number;
      totalSessions: number;
      successfulSessions: number;
    };
    monthlyStats?: Array<{
      promptType: string;
      timestamp: number;
      confirmationRate: number;
      revisionRate: number;
      toneConflictRate: number;
      deltaConfidence: number;
      totalSessions: number;
      successfulSessions: number;
    }>;
    rollingStats?: Array<{
      promptType: string;
      timestamp: number;
      confirmationRate: number;
      revisionRate: number;
      toneConflictRate: number;
      deltaConfidence: number;
      totalSessions: number;
      successfulSessions: number;
    }>;
    touchpointMetrics?: {
      sessionId: string;
      timestamp: number;
      sparkUsed: boolean;
      visionCatcherTriggered: boolean;
      enrichmentReused: boolean;
      toneReused: boolean;
      confirmationOutcome: boolean;
      timeToConfirmation: number;
      emotionalDepth: number;
    };
    sessionHistory?: Array<{
      sessionId: string;
      timestamp: number;
      sparkUsed: boolean;
      visionCatcherTriggered: boolean;
      enrichmentReused: boolean;
      toneReused: boolean;
      confirmationOutcome: boolean;
      timeToConfirmation: number;
      emotionalDepth: number;
    }>;
    correlations?: {
      sparkImpact: number;
      visionImpact: number;
      enrichmentImpact: number;
      toneImpact: number;
    };
    feedbackHeatmap?: {
      fieldClusters: Map<string, {
        fieldName: string;
        editCount: number;
        averageConfidenceGap: number;
        toneDistribution: Map<string, number>;
        editTypes: {
          override: number;
          revision: number;
          default: number;
        };
        needsTuning: boolean;
      }>;
      sessionEdits: Map<string, Array<{
        fieldName: string;
        timestamp: number;
        sessionId: string;
        promptType: string;
        tone: string;
        confidenceGap: number;
        editType: 'override' | 'revision' | 'default';
      }>>;
      promptTypeEdits: Map<string, Array<{
        fieldName: string;
        timestamp: number;
        sessionId: string;
        promptType: string;
        tone: string;
        confidenceGap: number;
        editType: 'override' | 'revision' | 'default';
      }>>;
    };
    dashboardState?: {
      metrics: {
        timestamp: number;
        trustScore: number;
        emotionalDepth: number;
        confirmationRate: number;
        overrideRate: number;
        toneConflictRate: number;
        riskLevel: 'low' | 'medium' | 'high';
      };
      riskSessions: Array<{
        sessionId: string;
        promptType: string;
        riskFactors: string[];
        trustScore: number;
        emotionalDepth: number;
        timestamp: number;
      }>;
      toneConflicts: Array<{
        promptType: string;
        fieldName: string;
        conflictCount: number;
        averageConfidenceGap: number;
        lastOccurrence: number;
      }>;
      fieldsNeedingTuning: string[];
      promptTypesAtRisk: string[];
    };
    // SparkSplit v7.2.0 Analytics Fields
    sparkSplitMetrics?: {
      sessionId: string;
      timestamp: number;
      promptType: string;
      comparisonId: string;
      trustDelta: number;
      userSelection: 'sterile' | 'canai' | 'both' | 'neither' | 'skip' | null;
      timeToSelection: number | null;
      emotionalCompass: {
        aweScore: number | null;
        ownershipScore: number | null;
        wonderScore: number | null;
        calmScore: number | null;
        powerScore: number | null;
      };
      competitiveAdvantage: number | null;
      trustTransparencyScore: number | null;
      emotionalEducationScore: number | null;
      wouldRefer: boolean | null;
      sharedOutput: boolean;
      circuitBreakerTriggered: boolean;
    };
    sparkSplitAggregates?: {
      current: {
        sessionId: string;
        timestamp: number;
        promptType: string;
        comparisonId: string;
        trustDelta: number;
        userSelection: 'sterile' | 'canai' | 'both' | 'neither' | 'skip' | null;
        timeToSelection: number | null;
        emotionalCompass: {
          aweScore: number | null;
          ownershipScore: number | null;
          wonderScore: number | null;
          calmScore: number | null;
          powerScore: number | null;
        };
        competitiveAdvantage: number | null;
        trustTransparencyScore: number | null;
        emotionalEducationScore: number | null;
        wouldRefer: boolean | null;
        sharedOutput: boolean;
        circuitBreakerTriggered: boolean;
      };
      aggregates: {
        canaiSelectionRate: number;
        averageTrustDelta: number;
        averageTimeToSelection: number;
        referralRate: number;
        viralSharingRate: number;
        circuitBreakerRate: number;
      };
      competitiveMetrics: {
        trustTransparencyAdvantage: number;
        userEducationImpact: number;
        marketDifferentiation: number;
      };
    };
    sparkSplitTrends?: {
      trustDeltaTrend: number[];
      selectionRateTrend: number[];
      competitiveAdvantageTrend: number[];
      userEducationTrend: number[];
    };
    // Goldmine Layer Intelligence Fields
    goldmineIntelligence?: {
      eventType: string;
      data: any;
      intelligence: {
        totalOutputs: number;
        highValueOutputs: number;
        averageResonanceScore: number;
        topIndustries: Array<{ industry: string; count: number; averageResonance: number }>;
        reusableAssets: {
          templates: number;
          caseStudies: number;
          contentAssets: number;
        };
        monetizationPotential: number;
        compoundGrowthRate: number;
      };
      timestamp: number;
    };
    outputGoldmine?: {
      recordId: string;
      sessionId: string;
      userId: string | null;
      promptType: string;
      outputHash: string;
      resonanceScore: number;
      trustScore: number;
      emotionalFingerprint: {
        tone: string;
        energy: string;
        style: string;
        vocabulary: string;
      };
      industryCluster: string | null;
      intentSummary: string;
      sparkConcept: string | null;
      reuseCategory: string | null;
      reusePotential: number;
      compoundValue: number;
    };
    miningAgentRuns?: Array<{
      recordId: string;
      agentType: string;
      agentName: string;
      runId: string;
      patternsDetected: Array<{
        pattern: string;
        confidence: number;
        description: string;
        impact: string;
      }>;
      trendsIdentified: Array<{
        trend: string;
        industry: string;
        growth: number;
        confidence: number;
      }>;
      monetizationOpportunities: Array<{
        opportunity: string;
        description: string;
        estimatedDemand: number;
        targetIndustries: string[];
      }>;
      impactScore: number;
    }>;
    userAIProfile?: {
      recordId: string;
      userId: string;
      totalSessions: number;
      preferredTone: string | null;
      industryFocus: string[];
      businessGoals: string[];
      personalizationScore: number;
      predictiveInsights: {
        nextLikelyProducts: string[];
        optimalTiming: string;
        preferredCommunicationFrequency: string;
        growthOpportunities: string[];
      };
      lifetimeValue: number;
      churnRisk: number;
      engagementTrend: string;
    };
  };
  /**
   * Indicates if user consent was explicitly given for this prompt/session
   */
  consentGiven?: boolean;
  /**
   * Indicates if a deletion request was made for this prompt/session
   */
  deletionRequested?: boolean;
  /**
   * Type of compliance-related agent action (consent, deletion, or activity)
   */
  agentActionType?: 'consent' | 'deletion' | 'activity' | null;
  /**
   * Additional details about the compliance-related agent action
   */
  agentActionDetails?: string;
}

export interface FeedbackDelta {
  toneShift?: ToneShift;
  motivatorChange?: MotivatorChange;
  confidence: number;
  timestamp: string;
}

export interface ToneShift {
  from: string;
  to: string;
  confidence: number;
}

export interface MotivatorChange {
  from: string;
  to: string;
  confidence: number;
}

export interface StructuredIntent {
  businessType: string;
  primaryGoal: string;
  tone: string;
  motivator: string;
  confidence: number;
  sourceMap: {
    [key: string]: string;
  };
  usedSparkSignal: boolean;
  usedVisionCatcher: boolean;
}

export interface OverridePattern {
  field: string;
  originalValue: string;
  newValue: string;
  confidence: number;
  timestamp: string;
} 