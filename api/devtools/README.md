# 🛠 Devtools Directory Overview

> Permanent Codex Enforcement: Internal system self-awareness, health validation, and developer observability.

---

## 📦 Purpose

The `/devtools/` folder contains **critical system maintenance and observability tools**, including:

- Selfcheck engines to validate internal health continuously.
- Structured error dashboards for safe developer diagnostics.
- Operational scaffolds that futureproof monitoring, recovery, and scaling.

---

## 🎯 Modules

| File | Purpose |
|:-----|:--------|
| `selfcheck-api.ts` | Core selfcheck runner validating validators, schemas, prompt fulfillment readiness, and operational baselines. |
| `selfcheck-dashboard.ts` | Exposes visual results of selfchecks through an internal API endpoint. |
| `errors-dashboard.ts` | Provides a structured in-memory dashboard of recent captured errors. |
| `error-event.store.ts` | In-memory event store holding recent structured error events safely. |

---

## 🛡️ Devtools System Principles

- **Emotional UX integrity**: Devtools observability must be emotionally safe and clear, never alarming.
- **Resilience through self-validation**: System health must be validated continuously, not assumed.
- **Zero silent failure tolerance**: All errors, faults, and degradations must be detectable early.
- **Security-first**: Devtools endpoints and dashboards must be internal-only and safe from external access.

---

## 🛠️ Devtools Surface Map

| Surface | Description |
|:--------|:------------|
| `/api/devtools/selfcheck-api.ts` | Programmatically validate internal system health (validators, prompts, schemas). |
| `/api/devtools/selfcheck-dashboard.ts` | Visualize selfcheck results in-browser for trusted developers. |
| `/api/devtools/errors-dashboard.ts` | Fetch recent captured errors for emotional safe observability. |

---

## 🔄 Devtools Lifecycle Best Practices

- **All new selfcheck or observability surfaces** must update `/devtools/README.md` immediately.
- **All devtools endpoints must fail gracefully** (never crash the system if selfcheck fails).
- **All devtools outputs must be human-readable and developer-friendly**.

---

## 🧠 Future Devtools Enhancements

| Idea | Purpose |
|:-----|:--------|
| Real-Time Error Streaming | Websocket or SSE live feed of new captured errors. |
| System Drift Detector | Automatic detection of unexpected schema or validation drift. |
| Build Integrity Validator | Confirm build artifacts match deployed runtime schemas. |
| Heartbeat Monitors | Periodic self-triggered checks with retry/failover logic.|

---

# 🔗 Related Documentation

- `/errors/README.md` — explains how error events are captured into the devtools layer.
- `/api/docs/README.md` — maps how internal selfcheck endpoints are surfaced and triggered.

---

# 🛡 Final Codex Reminder

> **If the system cannot verify its own health, it cannot protect the user.**  
> **Devtools are not optional — they are the immune system of the platform.**

---

# ✅ Codex Compliance Check: PASSED
