# DeliveryCostLogs Table Schema

<!--
  What: Canonical schema for the DeliveryCostLogs table — captures all cost, token, and delivery telemetry for system operations.
  Why: Enables cost analytics, margin protection, operational intelligence, and trust validation. Binds to analytics and orchestration layers for traceability.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** DeliveryCostLogs
- **Version:** v1.0.0
- **Purpose:** Captures all cost, token, and delivery telemetry for system operations. Enables analytics, margin protection, and operational intelligence.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name      | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                 | Codex Enforcement                                      |
|----------------|-----------|----------|-----------|---------------|------------------|---------------|-------------------------------------------------------------------|--------------------------------------------------------|
| recordId       | ULID      | Yes      | —         | identity      | internal         | global        | Primary key for DeliveryCostLogs.                                 | Block record creation if missing. Audit trail required.|
| createdAt      | Timestamp | Yes      | now()     | traceability  | internal         | global        | Used for audit and recovery.                                      | Set to now() if missing. Audit trail required.         |
| updatedAt      | Timestamp | Yes      | now()     | traceability  | internal         | global        | Tracks last update for audit.                                     | Set to now() if missing. Audit trail required.         |
| operationType  | String    | Yes      | —         | clarity       | internal         | session       | Type of operation (prompt, webhook, sync, export).                | Block record creation if missing. Audit trail required.|
| sourceModule   | String    | Yes      | —         | traceability  | internal         | session       | Module/service that generated the cost (Make, GPT, Airtable).     | Block record creation if missing. Audit trail required.|
| costUSD        | Number    | Yes      | 0.0       | cost          | internal         | session       | Cost in USD for the operation.                                    | Set to 0.0 if missing and log fallback event.          |
| tokensUsed     | Number    | No       | 0         | efficiency    | internal         | session       | Number of tokens used (if applicable, e.g., GPT calls).           | Set to 0 if missing. Audit trail required.             |
| deliveryStatus | String    | No       | success   | outcome       | internal         | session       | Status of the delivery (success, failed, retried).                | Set to 'success' if missing. Audit trail required.     |
| notes          | String    | No       | ""        | context       | internal         | session       | Additional notes or context for the cost event.                   | Allow empty string if missing. Audit trail required.   |
| fallbackUsed   | Boolean   | No       | false     | resilience    | internal         | session       | Indicates if fallback logic was triggered for this cost event.     | Set to false if missing. Audit trail required.         |
| auditTrail     | Object    | No       | {}        | traceability  | internal         | session       | Audit log for all changes and fallback events.                    | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** Analytics dashboards, margin protection, operational intelligence layers
- **Feeds:** Cost analytics, margin protection, operational intelligence
- **Binds To:** All modules emitting cost or token telemetry
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for cost, efficiency, clarity, or resilience
- **Fallback logic** is explicit and emotionally intelligent (never silent)
- **Audit trail** is mandatory for all changes and fallbacks
- **Codex enforcement** is non-negotiable: any drift, omission, or silent failure is logged and blocks progression

---

## Example Record
```json
{
  "recordId": "01HQZK7Y6J8X2V7Q9B2F3G4H5C",
  "createdAt": "2025-05-14T08:00:00Z",
  "updatedAt": "2025-05-14T08:00:00Z",
  "operationType": "prompt",
  "sourceModule": "GPT",
  "costUSD": 0.012,
  "tokensUsed": 512,
  "deliveryStatus": "success",
  "notes": "Standard prompt completion",
  "fallbackUsed": false,
  "auditTrail": { "events": ["created"] }
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 