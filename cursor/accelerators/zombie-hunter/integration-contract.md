# ✅ File: `integration-contract.md`  
@location: `/cursor/accelerators/zombie-hunter/integration-contract.md`  
@purpose: Declares required input schema, persistent state keys, and fail-closed behavior  
@drop-type: Codex copy/paste-safe, schema-auditable

```md
# 📡 Integration Contract – Zombie Hunter

@agent: zombie-hunter  
@codex-version: v6.1.4  
@schema-status: ✅ Locked  
@contract-type: Declarative Pattern Detection  
@last-audited: 2025-04-30

---

## 🧾 Required Input Schema

This agent must receive a `SessionSignalPayload` with the following fields:

| Field               | Type     | Description                                    |
|---------------------|----------|------------------------------------------------|
| `revisionCount`     | number   | Total number of prompt retries in session      |
| `emotionScore`      | number   | Most recent emotional tone score (0–1)         |
| `outputDelta`       | number   | Semantic diff score from last output (0–1)     |
| `lastOutputs[]`     | string[] | Array of previous outputs (for repetition check) |
| `toneLabel`         | string   | System-assigned tone classification            |
| `sessionId`         | string   | Unique session identifier                      |
| `copilotPresent`    | boolean  | Whether Copilot is enabled for fallback assist |

---

## 🧠 Persistent State Keys

Zombie detection must persist the following to accelerator state:

| Key                          | Description                              |
|------------------------------|------------------------------------------|
| `zombie-hunter:lastTrace`    | Latest zombie evaluation report          |
| `zombie-hunter:confirmed`    | Boolean flag for session rescue trigger  |
| `zombie-hunter:patternMatch` | ID of the triggered stagnation pattern   |

---

## ❌ Fail-Closed Rules

| Violation                          | System Behavior                         |
|------------------------------------|------------------------------------------|
| Missing required input fields      | Abort detection silently (no crash)      |
| Malformed `lastOutputs[]`          | Skip repetition pattern check            |
| Undefined `emotionScore` or `delta`| Skip drift checks; log degraded trace    |
| Invalid sessionId or unknown state | Log warning; skip state write            |

---

## 📤 Emitted Trace Object

If zombie pattern is confirmed, this trace is emitted:

```ts
{
  sessionId: string,
  matchedPattern: string,
  emotionScore: number,
  outputDelta: number,
  revisionCount: number,
  triggeredBy: 'zombie-hunter',
  timestamp: string
}
```

---

```
