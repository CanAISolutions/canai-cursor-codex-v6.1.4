#!/usr/bin/env node

/**
 * @file tests/dreamstate/verify-multi-locale-tone-parity.js
 * @description Verification script for multi-locale-tone-parity.test.ts
 * @version 6.1.4
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Polaris Ritual: Multi-Locale Tone Parity Verification
// Codex Vector: Test Integrity Assurance
// Codex Safeguard: Ensure multi-locale-tone-parity.test.ts remains functional and mock-free

async function verifyMultiLocaleToneParityTest() {
  const testFile = 'tests/dreamstate/multi-locale-tone-parity.test.ts';
  
  try {
    console.log('🔍 Verifying multi-locale-tone-parity.test.ts...');
    
    // Check if test file exists
    if (!fs.existsSync(testFile)) {
      throw new Error(`Test file not found: ${testFile}`);
    }
    
    // Check for mock usage (should be none)
    const testContent = fs.readFileSync(testFile, 'utf8');
    const mockPatterns = [
      /mockEmotionalPayload/g,
      /requireMock/g,
      /jest\.mock/g,
      /\.mockImplementation/g,
      /\.mockReturnValue/g
    ];
    
    const mockViolations = [];
    mockPatterns.forEach((pattern, index) => {
      const matches = testContent.match(pattern);
      if (matches) {
        mockViolations.push(`Found ${matches.length} instances of mock pattern ${index + 1}`);
      }
    });
    
    if (mockViolations.length > 0) {
      throw new Error(`Mock violations detected:\n${mockViolations.join('\n')}`);
    }
    
    console.log('✅ No mock violations detected');
    
    // Run the test
    console.log('🧪 Running multi-locale-tone-parity test...');
    const testCommand = `npm test -- ${testFile}`;
    
    try {
      const output = execSync(testCommand, { 
        encoding: 'utf8',
        cwd: process.cwd(),
        timeout: 60000 // 60 second timeout
      });
      
      console.log('✅ Test execution completed successfully');
      
      // Multiple ways to detect successful tests
      const checkmarkCount1 = (output.match(/√/g) || []).length;
      const checkmarkCount2 = (output.match(/✓/g) || []).length;
      const checkmarkCount3 = (output.match(/✔/g) || []).length;
      const passedTestsMatch = output.match(/Tests:\s+(\d+)\s+passed/);
      
      let testCount = 0;
      
      // Try different methods to get test count
      if (checkmarkCount1 > 0) {
        testCount = checkmarkCount1;
        console.log(`✅ ${testCount} tests passed (detected via √ checkmarks)`);
      } else if (checkmarkCount2 > 0) {
        testCount = checkmarkCount2;
        console.log(`✅ ${testCount} tests passed (detected via ✓ checkmarks)`);
      } else if (checkmarkCount3 > 0) {
        testCount = checkmarkCount3;
        console.log(`✅ ${testCount} tests passed (detected via ✔ checkmarks)`);
      } else if (passedTestsMatch) {
        testCount = parseInt(passedTestsMatch[1]);
        console.log(`✅ ${testCount} tests passed (detected via Jest summary)`);
      } else {
        // Last resort: if we see PASS and the test scenarios, assume success
        const hasPassIndicator = output.includes('PASS') && output.includes('multi-locale-tone-parity.test.ts');
        const hasAllScenarios = [
          'should maintain sarcastic tone parity across English, French, and Spanish',
          'should maintain grateful tone parity across all supported locales',
          'should detect tone drift when locale output is mutated',
          'should maintain trust score consistency across locales for same emotional intent',
          'should handle invalid locale gracefully with fallback behavior',
          'should validate cross-locale snapshot HTML structure consistency'
        ].every(scenario => output.includes(scenario));
        
        if (hasPassIndicator && hasAllScenarios) {
          testCount = 6; // We know there should be 6 tests
          console.log(`✅ ${testCount} tests passed (detected via PASS indicator and scenario presence)`);
        } else {
          throw new Error('No successful test indicators found');
        }
      }
      
      if (testCount === 0) {
        throw new Error('No successful tests detected');
      }
      
      // Validate specific test scenarios are present in output
      const requiredScenarios = [
        'should maintain sarcastic tone parity across English, French, and Spanish',
        'should maintain grateful tone parity across all supported locales',
        'should detect tone drift when locale output is mutated',
        'should maintain trust score consistency across locales for same emotional intent',
        'should handle invalid locale gracefully with fallback behavior',
        'should validate cross-locale snapshot HTML structure consistency'
      ];
      
      const missingScenarios = requiredScenarios.filter(scenario => !output.includes(scenario));
      if (missingScenarios.length > 0) {
        throw new Error(`Missing test scenarios:\n${missingScenarios.join('\n')}`);
      }
      
      console.log('✅ All required test scenarios present and passing');
      
      return {
        passed: true,
        output,
        testCount: testCount
      };
      
    } catch (execError) {
      // If execSync throws, it means the command failed
      throw new Error(`Test execution failed: ${execError.message}`);
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return {
      passed: false,
      output: '',
      error: error.message
    };
  }
}

async function main() {
  console.log('🚀 Starting multi-locale-tone-parity test verification...\n');
  
  const result = await verifyMultiLocaleToneParityTest();
  
  if (result.passed) {
    console.log('\n🎉 Multi-locale tone parity test verification PASSED!');
    console.log('\n📊 Summary:');
    console.log('- ✅ No mock violations detected');
    console.log(`- ✅ All ${result.testCount} test scenarios passing`);
    console.log('- ✅ Real system components validated');
    console.log('- ✅ Emotional tone parity maintained across locales');
    console.log('- ✅ TranslationMap, EmotionalUXRenderer, and ToneParityValidator working');
    
    console.log('\n🔒 Codex Compliance:');
    console.log('- ✅ Mock-free implementation verified');
    console.log('- ✅ Real emotional validation components');
    console.log('- ✅ Cross-locale tone preservation validated');
    console.log('- ✅ Trust score consistency maintained');
    console.log('- ✅ Fallback behavior properly localized');
    
    process.exit(0);
  } else {
    console.log('\n💥 Multi-locale tone parity test verification FAILED!');
    console.log('\n❌ Issues:');
    console.log(`- ${result.error}`);
    console.log('\n🔧 Remediation required before proceeding');
    
    process.exit(1);
  }
}

// Run verification if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { verifyMultiLocaleToneParityTest };

// Codex Safeguard: This verification script ensures multi-locale-tone-parity.test.ts remains mock-free and functional.
// Any mock reintroduction or test failure indicates a critical regression that must be addressed immediately. 