# 🔐 CanAI Security & Privacy Overview

This document outlines how we secure data, handle sensitive operations, and maintain trust across the CanAI platform.

---

## 🔑 Environment & Secrets Management

- All API keys and credentials are stored in `.env.local`
- Never committed to GitHub or version control
- Managed locally or through Render environment variables

---

## 🔐 Webhook Protection

- Stripe: Signature validated with `stripe.webhooks.constructEvent()`
- Make.com: Triggered only via signed secret URL
- Render Deploy Hook: Stored in `RENDER_DEPLOY_HOOK_URL` and never exposed

---

## 🧠 Prompt Security

- No user input is stored permanently unless explicitly logged to Airtable
- All prompts are sanitized for injection or abuse vectors
- Prompt inputs and outputs are versioned for traceability

---

## 🔎 Logging

- All logs are scoped: `[openaiHandler]`, `[stripeEvents]`, etc.
- Logs never include raw tokens, secrets, or sensitive payloads
- Feedback logs are anonymized unless `userId` is present

---

## ✅ Trust Principles

- We collect only what we need (input, output, sessionId, feedback)
- We store logs in Airtable, not a centralized user database
- All automation and analytics flows are auditable

---

> Security at CanAI is not a feature — it’s a baseline.
> Trust is earned every time a founder hits “Generate.”
