/**
 * enhancer-fallback-manager.ts
 * 
 * Purpose: Manages fallback logic for enhancer fields, provides graceful degradation
 * when fields are missing or invalid, and ensures prompt processing continuity.
 * 
 * Codex Enforcement: Real System Bound fallback handling with comprehensive recovery
 */

import { EventBus } from '../event-bus/eventBus';
import { PromptPayload } from './prompt-schema-validator';

export interface EnhancerFallbackResult {
  success: boolean;
  enhancedPayload: PromptPayload;
  fallbacksApplied: string[];
  warnings: string[];
  errors: string[];
  enhancerQuality: {
    emotionalContext: 'high' | 'medium' | 'low' | 'fallback';
    urgencyLevel: 'explicit' | 'inferred' | 'default';
    audienceProfile: 'specified' | 'detected' | 'general';
    personalityTone: 'matched' | 'approximated' | 'neutral';
  };
}

export interface EnhancerRule {
  field: string;
  required: boolean;
  fallbackValue: any;
  inferenceRules: Array<{
    condition: (payload: PromptPayload) => boolean;
    value: any;
    confidence: number;
  }>;
  validationRules: Array<{
    validate: (value: any) => boolean;
    errorMessage: string;
  }>;
}

export class EnhancerFallbackManager {
  private eventBus: EventBus;
  private enhancerRules: Map<string, EnhancerRule>;

  constructor() {
    this.eventBus = EventBus.getInstance();
    this.enhancerRules = new Map();
    this.initializeEnhancerRules();
  }

  /**
   * Initialize enhancer field rules and fallback logic
   */
  private initializeEnhancerRules(): void {
    // Emotional Context Enhancer
    this.enhancerRules.set('emotionalContext', {
      field: 'emotionalContext',
      required: false,
      fallbackValue: 'supportive',
      inferenceRules: [
        {
          condition: (payload) => payload.promptType === 'business_plan',
          value: 'professional',
          confidence: 0.8
        },
        {
          condition: (payload) => payload.promptType === 'email_campaign',
          value: 'engaging',
          confidence: 0.9
        },
        {
          condition: (payload) => payload.promptType === 'social_content',
          value: 'enthusiastic',
          confidence: 0.85
        },
        {
          condition: (payload) => payload.content.toLowerCase().includes('urgent'),
          value: 'focused',
          confidence: 0.7
        },
        {
          condition: (payload) => payload.content.toLowerCase().includes('help'),
          value: 'supportive',
          confidence: 0.75
        }
      ],
      validationRules: [
        {
          validate: (value) => typeof value === 'string' && value.length > 0,
          errorMessage: 'Emotional context must be a non-empty string'
        },
        {
          validate: (value) => ['supportive', 'professional', 'engaging', 'enthusiastic', 'focused', 'empathetic', 'neutral'].includes(value),
          errorMessage: 'Emotional context must be a valid emotion type'
        }
      ]
    });

    // Urgency Level Enhancer
    this.enhancerRules.set('urgencyLevel', {
      field: 'urgencyLevel',
      required: false,
      fallbackValue: 1,
      inferenceRules: [
        {
          condition: (payload) => payload.content.toLowerCase().includes('urgent') || payload.content.toLowerCase().includes('asap'),
          value: 4,
          confidence: 0.9
        },
        {
          condition: (payload) => payload.content.toLowerCase().includes('soon') || payload.content.toLowerCase().includes('quickly'),
          value: 3,
          confidence: 0.8
        },
        {
          condition: (payload) => payload.content.toLowerCase().includes('deadline'),
          value: 3,
          confidence: 0.85
        },
        {
          condition: (payload) => payload.promptType === 'email_campaign',
          value: 2,
          confidence: 0.6
        }
      ],
      validationRules: [
        {
          validate: (value) => typeof value === 'number' && Number.isInteger(value),
          errorMessage: 'Urgency level must be an integer'
        },
        {
          validate: (value) => value >= 1 && value <= 5,
          errorMessage: 'Urgency level must be between 1 and 5'
        }
      ]
    });

    // Audience Profile Enhancer
    this.enhancerRules.set('audienceProfile', {
      field: 'audienceProfile',
      required: false,
      fallbackValue: 'general',
      inferenceRules: [
        {
          condition: (payload) => payload.promptType === 'business_plan',
          value: 'investors',
          confidence: 0.8
        },
        {
          condition: (payload) => payload.promptType === 'email_campaign',
          value: 'customers',
          confidence: 0.85
        },
        {
          condition: (payload) => payload.promptType === 'social_content',
          value: 'social_media',
          confidence: 0.9
        },
        {
          condition: (payload) => payload.content.toLowerCase().includes('technical') || payload.content.toLowerCase().includes('developer'),
          value: 'technical',
          confidence: 0.8
        },
        {
          condition: (payload) => payload.content.toLowerCase().includes('executive') || payload.content.toLowerCase().includes('leadership'),
          value: 'executives',
          confidence: 0.85
        }
      ],
      validationRules: [
        {
          validate: (value) => typeof value === 'string' && value.length > 0,
          errorMessage: 'Audience profile must be a non-empty string'
        },
        {
          validate: (value) => ['general', 'investors', 'customers', 'social_media', 'technical', 'executives', 'internal'].includes(value),
          errorMessage: 'Audience profile must be a valid audience type'
        }
      ]
    });

    // Personality Tone Enhancer
    this.enhancerRules.set('personalityTone', {
      field: 'personalityTone',
      required: false,
      fallbackValue: 'professional',
      inferenceRules: [
        {
          condition: (payload) => payload.promptType === 'social_content',
          value: 'casual',
          confidence: 0.8
        },
        {
          condition: (payload) => payload.promptType === 'business_plan',
          value: 'formal',
          confidence: 0.9
        },
        {
          condition: (payload) => payload.content.toLowerCase().includes('fun') || payload.content.toLowerCase().includes('exciting'),
          value: 'enthusiastic',
          confidence: 0.75
        },
        {
          condition: (payload) => payload.content.toLowerCase().includes('serious') || payload.content.toLowerCase().includes('important'),
          value: 'formal',
          confidence: 0.8
        }
      ],
      validationRules: [
        {
          validate: (value) => typeof value === 'string' && value.length > 0,
          errorMessage: 'Personality tone must be a non-empty string'
        },
        {
          validate: (value) => ['professional', 'casual', 'formal', 'enthusiastic', 'friendly', 'authoritative'].includes(value),
          errorMessage: 'Personality tone must be a valid tone type'
        }
      ]
    });
  }

