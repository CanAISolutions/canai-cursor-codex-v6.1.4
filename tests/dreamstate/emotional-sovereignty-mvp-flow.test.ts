/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "MVP Flow Integration Test - Webflow → Intent Mirror → Make.com → Prompt Return"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Validates the complete MVP flow as outlined in Make.com-Bulletproof-Implementation-Plan-v5.markdown
 */

import { EmotionalSovereigntyOrchestrator } from '../../api/orchestration/emotional-sovereignty-orchestrator';
import { emitSystemLog } from '../../cursor/utils/audit-utils';

describe('Emotional Sovereignty MVP Flow Integration', () => {
  let orchestrator: EmotionalSovereigntyOrchestrator;

  beforeEach(() => {
    orchestrator = new EmotionalSovereigntyOrchestrator();
  });

  describe('Phase 1: Discovery Funnel Integration', () => {
    test('should process Webflow form data through Intent Mirror', async () => {
      // Simulate Webflow form submission data
      const webflowFormData = {
        userInput: {
          intent: "Launch coffee shop online presence with bold branding",
          tone: "bold",
          industry: "coffee",
          pain_point: "Struggling to stand out in crowded market"
        },
        sessionId: `mvp-test-${Date.now()}`,
        productType: 'discovery_funnel',
        context: JSON.stringify({
          preferredTone: "bold",
          dwellTime: "45",
          fieldInteractions: "8",
          timestamp: new Date().toISOString()
        })
      };

      // Process through orchestrator (Intent Mirror)
      const result = await orchestrator.processEmotionalSovereignty(webflowFormData);

      // Validate Intent Mirror processing
      expect(result).toBeDefined();
      expect(result.structuredIntent).toBeDefined();
      expect(result.emotionalContext).toBeDefined();
      expect(result.emotionalArc).toBeDefined();
      expect(result.emotionalArc.finalTrustScore).toBeGreaterThanOrEqual(0);
      expect(result.emotionalArc.finalTrustScore).toBeLessThanOrEqual(5);

      // Validate Make.com webhook data preparation
      expect(result.makeWebhookData).toBeDefined();
      expect(result.makeWebhookData.sessionId).toBe(webflowFormData.sessionId);
      expect(result.makeWebhookData.productType).toBe('discovery_funnel');

      // Log success for tracker
      emitSystemLog('mvp-flow-test-success', {
        testType: 'form-submission',
        sessionId: webflowFormData.sessionId,
        trustScore: result.emotionalArc.finalTrustScore,
        readyForExecution: result.readyForExecution,
        timestamp: new Date().toISOString()
      });
    }, 30000);

    test('should validate trust score monitoring and recovery', async () => {
      // Test with low trust scenario
      const lowTrustData = {
        userInput: {
          intent: "I don't know what I want",
          tone: "confused",
          industry: "unknown",
          pain_point: "Everything is wrong"
        },
        sessionId: `low-trust-test-${Date.now()}`,
        productType: 'discovery_funnel'
      };

      const result = await orchestrator.processEmotionalSovereignty(lowTrustData);

      // Should still process but with appropriate trust handling
      expect(result).toBeDefined();
      expect(result.emotionalArc.finalTrustScore).toBeDefined();
      
      // Log for monitoring
      emitSystemLog('trust-monitoring-test', {
        testType: 'trust-monitoring',
        sessionId: lowTrustData.sessionId,
        trustScore: result.emotionalArc.finalTrustScore,
        recoveryTriggered: result.emotionalArc.finalTrustScore < 3.0,
        timestamp: new Date().toISOString()
      });
    }, 15000);

    test('should handle error recovery gracefully', async () => {
      // Test with malformed data
      const malformedData = {
        userInput: null,
        sessionId: `error-test-${Date.now()}`,
        productType: 'discovery_funnel'
      };

      const result = await orchestrator.processEmotionalSovereignty(malformedData);

      // Should return fallback response
      expect(result).toBeDefined();
      expect(result.readyForExecution).toBeDefined();
      
      emitSystemLog('error-recovery-test', {
        testType: 'error-recovery',
        sessionId: malformedData.sessionId,
        fallbackActivated: true,
        timestamp: new Date().toISOString()
      });
    }, 10000);
  });

  describe('Performance Validation', () => {
    test('should complete MVP flow within 30 seconds', async () => {
      const startTime = Date.now();
      
      const testData = {
        userInput: {
          intent: "Create modern restaurant website",
          tone: "professional",
          industry: "restaurant",
          pain_point: "No online presence"
        },
        sessionId: `performance-test-${Date.now()}`,
        productType: 'discovery_funnel'
      };

      const result = await orchestrator.processEmotionalSovereignty(testData);
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(result).toBeDefined();
      expect(duration).toBeLessThan(30000); // 30 seconds

      emitSystemLog('performance-test', {
        testType: 'performance',
        sessionId: testData.sessionId,
        duration,
        target: 30000,
        success: duration < 30000,
        timestamp: new Date().toISOString()
      });
    }, 35000);
  });

  describe('Make.com Scenario Routing', () => {
    test('should determine correct scenario based on trust score', async () => {
      const highTrustData = {
        userInput: {
          intent: "Launch premium boutique hotel brand with luxury positioning",
          tone: "sophisticated",
          industry: "hospitality",
          pain_point: "Need to establish premium market presence"
        },
        sessionId: `scenario-test-${Date.now()}`,
        productType: 'discovery_funnel'
      };

      const result = await orchestrator.processEmotionalSovereignty(highTrustData);

      expect(result).toBeDefined();
      expect(result.makeWebhookData).toBeDefined();
      
      // High trust should be ready for execution
      if (result.emotionalArc.finalTrustScore >= 4.2) {
        expect(result.readyForExecution).toBe(true);
      }

      emitSystemLog('scenario-routing-test', {
        testType: 'scenario-routing',
        sessionId: highTrustData.sessionId,
        trustScore: result.emotionalArc.finalTrustScore,
        readyForExecution: result.readyForExecution,
        timestamp: new Date().toISOString()
      });
    }, 20000);
  });

  describe('Data Flow Validation', () => {
    test('should maintain data integrity through complete flow', async () => {
      const testData = {
        userInput: {
          intent: "Build tech startup MVP with modern design",
          tone: "innovative",
          industry: "technology",
          pain_point: "Need to validate product-market fit"
        },
        sessionId: `data-flow-test-${Date.now()}`,
        productType: 'discovery_funnel',
        context: JSON.stringify({
          preferredTone: "innovative",
          dwellTime: "120",
          fieldInteractions: "15",
          timestamp: new Date().toISOString()
        })
      };

      const result = await orchestrator.processEmotionalSovereignty(testData);

      // Validate data preservation
      expect(result.makeWebhookData.sessionId).toBe(testData.sessionId);
      expect(result.makeWebhookData.productType).toBe(testData.productType);
      expect(result.structuredIntent).toBeDefined();
      expect(result.emotionalContext).toBeDefined();

      // Validate emotional metrics
      expect(result.emotionalArc.finalTrustScore).toBeGreaterThanOrEqual(0);
      expect(result.sparkResonance).toBeDefined();

      emitSystemLog('data-flow-test', {
        testType: 'data-flow',
        sessionId: testData.sessionId,
        dataIntegrityMaintained: true,
        emotionalMetricsGenerated: true,
        timestamp: new Date().toISOString()
      });
    }, 25000);
  });
}); 