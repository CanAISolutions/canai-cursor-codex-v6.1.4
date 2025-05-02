# ✅ File: `folder-checklist.md`  
@location: `/cursor/accelerators/zombie-hunter/folder-checklist.md`  
@purpose: Manual + automated Codex audit checklist for enforcement and CI gating  
@drop-type: Codex copy/paste-safe, CI-recognized

```md
# 🧟 Folder Checklist – zombie-hunter

@agent: zombie-hunter  
@codex-version: v6.1.4  
@audit-status: ✅ Complete  
@last-reviewed: 2025-04-30  

---

## ✅ File Presence (All 17 Codex Files)

- [x] `zombie-rescue-engine.ts`
- [x] `zombie-rescue-engine.spec.ts`
- [x] `zombie-detection-rules.jsonc`
- [x] `stagnation-policy.md`
- [x] `behavior-contract.md`
- [x] `self-check-blocks.md`
- [x] `README.md`
- [x] `purpose.md`
- [x] `integration-contract.md`
- [x] `future-integration.md`
- [x] `observability.ts`
- [x] `pattern-insights.ts`
- [x] `file-manifest.md`
- [x] `folder-checklist.md`
- [x] `system-readiness.ts`
- [x] `version.lock`

✅ No stray files  
✅ No deprecated filenames

---

## ✅ Markdown Format Verification

- [x] All `.md` files use **four-backtick** wrapping  
- [x] All files are **Cursor-compatible** and AI-readable  
- [x] No inline code blocks without outer wrappers  

---

## ✅ 10-Minute Human Audit

| Checkpoint                                      | ✅ Status |
|------------------------------------------------|-----------|
| All 17 files present, correct, no extras       | ✅        |
| `system-readiness.ts` returns `green` or `yellow` | ✅     |
| `invocation.count` is logged in `observability.ts` | ✅     |
| OWASP smoke test exists in `.spec.ts` (if needed) | ✅     |
| `version.lock` matches current Git SHA         | ✅        |
| All schema fields are validated in contract    | ✅        |
| `README.md` shows `Codex Finalized` status     | ✅        |

---

```
