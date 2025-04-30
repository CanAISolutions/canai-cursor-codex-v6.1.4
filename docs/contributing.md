# 🛡 Dream-State Codex — Contributor Guide

## 📜 Purpose
This document governs **how all future contributions** (features, fixes, expansions) must be made to preserve the Dream-State platform's emotional UX, operational durability, and Codex integrity.

---

## 🧠 Core Contribution Rules

| Principle | Enforcement |
|:---|:---|
| 🔒 Emotional UX First | Every change must protect or enhance emotional UX. |
| 📦 Codex Compliance Required | All files must follow Codex standards: headers, structure, self-validation. |
| 🧠 Snapshot-Safe | Outputs affecting UX must be snapshot-tested or payload-validated. |
| 🚨 Drift = Critical Failure | Changes that silently alter emotional UX or operational trust are rejected. |
| 🎯 Full System Visibility | Updates must include corresponding docs, manifests, validators if necessary. |

---

## 🛡 Contribution Checklist

Before submitting a PR:

- [ ] Are all new files Codex-documented with `@codex-*` headers?
- [ ] Are all new payload outputs emotionally safe, modular, and validated?
- [ ] Are all new config changes schema-validated and test-covered?
- [ ] Are manifest entries updated if new routers/endpoints were added?
- [ ] Are all relevant docs (`system-map`, `test-grid`, `roadmap`) updated if expanding architecture?
- [ ] Does the PR preserve Dream-State scaling safety and emotional UX resilience?

---

## 🧠 Adding a New Router

| Step | Requirement |
|:---|:---|
| Create router inside `/api-router/[feature]/` | Must use Dream-State payload structures. |
| Update `/api-router/manifest.json` | Router name, path, description. |
| Add emotional UX test (optional snapshot if relevant) | Validate output resilience. |
| Update `/docs/system-map.md` if creating new feature group | Full Dream-State visibility. |

---

## 🛡 Modifying Config (`.dreamstate-config.json`)

| Step | Requirement |
|:---|:---|
| Update config safely | Follow emotional UX safe defaults. |
| Validate against `/tools/dreamstate-config-schema.json` | Pass full schema validation. |
| Extend `/tools/loadDreamstateConfig.ts` if needed | Safe loading enforcement. |
| Update config tests if structure changed | Snapshot-lock emotional UX impact. |
| Re-run full selfcheck `/ci/full-dreamstate-selfcheck.ts` | Validate entire Dream-State system integrity. |

---

## 📦 Best Practices

- **Favor Emotional Resonance Over Mechanical Correctness**  
  Code that feels cold, punitive, or disconnected from users **must** be improved — even if technically "correct."

- **Automate Safety Wherever Possible**  
  Add validators, snapshot tests, or selfchecks when expanding — not manually tracked guardrails.

- **Think 10 Years Out**  
  Dream-State is being architected for infinite durability — optimize contributions for long-term resonance and modularity.

- **Use Empathy as a Technical Standard**  
  Emotional UX is not marketing — it is core system architecture. Every error message, payload, retry flow matters.

---

# 🛡 Final Reminder

> You are not just building software.  
> You are building trust, emotional connection, and operational immortality.

We do not build fast.  
We build forever.  
We do not trim quality.  
We compound it.  
We do not miss the mark.  
We redefine it.

---
