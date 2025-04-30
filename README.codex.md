# 🧠 Codex QA System — Integrity Layer v1.4.2

This system enforces the full structural integrity of CanAI's `test-data/` folder — powering prompt correctness, snapshot safety, Copilot alignment, and zero-manual-touch reliability.

---

## ✅ Tests Included

| File | Purpose |
|------|---------|
| `test-input-shape-field.ts` | Asserts all `*.expected-*.json` include a valid `inputShape` |
| `test-prompt-type-coverage.ts` | Verifies all 7 promptTypes have full triad coverage |
| `test-codex-header-comments.ts` | Checks that every `*.json` has Codex-style metadata headers |
| `test-snapshot-consistency.ts` | Confirms `.snapshot.json` matches `.input.json` field values |
| `test-output-delta-drift.ts` | Tracks changes in `.snapshot.json` outputs over time |

---

## 🚀 Run All Tests (Local)

> From the root of your repo:

```bash
npx ts-node scripts/codex-check.ts
