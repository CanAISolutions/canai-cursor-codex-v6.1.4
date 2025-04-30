/**
 * @file stripe.ts
 * @description Types and interfaces for Stripe webhook event processing.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

/**
 * Supported Stripe event types we care about.
 */
export type StripeEventType =
  | "payment_intent.succeeded"
  | "payment_intent.payment_failed"
  | "checkout.session.completed"
  | "customer.subscription.created"
  | "customer.subscription.updated"
  | "customer.subscription.deleted";

/**
 * Generic payload structure for a Stripe webhook event.
 */
export interface StripeWebhookPayload {
  id: string;             // Stripe Event ID
  type: StripeEventType;  // Event type
  data: {
    object: Record<string, any>; // Core event object (dynamic per type)
  };
}

/**
 * Narrowed payload structure for a completed checkout session event.
 */
export interface StripeCheckoutSessionCompleted {
  id: string;
  customer: string;
  subscription: string;
  payment_status: string;
  metadata: Record<string, any>;
}
