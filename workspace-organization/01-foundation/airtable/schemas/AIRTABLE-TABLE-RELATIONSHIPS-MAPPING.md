# Airtable Table Relationships & Linkages - CanAI Emotional Intelligence Platform

**Base ID:** `apph8yM7gVc9QBFtx`  
**Extracted:** 2025-05-30T19:32:48.581Z  
**Total Relationships:** 47  
**Relationship Types:** Linked Records (36) + Rollup Fields (11)  

## 🔗 Executive Summary

Your Airtable base has a **sophisticated relational architecture** with 47 relationships connecting 18 tables. The relationships form a hub-and-spoke pattern centered around **SessionAnalytics** as the primary hub, with extensive cross-referencing for emotional intelligence tracking and trust measurement.

---

## 🏗️ Relationship Architecture Overview

### **Central Hub: SessionAnalytics**
The `SessionAnalytics` table serves as the primary hub with **10 outbound linked record fields** connecting to:
- User → UserContext
- PromptLogs → PromptLogs  
- SparkSplitAnalytics → SparkSplitAnalytics
- GoldmineOutput → GoldmineOutput
- EmotionalIntelligence → EmotionalIntelligence
- TrustMetrics → TrustMetrics
- PerformanceMetrics → PerformanceMetrics
- WebhookLogs → WebhookLogs
- ErrorLogs → ErrorLogs
- ProcessingResults → ProcessingResults

### **Secondary Hubs:**
- **UserContext** - 5 linked record fields (user-centric data)
- **PromptLogs** - 3 linked record fields (prompt execution tracking)
- **PromptTypes** - 2 linked record fields (prompt definitions)

---

## 📊 Detailed Relationship Mapping

### **TIER 1: Core Analytics Relationships**

#### **SessionAnalytics** (Central Hub - 13 relationships)
**Outbound Linked Records (10):**
- `User` → **UserContext** - User profile linkage
- `PromptLogs` → **PromptLogs** - Session prompt tracking
- `SparkSplitAnalytics` → **SparkSplitAnalytics** - A/B testing data
- `GoldmineOutput` → **GoldmineOutput** - High-value outputs
- `EmotionalIntelligence` → **EmotionalIntelligence** - Emotional tracking
- `TrustMetrics` → **TrustMetrics** - Trust measurements
- `PerformanceMetrics` → **PerformanceMetrics** - Performance data
- `WebhookLogs` → **WebhookLogs** - Webhook delivery
- `ErrorLogs` → **ErrorLogs** - Error tracking
- `ProcessingResults` → **ProcessingResults** - Processing pipeline

**Rollup Fields (3):**
- `Total Prompts` (rollup) ← **PromptLogs** - Aggregate prompt count
- `Average Trust Score` (rollup) ← **PromptLogs** - Trust score aggregation
- `Total Cost` (rollup) ← **PromptLogs** - Cost aggregation

#### **PromptLogs** (3 relationships)
**Outbound Linked Records (3):**
- `Session` → **SessionAnalytics** - Session correlation
- `UserContext` → **UserContext** - User context linkage
- `PromptTypes` → **PromptTypes** - Prompt type definition

#### **SparkSplitAnalytics** (1 relationship)
**Outbound Linked Records (1):**
- `Session` → **SessionAnalytics** - Session correlation

---

### **TIER 2: Intelligence & User Data Relationships**

#### **UserContext** (10 relationships)
**Outbound Linked Records (5):**
- `SessionAnalytics` → **SessionAnalytics** - User sessions
- `PromptLogs` → **PromptLogs** - User prompts
- `GoldmineOutput` → **GoldmineOutput** - User outputs
- `EmotionalIntelligence` → **EmotionalIntelligence** - User emotions
- `TrustMetrics` → **TrustMetrics** - User trust data

**Rollup Fields (5):**
- `Total Sessions Calculated` (rollup) ← **SessionAnalytics** - Session count
- `Average Session Duration` (rollup) ← **SessionAnalytics** - Duration metrics
- `Total Prompts Created` (rollup) ← **PromptLogs** - Prompt count
- `Average Trust Score Calculated` (rollup) ← **PromptLogs** - Trust aggregation
- `Total Spend` (rollup) ← **PromptLogs** - Cost aggregation

#### **EmotionalIntelligence** (2 relationships)
**Outbound Linked Records (2):**
- `Session` → **SessionAnalytics** - Session correlation
- `User` → **UserContext** - User correlation

#### **TrustMetrics** (2 relationships)
**Outbound Linked Records (2):**
- `Session` → **SessionAnalytics** - Session correlation
- `User` → **UserContext** - User correlation

#### **GoldmineOutput** (2 relationships)
**Outbound Linked Records (2):**
- `Session` → **SessionAnalytics** - Session correlation
- `User` → **UserContext** - User correlation

---

### **TIER 3: System Infrastructure Relationships**

#### **PerformanceMetrics** (1 relationship)
**Outbound Linked Records (1):**
- `Session` → **SessionAnalytics** - Session correlation

#### **ErrorLogs** (1 relationship)
**Outbound Linked Records (1):**
- `Session` → **SessionAnalytics** - Session correlation

#### **ProcessingResults** (1 relationship)
**Outbound Linked Records (1):**
- `Session` → **SessionAnalytics** - Session correlation

#### **WebhookLogs** (1 relationship)
**Outbound Linked Records (1):**
- `Session` → **SessionAnalytics** - Session correlation

#### **SystemHealth** (1 relationship)
**Outbound Linked Records (1):**
- `Component Config` → **SystemConfigs** - Configuration linkage

