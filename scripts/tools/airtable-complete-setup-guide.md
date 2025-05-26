# 🚀 CanAI Airtable Complete Setup Guide

## 📋 **OVERVIEW**
This guide will help you create all 35+ CanAI tables in Airtable and set up automated data collection.

**Status**: ✅ Infrastructure validated, ready for table creation

---

## 🎯 **PHASE 1: CORE TABLES (PRIORITY)**

### **Table 1: PromptLogs** 
*The heart of CanAI's emotional intelligence*

**Create in Airtable Interface:**
1. Go to your base: `https://airtable.com/apph8yM7gVc9QBFtx`
2. Click "Add Table" → Name: `PromptLogs`
3. Add these fields:

| Field Name | Type | Options/Description |
|------------|------|-------------------|
| recordId | Single line text | Primary key |
| createdAt | Date and time | Include time |
| updatedAt | Date and time | Include time |
| sessionId | Single line text | Session correlation |
| userId | Single line text | User identifier |
| promptType | Single select | ai_blueprint, business_plan, email_campaign, site_audit, social_content, reverse_strategy, ai_brand_identity, profile_makeover, blogblitz, ad_amplify |
| intent | Single line text | User's stated intent |
| inputs | Long text | Raw user inputs JSON |
| outputs | Long text | Generated outputs |
| trustFallbackUsed | Checkbox | Whether fallback triggered |
| clarityIndex | Number | Integer, 0-10 |
| resonanceScore | Number | Decimal, 0.00-1.00 |
| momentumScore | Number | Decimal, 0.00-1.00 |
| deliveryCost | Number | Decimal, USD cost |
| industry | Single line text | User's industry |
| audience | Single line text | Target audience |
| goal | Single line text | User's goal |
| tone | Single line text | Desired tone |
| customerContent | Long text | Customer-specific content |
| problemSolved | Long text | Problem being solved |
| differentiator | Long text | Key differentiator |
| founderBio | Long text | Founder biography |
| customerPain | Long text | Customer pain points |
| trustSignal | Long text | Trust building elements |

---

### **Table 2: SparkSplitAnalytics**
*Revolutionary trust transparency engine*

**Create in Airtable Interface:**
1. Add Table → Name: `SparkSplitAnalytics`
2. Add these fields:

| Field Name | Type | Options/Description |
|------------|------|-------------------|
| recordId | Single line text | Primary key |
| createdAt | Date and time | Include time |
| updatedAt | Date and time | Include time |
| sessionId | Single line text | Session correlation |
| promptLogId | Single line text | Link to PromptLogs |
| comparisonId | Single line text | Unique comparison ID |
| sterileOutput | Long text | Sterile AI output |
| canaiOutput | Long text | CanAI enriched output |
| userSelection | Single select | sterile, canai, both, neither, skip |
| selectionTimestamp | Date and time | When user decided |
| timeToSelection | Number | Decimal, seconds |
| trustDelta | Number | Decimal, trust improvement |
| aweScore | Number | Decimal, emotional compass |
| ownershipScore | Number | Decimal, emotional compass |
| wonderScore | Number | Decimal, emotional compass |
| calmScore | Number | Decimal, emotional compass |
| powerScore | Number | Decimal, emotional compass |

---

### **Table 3: SessionAnalytics**
*Session-level emotional intelligence*

**Create in Airtable Interface:**
1. Add Table → Name: `SessionAnalytics`
2. Add these fields:

| Field Name | Type | Options/Description |
|------------|------|-------------------|
| recordId | Single line text | Primary key |
| createdAt | Date and time | Include time |
| updatedAt | Date and time | Include time |
| sessionId | Single line text | Session correlation |
| userId | Single line text | User identifier |
| sessionDuration | Number | Integer, seconds |
| promptCount | Number | Integer, prompts in session |
| emotionalTrajectory | Long text | Emotional journey mapping |
| frictionPoints | Multiple select | loading_delay, unclear_prompt, unexpected_output, navigation_confusion, trust_hesitation, emotional_disconnect |
| outcomeType | Single select | completed, abandoned, converted, referred, trust_breakthrough |
| trustScore | Number | Decimal, 0.00-5.00 |
| emotionalDepth | Number | Decimal, engagement depth |
| sessionMomentum | Number | Decimal, momentum score |

---

### **Table 4: UserContext**
*Deep user intelligence and emotional profiling*

**Create in Airtable Interface:**
1. Add Table → Name: `UserContext`
2. Add these fields:

| Field Name | Type | Options/Description |
|------------|------|-------------------|
| recordId | Single line text | Primary key |
| createdAt | Date and time | Include time |
| updatedAt | Date and time | Include time |
| userId | Single line text | User identifier |
| userEmail | Email | User email address |
| industryFocus | Multiple select | SaaS, E-commerce, Consulting, Healthcare, Education, Finance, Real Estate, Manufacturing, Creative Services, Non-profit |
| communicationStyle | Single select | direct, collaborative, analytical, creative, empathetic, results_focused |
| emotionalProfile | Long text | Emotional intelligence profile |
| preferredTone | Single select | professional, friendly, authoritative, empowering, conversational, inspiring |
| culturalContext | Single line text | Cultural background |
| cognitiveTraits | Multiple select | detail_oriented, big_picture, analytical, intuitive, systematic, creative, logical, emotional |

