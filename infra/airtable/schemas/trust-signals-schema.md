# TrustSignals Table Schema

<!--
  What: Canonical schema for the TrustSignals table — captures all trust signal events, scores, and context for sessions, users, and system analytics.
  Why: Enables trust analytics, fallback routing, and emotional intelligence. Central to trust flow, resilience, and auditability.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** TrustSignals
- **Version:** v1.0.0
- **Purpose:** Captures all trust signal events, scores, and context for sessions, users, and system analytics. Enables trust analytics, fallback routing, and emotional intelligence.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name     | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|---------------|-----------|----------|-----------|---------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| signalId      | ULID      | Yes      | —         | identity      | internal         | global        | Primary key for TrustSignals records.                                    | Block record creation if missing. Audit trail required.|
| createdAt     | Timestamp | Yes      | now()     | traceability  | internal         | global        | Used for audit and recovery.                                            | Set to now() if missing. Audit trail required.         |
| updatedAt     | Timestamp | Yes      | now()     | traceability  | internal         | global        | Tracks last update for audit.                                           | Set to now() if missing. Audit trail required.         |
| sessionId     | String    | No       | null      | traceability  | internal         | session       | Foreign key to SessionAnalytics.sessionId for trust linkage.            | Allow null if not session-bound. Audit trail required. |
| userId        | String    | No       | null      | identity      | pii              | user          | User identifier for trust attribution.                                  | Allow null if system-generated. Audit trail required.  |
| trustScore    | Number    | Yes      | 0.5       | trust         | internal         | session       | Trust score (0.0–1.0) for the session/user/event.                       | Set to 0.5 if missing. Audit trail required.           |
| signalType    | String    | Yes      | generic   | clarity       | internal         | session       | Type of trust signal (e.g., feedback, system, referral, anomaly).       | Set to 'generic' if missing. Audit trail required.     |
| signalSource  | String    | No       | null      | traceability  | internal         | session       | Source of the trust signal (e.g., PromptLogs, FeedbackLogs, external).  | Allow null if unknown. Audit trail required.           |
| context       | Object    | No       | {}        | context       | internal         | session       | Additional context for the trust signal.                                | Set to empty object if missing. Audit trail required.  |
| emotionalTags | Array     | No       | []        | emotion       | internal         | session       | List of emotional tags for the trust signal (e.g., trust, clarity).     | Set to empty array if missing. Audit trail required.   |
| auditTrail    | Object    | No       | {}        | traceability  | internal         | session       | Audit log for all changes and fallback events.                          | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** SessionAnalytics, PromptLogs, FeedbackLogs, trust analytics, and orchestration engines
- **Feeds:** Trust analytics, fallback routing, emotional intelligence
- **Binds To:** All modules emitting or consuming trust signal metadata
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for trust, clarity, context, or traceability
- **Fallback logic** is explicit and emotionally intelligent (never silent)
- **Audit trail** is mandatory for all changes and fallbacks
- **Codex enforcement** is non-negotiable: any drift, omission, or silent failure is logged and blocks progression

---

## Example Record
```json
{
  "signalId": "01HQZK7Y6J8X2V7Q9B2F3G4H5TS",
  "createdAt": "2025-05-14T21:00:00Z",
  "updatedAt": "2025-05-14T21:00:00Z",
  "sessionId": "session_abc123",
  "userId": "user_12345",
  "trustScore": 0.92,
  "signalType": "feedback",
  "signalSource": "PromptLogs",
  "context": { "reason": "positive feedback", "details": "User praised clarity." },
  "emotionalTags": ["trust", "clarity"],
  "auditTrail": { "events": ["created"] }
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 