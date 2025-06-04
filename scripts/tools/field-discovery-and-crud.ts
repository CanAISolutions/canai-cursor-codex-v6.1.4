// 🔍 field-discovery-and-crud.ts
// Discover actual field names in each table, then perform CRUD operations

import Airtable from "airtable"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config()

const BASE_ID = "apph8yM7gVc9QBFtx"
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_TOKEN

console.log("🔍 CanAI Field Discovery & CRUD Test")
console.log("====================================")
console.log(`Base ID: ${BASE_ID}`)
console.log(`API Key: ${AIRTABLE_API_KEY ? "✅ Set" : "❌ Missing"}`)

if (!AIRTABLE_API_KEY) {
  console.error("❌ Missing AIRTABLE_API_KEY environment variable")
  process.exit(1)
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

// All 18 CanAI tables
const ALL_CANAI_TABLES = [
  // 18-Table Optimized Architecture
  '01_PromptLogs', '02_SessionAnalytics', '03_SparkSplitAnalytics', '04_GoldmineOutput', '05_UserContext',
  '06_EmotionalIntelligence', '07_TrustMetrics', '08_PerformanceMetrics', '09_WebhookLogs', '10_AirtableSync',
  '11_ErrorLogs', '12_ProcessingResults', '13_SystemHealth', '14_PromptTypes', '15_EmotionalStates',
  '16_TrustFactors', '17_SystemConfigs', '18_AnalyticsAggregates'
]

interface TableSchema {
  tableName: string
  fields: string[]
  sampleRecord?: any
  recordCount: number
}

interface CrudResult {
  tableName: string
  createSuccess: boolean
  readSuccess: boolean
  updateSuccess: boolean
  deleteSuccess: boolean
  recordId?: string
  error?: string
}

async function discoverTableSchema(tableName: string): Promise<TableSchema> {
  try {
    console.log(`🔍 Discovering schema for: ${tableName}`)
    
    // Get existing records to understand field structure
    const records = await base(tableName).select({ maxRecords: 3 }).firstPage()
    
    let fields: string[] = []
    let sampleRecord = null
    
    if (records.length > 0) {
      fields = Object.keys(records[0].fields)
      sampleRecord = records[0].fields
      console.log(`   📋 Found ${fields.length} fields: ${fields.slice(0, 5).join(", ")}${fields.length > 5 ? "..." : ""}`)
    } else {
      console.log(`   📋 No existing records found - will attempt minimal field test`)
    }
    
    return {
      tableName,
      fields,
      sampleRecord,
      recordCount: records.length
    }
    
  } catch (error: any) {
    console.log(`   ❌ Schema discovery failed: ${error.message}`)
    return {
      tableName,
      fields: [],
      sampleRecord: null,
      recordCount: 0
    }
  }
}

function generateTestData(schema: TableSchema): any {
  const timestamp = new Date().toISOString()
  const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
  
  // If we have existing records, use their structure as a template
  if (schema.sampleRecord && schema.fields.length > 0) {
    const testData: any = {}
    
    // Copy structure from sample record but with test values
    for (const field of schema.fields) {
      const sampleValue = schema.sampleRecord[field]
      
      if (typeof sampleValue === 'string') {
        if (field.toLowerCase().includes('id')) {
          testData[field] = testId
        } else if (field.toLowerCase().includes('email')) {
          testData[field] = `test_${testId}@canai.so`
        } else if (field.toLowerCase().includes('date') || field.toLowerCase().includes('time')) {
          testData[field] = timestamp
        } else {
          testData[field] = `CRUD_test_${field}_${testId}`
        }
      } else if (typeof sampleValue === 'number') {
        testData[field] = Math.round(Math.random() * 100)
      } else if (typeof sampleValue === 'boolean') {
        testData[field] = true
      } else {
        // For unknown types, try string
        testData[field] = `test_${testId}`
      }
    }
    
    return testData
  }
  
  // Fallback: minimal test data for empty tables
  return {
    Name: `CRUD Test ${testId}`,
    Status: 'test',
    CreatedAt: timestamp
  }
}

async function testCrudOperations(schema: TableSchema): Promise<CrudResult> {
  const result: CrudResult = {
    tableName: schema.tableName,
    createSuccess: false,
    readSuccess: false,
    updateSuccess: false,
    deleteSuccess: false
  }

  try {
    // Skip CRUD test if no fields discovered and no existing records
    if (schema.fields.length === 0 && schema.recordCount === 0) {
      console.log(`   ⚠️  Skipping CRUD test - no field structure available`)
      result.error = "No field structure available for testing"
      return result
    }

    console.log(`   🔧 Testing CRUD operations...`)
    
    // 1. CREATE
    console.log(`   📝 CREATE: Inserting test record...`)
    const testData = generateTestData(schema)
    console.log(`   📋 Test data fields: ${Object.keys(testData).join(", ")}`)
    
    const createResponse = await base(schema.tableName).create([{ fields: testData }])
    
    if (createResponse && createResponse.length > 0) {
      result.createSuccess = true
      result.recordId = createResponse[0].id
      console.log(`   ✅ CREATE: Success - Record ID: ${result.recordId}`)
    }

    // 2. READ
    if (result.recordId) {
      console.log(`   📖 READ: Retrieving created record...`)
      const readResponse = await base(schema.tableName).find(result.recordId)
      if (readResponse && readResponse.id === result.recordId) {
        result.readSuccess = true
        console.log(`   ✅ READ: Success - Retrieved record`)
      }
    }

    // 3. UPDATE
    if (result.recordId && schema.fields.length > 0) {
      console.log(`   ✏️  UPDATE: Modifying record...`)
      
      // Find a safe field to update (prefer text fields)
      const updateField = schema.fields.find(f => 
        typeof schema.sampleRecord?.[f] === 'string' && 
        !f.toLowerCase().includes('id')
      ) || schema.fields[0]
      
      if (updateField) {
        const updateData = {
          [updateField]: `UPDATED_${Date.now()}`
        }
        
        const updateResponse = await base(schema.tableName).update([{
          id: result.recordId,
          fields: updateData
        }])
        
        if (updateResponse && updateResponse.length > 0) {
          result.updateSuccess = true
          console.log(`   ✅ UPDATE: Success - Modified field: ${updateField}`)
        }
      }
    }

    // 4. DELETE
    if (result.recordId) {
      console.log(`   🗑️  DELETE: Cleaning up test record...`)
      const deleteResponse = await base(schema.tableName).destroy([result.recordId])
      if (deleteResponse && deleteResponse.length > 0) {
        result.deleteSuccess = true
        console.log(`   ✅ DELETE: Success - Test record cleaned up`)
      }
    }

  } catch (error: any) {
    result.error = error.message
    console.log(`   ❌ CRUD ERROR: ${error.message}`)
    
    // Cleanup attempt
    if (result.recordId && !result.deleteSuccess) {
      try {
        await base(schema.tableName).destroy([result.recordId])
        console.log(`   🧹 CLEANUP: Test record removed after error`)
      } catch (cleanupError) {
        console.log(`   ⚠️  CLEANUP FAILED: ${cleanupError}`)
      }
    }
  }

  return result
}

async function runFieldDiscoveryAndCrud() {
  console.log(`\n🚀 Starting field discovery and CRUD test for ${ALL_CANAI_TABLES.length} tables...`)
  
  const schemas: TableSchema[] = []
  const crudResults: CrudResult[] = []
  
  // Phase 1: Discover all table schemas
  console.log(`\n📋 PHASE 1: FIELD DISCOVERY`)
  console.log(`===========================`)
  
  for (const tableName of ALL_CANAI_TABLES) {
    const schema = await discoverTableSchema(tableName)
    schemas.push(schema)
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  
  // Phase 2: CRUD testing
  console.log(`\n🔧 PHASE 2: CRUD OPERATIONS TESTING`)
  console.log(`===================================`)
  
  for (const schema of schemas) {
    if (schema.fields.length > 0 || schema.recordCount > 0) {
      const crudResult = await testCrudOperations(schema)
      crudResults.push(crudResult)
    } else {
      console.log(`\n🔍 ${schema.tableName}: Skipping CRUD test - no field structure`)
      crudResults.push({
        tableName: schema.tableName,
        createSuccess: false,
        readSuccess: false,
        updateSuccess: false,
        deleteSuccess: false,
        error: "No field structure available"
      })
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  // Generate comprehensive report
  console.log(`\n📊 COMPREHENSIVE FIELD DISCOVERY & CRUD RESULTS`)
  console.log(`===============================================`)
  
  const tablesWithFields = schemas.filter(s => s.fields.length > 0)
  const successfulCrud = crudResults.filter(r => r.createSuccess && r.readSuccess && r.updateSuccess && r.deleteSuccess)
  
  console.log(`✅ Tables with discovered fields: ${tablesWithFields.length}/${ALL_CANAI_TABLES.length}`)
  console.log(`✅ Tables with full CRUD success: ${successfulCrud.length}/${ALL_CANAI_TABLES.length}`)
  
  if (tablesWithFields.length > 0) {
    console.log(`\n📋 FIELD STRUCTURE SUMMARY:`)
    tablesWithFields.forEach(schema => {
      console.log(`   - ${schema.tableName}: ${schema.fields.length} fields, ${schema.recordCount} records`)
      console.log(`     Fields: ${schema.fields.slice(0, 8).join(", ")}${schema.fields.length > 8 ? "..." : ""}`)
    })
  }
  
  if (successfulCrud.length > 0) {
    console.log(`\n✅ TABLES WITH FULL CRUD SUCCESS:`)
    successfulCrud.forEach(r => console.log(`   - ${r.tableName}: All operations successful`))
  }
  
  const failedCrud = crudResults.filter(r => !(r.createSuccess && r.readSuccess && r.updateSuccess && r.deleteSuccess))
  if (failedCrud.length > 0) {
    console.log(`\n❌ TABLES WITH CRUD ISSUES:`)
    failedCrud.forEach(r => {
      console.log(`   - ${r.tableName}:`)
      console.log(`     CREATE: ${r.createSuccess ? '✅' : '❌'} | READ: ${r.readSuccess ? '✅' : '❌'} | UPDATE: ${r.updateSuccess ? '✅' : '❌'} | DELETE: ${r.deleteSuccess ? '✅' : '❌'}`)
      if (r.error) console.log(`     ERROR: ${r.error}`)
    })
  }
  
  // Success assessment
  const crudSuccessRate = (successfulCrud.length / ALL_CANAI_TABLES.length) * 100
  const fieldDiscoveryRate = (tablesWithFields.length / ALL_CANAI_TABLES.length) * 100
  
  console.log(`\n🎯 FINAL ASSESSMENT:`)
  console.log(`Field Discovery Rate: ${fieldDiscoveryRate.toFixed(1)}%`)
  console.log(`CRUD Success Rate: ${crudSuccessRate.toFixed(1)}%`)
  
  if (crudSuccessRate === 100) {
    console.log(`\n🌟 PERFECT! ALL 18 TABLES HAVE FULL CRUD CAPABILITIES!`)
    console.log(`🚀 Complete CanAI platform ready for production data operations!`)
  } else if (crudSuccessRate >= 90) {
    console.log(`\n🎉 EXCELLENT! ${crudSuccessRate.toFixed(1)}% of tables have full CRUD capabilities!`)
    console.log(`✅ Core infrastructure operational for production use`)
  } else if (fieldDiscoveryRate >= 90) {
    console.log(`\n✅ GOOD FOUNDATION! ${fieldDiscoveryRate.toFixed(1)}% of tables have discoverable field structures`)
    console.log(`💡 CRUD operations may need field-specific adjustments`)
  } else {
    console.log(`\n⚠️  ATTENTION: Field structures need review for optimal CRUD operations`)
  }
  
  return { schemas, crudResults }
}

// Run the comprehensive test
runFieldDiscoveryAndCrud().catch(console.error) 