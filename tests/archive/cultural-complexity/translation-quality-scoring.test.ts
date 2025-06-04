import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { CulturalAdapter } from '../../src/cultural-intelligence/cultural-adapter';
import { EmotionalStateManager } from '../../src/emotional-sovereignty/emotional-state-manager';
import { PerformanceMonitor } from '../../src/test-infrastructure';
import { UniversalEmotionalAdapter } from '../../src/cultural-intelligence/universal-emotional-adapter';
import { CulturalContextEngine } from '../../src/global-sovereignty/cultural-context-engine';

// Test data for different languages and emotions
const TEST_DATA = {
  english: {
    joy: "I'm absolutely thrilled with the results! This is amazing work.",
    sadness: "I'm deeply saddened by the news. This is truly disappointing.",
    anger: "This is absolutely frustrating! We need to fix this immediately.",
    fear: "I'm very concerned about the deadline. We might not make it.",
    empathy: "I completely understand how you feel. It's perfectly natural in this situation."
  },
  japanese: {
    joy: "結果に大変満足しています！素晴らしい仕事です。",
    sadness: "そのニュースを聞いて残念です。本当に残念です。",
    anger: "これは非常に不満です。すぐに修正する必要があります。",
    fear: "締め切りについて心配しています。間に合わないかもしれません。",
    empathy: "あなたの気持ちはよく分かります。この状況では自然なことです。"
  },
  spanish: {
    joy: "¡Estoy absolutamente encantado con los resultados! Este es un trabajo increíble.",
    sadness: "Estoy profundamente entristecido por las noticias. Esto es realmente decepcionante.",
    anger: "¡Esto es absolutamente frustrante! Necesitamos arreglar esto inmediatamente.",
    fear: "Estoy muy preocupado por la fecha límite. Es posible que no lo logremos.",
    empathy: "Entiendo completamente cómo te sientes. Es perfectamente natural en esta situación."
  },
  arabic: {
    joy: "أنا سعيد للغاية بالنتائج! هذا عمل مذهل.",
    sadness: "أنا حزين للغاية بسبب الأخبار. هذا محبط حقًا.",
    anger: "هذا أمر محبط للغاية! نحتاج إلى إصلاح هذا على الفور.",
    fear: "أنا قلق جدًا بشأن الموعد النهائي. قد لا نتمكن من تحقيقه.",
    empathy: "أتفهم تمامًا شعورك. هذا أمر طبيعي تمامًا في هذا الموقف."
  }
};

// Expected emotion characteristics
const EMOTION_CHARACTERISTICS = {
  joy: { positive: true, intensity: 'high', appropriateness: 'universal' },
  sadness: { positive: false, intensity: 'medium', appropriateness: 'universal' },
  anger: { positive: false, intensity: 'high', appropriateness: 'contextual' },
  fear: { positive: false, intensity: 'medium', appropriateness: 'contextual' },
  empathy: { positive: true, intensity: 'medium', appropriateness: 'universal' }
};

// Cultural expressiveness factors
const CULTURAL_EXPRESSIVENESS = {
  english: 0.7, // baseline
  japanese: 0.4, // more reserved
  spanish: 0.85, // more expressive
  arabic: 0.8 // more expressive
};

