# ReferralAttribution Table Schema

<!--
  What: Canonical schema for the ReferralAttribution table — captures all referral attribution events, emotional tags, and context for user referrals.
  Why: Enables referral analytics, trust signals, campaign tracking, and auditability. Central to growth, trust, and operator clarity.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** ReferralAttribution
- **Version:** v1.0.0
- **Purpose:** Captures all referral attribution events, emotional tags, and context for user referrals.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name         | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|-------------------|-----------|----------|-----------|---------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| attributionId     | ULID      | Yes      | —         | identity      | internal         | global        | Primary key for ReferralAttribution records.                             | Block record creation if missing. Audit trail required.|
| createdAt         | Timestamp | Yes      | now()     | traceability  | internal         | global        | Used for audit and recovery.                                            | Set to now() if missing. Audit trail required.         |
| updatedAt         | Timestamp | Yes      | now()     | traceability  | internal         | global        | Tracks last update for audit.                                           | Set to now() if missing. Audit trail required.         |
| referralId        | ULID      | Yes      | —         | traceability  | internal         | session       | Foreign key to ReferralTriggers.recordId for attribution linkage.        | Block record creation if missing. Audit trail required.|
| sourceUserId      | String    | Yes      | —         | identity      | pii              | user          | User who initiated the referral.                                        | Block record creation if missing. Audit trail required.|
| targetUserId      | String    | Yes      | —         | identity      | pii              | user          | User who was referred.                                                  | Block record creation if missing. Audit trail required.|
| attributionType   | String    | Yes      | —         | clarity       | internal         | meta          | Type of attribution (e.g., direct, viral, campaign, organic).           | Block record creation if missing. Audit trail required.|
| campaignId        | String    | No       | null      | context       | internal         | meta          | Campaign identifier if attribution is campaign-based.                   | Allow null if not campaign-based. Audit trail required.|
| attributionScore  | Number    | No       | 1.0       | impact        | internal         | session       | Score or weight for the attribution (default 1.0).                      | Set to 1.0 if missing. Audit trail required.           |
| emotionalTags     | Array     | No       | []        | emotion       | internal         | session       | List of emotional tags for the attribution (e.g., gratitude, trust).    | Set to empty array if missing. Audit trail required.   |
| context           | Object    | No       | {}        | context       | internal         | session       | Additional context for the attribution (e.g., device, location).        | Set to empty object if missing. Audit trail required.  |
| auditTrail        | Object    | No       | {}        | traceability  | internal         | session       | Audit log for all changes and fallback events.                          | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** Growth analytics, trust signals, campaign reporting
- **Feeds:** Referral analytics, user growth, trust signals
- **Binds To:** All modules emitting or consuming referral attribution metadata
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for clarity, emotion, context, traceability, or impact
- **Fallback logic** is explicit and emotionally intelligent (never silent)
- **Audit trail** is mandatory for all changes and fallbacks
- **Codex enforcement** is non-negotiable: any drift, omission, or silent failure is logged and blocks progression

---

## Example Record
```json
{
  "attributionId": "01HQZKBY6J8X2V7Q9B2F3G4H5AT",
  "createdAt": "2025-05-15T02:00:00Z",
  "updatedAt": "2025-05-15T02:00:00Z",
  "referralId": "01HQZK7Y6J8X2V7Q9B2F3G4H5R",
  "sourceUserId": "user_abc123",
  "targetUserId": "user_xyz789",
  "attributionType": "campaign",
  "campaignId": "spring2025",
  "attributionScore": 1.0,
  "emotionalTags": ["gratitude", "trust"],
  "context": { "device": "mobile", "location": "US" },
  "auditTrail": { "events": ["created"] }
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 