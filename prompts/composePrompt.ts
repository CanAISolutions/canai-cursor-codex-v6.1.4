// 🧠 CanAI Prompt Composer
// Composes a GPT-ready prompt from structured input and versioned .prompt template.
// Supports version switching, field injection, enhancer logic, and schema fallback tracking.

import fs from "fs"
import path from "path"
import { applyEnhancers, normalizeInput } from "./memoryHelpers"

type PromptInput = Record<string, any>

type ComposedPrompt = {
  prompt: string
  fallbackFields: string[]
  missingFields: string[]
}

export function composePrompt(promptType: string, input: PromptInput, version: string = "v1"): ComposedPrompt {
  const cleaned = normalizeInput(input)
  const enriched = applyEnhancers(cleaned)

  const filePath = path.join(__dirname, "..", "gpt-templates", `${promptType}.${version}.prompt`)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Prompt file not found: ${filePath}`)
  }

  const template = fs.readFileSync(filePath, "utf-8")

  const fallbackFields: string[] = []
  const missingFields: string[] = []

  const injected = template.replace(/{{(.*?)}}/g, (_, keyRaw) => {
    const key = keyRaw.trim()
    const value = enriched[key]

    if (value === undefined || value === "") {
      missingFields.push(key)
      return `[MISSING: ${key}]`
    }

    if ((enriched._fallbacks || []).includes(key)) {
      fallbackFields.push(key)
    }

    return value
  })

  return {
    prompt: injected,
    fallbackFields,
    missingFields,
  }
}
