/**
 * profile-makeover-mcp.test.ts
 * 
 * Test suite for Profile Makeover MCP remediation
 * Following Test-First Truth principle for Codex compliance
 * Part of DreamState emotional sovereignty test suite
 */

/* eslint-env jest */

// Import the mock first to ensure proper setup
import '../../mocks/eventBus.mock';
import { mockEventBus } from '../../mocks/eventBus.mock';

import { generateProfileMakeover, applyMCPEnhancers, profileMakeoverMCP } from '../../../prompts/profile_makeover.mcp';
import { EventBus } from '../../../cursor/event-bus/eventBus';
import { PromptSchemaValidator } from '../../../cursor/services/prompt-schema-validator';
import { PromptScoringManager } from '../../../cursor/prompt-infrastructure/prompt-score';
import { Logger } from '../../../utils/logger';

// Mock other dependencies (EventBus is mocked in eventBus.mock.ts)
jest.mock('../../../cursor/services/prompt-schema-validator', () => ({
  PromptSchemaValidator: jest.fn().mockImplementation(() => ({
    validatePrompt: jest.fn().mockResolvedValue({
      isValid: true,
      errors: [],
      warnings: []
    })
  }))
}));
jest.mock('../../../cursor/prompt-infrastructure/prompt-score');
jest.mock('../../../utils/logger');
jest.mock('../../../cursor/self-healing/fallbackRouter');

