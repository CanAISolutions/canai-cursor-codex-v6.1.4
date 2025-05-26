# 🧰 CanAI Maintenance & Ops Guide

This document explains how to update, deploy, and evolve the CanAI system safely — without breaking clarity, automation, or emotional UX.

---

## 🔁 Prompt Updates

### Where:
- All prompt functions live in `/prompts/*.ts`
- Each prompt is markdown-commented and typed

### How to Update:
1. Modify the prompt function (e.g. `business_plan.ts`)
2. Test in `/cursor/promptReplay.ts` or via `/api/prompt_handler.ts`
3. Save a versioned `.prompt` file in `/prompt-versions/`
4. Trigger a redeploy (see below)

---

## 🚀 Deployment

### To Redeploy the Backend (GPT Fulfillment Layer):
- Hit the Render deploy hook manually:
  - `https://api.render.com/deploy/...` (stored in `.env`)
- OR run `curl -X POST $RENDER_DEPLOY_HOOK_URL` from CLI
- Webhook is also callable via Make

---

## 🔐 Secrets Rotation

- Stored in `.env.local` and in Render → Environment
- Rotate `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, `AIRTABLE_API_KEY`, etc.
- Never commit `.env.local` to GitHub

---

## 📦 Output Format Evolution

- All outputs must remain:
  - Markdown structured
  - Sectioned (`#`, `##`, `-`)
  - Branded tone (`Empowerment Through Ease.`)

- Update `fallbackUX.ts` or `outputBanner.tsx` if you modify UI headers

---

## 🧪 Regression Testing (Optional)

- Use `cursor/deltaDiff.ts` to compare past prompt vs new
- Run `tests/*.test.ts` for output formatting tests
- Re-test critical promptTypes: `business_plan`, `email_campaign`, `site_audit`, `profile_makeover`, `blogblitz`, `ad_amplify`

---

> Maintenance = evolution.  
> But never at the cost of clarity or trust.
