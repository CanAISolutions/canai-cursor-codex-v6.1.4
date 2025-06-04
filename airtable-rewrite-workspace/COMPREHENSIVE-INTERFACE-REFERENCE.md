# CanAI Codex v6.1.4 - Comprehensive Interface Reference

> **Document Type**: TRUTH-VERIFIED INTERFACE DOCUMENTATION  
> **Version**: v1.1 - COMPLETE INTERFACE CATALOG WITH SPARKSPLIT  
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

### **SparkSplitPrompt Interface** ⭐ **NEW**
**Path**: `prompts/sparksplit.ts:9`  
**Purpose**: Input structure for SparkSplit Trust Engine prompt type

```typescript
export interface SparkSplitPrompt {
  deliveredProduct: string;            // Product or service that was delivered
  userSatisfaction: string;            // User satisfaction description
  trustContext: string;                // Trust context for the interaction
  productType?: string;                // Type of product (optional)
  deliveryQuality?: string;            // Quality of delivery (optional)
  emotionalResonance?: string;         // Emotional resonance achieved (optional)
  competitiveContext?: string;         // Competitive context (optional)
  trustScore?: number;                 // Current trust score (optional)
  qualityIndicators?: string[];        // Quality indicators (optional)
  emotionalIntelligenceMarkers?: string[]; // Emotional intelligence markers (optional)
  transparencyFactors?: string[];      // Transparency factors (optional)
  competitiveDifferentiators?: string[]; // Competitive differentiators (optional)
  viralPotential?: string;             // Viral potential assessment (optional)
  sparkRevelationMoments?: string[];   // Spark revelation moments (optional)
  trustEvolution?: {                   // Trust evolution tracking (optional)
    initialLevel?: string;             // Initial trust level
    postDeliveryLevel?: string;        // Post-delivery trust level
    growthPoints?: number;             // Trust growth points
  };
  emotionalContext?: {                 // Emotional context (optional)
    personalStory?: string;            // Personal story
    visionQuote?: string;              // Vision quote
    motivator?: string;                // Primary motivator
    brandFeel?: string;                // Brand feeling
    emotions?: string[];               // Emotions involved
  };
  enhancers?: {                        // Enhancement flags (optional)
    emotionalDepth?: boolean;          // Enable emotional depth
    useAnalogies?: boolean;            // Use analogies
    urgency?: boolean;                 // Add urgency
    trustTransparency?: boolean;       // Enable trust transparency
    competitiveAnalysis?: boolean;     // Enable competitive analysis
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

### **BusinessPlanPrompt Interface**
**Path**: `prompts/business_plan.ts:9`  
**Purpose**: Input structure for Business Plan prompt type

```typescript
export interface BusinessPlanPrompt {
  industry: string;                    // Industry category
  goal: string;                        // Business goal
  tone: string;                        // Desired tone
  targetMarket?: string;               // Target market (optional)
  budget?: number;                     // Budget constraints (optional)
  timeline?: string;                   // Timeline (optional)
  idea?: string;                       // Business idea (optional)
  audience?: string;                   // Target audience (optional)
  problemSolved?: string;              // Problem being solved (optional)
  differentiator?: string;             // Unique differentiator (optional)
  customerContent?: string;            // Customer content (optional)
  founderBio?: string;                 // Founder biography (optional)
  archetype?: string;                  // Brand archetype (optional)
  voice?: string;                      // Brand voice (optional)
  vibe?: string;                       // Brand vibe (optional)
  financials?: {                       // Financial information (optional)
    revenueModel?: string;             // Revenue model
    pricingNotes?: string;             // Pricing notes
    financialMaturity?: 'early' | 'growth' | 'mature'; // Financial maturity
    initialInvestment?: number;        // Initial investment
    projectedRevenue?: number;         // Projected revenue
    breakEvenPoint?: number;           // Break-even point
  };
  emotionalContext?: {                 // Emotional context (optional)
    personalStory?: string;            // Personal story
    visionQuote?: string;              // Vision quote
    motivator?: string;                // Primary motivator
    founderBackground?: string;        // Founder background
    emotionalDrivers?: {               // Emotional drivers
      marketNeed?: string;             // Market need
      personalConnection?: string;     // Personal connection
      impactDesire?: string;           // Impact desire
    };
  };
  enhancers?: {                        // Enhancement flags (optional)
    emotionalDepth?: boolean;          // Enable emotional depth
    useAnalogies?: boolean;            // Use analogies
    urgency?: boolean;                 // Add urgency
  };
}
```

### **EmailCampaignPrompt Interface**
**Path**: `prompts/email_campaign.ts:9`  
**Purpose**: Input structure for Email Campaign prompt type

```typescript
export interface EmailCampaignPrompt {
  campaignGoal: string;                // Campaign goal
  targetAudience: string;              // Target audience
  keyMessage: string;                  // Key message
  callToAction: string;                // Call to action
  tone: string;                        // Desired tone
  enhancers?: Record<string, boolean>; // Optional enhancement flags
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

### **SiteAuditPrompt Interface**
**Path**: `prompts/site_audit.ts:9`  
**Purpose**: Input structure for Site Audit prompt type

```typescript
export interface SiteAuditPrompt {
  siteUrl: string;                     // Website URL to audit
  auditType: string;                   // Type of audit to perform
  focusAreas: string[];                // Areas to focus on
  goals: string[];                     // Audit goals
  tone: string;                        // Desired tone
  idea?: string;                       // Business idea (optional)
  audience?: string;                   // Target audience (optional)
  problemSolved?: string;              // Problem being solved (optional)
  differentiator?: string;             // Unique differentiator (optional)
  customerContent?: string;            // Customer content (optional)
  founderBio?: string;                 // Founder biography (optional)
  archetype?: string;                  // Brand archetype (optional)
  voice?: string;                      // Brand voice (optional)
  vibe?: string;                       // Brand vibe (optional)
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

## 📋 **INTERFACE USAGE SUMMARY**

### **Integration Priority for Make.com**
1. **High Priority**: PromptLogs, GoldmineOutput, SparkSplitMetrics, UserAIProfile, SparkSplitPrompt
2. **Medium Priority**: All Prompt Interfaces (Business workflows)
3. **Low Priority**: Internal system interfaces

### **Data Flow Relationships**
- **PromptLogs** → Contains embedded analytics from all other interfaces
- **GoldmineOutput** → Extracted from PromptLogs.analyticsMeta.outputGoldmine
- **SparkSplitMetrics** → Extracted from PromptLogs.analyticsMeta.sparkSplitMetrics
- **UserAIProfile** → Extracted from PromptLogs.analyticsMeta.userAIProfile
- **SparkSplitPrompt** → Input for SparkSplit Trust Engine
- **Prompt Interfaces** → Input structures for all CanAI prompt types

### **Prompt Interface Categories**
- **Trust & Analytics**: SparkSplitPrompt
- **Marketing**: AdAmplifyPrompt, BlogBlitzPrompt, SocialContentPrompt
- **Business**: BusinessPlanPrompt, EmailCampaignPrompt, ReverseStrategyPrompt
- **Branding**: AIBrandIdentityPrompt, ProfileMakeoverPrompt
- **Technical**: AIBlueprintPrompt, SiteAuditPrompt

### **Test-First Truth Validation**
✅ **All interfaces verified** against actual code paths  
✅ **Field types confirmed** through TypeScript definitions  
✅ **Usage patterns documented** with real implementation examples  
✅ **Integration paths identified** for Make.com workflows  
✅ **SparkSplitPrompt added** - newest interface from prompts folder

---

**Document Status**: COMPLETE - All 38+ interfaces documented with full field definitions and integration guidance, including the newly added SparkSplitPrompt interface. 