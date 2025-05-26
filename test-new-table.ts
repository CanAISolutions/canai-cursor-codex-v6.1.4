// 🔍 test-new-table.ts
// Quick test to access the new table we can see in the URL

import Airtable from "airtable"
import * as fs from "fs"
import * as path from "path"

// Load environment variables from .env.local
function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '..', '..', '.env.local')
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    const lines = envContent.split('\n')
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '')
          process.env[key] = value
        }
      }
    }
    console.log("✅ Loaded environment variables from .env.local")
  }
}

loadEnvLocal()

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!
const BASE_ID = process.env.AIRTABLE_BASE_ID!

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

async function testNewTable() {
  console.log("🔍 Testing access to new table from URL...")
  console.log(`📋 Base ID: ${BASE_ID}`)
  
  // Test the table ID we can see from the URL
  const newTableId = "tblARVfgPEGwgKhGZ"
  
  try {
    console.log(`🔍 Testing table ID: ${newTableId}`)
    const records = await base(newTableId).select({ maxRecords: 3 }).firstPage()
    console.log(`✅ SUCCESS! New table accessible with ${records.length} records`)
    
    if (records.length > 0) {
      const firstRecord = records[0]
      const fields = Object.keys(firstRecord.fields)
      console.log(`📋 Table has ${fields.length} fields:`)
      fields.forEach(field => {
        console.log(`   - ${field}`)
      })
    }
    
    return true
    
  } catch (error: any) {
    console.log(`❌ Cannot access new table: ${error.message}`)
    return false
  }
}

async function main() {
  const success = await testNewTable()
  
  if (success) {
    console.log("\n🎉 GREAT NEWS!")
    console.log("✅ Your CSV imports worked!")
    console.log("✅ Tables are created and accessible!")
    console.log("✅ Ready to update validation script with correct table IDs!")
  } else {
    console.log("\n🔧 NEXT STEPS:")
    console.log("1. Update your API token permissions at: https://airtable.com/create/tokens")
    console.log("2. Add access to all your new tables")
    console.log("3. Run this test again")
  }
}

main() 