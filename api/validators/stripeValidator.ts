/**
 * @file stripeValidator.ts
 * @description Validation schema and helpers for Stripe webhook event payloads.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

import { z } from "zod";
import { throwApiError } from "../errors/errorResponses";

// --- Supported Stripe Event Schema ---
export const stripeEventSchema = z.object({
  id: z.string(),
  type: z.string(),
  data: z.object({
    object: z.record(z.any()),
  }),
});

/**
 * Validates a generic incoming Stripe webhook event payload.
 * 
 * @param input - Raw payload from Stripe.
 * @returns - Parsed and validated payload.
 * @throws - Throws API error with standardized error response on validation failure.
 */
export function validateStripeEvent(input: unknown) {
  const result = stripeEventSchema.safeParse(input);

  if (!result.success) {
    throwApiError("STRIPE_EVENT_INVALID");
  }

  return result.data;
}
