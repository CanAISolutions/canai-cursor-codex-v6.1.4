/**
 * @file schemas/validation.test.ts
 * @description Tests for schema validation, type coercion, and edge case handling
 * @version 6.1.4
 * @emotionalResonance true
 * @dreamStateAlignment true
 */

import { SchemaValidator } from '../lib/schemas/validator';
import { TypeCoercer } from '../lib/schemas/type-coercer';
import { EdgeCaseHandler } from '../lib/schemas/edge-case-handler';
import { EmotionalValidator } from '../cursor/validators/emotional-validator';
import { DreamStateChecker } from '../cursor/validators/dream-state';
import { MemoryExporter } from '../cursor/exports/memory-exporter';
import { FallbackScenarios } from '../docs/emotional-fallback-scenarios';

describe('Schema Validation System', () => {
  let validator: SchemaValidator;
  let coercer: TypeCoercer;
  let edgeCaseHandler: EdgeCaseHandler;
  let emotionalValidator: EmotionalValidator;
  let dreamStateChecker: DreamStateChecker;
  let memoryExporter: MemoryExporter;

  beforeEach(async () => {
    validator = new SchemaValidator();
    coercer = new TypeCoercer();
    edgeCaseHandler = new EdgeCaseHandler();
    emotionalValidator = new EmotionalValidator();
    dreamStateChecker = new DreamStateChecker();
    memoryExporter = new MemoryExporter();
  });

  describe('Type Validation', () => {
    test('should validate complex nested types with emotional awareness', async () => {
      // Arrange
      const schema = {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              age: { type: 'number' },
              preferences: {
                type: 'array',
                items: { type: 'string' }
              }
            },
            required: ['name', 'age']
          }
        }
      };

      const data = {
        user: {
          name: 'Alice',
          age: 28,
          preferences: ['reading', 'coding']
        }
      };

      // Act
      const result = await validator.validate(schema, data);
      const emotionalScore = await emotionalValidator.validateResponse(result);
      const dreamStateAligned = await dreamStateChecker.validate(result);

      // Assert
      expect(result.valid).toBe(true);
      expect(emotionalScore).toBeGreaterThanOrEqual(4.2);
      expect(dreamStateAligned).toBe(true);

      // Memory Export
      await memoryExporter.snapshot({
        type: 'schema-validation',
        emotionalScore,
        dreamStateAligned
      });
    });

    test('should handle validation failures with empathy', async () => {
      // Arrange
      const schema = {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' }
        },
        required: ['email']
      };

      const invalidData = {
        email: 'not-an-email'
      };

      // Act
      const result = await validator.validate(schema, invalidData);
      const fallbackMessage = FallbackScenarios.SCHEMA_VALIDATION_FAILURE;
      const emotionalScore = await emotionalValidator.validateMessage(fallbackMessage);

      // Assert
      expect(result.valid).toBe(false);
      expect(emotionalScore).toBeGreaterThanOrEqual(4.2);
      expect(fallbackMessage).toMatch(/Let's refine this together/);
    });
  });

  describe('Type Coercion', () => {
    test('should coerce types while maintaining data integrity', async () => {
      // Arrange
      const schema = {
        type: 'object',
        properties: {
          id: { type: 'number' },
          active: { type: 'boolean' },
          tags: { type: 'array', items: { type: 'string' } }
        }
      };

      const rawData = {
        id: '123',
        active: 1,
        tags: 'one,two,three'
      };

      // Act
      const result = await coercer.coerce(schema, rawData);
      const emotionalScore = await emotionalValidator.validateResponse(result);

      // Assert
      expect(result.coerced).toEqual({
        id: 123,
        active: true,
        tags: ['one', 'two', 'three']
      });
      expect(emotionalScore).toBeGreaterThanOrEqual(4.2);
    });

    test('should handle coercion edge cases gracefully', async () => {
      // Arrange
      const schema = {
        type: 'object',
        properties: {
          timestamp: { type: 'string', format: 'date-time' },
          count: { type: 'number' }
        }
      };

      const edgeData = {
        timestamp: 1683936000000,
        count: Infinity
      };

      // Act
      const result = await coercer.coerce(schema, edgeData);
      const emotionalScore = await emotionalValidator.validateResponse(result);

      // Assert
      expect(result.coerced.timestamp).toMatch(ISO8601_REGEX);
      expect(result.coerced.count).toBe(null);
      expect(emotionalScore).toBeGreaterThanOrEqual(4.2);
    });
  });

  describe('Edge Case Handling', () => {
    test('should handle null and undefined values appropriately', async () => {
      // Arrange
      const schema = {
        type: 'object',
        properties: {
          optionalField: { type: ['string', 'null'] },
          requiredField: { type: 'string' }
        },
        required: ['requiredField']
      };

      const edgeCases = [
        { optionalField: null, requiredField: 'present' },
        { requiredField: 'present' },
        { optionalField: undefined, requiredField: 'present' }
      ];

      // Act & Assert
      for (const data of edgeCases) {
        const result = await edgeCaseHandler.handle(schema, data);
        const emotionalScore = await emotionalValidator.validateResponse(result);

        expect(result.handled).toBe(true);
        expect(emotionalScore).toBeGreaterThanOrEqual(4.2);
      }
    });

    test('should validate array edge cases with emotional awareness', async () => {
      // Arrange
      const schema = {
        type: 'array',
        items: { type: 'string' },
        minItems: 1,
        maxItems: 5,
        uniqueItems: true
      };

      const edgeCases = [
        [],                                    // Too few items
        ['a', 'a'],                           // Duplicate items
        ['1', '2', '3', '4', '5', '6'],      // Too many items
        ['valid', null, undefined, '']        // Mixed validity
      ];

      // Act & Assert
      for (const data of edgeCases) {
        const result = await edgeCaseHandler.handle(schema, data);
        const emotionalScore = await emotionalValidator.validateResponse(result);
        const fallbackMessage = FallbackScenarios.EDGE_CASE_HANDLING;

        expect(result.handled).toBe(true);
        expect(emotionalScore).toBeGreaterThanOrEqual(4.2);
        expect(fallbackMessage).toMatch(/We'll guide you through this/);
      }
    });
  });
});

const ISO8601_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(([+-]\d{2}:\d{2})|Z)?$/; 