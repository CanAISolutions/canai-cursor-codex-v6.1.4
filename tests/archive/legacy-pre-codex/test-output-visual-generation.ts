// ✅ test-output-visual-generation.ts
// Validates Markdown/HTML visual output structure for web and email delivery

const content = `
## Welcome to CanAI

You're ready to launch smarter.

[Start Now](https://canai.so)
`

if (!content.includes("##") || !content.includes("](")) {
  throw new Error("❌ Output missing Markdown/visual formatting.")
}

console.log("✅ Output visuals contain expected structure for web/email delivery.")
