/**
 * prompt-validation-matrix.test.ts
 * 
 * Purpose: Test suite for Prompt Validation Matrix
 * Coverage: Structural integrity, persona alignment, regression detection
 * Includes: Mutation tests, failure sample storage, CI integration
 */

import { EventBus } from '../../event-bus/eventBus';
import { PromptValidationMatrix } from './prompt-validation-matrix';
import { PromptVersion } from '../prompt-evolution/prompt-memory-layer';
import * as fs from 'fs/promises';
import * as path from 'path';

describe('PromptValidationMatrix', () => {
  let matrix: PromptValidationMatrix;
  let eventBus: EventBus;
  const TEST_DIR = '/prompt-validation/test';
  const FAILURES_DIR = '/prompt-validation/failures';

  beforeEach(async () => {
    eventBus = EventBus.getInstance();
    matrix = new PromptValidationMatrix(eventBus);
    
    // Ensure test directories exist
    await fs.mkdir(TEST_DIR, { recursive: true });
    await fs.mkdir(FAILURES_DIR, { recursive: true });
  });

  afterEach(async () => {
    // Cleanup test directories
    await fs.rm(TEST_DIR, { recursive: true, force: true });
  });

  describe('Structural Integrity Tests', () => {
    it('should pass valid prompt structure', async () => {
      const version: PromptVersion = {
        version: 'v1.0.0',
        timestamp: new Date().toISOString(),
        trigger: {
          type: 'clarity',
          scenarioId: 'test-1',
          promptPath: 'test/prompt.md',
          priority: 'high',
          metrics: { delta: 0.9, drift: 0.1, trustScore: 0.9 },
          timestamp: new Date().toISOString()
        },
        content: `
# Test Prompt
## Context
This is a test prompt with proper structure.

## Instructions
1. First step
2. Second step

## Output Format
- JSON response
- Markdown summary
`,
        metrics: {
          clarity: 0.9,
          trust: 0.9,
          empathy: 0.9,
          emotionalResonance: 0.9
        }
      };

      const result = await matrix.handleVersionValidation(version);
      expect(result.overallPass).toBe(true);
    });

    it('should fail on missing required sections', async () => {
      const version: PromptVersion = {
        version: 'v1.0.0',
        timestamp: new Date().toISOString(),
        trigger: {
          type: 'clarity',
          scenarioId: 'test-2',
          promptPath: 'test/prompt.md',
          priority: 'high',
          metrics: { delta: 0.9, drift: 0.1, trustScore: 0.9 },
          timestamp: new Date().toISOString()
        },
        content: `
# Test Prompt
This is a test prompt missing required sections.
`,
        metrics: {
          clarity: 0.9,
          trust: 0.9,
          empathy: 0.9,
          emotionalResonance: 0.9
        }
      };

      const result = await matrix.handleVersionValidation(version);
      expect(result.overallPass).toBe(false);
      
      // Verify failure sample was stored
      const failurePath = path.join(FAILURES_DIR, `${version.version}.json`);
      const failureContent = await fs.readFile(failurePath, 'utf8');
      expect(JSON.parse(failureContent)).toMatchObject({
        version: version.version,
        promptPath: version.trigger.promptPath,
        reason: 'Missing required sections'
      });
    });
  });

  describe('Persona Alignment Tests', () => {
    it('should pass persona-aligned prompt', async () => {
      const version: PromptVersion = {
        version: 'v1.0.0',
        timestamp: new Date().toISOString(),
        trigger: {
          type: 'empathy',
          scenarioId: 'test-3',
          promptPath: 'test/prompt.md',
          priority: 'high',
          metrics: { delta: 0.9, drift: 0.1, trustScore: 0.9 },
          timestamp: new Date().toISOString()
        },
        content: `
# Test Prompt
## Context
This is a test prompt aligned with persona values.

## Instructions
1. First step
2. Second step

## Output Format
- JSON response
- Markdown summary

## Persona Notes
- Tone: Professional, empathetic
- Values: Clarity, trust, growth
`,
        metrics: {
          clarity: 0.9,
          trust: 0.9,
          empathy: 0.9,
          emotionalResonance: 0.9
        }
      };

      const result = await matrix.handleVersionValidation(version);
      expect(result.overallPass).toBe(true);
    });

    it('should fail on persona misalignment', async () => {
      const version: PromptVersion = {
        version: 'v1.0.0',
        timestamp: new Date().toISOString(),
        trigger: {
          type: 'empathy',
          scenarioId: 'test-4',
          promptPath: 'test/prompt.md',
          priority: 'high',
          metrics: { delta: 0.9, drift: 0.1, trustScore: 0.9 },
          timestamp: new Date().toISOString()
        },
        content: `
# Test Prompt
## Context
This is a test prompt with misaligned tone.

## Instructions
1. First step
2. Second step

## Output Format
- JSON response
- Markdown summary

## Persona Notes
- Tone: Casual, informal
- Values: Speed, efficiency
`,
        metrics: {
          clarity: 0.9,
          trust: 0.9,
          empathy: 0.9,
          emotionalResonance: 0.9
        }
      };

      const result = await matrix.handleVersionValidation(version);
      expect(result.overallPass).toBe(false);
    });
  });

  describe('Regression Tests', () => {
    it('should pass when metrics improve', async () => {
      const version: PromptVersion = {
        version: 'v1.0.0',
        timestamp: new Date().toISOString(),
        trigger: {
          type: 'trust',
          scenarioId: 'test-5',
          promptPath: 'test/prompt.md',
          priority: 'high',
          metrics: { delta: 0.95, drift: 0.05, trustScore: 0.95 },
          timestamp: new Date().toISOString()
        },
        content: `
# Test Prompt
## Context
This is a test prompt with improved metrics.

## Instructions
1. First step
2. Second step

## Output Format
- JSON response
- Markdown summary
`,
        metrics: {
          clarity: 0.95,
          trust: 0.95,
          empathy: 0.95,
          emotionalResonance: 0.95
        }
      };

      const result = await matrix.handleVersionValidation(version);
      expect(result.overallPass).toBe(true);
    });

    it('should fail on metric regression', async () => {
      const version: PromptVersion = {
        version: 'v1.0.0',
        timestamp: new Date().toISOString(),
        trigger: {
          type: 'trust',
          scenarioId: 'test-6',
          promptPath: 'test/prompt.md',
          priority: 'high',
          metrics: { delta: 0.7, drift: 0.3, trustScore: 0.7 },
          timestamp: new Date().toISOString()
        },
        content: `
# Test Prompt
## Context
This is a test prompt with regressed metrics.

## Instructions
1. First step
2. Second step

## Output Format
- JSON response
- Markdown summary
`,
        metrics: {
          clarity: 0.7,
          trust: 0.7,
          empathy: 0.7,
          emotionalResonance: 0.7
        }
      };

      const result = await matrix.handleVersionValidation(version);
      expect(result.overallPass).toBe(false);
    });
  });

  describe('Mutation Tests', () => {
    it('should handle optional MCP fields correctly', async () => {
      const version: PromptVersion = {
        version: 'v1.0.0',
        timestamp: new Date().toISOString(),
        trigger: {
          type: 'clarity',
          scenarioId: 'test-7',
          promptPath: 'test/prompt.md',
          priority: 'high',
          metrics: { delta: 0.9, drift: 0.1, trustScore: 0.9 },
          timestamp: new Date().toISOString()
        },
        content: `
# Test Prompt
## Context
This is a test prompt with optional fields.

## Instructions
1. First step
2. Second step

## Output Format
- JSON response
- Markdown summary

## Optional Fields
- Custom metadata
- Extended context
`,
        metrics: {
          clarity: 0.9,
          trust: 0.9,
          empathy: 0.9,
          emotionalResonance: 0.9
        }
      };

      const result = await matrix.handleVersionValidation(version);
      expect(result.overallPass).toBe(true);
    });

    it('should handle missing optional fields gracefully', async () => {
      const version: PromptVersion = {
        version: 'v1.0.0',
        timestamp: new Date().toISOString(),
        trigger: {
          type: 'clarity',
          scenarioId: 'test-8',
          promptPath: 'test/prompt.md',
          priority: 'high',
          metrics: { delta: 0.9, drift: 0.1, trustScore: 0.9 },
          timestamp: new Date().toISOString()
        },
        content: `
# Test Prompt
## Context
This is a test prompt without optional fields.

## Instructions
1. First step
2. Second step

## Output Format
- JSON response
- Markdown summary
`,
        metrics: {
          clarity: 0.9,
          trust: 0.9,
          empathy: 0.9,
          emotionalResonance: 0.9
        }
      };

      const result = await matrix.handleVersionValidation(version);
      expect(result.overallPass).toBe(true);
    });
  });

  describe('Event Bus Integration', () => {
    it('should emit validation events', async () => {
      const version: PromptVersion = {
        version: 'v1.0.0',
        timestamp: new Date().toISOString(),
        trigger: {
          type: 'clarity',
          scenarioId: 'test-9',
          promptPath: 'test/prompt.md',
          priority: 'high',
          metrics: { delta: 0.9, drift: 0.1, trustScore: 0.9 },
          timestamp: new Date().toISOString()
        },
        content: `
# Test Prompt
## Context
This is a test prompt for event emission.

## Instructions
1. First step
2. Second step

## Output Format
- JSON response
- Markdown summary
`,
        metrics: {
          clarity: 0.9,
          trust: 0.9,
          empathy: 0.9,
          emotionalResonance: 0.9
        }
      };

      const eventSpy = jest.spyOn(eventBus, 'emit');
      await matrix.handleVersionValidation(version);
      
      expect(eventSpy).toHaveBeenCalledWith('VALIDATION_COMPLETED', expect.any(Object));
    });

    it('should emit block events on failure', async () => {
      const version: PromptVersion = {
        version: 'v1.0.0',
        timestamp: new Date().toISOString(),
        trigger: {
          type: 'clarity',
          scenarioId: 'test-10',
          promptPath: 'test/prompt.md',
          priority: 'high',
          metrics: { delta: 0.7, drift: 0.3, trustScore: 0.7 },
          timestamp: new Date().toISOString()
        },
        content: `
# Test Prompt
This is a test prompt that should fail validation.
`,
        metrics: {
          clarity: 0.7,
          trust: 0.7,
          empathy: 0.7,
          emotionalResonance: 0.7
        }
      };

      const eventSpy = jest.spyOn(eventBus, 'emit');
      await matrix.handleVersionValidation(version);
      
      expect(eventSpy).toHaveBeenCalledWith('VALIDATION_FAILED', expect.any(Object));
      expect(eventSpy).toHaveBeenCalledWith('ACTIVATION_BLOCKED', expect.any(Object));
    });
  });

  describe('End-to-End Fail Scenario', () => {
    it('should handle complete validation failure pipeline', async () => {
      // Create a version with multiple validation issues
      const version: PromptVersion = {
        version: 'v1.0.0',
        timestamp: new Date().toISOString(),
        trigger: {
          type: 'clarity',
          scenarioId: 'fail-test-1',
          promptPath: 'test/fail-prompt.md',
          priority: 'high',
          metrics: { delta: 0.6, drift: 0.4, trustScore: 0.6 },
          timestamp: new Date().toISOString()
        },
        content: `
# Test Prompt
## Context
This is a test prompt with multiple validation issues.

## Instructions
1. First step
2. Second step

## Persona Notes
- Tone: Casual, informal
- Values: Speed, efficiency
`,
        metrics: {
          clarity: 0.6,
          trust: 0.6,
          empathy: 0.6,
          emotionalResonance: 0.6
        }
      };

      // Run validation
      const result = await matrix.handleVersionValidation(version);
      
      // Verify validation failed
      expect(result.overallPass).toBe(false);
      
      // Verify failure reasons
      const failedTests = result.results.filter(r => !r.passed);
      expect(failedTests.length).toBeGreaterThan(0);
      
      // Verify structural failure
      const structuralFailures = failedTests.filter(r => r.test.type === 'structural');
      expect(structuralFailures.length).toBeGreaterThan(0);
      
      // Verify persona failure
      const personaFailures = failedTests.filter(r => r.test.type === 'persona');
      expect(personaFailures.length).toBeGreaterThan(0);
      
      // Verify regression failure
      const regressionFailures = failedTests.filter(r => r.test.type === 'regression');
      expect(regressionFailures.length).toBeGreaterThan(0);
      
      // Verify failure sample was stored
      const failurePath = path.join(FAILURES_DIR, `${version.version}.json`);
      const failureContent = await fs.readFile(failurePath, 'utf8');
      const failureData = JSON.parse(failureContent);
      
      expect(failureData).toMatchObject({
        version: version.version,
        promptPath: version.trigger.promptPath,
        failedTests: expect.arrayContaining([
          expect.objectContaining({ type: 'structural' }),
          expect.objectContaining({ type: 'persona' }),
          expect.objectContaining({ type: 'regression' })
        ])
      });
      
      // Verify event emissions
      const eventSpy = jest.spyOn(eventBus, 'emit');
      expect(eventSpy).toHaveBeenCalledWith('VALIDATION_FAILED', expect.any(Object));
      expect(eventSpy).toHaveBeenCalledWith('ACTIVATION_BLOCKED', expect.any(Object));
      
      // Verify log entries
      const logPath = '/prompt-validation.log.md';
      const logContent = await fs.readFile(logPath, 'utf8');
      expect(logContent).toContain('Validation FAILED');
      expect(logContent).toContain(version.version);
      expect(logContent).toContain('Multiple validation issues detected');
      
      // Verify block log
      const blockLogPath = '/prompt-validation/blocks.log.md';
      const blockLogContent = await fs.readFile(blockLogPath, 'utf8');
      expect(blockLogContent).toContain('Prompt Activation Blocked');
      expect(blockLogContent).toContain(version.version);
      expect(blockLogContent).toContain('Failed validation matrix');
    });
  });
}); 