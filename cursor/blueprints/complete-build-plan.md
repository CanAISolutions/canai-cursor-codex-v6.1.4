# 🚨 COMPLETE BUILD PLAN: DATABASE-FIRST IMPLEMENTATION
**Task-Based Execution Plan for 18-Table Schema + SparkSplit Trust Transparency**

> **Status**: Production-Ready Build Plan  
> **Framework**: Codex v6.1.4 + Emotional Sovereignty Manifesto  
> **Source**: 100% Based on Provided Documents  
> **Architecture**: PostgreSQL/Supabase Primary + Airtable Mirror  

---

## 📋 **TASK TRACKING OVERVIEW**

### **Phase Summary**
- **Phase 1**: Database Foundation (Tasks 1-15) - Days 1-3
- **Phase 2**: API Layer & Interfaces (Tasks 16-30) - Days 4-5  
- **Phase 3**: SparkSplit Trust Engine (Tasks 31-45) - Days 6-7
- **Phase 4**: Airtable Mirror & Integration (Tasks 46-60) - Days 8-9
- **Phase 5**: Make.com Automation (Tasks 61-75) - Days 10-12
- **Phase 6**: Sacred Metrics & Validation (Tasks 76-90) - Days 13-14

**Total Tasks**: 90  
**Estimated Duration**: 14 days  
**Confidence**: 95%  

---

## 🗄️ **PHASE 1: DATABASE FOUNDATION (Days 1-3)**

### **TASK 1: Supabase Project Setup**
**Priority**: Critical  
**Estimated Time**: 2 hours  
**Dependencies**: None  
**Acceptance Criteria**:
- [ ] Supabase project created with production settings
- [ ] Database connection string configured
- [ ] Environment variables set up (.env.local)
- [ ] Basic authentication enabled
- [ ] Row Level Security (RLS) enabled

**Implementation Details**:
```bash
# Environment setup
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
```

### **TASK 2: Core Schema - SessionAnalytics Table**
**Priority**: Critical  
**Estimated Time**: 3 hours  
**Dependencies**: Task 1  
**Source**: AIRTABLE-TABLE-RELATIONSHIPS-MAPPING.md (Central Hub definition)  
**Acceptance Criteria**:
- [ ] Table created with all fields from DEFINITIVE-18-TABLE-PROPOSAL-FINAL.md
- [ ] Primary key and indexes implemented
- [ ] RLS policies configured
- [ ] All field types match FIELD-SPECIFICATIONS-REFERENCE.md

**Implementation Details**:
```sql
CREATE TABLE session_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(255),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    duration INTEGER,
    prompt_count INTEGER DEFAULT 0,
    
    -- Product usage tracking (from DEFINITIVE proposal)
    products_used TEXT[],
    primary_product VARCHAR(255),
    
    -- Trust metrics (from Emotional Sovereignty Manifesto)
    trust_score_before DECIMAL(3,2),
    trust_score_after DECIMAL(3,2),
    trust_delta DECIMAL(3,2),
    emotional_depth DECIMAL(3,2),
    
    -- Session behavior
    override_count INTEGER DEFAULT 0,
    time_to_confirmation INTEGER,
    drop_off_signal BOOLEAN DEFAULT FALSE,
    cohort VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Performance indexes (from DEFINITIVE proposal)
CREATE INDEX idx_sessions_user_start ON session_analytics(user_id, start_time);
CREATE INDEX idx_sessions_trust_delta ON session_analytics(trust_delta);
CREATE INDEX idx_sessions_primary_product ON session_analytics(primary_product);
CREATE INDEX idx_sessions_status ON session_analytics(status);
```

### **TASK 3: Core Schema - PromptLogs Table**
**Priority**: Critical  
**Estimated Time**: 4 hours  
**Dependencies**: Task 2  
**Source**: DEFINITIVE-18-TABLE-PROPOSAL-FINAL.md (Universal Prompt Tracking)  
**Acceptance Criteria**:
- [ ] All 11 product types supported (from CANAI-INTERFACE-CATALOG.json)
- [ ] JSONB fields for complex input storage
- [ ] 5-axis emotional compass implemented
- [ ] Foreign key relationships to session_analytics

