# 🧪 `/test-data/_tests/` — Codex QA Integrity Layer

This folder contains all **system-level test validators** that ensure the rest of `/test-data/`:

- Follows strict Codex standards
- Prevents silent failures
- Stays CI-ready, Copilot-compatible, and snapshot-safe

---

## 🔒 Test Files in This Layer

| File | Purpose |
|------|---------|
| `test-input-shape-field.ts` | Verifies all `*.expected-error.json` and `*.expected-output.json` contain a valid `inputShape` block with required fields |
| `test-prompt-type-coverage.ts` | Confirms all 7 core promptTypes have `.input.json` and `.snapshot.json` — and snapshot contains full `inputShape` |
| `test-codex-header-comments.ts` | (Coming next) Verifies all `*.json` blueprints contain full Codex header comment blocks for Copilot context

---

## 🧠 Codex Rules Enforced Here

- Every test input must match prompt schema shape
- Every snapshot must be replayable + SmartPromptScore-safe
- Every edge case must have a triad (`.input`, `.expected-*`, `.json`)
- Every test case must include:
  - `@codex-purpose`
  - `@codex-system`
  - `@codex-critical`
  - `@codex-verified`

---

🧱 This folder is **not for app logic tests**  
This folder is **for validating the test system itself**

It's how we stop bugs before they even become tests.
