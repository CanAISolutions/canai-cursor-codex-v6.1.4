# ImpactEventMap Schema

> **Purpose:** Maps all impact events (e.g., feedback, prompt, anomaly, milestone) to sessions, users, and system analytics. Enables impact analytics, event-driven orchestration, and emotional intelligence.

| Field           | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Fallback Logic / Notes |
|----------------|-----------|----------|-----------|---------------|------------------|---------------|-----------------------|
| impactEventId   | ULID      | Yes      | null      | identity      | internal         | global        | Block if missing, audit required |
| createdAt      | Timestamp | Yes      | now()     | traceability  | internal         | global        | Set to now() if missing |
| updatedAt      | Timestamp | Yes      | now()     | traceability  | internal         | global        | Set to now() if missing |
| sessionId      | string    | No       | null      | traceability  | internal         | session       | Allow null if not session-bound |
| userId         | string    | No       | null      | identity      | pii              | user          | Allow null if system-generated |
| eventType      | string    | Yes      | custom    | clarity       | internal         | event         | Allowed: feedback, prompt, anomaly, milestone, system, user-action, custom. Set to 'custom' if missing/invalid. |
| eventContext   | object    | No       | {}        | context       | internal         | event         | Set to empty object if missing |
| impactScore    | number    | No       | null      | impact        | internal         | event         | Allow null if not scored |
| impactDrivers  | object    | No       | {}        | clarity       | internal         | event         | Set to empty object if missing |
| emotionalTags  | array     | No       | []        | emotion       | internal         | event         | Set to empty array if missing |
| notes          | string    | No       | ""        | context       | internal         | event         | Allow empty string if missing |
| fallbackUsed   | boolean   | No       | false     | resilience    | internal         | event         | Set to false if missing |
| auditTrail     | object    | No       | {}        | traceability  | internal         | event         | Set to empty object if missing |

---

## Emotional Annotation
- All fields are emotionally annotated for clarity, trust, resilience, and traceability.
- Fallback logic is explicit for every field.

## Codex Safeguards
- No silent failures: all missing required fields trigger fallback or block creation.
- Audit trail is enforced for every record and change.
- Emotional context and fallback logic are first-class citizens.

## Operator Guidance
- eventType is now enumerated: feedback, prompt, anomaly, milestone, system, user-action, custom. Extend as orchestration evolves.
- Periodically audit for new event types or emotional tags. 