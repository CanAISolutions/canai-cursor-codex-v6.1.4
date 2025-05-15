# SessionRecoveryMap Schema

> **Purpose:** Maps all session recovery events, triggers, and outcomes for orchestration, analytics, and resilience. Enables traceability, emotional context, and auditability for session recovery flows.

| Field Name         | Type      | Required | Default     | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|-------------------|-----------|----------|-------------|---------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| recoveryId        | ULID      | Yes      | —           | identity      | internal         | global        | Primary key for SessionRecoveryMap records.                              | Block record creation if missing. Audit trail required.|
| sessionId         | String    | Yes      | —           | context       | internal         | session       | Foreign key to SessionAnalytics.sessionId for recovery linkage.          | Block record creation if missing. Audit trail required.|
| recoveryType      | String    | Yes      | auto        | clarity       | internal         | session       | Type of recovery (e.g., auto, manual, fallback, escalation).             | Set to 'auto' if missing. Audit trail required.        |
| triggerEvent      | String    | No       | null        | traceability  | internal         | session       | Event that triggered the recovery (e.g., anomaly, user-action, timeout). | Allow null if not event-triggered. Audit trail required.|
| recoveryStatus    | String    | Yes      | initiated   | resilience    | internal         | session       | Status of the recovery (e.g., initiated, in-progress, completed, failed).| Set to 'initiated' if missing. Audit trail required.   |
| recoveryTimestamp | Timestamp | Yes      | now()       | traceability  | internal         | session       | Timestamp for when the recovery was initiated.                           | Set to now() if missing. Audit trail required.         |
| resolvedTimestamp | Timestamp | No       | null        | traceability  | internal         | session       | Timestamp for when the recovery was resolved (if applicable).            | Allow null if not resolved. Audit trail required.      |
| recoveryOutcome   | String    | No       | null        | outcome       | internal         | session       | Outcome of the recovery (e.g., success, partial, failed, escalated).     | Allow null if not yet resolved. Audit trail required.  |
| notes             | String    | No       | ""          | context       | internal         | session       | Additional notes or context for the recovery event.                      | Allow empty string if missing. Audit trail required.   |
| auditTrail        | Object    | No       | {}          | traceability  | internal         | session       | Audit log for all changes and fallback events.                           | Set to empty object if missing. Audit trail required.  |

---

## Emotional Annotation
- All fields are emotionally annotated for clarity, resilience, traceability, and context.
- Fallback logic is explicit for every field.

## Codex Safeguards
- No silent failures: all missing required fields trigger fallback or block creation.
- Audit trail is enforced for every record and change.
- Emotional context and fallback logic are first-class citizens.

## Operator Guidance
- If ambiguity is detected in recoveryType, recoveryStatus, or recoveryOutcome taxonomy, flag for operator review and log in schema debt. 