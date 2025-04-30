# 🧪 `/test-data/edge-cases/` — Codex-Verified System Failure Vault

This folder contains every **non-optional, contract-level failure condition** that CanAI must catch, explain, and defend against — before a single prompt touches GPT.

From broken enhancer references to token overloads, malformed JSON, session ID collisions, and unknown prompt types, each test:

- Protects downstream logic
- Powers Copilot simulations
- Validates schema enforcement
- Documents what **must never silently fail**

---

## 📦 File Triad Convention

Every edge case consists of **three files**:

| File | Description |
|------|-------------|
| `name.input.json` | The payload that triggers the failure |
| `name.expected-error.json` _(or `.expected-output.json`)_ | The system’s response — fully structured |
| `name.json` | The canonical blueprint that defines the entire scenario with `_meta` for traceability and Copilot context |

---

## ✅ Naming Rules (Enforced)

- Use `kebab-case` for all filenames
- Each edge case must include all 3 files
- Use `.expected-error.json` for hard failures
- Use `.expected-output.json` for graceful fallbacks

---

## 🧠 Codex Blueprint Format

```jsonc
// @codex-purpose: Why this edge case exists
// @codex-system: What part of the system this protects
// @codex-critical: What catastrophic behavior this prevents
// @codex-verified: Last tested system version

{
  "type": "edge-case",
  "input": { ... },
  "expected": { ... },
  "_meta": {
    "description": "Human + Copilot-readable reason this exists",
    "triggerField": "the specific field that triggers the error",
    "guardrailFor": "the subsystem this prevents from breaking",
    "assert": "matchErrorStructure | matchFallbackStructure",
    "snapshotCompatible": true,
    "lastVerifiedAgainst": "v1.4.2"
  }
}
