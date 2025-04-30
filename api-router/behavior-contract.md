# 🛡 API Router Middleware Behavior Contract

## Purpose
This contract defines the mandatory conduct rules for all middleware inside `/api-router/`, ensuring predictable input trust boundaries, emotional UX preservation, and system evolution safety under Copilot and human control.

---

## 1. Core Middleware Conduct Rules

| Rule | Enforcement |
|:---|:---|
| No middleware may mutate `req.body`, `req.query`, or `req.params` without explicit revalidation | ✅ Required |
| Input validation must occur **before** any auth, authorization, or rate-limiting middleware | ✅ Required |
| Authenticated payloads (`req.user`) must be attached in a safe, typed manner | ✅ Required |
| All errors must be normalized via standard error handlers | ✅ Required |
| No middleware may swallow errors silently — errors must propagate properly | ✅ Required |
| Middleware must either forward (`next()`) or terminate response with explicit UX fallback | ✅ Required |
| Emotional fallback UX must be respected if terminating request early | ✅ Required |

---

## 2. Input Trust Boundary Principles

| Principle | Enforcement |
|:---|:---|
| Only validated and sanitized inputs must reach business logic | ✅ Mandatory |
| Untrusted external data must never flow past perimeter without verification | ✅ Mandatory |

---

## 3. Standard Middleware Call Behavior

| Behavior | Expectation |
|:---|:---|
| On success | `next()` called immediately without mutation |
| On recoverable error | Structured emotional fallback response issued |
| On fatal error | Error normalized and passed to error handler |
| On auth failure | Friendly 401/403 response with dream-state UX wording |
| On validation failure | Friendly 400 response with dream-state UX fallback |

---

## 4. Copilot Embedded Guidelines

- Middlewares must expose minimal surface area (`req`, `res`, `next`) only.
- Must declare purpose and exit behavior in top comment block.
- Must snapshot field expectations where applicable (`req.user`, `req.body`, etc.).
- Must tag if **mutating** request objects (`MUTATES: true/false`).

---

## 5. Emotional UX Layer Enforcement

Failure points inside middleware must:
- Never leak raw errors (e.g., `jwt expired`, `validation failed`)
- Always provide emotionally safe fallback messages aligned with global UX contract
- Always respond in snapshot-compatible JSON structure (for drift detection)

---

# 🛡 Dream-State Compliance Reminder

Middleware is the unseen handshake between the user and the system.  
It must feel **seamless**, **predictable**, and **trustworthy** — even when something fails.

> No middleware may betray emotional UX.  
> No silent mutations.  
> No silent failures.  
> No broken contracts.

Dream-State systems **encode trust into every invisible layer** — middleware included.

---
