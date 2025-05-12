/**
 * stressbox-integration.ts
 * 
 * Purpose: Integrate StressBox with prompt system
 * Includes: Prompt execution, response analysis, and result aggregation
 * 
 * TAP-Status: Locked
 * Codex: v6.1.4
 * Trust Score: 4.2
 */

import { EventBus } from '../event-bus/eventBus';
import { StressBox } from './stressbox-engine';
import { emitSystemLog } from '../system-intel/audit-utils';
import { PromptHealthDashboard } from '../dashboard/prompt-health-dashboard';

interface StressTestResult {
  promptType: string;
  timestamp: string;
  summary: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    riskDistribution: {
      low: number;
      medium: number;
      high: number;
    };
  };
  recommendations: string[];
}

export class StressBoxIntegration {
  private eventBus: EventBus;
  private stressBox: StressBox;
  private healthDashboard: PromptHealthDashboard;

  constructor(eventBus: EventBus, healthDashboard: PromptHealthDashboard) {
    this.eventBus = eventBus;
    this.stressBox = new StressBox(eventBus);
    this.healthDashboard = healthDashboard;
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    this.eventBus.on('PROMPT_EXECUTED', this.handlePromptExecution.bind(this));
    this.eventBus.on('STRESS_TEST_COMPLETED', this.handleStressTestResult.bind(this));
  }

  /**
   * Handle prompt execution and trigger stress tests if needed
   */
  private async handlePromptExecution(data: { promptType: string; input: any; output: any }): Promise<void> {
    // Check if stress test is needed based on health score
    const healthScore = await this.healthDashboard.getHealthScore(data.promptType);
    
    if (healthScore < 0.8) {
      await this.triggerStressTest(data.promptType);
    }
  }

  /**
   * Trigger stress test for a prompt type
   */
  private async triggerStressTest(promptType: string): Promise<void> {
    try {
      await this.stressBox.runStressTest(promptType);
    } catch (error) {
      await emitSystemLog('stress-test-error', {
        path: `/stressbox/errors/${promptType}/${Date.now()}.json`,
        content: JSON.stringify({
          promptType,
          error: error.message,
          timestamp: new Date().toISOString()
        })
      });
    }
  }

  /**
   * Handle stress test results
   */
  private async handleStressTestResult(result: StressTestResult): Promise<void> {
    // Update health dashboard with stress test results
    await this.updateHealthMetrics(result);
    
    // Generate recommendations if needed
    if (result.summary.failedTests > 0) {
      await this.generateRecommendations(result);
    }
    
    // Emit system log
    await emitSystemLog('stress-test-result', {
      path: `/stressbox/results/${result.promptType}/${result.timestamp}.json`,
      content: JSON.stringify(result)
    });
  }

  /**
   * Update health metrics based on stress test results
   */
  private async updateHealthMetrics(result: StressTestResult): Promise<void> {
    const metrics = {
      stressTestPassRate: result.summary.passedTests / result.summary.totalTests,
      highRiskScenarios: result.summary.riskDistribution.high,
      mediumRiskScenarios: result.summary.riskDistribution.medium,
      lowRiskScenarios: result.summary.riskDistribution.low
    };

    await this.healthDashboard.updateMetrics(result.promptType, metrics);
  }

  /**
   * Generate recommendations based on stress test results
   */
  private async generateRecommendations(result: StressTestResult): Promise<void> {
    const recommendations = result.recommendations.map(rec => ({
      promptType: result.promptType,
      recommendation: rec,
      priority: this.calculatePriority(rec),
      timestamp: new Date().toISOString()
    }));

    await this.healthDashboard.addRecommendations(recommendations);
  }

  /**
   * Calculate priority for a recommendation
   */
  private calculatePriority(recommendation: string): 'low' | 'medium' | 'high' {
    if (recommendation.includes('high-risk') || recommendation.includes('critical')) {
      return 'high';
    } else if (recommendation.includes('medium') || recommendation.includes('significant')) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Get stress test history for a prompt type
   */
  async getStressTestHistory(promptType: string): Promise<StressTestResult[]> {
    // Implementation would read from the reports directory
    return [];
  }

  /**
   * Get current stress test status for a prompt type
   */
  async getStressTestStatus(promptType: string): Promise<{
    lastTest: string;
    passRate: number;
    riskLevel: 'low' | 'medium' | 'high';
  }> {
    // Implementation would read the latest report
    return {
      lastTest: new Date().toISOString(),
      passRate: 1.0,
      riskLevel: 'low'
    };
  }
} 