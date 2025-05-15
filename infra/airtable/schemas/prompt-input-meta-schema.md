# PromptInputMeta Table Schema

<!--
  What: Canonical schema for the PromptInputMeta table — defines metadata for all prompt input fields, types, requirements, and emotional/behavioral tags.
  Why: Enables orchestration, analytics, and emotionally intelligent prompt flows. Central to clarity, trust, and adaptive UX.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** PromptInputMeta
- **Version:** v1.0.0
- **Purpose:** Defines metadata for all prompt input fields, types, requirements, and emotional/behavioral tags. Enables orchestration, analytics, and emotionally intelligent prompt flows.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name               | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|-------------------------|-----------|----------|-----------|---------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| recordId                | ULID      | Yes      | —         | identity      | internal         | global        | Primary key for PromptInputMeta records.                                 | Block record creation if missing. Audit trail required.|
| createdAt               | Timestamp | Yes      | now()     | traceability  | internal         | global        | Used for audit and recovery.                                            | Set to now() if missing. Audit trail required.         |
| updatedAt               | Timestamp | Yes      | now()     | traceability  | internal         | global        | Tracks last update for audit.                                           | Set to now() if missing. Audit trail required.         |
| promptId                | ULID      | No       | null      | traceability  | internal         | session       | Foreign key to PromptLogs.recordId for input traceability.              | Allow null if not linked. Audit trail required.        |
| promptType              | String    | Yes      | —         | clarity       | internal         | meta          | Type of prompt (e.g., businessPlan, socialContent, siteAudit).          | Block record creation if missing. Audit trail required.|
| inputField              | String    | Yes      | —         | context       | internal         | meta          | Name of the input field (e.g., industry, goal, tone).                   | Block record creation if missing. Audit trail required.|
| fieldType               | String    | Yes      | —         | clarity       | internal         | meta          | Type of the input field (e.g., string, number, object, array).          | Block record creation if missing. Audit trail required.|
| isRequired              | Boolean   | Yes      | false     | clarity       | internal         | meta          | Whether the input field is required for the prompt type.                | Set to false if missing. Audit trail required.         |
| isEnhancer              | Boolean   | No       | false     | context       | internal         | meta          | Whether the field is an enhancer (e.g., emotionalContext, urgency).     | Set to false if missing. Audit trail required.         |
| entropyLevel            | Number    | No       | null      | clarity       | internal         | session       | Entropy or randomness score of the input (0.0–1.0).                     | Allow null if not computed. Audit trail required.      |
| inputLength             | Number    | No       | null      | clarity       | internal         | session       | Length of the input (character or token count).                         | Allow null if not measured. Audit trail required.      |
| inputTone               | String    | No       | null      | emotion       | internal         | session       | Detected or user-specified tone of the input (e.g., friendly, urgent).  | Allow null if not detected. Audit trail required.      |
| inputIntent             | String    | No       | null      | clarity       | internal         | session       | Inferred or user-specified intent of the input.                         | Allow null if not detected. Audit trail required.      |
| revisionProbability     | Number    | No       | null      | risk          | internal         | session       | Probability that this input will require revision (0.0–1.0).            | Allow null if not computed. Audit trail required.      |
| emotionalSignal         | String    | No       | null      | emotion       | internal         | session       | Primary emotional signal detected in the input.                         | Allow null if not detected. Audit trail required.      |
| contextClarity          | Number    | No       | null      | clarity       | internal         | session       | Clarity/confidence score for the input context (0.0–1.0).               | Allow null if not computed. Audit trail required.      |
| urgencyFlag             | Boolean   | No       | false     | urgency       | internal         | session       | Flag if the input is marked as urgent.                                  | Set to false if missing. Audit trail required.         |
| clarityRating           | Number    | No       | null      | clarity       | internal         | session       | User or system clarity rating for the input (0–10).                     | Allow null if not rated. Audit trail required.         |
| triggeredArchetype      | String    | No       | null      | context       | internal         | session       | Archetype triggered by the input (e.g., visionary, operator).           | Allow null if not detected. Audit trail required.      |
| inputEmbeddingHash      | String    | No       | null      | traceability  | internal         | session       | Hash of the input embedding for clustering or deduplication.            | Allow null if not computed. Audit trail required.      |
| riskOfMisinterpretation | Number    | No       | null      | risk          | internal         | session       | Risk score for input misinterpretation (0.0–1.0).                       | Allow null if not computed. Audit trail required.      |
| suggestedToneAdjustment | String    | No       | null      | emotion       | internal         | session       | Suggested tone adjustment for the input, if any.                        | Allow null if not suggested. Audit trail required.     |
| emotionalTags           | Array     | No       | []        | emotion       | internal         | meta          | List of emotional tags for the input field (e.g., trust, clarity).      | Set to empty array if missing. Audit trail required.   |
| auditTrail              | Object    | No       | {}        | traceability  | internal         | meta          | Audit log for all changes and fallback events.                          | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** PromptLogs, analytics, orchestration, and UX engines
- **Feeds:** Clarity, trust, and emotional intelligence in prompt flows
- **Binds To:** All modules emitting or consuming prompt input metadata
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for clarity, context, emotion, traceability, risk, or urgency
- **Fallback logic** is explicit and emotionally intelligent (never silent)
- **Audit trail** is mandatory for all changes and fallbacks
- **Codex enforcement** is non-negotiable: any drift, omission, or silent failure is logged and blocks progression

---

## Example Record
```json
{
  "recordId": "01HQZK7Y6J8X2V7Q9B2F3G4H5M",
  "createdAt": "2025-05-14T16:00:00Z",
  "updatedAt": "2025-05-14T16:00:00Z",
  "promptId": "01HQZK7Y6J8X2V7Q9B2F3G4H5J",
  "promptType": "businessPlan",
  "inputField": "industry",
  "fieldType": "string",
  "isRequired": true,
  "isEnhancer": false,
  "entropyLevel": 0.23,
  "inputLength": 42,
  "inputTone": "friendly",
  "inputIntent": "launch",
  "revisionProbability": 0.1,
  "emotionalSignal": "trust",
  "contextClarity": 0.9,
  "urgencyFlag": false,
  "clarityRating": 8,
  "triggeredArchetype": "visionary",
  "inputEmbeddingHash": "abc123def456",
  "riskOfMisinterpretation": 0.05,
  "suggestedToneAdjustment": "more concise",
  "emotionalTags": ["clarity", "trust"],
  "auditTrail": { "events": ["created"] }
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 