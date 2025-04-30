# ✅ CanAI Accelerators – Codex Enforcement Hardening Plan

📍 Path: `/cursor/accelerators/`
🔐 Governed by: PRIME DIRECTIVE + CHECKPOINT DIRECTIVE

---

## 🎯 PURPOSE

This folder defines **modular intelligence engines** that power adaptive, predictive, and resilient behavior across CanAI.

It is a high-risk, high-leverage subsystem — all modules here affect real-time system behavior, agent fallback, prompt evolution, and emotion-responsive logic.

This hardening plan enforces **the 7 Dream-State Checkpoints** and establishes a permanent defense against decay, drift, or confusion.

---

## 🔒 MANDATORY FILES PER MODULE

Every folder inside `/cursor/accelerators/` must contain the following:

| File | Purpose | Status |
|------|---------|--------|
| `README.md` | Overview of module logic, dependencies, and outputs | ✅ Present |
| `behavior-contract.md` | Declares purpose, inputs/outputs, mutation rules, constraints | ❌ Required |
| `self-check-blocks.md` | Internal logic checks, mutation detection, repair triggers | ❌ Required |
| `*.test.ts` or `/tests/` | Unit tests or integration coverage of core logic | ❌ Required |
| `version-lock` (comment or file) | Declares agent version, sync status, changelog hook | ❌ Required |
| `.jsonc` config file | Human-editable and AI-readable module settings | ✅ Present in most |
| `/** cursor:input */` style comments | AI copilot affordances for all `.ts` files | 🟡 Likely Partial |

---

## 🧠 FUTUREPROOF CONTRACTS

Add the following **across all accelerator modules** to meet system immortality and LLM upgrade-readiness:

### 1. `behavior-contract.md`

```markdown
# 🤖 Behavior Contract – [MODULE NAME]

## 🔍 Purpose
Describe the strategic intent of this agent.

## 🧾 Inputs
- [List fields, types, origin sources]

## 🎯 Outputs
- [Target variables or mutations]
- [Expected impact area]

## 🚫 Constraints
- [e.g., Must not overwrite user memory]
- [e.g., Only triggers in fallback mode]

## 🔁 Mutation Policy
- Version-safe
- Logged in prompt-deltas
- Supports rollback

## 🧠 Codex Notes
- Compatible with Cursor AI
- Self-describes its decision space
