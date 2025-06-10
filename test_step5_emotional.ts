/**
 * Step 5 Emotional Intelligence Test Suite
 * Testing Tests 6 and 7 from ai_blueprint_sparksplit_tests.txt
 * 
 * Purpose: Validate emotional intelligence and fallback mechanisms
 * Expected: Test 6 and Test 7 status change from [Pending] to [Completed]
 */

// Load environment variables
require('dotenv').config();

import { generateAIBlueprint, applyMCPEnhancers } from './prompts/ai_blueprint.mcp';

/**
 * Validates emotional compass thresholds
 */
function validateEmotionalCompass(session: any): { valid: boolean; details: any } {
  // Check both emotionalCompass and emotionalContext for compass data
  const emotionalCompass = session.emotionalCompass || session.emotionalContext?.emotionalCompass;
  const empathyMetrics = session.empathyMetrics;
  
  const thresholds = {
    awe: 80.0,
    ownership: 90.0,
    wonder: 75.0,
    calm: 80.0,
    power: 85.0,
    overall: 85.0
  };
  
  const results = {
    awe: (emotionalCompass?.awe || 0) >= thresholds.awe,
    ownership: (emotionalCompass?.ownership || 0) >= thresholds.ownership,
    wonder: (emotionalCompass?.wonder || 0) >= thresholds.wonder,
    calm: (emotionalCompass?.calm || 0) >= thresholds.calm,
    power: (emotionalCompass?.power || 0) >= thresholds.power,
    overall: (emotionalCompass?.overall || 0) >= thresholds.overall,
    resonance: (empathyMetrics?.emotionalResonance || 0) >= 0.85
  };
  
  const allValid = Object.values(results).every(v => v);
  
  return {
    valid: allValid,
    details: {
      results,
      actual: {
        awe: emotionalCompass?.awe,
        ownership: emotionalCompass?.ownership,
        wonder: emotionalCompass?.wonder,
        calm: emotionalCompass?.calm,
        power: emotionalCompass?.power,
        overall: emotionalCompass?.overall,
        resonance: empathyMetrics?.emotionalResonance
      },
      thresholds
    }
  };
}

/**
 * Test 6: Emotional Intelligence
 */
async function runTest6() {
  console.log('\n🧠 Test 6: Emotional Intelligence');
  console.log('='.repeat(50));
  
  const input = {
    primaryGoal: "Automate support for TechCo AI"
  };
  
  console.log('📥 Input:', JSON.stringify(input, null, 2));
  
  try {
    const startTime = Date.now();
    
    // First, enhance the input to meet the full schema requirements
    const enhancedInput = await applyMCPEnhancers(input);
    const result = await generateAIBlueprint(enhancedInput);
    const endTime = Date.now();
    
    console.log(`⏱️  Execution time: ${endTime - startTime}ms`);
    
    // Validate emotional compass
    const validation = validateEmotionalCompass(result);
    
    // Validate trust score
    const trustScore = result.metadata?.trustScore || 0;
    const trustValid = trustScore >= 4.2;
    
    console.log('\n📊 Validation Results:');
    console.log('Emotional Compass Validation:', validation.valid ? '✅ PASS' : '❌ FAIL');
    console.log('Trust Score Validation:', trustValid ? '✅ PASS' : '❌ FAIL', `(${trustScore}/5.0)`);
    
    if (!validation.valid) {
      console.log('\n🔍 Detailed Emotional Analysis:');
      console.log('Expected vs Actual:');
      Object.keys(validation.details.thresholds).forEach(key => {
        const expected = validation.details.thresholds[key];
        const actual = validation.details.actual[key];
        const status = actual >= expected ? '✅' : '❌';
        console.log(`  ${key}: ${status} ${actual}% (need ${expected}%)`);
      });
    }
    
    const test6Pass = validation.valid && trustValid;
    console.log('\n🎯 Test 6 Result:', test6Pass ? '✅ COMPLETED' : '❌ FAILED');
    
    return {
      pass: test6Pass,
      result,
      validation,
      trustScore,
      executionTime: endTime - startTime
    };
    
  } catch (error) {
    console.error('❌ Test 6 Error:', error.message);
    return {
      pass: false,
      error: error.message
    };
  }
}

