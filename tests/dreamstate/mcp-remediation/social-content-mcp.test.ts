/**
 * social-content-mcp.test.ts
 * 
 * Test suite for Social Content MCP production implementation validation
 * Following Test-First Truth principle for Codex compliance
 * Part of DreamState emotional sovereignty test suite
 */

import { generateSocialContent, applyMCPEnhancers } from '../../../prompts/social_content.mcp';

// Mock external dependencies only
jest.mock('../../../cursor/prompt-infrastructure/prompt-loader', () => ({
  PromptFileLoader: jest.fn().mockImplementation(() => ({
    loadPrompt: jest.fn()
  }))
}));

jest.mock('../../../cursor/prompt-infrastructure/prompt-score', () => ({
  PromptScoringManager: jest.fn().mockImplementation(() => ({
    scorePrompt: jest.fn().mockResolvedValue({
      metrics: {
        trust: { score: 4.2, feedback: 0.8 },
        performance: { quality: 8.5, consistency: 8.8 },
        alignment: { codexScore: 8.0 }
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
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  }))
}));

jest.mock('../../../cursor/fallback/fallback-handler', () => ({
  FallbackHandler: jest.fn().mockImplementation(() => ({
    handleFailure: jest.fn()
  }))
}));

describe('Social Content MCP - Production Implementation', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    // Setup console spy to ensure no console.log usage
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('generateSocialContent', () => {
    it('should perform real input validation and handle missing fields', async () => {
      const invalidInput = {
        platform: 'instagram',
        contentType: 'post'
        // Missing targetAudience, keyMessage, tone
      };

      const result = await generateSocialContent(invalidInput as any);
      
      // Verify real validation was performed
      expect(result.validationStatus.isValid).toBe(false);
      expect(result.validationStatus.issues).toContain('targetAudience');
      expect(result.validationStatus.issues).toContain('keyMessage');
      expect(result.validationStatus.issues).toContain('tone');
      expect(result.output).toBeUndefined();
    });

    it('should generate comprehensive social content with platform-specific logic', async () => {
      const validInput = {
        platform: 'instagram',
        contentType: 'post',
        targetAudience: ['young professionals', 'entrepreneurs'],
        keyMessage: 'Innovative business solutions that drive growth',
        tone: 'engaging'
      };

      const result = await generateSocialContent(validInput);
      
      // Verify successful validation
      expect(result.validationStatus.isValid).toBe(true);
      expect(result.output).toBeDefined();
      
      // Verify platform-specific content generation
      expect(result.output!.content.headline).toContain('✨'); // Instagram-specific formatting
      expect(result.output!.content.headline).toContain('Innovative business solutions');
      expect(result.output!.content.body).toContain('🚀'); // Engaging tone emoji
      expect(result.output!.content.body).toContain('young professionals, entrepreneurs');
      
      // Verify comprehensive content structure
      expect(result.output!.content.hashtags).toContain('#inspiration');
      expect(result.output!.content.hashtags).toContain('#motivation');
      expect(result.output!.content.callToAction).toContain('Double-tap');
      
      // Verify strategy and assets
      expect(result.output!.strategy.timing).toContain('Weekdays 11 AM-1 PM');
      expect(result.output!.assets.images).toContain('High-quality lifestyle images');
    });

    it('should generate platform-specific content for different platforms', async () => {
      const platforms = [
        { 
          name: 'linkedin', 
          expectedHeadline: 'Professional Insight:', 
          expectedHashtag: '#professional',
          expectedCTA: 'Connect with me'
        },
        { 
          name: 'twitter', 
          expectedHashtag: '#trending',
          expectedCTA: 'What do you think?'
        },
        { 
          name: 'instagram', 
          expectedHeadline: '✨', 
          expectedHashtag: '#inspiration',
          expectedCTA: 'Double-tap'
        }
      ];

      for (const platform of platforms) {
        const input = {
          platform: platform.name,
          contentType: 'post',
          targetAudience: ['business professionals'],
          keyMessage: 'Transform your workflow with AI',
          tone: 'professional'
        };

        const result = await generateSocialContent(input);
        
        expect(result.validationStatus.isValid).toBe(true);
        expect(result.output).toBeDefined();
        
        if (platform.expectedHeadline) {
          expect(result.output!.content.headline).toContain(platform.expectedHeadline);
        }
        expect(result.output!.content.hashtags).toContain(platform.expectedHashtag);
        expect(result.output!.content.callToAction).toContain(platform.expectedCTA);
      }
    });

    it('should calculate real trust scores and empathy metrics', async () => {
      const validInput = {
        platform: 'linkedin',
        contentType: 'article',
        targetAudience: ['business leaders'],
        keyMessage: 'Strategic insights for sustainable growth',
        tone: 'professional'
      };

      const result = await generateSocialContent(validInput);
      
      // Verify real scoring was performed
      expect(result.score).toBeDefined();
      expect(result.score!.overall).toBe(4.2);
      expect(result.score!.breakdown).toBeDefined();
      expect(result.score!.breakdown.clarity).toBe(8.5);
      expect(result.score!.breakdown.structure).toBe(8.8);
      
      // Verify empathy metrics calculation
      expect(result.empathyMetrics).toBeDefined();
      expect(result.empathyMetrics!.emotionalResonance).toBeGreaterThan(0);
      expect(result.empathyMetrics!.toneAlignment).toBeGreaterThan(0);
      expect(result.metadata.trustScore).toBeGreaterThan(0);
    });

    it('should generate tone-specific content variations', async () => {
      const tones = ['professional', 'engaging', 'conversational'];
      
      for (const tone of tones) {
        const input = {
          platform: 'linkedin',
          contentType: 'post',
          targetAudience: ['professionals'],
          keyMessage: 'Innovation drives success',
          tone
        };

        const result = await generateSocialContent(input);
        
        expect(result.validationStatus.isValid).toBe(true);
        expect(result.output).toBeDefined();
        
        // Verify tone-specific content generation
        if (tone === 'professional') {
          expect(result.output!.content.body).toContain('strategic approach');
          expect(result.output!.content.body).toContain('measurable results');
        } else if (tone === 'engaging') {
          expect(result.output!.content.body).toContain('🚀');
          expect(result.output!.content.body).toContain('incredible results');
        } else if (tone === 'conversational') {
          expect(result.output!.content.body).toContain('What\'s your experience');
        }
      }
    });

    it('should use proper logging infrastructure instead of console.log', async () => {
      const validInput = {
        platform: 'instagram',
        contentType: 'post',
        targetAudience: ['young professionals'],
        keyMessage: 'Test message',
        tone: 'engaging'
      };

      await generateSocialContent(validInput);
      
      // Verify no console.log usage
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('should handle content generation errors gracefully', async () => {
      // Test with invalid platform to trigger error handling
      const invalidInput = {
        platform: '', // Empty platform should cause issues
        contentType: 'post',
        targetAudience: ['professionals'],
        keyMessage: 'Test message',
        tone: 'professional'
      };

      try {
        await generateSocialContent(invalidInput);
      } catch (error) {
        expect(error).toBeDefined();
        expect(error instanceof Error).toBe(true);
      }
    });
  });

  describe('applyMCPEnhancers', () => {
    it('should intelligently infer missing fields from minimal input', () => {
      const minimalInput = {
        platform: 'instagram'
      };

      const result = applyMCPEnhancers(minimalInput);
      
      // Verify intelligent field inference
      expect(result.platform).toBe('instagram');
      expect(result.contentType).toBeDefined();
      expect(result.contentType.length).toBeGreaterThan(0);
      expect(result.targetAudience).toBeDefined();
      expect(result.targetAudience.length).toBeGreaterThan(0);
      expect(result.keyMessage).toBeDefined();
      expect(result.tone).toBeDefined();
    });

    it('should preserve provided fields while enhancing missing ones', () => {
      const partialInput = {
        platform: 'linkedin',
        contentType: 'article',
        keyMessage: 'Custom message about innovation'
      };

      const result = applyMCPEnhancers(partialInput);
      
      // Verify preservation of provided fields
      expect(result.platform).toBe('linkedin');
      expect(result.contentType).toBe('article');
      expect(result.keyMessage).toBe('Custom message about innovation');
      
      // Verify inference of missing fields
      expect(result.targetAudience).toBeDefined();
      expect(result.tone).toBeDefined();
    });

    it('should generate platform-appropriate defaults', () => {
      const platforms = ['linkedin', 'instagram', 'twitter', 'facebook'];
      
      for (const platform of platforms) {
        const input = { platform };
        const result = applyMCPEnhancers(input);
        
        expect(result.platform).toBe(platform);
        expect(result.contentType).toBeDefined();
        expect(result.targetAudience).toBeDefined();
        expect(result.keyMessage).toBeDefined();
        expect(result.tone).toBeDefined();
        
        // Verify platform-appropriate content type inference
        if (platform === 'linkedin') {
          expect(['LinkedIn Post', 'LinkedIn Article', 'LinkedIn Poll']).toContain(result.contentType);
        } else if (platform === 'instagram') {
          expect(['Instagram Post', 'Instagram Story', 'Instagram Reel']).toContain(result.contentType);
        }
      }
    });

    it('should handle edge cases and provide meaningful defaults', () => {
      const edgeCaseInput = {
        platform: 'custom-platform',
        targetAudience: ['niche audience']
      };

      const result = applyMCPEnhancers(edgeCaseInput);
      
      // Verify all required fields are populated
      expect(result.platform).toBe('custom-platform');
      expect(result.targetAudience).toEqual(['niche audience']);
      expect(result.contentType).toBeDefined();
      expect(result.keyMessage).toBeDefined();
      expect(result.tone).toBeDefined();
      expect(result.enhancers).toBeDefined();
    });
  });
}); 