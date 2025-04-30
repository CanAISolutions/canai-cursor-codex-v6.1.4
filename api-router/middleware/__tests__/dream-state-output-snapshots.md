# 🛡 Dream-State API Output Snapshots — Permanent Reference

## 📦 Purpose
This document defines the permanent, Codex-sealed structure of all key API responses under Dream-State emotional UX and operational resilience standards.

Snapshot tests, Copilot expansions, and future system evolutions must always conform to these structures.

---

## ✅ Standard Successful Response

```json
{
  "success": true,
  "data": {
    "field1": "value",
    "field2": "value"
  }
}
```

| Rule | Enforcement |
|:---|:---|
| `success` field must be `true` | Always present |
| `data` must be an object | No root-level arrays |
| No additional top-level fields unless approved | Protect emotional clarity |

---

## ❌ Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable, emotionally safe error message."
  }
}
```

| Rule | Enforcement |
|:---|:---|
| `success` field must be `false` | Always present |
| `error.code` must be a machine-safe identifier (UPPER_SNAKE_CASE) | |
| `error.message` must be user-safe and emotionally neutral or supportive | |
| No raw error objects | |

---

## 🚫 Standard Validation Failure Response

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "One or more fields are invalid. Please check your input and try again."
  }
}
```

| Rule | Enforcement |
|:---|:---|
| Always use `INVALID_INPUT` as the error code for validation failures | |
| Message must invite correction, not blame the user | |
| No field-by-field raw dumps unless humanized and emotionally curated | |

---

## 🛡 Standard Rate Limit Exceeded Response

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You're sending requests too quickly. Please slow down and try again."
  },
  "meta": {
    "retryAfter": 60,
    "limit": 100,
    "remaining": 0
  }
}
```

| Rule | Enforcement |
|:---|:---|
| Emotional UX fallback on overload — no raw "429 Too Many Requests" | |
| Include `retryAfter` field (seconds) | |
| Include `limit` and `remaining` for session UX clarity | |
| Never expose system internals (IP blocks, tokens) in errors | |

---

# 🛡 Dream-State Codex Notes

- **Clarity > Detail:** Payloads must feel safe, focused, and emotionally manageable.
- **Supportive Messaging:** Even on errors or overload, users must feel guided, not blamed.
- **No Raw Internal Leakage:** Internal codes, debug traces, or system internals must never appear.
- **Test Driven Discipline:** Snapshot tests should flag any deviation automatically.

---

# 🛡 Enforcement Reminder

This document **is not a suggestion** —  
It is a **permanent operating contract** for all future system outputs.

If outputs drift from these structures:
- Snapshots must fail.
- PRs must block.
- Fixes must realign to this document immediately.

No drift.  
No emotional decay.  
No trust breaches.

---