---

### **Table 5: OutputGoldmine**
*Reusable intelligence and compound value*

**Create in Airtable Interface:**
1. Add Table → Name: `OutputGoldmine`
2. Add these fields:

| Field Name | Type | Options/Description |
|------------|------|-------------------|
| recordId | Single line text | Primary key |
| createdAt | Date and time | Include time |
| updatedAt | Date and time | Include time |
| outputHash | Single line text | Content hash for deduplication |
| promptType | Single line text | Source prompt type |
| outputContent | Long text | Reusable output content |
| industryCluster | Single select | SaaS, E-commerce, Consulting, Healthcare, Education, Finance, Creative, B2B Services, Consumer Products, Technology |
| reusePotential | Number | Decimal, 0-10 reusability score |
| compoundValue | Number | Decimal, compound intelligence |
| emotionalResonance | Number | Decimal, emotional impact |
| usageCount | Number | Integer, times reused |
| monetizationPotential | Number | Decimal, revenue potential |

---

## 🔧 **PHASE 2: AUTOMATED VALIDATION**

After creating the tables manually, run this validation script:

```bash
cd scripts/tools
npx ts-node airtable-connection-test.ts
```

This will:
- ✅ Confirm all tables are accessible
- ✅ Test field structure
- ✅ Validate permissions
- ✅ Create sample records

---

## 🚀 **PHASE 3: ADDITIONAL TABLES**

### **Support Tables** (Create these next):

6. **FeedbackLogs** - User feedback and delta tracking
7. **DeliveryCostLogs** - Cost and performance tracking  
8. **ReferralTriggers** - Referral trigger events
9. **AIMiningAgents** - AI pattern detection
10. **FieldGlossary** - Field definitions and metadata
11. **SchemaEvents** - Schema change tracking

### **Advanced Intelligence Tables** (Phase 2):

12. **EmotionalCompass** - Emotional state tracking
13. **TrustMetrics** - Trust building analytics
14. **PersonaCluster** - User persona intelligence
15. **ContentOptimization** - Content performance data
16. **PredictiveInsights** - Predictive analytics
17. **CompetitiveIntel** - Market intelligence
18. **RevenueAttribution** - Revenue tracking
19. **CustomerJourney** - Journey mapping
20. **BrandResonance** - Brand impact metrics

---

## 🎯 **PHASE 4: INTEGRATION SCRIPTS**

Once tables are created, these scripts will handle data flow:

### **Data Collection Scripts:**
- `prompt-logger.ts` - Logs all prompt interactions
- `session-tracker.ts` - Tracks session analytics
- `sparksplit-collector.ts` - Collects trust comparisons
- `feedback-processor.ts` - Processes user feedback

### **Intelligence Scripts:**
- `goldmine-analyzer.ts` - Analyzes reusable content
- `pattern-detector.ts` - Detects usage patterns
- `trust-calculator.ts` - Calculates trust scores
- `emotional-profiler.ts` - Builds emotional profiles

### **Reporting Scripts:**
- `dashboard-generator.ts` - Generates analytics dashboards
- `insight-reporter.ts` - Creates insight reports
- `performance-monitor.ts` - Monitors system performance

---

## 📊 **EXPECTED OUTCOMES**

After completing this setup:

✅ **35+ Tables** - Complete data infrastructure
✅ **Real-time Analytics** - Live emotional intelligence tracking
✅ **Trust Transparency** - SparkSplit comparison engine
✅ **Compound Intelligence** - Reusable content goldmine
✅ **Predictive Insights** - User behavior prediction
✅ **Revenue Attribution** - Direct ROI tracking

---

## 🚨 **CRITICAL SUCCESS FACTORS**

1. **Field Naming**: Use exact field names as specified
2. **Data Types**: Match data types precisely
3. **Select Options**: Include all select options listed
4. **Validation**: Run connection test after each table
5. **Permissions**: Ensure API token has full access

---

## 🎯 **NEXT STEPS**

1. **Start with Table 1** (PromptLogs) - Most critical
2. **Validate immediately** - Run connection test
3. **Add Table 2** (SparkSplitAnalytics) - Trust engine
4. **Continue sequentially** - Build momentum
5. **Test integration** - Ensure data flows correctly

---

## 💡 **PRO TIPS**

- **Copy field names exactly** - Avoid typos that break automation
- **Test after each table** - Catch issues early
- **Use consistent naming** - Follow the exact patterns
- **Document changes** - Track any modifications
- **Backup regularly** - Protect your work

---

## 🔗 **QUICK LINKS**

- **Your Base**: https://airtable.com/apph8yM7gVc9QBFtx
- **Connection Test**: `scripts/tools/airtable-connection-test.ts`
- **Table Definitions**: `airtable-table-definitions.json`
- **Setup Guide**: This document

---

*Ready to build the most emotionally intelligent business platform ever created!* 🚀 