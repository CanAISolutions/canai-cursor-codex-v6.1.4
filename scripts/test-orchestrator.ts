/**
 * @file test-orchestrator.ts
 * @description Test orchestration system for CanAI project with categorized test execution,
 * reporting, and coverage analysis
 * @version 6.1.4
 */

import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';

// Test Categories with their respective paths and descriptions
const TEST_CATEGORIES = {
  CORE: {
    path: 'tests/core',
    description: 'Core System Tests - Fundamental functionality and system components'
  },
  AGENT: {
    path: 'tests/agents',
    description: 'Agent Tests - AI agent behavior and interactions'
  },
  INTEGRATION: {
    path: 'tests/integration',
    description: 'Integration Tests - Cross-component functionality'
  },
  VALIDATION: {
    path: 'tests/validation',
    description: 'Validation Tests - Input/output validation and error handling'
  },
  PERFORMANCE: {
    path: 'tests/performance',
    description: 'Performance Tests - System efficiency and resource usage'
  },
  EMOTIONAL_UX: {
    path: 'tests/emotional-ux',
    description: 'Emotional UX Tests - User experience and emotional resonance'
  }
};

interface TestResult {
  category: string;
  passed: boolean;
  duration: number;
  coverage: number;
  errors?: string[];
  warnings?: string[];
}

interface TestReport {
  timestamp: string;
  totalDuration: number;
  overallCoverage: number;
  results: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
  };
}

class TestOrchestrator {
  private results: TestResult[] = [];
  private startTime: number = 0;

  constructor() {
    this.startTime = Date.now();
  }

  /**
   * Executes tests for a specific category
   * @param category The test category to execute
   * @returns Promise<TestResult>
   */
  private async runCategoryTests(category: keyof typeof TEST_CATEGORIES): Promise<TestResult> {
    const categoryConfig = TEST_CATEGORIES[category];
    const startTime = Date.now();

    try {
      const result = await new Promise<{ success: boolean; coverage: number }>((resolve, reject) => {
        const jest = spawn('jest', [
          `${categoryConfig.path}/**/*.test.ts`,
          '--coverage',
          '--json',
          '--outputFile=test-reports/temp.json'
        ]);

        jest.on('close', async (code) => {
          try {
            const reportData = await fs.readFile('test-reports/temp.json', 'utf8');
            const coverage = JSON.parse(reportData).coverageMap?.total?.lines?.pct || 0;
            resolve({ success: code === 0, coverage });
          } catch (err) {
            resolve({ success: code === 0, coverage: 0 });
          }
        });
      });

      return {
        category: category.toString(),
        passed: result.success,
        duration: Date.now() - startTime,
        coverage: result.coverage
      };
    } catch (error) {
      return {
        category: category.toString(),
        passed: false,
        duration: Date.now() - startTime,
        coverage: 0,
        errors: [error.toString()]
      };
    }
  }

  /**
   * Runs all test categories and generates reports
   */
  public async runAllTests(): Promise<void> {
    await fs.mkdir('test-reports', { recursive: true });

    for (const category of Object.keys(TEST_CATEGORIES)) {
      const result = await this.runCategoryTests(category as keyof typeof TEST_CATEGORIES);
      this.results.push(result);
    }

    await this.generateReports();
  }

  /**
   * Generates test reports in both JSON and Markdown formats
   */
  private async generateReports(): Promise<void> {
    const report: TestReport = {
      timestamp: new Date().toISOString(),
      totalDuration: Date.now() - this.startTime,
      overallCoverage: this.calculateOverallCoverage(),
      results: this.results,
      summary: this.generateSummary()
    };

    // Generate JSON report
    await fs.writeFile(
      'test-reports/test-report.json',
      JSON.stringify(report, null, 2)
    );

    // Generate Markdown report
    const markdownReport = this.generateMarkdownReport(report);
    await fs.writeFile(
      'test-reports/test-report.md',
      markdownReport
    );
  }

  private calculateOverallCoverage(): number {
    const totalCoverage = this.results.reduce((sum, result) => sum + result.coverage, 0);
    return totalCoverage / this.results.length;
  }

  private generateSummary() {
    return {
      total: this.results.length,
      passed: this.results.filter(r => r.passed).length,
      failed: this.results.filter(r => !r.passed).length
    };
  }

  private generateMarkdownReport(report: TestReport): string {
    return `# CanAI Test Execution Report
Generated: ${report.timestamp}

## Summary
- Total Duration: ${(report.totalDuration / 1000).toFixed(2)}s
- Overall Coverage: ${report.overallCoverage.toFixed(2)}%
- Tests Passed: ${report.summary.passed}/${report.summary.total}

## Detailed Results

${report.results.map(result => `
### ${result.category}
- Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}
- Duration: ${(result.duration / 1000).toFixed(2)}s
- Coverage: ${result.coverage.toFixed(2)}%
${result.errors ? `\nErrors:\n${result.errors.map(e => `- ${e}`).join('\n')}` : ''}
`).join('\n')}

## Next Steps
- Review failed tests and address issues
- Improve coverage where below threshold
- Update test cases for new features
`;
  }
}

// Export the orchestrator for use in CLI or programmatic execution
export const orchestrator = new TestOrchestrator();

// CLI execution
if (require.main === module) {
  orchestrator.runAllTests()
    .then(() => console.log('Test execution completed. See test-reports/ for results.'))
    .catch(console.error);
} 