# PromptPerformanceStats Table Schema

<!--
  What: Canonical schema for the PromptPerformanceStats table — captures all prompt execution performance metrics, costs, and emotional context for analytics and optimization.
  Why: Enables performance analytics, cost control, emotional intelligence, and resilience. Central to prompt optimization, trust, and auditability.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** PromptPerformanceStats
- **Version:** v1.0.0
- **Purpose:** Captures all prompt execution performance metrics, costs, and emotional context for analytics and optimization.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name       | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|------------------|-----------|----------|-----------|---------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| statId           | ULID      | Yes      | —         | identity      | internal         | global        | Primary key for PromptPerformanceStats records.                          | Block record creation if missing. Audit trail required.|
| createdAt        | Timestamp | Yes      | now()     | traceability  | internal         | global        | Used for audit and recovery.                                            | Set to now() if missing. Audit trail required.         |
| updatedAt        | Timestamp | Yes      | now()     | traceability  | internal         | global        | Tracks last update for audit.                                           | Set to now() if missing. Audit trail required.         |
| promptId         | ULID      | Yes      | —         | traceability  | internal         | session       | Foreign key to PromptLogs.recordId for performance linkage.             | Block record creation if missing. Audit trail required.|
| promptType       | String    | Yes      | —         | clarity       | internal         | meta          | Type of prompt (e.g., businessPlan, socialContent, siteAudit).          | Block record creation if missing. Audit trail required.|
| executionTimeMs  | Number    | No       | null      | performance   | internal         | session       | Execution time in milliseconds for the prompt.                          | Allow null if not measured. Audit trail required.      |
| tokenCount       | Number    | No       | null      | efficiency    | internal         | session       | Number of tokens used in the prompt execution.                          | Allow null if not measured. Audit trail required.      |
| costUSD          | Number    | No       | 0.0       | cost          | internal         | session       | Cost in USD for the prompt execution.                                   | Set to 0.0 if missing. Audit trail required.           |
| successFlag      | Boolean   | No       | true      | outcome       | internal         | session       | Flag indicating if the prompt execution was successful.                 | Set to true if missing. Audit trail required.          |
| errorType        | String    | No       | null      | clarity       | internal         | session       | Type of error if execution failed (e.g., timeout, validation, fallback).| Allow null if no error. Audit trail required.          |
| resonanceScore   | Number    | No       | null      | empathy       | internal         | session       | Emotional resonance score (0.0–1.0) for the prompt output.              | Allow null if not measured. Audit trail required.      |
| clarityIndex     | Number    | No       | null      | clarity       | internal         | session       | Clarity score (0–10) for the prompt output.                             | Allow null if not measured. Audit trail required.      |
| auditTrail       | Object    | No       | {}        | traceability  | internal         | session       | Audit log for all changes and fallback events.                          | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** PromptLogs, analytics, cost control, and optimization engines
- **Feeds:** Performance analytics, cost control, emotional intelligence
- **Binds To:** All modules emitting or consuming prompt performance metadata
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for performance, clarity, empathy, or traceability
- **Fallback logic** is explicit and emotionally intelligent (never silent)
- **Audit trail** is mandatory for all changes and fallbacks
- **Codex enforcement** is non-negotiable: any drift, omission, or silent failure is logged and blocks progression

---

## Example Record
```json
{
  "statId": "01HQZK9Y6J8X2V7Q9B2F3G4H5PP",
  "createdAt": "2025-05-14T23:00:00Z",
  "updatedAt": "2025-05-14T23:00:00Z",
  "promptId": "01HQZK7Y6J8X2V7Q9B2F3G4H5J",
  "promptType": "businessPlan",
  "executionTimeMs": 1200,
  "tokenCount": 512,
  "costUSD": 0.012,
  "successFlag": true,
  "errorType": null,
  "resonanceScore": 0.92,
  "clarityIndex": 8,
  "auditTrail": { "events": ["created"] }
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 