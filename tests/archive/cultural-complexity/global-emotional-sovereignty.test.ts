import { describe, test, expect, beforeEach } from '@jest/globals';
import { CulturalAdapter } from '../../src/cultural-intelligence/cultural-adapter';
import { EmotionalStateManager } from '../../src/emotional-sovereignty/emotional-state-manager';
import { PerformanceMonitor } from '../../src/test-infrastructure';
import { UniversalEmotionalAdapter } from '../../src/cultural-intelligence/universal-emotional-adapter';
import { CulturalContextEngine } from '../../src/global-sovereignty/cultural-context-engine';
import { EmotionalValidator } from '../../cursor/validators/emotional-validator';
import { ToneCorrectionManager } from '../../cursor/services/tone-correction-manager';

// Define test cultures and language directions
const RTL_LANGUAGES = ['ar', 'he'];
const LTR_LANGUAGES = ['en', 'es', 'ja', 'de', 'fr'];
const TEST_CULTURES = [
  { code: 'en', name: 'English', direction: 'ltr', region: 'Western', expressiveness: 0.7 },
  { code: 'ar', name: 'Arabic', direction: 'rtl', region: 'Middle Eastern', expressiveness: 0.8 },
  { code: 'he', name: 'Hebrew', direction: 'rtl', region: 'Middle Eastern', expressiveness: 0.75 },
  { code: 'ja', name: 'Japanese', direction: 'ltr', region: 'Eastern', expressiveness: 0.4 },
  { code: 'de', name: 'German', direction: 'ltr', region: 'Western', expressiveness: 0.6 },
  { code: 'fr', name: 'French', direction: 'ltr', region: 'Western', expressiveness: 0.8 },
  { code: 'es', name: 'Spanish', direction: 'ltr', region: 'Western', expressiveness: 0.85 },
];

// Sample emotional messages in multiple languages
const EMOTIONAL_MESSAGES = {
  'joy': {
    'en': "I'm absolutely thrilled with the results! This is amazing work.",
    'ar': "أنا سعيد للغاية بالنتائج! هذا عمل مذهل.",
    'he': "אני ממש מתרגש מהתוצאות! זו עבודה מדהימה.",
    'ja': "結果に大変満足しています！素晴らしい仕事です。",
    'de': "Ich bin absolut begeistert von den Ergebnissen! Das ist erstaunliche Arbeit.",
    'fr': "Je suis absolument ravi des résultats ! C'est un travail incroyable.",
    'es': "¡Estoy absolutamente encantado con los resultados! Este es un trabajo increíble."
  },
  'empathy': {
    'en': "I understand this is challenging for you. Let's work through it together.",
    'ar': "أفهم أن هذا صعب بالنسبة لك. دعنا نعمل من خلاله معًا.",
    'he': "אני מבין שזה מאתגר עבורך. בוא נעבור את זה יחד.",
    'ja': "これがあなたにとって難しいことは理解しています。一緒に取り組みましょう。",
    'de': "Ich verstehe, dass dies für Sie eine Herausforderung ist. Lassen Sie uns gemeinsam daran arbeiten.",
    'fr': "Je comprends que c'est difficile pour vous. Travaillons ensemble pour résoudre ce problème.",
    'es': "Entiendo que esto es un desafío para ti. Trabajemos juntos para resolverlo."
  },
  'concern': {
    'en': "I'm worried about the timeline. We may need to adjust our expectations.",
    'ar': "أنا قلق بشأن الجدول الزمني. قد نحتاج إلى تعديل توقعاتنا.",
    'he': "אני מודאג לגבי לוח הזמנים. ייתכן שנצטרך להתאים את הציפיות שלנו.",
    'ja': "スケジュールが心配です。期待値を調整する必要があるかもしれません。",
    'de': "Ich mache mir Sorgen um den Zeitplan. Wir müssen möglicherweise unsere Erwartungen anpassen.",
    'fr': "Je m'inquiète du calendrier. Nous devrons peut-être ajuster nos attentes.",
    'es': "Me preocupa el cronograma. Es posible que debamos ajustar nuestras expectativas."
  }
};