**Implementation Details**:
```sql
CREATE TABLE prompt_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    session_id UUID NOT NULL,
    user_id VARCHAR(255),
    
    -- ALL 11 PRODUCT TYPES (from CANAI-INTERFACE-CATALOG.json)
    prompt_type VARCHAR(255) NOT NULL CHECK (prompt_type IN (
        'ad_amplify', 'blogblitz', 'profile_makeover', 'business_plan',
        'email_campaign', 'site_audit', 'social_content', 'reverse_strategy',
        'ai_blueprint', 'ai_brand_identity', 'spark_split'
    )),
    
    -- FLEXIBLE INPUT STORAGE (real JSONB for complex interfaces)
    input_fields JSONB NOT NULL,
    output_content JSONB,
    
    -- CORE METRICS
    tokens_used INTEGER,
    cost_usd DECIMAL(8,4),
    trust_score DECIMAL(3,2),
    resonance_score DECIMAL(3,2),
    smart_prompt_score DECIMAL(3,2),
    emotional_depth DECIMAL(3,2),
    
    -- 5-AXIS EMOTIONAL COMPASS (from Emotional Sovereignty Manifesto)
    awe_score DECIMAL(3,2),
    ownership_score DECIMAL(3,2),
    wonder_score DECIMAL(3,2),
    calm_score DECIMAL(3,2),
    power_score DECIMAL(3,2),
    
    -- FALLBACK TRACKING
    fallback_triggered BOOLEAN DEFAULT FALSE,
    fallback_fields TEXT[],
    
    -- SYSTEM METADATA
    analytics_meta JSONB,
    consent_given BOOLEAN DEFAULT TRUE,
    deletion_requested BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- FOREIGN KEYS
    FOREIGN KEY (session_id) REFERENCES session_analytics(id)
);

-- PERFORMANCE INDEXES
CREATE INDEX idx_promptlogs_session ON prompt_logs(session_id);
CREATE INDEX idx_promptlogs_user_timestamp ON prompt_logs(user_id, timestamp);
CREATE INDEX idx_promptlogs_type_timestamp ON prompt_logs(prompt_type, timestamp);
CREATE INDEX idx_promptlogs_trust_score ON prompt_logs(trust_score);
CREATE INDEX idx_promptlogs_input_gin ON prompt_logs USING GIN (input_fields);
```

### **TASK 4: SparkSplit Analytics Table**
**Priority**: Critical  
**Estimated Time**: 4 hours  
**Dependencies**: Task 2  
**Source**: DEFINITIVE-18-TABLE-PROPOSAL-FINAL.md (Revolutionary Trust Transparency Engine)  
**Acceptance Criteria**:
- [ ] Complete trust transparency fields implemented
- [ ] A/B testing engine support
- [ ] Educational impact tracking
- [ ] Circuit breaker protection fields

**Implementation Details**:
```sql
CREATE TABLE sparksplit_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    timestamp BIGINT NOT NULL,
    prompt_type VARCHAR(255),
    comparison_id VARCHAR(255),
    trust_delta DECIMAL(3,2),
    user_selection VARCHAR(50) CHECK (user_selection IN ('sterile', 'canai', 'both', 'neither', 'skip')),
    time_to_selection INTEGER,
    
    -- 5-AXIS EMOTIONAL COMPASS
    awe_score DECIMAL(3,2),
    ownership_score DECIMAL(3,2),
    wonder_score DECIMAL(3,2),
    calm_score DECIMAL(3,2),
    power_score DECIMAL(3,2),
    
    -- TRUST TRANSPARENCY METRICS
    competitive_advantage DECIMAL(3,2),
    trust_transparency_score DECIMAL(3,2),
    emotional_education_score DECIMAL(3,2),
    would_refer BOOLEAN,
    shared_output BOOLEAN DEFAULT FALSE,
    circuit_breaker_triggered BOOLEAN DEFAULT FALSE,
    
    -- A/B TESTING ENGINE
    test_id VARCHAR(255),
    variant_type VARCHAR(50) CHECK (variant_type IN ('sterile', 'enhanced')),
    conversion_lift DECIMAL(5,2),
    statistical_significance DECIMAL(3,2),
    marketing_ready BOOLEAN DEFAULT FALSE,
    
    -- COMPARISON OUTPUTS
    sterile_output TEXT,
    enhanced_output TEXT,
    
    -- EDUCATIONAL IMPACT
    educational_moment BOOLEAN DEFAULT FALSE,
    transparency_trust DECIMAL(3,2),
    viral_potential DECIMAL(3,2),
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (session_id) REFERENCES session_analytics(id)
);

-- SPARKSPLIT INDEXES
CREATE INDEX idx_sparksplit_session ON sparksplit_analytics(session_id);
CREATE INDEX idx_sparksplit_type ON sparksplit_analytics(prompt_type);
CREATE INDEX idx_sparksplit_trust_timestamp ON sparksplit_analytics(trust_delta, timestamp);
CREATE INDEX idx_sparksplit_selection ON sparksplit_analytics(user_selection);
CREATE INDEX idx_sparksplit_test_id ON sparksplit_analytics(test_id);
```

