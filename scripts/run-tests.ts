#!/usr/bin/env node
/**
 * @file run-tests.ts
 * @description CLI interface for the test orchestration system
 * @version 6.1.4
 */

import { program } from 'commander';
import { orchestrator } from './test-orchestrator';
import * as TEST_CATEGORIES from './test-orchestrator';

program
  .version('6.1.4')
  .description('CanAI Test Orchestration CLI')
  .option('-c, --category <category>', 'Run tests for a specific category')
  .option('-r, --report-only', 'Generate reports from existing results')
  .option('-v, --verbose', 'Show detailed test output')
  .option('--ci', 'Run in CI mode (exits with status code)')
  .option('--coverage-threshold <number>', 'Minimum coverage threshold', '80')
  .parse(process.argv);

const options = program.opts();

async function main() {
  try {
    if (options.category && !Object.keys(TEST_CATEGORIES).includes(options.category)) {
      console.error(`Invalid category. Available categories: ${Object.keys(TEST_CATEGORIES).join(', ')}`);
      process.exit(1);
    }

    console.log('🚀 Starting CanAI Test Orchestration');
    console.log('=====================================');

    if (options.verbose) {
      console.log('Configuration:', JSON.stringify(options, null, 2));
    }

    await orchestrator.runAllTests();

    console.log('✨ Test execution completed');
    console.log('See test-reports/ for detailed results');

    if (options.ci) {
      const report = require('../test-reports/test-report.json');
      const coverageThreshold = parseInt(options.coverageThreshold, 10);
      
      if (report.overallCoverage < coverageThreshold) {
        console.error(`❌ Coverage (${report.overallCoverage}%) below threshold (${coverageThreshold}%)`);
        process.exit(1);
      }
      
      if (report.summary.failed > 0) {
        console.error(`❌ ${report.summary.failed} test(s) failed`);
        process.exit(1);
      }
    }
  } catch (error) {
    console.error('❌ Error during test execution:', error);
    process.exit(1);
  }
}

main(); 