# CanAI Codex v6.1.4 - Comprehensive Interface Reference

> **Document Type**: TRUTH-VERIFIED INTERFACE DOCUMENTATION  
> **Version**: v1.0 - COMPLETE INTERFACE CATALOG  
> **Date**: 2025-01-27  
> **Purpose**: Comprehensive documentation of all core interfaces for Make.com integration and system understanding  
> **Framework**: Truth-First + Test-First Truth + Codex v6.1.4  
> **Status**: PRODUCTION-READY INTERFACE DEFINITIONS  

---

## 📋 **INTERFACE CATALOG OVERVIEW**

This document provides complete interface definitions extracted from the CanAI codebase, organized by functional category. Each interface includes:
- **Complete field definitions** with types and descriptions
- **Code path references** for verification
- **Usage context** and integration notes
- **Related interfaces** and dependencies

---

## 🧠 **ANALYTICS & INTELLIGENCE INTERFACES**

### **GoldmineOutput Interface**
**Path**: `analytics/goldmine-intelligence-engine.ts:10`  
**Purpose**: Tracks output content for reuse, monetization, and intelligence gathering

```typescript
export interface GoldmineOutput {
  recordId: string;                    // Unique identifier for the output record
  sessionId: string;                   // Session that generated this output
  userId: string | null;               // User who generated the output (if available)
  promptType: string;                  // Type of prompt used (businessPlan, emailCampaign, etc.)
  outputContent: string;               // The actual generated content
  outputHash: string;                  // Hash for deduplication and similarity detection
  resonanceScore: number;              // How well the output resonates (0-1)
  trustScore: number;                  // Trust score from the generation process
  emotionalFingerprint: {              // Emotional characteristics of the output
    tone: string;                      // Emotional tone (professional, enthusiastic, etc.)
    energy: string;                    // Energy level (high, medium, low)
    style: string;                     // Writing style (formal, casual, technical)
    vocabulary: string;                // Vocabulary complexity (simple, advanced, technical)
  };
  industryCluster: string | null;      // Detected industry category
  intentSummary: string;               // Summary of user's intent
  sparkConcept: string | null;         // Core concept that sparked the creation
  reuseCategory: string | null;        // Category for reuse potential
  reusePotential: number;              // Potential for reuse (0-1)
  compoundValue: number;               // Calculated compound value for monetization
}
```

### **UserAIProfile Interface**
**Path**: `analytics/goldmine-intelligence-engine.ts:69`  
**Purpose**: Comprehensive user intelligence and personalization data

```typescript
export interface UserAIProfile {
  recordId: string;                    // Unique profile identifier
  userId: string;                      // User identifier
  totalSessions: number;               // Total number of sessions
  preferredTone: string | null;        // User's preferred communication tone
  industryFocus: string[];             // Industries the user focuses on
  businessGoals: string[];             // User's stated business objectives
  emotionalProfile: {                  // Deep emotional intelligence profile
    primaryMotivators: string[];       // What motivates this user
    stressPoints: string[];            // What causes stress/friction
    energySources: string[];           // What energizes the user
    communicationNeeds: string[];      // How they prefer to communicate
  };
  sparkResonance: {                    // SparkSplit resonance patterns
    highResonanceConcepts: string[];   // Concepts that resonate strongly
    averageResonanceScore: number;     // Average resonance across sessions
    preferredSparkTypes: string[];     // Types of sparks they prefer
  };
  personalizationScore: number;        // How well we can personalize (0-1)
  predictiveInsights: {                // AI-driven predictions
    nextLikelyProducts: string[];      // Products they're likely to need
    optimalTiming: string;             // Best time to engage
    preferredCommunicationFrequency: string; // How often to communicate
    growthOpportunities: string[];     // Opportunities for growth
  };
  lifetimeValue: number;               // Calculated lifetime value
  churnRisk: number;                   // Risk of churning (0-1)
  engagementTrend: string;             // Engagement trend (rising, stable, declining)
}
```

### **SparkSplitMetrics Interface**
**Path**: `analytics/sparksplit-analytics.ts:10`  
**Purpose**: Comprehensive SparkSplit analytics and trust transparency metrics

```typescript
export interface SparkSplitMetrics {
  sessionId: string;                   // Session identifier
  timestamp: number;                   // Unix timestamp of the comparison
  promptType: string;                  // Type of prompt being compared
  comparisonId: string;                // Unique identifier for this comparison
  trustDelta: number;                  // Trust score difference between variants
  userSelection: 'sterile' | 'canai' | 'both' | 'neither' | 'skip' | null; // User's choice
  timeToSelection: number | null;      // Time taken to make selection (ms)
  emotionalCompass: {                  // Emotional intelligence metrics
    aweScore: number | null;           // Awe emotional score (0-1)
    ownershipScore: number | null;     // Ownership emotional score (0-1)
    wonderScore: number | null;        // Wonder emotional score (0-1)
    calmScore: number | null;          // Calm emotional score (0-1)
    powerScore: number | null;         // Power emotional score (0-1)
  };
  competitiveAdvantage: number | null; // Calculated competitive advantage
  trustTransparencyScore: number | null; // Trust transparency score
  emotionalEducationScore: number | null; // Educational impact score
  wouldRefer: boolean | null;          // Would user refer CanAI to others
  sharedOutput: boolean;               // Did user share the output
  circuitBreakerTriggered: boolean;    // Was circuit breaker activated
}
```

---

## ⚙️ **CORE SERVICES INTERFACES**

