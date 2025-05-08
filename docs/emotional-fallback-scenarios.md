# 🛡️ Emotional Fallback Scenarios  
**Codex-Enforced Emotional Recovery Protocol**  
**Generated:** 2025-05-08  
**Enforced by:** `/test-orchestrator.ts`, `test-audit.md`, `.cursorrules`

---

## 🎯 Purpose  
This document defines the approved fallback language, tone guidelines, and emotional requirements for any error, delay, or unexpected behavior across the CanAI system.  
Fallbacks are not failure states. They are emotional resilience rituals.

---

## 🔁 Fallback Scenarios & Messages

| Scenario                  | Trigger Conditions                              | Required Message Copy                                      | Emotional Objective               |
|---------------------------|--------------------------------------------------|-------------------------------------------------------------|-----------------------------------|
| GPT delay                 | > 5s GPT response time                          | “Still shaping it — great things take a moment.”           | Preserve anticipation + trust     |
| API hiccup                | Render/Airtable/Klaviyo 5xx                     | “A quick glitch — we’re smoothing it out now.”             | Reassure, no blame                |
| Prompt failure            | Invalid generation / GPT aborts                 | “Let’s tweak this — retrying with a sharper edge.”         | Empower refinement                |
| Overwhelm detection       | Low-confidence, complex tone/intent             | “Take a breath — we’ll walk this path together.”           | Build calm, partnership           |
| Empty/unclear output      | No or weak result from prompt                   | “Nothing yet? Let’s refine it side by side.”               | Encourage co-creation             |
| Memberstack fallback      | User session timeout                            | “We’re still with you — let’s reconnect your magic.”       | Reignite, avoid cold login        |
| Email delay/failure       | Klaviyo error / asset not sent                  | “Your insight’s safe. We’ll resend shortly.”               | Protect data trust, assure effort |

---

## 🎤 Tone Requirements  
- Calm > Apologetic  
- Strategic > Technical  
- Supportive > Vague  
- Reassuring > Defensive

---

## 🔐 Test Enforcement  
Every fallback must be:
- Covered in `emotional-ux` test suite  
- Referenced in test logs  
- Logged in `auto-actions.log.md` if it triggers

> If fallback copy is missing, stale, or untracked — **it fails the test.**