describe('Profile Makeover MCP - Production Implementation', () => {
  let mockSchemaValidator: jest.Mocked<PromptSchemaValidator>;
  let mockPromptScorer: jest.Mocked<PromptScoringManager>;
  let mockLogger: jest.Mocked<Logger>;
  let consoleSpy: jest.SpyInstance;
  
  const validInput = {
    platform: 'LinkedIn',
    businessType: 'freelance designer',
    tone: 'professional',
    emotionalGoal: 'feel confident in your brand'
  };

  beforeEach(() => {
    // Reset all mocks including the EventBus mock
    jest.clearAllMocks();
    
    // Setup console spy to detect any console.log statements
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    // Mock SchemaValidator
    mockSchemaValidator = new PromptSchemaValidator() as jest.Mocked<PromptSchemaValidator>;
    mockSchemaValidator.validatePrompt = jest.fn().mockResolvedValue({
      isValid: true,
      errors: [],
      warnings: []
    });
    
    // Mock PromptScorer
    mockPromptScorer = new PromptScoringManager(mockEventBus) as jest.Mocked<PromptScoringManager>;
    mockPromptScorer.scorePrompt = jest.fn().mockResolvedValue({
      score: 0.92,
      metrics: {
        toneMatch: 0.9,
        emotionalDepth: 0.85,
        clarity: 0.9,
        completeness: 0.9,
        platformOptimization: 0.95,
        trust: {
          score: 0.88
        }
      }
    });
    
    // Mock Logger
    mockLogger = new Logger('test') as jest.Mocked<Logger>;
    mockLogger.info = jest.fn();
    mockLogger.warn = jest.fn();
    mockLogger.error = jest.fn();
  });

  describe('generateProfileMakeover', () => {
    it('should use actual validation service instead of stub', async () => {
      // Act
      const result = await generateProfileMakeover(validInput);
      
      // Assert
      expect(mockSchemaValidator.validatePrompt).toHaveBeenCalled();
      expect(result.validationStatus).toBeDefined();
      expect(result.validationStatus.isValid).toBe(true);
    });

    it('should use actual scoring service instead of stub', async () => {
      // Act
      const result = await generateProfileMakeover(validInput);
      
      // Assert
      expect(mockPromptScorer.scorePrompt).toHaveBeenCalled();
      if (result.score) {
        expect(result.score.overall).toBeDefined();
        expect(result.score.breakdown).toBeDefined();
      }
    });

    it('should use EventBus instead of direct function calls', async () => {
      // Act
      await generateProfileMakeover(validInput);
      
      // Assert
      expect(mockEventBus.emit).toHaveBeenCalledWith('profile_makeover:processing_started', expect.any(Object));
      expect(mockEventBus.emit).toHaveBeenCalledWith('profile_makeover:processing_completed', expect.any(Object));
    });

    it('should use proper logger instead of console.log', async () => {
      // Act
      await generateProfileMakeover(validInput);
      
      // Assert
      expect(consoleSpy).not.toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('should handle validation failures properly', async () => {
      // Arrange - mock the constructor to return a validator that fails
      const mockValidatorInstance = {
        validatePrompt: jest.fn().mockResolvedValue({
          isValid: false,
          errors: ['Missing required field: businessType'],
          warnings: []
        })
      };
      
      (PromptSchemaValidator as jest.Mock).mockImplementation(() => mockValidatorInstance);
      
      // Act
      const result = await generateProfileMakeover({
        platform: 'LinkedIn',
        tone: 'professional',
        emotionalGoal: 'feel confident'
      } as any);
      
      // Assert
      expect(result.validationStatus.isValid).toBe(false);
      expect(result.validationStatus.issues).toContain('Missing required field: businessType');
      expect(result.output).toBeUndefined();
      expect(mockValidatorInstance.validatePrompt).toHaveBeenCalled();
    });

    it('should generate actual profile content', async () => {
      // Act
      const result = await generateProfileMakeover(validInput);
      
      // Assert
      expect(result.output).toBeDefined();
      if (result.output) {
        expect(result.output.headline).toBeDefined();
        expect(result.output.bio).toBeDefined();
        expect(result.output.keyPoints).toBeDefined();
        expect(result.output.tags).toBeDefined();
        expect(result.output.callToAction).toBeDefined();
      }
    });
  });

  describe('applyMCPEnhancers', () => {
    it('should enhance minimal input correctly', () => {
      // Arrange
      const minimalInput = {
        platform: 'LinkedIn',
        businessType: 'tech startup',
        tone: 'professional',
        emotionalGoal: 'feel innovative'
      };
      
      // Act
      const result = applyMCPEnhancers(minimalInput);
      
      // Assert
      expect(result.platform).toBe('LinkedIn');
      expect(result.businessType).toBe('tech startup');
      expect(result.audience).toBeDefined();
      expect(result.keyOfferings).toBeDefined();
      expect(result.enhancers).toBeDefined();
    });
    
    it('should preserve provided fields', () => {
      // Arrange
      const fullInput = {
        platform: 'LinkedIn',
        businessType: 'consultant',
        tone: 'professional',
        emotionalGoal: 'feel confident',
        audience: 'enterprise businesses',
        keyOfferings: 'strategic planning'
      };
      
      // Act
      const result = applyMCPEnhancers(fullInput);
      
      // Assert
      expect(result.audience).toBe('enterprise businesses');
      expect(result.keyOfferings).toBe('strategic planning');
    });
    
    it('should apply industry-specific defaults', () => {
      // Arrange
      const input = {
        platform: 'LinkedIn',
        businessType: 'wellness coach',
        tone: '',
        emotionalGoal: '',
        industry: 'wellness'
      };
      
      // Act
      const result = applyMCPEnhancers(input);
      
      // Assert
      expect(result.tone).toBe('calm');
      expect(result.emotionalGoal).toBe('feel seen and understood');
      expect(result.trustSignal).toBe('certified wellness coach');
    });
    
    it('should emit enhancement event', () => {
      // Act
      applyMCPEnhancers(validInput);
      
      // Assert
      expect(mockEventBus.emit).toHaveBeenCalledWith('profile_makeover:enhanced', expect.any(Object));
    });
  });

  describe('Object interface usage', () => {
    it('should support object interface for generate', async () => {
      // Act
      const result = await profileMakeoverMCP.generate(validInput);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.validationStatus).toBeDefined();
      expect(mockSchemaValidator.validatePrompt).toHaveBeenCalled();
    });
    
    it('should support object interface for applyMCPEnhancers', () => {
      // Act
      const result = profileMakeoverMCP.applyMCPEnhancers(validInput);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.audience).toBeDefined();
    });
  });
}); 