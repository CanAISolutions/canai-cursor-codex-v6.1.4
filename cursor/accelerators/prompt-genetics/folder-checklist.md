# ✅ File: `folder-checklist.md`  
@location: `/cursor/accelerators/prompt-genetics/folder-checklist.md`  
@purpose: Human + CI enforcement tracker for schema, safety, and Codex alignment  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```md
# 🧾 Folder Checklist – Prompt Genetics

@agent: prompt-genetics  
@codex-version: 6.1.4  
@checkpoint-protocol: v2.3  
@status: ✅ Codex Finalized

---

## ✅ Required File Presence

- [x] All 13 mandatory files present
- [x] Optional files (e.g. `prompt-lineage-log.md`) declared in `file-manifest.md`
- [x] No extraneous files detected in root

---

## ✅ Markdown Compliance

- [x] All `.md` files wrapped in Codex `four-backtick` markdown
- [x] Cursor-ready, copy/paste-safe formatting
- [x] Nested code blocks render without issue

---

## ✅ CI Enforcement Readiness

- [x] `system-readiness.ts` returns ✅ `green`
- [x] `version.lock` matches active commit SHA
- [x] Schema in `prompt-trait-schema.jsonc` matches declared interface
- [x] Test suite includes `[DreamState]` tag

---

## ✅ Observability + Logging

- [x] Metrics emitted for mutation, schema usage, scoring, and errors
- [x] Trace object captured in output with reason and lineage
- [x] Pattern insights detect decay or mutation stall

---

## ✅ Mutation Safety Coverage

- [x] Trait mutation rules enforced from schema
- [x] Fallbacks present for unrecognized or ignored traits
- [x] Fitness scoring is goal-specific and testable
- [x] Replay-safe architecture present

---

## ✅ 10-Minute Human Audit

1. ✅ All Codex-enforced files present  
2. ✅ `.md` files Cursor-safe  
3. ✅ CI + test suite pass  
4. ✅ `version.lock` SHA current  
5. ✅ Pattern insights functional  
6. ✅ Metrics emit on mutation and reuse  
7. ✅ Schema and state fully auditable

---

```
