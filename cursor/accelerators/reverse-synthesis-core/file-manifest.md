# ✅ File: `file-manifest.md`  
@location: `/cursor/accelerators/reverse-synthesis-core/file-manifest.md`  
@purpose: Declares purpose, consumers, and Codex risk level for each file  
@drop-type: Cursor-auditable, AI-coauthorable

```md
# 🧬 File Manifest – Reverse Synthesis Core

@agent: reverse-synthesis-core  
@version: v1.0.0  
@checkpoint: Codex Finalized  
@drift-detection: ✅ Enabled

---

## 🔒 Canonical Files

| File                              | Purpose                                          | Consumer                    | Drift Risk |
|-----------------------------------|--------------------------------------------------|-----------------------------|------------|
| `reverse-synthesis-core.ts`       | Main export and entrypoint                      | Prompt router, Copilot      | 🔥 High |
| `reverse-synthesis-core.spec.ts`  | Full test suite for match, scoring, trace       | CI                          | Medium |
| `reverse-synthesis-engine.ts`     | Reverse inference logic                         | Main agent                  | 🔥 High |
| `reverse-synthesis-engine.spec.ts`| Unit tests for confidence, fallback             | QA, Dev                     | Medium |
| `synthesis-patterns.jsonc`        | Pattern config – regex + metadata               | Engine                      | 🔥 High |
| `behavior-contract.md`            | Declares invocation safety for Copilots         | Prompt ecosystem            | Medium |
| `purpose.md`                      | Declares module intent and failure risk         | Codex, onboarding           | Low |
| `integration-contract.md`         | Input/output spec + trace fields                | Readiness validator         | High |
| `future-integration.md`           | Forecasts LLM integration and emotional drift UX| Product, growth             | Medium |
| `observability.ts`               | Logs trace, drift, confidence, errors           | Logger, analytics layer     | High |
| `pattern-insights.ts`             | Drift analysis and fallback pattern trends      | Self-healing system         | Medium |
| `system-readiness.ts`             | CI gate for file integrity and SHA lock         | Codex + Cursor              | 🔥 High |
| `self-check-blocks.md`            | Declarative pass/fail QA checklist              | Codex runtime               | Low |
| `folder-checklist.md`             | Human audit summary                             | Reviewer, devs              | Medium |
| `file-manifest.md`                | You are here                                    | AI agents, devs             | Low |
| `version.lock`                    | Stores passing commit SHA                       | CI validation               | 🔥 High |
| `synthesis-trace-schema.md`       | Describes trace logs for analytics + UX replay  | Copilot trace loggers       | Medium |

---

```