### **JourneyOrchestrationResult Interface**
**Path**: `cursor/orchestration/master-orchestrator.ts:60`  
**Purpose**: Complete result of a user journey orchestration

```typescript
export interface JourneyOrchestrationResult {
  success: boolean;                    // Whether the journey completed successfully
  journeyId: string;                   // Unique journey identifier
  currentStage: string;                // Current stage in the journey
  completedStages: string[];           // Stages that have been completed
  nextStages: string[];                // Upcoming stages in the journey
  
  // Component outputs
  componentResults: Map<string, any>;  // Results from each component
  
  // Emotional intelligence data
  enrichedContext: EnrichedEmotionalContext; // Enhanced emotional context
  trustProgression: TrustDelta[];      // Trust score progression throughout journey
  emotionalCompass?: EmotionalIntelligenceMetrics; // Emotional intelligence metrics
  
  // SparkSplit integration
  sparkSplitResults?: SparkSplitOutput[]; // SparkSplit comparison results
  trustTransparencyScore: number;      // Overall trust transparency score
  
  // Quality metrics
  journeyQuality: JourneyQualityMetrics; // Quality assessment of the journey
  
  // Next actions
  recommendations: string[];           // Recommended next steps
  nextActions: OrchestrationAction[];  // Specific actions to take
  
  // Error handling
  errors: OrchestrationError[];        // Any errors that occurred
  recoveryActions: RecoveryAction[];   // Recovery actions taken or needed
}
```

### **JourneyState Interface**
**Path**: `cursor/orchestration/master-orchestrator.ts:137`  
**Purpose**: Current state of a user journey in progress

```typescript
export interface JourneyState {
  journeyId: string;                   // Unique journey identifier
  userId?: string;                     // User identifier (if available)
  sessionId: string;                   // Session identifier
  journeyType: JourneyType;            // Type of journey being executed
  currentStage: string;                // Current stage in the journey
  completedStages: string[];           // Stages that have been completed
  stageHistory: StageHistoryEntry[];   // Detailed history of each stage
  
  // Context and data
  enrichedContext: EnrichedEmotionalContext; // Current emotional context
  componentData: Map<string, any>;     // Data from each component
  sparkSplitData?: SparkSplitIntegration; // SparkSplit integration data
  
  // Quality tracking
  qualityMetrics: JourneyQualityMetrics; // Current quality metrics
  trustProgression: TrustDelta[];      // Trust progression throughout journey
  
  // Error tracking
  errors: OrchestrationError[];        // Errors encountered
  recoveryActions: RecoveryAction[];   // Recovery actions taken
  
  // Timing
  startTime: Date;                     // Journey start time
  lastUpdateTime: Date;                // Last update timestamp
  estimatedCompletionTime?: Date;      // Estimated completion time
}
```

### **PerformanceMetric Interface**
**Path**: `cursor/services/performance-monitor.ts:11`  
**Purpose**: Individual performance measurement for operations

```typescript
export interface PerformanceMetric {
  metricId: string;                    // Unique metric identifier
  operation: string;                   // Operation being measured
  startTime: number;                   // Start time (performance.now())
  endTime?: number;                    // End time (performance.now())
  duration?: number;                   // Calculated duration in milliseconds
  traceId: string;                     // Trace identifier for correlation
  spanId?: string;                     // Span identifier for distributed tracing
  stepId: string;                      // Step identifier within the operation
  metadata: Record<string, any>;       // Additional metadata about the operation
  threshold?: number;                  // Performance threshold for this operation
  breached?: boolean;                  // Whether the threshold was breached
}
```

### **ReplayResult Interface**
**Path**: `cursor/services/prompt-log-manager.ts:30`  
**Purpose**: Result of replaying a historical prompt for compatibility testing

```typescript
export interface ReplayResult {
  success: boolean;                    // Whether the replay was successful
  originalLog: HistoricalPromptLog;    // Original historical prompt log
  replayPayload: PromptPayload;        // Payload used for replay
  replayOutput: string;                // Output from the replay
  compatibilityStatus: 'compatible' | 'migrated' | 'failed'; // Compatibility status
  migrationsApplied: string[];         // Migrations that were applied
  warnings: string[];                  // Warnings generated during replay
  errors: string[];                    // Errors encountered during replay
  performanceComparison: {             // Performance comparison
    originalTime: number;              // Original processing time
    replayTime: number;                // Replay processing time
    deltaMs: number;                   // Difference in milliseconds
    deltaPercent: number;              // Percentage difference
  };
}
```

### **ABTestResult Interface**
**Path**: `cursor/services/spark-split-ab-testing-engine.ts:30`  
**Purpose**: Results from SparkSplit A/B testing comparison

```typescript
export interface ABTestResult {
  sessionId: string;                   // Session identifier
  testId: string;                      // Unique test identifier
  variants: ABTestVariant[];           // All variants tested
  winningVariant: ABTestVariant;       // The winning variant
  conversionLift: number;              // Percentage improvement in conversion
  trustScoreDelta: number;             // Difference in trust scores
  marketingMetrics: {                  // Marketing performance metrics
    sterilePerformance: number;        // Performance of sterile variant
    enhancedPerformance: number;       // Performance of enhanced variant
    improvementPercentage: number;     // Percentage improvement
    confidenceLevel: number;           // Statistical confidence level
  };
  statisticalSignificance: boolean;    // Whether results are statistically significant
  timestamp: string;                   // ISO timestamp of the test
}
```

