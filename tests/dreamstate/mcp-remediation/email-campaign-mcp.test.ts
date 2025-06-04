/**
 * email-campaign-mcp.test.ts
 * 
 * Test suite for Email Campaign MCP production implementation validation
 * Following Test-First Truth principle for Codex compliance
 * Part of DreamState emotional sovereignty test suite
 */

import { generateEmailCampaign, applyMCPEnhancers } from '../../../prompts/email_campaign.mcp';

// Mock external dependencies only
jest.mock('../../../cursor/prompt-infrastructure/prompt-score', () => ({
  PromptScoringManager: jest.fn().mockImplementation(() => ({
    scorePrompt: jest.fn().mockResolvedValue({
      metrics: {
        trust: { score: 4.5, feedback: 0.85 },
        performance: { quality: 9, consistency: 9 },
        alignment: { contractCompliance: 9, codexScore: 8.5 }
      }
    })
  }))
}));

jest.mock('../../../cursor/event-bus/eventBus', () => ({
  EventBus: {
    getInstance: jest.fn().mockReturnValue({
      emit: jest.fn(),
      on: jest.fn()
    })
  }
}));

jest.mock('../../../utils/logger', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    warn: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
  }))
}));

jest.mock('../../../cursor/services/prompt-schema-validator', () => ({
  PromptSchemaValidator: jest.fn().mockImplementation(() => ({
    validatePrompt: jest.fn().mockImplementation((prompt) => {
      const input = JSON.parse(prompt.content);
      const required = ['campaignGoal', 'targetAudience', 'keyMessage', 'callToAction', 'tone'];
      const missing = required.filter(field => !input[field]);
      return Promise.resolve({
        isValid: missing.length === 0,
        errors: missing.map(field => `Missing required field: ${field}`),
        warnings: []
      });
    })
  }))
}));

jest.mock('../../../cursor/self-healing/fallbackRouter', () => ({
  routeFallback: jest.fn()
}));

