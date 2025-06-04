/**
 * CulturalAdapter Class
 * 
 * Provides cultural adaptation services for different languages and regions.
 * Handles cultural specifics like expressiveness, directness, and formality.
 */
import { Logger } from '../logger';
import { BidirectionalTextAnalyzer } from '../utils/bidirectional-text-analyzer';
import { EventBus } from '../cursor/event-bus';
import { TrustMetricsCollector } from '../cursor/trust/trust-metrics-collector';

export class CulturalAdapter {
  private cultures: Map<string, CultureProfile>;
  private defaultExpressiveness = 0.7;
  private bidirectionalAnalyzer: BidirectionalTextAnalyzer;
  private logger: Logger;
  private eventBus?: EventBus;
  private trustMetricsCollector?: TrustMetricsCollector;
  
  constructor(
    logger?: Logger,
    eventBus?: EventBus,
    trustMetricsCollector?: TrustMetricsCollector
  ) {
    this.cultures = new Map<string, CultureProfile>();
    this.bidirectionalAnalyzer = new BidirectionalTextAnalyzer();
    this.logger = logger || new Logger('CulturalAdapter');
    this.eventBus = eventBus;
    this.trustMetricsCollector = trustMetricsCollector;
    this.initializeCultures();
  }
  
  private initializeCultures(): void {
    // Western cultures
    this.cultures.set('en', { 
      code: 'en', 
      name: 'English', 
      direction: 'ltr', 
      region: 'Western', 
      expressiveness: 0.7,
      directness: 0.8,
      formalityLevels: ['casual', 'formal'],
      honorificSystem: 'simple'
    });
    
    this.cultures.set('fr', { 
      code: 'fr', 
      name: 'French', 
      direction: 'ltr', 
      region: 'Western', 
      expressiveness: 0.8,
      directness: 0.7,
      formalityLevels: ['casual', 'formal'],
      honorificSystem: 'binary'
    });
    
    this.cultures.set('es', { 
      code: 'es', 
      name: 'Spanish', 
      direction: 'ltr', 
      region: 'Western', 
      expressiveness: 0.85,
      directness: 0.75,
      formalityLevels: ['casual', 'formal'],
      honorificSystem: 'binary'
    });
    
    this.cultures.set('it', { 
      code: 'it', 
      name: 'Italian', 
      direction: 'ltr', 
      region: 'Western', 
      expressiveness: 0.9,
      directness: 0.8,
      formalityLevels: ['casual', 'formal'],
      honorificSystem: 'binary'
    });
    
    this.cultures.set('de', { 
      code: 'de', 
      name: 'German', 
      direction: 'ltr', 
      region: 'Western', 
      expressiveness: 0.6,
      directness: 0.9,
      formalityLevels: ['casual', 'formal'],
      honorificSystem: 'binary'
    });
    
    // Eastern cultures
    this.cultures.set('ja', { 
      code: 'ja', 
      name: 'Japanese', 
      direction: 'ltr', 
      region: 'Eastern', 
      expressiveness: 0.4,
      directness: 0.3,
      formalityLevels: ['kudaketa', 'teinei', 'keigo', 'sonkeigo', 'kenjougo'],
      honorificSystem: 'complex'
    });
    
    // Middle Eastern cultures
    this.cultures.set('ar', { 
      code: 'ar', 
      name: 'Arabic', 
      direction: 'rtl', 
      region: 'Middle Eastern', 
      expressiveness: 0.8,
      directness: 0.6,
      formalityLevels: ['casual', 'formal', 'honorific'],
      honorificSystem: 'moderate'
    });
    
    this.cultures.set('he', { 
      code: 'he', 
      name: 'Hebrew', 
      direction: 'rtl', 
      region: 'Middle Eastern', 
      expressiveness: 0.75,
      directness: 0.7,
      formalityLevels: ['casual', 'formal'],
      honorificSystem: 'simple'
    });
  }

  /**
   * Retrieves a culture profile by its code
   * 
   * @param cultureCode - The ISO code for the culture (e.g., 'en', 'ja')
   * @returns The culture profile or undefined if not found
   */
  getCulture(cultureCode: string): CultureProfile | undefined {
    try {
      return this.cultures.get(cultureCode);
    } catch (error) {
      this.handleError('getCulture', error, { cultureCode });
      return undefined;
    }
  }