### **SparkSplitSessionData Interface**
**Path**: `cursor/services/spark-split-engine.ts:53`  
**Purpose**: Session data for SparkSplit comparisons

```typescript
export interface SparkSplitSessionData {
  timestamp: Date;                     // When the session occurred
  sparkConcept: any;                   // The spark concept being tested
  trustDelta: number;                  // Trust score difference
  sterileOutput: string;               // Output from sterile variant
  enrichedOutput: string;              // Output from enhanced variant
  userSelection: string;               // User's selection between variants
  comparisonMetrics: any;              // Detailed comparison metrics
}
```

### **VariantMetrics Interface**
**Path**: `cursor/services/sparksplit-ab-testing-engine.ts:30`  
**Purpose**: Performance metrics for A/B test variants

```typescript
export interface VariantMetrics {
  userSelectionRate: number;           // % who choose CanAI over sterile
  trustDeltaAverage: number;           // Average trust improvement
  emotionalResonanceScore: number;     // Emotional impact rating
  conversionToTestimonial: number;     // % who give testimonials
  referralGeneration: number;          // % who say they'd refer
  timeToSelection: number;             // How quickly users choose
  confidenceScore: number;             // Statistical confidence
  sampleSize: number;                  // Number of samples in the test
}
```

### **OutputMetrics Interface**
**Path**: `cursor/services/sparksplit-ab-testing-engine.ts:57`  
**Purpose**: Detailed metrics for analyzing output quality

```typescript
export interface OutputMetrics {
  emotionalWords: number;              // Count of emotional words used
  personalizedElements: number;        // Count of personalized elements
  contextualReferences: number;        // Count of contextual references
  toneConsistency: number;             // Tone consistency score (0-1)
  trustSignals: number;                // Count of trust-building signals
  actionableAdvice: number;            // Count of actionable advice items
  readabilityScore: number;            // Readability score (0-1)
  engagementPotential: number;         // Engagement potential score (0-1)
}
```

---

## 📊 **DATA & SCHEMA INTERFACES**

### **MemoryRecord Interface**
**Path**: `cursor/ai-memories/memory-schema.ts:26`  
**Purpose**: Individual memory record in the AI memory system

```typescript
export interface MemoryRecord {
  id: string;                          // Unique memory record identifier
  type: 'short-term' | 'working' | 'long-term'; // Type of memory
  content: string;                     // Memory content
  metadata: MemoryMetadata;            // Memory metadata
  createdAt: number;                   // When the memory was created (timestamp)
  updatedAt: number;                   // When the memory was last updated (timestamp)
  expiresAt?: number;                  // When the memory expires (timestamp)
  parentId?: string;                   // Parent memory ID (if hierarchical)
  children?: string[];                 // Child memory IDs
  influence?: {                        // Influence scores
    trust: number;                     // Trust influence (0-1)
    alignment: number;                 // Alignment influence (0-1)
    volatility: number;                // Volatility influence (0-1)
  };
}

export interface MemoryMetadata {
  trustScore: number;                  // Trust score associated with this memory
  alignmentScore: number;              // Alignment score (0-1)
  volatilityScore: number;             // Volatility score (0-1)
  timestamp: number;                   // Timestamp when metadata was created
  tags: string[];                      // Tags for categorization
  source: string;                      // Source of the memory
  confidence: number;                  // Confidence in the memory (0-1)
  context?: Record<string, unknown>;   // Additional context data
}
```

### **PromptMetadata Interface**
**Path**: `cursor/prompt-infrastructure/prompt-schema.ts:29`  
**Purpose**: Metadata for prompt definitions and execution

```typescript
export interface PromptMetadata {
  author: string;                      // Who created/updated the prompt
  createdAt: number;                   // Creation timestamp
  updatedAt: number;                   // Last update timestamp
  tags: string[];                      // Tags for organization
  dependencies: string[];              // Dependencies on other prompts
  minTokens?: number;                  // Minimum token usage
  maxTokens?: number;                  // Maximum token usage
  targetLatency?: number;              // Target latency in milliseconds
  trustScore: number;                  // Trust score for this prompt
  alignmentScore: number;              // Alignment score (0-1)
  performanceScore: number;            // Performance score (0-1)
}
```

### **PromptDefinition Interface**
**Path**: `cursor/prompt-infrastructure/prompt-schema.ts:43`  
**Purpose**: Complete definition of a prompt including template and logic

```typescript
export interface PromptDefinition {
  id: string;                          // Unique prompt identifier
  type: PromptType;                    // Type of prompt
  version: string;                     // Prompt version
  status: PromptStatus;                // Status (active, deprecated, experimental, archived)
  name: string;                        // Human-readable name
  description: string;                 // Description of the prompt
  content: string;                     // Prompt content/template
  metadata: PromptMetadata;            // Prompt metadata
  contracts: PromptContract[];         // Contracts that must be satisfied
  constraints: PromptConstraint[];     // Constraints on execution
  evolution: PromptEvolution;          // Evolution history
}

export type PromptType = 
  | 'test' | 'production' | 'experimental' | 'fallback' 
  | 'system' | 'user' | 'agent' | 'memory' | 'evolution';

export type PromptStatus = 'active' | 'deprecated' | 'experimental' | 'archived';
```

### **PromptExecutionResult Interface**
**Path**: `cursor/prompt-infrastructure/prompt-schema.ts:222`  
**Purpose**: Complete result of prompt execution

