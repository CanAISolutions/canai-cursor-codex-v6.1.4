# 🧟 Zombie Hunter – Stagnation Detection & Recovery

**Module:** `zombie-hunter`  
**Status:** ✅ Codex Finalized – Snapshot-Safe  
**Last Verified:** 2025-04-30  
**Location:** `/cursor/accelerators/zombie-hunter/`

---

## 🧠 Purpose

Detects non-evolving prompt sessions (e.g. repeated revisions with flat emotional tone, no semantic change) and triggers safe recovery via Copilot guidance or `promptReplay`.

This engine ensures sessions never "die on the vine" — protecting user trust, emotional confidence, and fulfillment reliability.

---

## 🚨 Zombie Detection Rules

Defined in `zombie-detection-rules.jsonc`  
Patterns include:

| Pattern           | Triggers                                             |
|------------------|------------------------------------------------------|
| `no-change-loop` | 3+ identical outputs with ≥ 3 revisions              |
| `emotion-flatline` | Emotion score < 0.2 and no change after 2 revisions |
| `drift-deadzone` | outputDelta < 0.05 AND tone = flat                   |

> All thresholds are configurable. Detection is fully declarative and snapshot-safe.

---

## 🔁 Recovery Protocol

When a zombie session is confirmed:

1. Emit `zombie-session` trace via `sessionDeltaLogEmitter`
2. Call `triggerPromptReplay()` for safe regeneration
3. Optionally inject Copilot prompt:
   _“This may feel stuck. Want to explore a new path or tone?”_

---

## 📁 File Structure

| File                           | Purpose |
|--------------------------------|---------|
| `zombie-detection-rules.jsonc` | Pattern definitions + threshold limits |
| `zombie-rescue-engine.ts`      | Pattern evaluation + replay trigger |
| `zombie-rescue-engine.spec.ts` | Test suite for all zombie patterns |
| `stagnation-policy.md`         | Strategic UX/AI policy + escalation paths |
| `self-check-blocks.md`         | QA enforcement + regression guards |
| `README.md`                    | System summary + Codex checkpoint confirmation |

---

## 🧪 System Safety

| Guardrail                         | Method |
|-----------------------------------|--------|
| Output repetition protection      | `same-output-3x` detection |
| Emotion fatigue detection         | `emotionScore < min` |
| Tone deadzone detection           | `tone = flat` with drift < 5% |
| Excessive revision fallback       | Forced recovery at `maxRevisionCount` |

---

## 🤖 Copilot Integration

- Output-aware agent may call `detectZombieSession()` post-prompt  
- Injection strategy defined in `stagnation-policy.md`  
- Future upgrade: auto-suggest rewrite variant or reroute to `swarm-agents`

---

**Codex Lock:** ✅ Codex Finalized • Snapshot-Safe  
**Enforced by:** `self-check-blocks.md`, `stagnation-policy.md`  
**Change Policy:** Declarative only – no embedded rule logic allowed  
**Rescue Philosophy:**  
> “Dead prompts don’t speak. We resurrect them with precision, empathy, and action.”

