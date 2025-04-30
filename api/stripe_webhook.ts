/**
 * @file stripe_webhook.ts
 * @description Secure webhook endpoint for processing Stripe payment and subscription events.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import { validateStripeEvent } from "../validators/stripeValidator";
import { verifySignature } from "../webhook/verifySignature";
import { StripeWebhookPayload } from "../types/stripe";

// Required environment variables
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Config to disable body parsing so we can verify Stripe signatures.
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * Handles incoming Stripe webhook events.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const rawBody = await buffer(req);
    const signature = req.headers["stripe-signature"] as string;

    verifySignature(rawBody, signature, STRIPE_WEBHOOK_SECRET);

    const parsed = JSON.parse(rawBody.toString());
    const event = validateStripeEvent(parsed) as StripeWebhookPayload;

    // --- Dispatch Based on Event Type ---
    switch (event.type) {
      case "checkout.session.completed":
        console.log("[stripe_webhook] Checkout session completed:", event.data.object.id);
        // TODO: Trigger user plan upgrade, project unlocking, etc.
        break;

      case "payment_intent.succeeded":
        console.log("[stripe_webhook] Payment succeeded:", event.data.object.id);
        // TODO: Log success, grant entitlements.
        break;

      case "payment_intent.payment_failed":
        console.warn("[stripe_webhook] Payment failed:", event.data.object.id);
        // TODO: Trigger failure handling, notify user.
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        console.log("[stripe_webhook] Subscription event:", event.type, event.data.object.id);
        // TODO: Handle subscription lifecycle updates.
        break;

      default:
        console.log("[stripe_webhook] Unhandled event type:", event.type);
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("[stripe_webhook] Error processing webhook:", error);
    res.status(400).json({
      success: false,
      error: { code: "WEBHOOK_VERIFICATION_FAILED", message: "Invalid Stripe webhook payload or signature." },
    });
  }
}