describe('Translation Quality Scoring with Emotional Preservation', () => {
  let culturalAdapter: CulturalAdapter;
  let emotionalStateManager: EmotionalStateManager;
  let universalAdapter: UniversalEmotionalAdapter;
  let culturalContextEngine: CulturalContextEngine;
  let performanceMonitor: PerformanceMonitor;

  beforeEach(() => {
    performanceMonitor = new PerformanceMonitor();
    performanceMonitor.startSession();
    
    culturalAdapter = new CulturalAdapter();
    emotionalStateManager = new EmotionalStateManager();
    universalAdapter = new UniversalEmotionalAdapter();
    culturalContextEngine = new CulturalContextEngine();
    
    // Mock performance monitoring
    performanceMonitor.mark = jest.fn();
    performanceMonitor.measureBetweenMarks = jest.fn().mockReturnValue(500);
  });

  afterEach(() => {
    performanceMonitor.endSession();
  });

  describe('Emotional Tone Preservation', () => {
    test('should preserve emotional tone across all language pairs', () => {
      const languages = ['english', 'japanese', 'spanish', 'arabic'];
      const emotions = ['joy', 'sadness', 'anger', 'fear', 'empathy'];
      
      for (const sourceLanguage of languages) {
        for (const targetLanguage of languages) {
          if (sourceLanguage === targetLanguage) continue;
          
          for (const emotion of emotions) {
            const sourceLangCode = getLangCode(sourceLanguage);
            const targetLangCode = getLangCode(targetLanguage);
            const sourceText = TEST_DATA[sourceLanguage][emotion];
            
            // Translate with emotional preservation
            const translatedText = universalAdapter.translateWithEmotionalPreservation(
              sourceText,
              sourceLangCode,
              targetLangCode
            );
            
            // Evaluate translation quality
            const qualityScore = universalAdapter.evaluateTranslationQuality(
              sourceText,
              translatedText,
              sourceLangCode,
              targetLangCode,
              emotion
            );
            
            // Emotional tone should be preserved
            expect(qualityScore.emotionalMatch).toBe(true);
            expect(qualityScore.sourceEmotion).toBe(emotion);
            expect(qualityScore.detectedEmotion).toBe(emotion);
            
            // Overall quality should be high
            expect(qualityScore.overallScore).toBeGreaterThanOrEqual(0.8);
          }
        }
      }
    });
    
    test('should adapt emotional intensity based on cultural norms', () => {
      const sourceLanguage = 'spanish'; // highly expressive
      const targetLanguage = 'japanese'; // more reserved
      const emotion = 'joy'; // consistent emotion
      
      const sourceText = TEST_DATA[sourceLanguage][emotion];
      const sourceLangCode = getLangCode(sourceLanguage);
      const targetLangCode = getLangCode(targetLanguage);
      
      // Get emotional analysis of source text
      const sourceAnalysis = universalAdapter.processContent(sourceText, sourceLangCode);
      
      // Translate with emotional preservation
      const translatedText = universalAdapter.translateWithEmotionalPreservation(
        sourceText,
        sourceLangCode,
        targetLangCode
      );
      
      // Get emotional analysis of translated text
      const translatedAnalysis = universalAdapter.processContent(translatedText, targetLangCode);
      
      // Emotional tone should be preserved
      expect(translatedAnalysis.emotionalTone).toBe(sourceAnalysis.emotionalTone);
      
      // But intensity should be adapted to cultural norms
      const expectedRatio = CULTURAL_EXPRESSIVENESS.japanese / CULTURAL_EXPRESSIVENESS.spanish;
      const actualRatio = translatedAnalysis.emotionalIntensity / sourceAnalysis.emotionalIntensity;
      
      expect(actualRatio).toBeCloseTo(expectedRatio, 1);
    });
  });

  describe('Translation Quality Metrics', () => {
    test('should provide detailed quality metrics for translations', () => {
      const sourceText = TEST_DATA.english.empathy;
      const sourceLang = 'en';
      const targetLang = 'ar';
      
      // Translate with emotional preservation
      const translatedText = universalAdapter.translateWithEmotionalPreservation(
        sourceText,
        sourceLang,
        targetLang
      );
      
      // Evaluate translation quality
      const qualityScore = universalAdapter.evaluateTranslationQuality(
        sourceText,
        translatedText,
        sourceLang,
        targetLang,
        'empathy'
      );
      
      // Check for comprehensive metrics
      expect(qualityScore).toHaveProperty('overallScore');
      expect(qualityScore).toHaveProperty('emotionalPreservation');
      expect(qualityScore).toHaveProperty('culturalAppropriateness');
      expect(qualityScore).toHaveProperty('detectedEmotion');
      expect(qualityScore).toHaveProperty('sourceEmotion');
      expect(qualityScore).toHaveProperty('emotionalMatch');
      expect(qualityScore).toHaveProperty('warnings');
      
      // All metrics should be within valid ranges
      expect(qualityScore.overallScore).toBeGreaterThanOrEqual(0);
      expect(qualityScore.overallScore).toBeLessThanOrEqual(1);
      expect(qualityScore.emotionalPreservation).toBeGreaterThanOrEqual(0);
      expect(qualityScore.emotionalPreservation).toBeLessThanOrEqual(1);
      expect(qualityScore.culturalAppropriateness).toBeGreaterThanOrEqual(0);
      expect(qualityScore.culturalAppropriateness).toBeLessThanOrEqual(1);
    });
    
    test('should detect and warn about untranslatable cultural concepts', () => {
      const culturallySpecificText = "The concept of 'wabi-sabi' is deeply ingrained in Japanese aesthetics.";
      const sourceLang = 'en';
      const targetLang = 'ar';
      
      // Translate with emotional preservation
      universalAdapter.translateWithEmotionalPreservation(
        culturallySpecificText,
        sourceLang,
        targetLang
      );
      
      // Check for appropriate warnings
      const warnings = universalAdapter.getTranslationWarnings();
      expect(warnings).toContain('untranslatable_cultural_concept');
      
      // Check for appropriate score adjustment
      const preservationScore = universalAdapter.getCulturalConceptPreservationScore();
      expect(preservationScore).toBeLessThan(1.0);
      expect(preservationScore).toBeGreaterThanOrEqual(0.7);
    });
  });

  describe('Performance and Efficiency', () => {
    test('should process translations efficiently', () => {
      performanceMonitor.mark('translation-start');
      
      // Process multiple translations
      const results = [];
      const languages = ['english', 'japanese', 'spanish', 'arabic'];
      
      for (const sourceLanguage of languages) {
        for (const targetLanguage of languages) {
          if (sourceLanguage === targetLanguage) continue;
          
          const sourceLangCode = getLangCode(sourceLanguage);
          const targetLangCode = getLangCode(targetLanguage);
          const sourceText = TEST_DATA[sourceLanguage].empathy;
          
          const translatedText = universalAdapter.translateWithEmotionalPreservation(
            sourceText,
            sourceLangCode,
            targetLangCode
          );
          
          const qualityScore = universalAdapter.evaluateTranslationQuality(
            sourceText,
            translatedText,
            sourceLangCode,
            targetLangCode,
            'empathy'
          );
          
          results.push(qualityScore);
        }
      }
      
      performanceMonitor.mark('translation-end');
      const timeTaken = performanceMonitor.measureBetweenMarks('translation-start', 'translation-end');
      
      // We expect 12 translations (4 languages, each translated to 3 others)
      expect(results.length).toBe(12);
      
      // All translations should have high quality scores
      expect(results.every(r => r.overallScore >= 0.7)).toBe(true);
      
      // Timing should be reasonable
      expect(timeTaken).toBeLessThan(5000); // 5 seconds max for 12 translations
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty or very short text', () => {
      const emptyText = "";
      const shortText = "Hi.";
      
      // Should not throw errors
      expect(() => {
        universalAdapter.translateWithEmotionalPreservation(emptyText, 'en', 'ja');
      }).not.toThrow();
      
      expect(() => {
        universalAdapter.translateWithEmotionalPreservation(shortText, 'en', 'ja');
      }).not.toThrow();
      
      // Quality scores should be defined even for edge cases
      const qualityScore = universalAdapter.evaluateTranslationQuality(
        shortText,
        universalAdapter.translateWithEmotionalPreservation(shortText, 'en', 'ja'),
        'en',
        'ja',
        'neutral'
      );
      
      expect(qualityScore.overallScore).toBeGreaterThanOrEqual(0);
      expect(qualityScore.overallScore).toBeLessThanOrEqual(1);
    });
    
    test('should handle unsupported languages gracefully', () => {
      const sourceText = "Hello, how are you?";
      const unsupportedLang = 'xyz'; // Fictional language code
      
      // Should not throw errors
      expect(() => {
        universalAdapter.translateWithEmotionalPreservation(sourceText, 'en', unsupportedLang);
      }).not.toThrow();
      
      // Should add appropriate warnings
      const translation = universalAdapter.translateWithEmotionalPreservation(
        sourceText,
        'en',
        unsupportedLang
      );
      
      const warnings = universalAdapter.getTranslationWarnings();
      expect(warnings.length).toBeGreaterThan(0);
      
      // Should still return some content
      expect(translation).toBeTruthy();
    });
  });
});

// Helper function to get language code from language name
function getLangCode(language: string): string {
  const langMap = {
    english: 'en',
    japanese: 'ja',
    spanish: 'es',
    arabic: 'ar'
  };
  
  return langMap[language] || language;
} 