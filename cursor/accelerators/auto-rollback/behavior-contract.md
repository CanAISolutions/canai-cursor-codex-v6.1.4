# 🤖 Behavior Contract — `auto-rollback`

📍 Location: `/cursor/accelerators/auto-rollback/`
🔒 Codex Checkpoint Class: [Fail-Safe Accelerator]

---

## 🧠 Purpose

The `auto-rollback` module exists to **restore platform integrity** when critical failure conditions are detected. It acts as the **reflex safeguard** against:
- Prompt corruption
- Agent drift
- Emotional derailment
- Broken modularity
- Manual override by operator or fallback logic

It ensures CanAI remains stable, deterministic, and emotionally safe — even under degradation, mutation, or downstream agent failure.

---

## 🔁 Inputs

| Field | Type | Description |
|-------|------|-------------|
| `sessionId` | `string` | Unique session identifier to locate user state |
| `currentDelta` | `number` | Calculated prompt output delta score |
| `triggerLog` | `string[]` | List of flags like `'emotionalDrift'`, `'manualOverride'`, etc. |

Inputs are passed to `initiateRollback()` and interpreted against schema in `trigger-conditions.jsonc`.

---

## 🎯 Outputs

- `string` message describing whether rollback was triggered or skipped
- Side-effect: call to `emitDeltaLog()` with `rollback_initiated`, `rollback_skipped`, or `rollback_completed`
- Replay of prompt via `replayLastStablePrompt()` if triggered

All outputs are traceable through `SessionAnalytics`.

---

## 🚧 Constraints

- Must only activate on verified triggers
- Must not rollback if all trigger thresholds are below limits
- Must never delete or overwrite user-generated state
- Cannot perform rollback recursively

---

## 🔁 Mutation Policy

| Field | Value |
|-------|--------|
| `agentVersion` | `1.0.0` |
| `mutationAllowed` | `false` |
| `rollbackAllowed` | `true` |
| `self-repair` | Delegates to `self-healing` if replay fails |

This module must be **immutable** unless explicitly versioned. All mutations must be documented in `promptDeltaLog` and tagged with `rollback-engine`.

---

## 📡 Dependencies

| Module | Role |
|--------|------|
| `trigger-conditions.jsonc` | Holds thresholds and logic flags |
| `promptReplay.ts` | Executes stable-state restore |
| `sessionDeltaLogEmitter.ts` | Logs all rollback-related events |
| `output-delta-analyzer.ts` | Downstream analyzer of drift |

---

## 🧠 Codex Compatibility Notes

- Fully copilot-parsable (typed I/O, consistent naming, decoupled logic)
- Must always emit explicit rollback logs for visibility
- Never silent — this module is audit-critical

---

✅ Complies with:  
- Dream-State Checkpoints 1–7  
- Prompt Infrastructure Upgrade Mandates  
- Cursor AI Code Coauthor Standard (`.cursorrules` aligned)

---

> This module is a guardian. If it fails silently, CanAI fails loudly.  
> Its clarity, reliability, and codified logic are not optional — they are the spine of systemic trust.
