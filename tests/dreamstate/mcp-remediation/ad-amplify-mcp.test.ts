/**
 * ad-amplify-mcp.test.ts
 * 
 * Test suite for Ad Amplify MCP remediation verification
 * Following Test-First Truth principle for Codex compliance
 * Part of DreamState emotional sovereignty test suite
 */

import { generateAdAmplify, applyMCPEnhancers, adAmplifyMCP } from '../../../prompts/ad_amplify.mcp';
import { EventBus } from '../../../cursor/event-bus/eventBus';
import { PromptSchemaValidator } from '../../../cursor/services/prompt-schema-validator';
import { PromptScoringManager } from '../../../cursor/prompt-infrastructure/prompt-score';
import { Logger } from '../../../utils/logger';

// Mock dependencies
jest.mock('../../../cursor/event-bus/eventBus');
jest.mock('../../../cursor/services/prompt-schema-validator');
jest.mock('../../../cursor/prompt-infrastructure/prompt-score');
jest.mock('../../../utils/logger');
jest.mock('../../../cursor/self-healing/fallbackRouter');

describe('Ad Amplify MCP Remediation', () => {
  let mockEventBus: jest.Mocked<EventBus>;
  let mockValidator: jest.Mocked<PromptSchemaValidator>;
  let mockScorer: jest.Mocked<PromptScoringManager>;
  let mockLogger: jest.Mocked<Logger>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mock EventBus
    mockEventBus = EventBus.getInstance() as jest.Mocked<EventBus>;
    mockEventBus.emit = jest.fn();
    
    // Setup mock PromptSchemaValidator
    mockValidator = new PromptSchemaValidator() as jest.Mocked<PromptSchemaValidator>;
    mockValidator.validatePrompt = jest.fn().mockResolvedValue({
      isValid: true,
      errors: [],
      warnings: []
    });
    
    // Setup mock PromptScoringManager
    mockScorer = new PromptScoringManager(mockEventBus) as jest.Mocked<PromptScoringManager>;
    mockScorer.scorePrompt = jest.fn().mockResolvedValue({
      score: 0.9,
      metrics: {
        toneMatch: 0.9,
        emotionalDepth: 0.9,
        clarity: 0.9,
        completeness: 0.9,
        platformOptimization: 0.9,
        conversionPotential: 0.9,
        trust: {
          score: 0.9
        }
      }
    });
    
    // Setup mock Logger
    mockLogger = new Logger('test') as jest.Mocked<Logger>;
    mockLogger.info = jest.fn();
    mockLogger.warn = jest.fn();
    mockLogger.error = jest.fn();
  });
  
  describe('applyMCPEnhancers', () => {
    it('should enhance input with industry defaults', () => {
      const input = {
        platform: 'Facebook',
        productOffer: 'Social Media Management',
        audience: 'Small business owners',
        tone: '',
        emotionalGoal: '',
        industry: 'saas'
      };
      
      const enhanced = applyMCPEnhancers(input);
      
      expect(enhanced.tone).toBe('professional');
      expect(enhanced.emotionalGoal).toBe('build trust');
      expect(enhanced.desiredAction).toBe('Start Free Trial');
      expect(enhanced.trustSignal).toBe('trusted by leading companies');
    });
    
    it('should infer customerPain from audience', () => {
      const input = {
        platform: 'Facebook',
        productOffer: 'Social Media Management',
        audience: 'busy solo coaches',
        tone: 'warm',
        emotionalGoal: 'feel empowered'
      };
      
      const enhanced = applyMCPEnhancers(input);
      
      expect(enhanced.customerPain).toBe('struggling to attract consistent clients');
    });
    
    it('should infer desiredAction from emotionalGoal', () => {
      const input = {
        platform: 'Facebook',
        productOffer: 'Social Media Management',
        audience: 'Small business owners',
        tone: 'professional',
        emotionalGoal: 'spark urgency'
      };
      
      const enhanced = applyMCPEnhancers(input);
      
      expect(enhanced.desiredAction).toBe('Act Now');
    });
    
    it('should emit enhancement events', () => {
      const input = {
        platform: 'Facebook',
        productOffer: 'Social Media Management',
        audience: 'Small business owners',
        tone: 'professional',
        emotionalGoal: 'spark urgency'
      };
      
      applyMCPEnhancers(input);
      
      expect(mockEventBus.emit).toHaveBeenCalledWith(
        'ad_amplify:enhanced',
        expect.objectContaining({
          original: input,
          enhanced: expect.any(Object),
          enhancements: expect.any(Array)
        })
      );
    });
  });
  
  describe('generateAdAmplify', () => {
    it('should process valid input successfully', async () => {
      const input = {
        platform: 'Facebook',
        productOffer: 'Social Media Management',
        audience: 'Small business owners',
        tone: 'professional',
        emotionalGoal: 'build trust'
      };
      
      const result = await generateAdAmplify(input);
      
      expect(result.validationStatus.isValid).toBe(true);
      expect(result.output).toBeDefined();
      expect(result.score).toBeDefined();
      expect(result.score?.overall).toBe(0.9);
      expect(mockEventBus.emit).toHaveBeenCalledWith(
        'ad_amplify:processing_completed',
        expect.any(Object)
      );
    });
    
    it('should handle validation failures', async () => {
      // Setup validation to fail
      mockValidator.validatePrompt = jest.fn().mockResolvedValue({
        isValid: false,
        errors: ['Missing required field'],
        warnings: []
      });
      
      const input = {
        platform: 'InvalidPlatform',
        productOffer: '',
        audience: '',
        tone: '',
        emotionalGoal: ''
      };
      
      const result = await generateAdAmplify(input);
      
      expect(result.validationStatus.isValid).toBe(false);
      expect(result.validationStatus.issues).toContain('Missing required field');
      expect(result.output).toBeUndefined();
      expect(mockEventBus.emit).toHaveBeenCalledWith(
        'ad_amplify:validation_failed',
        expect.any(Object)
      );
    });
    
    it('should log process start and completion', async () => {
      const input = {
        platform: 'Facebook',
        productOffer: 'Social Media Management',
        audience: 'Small business owners',
        tone: 'professional',
        emotionalGoal: 'build trust'
      };
      
      await generateAdAmplify(input);
      
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Starting ad amplify generation',
        expect.any(Object)
      );
      
      expect(mockLogger.info).toHaveBeenCalledWith(
        'Ad amplify generation successful',
        expect.any(Object)
      );
    });
  });
  
  describe('Ad content generation', () => {
    it('should generate valid headline based on emotionalGoal', async () => {
      const input = {
        platform: 'Facebook',
        productOffer: 'Social Media Management',
        audience: 'Small business owners',
        tone: 'professional',
        emotionalGoal: 'build trust',
        trustSignal: 'Trusted by 10,000+ businesses'
      };
      
      const result = await generateAdAmplify(input);
      
      expect(result.output?.headline).toContain('Trusted by 10,000+ businesses');
      expect(result.output?.headline).toContain('Social Media Management');
    });
    
    it('should generate variations with different focuses', async () => {
      const input = {
        platform: 'Facebook',
        productOffer: 'Social Media Management',
        audience: 'Small business owners',
        tone: 'professional',
        emotionalGoal: 'build trust'
      };
      
      const result = await generateAdAmplify(input);
      
      expect(result.output?.variations).toHaveLength(3);
      
      // Check that each variation has a different focus
      const focuses = result.output?.variations.map(v => v.focus);
      expect(focuses).toContain('Features');
      expect(focuses).toContain('Pain Point');
      expect(focuses).toContain('Benefits');
    });
  });
}); 