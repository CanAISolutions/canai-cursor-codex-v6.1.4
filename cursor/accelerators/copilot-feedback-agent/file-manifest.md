# ✅ File: `file-manifest.md`  
@location: `/cursor/accelerators/copilot-feedback-agent/file-manifest.md`  
@purpose: Declares all files, their consumers, and risk factors for Codex auditability  
@drop-type: Cursor-safe, system-hardening document

```md
# 🗂 File Manifest – Copilot Feedback Agent

@agent: copilot-feedback-agent  
@version: v1.0.0  
@codex-validated: ✅  
@auditable: ✅

---

## Canonical Files (Enforced by system-readiness.ts)

| File | Role | Consumer | Drift Risk |
|------|------|----------|------------|
| `copilot-feedback-agent.ts` | Main orchestrator | Copilot UX | 🔥 High |
| `copilot-feedback-agent.spec.ts` | Full logic test | CI | Medium |
| `copilot-feedback-engine.ts` | Core decision logic | Prompt layer | 🔥 High |
| `copilot-feedback-engine.spec.ts` | Engine-level tests | Devs | Medium |
| `copilot-feedback-rules.jsonc` | Declarative trigger config | Engine logic | 🔥 High |
| `behavior-contract.md` | Declares safety rules | Copilot, QA | Medium |
| `purpose.md` | Strategic role + emotional utility | Codex, founders | Low |
| `integration-contract.md` | I/O schema + trigger map | Readiness logic | 🔥 High |
| `future-integration.md` | Forecast for lifecycle + UI ties | UX planning | Medium |
| `observability.ts` | Emits usage metrics | Logger, analytics | High |
| `pattern-insights.ts` | Detects misuse or session abuse | Self-heal loop | Medium |
| `system-readiness.ts` | CI safety net | Linter, pre-deploy | 🔥 High |
| `self-check-blocks.md` | Declarative checklist | QA, CI | Low |
| `folder-checklist.md` | Manual Codex compliance log | Reviewers | Medium |
| `file-manifest.md` | You are here | All actors | Low |
| `version.lock` | Git commit pin | CI, SHA validation | 🔥 High |

---

## Declared Dev/Optional Files

| File | Purpose |
|------|---------|
| `copilot-feedback-policy.md` | DSL-style guidance policy for when/why to trigger feedback |
| `copilot-feedback-logging.md` | Defines log format + audit trail contracts |

---

✅ Manifest complete.  
```
