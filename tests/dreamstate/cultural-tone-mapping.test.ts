import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { CulturalAdapter } from '../../src/cultural-intelligence/cultural-adapter';
import { PerformanceMonitor } from '../../src/test-infrastructure';
import { UniversalEmotionalAdapter } from '../../src/cultural-intelligence/universal-emotional-adapter';
import { CulturalContextEngine, AdaptationOptions, CulturallyAdaptedMessage } from '../../src/global-sovereignty/cultural-context-engine';

// Test messages for different tones
const TEST_MESSAGES = {
  direct: {
    feedback: "Your presentation needs improvement. The data visualization is confusing.",
    request: "I need this report by tomorrow morning.",
    disagreement: "I disagree with your approach. We should try a different strategy."
  },
  neutral: {
    feedback: "I think we could enhance the presentation by making the data visualization clearer.",
    request: "Would it be possible to have this report by tomorrow morning?",
    disagreement: "I have a different perspective on this approach. Perhaps we could explore alternatives."
  },
  indirect: {
    feedback: "The presentation is good, though the data visualization might benefit from some clarity.",
    request: "I was wondering if you might have time to complete this report by tomorrow morning?",
    disagreement: "I see your point, though I'm also thinking about some alternative approaches that might work."
  }
};

// Culture-specific expectations
const CULTURAL_TONE_EXPECTATIONS = {
  japanese: {
    directness: 'low',
    honorifics: 'high',
    contextualPhrasing: 'high',
    preferredTone: 'indirect'
  },
  german: {
    directness: 'high',
    honorifics: 'medium',
    contextualPhrasing: 'low',
    preferredTone: 'direct'
  },
  american: {
    directness: 'medium-high',
    honorifics: 'low',
    contextualPhrasing: 'medium',
    preferredTone: 'neutral'
  },
  arabic: {
    directness: 'medium',
    honorifics: 'high',
    contextualPhrasing: 'high',
    preferredTone: 'indirect'
  }
};

// Business context examples
const BUSINESS_CONTEXTS = {
  formal: {
    relationship: 'superior' as const,
    formality: 'formal' as const,
    context: 'business' as const
  },
  casual: {
    relationship: 'peer' as const,
    formality: 'casual' as const,
    context: 'social' as const
  },
  academic: {
    relationship: 'superior' as const,
    formality: 'formal' as const,
    context: 'academic' as const
  }
};

