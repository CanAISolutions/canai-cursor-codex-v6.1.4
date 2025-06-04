/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Security with Emotional Grace Tests"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Test security systems that build trust instead of breaking it
 */

import { AdaptiveSecurityEngine } from '../../src/security-intelligence/adaptive-security-engine';
import { EmotionalSecurityValidator } from '../../src/security-intelligence/emotional-security-validator';
import { PerformanceMonitor } from '../../cursor/services/performance-monitor';
import { TrustMetricsCollector } from '../../src/cursor/trust/trust-metrics-collector';

describe('Security with Emotional Grace', () => {
  let securityEngine: AdaptiveSecurityEngine;
  let securityValidator: EmotionalSecurityValidator;
  let performanceMonitor: PerformanceMonitor;
  let trustCollector: TrustMetricsCollector;

  beforeEach(() => {
    securityEngine = new AdaptiveSecurityEngine({
      adaptiveLearning: true,
      emotionalPreservation: true,
      trustBuilding: true
    });
    
    securityValidator = new EmotionalSecurityValidator({
      culturalSensitivity: true,
      educationalApproach: true,
      gracefulHandling: true
    });
    
    performanceMonitor = PerformanceMonitor.getInstance();
    trustCollector = new TrustMetricsCollector();
  });

  describe('Adaptive Security Learning', () => {
    test('should learn user patterns while preserving UX', async () => {
      performanceMonitor.startSession('adaptive-security-learning');
      
      const userBehaviorPatterns = [
        {
          userId: 'user_001',
          patterns: [
            { action: 'login', time: '09:00', location: 'office', frequency: 'daily' },
            { action: 'api_call', endpoint: '/dashboard', rate: 50, timeWindow: '1h' },
            { action: 'file_upload', size: '2MB', type: 'document' }
          ],
          emotionalState: 'focused',
          trustLevel: 4.5
        },
        {
          userId: 'user_002',
          patterns: [
            { action: 'login', time: '14:00', location: 'home', frequency: 'weekly' },
            { action: 'api_call', endpoint: '/reports', rate: 10, timeWindow: '1h' },
            { action: 'data_export', size: '500KB', type: 'csv' }
          ],
          emotionalState: 'relaxed',
          trustLevel: 4.2
        }
      ];
      
      for (const userPattern of userBehaviorPatterns) {
        const learningResult = await securityEngine.learnUserPattern(
          userPattern.userId,
          userPattern.patterns,
          {
            emotionalState: userPattern.emotionalState,
            trustLevel: userPattern.trustLevel,
            preserveUX: true
          }
        );
        
        expect(learningResult).toMatchObject({
          patternLearned: true,
          uxPreserved: true,
          adaptationApplied: true,
          emotionalImpact: expect.any(Number),
          trustImpact: expect.any(Number)
        });
        
        // UX preservation should maintain positive emotional impact
        expect(learningResult.emotionalImpact).toBeGreaterThan(0);
        expect(learningResult.trustImpact).toBeGreaterThanOrEqual(0);
        
        // Verify pattern recognition accuracy
        const recognitionResult = await securityEngine.recognizeUserPattern(
          userPattern.userId,
          userPattern.patterns[0]
        );
        
        expect(recognitionResult.confidence).toBeGreaterThan(0.8);
        expect(recognitionResult.isKnownPattern).toBe(true);
      }
      
      const sessionDuration = performanceMonitor.endSession();
      expect(sessionDuration).toBeLessThan(3000); // Under 3 seconds
    });
    
    test('should adapt security sensitivity based on context', async () => {
      const contextScenarios = [
        {
          context: 'high_security_operation',
          userType: 'admin',
          emotionalState: 'stressed',
          expectedSensitivity: 'high',
          expectedSupport: true
        },
        {
          context: 'routine_operation',
          userType: 'regular_user',
          emotionalState: 'calm',
          expectedSensitivity: 'moderate',
          expectedSupport: false
        },
        {
          context: 'emergency_access',
          userType: 'emergency_responder',
          emotionalState: 'urgent',
          expectedSensitivity: 'adaptive',
          expectedSupport: true
        }
      ];
      
      for (const scenario of contextScenarios) {
        const adaptationResult = await securityEngine.adaptSecuritySensitivity(
          scenario.context,
          {
            userType: scenario.userType,
            emotionalState: scenario.emotionalState,
            preserveEmotionalWellbeing: true
          }
        );
        
        expect(adaptationResult).toMatchObject({
          sensitivityLevel: scenario.expectedSensitivity,
          emotionalSupport: scenario.expectedSupport,
          contextuallyAppropriate: true,
          adaptationReason: expect.any(String)
        });
        
        // Verify emotional preservation
        expect(adaptationResult.emotionalPreservation).toBeGreaterThan(0.8);
      }
    });
  });

  describe('Progressive Rate Limit Escalation', () => {
    test('should implement graceful rate limiting with emotional awareness', async () => {
      const rateLimitScenarios = [
        {
          userId: 'user_001',
          requestCount: 45,
          timeWindow: '1m',
          limit: 50,
          emotionalState: 'frustrated',
          expectedAction: 'gentle_warning'
        },
        {
          userId: 'user_002',
          requestCount: 55,
          timeWindow: '1m',
          limit: 50,
          emotionalState: 'calm',
          expectedAction: 'educational_limit'
        },
        {
          userId: 'user_003',
          requestCount: 75,
          timeWindow: '1m',
          limit: 50,
          emotionalState: 'anxious',
          expectedAction: 'supportive_limit'
        }
      ];
      
      for (const scenario of rateLimitScenarios) {
        const limitResult = await securityEngine.applyProgressiveRateLimit(
          scenario.userId,
          scenario.requestCount,
          scenario.timeWindow,
          {
            limit: scenario.limit,
            emotionalState: scenario.emotionalState,
            gracefulEscalation: true
          }
        );
        
        expect(limitResult).toMatchObject({
          action: scenario.expectedAction,
          emotionallyAware: true,
          educationalContent: expect.any(String),
          trustPreservation: expect.any(Number),
          recoveryPath: expect.any(String)
        });
        
        // Trust preservation should be high even during limiting
        expect(limitResult.trustPreservation).toBeGreaterThan(0.7);
        
        // Educational content should be provided
        expect(limitResult.educationalContent.length).toBeGreaterThan(0);
      }
    });
    
    test('should celebrate rate limit recovery', async () => {
      const recoveryScenarios = [
        {
          userId: 'user_001',
          previousViolations: 3,
          recoveryPeriod: '24h',
          currentBehavior: 'compliant',
          expectedCelebration: true
        },
        {
          userId: 'user_002',
          previousViolations: 1,
          recoveryPeriod: '1h',
          currentBehavior: 'improved',
          expectedCelebration: true
        }
      ];
      
      for (const scenario of recoveryScenarios) {
        const celebrationResult = await securityEngine.celebrateRecovery(
          scenario.userId,
          {
            previousViolations: scenario.previousViolations,
            recoveryPeriod: scenario.recoveryPeriod,
            currentBehavior: scenario.currentBehavior,
            buildTrust: true
          }
        );
        
        expect(celebrationResult).toMatchObject({
          celebrationTriggered: scenario.expectedCelebration,
          trustBoost: expect.any(Number),
          encouragementMessage: expect.any(String),
          recoveryAcknowledged: true
        });
        
        if (scenario.expectedCelebration) {
          expect(celebrationResult.trustBoost).toBeGreaterThan(0.1);
          expect(celebrationResult.encouragementMessage.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Security Education Integration', () => {
    test('should transform security events into learning opportunities', async () => {
      const securityEvents = [
        {
          type: 'suspicious_login',
          severity: 'medium',
          userContext: { experience: 'novice', emotionalState: 'confused' },
          expectedEducation: true
        },
        {
          type: 'rate_limit_exceeded',
          severity: 'low',
          userContext: { experience: 'intermediate', emotionalState: 'frustrated' },
          expectedEducation: true
        },
        {
          type: 'invalid_token',
          severity: 'high',
          userContext: { experience: 'expert', emotionalState: 'focused' },
          expectedEducation: false
        }
      ];
      
      for (const event of securityEvents) {
        const educationResult = await securityValidator.transformToLearningOpportunity(
          event.type,
          event.severity,
          event.userContext
        );
        
        expect(educationResult).toMatchObject({
          educationalContent: expect.any(String),
          learningOpportunityCreated: event.expectedEducation,
          emotionallyAppropriate: true,
          actionableGuidance: expect.any(String)
        });
        
        if (event.expectedEducation) {
          expect(educationResult.educationalContent.length).toBeGreaterThan(50);
          expect(educationResult.actionableGuidance.length).toBeGreaterThan(20);
        }
        
        // Verify emotional appropriateness
        expect(educationResult.emotionalTone).toMatch(/supportive|encouraging|helpful/);
      }
    });
  });

  describe('Cultural Sarcasm Pattern Recognition', () => {
    test('should recognize cultural sarcasm patterns in security contexts', async () => {
      const sarcasticInputs = [
        {
          text: "Oh great, another security check. Just what I needed.",
          culture: 'american',
          expectedSarcasm: true,
          expectedIntent: 'frustration_with_security'
        },
        {
          text: "Brilliant security system you have here.",
          culture: 'british',
          expectedSarcasm: true,
          expectedIntent: 'criticism_of_system'
        },
        {
          text: "This security is really helping me get my work done.",
          culture: 'american',
          expectedSarcasm: true,
          expectedIntent: 'productivity_complaint'
        },
        {
          text: "Thank you for keeping our data secure.",
          culture: 'japanese',
          expectedSarcasm: false,
          expectedIntent: 'genuine_appreciation'
        }
      ];
      
      for (const input of sarcasticInputs) {
        const sarcasticResult = await securityValidator.recognizeCulturalSarcasm(
          input.text,
          input.culture,
          'security_context'
        );
        
        expect(sarcasticResult).toMatchObject({
          isSarcastic: input.expectedSarcasm,
          confidence: expect.any(Number),
          culturalContext: input.culture,
          intent: input.expectedIntent,
          emotionalUndertone: expect.any(String)
        });
        
        expect(sarcasticResult.confidence).toBeGreaterThan(0.6);
        
        if (input.expectedSarcasm) {
          expect(sarcasticResult.emotionalUndertone).toMatch(/frustration|criticism|complaint/);
        } else {
          expect(sarcasticResult.emotionalUndertone).toMatch(/appreciation|gratitude|positive/);
        }
      }
    });
    
    test('should disambiguate sarcasm intent in security scenarios', async () => {
      const ambiguousInputs = [
        {
          text: "This is exactly what I wanted to do today.",
          context: 'password_reset_required',
          culture: 'american',
          expectedDisambiguation: 'sarcastic_frustration'
        },
        {
          text: "Perfect timing for a security update.",
          context: 'urgent_deadline_approaching',
          culture: 'british',
          expectedDisambiguation: 'sarcastic_inconvenience'
        },
        {
          text: "I love these security measures.",
          context: 'routine_compliance_check',
          culture: 'canadian',
          expectedDisambiguation: 'potentially_genuine'
        }
      ];
      
      for (const input of ambiguousInputs) {
        const disambiguationResult = await securityValidator.disambiguateSarcasticIntent(
          input.text,
          input.context,
          input.culture
        );
        
        expect(disambiguationResult).toMatchObject({
          intent: input.expectedDisambiguation,
          confidence: expect.any(Number),
          contextualFactors: expect.any(Array),
          recommendedResponse: expect.any(String)
        });
        
        expect(disambiguationResult.confidence).toBeGreaterThan(0.7);
        expect(disambiguationResult.contextualFactors.length).toBeGreaterThan(0);
        expect(disambiguationResult.recommendedResponse.length).toBeGreaterThan(20);
      }
    });
  });

  describe('Contextual Rate Limit Personalization', () => {
    test('should personalize rate limits based on user context', async () => {
      const personalizationScenarios = [
        {
          userId: 'power_user_001',
          userType: 'power_user',
          emotionalState: 'focused',
          workContext: 'data_analysis',
          expectedLimit: 200,
          expectedPersonalization: true
        },
        {
          userId: 'casual_user_001',
          userType: 'casual_user',
          emotionalState: 'relaxed',
          workContext: 'browsing',
          expectedLimit: 50,
          expectedPersonalization: true
        },
        {
          userId: 'stressed_user_001',
          userType: 'regular_user',
          emotionalState: 'stressed',
          workContext: 'deadline_pressure',
          expectedLimit: 75,
          expectedPersonalization: true
        }
      ];
      
      for (const scenario of personalizationScenarios) {
        const personalizationResult = await securityEngine.personalizeRateLimit(
          scenario.userId,
          {
            userType: scenario.userType,
            emotionalState: scenario.emotionalState,
            workContext: scenario.workContext,
            adaptToEmotionalState: true
          }
        );
        
        expect(personalizationResult).toMatchObject({
          personalizedLimit: scenario.expectedLimit,
          personalizationApplied: scenario.expectedPersonalization,
          emotionalConsideration: true,
          contextualAdjustment: expect.any(String),
          rationale: expect.any(String)
        });
        
        expect(personalizationResult.personalizedLimit).toBeGreaterThan(0);
        expect(personalizationResult.rationale.length).toBeGreaterThan(20);
      }
    });
  });

  describe('Hardware Security Module Integration', () => {
    test('should integrate HSM operations with emotional grace', async () => {
      const hsmOperations = [
        {
          operation: 'key_generation',
          userContext: { experience: 'novice', emotionalState: 'anxious' },
          expectedGuidance: true,
          expectedEmotionalSupport: true
        },
        {
          operation: 'certificate_signing',
          userContext: { experience: 'expert', emotionalState: 'focused' },
          expectedGuidance: false,
          expectedEmotionalSupport: false
        },
        {
          operation: 'key_rotation',
          userContext: { experience: 'intermediate', emotionalState: 'uncertain' },
          expectedGuidance: true,
          expectedEmotionalSupport: true
        }
      ];
      
      for (const operation of hsmOperations) {
        const hsmResult = await securityValidator.integrateHSMWithEmotionalGrace(
          operation.operation,
          operation.userContext
        );
        
        expect(hsmResult).toMatchObject({
          operationSupported: true,
          emotionalGuidance: operation.expectedGuidance,
          emotionalSupport: operation.expectedEmotionalSupport,
          userFriendlyExplanation: expect.any(String),
          securityMaintained: true
        });
        
        expect(hsmResult.userFriendlyExplanation.length).toBeGreaterThan(30);
        
        if (operation.expectedGuidance) {
          expect(hsmResult.stepByStepGuidance).toBeDefined();
          expect(hsmResult.stepByStepGuidance!.length).toBeGreaterThan(0);
        }
        
        if (operation.expectedEmotionalSupport) {
          expect(hsmResult.emotionalReassurance).toBeDefined();
          expect(hsmResult.emotionalReassurance!.length).toBeGreaterThan(20);
        }
      }
    });
  });
}); 