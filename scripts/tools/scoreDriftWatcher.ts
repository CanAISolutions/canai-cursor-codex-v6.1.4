// 📉 scoreDriftWatcher.ts
// Compares prompt score averages across weeks — detects performance decay

import Airtable from "airtable"

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!
const BASE_ID = "appXXXXXXXXXXXXXX"
const TABLE_NAME = "PromptLogs"

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

type WeeklyStats = Record<string, number[]> // { "business_plan": [week1avg, week2avg, ...] }

async function fetchPromptScores(): Promise<WeeklyStats> {
  const stats: WeeklyStats = {}

  await base(TABLE_NAME)
    .select({ pageSize: 1000 })
    .eachPage((records, fetchNextPage) => {
      for (const record of records) {
        const type = record.get("PromptType") as string
        const score = Number(record.get("SmartPromptScore"))
        const week = new Date(record.get("CreatedAt") as string).getWeek()

        const key = `${type}-W${week}`
        if (!stats[key]) stats[key] = []
        stats[key].push(score)
      }
      fetchNextPage()
    })

  const compressed: Record<string, number[]> = {}
  Object.entries(stats).forEach(([k, scores]) => {
    const [type] = k.split("-W")
    if (!compressed[type]) compressed[type] = []
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    compressed[type].push(Number(avg.toFixed(2)))
  })

  return compressed
}

Date.prototype.getWeek = function () {
  const d = new Date(+this)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

;(async () => {
  const stats = await fetchPromptScores()

  console.log("📉 Score Drift Watcher\n")
  Object.entries(stats).forEach(([type, series]) => {
    const delta = series.length > 1 ? (series.at(-1)! - series.at(-2)!).toFixed(2) : "n/a"
    console.log(`🔹 ${type}: ${series.map(s => `${s}`).join(" → ")}  (Δ: ${delta})`)
    if (delta !== "n/a" && parseFloat(delta) < -0.5) {
      console.log("   ⚠️  Significant decline — consider review.\n")
    }
  })
})()
