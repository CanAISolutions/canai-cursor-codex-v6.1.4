# ReferralTriggers Table Schema

<!--
  What: Canonical schema for the ReferralTriggers table — captures all user/system referral triggers, trust signals, and viral loop events.
  Why: Enables trust flow analytics, viral growth, and user-driven orchestration. Binds to PromptLogs and analytics for traceability.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** ReferralTriggers
- **Version:** v1.0.0
- **Purpose:** Captures all referral events, trust signals, and viral triggers. Enables analytics, growth tracking, and trust validation. Binds to PromptLogs and SessionAnalytics for orchestration.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name       | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                 | Codex Enforcement                                      |
|-----------------|-----------|----------|-----------|---------------|------------------|---------------|-------------------------------------------------------------------|--------------------------------------------------------|
| recordId        | ULID      | Yes      | —         | identity      | internal         | global        | Primary key for ReferralTriggers.                                 | Block record creation if missing. Audit trail required.|
| createdAt       | Timestamp | Yes      | now()     | traceability  | internal         | global        | Used for audit and recovery.                                      | Set to now() if missing. Audit trail required.         |
| updatedAt       | Timestamp | Yes      | now()     | traceability  | internal         | global        | Tracks last update for audit.                                     | Set to now() if missing. Audit trail required.         |
| sourceUserId    | String    | Yes      | —         | trust         | pii              | session       | User initiating the referral.                                     | Block record creation if missing. Audit trail required.|
| targetUserId    | String    | No       | —         | growth        | pii              | session       | User being referred (may be null if not yet registered).          | Set to null if missing. Audit trail required.           |
| triggerType     | String    | Yes      | invite    | clarity       | internal         | session       | Type of referral trigger (invite, share, reward, viralLoop).      | Set to 'invite' if missing and log fallback event.      |
| triggerContext  | Object    | No       | {}        | context       | internal         | session       | Contextual metadata (campaign, channel, message).                 | Set to empty object if missing. Audit trail required.   |
| trustSignal     | String    | No       | neutral   | trust         | internal         | session       | Signal of trust level (high, medium, low, neutral).               | Set to 'neutral' if missing. Audit trail required.      |
| emotionalTag    | String    | No       | ""        | emotion       | internal         | session       | Emotional context/tag (gratitude, excitement, curiosity).         | Allow empty string if missing. Audit trail required.    |
| referralOutcome | String    | No       | pending   | outcome       | internal         | session       | Outcome of the referral (pending, accepted, declined, expired).   | Set to 'pending' if missing. Audit trail required.      |
| fallbackUsed    | Boolean   | No       | false     | resilience    | internal         | session       | Indicates if fallback logic was triggered for this referral.      | Set to false if missing. Audit trail required.          |
| auditTrail      | Object    | No       | {}        | traceability  | internal         | session       | Audit log for all changes and fallback events.                    | Set to empty object if missing. Audit trail required.   |

---

## Orchestration Mapping
- **Referenced By:** Analytics dashboards, PromptLogs, SessionAnalytics, viral loop engines
- **Feeds:** Trust flow analytics, growth tracking, user-driven orchestration
- **Binds To:** PromptLogs (via sourceUserId), SessionAnalytics (via recordId)
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for trust, growth, clarity, or resilience
- **Fallback logic** is explicit and emotionally intelligent (never silent)
- **Audit trail** is mandatory for all changes and fallbacks
- **Codex enforcement** is non-negotiable: any drift, omission, or silent failure is logged and blocks progression

---

## Example Record
```json
{
  "recordId": "01HQZK7Y6J8X2V7Q9B2F3G4H5R",
  "createdAt": "2025-05-14T04:00:00Z",
  "updatedAt": "2025-05-14T04:00:00Z",
  "sourceUserId": "user_abc123",
  "targetUserId": "user_xyz789",
  "triggerType": "invite",
  "triggerContext": { "campaign": "spring2025", "channel": "email" },
  "trustSignal": "high",
  "emotionalTag": "gratitude",
  "referralOutcome": "pending",
  "fallbackUsed": false,
  "auditTrail": { "events": ["created", "sent"] }
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 