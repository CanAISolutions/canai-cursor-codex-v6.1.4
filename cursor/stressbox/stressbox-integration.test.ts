/**
 * stressbox-integration.test.ts
 * 
 * Purpose: Test suite for StressBox integration
 * Validates: Integration with prompt system, health dashboard, and event handling
 * 
 * TAP-Status: Locked
 * Codex: v6.1.4
 * Trust Score: 4.2
 */

import { EventBus } from '../event-bus/eventBus';
import { StressBoxIntegration } from './stressbox-integration';
import { PromptHealthDashboard } from '../dashboard/prompt-health-dashboard';
import { StressBox } from './stressbox-engine';

jest.mock('./stressbox-engine');
jest.mock('../dashboard/prompt-health-dashboard');

describe('StressBoxIntegration', () => {
  let integration: StressBoxIntegration;
  let eventBus: EventBus;
  let healthDashboard: PromptHealthDashboard;
  let stressBox: jest.Mocked<StressBox>;

  beforeEach(() => {
    eventBus = EventBus.getInstance();
    healthDashboard = new PromptHealthDashboard(eventBus);
    stressBox = new StressBox(eventBus) as jest.Mocked<StressBox>;
    integration = new StressBoxIntegration(eventBus, healthDashboard);
  });

  describe('Event Handling', () => {
    it('should handle prompt execution events', async () => {
      const triggerSpy = jest.spyOn(integration as any, 'triggerStressTest');
      
      eventBus.emit('PROMPT_EXECUTED', {
        promptType: 'business_plan',
        input: {},
        output: {}
      });
      
      expect(triggerSpy).toHaveBeenCalledWith('business_plan');
    });

    it('should handle stress test completion events', async () => {
      const handleSpy = jest.spyOn(integration as any, 'handleStressTestResult');
      
      eventBus.emit('STRESS_TEST_COMPLETED', {
        promptType: 'business_plan',
        timestamp: new Date().toISOString(),
        summary: {
          totalTests: 10,
          passedTests: 8,
          failedTests: 2,
          riskDistribution: {
            low: 5,
            medium: 3,
            high: 2
          }
        },
        recommendations: []
      });
      
      expect(handleSpy).toHaveBeenCalled();
    });
  });

  describe('Health Dashboard Integration', () => {
    it('should update health metrics with stress test results', async () => {
      const updateSpy = jest.spyOn(integration as any, 'updateHealthMetrics');
      
      await integration['handleStressTestResult']({
        promptType: 'business_plan',
        timestamp: new Date().toISOString(),
        summary: {
          totalTests: 10,
          passedTests: 8,
          failedTests: 2,
          riskDistribution: {
            low: 5,
            medium: 3,
            high: 2
          }
        },
        recommendations: []
      });
      
      expect(updateSpy).toHaveBeenCalled();
    });

    it('should generate recommendations for failed tests', async () => {
      const generateSpy = jest.spyOn(integration as any, 'generateRecommendations');
      
      await integration['handleStressTestResult']({
        promptType: 'business_plan',
        timestamp: new Date().toISOString(),
        summary: {
          totalTests: 10,
          passedTests: 8,
          failedTests: 2,
          riskDistribution: {
            low: 5,
            medium: 3,
            high: 2
          }
        },
        recommendations: ['Test recommendation']
      });
      
      expect(generateSpy).toHaveBeenCalled();
    });
  });

  describe('Recommendation Priority', () => {
    it('should correctly calculate high priority', () => {
      const priority = integration['calculatePriority']('Fix critical high-risk scenario');
      expect(priority).toBe('high');
    });

    it('should correctly calculate medium priority', () => {
      const priority = integration['calculatePriority']('Address medium impact issue');
      expect(priority).toBe('medium');
    });

    it('should correctly calculate low priority', () => {
      const priority = integration['calculatePriority']('Minor improvement suggestion');
      expect(priority).toBe('low');
    });
  });

  describe('Error Handling', () => {
    it('should handle stress test errors', async () => {
      const errorSpy = jest.spyOn(integration as any, 'emitSystemLog');
      
      await integration['triggerStressTest']('business_plan');
      
      expect(errorSpy).toHaveBeenCalledWith(
        'stress-test-error',
        expect.objectContaining({
          path: expect.stringContaining('/stressbox/errors/business_plan/'),
          content: expect.any(String)
        })
      );
    });
  });

  describe('Status Reporting', () => {
    it('should return stress test status', async () => {
      const status = await integration.getStressTestStatus('business_plan');
      
      expect(status).toHaveProperty('lastTest');
      expect(status).toHaveProperty('passRate');
      expect(status).toHaveProperty('riskLevel');
    });

    it('should return stress test history', async () => {
      const history = await integration.getStressTestHistory('business_plan');
      
      expect(Array.isArray(history)).toBe(true);
    });
  });
}); 