# ✅ File: `file-manifest.md`  
@location: `/cursor/accelerators/federated-memory-lite/file-manifest.md`  
@purpose: Declares each file’s role, consumer, and Codex drift risk  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```md
# 🗂 File Manifest – Federated Memory Lite

@agent: federated-memory-lite  
@version: v1.0.0  
@checkpoint-status: ✅ Codex Enforced  
@drift-monitoring: ✅ Active

---

## Canonical System Files

| File                           | Purpose                                          | Consumer                          | Drift Risk |
|--------------------------------|--------------------------------------------------|-----------------------------------|------------|
| `federated-memory-lite.ts`     | Primary invocation entry for resolution logic    | Prompt router, Copilot, fallback  | 🔥 High |
| `federated-memory-lite.spec.ts`| Full test suite: fallback, rejection, routing    | CI, test runners                  | Medium |
| `memory-federation-engine.ts`  | Core resolution algorithm                        | Main agent logic                  | 🔥 High |
| `memory-federation-engine.spec.ts` | Targeted unit tests for edge cases           | Dev, QA                           | Medium |
| `memory-routing-spec.jsonc`    | Declarative priority config                      | Resolution engine                 | 🔥 High |
| `memory-conflict-policy.md`    | Defines how to resolve memory collisions         | Safety, CI enforcement            | Medium |
| `behavior-contract.md`         | I/O and boundary definition for agent calls      | Copilot engine                    | Medium |
| `purpose.md`                   | Declares role and strategic function             | Codex, onboarding                 | Low |
| `integration-contract.md`      | Defines config schema + persistent keys          | `system-readiness.ts`, QA         | High |
| `future-integration.md`        | Forecast of UX/infra hooks                       | Product, personalization systems  | Medium |
| `observability.ts`             | Emits metrics for all memory events              | Logger, analytics, delta log      | High |
| `pattern-insights.ts`          | Detects misuse trends or fallback overuse        | Smart self-healing loop           | Medium |
| `system-readiness.ts`          | CI enforcement: structure, config, SHA           | Cursor, linter, Codex pass/fail   | 🔥 High |
| `self-check-blocks.md`         | Declarative checks for audit/CI parity           | Codex, CI reviewer                | Low |
| `folder-checklist.md`          | Human verification + audit tracker               | Developer, Codex team             | Medium |
| `file-manifest.md`             | You are here                                     | All coauthors and Codex systems   | Low |
| `version.lock`                 | Git commit hash for last passing CI              | `system-readiness.ts`, CI         | 🔥 High |

---

✅ Manifest complete.  
Ready for `folder-checklist.md`?
```
