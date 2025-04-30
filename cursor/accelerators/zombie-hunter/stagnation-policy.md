# 🧟 Stagnation Detection & Recovery Policy

**Module:** `zombie-hunter`  
**Codex Version:** v6.1.4  
**Scope:** Defines how CanAI identifies and resolves “zombie” prompt sessions — sessions that are revising without meaningful change, emotional improvement, or directional progress.

---

## 🧠 Definition: What Is Prompt Stagnation?

A prompt session is considered “zombie” if it meets **any** of the following:

| Condition                         | Meaning |
|-----------------------------------|---------|
| Same output rendered ≥ 3 times    | No change loop — system stuck in repetition |
| Emotion score consistently < 0.2  | Tone is flat, dead, or emotionally disconnected |
| Output drift < 5% over revisions  | No semantic evolution across retries |
| Revision count > 5                | Excessive retries with no exit path |

These signals suggest that the user is either **not satisfied** or the system is **failing to evolve meaningfully**.

---

## 🚨 Why It Matters

Stagnation silently erodes trust.  
If not detected early, it causes:

- User confusion (“why isn’t this changing?”)  
- Output fatigue (“this feels repetitive…”)  
- Drop-off from unresolved needs  
- Support requests, refunds, or loss of confidence

---

## 🛠️ System Action on Detection

When a zombie state is detected:

| Action                          | Trigger Point |
|----------------------------------|---------------|
| Emit `zombie-session` log        | Any matched pattern or revision overflow |
| Trigger `promptReplay()`         | Immediate UX repair |
| Suggest `tone swap` or `fallback agent` | If emotional flatline or semantic stall |
| Copilot prefill w/ rewrite hints | Inject a new direction or default prompt variant |

---

## 🧪 Session Triggers

Managed via: `zombie-detection-rules.jsonc`  
Evaluated inside: `zombie-rescue-engine.ts`

Supported patterns include:

- `no-change-loop`  
- `emotion-flatline`  
- `drift-deadzone`

Each pattern maps to a specific recovery tactic, enforced by `triggerPromptReplay()` or Copilot injection.

---

## 🔒 Codex Safeguards

- Declarative patterns = evolvable by Copilot  
- `self-check-blocks.md` prevents stale or invalid conditions  
- `zombie-rescue-engine.spec.ts` snapshot tests enforce regression safety  
- All rescues are logged to `PromptLogs`, `SessionAnalytics`, and `sessionDeltaLogEmitter`

---

## 💡 Future Enhancements

- Copilot mood tracker → detect user frustration signals  
- “Dead prompt” graveyard → track repeated fails by content type  
- Emotion rebuilder agent → inject optimism or energy upon replay  

---

**CanAI Stance:**  
> We do not allow stagnation to persist.  
> Every revision must evolve, clarify, or emotionally connect — or we repair it immediately.

**Status:** ✅ Codex Finalized • Snapshot-Safe  
**Last Reviewed:** 2025-04-30
