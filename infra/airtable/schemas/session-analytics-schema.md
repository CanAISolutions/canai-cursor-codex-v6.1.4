# SessionAnalytics Table Schema

<!--
  What: Canonical schema for the SessionAnalytics table — maps session-level metrics, momentum, friction, emotional trajectory, and outcome.
  Why: Enables real-time analytics, recovery, trust validation, and emotional intelligence at the session level. Feeds dashboards, triggers self-healing, and supports cross-table orchestration.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** SessionAnalytics
- **Version:** v1.0.0
- **Purpose:** Captures session metrics, momentum, friction, emotional trajectory, and outcome. Cross-links to PromptLogs and FeedbackLogs for orchestration and recovery.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name           | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                 | Codex Enforcement                                      |
|---------------------|-----------|----------|-----------|---------------|------------------|---------------|-------------------------------------------------------------------|--------------------------------------------------------|
| recordId            | ULID      | Yes      | —         | identity      | internal         | global        | Primary key for SessionAnalytics.                                 | Block record creation if missing. Audit trail required.|
| createdAt           | Timestamp | Yes      | now()     | traceability  | internal         | global        | Used for audit and recovery.                                      | Set to now() if missing. Audit trail required.         |
| updatedAt           | Timestamp | Yes      | now()     | traceability  | internal         | global        | Tracks last update for audit.                                     | Set to now() if missing. Audit trail required.         |
| promptLogLink       | ULID      | Yes      | —         | traceability  | internal         | session       | Foreign key to PromptLogs.recordId for orchestration.             | Block record creation if missing. Audit trail required.|
| feedbackLogLink     | ULID      | No       | —         | traceability  | internal         | session       | Foreign key to FeedbackLogs.recordId for orchestration.           | Set to null if missing. Audit trail required.          |
| sessionId           | String    | Yes      | —         | identity      | internal         | session       | Unique session identifier.                                        | Block record creation if missing. Audit trail required.|
| momentumScore       | Number    | Yes      | 0.5       | momentum      | internal         | session       | Session progress velocity score.                                  | Set to 0.5 if missing and log fallback event.          |
| frictionScore       | Number    | Yes      | 0.5       | friction      | internal         | session       | Session friction or resistance score.                             | Set to 0.5 if missing and log fallback event.          |
| clarityIndex        | Number    | Yes      | 5         | clarity       | internal         | session       | Session clarity score (0–10).                                     | Set to 5 if missing and log fallback event.            |
| resonanceScore      | Number    | Yes      | 0.5       | empathy       | internal         | session       | Session emotional resonance score (0.0–1.0).                      | Set to 0.5 if missing and log fallback event.          |
| emotionTensor       | Object    | No       | {}        | emotion       | pii              | session       | Multi-dimensional emotion state for the session.                  | Set to empty object if missing. Audit trail required.  |
| emotionTrendScore   | Number    | No       | 0.0       | emotion       | internal         | session       | Session emotional trajectory score.                               | Set to 0.0 if missing. Audit trail required.           |
| sessionOutcome      | String    | No       | unknown   | outcome       | internal         | session       | Session outcome (e.g., success, fallback, recovery, abandoned).   | Set to 'unknown' if missing. Audit trail required.     |
| recoveryTriggered   | Boolean   | No       | false     | recovery      | internal         | session       | Flag if recovery/self-healing was triggered during session.       | Set to false if missing. Audit trail required.         |
| sessionChurnRisk    | Number    | No       | 0.0       | risk          | internal         | session       | Predicted risk of session dropout.                                | Set to 0.0 if missing. Audit trail required.           |
| sessionEmotionDelta | Object    | No       | {}        | emotion       | internal         | session       | Change in session emotionTensor over time.                        | Set to empty object if missing. Audit trail required.  | *Not yet operational — tracked in schema-debt.md* |

---

## Orchestration Mapping
- **Referenced By:** Analytics dashboards, recovery engines, trust and emotional intelligence layers
- **Feeds:** Session health, momentum/friction analytics, recovery triggers, emotional trajectory
- **Binds To:** PromptLogs (via promptLogLink), FeedbackLogs (via feedbackLogLink)
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for momentum, friction, clarity, empathy, risk, or recovery
- **Fallback logic** is explicit and emotionally intelligent (never silent)
- **Audit trail** is mandatory for all changes and fallbacks
- **Codex enforcement** is non-negotiable: any drift, omission, or silent failure is logged and blocks progression
- **Schema Debt:** `sessionEmotionDelta` is not yet operational and is tracked in `/cursor/system-intel/schema-debt.md`

---

## Example Record
```json
{
  "recordId": "01HQZK7Y6J8X2V7Q9B2F3G4H5S",
  "createdAt": "2025-05-14T04:00:00Z",
  "updatedAt": "2025-05-14T04:00:00Z",
  "promptLogLink": "01HQZK7Y6J8X2V7Q9B2F3G4H5J",
  "feedbackLogLink": "01HQZK7Y6J8X2V7Q9B2F3G4H5F",
  "sessionId": "session_abc123",
  "momentumScore": 0.85,
  "frictionScore": 0.15,
  "clarityIndex": 9,
  "resonanceScore": 0.93,
  "emotionTensor": { "joy": 0.7, "trust": 0.8 },
  "emotionTrendScore": 0.6,
  "sessionOutcome": "success",
  "recoveryTriggered": false,
  "sessionChurnRisk": 0.05,
  "sessionEmotionDelta": { "joy": 0.2, "trust": 0.1 }
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 