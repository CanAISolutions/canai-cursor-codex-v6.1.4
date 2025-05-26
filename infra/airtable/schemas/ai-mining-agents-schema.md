# AIMiningAgents Table Schema

<!--
  What: Canonical schema for AI Mining Agents — tracks automated pattern detection, content generation, and intelligence extraction from the Goldmine Layer.
  Why: Enables automated discovery of trends, breakout patterns, and monetization opportunities without manual analysis.
  How: Captures agent runs, detected patterns, generated insights, and automated actions for compound intelligence growth.
-->

## Table Overview
- **Name:** AIMiningAgents
- **Version:** v1.0.0
- **Purpose:** Tracks AI-powered mining agents that extract patterns and generate insights from accumulated data
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name              | Type      | Required | Default   | Emotional Role    | Data Sensitivity | Context Scope | Description / Orchestration Notes                                 | Codex Enforcement                                      |
|------------------------|-----------|----------|-----------|------------------|------------------|---------------|-------------------------------------------------------------------|--------------------------------------------------------|
| recordId               | ULID      | Yes      | —         | identity         | internal         | global        | Primary key for AIMiningAgents.                                   | Block record creation if missing. Audit trail required.|
| createdAt              | Timestamp | Yes      | now()     | traceability     | internal         | global        | Used for audit and recovery.                                      | Set to now() if missing. Audit trail required.         |
| updatedAt              | Timestamp | Yes      | now()     | traceability     | internal         | global        | Timestamp for last update.                                        | Set to now() if missing. Audit trail required.         |
| agentType              | String    | Yes      | —         | categorization   | internal         | agent         | Type of mining agent: 'pattern_detector', 'trend_analyzer', etc. | Block record creation if missing. Audit trail required.|
| agentName              | String    | Yes      | —         | identity         | internal         | agent         | Human-readable name for the mining agent.                        | Block record creation if missing. Audit trail required.|
| runId                  | String    | Yes      | —         | identity         | internal         | run           | Unique identifier for this agent run.                            | Block record creation if missing. Audit trail required.|
| runTimestamp           | Timestamp | Yes      | now()     | timing           | internal         | run           | When this agent run was executed.                                 | Set to now() if missing. Audit trail required.         |
| dataSourceTables       | Array     | Yes      | []        | scope            | internal         | run           | Tables analyzed in this run (e.g., ['OutputGoldmine', 'PromptLogs']). | Block record creation if empty. Audit trail required.|
| analysisTimeframe      | Object    | Yes      | {}        | scope            | internal         | run           | Time range analyzed (startDate, endDate).                        | Block record creation if empty. Audit trail required.  |
| recordsAnalyzed        | Number    | Yes      | 0         | scope            | internal         | run           | Number of records processed in this run.                         | Set to 0 if missing. Audit trail required.             |
| patternsDetected       | Array     | No       | []        | intelligence     | internal         | run           | Array of detected patterns with confidence scores.               | Set to empty array if missing. Audit trail required.   |
| trendsIdentified       | Array     | No       | []        | intelligence     | internal         | run           | Trending topics, industries, or concepts identified.             | Set to empty array if missing. Audit trail required.   |
| breakoutSignals        | Array     | No       | []        | opportunity      | internal         | run           | Sudden spikes or emerging patterns worth attention.              | Set to empty array if missing. Audit trail required.   |
| industryInsights       | Object    | No       | {}        | intelligence     | internal         | run           | Industry-specific insights and patterns.                         | Set to empty object if missing. Audit trail required.  |
| emotionalPatterns      | Object    | No       | {}        | emotion          | internal         | run           | Emotional resonance patterns across outputs.                     | Set to empty object if missing. Audit trail required.  |
| monetizationOpportunities | Array  | No       | []        | business         | internal         | run           | Identified opportunities for new products or bundles.            | Set to empty array if missing. Audit trail required.   |
| contentGenerated       | Object    | No       | {}        | creation         | internal         | run           | Auto-generated content assets from patterns.                     | Set to empty object if missing. Audit trail required.  |
| templatesCreated       | Array     | No       | []        | creation         | internal         | run           | New templates generated from high-performing outputs.            | Set to empty array if missing. Audit trail required.   |
| caseStudiesIdentified  | Array     | No       | []        | marketing        | internal         | run           | Potential case studies flagged for creation.                     | Set to empty array if missing. Audit trail required.   |
| followUpCampaigns      | Array     | No       | []        | growth           | internal         | run           | Suggested follow-up campaigns based on patterns.                 | Set to empty array if missing. Audit trail required.   |
| systemRecommendations  | Array     | No       | []        | improvement      | internal         | run           | Recommendations for system improvements.                          | Set to empty array if missing. Audit trail required.   |
| promptEvolutionSuggestions | Array | No       | []        | improvement      | internal         | run           | Suggestions for prompt improvements based on patterns.           | Set to empty array if missing. Audit trail required.   |
| confidenceScore        | Number    | Yes      | 0.0       | quality          | internal         | run           | Overall confidence in the analysis results (0.0-10.0).          | Set to 0.0 if missing. Audit trail required.           |
| executionTime          | Number    | Yes      | 0         | performance      | internal         | run           | Time taken to complete the analysis (seconds).                   | Set to 0 if missing. Audit trail required.             |
| resourcesUsed          | Object    | No       | {}        | performance      | internal         | run           | Resources consumed (tokens, API calls, compute time).            | Set to empty object if missing. Audit trail required.  |
| errorLog               | Array     | No       | []        | debugging        | internal         | run           | Any errors or warnings during execution.                         | Set to empty array if missing. Audit trail required.   |
| actionsTaken           | Array     | No       | []        | automation       | internal         | run           | Automated actions taken based on findings.                       | Set to empty array if missing. Audit trail required.   |
| humanReviewRequired    | Boolean   | No       | false     | oversight        | internal         | run           | Whether human review is needed for findings.                     | Set to false if missing. Audit trail required.         |
| reviewStatus           | String    | No       | 'pending' | oversight        | internal         | run           | Review status: 'pending', 'approved', 'rejected', 'modified'.   | Set to 'pending' if missing. Audit trail required.     |
| impactScore            | Number    | No       | 0.0       | business         | internal         | run           | Estimated business impact of findings (0.0-100.0).              | Set to 0.0 if missing. Audit trail required.           |
| nextRunScheduled       | Timestamp | No       | null      | scheduling       | internal         | agent         | When the next run of this agent is scheduled.                    | Allow null if not scheduled. Audit trail required.     |
| auditTrail             | Object    | No       | {}        | traceability     | internal         | run           | Audit log for all changes and fallback events.                   | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** Goldmine intelligence system, content generation, business intelligence
- **Feeds:** Pattern detection, trend analysis, automated content creation, system evolution
- **Binds To:** OutputGoldmine, PromptLogs, SessionAnalytics, SparkSplitAnalytics
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Mining Agent Types
- **Pattern Detector**: Identifies recurring patterns in outputs and user behavior
- **Trend Analyzer**: Detects emerging trends and breakout signals
- **Content Generator**: Auto-generates marketing content from successful outputs
- **Template Creator**: Converts high-performing outputs into reusable templates
- **Opportunity Finder**: Identifies monetization and follow-up opportunities
- **System Optimizer**: Suggests improvements to prompts and processes