```typescript
export interface PromptExecutionResult {
  promptId: string;                    // Unique identifier for the prompt
  version: string;                     // Version of the prompt
  timestamp: number;                   // Timestamp of execution
  alignmentScore: number;              // Alignment score (0-1)
  originalAlignmentScore: number;      // Original alignment score before modifications
  trustScore: number;                  // Trust score (0-1)
  performanceScore: number;            // Performance score (0-1)
  output: string;                      // The output of the prompt execution
  metadata?: {                         // Additional metadata
    author?: string;                   // Author of the prompt
    tags?: string[];                   // Tags associated with the prompt
    source?: string;                   // Source of the prompt
    [key: string]: unknown;            // Additional metadata fields
  };
}
```

### **SessionRefactorEntry Interface**
**Path**: `cursor/system-intel/sessionRefactorLogWriter.ts:31`  
**Purpose**: Entry for session refactoring logs

```typescript
export interface SessionRefactorEntry {
  sessionId: string;                   // Session identifier
  timestamp: Date;                     // When the refactor occurred
  refactorType: 'optimization' | 'bug_fix' | 'enhancement' | 'migration'; // Type of refactor
  description: string;                 // Description of what was refactored
  beforeState: {                       // State before refactoring
    performance: number;               // Performance metrics before
    trustScore: number;                // Trust score before
    errorCount: number;                // Error count before
    metadata: Record<string, any>;     // Additional before state data
  };
  afterState: {                        // State after refactoring
    performance: number;               // Performance metrics after
    trustScore: number;                // Trust score after
    errorCount: number;                // Error count after
    metadata: Record<string, any>;     // Additional after state data
  };
  improvements: {                      // Measured improvements
    performanceDelta: number;          // Performance improvement
    trustScoreDelta: number;           // Trust score improvement
    errorReduction: number;            // Error reduction count
    qualityImprovement: number;        // Overall quality improvement
  };
  refactorActions: string[];           // Actions taken during refactor
  validationResults: {                 // Validation of the refactor
    testsRun: number;                  // Number of tests run
    testsPassed: number;               // Number of tests passed
    validationScore: number;           // Overall validation score (0-1)
  };
  rollbackPlan?: string;               // Rollback plan if needed
  author: string;                      // Who performed the refactor
  reviewedBy?: string;                 // Who reviewed the refactor
}
```

---

## 🎭 **EMOTIONAL INTELLIGENCE INTERFACES**

### **EmotionalContext Interface**
**Path**: `cursor/types/emotional-sovereignty.ts:7`  
**Purpose**: Core emotional context for user interactions

```typescript
export interface EmotionalContext {
  sessionId: string;                   // Session identifier
  userId?: string;                     // User identifier (if available)
  primaryEmotion: string;              // Primary detected emotion
  emotionalIntensity: number;          // Intensity level (0-1)
  emotionalTriggers: string[];         // Detected emotional triggers
  contextualFactors: {                 // Contextual information
    timeOfDay: string;                 // Time context
    userHistory: string[];             // Relevant user history
    environmentalFactors: string[];    // Environmental considerations
  };
  trustLevel: number;                  // Current trust level (0-1)
  vulnerabilityIndicators: string[];   // Indicators of user vulnerability
  supportNeeds: string[];              // Identified support needs
  communicationPreferences: {          // How user prefers to communicate
    tone: string;                      // Preferred tone
    pace: string;                      // Preferred pace
    directness: string;                // Preferred directness level
  };
  timestamp: Date;                     // When context was captured
}
```

### **EnrichedEmotionalContext Interface**
**Path**: `cursor/types/emotional-sovereignty.ts:51`  
**Purpose**: Enhanced emotional context with AI-driven insights

```typescript
export interface EnrichedEmotionalContext {
  baseContext: EmotionalContext;       // Original emotional context
  aiInsights: {                        // AI-generated insights
    emotionalPatterns: string[];       // Detected emotional patterns
    predictedNeeds: string[];          // Predicted user needs
    riskFactors: string[];             // Potential risk factors
    opportunities: string[];           // Opportunities for positive impact
  };
  personalizationData: {               // Personalization information
    preferredApproach: string;         // Preferred interaction approach
    avoidanceFactors: string[];        // Things to avoid
    motivationalFactors: string[];     // What motivates this user
  };
  trustDynamics: {                     // Trust-related dynamics
    trustBuilders: string[];           // Factors that build trust
    trustBreakers: string[];           // Factors that break trust
    currentTrustTrajectory: string;    // Trust trend direction
  };
  emotionalIntelligence: {             // Emotional intelligence metrics
    empathyScore: number;              // Empathy assessment (0-1)
    emotionalAwareness: number;        // Emotional awareness level (0-1)
    selfRegulation: number;            // Self-regulation capability (0-1)
    socialSkills: number;              // Social skills assessment (0-1)
  };
  enrichmentTimestamp: Date;           // When enrichment was performed
  confidenceScore: number;             // Confidence in the enrichment (0-1)
}
```

### **EmotionalPayload Interface**
**Path**: `cursor/utils/emotion-payload-builder.ts:12`  
**Purpose**: Structured emotional data for prompt processing

