// 🧠 CanAI Prompt Composer
// Composes a GPT-ready prompt from structured input + .prompt template
// Supports enhancer injection, normalization, version switching, and fallback tracking

import fs from "fs"
import path from "path"
import { applyEnhancers, normalizeInput } from "./memoryHelpers"

type PromptInput = Record<string, any>

type ComposedResult = {
  prompt: string
  fallbackFields: string[]
  missingFields: string[]
}

export function composePrompt(promptType: string, input: PromptInput, version: string = "v1"): ComposedResult {
  const cleaned = normalizeInput(input)
  const enriched = applyEnhancers(cleaned)

  const filePath = path.join(__dirname, "..", "gpt-templates", `${promptType}.${version}.prompt`)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Prompt file not found: ${filePath}`)
  }

  const template = fs.readFileSync(filePath, "utf-8")

  const fallbackFields: string[] = []
  const missingFields: string[] = []

  const injected = template.replace(/{{(.*?)}}/g, (_, key) => {
    const trimmedKey = key.trim()
    const value = enriched[trimmedKey]

    if (value === undefined || value === "") {
      missingFields.push(trimmedKey)
      return `[MISSING: ${trimmedKey}]`
    }

    if ((enriched._fallbacks || []).includes(trimmedKey)) {
      fallbackFields.push(trimmedKey)
    }

    return value
  })

  return {
    prompt: injected,
    fallbackFields,
    missingFields,
  }
}
