# EmotionTriggerBank Schema

> **Purpose:** Catalogs all emotion triggers, tags, and sources for orchestration, analytics, and emotional intelligence. Enables traceability, emotional context, and auditability for emotion-driven flows.

| Field Name       | Type      | Required | Default   | Emotional Role | Data Sensitivity | Context Scope | Description / Orchestration Notes                                         | Codex Enforcement                                      |
|------------------|-----------|----------|-----------|---------------|------------------|---------------|-------------------------------------------------------------------------|--------------------------------------------------------|
| triggerId        | ULID      | Yes      | —         | identity      | internal         | global        | Primary key for EmotionTriggerBank records.                              | Block record creation if missing. Audit trail required.|
| emotionTag       | String    | Yes      | —         | emotion       | internal         | session       | Emotion label or tag (e.g., trust, delight, frustration, anticipation).  | Block record creation if missing. Audit trail required.|
| triggerType      | String    | Yes      | system    | clarity       | internal         | session       | Type of trigger (e.g., system, user, feedback, anomaly, milestone).      | Set to 'system' if missing. Audit trail required.      |
| triggerSource    | String    | No       | null      | traceability  | internal         | session       | Source of the trigger (e.g., PromptLogs, FeedbackLogs, analytics).       | Allow null if unknown. Audit trail required.           |
| triggerContext   | Object    | No       | {}        | context       | internal         | session       | Additional context for the trigger (e.g., event details, user state).    | Set to empty object if missing. Audit trail required.  |
| triggeredAt      | Timestamp | Yes      | now()     | traceability  | internal         | session       | Timestamp for when the emotion trigger was detected.                     | Set to now() if missing. Audit trail required.         |
| triggerStrength  | Number    | No       | 1.0       | impact        | internal         | session       | Strength or confidence of the trigger (0.0–1.0).                         | Set to 1.0 if missing. Audit trail required.           |
| notes            | String    | No       | ""        | context       | internal         | session       | Additional notes or context for the emotion trigger event.               | Allow empty string if missing. Audit trail required.   |
| auditTrail       | Object    | No       | {}        | traceability  | internal         | session       | Audit log for all changes and fallback events.                           | Set to empty object if missing. Audit trail required.  |

---

## Emotional Annotation
- All fields are emotionally annotated for clarity, emotion, traceability, and context.
- Fallback logic is explicit for every field.

## Codex Safeguards
- No silent failures: all missing required fields trigger fallback or block creation.
- Audit trail is enforced for every record and change.
- Emotional context and fallback logic are first-class citizens.

## Operator Guidance
- If ambiguity is detected in emotionTag or triggerType taxonomy, flag for operator review and log in schema debt. 