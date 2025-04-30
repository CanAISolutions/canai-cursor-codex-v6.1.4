# 🧮 Conversion Predictor Lite

**Module ID:** `conversion-predictor-lite`  
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

## 📁 Module Contents

| File                                | Purpose |
|-------------------------------------|---------|
| `conversion-predictor-engine.ts`    | Pure scoring logic – signal match + weighted score |
| `conversion-predictor-engine.spec.ts` | Snapshot test suite – all verdict logic covered |
| `conversion-signals.jsonc`          | Declarative map of CTA + tone signals (positive + negative) |
| `behavior-contract.md`              | Copilot I/O contract + logging rules |
| `self-check-blocks.md`              | QA rules + signal integrity enforcement |
| `README.md`                         | Module summary + Codex lock confirmation |

---

## 🔐 Codex Compliance – Checkpoint Summary

| Checkpoint                         | ✅ Status |
|------------------------------------|-----------|
| De-risked                          | ✅ Yes – all failure paths defined |
| Validated                          | ✅ Yes – `.spec.ts` test coverage |
| Codified                           | ✅ Yes – declarative schema + match rules |
| Copilot-ready                      | ✅ Yes – schema-safe and advisory |
| Decay prevention                   | ✅ Yes – signal drift guards embedded |
| Precision enforced                 | ✅ Yes – weighted, explainable scores |
| Billion-dollar clarity             | ✅ Yes – emotionally aligned, UX-protective, operationally clean |

---

> “Every piece of copy either deepens trust or dissolves it.  
> This engine ensures we only ship the kind that earns the click, wins the reply, or makes the sale.”

