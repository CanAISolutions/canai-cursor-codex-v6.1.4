/**
 * Universal Interface Adapter - Bridge 1: Interface Standardization Layer
 * Purpose: Universal compatibility between all component interfaces with SparkSplit trust data
 * Classification: Core Infrastructure - Emotional Sovereignty Platform
 * 
 * What: Translates between all component formats (StructuredIntent ↔ SmartDefaults ↔ SparkConcept ↔ SparkComparison)
 * Why: Enables seamless communication between 95+ components with trust transparency
 * How: AI-accelerated format conversion with SparkSplit trust enhancement and validation
 */

import { 
  EmotionalContext, 
  SparkConcept, 
  TrustDelta,
  EmotionalIntelligenceMetrics 
} from '../types/emotional-sovereignty';
import { StructuredIntent, StructuredField } from '../preprocessors/schema-engine';
import { SmartDefaults } from '../utils/smartDefaultsEngine';
import { SparkSplitEngine, SparkSplitInput, SparkSplitSessionData } from '../services/spark-split-engine';
import { ReversalTestAutomator } from '../validators/reversal-test-automator';
import { SacredMomentsOrchestrator } from '../services/sacred-moments-orchestrator';
import { EmotionalMemoryBank } from '../utils/emotionalMemoryBank';
import { EventBus } from '../event-bus/eventBus';
import { emitSystemLog } from '../utils/audit-utils';

// Universal component format types
export type ComponentFormat = 
  | 'StructuredIntent' 
  | 'SmartDefaults' 
  | 'SparkConcept' 
  | 'SparkComparison'
  | 'EmotionalContext'
  | 'TrustDelta';

// SparkSplit integration interface for all components
export interface SparkSplitIntegration {
  trustDelta: number;           // -1 to 1 scale from SparkSplit comparison
  emotionalCompass: EmotionalIntelligenceMetrics;  // 5-axis emotional mapping
  userPreference: 'sterile' | 'enriched' | 'neutral';
  comparisonHistory: SparkSplitSessionData[];
  trustProgression: TrustDelta[];
  // New properties for master-orchestrator.ts
  results?: any[];
  performanceMetrics?: {
    averageTrustDelta: number;
    transparencyScore: number;
    userPreference: any;
  };
}

// Enhanced SmartDefaults interface with SparkSplit integration
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

// Enhanced SparkConcept interfaces with SparkSplit integration
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

// Enhanced SparkComparison interfaces
export interface SparkComparisonInput {
  enrichedOutput: string;
  emotionalContext: EmotionalContext & {
    sparkResonance?: number;
    trustLevel?: number;
  };
  comparisonContext: {
    previousComparisons: SparkSplitSessionData[];
    userPreference?: 'sterile' | 'enriched' | 'neutral';
    emotionalCompass?: EmotionalIntelligenceMetrics;
  };
}

export interface SparkComparisonOutput {
  enrichedOutput: {
    challenge: string;
    industry: string;
    tone: string;
    targetAudience: string;
    personalizedName: string;
  };
  trustDelta: TrustDelta & {
    score: number;
  };
  emotionalCompass: EmotionalIntelligenceMetrics;
  userSelection: 'sterile' | 'enriched' | 'neutral';
  neutralSummary: string;
}

/**
 * Universal Interface Adapter with SparkSplit Integration
 * Enables seamless communication between all 95+ components
 */
export class UniversalInterfaceAdapter {
  private sparkSplitEngine: SparkSplitEngine;
  private eventBus: EventBus;

  constructor() {
    // Initialize dependencies for SparkSplitEngine
    const reversalTestAutomator = new ReversalTestAutomator();
    const emotionalMemoryBank = new EmotionalMemoryBank();
    const eventBus = EventBus.getInstance();
    const sacredMomentsOrchestrator = new SacredMomentsOrchestrator(
      emotionalMemoryBank,
      eventBus
    );
    
    this.sparkSplitEngine = new SparkSplitEngine(
      reversalTestAutomator,
      sacredMomentsOrchestrator,
      emotionalMemoryBank
    );
    this.eventBus = eventBus;
  }