---

## Example Record
```json
{
  "recordId": "01HQMINE123456789ABCDEF",
  "createdAt": "2025-01-27T02:00:00.000Z",
  "updatedAt": "2025-01-27T02:15:00.000Z",
  "agentType": "trend_analyzer",
  "agentName": "Industry Trend Detector v2.1",
  "runId": "run_trend_20250127_020000",
  "runTimestamp": "2025-01-27T02:00:00.000Z",
  "dataSourceTables": ["OutputGoldmine", "PromptLogs", "SessionAnalytics"],
  "analysisTimeframe": {
    "startDate": "2025-01-20T00:00:00.000Z",
    "endDate": "2025-01-27T00:00:00.000Z"
  },
  "recordsAnalyzed": 1247,
  "patternsDetected": [
    {
      "pattern": "sustainability_focus_increase",
      "confidence": 8.7,
      "description": "40% increase in sustainability-related requests in coffee/food industry",
      "impact": "high"
    }
  ],
  "trendsIdentified": [
    {
      "trend": "5_day_challenge_format",
      "industry": "beauty_wellness",
      "growth": 250,
      "confidence": 9.2
    }
  ],
  "breakoutSignals": [
    {
      "signal": "ai_transparency_demand",
      "strength": 8.9,
      "timeframe": "last_3_days",
      "description": "Sudden spike in requests for AI process transparency"
    }
  ],
  "industryInsights": {
    "coffee_retail": {
      "topConcerns": ["sustainability", "convenience", "premium_positioning"],
      "emergingTrends": ["subscription_models", "local_sourcing"],
      "averageResonance": 8.4
    }
  },
  "emotionalPatterns": {
    "high_resonance_combinations": [
      {
        "tone": "confident",
        "energy": "high",
        "style": "personal",
        "averageScore": 9.1
      }
    ]
  },
  "monetizationOpportunities": [
    {
      "opportunity": "sustainability_bundle",
      "description": "Bundle of sustainability-focused products",
      "estimatedDemand": 8.5,
      "targetIndustries": ["coffee_retail", "food_service"]
    }
  ],
  "contentGenerated": {
    "blogPosts": [
      {
        "title": "The Sustainability Revolution in Coffee: What Entrepreneurs Need to Know",
        "content": "[Generated content based on patterns...]",
        "targetAudience": "coffee_entrepreneurs"
      }
    ],
    "socialPosts": [
      {
        "platform": "twitter",
        "content": "🌱 40% of coffee entrepreneurs are now prioritizing sustainability. Here's why...",
        "hashtags": ["#SustainableBusiness", "#CoffeeEntrepreneur"]
      }
    ]
  },
  "templatesCreated": [
    {
      "templateName": "Sustainability-Focused Business Plan",
      "basedOnOutputs": ["01HQGOLD123", "01HQGOLD456"],
      "reusePotential": 9.3
    }
  ],
  "caseStudiesIdentified": [
    {
      "outputId": "01HQGOLD789",
      "title": "How One Coffee Brand Built Sustainability Into Their Core Strategy",
      "marketingPotential": 8.8
    }
  ],
  "followUpCampaigns": [
    {
      "campaignType": "email_sequence",
      "targetSegment": "coffee_entrepreneurs",
      "trigger": "completed_business_plan",
      "content": "sustainability_deep_dive"
    }
  ],
  "systemRecommendations": [
    {
      "type": "prompt_enhancement",
      "description": "Add sustainability questions to coffee industry prompts",
      "priority": "high",
      "estimatedImpact": 8.2
    }
  ],
  "promptEvolutionSuggestions": [
    {
      "promptType": "business_plan",
      "suggestion": "Include sustainability section for food/beverage industries",
      "confidence": 9.1
    }
  ],
  "confidenceScore": 8.9,
  "executionTime": 847,
  "resourcesUsed": {
    "gptTokens": 15420,
    "apiCalls": 23,
    "computeTime": 847
  },
  "errorLog": [],
  "actionsTaken": [
    {
      "action": "template_created",
      "details": "Sustainability Business Plan template generated",
      "timestamp": "2025-01-27T02:12:00.000Z"
    }
  ],
  "humanReviewRequired": true,
  "reviewStatus": "pending",
  "impactScore": 85.7,
  "nextRunScheduled": "2025-01-28T02:00:00.000Z",
  "auditTrail": {
    "created": "2025-01-27T02:00:00.000Z",
    "events": [
      {
        "action": "analysis_started",
        "timestamp": "2025-01-27T02:00:00.000Z"
      },
      {
        "action": "patterns_detected",
        "timestamp": "2025-01-27T02:08:00.000Z"
      },
      {
        "action": "content_generated",
        "timestamp": "2025-01-27T02:12:00.000Z"
      }
    ]
  }
}
``` 