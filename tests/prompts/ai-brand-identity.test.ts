import { brandIdentityMCP, applyMCPEnhancers } from '../../prompts/ai_brand_identity.mcp';
import { EventBus } from '../../cursor/event-bus/eventBus';

// Mock the EventBus emit method to avoid actual events being sent during tests
jest.mock('../../cursor/event-bus/eventBus', () => {
  const mockEmit = jest.fn();
  return {
    EventBus: {
      getInstance: jest.fn().mockReturnValue({
        emit: mockEmit,
        on: jest.fn(),
        off: jest.fn()
      })
    }
  };
});

// Mock Logger to avoid actual logging during tests
jest.mock('../../utils/logger', () => {
  return {
    Logger: jest.fn().mockImplementation(() => ({
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn()
    }))
  };
});

describe('AI Brand Identity MCP', () => {
  const mockEventBus = EventBus.getInstance();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('applyMCPEnhancers', () => {
    test('should throw error when no meaningful input is provided', () => {
      // Arrange
      const emptyInput = {};

      // Act & Assert
      expect(() => applyMCPEnhancers(emptyInput)).toThrow();
    });

    test('should properly infer missing fields when minimal input is provided', () => {
      // Arrange
      const minimalInput = {
        companyName: 'TechInnovate',
        industry: 'Technology'
      };

      // Act
      const enhanced = applyMCPEnhancers(minimalInput);

      // Assert
      expect(enhanced).toHaveProperty('targetAudience');
      expect(enhanced).toHaveProperty('values');
      expect(enhanced).toHaveProperty('tone');
      expect(enhanced).toHaveProperty('enhancers');
      expect(enhanced.values.length).toBeGreaterThan(0);
      expect(Object.keys(enhanced.enhancers || {}).length).toBeGreaterThan(0);
    });

    test('should infer technology industry when company name contains tech', () => {
      // Arrange
      const input = {
        companyName: 'HealthTech Solutions',
        targetAudience: 'Healthcare professionals',
        values: ['Innovation', 'Care']
      };

      // Act
      const enhanced = applyMCPEnhancers(input);

      // Assert - based on actual implementation behavior
      expect(enhanced.industry).toBe('Technology');
    });

    test('should infer appropriate tone based on industry', () => {
      // Arrange
      const input = {
        companyName: 'CreativeDesign Studio',
        industry: 'Creative Services',
        values: ['Creativity', 'Innovation']
      };

      // Act
      const enhanced = applyMCPEnhancers(input);

      // Assert
      expect(enhanced.tone).toBe('playful');
    });

    test('should add complementary values when fewer than 3 are provided', () => {
      // Arrange
      const input = {
        companyName: 'TechFirm',
        industry: 'Technology',
        values: ['Innovation'],
        tone: 'professional'
      };

      // Act
      const enhanced = applyMCPEnhancers(input);

      // Assert
      expect(enhanced.values.length).toBeGreaterThanOrEqual(3);
      expect(enhanced.values).toContain('Innovation');
    });
  });

  describe('generateBrandIdentity', () => {
    test('should generate a complete brand identity session with valid input', async () => {
      // Arrange
      const validInput = {
        companyName: 'TechInnovate',
        industry: 'Technology',
        targetAudience: 'Business professionals',
        values: ['Innovation', 'Quality', 'Integrity'],
        tone: 'professional'
      };

      // Act
      const result = await brandIdentityMCP.generate(validInput);

      // Assert
      expect(result).toHaveProperty('input');
      expect(result).toHaveProperty('output');
      expect(result).toHaveProperty('validationStatus');
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('empathyMetrics');
      expect(result).toHaveProperty('metadata');
      expect(result.validationStatus.isValid).toBe(true);
      expect(result.metadata.trustScore).toBeGreaterThan(0);
    });

    test('should handle validation failures gracefully', async () => {
      // Arrange
      // Create an input with empty/invalid values to trigger validation issues
      const invalidInput = {
        companyName: 'TechInnovate',
        industry: '',  // Empty value should trigger validation
        targetAudience: '',  // Empty value should trigger validation
        values: [],  // Empty array should trigger validation
        tone: 'invalid-tone' // Invalid tone should trigger validation
      };

      // Act
      const result = await brandIdentityMCP.generate(invalidInput);

      // Assert
      expect(result.validationStatus.isValid).toBe(false);
      expect(result.validationStatus.issues.length).toBeGreaterThan(0);
      expect(result).not.toHaveProperty('output');
      
      // Verify fallback was called
      expect(mockEventBus.emit).toHaveBeenCalled();
    });
  });
}); 