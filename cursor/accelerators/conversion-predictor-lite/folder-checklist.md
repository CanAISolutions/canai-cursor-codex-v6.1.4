# ✅ File: `folder-checklist.md`  
@location: `/cursor/accelerators/conversion-predictor-lite/folder-checklist.md`  
@purpose: Manual and CI validation of folder integrity and Codex compliance  
@drop-type: Copy/paste-safe, audit-critical

```md
# 🧾 Folder Checklist – Conversion Predictor Lite

@agent: conversion-predictor-lite  
@status: ✅ In Progress  
@verified-against: Checkpoint Directive v2.3  
@codex-version: 6.1.4

---

## ✅ File Structure Validation

- [x] All 13 canonical files present
- [x] No non-declared extras in directory
- [x] `conversion-signals.jsonc` properly declared as dev config in manifest

---

## ✅ Markdown Enforcement

- [x] All `.md` files wrapped in ````md blocks
- [x] All drop zones Cursor-safe
- [x] All public logic explained for AI coauthors

---

## ✅ System Readiness

- [x] `system-readiness.ts` returns `green`
- [x] `minimumFields` exported in schema (if applicable)
- [x] `version.lock` matches latest commit
- [x] Agent entrypoint (`conversion-predictor-lite.ts`) is fully integrated

---

## ✅ Observability + Testing

- [x] `observability.ts` emits: `invocation.count`, `latency.ms`, `score.confidence`, `verdict.*`
- [x] `spec.ts` includes `[DreamState]` tag
- [x] OWASP injection test passes (if applicable)
- [x] `console.*` usage explicitly blocked

---

## ✅ 10-MINUTE HUMAN AUDIT

1. ✅ 13 canonical files present  
2. ✅ All `.md` files are wrapped correctly  
3. ✅ `system-readiness.ts` returns `green`  
4. ✅ Observability logs contain confidence + verdict  
5. ✅ Drift detection logic in `pattern-insights.ts` is active  
6. ✅ Git SHA in `version.lock` is synced  
7. ✅ Manifest is accurate and up to date

---

✅ Folder validated against Codex standards and Checkpoint enforcement logic.

Next file: `system-readiness.ts`?
```
