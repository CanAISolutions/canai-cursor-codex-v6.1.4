/**
 * tests/prompts/reverse-strategy.test.ts
 * 
 * Test suite for reverse strategy MCP implementation.
 * Tests validation, scoring, content generation, and error handling.
 */

import { EventBus } from '../../event-bus/eventBus';
import logger from '../../cursor/services/logger';
import { 
  reverseStrategyMCP,
  generateReverseStrategy
} from '../../prompts/reverse_strategy.mcp';

// Import test fixtures directly
import {
  validReverseStrategyInput,
  invalidReverseStrategyInput,
  partialReverseStrategyInput,
  expectedReverseStrategyOutput
} from './fixtures/reverse_strategy.fixture';

// Mocks for services
jest.mock('../../cursor/services/logger', () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

// Manual mocks to avoid circular reference issues
jest.mock('../../cursor/services/prompt-schema-validator', () => {
  return {
    PromptSchemaValidator: jest.fn().mockImplementation(() => {
      return {
        getSchema: jest.fn().mockReturnValue({
          requiredFields: ['targetOutcome', 'currentState', 'constraints', 'timeline', 'tone'],
          fieldTypes: {
            targetOutcome: 'string',
            currentState: 'string',
            constraints: 'array',
            timeline: 'string',
            tone: 'string'
          },
          validTones: ['professional', 'conversational', 'urgent', 'friendly', 'authoritative']
        })
      };
    })
  };
});

jest.mock('../../cursor/prompt-infrastructure/prompt-score', () => {
  return {
    PromptScoringManager: jest.fn().mockImplementation(() => {
      return {
        scorePrompt: jest.fn().mockResolvedValue({
          metrics: {
            trust: {
              score: 0.85,
              feedback: 0.84
            },
            alignment: {
              codexScore: 0.87,
              contractCompliance: 0.86
            },
            performance: {
              consistency: 0.85,
              quality: 0.83
            }
          }
        })
      };
    })
  };
});

jest.mock('../../cursor/services/emotional-ux-renderer', () => {
  return {
    EmotionalUXRenderer: {
      getInstance: jest.fn().mockImplementation(() => {
        return {
          processEmotionalAlignment: jest.fn().mockResolvedValue({
            metrics: {
              emotionalResonance: 0.85,
              toneAlignment: 0.9,
              connectionStrength: 0.8,
              authenticity: 0.85,
              overall: 0.85
            }
          })
        };
      })
    }
  };
});

jest.mock('../../cursor/services/fallback-manager', () => {
  return {
    FallbackManager: {
      getInstance: jest.fn().mockImplementation(() => {
        return {
          triggerFallback: jest.fn().mockImplementation((reason, agents, traceId, impact) => {
            return Promise.resolve({ success: false, handled: true, fallbackType: 'validation' });
          })
        };
      })
    }
  };
});

describe('Reverse Strategy MCP', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateReverseStrategy', () => {
    it('should generate a valid reverse strategy when given valid input', async () => {
      const result = await generateReverseStrategy(validReverseStrategyInput);
      
      expect(result.validationStatus.isValid).toBe(true);
      expect(result.output).toBeDefined();
      expect(result.metadata.version).toBe('6.1.4');
      expect(result.metadata.trustScore).toBeGreaterThan(0);
      expect(logger.info).toHaveBeenCalled();
    });

    it('should return validation errors with invalid input', async () => {
      // Cast the invalid input to ReverseStrategyInput to make TypeScript happy
      // In reality, validation will fail, which is what we're testing
      const result = await generateReverseStrategy(invalidReverseStrategyInput as any);
      
      expect(result.validationStatus.isValid).toBe(false);
      expect(result.validationStatus.issues.length).toBeGreaterThan(0);
      expect(result.output).toBeUndefined();
      expect(logger.error).toHaveBeenCalled();
    });

    it('should properly calculate score for generated strategy', async () => {
      const result = await generateReverseStrategy(validReverseStrategyInput);
      
      expect(result.score).toBeDefined();
      expect(result.score?.overall).toBeGreaterThan(0);
      expect(result.score?.breakdown).toBeDefined();
      expect(result.score?.breakdown.clarity).toBeDefined();
    });
  });

  describe('applyMCPEnhancers', () => {
    it('should fill in missing fields with sensible defaults', async () => {
      const enhanced = await reverseStrategyMCP.applyMCPEnhancers(partialReverseStrategyInput);
      
      expect(enhanced.targetOutcome).toBe(partialReverseStrategyInput.targetOutcome);
      expect(enhanced.currentState).toBeDefined();
      expect(enhanced.constraints).toBeDefined();
      expect(enhanced.constraints.length).toBeGreaterThan(0);
      expect(enhanced.timeline).toBeDefined();
      expect(enhanced.tone).toBeDefined();
    });

    it('should preserve existing fields when enhancing', async () => {
      const customInput = {
        ...partialReverseStrategyInput,
        tone: 'friendly'
      };
      
      const enhanced = await reverseStrategyMCP.applyMCPEnhancers(customInput);
      
      expect(enhanced.targetOutcome).toBe(customInput.targetOutcome);
      expect(enhanced.tone).toBe('friendly');
    });
  });

  describe('Error handling', () => {
    it('should log errors when validation fails', async () => {
      // We already test this with the invalid input test, just verify logger was called
      await generateReverseStrategy(invalidReverseStrategyInput as any);
      expect(logger.error).toHaveBeenCalled();
    });
  });
}); 