# 🛡 Dream-State Middleware Sequence

## 📦 Purpose
Defines the strict order and dynamic application rules for middlewares across Dream-State API.

---

## 🛠 Static Core Middlewares (Always First)

| Middleware | Purpose |
|:-----------|:--------|
| Helmet | Security headers |
| CORS | Cross-origin safety |
| Express.json() | JSON body parsing |
| Morgan | Logging for observability |

---

## 🛠 Dynamic Golden Middlewares (Before Routers)

| Middleware | Purpose |
|:-----------|:--------|
| Validation Checker | Ensures input schemas enforced dynamically. |
| Auth Checker | Protects private endpoints dynamically. |
| Rate Limit Checker | Controls burst/abuse dynamically based on routeMeta. |

*These depend on `routeMeta` attached to routers.*

---

## 🛠 Error and Fallback Middlewares (Always Last)

| Middleware | Purpose |
|:-----------|:--------|
| Error Normalizer | Converts errors into emotional, UX-safe payloads. |
| 404 Fallback Handler | Gracefully informs when no endpoint matched. |

---

# 📜 Golden Sequence Guarantee

- Static first → Dynamic gates → Feature routers → Emotional fallbacks
- Emotional safety enforced before, during, after any error.

---
