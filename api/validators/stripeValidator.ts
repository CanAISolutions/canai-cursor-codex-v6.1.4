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

/**
 * Stripe Event Validation
 * Validates incoming Stripe webhook events
 */

export interface StripeEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
  livemode: boolean;
}

/**
 * Validates Stripe webhook event structure (type guard)
 * @param event - Raw event object from Stripe
 * @returns True if valid Stripe event
 */
export function validateStripeEventStructure(event: any): event is StripeEvent {
  if (!event || typeof event !== 'object') {
    return false;
  }

  // Check required fields
  const requiredFields = ['id', 'type', 'data', 'created', 'livemode'];
  for (const field of requiredFields) {
    if (!(field in event)) {
      return false;
    }
  }

  // Validate field types
  if (typeof event.id !== 'string' || event.id.length === 0) {
    return false;
  }

  if (typeof event.type !== 'string' || event.type.length === 0) {
    return false;
  }

  if (!event.data || typeof event.data !== 'object' || !event.data.object) {
    return false;
  }

  if (typeof event.created !== 'number' || event.created <= 0) {
    return false;
  }

  if (typeof event.livemode !== 'boolean') {
    return false;
  }

  return true;
}

/**
 * Validates specific Stripe event types
 * @param event - Stripe event
 * @param allowedTypes - Array of allowed event types
 * @returns True if event type is allowed
 */
export function validateEventType(event: StripeEvent, allowedTypes: string[]): boolean {
  return allowedTypes.includes(event.type);
}

/**
 * Extracts and validates customer ID from Stripe event
 * @param event - Stripe event
 * @returns Customer ID if found, null otherwise
 */
export function extractCustomerId(event: StripeEvent): string | null {
  try {
    const obj = event.data.object;
    
    // Direct customer field
    if (obj.customer && typeof obj.customer === 'string') {
      return obj.customer;
    }

    // Customer in subscription
    if (obj.subscription?.customer && typeof obj.subscription.customer === 'string') {
      return obj.subscription.customer;
    }

    // Customer in invoice
    if (obj.invoice?.customer && typeof obj.invoice.customer === 'string') {
      return obj.invoice.customer;
    }

    return null;
  } catch (error) {
    console.warn('Failed to extract customer ID:', error);
    return null;
  }
}
