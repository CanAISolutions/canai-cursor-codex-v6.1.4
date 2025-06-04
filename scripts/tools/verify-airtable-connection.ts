#!/usr/bin/env npx ts-node

/**
 * CanAI Codex v6.1.4 - Verify Airtable Connection
 * 
 * What: Test basic Airtable connection and list available tables
 * Why: Diagnose connection issues before attempting table operations
 * How: Simple connection test with error handling
 */

import Airtable from 'airtable';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🎯 CanAI - Airtable Connection Verification');
console.log('==========================================');

// Check environment variables
console.log('🔍 Checking environment variables...');
console.log(`API Key: ${process.env.AIRTABLE_API_KEY ? '✅ Present' : '❌ Missing'}`);
console.log(`Base ID: ${process.env.AIRTABLE_BASE_ID ? '✅ Present' : '❌ Missing'}`);

if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
  console.log('\n❌ Missing required environment variables!');
  console.log('Please ensure AIRTABLE_API_KEY and AIRTABLE_BASE_ID are set in your .env file');
  process.exit(1);
}

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID!);

/**
 * Test connection by trying to access a simple table
 */
async function testConnection(): Promise<void> {
  try {
    console.log('\n🚀 Testing Airtable connection...');
    
    // Try to list records from the first table in our definitions
    console.log('📝 Attempting to connect to PromptLogs table...');
    
    const records = await base('PromptLogs').select({
      maxRecords: 1,
      view: 'Grid view'
    }).firstPage();
    
    console.log(`✅ Connection successful! Found ${records.length} records in PromptLogs`);
    
    if (records.length > 0) {
      console.log('📋 Sample record fields:', Object.keys(records[0].fields));
    }
    
  } catch (error) {
    console.log('❌ Connection failed!');
    
    if (error instanceof Error) {
      console.log(`Error: ${error.message}`);
      
      // Provide specific guidance based on error type
      if (error.message.includes('Could not find what you are looking for')) {
        console.log('\n💡 This error usually means:');
        console.log('   - The table name "PromptLogs" doesn\'t exist in your base');
        console.log('   - The base ID is incorrect');
        console.log('   - The API key doesn\'t have access to this base');
      } else if (error.message.includes('Unauthorized')) {
        console.log('\n💡 This error usually means:');
        console.log('   - The API key is invalid or expired');
        console.log('   - The API key doesn\'t have permission to access this base');
      }
    } else {
      console.log('Unknown error:', error);
    }
  }
}

/**
 * Try to test with a simple table creation/deletion
 */
async function testBasicOperations(): Promise<void> {
  try {
    console.log('\n🧪 Testing basic table operations...');
    
    // Try to create a simple test record
    const testRecord = await base('PromptLogs').create([{
      fields: {
        recordId: 'connection-test',
        sessionId: 'test-session',
        userId: 'test-user',
        promptType: 'ai_blueprint',
        intent: 'Connection test',
        inputs: 'Test input',
        outputs: 'Test output'
      }
    }]);
    
    console.log('✅ Record creation successful!');
    
    // Clean up the test record
    if (testRecord && testRecord.length > 0) {
      await base('PromptLogs').destroy([testRecord[0].id]);
      console.log('🧹 Test record cleaned up');
    }
    
    console.log('\n🎉 All basic operations working correctly!');
    
  } catch (error) {
    console.log('❌ Basic operations failed!');
    if (error instanceof Error) {
      console.log(`Error: ${error.message}`);
    }
  }
}

// Run the tests
async function main() {
  await testConnection();
  await testBasicOperations();
  
  console.log('\n🎯 Connection verification completed!');
}

if (require.main === module) {
  main().catch(console.error);
} 