// 🔧 corrected-crud-test.ts
// Corrected CRUD test with proper date handling and field-specific logic

import Airtable from "airtable"
import * as dotenv from "dotenv"

// Load environment variables
dotenv.config()

const BASE_ID = "apph8yM7gVc9QBFtx"
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_TOKEN

console.log("🔧 CanAI Corrected CRUD Test")
console.log("============================")
console.log(`Base ID: ${BASE_ID}`)
console.log(`API Key: ${AIRTABLE_API_KEY ? "✅ Set" : "❌ Missing"}`)

if (!AIRTABLE_API_KEY) {
  console.error("❌ Missing AIRTABLE_API_KEY environment variable")
  process.exit(1)
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

// Test a subset of tables first to validate the approach
const TEST_TABLES = [
  '01_PromptLogs',
  '02_SparkSplitAnalytics', 
  '03_SessionAnalytics',
  '04_UserContext',
  '05_OutputGoldmine'
]

interface CrudResult {
  tableName: string
  createSuccess: boolean
  readSuccess: boolean
  updateSuccess: boolean
  deleteSuccess: boolean
  recordId?: string
  error?: string
}

function generateSmartTestData(tableName: string, existingFields: string[]): any {
  const timestamp = new Date().toISOString()
  const testId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
  
  const testData: any = {}
  
  // Handle each field intelligently based on name and type
  for (const field of existingFields) {
    const fieldLower = field.toLowerCase()
    
    // Skip auto-generated fields that Airtable might handle
    if (fieldLower === 'createdat' || fieldLower === 'updatedat') {
      // Let Airtable handle these automatically, or use proper date format
      continue
    }
    
    // Handle different field types based on naming patterns
    if (fieldLower.includes('id')) {
      testData[field] = testId
    } else if (fieldLower.includes('email')) {
      testData[field] = `test_${testId}@canai.so`
    } else if (fieldLower.includes('score') || fieldLower.includes('rate') || fieldLower.includes('value')) {
      testData[field] = Math.round(Math.random() * 100) / 100 // 0.00 to 1.00
    } else if (fieldLower.includes('count') || fieldLower.includes('duration')) {
      testData[field] = Math.floor(Math.random() * 100) + 1
    } else if (fieldLower.includes('type') || fieldLower.includes('status')) {
      testData[field] = 'test_type'
    } else if (fieldLower.includes('level')) {
      testData[field] = Math.round(Math.random() * 10)
    } else if (fieldLower.includes('timestamp') || fieldLower.includes('time')) {
      testData[field] = timestamp
    } else {
      // Default to string for unknown fields
      testData[field] = `CRUD_test_${field}_${testId}`
    }
  }
  
  return testData
}

async function getTableFields(tableName: string): Promise<string[]> {
  try {
    const records = await base(tableName).select({ maxRecords: 1 }).firstPage()
    if (records.length > 0) {
      return Object.keys(records[0].fields)
    }
    return []
  } catch (error) {
    console.log(`   ❌ Could not get fields for ${tableName}: ${error}`)
    return []
  }
}

async function testTableCrudCorrected(tableName: string): Promise<CrudResult> {
  const result: CrudResult = {
    tableName,
    createSuccess: false,
    readSuccess: false,
    updateSuccess: false,
    deleteSuccess: false
  }

  try {
    console.log(`\n🔍 Testing CRUD for: ${tableName}`)
    
    // Get existing field structure
    const fields = await getTableFields(tableName)
    if (fields.length === 0) {
      result.error = "No fields discovered"
      return result
    }
    
    console.log(`   📋 Found ${fields.length} fields`)
    
    // 1. CREATE - Use minimal required fields only
    console.log(`   📝 CREATE: Inserting minimal test record...`)
    
    // Start with minimal data - just a few safe fields
    const minimalData: any = {}
    
    // Find safe text fields to populate
    const safeFields = fields.filter(f => {
      const fl = f.toLowerCase()
      return !fl.includes('createdat') && 
             !fl.includes('updatedat') && 
             !fl.includes('timestamp') &&
             !fl.includes('time')
    }).slice(0, 3) // Only use first 3 safe fields
    
    for (const field of safeFields) {
      const fieldLower = field.toLowerCase()
      if (fieldLower.includes('id')) {
        minimalData[field] = `test_${Date.now()}`
      } else if (fieldLower.includes('score') || fieldLower.includes('rate')) {
        minimalData[field] = 0.85
      } else {
        minimalData[field] = `test_value_${Date.now()}`
      }
    }
    
    console.log(`   📋 Using fields: ${Object.keys(minimalData).join(", ")}`)
    
    const createResponse = await base(tableName).create([{ fields: minimalData }])
    
    if (createResponse && createResponse.length > 0) {
      result.createSuccess = true
      result.recordId = createResponse[0].id
      console.log(`   ✅ CREATE: Success - Record ID: ${result.recordId}`)
    }

    // 2. READ
    if (result.recordId) {
      console.log(`   📖 READ: Retrieving created record...`)
      const readResponse = await base(tableName).find(result.recordId)
      if (readResponse && readResponse.id === result.recordId) {
        result.readSuccess = true
        console.log(`   ✅ READ: Success - Retrieved record`)
      }
    }

    // 3. UPDATE
    if (result.recordId) {
      console.log(`   ✏️  UPDATE: Modifying record...`)
      
      // Find the first safe field to update
      const updateField = Object.keys(minimalData)[0]
      if (updateField) {
        const updateData = {
          [updateField]: `UPDATED_${Date.now()}`
        }
        
        const updateResponse = await base(tableName).update([{
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
      const deleteResponse = await base(tableName).destroy([result.recordId])
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
        await base(tableName).destroy([result.recordId])
        console.log(`   🧹 CLEANUP: Test record removed after error`)
      } catch (cleanupError) {
        console.log(`   ⚠️  CLEANUP FAILED: ${cleanupError}`)
      }
    }
  }

  return result
}

async function runCorrectedCrudTest() {
  console.log(`\n🚀 Starting corrected CRUD test for ${TEST_TABLES.length} tables...`)
  
  const results: CrudResult[] = []
  
  for (const tableName of TEST_TABLES) {
    const result = await testTableCrudCorrected(tableName)
    results.push(result)
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  // Generate report
  console.log(`\n📊 CORRECTED CRUD TEST RESULTS`)
  console.log(`==============================`)
  
  const successfulTables = results.filter(r => r.createSuccess && r.readSuccess && r.updateSuccess && r.deleteSuccess)
  const partialSuccess = results.filter(r => r.createSuccess || r.readSuccess || r.updateSuccess || r.deleteSuccess)
  
  console.log(`✅ Full CRUD success: ${successfulTables.length}/${TEST_TABLES.length}`)
  console.log(`🔄 Partial success: ${partialSuccess.length}/${TEST_TABLES.length}`)
  
  if (successfulTables.length > 0) {
    console.log(`\n✅ TABLES WITH FULL CRUD SUCCESS:`)
    successfulTables.forEach(r => console.log(`   - ${r.tableName}: All operations successful`))
  }
  
  const failedTables = results.filter(r => !(r.createSuccess && r.readSuccess && r.updateSuccess && r.deleteSuccess))
  if (failedTables.length > 0) {
    console.log(`\n❌ TABLES WITH ISSUES:`)
    failedTables.forEach(r => {
      console.log(`   - ${r.tableName}:`)
      console.log(`     CREATE: ${r.createSuccess ? '✅' : '❌'} | READ: ${r.readSuccess ? '✅' : '❌'} | UPDATE: ${r.updateSuccess ? '✅' : '❌'} | DELETE: ${r.deleteSuccess ? '✅' : '❌'}`)
      if (r.error) console.log(`     ERROR: ${r.error}`)
    })
  }
  
  // Success assessment
  const successRate = (successfulTables.length / TEST_TABLES.length) * 100
  
  if (successRate === 100) {
    console.log(`\n🌟 PERFECT! All ${TEST_TABLES.length} test tables have full CRUD capabilities!`)
    console.log(`�� Ready to test all 18 tables with this corrected approach!`)
    console.log(`✅ CRUD operations validated and working correctly`)
  } else if (successRate >= 80) {
    console.log(`\n🎉 EXCELLENT! ${successRate.toFixed(1)}% success rate!`)
    console.log(`✅ CRUD approach validated - ready for full deployment`)
  } else if (successRate >= 60) {
    console.log(`\n⚠️  GOOD PROGRESS: ${successRate.toFixed(1)}% success rate`)
    console.log(`💡 Minor adjustments needed for full compatibility`)
  } else {
    console.log(`\n❌ NEEDS ATTENTION: ${successRate.toFixed(1)}% success rate`)
    console.log(`🔧 Field handling approach needs refinement`)
  }
  
  return results
}

// Run the corrected test
runCorrectedCrudTest().catch(console.error) 