# CanAI Cursor Codex v6.1.4 - Interface Mapping Index

**Generated:** 2025-05-29T19:55:00.251Z  
**Total Interfaces:** 1214  
**Total Files:** 406  
**Total Fields:** 6420  

## Quick Reference Statistics

| Metric | Count |
|--------|-------|
| **Total Interfaces** | 1214 |
| **Files with Interfaces** | 406 |
| **Total Data Fields** | 6420 |
| **Required Fields** | 5597 (87.2%) |
| **Optional Fields** | 823 (12.8%) |
| **Categories** | 9 |

## Category Distribution

| Category | Count | Percentage |
|----------|-------|------------|
| **Other** | 385 | 31.7% |
| **Emotional Intelligence** | 271 | 22.3% |
| **Testing & Validation** | 162 | 13.3% |
| **Memory & AI** | 120 | 9.9% |
| **Utilities & Services** | 117 | 9.6% |
| **Prompts & Content** | 87 | 7.2% |
| **Payment & Financial** | 34 | 2.8% |
| **Security & Monitoring** | 32 | 2.6% |
| **Business Entities** | 6 | 0.5% |

## Most Common Field Types

| Type | Occurrences | Percentage |
|------|-------------|------------|
| **string** | 1976 | 30.8% |
| **number** | 1737 | 27.1% |
| **boolean** | 627 | 9.8% |
| **string[]** | 401 | 6.2% |
| **jest.Mock** | 134 | 2.1% |
| **Record** | 94 | 1.5% |
| **any** | 94 | 1.5% |
| **'low'** | 44 | 0.7% |
| **Date** | 41 | 0.6% |
| **Array** | 41 | 0.6% |

---

# Interface Categories & Locations

## 1. Payment & Financial (34 interfaces)

### Types
- **StripeInvoice** - `api\types\stripe.ts:101` - Invoice processing
- **StripeSubscription** - `api\types\stripe.ts:73` - Subscription management
- **StripeCustomer** - `api\types\stripe.ts:51` - Customer data with billing info
- **StripeInvoiceLineItem** - `api\types\stripe.ts:332` - Interface definition
- **StripePrice** - `api\types\stripe.ts:261` - Interface definition
- **StripeCoupon** - `api\types\stripe.ts:187` - Interface definition

## 2. Business Entities (6 interfaces)

### Types
- **ClientEntity** - `api\types\client.ts:29` - Internal system representation of a Client entity.
- **ProjectEntity** - `api\types\project.ts:28` - Internal system representation of a Project entity.
- **CreateClientPayload** - `api\types\client.ts:11` - Client creation data
- **UpdateClientPayload** - `api\types\client.ts:20` - Payload for updating an existing client.
- **CreateProjectPayload** - `api\types\project.ts:11` - Project creation
- **UpdateProjectPayload** - `api\types\project.ts:20` - Payload for updating an existing project.

## 3. Emotional Intelligence (271 interfaces)

### Types
- **EnrichedEmotionalContext** - `cursor\types\emotional-sovereignty.ts:51` - Interface definition
- **EmotionalContext** - `cursor\types\emotional-sovereignty.ts:7` - Emotional Sovereignty Types
Purpose: Core type definitions for the emotional sovereignty platform
Used by: SparkSplit, Sacred Moments, Reversal Test, and all emotional intelligence components

### Services
- **EnrichedEmotionalContext** - `cursor\services\emotional-context-pipeline.ts:27` - Interface definition

### Global-sovereignty
- **EmotionalCalibrationResult** - `src\global-sovereignty\cultural-context-engine.ts:1076` - Interface definition
- **AdaptationResult** - `src\global-sovereignty\cultural-context-engine.ts:1062` - Interface definition

### Cultural-intelligence
- **AdaptedMessageResult** - `src\cultural-intelligence\universal-emotional-adapter.ts:456` - Interface definition
- **ProcessedEmotionalContent** - `src\cultural-intelligence\universal-emotional-adapter.ts:435` - Interface definition

### Emotional-sovereignty
- **EmotionalCrisisPrediction** - `src\emotional-sovereignty\predictive-emotional-intelligence.ts:15` - Interface definition
- **EmotionalNeedPrediction** - `src\emotional-sovereignty\predictive-emotional-intelligence.ts:67` - Interface definition

### Utils
- **EmotionalPayload** - `cursor\utils\emotion-payload-builder.ts:12` - Interface definition

## 4. Memory & AI (120 interfaces)

### Ai-memories
- **CompressedMemory** - `cursor\ai-memories\memory-types.ts:91` - Interface definition
- **MemoryRecord** - `cursor\ai-memories\memory-schema.ts:26` - Memory record
- **MemoryPayload** - `ai-ops\ai-memories\memory-types.ts:20` - Represents a memory payload with metadata
- **Memory** - `cursor\ai-memories\memory-types.ts:12` - Interface definition
- **MemoryMetadata** - `cursor\ai-memories\memory-schema.ts:12` - ai-memories/memory-schema.ts

Purpose:
Defines types and interfaces for memory records.
Provides schema validation for memory data.
- **MemoryStats** - `cursor\ai-memories\memory-types.ts:145` - Interface definition

