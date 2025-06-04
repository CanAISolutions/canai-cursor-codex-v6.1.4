# Airtable Base Truth Mapping - CanAI Emotional Intelligence Platform

**Base ID:** `apph8yM7gVc9QBFtx`  
**API Key:** `pataqlMUXrJnzszI7.9e5923a7ab8a6564f1f9bf9feb1efbb9037725e8ba81d3da2fafaf094172ceb9`  
**Extracted:** 2025-05-30T19:26:31.145Z  
**Total Tables:** 18  
**Total Fields:** 252  
**Total Records:** 126  

## Executive Summary

Your Airtable base contains a sophisticated **18-table emotional intelligence infrastructure** with comprehensive tracking across:
- **Core Analytics:** Session tracking, prompt logging, SparkSplit A/B testing
- **Emotional Intelligence:** 5-axis emotional compass (Awe, Ownership, Wonder, Calm, Power)
- **Trust Metrics:** Trust scoring, transparency tracking, competitive advantage measurement
- **Performance Monitoring:** System health, error logging, processing results
- **Reference Data:** Prompt types, emotional states, trust factors, system configurations

---

## Table Structure Overview

### TIER 1: CORE ANALYTICS TABLES (3 tables)

#### 1. **PromptLogs** (22 fields, 3 records)
**Purpose:** Core session tracking and analytics - the heart of CanAI's emotional intelligence

**Key Fields:**
- `timestamp` (dateTime) - Record creation timestamp
- `sessionId` (string) - Session correlation ID
- `userId` (string) - User identifier
- `promptType` (string) - Type of prompt executed (ad_amplify, business_plan, etc.)
- `inputFields` (string) - JSON input data
- `output` (string) - Generated output content
- `tokensUsed` (number) - Token consumption
- `costUSD` (number) - Cost tracking
- `trustScore` (number) - Trust measurement (0-1)
- `resonanceScore` (number) - Emotional resonance (0-1)
- `smartPromptScore` (number) - Prompt quality score
- **5-Axis Emotional Compass:**
  - `aweScore` (number) - Awe dimension (0-1)
  - `ownershipScore` (number) - Ownership dimension (0-1)
  - `wonderScore` (number) - Wonder dimension (0-1)
  - `calmScore` (number) - Calm dimension (0-1)
  - `powerScore` (number) - Power dimension (0-1)
- `emotionalDepth` (number) - Overall emotional engagement
- `fallbackTriggered` (string) - Fallback system activation
- `analyticsMeta` (string) - Additional analytics metadata
- `consentGiven` (checkbox) - User consent tracking
- `deletionRequested` (string) - Data deletion requests

#### 2. **SessionAnalytics** (21 fields, 5 records)
**Purpose:** Session-level analytics and user journey tracking

**Key Fields:**
- `sessionId` (string) - Session identifier
- `userId` (string) - User identifier
- `startTime` (dateTime) - Session start
- `endTime` (dateTime) - Session end
- `duration` (number) - Session duration in milliseconds
- `promptCount` (number) - Number of prompts in session
- `productsUsed` (multipleSelects) - Products used in session
- `primaryProduct` (string) - Main product used
- `trustScoreBefore` (number) - Trust score at session start
- `trustScoreAfter` (number) - Trust score at session end
- `trustDelta` (number) - Trust score change
- `emotionalDepth` (number) - Session emotional engagement
- `overrideCount` (number) - User overrides
- `timeToConfirmation` (string) - Time to user confirmation
- `dropOffSignal` (string) - Early exit indicators
- `cohort` (string) - User cohort assignment
- `status` (string) - Session status
- **Calculated Fields:**
  - `Total Prompts` (multipleSelects)
  - `Average Trust Score` (string)
  - `Total Cost` (number)

#### 3. **SparkSplitAnalytics** (29 fields, 3 records)
**Purpose:** A/B testing and competitive advantage measurement for SparkSplit transparency engine

**Key Fields:**
- `sessionId` (string) - Session correlation
- `timestamp` (number) - Unix timestamp
- `promptType` (string) - Prompt being tested
- `comparisonId` (string) - A/B test identifier
- `trustDelta` (number) - Trust change from comparison
- `userSelection` (string) - User's choice (sterile/enhanced)
- `timeToSelection` (number) - Decision time in milliseconds
- **5-Axis Emotional Scores:**
  - `aweScore` (number)
  - `ownershipScore` (number)
  - `wonderScore` (number)
  - `calmScore` (number)
  - `powerScore` (number)
- **SparkSplit Metrics:**
  - `competitiveAdvantage` (number) - Competitive edge measurement
  - `trustTransparencyScore` (number) - Transparency trust impact
  - `emotionalEducationScore` (number) - Educational value
  - `wouldRefer` (checkbox) - Referral likelihood
  - `circuitBreakerTriggered` (string) - Safety mechanism activation