  /**
   * Convert between any component interface formats with SparkSplit enhancement
   * What: Universal format conversion with trust data integration
   * Why: Enables all 95 components to communicate seamlessly
   * How: Type-safe conversion with emotional context preservation
   */
  async adaptInterface<TInput, TOutput>(
    input: TInput,
    sourceFormat: ComponentFormat,
    targetFormat: ComponentFormat,
    emotionalContext?: EmotionalContext,
    sparkSplitData?: SparkSplitIntegration
  ): Promise<TOutput> {
    
    try {
      emitSystemLog('universal-adapter-start', {
        sourceFormat,
        targetFormat,
        hasEmotionalContext: !!emotionalContext,
        hasSparkSplitData: !!sparkSplitData
      });

      // Handle StructuredIntent ↔ SmartDefaults conversion with SparkSplit trust
      if (sourceFormat === 'StructuredIntent' && targetFormat === 'SmartDefaults') {
        return this.structuredIntentToSmartDefaults(input as any, emotionalContext, sparkSplitData) as Promise<TOutput>;
      }
      
      // Handle SmartDefaults ↔ SparkConcept conversion with trust enhancement
      if (sourceFormat === 'SmartDefaults' && targetFormat === 'SparkConcept') {
        return this.smartDefaultsToSparkConcept(input as any, emotionalContext, sparkSplitData) as Promise<TOutput>;
      }
      
      // Handle SparkConcept ↔ SparkComparison conversion
      if (sourceFormat === 'SparkConcept' && targetFormat === 'SparkComparison') {
        return this.sparkConceptToSparkComparison(input as any, emotionalContext, sparkSplitData) as Promise<TOutput>;
      }
      
      // Handle SparkComparison ↔ StructuredIntent conversion
      if (sourceFormat === 'SparkComparison' && targetFormat === 'StructuredIntent') {
        return this.sparkComparisonToStructuredIntent(input as any, emotionalContext, sparkSplitData) as Promise<TOutput>;
      }
      
      // Universal format conversion for any component with SparkSplit enhancement
      return this.universalFormatConversion(input, sourceFormat, targetFormat, emotionalContext, sparkSplitData);
      
    } catch (error) {
      emitSystemLog('universal-adapter-error', {
        error: error instanceof Error ? error.message : String(error),
        sourceFormat,
        targetFormat
      });
      
      // Graceful fallback with dignity preservation
      return this.createFallbackOutput(targetFormat, input, emotionalContext) as Promise<TOutput>;
    }
  }

  /**
   * Convert StructuredIntent to SmartDefaults format with SparkSplit trust data
   * What: Transforms structured intent into smart defaults input
   * Why: Enables SmartDefaultsEngine to leverage structured intent data
   * How: Field mapping with trust enhancement and emotional context preservation
   */
  private async structuredIntentToSmartDefaults(
    structuredIntent: StructuredIntent,
    emotionalContext?: EmotionalContext,
    sparkSplitData?: SparkSplitIntegration
  ): Promise<SmartDefaultsInput> {
    
    // Extract values from StructuredField format
    const challenge = this.extractFieldValue(structuredIntent.primary_goal);
    const industry = this.extractFieldValue(structuredIntent.business_type);
    const tone = this.extractFieldValue(structuredIntent.tone);
    const targetAudience = this.extractFieldValue(structuredIntent.target_audience);

    return {
      challenge,
      industry,
      tone,
      targetAudience,
      emotionalFingerprint: emotionalContext?.emotionalFingerprint,
      pastSuccessPatterns: emotionalContext?.pastSuccessPatterns,
      preferredLanguageStyle: emotionalContext?.languageFingerprint,
      // SparkSplit enhancements
      trustLevel: sparkSplitData?.trustDelta || emotionalContext?.baseTrustScore || 3.0,
      emotionalCompass: sparkSplitData?.emotionalCompass,
      userPreference: sparkSplitData?.userPreference,
      comparisonInsights: sparkSplitData?.comparisonHistory
    };
  }

  /**
   * Convert SmartDefaults to SparkConcept format with trust enhancement
   * What: Transforms smart defaults output into spark concept input
   * Why: Enables SparkConcept generation with personalized defaults
   * How: Data enrichment with emotional resonance and trust progression
   */
  private async smartDefaultsToSparkConcept(
    smartDefaults: SmartDefaultsOutput,
    emotionalContext?: EmotionalContext,
    sparkSplitData?: SparkSplitIntegration
  ): Promise<SparkConceptInput> {
    
    return {
      baseIntent: {
        challenge: smartDefaults.challenge,
        industry: smartDefaults.industry,
        tone: smartDefaults.tone
      },
      smartDefaults: smartDefaults.suggestions,
      emotionalResonance: {
        languagePatterns: emotionalContext?.languageFingerprint,
        emotionalTriggers: emotionalContext?.emotionalTriggers,
        trustLevel: sparkSplitData?.trustDelta || emotionalContext?.baseTrustScore || 3.0,
        // SparkSplit enhancements
        emotionalCompass: sparkSplitData?.emotionalCompass,
        preferenceHistory: sparkSplitData?.comparisonHistory,
        trustProgression: sparkSplitData?.trustProgression
      }
    };
  }