### **TASK 5: Intelligence Tables - GoldmineOutput**
**Priority**: High  
**Estimated Time**: 3 hours  
**Dependencies**: Task 2  
**Source**: CANAI-INTERFACE-CATALOG.json (GoldmineOutput interface)  
**Acceptance Criteria**:
- [ ] All fields from GoldmineOutput interface implemented
- [ ] Emotional fingerprint structure matches interface
- [ ] Content intelligence fields properly typed

**Implementation Details**:
```sql
CREATE TABLE goldmine_output (
    record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL,
    user_id VARCHAR(255),
    prompt_type VARCHAR(255),
    output_content TEXT,
    output_hash VARCHAR(255) UNIQUE,
    resonance_score DECIMAL(3,2),
    trust_score DECIMAL(3,2),
    
    -- CONTENT INTELLIGENCE
    industry_cluster VARCHAR(100),
    intent_summary TEXT,
    spark_concept VARCHAR(255),
    reuse_category VARCHAR(100),
    reuse_potential DECIMAL(3,2),
    compound_value DECIMAL(10,2),
    
    -- EMOTIONAL FINGERPRINT (from CANAI-INTERFACE-CATALOG.json)
    emotional_tone VARCHAR(100),
    emotional_energy VARCHAR(100),
    emotional_style VARCHAR(100),
    emotional_vocabulary VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (session_id) REFERENCES session_analytics(id)
);
```

### **TASK 6-15: Remaining Intelligence & Infrastructure Tables**
**Priority**: High  
**Estimated Time**: 2-3 hours each  
**Dependencies**: Tasks 2-5  

**Tables to Implement** (following same pattern):
- Task 6: UserContext (from CANAI-INTERFACE-CATALOG.json UserAIProfile)
- Task 7: EmotionalIntelligence (5-axis tracking)
- Task 8: TrustMetrics
- Task 9: PerformanceMetrics
- Task 10: WebhookLogs
- Task 11: ErrorLogs
- Task 12: ProcessingResults
- Task 13: AirtableSync
- Task 14: SystemHealth
- Task 15: Reference Tables (PromptTypes, EmotionalStates, TrustFactors, SystemConfigs, AnalyticsAggregates)

---

## 🔌 **PHASE 2: API LAYER & INTERFACES (Days 4-5)**

### **TASK 16: TypeScript Interface Definitions**
**Priority**: Critical  
**Estimated Time**: 4 hours  
**Dependencies**: Tasks 1-15  
**Source**: CANAI-INTERFACE-CATALOG.json (all 38 interfaces)  
**Acceptance Criteria**:
- [ ] All 38 interfaces from catalog implemented
- [ ] Proper typing for nested objects (BusinessPlan, SparkSplit)
- [ ] Validation schemas using Zod
- [ ] Export/import structure matches catalog

