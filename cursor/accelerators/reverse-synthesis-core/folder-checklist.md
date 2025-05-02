# ✅ File: `folder-checklist.md`  
@location: `/cursor/accelerators/reverse-synthesis-core/folder-checklist.md`  
@purpose: Manual and CI audit tracker for Codex integrity, drift safety, and test coverage  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```md
# 🧾 Folder Checklist – Reverse Synthesis Core

@agent: reverse-synthesis-core  
@codex-version: 6.1.4  
@checkpoint-protocol: v2.3  
@status: ✅ Codex Finalized

---

## ✅ File Inventory Audit

- [x] 13 required enforcement files present  
- [x] Optional file `synthesis-trace-schema.md` documented in manifest  
- [x] No undeclared files or stray test stubs detected

---

## ✅ Markdown Conformity

- [x] All `.md` files wrapped with four-backtick ````md syntax  
- [x] Cursor copy/paste-safe rendering validated  
- [x] No nested code block rendering issues

---

## ✅ CI Readiness

- [x] `system-readiness.ts` returns `green`  
- [x] `version.lock` matches Git SHA  
- [x] `synthesis-patterns.jsonc` schema matches declared config shape  
- [x] `synthesis-trace-schema.md` defines required trace fields  
- [x] All trace outputs are snapshot-testable

---

## ✅ Observability + QA

- [x] `invocation.count`, `fallback.count`, `drift.score`, and `confidence.score` emitted  
- [x] Pattern insights detect fallback loops and drift rise  
- [x] Test suite includes `[DreamState]` tag and runs full match/fallback logic  
- [x] Errors, mismatches, and trace decay logged and scored

---

## ✅ 10-Minute Human Audit

1. ✅  All files present with correct names  
2. ✅  Markdown is Cursor-safe and Codex-readable  
3. ✅  `version.lock` matches current commit  
4. ✅  Pattern config is schema-compliant  
5. ✅  Drift tracking logic emits metrics  
6. ✅  All tests pass and emit stable snapshots  
7. ✅  Fallback handling is emotionally safe and auditable

---

```
