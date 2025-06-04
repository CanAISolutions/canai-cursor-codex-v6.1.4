/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Cross-Cultural Approval Sensitivity Tests"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Test how approval expressions and requirements vary across different cultures
 */

import { CrossCulturalApprovalValidator } from '../../src/cultural-intelligence/cross-cultural-approval-validator';
import { CulturalContextEngine } from '../../src/global-sovereignty/cultural-context-engine';
import { PerformanceMonitor } from '../../cursor/services/performance-monitor';
import { TrustMetricsCollector } from '../../src/cursor/trust/trust-metrics-collector';

describe('Cross-Cultural Approval Sensitivity', () => {
  let approvalValidator: CrossCulturalApprovalValidator;
  let contextEngine: CulturalContextEngine;
  let performanceMonitor: PerformanceMonitor;
  let trustCollector: TrustMetricsCollector;

  beforeEach(() => {
    approvalValidator = new CrossCulturalApprovalValidator({
      sensitivityLevel: 'high',
      culturalRespect: true,
      adaptiveValidation: true
    });
    
    contextEngine = new CulturalContextEngine();
    
    performanceMonitor = PerformanceMonitor.getInstance();
    trustCollector = new TrustMetricsCollector();
  });

  describe('Approval Expression Detection', () => {
    test('should detect explicit approval expressions across cultures', async () => {
      performanceMonitor.startSession('explicit-approval-detection');
      
      const approvalScenarios = [
        {
          culture: 'japanese',
          approvalText: 'はい、それで結構です。',
          expectedStrength: 'moderate',
          expectedConfidence: 0.85
        },
        {
          culture: 'japanese',
          approvalText: 'ぜひお願いします。',
          expectedStrength: 'strong',
          expectedConfidence: 0.9
        },
        {
          culture: 'american',
          approvalText: 'Yes, that works for me.',
          expectedStrength: 'moderate',
          expectedConfidence: 0.9
        },
        {
          culture: 'american',
          approvalText: 'Absolutely, go ahead!',
          expectedStrength: 'strong',
          expectedConfidence: 0.95
        },
        {
          culture: 'german',
          approvalText: 'Ja, das ist in Ordnung.',
          expectedStrength: 'moderate',
          expectedConfidence: 0.9
        },
        {
          culture: 'german',
          approvalText: 'Definitiv, machen Sie weiter.',
          expectedStrength: 'strong',
          expectedConfidence: 0.95
        },
        {
          culture: 'arabic',
          approvalText: 'نعم، هذا جيد.',
          expectedStrength: 'moderate',
          expectedConfidence: 0.85
        },
        {
          culture: 'arabic',
          approvalText: 'بالتأكيد، من فضلك استمر.',
          expectedStrength: 'strong',
          expectedConfidence: 0.9
        }
      ];
      
      for (const scenario of approvalScenarios) {
        const result = await approvalValidator.detectApprovalExpression(
          scenario.approvalText,
          scenario.culture
        );
        
        expect(result).toMatchObject({
          isApproval: true,
          approvalStrength: expect.any(String),
          confidence: expect.any(Number),
          culturalContext: expect.any(Object)
        });
        
        expect(result.approvalStrength).toBe(scenario.expectedStrength);
        expect(result.confidence).toBeGreaterThanOrEqual(scenario.expectedConfidence);
      }
      
      const sessionDuration = performanceMonitor.endSession();
      expect(sessionDuration).toBeLessThan(2000); // Under 2 seconds
    });
    
    test('should detect implicit approval expressions across cultures', async () => {
      const implicitScenarios = [
        {
          culture: 'japanese',
          approvalText: 'よろしいかと思います。',  // "I think it would be fine"
          expectedStrength: 'moderate',
          expectedImplicit: true
        },
        {
          culture: 'british',
          approvalText: 'That seems reasonable.',
          expectedStrength: 'moderate',
          expectedImplicit: true
        },
        {
          culture: 'korean',
          approvalText: '괜찮을 것 같아요.',  // "It seems like it would be okay"
          expectedStrength: 'moderate',
          expectedImplicit: true
        },
        {
          culture: 'finnish',
          approvalText: 'Kuulostaa järkevältä.',  // "Sounds reasonable"
          expectedStrength: 'moderate',
          expectedImplicit: true
        }
      ];
      
      for (const scenario of implicitScenarios) {
        const result = await approvalValidator.detectApprovalExpression(
          scenario.approvalText,
          scenario.culture
        );
        
        expect(result).toMatchObject({
          isApproval: true,
          approvalStrength: expect.any(String),
          isImplicit: true,
          confidence: expect.any(Number)
        });
        
        expect(result.approvalStrength).toBe(scenario.expectedStrength);
        expect(result.isImplicit).toBe(scenario.expectedImplicit);
        
        // Implicit approvals should have lower confidence
        expect(result.confidence).toBeLessThan(0.9);
        expect(result.confidence).toBeGreaterThan(0.6);
      }
    });
  });

  describe('Cultural Approval Requirements', () => {
    test('should identify culture-specific approval requirements', async () => {
      const approvalRequirements = [
        {
          culture: 'japanese',
          context: 'business_decision',
          expectedRequirements: {
            explicitness: 'moderate',
            formality: 'high',
            hierarchyAcknowledgment: true,
            groupConsensus: true
          }
        },
        {
          culture: 'american',
          context: 'business_decision',
          expectedRequirements: {
            explicitness: 'high',
            formality: 'moderate',
            individualDecision: true,
            writtenConfirmation: true
          }
        },
        {
          culture: 'german',
          context: 'business_decision',
          expectedRequirements: {
            explicitness: 'high',
            formality: 'high',
            detailedSpecification: true,
            directCommunication: true
          }
        },
        {
          culture: 'arabic',
          context: 'business_decision',
          expectedRequirements: {
            explicitness: 'moderate',
            formality: 'high',
            relationshipAcknowledgment: true,
            respectfulLanguage: true
          }
        }
      ];
      
      for (const scenario of approvalRequirements) {
        const result = await approvalValidator.getApprovalRequirements(
          scenario.culture,
          scenario.context
        );
        
        expect(result).toMatchObject({
          explicitness: expect.any(String),
          formality: expect.any(String),
          requirements: expect.any(Object),
          culturalNotes: expect.any(Array)
        });
        
        expect(result.explicitness).toBe(scenario.expectedRequirements.explicitness);
        expect(result.formality).toBe(scenario.expectedRequirements.formality);
        
        // Check for culture-specific requirements
        for (const [key, value] of Object.entries(scenario.expectedRequirements)) {
          if (key !== 'explicitness' && key !== 'formality') {
            expect(result.requirements[key]).toBe(value);
          }
        }
      }
    });
  });

  describe('Approval Validation', () => {
    test('should validate approval based on cultural standards', async () => {
      const validationScenarios = [
        {
          culture: 'japanese',
          context: 'business_decision',
          approvalText: 'はい、承知いたしました。進めてください。',  // "Yes, I understand. Please proceed."
          expectedValidity: true
        },
        {
          culture: 'japanese',
          context: 'business_decision',
          approvalText: 'まあ、いいんじゃない？',  // "Well, isn't it fine?" (too casual)
          expectedValidity: false
        },
        {
          culture: 'american',
          context: 'business_decision',
          approvalText: 'Yes, I approve this decision. Please proceed.',
          expectedValidity: true
        },
        {
          culture: 'american',
          context: 'business_decision',
          approvalText: 'Sounds interesting.',  // Too vague
          expectedValidity: false
        },
        {
          culture: 'german',
          context: 'business_decision',
          approvalText: 'Ja, ich stimme zu. Die Spezifikationen sind klar und angemessen.',  // "Yes, I agree. The specifications are clear and appropriate."
          expectedValidity: true
        },
        {
          culture: 'german',
          context: 'business_decision',
          approvalText: 'Vielleicht später.',  // "Maybe later." (insufficient)
          expectedValidity: false
        }
      ];
      
      for (const scenario of validationScenarios) {
        const result = await approvalValidator.validateApproval(
          scenario.approvalText,
          scenario.culture,
          scenario.context
        );
        
        expect(result).toMatchObject({
          isValid: expect.any(Boolean),
          confidence: expect.any(Number),
          culturalAlignment: expect.any(Number),
          contextualAppropriateness: expect.any(Number),
          issues: expect.any(Array)
        });
        
        expect(result.isValid).toBe(scenario.expectedValidity);
        
        if (result.isValid) {
          expect(result.confidence).toBeGreaterThan(0.8);
          expect(result.culturalAlignment).toBeGreaterThan(0.8);
          expect(result.contextualAppropriateness).toBeGreaterThan(0.8);
          expect(result.issues).toHaveLength(0);
        } else {
          expect(result.issues.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe('Hierarchical Approval Sensitivity', () => {
    test('should detect hierarchy-appropriate approval patterns', async () => {
      const hierarchyScenarios = [
        {
          culture: 'japanese',
          approvalText: '部長のご指示に従って進めさせていただきます。',  // "I will proceed following the director's instructions."
          hierarchy: 'subordinate_to_superior',
          expectedValidity: true,
          expectedAttributes: {
            deferential: true,
            humble: true,
            honorific: true
          }
        },
        {
          culture: 'japanese',
          approvalText: 'よし、そうしよう。',  // "Alright, let's do that." (too casual for subordinate to superior)
          hierarchy: 'subordinate_to_superior',
          expectedValidity: false
        },
        {
          culture: 'japanese',
          approvalText: '進めてください。',  // "Please proceed." (appropriate from superior to subordinate)
          hierarchy: 'superior_to_subordinate',
          expectedValidity: true,
          expectedAttributes: {
            authoritative: true,
            clear: true
          }
        },
        {
          culture: 'korean',
          approvalText: '네, 부장님 말씀대로 하겠습니다.',  // "Yes, I will do as the director says."
          hierarchy: 'subordinate_to_superior',
          expectedValidity: true,
          expectedAttributes: {
            respectful: true,
            acknowledging: true
          }
        },
        {
          culture: 'arabic',
          approvalText: 'نعم سيدي، سأنفذ توجيهاتكم على الفور.',  // "Yes sir, I will implement your directives immediately."
          hierarchy: 'subordinate_to_superior',
          expectedValidity: true,
          expectedAttributes: {
            honorific: true,
            immediate: true
          }
        }
      ];
      
      for (const scenario of hierarchyScenarios) {
        const result = await approvalValidator.validateHierarchicalApproval(
          scenario.approvalText,
          scenario.culture,
          scenario.hierarchy
        );
        
        expect(result).toMatchObject({
          isValid: expect.any(Boolean),
          hierarchicalAppropriateness: expect.any(Number),
          approvalAttributes: expect.any(Object),
          issues: expect.any(Array)
        });
        
        expect(result.isValid).toBe(scenario.expectedValidity);
        
        if (result.isValid && scenario.expectedAttributes) {
          expect(result.hierarchicalAppropriateness).toBeGreaterThan(0.8);
          
          // Check for expected attributes
          for (const [key, value] of Object.entries(scenario.expectedAttributes)) {
            expect(result.approvalAttributes[key]).toBe(value);
          }
        }
      }
    });
  });

  describe('Approval Generation', () => {
    test('should generate culturally-appropriate approval expressions', async () => {
      performanceMonitor.startSession('approval-generation');
      
      const generationScenarios = [
        {
          culture: 'japanese',
          context: 'business_proposal',
          approvalStrength: 'strong',
          hierarchy: 'subordinate_to_superior'
        },
        {
          culture: 'american',
          context: 'business_proposal',
          approvalStrength: 'strong',
          hierarchy: 'peer_to_peer'
        },
        {
          culture: 'german',
          context: 'business_proposal',
          approvalStrength: 'strong',
          hierarchy: 'superior_to_subordinate'
        },
        {
          culture: 'arabic',
          context: 'business_proposal',
          approvalStrength: 'strong',
          hierarchy: 'subordinate_to_superior'
        }
      ];
      
      for (const scenario of generationScenarios) {
        const result = await approvalValidator.generateApprovalExpression(
          scenario.culture,
          scenario.context,
          scenario.approvalStrength,
          scenario.hierarchy
        );
        
        expect(result).toMatchObject({
          approvalExpression: expect.any(String),
          culturallyCalibrated: true,
          contextuallyAppropriate: true,
          hierarchicallyAppropriate: true,
          attributes: expect.any(Object)
        });
        
        // Validate the generated approval
        const validation = await approvalValidator.validateApproval(
          result.approvalExpression,
          scenario.culture,
          scenario.context
        );
        
        expect(validation.isValid).toBe(true);
        expect(validation.confidence).toBeGreaterThan(0.8);
        
        // Validate hierarchical appropriateness
        const hierarchyValidation = await approvalValidator.validateHierarchicalApproval(
          result.approvalExpression,
          scenario.culture,
          scenario.hierarchy
        );
        
        expect(hierarchyValidation.isValid).toBe(true);
        expect(hierarchyValidation.hierarchicalAppropriateness).toBeGreaterThan(0.8);
      }
      
      const sessionDuration = performanceMonitor.endSession();
      expect(sessionDuration).toBeLessThan(3000); // Under 3 seconds
    });
  });

  describe('Integration with Context Engine', () => {
    test('should integrate with cultural context for enhanced approval sensitivity', async () => {
      const integrationScenarios = [
        {
          culture: 'japanese',
          context: 'formal_business',
          hierarchy: 'subordinate_to_superior',
          approvalStrength: 'strong'
        },
        {
          culture: 'american',
          context: 'casual_business',
          hierarchy: 'peer_to_peer',
          approvalStrength: 'moderate'
        },
        {
          culture: 'german',
          context: 'technical_discussion',
          hierarchy: 'expert_to_client',
          approvalStrength: 'strong'
        }
      ];
      
      for (const scenario of integrationScenarios) {
        // Get enhanced context using cultural adaptation
        const adaptationResult = contextEngine.adaptForCulture(
          `Approval request for ${scenario.context}`,
          scenario.culture,
          { 
            context: 'business',
            formalityLevel: scenario.hierarchy === 'subordinate_to_superior' ? 0.9 : 0.6
          }
        );
        
        // Generate approval with enhanced context
        const result = await approvalValidator.generateContextualApproval(
          scenario.culture,
          { 
            context: scenario.context,
            hierarchy: scenario.hierarchy,
            culturalAdaptation: adaptationResult
          },
          scenario.approvalStrength
        );
        
        expect(result).toMatchObject({
          approvalExpression: expect.any(String),
          culturallyCalibrated: true,
          contextuallyEnhanced: true,
          approvalStrength: scenario.approvalStrength,
          contextualAttributes: expect.any(Object)
        });
        
        // Validate approval
        const validation = await approvalValidator.validateContextualApproval(
          result.approvalExpression,
          scenario.culture,
          { 
            context: scenario.context,
            hierarchy: scenario.hierarchy,
            culturalAdaptation: adaptationResult
          }
        );
        
        expect(validation.isValid).toBe(true);
        expect(validation.contextualAppropriateness).toBeGreaterThan(0.85);
        
        // Japanese formal business approvals should have specific attributes
        if (scenario.culture === 'japanese' && scenario.context === 'formal_business') {
          expect(result.contextualAttributes.honorifics).toBe(true);
          expect(result.contextualAttributes.groupAlignment).toBe(true);
        }
        
        // American casual business approvals should have different attributes
        if (scenario.culture === 'american' && scenario.context === 'casual_business') {
          expect(result.contextualAttributes.direct).toBe(true);
          expect(result.contextualAttributes.individualDecision).toBe(true);
        }
        
        // German technical discussions should have technical precision
        if (scenario.culture === 'german' && scenario.context === 'technical_discussion') {
          expect(result.contextualAttributes.precise).toBe(true);
          expect(result.contextualAttributes.technical).toBe(true);
        }
      }
    });
  });
}); 