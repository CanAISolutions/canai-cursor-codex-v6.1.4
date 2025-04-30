# 🧠 Meta Registry (`/test-data/meta/`)

## ✅ Purpose
This folder contains the **metadata brain** for the entire CanAI validation and snapshot ecosystem.  
It defines what’s covered, how it's guarded, and what each `promptType`, error state, or system pathway relies on.

It is the **single source of truth** for:
- Snapshot coverage integrity (`coverage.json`)
- Edge case defense map (`edge-case-index.json`)
- Prompt type QA matrix (`promptType-index.json`)

---

## 📂 File Breakdown

| File Name              | Purpose                                                                 |
|------------------------|-------------------------------------------------------------------------|
| `coverage.json`        | Declares which runtime scenarios have snapshot test coverage            |
| `edge-case-index.json` | Tracks all known failure modes and their snapshot/test guards           |
| `promptType-index.json`| Maps each promptType to its related edge cases and snapshot protection  |

---

## 🧪 Usage

### 🔎 For QA / CI Systems:
- Validate full test coverage per snapshot and promptType
- Auto-trigger snapshot diffs or coverage alerts
- Audit for orphaned logic, untested flows, or new promptTypes

### 🤖 For Copilot / AI Refactoring:
- Auto-suggest tests when new code touches a guarded path
- Diagnose missing coverage for new promptTypes or error cases
- Map fallback behavior to guardrails with confidence

---

## 🛡 Codex Principles

- **Every snapshot must be indexed.**
- **Every edge case must be traceable.**
- **Every promptType must be protected.**

> _This folder turns test coverage into a permanent, queryable memory layer._

---

## 🔄 Version Sync

All entries here are valid against:  
**Codex v1.4.2**

