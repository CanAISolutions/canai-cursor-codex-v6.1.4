#!/usr/bin/env ts-node

/**
 * 🛡️ DreamState Protection Guard
 * CRITICAL: Protects 100% test success rate achievement
 * Run this before any commits to validate DreamState integrity
 * 
 * Usage: npm run dreamstate:protect
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface ProtectionResult {
  success: boolean;
  passingTests: number;
  totalTests: number;
  passingSuites: number;
  totalSuites: number;
  snapshots: number;
  successRate: number;
  violations: string[];
  warnings: string[];
}

class DreamStateProtectionGuard {
  private readonly REQUIRED_SUCCESS_RATE = 100;
  private readonly REQUIRED_TEST_COUNT = 340;
  private readonly REQUIRED_SUITE_COUNT = 61;
  private readonly REQUIRED_SNAPSHOT_COUNT = 26;
  
  private readonly CRITICAL_FILES = [
    'tests/dreamstate/',
    'cursor/services/emotional-ux-renderer.ts',
    'cursor/services/trust-score-manager.ts',
    'cursor/services/fallback-manager.ts',
    'cursor/event-bus/eventBus.ts',
    'cursor/validators/cx-tone-sentinel.ts',
    'cursor/services/performance-monitor.ts',
    'cursor/utils/emotion-payload-builder.ts'
  ];

  async protect(): Promise<ProtectionResult> {
    console.log('🛡️ DreamState Protection Guard - Starting Validation');
    console.log('=' .repeat(60));
    
    const result: ProtectionResult = {
      success: true,
      passingTests: 0,
      totalTests: 0,
      passingSuites: 0,
      totalSuites: 0,
      snapshots: 0,
      successRate: 0,
      violations: [],
      warnings: []
    };

    try {
      // 1. Run DreamState test suite
      console.log('🧪 Running DreamState test suite...');
      const testResults = await this.runDreamStateTests();
      Object.assign(result, testResults);

      // 2. Validate critical metrics
      console.log('🔍 Validating critical metrics...');
      this.validateCriticalMetrics(result);

      // 3. Check for mock dependencies
      console.log('🚫 Scanning for mock dependencies...');
      this.checkMockDependencies(result);

      // 4. Validate critical file changes
      console.log('🔒 Checking critical file changes...');
      this.checkCriticalFileChanges(result);

      // 5. Validate TypeScript compilation
      console.log('🎯 Validating TypeScript compilation...');
      this.validateTypeScriptCompilation(result);

      // 6. Generate protection report
      console.log('📊 Generating protection report...');
      this.generateProtectionReport(result);

      if (result.violations.length === 0) {
        console.log('✅ ALL PROTECTIONS PASSED - DreamState 100% success rate PROTECTED');
        result.success = true;
      } else {
        console.log('❌ PROTECTION VIOLATIONS DETECTED');
        result.violations.forEach(violation => console.log(`  ❌ ${violation}`));
        result.success = false;
      }

      if (result.warnings.length > 0) {
        console.log('⚠️ WARNINGS:');
        result.warnings.forEach(warning => console.log(`  ⚠️ ${warning}`));
      }

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('💥 Protection guard failed:', error);
      result.success = false;
      result.violations.push(`Protection guard execution failed: ${errorMessage}`);
    }

    return result;
  }

  private async runDreamStateTests(): Promise<Partial<ProtectionResult>> {
    try {
      const output = execSync('npm test tests/dreamstate', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });

      // Parse test results with correct regex patterns based on actual output
      // Format: "Tests:       2 failed, 339 passed, 341 total"
      const testSummaryMatch = output.match(/Tests:\s+(\d+)\s+failed,\s+(\d+)\s+passed,\s+(\d+)\s+total/);
      // Format: "Test Suites: 1 failed, 60 passed, 61 total"
      const suiteSummaryMatch = output.match(/Test Suites:\s+(\d+)\s+failed,\s+(\d+)\s+passed,\s+(\d+)\s+total/);
      // Format: "Snapshots:   26 passed, 26 total"
      const snapshotSummaryMatch = output.match(/Snapshots:\s+(\d+)\s+passed,\s+(\d+)\s+total/);
      
      // Alternative patterns for when all tests pass
      const allTestsPassMatch = output.match(/Tests:\s+(\d+)\s+passed,\s+(\d+)\s+total/);
      const allSuitesPassMatch = output.match(/Test Suites:\s+(\d+)\s+passed,\s+(\d+)\s+total/);
      const allSnapshotsPassMatch = output.match(/Snapshots:\s+(\d+)\s+passed/);

      let passingTests = 0;
      let totalTests = 0;
      let passingSuites = 0;
      let totalSuites = 0;
      let snapshots = 0;

      // Parse test results
      if (testSummaryMatch) {
        passingTests = parseInt(testSummaryMatch[2]);
        totalTests = parseInt(testSummaryMatch[3]);
      } else if (allTestsPassMatch) {
        passingTests = parseInt(allTestsPassMatch[1]);
        totalTests = parseInt(allTestsPassMatch[2]);
      }

      // Parse suite results
      if (suiteSummaryMatch) {
        passingSuites = parseInt(suiteSummaryMatch[2]);
        totalSuites = parseInt(suiteSummaryMatch[3]);
      } else if (allSuitesPassMatch) {
        passingSuites = parseInt(allSuitesPassMatch[1]);
        totalSuites = parseInt(allSuitesPassMatch[2]);
      }

      // Parse snapshot results
      if (snapshotSummaryMatch) {
        snapshots = parseInt(snapshotSummaryMatch[1]);
      } else if (allSnapshotsPassMatch) {
        snapshots = parseInt(allSnapshotsPassMatch[1]);
      }

      const successRate = totalTests > 0 ? (passingTests / totalTests) * 100 : 0;

      console.log(`📊 Test Results:`);
      console.log(`  Tests: ${passingTests}/${totalTests} passed`);
      console.log(`  Suites: ${passingSuites}/${totalSuites} passed`);
      console.log(`  Snapshots: ${snapshots} passed`);
      console.log(`  Success Rate: ${successRate.toFixed(2)}%`);

      return {
        passingTests,
        totalTests,
        passingSuites,
        totalSuites,
        snapshots,
        successRate
      };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`DreamState test execution failed: ${errorMessage}`);
    }
  }

  private validateCriticalMetrics(result: ProtectionResult): void {
    // Check test count
    if (result.passingTests !== this.REQUIRED_TEST_COUNT) {
      result.violations.push(
        `Expected ${this.REQUIRED_TEST_COUNT} passing tests, got ${result.passingTests}`
      );
    }

    // Check suite count
    if (result.passingSuites !== this.REQUIRED_SUITE_COUNT) {
      result.violations.push(
        `Expected ${this.REQUIRED_SUITE_COUNT} passing suites, got ${result.passingSuites}`
      );
    }

    // Check snapshot count
    if (result.snapshots !== this.REQUIRED_SNAPSHOT_COUNT) {
      result.violations.push(
        `Expected ${this.REQUIRED_SNAPSHOT_COUNT} passing snapshots, got ${result.snapshots}`
      );
    }

    // Check 100% success rate
    if (Math.floor(result.successRate) !== this.REQUIRED_SUCCESS_RATE) {
      result.violations.push(
        `Expected ${this.REQUIRED_SUCCESS_RATE}% success rate, got ${result.successRate.toFixed(2)}%`
      );
    }
  }

  private checkMockDependencies(result: ProtectionResult): void {
    try {
      const mockPatterns = [
        'jest.mock',
        'mockImplementation',
        'mockReturnValue',
        'mockResolvedValue',
        'mockRejectedValue'
      ];

      for (const pattern of mockPatterns) {
        try {
          execSync(`grep -r "${pattern}" tests/dreamstate/ --exclude-dir=node_modules`, {
            stdio: 'pipe'
          });
          result.violations.push(
            `Mock dependency detected: "${pattern}" found in DreamState tests. All tests must use real implementations.`
          );
        } catch (error: unknown) {
          // No matches found - this is good
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      result.warnings.push(`Mock dependency check failed: ${errorMessage}`);
    }
  }

  private checkCriticalFileChanges(result: ProtectionResult): void {
    try {
      const changedFiles = execSync('git diff --name-only HEAD~1', {
        encoding: 'utf8',
        stdio: 'pipe'
      }).split('\n').filter(Boolean);

      for (const criticalFile of this.CRITICAL_FILES) {
        const modifiedFiles = changedFiles.filter(file => file.includes(criticalFile));
        if (modifiedFiles.length > 0) {
          result.warnings.push(
            `Critical file modified: ${criticalFile}. Ensure changes maintain 100% test success rate.`
          );
        }
      }
    } catch (error: unknown) {
      // Likely no git history or first commit - not critical
      result.warnings.push('Unable to check file changes (no git history)');
    }
  }

  private validateTypeScriptCompilation(result: ProtectionResult): void {
    try {
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      console.log('✅ TypeScript compilation passed');
    } catch (error: unknown) {
      result.violations.push('TypeScript compilation failed');
    }
  }

  private generateProtectionReport(result: ProtectionResult): void {
    const timestamp = new Date().toISOString();
    const report = `# 🛡️ DreamState Protection Report

**Date**: ${timestamp}
**Protection Status**: ${result.success ? '✅ PROTECTED' : '❌ BREACH DETECTED'}

## 📊 Test Results
- **Tests**: ${result.passingTests}/${result.totalTests} passed
- **Suites**: ${result.passingSuites}/${result.totalSuites} passed
- **Snapshots**: ${result.snapshots} passed
- **Success Rate**: ${result.successRate.toFixed(2)}%

## 🎯 Critical Metrics Validation
- Required Tests: ${this.REQUIRED_TEST_COUNT} ${result.passingTests === this.REQUIRED_TEST_COUNT ? '✅' : '❌'}
- Required Suites: ${this.REQUIRED_SUITE_COUNT} ${result.passingSuites === this.REQUIRED_SUITE_COUNT ? '✅' : '❌'}
- Required Snapshots: ${this.REQUIRED_SNAPSHOT_COUNT} ${result.snapshots === this.REQUIRED_SNAPSHOT_COUNT ? '✅' : '❌'}
- Required Success Rate: ${this.REQUIRED_SUCCESS_RATE}% ${Math.floor(result.successRate) === this.REQUIRED_SUCCESS_RATE ? '✅' : '❌'}

## 🚨 Violations
${result.violations.length === 0 ? 'None ✅' : result.violations.map(v => `- ❌ ${v}`).join('\n')}

## ⚠️ Warnings
${result.warnings.length === 0 ? 'None ✅' : result.warnings.map(w => `- ⚠️ ${w}`).join('\n')}

## 🔍 Protection Checks Performed
- ✅ DreamState test suite execution
- ✅ Critical metrics validation
- ✅ Mock dependency scanning
- ✅ Critical file change detection
- ✅ TypeScript compilation validation

---
*Generated by DreamState Protection Guard v1.0*
`;

    const reportPath = join(process.cwd(), 'dreamstate-protection-report.md');
    writeFileSync(reportPath, report);
    console.log(`📄 Protection report saved to: ${reportPath}`);
  }
}

// CLI execution
if (require.main === module) {
  const guard = new DreamStateProtectionGuard();
  
  guard.protect().then(result => {
    if (result.success) {
      console.log('\n🎉 DreamState Protection: SUCCESS');
      process.exit(0);
    } else {
      console.log('\n💥 DreamState Protection: FAILED');
      console.log('🚨 DO NOT COMMIT - Fix violations first!');
      process.exit(1);
    }
  }).catch((error: unknown) => {
    console.error('\n💥 DreamState Protection Guard crashed:', error);
    process.exit(1);
  });
}

export { DreamStateProtectionGuard }; 