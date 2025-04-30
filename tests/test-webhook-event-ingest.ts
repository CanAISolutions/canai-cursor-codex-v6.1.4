// ✅ test-webhook-event-ingest.ts
// Simulates Render or Stripe webhook POST → validates parsing

import axios from "axios"

const webhookUrl = "http://localhost:3000/api/stripeEvents"
const payload = {
  type: "payment_intent.succeeded",
  data: {
    object: {
      id: "pi_12345",
      amount: 2500
    }
  }
}

axios.post(webhookUrl, payload)
  .then(res => {
    if (res.status !== 200) throw new Error("Unexpected status")
    console.log("✅ Webhook ingest test passed.")
  })
  .catch(err => {
    console.error(`❌ Webhook ingest failed: ${err.message}`)
    process.exit(1)
  })
