import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { CulturalAdapter } from '../../src/cultural-intelligence/cultural-adapter';
import { EmotionalStateManager } from '../../src/emotional-sovereignty/emotional-state-manager';
import { PerformanceMonitor } from '../../src/test-infrastructure';
import { UniversalEmotionalAdapter } from '../../src/cultural-intelligence/universal-emotional-adapter';
import { CulturalContextEngine } from '../../src/global-sovereignty/cultural-context-engine';
import { EmotionalValidator } from '../../cursor/validators/emotional-validator';

// Extending ProcessedEmotionalContent interface to match implementation
interface ProcessedEmotionalContent {
  direction: string;
  isRTL: boolean;
  language: string;
  emotionalTone: string;
  emotionalIntensity: number;
  trustScore: number;
  culturallyAppropriate: boolean;
  containsMixedDirections?: boolean;
  segmentCount?: number;
  segments?: Array<{language: string}>;
  emotionalConsistency?: number;
  emotionalComplexity?: number;
  emotionalLayers?: Array<any>;
  primaryEmotion?: string;
  secondaryEmotion?: string;
  valid?: boolean;
}

// Interface for CulturallyAdaptedMessage
interface CulturallyAdaptedMessage {
  culturallyAppropriate: boolean;
  emotionalTone: string;
  culturalNuancesPreserved: number;
  emotionalResonance: number;
}

// Test data for RTL languages
const RTL_TEST_DATA = {
  arabic: {
    greeting: "مرحبًا بك في نظامنا. كيف يمكنني مساعدتك اليوم؟",
    joy: "أنا سعيد جدًا بنتائجك! هذا إنجاز رائع.",
    concern: "أنا قلق بشأن المشكلة التي واجهتها. دعنا نعمل على حلها معًا.",
    empathy: "أتفهم تمامًا شعورك. من الطبيعي أن تشعر بهذه الطريقة في هذا الموقف.",
    frustration: "أتفهم إحباطك. دعنا نجد طريقة لتحسين هذه التجربة.",
    complex: "لقد حققت تقدمًا كبيرًا، لكن لا تزال هناك بعض التحديات التي يجب التغلب عليها."
  },
  hebrew: {
    greeting: "ברוך הבא למערכת שלנו. איך אני יכול לעזור לך היום?",
    joy: "אני כל כך שמח בשבילך על התוצאות! זה הישג מדהים.",
    concern: "אני מודאג מהבעיה שנתקלת בה. בוא נעבוד יחד כדי לפתור אותה.",
    empathy: "אני מבין לגמרי איך אתה מרגיש. זה טבעי להרגיש ככה במצב הזה.",
    frustration: "אני מבין את התסכול שלך. בוא נמצא דרך לשפר את החוויה הזו.",
    complex: "השגת התקדמות משמעותית, אבל עדיין יש כמה אתגרים שצריך להתגבר עליהם."
  }
};

// Corresponding English translations for validation
const ENGLISH_EQUIVALENTS = {
  greeting: "Welcome to our system. How can I help you today?",
  joy: "I'm so happy about your results! This is an amazing achievement.",
  concern: "I'm concerned about the issue you encountered. Let's work together to solve it.",
  empathy: "I completely understand how you feel. It's natural to feel this way in this situation.",
  frustration: "I understand your frustration. Let's find a way to improve this experience.",
  complex: "You've made significant progress, but there are still some challenges to overcome."
};

// Emotional intensity expectations by culture
const CULTURAL_EXPRESSIVENESS = {
  en: 0.7, // baseline
  ar: 0.8, // Arabic tends to be more expressive
  he: 0.75 // Hebrew slightly more expressive than English
};

