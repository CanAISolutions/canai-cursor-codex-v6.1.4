# PromptTypeGlossary Table Schema

<!--
  What: Canonical schema for the PromptTypeGlossary table — defines and documents all canonical prompt types, including taxonomy, default fields, emotional roles, and system category.
  Why: Enables clarity, trust, and auditability in prompt orchestration. Central to taxonomy normalization, emotional annotation, and system resilience.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** PromptTypeGlossary
- **Version:** v1.0.0
- **Purpose:** Defines and documents all canonical prompt types, including taxonomy, default fields, emotional roles, and system category. Enables clarity, trust, and auditability in prompt orchestration.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name      | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|----------------|-----------|----------|-----------|---------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| typeId         | ULID      | Yes      | —         | identity      | internal         | global        | Primary key for PromptTypeGlossary records.                              | Block record creation if missing. Audit trail required.|
| typeName       | String    | Yes      | —         | clarity       | internal         | global        | Canonical name of the prompt type (e.g., businessPlan, socialContent).   | Block record creation if missing. Audit trail required.|
| description    | String    | No       | ""        | context       | internal         | global        | Human-readable description of the prompt type's purpose and usage.        | Allow empty string if missing. Audit trail required.   |
| category       | String    | No       | general   | context       | internal         | global        | Category of the prompt type (e.g., business, marketing, audit, feedback).| Set to 'general' if missing. Audit trail required.     |
| isActive       | Boolean   | No       | true      | trust         | internal         | global        | Whether this prompt type is currently active and available for use.       | Set to true if missing. Audit trail required.          |
| defaultFields  | Array     | No       | []        | clarity       | internal         | global        | List of default field names for this prompt type.                        | Set to empty array if missing. Audit trail required.   |
| emotionalRole  | String    | No       | context   | emotion       | internal         | global        | Primary emotional role of the prompt type (e.g., clarity, trust, context).| Set to 'context' if missing. Audit trail required.     |
| dataSensitivity| String    | No       | internal  | clarity       | internal         | global        | Data sensitivity classification (e.g., internal, pii, public).           | Set to 'internal' if missing. Audit trail required.    |
| contextScope   | String    | No       | global    | context       | internal         | global        | Scope of the prompt type (e.g., global, session, user, event, meta).     | Set to 'global' if missing. Audit trail required.      |
| glossaryVersion| String    | No       | v1.0.0    | traceability  | internal         | global        | Version of the glossary entry.                                           | Set to 'v1.0.0' if missing. Audit trail required.      |
| relatedPrompts | Array     | No       | []        | context       | internal         | global        | List of prompt log IDs or names that use this type.                      | Set to empty array if missing. Audit trail required.   |
| auditTrail     | Object    | No       | {}        | traceability  | internal         | global        | Audit log for all changes and fallback events.                           | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** All schema, analytics, and orchestration engines
- **Feeds:** Clarity, trust, and emotional intelligence in prompt orchestration
- **Binds To:** All modules emitting or consuming prompt type metadata
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
  "typeId": "01HQZK7Y6J8X2V7Q9B2F3G4H5T",
  "typeName": "businessPlan",
  "description": "Business plan generation prompt.",
  "category": "business",
  "isActive": true,
  "defaultFields": ["industry", "goal", "tone"],
  "emotionalRole": "clarity",
  "dataSensitivity": "internal",
  "contextScope": "global",
  "glossaryVersion": "v1.0.0",
  "relatedPrompts": ["PromptLogs"],
  "auditTrail": { "events": ["created"] }
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 