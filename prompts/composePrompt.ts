// 🧠 CanAI Prompt Composer
// Composes a GPT-ready prompt from structured input and versioned .prompt template.
// Supports version switching, field injection, enhancer logic, and schema fallback tracking.

import fs from "fs"
import path from "path"
import { applyEnhancers, normalizeInput } from "../lib/memoryHelpers"
import canonicalMap from "../cursor/system-intel/variable-alias-map.json"

type PromptInput = Record<string, any>

type ComposedPrompt = {
  prompt: string
  fallbackFields: string[]
  missingFields: string[]
}

export function composePrompt(promptType: string, input: PromptInput, version: string = "v1"): ComposedPrompt {
  // Normalize and enrich input
  const cleaned = normalizeInput(input)
  const enriched = applyEnhancers(cleaned)

  // Canonical variable mapping
  const canonicalVars: Record<string, any> = { ...enriched }
  const refactorLog: string[] = []

  // Map all aliases to their canonical finalVariable
  canonicalMap.forEach(field => {
    const { canonicalName, aliases, resolution, isEnhancer, status } = field
    const finalVar = resolution?.finalVariable || field.mappedVariable
    let found = false
    for (const alias of aliases) {
      if (enriched[alias] !== undefined && enriched[alias] !== "") {
        canonicalVars[finalVar] = enriched[alias]
        found = true
        if (alias !== finalVar) {
          // Log the alias mapping
          refactorLog.push(
            `[${promptType}] ${canonicalName}: alias '${alias}' mapped to canonical '${finalVar}' (isEnhancer: ${isEnhancer})`
          )
        }
      }
    }
    // Smart default stub (if not found and status is 'needs review')
    if (!found && status === "needs review") {
      canonicalVars[finalVar] = "[SMART_DEFAULT_STUB]"
      refactorLog.push(
        `[${promptType}] ${canonicalName}: smart default stub applied for '${finalVar}' (isEnhancer: ${isEnhancer})`
      )
    }
    // Enhancer logic stub (if isEnhancer)
    if (isEnhancer && canonicalVars[finalVar] === undefined) {
      canonicalVars[finalVar] = enriched[finalVar] || "[ENHANCER_STUB]"
      refactorLog.push(
        `[${promptType}] ${canonicalName}: enhancer logic stub for '${finalVar}'`
      )
    }
  })

  const filePath = path.join(__dirname, "..", "gpt-templates", `${promptType}.${version}.prompt`)
  if (!fs.existsSync(filePath)) {
    throw new Error(`Prompt file not found: ${filePath}`)
  }

  const template = fs.readFileSync(filePath, "utf-8")

  const fallbackFields: string[] = []
  const missingFields: string[] = []

  // Inject canonical variables into template
  const injected = template.replace(/{{(.*?)}}/g, (_, keyRaw) => {
    const key = keyRaw.trim()
    const value = canonicalVars[key]

    if (value === undefined || value === "") {
      missingFields.push(key)
      return `[MISSING: ${key}]`
    }

    if ((canonicalVars._fallbacks || []).includes(key)) {
      fallbackFields.push(key)
    }

    return value
  })

  // Optionally: Write refactor log to /cursor/system-intel/prompt-refactor-log.md (append-only)
  // (This can be handled by a separate logging utility if needed)

  return {
    prompt: injected,
    fallbackFields,
    missingFields,
  }
}
