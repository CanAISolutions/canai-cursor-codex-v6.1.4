# CostAnomalyTriggers Schema (Codex v6.1.4)

> **Purpose:** Detect, log, and resolve cost anomalies for margin protection and operational resilience. All fields are Codex-compliant, emotionally annotated, and include fallback logic and audit trails.

| Field              | Type      | Required | Default      | Emotional Role         | Data Sensitivity | Context Scope                | Orchestration Notes                                      | Codex Enforcement                        | Fallback Logic                        | Audit Trail                  |
|--------------------|-----------|----------|--------------|-----------------------|------------------|------------------------------|---------------------------------------------------------|------------------------------------------|---------------------------------------|------------------------------|
| anomalyId          | string    | Yes      | —            | identifier, traceability | low             | system-wide                  | Primary key for anomaly event.                          | must be unique, non-empty                | auto-generate UUID if missing         | creation, update, resolution |
| anomalyType        | string    | Yes      | cost_spike   | categorization, urgency  | medium          | cost, performance, security  | Type of anomaly detected (cost_spike, margin_drop, etc.)| must match allowed types                 | default to 'cost_spike' if unrecognized| creation, update             |
| triggeredAt        | datetime  | Yes      | —            | timing, urgency          | low             | system-wide                  | Timestamp when anomaly was triggered.                   | must be ISO8601, non-null                | use current system time if missing    | creation                     |
| thresholdValue     | number    | Yes      | —            | risk, alert              | medium          | cost, margin, tokens         | Threshold that triggered the anomaly.                   | must be > 0                              | set to system default if missing      | creation, update             |
| actualValue        | number    | Yes      | —            | impact, urgency          | medium          | cost, margin, tokens         | Actual value observed at trigger time.                  | must be >= thresholdValue                | set to thresholdValue if missing      | creation                     |
| promptType         | string    | No       | —            | context, traceability     | low             | prompt, session              | Type of prompt associated with anomaly.                 | optional, must match known prompt types  | null if not applicable                | creation                     |
| tokenCount         | number    | No       | —            | scale, impact             | medium          | tokens, cost                 | Token count at anomaly event.                           | optional, must be >= 0                   | 0 if missing                          | creation                     |
| fallbackTriggered  | boolean   | Yes      | false        | resilience, safety        | low             | system, session              | Indicates if fallback logic was triggered.              | must be boolean                          | false if missing                      | creation, update             |
| resolutionStatus   | string    | Yes      | unresolved   | closure, assurance        | low             | system, audit                | Current status (unresolved, investigating, resolved, false_positive). | must match allowed statuses | unresolved if missing                  | creation, update, resolution |
| auditTrail         | array     | No       | []           | traceability, compliance  | medium          | system, audit                | Log of all actions taken on this anomaly.               | must be array of audit events            | empty array if missing                | all actions                  |

---

**Codex Safeguards:**
- All fields include fallback logic and audit trails.
- Emotional context and data sensitivity are explicit for every field.
- Schema is modular, versioned, and ready for orchestration.
- No schema debt detected. Recommend periodic review for new triggers or context scopes. 