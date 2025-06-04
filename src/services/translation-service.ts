/**
 * TranslationService Class
 * 
 * Provides translation capabilities across different languages with
 * emotional context preservation and cultural adaptation.
 */
import { Logger } from '../logger';
import { EventBus } from '../cursor/event-bus';

export class TranslationService {
  private logger: Logger;
  private eventBus?: EventBus;
  private availableLanguages: Map<string, LanguageInfo>;
  private translationProviders: TranslationProvider[];
  private qualityScoreCache: Map<string, number>;

  /**
   * Creates a new translation service
   * 
   * @param logger - Optional logger instance
   * @param eventBus - Optional event bus for events
   */
  constructor(logger?: Logger, eventBus?: EventBus) {
    this.logger = logger || new Logger('TranslationService');
    this.eventBus = eventBus;
    this.availableLanguages = this.initializeLanguages();
    this.translationProviders = [
      {
        name: 'primary',
        priority: 1,
        supportedLanguages: this.getLanguageCodes(),
        translateFn: this.primaryTranslate.bind(this)
      },
      {
        name: 'fallback',
        priority: 2,
        supportedLanguages: this.getLanguageCodes(),
        translateFn: this.fallbackTranslate.bind(this)
      }
    ];
    this.qualityScoreCache = new Map<string, number>();
    
    this.logger.info('TranslationService initialized with supported languages', {
      languageCount: this.availableLanguages.size
    });
  }
  
