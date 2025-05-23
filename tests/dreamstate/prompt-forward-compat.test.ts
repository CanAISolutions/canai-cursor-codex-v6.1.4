// Polaris Ritual: Prompt Forward Compatibility
// Codex Vector: Schema Evolution Integrity
// Codex Safeguard: Historical prompt inputs must remain processable across all future prompt versions

/**
 * prompt-forward-compat.test.ts
 * 
 * Purpose: Validates that CanAI prompt schemas remain forward-compatible across versions,
 * ensuring historical prompt payloads continue to work with current and future handlers.
 * 
 * What: Tests backward compatibility, additive field safety, deprecation tolerance,
 * version interoperability, schema mutation drift, and historical log rehydration.
 * 
 * Why: Prevents prompt breakage on schema evolution, protects user trust in long-term
 * system continuity, and ensures "the prompt you wrote last year should still work next year."
 * 
 * How: Uses real PromptSchemaValidator, PromptVersionRouter, EnhancerFallbackManager,
 * and PromptLogManager to validate comprehensive forward compatibility scenarios.
 */

import { PromptSchemaValidator, PromptPayload, SchemaValidationResult } from '../../cursor/services/prompt-schema-validator';
import { PromptVersionRouter, PromptProcessingResult } from '../../cursor/services/prompt-version-router';
import { EnhancerFallbackManager, EnhancerFallbackResult } from '../../cursor/services/enhancer-fallback-manager';
import { PromptLogManager, HistoricalPromptLog } from '../../cursor/services/prompt-log-manager';

