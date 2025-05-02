# ✅ File: `behavior-contract.md`  
@location: `/cursor/accelerators/zombie-hunter/behavior-contract.md`  
@purpose: Defines safe invocation structure, output guarantees, and misuse boundaries for agent logic  
@drop-type: Codex copy/paste-safe, LLM-invocable

```md
# 🧟 Behavior Contract – Zombie Hunter

@agent: zombie-hunter  
@version: v1.0.0  
@codex-lock: ✅ Enforced  
@last-reviewed: 2025-04-30  

---

## 🔐 Invocation Shape

```ts
type SessionSignalPayload = {
  sessionId: string
  revisionCount: number
  emotionScore: number
  outputDelta: number
  lastOutputs: string[]
  toneLabel: string
  copilotPresent: boolean
}
```

---

## 🧠 Agent Invocation

```ts
const result = await detectZombieSession(sessionSignals)
```

Returns:

```ts
type ZombieDetectionResult = {
  isZombie: boolean
  matchedPattern?: string
  reason?: string
  recommendation?: string
}
```

---

## ✅ Contract Guarantees

- Returns a structured response — never throws
- Runs read-only — no mutations unless pattern is matched
- If `isZombie: true`, triggers emit trace via `observability.ts`
- Cannot be called twice on the same session without state reset

---

## ❌ Misuse Boundaries

| Violation                        | Rejection Behavior                    |
|----------------------------------|----------------------------------------|
| Invalid payload shape            | Silent fail, returns `isZombie: false` |
| Missing sessionId                | Logs warning, skips execution          |
| Empty `lastOutputs[]`            | Skips repetition check only            |

---

## 🛠 Stability Rules

- Fully snapshot tested in `.spec.ts`  
- All logic is declarative (`zombie-detection-rules.jsonc`)  
- Copilot-safe, fallback-safe, replay-compatible  

---

```