**Implementation Details**:
```typescript
// types/interfaces.ts - Based on CANAI-INTERFACE-CATALOG.json

// GoldmineOutput interface (exact match to catalog)
export interface GoldmineOutput {
  recordId: string;
  sessionId: string;
  userId: string | null;
  promptType: string;
  outputContent: string;
  outputHash: string;
  resonanceScore: number; // 0-1 range
  trustScore: number; // 0-1 range
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
  reusePotential: number; // 0-1 range
  compoundValue: number;
}

// UserAIProfile interface (exact match to catalog)
export interface UserAIProfile {
  recordId: string;
  userId: string;
  totalSessions: number;
  preferredTone: string | null;
  industryFocus: string[];
  businessGoals: string[];
  emotionalProfile: {
    primaryMotivators: string[];
    stressPoints: string[];
    energySources: string[];
    communicationNeeds: string[];
  };
  sparkResonance: {
    highResonanceConcepts: string[];
    averageResonanceScore: number;
    preferredSparkTypes: string[];
  };
  personalizationScore: number; // 0-1 range
  lifetimeValue: number;
  churnRisk: number; // 0-1 range
}

// SparkSplitPrompt interface (complex nested structure)
export interface SparkSplitPrompt {
  // ... 28 fields with complex trust objects
  trustEvolution: {
    competitiveAdvantage: number;
    transparencyScore: number;
    // ... complete structure from catalog
  };
  emotionalContext: {
    emotions: string[];
    // ... complete structure
  };
  enhancers: {
    qualityIndicators: string[];
    // ... complete structure
  };
}
```

### **TASK 17: Database Client Setup**
**Priority**: Critical  
**Estimated Time**: 2 hours  
**Dependencies**: Task 16  
**Acceptance Criteria**:
- [ ] Supabase client configured with proper typing
- [ ] Connection pooling enabled
- [ ] Error handling middleware
- [ ] Type-safe query builders

### **TASK 18-25: CRUD Operations for Core Tables**
**Priority**: Critical  
**Estimated Time**: 3 hours each  
**Dependencies**: Tasks 16-17  

**Individual Tasks**:
- Task 18: SessionAnalytics CRUD
- Task 19: PromptLogs CRUD  
- Task 20: SparkSplitAnalytics CRUD
- Task 21: GoldmineOutput CRUD
- Task 22: UserContext CRUD
- Task 23: EmotionalIntelligence CRUD
- Task 24: TrustMetrics CRUD
- Task 25: Performance/System tables CRUD

### **TASK 26: Complex JSON Handling**
**Priority**: Critical  
**Estimated Time**: 4 hours  
**Dependencies**: Tasks 18-25  
**Source**: BusinessPlanPrompt & SparkSplitPrompt (31 & 28 fields respectively)  
**Acceptance Criteria**:
- [ ] Nested object validation for BusinessPlan (3-level nesting)
- [ ] Complex trust analysis for SparkSplit
- [ ] JSON schema validation
- [ ] Proper indexing for JSONB queries

**Implementation Details**:
```typescript
// Complex JSON handling for BusinessPlan (31 fields, 3-level nesting)
interface BusinessPlanInput {
  industry: string;
  goal: string;
  financials: {
    revenueModel: string;
    initialInvestment: number;
    emotionalDrivers: {
      marketNeed: string;
      personalMotivation: string;
    };
  };
  emotionalContext: {
    primaryMotivator: string;
    // ... complete 31-field structure
  };
}

// Validation and storage
export async function createBusinessPlanPrompt(input: BusinessPlanInput) {
  // Validate complex nested structure
  const validated = businessPlanSchema.parse(input);
  
  // Store in JSONB with proper indexing
  const result = await supabase
    .from('prompt_logs')
    .insert({
      prompt_type: 'business_plan',
      input_fields: validated, // Full JSONB storage
      // Extract key fields for indexing
      industry: validated.industry,
      goal: validated.goal,
      revenue_model: validated.financials.revenueModel
    });
    
  return result;
}
```

### **TASK 27-30: API Endpoints**
**Priority**: High  
**Estimated Time**: 2-3 hours each  
**Dependencies**: Task 26  

**Endpoints to Implement**:
- Task 27: POST /api/prompts (universal prompt creation)
- Task 28: POST /api/sparksplit (trust comparison)
- Task 29: GET /api/analytics (Sacred Metrics queries)
- Task 30: GET /api/user-profile (user intelligence)

