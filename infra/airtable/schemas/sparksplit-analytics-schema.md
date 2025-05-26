# SparkSplitAnalytics Table Schema

<!--
  What: Canonical schema for SparkSplit Analytics — tracks trust transparency comparisons, user selections, and competitive advantage metrics.
  Why: Enables measurement of SparkSplit's revolutionary trust transparency impact, user education effectiveness, and competitive differentiation.
  How: Captures sterile vs CanAI comparisons, emotional compass data, user selections, and trust delta measurements.
-->

## Table Overview
- **Name:** SparkSplitAnalytics
- **Version:** v7.2.0
- **Purpose:** Tracks SparkSplit trust transparency sessions, user selections, and competitive advantage metrics
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name              | Type      | Required | Default   | Emotional Role    | Data Sensitivity | Context Scope | Description / Orchestration Notes                                 | Codex Enforcement                                      |
|------------------------|-----------|----------|-----------|------------------|------------------|---------------|-------------------------------------------------------------------|--------------------------------------------------------|
| recordId               | ULID      | Yes      | —         | identity         | internal         | global        | Primary key for SparkSplitAnalytics.                             | Block record creation if missing. Audit trail required.|
| createdAt              | Timestamp | Yes      | now()     | traceability     | internal         | global        | Used for audit and recovery.                                      | Set to now() if missing. Audit trail required.         |
| updatedAt              | Timestamp | Yes      | now()     | traceability     | internal         | global        | Timestamp for last update.                                        | Set to now() if missing. Audit trail required.         |
| sessionId              | String    | Yes      | —         | traceability     | internal         | session       | Foreign key to SessionAnalytics.sessionId for session linkage.   | Block record creation if missing. Audit trail required.|
| userId                 | String    | No       | null      | identity         | pii              | user          | User identifier for personalization tracking.                     | Allow null if anonymous. Audit trail required.         |
| promptType             | String    | Yes      | —         | context          | internal         | session       | Product type that triggered SparkSplit (business_plan, etc.).    | Block record creation if missing. Audit trail required.|
| comparisonId           | String    | Yes      | —         | identity         | internal         | comparison    | Unique identifier for this SparkSplit comparison.                | Block record creation if missing. Audit trail required.|
| sterileOutput          | LongText  | Yes      | —         | comparison       | internal         | comparison    | The emotionally neutral AI output for comparison.                | Block record creation if missing. Audit trail required.|
| canaiOutput            | LongText  | Yes      | —         | comparison       | internal         | comparison    | The emotionally enriched CanAI output for comparison.            | Block record creation if missing. Audit trail required.|
| trustDelta             | Number    | Yes      | 0.0       | trust            | internal         | comparison    | Calculated trust improvement score (0.0-5.0).                    | Set to 0.0 if missing. Audit trail required.           |
| aweScore               | Number    | No       | null      | emotion          | internal         | comparison    | Emotional compass: Awe score (0.0-5.0).                          | Allow null if not calculated. Audit trail required.    |
| ownershipScore         | Number    | No       | null      | emotion          | internal         | comparison    | Emotional compass: Ownership score (0.0-5.0).                    | Allow null if not calculated. Audit trail required.    |
| wonderScore            | Number    | No       | null      | emotion          | internal         | comparison    | Emotional compass: Wonder score (0.0-5.0).                       | Allow null if not calculated. Audit trail required.    |
| calmScore              | Number    | No       | null      | emotion          | internal         | comparison    | Emotional compass: Calm score (0.0-5.0).                         | Allow null if not calculated. Audit trail required.    |
| powerScore             | Number    | No       | null      | emotion          | internal         | comparison    | Emotional compass: Power score (0.0-5.0).                        | Allow null if not calculated. Audit trail required.    |
| userSelection          | String    | No       | null      | choice           | internal         | comparison    | User's choice: 'sterile', 'canai', 'both', 'neither', 'skip'.   | Allow null if not selected. Audit trail required.      |
| selectionTimestamp     | Timestamp | No       | null      | timing           | internal         | comparison    | When user made their selection.                                   | Allow null if not selected. Audit trail required.      |
| timeToSelection        | Number    | No       | null      | engagement       | internal         | comparison    | Time in seconds from display to selection.                       | Allow null if not selected. Audit trail required.      |
| userFeedback           | LongText  | No       | null      | feedback         | internal         | comparison    | Optional user feedback about the comparison.                      | Allow null if not provided. Audit trail required.      |
| wouldRefer             | Boolean   | No       | null      | advocacy         | internal         | comparison    | Whether user would refer others based on this experience.        | Allow null if not asked. Audit trail required.         |
| sharedOutput           | Boolean   | No       | false     | viral            | internal         | comparison    | Whether user shared their output.                                 | Set to false if missing. Audit trail required.         |
| circuitBreakerTriggered| Boolean   | No       | false     | protection       | internal         | comparison    | Whether circuit breaker prevented SparkSplit display.            | Set to false if missing. Audit trail required.         |
| fallbackTriggered      | Boolean   | No       | false     | resilience       | internal         | comparison    | Whether fallback logic was triggered.                            | Set to false if missing. Audit trail required.         |
| competitiveAdvantage   | Number    | No       | null      | business         | internal         | comparison    | Calculated competitive advantage score (0.0-10.0).               | Allow null if not calculated. Audit trail required.    |
| trustTransparencyScore | Number    | No       | null      | transparency     | internal         | comparison    | Score for trust transparency effectiveness (0.0-10.0).           | Allow null if not calculated. Audit trail required.    |
| emotionalEducationScore| Number    | No       | null      | education        | internal         | comparison    | Score for emotional intelligence education impact (0.0-10.0).    | Allow null if not calculated. Audit trail required.    |
| auditTrail             | Object    | No       | {}        | traceability     | internal         | session       | Audit log for all changes and fallback events.                   | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** SparkSplit engine, competitive analysis, trust transparency reporting
- **Feeds:** Trust transparency dashboards, competitive advantage metrics, user education analytics
- **Binds To:** SessionAnalytics, PromptLogs, UserContext, and SparkSplit engine components
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for trust, transparency, education, competition, or advocacy
- **Fallback logic** is explicit and emotionally intelligent (never silent)
- **Audit trail** is mandatory for all changes and fallbacks
- **Codex enforcement** is non-negotiable: any drift, omission, or silent failure is logged and blocks progression

