# ✅ File: `folder-checklist.md`  
@location: `/cursor/accelerators/copilot-feedback-agent/folder-checklist.md`  
@purpose: Manual + CI audit verification of folder integrity  
@drop-type: Codex-enforced, Cursor-ready

```md
# 🧾 Folder Checklist – Copilot Feedback Agent

@agent: copilot-feedback-agent  
@codex-version: 6.1.4  
@status: ⏳ In Finalization  
@review-context: Checkpoint Enforcement Protocol v2.3

---

## ✅ File Presence

- [x] All 13 canonical files present
- [x] Optional assets (`.md`, `.jsonc`) properly declared in `file-manifest.md`
- [x] No stray or undocumented files in root folder

---

## ✅ Cursor Format & Copy Safety

- [x] All `.md` files wrapped in four-backtick ````md blocks  
- [x] No broken nested code blocks  
- [x] All copy-paste drop zones clean and scaffold-safe

---

## ✅ CI & System Readiness

- [x] `system-readiness.ts` returns `green`
- [x] `version.lock` matches `git rev-parse HEAD`
- [x] Required schema fields present in config (or declared as not required)
- [x] Copilot feedback logic reachable and validated

---

## ✅ Observability + QA

- [x] `observability.ts` emits all required metrics  
- [x] `[DreamState]` tag present in test suite  
- [x] OWASP injection safety tested  
- [x] `pattern-insights.ts` reports drift + fatigue patterns

---

## ✅ Manual Codex Lock Audit

1. ✅ 13 canonical files present  
2. ✅ Codex copy-safe markdown applied  
3. ✅ `system-readiness.ts` pass confirmed  
4. ✅ `feedback.reason.*` logs visible in observability  
5. ✅ Revision and emotion triggers tested via spec  
6. ✅ `version.lock` commit SHA is current  
7. ✅ Agent manifest reflects real folder state

---