#### **AirtableSync** (1 relationship)
**Outbound Linked Records (1):**
- `Source Table Ref` → **SystemConfigs** - Configuration reference

---

### **TIER 4: Reference Data Relationships**

#### **PromptTypes** (5 relationships)
**Outbound Linked Records (2):**
- `PromptLogs` → **PromptLogs** - Prompt instances
- `AnalyticsAggregates` → **AnalyticsAggregates** - Analytics data

**Rollup Fields (3):**
- `Total Usage Count` (rollup) ← **PromptLogs** - Usage statistics
- `Average Trust Score` (rollup) ← **PromptLogs** - Trust metrics
- `Average Cost Per Use` (rollup) ← **PromptLogs** - Cost metrics

#### **SystemConfigs** (2 relationships)
**Outbound Linked Records (2):**
- `AirtableSync` → **AirtableSync** - Sync operations
- `SystemHealth` → **SystemHealth** - Health monitoring

#### **AnalyticsAggregates** (1 relationship)
**Outbound Linked Records (1):**
- `Prompt Type Ref` → **PromptTypes** - Prompt type reference

#### **EmotionalStates** (0 relationships)
**Status:** Reference table with no direct linkages

#### **TrustFactors** (0 relationships)
**Status:** Reference table with no direct linkages

---

## 🔄 Data Flow Patterns

### **1. Session-Centric Flow**
```
SessionAnalytics (Hub)
├── User → UserContext
├── PromptLogs → PromptLogs
├── SparkSplitAnalytics → SparkSplitAnalytics
├── EmotionalIntelligence → EmotionalIntelligence
├── TrustMetrics → TrustMetrics
├── PerformanceMetrics → PerformanceMetrics
├── GoldmineOutput → GoldmineOutput
├── WebhookLogs → WebhookLogs
├── ErrorLogs → ErrorLogs
└── ProcessingResults → ProcessingResults
```

### **2. User-Centric Flow**
```
UserContext
├── SessionAnalytics (bidirectional)
├── PromptLogs (bidirectional)
├── EmotionalIntelligence (bidirectional)
├── TrustMetrics (bidirectional)
└── GoldmineOutput (bidirectional)
```

### **3. Prompt-Centric Flow**
```
PromptTypes
├── PromptLogs → SessionAnalytics
└── AnalyticsAggregates
```

### **4. Configuration Flow**
```
SystemConfigs
├── AirtableSync
└── SystemHealth
```

---

## 📈 Rollup Field Analytics

### **Aggregation Patterns**
Your base uses **11 rollup fields** for real-time analytics:

#### **SessionAnalytics Rollups (3)**
- `Total Prompts` ← PromptLogs
- `Average Trust Score` ← PromptLogs  
- `Total Cost` ← PromptLogs

#### **UserContext Rollups (5)**
- `Total Sessions Calculated` ← SessionAnalytics
- `Average Session Duration` ← SessionAnalytics
- `Total Prompts Created` ← PromptLogs
- `Average Trust Score Calculated` ← PromptLogs
- `Total Spend` ← PromptLogs

#### **PromptTypes Rollups (3)**
- `Total Usage Count` ← PromptLogs
- `Average Trust Score` ← PromptLogs
- `Average Cost Per Use` ← PromptLogs

---

## 🎯 Key Insights

### **1. Hub-and-Spoke Architecture**
- **SessionAnalytics** is the central hub with 10 outbound connections
- **UserContext** is a secondary hub with 5 outbound connections
- Most tables connect back to these central hubs

### **2. Bidirectional Relationships**
Many relationships are bidirectional, creating a web of interconnected data:
- SessionAnalytics ↔ UserContext
- SessionAnalytics ↔ PromptLogs
- UserContext ↔ EmotionalIntelligence
- UserContext ↔ TrustMetrics

### **3. Real-Time Analytics**
11 rollup fields provide real-time aggregations across:
- Session metrics
- User lifetime value
- Prompt performance
- Trust scoring
- Cost tracking

### **4. Emotional Intelligence Tracking**
Sophisticated emotional tracking with dedicated relationships:
- EmotionalIntelligence → Session + User
- TrustMetrics → Session + User
- SparkSplitAnalytics → Session

### **5. System Observability**
Complete system monitoring through linked relationships:
- PerformanceMetrics → Session
- ErrorLogs → Session
- WebhookLogs → Session
- SystemHealth → Configuration

---

## 🔧 Integration Implications

### **Primary Data Entry Points**
1. **SessionAnalytics** - Start new sessions
2. **PromptLogs** - Log prompt executions
3. **UserContext** - Manage user profiles

### **Cascade Effects**
When creating records, consider cascade relationships:
- New Session → Creates links to User, Prompts, Metrics
- New User → Links to Sessions, Prompts, Intelligence
- New Prompt → Links to Session, User, Type

### **Query Optimization**
For efficient queries, leverage the hub structure:
- Query SessionAnalytics to get complete session view
- Query UserContext to get complete user profile
- Use rollup fields for aggregated metrics

---

## 🚀 Recommendations

### **1. Data Integrity**
- Ensure SessionAnalytics records are created first
- Maintain UserContext as the authoritative user source
- Use PromptTypes for consistent prompt categorization

### **2. Performance Optimization**
- Index frequently queried linked record fields
- Monitor rollup field calculation performance
- Consider caching for complex relationship queries

### **3. Analytics Enhancement**
- Leverage the rich relationship structure for advanced analytics
- Use rollup fields for real-time dashboards
- Implement trend analysis across linked data

This relationship mapping reveals a sophisticated, well-architected emotional intelligence platform with comprehensive data linkages supporting advanced analytics and user tracking. 