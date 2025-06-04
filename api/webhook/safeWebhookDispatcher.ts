/**
 * @file safeWebhookDispatcher.ts
 * @description Safely dispatches verified webhook events to internal handlers based on event type.
 * 
 * Purpose:
 * - Prevent future code duplication across webhook sources.
 * - Centralize event routing logic.
 * - Enforce trust boundaries (only validated payloads allowed).
 */

import { emitSystemLog } from '../../cursor/utils/audit-utils';

type WebhookEvent = {
  type: string;
  data: any;
};

type EventHandler = (payload: any) => Promise<void>;

const eventHandlers: Record<string, EventHandler> = {
  // Example handlers — real implementations should be registered dynamically or modularized.
  "checkout.session.completed": async (payload) => {
    console.log("[Dispatcher] Handling checkout.session.completed", payload);
    emitSystemLog('checkout-session-completed', {
      customerId: payload.customer,
      sessionId: payload.id,
      timestamp: new Date().toISOString()
    });
    await handleCheckoutComplete(payload);
  },
  "customer.subscription.updated": async (payload) => {
    console.log("[Dispatcher] Handling customer.subscription.updated", payload);
    emitSystemLog('subscription-updated', {
      customerId: payload.customer,
      subscriptionId: payload.id,
      timestamp: new Date().toISOString()
    });
    await handleSubscriptionUpdate(payload);
  },
};

export async function safeWebhookDispatcher(event: WebhookEvent) {
  const handler = eventHandlers[event.type];

  if (!handler) {
    console.warn(`[safeWebhookDispatcher] No handler found for event type: ${event.type}`);
    return;
  }

  try {
    await handler(event.data);
  } catch (error) {
    console.error(`[safeWebhookDispatcher] Handler error for event ${event.type}`, error);
    throw new Error(`Failed to process event: ${event.type}`);
  }
}

/**
 * Handles checkout session completion
 */
async function handleCheckoutComplete(payload: any): Promise<void> {
  try {
    // Update user subscription status in Airtable
    const airtableResponse = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
      },
      body: JSON.stringify({
        fields: {
          CustomerId: payload.customer,
          SubscriptionId: payload.subscription,
          Status: 'active',
          CheckoutSessionId: payload.id,
          Amount: payload.amount_total,
          Currency: payload.currency,
          CompletedAt: new Date().toISOString()
        }
      })
    });

    if (!airtableResponse.ok) {
      throw new Error(`Airtable update failed: ${airtableResponse.statusText}`);
    }

    // Trigger welcome email sequence
    await fetch(`${process.env.API_BASE_URL}/api/email/welcome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY}`
      },
      body: JSON.stringify({
        customerId: payload.customer,
        subscriptionId: payload.subscription,
        timestamp: new Date().toISOString()
      })
    });

    emitSystemLog('checkout-complete-processed', {
      customerId: payload.customer,
      subscriptionId: payload.subscription,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    emitSystemLog('checkout-complete-error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      customerId: payload.customer,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

/**
 * Handles subscription updates
 */
async function handleSubscriptionUpdate(payload: any): Promise<void> {
  try {
    // Update subscription status in Airtable
    const airtableResponse = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`
      },
      body: JSON.stringify({
        fields: {
          SubscriptionId: payload.id,
          CustomerId: payload.customer,
          Status: payload.status,
          CurrentPeriodStart: new Date(payload.current_period_start * 1000).toISOString(),
          CurrentPeriodEnd: new Date(payload.current_period_end * 1000).toISOString(),
          UpdatedAt: new Date().toISOString()
        }
      })
    });

    if (!airtableResponse.ok) {
      throw new Error(`Airtable update failed: ${airtableResponse.statusText}`);
    }

    // Handle status-specific logic
    if (payload.status === 'canceled') {
      await fetch(`${process.env.API_BASE_URL}/api/email/cancellation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.API_KEY}`
        },
        body: JSON.stringify({
          customerId: payload.customer,
          subscriptionId: payload.id,
          timestamp: new Date().toISOString()
        })
      });
    }

    emitSystemLog('subscription-update-processed', {
      customerId: payload.customer,
      subscriptionId: payload.id,
      status: payload.status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    emitSystemLog('subscription-update-error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      customerId: payload.customer,
      subscriptionId: payload.id,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}
