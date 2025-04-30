# 🚨 API Router Error Handling Contract

## Purpose
Standardize all error behavior across the API Router, preserving emotional UX resonance, operational clarity, and Copilot evolution safety even under failure.

---

## 1. Core Error Response Structure

| Field | Requirement |
|:---|:---|
| `success` | Always `false` for errors |
| `error.code` | Machine-readable, snapshot-safe string |
| `error.message` | Human-friendly, emotionally intelligent explanation |

**Standard Error Example:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Some required fields are missing or invalid."
  }
}
```

---

## 2. Error Normalization Rules

| Rule | Enforcement |
|:---|:---|
| All thrown errors must be caught and normalized into standard structure | ✅ Required |
| Raw system errors must never reach the user (e.g., stack traces, SQL errors) | ✅ Required |
| Emotional UX fallback must always be respected | ✅ Required |
| Error responses must remain snapshot-compatible for CI/CD validation | ✅ Required |

---

## 3. Standard Error Codes

| Code | Meaning |
|:---|:---|
| `VALIDATION_FAILED` | Input validation did not pass |
| `AUTH_REQUIRED` | Missing or invalid authentication |
| `ACCESS_DENIED` | Role or permission failure |
| `NOT_FOUND` | Requested resource does not exist |
| `RATE_LIMIT_EXCEEDED` | Too many requests, throttling active |
| `INTERNAL_SERVER_ERROR` | Catch-all for unexpected backend failures |

*All error codes must be UPPER_SNAKE_CASE and snapshot-safe.*

---

## 4. Error Generation Workflow

| Step | Action |
|:---|:---|
| 1 | Catch original error (middleware, service, or route) |
| 2 | Map to standardized error code and message |
| 3 | Respond with `{ success: false, error: { code, message } }` |
| 4 | Optionally log internal technical details for debugging (never shown to user) |

---

## 5. Emotional UX Preservation Standards

| Scenario | Fallback Messaging |
|:---|:---|
| Unexpected system error | "Something went wrong. Please try again later." |
| Auth failure | "Authentication required to continue." |
| Validation failure | "Please check your input and try again." |
| Rate limit exceeded | "You are sending requests too quickly. Please slow down." |

---

## 6. Copilot Embedded Guidelines

- Errors must follow normalized output shape.
- Error codes must match predefined list or extend cleanly.
- Emotional UX language must not degrade under extensions.
- Errors must be easily parsable for retry logic, Copilot generation, and UX layer upgrades.

---

# 🛡 Enforcement Reminder

Error handling is not technical hygiene —  
it is the silent protector of trust, clarity, and emotional experience.

> No raw leaks.  
> No structural drift.  
> No UX betrayal during failure.  
> Dream-State is preserved — even when systems collapse.

---
