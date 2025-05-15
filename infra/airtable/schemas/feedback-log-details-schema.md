# FeedbackLogDetails Table Schema

<!--
  What: Canonical schema for the FeedbackLogDetails table — captures all granular feedback details, emotional tags, and context for session feedback.
  Why: Enables feedback analytics, emotional intelligence, and resilience. Central to user experience, trust, and auditability.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** FeedbackLogDetails
- **Version:** v1.0.0
- **Purpose:** Captures all granular feedback details, emotional tags, and context for session feedback.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name     | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|---------------|-----------|----------|-----------|---------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| detailId      | ULID      | Yes      | —         | identity      | internal         | global        | Primary key for FeedbackLogDetails records.                              | Block record creation if missing. Audit trail required.|
| createdAt     | Timestamp | Yes      | now()     | traceability  | internal         | global        | Used for audit and recovery.                                            | Set to now() if missing. Audit trail required.         |
| updatedAt     | Timestamp | Yes      | now()     | traceability  | internal         | global        | Tracks last update for audit.                                           | Set to now() if missing. Audit trail required.         |
| feedbackId    | ULID      | Yes      | —         | traceability  | internal         | session       | Foreign key to FeedbackLogs.recordId for detail linkage.                | Block record creation if missing. Audit trail required.|
| detailType    | String    | Yes      | —         | clarity       | internal         | meta          | Type of feedback detail (e.g., suggestion, bug, compliment, confusion, request). | Block record creation if missing. Audit trail required.|
| detailText    | String    | No       | ""        | context       | pii              | session       | Text of the feedback detail. May contain PII or sensitive context.      | Allow empty string if missing. Audit trail required.   |
| emotionalTags | Array     | No       | []        | emotion       | internal         | session       | List of emotional tags for the feedback detail (e.g., gratitude, frustration, confusion, delight). | Set to empty array if missing. Audit trail required.   |
| context       | Object    | No       | {}        | context       | internal         | session       | Additional context for the feedback detail (e.g., UI state, session info). | Set to empty object if missing. Audit trail required.  |
| auditTrail    | Object    | No       | {}        | traceability  | internal         | session       | Audit log for all changes and fallback events.                          | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** FeedbackLogs, analytics, UX engines
- **Feeds:** Feedback analytics, emotional intelligence, trust signals
- **Binds To:** All modules emitting or consuming feedback detail metadata
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for clarity, emotion, context, or traceability
- **Fallback logic** is explicit and emotionally intelligent (never silent)
- **Audit trail** is mandatory for all changes and fallbacks
- **Codex enforcement** is non-negotiable: any drift, omission, or silent failure is logged and blocks progression

---

## Example Record
```json
{
  "detailId": "01HQZKBY6J8X2V7Q9B2F3G4H5FD",
  "createdAt": "2025-05-15T01:00:00Z",
  "updatedAt": "2025-05-15T01:00:00Z",
  "feedbackId": "01HQZK7Y6J8X2V7Q9B2F3G4H5F",
  "detailType": "suggestion",
  "detailText": "Consider adding a tooltip for clarity.",
  "emotionalTags": ["helpful", "clarity"],
  "context": { "uiElement": "submitButton" },
  "auditTrail": { "events": ["created"] }
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 