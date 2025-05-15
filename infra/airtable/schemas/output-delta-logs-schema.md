# OutputDeltaLogs Table Schema

<!--
  What: Canonical schema for the OutputDeltaLogs table — captures all output delta events, hashes, scores, and emotional context for prompt outputs.
  Why: Enables change analytics, traceability, emotional intelligence, and resilience. Central to output tracking, trust, and auditability.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** OutputDeltaLogs
- **Version:** v1.0.0
- **Purpose:** Captures all output delta events, hashes, scores, and emotional context for prompt outputs.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name         | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|--------------------|-----------|----------|-----------|---------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| deltaId            | ULID      | Yes      | —         | identity      | internal         | global        | Primary key for OutputDeltaLogs records.                                 | Block record creation if missing. Audit trail required.|
| createdAt          | Timestamp | Yes      | now()     | traceability  | internal         | global        | Used for audit and recovery.                                            | Set to now() if missing. Audit trail required.         |
| updatedAt          | Timestamp | Yes      | now()     | traceability  | internal         | global        | Tracks last update for audit.                                           | Set to now() if missing. Audit trail required.         |
| promptId           | ULID      | Yes      | —         | traceability  | internal         | session       | Foreign key to PromptLogs.recordId for output linkage.                  | Block record creation if missing. Audit trail required.|
| outputType         | String    | Yes      | —         | clarity       | internal         | meta          | Type of output (e.g., text, json, image, table).                        | Block record creation if missing. Audit trail required.|
| previousOutputHash | String    | No       | null      | traceability  | internal         | session       | Hash of the previous output for delta comparison.                       | Allow null if not available. Audit trail required.     |
| currentOutputHash  | String    | No       | null      | traceability  | internal         | session       | Hash of the current output for delta comparison.                        | Allow null if not available. Audit trail required.     |
| deltaType          | String    | No       | content   | clarity       | internal         | session       | Type of delta (e.g., content, structure, tone, metadata).               | Set to 'content' if missing. Audit trail required.     |
| deltaScore         | Number    | No       | null      | change        | internal         | session       | Score representing the magnitude of change (0.0–1.0).                   | Allow null if not computed. Audit trail required.      |
| emotionalTags      | Array     | No       | []        | emotion       | internal         | session       | List of emotional tags for the output delta (e.g., surprise, confusion, improvement). | Set to empty array if missing. Audit trail required.   |
| auditTrail         | Object    | No       | {}        | traceability  | internal         | session       | Audit log for all changes and fallback events.                          | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** PromptLogs, analytics, output tracking, and optimization engines
- **Feeds:** Change analytics, emotional intelligence, trust signals
- **Binds To:** All modules emitting or consuming output delta metadata
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for change, clarity, emotion, or traceability
- **Fallback logic** is explicit and emotionally intelligent (never silent)
- **Audit trail** is mandatory for all changes and fallbacks
- **Codex enforcement** is non-negotiable: any drift, omission, or silent failure is logged and blocks progression

---

## Example Record
```json
{
  "deltaId": "01HQZKAY6J8X2V7Q9B2F3G4H5DL",
  "createdAt": "2025-05-15T00:00:00Z",
  "updatedAt": "2025-05-15T00:00:00Z",
  "promptId": "01HQZK7Y6J8X2V7Q9B2F3G4H5J",
  "outputType": "text",
  "previousOutputHash": "abc123def456",
  "currentOutputHash": "def456ghi789",
  "deltaType": "content",
  "deltaScore": 0.72,
  "emotionalTags": ["improvement", "clarity"],
  "auditTrail": { "events": ["created"] }
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 