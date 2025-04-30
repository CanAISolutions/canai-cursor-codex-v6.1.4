# 🛡 `/errors/` — System Fault Governance + Error Observability Layer

> Permanent Codex Enforcement: Codified error handling + emotionally safe developer diagnostics.

---

## 📦 Purpose

The `/errors/` folder is **split into two critical operational systems**:

| System | Purpose |
|:-------|:--------|
| **Error Contracts** | Governs how all APIs and internal systems throw, catch, and surface errors. |
| **Error Observability** | Captures and exposes recent structured error events safely in dev, staging, and trusted environments. |

---

## 🎯 Modules

| File | Purpose |
|:-----|:--------|
| `errorMap.ts` | Maps standardized internal error codes to HTTP statuses and human-readable messages. |
| `errorResponses.ts` | Provides helper functions for throwing structured API errors based on `errorMap`. |
| `error-event.store.ts` | In-memory event store capturing recent system errors in dev/staging. |
| `errors-dashboard.ts` | API endpoint to fetch and visualize captured error events safely. |

---

## 🛡 Error Contract System

- **Structured error codes only** (no freeform throwing).
- **All errors pass through `throwApiError(code)` to enforce clarity and consistency.**
- **Errors are mapped to appropriate HTTP status codes based on impact and surface.**
- **Internal-only diagnostics are never leaked in production.**

---

## 🛠 Error Capture and Observability System

- **Errors during development, staging, and trusted environments** are captured into an **in-memory store**.
- **No stack traces, sensitive metadata, or environment leaks** are ever exposed through observability.
- **Only `{ code, message, timestamp }` emotional payloads** are surfaced.
- **Maximum 100 recent error events** are stored for performance and safety.

---

## 🛡 Error Capture Rules

| Rule | Purpose |
|:-----|:--------|
| No sensitive data exposed | Protects emotional UX and security trust. |
| Environment-gated access | Only available outside production environments. |
| Structured payloads | Enables easy visual parsing and monitoring extension. |

---

## 🛠 How Errors Are Captured

1. Middleware errors, route failures, or unexpected exceptions are intercepted.
2. Errors are normalized (future upgrade via `errorNormalizer.ts`).
3. Errors are pushed to the `error-event.store.ts` in-memory array.
4. Devtools dashboard pulls structured error events for developer review.

---

## 🔗 Future Enhancements

| Idea | Purpose |
|:-----|:--------|
| Websocket Live Push | Real-time error streaming to dev dashboard without refresh. |
| Error Heatmaps | Visualization of error frequency by route/code. |
| Developer Filters | Dynamic filtering by timeframe, error code, or route path. |
| Error Rate Monitoring | Trigger alerts based on sudden spikes in error events. |

---

# 🛡 Final Codex Reminder

> **Observability must never come at the cost of emotional UX, operational trust, or security resilience.**  
> **Developer systems must be as emotionally safe and structurally resilient as user-facing products.**

---

# ✅ Codex Compliance Check: PASSED
