# LifecycleTriggers Schema

> **Purpose:** Captures all lifecycle event triggers (e.g., onboarding, upgrade, churn, reactivation, milestone) for sessions, users, and system analytics. Enables lifecycle analytics, event-driven orchestration, and emotional intelligence.

| Field           | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Fallback Logic / Notes |
|----------------|-----------|----------|-----------|---------------|------------------|---------------|-----------------------|
| triggerId      | ULID      | Yes      | null      | identity      | internal         | global        | Block if missing, audit required |
| createdAt      | Timestamp | Yes      | now()     | traceability  | internal         | global        | Set to now() if missing |
| updatedAt      | Timestamp | Yes      | now()     | traceability  | internal         | global        | Set to now() if missing |
| sessionId      | string    | No       | null      | traceability  | internal         | session       | Allow null if not session-bound |
| userId         | string    | No       | null      | identity      | pii              | user          | Allow null if system-generated |
| triggerType    | string    | Yes      | generic   | clarity       | internal         | event         | Set to 'generic' if missing. **Ambiguity:** Trigger type taxonomy may need operator review |
| triggerContext | object    | No       | {}        | context       | internal         | event         | Set to empty object if missing |
| lifecycleStage | string    | No       | null      | context       | internal         | event         | Allow null if not classified. **Ambiguity:** Stage taxonomy may need operator review |
| emotionalTags  | array     | No       | []        | emotion       | internal         | event         | Set to empty array if missing |
| notes          | string    | No       | ""        | context       | internal         | event         | Allow empty string if missing |
| fallbackUsed   | boolean   | No       | false     | resilience    | internal         | event         | Set to false if missing |
| auditTrail     | object    | No       | {}        | traceability  | internal         | event         | Set to empty object if missing |

---

## Emotional Annotation
- All fields are emotionally annotated for clarity, trust, resilience, and traceability.
- Fallback logic is explicit for every field.
- **Ambiguity flagged:** Trigger type and lifecycle stage taxonomy may require operator review for future-proofing.

## Codex Safeguards
- No silent failures: all missing required fields trigger fallback or block creation.
- Audit trail is enforced for every record and change.
- Emotional context and fallback logic are first-class citizens.

## Operator Guidance
- Review and extend triggerType and lifecycleStage values as orchestration evolves.
- Periodically audit for new event types or emotional tags. 