  /**
   * Adapts emotional expression based on cultural norms
   * 
   * @param emotion - The emotion to express
   * @param intensity - Original intensity value (0-1)
   * @param sourceCulture - Source culture code
   * @param targetCulture - Target culture code
   * @returns Adapted intensity value and cultural guidance
   */
  adaptEmotionalExpression(
    emotion: string,
    intensity: number,
    sourceCulture: string,
    targetCulture: string
  ): EmotionalAdaptation {
    try {
      const source = this.cultures.get(sourceCulture) || { expressiveness: this.defaultExpressiveness };
      const target = this.cultures.get(targetCulture) || { expressiveness: this.defaultExpressiveness };
      
      // Calculate relative expressiveness ratio
      const expressiveRatio = (target.expressiveness || this.defaultExpressiveness) / 
                             (source.expressiveness || this.defaultExpressiveness);
      
      // Adjust intensity based on cultural expressiveness
      let adaptedIntensity = intensity * expressiveRatio;
      
      // Ensure intensity stays within bounds
      adaptedIntensity = Math.max(0, Math.min(1, adaptedIntensity));
      
      // Apply cultural-specific emotional adaptations
      const culturalGuidance = this.getEmotionalGuidance(emotion, target.code || targetCulture);
      
      // Track the adaptation for metrics if available
      if (this.trustMetricsCollector) {
        this.trustMetricsCollector.trackMetric('emotionalAdaptation', {
          emotion,
          sourceCulture,
          targetCulture,
          originalIntensity: intensity,
          adaptedIntensity,
          expressiveRatio
        });
      }
      
      // Emit event if event bus is available
      if (this.eventBus) {
        this.eventBus.emit('emotionalAdaptation', {
          emotion,
          sourceCulture,
          targetCulture,
          originalIntensity: intensity,
          adaptedIntensity
        });
      }
      
      return {
        originalIntensity: intensity,
        adaptedIntensity,
        expressiveRatio,
        culturalGuidance,
        culturallyAppropriate: true
      };
    } catch (error) {
      this.handleError('adaptEmotionalExpression', error, {
        emotion,
        intensity,
        sourceCulture,
        targetCulture
      });
      
      // Return safe fallback in case of error
      return {
        originalIntensity: intensity,
        adaptedIntensity: intensity,
        expressiveRatio: 1,
        culturalGuidance: 'Adapt based on cultural context (fallback response)',
        culturallyAppropriate: false
      };
    }
  }

  /**
   * Analyzes the text direction based on culture and content
   * 
   * @param content - The text content to analyze
   * @param cultureCode - The culture code
   * @returns Text direction analysis
   */
  analyzeTextDirection(content: string, cultureCode: string): TextDirectionAnalysis {
    try {
      const culture = this.cultures.get(cultureCode);
      const isRTL = culture?.direction === 'rtl';
      const containsRTLCharacters = this.bidirectionalAnalyzer.containsRTLCharacters(content);
      const containsLTRCharacters = this.bidirectionalAnalyzer.containsLTRCharacters(content);
      
      // Analyze bidirectional segments using specialized analyzer
      const segmentAnalysis = this.bidirectionalAnalyzer.analyzeDirectionalSegments(content);
      
      // Track metrics if available
      if (this.trustMetricsCollector) {
        this.trustMetricsCollector.trackMetric('bidirectionalAnalysis', {
          cultureCode,
          contentLength: content.length,
          isRTL,
          segmentCount: segmentAnalysis.segmentCount,
          mixedDirections: containsRTLCharacters && containsLTRCharacters
        });
      }
      
      return {
        direction: culture?.direction || 'ltr',
        isRTL,
        containsMixedDirections: containsRTLCharacters && containsLTRCharacters,
        segmentCount: segmentAnalysis.segmentCount,
        requiresBidirectionalHandling: containsRTLCharacters && containsLTRCharacters,
        segments: segmentAnalysis.segments,
        complexityScore: segmentAnalysis.complexityScore
      };
    } catch (error) {
      this.handleError('analyzeTextDirection', error, { cultureCode, contentLength: content.length });
      
      // Return safe fallback
      return {
        direction: 'ltr',
        isRTL: false,
        containsMixedDirections: false,
        segmentCount: 1,
        requiresBidirectionalHandling: false,
        segments: [],
        complexityScore: 0
      };
    }
  }

