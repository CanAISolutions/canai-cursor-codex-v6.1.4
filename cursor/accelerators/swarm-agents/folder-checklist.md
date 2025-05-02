# ✅ File: `folder-checklist.md`  
@location: `/cursor/accelerators/swarm-agents/folder-checklist.md`  
@purpose: Codex enforcement record for file structure, audit status, and CI sync  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```md
# 📋 Folder Checklist – Swarm Agents

@agent: swarm-agents  
@version: v1.0.0  
@checkpoint-version: v2.3  
@codex-status: ✅ Finalized  
@audit-status: ✅ Passed

---

## ✅ File Presence Audit

- [x] 17 required Codex files present  
- [x] No stray `.test.ts`, `.old`, or temp files  
- [x] All `.md` files wrapped in four-backtick markdown syntax

---

## ✅ System Readiness Pass

- [x] `system-readiness.ts` status: ✅ green  
- [x] `version.lock` SHA matches current HEAD  
- [x] Agent config: valid JSONC, all agent IDs declared  
- [x] Modes (`parallel-vote`, `sequential-refine`, `fallback-cascade`) all tested in `.spec.ts`

---

## ✅ Observability + Analytics Layer

- [x] Metrics: `invocation.count`, `fallback.used`, `consensus.score` emitted  
- [x] Agent error logs with trace and agent ID  
- [x] Quorum decision recorded in trace block

---

## ✅ Pattern + Behavior Checks

- [x] `pattern-insights.ts` detects fallback or mode abuse  
- [x] Quorum drift and vote instability detectable  
- [x] Fallback overuse triggers Codex signal

---

## ✅ 10-Minute Human Audit (CI-visible)

1. ✅ All canonical files present and named properly  
2. ✅ Markdown safe for Cursor + audit  
3. ✅ Agent config schema is complete  
4. ✅ Copilot-safe inputs and outputs enforced  
5. ✅ Fallback, quorum, and trace logic covered  
6. ✅ Metrics flowing to observability  
7. ✅ Codex snapshot testing active

---
```
