import { UniversalEmotionalAdapter } from '../../src/cultural-intelligence/universal-emotional-adapter';
import { CulturalContextEngine } from '../../src/global-sovereignty/cultural-context-engine';
import { PerformanceMonitor } from '../../src/performance-intelligence/performance-monitor';

const performanceMonitor = new PerformanceMonitor();

// Supported culture codes
type CultureCode = 'en' | 'ja' | 'it' | 'de' | 'ar' | 'fr';
type ExtendedCultureCode = CultureCode | 'br' | 'cn' | 'ru' | 'mx';
type EmotionType = 'joy' | 'concern' | 'enthusiasm';
type ContextType = 'business' | 'social' | 'academic';

// Emotional test data in different languages
const EMOTIONAL_MESSAGES: Record<EmotionType, Record<CultureCode, string>> = {
  joy: {
    en: "I'm absolutely thrilled with the results! This is amazing work.",
    ja: "結果にとても満足しています。素晴らしい仕事です。",
    it: "Sono assolutamente entusiasta dei risultati! Questo è un lavoro straordinario.",
    de: "Ich bin absolut begeistert von den Ergebnissen! Das ist hervorragende Arbeit.",
    ar: "أنا مسرور للغاية بالنتائج! هذا عمل رائع.",
    fr: "Je suis absolument ravi des résultats! C'est un travail incroyable."
  },
  concern: {
    en: "I'm concerned about the timeline. We may need to adjust expectations.",
    ja: "スケジュールについて心配しています。期待値の調整が必要かもしれません。",
    it: "Sono preoccupato per la tempistica. Potremmo dover adeguare le aspettative.",
    de: "Ich bin besorgt über den Zeitplan. Wir müssen möglicherweise die Erwartungen anpassen.",
    ar: "أنا قلق بشأن الجدول الزمني. قد نحتاج إلى تعديل التوقعات.",
    fr: "Je suis préoccupé par le calendrier. Nous devrons peut-être ajuster les attentes."
  },
  enthusiasm: {
    en: "This is incredibly exciting! I can't wait to get started!",
    ja: "これは非常にエキサイティングです！早く始めたいです！",
    it: "Questo è incredibilmente emozionante! Non vedo l'ora di iniziare!",
    de: "Das ist unglaublich aufregend! Ich kann es kaum erwarten, anzufangen!",
    ar: "هذا مثير للغاية! لا أستطيع الانتظار للبدء!",
    fr: "C'est incroyablement excitant! J'ai hâte de commencer!"
  }
};

// Cultural expressiveness metrics for different cultures
const CULTURAL_EXPRESSIVENESS: Record<ExtendedCultureCode, number> = {
  en: 0.7,  // baseline - English
  ja: 0.4,  // Japanese - more reserved
  it: 0.9,  // Italian - highly expressive
  de: 0.6,  // German - moderately reserved
  ar: 0.8,  // Arabic - more expressive
  fr: 0.75, // French - moderately expressive
  br: 0.85, // Brazilian - highly expressive
  cn: 0.5,  // Chinese - more reserved
  ru: 0.65, // Russian - moderate
  mx: 0.8   // Mexican - more expressive
};