  /**
   * Gets cultural-specific guidance for expressing an emotion
   */
  private getEmotionalGuidance(emotion: string, cultureCode: string): string {
    try {
      // Comprehensive cultural guidance by culture and emotion
      const emotionalGuidanceByCulture: Record<string, Record<string, string>> = {
        'ja': {
          'joy': 'Express more subdued, use humble language even when pleased',
          'anger': 'Avoid direct expression, use indirect language and subtle cues',
          'empathy': 'Focus on group harmony rather than individual feelings',
          'gratitude': 'Express with appropriate level of formality based on relationship',
          'disappointment': 'Minimize expression, focus on future improvement',
          'excitement': 'Express with restraint, especially in professional contexts'
        },
        'de': {
          'joy': 'Be specific about what causes the joy, can be moderately expressive',
          'anger': 'Can be direct but remain logical rather than emotional',
          'empathy': 'Direct acknowledgment of the challenge is appreciated',
          'gratitude': 'Be specific about what you are thankful for',
          'disappointment': 'Can be directly expressed with reasons',
          'excitement': 'Express with moderation and specific details'
        },
        'ar': {
          'joy': 'Expressive language with poetic elements is appropriate',
          'anger': 'Use metaphorical language rather than direct accusation',
          'empathy': 'Demonstrate solidarity and offer direct assistance',
          'gratitude': 'Express warmly and thoroughly with honorifics',
          'disappointment': 'Express with dignity, focus on wisdom gained',
          'excitement': 'Expressive language is appropriate, include blessings'
        },
        'fr': {
          'joy': 'Eloquent expression is appreciated, with moderate intensity',
          'anger': 'Can be expressed with nuance and precision',
          'empathy': 'Express with philosophical depth when appropriate',
          'gratitude': 'Express with warmth and appropriate formality',
          'disappointment': 'Can be expressed with subtle irony',
          'excitement': 'Express with elegant enthusiasm'
        }
      };
      
      // Get guidance for specific culture and emotion, or provide general guidance
      return emotionalGuidanceByCulture[cultureCode]?.[emotion] || 
             'Adapt based on general cultural context';
    } catch (error) {
      this.handleError('getEmotionalGuidance', error, { emotion, cultureCode });
      return 'Adapt based on cultural context (fallback response)';
    }
  }
  
  /**
   * Gets idiom equivalent in target culture
   * 
   * @param idiom - Original idiom text
   * @param meaning - Idiom meaning
   * @param targetCultureCode - Target culture code
   * @returns Equivalent idiom in target culture or undefined
   */
  getIdiomEquivalent(
    idiom: string,
    meaning: string,
    targetCultureCode: string
  ): string | undefined {
    try {
      // This would be expanded with a comprehensive database of idiom equivalents
      // For now, we'll implement a small sample
      const idiomEquivalents: Record<string, Record<string, string>> = {
        'en': {
          'raining cats and dogs': 'heavy rain',
          'piece of cake': 'very easy task',
          'break the ice': 'reduce social tension'
        },
        'ja': {
          'heavy rain': '土砂降り (doshaburi - "earth-sand falling")',
          'very easy task': '朝飯前 (asameshmae - "before breakfast")',
          'reduce social tension': '打ち解ける (uchihodokeru - "to open up")'
        },
        'de': {
          'heavy rain': 'es gießt wie aus Eimern (it\'s pouring like from buckets)',
          'very easy task': 'ein Kinderspiel (child\'s play)',
          'reduce social tension': 'das Eis brechen (break the ice)'
        },
        'fr': {
          'heavy rain': 'il pleut des cordes (it\'s raining ropes)',
          'very easy task': 'c\'est du gâteau (it\'s cake)',
          'reduce social tension': 'briser la glace (break the ice)'
        }
      };
      
      // Get equivalent by meaning in target culture
      return idiomEquivalents[targetCultureCode]?.[meaning];
    } catch (error) {
      this.handleError('getIdiomEquivalent', error, { idiom, targetCultureCode });
      return undefined;
    }
  }
  
  /**
   * Error handling with context
   */
  private handleError(methodName: string, error: unknown, context: Record<string, any> = {}): void {
    this.logger.error(`Error in CulturalAdapter.${methodName}`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...context
    });
    
    // Emit error event if event bus is available
    if (this.eventBus) {
      this.eventBus.emit('culturalAdapter.error', {
        method: methodName,
        error: error instanceof Error ? error.message : String(error),
        context
      });
    }
  }
}

/**
 * Types for cultural adaptation and profiles
 */
export interface CultureProfile {
  code?: string;
  name?: string;
  direction?: 'ltr' | 'rtl';
  region?: string;
  expressiveness?: number;
  directness?: number;
  formalityLevels?: string[];
  honorificSystem?: 'simple' | 'binary' | 'moderate' | 'complex';
}

export interface EmotionalAdaptation {
  originalIntensity: number;
  adaptedIntensity: number;
  expressiveRatio: number;
  culturalGuidance: string;
  culturallyAppropriate: boolean;
}

export interface TextDirectionAnalysis {
  direction: 'ltr' | 'rtl';
  isRTL: boolean;
  containsMixedDirections: boolean;
  segmentCount: number;
  requiresBidirectionalHandling: boolean;
  segments: TextDirectionSegment[];
  complexityScore: number;
}

export interface TextDirectionSegment {
  text: string;
  direction: 'ltr' | 'rtl';
  startIndex: number;
  endIndex: number;
} 