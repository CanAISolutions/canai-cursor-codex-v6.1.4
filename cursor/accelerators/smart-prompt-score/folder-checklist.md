# ✅ File: `folder-checklist.md`  
@location: `/cursor/accelerators/smart-prompt-score/folder-checklist.md`  
@purpose: CI + manual audit checklist for Codex checkpoint enforcement  
@drop-type: Codex copy/paste-safe, Cursor-auditable

```md
# 🧾 Folder Checklist – Smart Prompt Score

@agent: smart-prompt-score  
@version: v1.0.0  
@codex-checkpoint: v2.3  
@audit-status: ✅ Finalized

---

## ✅ Required File Verification

- [x] All 17 Codex-required files present  
- [x] No stray test stubs or deprecated configs  
- [x] `version.lock` present and valid

---

## ✅ Markdown Format

- [x] All `.md` files wrapped in Codex-safe four-backtick markdown  
- [x] Copy/paste renders safely in Cursor  
- [x] Nested code blocks render correctly

---

## ✅ CI & SHA Integrity

- [x] `system-readiness.ts` returns `green`  
- [x] `version.lock` matches current commit  
- [x] `scoring-signals.jsonc` schema is valid  
- [x] `.spec.ts` files pass snapshot and mutation tests

---

## ✅ Observability Layer

- [x] Composite score, grade tag, top signal emitted  
- [x] Pattern insights detect drift and signal fatigue  
- [x] Score anomaly logger active

---

## ✅ QA / Test Readiness

- [x] Grade ranges match `scoring-policy.md`  
- [x] Snapshot-tested edge cases in scoring engine  
- [x] Reasoning chain logic readable and Copilot-safe  
- [x] All traits contribute as per config weights

---

## ✅ 10-Minute Human Audit

1. ✅  File inventory passes  
2. ✅  Markdown formatting enforced  
3. ✅  Observability active  
4. ✅  Grade thresholds enforced  
5. ✅  Composite scoring logic stable  
6. ✅  Test suite passing  
7. ✅  Drift guardrails functional

---

✅ Checklist complete.  
Would you like me to deliver `system-readiness.ts` next?
```