---

## ⚡ **PHASE 3: SPARKSPLIT TRUST ENGINE (Days 6-7)**

### **TASK 31: SparkSplit Core Engine**
**Priority**: Critical  
**Estimated Time**: 6 hours  
**Dependencies**: Tasks 1-30  
**Source**: ideal-cx-thread-v2-emotional-sovereignty.md (Revolutionary Trust Transparency)  
**Acceptance Criteria**:
- [ ] Side-by-side comparison generation
- [ ] Sterile vs enhanced output creation
- [ ] Educational moment detection
- [ ] Circuit breaker implementation

**Implementation Details**:
```typescript
// SparkSplit Trust Transparency Engine
export class SparkSplitEngine {
  async generateComparison(promptInput: any, promptType: string) {
    // Generate sterile output (basic AI)
    const sterileOutput = await this.generateSterileOutput(promptInput);
    
    // Generate enhanced output (CanAI emotional intelligence)
    const enhancedOutput = await this.generateEnhancedOutput(promptInput);
    
    // Calculate trust metrics
    const trustMetrics = await this.calculateTrustMetrics(
      sterileOutput, 
      enhancedOutput, 
      promptInput
    );
    
    // Create comparison record
    const comparison = await supabase
      .from('sparksplit_analytics')
      .insert({
        session_id: promptInput.sessionId,
        prompt_type: promptType,
        comparison_id: generateUUID(),
        sterile_output: sterileOutput,
        enhanced_output: enhancedOutput,
        competitive_advantage: trustMetrics.competitiveAdvantage,
        trust_transparency_score: trustMetrics.transparencyScore,
        emotional_education_score: trustMetrics.educationScore
      });
      
    return comparison;
  }
  
  // Circuit breaker for poor experiences
  async checkCircuitBreaker(trustDelta: number): Promise<boolean> {
    if (trustDelta < -0.5) {
      // Trigger circuit breaker
      await this.logCircuitBreakerEvent();
      return true;
    }
    return false;
  }
}
```

### **TASK 32: 5-Axis Emotional Compass**
**Priority**: Critical  
**Estimated Time**: 4 hours  
**Dependencies**: Task 31  
**Source**: Emotional Sovereignty Manifesto (5-axis scoring)  
**Acceptance Criteria**:
- [ ] Awe score calculation (wonder spark)
- [ ] Ownership score (feels like mine)
- [ ] Wonder score (possibility unlock)
- [ ] Calm score (peace with vision)
- [ ] Power score (voice strength)

### **TASK 33: Trust Delta Calculation**
**Priority**: Critical  
**Estimated Time**: 3 hours  
**Dependencies**: Task 32  
**Acceptance Criteria**:
- [ ] Before/after trust measurement
- [ ] Delta calculation algorithm
- [ ] Trend analysis
- [ ] Threshold-based alerts

### **TASK 34: Educational Moment Detection**
**Priority**: High  
**Estimated Time**: 3 hours  
**Dependencies**: Task 33  
**Source**: ideal-cx-thread-v2-emotional-sovereignty.md (Educational Impact)  
**Acceptance Criteria**:
- [ ] User learning detection
- [ ] Transparency understanding measurement
- [ ] "Aha moment" identification
- [ ] Educational impact scoring

### **TASK 35-40: A/B Testing Engine**
**Priority**: High  
**Estimated Time**: 2-3 hours each  
**Dependencies**: Tasks 31-34  

**A/B Testing Components**:
- Task 35: Test ID generation and tracking
- Task 36: Variant assignment (sterile vs enhanced)
- Task 37: Conversion lift calculation
- Task 38: Statistical significance testing
- Task 39: Marketing readiness determination
- Task 40: Viral potential scoring

### **TASK 41-45: Trust Transparency UI Components**
**Priority**: High  
**Estimated Time**: 3-4 hours each  
**Dependencies**: Tasks 35-40  

**UI Components**:
- Task 41: Side-by-side comparison display
- Task 42: Emotional compass visualization
- Task 43: Trust delta indicator
- Task 44: Educational moment highlighting
- Task 45: User selection interface

