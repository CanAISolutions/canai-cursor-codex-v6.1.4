# PromptLogs Table Schema

<!--
  What: Canonical schema for the PromptLogs table — the central log for all prompt invocations, intent, input, fallback, and Codex enforcement events.
  Why: Serves as the backbone for orchestration, analytics, emotional memory, and trust validation across CanAI.
  How: Modular, emotionally annotated, and Codex-enforced structure. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** PromptLogs
- **Version:** v1.0.0
- **Purpose:** Tracks every prompt event, input, fallback, and Codex enforcement signal. Enables analytics, recovery, and emotional intelligence.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name           | Type       | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes | Codex Enforcement |
|---------------------|------------|----------|-----------|---------------|------------------|---------------|-------------------------------|-------------------|
| recordId            | ULID       | Yes      | —         | identity      | internal         | global        | Primary key, referenced by all related tables. | Block record creation if missing. Audit trail required. |
| createdAt           | Timestamp  | Yes      | now()     | traceability  | internal         | global        | Used for audit and recovery. | Set to now() if missing. Audit trail required. |
| updatedAt           | Timestamp  | Yes      | now()     | traceability  | internal         | global        | Tracks last update for audit. | Set to now() if missing. Audit trail required. |
| intent              | String     | Yes      | —         | clarity       | internal         | session       | Describes user/system intent for the prompt. | Log as 'unknown' and flag for review. Audit trail required. |
| inputs              | Object     | Yes      | {}        | context       | pii              | session       | All user/system input fields for the prompt. | Log as empty object and flag for review. Audit trail required. |
| trustFallbackUsed   | Boolean    | Yes      | false     | trust         | internal         | session       | Indicates if fallback logic was triggered. | Set to false if missing. Audit trail required. |
| clarityIndex        | Number     | Yes      | 5         | clarity       | internal         | session       | Clarity score for the prompt (0–10). | Set to 5 if missing and log fallback event. Audit trail required. |
| resonanceScore      | Number     | Yes      | 0.5       | empathy       | internal         | session       | Emotional impact score (0.0–1.0). | Set to 0.5 if missing and log fallback event. Audit trail required. |
| momentumScore       | Number     | Yes      | 0.5       | momentum      | internal         | session       | Progress velocity score. | Set to 0.5 if missing and log fallback event. Audit trail required. |
| deliveryCost        | Number     | No       | 0.0       | cost          | internal         | session       | Webhook-computed delivery cost. | Set to 0.0 if missing. Audit trail required. |
| emotionTensor       | Object     | No       | {}        | emotion       | pii              | session       | Multi-dimensional emotion state (e.g., {hope: 0.7, doubt: 0.2}). | Set to empty object if missing. Audit trail required. |
| emotionTrendScore   | Number     | No       | 0.0       | emotion       | internal         | session       | Emotional trajectory score. | Set to 0.0 if missing. Audit trail required. |
| CanAIImpactScore    | Number     | No       | 0.0       | impact        | internal         | session       | Master KPI for prompt impact. | Set to 0.0 if missing. Audit trail required. |
| emotionChurnRisk    | Number     | No       | 0.0       | risk          | internal         | session       | Dropout prediction score. | Set to 0.0 if missing. Audit trail required. |
| cohortEmotionModel  | Object     | No       | {}        | cohort        | internal         | global        | Segment-level emotional trends. | Set to empty object if missing. Audit trail required. |

---

## Orchestration Mapping
- **Referenced By:** FeedbackLogs, SessionAnalytics, analytics dashboards, fallback and recovery modules
- **Feeds:** Trust, clarity, and emotional intelligence engines; audit and compliance logs
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for clarity, trust, empathy, or risk
- **Fallback logic** is explicit and emotionally intelligent (never silent)
- **Audit trail** is mandatory for all changes and fallbacks
- **Codex enforcement** is non-negotiable: any drift, omission, or silent failure is logged and blocks progression

---

## Example Record
```json
{
  "recordId": "01HQZK7Y6J8X2V7Q9B2F3G4H5J",
  "createdAt": "2025-05-14T00:00:00Z",
  "updatedAt": "2025-05-14T00:00:00Z",
  "intent": "generateBusinessPlan",
  "inputs": { "industry": "SaaS", "goal": "launch", "tone": "inspiring" },
  "trustFallbackUsed": false,
  "clarityIndex": 8,
  "resonanceScore": 0.92,
  "momentumScore": 0.85,
  "deliveryCost": 0.03,
  "emotionTensor": { "hope": 0.7, "doubt": 0.2 },
  "emotionTrendScore": 0.6,
  "CanAIImpactScore": 0.81,
  "emotionChurnRisk": 0.12,
  "cohortEmotionModel": { "segment": "early-stage", "trend": 0.7 }
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 