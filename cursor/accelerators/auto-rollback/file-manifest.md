# ✅ File: `file-manifest.md`  
@location: `/cursor/accelerators/auto-rollback/file-manifest.md`  
@purpose: Documents the role, consumer, and drift risk of every file in this accelerator  
@drop-type: Copy/paste-safe (Cursor + Codex compliant)

```md
# 🗂 File Manifest – Auto-Rollback Accelerator

@agent: auto-rollback  
@version: v1.0.0  
@enforced-by: Checkpoint Directive  
@required-for: AI co-authorship, audit, onboarding

---

## 🔐 Canonical File Roles

| File | Role | Consumer | Drift Risk |
|------|------|----------|------------|
| `auto-rollback.ts` | Main agent logic (async orchestrator) | Copilot, Logger, State | 🔥 High |
| `auto-rollback.spec.ts` | DreamState test suite | CI / QA | Medium |
| `auto-rollback.schema.ts` | Zod config schema | ConfigLoader | Low |
| `behavior-contract.md` | Invocation rules + safety bounds | Prompt evolution / devs | Medium |
| `purpose.md` | Emotional + strategic justification | Founders / Auditors | Low |
| `integration-contract.md` | State keys + upstream field schema | `system-readiness.ts`, configLoader | High |
| `future-integration.md` | Lifecycle and UX roadmap | Copilot UX, SmartPromptScore | Medium |
| `observability.ts` | Emits metrics via logger | Logger, analytics logs | 🔥 High |
| `pattern-insights.ts` | Detects rollback behavior anomalies | QA dashboards, alerts | Medium |
| `system-readiness.ts` | Enforcement + scoring CI entrypoint | CI, `folder-checklist.md` | 🔥 High |
| `self-check-blocks.md` | Declarative checklist | QA tooling, CI linter | Low |
| `folder-checklist.md` | Manual audit proof | Human reviewers | Medium |
| `file-manifest.md` | You are here | AI, onboarding, changelogs | Low |
| `version.lock` | Git commit pin | `system-readiness.ts`, CI | 🔥 High |

---

## 🧩 Additional Files (Dev, Optional)

| File | Role |
|------|------|
| `rollback-engine.ts` | Core rollback evaluation logic |
| `rollback-policy.md` | Declarative rollback DSL |
| `trigger-conditions.jsonc` | Runtime triggers |
| `config-notes.md` | Field-level guide for config JSON |

---

✅ This file supports AI evolution, team scaling, and audit integrity.  