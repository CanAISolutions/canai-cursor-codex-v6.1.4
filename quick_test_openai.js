/**
 * Quick OpenAI API Connection Test
 * 
 * This script quickly tests the OpenAI API connection before running the full AI Blueprint test
 * 
 * Date: 2025-01-30
 * Version: Quick API Test
 */

require('dotenv').config();

async function quickOpenAITest() {
  console.log('⚡ Quick OpenAI API Connection Test');
  console.log('===================================');
  
  // Check for API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ ERROR: OPENAI_API_KEY environment variable not set');
    console.log('');
    console.log('Run the setup first: node setup_openai_test.js');
    console.log('');
    process.exit(1);
  }
  
  console.log('✅ OpenAI API key found');
  
  try {
    // Import OpenAI
    const { OpenAI } = require('openai');
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    console.log('🔄 Testing OpenAI API connection...');
    
    const startTime = Date.now();
    
    // Make a simple API call
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that confirms API connectivity.'
        },
        {
          role: 'user',
          content: 'Please respond with a simple confirmation that the OpenAI API is working. Keep it brief.'
        }
      ],
      max_tokens: 50
    });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    console.log('✅ OpenAI API connection successful!');
    console.log(`⚡ Response time: ${responseTime}ms`);
    console.log(`📝 Response: ${response.choices[0]?.message?.content || 'No content'}`);
    console.log(`🔢 Tokens used: ${response.usage?.total_tokens || 'Unknown'}`);
    console.log('');
    console.log('🎉 Ready to run the full AI Blueprint test!');
    console.log('');
    console.log('Next step: node test_ai_blueprint_openai_real_api.js');
    console.log('(or: npx tsx test_ai_blueprint_openai_real_api.js)');
    
  } catch (error) {
    console.error('❌ OpenAI API test failed:', error.message);
    console.log('');
    
    if (error.message.includes('API key')) {
      console.log('🔍 Issue: Invalid API key');
      console.log('   Fix: Check that your API key is correct in the .env file');
      console.log('   Get a new key from: https://platform.openai.com/api-keys');
    } else if (error.message.includes('rate limit')) {
      console.log('🔍 Issue: Rate limit exceeded');
      console.log('   Fix: Wait a moment and try again');
    } else if (error.message.includes('quota')) {
      console.log('🔍 Issue: API quota exceeded');
      console.log('   Fix: Check your OpenAI account billing and usage');
    } else if (error.message.includes('timeout')) {
      console.log('🔍 Issue: Request timeout');
      console.log('   Fix: Check your internet connection');
    } else {
      console.log('🔍 Issue: Unknown error');
      console.log('   Details:', error.message);
    }
    
    process.exit(1);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  quickOpenAITest().catch(console.error);
}

module.exports = { quickOpenAITest }; 