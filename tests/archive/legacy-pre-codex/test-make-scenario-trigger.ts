// ✅ test-make-scenario-trigger.ts
// Confirms Make scenario webhook endpoints respond with valid status and payload

import axios from "axios"

const makeEndpoints = [
  "https://hook.us1.make.com/your-make-hook-1",
  "https://hook.us1.make.com/your-make-hook-2"
]

let failures = 0

console.log("\n🌐 Testing Make Scenario Triggers...")

async function run() {
  for (const url of makeEndpoints) {
    try {
      const res = await axios.post(url, { test: "ok" })
      if (res.status !== 200) {
        console.error(`❌ ${url}: status ${res.status}`)
        failures++
      } else {
        console.log(`✅ ${url} responded with 200`)
      }
    } catch (err: any) {
      console.error(`❌ ${url} error: ${err.message}`)
      failures++
    }
  }

  if (failures > 0) process.exit(1)
  else process.exit(0)
}

run()
