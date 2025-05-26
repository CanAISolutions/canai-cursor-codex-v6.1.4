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

| Field Name       | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Orchestration Notes                                                       | Codex Enforcement                                       |
|------------------|-----------|----------|-----------|----------------|------------------|---------------|---------------------------------------------------------------------------|--------------------------------------------------------|
| recordId         | String    | Yes      | ULID      | trust          | internal         | session       | Unique identifier for each cost log entry.                               | Auto-generated ULID. Audit trail required.            |
| timestamp        | DateTime  | Yes      | now()     | trust          | internal         | session       | When the cost was incurred.                                              | Auto-generated timestamp. Audit trail required.       |
| sessionId        | String    | Yes      | -         | trust          | internal         | session       | Links to the session that incurred the cost.                             | Must match existing session. Audit trail required.    |
| source           | String    | Yes      | -         | granularity    | internal         | session       | Source of the cost (e.g., GPT, Make, Airtable, Klaviyo).                | Must be from approved list. Audit trail required.     |
| operation        | String    | Yes      | -         | granularity    | internal         | session       | Specific operation that incurred the cost.                               | Descriptive string required. Audit trail required.    |
| costUSD          | Number    | Yes      | -         | trust          | internal         | session       | Cost in USD for this operation.                                          | Must be positive number. Audit trail required.        |
| tokens           | Number    | No       | null      | granularity    | internal         | session       | Number of tokens used (if applicable).                                   | Allow null if not token-based. Audit trail required.  |
| modelUsed        | String    | No       | null      | granularity    | internal         | session       | AI model or service used (e.g., GPT-4o, Make, Klaviyo).                 | Allow null if not model-based. Audit trail required.  |
| notes            | String    | No       | null      | context        | internal         | session       | Additional context or notes about the operation.                         | Optional descriptive text. Audit trail required.      |
| userId           | String    | No       | null      | trust          | internal         | session       | User ID if available (for user-specific cost tracking).                  | Allow null for anonymous sessions. Audit trail required. |
| promptType       | String    | No       | null      | granularity    | internal         | session       | Type of prompt that triggered the cost (if applicable).                  | Allow null for non-prompt operations. Audit trail required. |
| deliverySuccess  | Boolean   | No       | true      | trust          | internal         | session       | Whether the operation completed successfully.                             | Default to true. Audit trail required.                |
| klaviyoSends     | Number    | No       | 0         | granularity    | internal         | session       | Number of Klaviyo email sends.                                           | Set to 0 if missing. Audit trail required.            |
| makeOperations   | Number    | No       | 0         | granularity    | internal         | session       | Number of Make.com operations.                                           | Set to 0 if missing. Audit trail required.            |

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
  "recordId": "01HQ9X8K2M3N4P5Q6R7S8T9U0V",
  "timestamp": "2025-01-27T16:45:00.000Z",
  "sessionId": "01HQ9X8K2M3N4P5Q6R7S8T9U0W",
  "source": "GPT",
  "operation": "Business plan generation",
  "costUSD": 0.045,
  "tokens": 1200,
  "modelUsed": "gpt-4o",
  "notes": "Standard business plan prompt with emotional enrichment",
  "userId": "user_123",
  "promptType": "business_plan",
  "deliverySuccess": true,
  "klaviyoSends": 1,
  "makeOperations": 3
}
```

---

<!--
  Codex Principle: Every field is a contract. Every log is a memory. Every fallback is a hand extended in trust.
--> 