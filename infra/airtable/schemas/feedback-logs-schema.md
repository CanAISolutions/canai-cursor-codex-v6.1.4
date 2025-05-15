# FeedbackLogs Table Schema

<!--
  What: Canonical schema for the FeedbackLogs table — captures user/system feedback, emotional resonance, micro-emotions, and session-level feedback.
  Why: Enables emotional trajectory analysis, trust validation, and prompt improvement. Binds to PromptLogs for traceability.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** FeedbackLogs
- **Version:** v1.0.0
- **Purpose:** Captures all feedback events, emotional resonance, and micro-emotions. Enables analytics, recovery, and emotional intelligence. Binds to PromptLogs for session traceability.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name         | Type      | Required | Default   | Emotional Role   | Data Sensitivity | Context Scope | Description / Orchestration Notes                                 | Codex Enforcement                                      | UI Exposure | Public |
|-------------------|-----------|----------|-----------|------------------|------------------|---------------|-------------------------------------------------------------------|--------------------------------------------------------|-------------|--------|
| recordId          | ULID      | Yes      | —         | identity         | internal         | global        | Primary key for FeedbackLogs.                                     | Block record creation if missing. Audit trail required.|             |        |
| createdAt         | Timestamp | Yes      | now()     | traceability     | internal         | global        | Used for audit and recovery.                                      | Set to now() if missing. Audit trail required.         |             |        |
| updatedAt         | Timestamp | Yes      | now()     | traceability     | internal         | global        | Tracks last update for audit.                                     | Set to now() if missing. Audit trail required.         |             |        |
| sourceLink        | ULID      | Yes      | —         | traceability     | internal         | session       | Foreign key to PromptLogs.recordId for session binding.           | Block record creation if missing. Audit trail required.|             |        |
| userId            | String    | No       | —         | identity         | pii              | session       | User identifier for feedback attribution.                         | Set to null if missing. Audit trail required.           |             |        |
| feedbackText      | String    | No       | ""        | feedback         | pii              | session       | User/system feedback text. Drives UI feedback and prompt revision.| Allow empty string, log as ambiguous if missing.        | Yes         |        |
| resonanceScore    | Number    | Yes      | 0.5       | empathy          | internal         | session       | Emotional resonance score (0.0–1.0). Drives analytics/trajectory. | Set to 0.5 if missing and log fallback event.           | Yes         |        |
| emotionTensor     | Object    | No       | {}        | emotion          | pii              | session       | Multi-dimensional emotion state at feedback time.                 | Set to empty object if missing. Audit trail required.   |             |        |
| emotionTensorDelta| Object    | No       | {}        | emotion          | internal         | session       | Change in emotionTensor since last feedback.                      | Set to empty object if missing. Audit trail required.   |             |        |
| userMicroFeedback | String    | No       | ""        | micro-feedback   | pii              | session       | Short-form or emoji feedback. Fallback: allow empty/ambiguous.    | Allow empty string, log as ambiguous if missing.        | Yes         |        |
| consentReference  | String    | No       | —         | consent          | internal         | session       | Reference to user consent for public testimonial/feedback use.    | Set to null if missing. Audit trail required.           |             |        |
| publicFlag        | Boolean   | No       | false     | visibility       | internal         | session       | Flag if feedback is public/testimonial. Drives UI/privacy logic.  | Set to false if missing. Audit trail required.          | Yes         | Yes    |

---

## Orchestration Mapping
- **Referenced By:** SessionAnalytics, analytics dashboards, emotional trajectory engines
- **Feeds:** Prompt revision, UI feedback, trust and empathy analytics
- **Binds To:** PromptLogs (via sourceLink)
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for empathy, feedback, micro-feedback, or visibility
- **Fallback logic** is explicit and emotionally intelligent (never silent)
- **Audit trail** is mandatory for all changes and fallbacks
- **Codex enforcement** is non-negotiable: any drift, omission, or silent failure is logged and blocks progression
- **UI Exposure:** Fields flagged as `uiExposure: true` are visible in user interfaces or drive prompt revision
- **Public:** `publicFlag` and `consentReference` control public/testimonial exposure

---

## Example Record
```json
{
  "recordId": "01HQZK7Y6J8X2V7Q9B2F3G4H5F",
  "createdAt": "2025-05-14T03:00:00Z",
  "updatedAt": "2025-05-14T03:00:00Z",
  "sourceLink": "01HQZK7Y6J8X2V7Q9B2F3G4H5J",
  "userId": "user_12345",
  "feedbackText": "Loved the clarity and tone!",
  "resonanceScore": 0.95,
  "emotionTensor": { "joy": 0.8, "trust": 0.7 },
  "emotionTensorDelta": { "joy": 0.2, "trust": 0.1 },
  "userMicroFeedback": "👍",
  "consentReference": "consent_2025_05_14",
  "publicFlag": true
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 