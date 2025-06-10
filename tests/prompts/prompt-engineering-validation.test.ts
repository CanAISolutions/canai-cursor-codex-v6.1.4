/**
 * Prompt Engineering Template Validation Tests
 * Validates integration with Test-First Truth and Emotional Sovereignty
 */

import { PromptQualityValidator } from '../../scripts/tools/validate-prompt-quality';
import * as fs from 'fs';
import * as path from 'path';
import { describe, beforeEach, test, expect } from '@jest/globals';

// Use process.cwd() for current working directory
const projectRoot = process.cwd();

describe('Prompt Engineering Framework Integration', () => {
  let validator: PromptQualityValidator;

  beforeEach(() => {
    validator = new PromptQualityValidator();
  });

  describe('Template Structure Validation', () => {
    test('Universal template exists and has required sections', () => {
      const templatePath = path.join(projectRoot, 'prompts/templates/pair-programmer.mcp');
      expect(fs.existsSync(templatePath)).toBe(true);
      
      const content = fs.readFileSync(templatePath, 'utf8');
      expect(content).toContain('**ROLE**:');
      expect(content).toContain('Sacred Reversal Test');
      expect(content).toContain('Emotional Sovereignty Standards');
      expect(content).toContain('Quality Gates');
    });

    test('Frontend template extends universal template properly', () => {
      const templatePath = path.join(projectRoot, 'prompts/domain-specific/frontend/frontend.mcp');
      expect(fs.existsSync(templatePath)).toBe(true);
      
      const content = fs.readFileSync(templatePath, 'utf8');
      expect(content).toContain('Frontend-Specific Constraints');
      expect(content).toContain('TypeScript');
      expect(content).toContain('accessibility');
      expect(content).toContain('Sacred Reversal Test');
    });

    test('Quality checklist exists and has all required sections', () => {
      const checklistPath = path.join(projectRoot, 'prompts/quality-checklist.md');
      expect(fs.existsSync(checklistPath)).toBe(true);
      
      const content = fs.readFileSync(checklistPath, 'utf8');
      expect(content).toContain('Pre-Query Validation');
      expect(content).toContain('Post-Response Validation');
      expect(content).toContain('Sacred Reversal Test Validation');
      expect(content).toContain('Test-First Truth Standards');
    });
  });

  describe('Sacred Reversal Test Integration', () => {
    test('validates empowering responses pass Sacred Reversal Test', async () => {
      const prompt = 'Help me fix this React component state issue';
      const goodResponse = `
        Intent: Enhance existing state management pattern
        
        15:18:components/UserProfile.tsx
        const [user, setUser] = useState<User | null>(null);
        // ... existing component logic unchanged ...
        
        Rationale: This builds on your existing pattern while adding proper TypeScript safety.
        Trust Transparency: Preserves your component architecture while enhancing type safety.
      `;

      const result = await validator.validatePromptInteraction(prompt, goodResponse);
      expect(result.sacredReversalTest).toBe(true);
      expect(result.metrics.emotionalIntelligence).toBeGreaterThan(8.0);
    });

    test('rejects dismissive responses that fail Sacred Reversal Test', async () => {
      const prompt = 'Help me fix this React component state issue';
      const badResponse = `
        Intent: Fix wrong implementation
        
        15:18:components/UserProfile.tsx
        // Your current code is bad, here's the correct way:
        const [user, setUser] = useState<User | null>(null);
        
        Rationale: This is the proper way to handle state.
      `;

      const result = await validator.validatePromptInteraction(prompt, badResponse);
      expect(result.sacredReversalTest).toBe(false);
      expect(result.issues).toContain('Failed Sacred Reversal Test - does not honor user sovereignty');
    });
  });

  describe('Test-First Truth Integration', () => {
    test('validates responses with test evidence pass Test-First Truth', async () => {
      const prompt = 'Add unit test for this validation function';
      const response = `
        Intent: Add comprehensive validation test
        
        25:35:src/utils/validator.test.ts
        test('validates email format correctly', () => {
          expect(validateEmail('test@example.com')).toBe(true);
          expect(validateEmail('invalid')).toBe(false);
        });
        
        Rationale: This test validates both valid and invalid cases.
      `;

      const context = {
        testEvidence: {
          testFiles: ['src/utils/validator.test.ts'],
          testResults: { passed: true, coverage: 95 }
        }
      };

      const result = await validator.validatePromptInteraction(prompt, response, context);
      expect(result.testFirstTruthCompliance).toBe(true);
    });

    test('flags responses without test evidence for Test-First Truth violation', async () => {
      const prompt = 'Add new feature to user service';
      const response = `
        Intent: Add user feature
        
        10:20:src/services/userService.ts
        export function newFeature() {
          return 'feature';
        }
        
        Rationale: This adds the requested feature.
      `;

      const result = await validator.validatePromptInteraction(prompt, response);
      expect(result.testFirstTruthCompliance).toBe(false);
      expect(result.issues).toContain('Test-First Truth violation - no test evidence provided');
    });
  });

  describe('Quality Metrics Validation', () => {
    test('validates high-quality responses meet all thresholds', async () => {
      const prompt = 'Optimize this database query for better performance';
      const response = `
        Intent: Enhance query performance while preserving logic
        
        42:48:src/services/database.ts
        const optimizedQuery = await prisma.user.findMany({
          where: criteria,
          select: { id: true, name: true, email: true },
          take: limit
        });
        // ... existing error handling unchanged ...
        
        Rationale: This adds field selection and limits to improve performance while maintaining your existing error handling patterns.
        Trust Transparency: Query optimization reduces response time without changing the data structure your component expects.
      `;

      const context = {
        testEvidence: {
          testFiles: ['src/services/database.test.ts'],
          testResults: { passed: true, performance: 'improved' }
        },
        userFeedback: {
          worked: true,
          firstTrySuccess: true
        },
        trustMetrics: {
          score: 4.5
        }
      };

      const result = await validator.validatePromptInteraction(prompt, response, context);
      
      expect(result.passed).toBe(true);
      expect(result.score).toBeGreaterThan(8.5);
      expect(result.metrics.clarity).toBeGreaterThan(8.0);
      expect(result.metrics.completeness).toBeGreaterThan(9.0);
      expect(result.metrics.emotionalIntelligence).toBeGreaterThan(9.0);
      expect(result.sacredReversalTest).toBe(true);
      expect(result.testFirstTruthCompliance).toBe(true);
    });

    test('generates detailed validation report', async () => {
      const prompt = 'Fix TypeScript error in component';
      const response = 'Intent: Fix type error\n25:27:Component.tsx\nconst prop: string = value;';
      
      const result = await validator.validatePromptInteraction(prompt, response);
      const report = validator.generateReport(result);
      
      expect(report).toContain('Prompt Quality Validation Report');
      expect(report).toContain('**Overall Score**:');
      expect(report).toContain('Sacred Reversal Test:');
      expect(report).toContain('Test-First Truth:');
      expect(report).toContain('Quality Metrics');
    });
  });

  describe('Emotional Sovereignty Compliance', () => {
    test('validates emotional intelligence metrics for user empowerment', async () => {
      const empoweringResponse = `
        Intent: Strengthen your existing authentication pattern
        
        10:15:auth/login.ts
        const enhancedAuth = {
          ...existingAuth,
          tokenValidation: validateToken
        };
        // ... your existing security logic preserved ...
        
        Rationale: This builds on your solid security foundation while adding token validation.
        Trust Transparency: Your authentication flow remains unchanged, just enhanced with additional security.
      `;

      const result = await validator.validatePromptInteraction(
        'Add token validation to auth system',
        empoweringResponse
      );

      expect(result.metrics.emotionalIntelligence).toBeGreaterThan(9.0);
      expect(result.sacredReversalTest).toBe(true);
      
      // Should contain empowering language
      const phrases = ['builds on your', 'solid foundation', 'preserved', 'enhanced'];
      phrases.forEach(phrase => {
        expect(empoweringResponse.toLowerCase()).toContain(phrase.toLowerCase());
      });
    });

    test('enforces trust score threshold of 4.2+', async () => {
      const context = {
        trustMetrics: { score: 3.8 }, // Below threshold
        userFeedback: { worked: true }
      };

      const result = await validator.validatePromptInteraction(
        'Update component',
        'Intent: Update\n10:12:comp.tsx\nconst updated = true;',
        context
      );

      expect(result.passed).toBe(false);
      expect(result.issues).toContain('trustScore score 3.8 below threshold 4.2');
    });
  });

  describe('Integration with Existing Systems', () => {
    test('integrates with .cursorrules configuration', () => {
      // This test would verify that the prompt engineering framework
      // properly integrates with the enhanced .cursorrules configuration
      const cursorrules = fs.readFileSync('.cursorrules', 'utf8');
      const config = JSON.parse(cursorrules);
      
      expect(config.promptEngineeringFramework.enabled).toBe(true);
      expect(config.promptEngineeringFramework.templateLibrary.enabled).toBe(true);
      expect(config.promptEngineeringFramework.qualityAssurance.enabled).toBe(true);
    });

    test('validates template library structure matches configuration', () => {
      const cursorrules = fs.readFileSync('.cursorrules', 'utf8');
      const config = JSON.parse(cursorrules);
      
      const standardTemplates = config.promptEngineeringFramework.templateLibrary.standardTemplates;
      
      expect(standardTemplates.problemSolving.emotionalValidation).toBe(true);
      expect(standardTemplates.problemSolving.sacredReversalTest).toBe(true);
      expect(standardTemplates.codeGeneration.testFirstTruth).toBe(true);
      expect(standardTemplates.analysis.transparencyRequired).toBe(true);
    });
  });
});