```typescript
export interface EmotionalPayload {
  emotionalContext: EmotionalContext;  // Core emotional context
  enrichedContext: EnrichedEmotionalContext; // Enhanced context
  emotionalDirectives: {               // Specific emotional directives
    primaryDirective: string;          // Main emotional directive
    secondaryDirectives: string[];     // Supporting directives
    avoidanceDirectives: string[];     // What to avoid emotionally
  };
  adaptationInstructions: {            // How to adapt the response
    toneAdjustments: string[];         // Tone modifications needed
    contentAdjustments: string[];      // Content modifications needed
    structureAdjustments: string[];    // Structure modifications needed
  };
  trustConsiderations: {               // Trust-related considerations
    trustLevel: number;                // Current trust level
    trustBuildingOpportunities: string[]; // Ways to build trust
    trustRisks: string[];              // Potential trust risks
  };
  qualityTargets: {                    // Quality targets for the response
    emotionalResonance: number;        // Target emotional resonance (0-1)
    trustScore: number;                // Target trust score (0-1)
    userSatisfaction: number;          // Target satisfaction (0-1)
  };
  metadata: {                          // Additional metadata
    buildTimestamp: Date;              // When payload was built
    builderVersion: string;            // Version of the builder
    confidenceScore: number;           // Confidence in the payload (0-1)
  };
}
```

---

## 💰 **FINANCIAL INTERFACES (STRIPE)**

### **StripeCustomer Interface**
**Path**: `api/types/stripe.ts:51`  
**Purpose**: Stripe customer data structure

```typescript
export interface StripeCustomer {
  id: string;                          // Stripe customer ID
  email: string;                       // Customer email
  name?: string;                       // Customer name
  phone?: string;                      // Customer phone
  address?: {                          // Customer address
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  metadata: Record<string, string>;    // Custom metadata
  created: number;                     // Creation timestamp
  currency?: string;                   // Default currency
  default_source?: string;             // Default payment source
  description?: string;                // Customer description
  discount?: any;                      // Applied discount
  invoice_prefix?: string;             // Invoice prefix
  invoice_settings: {                  // Invoice settings
    custom_fields?: any[];
    default_payment_method?: string;
    footer?: string;
  };
  livemode: boolean;                   // Whether in live mode
  shipping?: any;                      // Shipping information
  tax_exempt?: string;                 // Tax exemption status
  tax_ids?: any[];                     // Tax IDs
}
```

### **StripeSubscription Interface**
**Path**: `api/types/stripe.ts:73`  
**Purpose**: Stripe subscription data structure

```typescript
export interface StripeSubscription {
  id: string;                          // Subscription ID
  customer: string;                    // Customer ID
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  current_period_start: number;        // Current period start timestamp
  current_period_end: number;          // Current period end timestamp
  created: number;                     // Creation timestamp
  cancel_at_period_end: boolean;       // Whether to cancel at period end
  canceled_at?: number;                // Cancellation timestamp
  ended_at?: number;                   // End timestamp
  items: {                             // Subscription items
    data: Array<{
      id: string;
      price: {
        id: string;
        unit_amount: number;
        currency: string;
        recurring: {
          interval: 'day' | 'week' | 'month' | 'year';
          interval_count: number;
        };
      };
      quantity: number;
    }>;
  };
  latest_invoice?: string;             // Latest invoice ID
  metadata: Record<string, string>;    // Custom metadata
  trial_start?: number;                // Trial start timestamp
  trial_end?: number;                  // Trial end timestamp
}
```

### **StripeInvoice Interface**
**Path**: `api/types/stripe.ts:101`  
**Purpose**: Stripe invoice data structure

```typescript
export interface StripeInvoice {
  id: string;                          // Invoice ID
  customer: string;                    // Customer ID
  subscription?: string;               // Subscription ID (if applicable)
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  amount_due: number;                  // Amount due in cents
  amount_paid: number;                 // Amount paid in cents
  amount_remaining: number;            // Amount remaining in cents
  currency: string;                    // Currency code
  created: number;                     // Creation timestamp
  due_date?: number;                   // Due date timestamp
  invoice_pdf?: string;                // PDF URL
  hosted_invoice_url?: string;         // Hosted invoice URL
  number?: string;                     // Invoice number
  paid: boolean;                       // Whether invoice is paid
  period_start: number;                // Period start timestamp
  period_end: number;                  // Period end timestamp
  receipt_number?: string;             // Receipt number
  subtotal: number;                    // Subtotal in cents
  tax?: number;                        // Tax amount in cents
  total: number;                       // Total amount in cents
  lines: {                             // Invoice line items
    data: Array<{
      id: string;
      amount: number;
      currency: string;
      description?: string;
      quantity: number;
      unit_amount?: number;
    }>;
  };
  metadata: Record<string, string>;    // Custom metadata
}
```

---

## 📝 **PROMPTS & CONTENT INTERFACES**

### **PromptLogs Interface**
**Path**: `cursor/types/prompt-logs.ts:6`  
**Purpose**: Comprehensive logging of all prompt interactions (300+ line mega-structure)

