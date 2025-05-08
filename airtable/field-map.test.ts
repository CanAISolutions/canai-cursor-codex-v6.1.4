/**
 * @file airtable/field-map.test.ts
 * @description Tests for Airtable field mapping and schema validation
 * @version 6.1.4
 * @emotionalResonance true
 * @dreamStateAlignment true
 */

import { FieldMapper } from '../airtable/field-mapper';
import { SchemaValidator } from '../airtable/schema-validator';
import { SyncManager } from '../airtable/sync-manager';
import { EmotionalResonanceValidator } from '../cursor/emotional-ux/validator';
import { DreamStateAligner } from '../cursor/dream-state/aligner';

describe('Airtable Field Mapping', () => {
  let fieldMapper: FieldMapper;
  let schemaValidator: SchemaValidator;
  let syncManager: SyncManager;
  let emotionalValidator: EmotionalResonanceValidator;
  let dreamStateAligner: DreamStateAligner;

  beforeEach(() => {
    fieldMapper = new FieldMapper({
      apiKey: process.env.AIRTABLE_API_KEY,
      baseId: process.env.AIRTABLE_BASE_ID
    });
    schemaValidator = new SchemaValidator();
    syncManager = new SyncManager();
    emotionalValidator = new EmotionalResonanceValidator();
    dreamStateAligner = new DreamStateAligner();
  });

  describe('Field Mapping', () => {
    it('should map fields correctly', async () => {
      const sourceFields = {
        name: 'John Doe',
        email: 'john@example.com',
        status: 'active'
      };
      
      const mappedFields = await fieldMapper.mapFields(sourceFields);
      expect(mappedFields).toMatchObject({
        fullName: 'John Doe',
        contactEmail: 'john@example.com',
        accountStatus: 'active'
      });
    });

    it('should handle field transformations', async () => {
      const sourceFields = {
        date: '2025-05-08',
        amount: '1000.50'
      };
      
      const transformedFields = await fieldMapper.transformFields(sourceFields);
      expect(transformedFields).toMatchObject({
        formattedDate: 'May 8, 2025',
        numericAmount: 1000.50
      });
    });
  });

  describe('Schema Validation', () => {
    it('should validate field types', async () => {
      const fields = {
        name: 'John Doe',
        age: 30,
        isActive: true
      };
      
      const validation = await schemaValidator.validateTypes(fields);
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it('should validate required fields', async () => {
      const fields = {
        name: 'John Doe',
        // email is missing
        status: 'active'
      };
      
      const validation = await schemaValidator.validateRequired(fields);
      expect(validation.isValid).toBe(false);
      expect(validation.missingFields).toContain('email');
    });
  });

  describe('Data Synchronization', () => {
    it('should sync data successfully', async () => {
      const data = {
        records: [
          { id: '1', fields: { name: 'John Doe' } },
          { id: '2', fields: { name: 'Jane Smith' } }
        ]
      };
      
      const result = await syncManager.syncData(data);
      expect(result.success).toBe(true);
      expect(result.syncedRecords).toBe(2);
    });

    it('should validate emotional resonance of data handling', async () => {
      const data = {
        records: [
          { id: '1', fields: { name: 'John Doe' } }
        ]
      };
      
      const emotionalValidation = await emotionalValidator.validateDataHandling(data);
      expect(emotionalValidation.isResonant).toBe(true);
      expect(emotionalValidation.resonanceScore).toBeGreaterThanOrEqual(0.8);
    });

    it('should ensure dream-state alignment of data sync', async () => {
      const data = {
        records: [
          { id: '1', fields: { name: 'John Doe' } }
        ]
      };
      
      const alignment = await dreamStateAligner.validateDataAlignment(data);
      expect(alignment.isAligned).toBe(true);
      expect(alignment.alignmentScore).toBeGreaterThanOrEqual(0.9);
    });
  });

  describe('Integration Points', () => {
    it('should integrate with Airtable API', async () => {
      const integration = await fieldMapper.validateApiIntegration();
      expect(integration.isValid).toBe(true);
      expect(integration.status).toBe('connected');
    });

    it('should integrate with data pipeline', async () => {
      const integration = await syncManager.validatePipelineIntegration();
      expect(integration.isValid).toBe(true);
      expect(integration.status).toBe('active');
    });
  });

  describe('Fallback Scenarios', () => {
    it('should handle API rate limiting', async () => {
      const rateLimitTest = await fieldMapper.simulateRateLimit();
      expect(rateLimitTest.retryStrategy).toBeDefined();
      expect(rateLimitTest.backoffDelay).toBeGreaterThan(0);
    });

    it('should handle schema validation failures', async () => {
      const validationTest = await schemaValidator.simulateValidationFailure();
      expect(validationTest.fallbackAction).toBeDefined();
      expect(validationTest.notificationRequired).toBe(true);
    });

    it('should handle sync failures', async () => {
      const syncTest = await syncManager.simulateSyncFailure();
      expect(syncTest.recoveryStrategy).toBeDefined();
      expect(syncTest.maxRetries).toBeGreaterThan(0);
    });
  });

  describe('Emotional Resonance', () => {
    it('should validate data presentation', async () => {
      const data = await fieldMapper.getFormattedData();
      const presentationValidation = await emotionalValidator.validateDataPresentation(data);
      
      expect(presentationValidation.isResonant).toBe(true);
      expect(presentationValidation.resonanceScore).toBeGreaterThanOrEqual(0.8);
    });

    it('should ensure consistent data formatting', async () => {
      const formatting = await fieldMapper.getDataFormatting();
      const consistencyCheck = await emotionalValidator.validateFormatting(formatting);
      
      expect(consistencyCheck.isConsistent).toBe(true);
      expect(consistencyCheck.consistencyScore).toBeGreaterThanOrEqual(0.9);
    });
  });

  describe('Dream State Alignment', () => {
    it('should validate system-wide alignment', async () => {
      const alignment = await dreamStateAligner.validateSystemAlignment();
      expect(alignment.isAligned).toBe(true);
      expect(alignment.alignmentScore).toBeGreaterThanOrEqual(0.9);
    });

    it('should ensure future capability preservation', async () => {
      const capabilities = await dreamStateAligner.validateCapabilities();
      expect(capabilities.isPreserved).toBe(true);
      expect(capabilities.preservationScore).toBeGreaterThanOrEqual(0.9);
    });
  });
}); 