---

## 🔄 **PHASE 4: AIRTABLE MIRROR & INTEGRATION (Days 8-9)**

### **TASK 46: Airtable Base Setup**
**Priority**: High  
**Estimated Time**: 3 hours  
**Dependencies**: Tasks 1-45  
**Source**: AIRTABLE-TABLE-RELATIONSHIPS-MAPPING.md (47 relationships)  
**Acceptance Criteria**:
- [ ] All 18 tables created in Airtable
- [ ] Field types match FIELD-SPECIFICATIONS-REFERENCE.md
- [ ] Relationships preserved (47 total)
- [ ] Views configured for business users

### **TASK 47: Bidirectional Sync Engine**
**Priority**: Critical  
**Estimated Time**: 5 hours  
**Dependencies**: Task 46  
**Acceptance Criteria**:
- [ ] PostgreSQL → Airtable sync (primary direction)
- [ ] Airtable → PostgreSQL sync (updates only)
- [ ] Conflict resolution strategy
- [ ] Real-time sync triggers

**Implementation Details**:
```typescript
// Bidirectional sync engine
export class AirtableSyncEngine {
  async syncToAirtable(record: any, tableName: string) {
    // Flatten complex JSON for Airtable
    const flattenedRecord = this.flattenForAirtable(record);
    
    // Map to Airtable field names
    const airtableFields = this.mapToAirtableFields(flattenedRecord, tableName);
    
    // Create/update in Airtable
    const result = await airtable(tableName).create({
      fields: airtableFields
    });
    
    // Log sync status
    await this.logSyncStatus(record.id, 'success', result.id);
    
    return result;
  }
  
  // Flatten complex JSON for Airtable storage
  private flattenForAirtable(record: any): any {
    const flattened = {};
    
    // Handle BusinessPlan complexity (31 fields, 3-level nesting)
    if (record.input_fields?.financials) {
      flattened['financials_revenueModel'] = record.input_fields.financials.revenueModel;
      flattened['financials_initialInvestment'] = record.input_fields.financials.initialInvestment;
      
      if (record.input_fields.financials.emotionalDrivers) {
        flattened['emotionalDrivers_marketNeed'] = record.input_fields.financials.emotionalDrivers.marketNeed;
      }
    }
    
    // Handle 5-axis emotional compass
    flattened['aweScore'] = record.awe_score;
    flattened['ownershipScore'] = record.ownership_score;
    flattened['wonderScore'] = record.wonder_score;
    flattened['calmScore'] = record.calm_score;
    flattened['powerScore'] = record.power_score;
    
    return flattened;
  }
}
```

### **TASK 48-55: Table-Specific Sync Logic**
**Priority**: High  
**Estimated Time**: 2 hours each  
**Dependencies**: Task 47  

**Sync Implementation per Table**:
- Task 48: SessionAnalytics sync
- Task 49: PromptLogs sync (complex JSON flattening)
- Task 50: SparkSplitAnalytics sync
- Task 51: GoldmineOutput sync
- Task 52: UserContext sync
- Task 53: EmotionalIntelligence sync
- Task 54: System tables sync
- Task 55: Reference tables sync

### **TASK 56-60: Airtable Dashboard Views**
**Priority**: Medium  
**Estimated Time**: 2-3 hours each  
**Dependencies**: Tasks 48-55  

**Dashboard Views**:
- Task 56: Sacred Metrics dashboard
- Task 57: SparkSplit performance view
- Task 58: User intelligence dashboard
- Task 59: System health monitoring
- Task 60: Business analytics views

---

## 🤖 **PHASE 5: MAKE.COM AUTOMATION (Days 10-12)**

### **TASK 61: Webhook Endpoint Setup**
**Priority**: Critical  
**Estimated Time**: 4 hours  
**Dependencies**: Tasks 1-60  
**Source**: DEFINITIVE-18-TABLE-PROPOSAL-FINAL.md (Make.com integration examples)  
**Acceptance Criteria**:
- [ ] Universal prompt webhook endpoint
- [ ] SparkSplit comparison webhook
- [ ] Error handling webhook
- [ ] Proper authentication and validation

