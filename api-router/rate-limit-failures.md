# 🛡 Rate Limit Failure Handling Contract — API Router

## Purpose
Standardize the emotional UX fallback and system behavior when users exceed allowed API request rates, ensuring operational resilience, Copilot-safe extension, and Dream-State emotional trust even under overload.

---

## 1. Rate Limit Failure Output Standard

| Field | Type | Description |
|:---|:---|:---|
| `success` | boolean | Always `false` for rate limit failures |
| `error.code` | string | Always `RATE_LIMIT_EXCEEDED` |
| `error.message` | string | Human-readable emotional fallback message |

**Rate Limit Error Response Example:**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You're sending requests too quickly. Please slow down and try again."
  }
}
```

---

## 2. Emotional UX Standards

| Scenario | Messaging |
|:---|:---|
| Short-term limit exceeded | "You're sending requests too quickly. Please slow down and try again." |
| Long-term quota exceeded (future expansion) | "You have reached your daily usage limit. Please try again tomorrow or upgrade your plan." |

*All fallback messages must preserve user dignity and provide next actions.*

---

## 3. System Behavior on Rate Limit Hit

| Step | Action |
|:---|:---|
| 1 | Immediately terminate further request processing |
| 2 | Normalize error into structured fallback output |
| 3 | Return HTTP 429 status code |
| 4 | Optionally include `Retry-After` header for client guidance |

---

## 4. Metadata (Optional, Future Expansion)

| Field | Purpose |
|:---|:---|
| `retryAfter` | Seconds until next allowed request |
| `limit` | Current rate limit |
| `remaining` | Requests remaining in current window |

**Example Future-Expanded Error Response:**
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

---

## 5. Copilot Embedded Guidelines

- Always respond with `success: false` and fixed error structure.
- Always snapshot test 429 fallback responses.
- Future expansions must remain backward compatible.
- Emotional language must never degrade into mechanical or punitive messaging.

---

# 🛡 Enforcement Reminder

Rate limits are not punishments —  
they are **trust boundaries** that must feel respectful, safe, and emotionally intelligent even under friction.

> No raw rejections.  
> No system error leaks.  
> No emotional trust fractures under load.  
> Dream-State UX is **never optional**, even under strain.

---