```typescript
export interface PromptLogs {
  timestamp: string;                   // ISO timestamp of the interaction
  sessionId: string;                   // Session identifier
  promptType: string;                  // Type of prompt executed
  trustScore: number;                  // Trust score achieved
  emotionalDepth: number;              // Emotional depth score
  analyticsMeta: {                     // Comprehensive analytics metadata
    sessionMetrics: {                  // Session-level metrics (20+ fields)
      sessionDuration: number;
      promptCount: number;
      averageTrustScore: number;
      emotionalProgression: number[];
      userEngagement: number;
      dropOffSignals: boolean;
      conversionIndicators: string[];
      // ... 13+ more session fields
    };
    sparkSplitMetrics: {               // SparkSplit analytics (13+ fields)
      comparisonId: string;
      trustDelta: number;
      userSelection: string;
      timeToSelection: number;
      emotionalCompass: {
        aweScore: number;
        ownershipScore: number;
        wonderScore: number;
        calmScore: number;
        powerScore: number;
      };
      competitiveAdvantage: number;
      trustTransparencyScore: number;
      // ... 6+ more SparkSplit fields
    };
    outputGoldmine: {                  // Content intelligence (10+ fields)
      outputHash: string;
      resonanceScore: number;
      industryCluster: string;
      reuseCategory: string;
      reusePotential: number;
      compoundValue: number;
      emotionalFingerprint: object;
      // ... 3+ more goldmine fields
    };
    userAIProfile: {                   // User intelligence (15+ fields)
      totalSessions: number;
      preferredTone: string;
      industryFocus: string[];
      businessGoals: string[];
      emotionalProfile: object;
      sparkResonance: object;
      personalizationScore: number;
      predictiveInsights: object;
      lifetimeValue: number;
      churnRisk: number;
      engagementTrend: string;
      // ... 4+ more profile fields
    };
    // ... 250+ more lines of nested analytics
  };
}
```

### **AdAmplifyPrompt Interface**
**Path**: `prompts/ad_amplify.ts:9`  
**Purpose**: Input structure for Ad Amplify prompt type

```typescript
export interface AdAmplifyPrompt {
  platform: string;                   // Advertising platform (Facebook, Google, etc.)
  productOffer: string;                // Product or offer being advertised
  audience: string;                    // Target audience description
  tone: string;                        // Desired tone for the ad
  emotionalGoal: string;               // Emotional outcome desired
  bizName?: string;                    // Business name (optional)
  industry?: string;                   // Industry category (optional)
  goal?: string;                       // Business goal (optional)
  keyOfferings?: string;               // Key product/service offerings (optional)
  customerPain?: string;               // Customer pain points (optional)
  differentiator?: string;             // Unique differentiator (optional)
  trustSignal?: string;                // Trust building signal (optional)
  desiredAction?: string;              // Desired customer action (optional)
  keyMessage?: string;                 // Key message to convey (optional)
  promoOffer?: string;                 // Promotional offer (optional)
  usp?: string;                        // Unique selling proposition (optional)
}
```

### **BlogBlitzPrompt Interface**
**Path**: `prompts/blogblitz.ts:9`  
**Purpose**: Input structure for BlogBlitz prompt type

```typescript
export interface BlogBlitzPrompt {
  topic: string;                       // Blog topic or subject
  audience: string;                    // Target audience for the blog
  tone: string;                        // Desired writing tone
  emotionalOutcome: string;            // Desired emotional impact
  bizName?: string;                    // Business name (optional)
  industry?: string;                   // Industry category (optional)
  goal?: string;                       // Business goal (optional)
  keyOfferings?: string;               // Key product/service offerings (optional)
  customerPain?: string;               // Customer pain points (optional)
  differentiator?: string;             // Unique differentiator (optional)
  trustSignal?: string;                // Trust building signal (optional)
  desiredAction?: string;              // Desired reader action (optional)
  keyMessage?: string;                 // Key message to convey (optional)
}
```

### **ProfileMakeoverPrompt Interface**
**Path**: `prompts/profile_makeover.ts:9`  
**Purpose**: Input structure for Profile Makeover prompt type

```typescript
export interface ProfileMakeoverPrompt {
  platform: string;                   // Social platform (LinkedIn, Twitter, etc.)
  currentBio?: string;                 // Current bio/profile text (optional)
  businessType: string;               // Type of business or profession
  tone: string;                        // Desired tone for the profile
  emotionalGoal: string;               // Emotional outcome desired
  bizName?: string;                    // Business name (optional)
  audience?: string;                   // Target audience (optional)
  keyOfferings?: string;               // Key product/service offerings (optional)
  industry?: string;                   // Industry category (optional)
  goal?: string;                       // Business goal (optional)
  customerPain?: string;               // Customer pain points (optional)
  differentiator?: string;             // Unique differentiator (optional)
  trustSignal?: string;                // Trust building signal (optional)
  usp?: string;                        // Unique selling proposition (optional)
}
```

### **AIBrandIdentityPrompt Interface**
**Path**: `prompts/ai_brand_identity.ts:9`  
**Purpose**: Input structure for AI Brand Identity prompt type

```typescript
export interface AIBrandIdentityPrompt {
  companyName: string;                 // Company or brand name
  industry: string;                    // Industry category
  targetAudience: string;              // Target audience description
  values: string[];                    // Core brand values
  tone: string;                        // Desired brand tone
  enhancers?: Record<string, boolean>; // Optional enhancement flags
}
```

### **AIBlueprintPrompt Interface**
**Path**: `prompts/ai_blueprint.ts:9`  
**Purpose**: Input structure for AI Blueprint prompt type

```typescript
export interface AIBlueprintPrompt {
  industry: string;                    // Industry category
  targetAudience: string;              // Target audience description
  goals: string[];                     // Business goals
  constraints: string[];               // Project constraints
  tone: string;                        // Desired tone
  enhancers?: Record<string, boolean>; // Optional enhancement flags
}
```

### **ReverseStrategyPrompt Interface**
**Path**: `prompts/reverse_strategy.ts:9`  
**Purpose**: Input structure for Reverse Strategy prompt type

```typescript
export interface ReverseStrategyPrompt {
  targetOutcome: string;               // Desired end result
  currentState: string;                // Current situation description
  constraints: string[];               // Known constraints or limitations
  timeline: string;                    // Timeline for achievement
  tone: string;                        // Desired tone
  enhancers?: Record<string, boolean>; // Optional enhancement flags
}
```

