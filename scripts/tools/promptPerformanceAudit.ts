// 📊 promptPerformanceAudit.ts
// Audits prompt performance by analyzing SmartPromptScore logs from Airtable
// Requires Airtable API key + base setup
// Outputs: average scores, fallback rates, high-cost low-score sessions

import Airtable from "airtable"

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!
const BASE_ID = "appXXXXXXXXXXXXXX" // your actual Airtable base ID
const TABLE_NAME = "PromptLogs"

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

type LogEntry = {
  PromptType: string
  Version: string
  SmartPromptScore: number
  TokensEstimated: number
  CostUSD: number
  FallbackFields: string[]
  MissingFields: string[]
}

const logs: LogEntry[] = []

async function fetchLogs() {
  console.log("📥 Fetching session logs from Airtable...")

  await base(TABLE_NAME)
    .select({ pageSize: 1000 })
    .eachPage((records, fetchNextPage) => {
      for (const record of records) {
        const entry: LogEntry = {
          PromptType: record.get("PromptType") as string,
          Version: record.get("Version") as string,
          SmartPromptScore: Number(record.get("SmartPromptScore")),
          TokensEstimated: Number(record.get("TokensEstimated")),
          CostUSD: Number(record.get("CostUSD")),
          FallbackFields: (record.get("FallbackFields") || []) as string[],
          MissingFields: (record.get("MissingFields") || []) as string[]
        }
        logs.push(entry)
      }
      fetchNextPage()
    })
}

function analyze() {
  const groups: Record<string, LogEntry[]> = {}

  for (const log of logs) {
    const key = `${log.PromptType}.${log.Version}`
    if (!groups[key]) groups[key] = []
    groups[key].push(log)
  }

  console.log("\n📊 Prompt Performance Summary\n")

  Object.entries(groups).forEach(([key, entries]) => {
    const avgScore =
      entries.reduce((sum, e) => sum + e.SmartPromptScore, 0) / entries.length
    const avgTokens =
      entries.reduce((sum, e) => sum + e.TokensEstimated, 0) / entries.length
    const avgCost =
      entries.reduce((sum, e) => sum + e.CostUSD, 0) / entries.length
    const fallbackRate =
      entries.filter(e => e.FallbackFields.length > 0).length / entries.length

    console.log(`🔹 ${key}`)
    console.log(`   Avg Score:      ${avgScore.toFixed(2)} / 6`)
    console.log(`   Avg Tokens:     ${Math.round(avgTokens)} tokens`)
    console.log(`   Avg Cost:       $${avgCost.toFixed(4)}`)
    console.log(`   Fallback Rate:  ${(fallbackRate * 100).toFixed(1)}%\n`)
  })
}

;(async () => {
  await fetchLogs()
  analyze()
})()
