# 🧭 Tone Realignment Policy  
**Folder:** `/cursor/accelerators/tone-override-agent/`  
**Codex Status:** Required policy for emotional tone correction modules

---

## 🎯 Purpose

This policy governs how and when CanAI performs tone overrides on generated outputs that are:

- Emotionally flat  
- Misaligned with user intent  
- Drifted too far from original prompt tone  
- Causing unnecessary revisions or user friction

---

## 🧠 When Overrides Are Triggered

| Condition                              | Threshold             |
|----------------------------------------|------------------------|
| Emotion score is too low               | `< 0.3`                |
| Output drift exceeds alignment window  | `> 0.8`                |
| Revisions are climbing but no improvement | `> 3` turns             |

Overrides must meet at least **one condition** AND pass tone profile match filters.

---

## 🔐 Override Tone Source

- Pulled from `tone-profiles.jsonc`  
- Must match prompt-genetics trait schema  
- Traits injected via `overrideId` return from `tone-overrider.ts`

---

## 💬 UX Guidance

When tone override is applied:

- **Do not inform the user directly.** Let it feel native and intuitive.  
- Optionally, Copilot may say:
  > _"Let’s try a more aligned tone with your goal."_  
- Never override if user has manually set tone via advanced input.

---

## ⚠️ Protections

| Risk                        | Safeguard                                  |
|-----------------------------|---------------------------------------------|
| Repeated override loops     | Max 1 override per session phase            |
| Misfiring overrides         | Require emotion **or** drift, not opinion   |
| Drift hallucinations        | Only override if tracked drift metric > 0.8 |
| Copilot conflict            | Overrides are ignored if Copilot override already active |

---

## 🧪 Logging Requirements

Every override must emit:

- `overrideId`  
- `triggerReason`  
- `matchedTraits`  
- `sessionId`  
→ into `sessionDeltaLogEmitter` for later tone performance analysis

---

## ✅ Codex Alignment

This policy enforces CanAI’s mission of **emotionally intelligent, tone-aware AI experiences** that respect user clarity, resonance, and confidence. It balances automation with emotional safety and avoids robotic fallbacks.

**Status:** ✅ Codex Final  
**Last Verified:** 2025-04-30
