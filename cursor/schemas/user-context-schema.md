# UserContext Table Schema (Codex v6.1.4)

<!--
  What: Canonical schema for the UserContext table — captures user persona, emotional traits, context, and personalization signals for emotionally intelligent orchestration.
  Why: Enables personalization, trust, adaptive UX, and emotionally aware flows. Central to CanAI's personalization intelligence layer.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** UserContext
- **Version:** v6.1.4
- **Purpose:** Encodes user persona, traits, context, and personalization signals for orchestration, analytics, and emotional continuity.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name                | Type      | Required | Default     | Emotional Role     | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|--------------------------|-----------|----------|-------------|-------------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| recordId                 | ULID      | Yes      | —           | identity          | internal         | global        | Primary key for UserContext records.                                     | Block record creation if missing. Audit trail required.|
| createdAt                | Timestamp | Yes      | now()       | traceability      | internal         | global        | Timestamp for record creation.                                           | Set to now() if missing. Audit trail required.         |
| updatedAt                | Timestamp | Yes      | now()       | traceability      | internal         | global        | Timestamp for last update.                                               | Set to now() if missing. Audit trail required.         |
| userId                   | String    | Yes      | —           | identity          | pii             | user          | User identifier for context binding.                                     | Block record creation if missing. Audit trail required.|
| personaProfile           | Object    | Yes      | {}          | persona           | internal         | user          | Persona archetype and profile.                                           | Log as empty object and flag for review.               |
| emotionalTraits          | Object    | No       | {}          | emotion           | internal         | user          | Key emotional traits (e.g., empathy, ambition, resilience).              | Set to empty object if missing. Audit trail required.  |
| emotionalTone            | String    | No       | neutral     | emotion           | internal         | user          | Dominant emotional tone (e.g., optimistic, anxious, neutral).            | Set to 'neutral' if missing. Audit trail required.     |
| intentConfidence         | Number    | No       | 0.5         | clarity           | internal         | user          | Confidence score for inferred user intent (0.0–1.0).                     | Set to 0.5 if missing. Audit trail required.           |
| engagementCluster        | String    | No       | null        | engagement        | internal         | user          | Cluster label for engagement segmentation.                               | Allow null if not clustered. Audit trail required.     |
| lastAction               | String    | No       | null        | traceability      | internal         | user          | Most recent user action or event.                                        | Allow null if unknown. Audit trail required.           |
| deviceType               | String    | No       | null        | context           | internal         | user          | Device type (e.g., mobile, desktop, tablet).                             | Allow null if unknown. Audit trail required.           |
| timezone                 | String    | No       | null        | context           | internal         | user          | User's timezone (e.g., 'America/New_York').                              | Allow null if unknown. Audit trail required.           |
| trustTier                | String    | No       | standard    | trust             | internal         | user          | Tiered trust level (e.g., standard, elevated, restricted).               | Set to 'standard' if missing. Audit trail required.    |
| personalizationFlags     | Object    | No       | {}          | personalization    | internal         | user          | Flags for feature access, A/B tests, or UX variants.                     | Set to empty object if missing. Audit trail required.  |
| cultureVector            | Array     | No       | []          | culture           | internal         | user          | Cultural tags (e.g., ['EMEA', 'startup', 'risk-tolerant']).              | Set to empty array if missing. Audit trail required.   |
| cognitiveStyle           | String    | No       | balanced    | cognition         | internal         | user          | Cognitive style (e.g., 'analytical', 'creative', 'balanced').            | Set to 'balanced' if missing. Audit trail required.    |
| contextVector            | Array     | No       | []          | context           | internal         | user          | Contextual tags (e.g., ['novice', 'bold']).                              | Set to empty array if missing. Audit trail required.   |
| trustLevel               | Number    | No       | 0.5         | trust             | internal         | user          | Trust score for the user (0.0–1.0).                                      | Set to 0.5 if missing. Audit trail required.           |
| memoryTokens             | Array     | No       | []          | memory            | internal         | user          | Tokens or keys for memory recall and session continuity.                 | Set to empty array if missing. Audit trail required.   |
| likelyDropoffStep        | String    | No       | null        | risk              | internal         | user          | Derived: most likely step for user dropoff.                              | Allow null if not available. Audit trail required.     |
| preferredFulfillmentSpeed| String    | No       | standard    | preference        | internal         | user          | Derived: preferred speed for fulfillment.                                | Set to 'standard' if missing. Audit trail required.    |
| reactivationOpportunity  | Boolean   | No       | false       | opportunity       | internal         | user          | Derived: flag if user is a candidate for reactivation.                   | Set to false if missing. Audit trail required.         |
| auditTrail               | Object    | No       | {}          | traceability      | internal         | user          | Audit log for all changes and fallback events.                           | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** Personalization, analytics, trust, and adaptive UX engines
- **Feeds:** Session orchestration, emotional memory, and adaptive flows
- **Binds To:** PromptLogs, SessionAnalytics, FeedbackLogs, and all modules requiring user context
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for identity, trust, emotion, context, or opportunity
- **Fallback logic** is explicit and emotionally intelligent (never silent)
- **Audit trail** is mandatory for all changes and fallbacks
- **Codex enforcement** is non-negotiable: any drift, omission, or silent failure is logged and blocks progression

---

## Example Record
```json
{
  "recordId": "01HQZK7Y8J9X4V2QW3R5T6U7Y8",
  "createdAt": "2025-05-14T12:00:00Z",
  "updatedAt": "2025-05-14T12:05:00Z",
  "userId": "user_12345",
  "personaProfile": { "archetype": "visionary", "description": "Bold founder, future-oriented, thrives on possibility." },
  "emotionalTraits": { "empathy": 0.9, "ambition": 0.8, "resilience": 0.85 },
  "emotionalTone": "optimistic",
  "intentConfidence": 0.92,
  "engagementCluster": "power",
  "lastAction": "prompt_submit",
  "deviceType": "desktop",
  "timezone": "America/New_York",
  "trustTier": "elevated",
  "personalizationFlags": { "abTest": "B", "featureX": true },
  "cultureVector": ["EMEA", "startup", "risk-tolerant"],
  "cognitiveStyle": "creative",
  "contextVector": ["novice", "bold"],
  "trustLevel": 0.92,
  "memoryTokens": ["session_abc123", "memory_xyz789"],
  "likelyDropoffStep": "checkout",
  "preferredFulfillmentSpeed": "instant",
  "reactivationOpportunity": true,
  "auditTrail": { "createdBy": "system", "events": [ { "type": "creation", "timestamp": "2025-05-14T12:00:00Z" } ] }
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 