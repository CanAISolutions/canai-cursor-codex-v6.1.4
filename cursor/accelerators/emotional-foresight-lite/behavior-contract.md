# 🤝 Behavior Contract – Emotional Foresight Lite

This contract defines the guarantees, constraints, and system expectations for all agents or modules invoking `foresight-model-lite.ts`.

---

## Contract Scope

All consumers of this module must:

- Provide a valid session ID and emotion score history
- Expect zero output if signal thresholds are not met
- Assume outputs are predictive, not deterministic

---

## Input Requirements

| Field         | Type     | Description                               |
|---------------|----------|-------------------------------------------|
| `sessionId`   | string   | Unique identifier for the session         |
| `history`     | array    | List of emotionScore snapshots (last 3–5) |

---

## Output Behavior

- Returns an array of predicted emotional risk signals (e.g., `["escalating-frustration"]`)
- Does not modify any prompt directly
- Outputs are passed to `intervention-policy.md` for action selection

---

## Guarantees

✅ No mutation of prompt  
✅ No automatic replay  
✅ No hidden triggers — only returns predictions  
✅ Outputs log to `sessionDeltaLogEmitter` if any risk is detected

---

## Trigger Boundaries

This module must not run:
- On system boot
- Without emotionScore history
- More than once per prompt revision

---

## Failure Protocol

If `history` is missing, return `[]` and emit `foresight-skip` to logs.

---

## Copilot Affordance

This module is safe to invoke from:
- `smart-revision-loop.ts`
- `emotionalDriftPredictor.ts`
- UX fallback checkpoints

Safe call pattern:

```ts
const signals = predictEmotionalTrajectory(sessionId, emotionHistory)
```

---

This contract ensures foresight is **safe, declarative, and Copilot-upgradeable**.
