# 🛡️ Dream-State Selfcheck Output Standard

## Purpose

Defines the universal structure for all system selfcheck reports within the Dream-State platform.  
Guarantees operational predictability, AI coauthorability, dashboard readiness, and future-proof self-monitoring.

---

## SelfcheckReport Format

```json
{
  "success": true,
  "details": {
    "postDeploySelfcheck": true,
    "routesManifestSelfcheck": true,
    "inputValidationSelfcheck": true
  },
  "mismatches": {
    "postDeploySelfcheck": [],
    "routesManifestSelfcheck": [],
    "inputValidationSelfcheck": []
  }
}
```

---

## Field Definitions

| Field      | Type             | Required | Description |
|:-----------|:-----------------|:---------|:------------|
| success    | boolean           | ✅        | Overall result: true if all checks pass, false if any fail. |
| details    | object            | ✅        | Map of selfcheck module names to individual success (true/false) flags. |
| mismatches | object of arrays  | ✅        | Map of selfcheck module names to arrays of mismatch/failure details (empty array if none). |

---

## Success Rules

- `success: true` only if **all** entries in `details` are `true`.
- If any detail is `false`, then `success: false`.
- `mismatches` must **always** include keys for every registered selfcheck module (even if arrays are empty).
- No fields may be omitted, even if empty — predictability enforced.

---

## Example — Full Pass

```json
{
  "success": true,
  "details": {
    "postDeploySelfcheck": true,
    "routesManifestSelfcheck": true,
    "inputValidationSelfcheck": true
  },
  "mismatches": {
    "postDeploySelfcheck": [],
    "routesManifestSelfcheck": [],
    "inputValidationSelfcheck": []
  }
}
```

---

## Example — Partial Failure

```json
{
  "success": false,
  "details": {
    "postDeploySelfcheck": true,
    "routesManifestSelfcheck": false,
    "inputValidationSelfcheck": true
  },
  "mismatches": {
    "postDeploySelfcheck": [],
    "routesManifestSelfcheck": [
      "Mismatch: /api/posts/create route missing in manifest."
    ],
    "inputValidationSelfcheck": []
  }
}
```

---

## Emotional UX Contract

Selfcheck outputs must:

- Provide **clear, structured, emotionally neutral reporting**.
- Allow **instant diagnosis** without fear, uncertainty, or confusion.
- Encourage **confidence** that systems are self-healing, self-monitoring, and protecting user experience.

---

## Final Principle

> The Dream-State Platform does not just operate.  
> It proves, explains, and protects itself — gracefully and visibly — at every checkpoint.

✨ Build forever. Check forever.
