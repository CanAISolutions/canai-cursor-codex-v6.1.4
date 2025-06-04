/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Emotional Transition Intelligence Testing"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Test emotional transition velocity, state machine validation, and emotional intensity calibration
 */

import { EmotionalTransitionEngine } from '../../src/emotional-sovereignty/emotional-transition-engine';
import { EmotionalStateMachine } from '../../src/emotional-sovereignty/emotional-state-machine';
import { EmotionalMemoryManager } from '../../src/emotional-sovereignty/emotional-memory-manager';
import { PerformanceMonitor } from '../../src/test-infrastructure';

describe('🧠 Emotional Transition Intelligence', () => {
  let transitionEngine: EmotionalTransitionEngine;
  let stateMachine: EmotionalStateMachine;
  let memoryManager: EmotionalMemoryManager;
  let performanceMonitor: PerformanceMonitor;

  beforeEach(() => {
    transitionEngine = new EmotionalTransitionEngine({
      transitionSensitivity: 'high',
      velocityTracking: true,
      jarringJumpPrevention: true,
      intensityCalibration: true
    });
    
    stateMachine = new EmotionalStateMachine({
      allowedStates: ['neutral', 'engaged', 'frustrated', 'confused', 'excited', 'overwhelmed', 'breakthrough', 'satisfied'],
      transitionRules: 'natural_progression',
      jarringJumpThreshold: 0.3
    });
    
    memoryManager = new EmotionalMemoryManager({
      persistenceLevel: 'comprehensive',
      memoryDecay: 'exponential',
      crossSessionEnabled: true,
      emotionalContinuity: true,
      sessionPersistence: true,
      crossSessionContinuity: true,
      emotionalDriftDetection: true
    });
    
    performanceMonitor = new PerformanceMonitor();
  });

  describe('⚡ Emotional Transition Velocity Testing', () => {
    test('should calculate accurate emotional transition velocity', async () => {
      // What: Test emotional transition velocity calculation
      // Why: Velocity tracking prevents jarring emotional jumps and enables smooth transitions
      // How: Measure velocity between emotional states over time

      await performanceMonitor.startSession();

      const emotionalSequence = [
        { state: 'neutral', timestamp: 0, intensity: 0.5 },
        { state: 'engaged', timestamp: 30000, intensity: 0.7 },
        { state: 'excited', timestamp: 60000, intensity: 0.9 },
        { state: 'frustrated', timestamp: 90000, intensity: 0.8 },
        { state: 'confused', timestamp: 120000, intensity: 0.6 }
      ];

      const velocityAnalysis = await transitionEngine.calculateTransitionVelocity(emotionalSequence);

      expect(velocityAnalysis.averageVelocity).toBeGreaterThan(0);
      expect(velocityAnalysis.maxVelocity).toBeLessThan(1.0); // Prevent jarring jumps
      expect(velocityAnalysis.smoothnessScore).toBeGreaterThan(0.7);
      expect(velocityAnalysis.jarringJumps).toHaveLength(0);
      expect(velocityAnalysis.transitionQuality).toBeGreaterThan(0.8);

      // Validate individual transition velocities
      expect(velocityAnalysis.transitions).toHaveLength(4);
      velocityAnalysis.transitions.forEach((transition: any) => {
        expect(transition.velocity).toBeLessThan(0.5); // No jarring jumps
        expect(transition.naturalness).toBeGreaterThan(0.6);
      });

      await performanceMonitor.endSession();
    });

    test('should detect and prevent jarring emotional jumps', async () => {
      // What: Test jarring jump detection and prevention
      // Why: Jarring emotional jumps break user trust and feel unnatural
      // How: Validate detection of unnatural transitions and prevention strategies

      const jarringSequence = [
        { state: 'neutral', timestamp: 0, intensity: 0.5 },
        { state: 'overwhelmed', timestamp: 5000, intensity: 0.95 }, // Jarring jump
        { state: 'satisfied', timestamp: 10000, intensity: 0.8 }   // Another jarring jump
      ];

      const jarringAnalysis = await transitionEngine.analyzeForJarringJumps(jarringSequence);

      expect(jarringAnalysis.jarringJumpsDetected).toBe(true);
      expect(jarringAnalysis.jarringJumps).toHaveLength(2);
      expect(jarringAnalysis.preventionStrategies).toHaveLength(2);

      // Validate prevention strategies
      const preventedSequence = await transitionEngine.preventJarringJumps(jarringSequence);
      
      expect(preventedSequence.smoothedTransitions).toHaveLength(5); // Should add intermediate states
      expect(preventedSequence.maxVelocity).toBeLessThan(0.3);
      expect(preventedSequence.smoothnessImprovement).toBeGreaterThan(0.5);
    });

    test('should maintain emotional velocity under high-frequency interactions', async () => {
      // What: Test velocity maintenance during rapid interactions
      // Why: High-frequency interactions can cause emotional whiplash
      // How: Validate smooth transitions even with rapid state changes

      const highFrequencySequence = Array.from({ length: 20 }, (_, i) => ({
        state: ['neutral', 'engaged', 'excited', 'frustrated'][i % 4],
        timestamp: i * 2000, // Every 2 seconds
        intensity: 0.5 + (Math.sin(i * 0.5) * 0.3) // Oscillating intensity
      }));

      const highFrequencyAnalysis = await transitionEngine.analyzeHighFrequencyTransitions(highFrequencySequence);

      expect(highFrequencyAnalysis.stabilityMaintained).toBe(true);
      expect(highFrequencyAnalysis.averageVelocity).toBeLessThan(0.4);
      expect(highFrequencyAnalysis.emotionalWhiplashPrevented).toBe(true);
      expect(highFrequencyAnalysis.userComfortScore).toBeGreaterThan(0.75);
    });
  });

  describe('🎭 Emotional State Machine Validation', () => {
    test('should validate natural emotional state progressions', async () => {
      // What: Test emotional state machine validation for natural progressions
      // Why: Ensures emotional transitions follow natural human patterns
      // How: Validate state machine rules and transition logic

      const naturalProgression = [
        'neutral',
        'engaged',
        'excited',
        'breakthrough',
        'satisfied'
      ];

      const validationResult = await stateMachine.validateStateProgression(naturalProgression);

      expect(validationResult.isValid).toBe(true);
      expect(validationResult.naturalness).toBeGreaterThan(0.9);
      expect(validationResult.transitionQuality).toBeGreaterThan(0.85);
      expect(validationResult.violations).toHaveLength(0);
    });

    test('should reject unnatural emotional state jumps', async () => {
      // What: Test rejection of unnatural emotional state transitions
      // Why: Unnatural transitions break emotional authenticity
      // How: Validate state machine rejection of impossible transitions

      const unnaturalProgression = [
        'neutral',
        'overwhelmed', // Unnatural jump
        'satisfied',   // Another unnatural jump
        'confused'
      ];

      const validationResult = await stateMachine.validateStateProgression(unnaturalProgression);

      expect(validationResult.isValid).toBe(false);
      expect(validationResult.violations).toHaveLength(2);
      expect(validationResult.suggestedCorrections).toHaveLength(2);

      // Validate suggested corrections
      const correctedProgression = await stateMachine.correctStateProgression(unnaturalProgression);
      
      expect(correctedProgression.correctedStates).toHaveLength(6); // Should add intermediate states
      expect(correctedProgression.naturalness).toBeGreaterThan(0.8);
      expect(correctedProgression.correctionQuality).toBeGreaterThan(0.85);
    });

    test('should handle complex emotional state branching', async () => {
      // What: Test complex emotional state branching scenarios
      // Why: Real emotions often have multiple valid paths
      // How: Validate state machine handling of branching emotional paths

      const branchingScenario = {
        currentState: 'frustrated',
        possibleNextStates: ['confused', 'engaged', 'overwhelmed', 'neutral'],
        context: {
          userInput: 'This is getting complicated but I want to understand',
          previousStates: ['neutral', 'engaged', 'frustrated'],
          sessionDuration: 900000 // 15 minutes
        }
      };

      const branchingAnalysis = await stateMachine.analyzeBranchingPaths(branchingScenario);

      expect(branchingAnalysis.validPaths).toHaveLength(3); // Should exclude 'overwhelmed' as too jarring
      expect(branchingAnalysis.recommendedPath).toBe('engaged'); // Most natural given context
      expect(branchingAnalysis.pathProbabilities.engaged).toBeGreaterThan(0.6);
      expect(branchingAnalysis.pathProbabilities.overwhelmed).toBeLessThan(0.2);
    });
  });

  describe('🌍 Emotional Intensity Calibration Across Locales', () => {
    test('should calibrate emotional intensity for different cultures', async () => {
      // What: Test emotional intensity calibration across cultures
      // Why: Different cultures express emotions with different intensities
      // How: Validate cultural calibration of emotional expressions

      const culturalScenarios = [
        { culture: 'japanese', emotionalExpression: 'subtle', baselineIntensity: 0.4 },
        { culture: 'italian', emotionalExpression: 'expressive', baselineIntensity: 0.8 },
        { culture: 'british', emotionalExpression: 'reserved', baselineIntensity: 0.5 },
        { culture: 'brazilian', emotionalExpression: 'warm', baselineIntensity: 0.7 },
        { culture: 'german', emotionalExpression: 'direct', baselineIntensity: 0.6 }
      ];

      for (const scenario of culturalScenarios) {
        const calibrationResult = await transitionEngine.calibrateForCulture(scenario);

        expect(calibrationResult.calibratedIntensity).toBeCloseTo(scenario.baselineIntensity, 1);
        expect(calibrationResult.culturalAccuracy).toBeGreaterThan(0.9);
        expect(calibrationResult.expressionAlignment).toBeGreaterThan(0.85);
        expect(calibrationResult.respectfulAdaptation).toBe(true);
      }
    });

    test('should maintain emotional authenticity across intensity calibrations', async () => {
      // What: Test authenticity preservation during intensity calibration
      // Why: Calibration should adapt expression, not change authentic emotion
      // How: Validate that core emotion remains while expression adapts

      const authenticEmotion = {
        coreEmotion: 'excitement',
        intensity: 0.8,
        authenticity: 0.95,
        context: 'breakthrough_moment'
      };

      const culturalAdaptations = [
        { culture: 'japanese', expectedIntensity: 0.5 },
        { culture: 'italian', expectedIntensity: 0.9 },
        { culture: 'scandinavian', expectedIntensity: 0.6 }
      ];

      for (const adaptation of culturalAdaptations) {
        const adaptedEmotion = await transitionEngine.adaptEmotionForCulture(
          authenticEmotion,
          adaptation.culture
        );

        expect(adaptedEmotion.coreEmotion).toBe('excitement'); // Core emotion unchanged
        expect(adaptedEmotion.authenticity).toBeGreaterThan(0.9); // Authenticity preserved
        expect(adaptedEmotion.expressionIntensity).toBeCloseTo(adaptation.expectedIntensity, 1);
        expect(adaptedEmotion.culturalAppropriate).toBe(true);
      }
    });
  });

  describe('🧠 Contextual Emotional Drift Sensitivity', () => {
    test('should detect subtle emotional drift over time', async () => {
      // What: Test detection of gradual emotional drift
      // Why: Subtle drift can indicate underlying issues or natural progression
      // How: Validate drift detection algorithms and sensitivity tuning

      const gradualDriftSequence = Array.from({ length: 10 }, (_, i) => ({
        state: 'engaged',
        timestamp: i * 300000, // Every 5 minutes
        intensity: 0.8 - (i * 0.05), // Gradual decline
        context: `interaction_${i + 1}`
      }));

      const driftAnalysis = await transitionEngine.detectEmotionalDrift(gradualDriftSequence);

      expect(driftAnalysis.driftDetected).toBe(true);
      expect(driftAnalysis.driftDirection).toBe('descending');
      expect(driftAnalysis.driftRate).toBeCloseTo(0.05, 2);
      expect(driftAnalysis.significanceLevel).toBeGreaterThan(0.8);
      expect(driftAnalysis.interventionRecommended).toBe(true);
    });

    test('should distinguish between natural progression and problematic drift', async () => {
      // What: Test distinction between natural and problematic emotional drift
      // Why: Not all drift is bad - some represents natural learning progression
      // How: Validate classification of drift types and appropriate responses

      const naturalProgressionSequence = [
        { state: 'confused', intensity: 0.6, context: 'learning_start', timestamp: 0 },
        { state: 'engaged', intensity: 0.7, context: 'understanding_building', timestamp: 300000 },
        { state: 'excited', intensity: 0.8, context: 'breakthrough_approaching', timestamp: 600000 },
        { state: 'breakthrough', intensity: 0.9, context: 'mastery_achieved', timestamp: 900000 }
      ];

      const problematicDriftSequence = [
        { state: 'engaged', intensity: 0.8, context: 'initial_enthusiasm', timestamp: 0 },
        { state: 'frustrated', intensity: 0.7, context: 'hitting_obstacles', timestamp: 300000 },
        { state: 'confused', intensity: 0.5, context: 'losing_clarity', timestamp: 600000 },
        { state: 'overwhelmed', intensity: 0.3, context: 'giving_up', timestamp: 900000 }
      ];

      const naturalAnalysis = await transitionEngine.classifyDriftType(naturalProgressionSequence);
      const problematicAnalysis = await transitionEngine.classifyDriftType(problematicDriftSequence);

      expect(naturalAnalysis.driftType).toBe('natural_progression');
      expect(naturalAnalysis.interventionNeeded).toBe(false);
      expect(naturalAnalysis.positiveOutcome).toBe(true);

      expect(problematicAnalysis.driftType).toBe('problematic_decline');
      expect(problematicAnalysis.interventionNeeded).toBe(true);
      expect(problematicAnalysis.urgencyLevel).toBe('high');
    });
  });

  describe('💾 Emotional Memory Persistence Across Sessions', () => {
    test('should persist emotional state across session boundaries', async () => {
      // What: Test emotional memory persistence across sessions
      // Why: Emotional continuity across sessions builds deeper relationships
      // How: Validate session-to-session emotional state preservation

      const session1EndState = {
        emotionalState: 'satisfied',
        intensity: 0.8,
        context: 'successful_completion',
        keyMoments: ['breakthrough', 'mastery'],
        trustLevel: 4.5,
        sessionId: 'session_001'
      };

      await memoryManager.persistSessionState(session1EndState);

      const session2StartState = await memoryManager.reconstructSessionState('session_002', {
        previousSessionId: 'session_001',
        timeBetweenSessions: 86400000 // 24 hours
      });

      expect(session2StartState.emotionalContinuity).toBeGreaterThan(0.8);
      expect(session2StartState.baselineEmotion).toBe('engaged'); // Natural decay from satisfied
      expect(session2StartState.trustCarryover).toBeGreaterThan(4.0);
      expect(session2StartState.contextualMemory).toContain('successful_completion');
    });

    test('should handle emotional memory consolidation over time', async () => {
      // What: Test emotional memory consolidation across multiple sessions
      // Why: Long-term emotional patterns should influence current interactions
      // How: Validate memory consolidation and pattern recognition

      const multiSessionHistory = [
        { sessionId: 'session_001', outcome: 'breakthrough', emotionalPeak: 0.9 },
        { sessionId: 'session_002', outcome: 'frustration', emotionalLow: 0.3 },
        { sessionId: 'session_003', outcome: 'recovery', emotionalPeak: 0.8 },
        { sessionId: 'session_004', outcome: 'mastery', emotionalPeak: 0.95 },
        { sessionId: 'session_005', outcome: 'teaching_others', emotionalPeak: 0.85 }
      ];

      const consolidatedMemory = await memoryManager.consolidateEmotionalHistory(multiSessionHistory);

      expect(consolidatedMemory.overallPattern).toBe('growth_through_challenges');
      expect(consolidatedMemory.resilienceScore).toBeGreaterThan(0.8);
      expect(consolidatedMemory.trustTrajectory).toBe('ascending');
      expect(consolidatedMemory.emotionalMaturity).toBeGreaterThan(0.85);
      expect(consolidatedMemory.predictedFutureSuccess).toBeGreaterThan(0.9);
    });
  });

  describe('🎯 Performance and Accuracy Validation', () => {
    test('should maintain high performance during complex emotional transitions', async () => {
      // What: Test performance during complex emotional processing
      // Why: Emotional intelligence should not compromise system performance
      // How: Validate processing speed and accuracy under load

      await performanceMonitor.startSession();

      const complexScenario = {
        simultaneousUsers: 100,
        transitionsPerUser: 50,
        culturalVariations: 10,
        sessionDuration: 3600000 // 1 hour
      };

      const performanceResult = await transitionEngine.processComplexScenario(complexScenario);

      expect(performanceResult.averageProcessingTime).toBeLessThan(50); // ms
      expect(performanceResult.accuracyMaintained).toBeGreaterThan(0.95);
      expect(performanceResult.memoryEfficiency).toBeGreaterThan(0.9);
      expect(performanceResult.concurrentUserHandling).toBe(true);

      await performanceMonitor.endSession();
    });

    test('should achieve high accuracy in emotional transition predictions', async () => {
      // What: Test accuracy of emotional transition predictions
      // Why: Accurate predictions enable proactive emotional support
      // How: Validate prediction accuracy against known outcomes

      const predictionScenarios = [
        {
          currentState: 'frustrated',
          context: 'complex_problem',
          expectedTransition: 'breakthrough',
          timeframe: 600000 // 10 minutes
        },
        {
          currentState: 'confused',
          context: 'learning_new_concept',
          expectedTransition: 'engaged',
          timeframe: 300000 // 5 minutes
        },
        {
          currentState: 'overwhelmed',
          context: 'too_much_information',
          expectedTransition: 'neutral',
          timeframe: 900000 // 15 minutes
        }
      ];

      let correctPredictions = 0;

      for (const scenario of predictionScenarios) {
        const prediction = await transitionEngine.predictNextTransition(scenario);
        
        if (prediction.predictedState === scenario.expectedTransition) {
          correctPredictions++;
        }
        
        expect(prediction.confidence).toBeGreaterThan(0.7);
        expect(prediction.timeframe).toBeCloseTo(scenario.timeframe, -4); // Within 10% accuracy
      }

      const accuracy = correctPredictions / predictionScenarios.length;
      expect(accuracy).toBeGreaterThan(0.8); // 80% prediction accuracy
    });
  });
}); 