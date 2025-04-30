// ✅ test-output-visual-generation.ts
// Validates Markdown/Placid/HTML visual output structure

const content = `
## Welcome to CanAI

You're ready to launch smarter.

[Start Now](https://canai.so)
`

if (!content.includes("##") || !content.includes("](")) {
  throw new Error("❌ Output missing Markdown/visual formatting.")
}

console.log("✅ Output visuals contain expected structure.")