describe('Template Performance Benchmarks', () => {
  let validator: PromptQualityValidator;

  beforeEach(() => {
    validator = new PromptQualityValidator();
  });

  test('benchmark template effectiveness targets', async () => {
    // Simulate multiple prompt interactions to test effectiveness
    const testCases = [
      {
        prompt: 'Fix React hook dependency issue',
        response: 'Intent: Optimize dependency array\n15:17:hooks/useData.ts\nuseEffect(() => { fetch(); }, [id]);',
        context: { userFeedback: { firstTrySuccess: true, worked: true } }
      },
      {
        prompt: 'Add TypeScript interface',
        response: 'Intent: Define proper interface\n5:10:types.ts\ninterface User { id: string; name: string; }',
        context: { userFeedback: { firstTrySuccess: true, worked: true } }
      }
    ];

    const results = await Promise.all(
      testCases.map(({ prompt, response, context }) =>
        validator.validatePromptInteraction(prompt, response, context)
      )
    );

    // Check that average effectiveness meets target
    const avgEffectiveness = results.reduce((sum, r) => sum + r.metrics.effectiveness, 0) / results.length;
    expect(avgEffectiveness).toBeGreaterThan(8.5);

    // Check that all pass Sacred Reversal Test
    results.forEach(result => {
      expect(result.sacredReversalTest).toBe(true);
    });
  });
}); 