// 🚀 renderDeployHook.ts
// Triggers a deployment on Render using the saved deploy hook.
// Usage: ts-node renderDeployHook.ts

import https from "https"
import { URL } from "url"

const deployURL = new URL("https://api.render.com/deploy/srv-d000gqbe5dus73cn62ug?key=y7HZTS4Lv40")

function triggerDeploy() {
  const req = https.request(
    {
      method: "POST",
      hostname: deployURL.hostname,
      path: deployURL.pathname + deployURL.search,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "CanAI Deploy Bot"
      }
    },
    res => {
      if (res.statusCode === 200) {
        console.log("✅ Render deploy triggered successfully.")
      } else {
        console.error(`❌ Deploy failed with status ${res.statusCode}`)
      }
    }
  )

  req.on("error", err => {
    console.error("❌ Error triggering deploy:", err.message)
  })

  req.end()
}

triggerDeploy()
