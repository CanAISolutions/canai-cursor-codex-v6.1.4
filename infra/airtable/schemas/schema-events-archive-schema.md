# SchemaEventsArchive Schema

> **Purpose:** Archives all schema event records for long-term audit, drift analysis, and compliance. Enables traceability, resilience, and emotional context for schema evolution.

| Field           | Type      | Required | Default           | Emotional Role | Data Sensitivity | Context Scope | Fallback Logic / Notes |
|----------------|-----------|----------|-------------------|---------------|------------------|---------------|-----------------------|
| archiveId      | ULID      | Yes      | null              | identity      | internal         | global        | Block if missing, audit required |
| archivedAt     | Timestamp | Yes      | now()             | traceability  | internal         | global        | Set to now() if missing |
| archiveReason  | string    | Yes      | retention-policy  | clarity       | internal         | event         | Set to 'retention-policy' if missing. **Ambiguity:** Taxonomy may need operator review |
| originalEventId| ULID      | Yes      | null              | traceability  | internal         | event         | Block if missing, audit required |
| eventType      | string    | Yes      | null              | clarity       | internal         | event         | Block if missing, audit required |
| tableName      | string    | Yes      | null              | context       | internal         | event         | Block if missing, audit required |
| fieldName      | string    | No       | null              | context       | internal         | event         | Allow null if not field-specific |
| eventPayload   | object    | No       | {}                | traceability  | internal         | event         | Set to empty object if missing |
| actorId        | string    | No       | null              | identity      | internal         | event         | Allow null if system-generated |
| notes          | string    | No       | ""                | context       | internal         | event         | Allow empty string if missing |
| auditTrail     | object    | No       | {}                | traceability  | internal         | event         | Set to empty object if missing |

---

## Emotional Annotation
- All fields are emotionally annotated for clarity, trust, resilience, and traceability.
- Fallback logic is explicit for every field.

## Codex Safeguards
- No silent failures: all missing required fields trigger fallback or block creation.
- Audit trail is enforced for every record and change.
- Emotional context and fallback logic are first-class citizens.

## Operator Guidance
- archiveReason taxonomy may need periodic review for new archive drivers (e.g., legal, migration, drift, operator request).
- Periodically audit for new event types or emotional tags. 