import { aiBlueprintMCP } from '../../../prompts/ai_blueprint.mcp';
import { EventBus } from '../../../cursor/event-bus/eventBus';

// Create mocks for external dependencies only
jest.mock('../../../cursor/event-bus/eventBus', () => ({
  EventBus: {
    getInstance: jest.fn().mockReturnValue({
      emit: jest.fn(),
      on: jest.fn()
    })
  }
}));

jest.mock('../../../lib/schemas/validator', () => ({
  SchemaValidator: jest.fn().mockImplementation(() => ({
    validate: jest.fn().mockImplementation((schema, input) => {
      // Real validation logic for required fields
      const required = schema.required || [];
      const missing = required.filter((field: string) => !input[field]);
      return Promise.resolve({
        valid: missing.length === 0,
        errors: missing.map((field: string) => ({
          code: 'REQUIRED_ERROR',
          path: [field]
        }))
      });
    })
  }))
}));

jest.mock('../../../cursor/prompt-infrastructure/prompt-score', () => ({
  PromptScoringManager: jest.fn().mockImplementation(() => ({
    scorePrompt: jest.fn().mockResolvedValue({
      metrics: {
        trust: { score: 4.5 },
        performance: { quality: 9, consistency: 9 },
        alignment: { contractCompliance: 9 }
      }
    })
  }))
}));

jest.mock('../../../cursor/fallback/fallback-handler', () => ({
  FallbackHandler: jest.fn().mockImplementation(() => ({
    handleFailure: jest.fn()
  }))
}));

