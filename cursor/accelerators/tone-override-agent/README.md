# 🎯 Tone Override Agent  
**Module Path:** `/cursor/accelerators/tone-override-agent/`  
**Codex Status:** ✅ Codex Finalized • Last Verified: 2025-04-30  
**Purpose:** Automatically suggest tone realignment when emotional quality or output alignment degrades

---

## 🧠 Strategic Role

This agent acts as a **precision failsafe** to correct emotionally flat, misaligned, or drifted prompt outputs — without interrupting flow. It ensures:

- Emotionally resonant first outputs  
- Smoother recovery after zombie detection or fallback cascades  
- Reduced revision fatigue via tone-corrected scaffolds  
- Alignment with CanAI’s tone-clarity and emotional-resonance guarantees

---

## 📁 File Summary

| File                             | Purpose                                                            |
|----------------------------------|---------------------------------------------------------------------|
| `tone-overrider.ts`              | Core logic to evaluate if override is needed based on signal input |
| `tone-overrider.spec.ts`         | Full test suite — drift, emotion, revision count triggers          |
| `tone-profiles.jsonc`            | Declarative trait sets for override candidates                     |
| `behavior-contract.md`           | Enforces Copilot-safe invocation, misuse prevention                |
| `self-check-blocks.md`           | QA checklist + coevolution audit report                            |
| `tone-realignment-policy.md`     | Strategic reasoning and UX override philosophy                     |

---

## 🚦 Trigger Conditions

Tone overrides are only considered when:

- `emotionScore < 0.3`  
- OR `outputDrift > 0.8`  
- AND `revisionCount ≤ 3`

Overrides are **optional**, non-invasive, and must pass `tone-profiles.jsonc` trait filters.

---

## 🧪 Safety Systems

- 🧤 Override never runs twice in same session  
- 🔁 All suggestions are optional unless Copilot flags forced assist  
- 🧠 Profiles are LLM-readable and follow prompt-genetics schema  
- 📤 Emissions go to `sessionDeltaLogEmitter` with `overrideId` + `reason`

---

## 🤖 Copilot Integration

This module is often used by:

- `CopilotFeedbackAgent`  
- `zombie-hunter` recovery  
- `promptReplay` UX enhancer  
- `smart-prompt-score` intercept path

---

## ✅ Codex Snapshot Lock:  
- Emotion-safe  
- Drift-stable  
- Declarative  
- Test-covered  
- Evolve-safe  
- Production-ready

**Status:** ✅ Codex Locked – Snapshot-Safe  
**Last Verified:** 2025-04-30
