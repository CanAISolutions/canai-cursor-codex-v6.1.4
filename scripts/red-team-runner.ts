/**
 * @file scripts/red-team-runner.ts
 * @description Script to run red team tests and generate reports
 * @version 6.2.2
 */

import { RedTeamTester } from '../red-team/test-cases';
import { EventBus } from '../event-bus/eventBus';
import * as fs from 'fs';
import * as path from 'path';

interface TestReport {
  timestamp: number;
  summary: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    criticalFailures: number;
  };
  results: {
    [testId: string]: {
      passed: boolean;
      severity: string;
      metrics: {
        trustScore: number;
        memoryFidelity: number;
        emotionalResonance: number;
      };
      timestamp: number;
    }[];
  };
}

export class RedTeamRunner {
  private tester: RedTeamTester;
  private eventBus: EventBus;
  private reportDir: string;

  constructor() {
    this.tester = new RedTeamTester();
    this.eventBus = EventBus.getInstance();
    this.reportDir = path.join(process.cwd(), 'reports', 'red-team');
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.eventBus.on('test.completed', this.handleTestCompleted.bind(this));
    this.eventBus.on('test.failed', this.handleTestFailed.bind(this));
  }

  public async runTests(): Promise<void> {
    console.log('Starting red team tests...');
    const results = await this.tester.runAllTests();
    await this.generateReport(results);
    await this.emitPersonaWatchLog(results);
    await this.emitOutputDeltaLog(results);
    console.log('Red team tests completed. Report generated.');
  }

  private async generateReport(results: Map<string, any[]>): Promise<void> {
    const report: TestReport = {
      timestamp: Date.now(),
      summary: {
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        criticalFailures: 0
      },
      results: {}
    };

    // Process results
    for (const [testId, testResults] of results.entries()) {
      report.results[testId] = testResults.map(result => ({
        passed: result.passed,
        severity: result.severity,
        metrics: result.metrics,
        timestamp: result.timestamp
      }));

      report.summary.totalTests += testResults.length;
      report.summary.passedTests += testResults.filter(r => r.passed).length;
      report.summary.failedTests += testResults.filter(r => !r.passed).length;
      report.summary.criticalFailures += testResults.filter(r => !r.passed && r.severity === 'critical').length;
    }

    // Ensure report directory exists
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }

    // Save report
    const reportPath = path.join(this.reportDir, `red-team-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Emit report event
    await this.eventBus.emit('red-team.report.generated', { reportPath });
  }

  private async handleTestCompleted(data: any): Promise<void> {
    const { testId, result } = data;
    console.log(`✅ Test ${testId} passed`);
  }

  private async handleTestFailed(data: any): Promise<void> {
    const { testId, result } = data;
    console.error(`❌ Test ${testId} failed:`, result);
  }

  private async emitPersonaWatchLog(results: Map<string, any[]>): Promise<void> {
    const logPath = path.join(process.cwd(), 'red-team', 'persona-watch.log.md');
    let summary = `# Persona Watch Log\n\n## Red Team Summary\n\n`;
    let tagged = '| Test ID | Type | Severity | Description | Failure Reason |\n|--------|------|----------|-------------|---------------|\n';
    for (const [testId, testResults] of results.entries()) {
      for (const result of testResults) {
        if (!result.passed) {
          tagged += `| ${testId} | ${result.type || '--'} | ${result.severity || '--'} | ${result.description || '--'} | ${result.actualBehavior || '--'} |\n`;
        }
      }
    }
    summary += tagged + '\n';
    await fs.writeFileSync(logPath, summary, { flag: 'a' });
  }

  private async emitOutputDeltaLog(results: Map<string, any[]>): Promise<void> {
    const logPath = path.join(process.cwd(), 'scripts', 'outputDeltaLog.ts');
    let log = `// Red Team Impact Deltas\n`;
    for (const [testId, testResults] of results.entries()) {
      for (const result of testResults) {
        log += `// Test: ${testId}, Trust: ${result.metrics?.trustScore}, Memory: ${result.metrics?.memoryFidelity}, Emotion: ${result.metrics?.emotionalResonance}, Passed: ${result.passed}\n`;
      }
    }
    await fs.appendFileSync(logPath, log);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const runner = new RedTeamRunner();
  runner.runTests().catch(console.error);
} 