### Memory-integration
- **MemoryInjectionRequest** - `cursor\memory-integration\memory-integration-schema.ts:25` - Memory injection request

### Prompt-registry
- **PromptTemplate** - `ai-ops\prompt-registry\prompt-registry-types.ts:44` - Represents a prompt template

## 5. Security & Monitoring (32 interfaces)

### Resonance-engine
- **GeneratedComponent** - `cursor\resonance-engine\generator\component-generator.ts:25` - Interface definition

### Services
- **RateLimitIncident** - `cursor\services\rate-limit-wrapper.ts:5` - Interface definition
- **EnhancementStrategy** - `cursor\services\sparksplit-ab-testing-engine.ts:21` - Interface definition

### Cultural-intelligence
- **RecoveryStrategyResult** - `src\cultural-intelligence\cultural-fallback-manager.ts:32` - Interface definition

### Security-intelligence
- **UserPatternLearningResult** - `src\security-intelligence\adaptive-security-engine.ts:20` - Interface definition
- **SecuritySensitivityResult** - `src\security-intelligence\adaptive-security-engine.ts:34` - Interface definition
- **ProgressiveRateLimitResult** - `src\security-intelligence\adaptive-security-engine.ts:42` - Interface definition
- **PersonalizationResult** - `src\security-intelligence\adaptive-security-engine.ts:57` - Interface definition

### Evolution-triggers
- **EvolutionStrategy** - `cursor\evolution-triggers\strategy-executor.ts:16` - Interface for evolution strategies
- **StrategyResult** - `cursor\evolution-triggers\strategy-executor.ts:26` - Interface for strategy execution results

## 6. Testing & Validation (162 interfaces)

### Services
- **ABTestResult** - `cursor\services\spark-split-ab-testing-engine.ts:30` - Interface definition
- **ErrorScenarioTestResult** - `api\services\make-webhook-tester.ts:61` - Interface for error scenario test results
- **ABTestVariant** - `cursor\services\spark-split-ab-testing-engine.ts:13` - Interface definition
- **VariantMetrics** - `cursor\services\sparksplit-ab-testing-engine.ts:30` - Interface definition
- **OutputMetrics** - `cursor\services\sparksplit-ab-testing-engine.ts:57` - Interface definition
- **SchemaValidationResult** - `cursor\services\prompt-schema-validator.ts:39` - Interface definition

### Stressbox
- **StressTest** - `cursor\stressbox\stressbox-engine.ts:17` - Interface definition

## 7. Prompts & Content (87 interfaces)

### Types
- **PromptLogs** - `cursor\types\prompt-logs.ts:6` - PromptLogs type definition
- **PromptEntity** - `api\types\prompt.ts:30` - Internal system representation of a Prompt entity.

### Core
- **AdAmplifyPrompt** - `prompts\ad_amplify.ts:9` - ad_amplify.ts

Purpose:
Simple TypeScript interface for Ad Amplify prompt type.
Provides type safety and validation for prompt inputs.
- **ProfileMakeoverPrompt** - `prompts\profile_makeover.ts:9` - profile_makeover.ts

Purpose:
Simple TypeScript interface for Profile Makeover prompt type.
Provides type safety and validation for prompt inputs.
- **BlogBlitzPrompt** - `prompts\blogblitz.ts:9` - blogblitz.ts

Purpose:
Simple TypeScript interface for BlogBlitz prompt type.
Provides type safety and validation for prompt inputs.

### Prompt-infrastructure
- **PromptMetadata** - `cursor\prompt-infrastructure\prompt-schema.ts:29` - Interface definition
- **PromptDefinition** - `cursor\prompt-infrastructure\prompt-schema.ts:43` - Interface definition
- **PromptExecutionResult** - `cursor\prompt-infrastructure\prompt-schema.ts:222` - Represents the result of a prompt execution

### Prompt-registry
- **RegistryQueryOptions** - `cursor\prompt-registry\prompt-registry-schema.ts:71` - Interface definition

### Services
- **ReplayResult** - `cursor\services\prompt-log-manager.ts:30` - Interface definition

## 8. Utilities & Services (117 interfaces)

### Services
- **SparkSplitSessionData** - `cursor\services\spark-split-engine.ts:53` - Interface definition
- **InputSanitizationCorrection** - `cursor\services\input-sanitizer.ts:47` - Interface definition
- **PerformanceMetric** - `cursor\services\performance-monitor.ts:11` - Interface definition
- **FallbackState** - `cursor\services\fallback-manager.ts:12` - Interface definition
- **SanitizationResult** - `cursor\services\input-sanitizer.ts:15` - Interface definition
- **PerformanceReport** - `cursor\services\performance-monitor.ts:32` - Interface definition

### Agents
- **DebugConfig** - `cursor\agents\debug\config\config.ts:12` - Debug configuration

### Utils
- **SparkAnalytics** - `cursor\utils\sessionReuseEngine.ts:12` - Interface definition

## 9. Other (385 interfaces)

