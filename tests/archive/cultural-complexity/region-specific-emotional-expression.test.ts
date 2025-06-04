/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Region-Specific Emotional Expression Pattern Tests"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Test emotional expression patterns specific to cultural regions
 */

import { CulturalEmotionalAdapter } from '../../src/cultural-intelligence/cultural-emotional-adapter';
import { CulturalContextEngine } from '../../src/global-sovereignty/cultural-context-engine';
import { PerformanceMonitor } from '../../cursor/services/performance-monitor';
import { RegionExpressionManager } from '../../src/cultural-intelligence/region-expression-manager';

describe('Region-Specific Emotional Expression Patterns', () => {
  let expressionManager: RegionExpressionManager;
  let culturalAdapter: CulturalEmotionalAdapter;
  let contextEngine: CulturalContextEngine;
  let performanceMonitor: PerformanceMonitor;

  beforeEach(() => {
    expressionManager = new RegionExpressionManager({
      regionSpecificity: 'high',
      culturalAccuracy: true,
      expressionCalibration: 'precise'
    });
    
    culturalAdapter = new CulturalEmotionalAdapter({
      culturalSensitivity: 'high',
      preserveAuthenticity: true,
      adaptationDepth: 'comprehensive'
    });
    
    contextEngine = new CulturalContextEngine({
      contextualization: 'deep',
      regionalAwareness: true,
      socialHierarchyAwareness: true
    });
    
    performanceMonitor = PerformanceMonitor.getInstance();
  });

  describe('Regional Expression Pattern Detection', () => {
    test('should identify region-specific emotional expression patterns', async () => {
      performanceMonitor.startSession('regional-expression-detection');
      
      const regionPatterns = [
        { region: 'east_asia', emotion: 'pride', expectedPattern: 'collective_achievement' },
        { region: 'northern_europe', emotion: 'happiness', expectedPattern: 'reserved_contentment' },
        { region: 'latin_america', emotion: 'excitement', expectedPattern: 'expressive_enthusiasm' },
        { region: 'middle_east', emotion: 'respect', expectedPattern: 'honorific_deference' },
        { region: 'south_asia', emotion: 'gratitude', expectedPattern: 'humble_appreciation' },
        { region: 'africa_subsaharan', emotion: 'celebration', expectedPattern: 'communal_joy' },
        { region: 'eastern_europe', emotion: 'resilience', expectedPattern: 'stoic_strength' },
        { region: 'oceania', emotion: 'welcome', expectedPattern: 'inclusive_openness' }
      ];

      for (const pattern of regionPatterns) {
        const result = await expressionManager.detectExpressionPattern(
          pattern.emotion, 
          pattern.region
        );
        
        expect(result).toMatchObject({
          detectedPattern: expect.any(String),
          confidence: expect.any(Number),
          culturalSignificance: expect.any(String),
          regionalVariation: expect.any(Object)
        });
        
        expect(result.detectedPattern).toBe(pattern.expectedPattern);
        expect(result.confidence).toBeGreaterThan(0.85);
      }
      
      const sessionDuration = performanceMonitor.endSession();
      expect(sessionDuration).toBeLessThan(2000); // Under 2 seconds
    });
    
    test('should detect subregional variations within broader cultural regions', async () => {
      const subregionalPatterns = [
        { region: 'east_asia', subregion: 'japan', emotion: 'apology', expectedVariation: 'ritualized_remorse' },
        { region: 'east_asia', subregion: 'china', emotion: 'apology', expectedVariation: 'face_preservation' },
        { region: 'east_asia', subregion: 'korea', emotion: 'apology', expectedVariation: 'hierarchical_contrition' },
        
        { region: 'europe', subregion: 'mediterranean', emotion: 'affection', expectedVariation: 'tactile_warmth' },
        { region: 'europe', subregion: 'nordic', emotion: 'affection', expectedVariation: 'practical_care' },
        { region: 'europe', subregion: 'eastern', emotion: 'affection', expectedVariation: 'depth_of_connection' },
        
        { region: 'middle_east', subregion: 'gulf', emotion: 'hospitality', expectedVariation: 'honor_based_generosity' },
        { region: 'middle_east', subregion: 'levant', emotion: 'hospitality', expectedVariation: 'abundant_offering' }
      ];
      
      for (const pattern of subregionalPatterns) {
        const result = await expressionManager.detectSubregionalVariation(
          pattern.emotion,
          pattern.region,
          pattern.subregion
        );
        
        expect(result).toMatchObject({
          variation: expect.any(String),
          primaryPattern: expect.any(String),
          distinctiveness: expect.any(Number),
          culturalContext: expect.any(Object)
        });
        
        expect(result.variation).toBe(pattern.expectedVariation);
        expect(result.distinctiveness).toBeGreaterThan(0.4); // Must be significantly distinct
      }
    });
  });

  describe('Regional Expression Context Application', () => {
    test('should apply region-specific emotional contexts correctly', async () => {
      const expressionContexts = [
        { 
          region: 'east_asia', 
          scenario: 'business_success', 
          baseEmotion: 'pride',
          expectedAttributes: {
            collectiveAcknowledgment: true,
            teamReferencing: true,
            modestIntensity: true
          }
        },
        { 
          region: 'latin_america', 
          scenario: 'business_success', 
          baseEmotion: 'pride',
          expectedAttributes: {
            personalExpression: true,
            expressiveLanguage: true,
            relationshipReinforcement: true
          }
        },
        { 
          region: 'northern_europe', 
          scenario: 'business_success', 
          baseEmotion: 'pride',
          expectedAttributes: {
            factualFocus: true,
            achievementMetrics: true,
            reservedExpression: true
          }
        }
      ];
      
      for (const context of expressionContexts) {
        const result = await contextEngine.applyRegionalEmotionalContext(
          context.baseEmotion,
          context.scenario,
          context.region
        );
        
        expect(result).toMatchObject({
          adaptedExpression: expect.any(String),
          expressionAttributes: expect.any(Object),
          culturalAuthenticity: expect.any(Number),
          appropriatenessScore: expect.any(Number)
        });
        
        // Check for region-specific attributes
        for (const [key, value] of Object.entries(context.expectedAttributes)) {
          expect(result.expressionAttributes[key]).toBe(value);
        }
        
        expect(result.culturalAuthenticity).toBeGreaterThan(0.8);
        expect(result.appropriatenessScore).toBeGreaterThan(0.85);
      }
    });
  });

  describe('Regional Expression Adaptation', () => {
    test('should adapt emotional expressions for region-specific appropriateness', async () => {
      performanceMonitor.startSession('regional-adaptation');
      
      const adaptationScenarios = [
        {
          emotion: 'enthusiasm',
          intensity: 0.9,
          sourceRegion: 'north_america',
          targetRegion: 'east_asia',
          businessContext: true
        },
        {
          emotion: 'disagreement',
          intensity: 0.8,
          sourceRegion: 'northern_europe',
          targetRegion: 'southeast_asia',
          businessContext: true
        },
        {
          emotion: 'gratitude',
          intensity: 0.7,
          sourceRegion: 'middle_east',
          targetRegion: 'western_europe',
          businessContext: false
        }
      ];
      
      for (const scenario of adaptationScenarios) {
        const result = await expressionManager.adaptRegionalExpression(
          scenario.emotion,
          scenario.intensity,
          scenario.sourceRegion,
          scenario.targetRegion,
          scenario.businessContext
        );
        
        expect(result).toMatchObject({
          adaptedEmotion: expect.any(String),
          adaptedIntensity: expect.any(Number),
          culturallyAppropriate: true,
          adaptationDetails: expect.any(Object)
        });
        
        // Verify region-specific adaptation
        if (scenario.targetRegion === 'east_asia') {
          expect(result.adaptedIntensity).toBeLessThan(scenario.intensity);
          expect(result.adaptationDetails.collectiveFraming).toBe(true);
        }
        
        if (scenario.emotion === 'disagreement' && scenario.targetRegion === 'southeast_asia') {
          expect(result.adaptedEmotion).not.toBe('disagreement');
          expect(result.adaptationDetails.indirectApproach).toBe(true);
        }
        
        // Business context should affect adaptation
        if (scenario.businessContext) {
          expect(result.adaptationDetails.formalityLevel).toBeGreaterThan(0.7);
        }
      }
      
      const sessionDuration = performanceMonitor.endSession();
      expect(sessionDuration).toBeLessThan(3000); // Under 3 seconds
    });
    
    test('should preserve core emotional intent across regional adaptations', async () => {
      const coreEmotions = ['joy', 'concern', 'excitement', 'gratitude', 'interest'];
      const regions = ['east_asia', 'south_asia', 'middle_east', 'africa_subsaharan', 'latin_america', 'northern_europe'];
      
      for (const emotion of coreEmotions) {
        const preservationScores = [];
        
        for (const targetRegion of regions) {
          const result = await expressionManager.preserveCoreEmotionalIntent(
            emotion,
            'global_standard',
            targetRegion
          );
          
          expect(result).toMatchObject({
            originalEmotion: emotion,
            adaptedExpression: expect.any(String),
            corePreservation: expect.any(Number),
            emotionalEssence: expect.any(String)
          });
          
          preservationScores.push(result.corePreservation);
          expect(result.corePreservation).toBeGreaterThan(0.7);
          expect(result.emotionalEssence).toContain(emotion);
        }
        
        // Average preservation across regions should be high
        const avgPreservation = preservationScores.reduce((sum, score) => sum + score, 0) / preservationScores.length;
        expect(avgPreservation).toBeGreaterThan(0.8);
      }
    });
  });

  describe('Integration Tests', () => {
    test('should integrate region-specific patterns with cultural adaptation', async () => {
      const integrationScenarios = [
        {
          emotion: 'pride',
          region: 'east_asia',
          culture: 'japanese',
          context: 'professional_achievement'
        },
        {
          emotion: 'joy',
          region: 'latin_america',
          culture: 'brazilian',
          context: 'celebration'
        },
        {
          emotion: 'frustration',
          region: 'northern_europe',
          culture: 'swedish',
          context: 'project_delay'
        }
      ];
      
      for (const scenario of integrationScenarios) {
        // First get region-specific pattern
        const regionalPattern = await expressionManager.detectExpressionPattern(
          scenario.emotion,
          scenario.region
        );
        
        // Then apply cultural adaptation
        const culturalResult = await culturalAdapter.adaptEmotionalExpression(
          {
            baseEmotion: scenario.emotion,
            intensity: 0.8,
            context: scenario.context
          },
          scenario.culture
        );
        
        // Now integrate both with context engine
        const integratedResult = await contextEngine.integrateRegionalAndCultural(
          scenario.emotion,
          scenario.region,
          scenario.culture,
          scenario.context
        );
        
        expect(integratedResult).toMatchObject({
          expression: expect.any(String),
          intensity: expect.any(Number),
          regionalInfluence: expect.any(Number),
          culturalInfluence: expect.any(Number),
          contextualAppropriateness: expect.any(Number)
        });
        
        // The integrated result should reflect both regional and cultural influences
        expect(integratedResult.regionalInfluence).toBeGreaterThan(0.4);
        expect(integratedResult.culturalInfluence).toBeGreaterThan(0.4);
        expect(integratedResult.contextualAppropriateness).toBeGreaterThan(0.85);
      }
    });
  });
}); 