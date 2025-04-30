# 📊 CanAI Data & Analytics System

This document outlines how data flows through the CanAI system — and how we log, enrich, and use it to evolve prompt intelligence and product strategy.

---

## 🔁 Primary Data Sources

| Source            | Purpose                                 | Logged via     |
|-------------------|------------------------------------------|----------------|
| Prompt Input       | Structure used to generate the output    | Make → Airtable |
| Output Response    | GPT result, markdown-formatted           | Make → Email, Placid, Airtable |
| Feedback Form      | Rating + open text + session ID         | API → `feedback_logger_scenario.json` |
| Revision Trigger   | Manual revise button / feedback          | API → `trigger_revision.ts` |
| Session Telemetry  | Tokens used, reuse count, prompt type    | API → `session_logger_scenario.json` |

---

## 📁 Airtable Tables

### ✅ PromptLogs
Stores all fields used to generate a prompt output. Tied to `PromptType`.

- `PromptType`
- `SessionID`
- `CreatedAt`
- `UserID`
- `OutputURL`
- `SmartPromptScore`
- All input + enhancer fields required for each `PromptType`

See: [`/docs/schema/promptlogs-schema.json`](./schema/promptlogs-schema.json)

### ✅ FeedbackLogs
Tracks user ratings + open text insight tied to prompt sessions.

- `SessionID`
- `PromptType`
- `Rating` (1–5)
- `Feedback` (text)
- `UserID`
- `SubmittedAt`

### ✅ SessionAnalytics
Stores system metrics for analysis and evolution.

- `SessionID`
- `PromptType`
- `TokensUsed`
- `RevisionCount`
- `SmartPromptScore`
- `EmotionalTone`

### ✅ DeliveryCostLogs (required)
Tracks delivery costs per session.

- `SessionID`
- `Tokens`
- `Make Ops Used`
- `PDF Generated` (Yes/No)
- `Stripe Revenue`
- `Margin Estimate`

### ✅ ReferralTriggers (required)
Logs referral behavior and attribution flow.

- `Referrer ID`
- `Output Used`
- `Link Clicked`
- `Signup or Convert` (Y/N)

---

## 🧠 Analytics Purpose

- Improve prompt quality via scoring
- Personalize lifecycle flows
- Detect dropoff patterns (revisions, feedback)
- Track what converts → reuse or share
- Monitor per-output margin (via `DeliveryCostLogs`)
- Incentivize high-performing shares (via `ReferralTriggers`)

---

## 🔄 Data Refresh Flow

1. New Project → `add_project.json`  
2. Output → stored in Airtable  
3. Feedback or Revision → enrich SmartPromptScore  
4. Session metrics → updated async via Make or fallback API  
5. Cost-per-session tracked via delivery logs  
6. Referrals and outputs → linked to conversion flow

---

## 🧱 Field Schema Reference (Non-Negotiable)

All prompt sessions follow the `PromptLogs` schema:
- Input fields auto-mapped via Make
- Required fields validated by `PromptType`
- Enhancer fields injected only if present

The schema is versioned and stored here:
- [`/docs/schema/promptlogs-schema.json`](./schema/promptlogs-schema.json)
- [`/docs/schema/promptlogs-fields.csv`](./schema/promptlogs-fields.csv)

This structure powers:
- Make routing
- Prompt generation
- Revisions
- Score tracking
- All prompt-type-specific flows

No prompt can run without schema alignment.

---

> CanAI learns from every click, session, and strategy delivered.  
> We don’t just serve prompts — we listen to their performance, and we improve with every outcome.
