/**
 * stressbox-engine.test.ts
 * 
 * Purpose: Test suite for StressBox engine
 * Validates: Input simulation, failure detection, risk scoring, and reporting
 * 
 * TAP-Status: Locked
 * Codex: v6.1.4
 * Trust Score: 4.2
 */

import { EventBus } from '../event-bus/eventBus';
import { StressBox } from './stressbox-engine';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('StressBox', () => {
  let stressBox: StressBox;
  let eventBus: EventBus;
  const mockReportsDir = '/stressbox/reports';

  beforeEach(() => {
    eventBus = EventBus.getInstance();
    stressBox = new StressBox(eventBus);
  });

  describe('Stress Test Generation', () => {
    it('should generate appropriate stress test scenarios', async () => {
      const report = await stressBox.runStressTest('business_plan');
      
      expect(report.promptType).toBe('business_plan');
      expect(report.version).toBe('v6.1.4');
      expect(report.results.length).toBeGreaterThan(0);
      
      // Verify scenario types
      const scenarioTypes = new Set(report.results.map(r => r.testId.split('_')[0]));
      expect(scenarioTypes).toContain('under');
      expect(scenarioTypes).toContain('over');
      expect(scenarioTypes).toContain('tone');
      expect(scenarioTypes).toContain('struct');
      expect(scenarioTypes).toContain('content');
    });

    it('should include risk assessments for all scenarios', async () => {
      const report = await stressBox.runStressTest('business_plan');
      
      report.results.forEach(result => {
        expect(result.riskAssessment).toBeDefined();
        expect(['low', 'medium', 'high']).toContain(result.riskAssessment.level);
        expect(Array.isArray(result.riskAssessment.factors)).toBe(true);
      });
    });
  });

  describe('Failure Detection', () => {
    it('should detect tone deviation failures', async () => {
      const report = await stressBox.runStressTest('business_plan');
      
      const toneTests = report.results.filter(r => r.testId.startsWith('tone_'));
      toneTests.forEach(test => {
        expect(test.scores.toneDeviation).toBeDefined();
        if (test.scores.toneDeviation > 0.3) {
          expect(test.failures).toContain('Tone deviation exceeds threshold');
        }
      });
    });

    it('should detect structural integrity failures', async () => {
      const report = await stressBox.runStressTest('business_plan');
      
      const structTests = report.results.filter(r => r.testId.startsWith('struct_'));
      structTests.forEach(test => {
        expect(test.scores.structuralIntegrity).toBeDefined();
        if (test.scores.structuralIntegrity > 0.4) {
          expect(test.failures).toContain('Structural integrity compromised');
        }
      });
    });

    it('should detect hallucination risk', async () => {
      const report = await stressBox.runStressTest('business_plan');
      
      const contentTests = report.results.filter(r => r.testId.startsWith('content_'));
      contentTests.forEach(test => {
        expect(test.scores.hallucinationRisk).toBeDefined();
        if (test.scores.hallucinationRisk > 0.2) {
          expect(test.failures).toContain('High hallucination risk detected');
        }
      });
    });
  });

  describe('Risk Assessment', () => {
    it('should correctly assess risk levels based on failures', async () => {
      const report = await stressBox.runStressTest('business_plan');
      
      report.results.forEach(result => {
        if (result.failures.length > 2) {
          expect(result.riskAssessment.level).toBe('high');
        } else if (result.failures.length > 0) {
          expect(result.riskAssessment.level).toBe('medium');
        } else {
          expect(result.riskAssessment.level).toBe('low');
        }
      });
    });

    it('should include relevant risk factors', async () => {
      const report = await stressBox.runStressTest('business_plan');
      
      report.results.forEach(result => {
        if (result.scores.hallucinationRisk > 0.2) {
          expect(result.riskAssessment.factors).toContain('High hallucination risk');
        }
        if (result.scores.toneDeviation > 0.3) {
          expect(result.riskAssessment.factors).toContain('Significant tone deviation');
        }
      });
    });
  });

  describe('Report Generation', () => {
    it('should generate comprehensive reports', async () => {
      const report = await stressBox.runStressTest('business_plan');
      
      expect(report.summary).toBeDefined();
      expect(report.summary.totalTests).toBe(report.results.length);
      expect(report.summary.passedTests + report.summary.failedTests).toBe(report.results.length);
      
      const riskCount = report.results.reduce((acc, r) => {
        acc[r.riskAssessment.level]++;
        return acc;
      }, { low: 0, medium: 0, high: 0 });
      
      expect(report.summary.riskDistribution).toEqual(riskCount);
    });

    it('should provide actionable recommendations', async () => {
      const report = await stressBox.runStressTest('business_plan');
      
      expect(report.recommendations).toBeDefined();
      expect(Array.isArray(report.recommendations)).toBe(true);
      
      const highRiskTests = report.results.filter(r => r.riskAssessment.level === 'high');
      if (highRiskTests.length > 0) {
        expect(report.recommendations).toContain('Implement additional validation for high-risk scenarios');
      }
    });
  });

  describe('Event Handling', () => {
    it('should emit events on test completion', async () => {
      const eventSpy = jest.spyOn(eventBus, 'emit');
      
      await stressBox.runStressTest('business_plan');
      
      expect(eventSpy).toHaveBeenCalledWith('STRESS_TEST_COMPLETED', expect.any(Object));
    });

    it('should handle stress test requests', async () => {
      const runSpy = jest.spyOn(stressBox as any, 'runStressTest');
      
      eventBus.emit('STRESS_TEST_REQUESTED', { promptType: 'business_plan' });
      
      expect(runSpy).toHaveBeenCalledWith('business_plan');
    });
  });

  describe('Report Persistence', () => {
    it('should save reports to the correct location', async () => {
      const writeSpy = jest.spyOn(fs, 'writeFile');
      
      await stressBox.runStressTest('business_plan');
      
      expect(writeSpy).toHaveBeenCalledWith(
        expect.stringContaining('/stressbox/reports/business_plan/'),
        expect.any(String),
        expect.any(Object)
      );
    });

    it('should create report directories if they don\'t exist', async () => {
      const mkdirSpy = jest.spyOn(fs, 'mkdir');
      
      await stressBox.runStressTest('business_plan');
      
      expect(mkdirSpy).toHaveBeenCalledWith(
        expect.stringContaining('/stressbox/reports/business_plan'),
        expect.any(Object)
      );
    });
  });
}); 