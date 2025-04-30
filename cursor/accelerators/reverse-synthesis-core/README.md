# 🧬 Reverse Synthesis Core

**Module ID:** `reverse-synthesis-core`  
**Status:** ✅ Codex Finalized – Snapshot-Safe  
**Last Verified:** 2025-04-30

---

## 🎯 Purpose

Reconstruct the likely prompt intent, tone, and template used to generate a given output — enabling prompt lineage tracking, replay, UX debugging, and Copilot-enhanced regeneration flows.

This module empowers the CanAI system to **think backwards** — from output to origin.

---

## 🧬 Capabilities

| Capability                     | Description |
|--------------------------------|-------------|
| Output → Prompt Inference      | Reverse-engineer prompt traits from copy |
| Tone + Template Detection      | Uses patterns to identify structure and emotion |
| Pure Function – Snapshot Safe  | Stateless, Copilot-safe, test-covered |
| Confidence + Drift Scoring     | Matches are scored with explainable rationale |
| Traceable + Loggable           | All outputs log reasoning, tags, and pattern hits |
| Pattern Schema Driven          | JSONC-based map for safe expansion and LLM co-evolution |

---

## 📁 Module Contents

| File                                 | Purpose |
|--------------------------------------|---------|
| `reverse-synthesis-engine.ts`        | Core inference logic |
| `reverse-synthesis-engine.spec.ts`   | Tests fallback, scoring, trace logic |
| `synthesis-patterns.jsonc`           | Regex + metadata pattern map |
| `behavior-contract.md`               | Copilot-safe I/O definition |
| `self-check-blocks.md`               | QA + drift resilience rules |
| `synthesis-trace-schema.md`          | Log structure for analytics/replay |
| `README.md`                          | Codex summary and checkpoint record |

---

## 🔐 Codex Compliance

| Checkpoint                         | ✅ Status |
|------------------------------------|-----------|
| Snapshot-tested                    | ✅ Yes |
| Emotionally intelligent            | ✅ Yes |
| Self-healing fallback logic        | ✅ Yes |
| Schema-based evolution             | ✅ Yes |
| Logging trace + scoring included  | ✅ Yes |
| Copilot-invocable + upgrade-safe  | ✅ Yes |

---

> “This is how CanAI thinks backwards — not just generating, but understanding where it came from.  
> The past becomes queryable. The output becomes truth-traceable. The system becomes self-aware.”

