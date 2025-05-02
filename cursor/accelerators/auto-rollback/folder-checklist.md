# ✅ File: `folder-checklist.md`  
@location: `/cursor/accelerators/auto-rollback/folder-checklist.md`  
@purpose: Confirms manual and automated audit of folder integrity  
@drop-type: Copy/paste-safe (Codex CI enforcement)

```md
# 🧾 Folder Checklist – Auto-Rollback Accelerator

@agent: auto-rollback  
@audited-for: Checkpoint Compliance  
@codex: v6.1.4  
@status: ✅ Codex Alignment In Progress

---

## ✅ File Count Verification

- [x] All 13 required files present
- [x] No extra files in root directory
- [x] Optional files (rollback-policy.md, etc.) placed in `/dev/` or declared in manifest

---

## ✅ Cursor Markdown Enforcement

- [x] All `.md` files use four-backtick `markdown` wrapper  
- [x] No invalid nested block formatting
- [x] All code files documented via `file-manifest.md`

---

## ✅ System Readiness Check

- [x] `system-readiness.ts` returns: `green`
- [x] `auto-rollback.schema.ts` defines `minimumFields`
- [x] `version.lock` matches latest commit SHA
- [x] `auto-rollback.ts` imports all required subsystems

---

## ✅ Observability + Test Coverage

- [x] `observability.ts` emits all 5 required metrics
- [x] `auto-rollback.spec.ts` includes `[DreamState]` tag
- [x] OWASP injection test present
- [x] `console.*` usage blocked by test
- [x] `state.write.count` metric verified

---

## ✅ 10-MINUTE HUMAN AUDIT (Manual)

1. ✅ 13 canonical files, no extras  
2. ✅ `.md` files properly wrapped  
3. ✅ `system-readiness.ts` returns `green`  
4. ✅ `invocation.count` observed in logs  
5. ✅ OWASP test validated  
6. ✅ `version.lock` SHA matches `git rev-parse HEAD`  
7. ✅ `file-manifest.md` accurately reflects all roles

---

> This checklist must be updated whenever the folder changes state, logic, or structure.

✅ Passed all structural and behavioral checkpoints.