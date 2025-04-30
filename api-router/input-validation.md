# 🧠 Input Validation Contract — API Router

## Purpose
Define and enforce the mandatory input validation behaviors for all API routes, preserving operational trust, system security, emotional UX resilience, and Codex-evolution safety.

---

## 1. Core Input Validation Rules

| Rule | Enforcement |
|:---|:---|
| All user inputs must be schema-validated before business logic execution | ✅ Required |
| Validation must occur before authentication or authorization checks | ✅ Required |
| Invalid inputs must trigger emotionally safe fallback responses | ✅ Required |
| No input may mutate during validation without explicit, documented transformation | ✅ Required |
| Validation failures must use standardized error outputs | ✅ Required |

---

## 2. Schema Standards

| Standard | Enforcement |
|:---|:---|
| JSON Schema or Zod-style declarative validation recommended | ✅ |
| All fields (body, query, params) must be explicitly defined | ✅ |
| Type coercion must be controlled and auditable | ✅ |
| Optional fields must be explicitly allowed (never implicit) | ✅ |

---

## 3. Validation Failure UX Standards

| Failure Scenario | Response Behavior |
|:---|:---|
| Missing required field | HTTP 400 with friendly message: "Some required information is missing." |
| Invalid field type | HTTP 400 with friendly message: "Some information appears invalid. Please check and try again." |
| Unexpected field or data | HTTP 400 with generic safe fallback: "The request format was not recognized." |

**Standardized Validation Error Response:**
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

## 4. Minimal Mutation Policy

| Principle | Enforcement |
|:---|:---|
| Inputs must be trusted as-is after validation passes | ✅ |
| If mutation is necessary (e.g., trimming whitespace), it must be explicit | ✅ |
| Validation and transformation must never silently mutate structure | ✅ |

---

## 5. Validation Chain Positioning

**Mandatory Order for Route Handlers:**
1. Input Validation (`validateInput`)
2. Authentication (`requireAuth`)
3. Authorization (`requireRole`)
4. Rate Limiting
5. Business Logic Execution

---

## 6. Copilot Embedded Guidelines

- All validations must snapshot cleanly.
- Failure responses must match standardized emotional UX fallback.
- Copilots should recognize validation as the first trust boundary.
- Schema extensions must be safe, minimal, and auditable.
- Copilots must never auto-generate routes that skip validation layers.

---

# 🛡 Enforcement Reminder

Input Validation is not just a technical guardrail —  
it is the **foundation of trust** between system, user, and future Copilot expansions.

> No dirty input passes through.  
> No emotional UX fractures.  
> No silent corruptions.  
> Dream-State systems **validate trust before granting it.**

---