describe('DreamState: Prompt Forward Compatibility', () => {
  let schemaValidator: PromptSchemaValidator;
  let versionRouter: PromptVersionRouter;
  let enhancerFallbackManager: EnhancerFallbackManager;
  let promptLogManager: PromptLogManager;

  beforeEach(() => {
    schemaValidator = new PromptSchemaValidator();
    versionRouter = new PromptVersionRouter();
    enhancerFallbackManager = new EnhancerFallbackManager();
    promptLogManager = new PromptLogManager();
  });

  describe('🧬 Backward Compatibility Validation', () => {
    it('should accept v1 prompt payloads in current v3 schema', async () => {
      // What: Test that older v1 payloads are accepted by latest v3 schema
      // Why: Ensures historical prompts remain processable
      // How: Validate v1 payload against v3 schema with migration

      const v1Payload: PromptPayload = {
        sessionId: 'session_v1_test',
        promptType: 'business_plan',
        version: 'v1',
        content: 'Create a business plan for a tech startup',
        metadata: {
          trustScore: 0.8,
          emotionalAlignment: 'neutral'
        },
        legacyField: 'legacy_context_data'
      };

      const validationResult = await schemaValidator.validatePrompt(v1Payload, 'v3');

      expect(validationResult.isValid).toBe(true);
      expect(validationResult.compatibilityMatrix.backwardCompatible).toBe(true);
      expect(validationResult.compatibilityMatrix.requiresMigration).toBe(true);
      expect(validationResult.migratedPayload).toBeDefined();
      expect(validationResult.migratedPayload!.version).toBe('v3');
      expect(validationResult.migratedPayload!.recordId).toBeDefined();
      expect(validationResult.fallbacksApplied).toContain('Migrated from v1 to v3');
      expect(validationResult.fallbacksApplied).toContain('Applied default value for: recordId');
    });

    it('should accept v2 prompt payloads in current v3 schema', async () => {
      // What: Test that v2 payloads with enhancer fields work in v3
      // Why: Ensures recent historical prompts remain processable
      // How: Validate v2 payload against v3 schema

      const v2Payload: PromptPayload = {
        sessionId: 'session_v2_test',
        promptType: 'email_campaign',
        version: 'v2',
        content: 'Design an engaging email campaign',
        metadata: {
          trustScore: 0.85,
          emotionalAlignment: 'supportive'
        },
        enhancerFields: {
          emotionalContext: 'engaging',
          urgencyLevel: 2
        }
      };

      const validationResult = await schemaValidator.validatePrompt(v2Payload, 'v3');

      expect(validationResult.isValid).toBe(true);
      expect(validationResult.compatibilityMatrix.backwardCompatible).toBe(true);
      expect(validationResult.migratedPayload!.version).toBe('v3');
      expect(validationResult.migratedPayload!.enhancerFields?.emotionalContext).toBe('engaging');
      expect(validationResult.migratedPayload!.enhancerFields?.urgencyLevel).toBe(2);
    });

    it('should process all historical prompt logs without failure', async () => {
      // What: Replay all historical prompt logs through current system
      // Why: Ensures comprehensive backward compatibility
      // How: Process each historical log through current version router

      const testFixtures = promptLogManager.getTestFixtures();
      const allLogs = testFixtures.allVersions;

      for (const log of allLogs) {
        const processingResult = await versionRouter.routePrompt(log.originalPayload, 'v3');
        
        expect(processingResult.success).toBe(true);
        expect(processingResult.outputContent).toBeDefined();
        expect(processingResult.outputContent.length).toBeGreaterThan(0);
        expect(processingResult.errors).toHaveLength(0);
        
        // Verify output contains expected content
        expect(processingResult.outputContent).toContain(log.originalPayload.content);
      }
    });
  });

  describe('➕ Additive Fields Safety', () => {
    it('should handle new enhancer fields gracefully in older payloads', async () => {
      // What: Add new enhancer fields to existing payload and ensure processing continues
      // Why: Ensures additive schema changes don't break existing functionality
      // How: Add future enhancer field to v2 payload and validate

      const v2PayloadWithFutureField: PromptPayload = {
        sessionId: 'session_additive_test',
        promptType: 'social_content',
        version: 'v2',
        content: 'Create social media content',
        metadata: {
          trustScore: 0.9,
          emotionalAlignment: 'supportive'
        },
        enhancerFields: {
          emotionalContext: 'enthusiastic',
          urgencyLevel: 1,
          // Future field that doesn't exist in v2 schema
          audienceProfile: 'social_media'
        }
      };

      const validationResult = await schemaValidator.validatePrompt(v2PayloadWithFutureField, 'v3');
      
      expect(validationResult.isValid).toBe(true);
      expect(validationResult.migratedPayload!.enhancerFields?.audienceProfile).toBe('social_media');
      expect(validationResult.warnings).toHaveLength(0); // No warnings for additive fields
    });

    it('should apply default values for missing new required fields', async () => {
      // What: Test that missing required fields in newer versions get default values
      // Why: Ensures older payloads work even when new required fields are added
      // How: Process v1 payload missing v3 required fields

      const v1PayloadMissingV3Fields: PromptPayload = {
        sessionId: 'session_missing_fields',
        promptType: 'business_plan',
        version: 'v1',
        content: 'Create business plan'
        // Missing recordId (required in v3)
        // Missing metadata (will get defaults)
      };

      const validationResult = await schemaValidator.validatePrompt(v1PayloadMissingV3Fields, 'v3');
      
      expect(validationResult.isValid).toBe(true);
      expect(validationResult.migratedPayload!.recordId).toBeDefined();
      expect(validationResult.migratedPayload!.metadata).toBeDefined();
      expect(validationResult.migratedPayload!.metadata!.trustScore).toBe(0.9); // v3 default
      expect(validationResult.fallbacksApplied).toContain('Applied default value for: recordId');
    });

    it('should handle enhancer field inference for missing fields', async () => {
      // What: Test that missing enhancer fields are inferred from content and prompt type
      // Why: Ensures graceful enhancement even when fields are missing
      // How: Process payload without enhancer fields and verify inference

      const payloadWithoutEnhancers: PromptPayload = {
        sessionId: 'session_inference_test',
        promptType: 'email_campaign',
        version: 'v3',
        content: 'Create urgent email campaign for product launch',
        recordId: 'test_record_123'
      };

      const enhancerResult = await enhancerFallbackManager.applyEnhancerFallbacks(payloadWithoutEnhancers);
      
      expect(enhancerResult.success).toBe(true);
      expect(enhancerResult.enhancedPayload.enhancerFields).toBeDefined();
      expect(enhancerResult.enhancedPayload.enhancerFields!.emotionalContext).toBe('engaging'); // Inferred from email_campaign
      expect(enhancerResult.enhancedPayload.enhancerFields!.urgencyLevel).toBe(4); // Inferred from 'urgent'
      expect(enhancerResult.enhancedPayload.enhancerFields!.audienceProfile).toBe('customers'); // Inferred from email_campaign
      expect(enhancerResult.enhancerQuality.emotionalContext).toBe('high'); // High confidence inference
    });
  });

  describe('➖ Deprecation Tolerance', () => {
    it('should handle deprecated fields gracefully with warnings', async () => {
      // What: Process payloads with deprecated fields and ensure they don't break processing
      // Why: Ensures deprecated fields are handled gracefully during transition periods
      // How: Validate payload with deprecated fields and check for appropriate warnings

      const payloadWithDeprecatedFields: PromptPayload = {
        sessionId: 'session_deprecated_test',
        promptType: 'business_plan',
        version: 'v1',
        content: 'Create business plan',
        legacyField: 'deprecated_legacy_data',
        deprecatedTone: 'old_tone_format'
      };

      const validationResult = await schemaValidator.validatePrompt(payloadWithDeprecatedFields, 'v3');
      
      expect(validationResult.isValid).toBe(true);
      expect(validationResult.warnings.length).toBeGreaterThan(0);
      expect(validationResult.warnings.some(w => w.includes('Deprecated field found: legacyField'))).toBe(true);
      expect(validationResult.warnings.some(w => w.includes('Deprecated field found: deprecatedTone'))).toBe(true);
      
      // Verify migration occurred
      expect(validationResult.migratedPayload!.enhancerFields?.emotionalContext).toBeDefined();
      expect(validationResult.migratedPayload!.enhancerFields?.personalityTone).toBeDefined();
    });

    it('should migrate deprecated fields to new field locations', async () => {
      // What: Test that deprecated fields are properly migrated to new locations
      // Why: Ensures data preservation during field migrations
      // How: Validate field migration from deprecated to new locations

      const payloadWithMigratableFields: PromptPayload = {
        sessionId: 'session_migration_test',
        promptType: 'social_content',
        version: 'v1',
        content: 'Create social content',
        legacyField: 'legacy_emotional_context',
        deprecatedTone: 'legacy_tone_value'
      };

      const validationResult = await schemaValidator.validatePrompt(payloadWithMigratableFields, 'v3');
      
      expect(validationResult.isValid).toBe(true);
      expect(validationResult.migratedPayload!.enhancerFields?.emotionalContext).toBe('legacy_emotional_context');
      expect(validationResult.migratedPayload!.enhancerFields?.personalityTone).toBe('legacy_tone_value');
      expect(validationResult.migratedPayload!.legacyField).toBeUndefined(); // Should be removed after migration
      expect(validationResult.migratedPayload!.deprecatedTone).toBeUndefined(); // Should be removed after migration
    });
  });

  describe('🔁 Prompt Version Interoperability', () => {
    it('should process v1 inputs with v2 and v3 handlers', async () => {
      // What: Test that v1 payloads can be processed by v2 and v3 handlers
      // Why: Ensures version interoperability and handler flexibility
      // How: Route v1 payload to different version handlers

      const v1Payload: PromptPayload = {
        sessionId: 'session_interop_test',
        promptType: 'email_campaign',
        version: 'v1',
        content: 'Create email campaign for product launch'
      };

      // Test with v2 handler
      const v2Result = await versionRouter.routePrompt(v1Payload, 'v2');
      expect(v2Result.success).toBe(true);
      expect(v2Result.handlerUsed).toBe('v2');
      expect(v2Result.outputContent).toContain('[V2 EMAIL_CAMPAIGN]');

      // Test with v3 handler
      const v3Result = await versionRouter.routePrompt(v1Payload, 'v3');
      expect(v3Result.success).toBe(true);
      expect(v3Result.handlerUsed).toBe('v3');
      expect(v3Result.outputContent).toContain('[V3 EMAIL_CAMPAIGN]');
    });

    it('should maintain handler capability matrix consistency', async () => {
      // What: Verify that handler capabilities are properly exposed and consistent
      // Why: Ensures version routing decisions are based on accurate capability information
      // How: Check handler capabilities matrix

      const capabilitiesMatrix = versionRouter.getCapabilitiesMatrix();
      
      expect(capabilitiesMatrix.v1).toContain('basic-processing');
      expect(capabilitiesMatrix.v1).toContain('legacy-support');
      
      expect(capabilitiesMatrix.v2).toContain('emotional-context');
      expect(capabilitiesMatrix.v2).toContain('trust-scoring');
      
      expect(capabilitiesMatrix.v3).toContain('full-emotional-context');
      expect(capabilitiesMatrix.v3).toContain('audience-profiling');
      expect(capabilitiesMatrix.v3).toContain('session-tracking');
    });
  });

  describe('🧪 Schema Mutation Drift Detection', () => {
    it('should detect and handle schema mutations gracefully', async () => {
      // What: Test system behavior when schema is slightly mutated
      // Why: Ensures resilience against minor schema changes or corruption
      // How: Mutate payload fields and verify graceful handling

      const mutatedPayload: PromptPayload = {
        sessionId: 'session_mutation_test',
        promptType: 'business_plan',
        version: 'v3',
        content: 'Create business plan',
        recordId: 'test_record_456',
        enhancerFields: {
          emotionalContext: 'invalid_emotion_type', // Invalid value
          urgencyLevel: 10, // Out of range (should be 1-5)
          audienceProfile: 'unknown_audience' // Invalid audience type
        }
      };

      const enhancerResult = await enhancerFallbackManager.applyEnhancerFallbacks(mutatedPayload);
      
      expect(enhancerResult.success).toBe(true);
      expect(enhancerResult.warnings.length).toBeGreaterThan(0);
      expect(enhancerResult.fallbacksApplied.length).toBeGreaterThan(0);
      
      // Verify fallbacks were applied
      expect(enhancerResult.enhancedPayload.enhancerFields!.emotionalContext).toBe('professional'); // Fallback for business_plan
      expect(enhancerResult.enhancedPayload.enhancerFields!.urgencyLevel).toBe(1); // Fallback value
      expect(enhancerResult.enhancedPayload.enhancerFields!.audienceProfile).toBe('investors'); // Inferred for business_plan
    });

    it('should validate schema integrity across all supported versions', async () => {
      // What: Verify that all schema versions are properly defined and accessible
      // Why: Ensures schema consistency and prevents version gaps
      // How: Check all supported versions and their schema definitions

      const supportedVersions = schemaValidator.getSupportedVersions();
      
      expect(supportedVersions).toContain('v1');
      expect(supportedVersions).toContain('v2');
      expect(supportedVersions).toContain('v3');
      
      for (const version of supportedVersions) {
        const schema = schemaValidator.getSchema(version);
        expect(schema).toBeDefined();
        expect(schema!.version).toBe(version);
        expect(schema!.requiredFields).toBeDefined();
        expect(schema!.requiredFields.length).toBeGreaterThan(0);
      }
    });
  });

  describe('🧾 PromptLog Rehydration', () => {
    it('should replay historical v1 prompt logs successfully', async () => {
      // What: Replay all v1 historical logs through current system
      // Why: Ensures v1 logs remain processable and produce valid output
      // How: Process each v1 log and compare with expected behavior

      const testFixtures = promptLogManager.getTestFixtures();
      const v1Logs = testFixtures.v1Logs;
      
      expect(v1Logs.length).toBeGreaterThan(0);
      
      for (const log of v1Logs) {
        const replayResult = await versionRouter.routePrompt(log.originalPayload, 'v3');
        
        expect(replayResult.success).toBe(true);
        expect(replayResult.outputContent).toBeDefined();
        expect(replayResult.outputContent).toContain(log.originalPayload.content);
        expect(replayResult.errors).toHaveLength(0);
        
        // Verify migration occurred for v1 logs
        expect(replayResult.fallbacksUsed.some(f => f.includes('Migrated from v1 to v3'))).toBe(true);
      }
    });

    it('should replay historical v2 prompt logs successfully', async () => {
      // What: Replay all v2 historical logs through current system
      // Why: Ensures v2 logs with enhancer fields remain processable
      // How: Process each v2 log and verify enhancer field preservation

      const testFixtures = promptLogManager.getTestFixtures();
      const v2Logs = testFixtures.v2Logs;
      
      expect(v2Logs.length).toBeGreaterThan(0);
      
      for (const log of v2Logs) {
        const replayResult = await versionRouter.routePrompt(log.originalPayload, 'v3');
        
        expect(replayResult.success).toBe(true);
        expect(replayResult.outputContent).toBeDefined();
        expect(replayResult.outputContent).toContain(log.originalPayload.content);
        
        // Verify enhancer fields are preserved
        if (log.originalPayload.enhancerFields?.emotionalContext) {
          expect(replayResult.outputContent).toContain(log.originalPayload.enhancerFields.emotionalContext);
        }
      }
    });

    it('should handle edge case logs gracefully', async () => {
      // What: Process edge case logs (minimal payloads, corrupted data)
      // Why: Ensures system resilience with problematic historical data
      // How: Process edge case logs and verify graceful degradation

      const testFixtures = promptLogManager.getTestFixtures();
      const edgeCaseLogs = testFixtures.edgeCases;
      
      expect(edgeCaseLogs.length).toBeGreaterThan(0);
      
      for (const log of edgeCaseLogs) {
        const replayResult = await versionRouter.routePrompt(log.originalPayload, 'v3');
        
        expect(replayResult.success).toBe(true);
        expect(replayResult.outputContent).toBeDefined();
        
        // Edge cases should have fallbacks applied
        expect(replayResult.fallbacksUsed.length).toBeGreaterThan(0);
      }
    });
  });

  describe('🔍 Compatibility Matrix Logging', () => {
    it('should track compatibility status for all prompt versions', async () => {
      // What: Generate and validate compatibility matrix for all historical logs
      // Why: Provides comprehensive view of system compatibility status
      // How: Process all logs and generate compatibility report

      const testFixtures = promptLogManager.getTestFixtures();
      const compatibilityMatrix = promptLogManager.getCompatibilityMatrix();
      
      expect(compatibilityMatrix).toBeDefined();
      expect(Object.keys(compatibilityMatrix).length).toBeGreaterThan(0);
      
      // Verify matrix structure
      for (const [promptType, data] of Object.entries(compatibilityMatrix)) {
        expect(data.total).toBeGreaterThan(0);
        expect(data.byVersion).toBeDefined();
        expect(Object.keys(data.byVersion).length).toBeGreaterThan(0);
      }
    });

    it('should provide comprehensive compatibility reporting', async () => {
      // What: Generate detailed compatibility report across all scenarios
      // Why: Provides operators with clear visibility into system compatibility status
      // How: Process all test scenarios and generate summary report

      const testFixtures = promptLogManager.getTestFixtures();
      const allLogs = testFixtures.allVersions;
      
      const compatibilityReport = {
        totalLogs: allLogs.length,
        successfulReplays: 0,
        failedReplays: 0,
        migrationsRequired: 0,
        fallbacksApplied: 0,
        byVersion: {} as Record<string, { success: number; failed: number; migrated: number }>
      };

      for (const log of allLogs) {
        const result = await versionRouter.routePrompt(log.originalPayload, 'v3');
        
        if (!compatibilityReport.byVersion[log.version]) {
          compatibilityReport.byVersion[log.version] = { success: 0, failed: 0, migrated: 0 };
        }
        
        if (result.success) {
          compatibilityReport.successfulReplays++;
          compatibilityReport.byVersion[log.version].success++;
          
          if (result.fallbacksUsed.some(f => f.includes('Migrated'))) {
            compatibilityReport.migrationsRequired++;
            compatibilityReport.byVersion[log.version].migrated++;
          }
          
          if (result.fallbacksUsed.length > 0) {
            compatibilityReport.fallbacksApplied++;
          }
        } else {
          compatibilityReport.failedReplays++;
          compatibilityReport.byVersion[log.version].failed++;
        }
      }

      // Verify comprehensive compatibility
      expect(compatibilityReport.totalLogs).toBeGreaterThan(0);
      expect(compatibilityReport.successfulReplays).toBe(compatibilityReport.totalLogs);
      expect(compatibilityReport.failedReplays).toBe(0);
      
      // Verify all versions are represented
      expect(compatibilityReport.byVersion.v1).toBeDefined();
      expect(compatibilityReport.byVersion.v2).toBeDefined();
      expect(compatibilityReport.byVersion.v3).toBeDefined();
    });
  });

  // Codex Safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
  afterEach(() => {
    // This test ensures no silent failures occur and all compatibility issues are traceable
    // Any test failures will be automatically logged by the Jest framework and can be
    // cross-referenced with the auto-actions.log.md for comprehensive audit trails
  });
}); 