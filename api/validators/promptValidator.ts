/**
 * @file promptValidator.ts
 * @description Validation schema and helpers for prompt-related API operations.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

import { z } from "zod";
import { throwApiError } from "../errors/errorResponses";

// --- Prompt Creation Schema ---
export const createPromptSchema = z.object({
  projectId: z.string().min(1, "Project ID is required."),
  promptText: z.string().min(1, "Prompt text cannot be empty."),
  tone: z.string().optional(),
  targetOutput: z.string().optional(),
});

/**
 * Validates prompt creation payload.
 * 
 * @param input - The raw payload object.
 * @returns - The parsed and validated payload.
 * @throws - Throws API error with standardized error response on validation failure.
 */
export function validateCreatePrompt(input: unknown) {
  const result = createPromptSchema.safeParse(input);

  if (!result.success) {
    throwApiError("VALIDATION_FAILED");
  }

  return result.data;
}

// --- Prompt Update Schema ---
export const updatePromptSchema = z.object({
  promptText: z.string().optional(),
  tone: z.string().optional(),
  targetOutput: z.string().optional(),
});

/**
 * Validates prompt update payload.
 * 
 * @param input - The raw payload object.
 * @returns - The parsed and validated payload.
 * @throws - Throws API error with standardized error response on validation failure.
 */
export function validateUpdatePrompt(input: unknown) {
  const result = updatePromptSchema.safeParse(input);

  if (!result.success) {
    throwApiError("VALIDATION_FAILED");
  }

  return result.data;
}
