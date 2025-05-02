# ✅ File: `file-manifest.md`  
@location: `/cursor/accelerators/smart-prompt-score/file-manifest.md`  
@purpose: Declares file purpose, risk levels, and system consumers  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```md
# 🧠 File Manifest – Smart Prompt Score

@agent: smart-prompt-score  
@version: v1.0.0  
@checkpoint: Codex Enforcement Final  
@auditable: ✅

---

## 🗂 Canonical Files

| File                             | Purpose                                      | Consumer                 | Drift Risk |
|----------------------------------|----------------------------------------------|--------------------------|------------|
| `smart-prompt-score.ts`          | Main entry logic + config load               | Copilot, revision-loop   | 🔥 High |
| `smart-prompt-score.spec.ts`     | Full test suite + edge coverage              | QA, CI                   | Medium |
| `prompt-score-engine.ts`         | Signal processor and composite score logic   | All scoring consumers    | 🔥 High |
| `prompt-score-engine.spec.ts`    | Snapshot-stable trait test suite             | Dev, CI                  | Medium |
| `scoring-signals.jsonc`          | Trait weights, goals, thresholds             | Engine                   | 🔥 High |
| `scoring-policy.md`              | UX-readable explanation of grading logic     | Product, Copilot         | Medium |
| `behavior-contract.md`           | Safe invocation structure and guardrails     | Agents, UI               | Medium |
| `purpose.md`                     | Declares strategic value and failure risk    | Codex, onboarding        | Low |
| `integration-contract.md`        | I/O type schema + trait declarations         | Cursor, engine, agents   | High |
| `future-integration.md`          | Forecasts roadmap features + trace fields    | Growth, Copilot          | Medium |
| `observability.ts`               | Emits score, grade, and top signal metrics   | Analytics layer          | High |
| `pattern-insights.ts`            | Detects regression patterns and decay        | Self-healing loop        | Medium |
| `system-readiness.ts`            | Codex CI gate and file presence checker      | CI, Cursor               | 🔥 High |
| `self-check-blocks.md`           | Declarative QA snapshot                      | Codex, CI                | Low |
| `folder-checklist.md`            | Manual + CI enforcement log                  | Reviewer, CI             | Medium |
| `file-manifest.md`               | You are here                                 | Devs, AI agents          | Low |
| `version.lock`                   | Stores last passing commit SHA               | Readiness script         | 🔥 High |

---

```
