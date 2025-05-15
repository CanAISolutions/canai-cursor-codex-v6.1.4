# SchemaEvents Table Schema (Codex v6.1.4)

<!--
  What: Canonical schema for the SchemaEvents table — logs all schema updates, version changes, and scaffolding actions.
  Why: Enables system auditing, evolution tracking, memory layer coordination, and Codex alignment verification. Central to traceability and resilience.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** SchemaEvents
- **Version:** v6.1.4
- **Purpose:** Tracks all schema changes, versioning, and Codex enforcement events for full traceability and auditability.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name           | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|---------------------|-----------|----------|-----------|---------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| eventId             | ULID      | Yes      | —         | identity      | internal         | global        | Primary key for SchemaEvents records.                                    | Block record creation if missing. Audit trail required.|
| timestamp           | Timestamp | Yes      | now()     | traceability  | internal         | global        | Timestamp for event creation.                                            | Set to now() if missing. Audit trail required.         |
| tableName           | String    | Yes      | —         | context       | internal         | event         | Name of the table affected by the event.                                 | Block record creation if missing. Audit trail required.|
| changeType          | String    | Yes      | —         | clarity       | internal         | event         | Type of schema event (e.g., create, update, delete, drift, rollback).    | Block record creation if missing. Audit trail required.|
| fieldChanged        | String    | No       | null      | context       | internal         | event         | Name of the field affected by the event (if applicable).                 | Allow null if not field-specific. Audit trail required.|
| previousState       | Object    | No       | {}        | traceability  | internal         | event         | Previous state of the field/table before the event.                      | Set to empty object if missing. Audit trail required.  |
| newState            | Object    | No       | {}        | traceability  | internal         | event         | New state of the field/table after the event.                            | Set to empty object if missing. Audit trail required.  |
| triggerSource       | String    | No       | null      | traceability  | internal         | event         | Source of the event trigger (e.g., agent, user, system, automation).     | Allow null if unknown. Audit trail required.           |
| codexSignature      | String    | No       | null      | trust         | internal         | event         | Codex signature hash for event verification.                             | Allow null if not signed. Audit trail required.        |
| schemaVersion       | String    | No       | null      | traceability  | internal         | event         | Schema version at the time of the event.                                 | Allow null if not versioned. Audit trail required.     |
| initiatedBy         | String    | No       | null      | identity      | internal         | event         | ID of the user, agent, or system that initiated the event.               | Allow null if system-generated. Audit trail required.  |
| eventComment        | String    | No       | null      | context       | internal         | event         | Additional comment or context for the event.                             | Allow null if not commented. Audit trail required.     |
| riskLevel           | String    | No       | null      | risk          | internal         | event         | Risk level associated with the event (e.g., high, medium, low).          | Allow null if not assessed. Audit trail required.      |
| impactSurface       | String    | No       | null      | impact        | internal         | event         | Surface area or scope of impact (e.g., table, field, system).            | Allow null if not assessed. Audit trail required.      |
| codexViolationFlag  | Boolean   | No       | false     | trust         | internal         | event         | Flag if event represents a Codex violation.                              | Set to false if missing. Audit trail required.         |
| auditTrail          | Object    | No       | {}        | traceability  | internal         | event         | Audit log for all changes and fallback events.                           | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** All schema, analytics, and audit engines
- **Feeds:** Traceability, drift detection, Codex enforcement, and system memory
- **Binds To:** All modules emitting or consuming schema events
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for clarity, context, trust, traceability, or risk
- **Fallback logic** is explicit and emotionally intelligent (never silent)
- **Audit trail** is mandatory for all changes and fallbacks
- **Codex enforcement** is non-negotiable: any drift, omission, or silent failure is logged and blocks progression

---

## Example Record
```json
{
  "eventId": "01HQZK7Y6J8X2V7Q9B2F3G4H5E",
  "timestamp": "2025-05-14T15:00:00Z",
  "tableName": "PromptLogs",
  "changeType": "drift",
  "fieldChanged": "clarityIndex",
  "previousState": { "clarityIndex": 5 },
  "newState": { "clarityIndex": 6 },
  "triggerSource": "system",
  "codexSignature": "abc123def456",
  "schemaVersion": "v6.1.4",
  "initiatedBy": "system",
  "eventComment": "Clarity index field updated due to schema drift detection.",
  "riskLevel": "medium",
  "impactSurface": "field",
  "codexViolationFlag": false,
  "auditTrail": { "events": ["created"] }
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 