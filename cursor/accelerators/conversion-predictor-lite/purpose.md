# ✅ File: `purpose.md`  
@location: `/cursor/accelerators/conversion-predictor-lite/purpose.md`  
@purpose: Defines emotional and strategic intent of this agent  
@drop-type: Codex copy/paste-safe

```md
# 🧮 Conversion Predictor Lite

**Module ID:** `conversion-predictor-lite`  
**Layer:** Predictive UX Intelligence  
**Status:** ✅ Codex Finalized – Snapshot-Safe  
**Last Verified:** 2025-04-30

---

## 🎯 Purpose

Evaluates the likelihood that a generated output (email, CTA, subject line, social copy) will **convert** — using structured signal matching, pattern weights, and confidence scoring.

This module safeguards UX quality, enables prompt tuning, and empowers Copilots to auto-improve weak outputs before they harm the user journey.

---

## 🔍 Capabilities

| Feature                      | Description |
|------------------------------|-------------|
| CTA signal detection         | Matches phrases like “Get started” or “Claim now” |
| Passive language rejection   | Flags weak phrasing like “might help” or “let me know” |
| Emotion + urgency scoring    | Rewards resonance, penalizes neutrality |
| Confidence score             | Normalized 0.0–1.0 with verdict label |
| Copilot trace                | Explains which signals matched and why |
| Replay + analytics logging   | Emits `conversion-score` delta logs with full signal trace |

---

## 🚫 Failure Mode if Absent

- Prompts may be shipped that underperform silently
- Copilots cannot auto-improve outputs before friction occurs
- Feedback loops lose conversion signal truth
- Personalization + nudging systems become guesswork

> “Every piece of copy either deepens trust or dissolves it.  
> This engine ensures we only ship the kind that earns the click, wins the reply, or makes the sale.”
```