describe('Global Emotional Sovereignty', () => {
  let culturalAdapter: CulturalAdapter;
  let emotionalStateManager: EmotionalStateManager;
  let universalAdapter: UniversalEmotionalAdapter;
  let culturalContextEngine: CulturalContextEngine;
  let emotionalValidator: EmotionalValidator;
  let performanceMonitor: PerformanceMonitor;
  let toneCorrectionManager: ToneCorrectionManager;

  beforeEach(() => {
    performanceMonitor = new PerformanceMonitor();
    performanceMonitor.startSession();
    
    culturalAdapter = new CulturalAdapter();
    emotionalStateManager = new EmotionalStateManager();
    universalAdapter = new UniversalEmotionalAdapter();
    culturalContextEngine = new CulturalContextEngine();
    emotionalValidator = new EmotionalValidator();
    toneCorrectionManager = new ToneCorrectionManager();
  });

  afterEach(() => {
    performanceMonitor.endSession();
  });

  describe('RTL Language Support', () => {
    test('should properly handle Arabic (RTL) emotional content', () => {
      const arabicContent = EMOTIONAL_MESSAGES.joy.ar;
      const result = universalAdapter.processContent(arabicContent, 'ar');
      
      expect(result).toBeDefined();
      expect(result.direction).toBe('rtl');
      expect(result.isRTL).toBe(true);
      expect(result.emotionalTone).toBe('joy');
      expect(result.trustScore).toBeGreaterThanOrEqual(0.85);
      expect(result.culturallyAppropriate).toBe(true);
    });

    test('should properly handle Hebrew (RTL) emotional content', () => {
      const hebrewContent = EMOTIONAL_MESSAGES.empathy.he;
      const result = universalAdapter.processContent(hebrewContent, 'he');
      
      expect(result).toBeDefined();
      expect(result.direction).toBe('rtl');
      expect(result.isRTL).toBe(true);
      expect(result.emotionalTone).toBe('empathy');
      expect(result.trustScore).toBeGreaterThanOrEqual(0.9);
      expect(result.culturallyAppropriate).toBe(true);
    });

    test('should preserve emotional intent when converting between RTL and LTR', () => {
      // English (LTR) to Arabic (RTL)
      const englishContent = EMOTIONAL_MESSAGES.concern.en;
      const arabicTranslation = universalAdapter.translateWithEmotionalPreservation(
        englishContent, 
        'en', 
        'ar'
      );
      
      const englishAnalysis = universalAdapter.processContent(englishContent, 'en');
      const arabicAnalysis = universalAdapter.processContent(arabicTranslation, 'ar');
      
      expect(arabicAnalysis.emotionalTone).toBe(englishAnalysis.emotionalTone);
      expect(arabicAnalysis.emotionalIntensity).toBeCloseTo(englishAnalysis.emotionalIntensity, 1);
      expect(Math.abs(arabicAnalysis.trustScore - englishAnalysis.trustScore)).toBeLessThanOrEqual(0.05);
    });

    test('should handle bidirectional text correctly', () => {
      const mixedContent = "Let's discuss the project timeline مشروع التطوير بشكل أفضل";
      const result = universalAdapter.processContent(mixedContent, 'mixed');
      
      expect(result).toBeDefined();
      expect(result.containsMixedDirections).toBe(true);
      expect(result.segmentCount).toBeGreaterThanOrEqual(2);
      expect(result.trustScore).toBeGreaterThanOrEqual(0.8);
    });
  });

  describe('Translation Quality Scoring with Emotional Preservation', () => {
    test('should maintain emotional context during translation', () => {
      for (const emotion of Object.keys(EMOTIONAL_MESSAGES)) {
        const sourceLanguage = 'en';
        const targetLanguage = 'ja'; // English to Japanese
        
        const sourceText = EMOTIONAL_MESSAGES[emotion][sourceLanguage];
        const translatedText = universalAdapter.translateWithEmotionalPreservation(
          sourceText,
          sourceLanguage,
          targetLanguage
        );
        
        const qualityScore = universalAdapter.evaluateTranslationQuality(
          sourceText,
          translatedText,
          sourceLanguage,
          targetLanguage,
          emotion
        );
        
        expect(qualityScore.overallScore).toBeGreaterThanOrEqual(0.8);
        expect(qualityScore.emotionalPreservation).toBeGreaterThanOrEqual(0.85);
        expect(qualityScore.culturalAppropriateness).toBeGreaterThanOrEqual(0.85);
        expect(qualityScore.detectedEmotion).toBe(emotion);
      }
    });
    
    test('should adjust emotional intensity based on cultural norms', () => {
      // Test with a high expressiveness culture (Spanish) to low expressiveness (Japanese)
      const joyMessageSpanish = EMOTIONAL_MESSAGES.joy.es;
      const translatedJapanese = universalAdapter.translateWithEmotionalPreservation(
        joyMessageSpanish,
        'es',
        'ja'
      );
      
      const spanishAnalysis = universalAdapter.processContent(joyMessageSpanish, 'es');
      const japaneseAnalysis = universalAdapter.processContent(translatedJapanese, 'ja');
      
      // Spanish has higher expressiveness (0.85) than Japanese (0.4)
      // We expect the emotional intensity to be appropriately adjusted downward
      // but still maintain the same emotional tone
      expect(japaneseAnalysis.emotionalTone).toBe(spanishAnalysis.emotionalTone);
      expect(japaneseAnalysis.emotionalIntensity).toBeLessThan(spanishAnalysis.emotionalIntensity);
      expect(japaneseAnalysis.culturallyAppropriate).toBe(true);
      
      // The adjustment should be proportional to the cultural expressiveness ratio
      const expectedRatio = TEST_CULTURES.find(c => c.code === 'ja').expressiveness / 
                           TEST_CULTURES.find(c => c.code === 'es').expressiveness;
      const actualRatio = japaneseAnalysis.emotionalIntensity / spanishAnalysis.emotionalIntensity;
      
      expect(actualRatio).toBeCloseTo(expectedRatio, 1);
    });
    
    test('should detect and warn about untranslatable cultural concepts', () => {
      const culturallySpecificText = "The concept of 'wabi-sabi' is deeply ingrained in Japanese aesthetics.";
      const translationResult = universalAdapter.translateWithEmotionalPreservation(
        culturallySpecificText,
        'en',
        'ar'
      );
      
      expect(translationResult).toBeDefined();
      expect(universalAdapter.getTranslationWarnings()).toContain('untranslatable_cultural_concept');
      expect(universalAdapter.getCulturalConceptPreservationScore()).toBeLessThan(1.0);
      expect(universalAdapter.getCulturalConceptPreservationScore()).toBeGreaterThanOrEqual(0.7);
    });
  });

  describe('Cultural Context-Aware Tone Mapping', () => {
    test('should adapt tone mapping based on cultural context', () => {
      const cultures = ['en', 'ja', 'ar', 'de', 'fr'];
      const message = "I'm disappointed with the results.";
      
      const results = {};
      for (const culture of cultures) {
        results[culture] = culturalContextEngine.adaptMessageToCulture(message, culture);
      }
      
      // Direct cultures like German should be more straightforward
      expect(results.de.directness).toBeGreaterThan(results.ja.directness);
      
      // Japanese would tend to be more indirect about disappointment
      expect(results.ja.indirectness).toBeGreaterThan(results.en.indirectness);
      
      // Arabic might use more flowery language for negative feedback
      expect(results.ar.contextualPhrasing).toBeGreaterThan(results.en.contextualPhrasing);
      
      // All adaptations should maintain the core emotional intent
      const allMaintainEmotion = Object.values(results).every(r => 
        r.preservedEmotionalIntent === true && r.emotionalTone === 'disappointment'
      );
      expect(allMaintainEmotion).toBe(true);
    });
    
    test('should apply appropriate honorifics based on cultural norms', () => {
      const formalMessage = "Could you please review this document when you have time?";
      
      // Test with Japanese culture which has complex honorific system
      const japaneseAdaptation = culturalContextEngine.adaptMessageToCulture(
        formalMessage, 
        'ja', 
        { formality: 'formal', relationship: 'superior' }
      );
      
      expect(japaneseAdaptation.honorificLevel).toBeGreaterThanOrEqual(0.8);
      expect(japaneseAdaptation.formalityLevel).toBeGreaterThanOrEqual(0.9);
      expect(japaneseAdaptation.adaptedText).toContain('お');
      
      // Compare with German which has a different formality system
      const germanAdaptation = culturalContextEngine.adaptMessageToCulture(
        formalMessage, 
        'de', 
        { formality: 'formal', relationship: 'superior' }
      );
      
      expect(germanAdaptation.formalityLevel).toBeGreaterThanOrEqual(0.8);
      expect(germanAdaptation.adaptedText).toContain('Sie');
      
      // The adaptation should be appropriate to each culture
      expect(japaneseAdaptation.culturallyAppropriate).toBe(true);
      expect(germanAdaptation.culturallyAppropriate).toBe(true);
    });
    
    test('should handle idioms and metaphors appropriately across cultures', () => {
      const idiomaticMessage = "Let's not beat around the bush - we need to make a decision.";
      
      // Test adaptations across multiple cultures
      const adaptations = {};
      for (const culture of TEST_CULTURES) {
        adaptations[culture.code] = culturalContextEngine.adaptMessageToCulture(
          idiomaticMessage, 
          culture.code
        );
      }
      
      // Each culture should handle the idiom appropriately
      for (const culture of TEST_CULTURES) {
        const adaptation = adaptations[culture.code];
        
        // Should detect the idiom
        expect(adaptation.containsIdioms).toBe(true);
        
        // Should preserve the meaning
        expect(adaptation.preservedMeaning).toBe(true);
        
        // Should be culturally appropriate
        expect(adaptation.culturallyAppropriate).toBe(true);
        
        // If it replaced the idiom, it should have a cultural equivalent
        if (adaptation.idiomReplaced) {
          expect(adaptation.culturalEquivalentUsed).toBe(true);
        }
      }
    });
  });

  describe('Temporal Tone Consistency Across Cultures', () => {
    test('should maintain consistent tone across time zones and cultures', () => {
      const messageSequence = [
        "Good morning! I hope you're having a great start to your day.",
        "Let's discuss the project timeline and goals.",
        "I'm looking forward to our collaboration!"
      ];
      
      const timeZones = ['UTC-8', 'UTC', 'UTC+9'];
      const cultures = ['en', 'ja', 'ar'];
      
      // Create a mapping of tone consistency across cultures and time zones
      const consistencyMap = {};
      
      for (const culture of cultures) {
        consistencyMap[culture] = {};
        
        for (const timeZone of timeZones) {
          const adaptedSequence = messageSequence.map(message => 
            culturalContextEngine.adaptMessageToCulture(message, culture, { timeZone })
          );
          
          // Calculate tone consistency across the sequence
          const toneConsistency = culturalContextEngine.evaluateToneConsistency(adaptedSequence);
          consistencyMap[culture][timeZone] = toneConsistency;
        }
      }
      
      // Tone should be consistent regardless of time zone within each culture
      for (const culture of cultures) {
        const toneScores = Object.values(consistencyMap[culture]);
        const minScore = Math.min(...toneScores);
        const maxScore = Math.max(...toneScores);
        
        // Max variation should be minimal
        expect(maxScore - minScore).toBeLessThanOrEqual(0.1);
        
        // All scores should be above threshold
        expect(minScore).toBeGreaterThanOrEqual(0.85);
      }
    });
  });

  describe('Cross-Cultural Approval Sensitivity', () => {
    test('should adapt approval expressions based on cultural norms', () => {
      const approvalMessage = "Great job on the presentation!";
      const cultures = TEST_CULTURES.map(c => c.code);
      
      const approvalExpressions = {};
      for (const culture of cultures) {
        approvalExpressions[culture] = culturalContextEngine.adaptApprovalToCulture(
          approvalMessage, 
          culture
        );
      }
      
      // High expressiveness cultures should have more effusive approval
      expect(approvalExpressions.es.expressiveness).toBeGreaterThan(approvalExpressions.ja.expressiveness);
      expect(approvalExpressions.fr.expressiveness).toBeGreaterThan(approvalExpressions.de.expressiveness);
      
      // All should maintain the core approval sentiment
      const allMaintainApproval = Object.values(approvalExpressions).every(expr => 
        expr.sentiment === 'approval' && expr.positivity > 0.7
      );
      expect(allMaintainApproval).toBe(true);
      
      // Each should be culturally appropriate
      const allCulturallyAppropriate = Object.values(approvalExpressions).every(expr => 
        expr.culturallyAppropriate === true
      );
      expect(allCulturallyAppropriate).toBe(true);
    });
    
    test('should handle criticism with appropriate cultural sensitivity', () => {
      const criticalMessage = "This proposal needs significant improvement.";
      const cultures = TEST_CULTURES.map(c => c.code);
      
      const criticismExpressions = {};
      for (const culture of cultures) {
        criticismExpressions[culture] = culturalContextEngine.adaptCriticismToCulture(
          criticalMessage, 
          culture
        );
      }
      
      // High-context cultures like Japanese should be more indirect with criticism
      expect(criticismExpressions.ja.directness).toBeLessThan(criticismExpressions.de.directness);
      
      // All should maintain the core critical feedback while being culturally appropriate
      const allMaintainCriticism = Object.values(criticismExpressions).every(expr => 
        expr.preservesFeedback === true && expr.culturallyAppropriate === true
      );
      expect(allMaintainCriticism).toBe(true);
      
      // Trust scores should remain acceptable even with critical content
      const allTrustworthy = Object.values(criticismExpressions).every(expr => 
        expr.trustScore >= 0.8
      );
      expect(allTrustworthy).toBe(true);
    });
  });

  describe('Performance and Integration', () => {
    test('should process global emotional content within performance thresholds', () => {
      // Process a batch of messages across multiple cultures
      const startTime = performance.now();
      
      for (const emotion of Object.keys(EMOTIONAL_MESSAGES)) {
        for (const culture of TEST_CULTURES) {
          const message = EMOTIONAL_MESSAGES[emotion][culture.code];
          universalAdapter.processContent(message, culture.code);
        }
      }
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      
      // Processing should be reasonably fast (<100ms per message on average)
      const messageCount = Object.keys(EMOTIONAL_MESSAGES).length * TEST_CULTURES.length;
      const averageProcessingTime = processingTime / messageCount;
      
      expect(averageProcessingTime).toBeLessThanOrEqual(100);
    });
    
    test('should integrate with EmotionalValidator and maintain trust scores', () => {
      // Test integration with core emotional validation system
      for (const culture of TEST_CULTURES) {
        for (const emotion of Object.keys(EMOTIONAL_MESSAGES)) {
          const message = EMOTIONAL_MESSAGES[emotion][culture.code];
          
          // Process with cultural adapter
          const culturalResult = universalAdapter.processContent(message, culture.code);
          
          // Validate with emotional validator
          const validationResult = emotionalValidator.validateEmotionalTone({
            content: message,
            locale: culture.code,
            emotionalTone: culturalResult.emotionalTone,
            culturalContext: {
              culture: culture.code,
              region: culture.region,
              expressiveness: culture.expressiveness
            }
          });
          
          // Both systems should agree on the emotional assessment
          expect(validationResult.isValid).toBe(true);
          expect(validationResult.trustScore).toBeGreaterThanOrEqual(0.8);
          expect(validationResult.detectedTone).toBe(culturalResult.emotionalTone);
        }
      }
    });
  });
}); 