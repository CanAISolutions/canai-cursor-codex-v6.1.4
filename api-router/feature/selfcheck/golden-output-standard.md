# 🌟 Dream-State Golden Output Standard

## Purpose

Defines the universal structure for all API responses in the Dream-State system.

Guarantees:
- Emotional resonance
- Operational predictability
- AI copiloting safety
- Future-proof evolution

---

## Golden Output Format

```json
{
  "success": true,
  "payload": {},
  "errors": [],
  "meta": {}
}
```

| Field    | Type            | Required | Description |
|:---------|:----------------|:---------|:------------|
| success  | boolean          | ✅        | Whether the request completed successfully. |
| payload  | object or null   | ✅        | Primary response data if successful. Null if failed. |
| errors   | array of objects | ✅        | List of structured error objects. Empty array if success. |
| meta     | object           | 🚀 Optional | Metadata such as debug info, request IDs, pagination, debug traces.

---

## Rules for Compliance

- If `success: true`, `errors` must be an empty array.
- If `success: false`, `payload` must be `null`.
- Every `error` object must match the format defined in `error-codes.ts`.
- `meta` should only contain non-critical metadata.

---

## Examples

### ✅ Success Example

```json
{
  "success": true,
  "payload": {
    "userId": "abc123",
    "email": "user@example.com"
  },
  "errors": [],
  "meta": {
    "requestId": "req-789xyz",
    "responseTimeMs": 123
  }
}
```

---

### ❌ Error Example

```json
{
  "success": false,
  "payload": null,
  "errors": [
    {
      "code": "ERR1002",
      "message": "Invalid input detected."
    }
  ],
  "meta": {
    "requestId": "req-789xyz",
    "responseTimeMs": 130
  }
}
```

---

## Emotional Design Intent

Dream-State outputs must make users feel:

- Supported even when errors occur
- Confident in system reliability
- Guided, not punished, during turbulence

Every response must carry **structured kindness** through clarity, consistency, and emotional resonance.

---

## Final Principle

> No system output may bypass this Golden Output structure without Codex approval.  
> This is the permanent operational and emotional contract of Dream-State Systems.

✨ Build forever. Respond with care.