describe('Cultural Context-Aware Tone Mapping', () => {
  let culturalAdapter: CulturalAdapter;
  let universalAdapter: UniversalEmotionalAdapter;
  let culturalContextEngine: CulturalContextEngine;
  let performanceMonitor: PerformanceMonitor;

  beforeEach(() => {
    performanceMonitor = new PerformanceMonitor();
    performanceMonitor.startSession();
    
    culturalAdapter = new CulturalAdapter();
    universalAdapter = new UniversalEmotionalAdapter();
    culturalContextEngine = new CulturalContextEngine();
  });

  afterEach(() => {
    performanceMonitor.endSession();
  });

  describe('Cultural Directness Adaptation', () => {
    test('should adapt message directness based on cultural norms', () => {
      const directMessage = TEST_MESSAGES.direct.feedback;
      
      // Adapt to different cultures
      const japaneseAdaptation = culturalContextEngine.adaptMessageToCulture(
        directMessage, 
        'ja'
      );
      
      const germanAdaptation = culturalContextEngine.adaptMessageToCulture(
        directMessage, 
        'de'
      );
      
      // Japanese should reduce directness
      expect(japaneseAdaptation.directness).toBeLessThan(0.5);
      expect(japaneseAdaptation.indirectness).toBeGreaterThan(0.5);
      
      // German should maintain directness
      expect(germanAdaptation.directness).toBeGreaterThan(0.6);
      expect(germanAdaptation.indirectness).toBeLessThan(0.4);
      
      // The adapted texts should be different
      expect(japaneseAdaptation.adaptedText).not.toEqual(directMessage);
      expect(japaneseAdaptation.adaptedText).not.toEqual(germanAdaptation.adaptedText);
      
      // Emotional intent should be preserved
      expect(japaneseAdaptation.preservedEmotionalIntent).toBe(true);
      expect(germanAdaptation.preservedEmotionalIntent).toBe(true);
      expect(japaneseAdaptation.emotionalTone).toEqual(germanAdaptation.emotionalTone);
    });
    
    test('should apply relationship-based adaptations appropriately', () => {
      const requestMessage = TEST_MESSAGES.neutral.request;
      
      // Adapt to Japanese culture with different relationships
      const superiorJapanese = culturalContextEngine.adaptMessageToCulture(
        requestMessage, 
        'ja', 
        { relationship: 'superior', formality: 'formal' }
      );
      
      const peerJapanese = culturalContextEngine.adaptMessageToCulture(
        requestMessage, 
        'ja', 
        { relationship: 'peer', formality: 'casual' }
      );
      
      // Superior relationship should have higher honorific level
      expect(superiorJapanese.honorificLevel).toBeGreaterThan(peerJapanese.honorificLevel);
      expect(superiorJapanese.formalityLevel).toBeGreaterThan(peerJapanese.formalityLevel);
      
      // Both should be culturally appropriate
      expect(superiorJapanese.culturallyAppropriate).toBe(true);
      expect(peerJapanese.culturallyAppropriate).toBe(true);
    });
  });

  describe('Context-Based Tone Mapping', () => {
    test('should adapt tone based on business context', () => {
      const feedbackMessage = TEST_MESSAGES.neutral.feedback;
      
      // Apply different business contexts to same culture
      const formalBusinessArabic = culturalContextEngine.adaptMessageToCulture(
        feedbackMessage,
        'ar',
        BUSINESS_CONTEXTS.formal
      );
      
      const casualSocialArabic = culturalContextEngine.adaptMessageToCulture(
        feedbackMessage,
        'ar',
        BUSINESS_CONTEXTS.casual
      );
      
      // Formal business context should have higher formality
      expect(formalBusinessArabic.formalityLevel).toBeGreaterThan(casualSocialArabic.formalityLevel);
      
      // Both should preserve the emotional intent
      expect(formalBusinessArabic.preservedEmotionalIntent).toBe(true);
      expect(casualSocialArabic.preservedEmotionalIntent).toBe(true);
      expect(formalBusinessArabic.emotionalTone).toEqual(casualSocialArabic.emotionalTone);
      
      // Academic context should have high formality
      const academicArabic = culturalContextEngine.adaptMessageToCulture(
        feedbackMessage,
        'ar',
        BUSINESS_CONTEXTS.academic
      );
      
      expect(academicArabic.formalityLevel).toBeGreaterThanOrEqual(formalBusinessArabic.formalityLevel);
    });
  });

  describe('Approval and Criticism Adaptation', () => {
    test('should adapt approval expressions across cultures', () => {
      const approvalMessage = "Great job on the presentation! The data visualization was excellent.";
      
      // Adapt approval to different cultures
      const japaneseApproval = culturalContextEngine.adaptApprovalToCulture(
        approvalMessage,
        'ja'
      );
      
      const americanApproval = culturalContextEngine.adaptApprovalToCulture(
        approvalMessage,
        'en-US'
      );
      
      // Japanese approval should be more reserved
      expect(japaneseApproval.expressiveness).toBeLessThan(americanApproval.expressiveness);
      
      // Both should be culturally appropriate
      expect(japaneseApproval.culturallyAppropriate).toBe(true);
      expect(americanApproval.culturallyAppropriate).toBe(true);
      
      // Both should have approval sentiment
      expect(japaneseApproval.sentiment).toBe('approval');
      expect(americanApproval.sentiment).toBe('approval');
    });
    
    test('should adapt criticism appropriately across cultures', () => {
      const criticismMessage = "The presentation had some issues. The data visualization was confusing.";
      
      // Adapt criticism to different cultures
      const japaneseCriticism = culturalContextEngine.adaptCriticismToCulture(
        criticismMessage,
        'ja'
      );
      
      const germanCriticism = culturalContextEngine.adaptCriticismToCulture(
        criticismMessage,
        'de'
      );
      
      // Japanese criticism should be more indirect
      expect(japaneseCriticism.directness).toBeLessThan(germanCriticism.directness);
      expect(japaneseCriticism.indirectness).toBeGreaterThan(germanCriticism.indirectness);
      
      // Japanese criticism should use contextual softening
      expect(japaneseCriticism.contextualSoftening).toBe(true);
      
      // Both should preserve feedback intent
      expect(japaneseCriticism.preservesFeedback).toBe(true);
      expect(germanCriticism.preservesFeedback).toBe(true);
    });
  });

  describe('Cultural Idiom Handling', () => {
    test('should handle idioms appropriately across cultures', () => {
      const idiomaticMessage = "Let's not beat around the bush. We need to hit the ground running on this project.";
      
      // Adapt to different cultures
      const japaneseAdaptation = culturalContextEngine.adaptMessageToCulture(
        idiomaticMessage,
        'ja'
      );
      
      const arabicAdaptation = culturalContextEngine.adaptMessageToCulture(
        idiomaticMessage,
        'ar'
      );
      
      // Should detect idioms
      expect(japaneseAdaptation.containsIdioms).toBe(true);
      
      // Should replace with cultural equivalents
      expect(japaneseAdaptation.idiomReplaced).toBe(true);
      expect(japaneseAdaptation.culturalEquivalentUsed).toBe(true);
      
      // Should preserve meaning
      expect(japaneseAdaptation.preservedMeaning).toBe(true);
      expect(arabicAdaptation.preservedMeaning).toBe(true);
      
      // Adapted text should be different from original
      expect(japaneseAdaptation.adaptedText).not.toEqual(idiomaticMessage);
      expect(arabicAdaptation.adaptedText).not.toEqual(idiomaticMessage);
    });
  });

  describe('Tone Consistency Evaluation', () => {
    test('should evaluate tone consistency across message sequences', () => {
      // Create a sequence of messages
      const messageSequence1: CulturallyAdaptedMessage[] = [
        culturalContextEngine.adaptMessageToCulture("Hello, how are you today?", 'en'),
        culturalContextEngine.adaptMessageToCulture("I'm doing well, thank you for asking!", 'en'),
        culturalContextEngine.adaptMessageToCulture("That's great to hear. Let's discuss the project.", 'en')
      ];
      
      // Create a sequence with tone inconsistency
      const messageSequence2: CulturallyAdaptedMessage[] = [
        culturalContextEngine.adaptMessageToCulture("Hello, how are you today?", 'en'),
        culturalContextEngine.adaptMessageToCulture("I'm extremely disappointed with your performance!", 'en'),
        culturalContextEngine.adaptMessageToCulture("Let's celebrate your achievements!", 'en')
      ];
      
      // Evaluate tone consistency
      const consistency1 = culturalContextEngine.evaluateToneConsistency(messageSequence1);
      const consistency2 = culturalContextEngine.evaluateToneConsistency(messageSequence2);
      
      // First sequence should be more consistent
      expect(consistency1).toBeGreaterThan(consistency2);
      expect(consistency1).toBeGreaterThanOrEqual(0.8);
      expect(consistency2).toBeLessThan(0.8);
    });
  });

  describe('Cross-Cultural Performance', () => {
    test('should adapt messages efficiently across multiple cultures', () => {
      const testMessage = "We need to discuss the project timeline and address some concerns.";
      const cultures = ['ja', 'de', 'en-US', 'ar', 'fr', 'es'];
      const contexts = [
        BUSINESS_CONTEXTS.formal,
        BUSINESS_CONTEXTS.casual,
        BUSINESS_CONTEXTS.academic
      ];
      
      // Track performance for bulk adaptations
      const startTime = Date.now();
      
      // Process adaptations for all culture and context combinations
      const adaptations = [];
      for (const culture of cultures) {
        for (const context of contexts) {
          const adaptation = culturalContextEngine.adaptMessageToCulture(
            testMessage,
            culture,
            context
          );
          adaptations.push(adaptation);
        }
      }
      
      const endTime = Date.now();
      const processingTime = endTime - startTime;
      
      // Should have the right number of adaptations
      expect(adaptations.length).toBe(cultures.length * contexts.length);
      
      // All adaptations should be culturally appropriate
      expect(adaptations.every(a => a.culturallyAppropriate)).toBe(true);
      
      // All adaptations should preserve emotional intent
      expect(adaptations.every(a => a.preservedEmotionalIntent)).toBe(true);
      
      // Processing time should be reasonable (less than 1000ms)
      expect(processingTime).toBeLessThan(1000);
    });
  });
}); 