# FieldGlossary Table Schema

<!--
  What: Canonical schema for the FieldGlossary table — defines and documents all canonical fields used across tables, including type, sensitivity, context, and emotional role.
  Why: Enables clarity, trust, and auditability in schema evolution. Central to schema normalization, emotional annotation, and system resilience.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** FieldGlossary
- **Version:** v1.0.0
- **Purpose:** Defines and documents all canonical fields used across tables, including type, sensitivity, context, and emotional role. Enables clarity, trust, and auditability in schema evolution.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name      | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|----------------|-----------|----------|-----------|---------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| fieldId        | ULID      | Yes      | —         | identity      | internal         | global        | Primary key for FieldGlossary records.                                   | Block record creation if missing. Audit trail required.|
| fieldName      | String    | Yes      | —         | clarity       | internal         | global        | Canonical name of the field.                                             | Block record creation if missing. Audit trail required.|
| fieldType      | String    | Yes      | —         | clarity       | internal         | global        | Type of the field (e.g., string, number, object, array, boolean, ULID, timestamp). | Block record creation if missing. Audit trail required.|
| description    | String    | No       | ""        | context       | internal         | global        | Human-readable description of the field's purpose and usage.             | Allow empty string if missing. Audit trail required.   |
| emotionalRole  | String    | No       | context   | emotion       | internal         | global        | Primary emotional role of the field (e.g., clarity, trust, identity, context, emotion, traceability). | Set to 'context' if missing. Audit trail required.     |
| dataSensitivity| String    | No       | internal  | clarity       | internal         | global        | Data sensitivity classification (e.g., internal, pii, public).           | Set to 'internal' if missing. Audit trail required.    |
| contextScope   | String    | No       | global    | context       | internal         | global        | Scope of the field (e.g., global, session, user, event, meta).           | Set to 'global' if missing. Audit trail required.      |
| defaultValue   | Any       | No       | null      | context       | internal         | global        | Default value for the field, if any.                                     | Allow null if no default. Audit trail required.        |
| isRequired     | Boolean   | No       | false     | clarity       | internal         | global        | Whether the field is required in its parent table.                       | Set to false if missing. Audit trail required.         |
| isIndexed      | Boolean   | No       | false     | efficiency    | internal         | global        | Whether the field is indexed for query performance.                      | Set to false if missing. Audit trail required.         |
| glossaryVersion| String    | No       | v1.0.0    | traceability  | internal         | global        | Version of the glossary entry.                                           | Set to 'v1.0.0' if missing. Audit trail required.      |
| relatedTables  | Array     | No       | []        | context       | internal         | global        | List of tables where this field is used.                                 | Set to empty array if missing. Audit trail required.   |
| auditTrail     | Object    | No       | {}        | traceability  | internal         | global        | Audit log for all changes and fallback events.                           | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** All schema, analytics, and orchestration engines
- **Feeds:** Clarity, trust, and emotional intelligence in schema evolution
- **Binds To:** All modules emitting or consuming field metadata
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
  "fieldId": "01HQZK7Y6J8X2V7Q9B2F3G4H5A",
  "fieldName": "recordId",
  "fieldType": "ULID",
  "description": "Primary key for records.",
  "emotionalRole": "identity",
  "dataSensitivity": "internal",
  "contextScope": "global",
  "defaultValue": null,
  "isRequired": true,
  "isIndexed": true,
  "glossaryVersion": "v1.0.0",
  "relatedTables": ["PromptLogs", "FeedbackLogs", "SessionAnalytics"],
  "auditTrail": { "events": ["created"] }
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 