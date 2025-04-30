/**
 * @file clientValidator.ts
 * @description Validation schema and helpers for client-related API operations.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

import { z } from "zod"; // Assuming zod is our validation library of choice
import { throwApiError } from "../errors/errorResponses";

// --- Client Creation Schema ---
export const createClientSchema = z.object({
  name: z.string().min(1, "Client name is required."),
  email: z.string().email("Valid email address is required."),
  organization: z.string().optional(),
});

/**
 * Validates client creation payload.
 * 
 * @param input - The raw payload object.
 * @returns - The parsed and validated payload.
 * @throws - Throws API error with standardized error response on validation failure.
 */
export function validateCreateClient(input: unknown) {
  const result = createClientSchema.safeParse(input);

  if (!result.success) {
    throwApiError("VALIDATION_FAILED");
  }

  return result.data;
}
