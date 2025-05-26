// ✅ test-email-template-snapshots.ts
// Ensures markdown email body renders properly in HTML

import marked from "marked"

const sample = `
## Welcome

Thanks for joining CanAI!  
Click [here](https://canai.so) to start.

- No hard pitch  
- Just results
`

try {
  const html = marked(sample)
  if (!html.includes("<a") || !html.includes("<h2>")) {
    throw new Error("Missing expected tags in email HTML output")
  }

  console.log("✅ Markdown to email HTML passes snapshot test.")
} catch (err: any) {
  console.error("❌ Email template conversion failed:", err.message)
  process.exit(1)
}
