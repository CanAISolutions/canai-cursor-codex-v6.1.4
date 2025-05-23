#!/usr/bin/env node
"use strict";
/**
 * @file tests/dreamstate/verify-multi-locale-tone-parity.ts
 * @description Verification script for multi-locale-tone-parity.test.ts
 * @version 6.1.4
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyMultiLocaleToneParityTest = verifyMultiLocaleToneParityTest;
const child_process_1 = require("child_process");
const fs = require("fs");
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
        const testCommand = `npx jest ${testFile} --no-cache --verbose --coverage`;
        const output = (0, child_process_1.execSync)(testCommand, {
            encoding: 'utf8',
            cwd: process.cwd(),
            timeout: 30000 // 30 second timeout
        });
        console.log('✅ Test execution completed successfully');
        // Parse coverage information
        const coverageMatch = output.match(/All files\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)/);
        let coverage;
        if (coverageMatch) {
            coverage = {
                statements: parseFloat(coverageMatch[1]),
                branches: parseFloat(coverageMatch[2]),
                functions: parseFloat(coverageMatch[3]),
                lines: parseFloat(coverageMatch[4])
            };
        }
        // Check for test pass indicators
        const passedTests = output.match(/Tests:\s+(\d+) passed/);
        const failedTests = output.match(/(\d+) failed/);
        if (failedTests && parseInt(failedTests[1]) > 0) {
            throw new Error(`${failedTests[1]} tests failed`);
        }
        if (!passedTests || parseInt(passedTests[1]) === 0) {
            throw new Error('No tests passed');
        }
        console.log(`✅ ${passedTests[1]} tests passed`);
        // Validate specific test scenarios
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
            coverage
        };
    }
    catch (error) {
        console.error('❌ Verification failed:', error instanceof Error ? error.message : String(error));
        return {
            passed: false,
            output: '',
            error: error instanceof Error ? error.message : String(error)
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
        console.log('- ✅ All test scenarios passing');
        console.log('- ✅ Real system components validated');
        console.log('- ✅ Emotional tone parity maintained across locales');
        if (result.coverage) {
            console.log('\n📈 Coverage:');
            console.log(`- Statements: ${result.coverage.statements}%`);
            console.log(`- Branches: ${result.coverage.branches}%`);
            console.log(`- Functions: ${result.coverage.functions}%`);
            console.log(`- Lines: ${result.coverage.lines}%`);
        }
        process.exit(0);
    }
    else {
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
// Codex Safeguard: This verification script ensures multi-locale-tone-parity.test.ts remains mock-free and functional.
// Any mock reintroduction or test failure indicates a critical regression that must be addressed immediately. 
