# ✅ File: `folder-checklist.md`  
@location: `/cursor/accelerators/federated-memory-lite/folder-checklist.md`  
@purpose: Manual + CI readiness audit tracker for memory federation agent  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```md
# 🧾 Folder Checklist – Federated Memory Lite

@agent: federated-memory-lite  
@codex-version: 6.1.4  
@checkpoint-protocol: v2.3  
@status: Codex Finalized

---

## ✅ Canonical File Presence

- [x] 13 required files present
- [x] Optional files (`memory-conflict-policy.md`) declared in `file-manifest.md`
- [x] No undeclared or stray files found in folder

---

## ✅ Markdown + Cursor Compliance

- [x] All `.md` files wrapped in `four-backtick` ````md blocks
- [x] No nested render failures
- [x] All drop zones copy-paste-safe

---

## ✅ CI + Codex Safety Checks

- [x] `system-readiness.ts` returns `green`
- [x] `version.lock` matches current Git SHA
- [x] `memory-routing-spec.jsonc` schema matches `integration-contract.md`
- [x] All observability metrics emit on resolution, fallback, rejection

---

## ✅ QA Coverage

- [x] `[DreamState]` tag in test suite
- [x] Edge case tests for:
  - No valid memory
  - Dual-conflict
  - Fallback triggering
- [x] Pattern insights detect misuse or drift
- [x] Conflict resolution logic snapshot-tested

---

## ✅ 10-Minute Human Audit

1. ✅ All 13+ files accounted for, no drift  
2. ✅ Markdown is Codex-safe, Cursor-safe  
3. ✅ Observability + insights fully operational  
4. ✅ CI + test suite clean  
5. ✅ `version.lock` synced  
6. ✅ System is memory-safe, override-safe, and emotionally trustable

---

```
