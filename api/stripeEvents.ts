// api/stripeEvents.ts
// Handles Stripe webhooks for subscription, payment, and reward events

import { buffer } from 'micro'
import Stripe from 'stripe'

/**
 * Required environment variables:
 * - STRIPE_SECRET_KEY
 * - STRIPE_WEBHOOK_SECRET
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export const config = {
  api: {
    bodyParser: false
  }
}

/**
 * Handles Stripe events including:
 * - checkout.session.completed
 * - invoice.payment_succeeded
 * - customer.subscription.deleted
 * 
 * Expand this logic for post-checkout workflows and Rewardful sync.
 */
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed')
  }

  const sig = req.headers['stripe-signature'] as string
  const buf = await buffer(req)

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('[stripeEvents] Signature verification failed:', err)
    return res.status(400).send('Webhook signature error')
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('✅ Checkout complete:', session.id)
        // TODO: Fulfill access, log event, trigger onboarding
        break
      }

      case 'invoice.payment_succeeded': {
        console.log('💰 Payment succeeded:', event.id)
        // TODO: Update subscription status, trigger success email
        break
      }

      case 'customer.subscription.deleted': {
        console.log('❌ Subscription cancelled:', event.id)
        // TODO: Downgrade account or revoke access
        break
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`)
    }

    res.status(200).send('Event received')
  } catch (error) {
    console.error('[stripeEvents] Processing error:', error)
    res.status(500).send('Webhook handler error')
  }
}
