# AgentActions Schema

> **Purpose:** Tracks all agent actions, decisions, and evolution logic for Codex orchestration, audit, and improvement. Enables traceability, auditability, and continuous improvement of agent autonomy, self-healing, and Codex contract enforcement.

| Field Name           | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|---------------------|-----------|----------|-----------|---------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| actionId            | ULID      | Yes      | —         | identity      | internal         | global        | Primary key for AgentActions records.                                    | Block record creation if missing. Audit trail required.|
| timestamp           | Timestamp | Yes      | now()     | traceability  | internal         | global        | Timestamp for action creation.                                           | Set to now() if missing. Audit trail required.         |
| agentName           | String    | Yes      | —         | identity      | internal         | event         | Name of the agent performing the action.                                 | Block record creation if missing. Audit trail required.|
| triggerType         | String    | Yes      | —         | clarity       | internal         | event         | Type of trigger (e.g., user, system, schedule, feedback, self-heal).     | Block record creation if missing. Audit trail required.|
| affectedTable       | String    | No       | null      | context       | internal         | event         | Name of the table affected by the action.                                | Allow null if not table-specific. Audit trail required.|
| actionDescription   | String    | Yes      | —         | clarity       | internal         | event         | Description of the action performed by the agent.                        | Block record creation if missing. Audit trail required.|
| fallbackUsed        | Boolean   | No       | false     | resilience    | internal         | event         | Indicates if fallback logic was triggered for this action.               | Set to false if missing. Audit trail required.         |
| revisionGenerated   | Boolean   | No       | false     | improvement   | internal         | event         | Flag if the action generated a revision (e.g., prompt revision).         | Set to false if missing. Audit trail required.         |
| codexRuleApplied    | String    | No       | null      | trust         | internal         | event         | Codex rule or contract applied during the action.                        | Allow null if not rule-based. Audit trail required.    |
| outputDelta         | Number    | No       | 0.0       | impact        | internal         | event         | Delta or change in output as a result of the action.                     | Set to 0.0 if missing. Audit trail required.           |
| confidenceScore     | Number    | No       | 1.0       | confidence    | internal         | event         | Confidence score for the action (0.0–1.0).                               | Set to 1.0 if missing. Audit trail required.           |
| autonomyLevel       | String    | No       | operator  | autonomy      | internal         | event         | Level of agent autonomy (e.g., operator, co-pilot, autonomous).          | Set to 'operator' if missing. Audit trail required.    |
| emotionalImpactTag  | String    | No       | null      | emotion       | internal         | event         | Tag for emotional impact (e.g., trust, delight, frustration).            | Allow null if not tagged. Audit trail required.        |
| agentPersona        | String    | No       | null      | persona       | internal         | event         | Persona or archetype of the agent (e.g., Sentinel, Operator, Guide).     | Allow null if not persona-specific. Audit trail required.|
| resonanceShift      | Number    | No       | 0.0       | empathy       | internal         | event         | Change in resonance or emotional alignment as a result of the action.    | Set to 0.0 if missing. Audit trail required.           |
| selfHealFlag        | Boolean   | No       | false     | resilience    | internal         | event         | Flag if the action was part of a self-healing or recovery process.       | Set to false if missing. Audit trail required.         |
| auditTrail          | Object    | No       | {}        | traceability  | internal         | event         | Audit log for all changes and fallback events.                           | Set to empty object if missing. Audit trail required.  |

---

## Emotional Annotation
- All fields are emotionally annotated for clarity, trust, resilience, and traceability.
- Fallback logic is explicit for every field.

## Codex Safeguards
- No silent failures: all missing required fields trigger fallback or block creation.
- Audit trail is enforced for every record and change.
- Emotional context and fallback logic are first-class citizens.

## Operator Guidance
 