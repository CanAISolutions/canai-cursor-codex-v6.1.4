# ✨ CanAI Prompt System

This doc outlines how prompt files work, how they're used, and how they evolve.

---

## 🧠 Prompt Structure

All prompts are stored in `/prompts` and follow this format:

export function promptName({ inputField1, inputField2 }: { inputField1: string, inputField2: string }): string {
  return `# Title\n\nDetails: ${inputField1}, etc.`
}

They:
- Accept structured input (typed)
- Return a markdown-formatted string
- Match Codex tone and layout guidelines

---

## 🗂 Prompt Types (Current Set)

| Prompt Type         | File Name             | Description                            |
|---------------------|------------------------|----------------------------------------|
| business_plan       | business_plan.ts       | Structured startup strategy            |
| email_campaign      | email_campaign.ts      | Launch sequence                        |
| social_content      | social_content.ts      | 5-post pack                            |
| ai_blueprint        | ai_blueprint.ts        | AI use case + revenue plan             |
| site_audit          | site_audit.ts          | UX + conversion audit                  |
| reverse_strategy    | reverse_strategy.ts    | Competitor teardown                    |
| ai_brand_identity   | ai_brand_identity.ts   | Voice, visuals, brand feel             |

---

## 🔁 Prompt Lifecycle

1. User fills a structured input form (Webflow → Make or API)
2. `/api/openaiHandler.ts` runs `composePrompt(promptType, input)`
3. Prompt file generates full markdown string
4. GPT-4o returns output based on that structure
5. Output is emailed, logged, scored, and (optionally) revised

---

## 🔄 SmartPrompt Evolution

All prompts are:
- Markdown-commented
- Version-safe (via `/prompt-versions`)
- Tracked via:
  - `cursor/promptEvolutionEngine.ts`
  - `cursor/selfRefineScore.ts`
  - `cursor/deltaDiff.ts`

Feedback → Revision → New prompt version → Logged + published

---

## 🧪 Testing Options

- In Cursor: via `promptReplay.ts`
- In API: via `prompt_handler.ts`
- In CLI: via `deltaDiff.ts`
- In Airtable: via Make automation flows

---

Every prompt in CanAI is a product.  
Treat them like code.  
Design them like UX.  
Evolve them like strategy.
