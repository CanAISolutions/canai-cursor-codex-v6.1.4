# CustomerJourneyStep Schema

> **Purpose:** Logs each step in the customer journey, including emotional state, friction points, and engagement signals. Enables granular journey analytics, root cause analysis, and targeted improvements. Codex v6.1.4 compliant.

| Field Name         | Type      | Required | Default   | Emotional Role   | Fallback Logic / Notes                                                        |
|--------------------|-----------|----------|-----------|------------------|-------------------------------------------------------------------------------|
| journeyId          | string    | Yes      | (UUID)    | traceability     | If missing, generate UUID and log fallback event.                              |
| userId             | string    | Yes      | (PII)     | identity         | If missing, flag for operator review.                                          |
| stepType           | string    | Yes      | unknown   | context          | Default to 'unknown' and log fallback event.                                   |
| timestamp          | datetime  | Yes      | (now)     | timeliness       | If missing, use current system time and log fallback event.                    |
| emotionalState     | string    | No       | neutral   | emotion          | Default to 'neutral' if missing.                                               |
| frictionScore      | number    | No       | 0         | friction         | Default to 0 if missing. Range: 0 (none) to 10 (high friction)                 |
| nextBestAction     | string    | No       | review    | guidance         | Default to 'review' if missing.                                                |
| codexEnforcement   | object    | Yes      | {}        | audit            | If missing, auto-populate with default enforcement object.                     |

---

**Codex Alignment:**
- All fields are emotionally annotated and include fallback logic.
- Table supports journey analytics, emotional intelligence, and auditability.
- Schema is modular, operator-friendly, and ready for orchestration. 