# ✅ File: `file-manifest.md`  
@location: `/cursor/accelerators/prompt-genetics/file-manifest.md`  
@purpose: Declares all files, consumers, and Codex drift risk levels  
@drop-type: Cursor-ready, AI-coauthorable

```md
# 🧬 File Manifest – Prompt Genetics

@agent: prompt-genetics  
@version: v1.0.0  
@codex-status: ✅ Codex Locked  
@drift-auditing: ✅ Enabled

---

## 🗂 Canonical Enforcement Files

| File                             | Purpose                                           | Consumer                    | Drift Risk |
|----------------------------------|---------------------------------------------------|-----------------------------|------------|
| `prompt-genetics.ts`            | Entrypoint logic for trait mutation engine        | Copilot, `revision-loop`    | 🔥 High |
| `prompt-genetics.spec.ts`       | Full mutation test suite + scoring assertions     | CI                          | Medium |
| `prompt-genome-engine.ts`       | Applies mutations, returns traceable variant      | Main engine logic           | 🔥 High |
| `prompt-genome-engine.spec.ts`  | Unit tests for variant validity, ignored traits   | Dev + QA                    | Medium |
| `prompt-trait-schema.jsonc`     | Declares trait mutation rules + schema version    | Schema loader               | 🔥 High |
| `prompt-lineage-log.md`         | Documents lineage model + replay logic            | Codex, replay audit         | Medium |
| `behavior-contract.md`          | Safe invocation rules for Copilot or replay       | Agents, prompt system       | Medium |
| `purpose.md`                    | Declares emotional + strategic value              | Codex, onboarding           | Low |
| `integration-contract.md`       | I/O + trait schema declaration                    | `system-readiness.ts`, QA   | High |
| `future-integration.md`         | Forecasts evolution paths (LLM, UI, optimization) | Product, personalization     | Medium |
| `observability.ts`              | Logs generation, fallback, and fitness scoring    | Analytics pipeline          | High |
| `pattern-insights.ts`           | Detects mutation decay or schema misuse           | Self-healing loop           | Medium |
| `system-readiness.ts`           | CI validator for file presence + SHA lock         | Cursor, linter, Codex check | 🔥 High |
| `self-check-blocks.md`          | Declarative QA snapshot + guard assertions        | Codex test layer            | Low |
| `folder-checklist.md`           | Human-ready audit tracker for compliance          | Dev, Codex reviewer         | Medium |
| `file-manifest.md`              | You are here                                      | All agents, Codex, Cursor   | Low |
| `version.lock`                  | Git commit pin for last known-good state          | `system-readiness.ts`       | 🔥 High |

---

```
