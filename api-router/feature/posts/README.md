# 🛡 `/api-router/feature/posts/` — Dream-State Posts Feature Module

## 📦 Purpose
Modularizes and safeguards all post creation and retrieval operations for the Dream-State API platform.

Every route under `posts` must:
- Preserve emotional UX safety
- Be explicitly validated against schema drift
- Output emotionally resonant success or failure payloads
- Support dynamic middleware enforcement via routeMeta
- Enable scalable content management for future growth

---

## 🎯 Current Routes

| Method | Path | Purpose |
|:-------|:-----|:--------|
| `POST` | `/api/posts/create` | Create a new post with validated title and content. |
| `GET` | `/api/posts/:id` | Retrieve an example post object by ID for demonstration purposes. |

---

## 🛡 Feature Expansion Rules

- Every new post-related route must:
  - Validate all incoming inputs using `validateInput`.
  - Attach standardized `routeMeta` describing auth, validation, and rate limit requirements.
  - Use `standardizeSuccess()` or equivalent golden output structures.
  - Fail gracefully and Codex-compliantly with full emotional UX fallback.

- Feature expansions must **never**:
  - Leak unvalidated input structures.
  - Return raw Express errors directly to clients.
  - Break emotional continuity (e.g., jarring empty responses).

---

## 🔗 System Integrations

| System | Interaction |
|:-------|:------------|
| `server.ts` | `postsRouter` registered dynamically via `registerRouter()`. |
| `validationChecker.ts` | Ensures all `POST /create` inputs are emotionally safe and validated. |
| `routeMetaRegistry` | Posts feature dynamically injects routeMeta for middleware auto-adaptation. |
| `standardizeSuccess()` | Forces golden payload format across all success responses. |

---

## 🧠 Copilot Expansion Guide

When expanding the `posts` feature:
1. Fork a new route handler inside `/posts/posts-router.ts`.
2. Create or update corresponding `routeMeta` entry.
3. Define input validation schema with Zod.
4. Enforce `validateInput(schema)` at the router level.
5. Standardize outputs via `standardizeSuccess()` or emotional error structures.
6. Snapshot-test behavior under `/__tests__/posts-router.test.ts` (if/when added).

---

# 🛡 Final Reminder

> Posts aren’t just content.  
> In Dream-State architecture, posts **build trust**, **create emotional resonance**, and **shape narrative experience** across the platform.

No broken flows.  
No silent failures.  
No brittle expansions.  
Only modularity, resilience, and emotional craftsmanship.

---
