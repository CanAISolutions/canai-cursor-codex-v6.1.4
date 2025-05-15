# DeliveryCostLogs Table Schema (Codex v6.1.4)

<!--
  What: Canonical schema for the DeliveryCostLogs table — captures per-prompt delivery costs, margin analytics, and operational telemetry across all fulfillment layers.
  Why: Enables cost analytics, margin protection, anomaly detection, and sustainable scaling. Central to CanAI's financial nervous system.
  How: Modular, emotionally annotated, and Codex-enforced. All fields are auditable, fallback-safe, and orchestrated for resilience.
-->

## Table Overview
- **Name:** DeliveryCostLogs
- **Version:** v6.1.4
- **Purpose:** Tracks all delivery costs, tokens, retries, and fulfillment events for margin analytics and operational resilience.
- **Audit Trail:** Enabled (all changes logged)
- **Codex Enforcement:** Required (fallbacks and audit events are logged)

---

## Fields

| Field Name        | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|------------------|-----------|----------|-----------|---------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| recordId         | ULID      | Yes      | —         | identity      | internal         | global        | Primary key for DeliveryCostLogs records.                                | Block record creation if missing. Audit trail required.|
| createdAt        | Timestamp | Yes      | now()     | traceability  | internal         | global        | Timestamp for record creation.                                           | Set to now() if missing. Audit trail required.         |
| updatedAt        | Timestamp | Yes      | now()     | traceability  | internal         | global        | Timestamp for last update.                                               | Set to now() if missing. Audit trail required.         |
| sessionId        | String    | No       | null      | traceability  | internal         | session       | Foreign key to SessionAnalytics.sessionId for cost linkage.              | Allow null if not session-bound. Audit trail required. |
| promptType       | String    | No       | null      | context       | internal         | session       | Prompt type associated with the cost event.                              | Allow null if not prompt-related. Audit trail required.|
| modelUsed        | String    | No       | null      | clarity       | internal         | session       | Model or service used (e.g., GPT-4o, Make, Placid, Klaviyo).             | Allow null if not model-based. Audit trail required.   |
| operationType    | String    | Yes      | —         | clarity       | internal         | session       | Type of operation (e.g., prompt, webhook, imageGen, email, makeOp).      | Block record creation if missing. Audit trail required.|
| costUSD          | Number    | Yes      | 0.0       | cost          | internal         | session       | Cost in USD for the operation.                                           | Set to 0.0 if missing and log fallback event.          |
| tokenCost        | Number    | No       | null      | granularity   | internal         | session       | Token cost for LLM-based operations.                                     | Allow null if not token-based. Audit trail required.   |
| tokensUsed       | Number    | No       | 0         | efficiency    | internal         | session       | Number of tokens used (if applicable).                                   | Set to 0 if missing. Audit trail required.             |
| retryCount       | Number    | No       | 0         | resilience    | internal         | session       | Number of retries for the operation.                                     | Set to 0 if missing. Audit trail required.             |
| deliveryStatus   | String    | No       | success   | outcome       | internal         | session       | Status of the delivery (e.g., success, failed, retried).                 | Set to 'success' if missing. Audit trail required.     |
| deliverySuccess  | Boolean   | No       | true      | trust         | internal         | session       | Boolean flag for delivery success.                                       | Set to true if missing. Audit trail required.          |
| placidOps        | Number    | No       | 0         | granularity   | internal         | session       | Number of Placid image generation operations.                            | Set to 0 if missing. Audit trail required.             |
| klaviyoSends     | Number    | No       | 0         | granularity   | internal         | session       | Number of Klaviyo email sends.                                           | Set to 0 if missing. Audit trail required.             |
| makeOperations   | Number    | No       | 0         | granularity   | internal         | session       | Number of Make.com operations.                                           | Set to 0 if missing. Audit trail required.             |
| notes            | String    | No       | ""        | context       | internal         | session       | Additional notes or context for the cost event.                          | Allow empty string if missing. Audit trail required.   |
| estimatedMargin  | Number    | No       | null      | profitability | internal         | session       | Estimated margin for the operation (derived or input).                   | Allow null if not available. Audit trail required.     |
| costPerSuccess   | Number    | No       | null      | efficiency    | internal         | session       | Derived: costUSD divided by successful deliveries.                       | Allow null if not available. Audit trail required.     |
| overageFlag      | Boolean   | No       | false     | risk          | internal         | session       | Flag if cost or tokens exceed expected thresholds.                       | Set to false if missing. Audit trail required.         |
| anomalyFlag      | Boolean   | No       | false     | resilience    | internal         | session       | Flag if anomaly detected for this cost event.                            | Set to false if missing. Audit trail required.         |
| auditTrail       | Object    | No       | {}        | traceability  | internal         | session       | Audit log for all changes and fallback events.                           | Set to empty object if missing. Audit trail required.  |

---

## Orchestration Mapping
- **Referenced By:** Analytics, margin protection, anomaly detection, and reporting engines
- **Feeds:** Margin analytics, cost anomaly triggers, and operational dashboards
- **Binds To:** SessionAnalytics, PromptLogs, CostAnomalyTriggers, and all modules emitting or consuming cost data
- **Fallback Logic:** If table is unavailable, log to FallbackStore and emit SchemaEvents
- **Auditability:** All changes, fallbacks, and Codex enforcement events are logged and traceable

---

## Emotional Context & Codex Enforcement
- **Every field is emotionally annotated** for clarity, context, trust, resilience, or profitability
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
  "sessionId": "session_abc123",
  "promptType": "completion",
  "modelUsed": "gpt-4o",
  "operationType": "prompt",
  "costUSD": 0.012,
  "tokenCost": 0.011,
  "tokensUsed": 512,
  "retryCount": 0,
  "deliveryStatus": "success",
  "deliverySuccess": true,
  "placidOps": 0,
  "klaviyoSends": 0,
  "makeOperations": 0,
  "notes": "Standard prompt completion",
  "estimatedMargin": 0.008,
  "costPerSuccess": 0.012,
  "overageFlag": false,
  "anomalyFlag": false,
  "auditTrail": { "events": ["created"] }
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 