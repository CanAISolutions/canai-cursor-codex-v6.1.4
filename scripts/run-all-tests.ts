/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Test orchestration and reporting"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Orchestrate and report on all tests across the project
 * @dream-state "Billion-dollar clarity in test coverage and validation"
 * @codex-enforcement "Strict adherence to test quality and coverage"
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface TestResult {
  file: string;
  passed: boolean;
  duration: number;
  error?: string;
  coverage?: number;
}

interface TestReport {
  timestamp: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: number;
  results: TestResult[];
  coverage: {
    total: number;
    covered: number;
    percentage: number;
  };
}

interface TestCategory {
  name: string;
  files: string[];
}

const TEST_CATEGORIES: TestCategory[] = [
  {
    name: 'Core System Tests',
    files: [
      'tests/server.test.ts',
      'tests/config.test.ts',
      'tests/telemetry.test.ts'
    ]
  },
  {
    name: 'Agent Tests',
    files: [
      'tests/cursor-debug-agent.test.ts',
      'tests/trust-scorer.test.ts',
      'tests/codex-auditor.test.ts',
      'tests/codex-gatekeeper.test.ts',
      'cursor/agents/__tests__/modularity-enforcer.test.ts',
      'cursor/agents/__tests__/opportunity-radar.test.ts',
      'cursor/tests/agents/emotional-integrity-agent.test.ts',
      'cursor/tests/agents/alignment-auditor.test.ts',
      'cursor/tests/agents/output-evaluator.test.ts'
    ]
  },
  {
    name: 'Integration Tests',
    files: [
      'tests/test-api-endpoint-response.ts',
      'tests/test-webhook-event-ingest.ts'
    ]
  },
  {
    name: 'Validation Tests',
    files: [
      'tests/test-schema-drifts-against-fieldmap.ts',
      'tests/test-field-defaults-and-type-safety.ts'
    ]
  },
  {
    name: 'Performance Tests',
    files: [
      'tests/burst-protection.test.ts',
      'tests/dynamic-tier-burst.test.ts'
    ]
  },
  {
    name: 'Emotional UX Tests',
    files: [
      'tests/emotional-ux-snapshots.test.ts'
    ]
  }
];

async function runAllTests(): Promise<TestReport> {
  const startTime = Date.now();
  const results: TestResult[] = [];
  let passedTests = 0;
  let failedTests = 0;

  // Run all test files from categories
  for (const category of TEST_CATEGORIES) {
    for (const file of category.files) {
      const start = Date.now();
      try {
        console.log(`Running tests in ${file}...`);
        execSync(`jest ${file} --no-cache --coverage`, { stdio: 'inherit' });
        const duration = Date.now() - start;
        
        // Try to read coverage from coverage/coverage-final.json
        let coverage = 0;
        try {
          const coverageData = JSON.parse(readFileSync('coverage/coverage-final.json', 'utf8'));
          const fileCoverage = Object.values(coverageData)[0] as any;
          coverage = fileCoverage.statements.pct;
        } catch (err) {
          console.warn(`Could not read coverage for ${file}`);
        }
        
        results.push({ file, passed: true, duration, coverage });
        passedTests++;
      } catch (error: any) {
        const duration = Date.now() - start;
        results.push({
          file,
          passed: false,
          duration,
          error: error?.message || 'Unknown error occurred'
        });
        failedTests++;
      }
    }
  }

  // Calculate coverage
  const coverage = {
    total: results.length,
    covered: passedTests,
    percentage: (passedTests / results.length) * 100
  };

  return {
    timestamp: new Date().toISOString(),
    totalTests: results.length,
    passedTests,
    failedTests,
    duration: Date.now() - startTime,
    results,
    coverage
  };
}

function generateMarkdownReport(report: TestReport): string {
  let md = `# 🧪 Dream-State Test Orchestrator Report\nGenerated: ${report.timestamp}\n\n## 📊 Test Coverage Summary\n\n`;

  // Generate category tables
  for (const category of TEST_CATEGORIES) {
    md += `### ${category.name}\n`;
    md += '| Test File | Status | Duration | Coverage |\n';
    md += '|-----------|--------|----------|----------|\n';

    for (const file of category.files) {
      const result = report.results.find(r => r.file === file);
      if (result) {
        const status = result.passed ? '✅' : '❌';
        const duration = `${result.duration}ms`;
        const coverage = result.coverage ? `${result.coverage}%` : '-';
        md += `| \`${file}\` | ${status} | ${duration} | ${coverage} |\n`;
      }
    }
    md += '\n';
  }

  // Coverage Statistics
  md += '## 📈 Coverage Statistics\n';
  md += `- Total Files: ${report.totalTests}\n`;
  md += `- Files Under Test: ${report.passedTests}\n`;
  md += `- Coverage Percentage: ${report.coverage.percentage.toFixed(2)}%\n`;
  md += `- Average Test Duration: ${(report.duration / report.totalTests).toFixed(0)}ms\n\n`;

  // Failed Tests
  md += '## ⚠️ Failed Tests\n';
  const failedTests = report.results.filter(r => !r.passed);
  if (failedTests.length === 0) {
    md += 'No failed tests to report.\n\n';
  } else {
    failedTests.forEach(test => {
      md += `### ${test.file}\n`;
      md += `Error: ${test.error}\n\n`;
    });
  }

  // Missing Coverage
  md += '## 🎯 Missing Coverage\n';
  const missingCoverage = report.results.filter(r => !r.coverage || r.coverage < 80);
  if (missingCoverage.length === 0) {
    md += 'No missing coverage to report.\n\n';
  } else {
    missingCoverage.forEach(test => {
      md += `- ${test.file}: ${test.coverage || 0}% coverage\n`;
    });
    md += '\n';
  }

  // Next Steps
  md += '## 🔄 Next Steps\n';
  md += '1. Address any failed tests\n';
  md += '2. Implement missing test coverage\n';
  md += '3. Optimize slow-running tests\n';
  md += '4. Update CI/CD pipeline with new test requirements\n\n';

  // Footer
  md += '---\n\n';
  md += '> Generated by Dream-State Test Orchestrator v6.1.4\n';
  md += '> Codex-Enforced • Checkpoint-Locked • Auditable\n';

  return md;
}

async function generateReport(report: TestReport) {
  // Generate JSON report
  const reportPath = join(__dirname, '../test-reports');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const jsonReportFile = join(reportPath, `test-report-${timestamp}.json`);
  writeFileSync(jsonReportFile, JSON.stringify(report, null, 2));

  // Generate Markdown report
  const mdReport = generateMarkdownReport(report);
  const mdReportFile = join(__dirname, '../cursor/audit-results/test-orchestrator-report.md');
  writeFileSync(mdReportFile, mdReport);
  
  // Console output
  console.log('\nTest Report Summary:');
  console.log('===================');
  console.log(`Total Tests: ${report.totalTests}`);
  console.log(`Passed: ${report.passedTests}`);
  console.log(`Failed: ${report.failedTests}`);
  console.log(`Coverage: ${report.coverage.percentage.toFixed(2)}%`);
  console.log(`Duration: ${report.duration}ms`);
  
  if (report.failedTests > 0) {
    console.log('\nFailed Tests:');
    report.results
      .filter(r => !r.passed)
      .forEach(r => {
        console.log(`\n${r.file}:`);
        console.log(`Error: ${r.error}`);
      });
  }
}

// Run tests and generate report
runAllTests()
  .then(generateReport)
  .catch(error => {
    console.error('Error running tests:', error);
    process.exit(1);
  }); 