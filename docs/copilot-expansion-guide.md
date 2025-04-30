# 🤖 Dream-State Copilot Expansion Guide

## 📦 Purpose
Enables AI copilots, developers, or future contributors to safely extend, evolve, or debug the Dream-State API system without corrupting emotional UX, structural integrity, or scaling resilience.

---

## 🛠 Golden Expansion Rules

| Rule | Description |
|:-----|:------------|
| Preserve Emotional UX | Never output raw errors. Always use `standardizeError`, `standardizeSuccess`. |
| Enforce Input Validation | All POST/PUT endpoints must validate inputs via `validateInput` or dynamic `validationChecker`. |
| Route with Metadata | All new routers must define `routeMeta` objects describing validation, auth, and rate limit needs. |
| Update Route Manifest | All live endpoints must match golden manifest or self-generating systems. |
| Extend Selfcheck if Critical | Any new system-critical behavior must be protected by a selfcheck module. |
| Snapshot-Test Critical Expansions | All middlewares, validators, loaders must have minimal coverage in `/__tests__/`. |

---

## 🛠 Safe Extension Pathways

| Action | How-To |
|:-------|:-------|
| Add New Router | Fork `/feature/posts/`, define routes, schemas, routeMeta, register via `registerRouter()`. |
| Add New Middleware | Fork `/middleware/_templateMiddleware.ts`, follow expansion guide, test, document. |
| Add New Config Field | Update `.dreamstate-config.json`, extend schema, snapshot-test boot. |
| Add New Selfcheck | Create new module under `/selfcheck/`, hook into `runFullSelfcheck()`. |
| Update Devtools | Add new endpoints under `/devtools/` safely — block in production environments. |

---

## 🛡 Copilot Red Flags (Must Fix Before Merge)

- Silent middleware skipping
- Raw JSON or unstructured payloads
- Missing input validation
- New routes without routeMeta
- Mutation of shared global state without schema control
- Non-emotional error messaging

---

# 🛡 Final Reminder

Dream-State systems are living entities.  
Copilots are caretakers — not just coders.

Every addition must strengthen:  
- Operational resilience  
- Emotional UX safety  
- Scaling predictability  

No shortcuts.  
No regressions.  
Only compound trust.

---
