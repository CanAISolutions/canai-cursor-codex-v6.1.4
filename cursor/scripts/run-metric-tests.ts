import { MetricCalculator } from '../services/metric-calculator';
import { PromptLogs } from '../types/prompt-logs';

/**
 * Test runner for metric calculator
 * Executes all test cases and reports results
 */
async function runMetricTests() {
  console.log('Starting metric calculator tests...');
  
  const calculator = new MetricCalculator();
  const testResults = {
    passed: 0,
    failed: 0,
    total: 0
  };

  // Test case 1: Basic metrics calculation
  try {
    const mockLogs: PromptLogs[] = [{
      timestamp: Date.now().toString(),
      sessionId: 'test-session-1',
      promptType: 'test-prompt',
      trustScore: 4.5,
      emotionalDepth: 0.8,
      emotionalAnchorPresent: true,
      enrichedInput: {
        businessType: 'test-business',
        primaryGoal: 'test-goal',
        tone: 'professional',
        motivator: 'efficiency',
        confidence: 0.9,
        sourceMap: {
          businessType: 'user-input',
          primaryGoal: 'user-input',
          tone: 'system-default',
          motivator: 'system-default'
        },
        usedSparkSignal: true,
        usedVisionCatcher: true
      },
      analyticsMeta: {
        sessionMetrics: {
          sessionId: 'test-session-1',
          timestamp: Date.now(),
          emotionalDepth: 0.8,
          trustScore: 4.5,
          overrideCount: 2,
          timeToConfirmation: 1500,
          dropOffSignal: false,
          promptType: 'test-prompt',
          cohort: 'test-cohort'
        }
      }
    }];

    const result = calculator.calculateMetrics(mockLogs);
    const sessionMetrics = result.sessionMetrics.get('test-session-1');

    if (sessionMetrics && sessionMetrics.riskLevel === 'low' && !sessionMetrics.dropOffSignal) {
      testResults.passed++;
      console.log('✅ Test case 1 passed: Basic metrics calculation');
    } else {
      testResults.failed++;
      console.error('❌ Test case 1 failed: Basic metrics calculation');
    }
  } catch (error) {
    testResults.failed++;
    console.error('❌ Test case 1 failed with error:', error);
  }
  testResults.total++;

  // Test case 2: High risk session detection
  try {
    const highRiskLogs: PromptLogs[] = [{
      timestamp: Date.now().toString(),
      sessionId: 'high-risk-session',
      promptType: 'test-prompt',
      trustScore: 3.5,
      emotionalDepth: 0.5,
      emotionalAnchorPresent: false,
      enrichedInput: {
        businessType: 'test-business',
        primaryGoal: 'test-goal',
        tone: 'professional',
        motivator: 'efficiency',
        confidence: 0.7,
        sourceMap: {
          businessType: 'user-input',
          primaryGoal: 'user-input',
          tone: 'system-default',
          motivator: 'system-default'
        },
        usedSparkSignal: false,
        usedVisionCatcher: false
      },
      analyticsMeta: {
        sessionMetrics: {
          sessionId: 'high-risk-session',
          timestamp: Date.now(),
          emotionalDepth: 0.5,
          trustScore: 3.5,
          overrideCount: 5,
          timeToConfirmation: 3000,
          dropOffSignal: true,
          promptType: 'test-prompt',
          cohort: 'test-cohort'
        }
      }
    }];

    const result = calculator.calculateMetrics(highRiskLogs);
    const sessionMetrics = result.sessionMetrics.get('high-risk-session');

    if (sessionMetrics && sessionMetrics.riskLevel === 'high' && sessionMetrics.dropOffSignal) {
      testResults.passed++;
      console.log('✅ Test case 2 passed: High risk session detection');
    } else {
      testResults.failed++;
      console.error('❌ Test case 2 failed: High risk session detection');
    }
  } catch (error) {
    testResults.failed++;
    console.error('❌ Test case 2 failed with error:', error);
  }
  testResults.total++;

  // Test case 3: Touchpoint effectiveness calculation
  try {
    const touchpointLogs: PromptLogs[] = [{
      timestamp: Date.now().toString(),
      sessionId: 'touchpoint-session',
      promptType: 'test-prompt',
      trustScore: 4.0,
      emotionalDepth: 0.7,
      emotionalAnchorPresent: true,
      enrichedInput: {
        businessType: 'test-business',
        primaryGoal: 'test-goal',
        tone: 'professional',
        motivator: 'efficiency',
        confidence: 0.85,
        sourceMap: {
          businessType: 'user-input',
          primaryGoal: 'user-input',
          tone: 'system-default',
          motivator: 'system-default'
        },
        usedSparkSignal: true,
        usedVisionCatcher: false
      },
      analyticsMeta: {
        touchpointMetrics: {
          sessionId: 'touchpoint-session',
          timestamp: Date.now(),
          sparkUsed: true,
          visionCatcherTriggered: false,
          enrichmentReused: true,
          toneReused: false,
          confirmationOutcome: true,
          timeToConfirmation: 2000,
          emotionalDepth: 0.6
        }
      }
    }];

    const result = calculator.calculateMetrics(touchpointLogs);
    const touchpointMetrics = result.touchpointMetrics.get('touchpoint-session');

    if (touchpointMetrics && touchpointMetrics.effectiveness === 0.7) {
      testResults.passed++;
      console.log('✅ Test case 3 passed: Touchpoint effectiveness calculation');
    } else {
      testResults.failed++;
      console.error('❌ Test case 3 failed: Touchpoint effectiveness calculation');
    }
  } catch (error) {
    testResults.failed++;
    console.error('❌ Test case 3 failed with error:', error);
  }
  testResults.total++;

  // Print summary
  console.log('\nTest Summary:');
  console.log(`Total tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log(`Success rate: ${((testResults.passed / testResults.total) * 100).toFixed(2)}%`);

  return testResults.failed === 0;
}

// Run tests
runMetricTests().then(success => {
  process.exit(success ? 0 : 1);
}); 