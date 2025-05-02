# ✅ File: `file-manifest.md`  
@location: `/cursor/accelerators/swarm-agents/file-manifest.md`  
@purpose: Declares agent files, their consumers, and associated Codex risk levels  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```md
# 🧠 File Manifest – Swarm Agents

@agent: swarm-agents  
@version: v1.0.0  
@checkpoint: Codex Enforcement Final  
@audited: ✅ 2025-04-30

---

## 📂 Canonical Files

| File                             | Purpose                                      | Consumer Modules          | Drift Risk |
|----------------------------------|----------------------------------------------|---------------------------|------------|
| `swarm-agents.ts`                | Entry point loader with config link          | Copilot, sessionRouter    | 🔥 High |
| `swarm-agents.spec.ts`           | Snapshot test for mode logic + fallback      | QA, CI                    | Medium |
| `swarm-coordinator-engine.ts`    | Main logic: mode handler + quorum core       | Platform execution layer  | 🔥 High |
| `swarm-coordinator-engine.spec.ts`| Test all modes (vote, refine, fallback)     | QA                        | Medium |
| `swarm-agent-config.jsonc`       | Agent IDs, weights, allowed modes            | Engine, future profiling  | 🔥 High |
| `swarm-decision-policy.md`       | Declares quorum logic, fallbacks, confidence | Product, Copilot, trace   | Medium |
| `behavior-contract.md`           | I/O structure and guardrails                 | Copilot, prompt-router    | Medium |
| `purpose.md`                     | Strategic role + failure cost declaration    | Codex, audit onboarding   | Low |
| `integration-contract.md`        | Type system + quorum trace schema            | Engine, Copilot           | High |
| `future-integration.md`          | Scenarios and roadmap for personalization    | Product, LLM plugins      | Medium |
| `observability.ts`               | Logs quorum result, fallback, error          | Logger, analytics engine  | High |
| `pattern-insights.ts`            | Detects fallback overuse, agent instability  | Self-healing analytics    | Medium |
| `system-readiness.ts`            | CI guard for file and version safety         | Codex CI, Cursor          | 🔥 High |
| `self-check-blocks.md`           | Declarative QA truthblock                    | Codex compliance layer    | Low |
| `folder-checklist.md`            | Manual + automated enforcement tracker       | Human reviewer, CI        | Medium |
| `file-manifest.md`               | You are here                                 | Devs, AI authors          | Low |
| `version.lock`                   | CI commit lock for last passing version      | Cursor + readiness        | 🔥 High |

---

```
