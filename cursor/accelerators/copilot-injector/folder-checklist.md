# ✅ File: `folder-checklist.md`  
@location: `/cursor/accelerators/copilot-injector/folder-checklist.md`  
@purpose: Manual + CI enforcement audit of file structure, format, and compliance  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```md
# 🧾 Folder Checklist – Copilot Injector

@agent: copilot-injector  
@codex-version: 6.1.4  
@checkpoint-enforcement: ✅  
@status: Finalizing

---

## ✅ File Structure Validation

- [x] All 13 canonical files present
- [x] Additional files (e.g. `copilot-feedback-policy.md`) declared in `file-manifest.md`
- [x] No undeclared files present in folder

---

## ✅ Markdown Enforcement

- [x] All `.md` files wrapped in four-backtick ````md blocks
- [x] All drop zones formatted for Cursor copy/paste safety
- [x] No nested markdown rendering issues

---

## ✅ System Readiness Checks

- [x] `system-readiness.ts` returns `green`
- [x] `version.lock` matches latest commit
- [x] Config schema fields validated (e.g. `maxMessagesPerSession`)
- [x] All observability keys emit as required

---

## ✅ QA + Observability

- [x] `[DreamState]` test suite tag present
- [x] OWASP injection protections verified (if relevant)
- [x] Pattern insight detection active
- [x] Copilot feedback logs integrated into `SessionAnalytics`

---

## ✅ 10-MINUTE HUMAN AUDIT

1. ✅ 13 required files, no extras  
2. ✅ Markdown wrapping and structure pass  
3. ✅ Drift protection active (`version.lock` sync)  
4. ✅ Observability shows trigger/severity counts  
5. ✅ Self-healing pattern logic in place  
6. ✅ Codex purpose is emotionally intelligent and precise  
7. ✅ All modules are Cursor coauthor-ready

---