- **A/B Testing:**
  - `testId` (string) - Test identifier
  - `variantType` (string) - Test variant
  - `conversionLift` (number) - Performance improvement
  - `statisticalSignificance` (number) - Statistical confidence
  - `marketingReady` (checkbox) - Ready for marketing use
- **Output Comparison:**
  - `sterileOutput` (string) - Standard output
  - `enhancedOutput` (string) - Emotionally enhanced output
  - `educationalMoment` (checkbox) - Learning opportunity
  - `transparencyTrust` (number) - Trust from transparency
  - `viralPotential` (number) - Shareability score
  - `sharedOutput` (checkbox) - User sharing behavior

---

### TIER 2: INTELLIGENCE TABLES (5 tables)

#### 4. **UserContext** (25 fields, 5 records)
**Purpose:** Comprehensive user profiling and personalization

**Key Fields:**
- `userId` (string) - User identifier
- `email` (string) - User email
- `timezone` (string) - User timezone
- `totalSessions` (number) - Session count
- `preferredProducts` (multipleSelects) - Product preferences
- `preferredTone` (string) - Communication preference
- `industryFocus` (multipleSelects) - Industry interests
- `businessGoals` (string) - User objectives
- `personalizationScore` (number) - Personalization effectiveness
- `emotionalBaseline` (string) - Base emotional state
- `trustScore` (number) - Overall trust level
- `lifetimeValue` (number) - Customer value
- `churnRisk` (number) - Retention risk
- `engagementTrend` (string) - Engagement pattern
- `preferences` (string) - JSON preferences
- `emotionalProfile` (string) - JSON emotional profile
- `sparkResonance` (string) - JSON spark concepts
- `createdAt` (dateTime) - Account creation
- `updatedAt` (dateTime) - Last update
- **Calculated Fields:**
  - `Total Sessions Calculated` (multipleSelects)
  - `Average Session Duration` (string)
  - `Total Prompts Created` (multipleSelects)
  - `Average Trust Score Calculated` (string)
  - `Total Spend` (number)

#### 5. **EmotionalIntelligence** (15 fields, 7 records)
**Purpose:** Emotional state tracking and resonance measurement

**Key Fields:**
- `sessionId` (string) - Session correlation
- `userId` (string) - User identifier
- `promptType` (string) - Prompt context
- `emotionalState` (string) - Current emotional state
- **5-Axis Emotional Compass:**
  - `aweScore` (number)
  - `ownershipScore` (number)
  - `wonderScore` (number)
  - `calmScore` (number)
  - `powerScore` (number)
- `overallResonance` (number) - Combined resonance score
- `trustScore` (number) - Trust measurement
- `confidenceScore` (number) - Confidence level
- `timestamp` (dateTime) - Measurement time
- `createdAt` (dateTime) - Record creation

#### 6. **TrustMetrics** (13 fields, 7 records)
**Purpose:** Trust scoring and transparency tracking

**Key Fields:**
- `sessionId` (string) - Session correlation
- `userId` (string) - User identifier
- `promptType` (string) - Prompt context
- `trustScore` (number) - Current trust score
- `previousScore` (number) - Previous trust score
- `trustDelta` (number) - Trust change
- `source` (string) - Trust factor source
- `component` (string) - Trust component
- `reason` (string) - Trust change reason
- `confidenceScore` (number) - Measurement confidence
- `timestamp` (dateTime) - Measurement time
- `createdAt` (dateTime) - Record creation

#### 7. **PerformanceMetrics** (12 fields, 8 records)
**Purpose:** System performance and API monitoring

**Key Fields:**
- `sessionId` (string) - Session correlation
- `promptType` (string) - Prompt context
- `apiCallId` (string) - API call identifier
- `timestamp` (dateTime) - Measurement time
- `responseTime` (number) - Response time in milliseconds
- `tokensUsed` (number) - Token consumption
- `cost` (number) - API cost
- `modelUsed` (string) - AI model used
- `success` (checkbox) - Success indicator
- `createdAt` (dateTime) - Record creation
- `errorMessage` (string) - Error details

#### 8. **GoldmineOutput** (20 fields, 4 records)
**Purpose:** High-value output tracking and reuse optimization

**Key Fields:**
- `recordId` (string) - Output identifier
- `sessionId` (string) - Session correlation
- `userId` (string) - User identifier
- `promptType` (string) - Prompt context
- `outputContent` (multilineText) - Generated content
- `outputHash` (string) - Content hash
- `resonanceScore` (number) - Emotional resonance
- `trustScore` (number) - Trust measurement
- `industryCluster` (string) - Industry classification
- `intentSummary` (string) - Intent summary
- `sparkConcept` (string) - Core concept
- `reuseCategory` (string) - Reuse classification
- `reusePotential` (number) - Reuse likelihood
- `compoundValue` (number) - Compound value score
- `emotionalTone` (string) - Emotional tone
- `emotionalEnergy` (string) - Energy level
- `emotionalStyle` (string) - Communication style
- `emotionalVocabulary` (string) - Vocabulary type
- `createdAt` (dateTime) - Creation time