### Orchestration
- **JourneyState** - `cursor\orchestration\master-orchestrator.ts:137` - Interface definition
- **JourneyOrchestrationResult** - `cursor\orchestration\master-orchestrator.ts:60` - Interface definition

### Core
- **GoldmineOutput** - `analytics\goldmine-intelligence-engine.ts:10` - Interface definition
- **SparkSplitMetrics** - `analytics\sparksplit-analytics.ts:10` - Interface definition
- **UserAIProfile** - `analytics\goldmine-intelligence-engine.ts:69` - Interface definition

### Preprocessors
- **StructuredIntent** - `cursor\preprocessors\schema-engine.ts:41` - Interface definition

### Adapters
- **SmartDefaultsInput** - `cursor\adapters\universal-interface-adapter.ts:52` - Interface definition

### Rules
- **MDCRule** - `cursor\rules\mdc-processor.ts:12` - Interface definition

### System-intel
- **SessionRefactorEntry** - `cursor\system-intel\sessionRefactorLogWriter.ts:31` - Interface definition

### Tools
- **ResurrectionExecutionEntry** - `scripts\tools\dreamstate-resurrection-engine.ts:18` - Interface definition



---

# File-Based Interface Index

## High-Density Interface Files (10+ interfaces)

### `cursor\types\emotional-sovereignty.ts` (38 interfaces)
Interface definitions for this module.

### `src\transcendence\index.ts` (34 interfaces)
Interface definitions for this module.

### `api\types\stripe.ts` (30 interfaces)
Interface definitions for this module.

### `src\performance-intelligence\emotional-load-stress-engine.ts` (19 interfaces)
Interface definitions for this module.

### `cursor\ai-memories\memory-types.ts` (18 interfaces)
Interface definitions for this module.

### `src\emotional-sovereignty\emotional-transition-engine.ts` (17 interfaces)
Interface definitions for this module.

### `cursor\orchestration\master-orchestrator.ts` (14 interfaces)
Interface definitions for this module.

### `src\emotional-sovereignty\quantum-empathy-engine.ts` (14 interfaces)
Interface definitions for this module.

### `cursor\meta-control\codex-self-check.ts` (13 interfaces)
Interface definitions for this module.

### `cursor\prompt-infrastructure\prompt-schema.ts` (13 interfaces)
Interface definitions for this module.



## Key Integration Points

### Make.com Integration
- **MakeIntegrationPoint** - `scripts/tools/validate-csv-files.ts:29`
- **WebhookTestOptions** - `api/services/make-webhook-tester.ts:6`
- **DataFlowTestResult** - `api/services/make-webhook-tester.ts:39`

### Airtable Integration
- **TableDefinition** - Multiple files - Table schema definitions
- **FieldDefinition** - Multiple files - Field specifications

### Webflow Integration
- Interface definitions in `infra/make/scenarios/` JSON files

---

# Usage Patterns & Relationships

## Interface Inheritance Patterns

### Base Interfaces
- **StripeObject** - Extended by all Stripe-related interfaces
- **EmotionalContext** - Base for all emotional intelligence interfaces
- **LogEntry** - Base for all logging interfaces

### Common Field Patterns

#### Timestamp Fields
- `timestamp: Date` - 41 occurrences
- `createdAt: string` - Common in entity interfaces
- `updatedAt: string` - Common in entity interfaces

#### Identification Fields
- `id: string` - Universal identifier pattern
- `userId: string` - User association
- `sessionId: string` - Session tracking

#### Scoring Fields
- `trustScore: number` - Trust measurement
- `confidence: number` - Confidence scoring
- `resonanceScore: number` - Emotional resonance

## Critical Data Flow Interfaces

### Input Processing
1. **User Input** → `EmotionalContext`
2. **Payment Data** → `StripeWebhookPayload`
3. **Content Creation** → Prompt Input Interfaces

### Processing Pipeline
1. **Validation** → `ValidationResult` interfaces
2. **Analysis** → NLP and Emotion Detection interfaces
3. **Memory Integration** → Memory injection interfaces

### Output Generation
1. **Results** → Various Result interfaces
2. **Logging** → `LogEntry` interfaces
3. **Reporting** → Report and Metrics interfaces

---

# Maintenance & Updates

## To Update This Index

1. Run the interface extractor:
   ```bash
   npx ts-node scripts/tools/interface-extractor.ts
   ```

2. Update this document automatically:
   ```bash
   node scripts/tools/update-interface-index.js
   ```

3. Verify accuracy with:
   ```bash
   node scripts/tools/show-interface-sample.js
   ```

## Version Control

- **Last Updated:** 2025-05-29T19:55:00.251Z
- **Extractor Version:** v1.0.0
- **Codex Version:** v6.1.4
- **Total Interfaces Tracked:** 1214

## Quality Assurance

- ✅ **100% Automated Extraction** - No manual data entry
- ✅ **TypeScript AST Parsing** - Accurate type information
- ✅ **Cross-Referenced Paths** - Verified file locations
- ✅ **Field-Level Detail** - Complete field specifications
- ✅ **Category Classification** - Systematic organization

---

*This document is automatically generated from the codebase and provides 100% accurate interface mapping for the CanAI Cursor Codex v6.1.4 project.*