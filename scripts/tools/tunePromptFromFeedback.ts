// 🛠 tunePromptFromFeedback.ts
// Scans low-scoring sessions in Airtable and generates improvement suggestions for .prompt files
// Based on SmartPromptScore, user feedback, and fallback usage

import Airtable from "airtable"
import fs from "fs"
import path from "path"

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!
const BASE_ID = "appXXXXXXXXXXXXXX" // your actual Airtable base ID
const TABLE_NAME = "PromptLogs"

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

type FeedbackEntry = {
  PromptType: string
  Version: string
  SmartPromptScore: number
  Feedback: string
  FallbackFields: string[]
  Output: string
}

const logs: FeedbackEntry[] = []

async function fetchLowScoreLogs() {
  console.log("📉 Fetching low-score sessions...")

  await base(TABLE_NAME)
    .select({
      pageSize: 1000,
      filterByFormula: "AND({SmartPromptScore} < 4, {Feedback} != '')"
    })
    .eachPage((records, fetchNextPage) => {
      for (const record of records) {
        const entry: FeedbackEntry = {
          PromptType: record.get("PromptType") as string,
          Version: record.get("Version") as string,
          SmartPromptScore: Number(record.get("SmartPromptScore")),
          Feedback: record.get("Feedback") as string,
          FallbackFields: (record.get("FallbackFields") || []) as string[],
          Output: record.get("Output") as string
        }
        logs.push(entry)
      }
      fetchNextPage()
    })
}

function generateSuggestions(log: FeedbackEntry): string {
  return `🧠 Suggestion for \`${log.PromptType}.${log.Version}\`
- Score: ${log.SmartPromptScore}/6
- Fallback fields: ${log.FallbackFields.join(", ") || "none"}
- Feedback: "${log.Feedback}"

🔧 Rewrite Focus:
${log.Feedback.includes("tone") ? "- Recalibrate tone (too formal or off-brand)\n" : ""}
${log.Feedback.includes("CTA") ? "- Strengthen or clarify the CTA\n" : ""}
${log.Feedback.includes("unclear") || log.Feedback.includes("confusing") ? "- Improve clarity and structure\n" : ""}
${log.FallbackFields.includes("customerPain") ? "- Try collecting `customerPain` explicitly — it's missing\n" : ""}
${log.FallbackFields.includes("trustSignal") ? "- Add more trust-building phrases or examples\n" : ""}
`
}

async function runAudit() {
  await fetchLowScoreLogs()

  if (logs.length === 0) {
    console.log("✅ No low-score sessions found.")
    return
  }

  logs.forEach(log => {
    const suggestion = generateSuggestions(log)

    const fileName = `${log.PromptType}.${log.Version}.suggestion.txt`
    const filePath = path.resolve(__dirname, "../gpt-templates/revisions", fileName)

    if (!fs.existsSync(path.dirname(filePath))) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true })
    }

    fs.writeFileSync(filePath, suggestion)
    console.log(`✅ Suggested update written → revisions/${fileName}`)
  })
}

runAudit()
