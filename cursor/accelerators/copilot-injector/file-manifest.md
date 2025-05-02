# ✅ File: `file-manifest.md`  
@location: `/cursor/accelerators/copilot-injector/file-manifest.md`  
@purpose: Declares all files, their roles, and Codex drift risk for audit and onboarding  
@drop-type: Cursor-safe, enforcement-aligned

```md
# 🗂 File Manifest – Copilot Injector

@agent: copilot-injector  
@version: v1.0.0  
@checkpoint-compliant: ✅  
@auditable: ✅

---

## Canonical Files (CI-Enforced)

| File                             | Role                                   | Consumer                        | Drift Risk |
|----------------------------------|----------------------------------------|----------------------------------|------------|
| `copilot-injector.ts`           | Primary agent entrypoint                | Copilot UX, prompt enhancer     | 🔥 High |
| `copilot-injector.spec.ts`      | Full behavior test + config validation  | CI, Codex check                 | Medium |
| `inject-feedback-suggestion.ts` | Trigger logic engine                    | Copilot orchestrator            | 🔥 High |
| `inject-feedback-suggestion.spec.ts` | Unit tests for injection edge cases | Dev, CI                        | Medium |
| `copilot-trigger-rules.jsonc`   | Declarative signal → action map         | Logic engine                    | 🔥 High |
| `copilot-feedback-policy.md`    | Human-readable UX + tone contract       | Copilot interface, QA           | Medium |
| `behavior-contract.md`          | Invocation and input/output guardrails  | Prompt orchestrator             | Medium |
| `purpose.md`                    | Declares emotional + strategic role     | Codex, onboarding               | Low |
| `integration-contract.md`       | Defines input/output and state links    | `system-readiness.ts`, Copilot | High |
| `future-integration.md`         | Declares lifecycle + UX hooks forecast  | Product, personalization        | Medium |
| `observability.ts`              | Emits metrics to `_shared/logger.ts`    | Analytics                       | High |
| `pattern-insights.ts`           | Detects misuse/overuse/drift patterns   | Self-healing loop               | Medium |
| `system-readiness.ts`           | CI pass/fail logic                      | Linter, Codex, CI               | 🔥 High |
| `self-check-blocks.md`          | Declarative Codex audit test log        | QA, CI                          | Low |
| `folder-checklist.md`           | Human verification tracker              | Cursor audits                   | Medium |
| `file-manifest.md`              | You are here                            | All AI coauthors                | Low |
| `version.lock`                  | Commit pin for snapshot integrity       | Readiness test, git             | 🔥 High |

---

## Optional Dev Files (Declared + Tracked)

| File | Purpose |
|------|---------|
| `copilot-feedback-policy.md` | UX rules and Copilot tone logic reference |

---
```