---

### TIER 3: SYSTEM INFRASTRUCTURE (5 tables)

#### 9. **SystemHealth** (9 fields, 9 records)
**Purpose:** System monitoring and health tracking

**Key Fields:**
- `component` (string) - System component
- `healthStatus` (string) - Health status
- `responseTime` (number) - Response time
- `errorRate` (number) - Error rate
- `throughput` (number) - Throughput measurement
- `lastCheck` (dateTime) - Last health check
- `createdAt` (dateTime) - Record creation
- `alertTriggered` (checkbox) - Alert status

#### 10. **ErrorLogs** (10 fields, 5 records)
**Purpose:** Error tracking and debugging

**Key Fields:**
- `sessionId` (string) - Session correlation
- `promptType` (string) - Prompt context
- `errorType` (string) - Error classification
- `errorMessage` (string) - Error details
- `stackTrace` (string) - Technical stack trace
- `severity` (string) - Error severity
- `timestamp` (dateTime) - Error time
- `createdAt` (dateTime) - Record creation
- `resolved` (checkbox) - Resolution status

#### 11. **ProcessingResults** (10 fields, 7 records)
**Purpose:** Processing pipeline tracking

**Key Fields:**
- `sessionId` (string) - Session correlation
- `promptType` (string) - Prompt context
- `processingStage` (string) - Pipeline stage
- `status` (string) - Processing status
- `startTime` (dateTime) - Start time
- `endTime` (dateTime) - End time
- `duration` (number) - Processing duration
- `resultData` (string) - Result data
- `errorMessage` (string) - Error details

#### 12. **AirtableSync** (10 fields, 8 records)
**Purpose:** Airtable synchronization tracking

**Key Fields:**
- `sourceTable` (string) - Source table name
- `recordId` (string) - Record identifier
- `syncStatus` (string) - Sync status
- `lastSyncAttempt` (dateTime) - Last sync attempt
- `syncDuration` (number) - Sync duration
- `retryCount` (number) - Retry attempts
- `createdAt` (dateTime) - Record creation
- `updatedAt` (dateTime) - Last update
- `errorMessage` (string) - Error details

#### 13. **WebhookLogs** (12 fields, 6 records)
**Purpose:** Webhook delivery tracking

**Key Fields:**
- `sessionId` (string) - Session correlation
- `promptType` (string) - Prompt context
- `webhookType` (string) - Webhook type
- `payload` (string) - Webhook payload
- `deliveryStatus` (string) - Delivery status
- `responseCode` (number) - HTTP response code
- `responseTime` (number) - Response time
- `retryCount` (number) - Retry attempts
- `timestamp` (dateTime) - Delivery time
- `createdAt` (dateTime) - Record creation
- `errorMessage` (string) - Error details

---

### TIER 4: REFERENCE TABLES (5 tables)

#### 14. **PromptTypes** (14 fields, 10 records)
**Purpose:** Prompt type definitions and metadata

**Key Fields:**
- `promptType` (string) - Prompt identifier
- `displayName` (string) - Human-readable name
- `description` (string) - Prompt description
- `category` (string) - Prompt category
- `isActive` (checkbox) - Active status
- `defaultTone` (string) - Default tone
- `estimatedTokens` (number) - Token estimate
- `complexity` (string) - Complexity level
- `fieldCount` (number) - Input field count
- `hasNestedObjects` (checkbox) - Complex input indicator
- **Calculated Fields:**
  - `Total Usage Count` (multipleSelects)
  - `Average Trust Score` (string)
  - `Average Cost Per Use` (string)

**Sample Prompt Types:**
- `email_campaign` - Email marketing campaigns
- `business_plan` - Business plan generation
- `ad_amplify` - Advertisement amplification
- `blogblitz` - Blog content creation
- `profile_makeover` - Professional profile enhancement

#### 15. **EmotionalStates** (7 fields, 10 records)
**Purpose:** Emotional state definitions and recommendations

**Key Fields:**
- `stateName` (string) - Emotional state name
- `category` (string) - State category
- `intensity` (string) - Intensity level
- `description` (string) - State description
- `recommendedTone` (string) - Recommended response tone
- `isActive` (checkbox) - Active status

**Sample States:**
- `Skeptical` - User has doubts and needs convincing
- `Analytical` - Logical, data-driven approach
- `Focused` - Goal-oriented mindset

