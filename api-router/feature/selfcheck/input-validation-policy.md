# 🛡️ Dream-State Input Validation Policy

## Prime Directive

Every POST and PUT API route must **explicitly validate** incoming input using `validateInput`.

There are no exceptions.

---

## Why

- Protects users from cryptic server errors
- Ensures operational consistency across scaling environments
- Enables AI copilots and auto-patching systems
- Preserves emotional UX trust and system integrity

---

## Validation Pattern

At the **top of every route handler**, always:

```typescript
import { validateInput } from "../../utils/input-validation";

const inputValidation = validateInput(req.body, {
  fieldName: "string",
  anotherField: "number"
});

if (!inputValidation.success) {
  return res.status(400).json({
    success: false,
    payload: null,
    errors: inputValidation.errors
  });
}
```

**Then continue with normal logic.**

---

## Required Fields for Compliance

- `validateInput` must run before any business logic.
- If validation fails:
  - Must immediately respond with Dream-State Golden Output structure.
  - Must use HTTP status 400 (Bad Request).

---

## Future Enforcement

Input validation compliance will later be:
- Auto-checked in `postDeploySelfcheck`
- Scanned during CI builds
- Audited for missing validation guards

---

✨ Build forever. Validate first.
