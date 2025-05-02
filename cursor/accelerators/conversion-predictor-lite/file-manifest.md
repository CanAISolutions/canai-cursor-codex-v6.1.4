# ✅ File: `file-manifest.md`  
@location: `/cursor/accelerators/conversion-predictor-lite/file-manifest.md`  
@purpose: Describes the role, consumer, and drift risk of each file in this accelerator  
@drop-type: Copy/paste-safe, Codex format

```md
# 🗂 File Manifest – Conversion Predictor Lite

@agent: conversion-predictor-lite  
@version: v1.0.0  
@codex: v6.1.4  
@purpose: Declare canonical files and risk analysis for system resilience

---

## 🧠 Canonical Files

| File | Role | Consumer | Drift Risk |
|------|------|----------|------------|
| `conversion-predictor-lite.ts` | Main agent entrypoint | Copilot, lifecycle, scoring engine | 🔥 High |
| `conversion-predictor-lite.spec.ts` | Full test coverage for verdict logic | CI, QA | Medium |
| `conversion-predictor-engine.ts` | Core logic – signal match + scoring | Called by agent | High |
| `conversion-predictor-engine.spec.ts` | Engine-level signal unit tests | Dev testing | Medium |
| `conversion-signals.jsonc` | Declarative weight + trigger map | Used by engine | 🔥 High |
| `behavior-contract.md` | Agent input/output contract | Prompt tools, Copilot, QA | Medium |
| `purpose.md` | Strategic + emotional role of agent | Codex, Onboarding | Low |
| `integration-contract.md` | Declares all I/O dependencies | Prompt logic, CI, schema | High |
| `future-integration.md` | Forecast UX hooks + lifecycle ties | Personalization, dashboards | Medium |
| `observability.ts` | Emits metrics to `_shared/logger.ts` | Analytics layer | High |
| `pattern-insights.ts` | Detects signal drift or imbalance | Self-heal loop, QA | Medium |
| `system-readiness.ts` | CI gatekeeper + enforcement checker | Linter, audit | 🔥 High |
| `self-check-blocks.md` | Declarative checklist of CI passes | Manual + CI QA | Low |
| `folder-checklist.md` | Manual Codex audit validation | Reviewer, onboarding | Medium |
| `file-manifest.md` | You are here | Cursor, AI coauthor, human audit | Low |
| `version.lock` | Last passing commit SHA | `system-readiness.ts` | 🔥 High |

---

✅ This manifest guarantees clarity, auditability, and scale-safe structure.  