# SchemaEvents Table Schema

<!--
  What: Canonical schema for the SchemaEvents table — logs all schema changes, drifts, rollbacks, and related events for traceability and audit.
  Why: Enables schema integrity, drift detection, rollback, and auditability. Binds to orchestration, analytics, and recovery layers for resilience.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** SchemaEvents
- **Version:** v1.0.0
- **Purpose:** Logs all schema changes, drifts, rollbacks, and related events for traceability and audit.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name    | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|--------------|-----------|----------|-----------|---------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| recordId     | ULID      | Yes      | —         | identity      | internal         | global        | Primary key for SchemaEvents records.                                    | Block record creation if missing. Audit trail required.|
| createdAt    | Timestamp | Yes      | now()     | traceability  | internal         | global        | Used for audit and recovery.                                            | Set to now() if missing. Audit trail required.         |
| updatedAt    | Timestamp | Yes      | now()     | traceability  | internal         | global        | Tracks last update for audit.                                           | Set to now() if missing. Audit trail required.         |
| eventType    | String    | Yes      | —         | clarity       | internal         | event         | Type of schema event (e.g., create, update, delete, drift, rollback).    | Block record creation if missing. Audit trail required.|
| tableName    | String    | Yes      | —         | context       | internal         | event         | Name of the table affected by the event.                                | Block record creation if missing. Audit trail required.|
| fieldName    | String    | No       | null      | context       | internal         | event         | Name of the field affected by the event (if applicable).                | Allow null if not field-specific. Audit trail required.|
| eventPayload | Object    | No       | {}        | traceability  | internal         | event         | Payload with event details, diffs, or rollback data.                    | Set to empty object if missing. Audit trail required.  |
| actorId      | String    | No       | null      | identity      | internal         | event         | ID of the user, agent, or system that triggered the event.              | Allow null if system-generated. Audit trail required.  |
| notes        | String    | No       | ""        | context       | internal         | event         | Additional notes or context for the schema event.                       | Allow empty string if missing. Audit trail required.   |
| auditTrail   | Object    | No       | {}        | traceability  | internal         | event         | Audit log for all changes and fallback events.                          | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** Orchestration, analytics, recovery, and audit layers
- **Feeds:** Schema integrity, drift detection, rollback, auditability
- **Binds To:** All modules emitting or consuming schema events (drift watchdogs, rollback scripts, dashboards, etc.)
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for identity, clarity, context, or traceability
- **Fallback logic** is explicit and emotionally intelligent (never silent)
- **Audit trail** is mandatory for all changes and fallbacks
- **Codex enforcement** is non-negotiable: any drift, omission, or silent failure is logged and blocks progression

---

## Example Record
```json
{
  "recordId": "01HQZK7Y6J8X2V7Q9B2F3G4H5E",
  "createdAt": "2025-05-14T15:00:00Z",
  "updatedAt": "2025-05-14T15:00:00Z",
  "eventType": "drift",
  "tableName": "PromptLogs",
  "fieldName": "clarityIndex",
  "eventPayload": { "oldValue": 5, "newValue": 6 },
  "actorId": "system",
  "notes": "Clarity index field updated due to schema drift detection.",
  "auditTrail": { "events": ["created"] }
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 