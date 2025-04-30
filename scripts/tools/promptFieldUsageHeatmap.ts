// 📊 promptFieldUsageHeatmap.ts
// Counts field usage frequency across all PromptLogs sessions in Airtable

import Airtable from "airtable"

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!
const BASE_ID = "appXXXXXXXXXXXXXX"
const TABLE_NAME = "PromptLogs"

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

type UsageMap = Record<string, number>

async function run() {
  const usage: UsageMap = {}

  await base(TABLE_NAME)
    .select({ pageSize: 1000 })
    .eachPage((records, fetchNextPage) => {
      for (const record of records) {
        const input = record.get("Input") as Record<string, any>
        if (!input) continue

        Object.keys(input).forEach(field => {
          usage[field] = (usage[field] || 0) + 1
        })
      }
      fetchNextPage()
    })

  console.log("📊 Prompt Field Usage Heatmap\n")
  const sorted = Object.entries(usage).sort((a, b) => b[1] - a[1])
  sorted.forEach(([field, count]) => {
    console.log(`- ${field.padEnd(20)} ${count.toString().padStart(4)} uses`)
  })
}

run()
