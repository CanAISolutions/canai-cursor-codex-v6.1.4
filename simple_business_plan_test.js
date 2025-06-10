/**
 * simple_business_plan_test.js
 * Simple test to validate Business Plan MCP V4 functionality
 */

const { testBusinessPlanMCP } = require('./prompts/business-plan.mcp.ts');

async function runSimpleTest() {
  console.log('🚀 Testing Business Plan MCP V4 Functionality...\n');

  try {
    // Test 1: Basic functionality with minimal input
    console.log('📝 Test 1: Basic Functionality');
    const basicInput = {
      industry: 'saas',
      goal: 'Launch a SaaS platform for small business automation',
      tone: 'professional'
    };

    const basicResult = await testBusinessPlanMCP(basicInput);
    console.log('✅ Basic test result:', basicResult.success ? 'PASSED' : 'FAILED');
    if (basicResult.success) {
      console.log('   Enhanced fields:', basicResult.data.enhancementSummary?.enhancedFields?.join(', ') || 'None');
    } else {
      console.log('   Error:', basicResult.error);
    }

    // Test 2: Enhanced input with emotional context
    console.log('\n💝 Test 2: Emotional Intelligence');
    const emotionalInput = {
      industry: 'healthcare',
      goal: 'Transform patient care through technology',
      tone: 'empathetic',
      businessName: 'CareConnect',
      targetMarket: 'Healthcare providers',
      emotionalContext: {
        personalStory: 'Witnessed healthcare challenges firsthand',
        motivator: 'Improve patient outcomes'
      }
    };

    const emotionalResult = await testBusinessPlanMCP(emotionalInput);
    console.log('✅ Emotional test result:', emotionalResult.success ? 'PASSED' : 'FAILED');
    if (emotionalResult.success) {
      console.log('   Enhanced fields:', emotionalResult.data.enhancementSummary?.enhancedFields?.join(', ') || 'None');
    } else {
      console.log('   Error:', emotionalResult.error);
    }

    // Test 3: Field inference validation
    console.log('\n🧠 Test 3: Field Inference');
    const minimalInput = {
      industry: 'fintech',
      goal: 'Create mobile payment solution for underbanked communities',
      tone: 'inspiring'
    };

    const inferenceResult = await testBusinessPlanMCP(minimalInput);
    console.log('✅ Inference test result:', inferenceResult.success ? 'PASSED' : 'FAILED');
    if (inferenceResult.success) {
      const enhanced = inferenceResult.data.enhancementSummary;
      console.log('   Original fields:', Object.keys(enhanced.originalInput).length);
      console.log('   Enhanced fields:', Object.keys(enhanced.enhancedInput).length);
      console.log('   Inferred fields:', enhanced.enhancedFields?.join(', ') || 'None');
    } else {
      console.log('   Error:', inferenceResult.error);
    }

    console.log('\n📊 Test Summary:');
    const tests = [basicResult, emotionalResult, inferenceResult];
    const passed = tests.filter(t => t.success).length;
    const total = tests.length;
    console.log(`✅ Passed: ${passed}/${total}`);
    console.log(`📈 Success Rate: ${((passed / total) * 100).toFixed(1)}%`);

    if (passed === total) {
      console.log('\n🎉 All tests passed! Business Plan MCP V4 is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Check the errors above.');
    }

  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
  }
}

// Run the test
runSimpleTest().catch(console.error); 