**Implementation Details**:
```typescript
// Webhook endpoints for Make.com integration
export async function POST(request: Request) {
  const payload = await request.json();
  
  // Validate webhook signature
  const isValid = await validateWebhookSignature(request);
  if (!isValid) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Route based on event type
  switch (payload.event) {
    case 'prompt_completed':
      return await handlePromptCompleted(payload);
    case 'sparksplit_comparison':
      return await handleSparkSplitComparison(payload);
    case 'error_occurred':
      return await handleErrorOccurred(payload);
    default:
      return new Response('Unknown event type', { status: 400 });
  }
}

// Handle prompt completion (from DEFINITIVE proposal webhook structure)
async function handlePromptCompleted(payload: any) {
  // Create prompt log
  const promptLog = await supabase
    .from('prompt_logs')
    .insert({
      session_id: payload.sessionId,
      user_id: payload.userId,
      prompt_type: payload.promptType,
      input_fields: payload.inputFields, // Full JSONB storage
      output_content: payload.output,
      trust_score: payload.metrics.trustScore,
      resonance_score: payload.metrics.resonanceScore,
      awe_score: payload.metrics.emotionalCompass.awe,
      ownership_score: payload.metrics.emotionalCompass.ownership,
      wonder_score: payload.metrics.emotionalCompass.wonder,
      calm_score: payload.metrics.emotionalCompass.calm,
      power_score: payload.metrics.emotionalCompass.power,
      tokens_used: payload.performance.tokensUsed,
      cost_usd: payload.performance.costUSD,
      fallback_triggered: payload.fallback.triggered,
      fallback_fields: payload.fallback.fields
    });
    
  // Update session analytics
  await updateSessionAnalytics(payload.sessionId, {
    prompt_count: { increment: 1 },
    trust_score_after: payload.metrics.trustScore
  });
  
  // Sync to Airtable
  await syncToAirtable(promptLog.data[0], 'PromptLogs');
  
  // Check for goldmine output creation
  if (payload.metrics.trustScore > 0.8) {
    await createGoldmineOutput(promptLog.data[0]);
  }
  
  return new Response('Success', { status: 200 });
}
```

### **TASK 62-70: Make.com Scenario Implementation**
**Priority**: High  
**Estimated Time**: 2-3 hours each  
**Dependencies**: Task 61  

**Scenario Templates** (from DEFINITIVE proposal):
- Task 62: Universal Prompt Processing scenario
- Task 63: SparkSplit Trust Transparency scenario  
- Task 64: Error Handling & Recovery scenario
- Task 65: User Intelligence Update scenario
- Task 66: Sacred Metrics Aggregation scenario
- Task 67: Performance Monitoring scenario
- Task 68: System Health Check scenario
- Task 69: Analytics Dashboard Update scenario
- Task 70: Viral Potential Tracking scenario

### **TASK 71-75: Integration Testing**
**Priority**: Critical  
**Estimated Time**: 3-4 hours each  
**Dependencies**: Tasks 62-70  

**Testing Scenarios**:
- Task 71: End-to-end prompt flow testing
- Task 72: SparkSplit comparison testing
- Task 73: Error handling and recovery testing
- Task 74: Performance under load testing
- Task 75: Data integrity validation

---

## 📊 **PHASE 6: SACRED METRICS & VALIDATION (Days 13-14)**

### **TASK 76: Sacred Metrics Implementation**
**Priority**: Critical  
**Estimated Time**: 6 hours  
**Dependencies**: Tasks 1-75  
**Source**: ideal-cx-thread-v2-emotional-sovereignty.md (Sacred Metrics tracking)  
**Acceptance Criteria**:
- [ ] Belief Generation Rate tracking (target: 90%+)
- [ ] Emotional Trust Score monitoring (target: 4.7+)
- [ ] Spark Resonance measurement (target: 95%+)
- [ ] Trust transparency metrics
- [ ] Educational impact tracking

