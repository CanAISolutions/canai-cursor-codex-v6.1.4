```markdown
# 🔁 Auto-Rollback Policy — CanAI Cursor Framework

📍 Location: `/cursor/accelerators/auto-rollback/`  
🔐 Codex Enforcement Class: [Resilience Control Layer]  
🧠 Version: `v1.0.0`

---

## 🧠 Purpose

This policy defines how the `auto-rollback` agent evaluates, prioritizes, and executes system reversions within the Cursor cockpit of CanAI.

Its goal: ensure **resilience without regression**, **rollback without data loss**, and **clarity without confusion**.

---

## 🧬 Rollback Types

| Type | Description | Use Case |
|------|-------------|----------|
| `Soft Rollback` | Revert only a specific agent or prompt module | Drift in `swarm-agents` or bad revision |
| `Hard Rollback` | Revert full session state + delta logs | Major corruption, emotion breach, memory fault |
| `Hybrid Rollback` | Attempt modular fix; fallback to snapshot if unresolved | Best-effort repair fails |

---

## 🔁 Policy Logic (Codified)

```
IF deltaScore > deltaScoreThreshold
  AND emotionalDrift ∈ triggerLog
  THEN trigger Hard Rollback

IF modularityBreak is detected
  AND deltaScore < 0.75
  THEN attempt Soft Rollback first

IF self-healing replay fails
  THEN escalate to Hybrid Rollback

IF Copilot present AND rollback is not urgent
  THEN request Copilot confirmation

IF 'manualOverride' is detected
  THEN bypass Copilot and trigger rollback
```

---

## 🧠 Mutation Safety

| Field | Rule |
|-------|------|
| `promptState` | Reverted only via `replayLastStablePrompt()` — safe |
| `deltaLog` | Never deleted, only appended |
| `memory.conflictMap` | Flagged but not overwritten |
| `userInputs` | Immutable — rollback must never modify them |

---

## ✅ Enforcement Rules

- All rollbacks **must** be logged using `emitDeltaLog()`  
- All events tagged with `agentVersion`, rollback type, and trigger reason  
- All failed replays tagged in `SessionAnalytics` for weekly QA  

---

## 🤖 Copilot Interaction

If rollback is initiated during a Copilot-led session, inject:

```
⚠️ System degradation detected. Rollback triggered to ensure integrity.
Review delta log and resume safely.
```

Post-recovery prompt (regeneration-aware):

```
System reverted. Regenerate this session with delta awareness enabled?
```

---

## 📦 System Integration

| Module | Role |
|--------|------|
| `output-delta-analyzer.ts` | Calculates drift delta score |
| `promptReplay.ts` | Executes full or partial prompt state restore |
| `sessionRefactorLogWriter.ts` | Logs QA signals for failed replays |
| `self-check-blocks.md` | Monitors readiness of rollback components |

---

✅ Codex Checkpoints Met:
- ✅ Fail-Safe Engineering  
- ✅ Full Validation  
- ✅ Copilot Native  
- ✅ Mutation-Safe  
- ✅ Emotion-Sensitive  
- ✅ Audit-Aware  
- ✅ Regeneration-Ready

---

> This policy is not passive documentation.  
> It is **operational law** — ensuring CanAI never forgets, breaks, or regresses silently.
```
