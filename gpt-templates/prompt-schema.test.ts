/**
 * @file gpt-templates/prompt-schema.test.ts
 * @description Tests for GPT prompt schema validation and template management
 * @version 6.1.4
 * @emotionalResonance true
 * @dreamStateAlignment true
 */

import { PromptSchema } from '../gpt-templates/prompt-schema';
import { TemplateManager } from '../gpt-templates/template-manager';
import { EmotionalResonanceValidator } from '../cursor/emotional-ux/validator';
import { DreamStateAligner } from '../cursor/dream-state/aligner';

describe('Prompt Schema', () => {
  let promptSchema: PromptSchema;
  let templateManager: TemplateManager;
  let emotionalValidator: EmotionalResonanceValidator;
  let dreamStateAligner: DreamStateAligner;

  beforeEach(() => {
    promptSchema = new PromptSchema({
      version: '6.1.4',
      requiredFields: ['input', 'context', 'constraints'],
      optionalFields: ['examples', 'fallback']
    });
    templateManager = new TemplateManager();
    emotionalValidator = new EmotionalResonanceValidator();
    dreamStateAligner = new DreamStateAligner();
  });

  describe('Schema Validation', () => {
    it('should validate required fields', async () => {
      const prompt = {
        input: 'Test input',
        context: 'Test context',
        constraints: ['constraint1', 'constraint2']
      };
      
      const validation = await promptSchema.validateFields(prompt);
      expect(validation.isValid).toBe(true);
      expect(validation.missingFields).toHaveLength(0);
    });

    it('should validate field types', async () => {
      const prompt = {
        input: 'Test input',
        context: 'Test context',
        constraints: ['constraint1'],
        examples: ['example1'],
        fallback: { strategy: 'retry' }
      };
      
      const validation = await promptSchema.validateTypes(prompt);
      expect(validation.isValid).toBe(true);
      expect(validation.typeErrors).toHaveLength(0);
    });
  });

  describe('Template Management', () => {
    it('should load template successfully', async () => {
      const template = await templateManager.loadTemplate('test-template');
      expect(template.name).toBe('test-template');
      expect(template.version).toBe('6.1.4');
    });

    it('should validate template structure', async () => {
      const template = {
        name: 'test-template',
        version: '6.1.4',
        schema: {
          input: 'string',
          context: 'string',
          constraints: 'array'
        }
      };
      
      const validation = await templateManager.validateTemplate(template);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });
  });

  describe('Emotional Resonance', () => {
    it('should validate prompt tone', async () => {
      const prompt = {
        input: 'Test input',
        context: 'Test context',
        constraints: ['constraint1']
      };
      
      const toneValidation = await emotionalValidator.validatePromptTone(prompt);
      expect(toneValidation.isResonant).toBe(true);
      expect(toneValidation.resonanceScore).toBeGreaterThanOrEqual(0.8);
    });

    it('should ensure consistent emotional alignment', async () => {
      const alignment = await promptSchema.getEmotionalAlignment();
      const validation = await emotionalValidator.validateAlignment(alignment);
      
      expect(validation.isConsistent).toBe(true);
      expect(validation.consistencyScore).toBeGreaterThanOrEqual(0.9);
    });
  });

  describe('Dream State Alignment', () => {
    it('should validate schema alignment', async () => {
      const schema = await promptSchema.getSchemaData();
      const alignment = await dreamStateAligner.validateSchemaAlignment(schema);
      
      expect(alignment.isAligned).toBe(true);
      expect(alignment.alignmentScore).toBeGreaterThanOrEqual(0.9);
    });

    it('should ensure future capability preservation', async () => {
      const capabilities = await templateManager.getFutureCapabilities();
      const preservation = await dreamStateAligner.validateCapabilities(capabilities);
      
      expect(preservation.isPreserved).toBe(true);
      expect(preservation.preservationScore).toBeGreaterThanOrEqual(0.9);
    });
  });

  describe('Integration Points', () => {
    it('should integrate with GPT API', async () => {
      const integration = await promptSchema.validateApiIntegration();
      expect(integration.isValid).toBe(true);
      expect(integration.status).toBe('connected');
    });

    it('should integrate with template storage', async () => {
      const integration = await templateManager.validateStorageIntegration();
      expect(integration.isValid).toBe(true);
      expect(integration.status).toBe('active');
    });
  });

  describe('Fallback Scenarios', () => {
    it('should handle schema validation failures', async () => {
      const failure = await promptSchema.simulateValidationFailure();
      expect(failure.recoveryStrategy).toBeDefined();
      expect(failure.maxRetries).toBeGreaterThan(0);
    });

    it('should handle template loading failures', async () => {
      const failure = await templateManager.simulateLoadingFailure();
      expect(failure.fallbackAction).toBeDefined();
      expect(failure.notificationRequired).toBe(true);
    });
  });

  describe('Version Management', () => {
    it('should validate version compatibility', async () => {
      const compatibility = await promptSchema.validateVersionCompatibility('6.1.4');
      expect(compatibility.isCompatible).toBe(true);
      expect(compatibility.breakingChanges).toHaveLength(0);
    });

    it('should track schema versions', async () => {
      const versions = await promptSchema.getVersionHistory();
      expect(versions.current).toBe('6.1.4');
      expect(versions.history).toBeDefined();
    });
  });
}); 