# 📚 Validators Directory Overview

> Permanent Codex Enforcement: Input safety, operational resilience, and AI-coauthor-friendly clarity.

---

## 🔵 What Validators Do

Validators defend all system entrypoints against:

- Malformed user input
- Incomplete request bodies
- Unsafe external webhook payloads
- Internal API misuse during evolution

They **codify and enforce the trusted data contracts** between users, third-party systems, and our internal fulfillment architecture.

---

## 🛡️ Validation System Principles

- **Zod-driven schema validation** for runtime type enforcement.
- **`safeParse()` pattern** to avoid unexpected exceptions.
- **Standardized `throwApiError("VALIDATION_FAILED")` on schema mismatch.**
- **Separation of create vs update payloads** where mutation intent differs.
- **Snapshot-safe for Cursor, AI copilots, and future evolution.**

---

## 🛠️ Validators Map

| File | Purpose |
|:-----|:--------|
| `/validators/clientValidator.ts` | Validates client creation payloads (email, industry, persona, source). |
| `/validators/projectValidator.ts` | Validates project creation and update payloads (promptType, input, metadata). |
| `/validators/promptValidator.ts` | Validates prompt creation and revision payloads (promptText, tone, targetOutput). |
| `/validators/stripeValidator.ts` | Validates incoming Stripe webhook event payloads. |

---

## 🔄 Validator Lifecycle Best Practices

- **If you modify a validator,** always update its related `/types/` DTO if structure changes.
- **If you add a new API input,** create a new validator first, then integrate it into the API handler.
- **If you expand allowed fields,** favor optional fields inside schemas instead of removing safety checks.

---

## 🧠 Future Validator System Enhancements

- **Dynamic validator registry** for runtime schema audits (planned future).
- **Cross-service validation** (e.g., enrich Stripe events with live database checks).
- **Versioned validation schemas** for future API v2+, ensuring backward compatibility.

---

# 🔗 Related Documentation

- `/types/README.md` — defines DTO contracts that validators enforce.
- `/errors/README.md` — defines how validation errors are surfaced to users and systems.

---

# ✅ Codex Compliance Check: PASSED
