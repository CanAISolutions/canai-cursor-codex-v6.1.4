# 🧠 Swarm Agent Decision Protocol

Defines how outputs are scored, selected, or retried based on agent collaboration.

---

## 🛠️ Modes

| Mode                | Behavior                                          |
|---------------------|---------------------------------------------------|
| parallel-vote       | All agents run in parallel → `output-evaluator` picks best |
| sequential-refine   | Agents run in series → each modifies the prior's output |
| fallback-cascade    | Primary agent runs → fallback triggered only if confidence < threshold |

---

## ✅ Quorum Logic

- Voting agent required in `parallel-vote`
- If scores converge within 5%, use tone-matched
- If fallback triggers 2x → inject human Copilot suggestion

---

## 🧪 Safety Layer

All swarm outputs must log:
- agent ID
- output confidence
- emotional tone
- drift delta (if available)

→ Logged via `sessionDeltaLogEmitter`

---

## Future Upgrade

→ Replace static agent list with dynamic agent orchestration from Codex config  
→ Implement adaptive swarm size based on UX fatigue or prompt ambiguity
