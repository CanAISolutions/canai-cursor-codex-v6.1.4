# ReferralTriggers Table Schema (Codex v6.1.4)

<!--
  What: Canonical schema for the ReferralTriggers table — governs all referral hooks, trigger points, and growth events.
  Why: Enables viral loops, lifecycle nudges, reactivation incentives, and growth analytics. Central to CanAI's growth engine.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** ReferralTriggers
- **Version:** v6.1.4
- **Purpose:** Tracks all referral events, triggers, and outcomes for growth, lifecycle, and reactivation orchestration.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name               | Type      | Required | Default        | Emotional Role   | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|-------------------------|-----------|----------|----------------|------------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| recordId                | ULID      | Yes      | —              | identity         | internal         | global        | Primary key for ReferralTriggers records.                                | Block record creation if missing. Audit trail required.|
| createdAt               | Timestamp | Yes      | now()          | traceability     | internal         | global        | Timestamp for record creation.                                           | Set to now() if missing. Audit trail required.         |
| updatedAt               | Timestamp | Yes      | now()          | traceability     | internal         | global        | Timestamp for last update.                                               | Set to now() if missing. Audit trail required.         |
| referrerUserId          | String    | Yes      | —              | trust            | pii              | user          | User initiating the referral. Foreign key to UserContext.                | Block record creation if missing. Audit trail required.|
| referredUserId          | String    | No       | null           | growth           | pii              | user          | User being referred (may be null if not yet registered).                 | Allow null if not registered. Audit trail required.    |
| triggerEvent            | String    | Yes      | referralSent   | clarity          | internal         | session       | Event type (e.g., referralSent, referralClaimed, rewardGranted, reactivationTriggered, shareMedium). | Set to 'referralSent' if missing. Audit trail required.|
| rewardType              | String    | No       | null           | incentive        | internal         | session       | Type of reward granted (e.g., credit, featureUnlock, badge).             | Allow null if not rewarded. Audit trail required.      |
| referralStatus          | String    | No       | pending        | status           | internal         | session       | Status of the referral (e.g., pending, converted, expired, failed).      | Set to 'pending' if missing. Audit trail required.     |
| referralConversion      | Boolean   | No       | false          | outcome          | internal         | session       | Indicates if referral led to conversion.                                 | Set to false if missing. Audit trail required.         |
| campaignTag             | String    | No       | null           | context          | internal         | session       | Tag for campaign attribution (e.g., 'spring2025', 'reactivationQ2').     | Allow null if not tagged. Audit trail required.        |
| shareMedium             | String    | No       | null           | channel          | internal         | session       | Medium used for sharing (e.g., email, sms, social, link).                | Allow null if not specified. Audit trail required.     |
| likelySharerType        | String    | No       | null           | insight          | internal         | session       | Derived: likely type of sharer (e.g., influencer, powerUser, casual).    | Allow null if not derived. Audit trail required.       |
| referralInfluenceScore  | Number    | No       | 0              | impact           | internal         | session       | Derived: score estimating influence of this referral.                    | Set to 0 if missing. Audit trail required.             |
| reactivationLag         | Number    | No       | null           | timing           | internal         | session       | Derived: time (in hours) between referral and reactivation event.        | Allow null if not applicable. Audit trail required.    |
| auditTrail              | Object    | No       | {}             | traceability     | internal         | session       | Audit log for all changes and fallback events.                           | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** Growth analytics, lifecycle messaging, reactivation engines
- **Feeds:** Viral loop tracking, reward fulfillment, campaign attribution, user engagement
- **Binds To:** UserContext, DeliveryCostLogs, SessionFlowMap, and analytics modules
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for trust, growth, clarity, incentive, or outcome
- **Fallback logic** is explicit and emotionally intelligent (never silent)
- **Audit trail** is mandatory for all changes and fallbacks
- **Codex enforcement** is non-negotiable: any drift, omission, or silent failure is logged and blocks progression

---

## Example Record
```json
{
  "recordId": "01HQZK7Y8J9X4V2QW3R5T6U7R1",
  "createdAt": "2025-05-15T10:00:00Z",
  "updatedAt": "2025-05-15T10:05:00Z",
  "referrerUserId": "user_12345",
  "referredUserId": "user_67890",
  "triggerEvent": "referralSent",
  "rewardType": "credit",
  "referralStatus": "pending",
  "referralConversion": false,
  "campaignTag": "spring2025",
  "shareMedium": "email",
  "likelySharerType": "powerUser",
  "referralInfluenceScore": 0.85,
  "reactivationLag": null,
  "auditTrail": { "createdBy": "system", "events": [ { "type": "creation", "timestamp": "2025-05-15T10:00:00Z" } ] }
}
```

---

<!--
  Codex Principle: Every referral is a bridge. Every log is a memory. Every fallback is a hand extended in trust.
--> 