---

## Example Record
```json
{
  "recordId": "01HQXYZ123456789ABCDEF",
  "createdAt": "2025-01-27T14:30:00.000Z",
  "updatedAt": "2025-01-27T14:35:00.000Z",
  "sessionId": "session_abc123",
  "userId": "user_xyz789",
  "promptType": "business_plan",
  "comparisonId": "sparksplit_comp_001",
  "sterileOutput": "Here is a business plan for your coffee brand...",
  "canaiOutput": "Your vision for a coffee brand that speaks to busy professionals...",
  "trustDelta": 2.3,
  "aweScore": 4.2,
  "ownershipScore": 4.8,
  "wonderScore": 3.9,
  "calmScore": 4.1,
  "powerScore": 4.5,
  "userSelection": "canai",
  "selectionTimestamp": "2025-01-27T14:33:00.000Z",
  "timeToSelection": 45,
  "userFeedback": "The CanAI version understood my vision better",
  "wouldRefer": true,
  "sharedOutput": true,
  "circuitBreakerTriggered": false,
  "fallbackTriggered": false,
  "competitiveAdvantage": 8.7,
  "trustTransparencyScore": 9.2,
  "emotionalEducationScore": 8.9,
  "auditTrail": {
    "created": "2025-01-27T14:30:00.000Z",
    "events": []
  }
}
``` 