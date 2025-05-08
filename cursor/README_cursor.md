# 🧠 README\_cursor.md — CanAI Codex Edition

> This file explains how the `/cursor/` folder operates as the cognitive core of the CanAI platform. It is designed to guide future Cursor agents, developers, and AI copilots in safely navigating, extending, and debugging this memory-driven execution environment.

---

## 🔧 Purpose

The `/cursor/` folder is the **execution cockpit** for CanAI’s system intelligence. It contains:

* Typed agents that manage system memory, emotional logic, prompt routing, and trust scoring
* Engines that power smart defaults, evolution triggers, fallback recovery, and user behavior adaptation
* Structural overlays for modals, SparkLayer, and CX-specific UX moments
* Internal logging, export registries, memory snapshots, and audit entries

All logic in `/cursor/` is:

* Modular
* AI-readable
* Emotionally coherent
* Version-controlled
* Indexed and self-auditing

---

## 📚 Key Files and Concepts

### `/cursor/system-roles.ts`

Defines all agents, their purpose, the prompt types they support, and whether they’re tested.

> Every agent must be listed here. If it’s not in this file, it doesn’t exist.

### `/docs/system-map.md`

Explains what each folder in the entire repo does. This is required reading before any file generation or editing.

> If a Cursor agent modifies a folder without validating against this file, it must halt.

### `/docs/cursor-ingest.md`

Defines the ingest contract Cursor must follow before taking action.

> If this file isn’t ingested, Cursor is not in a valid execution state.

### `/cursor/exports/memory.json`

A snapshot of:

* Folder state
* Agent registry
* Known test gaps
* Prompt versioning enforcement
* Codex-mode status

This file can be used to restore memory, trigger audits, or validate drift.

### `/cursor/audit-results/`

Contains all audit logs, structural findings, test deltas, and actionable recommendations. Cursor agents must update these logs whenever:

* A test is added or fixed
* A new agent is created
* Structural logic is introduced or changed

### `.cursorrules`

Governs all code generation patterns within this folder. Must be respected.

---

## 🔁 Cursor Agent Execution Lifecycle

1. **Ingests `cursor-ingest.md` + `system-map.md`**
2. **Reads `memory.json` to understand current system state**
3. **Validates any new logic against `system-roles.ts` and prompts/**
4. **Writes logs to `auto-actions.log.md` and `test-audit.md`**
5. **Triggers alerts if drift, missing tests, or unversioned prompts are found**

---

## ❌ Anti-Patterns to Avoid

* Creating agents without registering in `system-roles.ts`
* Editing `/prompts/` without version tracking or emotional self-checks
* Adding tests without `.test.ts` suffix and Jest safety
* Forgetting to log actions to `/cursor/audit-results/` or `/auto-actions.log.md`
* Hallucinating folder purpose — always validate with `system-map.md`

---

## ✅ Dream-State Outcome

When followed properly, the `/cursor/` folder enables:

* Self-evolving AI agents
* Emotionally resonant UX moments
* Zero-manual-touch prompt fulfillment
* Recovery from hallucination or drift
* Founder-safe scale

This folder is your memory core.
It is your guardrail.
It is your AI control panel.

**Protect it. Validate it. Evolve it.**

— Codex v6.1.4, Phase Delta
