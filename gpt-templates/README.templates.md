# 🧠 CanAI Prompt Template System

This folder contains the 7 core CanAI `.prompt` files and tools for evolving, testing, and tracking their performance.

This is not a prompt dump.  
This is the **AI intelligence engine** that powers the CanAI product.

---

## 🔁 Versioning Conventions

All prompt files must be versioned:

- `business_plan.v1.prompt`
- `email_campaign.v2.prompt`
- `ai_blueprint.v1.prompt`

When prompts are updated:
- Save the previous version
- Use `promptDeltaLog.ts` or `promptEvolutionEngine.ts` to track changes
- Update Make scenarios to reference the latest `.prompt` version

---

## 🧪 Testing Tools

| Tool                    | Purpose                                                          |
|--------------------------|------------------------------------------------------------------|
| `promptReplay.ts`        | `replayPrompt(type, input)` — Run a past session input through any `.prompt` version |
| `selfRefineScore.ts`     | `scoreOutput(output)` — Heuristic 0–3 score for clarity, markdown, structure |
| `promptEvolutionEngine.ts` | Compare prompt versions and attach feedback-based improvement notes |
| `promptDeltaLog.ts`      | CLI: `ts-node promptDeltaLog.ts v1.prompt v2.prompt` — See exact diffs |

---

## 📋 Prompt Format Standards

All `.prompt` files must:
- Use clean Markdown (`#`, `###`, `-`, `**`) only
- Avoid emojis unless format-blocked (`📦`, `🧠`, etc.)
- Be under 1000 words
- Match input fields as defined in `PromptLogs` Airtable table

Each prompt uses:
- Required fields
- Enhancer fields (optional but injected if present)

Prompt routing is handled in `composePrompt.ts` and mapped via `PromptType`.

---

## 🧠 SmartPromptScore System

Outputs are scored using `selfRefineScore.ts`  
Logged to Airtable under `SmartPromptScore` (0–3)  
Used to identify high-performing prompt sessions and optimize versioning

---

## 🗂 Input Schema & Structure

All `.prompt` inputs come from the `PromptLogs` Airtable table.  
Field schema is defined in:

- [`/docs/schema/promptlogs-schema.json`](../docs/schema/promptlogs-schema.json)
- [`/docs/schema/promptlogs-fields.csv`](../docs/schema/promptlogs-fields.csv)

This ensures all inputs are:
- Mapped correctly
- Type-safe
- Analyzer-ready

---

## 🚀 Best Practices

- Always replay prompts with at least 1 real customer input before shipping
- Use Make.com to inject only required + available enhancer fields
- Every section in your prompt should map to a real customer outcome
- Keep copy tight, tone-aligned, and emotionally intelligent
- Diff your prompt before pushing using `promptDeltaLog.ts`

> Prompts are not static inputs.  
> They are strategic interfaces for AI to think, act, and support customers.
