# ✅ File: `file-manifest.md`  
@location: `/cursor/accelerators/emotional-foresight-lite/file-manifest.md`  
@purpose: Declares all system files, their purpose, consumers, and risk level  
@drop-type: Cursor-safe, Codex-auditable

```md
# 🗂 File Manifest – Emotional Foresight Lite

@agent: emotional-foresight-lite  
@version: v1.0.0  
@codex-validated: ✅  
@drift-auditable: ✅

---

## Canonical Enforcement Files

| File                          | Purpose                                     | Consumer                     | Drift Risk |
|-------------------------------|---------------------------------------------|-------------------------------|------------|
| `emotional-foresight-lite.ts` | Entrypoint logic for agent routing          | UX engine, fallback logic     | 🔥 High |
| `emotional-foresight-lite.spec.ts` | Snapshot + edge case test suite       | CI, QA                        | Medium |
| `foresight-model-lite.ts`     | Core signal + prediction engine             | UX engine, fallback router    | 🔥 High |
| `emotion-signal-spec.jsonc`   | Config for prediction logic thresholds      | Foresight model               | 🔥 High |
| `intervention-policy.md`      | System fallback logic after signal triggers | QA, lifecycle, Copilot logic  | Medium |
| `behavior-contract.md`        | Agent boundary and safety contract          | System runtime                | Medium |
| `purpose.md`                  | Strategic and emotional role declaration    | Codex, onboarding             | Low |
| `integration-contract.md`     | Declares I/O schema and state keys          | `system-readiness.ts`, QA     | High |
| `future-integration.md`       | Forecasts Copilot/lifecycle UX integrations | Product, personalization      | Medium |
| `observability.ts`            | Emits foresight-related metrics             | Session analytics pipeline    | High |
| `pattern-insights.ts`         | Drift + overtrigger anomaly detection       | Smart audit engine            | Medium |
| `system-readiness.ts`         | CI enforcement logic                        | Cursor, linter, deploy gate   | 🔥 High |
| `self-check-blocks.md`        | Declarative QA expectations                 | CI, Codex reviewer            | Low |
| `folder-checklist.md`         | Manual Codex compliance log                 | Cursor user, onboarding       | Medium |
| `file-manifest.md`            | You are here                                | All AI/QA/CI layers           | Low |
| `version.lock`                | Commit SHA snapshot lock                    | Git, CI gatekeeper            | 🔥 High |

---

## Declared Optional Files

| File | Purpose |
|------|---------|
| `intervention-policy.md` | Maps foresight labels to recovery or fallback UX strategies |

---

```