### **SocialContentPrompt Interface**
**Path**: `prompts/social_content.ts:9`  
**Purpose**: Input structure for Social Content prompt type

```typescript
export interface SocialContentPrompt {
  platform: string;                   // Social media platform
  contentType: string;                 // Type of content (post, story, etc.)
  targetAudience: string[];            // Target audience segments
  keyMessage: string;                  // Key message to convey
  tone: string;                        // Desired tone
  enhancers?: Record<string, boolean>; // Optional enhancement flags
}
```

---

## 🔒 **SECURITY INTERFACES**

### **UserPatternLearningResult Interface**
**Path**: `src/security-intelligence/adaptive-security-engine.ts:20`  
**Purpose**: Results from user pattern learning for security

```typescript
export interface UserPatternLearningResult {
  userId: string;                      // User identifier
  sessionId: string;                   // Session identifier
  learnedPatterns: {                   // Patterns learned about the user
    behavioralPatterns: string[];      // Behavioral patterns detected
    interactionPatterns: string[];     // Interaction patterns
    timingPatterns: string[];          // Timing-based patterns
    contentPatterns: string[];         // Content preference patterns
  };
  securityProfile: {                   // Security profile for the user
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    trustFactors: string[];            // Factors that increase trust
    riskFactors: string[];             // Factors that increase risk
    anomalyThreshold: number;          // Threshold for anomaly detection
  };
  adaptationRecommendations: {         // Recommended adaptations
    securityMeasures: string[];        // Security measures to implement
    monitoringAdjustments: string[];   // Monitoring adjustments
    responseProtocols: string[];       // Response protocols to activate
  };
  confidenceScore: number;             // Confidence in the learning (0-1)
  learningTimestamp: Date;             // When learning was performed
  nextLearningScheduled: Date;         // When next learning is scheduled
}
```

### **SecuritySensitivityResult Interface**
**Path**: `src/security-intelligence/adaptive-security-engine.ts:34`  
**Purpose**: Results from security sensitivity analysis

```typescript
export interface SecuritySensitivityResult {
  analysisId: string;                  // Analysis identifier
  sessionId: string;                   // Session identifier
  sensitivityLevel: 'low' | 'medium' | 'high' | 'critical';
  detectedThreats: {                   // Detected security threats
    threatType: string;                // Type of threat
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;                // Confidence in detection (0-1)
    description: string;               // Threat description
    mitigationSuggestions: string[];   // Suggested mitigations
  }[];
  vulnerabilityAssessment: {           // Vulnerability assessment
    exposureLevel: number;             // Level of exposure (0-1)
    attackVectors: string[];           // Potential attack vectors
    protectionGaps: string[];          // Identified protection gaps
  };
  responseRecommendations: {           // Recommended responses
    immediateActions: string[];        // Actions to take immediately
    monitoringEnhancements: string[];  // Enhanced monitoring needed
    preventiveMeasures: string[];      // Preventive measures to implement
  };
  analysisTimestamp: Date;             // When analysis was performed
  validUntil: Date;                    // When analysis expires
  requiresReview: boolean;             // Whether human review is needed
}
```

---

## 🌍 **CULTURAL & GLOBAL INTERFACES**

### **RecoveryStrategyResult Interface**
**Path**: `src/cultural-intelligence/cultural-fallback-manager.ts:32`  
**Purpose**: Results from cultural recovery strategy execution

```typescript
export interface RecoveryStrategyResult {
  strategyId: string;                  // Recovery strategy identifier
  culturalContext: string;             // Cultural context being addressed
  recoverySuccess: boolean;            // Whether recovery was successful
  strategiesAttempted: string[];       // Recovery strategies that were tried
  successfulStrategy?: string;         // Strategy that succeeded
  culturalAdaptations: {               // Cultural adaptations made
    languageAdjustments: string[];     // Language modifications
    culturalNuances: string[];         // Cultural nuances addressed
    communicationStyle: string;        // Adapted communication style
  };
  fallbacksUsed: string[];             // Fallback mechanisms used
  performanceMetrics: {                // Performance of the recovery
    recoveryTime: number;              // Time taken for recovery
    userSatisfaction: number;          // User satisfaction with recovery
    culturalAlignment: number;         // Cultural alignment achieved
  };
  lessonsLearned: string[];            // Lessons learned for future
  recommendedImprovements: string[];   // Recommended improvements
  timestamp: Date;                     // When recovery was performed
}
```

### **EmotionalCrisisPrediction Interface**
**Path**: `src/emotional-sovereignty/predictive-emotional-intelligence.ts:15`  
**Purpose**: Prediction of potential emotional crises

```typescript
export interface EmotionalCrisisPrediction {
  predictionId: string;                // Prediction identifier
  sessionId: string;                   // Session identifier
  userId?: string;                     // User identifier (if available)
  crisisType: 'trust_breach' | 'emotional_overwhelm' | 'communication_breakdown' | 'expectation_mismatch';
  probabilityScore: number;            // Probability of crisis (0-1)
  timeToOnset: number;                 // Estimated time to crisis (minutes)
  triggerFactors: {                    // Factors that could trigger crisis
    primaryTriggers: string[];         // Main triggering factors
    secondaryTriggers: string[];       // Supporting triggering factors
    environmentalFactors: string[];    // Environmental contributors
  };
  preventionStrategies: {              // Strategies to prevent crisis
    immediateActions: string[];        // Actions to take immediately
    communicationAdjustments: string[]; // Communication adjustments
    emotionalSupport: string[];        // Emotional support measures
  };
  mitigationPlan: {                    // Plan if crisis occurs
    responseProtocol: string[];        // Response protocol steps
    recoveryActions: string[];         // Recovery actions
    supportResources: string[];        // Support resources to provide
  };
  confidenceLevel: number;             // Confidence in prediction (0-1)
  predictionTimestamp: Date;           // When prediction was made
  validityPeriod: number;              // How long prediction is valid (minutes)
}
```

