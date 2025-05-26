# 🏗 CanAI Architecture

This document outlines the full system design of CanAI — from backend logic to automation flows — optimized for zero-manual-touch, Codex-governed AI strategy delivery.

---

## 💡 System Overview

CanAI is a prompt-based strategy engine that transforms structured user inputs into professional, branded, ready-to-use deliverables.

It is powered by:
- GPT-4o (OpenAI)
- Render (backend deployment)
- Webflow (frontend + Web CMS)
- Make.com (workflow automation)
- Airtable (data layer, tracking)
- Klaviyo (email delivery)
- Placid (dynamic asset generation)

---

## 🧠 Core Folders & Roles

| Folder             | Purpose                                                  |
|--------------------|----------------------------------------------------------|
| /prompts           | Structured input → prompt function generators            |
| /api               | GPT fulfillment, logging, deploys, webhook handlers      |
| /automations       | Make.com JSON flows (triggered via webhook)              |
| /cursor            | Prompt evolution, scoring, testing                       |
| /components        | UI + export templates (HTML + React)                     |
| /gpt-templates     | Prompt versioned `.prompt` files                         |
| /scripts           | CLI tools for dev, diffing, deploys                      |
| /tests             | Unit + prompt regression testing                         |
| /docs              | Strategic and technical reference                        |
| /brand             | Visual identity, colors, logos, typography               |

---

## 🧬 Data Flow

User Input (Webflow) → Memberstack (capture) → Make.com (webhook) → Render API (GPT) 
→ Output sent to User + Airtable + Email (via Make)

---

## 🔁 Continuous Improvement Engine

- Feedback → `/api/trigger_revision.ts`
- Session data → `/automations/session_logger_scenario.json`
- SmartPrompt enrichment → `/automations/airtable_enrichment_flow.json`
- Prompt evolution → `/cursor/promptEvolutionEngine.ts` + `/deltaDiff.ts`

---

## 🔐 Security & Trust Layers

- All API secrets stored in `.env.local`
- Webhook signatures (Stripe, Make) validated
- No hardcoded sensitive logic
- Output fallback → `/cursor/fallbackUX.ts`
- Version control: prompts, logic, output

---

## ✅ Dream-State Outcomes

- No manual fulfillment
- GPT outputs are consistent, brand-safe, and emotionally intelligent
- Customers feel clarity, support, and speed
- System evolves with every usage, not just updates

> This isn't a backend.  
> This is a leverage engine.

## Core Stack

- Webflow (canai.so frontend)
- Memberstack (auth + field capture)
- Make.com (webhook orchestration)
- Airtable (analytics + logs)
- Render API (GPT fulfillment)
- Klaviyo (email automation)
