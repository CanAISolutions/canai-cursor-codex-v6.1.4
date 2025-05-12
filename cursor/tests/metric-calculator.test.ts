import { MetricCalculator } from '../services/metric-calculator';
import { PromptLogs } from '../types/prompt-logs';

describe('MetricCalculator', () => {
  let calculator: MetricCalculator;
  let mockLogs: PromptLogs[];

  beforeEach(() => {
    calculator = new MetricCalculator();
    mockLogs = [
      {
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
          },
          timeSeries: [
            {
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
          ],
          cohortComparison: {
            'test-cohort': [
              {
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
            ]
          },
          promptMetrics: {
            promptType: 'test-prompt',
            timestamp: Date.now(),
            confirmationRate: 0.9,
            revisionRate: 0.1,
            toneConflictRate: 0.05,
            deltaConfidence: 0.2,
            totalSessions: 100,
            successfulSessions: 90
          },
          touchpointMetrics: {
            sessionId: 'test-session-1',
            timestamp: Date.now(),
            sparkUsed: true,
            visionCatcherTriggered: true,
            enrichmentReused: true,
            toneReused: true,
            confirmationOutcome: true,
            timeToConfirmation: 1500,
            emotionalDepth: 0.8
          },
          correlations: {
            sparkImpact: 0.4,
            visionImpact: 0.3,
            enrichmentImpact: 0.2,
            toneImpact: 0.1
          }
        }
      }
    ];
  });

  describe('calculateMetrics', () => {
    it('should calculate all metrics correctly', () => {
      const result = calculator.calculateMetrics(mockLogs);

      expect(result.sessionMetrics).toBeDefined();
      expect(result.timeSeries).toBeDefined();
      expect(result.cohortComparison).toBeDefined();
      expect(result.promptMetrics).toBeDefined();
      expect(result.touchpointMetrics).toBeDefined();
      expect(result.correlations).toBeDefined();
    });

    it('should handle empty logs array', () => {
      const result = calculator.calculateMetrics([]);

      expect(result.sessionMetrics.size).toBe(0);
      expect(result.timeSeries.length).toBe(0);
      expect(result.cohortComparison.size).toBe(0);
      expect(result.promptMetrics.size).toBe(0);
      expect(result.touchpointMetrics.size).toBe(0);
    });
  });

  describe('calculateSessionMetrics', () => {
    it('should calculate session metrics with correct risk level', () => {
      const result = calculator.calculateMetrics(mockLogs);
      const sessionMetrics = result.sessionMetrics.get('test-session-1');

      expect(sessionMetrics).toBeDefined();
      expect(sessionMetrics.riskLevel).toBe('low');
      expect(sessionMetrics.dropOffSignal).toBe(false);
    });

    it('should identify high risk sessions', () => {
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

      expect(sessionMetrics.riskLevel).toBe('high');
      expect(sessionMetrics.dropOffSignal).toBe(true);
    });
  });

  describe('calculatePromptMetrics', () => {
    it('should identify prompts needing attention', () => {
      const attentionNeededLogs: PromptLogs[] = [{
        timestamp: Date.now().toString(),
        sessionId: 'attention-session',
        promptType: 'attention-needed',
        trustScore: 3.8,
        emotionalDepth: 0.6,
        emotionalAnchorPresent: true,
        enrichedInput: {
          businessType: 'test-business',
          primaryGoal: 'test-goal',
          tone: 'professional',
          motivator: 'efficiency',
          confidence: 0.8,
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
          promptMetrics: {
            promptType: 'attention-needed',
            timestamp: Date.now(),
            confirmationRate: 0.7,
            revisionRate: 0.3,
            toneConflictRate: 0.2,
            deltaConfidence: 0.1,
            totalSessions: 100,
            successfulSessions: 70
          }
        }
      }];

      const result = calculator.calculateMetrics(attentionNeededLogs);
      const promptMetrics = result.promptMetrics.get('attention-needed');

      expect(promptMetrics.needsAttention).toBe(true);
    });
  });

  describe('calculateTouchpointMetrics', () => {
    it('should calculate touchpoint effectiveness correctly', () => {
      const result = calculator.calculateMetrics(mockLogs);
      const touchpointMetrics = result.touchpointMetrics.get('test-session-1');

      expect(touchpointMetrics.effectiveness).toBe(1.0); // All features used and successful
    });

    it('should calculate partial effectiveness', () => {
      const partialLogs: PromptLogs[] = [{
        timestamp: Date.now().toString(),
        sessionId: 'partial-session',
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
            sessionId: 'partial-session',
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

      const result = calculator.calculateMetrics(partialLogs);
      const touchpointMetrics = result.touchpointMetrics.get('partial-session');

      expect(touchpointMetrics.effectiveness).toBe(0.7); // Only spark and confirmation
    });
  });

  describe('calculateCorrelations', () => {
    it('should calculate feature impact correlations', () => {
      const result = calculator.calculateMetrics(mockLogs);

      expect(result.correlations.sparkImpact).toBe(0.4);
      expect(result.correlations.visionImpact).toBe(0.3);
      expect(result.correlations.enrichmentImpact).toBe(0.2);
      expect(result.correlations.toneImpact).toBe(0.1);
    });
  });

  describe('calculateDashboardState', () => {
    it('should calculate overall system health', () => {
      const result = calculator.calculateMetrics(mockLogs);

      expect(result.dashboardState.metrics.riskLevel).toBeDefined();
      expect(result.dashboardState.riskSessions).toBeDefined();
      expect(result.dashboardState.toneConflicts).toBeDefined();
      expect(result.dashboardState.fieldsNeedingTuning).toBeDefined();
      expect(result.dashboardState.promptTypesAtRisk).toBeDefined();
    });
  });
}); 