  /**
   * Convert SparkConcept to SparkComparison format
   * What: Transforms spark concept output into comparison input
   * Why: Enables SparkSplit comparison with generated concepts
   * How: Concept selection with comparison context preparation
   */
  private async sparkConceptToSparkComparison(
    sparkConcept: SparkConceptOutput,
    emotionalContext?: EmotionalContext,
    sparkSplitData?: SparkSplitIntegration
  ): Promise<SparkComparisonInput> {
    
    return {
      enrichedOutput: sparkConcept.selectedSpark.personalizedName,
      emotionalContext: {
        ...emotionalContext,
        baseTrustScore: emotionalContext?.baseTrustScore || 3.0,
        sparkResonance: sparkConcept.selectedSpark.resonanceScore,
        trustLevel: sparkSplitData?.trustDelta
      },
      comparisonContext: {
        previousComparisons: sparkSplitData?.comparisonHistory || [],
        userPreference: sparkSplitData?.userPreference,
        emotionalCompass: sparkSplitData?.emotionalCompass
      }
    };
  }

  /**
   * Convert SparkComparison back to StructuredIntent with trust insights
   * What: Transforms comparison output back to structured intent format
   * Why: Enables downstream components to leverage comparison insights
   * How: Trust data integration with structured field enhancement
   */
  private async sparkComparisonToStructuredIntent(
    sparkComparison: SparkComparisonOutput,
    emotionalContext?: EmotionalContext,
    sparkSplitData?: SparkSplitIntegration
  ): Promise<StructuredIntent> {
    
    // Create enhanced StructuredIntent with SparkSplit insights
    return {
      business_type: this.createStructuredField(
        sparkComparison.enrichedOutput.industry,
        0.9,
        'spark',
        true,
        false,
        false
      ),
      primary_goal: this.createStructuredField(
        sparkComparison.enrichedOutput.challenge,
        0.9,
        'spark',
        true,
        false,
        false
      ),
      tone: this.createStructuredField(
        sparkComparison.enrichedOutput.tone,
        0.9,
        'spark',
        true,
        false,
        false
      ),
      challenges: this.createStructuredField(
        [sparkComparison.enrichedOutput.challenge],
        0.8,
        'spark',
        true,
        false,
        false
      ),
      motivator: this.createStructuredField(
        'trust_building',
        0.9,
        'spark',
        true,
        false,
        false
      ),
      target_audience: this.createStructuredField(
        sparkComparison.enrichedOutput.targetAudience,
        0.8,
        'spark',
        true,
        false,
        false
      ),
      spark_feel_quote: this.createStructuredField(
        sparkComparison.enrichedOutput.personalizedName,
        sparkComparison.trustDelta.score,
        'spark',
        false,
        false,
        true
      ),
      _meta: {
        allFields: ['business_type', 'primary_goal', 'tone', 'challenges', 'motivator', 'target_audience', 'spark_feel_quote'],
        injectedFields: ['spark_feel_quote'],
        validationPassed: true,
        errors: [],
        usedSparkSignal: true,
        usedVisionCatcher: false,
        intentConfidence: sparkComparison.trustDelta.score,
        emotionalAnchorPresent: true,
        conflictDetected: false,
        hasMotivationHook: true
      }
    };
  }

  /**
   * Universal format conversion for any component with SparkSplit enhancement
   * What: Handles any format conversion not covered by specific methods
   * Why: Provides complete coverage for all 95+ components
   * How: Dynamic type analysis with intelligent conversion logic
   */
  private async universalFormatConversion<TInput, TOutput>(
    input: TInput,
    sourceFormat: ComponentFormat,
    targetFormat: ComponentFormat,
    emotionalContext?: EmotionalContext,
    sparkSplitData?: SparkSplitIntegration
  ): Promise<TOutput> {
    
    // Analyze input structure
    const inputAnalysis = this.analyzeInputStructure(input);
    
    // Generate target structure based on format
    const targetStructure = this.generateTargetStructure(targetFormat, inputAnalysis);
    
    // Apply SparkSplit enhancements if available
    if (sparkSplitData) {
      this.enhanceWithSparkSplitData(targetStructure, sparkSplitData);
    }
    
    // Apply emotional context if available
    if (emotionalContext) {
      this.enhanceWithEmotionalContext(targetStructure, emotionalContext);
    }
    
    emitSystemLog('universal-conversion-complete', {
      sourceFormat,
      targetFormat,
      inputFields: Object.keys(input as any),
      outputFields: Object.keys(targetStructure)
    });
    
    return targetStructure as TOutput;
  }