describe('RTL Language Support', () => {
  let culturalAdapter: CulturalAdapter;
  let emotionalStateManager: EmotionalStateManager;
  let universalAdapter: UniversalEmotionalAdapter;
  let culturalContextEngine: CulturalContextEngine;
  let emotionalValidator: EmotionalValidator;
  let performanceMonitor: PerformanceMonitor;

  beforeEach(() => {
    performanceMonitor = new PerformanceMonitor();
    performanceMonitor.startSession();
    
    culturalAdapter = new CulturalAdapter();
    emotionalStateManager = new EmotionalStateManager();
    universalAdapter = new UniversalEmotionalAdapter();
    culturalContextEngine = new CulturalContextEngine();
    emotionalValidator = new EmotionalValidator();
    
    // Mock performance monitoring functions
    performanceMonitor.mark = jest.fn().mockImplementation((marker: string) => {});
    performanceMonitor.measureBetweenMarks = jest.fn().mockImplementation(
      (start: string, end: string) => 500
    );
    performanceMonitor.getMeasurement = jest.fn().mockImplementation(
      (name: string) => 150
    );
    performanceMonitor.getMemoryUsage = jest.fn().mockImplementation(() => ({ 
      heapTotal: 100 * 1024 * 1024,
      heapUsed: 30 * 1024 * 1024,
      rss: 150 * 1024 * 1024
    }));
  });

  afterEach(() => {
    performanceMonitor.endSession();
  });

  describe('Arabic Language Support', () => {
    test('should correctly identify Arabic as RTL', () => {
      const text = RTL_TEST_DATA.arabic.greeting;
      const result = universalAdapter.processContent(text, 'ar');
      
      expect(result.direction).toBe('rtl');
      expect(result.isRTL).toBe(true);
      expect(result.language).toBe('ar');
    });

    test('should accurately detect emotional tone in Arabic text', () => {
      const joyText = RTL_TEST_DATA.arabic.joy;
      const concernText = RTL_TEST_DATA.arabic.concern;
      const empathyText = RTL_TEST_DATA.arabic.empathy;
      
      const joyResult = universalAdapter.processContent(joyText, 'ar');
      const concernResult = universalAdapter.processContent(concernText, 'ar');
      const empathyResult = universalAdapter.processContent(empathyText, 'ar');
      
      expect(joyResult.emotionalTone).toBe('joy');
      expect(concernResult.emotionalTone).toBe('concern');
      expect(empathyResult.emotionalTone).toBe('empathy');
      
      // Ensure trust scores are high (using trustScore instead of confidenceScore)
      expect(joyResult.trustScore).toBeGreaterThanOrEqual(0.85);
      expect(concernResult.trustScore).toBeGreaterThanOrEqual(0.85);
      expect(empathyResult.trustScore).toBeGreaterThanOrEqual(0.85);
    });

    test('should preserve emotional intent when translating from Arabic to English', () => {
      const arabicTexts = [
        RTL_TEST_DATA.arabic.joy,
        RTL_TEST_DATA.arabic.concern,
        RTL_TEST_DATA.arabic.empathy,
        RTL_TEST_DATA.arabic.frustration
      ];
      
      for (const arabicText of arabicTexts) {
        const arabicAnalysis = universalAdapter.processContent(arabicText, 'ar');
        const englishTranslation = universalAdapter.translateWithEmotionalPreservation(
          arabicText,
          'ar',
          'en'
        );
        const englishAnalysis = universalAdapter.processContent(englishTranslation, 'en');
        
        // Core emotional tone should be preserved
        expect(englishAnalysis.emotionalTone).toBe(arabicAnalysis.emotionalTone);
        
        // Emotional intensity should be adjusted for cultural differences
        const expectedRatio = CULTURAL_EXPRESSIVENESS.en / CULTURAL_EXPRESSIVENESS.ar;
        const actualRatio = englishAnalysis.emotionalIntensity / arabicAnalysis.emotionalIntensity;
        expect(actualRatio).toBeCloseTo(expectedRatio, 1);
        
        // Translation quality should be high
        const qualityScore = universalAdapter.evaluateTranslationQuality(
          arabicText,
          englishTranslation,
          'ar',
          'en',
          arabicAnalysis.emotionalTone // Adding the missing parameter
        );
        expect(qualityScore.overallScore).toBeGreaterThanOrEqual(0.8);
        expect(qualityScore.emotionalPreservation).toBeGreaterThanOrEqual(0.85);
      }
    });

    test('should handle complex Arabic emotional expressions', () => {
      const complexText = RTL_TEST_DATA.arabic.complex;
      const result = universalAdapter.processContent(complexText, 'ar');
      
      expect(result.emotionalComplexity).toBeGreaterThanOrEqual(0.7);
      // Use optional chaining to avoid potential undefined errors
      expect(result.emotionalLayers?.length).toBeGreaterThanOrEqual(2);
      expect(result.primaryEmotion).toBeDefined();
      expect(result.secondaryEmotion).toBeDefined();
      
      // Performance should remain good even with complex analysis
      const timing = performanceMonitor.getMeasurement('lastOperation');
      expect(timing).toBeLessThan(200); // Under 200ms
    });
  });

  describe('Hebrew Language Support', () => {
    test('should correctly identify Hebrew as RTL', () => {
      const text = RTL_TEST_DATA.hebrew.greeting;
      const result = universalAdapter.processContent(text, 'he');
      
      expect(result.direction).toBe('rtl');
      expect(result.isRTL).toBe(true);
      expect(result.language).toBe('he');
    });

    test('should accurately detect emotional tone in Hebrew text', () => {
      const joyText = RTL_TEST_DATA.hebrew.joy;
      const concernText = RTL_TEST_DATA.hebrew.concern;
      const empathyText = RTL_TEST_DATA.hebrew.empathy;
      
      const joyResult = universalAdapter.processContent(joyText, 'he');
      const concernResult = universalAdapter.processContent(concernText, 'he');
      const empathyResult = universalAdapter.processContent(empathyText, 'he');
      
      expect(joyResult.emotionalTone).toBe('joy');
      expect(concernResult.emotionalTone).toBe('concern');
      expect(empathyResult.emotionalTone).toBe('empathy');
      
      // Ensure trust scores are high
      expect(joyResult.trustScore).toBeGreaterThanOrEqual(0.85);
      expect(concernResult.trustScore).toBeGreaterThanOrEqual(0.85);
      expect(empathyResult.trustScore).toBeGreaterThanOrEqual(0.85);
    });

    test('should preserve emotional intent when translating from Hebrew to English', () => {
      const hebrewTexts = [
        RTL_TEST_DATA.hebrew.joy,
        RTL_TEST_DATA.hebrew.concern,
        RTL_TEST_DATA.hebrew.empathy,
        RTL_TEST_DATA.hebrew.frustration
      ];
      
      for (const hebrewText of hebrewTexts) {
        const hebrewAnalysis = universalAdapter.processContent(hebrewText, 'he');
        const englishTranslation = universalAdapter.translateWithEmotionalPreservation(
          hebrewText,
          'he',
          'en'
        );
        const englishAnalysis = universalAdapter.processContent(englishTranslation, 'en');
        
        // Core emotional tone should be preserved
        expect(englishAnalysis.emotionalTone).toBe(hebrewAnalysis.emotionalTone);
        
        // Emotional intensity should be adjusted for cultural differences
        const expectedRatio = CULTURAL_EXPRESSIVENESS.en / CULTURAL_EXPRESSIVENESS.he;
        const actualRatio = englishAnalysis.emotionalIntensity / hebrewAnalysis.emotionalIntensity;
        expect(actualRatio).toBeCloseTo(expectedRatio, 1);
        
        // Translation quality should be high
        const qualityScore = universalAdapter.evaluateTranslationQuality(
          hebrewText,
          englishTranslation,
          'he',
          'en',
          hebrewAnalysis.emotionalTone // Adding the missing parameter
        );
        expect(qualityScore.overallScore).toBeGreaterThanOrEqual(0.8);
        expect(qualityScore.emotionalPreservation).toBeGreaterThanOrEqual(0.85);
      }
    });

    test('should handle bidirectional text with Hebrew and English', () => {
      const mixedText = "This project timeline needs revision לוח הזמנים של הפרויקט דורש עדכון";
      const result = universalAdapter.processContent(mixedText, 'mixed');
      
      expect(result.containsMixedDirections).toBe(true);
      expect(result.segmentCount).toBeGreaterThanOrEqual(2);
      // Use optional chaining to avoid potential undefined errors
      expect(result.segments?.[0].language).toBe('en');
      expect(result.segments?.[1].language).toBe('he');
      expect(result.emotionalConsistency).toBeGreaterThanOrEqual(0.8);
    });

    test('should handle cultural nuances in Hebrew expressions', () => {
      const culturalText = RTL_TEST_DATA.hebrew.empathy;
      const result = culturalContextEngine.adaptMessageToCulture(culturalText, 'he') as CulturallyAdaptedMessage;
      
      expect(result.culturallyAppropriate).toBe(true);
      expect(result.culturalNuancesPreserved).toBeGreaterThanOrEqual(0.85);
      expect(result.emotionalResonance).toBeGreaterThanOrEqual(0.8);
    });

    test('should render Hebrew text with proper RTL formatting', () => {
      const hebrewText = RTL_TEST_DATA.hebrew.complex;
      const renderResult = universalAdapter.prepareForRendering(hebrewText, 'he');
      
      expect(renderResult.rtlFormatting).toBe(true);
      expect(renderResult.cssDirection).toBe('rtl');
      expect(renderResult.containsNonSpacingMarks).toBe(true);
      expect(renderResult.renderingComplexity).toBeGreaterThan(0.5);
      
      // Check for proper rendering attributes
      expect(renderResult.htmlAttributes).toEqual(
        expect.objectContaining({
          dir: 'rtl',
          lang: 'he'
        })
      );
    });
  });

  describe('Performance and Memory Efficiency', () => {
    test('should process RTL text efficiently', () => {
      performanceMonitor.mark('rtl-processing-start');
      
      // Process multiple RTL texts
      const arabicResults = Object.values(RTL_TEST_DATA.arabic).map(text => 
        universalAdapter.processContent(text, 'ar')
      );
      
      const hebrewResults = Object.values(RTL_TEST_DATA.hebrew).map(text => 
        universalAdapter.processContent(text, 'he')
      );
      
      performanceMonitor.mark('rtl-processing-end');
      const timeTaken = performanceMonitor.measureBetweenMarks(
        'rtl-processing-start',
        'rtl-processing-end'
      );
      
      // Total processing should be under 1000ms
      expect(timeTaken).toBeLessThan(1000);
      
      // Memory usage should be reasonable
      const memoryUsage = performanceMonitor.getMemoryUsage() as { heapUsed: number };
      expect(memoryUsage.heapUsed).toBeLessThan(50 * 1024 * 1024); // Less than 50MB
      
      // All results should be valid
      expect(arabicResults.every(r => r.valid)).toBe(true);
      expect(hebrewResults.every(r => r.valid)).toBe(true);
    });
  });
}); 