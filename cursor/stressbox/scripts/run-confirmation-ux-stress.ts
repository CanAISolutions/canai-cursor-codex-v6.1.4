/**
 * run-confirmation-ux-stress.ts
 * 
 * Purpose: Run stress tests for the Confirmation UX Layer
 * Focus: Emotional depth recovery, override reduction, trust score accuracy,
 *        confirmation latency, and conflict resolution
 * 
 * TAP-Status: Locked
 * Codex: v2.7.8
 * Trust Score: 4.2
 */

import { EventBus } from '../../event-bus/eventBus';
import { StressBox } from '../stressbox-engine';
import { confirmationUXStressTests } from '../scenarios/confirmation-ux-stress';
import * as path from 'path';
import * as fs from 'fs/promises';

async function runConfirmationUXStressTests() {
  // Initialize event bus and stress box
  const eventBus = EventBus.getInstance();
  const stressBox = new StressBox(eventBus);

  // Create reports directory structure
  const reportsDir = path.join(process.cwd(), 'stressbox', 'reports');
  const intentMirrorDir = path.join(reportsDir, 'intent-mirror');
  await fs.mkdir(reportsDir, { recursive: true });
  await fs.mkdir(intentMirrorDir, { recursive: true });

  // Run stress tests for each prompt type
  const promptTypes = ['business_plan', 'ai_blueprint', 'mixed_edge_cases'];
  const results: any[] = [];

  for (const promptType of promptTypes) {
    console.log(`Running stress tests for ${promptType}...`);
    
    // Create prompt type directory
    const promptTypeDir = path.join(reportsDir, promptType);
    await fs.mkdir(promptTypeDir, { recursive: true });
    
    // Run each stress test
    for (const test of confirmationUXStressTests) {
      const result = await stressBox.runStressTest(promptType);
      results.push({
        promptType,
        testId: test.id,
        scenario: test.scenario,
        result
      });
    }
  }

  // Generate report
  const report = {
    version: 'v2.7.8',
    timestamp: new Date().toISOString(),
    results: results.map(r => ({
      promptType: r.promptType,
      testId: r.testId,
      scenario: r.scenario,
      passed: r.result.passed,
      scores: r.result.scores,
      failures: r.result.failures,
      riskAssessment: r.result.riskAssessment
    })),
    summary: {
      totalTests: results.length,
      passedTests: results.filter(r => r.result.passed).length,
      failedTests: results.filter(r => !r.result.passed).length,
      riskDistribution: {
        low: results.filter(r => r.result.riskAssessment.level === 'low').length,
        medium: results.filter(r => r.result.riskAssessment.level === 'medium').length,
        high: results.filter(r => r.result.riskAssessment.level === 'high').length
      }
    }
  };

  // Save report
  const reportPath = path.join(intentMirrorDir, 'confirmation-ux-delta-v2.7.8.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

  console.log(`Stress test report saved to ${reportPath}`);
}

// Run the stress tests
runConfirmationUXStressTests().catch(console.error); 