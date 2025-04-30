# 📦 Output Standardization Contract — API Router

## Purpose
Enforce a permanent, consistent, emotionally intelligent output structure across all API endpoints, ensuring operational trust, Copilot extensibility, emotional UX preservation, and drift-proof system evolution.

---

## 1. Standard Success Response Structure

| Field | Type | Description |
|:---|:---|:---|
| `success` | boolean | Always `true` for successful operations |
| `data` | object | The returned payload data |

**Success Response Example:**
```json
{
  "success": true,
  "data": {
    "userId": "abc123",
    "profileComplete": true
  }
}
```

---

## 2. Standard Error Response Structure

| Field | Type | Description |
|:---|:---|:---|
| `success` | boolean | Always `false` for errors |
| `error.code` | string | Machine-readable, snapshot-safe error identifier |
| `error.message` | string | Emotionally safe, human-readable explanation |

**Error Response Example:**
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

## 3. Mandatory Output Rules

| Rule | Enforcement |
|:---|:---|
| No route may return raw or ad-hoc JSON responses | ✅ Required |
| All successful responses must wrap data under `success: true` + `data: {...}` | ✅ Required |
| All failure responses must wrap under `success: false` + `error: { code, message }` | ✅ Required |
| Output fields must always exist — never conditionally omitted | ✅ Required |
| Data payloads must be type-coherent and match documented schemas | ✅ Required |

---

## 4. Special Cases

| Scenario | Enforcement |
|:---|:---|
| Empty Success (e.g., POST /create returns nothing) | Return `success: true, data: {}` |
| Paginated Responses | Encapsulate pagination metadata under `data.pagination` key |
| Batch Operations | Encapsulate success/failure results under `data.results` array |

**Example (Paginated Response):**
```json
{
  "success": true,
  "data": {
    "items": [{ "id": "1" }, { "id": "2" }],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 45
    }
  }
}
```

---

## 5. Copilot Embedded Guidelines

- Top-level field structure must remain invariant.
- Copilots must auto-generate snapshot-testable responses.
- Expansion (e.g., new fields under `data`) must be non-breaking to parent structure.
- Failure outputs must never mutate into raw JSON or incomplete error objects.

---

# 🛡 Enforcement Reminder

API outputs are not just data structures —  
they are **trust contracts**, **UX anchors**, and **evolution scaffolds**.

> No drift.  
> No raw data leaks.  
> No broken user expectations.  
> Dream-State flows are protected at every output.

---
