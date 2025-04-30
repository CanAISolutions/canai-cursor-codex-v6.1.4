// ✅ test-placid-image-output.ts
// Validates Placid template renders with dynamic input

import axios from "axios"

const PLACID_API_KEY = process.env.PLACID_API_KEY
const TEMPLATE_ID = "tpl_XXXXX"
const payload = {
  template: TEMPLATE_ID,
  data: {
    bizName: "CanAI",
    goal: "Launch your business with AI",
    tone: "Confident"
  }
}

axios.post("https://api.placid.app/u", payload, {
  headers: { Authorization: `Bearer ${PLACID_API_KEY}` }
})
.then(() => console.log("✅ Placid image generated successfully"))
.catch(err => {
  console.error(`❌ Placid generation failed: ${err.message}`)
  process.exit(1)
})
