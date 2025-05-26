// 🔍 inspect-table-fields.ts
// Inspect actual field names in CanAI tables

import Airtable from "airtable"
import * as dotenv from "dotenv"
import { AIRTABLE_TABLES } from "./types/airtable"

// Load environment variables
dotenv.config({ path: '../.env.local' })

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!
const BASE_ID = process.env.AIRTABLE_BASE_ID!

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

async function inspectTableFields() {
  console.log("🔍 Inspecting actual field names in key CanAI tables...")
  
  const keyTables = [
    'PROMPT_LOGS',
    'SPARK_SPLIT_ANALYTICS', 
    'SESSION_ANALYTICS',
    'USER_CONTEXT',
    'TRUST_METRICS'
  ]
  
  for (const tableKey of keyTables) {
    const tableName = AIRTABLE_TABLES[tableKey as keyof typeof AIRTABLE_TABLES]
    
    try {
      console.log(`\n📋 Table: ${tableKey} (${tableName})`)
      const records = await base(tableName).select({ maxRecords: 1 }).firstPage()
      
      if (records.length > 0) {
        const fields = Object.keys(records[0].fields)
        console.log(`✅ Fields (${fields.length}):`)
        fields.forEach((field, index) => {
          console.log(`   ${index + 1}. ${field}`)
        })
        
        console.log(`\n📄 Sample record structure:`)
        console.log(JSON.stringify(records[0].fields, null, 2))
      } else {
        console.log(`⚠️  No records found - showing empty table`)
      }
      
    } catch (error: any) {
      console.log(`❌ Error accessing ${tableKey}: ${error.message}`)
    }
  }
}

inspectTableFields().catch(console.error) 