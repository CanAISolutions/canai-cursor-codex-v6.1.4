import { generateBlogBlitz, applyMCPEnhancers } from '../../prompts/blogblitz.mcp';
import { PromptSchemaValidator } from '../../cursor/services/prompt-schema-validator';
import { EventBus } from '../../cursor/event-bus/eventBus';

// PHASE 3 FIX: Mock initialization order fix
// Create mock function with immediate implementation to avoid hoisting issues
const mockValidatePrompt = jest.fn().mockResolvedValue({
  isValid: true,
  errors: [],
  warnings: []
});

// Mock dependencies
jest.mock('../../cursor/prompt-infrastructure/prompt-score', () => ({
  PromptScoringManager: jest.fn().mockImplementation(() => ({
    scorePrompt: jest.fn().mockResolvedValue({
      metrics: {
        trust: {
          score: 0.85,
          feedback: 0.82,
          fallbackUsage: 0,
          violations: 0
        },
        alignment: {
          codexScore: 0.9,
          contractCompliance: 0.88
        },
        performance: {
          quality: 0.87,
          consistency: 0.86
        }
      }
    })
  }))
}));

jest.mock('../../cursor/services/prompt-schema-validator', () => ({
  PromptSchemaValidator: jest.fn().mockImplementation(() => ({
    validatePrompt: jest.fn().mockResolvedValue({
      isValid: true,
      errors: [],
      warnings: []
    })
  }))
}));

jest.mock('../../cursor/self-healing/fallbackRouter', () => ({
  routeFallback: jest.fn().mockResolvedValue({})
}));

jest.mock('../../utils/logger', () => ({
  Logger: jest.fn().mockImplementation(() => ({
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  }))
}));

jest.mock('../../cursor/event-bus/eventBus', () => ({
  EventBus: {
    getInstance: jest.fn().mockReturnValue({
      emit: jest.fn(),
      on: jest.fn()
    })
  }
}));

describe('BlogBlitz MCP', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset mock to default success case
    mockValidatePrompt.mockResolvedValue({
      isValid: true,
      errors: [],
      warnings: []
    });
  });

  test('should validate and process a valid input', async () => {
    const validInput = {
      topic: 'Content Marketing',
      audience: 'Small Business Owners',
      tone: 'conversational',
      emotionalOutcome: 'feel confident'
    };

    const result = await generateBlogBlitz(validInput);

    expect(result.validationStatus.isValid).toBe(true);
    expect(result.output).toBeDefined();
    expect(result.score?.overall).toBeGreaterThanOrEqual(0.75);
    expect(result.metadata.trustScore).toBeGreaterThan(0);
  });

  test('should handle validation failures', async () => {
    // Set mock to return validation failure for this test
    mockValidatePrompt.mockResolvedValueOnce({
      isValid: false,
      errors: ['Missing required field: topic'],
      warnings: []
    });

    const invalidInput = {
      audience: 'Small Business Owners',
      tone: 'conversational',
      emotionalOutcome: 'feel confident'
    };

    const result = await generateBlogBlitz(invalidInput as any);

    expect(result.validationStatus.isValid).toBe(false);
    expect(result.validationStatus.issues).toContain('Missing required field: topic');
    expect(result.output).toBeUndefined();
  });

  test('should enhance input with MCP enhancers', () => {
    const input = {
      topic: 'Digital Marketing',
      audience: 'small business owners',
      tone: 'conversational',
      emotionalOutcome: 'feel confident'
    };

    const enhanced = applyMCPEnhancers(input);

    expect(enhanced.customerPain).toBeDefined();
    expect(enhanced.keyOfferings).toBeDefined();
    expect(enhanced.desiredAction).toBeDefined();
  });

  test('should infer correct pain from audience', () => {
    const input = {
      topic: 'Digital Marketing',
      audience: 'small business owners',
      tone: 'conversational',
      emotionalOutcome: 'feel confident'
    };

    const enhanced = applyMCPEnhancers(input);

    expect(enhanced.customerPain).toBe('overwhelmed by marketing and operations');
  });

  test('should infer correct offerings from topic', () => {
    const input = {
      topic: 'marketing strategies',
      audience: 'entrepreneurs',
      tone: 'bold',
      emotionalOutcome: 'feel empowered'
    };

    const enhanced = applyMCPEnhancers(input);

    expect(enhanced.keyOfferings).toBe('marketing strategy and implementation');
  });

  test('should infer correct action from emotional outcome', () => {
    const input = {
      topic: 'Digital Marketing',
      audience: 'small business owners',
      tone: 'conversational',
      emotionalOutcome: 'feel confident'
    };

    const enhanced = applyMCPEnhancers(input);

    expect(enhanced.desiredAction).toBe('book a consultation to build confidence');
  });

  test('should handle unknown values with defaults', () => {
    const input = {
      topic: 'Quantum Computing',
      audience: 'researchers',
      tone: 'professional',
      emotionalOutcome: 'understand complex topics'
    };

    const enhanced = applyMCPEnhancers(input);

    expect(enhanced.customerPain).toBe('unclear direction and overwhelm');
    expect(enhanced.desiredAction).toBe('take the next step with us');
  });
}); 