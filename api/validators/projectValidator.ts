/**
 * @file projectValidator.ts
 * @description Validation schema and helpers for project-related API operations.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

import { z } from "zod";
import { throwApiError } from "../errors/errorResponses";

// --- Project Creation Schema ---
export const createProjectSchema = z.object({
  clientId: z.string().min(1, "Client ID is required."),
  title: z.string().min(1, "Project title is required."),
  description: z.string().optional(),
});

/**
 * Validates project creation payload.
 * 
 * @param input - The raw payload object.
 * @returns - The parsed and validated payload.
 * @throws - Throws API error with standardized error response on validation failure.
 */
export function validateCreateProject(input: unknown) {
  const result = createProjectSchema.safeParse(input);

  if (!result.success) {
    throwApiError("VALIDATION_FAILED");
  }

  return result.data;
}

// --- Project Update Schema ---
export const updateProjectSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
});

/**
 * Validates project update payload.
 * 
 * @param input - The raw payload object.
 * @returns - The parsed and validated payload.
 * @throws - Throws API error with standardized error response on validation failure.
 */
export function validateUpdateProject(input: unknown) {
  const result = updateProjectSchema.safeParse(input);

  if (!result.success) {
    throwApiError("VALIDATION_FAILED");
  }

  return result.data;
}
