# 🧪 Self-Check Blocks — `auto-rollback`

📍 Location: `/cursor/accelerators/auto-rollback/`
🔐 Codex Enforcement Layer: [Checkpoint 5 – Decay Prevention]

---

## ✅ Health Checks

| Check | Logic |
|-------|-------|
| `triggerConditions schema loadable` | Confirm `trigger-conditions.jsonc` parses and exposes all expected keys |
| `sessionDeltaLogEmitter attached` | Validate that `emitDeltaLog()` is defined and functional |
| `replayLastStablePrompt()` availability | Verify replay module exists and is callable |
| `agentVersion` declared | Must exist in top-level export for audit/tracking |
| `threshold sanity` | Ensure `deltaScoreThreshold < 1.0` and not undefined |

---

## 🧯 Fallback Triggers

| Condition | Action |
|-----------|--------|
| `triggerConditions file missing or invalid` | Disable rollback; raise internal log event: `autoRollback:fail:badConfig` |
| `replayLastStablePrompt throws` | Log failure; escalate to `self-healing` fallback pipeline |
| `currentDelta is NaN or null` | Abort rollback silently; return diagnostic message |
| `unknown trigger type received` | Log and continue, but tag `unknownTrigger` in delta log |

---

## 🔁 Repair Logic

If any self-check fails:

1. Log structured diagnostic to `SessionAnalytics` under tag: `selfCheckFail:rollback-engine`
2. Tag system state as `unstable:rollback`
3. Auto-ping `self-healing` with metadata payload:
```jsonc
{
  "agent": "auto-rollback",
  "status": "failing",
  "reason": "config_missing_or_invalid",
  "fallbackCandidate": true
}