#### 16. **TrustFactors** (7 fields, 10 records)
**Purpose:** Trust factor definitions and impact measurement

**Key Fields:**
- `factorName` (string) - Trust factor name
- `category` (string) - Factor category
- `impact` (string) - Impact level
- `description` (string) - Factor description
- `applicableProducts` (multipleSelects) - Applicable products
- `isActive` (checkbox) - Active status

**Sample Factors:**
- `Consistency` - Predictable and stable performance
- `Transparency` - Open and honest communication
- `Competence` - Technical capability and expertise

#### 17. **SystemConfigs** (7 fields, 10 records)
**Purpose:** System configuration management

**Key Fields:**
- `configKey` (string) - Configuration key
- `configValue` (string) - Configuration value
- `category` (string) - Config category
- `description` (string) - Config description
- `isActive` (checkbox) - Active status
- `updatedBy` (string) - Last updated by

**Sample Configs:**
- `emotional_compass_enabled` - Enable 5-axis emotional tracking
- `sparksplit_enabled` - Enable A/B testing
- `trust_transparency_mode` - Trust transparency settings

#### 18. **AnalyticsAggregates** (9 fields, 9 records)
**Purpose:** Pre-computed analytics aggregations

**Key Fields:**
- `aggregateType` (string) - Aggregation type (daily, weekly, monthly)
- `promptType` (string) - Prompt type
- `dateRange` (dateTime) - Time period
- `totalSessions` (number) - Session count
- `averageTrustScore` (number) - Average trust
- `averageResonanceScore` (number) - Average resonance
- `totalTokensUsed` (number) - Token consumption
- `totalCostUSD` (number) - Total cost

#### 19. **DiscoveryFunnelInput** (0 fields, 0 records)
**Purpose:** Discovery funnel input tracking (empty table)

---

## Field Type Distribution

- **Text Fields:** 130 fields (51.6%)
- **Numeric Fields:** 75 fields (29.8%)
- **DateTime Fields:** 25 fields (9.9%)
- **Checkbox Fields:** 13 fields (5.2%)
- **Multiple Select Fields:** 8 fields (3.2%)
- **Long Text Fields:** 1 field (0.4%)

---

## Key Insights

### 1. **Emotional Intelligence Architecture**
Your base implements a sophisticated **5-axis emotional compass** tracking:
- **Awe:** Wonder and inspiration measurement
- **Ownership:** User empowerment and control
- **Wonder:** Curiosity and engagement
- **Calm:** Peace and confidence
- **Power:** Capability and effectiveness

### 2. **SparkSplit Transparency Engine**
Advanced A/B testing infrastructure measuring:
- Trust transparency impact
- Competitive advantage
- Educational moments
- Viral potential
- User selection patterns

### 3. **Trust Scoring System**
Comprehensive trust measurement across:
- Session-level trust changes
- Component-specific trust factors
- Transparency-driven trust building
- Confidence scoring

### 4. **Performance Monitoring**
Complete system observability with:
- Real-time health monitoring
- Error tracking and resolution
- Processing pipeline visibility
- Webhook delivery tracking

### 5. **Data Quality**
- **126 total records** across all tables
- **Active data collection** in core tables
- **Reference data** properly populated
- **Calculated fields** for derived metrics

---

## API Integration Points

### Primary Endpoints
```
Base URL: https://api.airtable.com/v0/apph8yM7gVc9QBFtx/
Authorization: Bearer pataqlMUXrJnzszI7.9e5923a7ab8a6564f1f9bf9feb1efbb9037725e8ba81d3da2fafaf094172ceb9
```

### Core Tables for Integration
1. **PromptLogs** - Primary data ingestion point
2. **SessionAnalytics** - Session tracking
3. **SparkSplitAnalytics** - A/B testing results
4. **UserContext** - User profiling
5. **EmotionalIntelligence** - Emotional tracking

### Reference Tables
1. **PromptTypes** - Prompt definitions
2. **EmotionalStates** - State definitions
3. **TrustFactors** - Trust factor definitions
4. **SystemConfigs** - Configuration management

---

## Next Steps Recommendations

### 1. **Data Validation**
- Verify JSON field parsing for `inputFields`, `output`, `analyticsMeta`
- Validate calculated field formulas
- Check data consistency across related tables

### 2. **API Integration**
- Implement real-time data ingestion
- Set up webhook delivery for external systems
- Configure automated sync processes

### 3. **Analytics Enhancement**
- Populate `AnalyticsAggregates` with computed metrics
- Implement trend analysis
- Set up alerting for anomalies

### 4. **Performance Optimization**
- Monitor API rate limits
- Implement caching strategies
- Optimize field indexing

This mapping provides the absolute truth of your Airtable base structure, extracted directly via API. Your infrastructure is sophisticated and well-designed for emotional intelligence tracking and trust transparency measurement. 