// ✅ test-klaviyo-lifecycle-events.ts
// Sends test events to Klaviyo API to confirm trigger integrity

import axios from "axios"

const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY
const endpoint = "https://a.klaviyo.com/api/events/"

const payload = {
  token: KLAVIYO_API_KEY,
  event: "Test Signup Trigger",
  customer_properties: { $email: "test@canai.so" },
  properties: { test: true }
}

axios.post(endpoint, payload)
  .then(() => console.log("✅ Klaviyo test event fired"))
  .catch(err => {
    console.error(`❌ Klaviyo test event failed: ${err.message}`)
    process.exit(1)
  })
