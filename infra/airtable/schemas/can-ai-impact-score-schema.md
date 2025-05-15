# CanAIImpactScores Table Schema

<!--
  What: Canonical schema for the CanAIImpactScores table — captures the primary impact score and drivers for sessions, users, and events.
  Why: Enables impact analysis, trust validation, and adaptive orchestration. Binds to analytics, feedback, and orchestration layers for traceability and resilience.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** CanAIImpactScores
- **Version:** v1.0.0
- **Purpose:** Captures the primary impact score and drivers for sessions, users, and events. Enables impact analysis, trust validation, and adaptive orchestration.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name      | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|----------------|-----------|----------|-----------|---------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| recordId       | ULID      | Yes      | —         | identity      | internal         | global        | Primary key for CanAIImpactScores records.                               | Block record creation if missing. Audit trail required.|
| createdAt      | Timestamp | Yes      | now()     | traceability  | internal         | global        | Used for audit and recovery.                                            | Set to now() if missing. Audit trail required.         |
| updatedAt      | Timestamp | Yes      | now()     | traceability  | internal         | global        | Tracks last update for audit.                                           | Set to now() if missing. Audit trail required.         |
| sessionId      | String    | No       | null      | context       | internal         | session       | Links impact score to a session if applicable.                          | Allow null if not session-bound. Audit trail required. |
| userId         | String    | No       | null      | identity      | pii              | user          | Links impact score to a user if available.                              | Allow null if not user-bound. Audit trail required.    |
| impactScore    | Number    | Yes      | 0.0       | impact        | internal         | session       | Primary impact score for the session/user/event (0.0–1.0).              | Set to 0.0 if missing. Audit trail required.           |
| impactDrivers  | Object    | No       | {}        | clarity       | internal         | session       | Key-value pairs of impact driver labels and scores (e.g., {"clarity": 0.8}). | Set to empty object if missing. Audit trail required.  |
| impactNotes    | String    | No       | ""        | context       | internal         | session       | Additional notes or context for the impact score.                       | Allow empty string if missing. Audit trail required.   |
| auditTrail     | Object    | No       | {}        | traceability  | internal         | session       | Audit log for all changes and fallback events.                          | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** Analytics, feedback, session analytics, trust validation, and orchestration layers
- **Feeds:** Impact analysis, trust validation, adaptive orchestration
- **Binds To:** All modules emitting or consuming impact scores (PromptLogs, FeedbackLogs, SessionAnalytics, etc.)
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for identity, impact, clarity, context, or traceability
- **Fallback logic** is explicit and emotionally intelligent (never silent)
- **Audit trail** is mandatory for all changes and fallbacks
- **Codex enforcement** is non-negotiable: any drift, omission, or silent failure is logged and blocks progression

---

## Example Record
```json
{
  "recordId": "01HQZK7Y6J8X2V7Q9B2F3G4H5Q",
  "createdAt": "2025-05-14T14:00:00Z",
  "updatedAt": "2025-05-14T14:00:00Z",
  "sessionId": "session_xyz789",
  "userId": "user_67890",
  "impactScore": 0.87,
  "impactDrivers": { "clarity": 0.8, "trust": 0.9, "momentum": 0.7 },
  "impactNotes": "High trust and clarity after session completion.",
  "auditTrail": { "events": ["created"] }
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 