describe('AI Blueprint MCP Production Implementation', () => {
  let eventBusMock: { emit: jest.Mock };
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    // Setup EventBus mock
    eventBusMock = { emit: jest.fn() };
    jest.spyOn(EventBus, 'getInstance').mockReturnValue(eventBusMock as unknown as EventBus);

    // Setup console spy to ensure no console.log usage
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test 1: Validate production-ready input validation with real error handling
  it('should perform real input validation and handle missing fields', async () => {
    // Arrange
    const invalidInput = {
      industry: 'Technology'
      // Missing required fields: targetAudience, goals, constraints, tone
    };

    // Act
    const result = await aiBlueprintMCP.generate(invalidInput as any);

    // Assert
    expect(result.validationStatus.isValid).toBe(false);
    expect(result.validationStatus.issues).toContain('targetAudience');
    expect(result.validationStatus.issues).toContain('goals');
    expect(result.validationStatus.issues).toContain('constraints');
    expect(result.validationStatus.issues).toContain('tone');
    expect(result.output).toBeUndefined();
  });

  // Test 2: Validate production-ready logging through EventBus
  it('should use EventBus for all logging instead of console.log', async () => {
    // Arrange
    const validInput = {
      industry: 'Technology',
      targetAudience: 'Technical teams and CTOs',
      goals: ['Implement AI systems', 'Scale operations'],
      constraints: ['Budget limitations', 'Timeline constraints'],
      tone: 'technical'
    };

    // Act
    await aiBlueprintMCP.generate(validInput);

    // Assert
    expect(consoleSpy).not.toHaveBeenCalled();
    expect(eventBusMock.emit).toHaveBeenCalledWith('prompt:validation', expect.any(Object));
    expect(eventBusMock.emit).toHaveBeenCalledWith('prompt:score', expect.any(Object));
  });

  // Test 3: Validate production-ready content generation with real business logic
  it('should generate comprehensive AI blueprint with industry-specific content', async () => {
    // Arrange
    const validInput = {
      industry: 'Healthcare',
      targetAudience: 'Healthcare administrators and medical professionals',
      goals: ['Improve patient care', 'Ensure HIPAA compliance'],
      constraints: ['HIPAA compliance requirements', 'Patient data privacy'],
      tone: 'professional'
    };

    // Act
    const result = await aiBlueprintMCP.generate(validInput);

    // Assert
    expect(result.validationStatus.isValid).toBe(true);
    expect(result.output).toBeDefined();
    expect(result.output!.blueprint.architecture).toContain('Healthcare');
    expect(result.output!.blueprint.components).toContain('Security Enforcement Layer');
    expect(result.output!.recommendations).toBeInstanceOf(Array);
    expect(result.output!.recommendations.length).toBeGreaterThan(0);
    expect(result.output!.timeline).toBeInstanceOf(Array);
    expect(result.output!.risks).toBeInstanceOf(Array);
  });

  // Test 4: Validate production-ready scoring with real metrics calculation
  it('should calculate real trust scores and performance metrics', async () => {
    // Arrange
    const validInput = {
      industry: 'Finance',
      targetAudience: 'Financial institutions and compliance teams',
      goals: ['Implement fraud detection', 'Ensure regulatory compliance'],
      constraints: ['SOX compliance', 'High-availability requirements'],
      tone: 'strategic'
    };

    // Act
    const result = await aiBlueprintMCP.generate(validInput);

    // Assert
    expect(result.score).toBeDefined();
    expect(result.score!.overall).toBeGreaterThan(0);
    expect(result.score!.breakdown).toBeDefined();
    expect(result.score!.breakdown.clarity).toBeGreaterThan(0);
    expect(result.score!.breakdown.structure).toBeGreaterThan(0);
    expect(result.empathyMetrics).toBeDefined();
    expect(result.metadata.trustScore).toBeGreaterThan(0);
  });

  // Test 5: Validate production-ready MCP enhancers with intelligent field inference
  it('should intelligently infer missing fields using production MCP enhancers', async () => {
    // Arrange
    const partialInput = {
      industry: 'E-commerce'
      // Missing all other fields - should be inferred
    };

    // Act
    const enhancedInput = await aiBlueprintMCP.applyMCPEnhancers(partialInput);

    // Assert
    expect(enhancedInput.targetAudience).toBeDefined();
    expect(enhancedInput.targetAudience).toContain('retailers');
    expect(enhancedInput.goals).toBeInstanceOf(Array);
    expect(enhancedInput.goals.length).toBeGreaterThan(0);
    expect(enhancedInput.goals.some(goal => goal.includes('personalized'))).toBe(true);
    expect(enhancedInput.constraints).toBeInstanceOf(Array);
    expect(enhancedInput.tone).toBeDefined();
    expect(enhancedInput.enhancers).toBeDefined();
    expect(enhancedInput.enhancers!.architectureOptimization).toBe(true);
  });

  // Test 6: Validate production-ready event emission with comprehensive logging
  it('should emit comprehensive events for monitoring and analytics', async () => {
    // Arrange
    const validInput = {
      industry: 'Technology',
      targetAudience: 'Engineering teams',
      goals: ['Build ML pipelines', 'Implement automation'],
      constraints: ['Scalability requirements', 'Performance optimization'],
      tone: 'technical'
    };

    // Act
    await aiBlueprintMCP.generate(validInput);

    // Assert
    expect(eventBusMock.emit).toHaveBeenCalledWith('prompt:validation', expect.objectContaining({
      promptType: 'ai_blueprint',
      status: true,
      details: expect.any(Object)
    }));
    
    expect(eventBusMock.emit).toHaveBeenCalledWith('prompt:score', expect.objectContaining({
      promptType: 'ai_blueprint',
      scoreBreakdown: expect.any(Object)
    }));
    
    expect(eventBusMock.emit).toHaveBeenCalledWith('validation:complete', expect.any(Object));
    expect(eventBusMock.emit).toHaveBeenCalledWith('score:complete', expect.any(Object));
    expect(eventBusMock.emit).toHaveBeenCalledWith('empathy:complete', expect.any(Object));
  });

  // Test 7: Validate production-ready error handling and failure routing
  it('should handle validation failures with proper error routing', async () => {
    // Arrange
    const invalidInput = {}; // Completely empty input

    // Act
    const result = await aiBlueprintMCP.generate(invalidInput as any);

    // Assert
    expect(result.validationStatus.isValid).toBe(false);
    expect(result.validationStatus.issues.length).toBeGreaterThan(0);
    expect(result.output).toBeUndefined();
    expect(eventBusMock.emit).toHaveBeenCalledWith('failure:detected', expect.objectContaining({
      promptType: 'ai_blueprint',
      type: 'validation',
      severity: 2
    }));
  });

  // Test 8: Validate industry-specific architecture generation
  it('should generate industry-specific architectures and recommendations', async () => {
    // Test multiple industries
    const industries = [
      { name: 'Healthcare', expectedArch: 'HIPAA-Compliant', expectedComponent: 'Security Enforcement' },
      { name: 'Finance', expectedArch: 'Financial Intelligence', expectedComponent: 'Security Enforcement' },
      { name: 'Technology', expectedArch: 'Multi-Modal AI', expectedComponent: 'Performance Optimization' }
    ];

    for (const industry of industries) {
      // Arrange
      const input = {
        industry: industry.name,
        targetAudience: 'Business leaders',
        goals: ['Implement AI', 'Ensure security'],
        constraints: ['Security requirements', 'Performance needs'],
        tone: 'professional'
      };

      // Act
      const result = await aiBlueprintMCP.generate(input);

      // Assert
      expect(result.output!.blueprint.architecture).toContain(industry.expectedArch);
      expect(result.output!.blueprint.components.some(comp => 
        comp.includes(industry.expectedComponent)
      )).toBe(true);
    }
  });
}); 