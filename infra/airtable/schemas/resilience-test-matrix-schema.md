# ResilienceTestMatrix Schema

> **Purpose:** Catalogs all resilience tests, scenarios, and outcomes for orchestration, analytics, and system health. Enables traceability, resilience, and auditability for resilience-driven flows.

| Field Name       | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|------------------|-----------|----------|-----------|---------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| testId           | ULID      | Yes      | —         | identity      | internal         | global        | Primary key for ResilienceTestMatrix records.                            | Block record creation if missing. Audit trail required.|
| testName         | String    | Yes      | —         | clarity       | internal         | test          | Name or label for the resilience test.                                   | Block record creation if missing. Audit trail required.|
| testType         | String    | Yes      | system    | clarity       | internal         | test          | Type of test (e.g., system, user, fallback, chaos, recovery).            | Set to 'system' if missing. Audit trail required.      |
| testScenario     | String    | No       | null      | context       | internal         | test          | Description or reference to the test scenario.                           | Allow null if not scenario-based. Audit trail required.|
| expectedOutcome  | String    | Yes      | —         | outcome       | internal         | test          | Expected result or behavior for the test.                                | Block record creation if missing. Audit trail required.|
| actualOutcome    | String    | No       | null      | outcome       | internal         | test          | Actual result or behavior observed during the test.                      | Allow null if not yet executed. Audit trail required.  |
| testStatus       | String    | Yes      | pending   | resilience    | internal         | test          | Status of the test (e.g., pending, running, passed, failed, skipped).    | Set to 'pending' if missing. Audit trail required.     |
| testTimestamp    | Timestamp | Yes      | now()     | traceability  | internal         | test          | Timestamp for when the test was executed or scheduled.                   | Set to now() if missing. Audit trail required.         |
| notes            | String    | No       | ""        | context       | internal         | test          | Additional notes or context for the test event.                          | Allow empty string if missing. Audit trail required.   |
| auditTrail       | Object    | No       | {}        | traceability  | internal         | test          | Audit log for all changes and fallback events.                           | Set to empty object if missing. Audit trail required.  |

---

## Emotional Annotation
- All fields are emotionally annotated for clarity, resilience, traceability, and context.
- Fallback logic is explicit for every field.

## Codex Safeguards
- No silent failures: all missing required fields trigger fallback or block creation.
- Audit trail is enforced for every record and change.
- Emotional context and fallback logic are first-class citizens.

## Operator Guidance
- If ambiguity is detected in testType, testStatus, or outcome taxonomy, flag for operator review and log in schema debt. 