# 📚 API Directory Overview

> Permanent Codex Enforcement: System architecture clarity, future-safe onboarding, AI copilot compatibility.

---

## 🔵 External API Endpoints

| Route | Purpose |
|:------|:--------|
| `/api/add_client.ts` | Logs new client metadata into Airtable for lifecycle tracking. |
| `/api/add_project.ts` | Records new project sessions into Airtable for fulfillment pipelines. |
| `/api/prompt_handler.ts` | Safe fallback GPT fulfillment endpoint (bypass automation stack). |
| `/api/stripe_webhook.ts` | Stripe webhook receiver for subscription, payment, checkout events. |
| `/api/webhook_health.ts` | Webhook infrastructure health ping endpoint. |

---

## 🛡️ Internal API Endpoints

| Route | Purpose |
|:------|:--------|
| `/api/internal/selfcheck_trigger.ts` | Manually trigger a full system selfcheck cycle. |
| `/api/internal/admin_status.ts` | Return runtime environment metadata (env, uptime, build info). |
| `/api/internal/selfcheck_full.ts` | Perform full aggregation of selfcheck, webhook, and admin status in one call. |

---

## 🛠️ Devtools and Ops API Endpoints

| Route | Purpose |
|:------|:--------|
| `/api/devtools/selfcheck-api.ts` | Core selfcheck of validator, schema, and operational baseline health. |
| `/api/devtools/selfcheck-dashboard.ts` | Visual dashboard for viewing selfcheck results in-browser. |

---

## 🔒 Security and Best Practices

- **All API routes enforce HTTP method validation** (e.g., only `POST`, only `GET`).
- **All external inputs pass through Zod validation or safe parsing helpers.**
- **Webhook endpoints verify external signatures (Stripe) to prevent forgery.**
- **Selfcheck endpoints are read-only and expose no sensitive operational data.**
- **Internal endpoints require trusted network access and are never public-facing.**

---

## 🚀 Future Expansion Notes

- **Versioning readiness**: This scaffold can easily accommodate `/v1/`, `/v2/` folders as needed.
- **Webhook extensibility**: New payment providers (e.g., Paddle, PayPal) can follow the `stripe_webhook.ts` pattern.
- **Selfcheck modularity**: Additional modules (DB, Redis, third-party APIs) can easily plug into `selfcheck_full.ts`.

---

# 🔗 Related Documentation

- `/prompts/README.md` — for fulfillment prompt structures.
- `/validators/README.md` — for input validation schemas.

---

# ✅ Codex Compliance Check: PASSED
