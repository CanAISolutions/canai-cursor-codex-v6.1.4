// cursor/promptReplay.ts
// Replay a structured input with a new prompt version (testing tool)

import { composePrompt } from '../prompts/composePrompt'

/**
 * Simulates how a stored session would respond to a new prompt logic
 */
export function replayPrompt(promptType: string, input: any): string {
  return composePrompt(promptType, input)
}
