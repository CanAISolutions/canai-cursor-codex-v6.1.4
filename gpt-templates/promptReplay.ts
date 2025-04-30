// 🔁 CanAI Prompt Replay Utility
// Replays a saved structured input session through a specified prompt type.
// Useful for testing prompt evolution or debugging changes in composePrompt logic.

import { composePrompt } from "../prompts/composePrompt"

type PromptInput = Record<string, any>

export function replayPrompt(promptType: string, input: PromptInput): string {
  try {
    return composePrompt(promptType, input)
  } catch (error) {
    return `### ⚠️ Replay Failed\n\nPromptType: ${promptType}\nError: ${error}`
  }
}
