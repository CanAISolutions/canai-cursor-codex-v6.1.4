/**
 * OpenAI API Test Template
 * This template includes proper .env loading for reliable environment variable access
 */

// ✅ CRITICAL: Load .env file FIRST before any other imports
require('dotenv').config();

const { OpenAI } = require('openai');
const fs = require('fs');

// Environment validation
console.log('🔧 Environment Check:');
console.log(`📁 Working directory: ${process.cwd()}`);
console.log(`🗂️  .env file exists: ${fs.existsSync('.env') ? 'YES' : 'NO'}`);

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    console.error('❌ OPENAI_API_KEY not found in environment variables');
    console.log('📝 Please ensure your .env file contains:');
    console.log('   OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_KEY_HERE');
    process.exit(1);
}

console.log(`🔑 API key loaded: ${apiKey.substring(0, 7)}...${apiKey.slice(-4)}`);

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: apiKey,
});

/**
 * Main test function
 */
async function runTest() {
    try {
        console.log('\n🧪 Starting OpenAI API Test...');
        
        // Test API connectivity
        const testResponse = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: 'Say "API connection successful"' }],
            max_tokens: 10
        });
        
        console.log('✅ API Connection Test Passed');
        console.log(`📊 Model: ${testResponse.model}`);
        
        // Add your specific test logic here
        // ...
        
        console.log('\n🎉 Test completed successfully!');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        
        if (error.status === 401) {
            console.log('🔑 This is usually an API key issue');
        } else if (error.status === 429) {
            console.log('⏰ Rate limit reached - try again in a few minutes');
        }
        
        process.exit(1);
    }
}

// Run the test
runTest(); 