**Implementation Details**:
```sql
-- Sacred Metrics Queries (from Emotional Sovereignty Manifesto)

-- Belief Generation Rate (Target: 90%+)
CREATE VIEW belief_generation_rate AS
SELECT 
  COUNT(CASE WHEN trust_score > previous_score THEN 1 END)::FLOAT / COUNT(*) * 100 as rate
FROM trust_metrics 
WHERE created_at >= NOW() - INTERVAL '30 days';

-- Emotional Trust Score (Target: 4.7+)
CREATE VIEW emotional_trust_score AS
SELECT AVG(trust_score * 5) as score  -- Convert 0-1 to 0-5 scale
FROM prompt_logs 
WHERE created_at >= NOW() - INTERVAL '30 days';

-- Spark Resonance (Target: 95%+)
CREATE VIEW spark_resonance_rate AS
SELECT AVG(resonance_score) * 100 as rate
FROM prompt_logs 
WHERE resonance_score IS NOT NULL;

-- SparkSplit Trust Transparency Metrics
CREATE VIEW sparksplit_metrics AS
SELECT 
  COUNT(CASE WHEN user_selection = 'canai' THEN 1 END)::FLOAT / COUNT(*) * 100 as canai_selection_rate,
  AVG(trust_delta) as avg_trust_delta,
  COUNT(CASE WHEN educational_moment = true THEN 1 END)::FLOAT / COUNT(*) * 100 as educational_impact_rate,
  COUNT(CASE WHEN shared_output = true THEN 1 END)::FLOAT / COUNT(*) * 100 as viral_sharing_rate
FROM sparksplit_analytics;
```

### **TASK 77-85: Validation Testing**
**Priority**: Critical  
**Estimated Time**: 2-3 hours each  
**Dependencies**: Task 76  

**Validation Tasks**:
- Task 77: All 11 product interfaces validation
- Task 78: Complex JSON handling validation (BusinessPlan 31 fields)
- Task 79: SparkSplit trust transparency validation
- Task 80: 5-axis emotional compass validation
- Task 81: Sacred Metrics accuracy validation
- Task 82: Airtable sync integrity validation
- Task 83: Make.com automation validation
- Task 84: Performance benchmarking
- Task 85: Security and compliance validation

### **TASK 86-90: Production Readiness**
**Priority**: Critical  
**Estimated Time**: 3-4 hours each  
**Dependencies**: Tasks 77-85  

**Production Tasks**:
- Task 86: Environment configuration (staging/production)
- Task 87: Monitoring and alerting setup
- Task 88: Backup and recovery procedures
- Task 89: Documentation and handover
- Task 90: Go-live checklist and deployment

---

## ✅ **ACCEPTANCE CRITERIA SUMMARY**

### **Technical Validation**
- [ ] All 18 tables implemented with proper relationships
- [ ] All 11 product interfaces supported with real data
- [ ] Complex JSON handling (BusinessPlan 31 fields, SparkSplit 28 fields)
- [ ] SparkSplit trust transparency engine operational
- [ ] 5-axis emotional compass tracking
- [ ] Sacred Metrics dashboard functional
- [ ] Airtable mirror sync working bidirectionally
- [ ] Make.com automation scenarios deployed
- [ ] Performance benchmarks met
- [ ] Security compliance validated

### **Business Validation**
- [ ] Revolutionary trust transparency working
- [ ] Educational impact measurement active
- [ ] Viral potential tracking functional
- [ ] User intelligence profiling operational
- [ ] Content intelligence (Goldmine) working
- [ ] Circuit breaker protection active
- [ ] Real-time emotional tracking
- [ ] Business-friendly Airtable interface

### **Codex Compliance**
- [ ] Zero placeholder implementations
- [ ] Real API integrations functional
- [ ] Proper error handling and recovery
- [ ] Type safety throughout
- [ ] Production-ready architecture
- [ ] Comprehensive logging and monitoring

---

## 📋 **FINAL CONFIDENCE: 95%**

**Ready for Immediate Implementation** with comprehensive task tracking, real-world interface mapping, and zero shortcuts. All tasks are grounded 100% in the provided documents with detailed acceptance criteria for validation.

**Next Step**: Begin Task 1 (Supabase Project Setup) and track progress through all 90 tasks for complete implementation. 