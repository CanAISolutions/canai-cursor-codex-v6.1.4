/**
 * Simple Test for AI Blueprint Step 3 - Field Inference Enhancement
 * 
 * Validates the enhanced field inference logic implemented in Step 3
 * Tests minimal, partial, and complete input scenarios
 * 
 * Date: June 09, 2025, 09:34 AM MDT
 * Version: V4 Schema Compliance Test (JavaScript)
 */

async function runInferenceTests() {
  console.log('🚀 Starting AI Blueprint Step 3 Inference Tests');
  console.log('=========================================================');

  try {
    // Dynamically import the function
    const { applyMCPEnhancers } = await import('./prompts/ai_blueprint.mcp.js');

    // Test Case 1: Minimal Input
    const testCase1 = {
      primaryGoal: "Build AI chatbot for customer support"
    };

    console.log('\n📋 Test Case 1: Minimal Input Enhancement');
    console.log('Input:', JSON.stringify(testCase1, null, 2));
    
    const enhanced1 = await applyMCPEnhancers(testCase1);
    console.log('Enhanced Output:', JSON.stringify(enhanced1, null, 2));

    // Test Case 2: Partial Input
    const testCase2 = {
      businessName: "TechFlow Analytics",
      primaryGoal: "Implement predictive analytics for sales forecasting", 
      competitiveContext: "Advanced ML vs Excel-based forecasting"
    };

    console.log('\n📋 Test Case 2: Partial Input Enhancement');
    console.log('Input:', JSON.stringify(testCase2, null, 2));
    
    const enhanced2 = await applyMCPEnhancers(testCase2);
    console.log('Enhanced Output:', JSON.stringify(enhanced2, null, 2));

    // Test Case 3: Complete Input - All fields provided (validation test)
    const testCase3 = {
      businessName: "HealthTech Innovations",
      targetAudience: "Healthcare providers and medical staff",
      primaryGoal: "Develop AI diagnosis assistant for medical imaging",
      competitiveContext: "Proprietary deep learning vs generic image analysis",
      brandVoice: "professional",
      resourceConstraints: "$50K budget, 6-month timeline, compliance requirements",
      currentStatus: "Manual radiology review processes",
      aiSolution: "Computer vision AI for medical image analysis",
      mvpFeatures: "X-ray analysis, anomaly detection, compliance reporting",
      successMetrics: "30d: Algorithm training; 60d: Clinical validation; 90d: FDA submission",
      linkedPrompts: ["business-plan", "site-audit"],
      minimumViableExecution: "Use TensorFlow for deep learning, DICOM integration"
    };

    console.log('\n📋 Test Case 3: Complete Input Validation');
    console.log('Input:', JSON.stringify(testCase3, null, 2));
    
    const enhanced3 = await applyMCPEnhancers(testCase3);
    console.log('Enhanced Output:', JSON.stringify(enhanced3, null, 2));

    // Validate that all 12 required fields are present
    const requiredFields = ['businessName', 'targetAudience', 'primaryGoal', 'competitiveContext', 'brandVoice', 'resourceConstraints', 'currentStatus', 'aiSolution', 'mvpFeatures', 'successMetrics', 'linkedPrompts', 'minimumViableExecution'];
    
    let missingFields1 = [];
    requiredFields.forEach(field => {
      if (!enhanced1[field]) {
        missingFields1.push(field);
      }
    });

    console.log(`✅ Test Case 1 Fields Check: ${missingFields1.length === 0 ? 'ALL FIELDS PRESENT' : 'MISSING: ' + missingFields1.join(', ')}`);

    let missingFields2 = [];
    requiredFields.forEach(field => {
      if (!enhanced2[field]) {
        missingFields2.push(field);
      }
    });

    console.log(`✅ Test Case 2 Fields Check: ${missingFields2.length === 0 ? 'ALL FIELDS PRESENT' : 'MISSING: ' + missingFields2.join(', ')}`);
    
    // Verify original fields are preserved
    const originalPreserved = enhanced2.businessName === testCase2.businessName &&
                             enhanced2.primaryGoal === testCase2.primaryGoal &&
                             enhanced2.competitiveContext === testCase2.competitiveContext;
    
    console.log(`✅ Test Case 2 Preservation: ${originalPreserved ? 'ORIGINAL FIELDS PRESERVED' : 'ORIGINAL FIELDS MODIFIED'}`);

    let missingFields3 = [];
    requiredFields.forEach(field => {
      if (!enhanced3[field]) {
        missingFields3.push(field);
      }
    });

    console.log(`✅ Test Case 3 Fields Check: ${missingFields3.length === 0 ? 'ALL FIELDS PRESENT' : 'MISSING: ' + missingFields3.join(', ')}`);

    // Check if all original fields are exactly preserved
    let modifiedFields = [];
    Object.keys(testCase3).forEach(field => {
      if (field === 'linkedPrompts') {
        // Array comparison
        if (JSON.stringify(enhanced3[field]) !== JSON.stringify(testCase3[field])) {
          modifiedFields.push(field);
        }
      } else {
        if (enhanced3[field] !== testCase3[field]) {
          modifiedFields.push(field);
        }
      }
    });

    console.log(`✅ Test Case 3 Preservation: ${modifiedFields.length === 0 ? 'ALL FIELDS PRESERVED' : 'MODIFIED: ' + modifiedFields.join(', ')}`);

    // Summary
    console.log('\n🎯 STEP 3 INFERENCE TEST SUMMARY');
    console.log('=====================================');
    console.log(`✅ Test Case 1 (Minimal): ${missingFields1.length === 0 ? 'PASSED' : 'FAILED'}`);
    console.log(`✅ Test Case 2 (Partial): ${missingFields2.length === 0 && originalPreserved ? 'PASSED' : 'FAILED'}`);
    console.log(`✅ Test Case 3 (Complete): ${missingFields3.length === 0 && modifiedFields.length === 0 ? 'PASSED' : 'FAILED'}`);
    
    const avgResponseTime = Math.round((Date.now() - startTime1 + Date.now() - startTime2 + Date.now() - startTime3) / 3);
    console.log(`⚡ Average Response Time: ${avgResponseTime}ms`);

    const allPassed = missingFields1.length === 0 && 
                     missingFields2.length === 0 && originalPreserved &&
                     missingFields3.length === 0 && modifiedFields.length === 0;

    if (allPassed) {
      console.log('\n🎉 ALL STEP 3 INFERENCE TESTS PASSED - READY FOR STEP 4');
    } else {
      console.log('\n⚠️  SOME TESTS HAD ISSUES - REVIEW RESULTS ABOVE');
    }

    // Save test results to file
    const testResults = {
      timestamp: new Date().toISOString(),
      testCase1: {
        input: testCase1,
        output: enhanced1,
        responseTime: Date.now() - startTime1,
        missingFields: missingFields1,
        passed: missingFields1.length === 0
      },
      testCase2: {
        input: testCase2,
        output: enhanced2,
        responseTime: Date.now() - startTime2,
        missingFields: missingFields2,
        originalPreserved: originalPreserved,
        passed: missingFields2.length === 0 && originalPreserved
      },
      testCase3: {
        input: testCase3,
        output: enhanced3,
        responseTime: Date.now() - startTime3,
        missingFields: missingFields3,
        modifiedFields: modifiedFields,
        passed: missingFields3.length === 0 && modifiedFields.length === 0
      },
      summary: {
        allPassed: allPassed,
        averageResponseTime: avgResponseTime
      }
    };

    const fs = require('fs');
    fs.writeFileSync('ai_blueprint_step3_test_results.json', JSON.stringify(testResults, null, 2));
    console.log('\n📄 Test results saved to: ai_blueprint_step3_test_results.json');

  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    
    // Try to identify the specific issue
    if (error.message.includes('applyMCPEnhancers')) {
      console.error('🔍 Issue: applyMCPEnhancers function not found. Check export in ai_blueprint.mcp.ts');
    } else if (error.message.includes('cannot resolve')) {
      console.error('🔍 Issue: Module path resolution. Check file paths and exports');
    }
    
    console.log('\n🔧 Debug Information:');
    console.log('- Ensure ai_blueprint.mcp.ts exports applyMCPEnhancers function');
    console.log('- Check that the file compiles without TypeScript errors');
    console.log('- Verify all dependencies are properly imported');
  }
}

// Run the tests
runInferenceTests().catch(console.error); 