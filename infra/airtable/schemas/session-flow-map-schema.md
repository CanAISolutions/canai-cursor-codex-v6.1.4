# SessionFlowMap Table Schema

<!--
  What: Canonical schema for the SessionFlowMap table — maps the UX lifecycle, prompt engagement, and behavioral feedback loops for each session.
  Why: Enables clarity, trust, and auditability in flow analytics, recovery, and emotional trajectory mapping.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** SessionFlowMap
- **Version:** v1.0.0
- **Purpose:** Maps the UX lifecycle, prompt engagement, and behavioral feedback loops for each session. Enables clarity, trust, and auditability in flow analytics and recovery.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name             | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|-----------------------|-----------|----------|-----------|---------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| flowId                | ULID      | Yes      | —         | identity      | internal         | global        | Primary key for SessionFlowMap records.                                  | Block record creation if missing. Audit trail required.|
| sessionId             | String    | Yes      | —         | traceability  | internal         | session       | Foreign key to SessionAnalytics.sessionId for flow mapping.              | Block record creation if missing. Audit trail required.|
| userId                | String    | No       | null      | identity      | pii              | user          | User identifier for flow personalization and analytics.                  | Allow null if system-generated. Audit trail required.  |
| flowType              | String    | Yes      | default   | clarity       | internal         | session       | Type of flow (e.g., onboarding, recovery, feedback, mainline).           | Set to 'default' if missing. Audit trail required.     |
| flowStart             | Timestamp | Yes      | now()     | traceability  | internal         | session       | Timestamp for when the flow started.                                    | Set to now() if missing. Audit trail required.         |
| flowEnd               | Timestamp | No       | null      | traceability  | internal         | session       | Timestamp for when the flow ended.                                      | Allow null if flow is ongoing. Audit trail required.   |
| flowStatus            | String    | No       | active    | clarity       | internal         | session       | Status of the flow (e.g., active, completed, abandoned, fallback).       | Set to 'active' if missing. Audit trail required.      |
| steps                 | Array     | No       | []        | clarity       | internal         | session       | Ordered list of step objects or IDs representing the flow sequence.      | Set to empty array if missing. Audit trail required.   |
| fallbackTriggered     | Boolean   | No       | false     | resilience    | internal         | session       | Indicates if fallback logic was triggered during the flow.               | Set to false if missing. Audit trail required.         |
| emotionalDropDetected | Boolean   | No       | false     | emotion       | internal         | session       | Flag if an emotional drop or disengagement was detected in the flow.     | Set to false if missing. Audit trail required.         |
| feedbackLoop          | Object    | No       | {}        | feedback      | internal         | session       | Object capturing feedback events, scores, or triggers within the flow.   | Set to empty object if missing. Audit trail required.  |
| auditTrail            | Object    | No       | {}        | traceability  | internal         | session       | Audit log for all changes and fallback events.                           | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** Analytics, recovery, UX, and emotional intelligence engines
- **Feeds:** Flow analytics, recovery triggers, emotional trajectory, and UX improvement
- **Binds To:** SessionAnalytics, FeedbackLogs, PromptLogs, and all modules emitting or consuming flow metadata
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for clarity, traceability, resilience, feedback, or emotion
- **Fallback logic** is explicit and emotionally intelligent (never silent)
- **Audit trail** is mandatory for all changes and fallbacks
- **Codex enforcement** is non-negotiable: any drift, omission, or silent failure is logged and blocks progression

---

## Example Record
```json
{
  "flowId": "01HQZK7Y6J8X2V7Q9B2F3G4H5F",
  "sessionId": "session_abc123",
  "userId": "user_12345",
  "flowType": "onboarding",
  "flowStart": "2025-05-14T18:00:00Z",
  "flowEnd": "2025-05-14T18:10:00Z",
  "flowStatus": "completed",
  "steps": ["welcome", "profile", "goal-setting"],
  "fallbackTriggered": false,
  "emotionalDropDetected": false,
  "feedbackLoop": { "score": 0.9, "events": ["positive"] },
  "auditTrail": { "events": ["created"] }
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 