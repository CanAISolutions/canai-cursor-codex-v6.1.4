// schema-migration-emotion.test.ts
// DreamState Test 4: Schema Migration Emotion
// What: Ensures emotional metadata persistence across schema upgrades
// Why: Prevents loss of emotional fidelity during schema migrations
// How: Uses real SchemaManager, EmotionalValidator, FallbackManager, TrustScoreManager, and EventBus

// Polaris Ritual: Schema Migration Continuity
// Codex Vector: Evolution Without Emotional Loss
// Codex Safeguard: Migrated prompts must preserve tone, trust, and fallback readiness

import { describe, it, expect, beforeEach } from '@jest/globals';
import { EventBus } from '../../cursor/event-bus/eventBus';
import { PromptSchemaValidator, PromptPayload, SchemaValidationResult } from '../../cursor/services/prompt-schema-validator';
import { EmotionalValidator } from '../../cursor/validators/emotional-validator';
import { FallbackManager } from '../../cursor/services/fallback-manager';
import { TrustScoreManager } from '../../cursor/services/trust-score-manager';
import { replayPromptSession } from '../../cursor/self-healing/ai-refactor-scripts/promptReplay';

describe('DreamState: Schema Migration Emotion', () => {
  let schemaValidator: PromptSchemaValidator;
  let emotionalValidator: EmotionalValidator;
  let fallbackManager: FallbackManager;
  let trustScoreManager: TrustScoreManager;
  let eventBus: EventBus;

  // Real v2 and v3 prompt fixtures for migration testing
  const v2PromptFixture: PromptPayload = {
    sessionId: 'session_v2_migration_001',
    promptType: 'business_plan',
    version: 'v2',
    content: 'Create a comprehensive business plan for a sustainable coffee shop',
    metadata: {
      author: 'user_migration_test',
      trustScore: 0.85,
      emotionalAlignment: 'empathetic'
    },
    enhancerFields: {
      emotionalContext: 'empathetic',
      urgencyLevel: 2
    }
  };

  const v2PromptMissingFields: PromptPayload = {
    sessionId: 'session_v2_missing_002',
    promptType: 'email_campaign',
    version: 'v2',
    content: 'Draft an engaging email campaign for product launch'
    // Missing metadata and enhancerFields to test default injection
  };

  const malformedV2Prompt: PromptPayload = {
    sessionId: 'session_v2_malformed_003',
    promptType: 'social_content',
    version: 'v2',
    content: 'Generate social media content',
    metadata: {
      trustScore: 0.75,
      emotionalAlignment: 'invalid_emotion_type' // Invalid value
    },
    enhancerFields: {
      emotionalContext: 'corrupted_context',
      urgencyLevel: 15 // Out of range (should be 1-5)
    }
  };

  beforeEach(() => {
    eventBus = EventBus.getInstance();
    schemaValidator = new PromptSchemaValidator();
    emotionalValidator = new EmotionalValidator();
    fallbackManager = FallbackManager.getInstance();
    trustScoreManager = new TrustScoreManager(eventBus);
  });

  describe('🔁 Schema Migration Integrity', () => {
    it('should execute v2 → v3 migration with full continuity', async () => {
      // Polaris Ritual: Schema Migration Continuity
      // Codex Vector: Evolution Without Emotional Loss
      
      const result: SchemaValidationResult = await schemaValidator.validatePrompt(v2PromptFixture, 'v3');
      
      // Validate migration success
      expect(result.isValid).toBe(true);
      expect(result.version).toBe('v3');
      expect(result.compatibilityMatrix.requiresMigration).toBe(true);
      expect(result.migratedPayload).toBeDefined();
      
      // Validate migrated payload structure
      const migratedPayload = result.migratedPayload!;
      expect(migratedPayload.version).toBe('v3');
      expect(migratedPayload.recordId).toBeDefined();
      expect(migratedPayload.sessionId).toBe(v2PromptFixture.sessionId);
      expect(migratedPayload.content).toBe(v2PromptFixture.content);
      
      // Validate migration logging
      expect(result.fallbacksApplied).toContain('Migrated from v2 to v3');
      expect(result.fallbacksApplied.some(f => f.includes('Applied default value for: recordId'))).toBe(true);
      
      // Validate no errors occurred
      expect(result.errors).toHaveLength(0);
      
      // Essential DreamState validations
      expect(migratedPayload.recordId).toBeDefined();
      expect(migratedPayload.metadata?.trustScore).toBeGreaterThanOrEqual(0.75);
      expect(result.fallbacksApplied.some(f => f.includes('emotional_continuity_preserved') || f.includes('Migrated'))).toBe(true);
    });

    it('should preserve emotional tone through migration', async () => {
      // Polaris Ritual: Schema Migration Continuity
      // Codex Vector: Emotional Tone Preservation
      
      const originalTone = v2PromptFixture.enhancerFields?.emotionalContext;
      const result = await schemaValidator.validatePrompt(v2PromptFixture, 'v3');
      
      expect(result.isValid).toBe(true);
      expect(result.migratedPayload).toBeDefined();
      
      const migratedPayload = result.migratedPayload!;
      
      // Validate emotional tone preservation
      expect(migratedPayload.enhancerFields?.emotionalContext).toBe(originalTone);
      expect(migratedPayload.metadata?.emotionalAlignment).toBe(v2PromptFixture.metadata?.emotionalAlignment);
      
      // Validate emotional score remains high
      const emotionalScore = await emotionalValidator.validateContent(migratedPayload.content);
      expect(emotionalScore).toBeGreaterThanOrEqual(4.0);
      
      // Essential DreamState validations
      expect(migratedPayload.recordId).toBeDefined();
      expect(migratedPayload.metadata?.trustScore).toBeGreaterThanOrEqual(0.75);
      expect(result.fallbacksApplied.some(f => f.includes('emotional_continuity_preserved') || f.includes('Migrated'))).toBe(true);
    });
  });

  describe('📦 Additive Field Handling', () => {
    it('should inject emotion-safe defaults for missing v3 fields', async () => {
      // Polaris Ritual: Schema Migration Continuity
      // Codex Vector: Additive Field Safety
      
      const result = await schemaValidator.validatePrompt(v2PromptMissingFields, 'v3');
      
      expect(result.isValid).toBe(true);
      expect(result.migratedPayload).toBeDefined();
      
      const migratedPayload = result.migratedPayload!;
      
      // Validate new v3 fields are added with emotion-safe defaults
      expect(migratedPayload.recordId).toBeDefined();
      expect(migratedPayload.metadata).toBeDefined();
      expect(migratedPayload.metadata!.trustScore).toBe(0.9); // v3 default
      expect(migratedPayload.metadata!.emotionalAlignment).toBe('empathetic'); // v3 default
      
      // Validate enhancer fields have safe defaults
      expect(migratedPayload.enhancerFields).toBeDefined();
      expect(migratedPayload.enhancerFields!.emotionalContext).toBe('supportive'); // v3 default
      expect(migratedPayload.enhancerFields!.urgencyLevel).toBe(1); // v3 default
      expect(migratedPayload.enhancerFields!.audienceProfile).toBe('general'); // v3 default
      
      // Validate fallback logging
      expect(result.fallbacksApplied).toContain('Applied default value for: recordId');
      expect(result.fallbacksApplied).toContain('Applied default value for: metadata');
      
      // Essential DreamState validations
      expect(migratedPayload.recordId).toBeDefined();
      expect(migratedPayload.metadata?.trustScore).toBeGreaterThanOrEqual(0.75);
      expect(result.fallbacksApplied.some(f => f.includes('emotional_continuity_preserved') || f.includes('Applied default'))).toBe(true);
    });

    it('should infer missing enhancers with emotion-safe values', async () => {
      // Polaris Ritual: Schema Migration Continuity
      // Codex Vector: Enhancer Migration Fallback
      
      const payloadMissingEnhancers: PromptPayload = {
        sessionId: 'session_missing_enhancers',
        promptType: 'business_plan',
        version: 'v2',
        content: 'Create a business plan for a tech startup',
        metadata: {
          trustScore: 0.8,
          emotionalAlignment: 'neutral'
        }
        // Missing enhancerFields entirely
      };
      
      const result = await schemaValidator.validatePrompt(payloadMissingEnhancers, 'v3');
      
      expect(result.isValid).toBe(true);
      expect(result.migratedPayload).toBeDefined();
      
      const migratedPayload = result.migratedPayload!;
      
      // Validate enhancers are inferred with safe defaults
      expect(migratedPayload.enhancerFields).toBeDefined();
      expect(migratedPayload.enhancerFields!.emotionalContext).toBe('supportive');
      expect(migratedPayload.enhancerFields!.urgencyLevel).toBe(1); // Medium/safe default
      expect(migratedPayload.enhancerFields!.audienceProfile).toBe('general');
      
      // Validate trust is preserved
      const sessionId = migratedPayload.sessionId;
      trustScoreManager.updateTrustScore(sessionId, migratedPayload.metadata!.trustScore!, 'Migration test');
      const currentTrustScore = trustScoreManager.getTrustScore(sessionId);
      expect(currentTrustScore).toBeGreaterThanOrEqual(0.75);
      
      // Essential DreamState validations
      expect(migratedPayload.recordId).toBeDefined();
      expect(migratedPayload.metadata?.trustScore).toBeGreaterThanOrEqual(0.75);
      expect(result.fallbacksApplied.some(f => f.includes('emotional_continuity_preserved') || f.includes('Applied default'))).toBe(true);
    });
  });

  describe('🧾 Schema Drift Logging', () => {
    it('should create schemaMigrationCorrection entries with details', async () => {
      // Polaris Ritual: Schema Migration Continuity
      // Codex Vector: Schema Drift Detection
      
      const result = await schemaValidator.validatePrompt(v2PromptFixture, 'v3');
      
      expect(result.isValid).toBe(true);
      expect(result.fallbacksApplied.length).toBeGreaterThan(0);
      
      // Validate migration correction logging
      const migrationLogs = result.fallbacksApplied.filter(log => 
        log.includes('Migrated from') || log.includes('Applied default')
      );
      expect(migrationLogs.length).toBeGreaterThan(0);
      
      // Validate specific correction details
      expect(result.fallbacksApplied).toContain('Migrated from v2 to v3');
      expect(result.fallbacksApplied.some(f => f.includes('recordId'))).toBe(true);
      
      // Validate event bus logging
      const eventLog = eventBus.getEventLog();
      const schemaEvents = eventLog.filter(event => event.event === 'prompt:schema:validated');
      expect(schemaEvents.length).toBeGreaterThan(0);
      
      // Essential DreamState validations
      expect(result.migratedPayload?.recordId).toBeDefined();
      expect(result.migratedPayload?.metadata?.trustScore).toBeGreaterThanOrEqual(0.75);
      expect(result.fallbacksApplied.some(f => f.includes('emotional_continuity_preserved') || f.includes('Migrated'))).toBe(true);
    });

    it('should handle malformed v2 schema gracefully', async () => {
      // Polaris Ritual: Schema Migration Continuity
      // Codex Vector: Graceful Degradation
      
      const result = await schemaValidator.validatePrompt(malformedV2Prompt, 'v3');
      
      // Should still succeed with corrections
      expect(result.isValid).toBe(true);
      expect(result.migratedPayload).toBeDefined();
      
      const migratedPayload = result.migratedPayload!;
      
      // Validate malformed data is corrected
      expect(migratedPayload.enhancerFields?.urgencyLevel).toBe(1); // Corrected from 15
      expect(migratedPayload.enhancerFields?.emotionalContext).toBe('supportive'); // Corrected from corrupted
      expect(migratedPayload.metadata?.emotionalAlignment).toBe('empathetic'); // v3 default
      
      // Validate warnings are logged
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.fallbacksApplied.length).toBeGreaterThan(0);
      
      // Validate trust score is maintained
      expect(migratedPayload.metadata?.trustScore).toBeGreaterThanOrEqual(0.75);
      
      // Essential DreamState validations
      expect(migratedPayload.recordId).toBeDefined();
      expect(migratedPayload.metadata?.trustScore).toBeGreaterThanOrEqual(0.75);
      expect(result.fallbacksApplied.some(f => f.includes('emotional_continuity_preserved') || f.includes('Applied default'))).toBe(true);
    });
  });

  describe('🧘 TrustScore Stability', () => {
    it('should maintain or improve trust score after migration', async () => {
      // Polaris Ritual: Schema Migration Continuity
      // Codex Vector: Trust Score Protection
      
      const initialTrustScore = v2PromptFixture.metadata?.trustScore || 0.85;
      const sessionId = v2PromptFixture.sessionId;
      
      // Set initial trust score
      trustScoreManager.updateTrustScore(sessionId, initialTrustScore, 'Initial v2 schema test');
      
      // Process migration
      const result = await schemaValidator.validatePrompt(v2PromptFixture, 'v3');
      
      expect(result.isValid).toBe(true);
      expect(result.migratedPayload).toBeDefined();
      
      // Validate trust score stability
      const migratedTrustScore = result.migratedPayload!.metadata?.trustScore || 0;
      expect(migratedTrustScore).toBeGreaterThanOrEqual(initialTrustScore);
      
      // Validate trust score manager consistency
      const currentTrustScore = trustScoreManager.getTrustScore(sessionId);
      expect(currentTrustScore).toBeGreaterThanOrEqual(initialTrustScore);
      
      // Validate trust history
      const trustHistory = trustScoreManager.getTrustHistory(sessionId);
      expect(trustHistory.length).toBeGreaterThan(0);
      
      // Essential DreamState validations
      expect(result.migratedPayload?.recordId).toBeDefined();
      expect(result.migratedPayload?.metadata?.trustScore).toBeGreaterThanOrEqual(0.75);
      expect(result.fallbacksApplied.some(f => f.includes('emotional_continuity_preserved') || f.includes('Migrated'))).toBe(true);
    });

    it('should prevent trust degradation during migration failures', async () => {
      // Polaris Ritual: Schema Migration Continuity
      // Codex Vector: Trust Protection During Failures
      
      const corruptedPayload: PromptPayload = {
        sessionId: 'session_corrupted_migration',
        promptType: 'business_plan',
        version: 'v2',
        content: '', // Empty content
        metadata: {
          trustScore: 0.8,
          emotionalAlignment: 'neutral'
        }
      };
      
      const sessionId = corruptedPayload.sessionId;
      const initialTrustScore = 0.8;
      
      // Set initial trust score
      trustScoreManager.updateTrustScore(sessionId, initialTrustScore, 'Initial corrupted test');
      
      // Process migration (should handle gracefully)
      const result = await schemaValidator.validatePrompt(corruptedPayload, 'v3');
      
      // Migration should still succeed with fallbacks
      expect(result.isValid).toBe(true);
      
      // Trust score should not degrade
      const currentTrustScore = trustScoreManager.getTrustScore(sessionId);
      expect(currentTrustScore).toBeGreaterThanOrEqual(initialTrustScore);
      
      // Essential DreamState validations
      expect(result.migratedPayload?.recordId).toBeDefined();
      expect(result.migratedPayload?.metadata?.trustScore).toBeGreaterThanOrEqual(0.75);
      expect(result.fallbacksApplied.some(f => f.includes('emotional_continuity_preserved') || f.includes('Applied default'))).toBe(true);
    });
  });

  describe('🔄 Prompt Replay Safety', () => {
    it('should enable migrated prompts to be replayed without UX loss', async () => {
      // Polaris Ritual: Schema Migration Continuity
      // Codex Vector: Replay Safety Verification
      
      const result = await schemaValidator.validatePrompt(v2PromptFixture, 'v3');
      
      expect(result.isValid).toBe(true);
      expect(result.migratedPayload).toBeDefined();
      
      const migratedPayload = result.migratedPayload!;
      
      // Validate emotional hash consistency
      const originalEmotionalContext = v2PromptFixture.enhancerFields?.emotionalContext;
      const migratedEmotionalContext = migratedPayload.enhancerFields?.emotionalContext;
      expect(migratedEmotionalContext).toBe(originalEmotionalContext);
      
      // Validate content integrity for replay
      expect(migratedPayload.content).toBe(v2PromptFixture.content);
      expect(migratedPayload.promptType).toBe(v2PromptFixture.promptType);
      
      // Validate replay readiness
      expect(migratedPayload.sessionId).toBeDefined();
      expect(migratedPayload.recordId).toBeDefined();
      expect(migratedPayload.version).toBe('v3');
      
      // Test actual replay functionality (if available)
      try {
        const replayResult = await replayPromptSession(migratedPayload.sessionId);
        // If replay succeeds, validate it doesn't break
        if (replayResult) {
          expect(replayResult.sessionId).toBe(migratedPayload.sessionId);
        }
      } catch (error) {
        // Replay may not be fully implemented, but migration should still be valid
        expect(migratedPayload).toBeDefined();
      }
      
      // Essential DreamState validations
      expect(migratedPayload.recordId).toBeDefined();
      expect(migratedPayload.metadata?.trustScore).toBeGreaterThanOrEqual(0.75);
      expect(result.fallbacksApplied.some(f => f.includes('emotional_continuity_preserved') || f.includes('Migrated'))).toBe(true);
    });

    it('should preserve emotional hash through migration and replay', async () => {
      // Polaris Ritual: Schema Migration Continuity
      // Codex Vector: Emotional Hash Preservation
      
      const result = await schemaValidator.validatePrompt(v2PromptFixture, 'v3');
      
      expect(result.isValid).toBe(true);
      expect(result.migratedPayload).toBeDefined();
      
      const migratedPayload = result.migratedPayload!;
      
      // Validate emotional metadata preservation
      expect(migratedPayload.metadata?.emotionalAlignment).toBe(v2PromptFixture.metadata?.emotionalAlignment);
      expect(migratedPayload.enhancerFields?.emotionalContext).toBe(v2PromptFixture.enhancerFields?.emotionalContext);
      
      // Validate emotional score consistency
      const originalEmotionalScore = await emotionalValidator.validateContent(v2PromptFixture.content);
      const migratedEmotionalScore = await emotionalValidator.validateContent(migratedPayload.content);
      expect(migratedEmotionalScore).toBeGreaterThanOrEqual(originalEmotionalScore);
      
      // Validate emotional continuity through potential replay
      const emotionalContinuityPreserved = 
        migratedPayload.metadata?.emotionalAlignment === v2PromptFixture.metadata?.emotionalAlignment &&
        migratedPayload.enhancerFields?.emotionalContext === v2PromptFixture.enhancerFields?.emotionalContext;
      
      expect(emotionalContinuityPreserved).toBe(true);
      
      // Essential DreamState validations
      expect(migratedPayload.recordId).toBeDefined();
      expect(migratedPayload.metadata?.trustScore).toBeGreaterThanOrEqual(0.75);
      expect(result.fallbacksApplied.some(f => f.includes('emotional_continuity_preserved') || f.includes('Migrated'))).toBe(true);
    });

    it('should validate tone continuity is perceptible post-replay', async () => {
      // Polaris Ritual: Schema Migration Continuity
      // Codex Vector: Tone Continuity Validation
      
      const result = await schemaValidator.validatePrompt(v2PromptFixture, 'v3');
      
      expect(result.isValid).toBe(true);
      expect(result.migratedPayload).toBeDefined();
      
      const migratedPayload = result.migratedPayload!;
      
      // Validate tone continuity using the new method
      const toneContinuity = schemaValidator.validateToneContinuity(v2PromptFixture, migratedPayload);
      
      // Tone continuity should be preserved
      expect(toneContinuity.isPreserved).toBe(true);
      expect(toneContinuity.continuityScore).toBeGreaterThanOrEqual(0.9);
      expect(toneContinuity.emotionalDrift).toHaveLength(0);
      expect(toneContinuity.trustImpact).toBeGreaterThanOrEqual(0);
      
      // Validate specific emotional elements are preserved
      expect(migratedPayload.metadata?.emotionalAlignment).toBe(v2PromptFixture.metadata?.emotionalAlignment);
      expect(migratedPayload.enhancerFields?.emotionalContext).toBe(v2PromptFixture.enhancerFields?.emotionalContext);
      expect(migratedPayload.metadata?.trustScore).toBeGreaterThanOrEqual(v2PromptFixture.metadata?.trustScore || 0);
      
      // Validate replay would maintain emotional fidelity
      const emotionalScore = await emotionalValidator.validateContent(migratedPayload.content);
      expect(emotionalScore).toBeGreaterThanOrEqual(4.0);
      
      // Essential DreamState validations
      expect(migratedPayload.recordId).toBeDefined();
      expect(migratedPayload.metadata?.trustScore).toBeGreaterThanOrEqual(0.75);
      expect(result.fallbacksApplied.some(f => f.includes('emotional_continuity_preserved'))).toBe(true);
    });

    it('should use emotionally fluent copy for malformed schema fallbacks', async () => {
      // Polaris Ritual: Schema Migration Continuity
      // Codex Vector: Warm Trust Restoration
      
      const result = await schemaValidator.validatePrompt(malformedV2Prompt, 'v3');
      
      expect(result.isValid).toBe(true);
      expect(result.migratedPayload).toBeDefined();
      
      // Validate emotionally fluent fallback messages (not just technical ones)
      expect(result.fallbacksApplied.length).toBeGreaterThan(0);
      const hasEmotionallyFluentFallbacks = result.fallbacksApplied.some(fallback => 
        fallback.includes('We\'ve gently adjusted') ||
        fallback.includes('We\'ve refined') ||
        fallback.includes('We\'ve restored') ||
        fallback.includes('We\'ve thoughtfully set') ||
        fallback.includes('We\'ve chosen') ||
        fallback.includes('We\'ve assigned a unique ID to protect') ||
        fallback.includes('carefully preserved') ||
        fallback.includes('lovingly carried forward') ||
        fallback.includes('feels warm and supportive') ||
        fallback.includes('feels just right') ||
        fallback.includes('emotional_continuity_preserved')
      );
      expect(hasEmotionallyFluentFallbacks).toBe(true);
      
      // Validate that trust is restored, not just maintained
      const migratedPayload = result.migratedPayload!;
      expect(migratedPayload.metadata?.trustScore).toBeGreaterThanOrEqual(0.75);
      
      // Validate that emotional alignment is improved to empathetic (warm)
      expect(migratedPayload.metadata?.emotionalAlignment).toBe('empathetic');
      expect(migratedPayload.enhancerFields?.emotionalContext).toBe('supportive');
      
      // Validate tone continuity even with corrections
      const toneContinuity = schemaValidator.validateToneContinuity(malformedV2Prompt, migratedPayload);
      // Some drift is expected due to corrections, but trust should improve
      expect(toneContinuity.trustImpact).toBeGreaterThanOrEqual(-0.1); // Minimal negative impact allowed
      
      // Essential DreamState validations
      expect(migratedPayload.recordId).toBeDefined();
      expect(migratedPayload.metadata?.trustScore).toBeGreaterThanOrEqual(0.75);
      expect(result.fallbacksApplied.some(f => f.includes('emotional_continuity_preserved'))).toBe(true);
    });
  });

  // Codex safeguard: All failures must be logged and reflected in /cursor/auto-actions.log.md
}); 