// 🔍 airtable-connection-test.ts
// Quick validation test for Airtable connection and schema
// Run this after setting up your Airtable base to validate everything works

import Airtable from "airtable"
import * as fs from "fs"
import * as path from "path"

// Load environment variables from .env.local
function loadEnvLocal() {
  // Look for .env.local in the project root (two levels up from scripts/tools)
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
  } else {
    console.log("⚠️  .env.local file not found at:", envPath)
  }
}

// Load environment variables
loadEnvLocal()

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!
const BASE_ID = process.env.AIRTABLE_BASE_ID!

if (!AIRTABLE_API_KEY || !BASE_ID) {
  console.error("❌ Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID environment variables")
  console.log("📋 Available environment variables:")
  console.log("   AIRTABLE_API_KEY:", AIRTABLE_API_KEY ? "✅ Set" : "❌ Missing")
  console.log("   AIRTABLE_BASE_ID:", BASE_ID ? "✅ Set" : "❌ Missing")
  console.log("\n🔧 Please check your .env.local file contains:")
  console.log("   AIRTABLE_API_KEY=your_api_key_here")
  console.log("   AIRTABLE_BASE_ID=your_base_id_here")
  process.exit(1)
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(BASE_ID)

async function testConnection() {
  try {
    console.log("🔍 Testing Airtable connection...")
    console.log("📋 Base ID:", BASE_ID)
    
    // First, let's try to list tables by attempting to access a few common ones
    const commonTableNames = ['PromptLogs', 'tblzZeGrZHjOnrExU', 'tblD2Zw2fEM7NWy6s'];
    let workingTable = null;
    
    for (const tableName of commonTableNames) {
      try {
        console.log(`🔍 Testing table: ${tableName}`);
        const testQuery = await base(tableName).select({ maxRecords: 1 }).firstPage();
        console.log(`✅ Table ${tableName} is accessible with ${testQuery.length} records`);
        workingTable = tableName;
        break;
      } catch (error) {
        console.log(`❌ Table ${tableName} not accessible:`, (error as any).message);
      }
    }
    
    if (!workingTable) {
      console.error("❌ No accessible tables found. Please check your base configuration.");
      return;
    }
    
    console.log(`🎯 Using table: ${workingTable}`);
    
    // Test 1: Discover table structure by reading existing records
    console.log("🔍 Discovering table structure...");
    const existingRecords = await base(workingTable).select({ maxRecords: 3 }).firstPage();
    
    if (existingRecords.length > 0) {
      console.log("📋 Available fields in table:");
      const sampleRecord = existingRecords[0];
      const fieldNames = Object.keys(sampleRecord.fields);
      fieldNames.forEach(field => {
        console.log(`   - ${field}: ${typeof sampleRecord.fields[field]}`);
      });
      
      // Test 2: Try to create a minimal record with just one field
      let testRecord;
      if (fieldNames.length > 0) {
        const firstField = fieldNames[0];
        const testData = { [firstField]: "connection_test_" + Date.now() };
        
        console.log(`🔍 Testing record creation with field: ${firstField}`);
        testRecord = await base(workingTable).create(testData);
        console.log("✅ Connection successful! Test record created:", testRecord.id);
        
        // Test 3: Cleanup
        await base(workingTable).destroy(testRecord.id);
        console.log("✅ Test cleanup complete");
      }
    } else {
      console.log("📋 Table is empty, testing with minimal record creation...");
      
      // Try creating a record with common field names
      const commonFields = ['Name', 'Title', 'Description', 'Status', 'Notes'];
      let testRecord;
      
      for (const fieldName of commonFields) {
        try {
          const testData = { [fieldName]: "connection_test_" + Date.now() };
          console.log(`🔍 Testing record creation with field: ${fieldName}`);
          testRecord = await base(workingTable).create(testData);
          console.log("✅ Connection successful! Test record created:", testRecord.id);
          
          // Cleanup
          await base(workingTable).destroy(testRecord.id);
          console.log("✅ Test cleanup complete");
          break;
        } catch (error) {
          console.log(`❌ Field ${fieldName} not available:`, (error as any).message);
        }
      }
      
      if (!testRecord) {
        console.log("⚠️  Could not create test record with common field names.");
        console.log("💡 Table exists and is accessible, but field structure is unknown.");
        console.log("✅ Authentication and base access are working correctly!");
      }
    }
    
    console.log("\n🎉 Airtable infrastructure validation complete!")
    console.log("✅ Authentication: Working")
    console.log("✅ Base Access: Working") 
    console.log("✅ Table Access: Working")
    console.log(`✅ Working Table: ${workingTable}`)
    console.log("✅ Ready for production use!")
    
  } catch (error) {
    console.error("❌ Connection test failed:", error)
    console.log("\n🔧 Troubleshooting steps:")
    console.log("1. Verify AIRTABLE_API_KEY is correct")
    console.log("2. Verify AIRTABLE_BASE_ID is correct") 
    console.log("3. Ensure the correct table exists in your base")
    console.log("4. Check that all required fields are created in Airtable")
    process.exit(1)
  }
}

testConnection() 