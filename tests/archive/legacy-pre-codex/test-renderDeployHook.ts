// ✅ test-renderDeployHook.ts
// Sends a test POST to your Render deploy webhook and checks response

import axios from "axios"

const RENDER_HOOK = "https://api.render.com/deploy/srv-xxxxxx?key=yourkey"

axios.post(RENDER_HOOK)
  .then(res => {
    if (res.status !== 200) throw new Error(`Unexpected status: ${res.status}`)
    console.log("✅ Render deploy hook executed successfully.")
  })
  .catch(err => {
    console.error(`❌ Deploy hook failed: ${err.message}`)
    process.exit(1)
  })
