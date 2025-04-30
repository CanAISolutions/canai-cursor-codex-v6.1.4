// ✅ test-lifecycle-triggered-events.ts
// Validates that lifecycle events (signup, complete) hit the correct webhook

import axios from "axios"

const webhooks = [
  "https://hook.us1.make.com/signup-complete",
  "https://hook.us1.make.com/output-delivered"
]

let failures = 0

async function run() {
  for (const url of webhooks) {
    try {
      const res = await axios.post(url, { session: "TEST123" })
      if (res.status !== 200) {
        console.error(`❌ ${url} failed with ${res.status}`)
        failures++
      } else {
        console.log(`✅ ${url} ok`)
      }
    } catch (err: any) {
      console.error(`❌ ${url} error: ${err.message}`)
      failures++
    }
  }
  process.exit(failures > 0 ? 1 : 0)
}

run()