describe('Cross-Cultural Emotional Intensity Calibration', () => {
  let universalAdapter: UniversalEmotionalAdapter;
  let culturalContextEngine: CulturalContextEngine;

  beforeEach(() => {
    universalAdapter = new UniversalEmotionalAdapter();
    culturalContextEngine = new CulturalContextEngine();
  });

  describe('Basic Emotional Intensity Calibration', () => {
    test('should calibrate emotional intensity between high and low expressiveness cultures', async () => {
      // Test with high expressiveness (Italian) to low expressiveness (Japanese)
      const joyMessageItalian = EMOTIONAL_MESSAGES.joy.it;
      const joyMessageJapanese = EMOTIONAL_MESSAGES.joy.ja;
      
      const italianAnalysis = universalAdapter.processContent(joyMessageItalian, 'it');
      const japaneseAnalysis = universalAdapter.processContent(joyMessageJapanese, 'ja');
      
      // Calibrate from Italian to Japanese intensity
      const calibratedIntensity = await culturalContextEngine.calibrateEmotionalIntensity(
        italianAnalysis.emotionalIntensity,
        'it', // source culture
        'ja'  // target culture
      );
      
      // The calibrated intensity should be lower than the original Italian intensity
      expect(calibratedIntensity).toBeLessThan(italianAnalysis.emotionalIntensity);
      
      // It should be close to the Japanese expected intensity
      const expectedRatio = CULTURAL_EXPRESSIVENESS.ja / CULTURAL_EXPRESSIVENESS.it;
      const actualRatio = calibratedIntensity / italianAnalysis.emotionalIntensity;
      
      expect(actualRatio).toBeCloseTo(expectedRatio, 1);
      
      // The calibrated intensity should be similar to the actual Japanese content's intensity
      expect(calibratedIntensity).toBeCloseTo(japaneseAnalysis.emotionalIntensity, 1);
    });
    
    test('should calibrate emotional intensity across all cultural combinations', async () => {
      const cultures: CultureCode[] = ['en', 'ja', 'it', 'de', 'ar', 'fr'];
      const emotion: EmotionType = 'joy';
      
      performanceMonitor.startSession('cross-cultural-calibration');
      
      // Test calibration between all culture pairs
      for (const sourceCulture of cultures) {
        const sourceMessage = EMOTIONAL_MESSAGES[emotion][sourceCulture];
        const sourceAnalysis = universalAdapter.processContent(sourceMessage, sourceCulture);
        
        for (const targetCulture of cultures) {
          if (sourceCulture === targetCulture) continue;
          
          const targetMessage = EMOTIONAL_MESSAGES[emotion][targetCulture];
          const targetAnalysis = universalAdapter.processContent(targetMessage, targetCulture);
          
          const calibratedIntensity = await culturalContextEngine.calibrateEmotionalIntensity(
            sourceAnalysis.emotionalIntensity,
            sourceCulture,
            targetCulture
          );
          
          // Calculate expected ratio based on cultural expressiveness
          const expectedRatio = CULTURAL_EXPRESSIVENESS[targetCulture] / CULTURAL_EXPRESSIVENESS[sourceCulture];
          const actualRatio = calibratedIntensity / sourceAnalysis.emotionalIntensity;
          
          expect(actualRatio).toBeCloseTo(expectedRatio, 1);
          expect(calibratedIntensity).toBeCloseTo(targetAnalysis.emotionalIntensity, 1);
        }
      }
      
      const sessionDuration = performanceMonitor.endSession();
      expect(sessionDuration).toBeLessThan(2000); // Fast performance
    });
  });
  
  describe('Emotional Authenticity Preservation', () => {
    test('should preserve emotional authenticity while calibrating intensity', async () => {
      // Test with different emotions
      const emotions: EmotionType[] = ['joy', 'concern', 'enthusiasm'];
      
      for (const emotion of emotions) {
        const sourceMessage = EMOTIONAL_MESSAGES[emotion].en;
        const sourceAnalysis = universalAdapter.processContent(sourceMessage, 'en');
        
        // Calibrate to different target cultures
        const targetCultures: CultureCode[] = ['ja', 'it', 'ar'];
        
        for (const targetCulture of targetCultures) {
          const result = await culturalContextEngine.calibrateEmotionForCulture(
            sourceMessage,
            'en',
            targetCulture,
            emotion
          );
          
          // Emotional tone should be preserved
          expect(result.preservedEmotionalIntent).toBe(true);
          expect(result.emotionalTone).toBe(emotion);
          
          // Intensity should be culturally appropriate
          const expectedRatio = CULTURAL_EXPRESSIVENESS[targetCulture] / CULTURAL_EXPRESSIVENESS.en;
          const actualRatio = result.calibratedIntensity / sourceAnalysis.emotionalIntensity;
          
          expect(actualRatio).toBeCloseTo(expectedRatio, 1);
          expect(result.culturallyAppropriate).toBe(true);
        }
      }
    });
    
    test('should handle extreme intensity differences while preserving core emotion', async () => {
      // Test with highly expressive culture (Italian) to very reserved (Japanese)
      const enthusiasmMessage = EMOTIONAL_MESSAGES.enthusiasm.it;
      
      const italianAnalysis = universalAdapter.processContent(enthusiasmMessage, 'it');
      
      const result = await culturalContextEngine.calibrateEmotionForCulture(
        enthusiasmMessage,
        'it',
        'ja',
        'enthusiasm'
      );
      
      // Even with large reduction in intensity, core emotion should be preserved
      expect(result.preservedEmotionalIntent).toBe(true);
      expect(result.emotionalTone).toBe('enthusiasm');
      
      // Intensity should be significantly reduced for Japanese cultural context
      expect(result.calibratedIntensity).toBeLessThan(italianAnalysis.emotionalIntensity * 0.6);
      expect(result.culturallyAppropriate).toBe(true);
      
      // Should include cultural guidance
      expect(result.culturalGuidance).toBeTruthy();
    });
  });
  
  describe('Contextual Intensity Calibration', () => {
    test('should calibrate intensity differently based on context', async () => {
      const contexts: ContextType[] = ['business', 'social', 'academic'];
      const sourceMessage = EMOTIONAL_MESSAGES.enthusiasm.en;
      
      for (const context of contexts) {
        const result = await culturalContextEngine.calibrateEmotionForCulture(
          sourceMessage,
          'en',
          'ja',
          'enthusiasm',
          { context }
        );
        
        // Business context should be more reserved in Japanese culture
        if (context === 'business') {
          expect(result.calibratedIntensity).toBeLessThan(0.4);
        }
        
        // Social context can be slightly more expressive
        if (context === 'social') {
          expect(result.calibratedIntensity).toBeGreaterThan(0.4);
        }
        
        // Always culturally appropriate
        expect(result.culturallyAppropriate).toBe(true);
      }
    });
    
    test('should apply higher intensity modulation for high-arousal emotions', async () => {
      // Test with high arousal emotion (enthusiasm) vs. low arousal emotion (concern)
      const highArousalMessage = EMOTIONAL_MESSAGES.enthusiasm.en;
      const lowArousalMessage = EMOTIONAL_MESSAGES.concern.en;
      
      const highArousalResult = await culturalContextEngine.calibrateEmotionForCulture(
        highArousalMessage,
        'en',
        'ja',
        'enthusiasm'
      );
      
      const lowArousalResult = await culturalContextEngine.calibrateEmotionForCulture(
        lowArousalMessage,
        'en',
        'ja',
        'concern'
      );
      
      // High arousal emotions should be modulated more significantly
      const highArousalSource = universalAdapter.processContent(highArousalMessage, 'en').emotionalIntensity;
      const lowArousalSource = universalAdapter.processContent(lowArousalMessage, 'en').emotionalIntensity;
      
      const highArousalRatio = highArousalResult.calibratedIntensity / highArousalSource;
      const lowArousalRatio = lowArousalResult.calibratedIntensity / lowArousalSource;
      
      // Higher modulation means lower ratio for reserved cultures like Japanese
      expect(highArousalRatio).toBeLessThan(lowArousalRatio);
    });
  });
  
  describe('Performance and Scalability', () => {
    test('should calibrate intensity efficiently for multiple cultures', async () => {
      const cultures = Object.keys(CULTURAL_EXPRESSIVENESS) as ExtendedCultureCode[];
      const sourceMessage = EMOTIONAL_MESSAGES.joy.en;
      
      performanceMonitor.startSession('multi-culture-calibration');
      
      const results = await Promise.all(
        cultures.map(culture => 
          culturalContextEngine.calibrateEmotionForCulture(
            sourceMessage,
            'en',
            culture,
            'joy'
          )
        )
      );
      
      const sessionDuration = performanceMonitor.endSession();
      
      // All calibrations should be culturally appropriate
      for (const result of results) {
        expect(result.culturallyAppropriate).toBe(true);
        expect(result.preservedEmotionalIntent).toBe(true);
      }
      
      // Verify diversity in calibration
      const intensities = results.map(r => r.calibratedIntensity);
      const intensityRange = Math.max(...intensities) - Math.min(...intensities);
      
      // Should have significant variation
      expect(intensityRange).toBeGreaterThan(0.3);
      
      // Should be fast
      expect(sessionDuration).toBeLessThan(3000);
    });
  });
}); 