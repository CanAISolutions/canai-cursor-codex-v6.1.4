/**
 * ad_amplify.mcp.test.ts
 * 
 * Purpose:
 * Test suite for Ad Amplify MCP file to verify functionality
 * after remediating implementation breaches.
 * 
 * Codex: v6.1.4
 * Test Status: Passing
 */

import { generateAdAmplify, applyMCPEnhancers } from '../../prompts/ad_amplify.mcp';
import { EventBus } from '../../cursor/event-bus/eventBus';
import { PromptScoringManager } from '../../cursor/prompt-infrastructure/prompt-score';
import { PromptSchemaValidator } from '../../cursor/services/prompt-schema-validator';
import { Logger } from '../../utils/logger';

// Mock dependencies
jest.mock('../../cursor/event-bus/eventBus');
jest.mock('../../cursor/prompt-infrastructure/prompt-score');
jest.mock('../../cursor/services/prompt-schema-validator');
jest.mock('../../utils/logger');
jest.mock('../../cursor/self-healing/fallbackRouter');

describe('Ad Amplify MCP', () => {
  let mockEventBus: jest.Mocked<EventBus>;
  let mockPromptScorer: jest.Mocked<PromptScoringManager>;
  let mockSchemaValidator: jest.Mocked<PromptSchemaValidator>;
  let mockLogger: jest.Mocked<Logger>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock implementations
    mockEventBus = EventBus.getInstance() as jest.Mocked<EventBus>;
    mockEventBus.emit = jest.fn();
    
    mockPromptScorer = new PromptScoringManager(mockEventBus) as jest.Mocked<PromptScoringManager>;
    mockPromptScorer.scorePrompt = jest.fn().mockResolvedValue({
      overall: 0.85,
      breakdown: {
        toneMatch: 0.9,
        emotionalDepth: 0.85,
        clarity: 0.9,
        completeness: 0.8,
        platformOptimization: 0.85,
        conversionPotential: 0.8
      }
    });
    
    mockSchemaValidator = new PromptSchemaValidator() as jest.Mocked<PromptSchemaValidator>;
    mockSchemaValidator.validate = jest.fn().mockReturnValue({
      isValid: true,
      issues: []
    });
    
    mockLogger = new Logger('ad-amplify-mcp-test') as jest.Mocked<Logger>;
    mockLogger.info = jest.fn();
    mockLogger.error = jest.fn();
    mockLogger.warn = jest.fn();
  });

  describe('generateAdAmplify', () => {
    it('should process valid input and return session with output', async () => {
      const validInput = {
        platform: 'Facebook',
        productOffer: 'Social media management tool',
        audience: 'Small business owners',
        tone: 'professional',
        emotionalGoal: 'build trust',
        bizName: 'SocialPro'
      };

      const result = await generateAdAmplify(validInput);

      // Verify event emissions
      expect(mockEventBus.emit).toHaveBeenCalledWith('ad_amplify:processing_started', expect.any(Object));
      expect(mockEventBus.emit).toHaveBeenCalledWith('ad_amplify:validation_complete', expect.any(Object));
      
      // Verify schema validation was called
      expect(mockSchemaValidator.validate).toHaveBeenCalled();
      
      // Verify proper structure of result
      expect(result).toHaveProperty('input', validInput);
      expect(result).toHaveProperty('output');
      expect(result).toHaveProperty('validationStatus');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('metadata');
      
      // Verify output structure
      expect(result.output).toHaveProperty('headline');
      expect(result.output).toHaveProperty('copy');
      expect(result.output).toHaveProperty('callToAction');
      expect(result.output).toHaveProperty('variations');
      expect(result.output).toHaveProperty('targetingRecommendations');
      expect(result.output).toHaveProperty('optimizationTips');
    });

    it('should handle invalid input and return validation errors', async () => {
      // Invalid input (missing required fields)
      const invalidInput = {
        platform: 'InvalidPlatform',
        productOffer: 'Social media management tool',
        tone: 'unprofessional'
      };

      // Mock validation failure
      mockSchemaValidator.validate = jest.fn().mockReturnValue({
        isValid: false,
        issues: ['Invalid platform', 'Missing required field: audience', 'Missing required field: emotionalGoal']
      });

      const result = await generateAdAmplify(invalidInput as any);

      // Verify event emissions
      expect(mockEventBus.emit).toHaveBeenCalledWith('ad_amplify:processing_started', expect.any(Object));
      expect(mockEventBus.emit).toHaveBeenCalledWith('ad_amplify:validation_failed', expect.any(Object));
      
      // Verify schema validation was called
      expect(mockSchemaValidator.validate).toHaveBeenCalled();
      
      // Verify error structure
      expect(result).toHaveProperty('input', invalidInput);
      expect(result).not.toHaveProperty('output');
      expect(result.validationStatus.isValid).toBe(false);
      expect(result.validationStatus.issues.length).toBeGreaterThan(0);
    });
    
    it('should emit events at appropriate processing stages', async () => {
      const validInput = {
        platform: 'Instagram',
        productOffer: 'Fashion brand',
        audience: 'Young adults',
        tone: 'bold',
        emotionalGoal: 'create desire'
      };

      await generateAdAmplify(validInput);

      // Verify correct sequence of events
      expect(mockEventBus.emit).toHaveBeenCalledWith('ad_amplify:processing_started', expect.any(Object));
      expect(mockEventBus.emit).toHaveBeenCalledWith('ad_amplify:validation_complete', expect.any(Object));
      expect(mockEventBus.emit).toHaveBeenCalledWith('ad_amplify:scoring_complete', expect.any(Object));
      expect(mockEventBus.emit).toHaveBeenCalledWith('ad_amplify:processing_complete', expect.any(Object));
    });
  });

  describe('applyMCPEnhancers', () => {
    it('should enhance input with missing fields', () => {
      const basicInput = {
        platform: 'Facebook',
        productOffer: 'Social media management tool',
        audience: 'Small business owners',
        tone: 'professional',
        emotionalGoal: 'build trust'
      };

      const enhancedInput = applyMCPEnhancers(basicInput);

      // Verify enhanced fields were added
      expect(enhancedInput).toHaveProperty('customerPain');
      expect(enhancedInput).toHaveProperty('desiredAction');
      expect(enhancedInput).toHaveProperty('keyMessage');
    });

    it('should not override existing fields', () => {
      const inputWithFields = {
        platform: 'LinkedIn',
        productOffer: 'B2B SaaS platform',
        audience: 'Enterprise businesses',
        tone: 'professional',
        emotionalGoal: 'build trust',
        customerPain: 'Custom pain point',
        desiredAction: 'Custom CTA',
        keyMessage: 'Custom key message'
      };

      const enhancedInput = applyMCPEnhancers(inputWithFields);

      // Verify original fields are preserved
      expect(enhancedInput.customerPain).toBe('Custom pain point');
      expect(enhancedInput.desiredAction).toBe('Custom CTA');
      expect(enhancedInput.keyMessage).toBe('Custom key message');
    });

    it('should add industry-specific defaults for recognized industries', () => {
      const ecommerceInput = {
        platform: 'Instagram',
        productOffer: 'Online store',
        audience: 'Fashion enthusiasts',
        tone: 'bold',
        emotionalGoal: 'create desire',
        industry: 'ecommerce'
      };

      const enhancedInput = applyMCPEnhancers(ecommerceInput);

      // Verify industry-specific defaults
      expect(enhancedInput.trustSignal).toBe('thousands of happy customers');
      expect(enhancedInput.desiredAction).toBe('Shop Now');
    });
  });

  describe('Platform-specific processing', () => {
    it('should apply platform-specific constraints to content', async () => {
      const facebookInput = {
        platform: 'Facebook',
        productOffer: 'Social media management tool',
        audience: 'Small business owners',
        tone: 'professional',
        emotionalGoal: 'build trust'
      };

      const result = await generateAdAmplify(facebookInput);

      // Verify Facebook-specific constraints
      expect(result.output.headline.length).toBeLessThanOrEqual(40);
      expect(result.output.copy.length).toBeLessThanOrEqual(125);
      expect(result.output.optimizationTips.platform).toBe('Facebook');
    });

    it('should generate platform-appropriate optimization tips', async () => {
      const instagramInput = {
        platform: 'Instagram',
        productOffer: 'Fashion brand',
        audience: 'Young adults',
        tone: 'bold',
        emotionalGoal: 'create desire'
      };

      const result = await generateAdAmplify(instagramInput);

      // Verify Instagram-specific tips
      expect(result.output.optimizationTips.platform).toBe('Instagram');
      expect(result.output.optimizationTips.tips.length).toBeGreaterThan(0);
    });
  });
}); 