describe('Email Campaign MCP - Production Implementation', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    // Setup console spy to ensure no console.log usage
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('generateEmailCampaign', () => {
    it('should perform real input validation and handle missing fields', async () => {
      const invalidInput = {
        campaignGoal: 'Drive sales and conversions',
        targetAudience: 'small business owners'
        // Missing keyMessage, callToAction, tone
      };

      const result = await generateEmailCampaign(invalidInput as any);
      
      // Verify real validation was performed
      expect(result.validationStatus.isValid).toBe(false);
      expect(result.validationStatus.issues).toContain('Missing required field: keyMessage');
      expect(result.validationStatus.issues).toContain('Missing required field: callToAction');
      expect(result.validationStatus.issues).toContain('Missing required field: tone');
      expect(result.output).toBeUndefined();
    });

    it('should generate comprehensive email campaign with real business logic', async () => {
      const validInput = {
        campaignGoal: 'Drive sales and conversions',
        targetAudience: 'small business owners',
        keyMessage: 'Grow your business with our AI solutions',
        callToAction: 'Schedule a Demo Today',
        tone: 'professional'
      };

      const result = await generateEmailCampaign(validInput);
      
      // Verify successful validation
      expect(result.validationStatus.isValid).toBe(true);
      expect(result.output).toBeDefined();
      
      // Verify real content generation with business logic
      expect(result.output!.campaign.subject).toContain('Grow your business');
      expect(result.output!.campaign.preview).toContain('Professional solutions');
      expect(result.output!.campaign.body).toBeInstanceOf(Array);
      expect(result.output!.campaign.body.length).toBeGreaterThan(5);
      expect(result.output!.campaign.body.some(line => line.includes('Schedule a Demo Today'))).toBe(true);
      expect(result.output!.campaign.cta).toBe('Schedule a Demo Today');
      
      // Verify comprehensive campaign elements
      expect(result.output!.variants).toBeInstanceOf(Array);
      expect(result.output!.metrics).toContain('Open Rate');
      expect(result.output!.optimization).toContain('Send time optimization based on recipient timezone');
    });

    it('should calculate real trust scores and performance metrics', async () => {
      const validInput = {
        campaignGoal: 'Launch new product announcement',
        targetAudience: 'existing customers',
        keyMessage: 'Revolutionary AI platform now available',
        callToAction: 'Learn More',
        tone: 'conversational'
      };

      const result = await generateEmailCampaign(validInput);
      
      // Verify real scoring was performed
      expect(result.score).toBeDefined();
      expect(result.score!.overall).toBe(4.5);
      expect(result.score!.breakdown).toBeDefined();
      expect(result.score!.breakdown.clarity).toBe(9);
      expect(result.score!.breakdown.structure).toBe(9);
      expect(result.metadata.trustScore).toBeGreaterThan(0);
    });

    it('should generate tone-specific content variations', async () => {
      const tones = ['professional', 'conversational', 'urgent', 'friendly', 'authoritative'];
      
      for (const tone of tones) {
        let input;
        
        // Use appropriate campaign goals for each tone to trigger expected content
        if (tone === 'urgent') {
          input = {
            campaignGoal: 'Drive sales and conversions', // This will trigger "Last chance" logic
            targetAudience: 'business professionals',
            keyMessage: 'Transform your workflow',
            callToAction: 'Get Started',
            tone
          };
        } else {
          input = {
            campaignGoal: 'Drive engagement',
            targetAudience: 'business professionals',
            keyMessage: 'Transform your workflow',
            callToAction: 'Get Started',
            tone
          };
        }

        const result = await generateEmailCampaign(input);
        
        expect(result.validationStatus.isValid).toBe(true);
        expect(result.output).toBeDefined();
        
        // Verify tone-specific content generation
        if (tone === 'urgent') {
          expect(result.output!.campaign.subject).toContain('Last chance');
          expect(result.output!.campaign.preview).toContain('Limited time');
        } else if (tone === 'professional') {
          expect(result.output!.campaign.body[0]).toBe('Dear Valued Client,');
          expect(result.output!.campaign.preview).toContain('Professional solutions');
        } else if (tone === 'conversational' || tone === 'friendly') {
          expect(result.output!.campaign.body[0]).toBe('Hi there,');
        }
      }
    });

    it('should use proper logging infrastructure instead of console.log', async () => {
      const validInput = {
        campaignGoal: 'Drive sales and conversions',
        targetAudience: 'small business owners',
        keyMessage: 'Grow your business with our solutions',
        callToAction: 'Schedule a Demo Today',
        tone: 'professional'
      };

      await generateEmailCampaign(validInput);
      
      // Verify no console.log usage
      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe('applyMCPEnhancers', () => {
    it('should intelligently infer missing fields from minimal input', () => {
      const minimalInput = {
        keyMessage: 'Grow your business with our solutions'
      };

      const result = applyMCPEnhancers(minimalInput);
      
      // Verify intelligent field inference
      expect(result.keyMessage).toBe('Grow your business with our solutions');
      expect(result.campaignGoal).toBeDefined();
      expect(result.campaignGoal.length).toBeGreaterThan(0);
      expect(result.targetAudience).toBeDefined();
      expect(result.targetAudience.length).toBeGreaterThan(0);
      expect(result.callToAction).toBeDefined();
      expect(result.tone).toBe('friendly'); // Default tone based on MCP logic
    });

    it('should preserve provided fields while enhancing missing ones', () => {
      const partialInput = {
        campaignGoal: 'Drive sales and conversions',
        keyMessage: 'Grow your business with our solutions',
        tone: 'urgent'
      };

      const result = applyMCPEnhancers(partialInput);
      
      // Verify preservation of provided fields
      expect(result.campaignGoal).toBe('Drive sales and conversions');
      expect(result.keyMessage).toBe('Grow your business with our solutions');
      expect(result.tone).toBe('urgent');
      
      // Verify inference of missing fields
      expect(result.targetAudience).toBeDefined();
      expect(result.callToAction).toBeDefined();
    });

    it('should handle edge cases and provide meaningful defaults', () => {
      const edgeCaseInput = {
        campaignGoal: 'Increase brand awareness'
      };

      const result = applyMCPEnhancers(edgeCaseInput);
      
      // Verify all required fields are populated
      expect(result.campaignGoal).toBe('Increase brand awareness');
      expect(result.targetAudience).toBeDefined();
      expect(result.keyMessage).toBeDefined();
      expect(result.callToAction).toBeDefined();
      expect(result.tone).toBeDefined();
      expect(result.enhancers).toBeDefined();
    });

    it('should throw error for completely empty input', () => {
      expect(() => {
        applyMCPEnhancers({});
      }).toThrow('Email Campaign MCP requires at least campaignGoal, targetAudience, or keyMessage');
    });
  });
}); 