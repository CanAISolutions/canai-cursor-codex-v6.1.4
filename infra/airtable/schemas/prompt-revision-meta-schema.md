# PromptRevisionMeta Table Schema

<!--
  What: Canonical schema for the PromptRevisionMeta table — tracks all revisions to prompt logs, including reason, type, actor, and change details.
  Why: Enables full auditability, emotional context, and trust in prompt evolution. Central to traceability, clarity, and resilience.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** PromptRevisionMeta
- **Version:** v1.0.0
- **Purpose:** Tracks all revisions to prompt logs, including reason, type, actor, and change details. Enables full auditability, emotional context, and trust in prompt evolution.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name         | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|-------------------|-----------|----------|-----------|---------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| revisionId        | ULID      | Yes      | —         | identity      | internal         | global        | Primary key for PromptRevisionMeta records.                              | Block record creation if missing. Audit trail required.|
| createdAt         | Timestamp | Yes      | now()     | traceability  | internal         | global        | Used for audit and recovery.                                            | Set to now() if missing. Audit trail required.         |
| updatedAt         | Timestamp | Yes      | now()     | traceability  | internal         | global        | Tracks last update for audit.                                           | Set to now() if missing. Audit trail required.         |
| promptLogId       | ULID      | Yes      | —         | traceability  | internal         | session       | Foreign key to PromptLogs.recordId for revision traceability.           | Block record creation if missing. Audit trail required.|
| revisionNumber    | Number    | Yes      | 1         | clarity       | internal         | session       | Revision sequence number for the prompt.                                | Set to 1 if missing. Audit trail required.             |
| revisionReason    | String    | No       | ""        | context       | internal         | session       | Reason for the revision (e.g., user feedback, system update).           | Allow empty string if missing. Audit trail required.   |
| revisionType      | String    | No       | manual    | clarity       | internal         | session       | Type of revision (e.g., manual, automated, fallback).                   | Set to 'manual' if missing. Audit trail required.      |
| previousRevisionId| ULID      | No       | null      | traceability  | internal         | session       | Links to the previous revision for full audit trail.                    | Allow null if first revision. Audit trail required.    |
| changes           | Object    | No       | {}        | clarity       | internal         | session       | Object describing the changes made in this revision.                    | Set to empty object if missing. Audit trail required.  |
| actorId           | String    | No       | null      | identity      | internal         | session       | ID of the user, agent, or system that performed the revision.           | Allow null if system-generated. Audit trail required.  |
| emotionalTags     | Array     | No       | []        | emotion       | internal         | session       | List of emotional tags for the revision (e.g., trust, clarity, urgency).| Set to empty array if missing. Audit trail required.   |
| auditTrail        | Object    | No       | {}        | traceability  | internal         | session       | Audit log for all changes and fallback events.                          | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** PromptLogs, analytics, orchestration, and audit engines
- **Feeds:** Clarity, trust, and emotional intelligence in prompt revision flows
- **Binds To:** All modules emitting or consuming prompt revision metadata
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for clarity, context, emotion, or traceability
- **Fallback logic** is explicit and emotionally intelligent (never silent)
- **Audit trail** is mandatory for all changes and fallbacks
- **Codex enforcement** is non-negotiable: any drift, omission, or silent failure is logged and blocks progression

---

## Example Record
```json
{
  "revisionId": "01HQZK7Y6J8X2V7Q9B2F3G4H5Q",
  "createdAt": "2025-05-14T17:00:00Z",
  "updatedAt": "2025-05-14T17:00:00Z",
  "promptLogId": "01HQZK7Y6J8X2V7Q9B2F3G4H5J",
  "revisionNumber": 2,
  "revisionReason": "User feedback: clarify tone",
  "revisionType": "manual",
  "previousRevisionId": "01HQZK7Y6J8X2V7Q9B2F3G4H5P",
  "changes": { "tone": { "old": "inspiring", "new": "friendly" } },
  "actorId": "user_12345",
  "emotionalTags": ["clarity", "trust"],
  "auditTrail": { "events": ["created"] }
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 