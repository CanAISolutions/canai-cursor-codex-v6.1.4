# 🚦 Dream-State API Router Flow

## 🛡 Overview
Defines the operational load order and request flow within the Dream-State API platform.

---

## 🛠 Load Sequence

1. **Initialize Express App**
2. **Apply Core Middlewares**
   - Helmet
   - CORS
   - JSON body parser
   - Morgan (logger)
3. **Initialize RouteMeta Registry**
   - Empty array for dynamic routeMeta tracking.
4. **Apply Dynamic Golden Middlewares**
   - Validation Checker
   - Auth Checker
   - Rate Limit Checker
5. **Register Feature Routers**
   - `/api/posts`
   - (future) `/api/users`, etc.
6. **Mount Legacy Router (temporary)**
   - `/api`
7. **Mount DevTools Router (non-production only)**
   - `/api/devtools`
8. **Apply Global Error Normalizer**
9. **Apply Golden 404 Fallback**

---

## 📜 Golden Flow Guarantees

- All incoming requests pass validation/auth/rate-limit gates before reaching routers.
- Emotional UX enforced at every error boundary.
- Feature routers self-declare meta expectations (`routeMeta`).
- RouteMetaRegistry tracks all live endpoint contracts dynamically.

---

# 🛡 Final Reminder

Router flows are not just technical pathways — they are **trust pathways**.  
Every user request must feel predictable, graceful, and emotionally safe.

---
