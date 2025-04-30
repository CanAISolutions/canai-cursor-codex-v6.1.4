// 📄 generatePromptDocs.ts
// Auto-generates markdown documentation for all .prompt files in /gpt-templates/
// Outputs human- and AI-readable summaries in /docs/prompts/

import fs from "fs"
import path from "path"

const templateDir = path.resolve(__dirname, "../gpt-templates")
const outputDir = path.resolve(__dirname, "../docs/prompts")

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

function extractMetadata(template: string) {
  const match = template.match(/<!--(.*?)-->/s)
  if (!match) return null

  const raw = match[1]
  const lines = raw.trim().split("\n").map(line => line.trim().replace(/^(\*|-)/, ""))
  const metadata: Record<string, string> = {}
  lines.forEach(line => {
    const [key, ...rest] = line.split(":")
    if (key && rest) {
      metadata[key.trim()] = rest.join(":").trim()
    }
  })
  return metadata
}

function estimateTokens(text: string): number {
  const clean = text.replace(/\s+/g, " ").trim()
  return Math.round(clean.length / 4)
}

function extractFields(template: string): string[] {
  const matches = template.match(/{{(.*?)}}/g) || []
  return [...new Set(matches.map(m => m.replace(/[{}]/g, "").trim()))]
}

function generateDocs() {
  const files = fs.readdirSync(templateDir).filter(f => f.endsWith(".prompt"))

  files.forEach(file => {
    const filePath = path.join(templateDir, file)
    const content = fs.readFileSync(filePath, "utf-8")
    const fields = extractFields(content)
    const tokens = estimateTokens(content)
    const metadata = extractMetadata(content) || {}

    const doc = `# 🧠 Prompt: ${metadata.PromptType || file.replace(".prompt", "")}

**Version:** ${metadata.Version || "v1"}  
**Estimated Tokens:** ~${tokens}  
**File:** \`${file}\`

---

## 📋 Input Fields

${fields.map(f => `- \`${f}\``).join("\n")}

---

## 🧾 Metadata

${Object.entries(metadata).map(([k, v]) => `- **${k}:** ${v}`).join("\n")}

---

## 🔍 Notes

- Auto-generated from \`/gpt-templates/${file}\`
- Used for Make, Cursor, and LLM routing
`

    const outFile = path.join(outputDir, file.replace(".prompt", ".md"))
    fs.writeFileSync(outFile, doc)
    console.log(`✅ Documented: ${file} → /docs/prompts/${path.basename(outFile)}`)
  })
}

generateDocs()