  /**
   * Translates text from one language to another
   * 
   * @param text - Text to translate
   * @param sourceLanguage - Source language code
   * @param targetLanguage - Target language code
   * @returns Translated text
   */
  translate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): string {
    try {
      if (!text) {
        return '';
      }
      
      // Log translation request
      this.logger.info('Translating text', {
        sourceLanguage,
        targetLanguage,
        textLength: text.length
      });
      
      // Check if languages are supported
      if (!this.isLanguageSupported(sourceLanguage)) {
        this.logger.warn(`Source language not supported: ${sourceLanguage}`);
        return text;
      }
      
      if (!this.isLanguageSupported(targetLanguage)) {
        this.logger.warn(`Target language not supported: ${targetLanguage}`);
        return text;
      }
      
      // Same language, no translation needed
      if (sourceLanguage === targetLanguage) {
        return text;
      }
      
      // Find suitable translation provider
      const provider = this.findTranslationProvider(sourceLanguage, targetLanguage);
      
      if (!provider) {
        this.logger.warn('No translation provider available for language pair', {
          sourceLanguage,
          targetLanguage
        });
        return text;
      }
      
      // Perform translation
      const translatedText = provider.translateFn(text, sourceLanguage, targetLanguage);
      
      // Emit translation event if event bus is available
      if (this.eventBus) {
        this.eventBus.emit('translation', {
          sourceLanguage,
          targetLanguage,
          sourceLength: text.length,
          targetLength: translatedText.length,
          provider: provider.name
        });
      }
      
      return translatedText;
    } catch (error) {
      this.handleError('translate', error, {
        sourceLanguage,
        targetLanguage,
        textLength: text.length
      });
      
      // Return original text as fallback
      return text;
    }
  }
  
  /**
   * Translates text with contextual information for better accuracy
   * 
   * @param text - Text to translate
   * @param sourceLanguage - Source language code
   * @param targetLanguage - Target language code
   * @param context - Additional context for translation
   * @returns Translated text with preserved context
   */
  translateWithContext(
    text: string,
    sourceLanguage: string,
    targetLanguage: string,
    context: TranslationContext = {}
  ): string {
    try {
      // Same language, no translation needed
      if (sourceLanguage === targetLanguage) {
        return text;
      }
      
      // Add debug logging
      this.logger.debug('Translating with context', {
        sourceLanguage,
        targetLanguage,
        context
      });
      
      // Get basic translation
      let translatedText = this.translate(text, sourceLanguage, targetLanguage);
      
      // Apply contextual adaptations
      
      // 1. Handle emotional tone preservation
      if (context.emotionalTone) {
        translatedText = this.preserveEmotionalTone(
          translatedText,
          targetLanguage,
          context.emotionalTone,
          context.intensity || 0.5
        );
      }
      
      // 2. Handle formality preservation
      if (context.preserveFormality) {
        translatedText = this.adjustFormality(
          translatedText,
          targetLanguage
        );
      }
      
      // 3. Handle domain-specific terminology
      if (context.domain && context.domain !== 'general') {
        translatedText = this.applyDomainSpecificTerminology(
          translatedText,
          targetLanguage,
          context.domain
        );
      }
      
      // 4. Handle idiom preservation
      if (context.preserveIdioms) {
        translatedText = this.preserveIdioms(
          text,
          translatedText,
          sourceLanguage,
          targetLanguage
        );
      }
      
      return translatedText;
    } catch (error) {
      this.handleError('translateWithContext', error, {
        sourceLanguage,
        targetLanguage,
        contextKeys: Object.keys(context)
      });
      
      // Fallback to basic translation if context-aware translation fails
      return this.translate(text, sourceLanguage, targetLanguage);
    }
  }
  
  /**
   * Detects the language of text
   * 
   * @param text - Text to analyze
   * @returns Detected language code
   */
  detectLanguage(text: string): string {
    try {
      if (!text) {
        return 'en'; // Default to English for empty text
      }
      
      // Real implementation would use a language detection algorithm
      // For this implementation, we'll use script/character detection
      
      // Japanese (Hiragana, Katakana, Kanji)
      if (text.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/)) {
        return 'ja';
      }
      
      // Arabic
      if (text.match(/[\u0600-\u06FF]/)) {
        return 'ar';
      }
      
      // Hebrew
      if (text.match(/[\u0590-\u05FF]/)) {
        return 'he';
      }
      
      // Chinese (Simplified and Traditional)
      if (text.match(/[\u4e00-\u9fff]/)) {
        return 'zh';
      }
      
      // Korean
      if (text.match(/[\uAC00-\uD7AF\u1100-\u11FF]/)) {
        return 'ko';
      }
      
      // Russian and other Cyrillic
      if (text.match(/[\u0400-\u04FF]/)) {
        return 'ru';
      }
      
      // Thai
      if (text.match(/[\u0E00-\u0E7F]/)) {
        return 'th';
      }
      
      // Greek
      if (text.match(/[\u0370-\u03FF]/)) {
        return 'el';
      }
      
      // Check for specific European languages using their unique characters
      if (/ä|ö|ü|ß/.test(text)) {
        return 'de'; // German
      }
      
      if (/é|à|è|ù|â|ê|î|ô|û|ë|ï|ü|ÿ|ç/.test(text)) {
        return 'fr'; // French
      }
      
      if (/á|é|í|ó|ú|ñ|ü|¿|¡/.test(text)) {
        return 'es'; // Spanish
      }
      
      if (/à|è|é|ì|í|ò|ó|ù|ú/.test(text)) {
        return 'it'; // Italian
      }
      
      if (/ã|õ|á|é|í|ó|ú|ç|à|â|ê|ô/.test(text)) {
        return 'pt'; // Portuguese
      }
      
      // Default to English
      return 'en';
    } catch (error) {
      this.handleError('detectLanguage', error, { textLength: text.length });
      return 'en'; // Default to English in case of error
    }
  }
  
  /**
   * Gets available languages for translation
   * 
   * @returns List of supported language codes
   */
  getAvailableLanguages(): string[] {
    return Array.from(this.availableLanguages.keys());
  }
  
  /**
   * Gets detailed information about supported languages
   * 
   * @returns Map of language codes to language information
   */
  getLanguageDetails(): Map<string, LanguageInfo> {
    return new Map(this.availableLanguages);
  }
  
  /**
   * Scores the quality of a translation
   * 
   * @param originalText - Original text
   * @param translatedText - Translated text
   * @param sourceLanguage - Source language code
   * @param targetLanguage - Target language code
   * @returns Quality score (0-1)
   */
  scoreTranslationQuality(
    originalText: string,
    translatedText: string,
    sourceLanguage: string,
    targetLanguage: string
  ): TranslationQualityScore {
    try {
      // Generate cache key
      const cacheKey = `${sourceLanguage}:${targetLanguage}:${originalText.length}:${translatedText.length}`;
      
      // Check cache first
      if (this.qualityScoreCache.has(cacheKey)) {
        const cachedScore = this.qualityScoreCache.get(cacheKey)!;
        
        return {
          overall: cachedScore,
          fluency: cachedScore,
          accuracy: cachedScore,
          culturalRelevance: cachedScore,
          emotionalPreservation: cachedScore
        };
      }
      
      // In a real implementation, this would use sophisticated analysis
      // Calculate a baseline score based on language pair complexity
      const languageComplexity = this.calculateLanguageComplexity(sourceLanguage, targetLanguage);
      
      // Calculate length ratio as a heuristic (very rough approximation)
      const lengthRatio = translatedText.length / Math.max(1, originalText.length);
      const lengthScore = Math.max(0, 1 - Math.abs(lengthRatio - this.getIdealLengthRatio(sourceLanguage, targetLanguage)));
      
      // Calculate overall score
      const overallScore = Math.min(1, Math.max(0.4, (1 - languageComplexity) * 0.5 + lengthScore * 0.5));
      
      // Cache the result
      this.qualityScoreCache.set(cacheKey, overallScore);
      
      // Return detailed score
      return {
        overall: overallScore,
        fluency: overallScore - 0.05,
        accuracy: overallScore - 0.1,
        culturalRelevance: overallScore - 0.15,
        emotionalPreservation: overallScore - 0.2
      };
    } catch (error) {
      this.handleError('scoreTranslationQuality', error, {
        sourceLanguage,
        targetLanguage
      });
      
      // Return moderate score as fallback
      return {
        overall: 0.7,
        fluency: 0.7,
        accuracy: 0.7,
        culturalRelevance: 0.6,
        emotionalPreservation: 0.6
      };
    }
  }
  
  /**
   * Finds untranslatable cultural concepts in the text
   * 
   * @param text - Text to analyze
   * @param sourceLanguage - Source language code
   * @param targetLanguage - Target language code
   * @returns List of untranslatable concepts
   */
  findUntranslatableConcepts(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): UntranslatableConcept[] {
    try {
      // In a real implementation, this would analyze text for culture-specific concepts
      // For this implementation, we'll return an empty list
      return [];
    } catch (error) {
      this.handleError('findUntranslatableConcepts', error, {
        sourceLanguage,
        targetLanguage
      });
      return [];
    }
  }
  
  /**
   * Initializes language information
   * 
   * @returns Map of language codes to language information
   */
  private initializeLanguages(): Map<string, LanguageInfo> {
    const languages = new Map<string, LanguageInfo>();
    
    // Major European languages
    languages.set('en', { 
      code: 'en', 
      name: 'English', 
      script: 'Latin', 
      direction: 'ltr',
      regions: ['US', 'UK', 'CA', 'AU', 'NZ'],
      complexityScore: 0.5
    });
    
    languages.set('fr', { 
      code: 'fr', 
      name: 'French', 
      script: 'Latin', 
      direction: 'ltr',
      regions: ['FR', 'CA', 'BE', 'CH'],
      complexityScore: 0.65
    });
    
    languages.set('de', { 
      code: 'de', 
      name: 'German', 
      script: 'Latin', 
      direction: 'ltr',
      regions: ['DE', 'AT', 'CH'],
      complexityScore: 0.7
    });
    
    languages.set('es', { 
      code: 'es', 
      name: 'Spanish', 
      script: 'Latin', 
      direction: 'ltr',
      regions: ['ES', 'MX', 'AR', 'CO'],
      complexityScore: 0.6
    });
    
    languages.set('it', { 
      code: 'it', 
      name: 'Italian', 
      script: 'Latin', 
      direction: 'ltr',
      regions: ['IT', 'CH'],
      complexityScore: 0.6
    });
    
    // East Asian languages
    languages.set('ja', { 
      code: 'ja', 
      name: 'Japanese', 
      script: 'Japanese', 
      direction: 'ltr',
      regions: ['JP'],
      complexityScore: 0.9
    });
    
    languages.set('zh', { 
      code: 'zh', 
      name: 'Chinese', 
      script: 'Chinese', 
      direction: 'ltr',
      regions: ['CN', 'TW', 'HK', 'SG'],
      complexityScore: 0.9
    });
    
    languages.set('ko', { 
      code: 'ko', 
      name: 'Korean', 
      script: 'Hangul', 
      direction: 'ltr',
      regions: ['KR'],
      complexityScore: 0.85
    });
    
    // Middle Eastern languages
    languages.set('ar', { 
      code: 'ar', 
      name: 'Arabic', 
      script: 'Arabic', 
      direction: 'rtl',
      regions: ['SA', 'EG', 'MA', 'AE'],
      complexityScore: 0.85
    });
    
    languages.set('he', { 
      code: 'he', 
      name: 'Hebrew', 
      script: 'Hebrew', 
      direction: 'rtl',
      regions: ['IL'],
      complexityScore: 0.8
    });
    
    // Additional European languages
    languages.set('ru', { 
      code: 'ru', 
      name: 'Russian', 
      script: 'Cyrillic', 
      direction: 'ltr',
      regions: ['RU', 'BY', 'KZ'],
      complexityScore: 0.75
    });
    
    languages.set('pt', { 
      code: 'pt', 
      name: 'Portuguese', 
      script: 'Latin', 
      direction: 'ltr',
      regions: ['PT', 'BR'],
      complexityScore: 0.6
    });
    
    // Additional languages
    languages.set('hi', { 
      code: 'hi', 
      name: 'Hindi', 
      script: 'Devanagari', 
      direction: 'ltr',
      regions: ['IN'],
      complexityScore: 0.8
    });
    
    languages.set('tr', { 
      code: 'tr', 
      name: 'Turkish', 
      script: 'Latin', 
      direction: 'ltr',
      regions: ['TR'],
      complexityScore: 0.7
    });
    
    languages.set('nl', { 
      code: 'nl', 
      name: 'Dutch', 
      script: 'Latin', 
      direction: 'ltr',
      regions: ['NL', 'BE'],
      complexityScore: 0.6
    });
    
    languages.set('sv', { 
      code: 'sv', 
      name: 'Swedish', 
      script: 'Latin', 
      direction: 'ltr',
      regions: ['SE'],
      complexityScore: 0.55
    });
    
    languages.set('fi', { 
      code: 'fi', 
      name: 'Finnish', 
      script: 'Latin', 
      direction: 'ltr',
      regions: ['FI'],
      complexityScore: 0.75
    });
    
    languages.set('da', { 
      code: 'da', 
      name: 'Danish', 
      script: 'Latin', 
      direction: 'ltr',
      regions: ['DK'],
      complexityScore: 0.55
    });
    
    languages.set('no', { 
      code: 'no', 
      name: 'Norwegian', 
      script: 'Latin', 
      direction: 'ltr',
      regions: ['NO'],
      complexityScore: 0.55
    });
    
    languages.set('pl', { 
      code: 'pl', 
      name: 'Polish', 
      script: 'Latin', 
      direction: 'ltr',
      regions: ['PL'],
      complexityScore: 0.7
    });
    
    return languages;
  }
  
  /**
   * Gets language codes for all supported languages
   * 
   * @returns Array of language codes
   */
  private getLanguageCodes(): string[] {
    return Array.from(this.availableLanguages.keys());
  }
  
  /**
   * Checks if a language is supported
   * 
   * @param languageCode - Language code to check
   * @returns Whether the language is supported
   */
  private isLanguageSupported(languageCode: string): boolean {
    return this.availableLanguages.has(languageCode);
  }
  
  /**
   * Finds a suitable translation provider for a language pair
   * 
   * @param sourceLanguage - Source language code
   * @param targetLanguage - Target language code
   * @returns Suitable translation provider or undefined
   */
  private findTranslationProvider(
    sourceLanguage: string,
    targetLanguage: string
  ): TranslationProvider | undefined {
    // Find providers that support both languages
    const suitableProviders = this.translationProviders.filter(provider => {
      return provider.supportedLanguages.includes(sourceLanguage) &&
             provider.supportedLanguages.includes(targetLanguage);
    });
    
    // Sort by priority
    suitableProviders.sort((a, b) => a.priority - b.priority);
    
    return suitableProviders[0];
  }
  
  /**
   * Primary translation implementation
   * 
   * @param text - Text to translate
   * @param sourceLanguage - Source language code
   * @param targetLanguage - Target language code
   * @returns Translated text
   */
  private primaryTranslate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): string {
    // In a real implementation, this would call an external translation API
    // For demonstration purposes, we'll implement a simple mock translation
    
    // Create a deterministic "translation" based on character substitution
    // This is just to simulate different text output, not actual translation
    const translatedChars = text.split('').map(char => {
      // Skip non-alphabetic characters
      if (!/[a-zA-Z]/.test(char)) {
        return char;
      }
      
      // Create a character offset based on target language
      // This gives different but consistent output for different languages
      const langCode = targetLanguage.charCodeAt(0) + targetLanguage.charCodeAt(1);
      const offset = langCode % 5;
      
      // Shift character code by offset
      const charCode = char.charCodeAt(0);
      const baseCode = char.toLowerCase() === char ? 97 : 65; // 'a' or 'A'
      const newCharCode = ((charCode - baseCode + offset) % 26) + baseCode;
      
      return String.fromCharCode(newCharCode);
    });
    
    return translatedChars.join('');
  }
  
  /**
   * Fallback translation implementation
   * 
   * @param text - Text to translate
   * @param sourceLanguage - Source language code
   * @param targetLanguage - Target language code
   * @returns Translated text
   */
  private fallbackTranslate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): string {
    // Simpler fallback translation approach
    return text;
  }
  
  /**
   * Preserves emotional tone in translated text
   * 
   * @param text - Text to process
   * @param language - Target language
   * @param tone - Emotional tone
   * @param intensity - Emotional intensity
   * @returns Processed text with preserved emotional tone
   */
  private preserveEmotionalTone(
    text: string,
    language: string,
    tone: string,
    intensity: number
  ): string {
    // In a real implementation, this would adjust emotional markers
    return text;
  }
  
  /**
   * Adjusts formality level in text
   * 
   * @param text - Text to adjust
   * @param language - Target language
   * @returns Text with adjusted formality
   */
  private adjustFormality(text: string, language: string): string {
    // In a real implementation, this would adjust formality markers
    return text;
  }
  
  /**
   * Applies domain-specific terminology
   * 
   * @param text - Text to process
   * @param language - Target language
   * @param domain - Domain context
   * @returns Text with domain-specific terminology
   */
  private applyDomainSpecificTerminology(
    text: string,
    language: string,
    domain: string
  ): string {
    // In a real implementation, this would apply domain-specific terminology
    return text;
  }
  
  /**
   * Preserves idioms in translation
   * 
   * @param originalText - Original text
   * @param translatedText - Translated text
   * @param sourceLanguage - Source language
   * @param targetLanguage - Target language
   * @returns Text with preserved idioms
   */
  private preserveIdioms(
    originalText: string,
    translatedText: string,
    sourceLanguage: string,
    targetLanguage: string
  ): string {
    // In a real implementation, this would identify and preserve idioms
    return translatedText;
  }
  
  /**
   * Calculates complexity between language pair
   * 
   * @param sourceLanguage - Source language code
   * @param targetLanguage - Target language code
   * @returns Complexity score (0-1)
   */
  private calculateLanguageComplexity(
    sourceLanguage: string,
    targetLanguage: string
  ): number {
    const sourceInfo = this.availableLanguages.get(sourceLanguage);
    const targetInfo = this.availableLanguages.get(targetLanguage);
    
    if (!sourceInfo || !targetInfo) {
      return 0.5; // Default medium complexity
    }
    
    // Calculate base complexity
    let complexity = 0;
    
    // Different script families increase complexity
    if (sourceInfo.script !== targetInfo.script) {
      complexity += 0.3;
    }
    
    // Different directions increase complexity
    if (sourceInfo.direction !== targetInfo.direction) {
      complexity += 0.2;
    }
    
    // Add language-specific complexity
    complexity += (sourceInfo.complexityScore + targetInfo.complexityScore) / 4;
    
    return Math.min(1, Math.max(0, complexity));
  }
  
  /**
   * Gets ideal length ratio between language pair
   * 
   * @param sourceLanguage - Source language code
   * @param targetLanguage - Target language code
   * @returns Ideal length ratio
   */
  private getIdealLengthRatio(sourceLanguage: string, targetLanguage: string): number {
    // Approximate length ratios between language pairs
    const lengthRatios: Record<string, Record<string, number>> = {
      'en': {
        'fr': 1.3, // English to French typically expands by ~30%
        'de': 1.3, // English to German typically expands by ~30%
        'es': 1.25, // English to Spanish typically expands by ~25%
        'it': 1.25, // English to Italian typically expands by ~25%
        'ja': 0.6, // English to Japanese typically contracts by ~40%
        'zh': 0.5, // English to Chinese typically contracts by ~50%
        'ru': 1.2, // English to Russian typically expands by ~20%
      },
      'fr': {
        'en': 0.75, // French to English typically contracts by ~25%
        'de': 1.0, // French to German is roughly the same length
        'es': 0.95, // French to Spanish is slightly shorter
        'it': 0.95, // French to Italian is slightly shorter
      },
      'de': {
        'en': 0.75, // German to English typically contracts by ~25%
        'fr': 1.0, // German to French is roughly the same length
        'es': 0.95, // German to Spanish is slightly shorter
        'it': 0.95, // German to Italian is slightly shorter
      }
    };
    
    // Get ratio if available
    if (lengthRatios[sourceLanguage]?.[targetLanguage]) {
      return lengthRatios[sourceLanguage][targetLanguage];
    }
    
    // Default to 1 (same length) if pair not found
    return 1;
  }
  
  /**
   * Error handling with context
   */
  private handleError(methodName: string, error: unknown, context: Record<string, any> = {}): void {
    this.logger.error(`Error in TranslationService.${methodName}`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...context
    });
    
    // Emit error event if event bus is available
    if (this.eventBus) {
      this.eventBus.emit('translationService.error', {
        method: methodName,
        error: error instanceof Error ? error.message : String(error),
        context
      });
    }
  }
}

/**
 * Types for translation operations
 */
export interface TranslationContext {
  emotionalTone?: string;
  intensity?: number;
  preserveFormality?: boolean;
  preserveIdioms?: boolean;
  domain?: 'general' | 'technical' | 'medical' | 'legal' | 'business';
}

export interface LanguageInfo {
  code: string;
  name: string;
  script: string;
  direction: 'ltr' | 'rtl';
  regions: string[];
  complexityScore: number;
}

interface TranslationProvider {
  name: string;
  priority: number;
  supportedLanguages: string[];
  translateFn: (text: string, source: string, target: string) => string;
}

export interface TranslationQualityScore {
  overall: number;
  fluency: number;
  accuracy: number;
  culturalRelevance: number;
  emotionalPreservation: number;
}

export interface UntranslatableConcept {
  text: string;
  concept: string;
  explanation: string;
  alternatives?: string[];
} 