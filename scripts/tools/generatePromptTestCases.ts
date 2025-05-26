// 🧪 generatePromptTestCases.ts
// Generates test case JSON files for each prompt based on .prompt field usage
// Outputs one structured input per PromptType in /testcases/

import fs from "fs"
import path from "path"

const templateDir = path.resolve(__dirname, "../../gpt-templates")
const outputDir = path.resolve(__dirname, "../../testcases")

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

function extractFields(template: string): string[] {
  const matches = template.match(/{{(.*?)}}/g) || []
  return [...new Set(matches.map(m => m.replace(/[{}]/g, "").trim()))]
}

function generateTestValue(field: string): string {
  const smartDefaults: Record<string, string> = {
    name: "Alex",
    bizName: "BrightFlow",
    industry: "Wellness Services",
    location: "Toronto, Canada",
    audience: "Young professionals seeking stress relief",
    goal: "Grow to $25K MRR in 6 months",
    constraints: "Budget under $500/mo",
    success: "Attract 30 recurring clients",
    tone: "Friendly, confident, helpful",
    customerPain: "Feeling overwhelmed or under-supported",
    desiredAction: "Book a consultation",
    trustSignal: "Over 500 5-star reviews",
    promoOffer: "Free first session",
    contentType: "Homepage hero section",
    userAuth: "Yes",
    revenueModel: "Subscription with upsell",
    competitors: "Calm, BetterHelp, Headspace"
  }
  return smartDefaults[field] || `Example ${field}`
}

function generateTestInputFile(fileName: string, fields: string[]) {
  const promptType = fileName.split(".")[0]
  const testInput: Record<string, any> = {
    PromptType: promptType
  }

  fields.forEach(field => {
    testInput[field] = generateTestValue(field)
  })

  const outputPath = path.join(outputDir, `${promptType}.v1.input.json`)
  fs.writeFileSync(outputPath, JSON.stringify(testInput, null, 2))
  console.log(`✅ Created test input → testcases/${path.basename(outputPath)}`)
}

function run() {
  const files = fs.readdirSync(templateDir).filter(f => f.endsWith(".prompt"))

  files.forEach(file => {
    const filePath = path.join(templateDir, file)
    const template = fs.readFileSync(filePath, "utf-8")
    const fields = extractFields(template)

    generateTestInputFile(file, fields)
  })
}

run()
