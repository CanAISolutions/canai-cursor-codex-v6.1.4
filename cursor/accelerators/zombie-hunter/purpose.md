# ✅ File: `purpose.md`  
@location: `/cursor/accelerators/zombie-hunter/purpose.md`  
@purpose: Defines the emotional, UX, and strategic necessity of this accelerator  
@drop-type: Codex copy/paste-safe, human-auditable

```md
# 🧟 Purpose – Zombie Hunter

@agent: zombie-hunter  
@codex-version: v6.1.4  
@status: ✅ Codex Finalized  
@last-audited: 2025-04-30  

---

## 🎯 Why This Exists

The Zombie Hunter protects session momentum by detecting when a prompt loop has entered emotional or semantic stagnation.  

It prevents users from endlessly revising outputs that no longer evolve, feel flat, or break trust — and gently redirects them to a better path.

---

## 🧠 Strategic Function

| Layer              | Role                                                                 |
|--------------------|----------------------------------------------------------------------|
| UX Recovery        | Resurrect stuck sessions before frustration or abandonment occurs     |
| Emotional Safety   | Intercepts flatline states to restore tone confidence                |
| Trust Protection   | Ensures CanAI never silently fails when outputs repeat or stall       |
| Fulfillment Engine | Triggers regenerative fallbacks like `promptReplay` or `toneReset`    |

---

## 🛡️ Failure Mode If Missing

Without this agent:

- Revisions may loop endlessly without evolution
- Emotionally flat sessions go uncorrected
- Output repetition becomes invisible to the system
- Users silently lose confidence in the Copilot or product
- Recovery logic is inconsistently applied, harming reliability

---

## 🤖 Downstream Dependencies

| System                     | Usage                                         |
|----------------------------|-----------------------------------------------|
| `CopilotFeedbackAgent`     | Surfaces “stuck” prompts with recovery options |
| `promptReplay`             | Uses `triggerPromptReplay()` if zombie confirmed |
| `tone-override-agent`      | Suggests emotionally corrective scaffolds      |
| `SessionAnalytics`         | Logs zombie traces for QA + revision insights  |

---

```
