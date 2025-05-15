# RealTimeSentimentStream Schema

> **Purpose:** Captures real-time sentiment and emotional signals from user interactions, agent responses, and system events. Enables live analytics, adaptive UX, and emotional intelligence at the edge. Codex v6.1.4 compliant.

| Field Name       | Type      | Required | Default   | Emotional Role         | Fallback Logic / Notes                                                        |
|------------------|-----------|----------|-----------|-----------------------|-------------------------------------------------------------------------------|
| streamId         | string    | Yes      | (UUID)    | traceability          | If missing, generate UUID and log fallback event.                              |
| timestamp        | datetime  | Yes      | (now)     | timeliness            | If missing, use current system time and log fallback event.                    |
| source           | string    | Yes      | user      | context               | Default to 'user' and log fallback event. (user, agent, system, external)      |
| sentimentScore   | number    | Yes      | 0         | emotional intelligence| Default to 0 and log fallback event. Range: -1 (neg) to 1 (pos)                |
| emotionalTag     | string    | No       | neutral   | emotion               | Default to 'neutral' if missing. (e.g., joy, frustration, trust)               |
| contextScope     | string    | Yes      | session   | context               | Default to 'session' and log fallback event. (session, user, system, external) |
| codexEnforcement | object    | Yes      | {}        | audit                 | If missing, auto-populate with default enforcement object.                     |

---

**Codex Alignment:**
- All fields are emotionally annotated and include fallback logic.
- Table supports real-time analytics, emotional intelligence, and auditability.
- Schema is modular, operator-friendly, and ready for orchestration. 