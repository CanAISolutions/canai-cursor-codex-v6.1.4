# ✅ File: `purpose.md`  
@location: `/cursor/accelerators/emotional-foresight-lite/purpose.md`  
@purpose: Defines the strategic and emotional intelligence role of this module  
@drop-type: Codex copy/paste-safe, Cursor-aligned

```md
# 🧠 Emotional Foresight Lite

**Agent ID:** `emotional-foresight-lite`  
**Codex Status:** 🟡 Finalizing  
**Purpose:** Detect future emotional degradation or uplift risk based on live session signals.

---

## 🎯 Purpose

This module forecasts emotional shifts in a user session before they visibly occur.  
It acts as a **sentiment sentinel** — predicting frustration, disengagement, or breakthrough moments using deltas, tone signals, and revision loops.

Its primary value is **preemptive UX recovery**: flagging tone loss before the user does, and enabling Copilot or system fallbacks to maintain trust.

---

## 💡 Capabilities

| Capability | Description |
|------------|-------------|
| Emotional signal trend analysis | Reads tone shift, clarity collapse, or drift indicators |
| Risk zone prediction | Outputs `low-risk`, `at-risk`, or `degrading` labels |
| Trigger routing | Sends fallback instructions to Copilot or session manager |
| Threshold-based config | Driven by declarative `emotion-signal-spec.jsonc` |
| Embedding-optional | No LLM dependency; fully heuristic, upgradeable later |

---

## 🔁 System Hooks

| Module | Function |
|--------|----------|
| `sessionDeltaLogEmitter.ts` | Logs signal and foresight score |
| `output-delta-analyzer.ts` | Provides tone/clarity drift deltas |
| `emotionDriftJournal.ts` | Tracks historical tone volatility |
| `promptReplay.ts` | Optionally invoked during session fallback |

---

## 🚫 Failure Mode if Missing

- User hits emotional wall with no system reaction  
- Tone loss or clarity fatigue go undetected  
- Copilot loses trustworthiness as session context degrades  
- Retention and recommendation rates silently drop

---

> "Foresight doesn’t react. It protects.  
> It’s the guardian of emotional flow — the heartbeat before the heartbeat breaks."

---
```
