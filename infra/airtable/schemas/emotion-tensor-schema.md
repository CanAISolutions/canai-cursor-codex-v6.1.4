# EmotionTensor Table Schema

<!--
  What: Canonical schema for the EmotionTensor table — captures multi-dimensional emotion state for sessions, users, and system analytics.
  Why: Enables emotional intelligence, trajectory analysis, trust validation, and adaptive orchestration. Binds to analytics, feedback, and orchestration layers for traceability and resilience.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** EmotionTensor
- **Version:** v1.0.0
- **Purpose:** Captures multi-dimensional emotion state for sessions, users, and system analytics. Enables emotional intelligence, trajectory analysis, and trust validation.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name         | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|-------------------|-----------|----------|-----------|---------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| recordId          | ULID      | Yes      | —         | identity      | internal         | global        | Primary key for EmotionTensor records.                                   | Block record creation if missing. Audit trail required.|
| createdAt         | Timestamp | Yes      | now()     | traceability  | internal         | global        | Used for audit and recovery.                                            | Set to now() if missing. Audit trail required.         |
| updatedAt         | Timestamp | Yes      | now()     | traceability  | internal         | global        | Tracks last update for audit.                                           | Set to now() if missing. Audit trail required.         |
| sessionId         | String    | No       | null      | context       | internal         | session       | Links emotion tensor to a session if applicable.                        | Allow null if not session-bound. Audit trail required. |
| userId            | String    | No       | null      | identity      | pii              | user          | Links emotion tensor to a user if available.                            | Allow null if not user-bound. Audit trail required.    |
| emotionVector     | Object    | Yes      | {}        | emotion       | internal         | session       | Key-value pairs of emotion labels and scores (e.g., {"joy": 0.8}).    | Set to empty object if missing. Audit trail required.  |
| emotionSource     | String    | No       | null      | traceability  | internal         | session       | Source of emotion data (e.g., prompt, feedback, analytics).             | Allow null if unknown. Audit trail required.           |
| emotionConfidence | Number    | No       | 1.0       | clarity       | internal         | session       | Confidence score for the emotion vector (0.0–1.0).                      | Set to 1.0 if missing. Audit trail required.           |
| emotionNotes      | String    | No       | ""        | context       | internal         | session       | Additional notes or context for the emotion tensor.                     | Allow empty string if missing. Audit trail required.   |
| auditTrail        | Object    | No       | {}        | traceability  | internal         | session       | Audit log for all changes and fallback events.                          | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** Analytics, feedback, session analytics, trust validation, and emotional intelligence layers
- **Feeds:** Emotional trajectory analysis, trust validation, adaptive orchestration
- **Binds To:** All modules emitting or consuming emotion state (PromptLogs, FeedbackLogs, SessionAnalytics, etc.)
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for identity, emotion, clarity, context, or traceability
- **Fallback logic** is explicit and emotionally intelligent (never silent)
- **Audit trail** is mandatory for all changes and fallbacks
- **Codex enforcement** is non-negotiable: any drift, omission, or silent failure is logged and blocks progression

---

## Example Record
```json
{
  "recordId": "01HQZK7Y6J8X2V7Q9B2F3G4H5Z",
  "createdAt": "2025-05-14T13:00:00Z",
  "updatedAt": "2025-05-14T13:00:00Z",
  "sessionId": "session_abc123",
  "userId": "user_12345",
  "emotionVector": { "joy": 0.8, "trust": 0.7, "anticipation": 0.6 },
  "emotionSource": "prompt",
  "emotionConfidence": 0.95,
  "emotionNotes": "High trust and anticipation after successful prompt.",
  "auditTrail": { "events": ["created"] }
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 