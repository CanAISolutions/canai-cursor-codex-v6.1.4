/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Integration tests for emotional sovereignty system"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Validates complete emotional sovereignty flow from frontend to Make.com
 */

import { EmotionalSovereigntyOrchestrator } from '../../api/orchestration/emotional-sovereignty-orchestrator';
import { handleEmotionalSovereigntyWebhook } from '../../api/webhook/emotional-sovereignty-bridge';
import { EmotionalValidator } from '../../cursor/validators/emotional-validator';
import { EventBus } from '../../cursor/event-bus/eventBus';

describe('Emotional Sovereignty Integration Tests', () => {
  let orchestrator: EmotionalSovereigntyOrchestrator;
  let emotionalValidator: EmotionalValidator;
  let eventBus: EventBus;

  beforeEach(() => {
    orchestrator = new EmotionalSovereigntyOrchestrator();
    emotionalValidator = new EmotionalValidator();
    eventBus = EventBus.getInstance();
    
    // Clear event bus
    eventBus.clear();
  });

  describe('Complete Emotional Sovereignty Flow', () => {
    test('should process user input through complete emotional sovereignty pipeline', async () => {
      const testRequest = {
        userInput: {
          challenge: 'Launch a coffee brand that stands out',
          tone: 'bold',
          industry: 'coffee',
          painPoint: 'Too much competition'
        },
        sessionId: 'test-session-001',
        userId: 'test-user-001',
        productType: 'business_plan',
        context: 'coffee-launch'
      };

      const result = await orchestrator.processEmotionalSovereignty(testRequest);

      // Validate core response structure
      expect(result).toHaveProperty('structuredIntent');
      expect(result).toHaveProperty('emotionalContext');
      expect(result).toHaveProperty('sparkResonance');
      expect(result).toHaveProperty('confirmationMeta');
      expect(result).toHaveProperty('emotionalArc');
      expect(result).toHaveProperty('readyForExecution');
      expect(result).toHaveProperty('makeWebhookData');

      // Validate emotional intelligence metrics
      expect(result.emotionalArc.finalTrustScore).toBeGreaterThan(3.0);
      expect(result.sparkResonance.overallResonance).toBeGreaterThan(0.5);
      expect(result.readyForExecution).toBe(true);

      // Validate structured intent
      expect(result.structuredIntent.business_type.value).toBeTruthy();
      expect(result.structuredIntent.tone.value).toBe('bold');
      expect(result.structuredIntent._meta.validationPassed).toBe(true);

      // Validate Make.com webhook data
      expect(result.makeWebhookData.sessionId).toBe(testRequest.sessionId);
      expect(result.makeWebhookData.productType).toBe(testRequest.productType);
    });

    test('should handle emotional recovery for low trust scenarios', async () => {
      const lowTrustRequest = {
        userInput: {
          challenge: '', // Empty challenge should trigger low confidence
          tone: '',
          industry: '',
          painPoint: 'Everything is overwhelming'
        },
        sessionId: 'test-session-002',
        productType: 'business_plan'
      };

      const result = await orchestrator.processEmotionalSovereignty(lowTrustRequest);

      // Should still return valid response with fallback handling
      expect(result.readyForExecution).toBe(true);
      expect(result.emotionalArc.arcType).toMatch(/Recovery|Fallback/);
      expect(result.makeWebhookData.fallback).toBeTruthy();
    });

    test('should maintain emotional continuity across sessions', async () => {
      const sessionId = 'test-session-continuity';
      
      // First session
      const firstRequest = {
        userInput: {
          challenge: 'Build a fitness app',
          tone: 'supportive',
          industry: 'fitness'
        },
        sessionId,
        productType: 'business_plan'
      };

      const firstResult = await orchestrator.processEmotionalSovereignty(firstRequest);
      
      // Second session with same sessionId
      const secondRequest = {
        userInput: {
          challenge: 'Create marketing for fitness app',
          tone: 'supportive', // Same tone should boost continuity
          industry: 'fitness'
        },
        sessionId,
        productType: 'email_campaign'
      };

      const secondResult = await orchestrator.processEmotionalSovereignty(secondRequest);

      // Second session should have higher trust due to continuity
      expect(secondResult.emotionalArc.finalTrustScore).toBeGreaterThanOrEqual(
        firstResult.emotionalArc.finalTrustScore
      );
    });
  });

  describe('Webhook API Integration', () => {
    test('should handle webhook requests correctly', async () => {
      const mockRequest = {
        body: {
          userInput: {
            challenge: 'Create a bakery brand',
            tone: 'luxury',
            industry: 'bakery'
          },
          sessionId: 'webhook-test-001',
          productType: 'business_plan'
        }
      } as any;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as any;

      await handleEmotionalSovereigntyWebhook(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          sessionId: 'webhook-test-001',
          structuredIntent: expect.any(Object),
          emotionalContext: expect.any(Object),
          sparkResonance: expect.any(Object)
        })
      );
    });

    test('should handle malformed webhook requests gracefully', async () => {
      const mockRequest = {
        body: null
      } as any;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as any;

      await handleEmotionalSovereigntyWebhook(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Missing request body',
          fallback: true
        })
      );
    });
  });

  describe('Emotional Intelligence Validation', () => {
    test('should validate emotional resonance across different tones', async () => {
      const tones = ['bold', 'calm', 'playful', 'luxury', 'supportive', 'strategic'];
      
      for (const tone of tones) {
        const request = {
          userInput: {
            challenge: 'Test challenge',
            tone,
            industry: 'consulting'
          },
          sessionId: `tone-test-${tone}`,
          productType: 'business_plan'
        };

        const result = await orchestrator.processEmotionalSovereignty(request);
        
        // Each tone should produce valid emotional resonance
        expect(result.sparkResonance.overallResonance).toBeGreaterThan(0.3);
        expect(result.structuredIntent.tone.value).toBe(tone);
        expect(result.emotionalArc.finalTrustScore).toBeGreaterThan(3.0);
      }
    });

    test('should pass reversal test for stressed founder scenarios', async () => {
      const stressedFounderScenarios = [
        {
          userInput: {
            challenge: 'I have too many ideas and can\'t focus',
            tone: 'overwhelmed',
            painPoint: 'Analysis paralysis'
          },
          expectedArcType: /Recovery|Growing/
        },
        {
          userInput: {
            challenge: 'My last launch failed and I\'m scared to try again',
            tone: 'doubtful',
            painPoint: 'Fear of failure'
          },
          expectedArcType: /Recovery|Reclaimed/
        }
      ];

      for (const scenario of stressedFounderScenarios) {
        const request = {
          userInput: scenario.userInput,
          sessionId: `stressed-founder-${Date.now()}`,
          productType: 'business_plan'
        };

        const result = await orchestrator.processEmotionalSovereignty(request);
        
        // Should handle stressed scenarios with empathy
        expect(result.readyForExecution).toBe(true);
        expect(result.emotionalArc.arcType).toMatch(scenario.expectedArcType);
        
        // Reversal test: Would a stressed founder feel respected?
        expect(result.sparkResonance.selectedSpark.personalizedName).not.toContain('just');
        expect(result.sparkResonance.selectedSpark.personalizedName).not.toContain('simply');
      }
    });
  });

  describe('Make.com Integration Readiness', () => {
    test('should generate Make.com compatible webhook data', async () => {
      const request = {
        userInput: {
          challenge: 'Launch SaaS product',
          tone: 'strategic',
          industry: 'saas'
        },
        sessionId: 'make-test-001',
        productType: 'business_plan'
      };

      const result = await orchestrator.processEmotionalSovereignty(request);
      const webhookData = result.makeWebhookData;

      // Validate Make.com required fields
      expect(webhookData).toHaveProperty('sessionId');
      expect(webhookData).toHaveProperty('structuredIntent');
      expect(webhookData).toHaveProperty('emotionalContext');
      expect(webhookData).toHaveProperty('sparkResonance');
      expect(webhookData).toHaveProperty('emotionalArcType');
      expect(webhookData).toHaveProperty('finalTrustScore');
      expect(webhookData).toHaveProperty('timestamp');

      // Validate data types for Make.com compatibility
      expect(typeof webhookData.sparkResonance).toBe('number');
      expect(typeof webhookData.finalTrustScore).toBe('number');
      expect(typeof webhookData.emotionalDelta).toBe('number');
      expect(typeof webhookData.usedEmotionalMemory).toBe('boolean');
    });

    test('should handle Make.com scenario routing based on trust score', async () => {
      // High trust scenario
      const highTrustRequest = {
        userInput: {
          challenge: 'Scale my successful coffee business',
          tone: 'confident',
          industry: 'coffee'
        },
        sessionId: 'high-trust-test',
        productType: 'business_plan'
      };

      const highTrustResult = await orchestrator.processEmotionalSovereignty(highTrustRequest);
      
      // Should route to high-trust content generation
      expect(highTrustResult.emotionalArc.finalTrustScore).toBeGreaterThanOrEqual(4.2);
      expect(highTrustResult.readyForExecution).toBe(true);

      // Low trust scenario
      const lowTrustRequest = {
        userInput: {
          challenge: '',
          tone: '',
          industry: ''
        },
        sessionId: 'low-trust-test',
        productType: 'business_plan'
      };

      const lowTrustResult = await orchestrator.processEmotionalSovereignty(lowTrustRequest);
      
      // Should route to recovery flow
      expect(lowTrustResult.emotionalArc.finalTrustScore).toBeLessThan(4.2);
      expect(lowTrustResult.emotionalArc.arcType).toMatch(/Recovery|Needs Recovery/);
    });
  });

  describe('Event Bus Integration', () => {
    test('should emit proper events throughout the flow', async () => {
      const events: any[] = [];
      
      // Set up event listeners for testing
      eventBus.on('emotional-sovereignty-started', async (data) => { events.push({ type: 'started', data }); });
      eventBus.on('emotional-sovereignty-completed', async (data) => { events.push({ type: 'completed', data }); });
      eventBus.on('EMOTIONAL_SOVEREIGNTY_SUCCESS', async (data) => { events.push({ type: 'success', data }); });

      const request = {
        userInput: {
          challenge: 'Test event flow',
          tone: 'strategic',
          industry: 'consulting'
        },
        sessionId: 'event-test-001',
        productType: 'business_plan'
      };

      await orchestrator.processEmotionalSovereignty(request);

      // Validate events were emitted
      expect(events).toHaveLength(3);
      expect(events[0].type).toBe('started');
      expect(events[1].type).toBe('completed');
      expect(events[2].type).toBe('success');
      
      // Validate event data
      expect(events[0].data.sessionId).toBe(request.sessionId);
      expect(events[1].data.sessionId).toBe(request.sessionId);
      expect(events[2].data.sessionId).toBe(request.sessionId);
    });
  });

  describe('Performance and Reliability', () => {
    test('should complete processing within acceptable time limits', async () => {
      const startTime = Date.now();
      
      const request = {
        userInput: {
          challenge: 'Performance test challenge',
          tone: 'strategic',
          industry: 'consulting'
        },
        sessionId: 'performance-test',
        productType: 'business_plan'
      };

      const result = await orchestrator.processEmotionalSovereignty(request);
      
      const processingTime = Date.now() - startTime;
      
      // Should complete within 5 seconds
      expect(processingTime).toBeLessThan(5000);
      expect(result.readyForExecution).toBe(true);
    });

    test('should handle concurrent requests without conflicts', async () => {
      const requests = Array.from({ length: 5 }, (_, i) => ({
        userInput: {
          challenge: `Concurrent test ${i}`,
          tone: 'strategic',
          industry: 'consulting'
        },
        sessionId: `concurrent-test-${i}`,
        productType: 'business_plan'
      }));

      const results = await Promise.all(
        requests.map(request => orchestrator.processEmotionalSovereignty(request))
      );

      // All requests should succeed
      results.forEach((result, index) => {
        expect(result.readyForExecution).toBe(true);
        expect(result.makeWebhookData.sessionId).toBe(`concurrent-test-${index}`);
      });
    });
  });
}); 