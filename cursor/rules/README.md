# 🎯 CanAI Rules Engine

This folder contains all `.mdc` (Model Directive Contract) rules that govern the safety, quality, emotional resonance, and strategic evolution of the CanAI system. These rules are parsed and enforced by Cursor agents, Codex logic, and prompt scaffolding validators.

Every rule is:
- Modular ✅
- Audit-traceable ✅
- Bound to `self-awareness.json` ✅
- Enforced by one or more agents or rule engines ✅

---

## 🔐 System Rules

| Rule | Purpose |
|------|---------|
| **codex-tone.mdc** | Protect emotional tone, fallback UX, and intelligent messaging integrity  
| **system-map-alignment.mdc** | Prevent untracked folder/structural changes not reflected in `system-map.md`  
| **agent-governance.mdc** | Restrict agent behavior to approved roles, paths, and action types  
| **ingestion-lock.mdc** | Ensure all key docs are re-ingested, validated, and SHA-tracked  
| **execution-logging.mdc** | Enforce mandatory logging to `auto-actions.log.md` for all structural or UX-affecting changes  

---

## 💎 Dreamstate Experience Rules

These rules preserve CanAI’s ideal customer experience across all system updates.

| Rule | Experience Layer |
|------|------------------|
| **cx-emotion.mdc** | Warm, reassuring, cinematic tone must be preserved in all user flows  
| **cx-reuse.mdc** | Every output must promote prompt chaining, input reuse, and lifecycle follow-through  
| **cx-first-impression.mdc** | Protects the cinematic onboarding, “What to Expect” overlays, and confidence-building UX  
| **cx-feedback-loop.mdc** | Feedback, revise frequency, and prompt performance must flow into analytics and evolution triggers  
| **cx-spark-layer.mdc** | Ensures Spark Layer (3 concept names) is always delivered post-intent with emotional resonance  

---

## 🧠 Self-Evolving System Rules

These enable Cursor and Codex to propose, track, and evolve the platform with increasing intelligence.

| Rule | Strategic Role |
|------|----------------|
| **self-expansion.mdc** | Requires all agents to log optimization, reuse patterns, or new abstractions to `idea-log.json`  
| **collaboration-contract.mdc** | Codifies 3-way communication protocol between Cursor, Cofounder (Billy), and ChatGPT Cofounder  

---

## 🤝 Bridge Rule: Collaboration Contract

The collaboration contract ensures **no insight or decision is lost** between Cursor, ChatGPT, and Billy:

- All shared code, schema, or logic must be copy/paste-ready  
- ChatGPT must always confirm, contextualize, and clarify before action  
- Cursor may not proceed on partial information  
- Nothing is trusted until it has been **echoed, confirmed, and recorded**

Enforced by: `collaboration-contract.mdc`  
Logged in: `auto-actions.log.md`

---

## 🧬 Versioning + Enforcement

All `.mdc` files are:
- Tracked in `/cursor/self-awareness.json → rulesEnforced`  
- Version-controlled and enforced via `circuit-breaker.ts` and `rule-engine.ts`  
- Read dynamically by Cursor agents before any significant system modification

---

## 🧾 Related Files

| File | Purpose |
|------|---------|
| `/cursor/self-awareness.json` | Central registry of rule contracts, agent boundaries, Codex traits, and lockpoints  
| `/cursor/auto-actions.log.md` | Operational changelog enforced by `execution-logging.mdc` and `collaboration-contract.mdc`  
| `/cursor/self-expansion/idea-log.json` | Intelligence inbox for self-evolving agent proposals  
| `/cursor/self-expansion/codex-traits.json` | Mirrors Cofounder's personality, tone, reflexes, and values for strategic alignment  

---

## 🧭 North Star

> **“Every rule protects something sacred.”**  
> CanAI rules are not bureaucracy — they are emotional and architectural scaffolds for a system that evolves without forgetting who it’s meant to serve.

