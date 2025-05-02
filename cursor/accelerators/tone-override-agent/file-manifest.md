# ✅ File: `file-manifest.md`  
@location: `/cursor/accelerators/tone-override-agent/file-manifest.md`  
@purpose: Declares file purpose, Codex consumers, and drift risk for each component  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```md
# 🧠 File Manifest – Tone Override Agent

@agent: tone-override-agent  
@version: v1.0.0  
@codex-status: ✅ Codex Finalized  
@audited: 2025-04-30  

---

## 📂 Files and Roles

| File                        | Purpose                                         | Consumers                        | Drift Risk |
|-----------------------------|--------------------------------------------------|-----------------------------------|------------|
| `tone-overrider.ts`         | Core logic to assess override eligibility        | Copilot, smart-score, promptReplay | 🔥 High |
| `tone-overrider.spec.ts`    | Test override trigger conditions and profile match | CI, QA                            | Medium |
| `tone-profiles.jsonc`       | Declarative tone traits for profile match        | Genetics, Copilot, override engine | 🔥 High |
| `tone-realignment-policy.md`| UX rules and override philosophy                | Product, Copilot overlays         | Medium |
| `behavior-contract.md`      | Input/output shape for safe invocation           | Prompt router, Copilot            | Medium |
| `self-check-blocks.md`      | Codex QA checklist for override agent           | Codex engine                      | Low |
| `purpose.md`                | Declares intent and strategic UX role            | Codex audit, onboarding           | Low |
| `integration-contract.md`   | Schema enforcement and override trace format     | Engine, Copilot, downstream logs  | High |
| `future-integration.md`     | Declares roadmap scenarios and suppression logic | Codex evolution, product strategy | Medium |
| `observability.ts`          | Logs override signals, emotion scores, rejections| Logger, analytics, Copilot        | High |
| `pattern-insights.ts`       | Detects override fatigue, profile rejection      | Self-healing, personalization     | Medium |
| `system-readiness.ts`       | Verifies file integrity and Git SHA sync         | CI, Codex guard                   | 🔥 High |
| `folder-checklist.md`       | Manual and auto pass confirmation log            | Auditors, Cursor sync             | Medium |
| `file-manifest.md`          | You are here                                     | Devs, AI co-authors               | Low |
| `version.lock`              | Pins SHA of last passing commit                  | Git sync, Codex checkpoint        | 🔥 High |

---

```
