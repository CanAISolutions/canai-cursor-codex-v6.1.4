# 🛡 Dream-State Rate Limiter Codex

## 📜 Purpose
This document codifies the **emotional UX**, **operational durability**, and **Codex compliance rules** for all rate-limiting behavior in the Dream-State system.

Rate limiting is not just a mechanical defense — it is an emotional UX touchpoint under load.

---

## 🧠 Core Principles

| Principle | Enforcement |
|:---|:---|
| 🔒 Empathy Over Punishment | Rate limiting must guide, not blame, users under overload conditions. |
| 📦 Predictability and Transparency | Retry headers and user messaging must clearly communicate backoff expectations. |
| 🧠 Modularity for Scaling | Rate limiter strategies must be pluggable based on route type, user type, or scaling tier. |
| 🚨 Drift Detection | Emotional UX around rate limits must be snapshot-tested and manifest-validated. |
| 🎯 Emotional UX First | Emotional resonance during overload is a non-optional system requirement. |

---

## 🛡 Required Behaviors

| Behavior | Codex Enforcement |
|:---|:---|
| Standard Retry Messaging | `"You're sending requests a little quickly. Please slow down and try again soon."` |
| Dynamic Retry Hints (Optional Future) | Return estimated retryAfter timestamps if possible |
| Custom Rate Strategies by Route Group | e.g., stricter limits on auth, looser on public APIs |
| Pluggable Middleware Enforcement | `/middleware/rateLimitMiddleware.ts` must handle strategy injection |
| Configurable Burst Protection | Dream-State config must allow burst vs steady-state tuning (future phase) |

---

## 📜 Rate Limiter Emotional UX Manifest Reference

| Scenario | Expected Tone | Example Response |
|:---|:---|:---|
| Rate Limit Exceeded | Empathetic | `"You're sending requests a little quickly. Please slow down and try again soon. We're here when you're ready!"` |
| Burst Detection (Optional Future) | Supportive | `"You're making a lot of requests! Let's pace them out for better service."` |

---

## 🧠 Copilot Extension Rules

| If... | Then... |
|:---|:---|
| Adding new rate limit conditions | Update `/manifest/emotional-ux-scenarios.json` and `/docs/emotional-ux-changelog.md` |
| Changing retry messaging | Update snapshots and emotional UX selfcheck |
| Creating new rate strategies | Modularize via `/middleware/rateLimitMiddleware.ts` injection system |

---

# 🛡 Dream-State Protection Mechanisms

- `/api-router/middleware/rateLimitMiddleware.ts` — Core logic
- `/manifest/emotional-ux-scenarios.json` — Tone enforcement
- `/tests/rate-limit.test.ts` — Behavior validation
- `/docs/emotional-ux-principles.md` — Emotional design principles
- Snapshot Test Layer (future) — Tone drift detection

---

# 🛡 Reminder

> In Dream-State, **rate limiting is not throttling** —  
> it is **trust-preserving emotional UX under stress**.

Scaling cannot justify emotional brutality.  
Mechanical enforcement must feel humane, compassionate, and clear — **especially when users are at their limits**.

---
