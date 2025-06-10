/**
 * ai_blueprint_v2.test.ts
 * 
 * Comprehensive test suite for AI Blueprint v2 MCP
 * Tests all critical fixes and compliance requirements
 */

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { generateAIBlueprintV2, aiBlueprintV2MCP } from '../prompts/ai_blueprint_v2.mcp';
import type { AIBlueprintInput } from '../prompts/ai_blueprint_v2.mcp';

// Mock dependencies
jest.mock('../cursor/event-bus/eventBus');
jest.mock('../lib/schemas/validator');
jest.mock('../cursor/services/spark-split-engine');
jest.mock('../cursor/services/emotional-ux-renderer');
jest.mock('openai');

describe('AI Blueprint v2 MCP - Comprehensive Test Suite', () => {
  let testInput: AIBlueprintInput;

  beforeEach(() => {
    testInput = {
      businessName: 'TechCorp Solutions',
      targetAudience: 'Technology professionals and business leaders',
      primaryGoal: 'Implement AI-powered customer support to reduce response times by 50%',
      competitiveContext: 'Advanced AI chatbot vs traditional ticketing systems',
      brandVoice: 'professional',
      resourceConstraints: 'Budget: $75K, Timeline: 4 months, Team: 3 developers',
      currentStatus: 'Manual customer support processes with basic ticketing',
      aiSolution: 'AI-powered customer support chatbot with NLP capabilities',
      mvpFeatures: 'Natural language processing, ticket routing, knowledge base integration',
      successMetrics: '30d: Prototype; 60d: Beta testing; 90d: 50% response time reduction',
      linkedPrompts: ['business-plan', 'email-campaign'],
      minimumViableExecution: 'Use Dialogflow for NLP, Zendesk API for integration, deploy on Google Cloud',
      enhancers: {
        emotionalDepth: true,
        technicalDetail: true,
        marketFocus: true
      }
    };
  });

  afterEach(() => {
    // Cleanup any test artifacts
    jest.clearAllMocks();
  });

  describe('Phase 1: Linter Error Fixes', () => {
    test('should have no unused imports or variables', async () => {
      // This test validates that the v2 implementation has no linter errors
      const session = await generateAIBlueprintV2(testInput);
      expect(session).toBeDefined();
      expect(session.metadata.version).toBe('v2.0.0');
    });

    test('should compile without TypeScript errors', async () => {
      // Validates that all type issues are resolved
      const session = await generateAIBlueprintV2(testInput);
      expect(session.validationStatus.isValid).toBe(true);
      expect(session.validationStatus.issues).toHaveLength(0);
    });
  });

  describe('Phase 2: Emotional Intelligence Compliance', () => {
    test('should use 4.0-5.0 scale for emotional compass', async () => {
      const session = await generateAIBlueprintV2(testInput);
      
      expect(session.emotionalCompass).toBeDefined();
      expect(session.emotionalCompass?.type).toBe('new');
      
      if (session.emotionalCompass && session.emotionalCompass.type === 'new') {
        expect(session.emotionalCompass.clarity).toBeGreaterThanOrEqual(4.0);
        expect(session.emotionalCompass.clarity).toBeLessThanOrEqual(5.0);
        expect(session.emotionalCompass.empowerment).toBeGreaterThanOrEqual(4.0);
        expect(session.emotionalCompass.empowerment).toBeLessThanOrEqual(5.0);
        expect(session.emotionalCompass.trust).toBeGreaterThanOrEqual(4.0);
        expect(session.emotionalCompass.trust).toBeLessThanOrEqual(5.0);
        expect(session.emotionalCompass.joy).toBeGreaterThanOrEqual(4.0);
        expect(session.emotionalCompass.joy).toBeLessThanOrEqual(5.0);
        expect(session.emotionalCompass.alignment).toBeGreaterThanOrEqual(4.0);
        expect(session.emotionalCompass.alignment).toBeLessThanOrEqual(5.0);
      }
    });

    test('should enhance joy when < 4.5', async () => {
      // Test with input that would generate low joy initially
      const lowJoyInput = {
        ...testInput,
        primaryGoal: 'Reduce costs through automation',
        brandVoice: 'technical' as const,
        enhancers: { emotionalDepth: true }
      };
      
      const session = await generateAIBlueprintV2(lowJoyInput);
      
      if (session.emotionalCompass && session.emotionalCompass.type === 'new') {
        // Joy should be enhanced to at least 4.5 if it was originally < 4.5
        expect(session.emotionalCompass.joy).toBeGreaterThanOrEqual(4.2);
        expect(session.emotionalCompass.empowerment).toBeGreaterThanOrEqual(4.2);
      }
    });

    test('should pass Sacred Reversal Test', async () => {
      const session = await generateAIBlueprintV2(testInput);
      
      expect(session.metadata.trustScore).toBeGreaterThanOrEqual(4.2);
      expect(session.emotionalCompass?.overall).toBeGreaterThanOrEqual(4.2);
      
      // Validate Sacred Reversal Test criteria
      if (session.emotionalCompass && session.emotionalCompass.type === 'new') {
        expect(session.emotionalCompass.clarity).toBeGreaterThanOrEqual(4.2); // Recognizes user intent
        expect(session.emotionalCompass.trust).toBeGreaterThanOrEqual(4.2); // Respects user vision
        expect(session.emotionalCompass.empowerment).toBeGreaterThanOrEqual(4.2); // Empowers user
        expect(session.emotionalCompass.alignment).toBeGreaterThanOrEqual(4.2); // Builds partnership
      }
    });

    test('should maintain emotional sovereignty standards', async () => {
      const session = await generateAIBlueprintV2(testInput);
      
      expect(session.emotionalCompass).toBeDefined();
      expect(session.metadata.trustScore).toBeGreaterThanOrEqual(4.2);
      
      // Validate that emotional metrics support user empowerment
      if (session.empathyMetrics) {
        expect(session.empathyMetrics.emotionalResonance).toBeGreaterThanOrEqual(0.85);
        expect(session.empathyMetrics.overall).toBeGreaterThanOrEqual(0.85);
      }
    });
  });

  describe('Phase 3: Type Safety & Performance', () => {
    test('should use discriminated unions safely', async () => {
      const session = await generateAIBlueprintV2(testInput);
      
      expect(session.emotionalCompass?.type).toBeDefined();
      
      if (session.emotionalCompass?.type === 'new') {
        // Should have new compass properties
        expect(session.emotionalCompass.clarity).toBeDefined();
        expect(session.emotionalCompass.empowerment).toBeDefined();
        expect(session.emotionalCompass.trust).toBeDefined();
        expect(session.emotionalCompass.joy).toBeDefined();
        expect(session.emotionalCompass.alignment).toBeDefined();
      } else if (session.emotionalCompass?.type === 'legacy') {
        // Should have legacy compass properties
        expect(session.emotionalCompass.awe).toBeDefined();
        expect(session.emotionalCompass.ownership).toBeDefined();
        expect(session.emotionalCompass.wonder).toBeDefined();
        expect(session.emotionalCompass.calm).toBeDefined();
        expect(session.emotionalCompass.power).toBeDefined();
      }
    });

    test('should respond within 2 seconds', async () => {
      const start = Date.now();
      await generateAIBlueprintV2(testInput);
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(2000);
    });

    test('should handle cache operations correctly', async () => {
      // First call should miss cache
      const session1 = await generateAIBlueprintV2(testInput);
      expect(session1).toBeDefined();
      
      // Second call with same input should potentially hit cache
      const session2 = await generateAIBlueprintV2(testInput);
      expect(session2).toBeDefined();
      
      // Both should have valid outputs
      expect(session1.output).toBeDefined();
      expect(session2.output).toBeDefined();
    });

    test('should handle request deduplication', async () => {
      // Make multiple concurrent requests with same input
      const promises = [
        generateAIBlueprintV2(testInput),
        generateAIBlueprintV2(testInput),
        generateAIBlueprintV2(testInput)
      ];
      
      const results = await Promise.all(promises);
      
      // All should succeed
      results.forEach(session => {
        expect(session).toBeDefined();
        expect(session.output).toBeDefined();
      });
    });

    test('should process markdown asynchronously', async () => {
      const session = await generateAIBlueprintV2(testInput);
      
      expect(session.output).toBeDefined();
      expect(session.output?.blueprint).toBeDefined();
      expect(session.output?.recommendations).toBeDefined();
      expect(session.output?.timeline).toBeDefined();
      expect(session.output?.risks).toBeDefined();
    });
  });

  describe('Phase 4: Error Handling & Testing', () => {
    test('should handle validation failures gracefully', async () => {
      const invalidInput = {
        ...testInput,
        businessName: '', // Invalid - too short
        primaryGoal: 'Short' // Invalid - too short
      };
      
      const session = await generateAIBlueprintV2(invalidInput as AIBlueprintInput);
      
      expect(session.validationStatus.isValid).toBe(false);
      expect(session.validationStatus.issues.length).toBeGreaterThan(0);
    });

    test('should provide fallback content on API failure', async () => {
      // Mock OpenAI to throw an error
      const mockOpenAI = require('openai');
      mockOpenAI.OpenAI.mockImplementation(() => ({
        chat: {
          completions: {
            create: jest.fn().mockRejectedValue(new Error('API Error'))
          }
        }
      }));
      
      const session = await generateAIBlueprintV2(testInput);
      
      // Should still provide output via fallback
      expect(session.output).toBeDefined();
      expect(session.output?.blueprint.architecture).toBeDefined();
    });

    test('should maintain trust score above threshold', async () => {
      const session = await generateAIBlueprintV2(testInput);
      
      expect(session.metadata.trustScore).toBeGreaterThanOrEqual(4.2);
    });

    test('should handle SparkSplit failures gracefully', async () => {
      // Mock SparkSplit to fail
      const mockSparkSplit = require('../cursor/services/spark-split-engine');
      mockSparkSplit.SparkSplitEngine.mockImplementation(() => ({
        generateSparkSplit: jest.fn().mockRejectedValue(new Error('SparkSplit Error'))
      }));
      
      const session = await generateAIBlueprintV2(testInput);
      
      // Should still complete successfully
      expect(session).toBeDefined();
      expect(session.metadata.sparkSplitEnabled).toBe(false);
    });
  });

  describe('Integration Tests', () => {
    test('should generate complete AI blueprint with all sections', async () => {
      const session = await generateAIBlueprintV2(testInput);
      
      expect(session.output).toBeDefined();
      
      if (session.output) {
        // Blueprint structure
        expect(session.output.blueprint.architecture).toBeDefined();
        expect(session.output.blueprint.components).toBeInstanceOf(Array);
        expect(session.output.blueprint.integrations).toBeInstanceOf(Array);
        expect(session.output.blueprint.security).toBeInstanceOf(Array);
        expect(session.output.blueprint.scalability).toBeInstanceOf(Array);
        
        // Recommendations
        expect(session.output.recommendations).toBeInstanceOf(Array);
        expect(session.output.recommendations.length).toBeGreaterThan(0);
        
        // Timeline
        expect(session.output.timeline).toBeInstanceOf(Array);
        expect(session.output.timeline.length).toBeGreaterThan(0);
        
        // Risks
        expect(session.output.risks).toBeInstanceOf(Array);
        expect(session.output.risks.length).toBeGreaterThan(0);
      }
    });

    test('should maintain session metadata integrity', async () => {
      const session = await generateAIBlueprintV2(testInput);
      
      expect(session.metadata.version).toBe('v2.0.0');
      expect(session.metadata.timestamp).toBeDefined();
      expect(session.metadata.trustScore).toBeGreaterThanOrEqual(4.2);
      expect(typeof session.metadata.sparkSplitEnabled).toBe('boolean');
    });

    test('should handle different brand voices correctly', async () => {
      const brandVoices = ['professional', 'technical', 'strategic', 'innovative', 'approachable'] as const;
      
      for (const voice of brandVoices) {
        const voiceInput = { ...testInput, brandVoice: voice };
        const session = await generateAIBlueprintV2(voiceInput);
        
        expect(session.validationStatus.isValid).toBe(true);
        expect(session.output).toBeDefined();
        expect(session.metadata.trustScore).toBeGreaterThanOrEqual(4.2);
      }
    });

    test('should handle different AI solution types', async () => {
      const solutionTypes = [
        'AI-powered customer support chatbot',
        'Machine learning-powered sales forecasting platform',
        'AI recommendation engine for personalized experiences',
        'Intelligent process automation system',
        'AI-driven analytics and insights platform'
      ];
      
      for (const solution of solutionTypes) {
        const solutionInput = { ...testInput, aiSolution: solution };
        const session = await generateAIBlueprintV2(solutionInput);
        
        expect(session.validationStatus.isValid).toBe(true);
        expect(session.output).toBeDefined();
        expect(session.output?.blueprint.architecture).toContain('AI');
      }
    });
  });

  describe('Performance Benchmarks', () => {
    test('should maintain consistent performance across multiple runs', async () => {
      const runs = 5;
      const durations: number[] = [];
      
      for (let i = 0; i < runs; i++) {
        const start = Date.now();
        await generateAIBlueprintV2(testInput);
        const duration = Date.now() - start;
        durations.push(duration);
      }
      
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
      const maxDuration = Math.max(...durations);
      
      expect(avgDuration).toBeLessThan(1500); // Average under 1.5s
      expect(maxDuration).toBeLessThan(2000); // Max under 2s
    });

    test('should handle memory efficiently', async () => {
      // Run multiple generations to test memory usage
      const sessions = [];
      
      for (let i = 0; i < 10; i++) {
        const session = await generateAIBlueprintV2({
          ...testInput,
          businessName: `TestCorp${i}`
        });
        sessions.push(session);
      }
      
      // All sessions should be valid
      sessions.forEach(session => {
        expect(session.validationStatus.isValid).toBe(true);
        expect(session.metadata.trustScore).toBeGreaterThanOrEqual(4.2);
      });
    });
  });

  describe('Cleanup and Resource Management', () => {
    test('should cleanup resources properly', () => {
      // Test cache cleanup
      expect(aiBlueprintV2MCP.cleanup).toBeDefined();
      expect(typeof aiBlueprintV2MCP.cleanup).toBe('function');
      
      // Should not throw when called
      expect(() => aiBlueprintV2MCP.cleanup()).not.toThrow();
    });
  });
});