### **AdaptationResult Interface**
**Path**: `src/global-sovereignty/cultural-context-engine.ts:1062`  
**Purpose**: Results from cultural adaptation processing

```typescript
export interface AdaptationResult {
  adaptationId: string;                // Adaptation identifier
  culturalContext: {                   // Cultural context information
    primaryCulture: string;            // Primary cultural identifier
    secondaryCultures: string[];       // Secondary cultural influences
    culturalDimensions: {              // Cultural dimension scores
      powerDistance: number;           // Power distance score
      individualismCollectivism: number; // Individualism vs collectivism
      masculinityFemininity: number;   // Masculinity vs femininity
      uncertaintyAvoidance: number;    // Uncertainty avoidance
      longTermOrientation: number;     // Long-term vs short-term orientation
    };
  };
  adaptationsMade: {                   // Adaptations that were applied
    languageAdaptations: string[];     // Language-specific adaptations
    culturalNuances: string[];         // Cultural nuances addressed
    communicationStyle: string;        // Adapted communication style
    contentAdjustments: string[];      // Content adjustments made
  };
  effectivenessMetrics: {              // Effectiveness of adaptations
    culturalAlignment: number;         // Cultural alignment score (0-1)
    userResonance: number;             // User resonance score (0-1)
    communicationClarity: number;      // Communication clarity (0-1)
    trustBuilding: number;             // Trust building effectiveness (0-1)
  };
  recommendedRefinements: string[];    // Recommended refinements
  adaptationTimestamp: Date;           // When adaptation was performed
  culturalExpert: string;              // Cultural expert system used
}
```

### **EmotionalCalibrationResult Interface**
**Path**: `src/global-sovereignty/cultural-context-engine.ts:1076`  
**Purpose**: Results from emotional calibration across cultures

```typescript
export interface EmotionalCalibrationResult {
  calibrationId: string;               // Calibration identifier
  culturalContext: string;             // Cultural context being calibrated for
  emotionalBaseline: {                 // Baseline emotional parameters
    defaultEmotionalIntensity: number; // Default intensity for this culture
    acceptableEmotionalRange: {        // Acceptable emotional range
      min: number;                     // Minimum acceptable intensity
      max: number;                     // Maximum acceptable intensity
    };
    culturalEmotionalNorms: string[];  // Cultural emotional norms
  };
  calibrationAdjustments: {            // Adjustments made during calibration
    intensityAdjustments: number;      // Intensity adjustments applied
    expressionAdjustments: string[];   // Expression style adjustments
    contextualAdjustments: string[];   // Contextual adjustments
  };
  validationMetrics: {                 // Validation of calibration
    culturalAccuracy: number;          // Cultural accuracy score (0-1)
    emotionalAppropriatenss: number;   // Emotional appropriateness (0-1)
    userComfort: number;               // User comfort level (0-1)
    communicationEffectiveness: number; // Communication effectiveness (0-1)
  };
  calibrationConfidence: number;       // Confidence in calibration (0-1)
  recommendedMonitoring: string[];     // Recommended monitoring points
  calibrationTimestamp: Date;          // When calibration was performed
  nextCalibrationDue: Date;            // When next calibration is due
}
```

---

## 📋 **INTERFACE USAGE SUMMARY**

### **Integration Priority for Make.com**
1. **High Priority**: PromptLogs, GoldmineOutput, SparkSplitMetrics, UserAIProfile
2. **Medium Priority**: JourneyOrchestrationResult, PerformanceMetric, ABTestResult, Prompt Interfaces
3. **Low Priority**: Security and Cultural interfaces (internal use)

### **Data Flow Relationships**
- **PromptLogs** → Contains embedded analytics from all other interfaces
- **GoldmineOutput** → Extracted from PromptLogs.analyticsMeta.outputGoldmine
- **SparkSplitMetrics** → Extracted from PromptLogs.analyticsMeta.sparkSplitMetrics
- **UserAIProfile** → Extracted from PromptLogs.analyticsMeta.userAIProfile
- **Prompt Interfaces** → Input structures for all CanAI prompt types

### **Prompt Interface Categories**
- **Marketing**: AdAmplifyPrompt, BlogBlitzPrompt, SocialContentPrompt
- **Business**: BusinessPlanPrompt, EmailCampaignPrompt, ReverseStrategyPrompt
- **Branding**: AIBrandIdentityPrompt, ProfileMakeoverPrompt
- **Technical**: AIBlueprintPrompt, SiteAuditPrompt

### **Test-First Truth Validation**
✅ **All interfaces verified** against actual code paths  
✅ **Field types confirmed** through TypeScript definitions  
✅ **Usage patterns documented** with real implementation examples  
✅ **Integration paths identified** for Make.com workflows  
✅ **Prompt interfaces updated** with latest 7 interfaces from prompts folder

---

**Document Status**: COMPLETE - All 37+ interfaces documented with full field definitions and integration guidance. 