# ✅ File: `purpose.md`  
@location: `/cursor/accelerators/smart-prompt-score/purpose.md`  
@purpose: Declares strategic role and emotional reasoning behind scoring engine  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```md
# 🧠 Smart Prompt Score

@agent: smart-prompt-score  
@version: v1.0.0  
@codex-status: ✅ Finalized  
@snapshot: ✅ Safe  
@location: `/cursor/accelerators/smart-prompt-score/`

---

## 🎯 Purpose

This module provides a **composite quality score** for prompt outputs, using schema-bound emotional, structural, and behavioral traits.

It functions as CanAI’s **quality gatekeeper**:
- Capturing the **resonance, reuse likelihood, and clarity** of every prompt.
- Empowering Copilots to **auto-fix or retry weak outputs** before user frustration.
- Creating a **trustable signal for prompt excellence** across the platform.

---

## 💡 Capabilities

| Feature | Description |
|---------|-------------|
| Trait-based scoring | All weights and ranges are JSONC-declared |
| Emotion-aware engine | Measures tone and resonance impact |
| Copilot-safe | Pure function, snapshot-stable |
| Composite grade output | Returns `gold`, `pass`, or `fallback` |
| Replay + Delta trace ready | Logs revision delta and decision reason |

---

## 🚫 Failure Risk if Missing

- Copilots cannot differentiate strong vs weak prompts  
- Golden prompt curation becomes subjective  
- Revision loops go unmeasured  
- Emotional misalignment undetected  

---

> “Every great product has a feel. This engine captures the feel — in numbers.”  
```
