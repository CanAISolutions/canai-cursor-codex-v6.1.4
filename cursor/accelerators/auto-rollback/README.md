```markdown
# 🧠 Auto-Rollback Subsystem

📁 Path: `/cursor/accelerators/auto-rollback/`  
🔐 Codex Enforcement Class: [Reflex Integrity Agent]  
🧠 Version: `v1.0.0`  
🧱 Status: Cursor-Hardened – All 7 Dream-State Checkpoints Enforced

---

## 🎯 Purpose

The `auto-rollback` subsystem detects systemic degradation or mutation drift and reverts CanAI to the **last known good state**.

It is the system’s **reflex arc** — fast, deterministic, and emotionally safe.

Rollback triggers may include:
- High delta scores from prompt diffs  
- Emotional derailment detection  
- Modularity breaks  
- Operator overrides  
- Failed self-healing attempts

---

## 🧠 Copilot Affordances

This module is fully Cursor and Copilot compatible:

- Reads structured rules from:  
  `trigger-conditions.jsonc`
- Logs rollback events to:  
  `sessionDeltaLogEmitter`
- Executes reversion via:  
  `promptReplay()`
- Copilot-readable metadata is declared in:  
  `behavior-contract.md` and `self-check-blocks.md`

---

## 🧩 Folder Structure

| File | Description |
|------|-------------|
| `trigger-conditions.jsonc` | Schema of rollback thresholds and flags |
| `rollback-engine.ts` | Core rollback execution logic |
| `rollback-engine.test.ts` | Unit tests validating delta triggers and rollback behavior |
| `rollback-policy.md` | Behavioral rules, decision logic, and escalation paths |
| `behavior-contract.md` | I/O declaration, mutation constraints, and copilot schema |
| `self-check-blocks.md` | Internal diagnostics and resilience rules |
| `README.md` | Overview of logic, usage, and system interlinks |

---

## 🔗 System Integration

This module integrates with the following CanAI intelligence layers:

- `/self-healing/ai-refactor-scripts/promptReplay.ts`  
- `/self-healing/output-delta-analyzer.ts`  
- `/tests/sessionRefactorLogWriter.ts`  
- `/system-intel/loggers/sessionDeltaLogEmitter.ts`  
- `/cursor/accelerators/zombie-hunter/` (fallback escalation path)

---

## ✅ Codex Enforcement

This subsystem satisfies all 7 checkpoints of the Dream-State Checkpoint Directive:

- ✅ Fail-Safe Engineering  
- ✅ Full Validation  
- ✅ Codified Logic  
- ✅ Copilot Native  
- ✅ Decay Prevention  
- ✅ Precision Policy  
- ✅ Billion-Dollar Clarity

---

> This folder is not a patch. It is a **reflex system**.  
> If CanAI begins to drift, this is the moment that catches it, corrects it, and protects the user experience from invisible chaos.
```
