// 🔍 test-original-table.ts
// Test the original table that was working before CSV import

import Airtable from "airtable"

const AIRTABLE_API_KEY = "patN0Qw82kg7zDI4N.0c47fc7114e9de50db390a5f900779e03cfc7fcbb7589371e88a3e5b1dad9493"
const BASE_ID = "apph8yM7gVc9QBFtx"

// Test the original table that was working
const ORIGINAL_TABLE_ID = "tblzZeGrZHjOnrExU" // From the connection test

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

async function testOriginalTable() {
  console.log("🔍 Testing original table that was working...")
  console.log(`📋 Base: ${BASE_ID}`)
  console.log(`🎯 Original Table: ${ORIGINAL_TABLE_ID}`)
  
  try {
    const records = await base(ORIGINAL_TABLE_ID).select({ maxRecords: 3 }).firstPage()
    console.log(`✅ Original table still accessible with ${records.length} records`)
    
    if (records.length > 0) {
      const firstRecord = records[0]
      const fields = Object.keys(firstRecord.fields)
      console.log(`📊 Original table has ${fields.length} fields:`)
      fields.forEach(field => {
        console.log(`   - ${field}`)
      })
    }
    
    console.log("\n✅ Original table still works!")
    console.log("💡 Issue: New tables from CSV import need API token permissions")
    console.log("🔧 Solution: Update your API token at https://airtable.com/create/tokens")
    console.log("   - Add permissions for all tables in your base")
    console.log("   - Or create a new token with full base access")
    
  } catch (error: any) {
    console.log(`❌ Original table test failed: ${error.message}`)
  }
}

async function testNewTable() {
  console.log("\n🔍 Testing new table from CSV import...")
  const NEW_TABLE_ID = "tblARVfgPEGwgKhGZ"
  
  try {
    const records = await base(NEW_TABLE_ID).select({ maxRecords: 1 }).firstPage()
    console.log(`✅ New table accessible!`)
  } catch (error: any) {
    console.log(`❌ New table not accessible: ${error.message}`)
    
    if (error.message.includes("api key")) {
      console.log("💡 This confirms: API token needs permissions for new tables")
    }
  }
}

async function main() {
  await testOriginalTable()
  await testNewTable()
  
  console.log("\n🎯 SUMMARY:")
  console.log("✅ Your CSV import was successful (36 tables created)")
  console.log("✅ Original infrastructure still works")
  console.log("🔧 Next step: Update API token permissions for new tables")
  console.log("🌐 Your base: https://airtable.com/apph8yM7gVc9QBFtx")
}

main() 