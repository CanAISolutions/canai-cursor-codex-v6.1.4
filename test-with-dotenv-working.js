/**
 * AI Blueprint Test with Proper .env Loading
 * This fixes the environment variable loading issue
 */

// ✅ CRITICAL: Load .env file BEFORE importing anything else
require('dotenv').config();

const { OpenAI } = require('openai');
const fs = require('fs');

console.log('🔧 Environment Check:');
console.log(`📁 Current directory: ${process.cwd()}`);
console.log(`🗂️  .env file exists: ${fs.existsSync('.env') ? 'YES' : 'NO'}`);

// Check if the API key is loaded
const apiKey = process.env.OPENAI_API_KEY;
if (apiKey) {
  console.log(`🔑 API key loaded: ${apiKey.substring(0, 7)}...${apiKey.slice(-4)}`);
} else {
  console.log('❌ No API key found in environment');
  process.exit(1);
}

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: apiKey,
});

async function testAIBlueprint() {
  console.log('\n🧪 Starting AI Blueprint Test...\n');
  
  try {
    console.log('🔍 Step 1: Testing API connectivity...');
    const testResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: 'Hello!' }],
      max_tokens: 10
    });
    
    console.log('✅ API connection successful!');
    console.log(`🆔 Test Request ID: ${testResponse.id}`);
    console.log(`📊 Test Model: ${testResponse.model}`);
    
    console.log('\n🚀 Step 2: Generating AI Blueprint...');
    
    const input = {
      businessName: "TechStartup AI",
      primaryGoal: "Build AI-powered customer support chatbot",
      aiSolution: "Natural language processing chatbot with sentiment analysis",
      targetAudience: "SaaS companies and customer service teams"
    };
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an AI strategy expert. Create comprehensive AI implementation blueprints.'
        },
        {
          role: 'user',
          content: `Create an AI Blueprint for ${input.businessName}.

Business: ${input.businessName}
Goal: ${input.primaryGoal}
Solution: ${input.aiSolution}
Target Audience: ${input.targetAudience}

Please provide:
1. Technical Architecture
2. Implementation Recommendations
3. Project Timeline
4. Potential Risks

Keep it practical and actionable.`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const result = response.choices[0].message.content;
    
    console.log('✅ AI Blueprint generated successfully!');
    console.log(`🆔 Request ID: ${response.id}`);
    console.log(`📏 Response length: ${result.length} characters`);
    console.log(`💰 Tokens used: ${response.usage?.total_tokens || 'N/A'}`);
    console.log(`⏱️  Model: ${response.model}`);
    
    // Save the result
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `ai-blueprint-result-${timestamp}.json`;
    
    const fullResult = {
      success: true,
      timestamp: new Date().toISOString(),
      input: input,
      output: result,
      metadata: {
        requestId: response.id,
        model: response.model,
        tokensUsed: response.usage?.total_tokens,
        responseLength: result.length
      }
    };
    
    fs.writeFileSync(filename, JSON.stringify(fullResult, null, 2));
    
    console.log('\n🎉 SUCCESS! Your .env setup is working perfectly!');
    console.log(`📄 Full results saved to: ${filename}`);
    console.log('\n📋 Summary:');
    console.log('✅ .env file loading: WORKING');
    console.log('✅ OpenAI API connection: WORKING');
    console.log('✅ AI Blueprint generation: WORKING');
    
    console.log('\n🎯 Next Steps:');
    console.log('1. Your environment setup is correct');
    console.log('2. You can now run any of the test scripts');
    console.log('3. The original test scripts should work with your .env file');
    
    return fullResult;
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    
    if (error.code === 'invalid_api_key') {
      console.log('🔧 API key issue detected');
      console.log('💡 Try regenerating your OpenAI API key');
    } else if (error.code === 'insufficient_quota') {
      console.log('💳 Quota issue detected');
      console.log('💡 Check your OpenAI account billing');
    }
    
    throw error;
  }
}

// Run the test
if (require.main === module) {
  testAIBlueprint()
    .then(() => {
      console.log('\n🏆 All tests passed!');
      process.exit(0);
    })
    .catch((error) => {
      console.log('\n💥 Test failed!');
      process.exit(1);
    });
} 