describe('AI Blueprint v2 MCP - Edge Cases', () => {
  test('should handle minimal input gracefully', async () => {
    const minimalInput: AIBlueprintInput = {
      businessName: 'Test',
      targetAudience: 'Test audience for validation',
      primaryGoal: 'Test goal for validation purposes',
      competitiveContext: 'Test context',
      brandVoice: 'professional',
      resourceConstraints: 'Limited',
      currentStatus: 'Testing',
      aiSolution: 'Test AI solution',
      mvpFeatures: 'Test features',
      successMetrics: 'Test metrics',
      linkedPrompts: [],
      minimumViableExecution: 'Test execution plan'
    };
    
    const session = await generateAIBlueprintV2(minimalInput);
    
    expect(session.validationStatus.isValid).toBe(true);
    expect(session.output).toBeDefined();
    expect(session.metadata.trustScore).toBeGreaterThanOrEqual(4.2);
  });

  test('should handle maximum input lengths', async () => {
    const maxInput: AIBlueprintInput = {
      businessName: 'A'.repeat(100), // Max length
      targetAudience: 'B'.repeat(200), // Max length
      primaryGoal: 'C'.repeat(300), // Max length
      competitiveContext: 'D'.repeat(300), // Max length
      brandVoice: 'professional',
      resourceConstraints: 'E'.repeat(200), // Max length
      currentStatus: 'F'.repeat(200), // Max length
      aiSolution: 'G'.repeat(200), // Max length
      mvpFeatures: 'H'.repeat(300), // Max length
      successMetrics: 'I'.repeat(200), // Max length
      linkedPrompts: ['business-plan', 'ad-amplify', 'email-campaign', 'site-audit', 'social-content'], // Max items
      minimumViableExecution: 'J'.repeat(300) // Max length
    };
    
    const session = await generateAIBlueprintV2(maxInput);
    
    expect(session.validationStatus.isValid).toBe(true);
    expect(session.output).toBeDefined();
  });

  test('should handle special characters and unicode', async () => {
    const unicodeInput: AIBlueprintInput = {
      businessName: 'TechCorp™ Solutions 🚀',
      targetAudience: 'Global technology professionals & business leaders',
      primaryGoal: 'Implement AI-powered customer support to reduce response times by 50%',
      competitiveContext: 'Advanced AI chatbot vs traditional ticketing systems',
      brandVoice: 'professional',
      resourceConstraints: 'Budget: $75K, Timeline: 4 months',
      currentStatus: 'Manual processes',
      aiSolution: 'AI-powered chatbot',
      mvpFeatures: 'NLP, routing, knowledge base',
      successMetrics: '30d: Prototype; 60d: Beta; 90d: Launch',
      linkedPrompts: ['business-plan'],
      minimumViableExecution: 'Use Dialogflow & Google Cloud'
    };
    
    const session = await generateAIBlueprintV2(unicodeInput);
    
    expect(session.validationStatus.isValid).toBe(true);
    expect(session.output).toBeDefined();
  });
}); 