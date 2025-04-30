# 📚 /api-router/ — Canonical API System Architecture

> Permanent Codex Enforcement: Futureproofed, modular, operationally resilient API domain.

---

## 📦 Purpose

The `/api-router/` folder constitutes the **heart of platform orchestration**, including:

- All API routes (`/api/`) handling external and internal requests.
- All input/output schema validators (`/validators/`).
- All canonical data contracts (`/types/`).
- All system error handling and observability (`/errors/`, `/devtools/`).
- All operational helpers (`/utils/`).
- All webhook perimeter defenses (`/webhook/`).

---

## 🎯 Domain Structure Map

| Folder | Purpose |
|:-------|:--------|
| `/api/` | Primary API routes (external endpoints, internal ops endpoints). |
| `/validators/` | Runtime input schema validation enforcement. |
| `/types/` | Canonical shared data contract definitions. |
| `/errors/` | Structured fault tolerance system (errors + emotional-safe observability). |
| `/utils/` | System helpers for safe request handling, parsing, and operational utilities. |
| `/webhook/` | Signature verification and modular webhook event dispatching. |
| `/devtools/` | Internal selfcheck, heartbeat, and system observability modules. |

---

## 🛡️ Architecture System Principles

- **Security First**: Every API boundary validates inputs, verifies external trust, and surfaces safe errors.
- **Operational Resilience**: Selfchecks, admin status reports, heartbeats, and webhook health pings guarantee system trustworthiness at all times.
- **Developer Empathy**: Devtools and error dashboards provide emotionally safe, clear feedback loops during development and staging.
- **Extensibility and Scalability**: Every folder, endpoint, and helper is modularized for v2+, multi-provider expansion, or multi-surface orchestration.

---

## 🛠️ API Endpoint Groups

| Group | Purpose |
|:------|:--------|
| External Public APIs | `/api/add_client`, `/api/add_project`, `/api/prompt_handler`, `/api/stripe_webhook`, `/api/webhook_health` |
| Internal Trusted APIs | `/api/internal/selfcheck_trigger`, `/api/internal/selfcheck_full`, `/api/internal/admin_status` |
| Devtools Observability APIs | `/api/devtools/selfcheck-api`, `/api/devtools/selfcheck-dashboard`, `/api/devtools/errors-dashboard` |

---

## 🧱 Critical System Modules (Implemented)

| Module | Purpose |
|:-------|:--------|
| `/errors/errorNormalizer.ts` | Normalizes all unknown system errors into structured Codex-safe payloads. |
| `/webhook/safeWebhookDispatcher.ts` | Modular dispatcher securely routing verified webhook events to their handlers. |
| `/devtools/heartbeat.ts` | Lightweight heartbeat pulse system for real-time ops monitoring. |

---

## 🔄 Evolution Best Practices

- **Version Isolation**: If introducing breaking changes, create `/api/v2/`, `/validators/v2/`, `/types/v2/`, etc.
- **Module Registration**: Always update `/README.md` files when new modules or surfaces are added.
- **Schema Enforcement**: All new routes must pass through validators and surface only codified errors.
- **Selfcheck Expansion**: New critical modules (DB, queues, external APIs) must add corresponding selfchecks.

---

## 🧠 Future Enhancements

| Idea | Purpose |
|:-----|:--------|
| OpenAPI Specification Export | Auto-document API based on validators and types. |
| Webhook Multi-Provider Gateway | Extend safeWebhookDispatcher to Paddle, PayPal, etc. |
| Advanced Error Analytics | Visual heatmaps of fault patterns, recovery insights. |
| Ops-Grade Heartbeat Orchestration | Tie heartbeat emissions to autoscaling, auto-recovery pipelines.|

---

# 🔗 Related Documentation

- `/api/docs/README.md` — External/internal endpoint mapping.
- `/validators/README.md` — Input schema contract enforcement.
- `/types/README.md` — Canonical data models.
- `/errors/README.md` — Fault tolerance and error capture.
- `/webhook/README.md` — Secure webhook perimeter defense.
- `/devtools/README.md` — Selfcheck, heartbeat, and observability.

---

# 🛡 Final Codex Reminder

> **This API Router Domain is now a Permanent Foundation.**  
> It must remain:  
> **Emotionally safe. Operationally resilient. Architecturally pristine. Systematically evolving.**

---

# ✅ Codex Compliance Check: PASSED
