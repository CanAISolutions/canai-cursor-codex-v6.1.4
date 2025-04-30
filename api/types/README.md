# 📚 Types Directory Overview

> Permanent Codex Enforcement: Trusted source of all core system data contracts.

---

## 🔵 What the `/types/` Folder Contains

- **Canonical definitions of all major data entities** in the platform.
- **Shared types** between API handlers, validators, fulfillment flows, and storage operations.
- **Runtime and compile-time safety guarantee** for all external and internal payloads.

---

## 🛡️ Data Contract System Principles

- **Minimal surface area**: types are defined narrowly, expanding only as necessary.
- **Separation of external API-facing DTOs and internal operational extensions.**
- **Clear coupling to validators** for safety.
- **Snapshot-safe for Cursor/AI copilots.**

---

## 🛠️ Types Map

| File | Purpose |
|:-----|:--------|
| `/types/client.ts` | Defines client record structure (email, industry, persona, source). |
| `/types/project.ts` | Defines project session structure (promptType, input, session ID, user ID, status). |
| `/types/prompt.ts` | Defines user-generated prompt structure (promptText, tone, targetOutput, versioning). |
| `/types/stripe.ts` | Defines Stripe event payload structure for webhook validation (checkout, subscription, payment events). |
| `/types/openai.ts` | Defines OpenAI model payload structure (request and response types for completions). |

---

## 🔄 Type Evolution Best Practices

- **If you expand a type,** update corresponding validator(s) immediately.
- **If you deprecate a field,** mark it optional first before hard removing in v2.
- **If you add fulfillment logic,** type the prompt input/output flow explicitly.

---

## 🧠 Future Data Contract Enhancements

- **Versioned types support** (e.g., `/types/v1/`, `/types/v2/`) for future API version migrations.
- **Generated OpenAPI spec export** based on these types + validators (planned future).
- **Optional metadata typing** for user segmentation, personalization fields, session enrichment.

---

# 🔗 Related Documentation

- `/validators/README.md` — explains how types are enforced at API boundaries.
- `/api/docs/README.md` — maps where each type is used within API flows.

---

# ✅ Codex Compliance Check: PASSED