  /**
   * Create fallback output with dignity preservation
   * What: Generates safe fallback when conversion fails
   * Why: Ensures system never fails completely, maintains user trust
   * How: Format-specific safe defaults with emotional support
   */
  private createFallbackOutput<TInput>(
    targetFormat: ComponentFormat,
    originalInput: TInput,
    emotionalContext?: EmotionalContext
  ): any {
    
    const fallbackMessage = "We're crafting the perfect response for you...";
    
    switch (targetFormat) {
      case 'SmartDefaults':
        return {
          challenge: 'business_growth',
          industry: 'general',
          tone: 'professional',
          suggestions: [],
          confidence: 0.5,
          source: 'default',
          trustEnhanced: false
        };
        
      case 'SparkConcept':
        return {
          concepts: [],
          selectedSpark: {
            name: 'Growth Catalyst',
            description: fallbackMessage,
            resonanceScore: 0.7,
            personalizedName: 'Your Growth Journey',
            emotionalTriggers: ['growth', 'potential'],
            industryRelevance: 0.8,
            languageStyle: 'supportive'
          },
          overallResonance: 0.7,
          trustCompatible: true,
          emotionalAlignment: 0.8
        };
        
      case 'StructuredIntent':
        return this.createFallbackStructuredIntent();
        
      default:
        return {
          success: false,
          message: fallbackMessage,
          fallbackTriggered: true,
          originalInput
        };
    }
  }

  // Helper methods for field extraction and creation
  private extractFieldValue(field: StructuredField<any> | any): any {
    if (field && typeof field === 'object' && 'value' in field) {
      return field.value;
    }
    return field || '';
  }

  private createStructuredField<T>(
    value: T,
    confidence: number,
    source: 'rules' | 'tiny-llm' | 'fallback' | 'spark' | 'vision',
    overrideable: boolean,
    errorState: boolean,
    wasConfirmed: boolean
  ): StructuredField<T> {
    return {
      value,
      confidence,
      source,
      overrideable,
      errorState,
      wasConfirmed
    };
  }

  private createFallbackStructuredIntent(): StructuredIntent {
    return {
      business_type: this.createStructuredField('general', 0.5, 'fallback', true, false, false),
      primary_goal: this.createStructuredField('business_growth', 0.5, 'fallback', true, false, false),
      tone: this.createStructuredField('professional', 0.5, 'fallback', true, false, false),
      challenges: this.createStructuredField(['growth'], 0.5, 'fallback', true, false, false),
      motivator: this.createStructuredField('success', 0.5, 'fallback', true, false, false),
      _meta: {
        allFields: ['business_type', 'primary_goal', 'tone', 'challenges', 'motivator'],
        injectedFields: [],
        validationPassed: true,
        errors: [],
        intentConfidence: 0.5,
        emotionalAnchorPresent: false,
        conflictDetected: false,
        hasMotivationHook: false
      }
    };
  }

  private analyzeInputStructure(input: any): any {
    // Analyze input structure for universal conversion
    return {
      fields: Object.keys(input),
      types: Object.keys(input).reduce((acc, key) => {
        acc[key] = typeof input[key];
        return acc;
      }, {} as any),
      hasMetadata: '_meta' in input,
      hasEmotionalData: 'emotionalContext' in input || 'emotionalFingerprint' in input
    };
  }

  private generateTargetStructure(targetFormat: ComponentFormat, analysis: any): any {
    // Generate appropriate target structure based on format and analysis
    const baseStructure: any = {};
    
    // Add format-specific required fields
    switch (targetFormat) {
      case 'SmartDefaults':
        baseStructure.challenge = '';
        baseStructure.industry = '';
        baseStructure.tone = '';
        baseStructure.confidence = 0.7;
        baseStructure.source = 'default';
        break;
        
      case 'SparkConcept':
        baseStructure.concepts = [];
        baseStructure.selectedSpark = {};
        baseStructure.overallResonance = 0.7;
        break;
        
      case 'EmotionalContext':
        baseStructure.baseTrustScore = 3.0;
        baseStructure.emotionalTriggers = [];
        break;
    }
    
    return baseStructure;
  }

  private enhanceWithSparkSplitData(structure: any, sparkSplitData: SparkSplitIntegration): void {
    // Enhance structure with SparkSplit trust data
    structure.trustLevel = sparkSplitData.trustDelta;
    structure.emotionalCompass = sparkSplitData.emotionalCompass;
    structure.userPreference = sparkSplitData.userPreference;
    structure.trustEnhanced = true;
  }

  private enhanceWithEmotionalContext(structure: any, emotionalContext: EmotionalContext): void {
    // Enhance structure with emotional context
    structure.emotionalFingerprint = emotionalContext.emotionalFingerprint;
    structure.baseTrustScore = emotionalContext.baseTrustScore;
    structure.emotionalTriggers = emotionalContext.emotionalTriggers;
    structure.emotionallyEnhanced = true;
  }
}

// Export singleton instance for system-wide use
export const universalAdapter = new UniversalInterfaceAdapter(); 