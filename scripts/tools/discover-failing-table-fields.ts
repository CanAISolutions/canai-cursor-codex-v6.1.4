// 🔍 discover-failing-table-fields.ts
// Discover actual field names and structures for the 5 failing tables

import Airtable from "airtable"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config()

const BASE_ID = "apph8yM7gVc9QBFtx"
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_TOKEN

console.log("🔍 CanAI - Discover Failing Table Fields")
console.log("=======================================")
console.log(`Base ID: ${BASE_ID}`)
console.log(`API Key: ${AIRTABLE_API_KEY ? "✅ Set" : "❌ Missing"}`)

if (!AIRTABLE_API_KEY) {
  console.error("❌ Missing AIRTABLE_API_KEY environment variable")
  process.exit(1)
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

// The 5 tables that are failing CRUD operations
const FAILING_TABLES = [
  '17_CompetitiveIntel',
  '24_SystemPerformance', 
  '27_GrowthMetrics',
  '28_RetentionAnalysis',
  '34_FutureInsights'
]

type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'datetime' | 'month' | 'email' | 'object'

interface TableFieldInfo {
  tableName: string
  fields: Array<{
    name: string
    type: FieldType
    sampleValue: any
  }>
  recordCount: number
  error?: string
}

async function discoverTableFields(tableName: string): Promise<TableFieldInfo> {
  try {
    console.log(`\n🔍 Discovering fields for: ${tableName}`)
    
    // Get existing records to understand field structure
    const records = await base(tableName).select({ maxRecords: 3 }).firstPage()
    
    const result: TableFieldInfo = {
      tableName,
      fields: [],
      recordCount: records.length
    }
    
    if (records.length > 0) {
      const sampleRecord = records[0].fields
      
      // Analyze each field
      Object.entries(sampleRecord).forEach(([fieldName, value]) => {
        let type: FieldType = typeof value as FieldType
        
        // Detect more specific types
        if (typeof value === 'string') {
          if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)) {
            type = 'datetime'
          } else if (value.match(/^\d{4}-\d{2}$/)) {
            type = 'month'
          } else if (value.includes('@')) {
            type = 'email'
          }
        } else if (Array.isArray(value)) {
          type = 'array'
        } else if (typeof value === 'object' && value !== null) {
          type = 'object'
        }
        
        result.fields.push({
          name: fieldName,
          type,
          sampleValue: value
        })
      })
      
      console.log(`   📋 Found ${result.fields.length} fields in ${result.recordCount} records`)
      console.log(`   🔍 Fields: ${result.fields.map(f => `${f.name} (${f.type})`).join(", ")}`)
      
      // Show sample values for first few fields
      console.log(`   📊 Sample values:`)
      result.fields.slice(0, 5).forEach(field => {
        const displayValue = typeof field.sampleValue === 'string' && field.sampleValue.length > 50 
          ? field.sampleValue.substring(0, 50) + "..." 
          : field.sampleValue
        console.log(`      ${field.name}: ${JSON.stringify(displayValue)}`)
      })
      
    } else {
      console.log(`   📋 No existing records found`)
    }
    
    return result
    
  } catch (error: any) {
    console.log(`   ❌ Discovery failed: ${error.message}`)
    return {
      tableName,
      fields: [],
      recordCount: 0,
      error: error.message
    }
  }
}

async function runFieldDiscovery() {
  console.log(`\n🚀 Starting field discovery for ${FAILING_TABLES.length} failing tables...`)
  
  const results: TableFieldInfo[] = []

  for (const tableName of FAILING_TABLES) {
    const result = await discoverTableFields(tableName)
    results.push(result)
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // Generate comprehensive field analysis
  console.log(`\n📊 FIELD DISCOVERY RESULTS`)
  console.log(`==========================`)
  
  results.forEach(table => {
    console.log(`\n📋 ${table.tableName}:`)
    if (table.error) {
      console.log(`   ❌ Error: ${table.error}`)
    } else if (table.fields.length === 0) {
      console.log(`   📋 No fields discovered (empty table)`)
    } else {
      console.log(`   📊 ${table.fields.length} fields, ${table.recordCount} records`)
      console.log(`   🔍 Field Structure:`)
      table.fields.forEach(field => {
        console.log(`      - ${field.name}: ${field.type}`)
      })
      
      // Suggest safe fields for CRUD testing
      const safeFields = table.fields.filter(f => 
        f.type === 'string' && 
        !f.name.toLowerCase().includes('createdat') &&
        !f.name.toLowerCase().includes('updatedat') &&
        !f.name.toLowerCase().includes('id')
      )
      
      const numberFields = table.fields.filter(f => f.type === 'number')
      
      console.log(`   💡 Safe text fields for testing: ${safeFields.map(f => f.name).join(", ") || "None"}`)
      console.log(`   💡 Number fields for testing: ${numberFields.map(f => f.name).join(", ") || "None"}`)
    }
  })

  // Generate TypeScript interface for each table
  console.log(`\n📝 TYPESCRIPT INTERFACES FOR CRUD TESTING`)
  console.log(`==========================================`)
  
  results.forEach(table => {
    if (table.fields.length > 0) {
      console.log(`\n// ${table.tableName} Interface`)
      console.log(`interface ${table.tableName.replace(/\d+_/, '')}Fields {`)
      table.fields.forEach(field => {
        const tsType = field.type === 'number' ? 'number' : 
                      field.type === 'boolean' ? 'boolean' :
                      field.type === 'array' ? 'string[]' : 'string'
        console.log(`  ${field.name}: ${tsType}`)
      })
      console.log(`}`)
    }
  })

  // Generate CRUD test data templates
  console.log(`\n🧪 CRUD TEST DATA TEMPLATES`)
  console.log(`============================`)
  
  results.forEach(table => {
    if (table.fields.length > 0) {
      console.log(`\n// ${table.tableName} Test Data`)
      console.log(`const ${table.tableName.replace(/\d+_/, '').toLowerCase()}TestData = {`)
      
      // Use only the first 3-5 safe fields for testing
      const testFields = table.fields.filter(f => 
        !f.name.toLowerCase().includes('createdat') &&
        !f.name.toLowerCase().includes('updatedat')
      ).slice(0, 5)
      
      testFields.forEach(field => {
        let testValue: string
        if (field.type === 'number') {
          testValue = '0.85'
        } else if (field.type === 'boolean') {
          testValue = 'true'
        } else if (field.type === 'array') {
          testValue = '["test_value"]'
        } else if (field.name.toLowerCase().includes('id')) {
          testValue = '`test_${Date.now()}`'
        } else {
          testValue = '`test_value_${Date.now()}`'
        }
        console.log(`  ${field.name}: ${testValue},`)
      })
      console.log(`}`)
    }
  })

  return results
}

// Run the field discovery
runFieldDiscovery().catch(console.error) 