# 🛡 Dream-State Error Handling Flow

## 📦 Purpose
Ensures every error, regardless of source, is caught, normalized, and emotionally communicated.

---

## 🛠 Error Flow Map

1. **Middleware or Router throws error**
2. **Caught by Express error pipeline**
3. **Passed to `errorNormalizer.ts`**
4. **Standardized to Golden Output Payload:**
   - `success: false`
   - `payload: null`
   - `errors: [ { code, message } ]`
   - `meta: {}` (optional diagnostics)
5. **Returned to client with structured emotional safety**

---

## 📜 Special Handling Cases

- 429 (Rate Limited): Handled by `handleRateLimitExceeded.ts`
- Validation Errors: Standardized by `standardizeError.ts`
- Uncaught Internal Errors: Sanitized without leaking internals.

---

# 🛡 Final Reminder

Errors are inevitable.  
**How we communicate them defines emotional trust.**

No raw error spew.  
No stacktrace leaks.  
Only predictable, reassuring emotional UX.

---
