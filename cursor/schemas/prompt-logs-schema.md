# PromptLogs Table Schema (Codex v6.1.4)

<!--
  What: Canonical schema for the PromptLogs table — captures every GPT interaction, prompt session, fallback trigger, revision, and outcome.
  Why: Enables analytics, QA, personalization, cost tracking, and continuous system evolution. Central to CanAI's orchestration and memory.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** PromptLogs
- **Version:** v6.1.4
- **Purpose:** Tracks all prompt invocations, session context, model usage, outcomes, and emotional signals for analytics, QA, and orchestration.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name               | Type      | Required | Default        | Emotional Role   | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|-------------------------|-----------|----------|----------------|------------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| recordId                | ULID      | Yes      | —              | identity         | internal         | global        | Primary key for PromptLogs records.                                      | Block record creation if missing. Audit trail required.|
| createdAt               | Timestamp | Yes      | now()          | traceability     | internal         | global        | Timestamp for record creation.                                           | Set to now() if missing. Audit trail required.         |
| updatedAt               | Timestamp | Yes      | now()          | traceability     | internal         | global        | Timestamp for last update.                                               | Set to now() if missing. Audit trail required.         |
| sessionId               | String    | Yes      | —              | context          | internal         | session       | Session identifier for prompt grouping.                                  | Block record creation if missing. Audit trail required.|
| userId                  | String    | No       | null           | identity         | pii              | user          | User identifier for personalization and analytics.                       | Allow null if system-generated. Audit trail required.  |
| promptType              | String    | Yes      | —              | clarity          | internal         | session       | Type of prompt (e.g., businessPlan, socialContent, siteAudit).           | Block record creation if missing. Audit trail required.|
| modelUsed               | String    | No       | null           | traceability     | internal         | session       | LLM or engine used for this prompt.                                      | Allow null if unknown. Audit trail required.           |
| tokensUsed              | Number    | No       | 0              | efficiency       | internal         | session       | Number of tokens used for this prompt.                                   | Set to 0 if missing. Audit trail required.             |
| revisionCount           | Number    | No       | 0              | traceability     | internal         | session       | Number of revisions for this prompt.                                     | Set to 0 if missing. Audit trail required.             |
| outputDeltaScore        | Number    | No       | null           | clarity          | internal         | session       | Score representing change between prompt outputs (if applicable).        | Allow null if not applicable. Audit trail required.    |
| resonanceScore          | Number    | No       | null           | empathy          | internal         | session       | Emotional resonance score for the prompt.                                | Allow null if not available. Audit trail required.     |
| fallbackTriggered       | Boolean   | No       | false          | resilience       | internal         | session       | Indicates if fallback logic was triggered for this prompt.               | Set to false if missing. Audit trail required.         |
| finalOutputApproved     | Boolean   | No       | false          | trust            | internal         | session       | Flag if the final output was approved by user or system.                 | Set to false if missing. Audit trail required.         |
| executionTimeMs         | Number    | No       | null           | efficiency       | internal         | session       | Execution time in milliseconds for the prompt.                           | Allow null if not measured. Audit trail required.      |
| frustrationFlag         | Boolean   | No       | false          | emotion          | internal         | session       | Flag if user/system detected frustration in the session.                 | Set to false if missing. Audit trail required.         |
| delightFlag             | Boolean   | No       | false          | emotion          | internal         | session       | Flag if user/system detected delight in the session.                     | Set to false if missing. Audit trail required.         |
| confidenceLevel         | Number    | No       | null           | clarity          | internal         | session       | Confidence level in the prompt output (0.0–1.0).                         | Allow null if not available. Audit trail required.     |
| emotionalAlignment      | String    | No       | null           | emotion          | internal         | session       | Alignment of output with intended emotional tone.                        | Allow null if not measured. Audit trail required.      |
| promptQualityScore      | Number    | No       | null           | quality          | internal         | session       | Analytical score for prompt quality.                                     | Allow null if not available. Audit trail required.     |
| changeRate              | Number    | No       | null           | traceability     | internal         | session       | Rate of change between prompt revisions.                                 | Allow null if not measured. Audit trail required.      |
| variantIndex            | Number    | No       | null           | context          | internal         | session       | Index of the prompt variant (if A/B or multi-variant).                   | Allow null if not measured. Audit trail required.      |
| suggestedImprovement    | String    | No       | null           | improvement      | internal         | session       | Suggested improvement for future prompts.                                | Allow null if not available. Audit trail required.     |
| auditTrail              | Object    | No       | {}             | traceability     | internal         | session       | Audit log for all changes and fallback events.                           | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** Analytics, QA, personalization, cost tracking, revision history, and system evolution
- **Feeds:** Session analytics, feedback logs, cost anomaly triggers, revision meta, and emotional intelligence modules
- **Binds To:** UserContext, SessionAnalytics, FeedbackLogs, CostAnomalyTriggers, and orchestration engines
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for clarity, trust, emotion, resilience, or improvement
- **Fallback logic** is explicit and emotionally intelligent (never silent)
- **Audit trail** is mandatory for all changes and fallbacks
- **Codex enforcement** is non-negotiable: any drift, omission, or silent failure is logged and blocks progression

---

## Example Record
```json
{
  "recordId": "01HQZK7Y8J9X4V2QW3R5T6U7P1",
  "createdAt": "2025-05-15T12:00:00Z",
  "updatedAt": "2025-05-15T12:01:00Z",
  "sessionId": "session_abc123",
  "userId": "user_12345",
  "promptType": "businessPlan",
  "modelUsed": "gpt-4o",
  "tokensUsed": 512,
  "revisionCount": 2,
  "outputDeltaScore": 0.8,
  "resonanceScore": 0.92,
  "fallbackTriggered": false,
  "finalOutputApproved": true,
  "executionTimeMs": 1200,
  "frustrationFlag": false,
  "delightFlag": true,
  "confidenceLevel": 0.95,
  "emotionalAlignment": "optimistic",
  "promptQualityScore": 0.88,
  "changeRate": 0.1,
  "variantIndex": 1,
  "suggestedImprovement": "Increase clarity in industry description.",
  "auditTrail": { "createdBy": "system", "events": [ { "type": "creation", "timestamp": "2025-05-15T12:00:00Z" } ] }
}
```

---

<!--
  Codex Principle: Every prompt is a heartbeat. Every log is a memory. Every fallback is a hand extended in trust.
--> 