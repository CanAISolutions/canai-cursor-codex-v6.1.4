# ✅ File: `file-manifest.md`  
@location: `/cursor/accelerators/zombie-hunter/file-manifest.md`  
@purpose: Lists all agent files, their purpose, consumers, and risk of silent decay  
@drop-type: Codex copy/paste-safe, audit-aligned

```md
# 🧟 File Manifest – Zombie Hunter

@agent: zombie-hunter  
@codex-version: v6.1.4  
@audit-date: 2025-04-30  
@status: ✅ Codex Finalized

---

## 📁 File Roles

| File                             | Purpose                                               | Consumers                       | Drift Risk |
|----------------------------------|--------------------------------------------------------|----------------------------------|------------|
| `zombie-rescue-engine.ts`        | Detects stagnation patterns and triggers recovery      | Copilot, promptReplay            | 🔥 High |
| `zombie-rescue-engine.spec.ts`   | Tests all pattern triggers and edge cases              | CI, QA                           | Medium |
| `zombie-detection-rules.jsonc`   | Declares thresholds and pattern match logic            | Engine, QA config, CI            | 🔥 High |
| `stagnation-policy.md`           | Describes emotional safety, UX fallback, and Copilot UX| Product, Copilot                 | Medium |
| `behavior-contract.md`           | Declares input/output shape + invocation safety        | Prompt router, Copilot           | Medium |
| `self-check-blocks.md`           | QA assertions, drift checks, fail-closes               | Codex engine                     | Low |
| `README.md`                      | Human-readable summary of agent mission                | Onboarding, auditors             | Low |
| `purpose.md`                     | Declares emotional, UX, and strategic rationale        | Codex audit, QA docs             | Low |
| `integration-contract.md`        | Defines schema requirements and trace output           | promptReplay, Copilot            | High |
| `future-integration.md`          | Forecasts usage across swarm, genetics, and replay     | Codex, Product                   | Medium |
| `observability.ts`               | Emits logs and metrics to analytics + cost layer       | logger, analytics, QA            | High |
| `pattern-insights.ts`            | Detects failed recovery loops, drift trends            | Self-healing engine              | Medium |
| `file-manifest.md`               | You are here                                           | Devs, AI co-authors              | Low |
| `folder-checklist.md`            | Manual + automated audit confirmation log              | QA, Codex enforcement            | Medium |
| `system-readiness.ts`            | Verifies file structure + Git SHA sync                 | CI gate, release guardrail       | 🔥 High |
| `version.lock`                   | Pins CI-passed Git SHA                                 | Codex delta detection, audit     | 🔥 High |

---

```