  /**
   * Apply enhancer fallbacks to a prompt payload
   */
  async applyEnhancerFallbacks(payload: PromptPayload): Promise<EnhancerFallbackResult> {
    const result: EnhancerFallbackResult = {
      success: true,
      enhancedPayload: { ...payload },
      fallbacksApplied: [],
      warnings: [],
      errors: [],
      enhancerQuality: {
        emotionalContext: 'fallback',
        urgencyLevel: 'default',
        audienceProfile: 'general',
        personalityTone: 'neutral'
      }
    };

    try {
      // Ensure enhancerFields object exists
      if (!result.enhancedPayload.enhancerFields) {
        result.enhancedPayload.enhancerFields = {};
        result.fallbacksApplied.push('Created enhancerFields object');
      }

      // Process each enhancer field
      for (const [fieldName, rule] of this.enhancerRules.entries()) {
        const fieldResult = await this.processEnhancerField(result.enhancedPayload, rule);
        
        // Merge results
        result.fallbacksApplied.push(...fieldResult.fallbacksApplied);
        result.warnings.push(...fieldResult.warnings);
        result.errors.push(...fieldResult.errors);
        
        // Update quality indicators
        this.updateQualityIndicator(result.enhancerQuality, fieldName, fieldResult);
      }

      // Emit enhancer event
      this.eventBus.emit('enhancer:fallbacks:applied', {
        payload: result.enhancedPayload,
        fallbacksApplied: result.fallbacksApplied,
        quality: result.enhancerQuality,
        timestamp: Date.now()
      });

      result.success = result.errors.length === 0;
      return result;
    } catch (error) {
      result.success = false;
      result.errors.push(`Enhancer fallback error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return result;
    }
  }

  /**
   * Process a single enhancer field
   */
  private async processEnhancerField(payload: PromptPayload, rule: EnhancerRule): Promise<{
    fallbacksApplied: string[];
    warnings: string[];
    errors: string[];
    quality: 'high' | 'medium' | 'low' | 'fallback';
    source: 'explicit' | 'inferred' | 'default';
  }> {
    const result = {
      fallbacksApplied: [] as string[],
      warnings: [] as string[],
      errors: [] as string[],
      quality: 'fallback' as 'high' | 'medium' | 'low' | 'fallback',
      source: 'default' as 'explicit' | 'inferred' | 'default'
    };

    const currentValue = payload.enhancerFields?.[rule.field as keyof typeof payload.enhancerFields];

    // Check if field has explicit value
    if (currentValue !== undefined && currentValue !== null) {
      // Validate explicit value
      const validationErrors = this.validateFieldValue(currentValue, rule);
      if (validationErrors.length === 0) {
        result.quality = 'high';
        result.source = 'explicit';
        return result;
      } else {
        result.warnings.push(`Invalid ${rule.field}: ${validationErrors.join(', ')}`);
        // Continue to inference/fallback
      }
    }

    // Try inference rules
    const inferredValue = this.inferFieldValue(payload, rule);
    if (inferredValue.value !== null) {
      (payload.enhancerFields as any)[rule.field] = inferredValue.value;
      result.fallbacksApplied.push(`Inferred ${rule.field}: ${inferredValue.value} (confidence: ${inferredValue.confidence})`);
      result.quality = inferredValue.confidence > 0.8 ? 'high' : inferredValue.confidence > 0.6 ? 'medium' : 'low';
      result.source = 'inferred';
      return result;
    }

    // Apply fallback value
    (payload.enhancerFields as any)[rule.field] = rule.fallbackValue;
    result.fallbacksApplied.push(`Applied fallback ${rule.field}: ${rule.fallbackValue}`);
    result.quality = 'fallback';
    result.source = 'default';

    return result;
  }

  /**
   * Validate a field value against its rules
   */
  private validateFieldValue(value: any, rule: EnhancerRule): string[] {
    const errors: string[] = [];
    
    for (const validationRule of rule.validationRules) {
      if (!validationRule.validate(value)) {
        errors.push(validationRule.errorMessage);
      }
    }
    
    return errors;
  }

  /**
   * Infer a field value using inference rules
   */
  private inferFieldValue(payload: PromptPayload, rule: EnhancerRule): { value: any; confidence: number } {
    let bestMatch = { value: null, confidence: 0 };
    
    for (const inferenceRule of rule.inferenceRules) {
      if (inferenceRule.condition(payload) && inferenceRule.confidence > bestMatch.confidence) {
        bestMatch = {
          value: inferenceRule.value,
          confidence: inferenceRule.confidence
        };
      }
    }
    
    return bestMatch;
  }

  /**
   * Update quality indicator for a field
   */
  private updateQualityIndicator(
    qualityIndicators: EnhancerFallbackResult['enhancerQuality'],
    fieldName: string,
    fieldResult: { quality: string; source: string }
  ): void {
    switch (fieldName) {
      case 'emotionalContext':
        qualityIndicators.emotionalContext = fieldResult.quality as any;
        break;
      case 'urgencyLevel':
        qualityIndicators.urgencyLevel = fieldResult.source as any;
        break;
      case 'audienceProfile':
        qualityIndicators.audienceProfile = fieldResult.source === 'explicit' ? 'specified' : 
                                           fieldResult.source === 'inferred' ? 'detected' : 'general';
        break;
      case 'personalityTone':
        qualityIndicators.personalityTone = fieldResult.source === 'explicit' ? 'matched' :
                                           fieldResult.source === 'inferred' ? 'approximated' : 'neutral';
        break;
    }
  }

  /**
   * Get enhancer field recommendations for a payload
   */
  async getEnhancerRecommendations(payload: PromptPayload): Promise<Record<string, any>> {
    const recommendations: Record<string, any> = {};
    
    for (const [fieldName, rule] of this.enhancerRules.entries()) {
      const inferredValue = this.inferFieldValue(payload, rule);
      if (inferredValue.confidence > 0.5) {
        recommendations[fieldName] = {
          value: inferredValue.value,
          confidence: inferredValue.confidence,
          reason: `Inferred from ${payload.promptType} and content analysis`
        };
      }
    }
    
    return recommendations;
  }

  /**
   * Get all enhancer rules
   */
  getEnhancerRules(): Map<string, EnhancerRule> {
    return new Map(this.enhancerRules);
  }
} 