/**
 * Test 7: Emotional Fallback
 */
async function runTest7() {
  console.log('\n🔄 Test 7: Emotional Fallback');
  console.log('='.repeat(50));
  
  const input = {
    primaryGoal: "Automate support for TechCo AI",
    brandVoice: "invalid_tone"
  };
  
  console.log('📥 Input:', JSON.stringify(input, null, 2));
  
  try {
    const startTime = Date.now();
    
    // First, enhance the input to meet the full schema requirements
    const enhancedInput = await applyMCPEnhancers(input);
    const result = await generateAIBlueprint(enhancedInput);
    const endTime = Date.now();
    
    console.log(`⏱️  Execution time: ${endTime - startTime}ms`);
    
    // Validate fallback behavior
    const brandVoiceFallback = enhancedInput.brandVoice === 'strategic';
    const emotionalResonance = result.empathyMetrics?.emotionalResonance || 0;
    const overallEmotional = result.emotionalCompass?.overall || result.emotionalContext?.emotionalCompass?.overall || 0;
    
    const resonanceValid = emotionalResonance >= 0.82;
    const overallValid = overallEmotional >= 0.84;
    
    console.log('\n📊 Validation Results:');
    console.log('Brand Voice Fallback:', brandVoiceFallback ? '✅ PASS' : '❌ FAIL', `(${enhancedInput.brandVoice})`);
    console.log('Emotional Resonance:', resonanceValid ? '✅ PASS' : '❌ FAIL', `(${emotionalResonance})`);
    console.log('Overall Emotional Score:', overallValid ? '✅ PASS' : '❌ FAIL', `(${overallEmotional})`);
    
    const test7Pass = brandVoiceFallback && resonanceValid && overallValid;
    console.log('\n🎯 Test 7 Result:', test7Pass ? '✅ COMPLETED' : '❌ FAILED');
    
    return {
      pass: test7Pass,
      result,
      brandVoiceFallback,
      emotionalResonance,
      overallEmotional,
      executionTime: endTime - startTime
    };
    
  } catch (error) {
    console.error('❌ Test 7 Error:', error.message);
    return {
      pass: false,
      error: error.message
    };
  }
}

/**
 * Main test execution
 */
async function runStep5Tests() {
  console.log('🚀 Step 5 Emotional Intelligence Test Suite');
  console.log('='.repeat(60));
  console.log('Purpose: Resolve Emotional Intelligence failure');
  console.log('Goal: Change Test 6 and Test 7 status from [Pending] to [Completed]');
  
  const results = {
    test6: await runTest6(),
    test7: await runTest7()
  };
  
  console.log('\n📋 Final Summary');
  console.log('='.repeat(40));
  console.log('Test 6 (Emotional Intelligence):', results.test6.pass ? '✅ COMPLETED' : '❌ FAILED');
  console.log('Test 7 (Emotional Fallback):', results.test7.pass ? '✅ COMPLETED' : '❌ FAILED');
  
  const overallPass = results.test6.pass && results.test7.pass;
  console.log('\n🎯 Step 5 Overall Result:', overallPass ? '✅ SUCCESS' : '❌ NEEDS ATTENTION');
  
  if (overallPass) {
    console.log('\n🎉 Ready to update test status in ai_blueprint_sparksplit_tests.txt');
    console.log('   - Test 6: [Pending] → [Completed]');
    console.log('   - Test 7: [Pending] → [Completed]');
  } else {
    console.log('\n🔧 Investigation needed for failed tests');
    if (!results.test6.pass) {
      console.log('   - Test 6: Check emotional compass implementation in generateAIBlueprint');
    }
    if (!results.test7.pass) {
      console.log('   - Test 7: Check brandVoice fallback logic');
    }
  }
  
  return results;
}

// Execute if run directly
if (require.main === module) {
  runStep5Tests().catch(console.error);
}

export { runStep5Tests, runTest6, runTest7, validateEmotionalCompass }; 