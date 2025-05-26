# Emotional Sovereignty System - API Reference

**Version**: v6.1.4  
**Date**: January 27, 2025  
**Status**: Production Ready  
**Coverage**: 3 Core Infrastructure Bridges  

---

## 📚 **TABLE OF CONTENTS**

1. [Universal Interface Adapter API](#universal-interface-adapter-api)
2. [Emotional Context Pipeline API](#emotional-context-pipeline-api)
3. [Master Orchestrator API](#master-orchestrator-api)
4. [Type Definitions](#type-definitions)
5. [Error Handling](#error-handling)
6. [Usage Examples](#usage-examples)

---

## 🌉 **UNIVERSAL INTERFACE ADAPTER API**

**File**: `/cursor/adapters/universal-interface-adapter.ts`  
**Purpose**: Universal compatibility between all component interfaces with SparkSplit trust data

### **Core Class**

```typescript
export class UniversalInterfaceAdapter {
  constructor()
  
  // Main adaptation method
  async adaptInterface<TInput, TOutput>(
    input: TInput,
    sourceFormat: ComponentFormat,
    targetFormat: ComponentFormat,
    emotionalContext?: EmotionalContext,
    sparkSplitData?: SparkSplitIntegration
  ): Promise<TOutput>
}
```

### **Supported Component Formats**

```typescript
export type ComponentFormat = 
  | 'StructuredIntent' 
  | 'SmartDefaults' 
  | 'SparkConcept' 
  | 'SparkComparison'
  | 'EmotionalContext'
  | 'TrustDelta';
```

### **SparkSplit Integration Interface**

```typescript
export interface SparkSplitIntegration {
  trustDelta: number;                           // -1 to 1 scale
  emotionalCompass: EmotionalIntelligenceMetrics;
  userPreference: 'sterile' | 'enriched' | 'neutral';
  comparisonHistory: SparkSplitSessionData[];
  trustProgression: TrustDelta[];
}
```

### **Enhanced Interface Types**

#### **SmartDefaults Input/Output**
```typescript
export interface SmartDefaultsInput {
  challenge: string;
  industry: string;
  tone: string;
  targetAudience?: string;
  emotionalFingerprint?: any;
  pastSuccessPatterns?: any[];
  preferredLanguageStyle?: any;
  // SparkSplit enhancements
  trustLevel: number;
  emotionalCompass?: EmotionalIntelligenceMetrics;
  userPreference?: 'sterile' | 'enriched' | 'neutral';
  comparisonInsights?: SparkSplitSessionData[];
}

export interface SmartDefaultsOutput {
  challenge: string;
  industry: string;
  tone: string;
  suggestions: any[];
  confidence: number;
  source: 'session' | 'emotional' | 'default';
  // SparkSplit enhancements
  trustEnhanced: boolean;
  emotionalResonance?: number;
}
```

#### **SparkConcept Input/Output**
```typescript
export interface SparkConceptInput {
  baseIntent: {
    challenge: string;
    industry: string;
    tone: string;
  };
  smartDefaults: any[];
  emotionalResonance: {
    languagePatterns?: any;
    emotionalTriggers?: string[];
    trustLevel: number;
    // SparkSplit enhancements
    emotionalCompass?: EmotionalIntelligenceMetrics;
    preferenceHistory?: SparkSplitSessionData[];
    trustProgression?: TrustDelta[];
  };
}

export interface SparkConceptOutput {
  concepts: SparkConcept[];
  selectedSpark: SparkConcept & {
    personalizedName: string;
    resonanceScore: number;
  };
  overallResonance: number;
  // SparkSplit enhancements
  trustCompatible: boolean;
  emotionalAlignment: number;
}
```

### **Key Methods**

#### **`adaptInterface()`**
**Purpose**: Universal format conversion with trust data integration

```typescript
async adaptInterface<TInput, TOutput>(
  input: TInput,
  sourceFormat: ComponentFormat,
  targetFormat: ComponentFormat,
  emotionalContext?: EmotionalContext,
  sparkSplitData?: SparkSplitIntegration
): Promise<TOutput>
```

**Parameters**:
- `input`: Source data to convert
- `sourceFormat`: Format of the input data
- `targetFormat`: Desired output format
- `emotionalContext`: Optional emotional context for enrichment
- `sparkSplitData`: Optional SparkSplit trust data

**Returns**: Converted data in target format

**Example**:
```typescript
const adapter = new UniversalInterfaceAdapter();

const smartDefaultsInput = await adapter.adaptInterface(
  structuredIntent,
  'StructuredIntent',
  'SmartDefaults',
  emotionalContext,
  sparkSplitData
);
```

### **Singleton Instance**

```typescript
export const universalAdapter = new UniversalInterfaceAdapter();
```

---

## 🧠 **EMOTIONAL CONTEXT PIPELINE API**

**File**: `/cursor/services/emotional-context-pipeline.ts`  
**Purpose**: Emotional intelligence flows between all components enhanced by SparkSplit insights

### **Core Class**

```typescript
export class EmotionalContextPipeline {
  constructor(
    emotionalMemoryBank: EmotionalMemoryBank,
    eventBus: EventBus,
    config?: Partial<ContextFlowConfig>
  )
  
  // Main enrichment method
  async enrichEmotionalContext(
    request: ContextEnrichmentRequest
  ): Promise<ContextEnrichmentResult>
  
  // Utility methods
  async getCachedContext(sessionId: string): Promise<EnrichedEmotionalContext | null>
  clearOldCache(): void
}
```

### **Enrichment Request/Result**

#### **Context Enrichment Request**
```typescript
export interface ContextEnrichmentRequest {
  userId?: string;
  sessionId?: string;
  currentContext?: EmotionalContext;
  interactionData?: any;
  sparkSplitData?: SparkSplitIntegration;
  enrichmentLevel?: 'basic' | 'enhanced' | 'deep' | 'transcendent';
  preserveHistory?: boolean;
}
```

#### **Context Enrichment Result**
```typescript
export interface ContextEnrichmentResult {
  enrichedContext: EnrichedEmotionalContext;
  enrichmentSources: string[];
  qualityMetrics: {
    completeness: number;
    accuracy: number;
    freshness: number;
    continuity: number;
  };
  recommendations: string[];
  nextActions: string[];
}
```

### **Enriched Emotional Context**

```typescript
export interface EnrichedEmotionalContext extends EmotionalContext {
  // Pipeline metadata
  enrichmentLevel: 'basic' | 'enhanced' | 'deep' | 'transcendent';
  lastEnrichmentTimestamp: Date;
  enrichmentSources: string[];
  
  // SparkSplit integration
  sparkSplitData?: SparkSplitIntegration;
  trustProgression: TrustDelta[];
  emotionalCompass?: EmotionalIntelligenceMetrics;
  
  // Cross-session continuity
  sessionConnections: string[];
  emotionalEvolution: EmotionalEvolution[];
  persistentPreferences: any;
  
  // Real-time insights
  currentEmotionalState: string;
  resonancePatterns: string[];
  adaptationHistory: any[];
  
  // Quality metrics
  contextQuality: number;
  continuityScore: number;
  trustScore: number;
}
```

### **Configuration**

```typescript
export interface ContextFlowConfig {
  enableCrossSessionContinuity: boolean;
  enableSparkSplitIntegration: boolean;
  enableRealTimeAdaptation: boolean;
  enableEmotionalEvolution: boolean;
  trustThreshold: number;
  qualityThreshold: number;
  maxHistoryRetention: number; // days
}
```

### **Key Methods**

#### **`enrichEmotionalContext()`**
**Purpose**: Gathers and enriches emotional context from all available sources

```typescript
async enrichEmotionalContext(
  request: ContextEnrichmentRequest
): Promise<ContextEnrichmentResult>
```

**Parameters**:
- `request`: Enrichment request with context and preferences

**Returns**: Enriched context with quality metrics and recommendations

**Example**:
```typescript
const pipeline = new EmotionalContextPipeline(memoryBank, eventBus);

const result = await pipeline.enrichEmotionalContext({
  userId: 'user123',
  sessionId: 'session456',
  enrichmentLevel: 'enhanced',
  interactionData: userInput
});
```

### **Enrichment Levels**

1. **Basic** (Quality: 0.6): User profile + session integration
2. **Enhanced** (Quality: 0.8): Pattern analysis + trust metrics
3. **Deep** (Quality: 0.9): Predictive modeling + personalization
4. **Transcendent** (Quality: 1.0): Sovereignty analysis + wisdom integration

### **Singleton Instance**

```typescript
export const emotionalContextPipeline = new EmotionalContextPipeline(
  new EmotionalMemoryBank(),
  EventBus.getInstance()
);
```

---

## 🎭 **MASTER ORCHESTRATOR API**

**File**: `/cursor/orchestration/master-orchestrator.ts`  
**Purpose**: Central coordination of complete user journeys with SparkSplit as trust catalyst

### **Core Class**

```typescript
export class MasterOrchestrator {
  constructor(
    universalAdapter: UniversalInterfaceAdapter,
    emotionalPipeline: EmotionalContextPipeline,
    sparkSplitEngine: SparkSplitEngine,
    sacredMomentsOrchestrator: SacredMomentsOrchestrator,
    reversalTestAutomator: ReversalTestAutomator,
    emotionalMemoryBank: EmotionalMemoryBank,
    eventBus: EventBus
  )
  
  // Main orchestration method
  async orchestrateJourney(
    request: JourneyOrchestrationRequest
  ): Promise<JourneyOrchestrationResult>
  
  // Monitoring methods
  getPerformanceMetrics(): PerformanceMetrics
  getActiveJourneyCount(): number
}
```

### **Journey Orchestration**

#### **Journey Request**
```typescript
export interface JourneyOrchestrationRequest {
  userId?: string;
  sessionId: string;
  journeyType: JourneyType;
  initialInput: any;
  emotionalContext?: EmotionalContext;
  preferences?: UserPreferences;
  sparkSplitEnabled?: boolean;
  targetComponents?: string[];
}
```

#### **Journey Types**
```typescript
export type JourneyType = 
  | 'discovery_funnel'           // Initial user discovery and intent capture
  | 'spark_generation'           // Concept generation with emotional resonance
  | 'content_creation'           // Full content creation with SparkSplit
  | 'trust_building'             // Trust-focused interaction with transparency
  | 'emotional_sovereignty'      // Complete sovereignty experience
  | 'sacred_moments'             // Sacred moments journey orchestration
  | 'cross_session_continuity'   // Multi-session experience coordination
  | 'recovery_flow';             // Error recovery and trust rebuilding
```

#### **User Preferences**
```typescript
export interface UserPreferences {
  enrichmentLevel: 'basic' | 'enhanced' | 'deep' | 'transcendent';
  sparkSplitPreference: 'always' | 'selective' | 'never';
  communicationStyle: 'direct' | 'collaborative' | 'supportive';
  trustTransparency: 'high' | 'medium' | 'low';
  emotionalIntensity: 'subtle' | 'moderate' | 'high';
  pacePreference: 'fast' | 'moderate' | 'thoughtful';
}
```

#### **Journey Result**
```typescript
export interface JourneyOrchestrationResult {
  success: boolean;
  journeyId: string;
  currentStage: string;
  completedStages: string[];
  nextStages: string[];
  
  // Component outputs
  componentResults: Map<string, any>;
  
  // Emotional intelligence data
  enrichedContext: EnrichedEmotionalContext;
  trustProgression: TrustDelta[];
  emotionalCompass?: EmotionalIntelligenceMetrics;
  
  // SparkSplit integration
  sparkSplitResults?: SparkSplitOutput[];
  trustTransparencyScore: number;
  
  // Quality metrics
  journeyQuality: JourneyQualityMetrics;
  
  // Next actions
  recommendations: string[];
  nextActions: OrchestrationAction[];
  
  // Error handling
  errors: OrchestrationError[];
  recoveryActions: RecoveryAction[];
}
```

### **Quality Metrics**

```typescript
export interface JourneyQualityMetrics {
  overallScore: number;
  componentReliability: number;
  emotionalContinuity: number;
  trustScore: number;
  userSatisfaction: number;
  processingLatency: number;
  errorRate: number;
}
```

### **Orchestration Actions**

```typescript
export interface OrchestrationAction {
  type: 'trigger_component' | 'trigger_sparksplit' | 'trigger_sacred_moment' | 'enhance_context' | 'recover_error';
  priority: 'high' | 'medium' | 'low';
  component?: string;
  data?: any;
  expectedOutcome: string;
  fallbackAction?: OrchestrationAction;
}
```

### **Key Methods**

#### **`orchestrateJourney()`**
**Purpose**: Coordinates all components for seamless user experience with trust transparency

```typescript
async orchestrateJourney(
  request: JourneyOrchestrationRequest
): Promise<JourneyOrchestrationResult>
```

**Parameters**:
- `request`: Journey orchestration request with type and preferences

**Returns**: Complete journey result with quality metrics and next actions

**Example**:
```typescript
const orchestrator = new MasterOrchestrator(/* dependencies */);

const result = await orchestrator.orchestrateJourney({
  sessionId: 'session123',
  journeyType: 'emotional_sovereignty',
  initialInput: userRequest,
  preferences: {
    enrichmentLevel: 'transcendent',
    sparkSplitPreference: 'always'
  }
});
```

### **Singleton Instance**

```typescript
export const masterOrchestrator = new MasterOrchestrator(
  new UniversalInterfaceAdapter(),
  new EmotionalContextPipeline(new EmotionalMemoryBank(), EventBus.getInstance()),
  new SparkSplitEngine(/* dependencies */),
  new SacredMomentsOrchestrator(new EmotionalMemoryBank(), EventBus.getInstance()),
  new ReversalTestAutomator(),
  new EmotionalMemoryBank(),
  EventBus.getInstance()
);
```

---

## 📋 **TYPE DEFINITIONS**

### **Core Emotional Types**

```typescript
export interface EmotionalContext {
  baseTrustScore: number;
  emotionalTriggers?: string[];
  userId?: string;
  sessionId?: string;
  languageFingerprint?: any;
  toneContext?: string;
  industryContext?: string;
  culturalContext?: string;
  emotionalFingerprint?: any;
  pastSuccessPatterns?: any[];
}

export interface TrustDelta {
  value: number;
  source: string;
  timestamp: Date;
  context: string;
}

export interface EmotionalIntelligenceMetrics {
  empathy: number;
  clarity: number;
  resonance: number;
  authenticity: number;
  growth: number;
}

export interface EmotionalEvolution {
  timestamp: Date;
  evolutionType: 'trust_increase' | 'preference_change' | 'style_adaptation' | 'need_shift';
  beforeState: any;
  afterState: any;
  triggerEvent: string;
  confidence: number;
}
```

### **SparkSplit Types**

```typescript
export interface SparkSplitSessionData {
  sessionId: string;
  timestamp: Date;
  userPreferredOutput: 'canai' | 'sterile' | 'neutral';
  trustDelta: number;
  emotionalCompass: EmotionalIntelligenceMetrics;
}

export interface SparkConcept {
  name: string;
  description: string;
  resonanceScore: number;
  emotionalTriggers: string[];
  industryRelevance: number;
  languageStyle: string;
}
```

---

## ⚠️ **ERROR HANDLING**

### **Error Types**

```typescript
export interface OrchestrationError {
  errorId: string;
  timestamp: Date;
  component: string;
  errorType: 'component_failure' | 'trust_breach' | 'context_loss' | 'latency_timeout' | 'validation_failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  context: any;
  recoveryAttempted: boolean;
  recoverySuccess?: boolean;
}
```

### **Recovery Actions**

```typescript
export interface RecoveryAction {
  actionId: string;
  errorId: string;
  actionType: 'component_retry' | 'fallback_component' | 'trust_rebuild' | 'context_restore' | 'graceful_degradation';
  implementation: string;
  expectedOutcome: string;
  maxRetries: number;
  currentRetries: number;
}
```

### **Error Handling Strategy**

1. **Graceful Degradation**: System continues with reduced capabilities
2. **Dignity Preservation**: Error messages maintain user respect
3. **Automatic Recovery**: System attempts recovery before failing
4. **Fallback Components**: Alternative components when primary fails

---

## 💡 **USAGE EXAMPLES**

### **Basic Component Adaptation**

```typescript
import { universalAdapter } from './cursor/adapters/universal-interface-adapter';

// Convert StructuredIntent to SmartDefaults
const smartDefaultsInput = await universalAdapter.adaptInterface(
  structuredIntent,
  'StructuredIntent',
  'SmartDefaults',
  emotionalContext
);
```

### **Emotional Context Enrichment**

```typescript
import { emotionalContextPipeline } from './cursor/services/emotional-context-pipeline';

// Enrich emotional context
const enrichmentResult = await emotionalContextPipeline.enrichEmotionalContext({
  userId: 'user123',
  sessionId: 'session456',
  enrichmentLevel: 'enhanced',
  interactionData: {
    tone: 'professional',
    urgency: 0.3,
    enthusiasm: 0.7
  }
});

console.log('Context Quality:', enrichmentResult.qualityMetrics.completeness);
console.log('Trust Score:', enrichmentResult.enrichedContext.trustScore);
```

### **Complete Journey Orchestration**

```typescript
import { masterOrchestrator } from './cursor/orchestration/master-orchestrator';

// Orchestrate emotional sovereignty journey
const journeyResult = await masterOrchestrator.orchestrateJourney({
  sessionId: 'session789',
  journeyType: 'emotional_sovereignty',
  initialInput: {
    challenge: 'business_growth',
    industry: 'technology',
    tone: 'collaborative'
  },
  preferences: {
    enrichmentLevel: 'transcendent',
    sparkSplitPreference: 'always',
    communicationStyle: 'collaborative'
  },
  sparkSplitEnabled: true
});

if (journeyResult.success) {
  console.log('Journey Quality:', journeyResult.journeyQuality.overallScore);
  console.log('Trust Transparency:', journeyResult.trustTransparencyScore);
  console.log('Sacred Moments:', journeyResult.sparkSplitResults?.length || 0);
}
```

### **Error Handling Example**

```typescript
try {
  const result = await masterOrchestrator.orchestrateJourney(request);
  
  if (!result.success) {
    // Handle journey failure
    console.log('Journey failed:', result.errors);
    
    // Execute recovery actions
    for (const action of result.recoveryActions) {
      console.log('Recovery action:', action.actionType);
    }
  }
} catch (error) {
  // Handle system-level errors
  console.error('System error:', error);
}
```

### **Performance Monitoring**

```typescript
// Monitor system performance
const metrics = masterOrchestrator.getPerformanceMetrics();
console.log('Success Rate:', metrics.successfulJourneys / metrics.totalJourneys);
console.log('Average Latency:', metrics.averageLatency);
console.log('Average Trust Score:', metrics.averageTrustScore);

// Monitor active load
const activeJourneys = masterOrchestrator.getActiveJourneyCount();
console.log('Active Journeys:', activeJourneys);
```

---

## 🔧 **CONFIGURATION**

### **Environment Variables**

```bash
# Emotional Context Pipeline
EMOTIONAL_CONTEXT_CACHE_TTL=300000  # 5 minutes
EMOTIONAL_CONTEXT_MAX_HISTORY=90   # days

# Master Orchestrator
JOURNEY_TIMEOUT=30000              # 30 seconds
MAX_COMPONENT_RETRIES=3
TRUST_THRESHOLD=3.0

# Universal Adapter
ADAPTER_FALLBACK_ENABLED=true
ADAPTER_VALIDATION_STRICT=false
```

### **Default Configuration**

```typescript
const defaultConfig: ContextFlowConfig = {
  enableCrossSessionContinuity: true,
  enableSparkSplitIntegration: true,
  enableRealTimeAdaptation: true,
  enableEmotionalEvolution: true,
  trustThreshold: 3.0,
  qualityThreshold: 0.7,
  maxHistoryRetention: 90
};
```

---

## 📊 **PERFORMANCE BENCHMARKS**

### **Target Performance**
- **Component Adaptation**: <100ms
- **Context Enrichment**: <500ms
- **Journey Orchestration**: <2s
- **Memory Usage**: <50MB per session
- **Cache Hit Rate**: >80%

### **Quality Targets**
- **Component Compatibility**: 100%
- **Emotional Continuity**: 95%+
- **Trust Score**: 4.7+
- **Error Rate**: <1%
- **Recovery Success**: >95%

---

*This API reference covers the complete implementation of Milestone 1: Foundation Architecture + AI Acceleration Foundations. For implementation of additional components, refer to the Emotional Sovereignty Implementation Roadmap.*

**Version**: v6.1.4 | **Status**: Production Ready | **Last Updated**: January 27, 2025 