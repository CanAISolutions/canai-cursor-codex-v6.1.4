/**
 * @TAP-Version v6.1.4
 * @Codex-Intent "Emotional Memory and Continuity Test Suite"
 * @EmotionQA true
 * @FallbackReady true
 * @purpose Test emotional memory persistence, cross-session correlation, and journey replay
 */

import { EmotionalMemoryManager, EmotionalSession, EmotionalMemoryConfig } from '../../src/emotional-sovereignty/emotional-memory-manager';
import { EmotionalStateReconstructor, InteractionTrace, EmotionalStateReconstructorConfig } from '../../src/emotional-sovereignty/emotional-state-reconstructor';

describe('🧠 Emotional Memory and Continuity', () => {
  let memoryManager: EmotionalMemoryManager;
  let stateReconstructor: EmotionalStateReconstructor;
  let performanceMonitor: any;

  beforeEach(() => {
    // Initialize with comprehensive configuration
    const memoryConfig: EmotionalMemoryConfig = {
      persistenceLevel: 'comprehensive',
      memoryDecay: 'exponential',
      crossSessionEnabled: true,
      emotionalContinuity: true
    };

    const reconstructorConfig: EmotionalStateReconstructorConfig = {
      reconstructionDepth: 'complete',
      traceAnalysis: 'advanced',
      emotionalMapping: true
    };

    memoryManager = new EmotionalMemoryManager(memoryConfig);
    stateReconstructor = new EmotionalStateReconstructor(reconstructorConfig);
    
    // Performance monitoring setup
    performanceMonitor = {
      startTime: 0,
      endTime: 0,
      memoryUsage: 0,
      startSession: () => {
        performanceMonitor.startTime = performance.now();
        performanceMonitor.memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
      },
      endSession: () => {
        performanceMonitor.endTime = performance.now();
        return {
          duration: performanceMonitor.endTime - performanceMonitor.startTime,
          memoryDelta: ((performance as any).memory?.usedJSHeapSize || 0) - performanceMonitor.memoryUsage
        };
      }
    };
  });

  describe('📚 Cross-Session Emotional Correlation', () => {
    test('should maintain emotional continuity across 24-hour session gap', async () => {
      performanceMonitor.startSession();

      // Create initial session with breakthrough moment
      const initialSession: EmotionalSession = {
        sessionId: 'session-001',
        userId: 'user-breakthrough-test',
        emotionalState: {
          primaryEmotion: 'excited',
          intensity: 0.9,
          trustScore: 4.2,
          context: 'major_breakthrough_achieved',
          timestamp: Date.now() - (24 * 60 * 60 * 1000) // 24 hours ago
        },
        interactions: [
          { type: 'discovery', emotion: 'curious', intensity: 0.7, timestamp: Date.now() - (24 * 60 * 60 * 1000) },
          { type: 'breakthrough', emotion: 'excited', intensity: 0.9, timestamp: Date.now() - (24 * 60 * 60 * 1000) + 1000 }
        ]
      };

      // Persist initial session
      const persistResult = await memoryManager.persistEmotionalSession(initialSession);
      expect(persistResult.sessionStored).toBe(true);
      expect(persistResult.emotionalContinuity).toBe(true);
      expect(persistResult.persistenceQuality).toBeGreaterThan(0.8);

      // Retrieve memory after 24-hour gap
      const retrievedMemory = await memoryManager.retrieveEmotionalMemory('user-breakthrough-test', Date.now());
      
      expect(retrievedMemory.memoryFound).toBe(true);
      expect(retrievedMemory.emotionalContinuity).toBeGreaterThan(0.85); // High continuity for breakthrough
      expect(retrievedMemory.trustCarryover).toBeGreaterThan(4.0); // Trust should carry over strongly
      expect(retrievedMemory.decayedState.emotion).toBe('excited');
      expect(retrievedMemory.decayedState.intensity).toBeGreaterThan(0.3); // Some decay but still significant

      const metrics = performanceMonitor.endSession();
      expect(metrics.duration).toBeLessThan(100); // Sub-100ms processing
    });

    test('should correlate emotional patterns across multiple sessions', async () => {
      performanceMonitor.startSession();

      const userId = 'user-pattern-correlation';
      const baseTime = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days ago

      // Create pattern of sessions showing growth through challenges
      const sessions: EmotionalSession[] = [
        {
          sessionId: 'session-001',
          userId,
          emotionalState: {
            primaryEmotion: 'frustrated',
            intensity: 0.8,
            trustScore: 3.2,
            context: 'initial_challenge',
            timestamp: baseTime
          },
          interactions: [
            { type: 'challenge', emotion: 'frustrated', intensity: 0.8, timestamp: baseTime }
          ]
        },
        {
          sessionId: 'session-002',
          userId,
          emotionalState: {
            primaryEmotion: 'determined',
            intensity: 0.7,
            trustScore: 3.8,
            context: 'working_through_challenge',
            timestamp: baseTime + (2 * 24 * 60 * 60 * 1000)
          },
          interactions: [
            { type: 'persistence', emotion: 'determined', intensity: 0.7, timestamp: baseTime + (2 * 24 * 60 * 60 * 1000) }
          ]
        },
        {
          sessionId: 'session-003',
          userId,
          emotionalState: {
            primaryEmotion: 'accomplished',
            intensity: 0.9,
            trustScore: 4.5,
            context: 'breakthrough_achieved',
            timestamp: baseTime + (5 * 24 * 60 * 60 * 1000)
          },
          interactions: [
            { type: 'breakthrough', emotion: 'accomplished', intensity: 0.9, timestamp: baseTime + (5 * 24 * 60 * 60 * 1000) }
          ]
        }
      ];

      // Persist all sessions
      for (const session of sessions) {
        const result = await memoryManager.persistEmotionalSession(session);
        expect(result.sessionStored).toBe(true);
      }

      // Analyze emotional context across sessions
      const contextAnalysis = await memoryManager.analyzeEmotionalContext(sessions);
      
      expect(contextAnalysis.journeyPattern).toBe('growth_through_challenges');
      expect(contextAnalysis.emotionalProgression).toBe('ascending');
      expect(contextAnalysis.contextualCoherence).toBeGreaterThan(0.8);
      expect(contextAnalysis.growthIndicators).toContain('resilience_building');
      expect(contextAnalysis.predictiveInsights.nextEmotionPrediction).toBe('confident');

      const metrics = performanceMonitor.endSession();
      expect(metrics.duration).toBeLessThan(150); // Complex analysis under 150ms
    });

    test('should handle cultural emotional memory adaptation', async () => {
      performanceMonitor.startSession();

      const userId = 'user-cultural-memory';
      
      // Session with Japanese cultural context (lower emotional expression)
      const japaneseSession: EmotionalSession = {
        sessionId: 'session-jp',
        userId,
        emotionalState: {
          primaryEmotion: 'satisfied',
          intensity: 0.4, // Lower intensity typical of Japanese expression
          trustScore: 4.0,
          context: 'achievement_japanese_style',
          timestamp: Date.now() - (12 * 60 * 60 * 1000) // 12 hours ago
        },
        interactions: [
          { type: 'achievement', emotion: 'satisfied', intensity: 0.4, timestamp: Date.now() - (12 * 60 * 60 * 1000) }
        ]
      };

      await memoryManager.persistEmotionalSession(japaneseSession);

      // Retrieve and verify cultural adaptation
      const retrievedMemory = await memoryManager.retrieveEmotionalMemory(userId, Date.now());
      
      expect(retrievedMemory.memoryFound).toBe(true);
      expect(retrievedMemory.emotionalContinuity).toBeGreaterThan(0.8); // High continuity despite lower intensity
      expect(retrievedMemory.contextualRelevance).toBeGreaterThan(0.7);
      expect(retrievedMemory.decayedState.emotion).toBe('satisfied');

      const metrics = performanceMonitor.endSession();
      expect(metrics.duration).toBeLessThan(75);
    });
  });

  describe('🎬 Emotional Journey Replay Capabilities', () => {
    test('should replay complete emotional journey from traces', async () => {
      performanceMonitor.startSession();

      // Create comprehensive interaction traces
      const traces: InteractionTrace[] = [
        {
          timestamp: Date.now() - 10000,
          action: 'initial_engagement',
          emotionalMarkers: ['curious', 'cautious'],
          trustIndicators: { openness: 0.3, vulnerability: 0.2 },
          context: 'first_interaction'
        },
        {
          timestamp: Date.now() - 8000,
          action: 'information_sharing',
          emotionalMarkers: ['interested', 'engaged'],
          trustIndicators: { openness: 0.6, vulnerability: 0.4 },
          context: 'learning_phase'
        },
        {
          timestamp: Date.now() - 5000,
          action: 'challenge_encountered',
          emotionalMarkers: ['frustrated', 'determined'],
          trustIndicators: { openness: 0.5, vulnerability: 0.6 },
          context: 'difficulty_phase'
        },
        {
          timestamp: Date.now() - 2000,
          action: 'breakthrough_moment',
          emotionalMarkers: ['excited', 'accomplished'],
          trustIndicators: { openness: 0.9, vulnerability: 0.8 },
          context: 'success_phase'
        },
        {
          timestamp: Date.now() - 500,
          action: 'reflection',
          emotionalMarkers: ['satisfied', 'grateful'],
          trustIndicators: { openness: 0.8, vulnerability: 0.7 },
          context: 'integration_phase'
        }
      ];

      // Reconstruct emotional state from traces
      const reconstructedState = await stateReconstructor.reconstructFromTraces(traces);
      
      expect(reconstructedState.emotionalJourney).toHaveLength(5);
      expect(reconstructedState.reconstructionQuality).toBeGreaterThan(0.85);
      expect(reconstructedState.emotionalVelocity).toBeGreaterThan(0.1); // Significant emotional movement
      expect(reconstructedState.confidenceLevel).toBeGreaterThan(0.8);
      expect(reconstructedState.dataCompleteness).toBeGreaterThan(0.9);

      // Verify journey progression
      const journey = reconstructedState.emotionalJourney;
      expect(journey[0].emotionalState.primaryEmotion).toBe('curious');
      expect(journey[2].emotionalState.primaryEmotion).toBe('frustrated');
      expect(journey[3].emotionalState.primaryEmotion).toBe('excited');
      expect(journey[4].emotionalState.primaryEmotion).toBe('satisfied');

      // Verify trust evolution
      expect(reconstructedState.trustEvolution.direction).toBe('ascending');
      expect(reconstructedState.trustEvolution.currentLevel).toBeGreaterThan(0.7);

      const metrics = performanceMonitor.endSession();
      expect(metrics.duration).toBeLessThan(120); // Complex reconstruction under 120ms
    });

    test('should handle incomplete trace data with inference', async () => {
      performanceMonitor.startSession();

      // Create traces with gaps
      const incompleteTraces: InteractionTrace[] = [
        {
          timestamp: Date.now() - 10000,
          action: 'start',
          emotionalMarkers: ['neutral'],
          context: 'beginning'
        },
        // Missing middle interactions
        {
          timestamp: Date.now() - 2000,
          action: 'end',
          emotionalMarkers: ['accomplished'],
          trustIndicators: { openness: 0.8, vulnerability: 0.7 },
          context: 'completion'
        }
      ];

      const reconstructedState = await stateReconstructor.reconstructFromTraces(incompleteTraces);
      
      expect(reconstructedState.dataCompleteness).toBeLessThan(0.7); // Incomplete data detected
      expect(reconstructedState.confidenceLevel).toBeLessThan(0.8); // Lower confidence due to gaps
      expect(reconstructedState.inferredStates).toHaveLength(1); // Should infer missing state
      expect(reconstructedState.reconstructionQuality).toBeGreaterThan(0.6); // Still reasonable quality

      const metrics = performanceMonitor.endSession();
      expect(metrics.duration).toBeLessThan(80);
    });

    test('should validate emotional transition naturalness in replay', async () => {
      performanceMonitor.startSession();

      // Create transitions with both natural and jarring changes
      const transitions = [
        { from: 'curious', to: 'interested', intensity: 0.3, timeGap: 1000 }, // Natural
        { from: 'interested', to: 'frustrated', intensity: 0.6, timeGap: 2000 }, // Natural
        { from: 'frustrated', to: 'excited', intensity: 0.8, timeGap: 500 }, // Potentially jarring
        { from: 'excited', to: 'satisfied', intensity: 0.4, timeGap: 3000 } // Natural
      ];

      const validation = await stateReconstructor.validateEmotionalTransitions(transitions);
      
      expect(validation.overallNaturalness).toBeGreaterThan(0.7);
      expect(validation.emotionalCoherence).toBeGreaterThan(0.8);
      expect(validation.journeyValidity).toBe(true);
      
      // Should identify the potentially jarring transition
      const jarringTransitions = validation.unnaturalTransitions;
      if (jarringTransitions.length > 0) {
        expect(jarringTransitions[0].from).toBe('frustrated');
        expect(jarringTransitions[0].to).toBe('excited');
      }

      const metrics = performanceMonitor.endSession();
      expect(metrics.duration).toBeLessThan(60);
    });
  });

  describe('🌟 Transcendent Memory Integration', () => {
    test('should integrate transcendent memory across consciousness levels', async () => {
      performanceMonitor.startSession();

      // Create transcendent-level memory configuration
      const transcendentConfig: EmotionalMemoryConfig = {
        persistenceLevel: 'transcendent',
        memoryDecay: 'logarithmic', // Slower decay for transcendent memories
        crossSessionEnabled: true,
        emotionalContinuity: true
      };

      const transcendentMemoryManager = new EmotionalMemoryManager(transcendentConfig);

      // Create session with consciousness expansion
      const transcendentSession: EmotionalSession = {
        sessionId: 'transcendent-001',
        userId: 'user-consciousness-expansion',
        emotionalState: {
          primaryEmotion: 'transcendent',
          intensity: 0.95,
          trustScore: 4.8,
          context: 'consciousness_expansion_breakthrough',
          timestamp: Date.now() - (48 * 60 * 60 * 1000) // 48 hours ago
        },
        interactions: [
          { type: 'consciousness_expansion', emotion: 'transcendent', intensity: 0.95, timestamp: Date.now() - (48 * 60 * 60 * 1000) },
          { type: 'wisdom_integration', emotion: 'enlightened', intensity: 0.9, timestamp: Date.now() - (48 * 60 * 60 * 1000) + 1000 }
        ]
      };

      const persistResult = await transcendentMemoryManager.persistEmotionalSession(transcendentSession);
      expect(persistResult.persistenceQuality).toBeGreaterThan(0.95); // Highest quality for transcendent

      // Retrieve after significant time gap
      const retrievedMemory = await transcendentMemoryManager.retrieveEmotionalMemory('user-consciousness-expansion', Date.now());
      
      expect(retrievedMemory.memoryFound).toBe(true);
      expect(retrievedMemory.emotionalContinuity).toBeGreaterThan(0.9); // Transcendent memories persist longer
      expect(retrievedMemory.trustCarryover).toBeGreaterThan(4.5); // Strong trust carryover
      expect(retrievedMemory.contextualRelevance).toBeGreaterThan(0.85);

      const metrics = performanceMonitor.endSession();
      expect(metrics.duration).toBeLessThan(100);
    });

    test('should handle memory consolidation across multiple consciousness levels', async () => {
      performanceMonitor.startSession();

      const userId = 'user-multi-level-consciousness';
      
      // Create sessions at different consciousness levels
      const sessions = [
        {
          sessionId: 'basic-001',
          userId,
          emotionalState: {
            primaryEmotion: 'content',
            intensity: 0.6,
            trustScore: 3.5,
            context: 'basic_satisfaction',
            timestamp: Date.now() - (72 * 60 * 60 * 1000) // 3 days ago
          },
          interactions: [
            { type: 'basic_interaction', emotion: 'content', intensity: 0.6, timestamp: Date.now() - (72 * 60 * 60 * 1000) }
          ]
        },
        {
          sessionId: 'breakthrough-001',
          userId,
          emotionalState: {
            primaryEmotion: 'enlightened',
            intensity: 0.85,
            trustScore: 4.3,
            context: 'major_breakthrough',
            timestamp: Date.now() - (24 * 60 * 60 * 1000) // 1 day ago
          },
          interactions: [
            { type: 'breakthrough', emotion: 'enlightened', intensity: 0.85, timestamp: Date.now() - (24 * 60 * 60 * 1000) }
          ]
        }
      ];

      // Persist sessions
      for (const session of sessions) {
        await memoryManager.persistEmotionalSession(session);
      }

      // Analyze consolidated memory
      const contextAnalysis = await memoryManager.analyzeEmotionalContext(sessions);
      
      expect(contextAnalysis.journeyPattern).toBe('consciousness_evolution');
      expect(contextAnalysis.emotionalProgression).toBe('ascending');
      expect(contextAnalysis.growthIndicators).toContain('consciousness_expansion');
      expect(contextAnalysis.predictiveInsights.growthPotential).toBeGreaterThan(0.8);

      const metrics = performanceMonitor.endSession();
      expect(metrics.duration).toBeLessThan(130);
    });

    test('should preserve emotional sovereignty during memory integration', async () => {
      performanceMonitor.startSession();

      // Test that memory integration respects emotional autonomy
      const autonomySession: EmotionalSession = {
        sessionId: 'autonomy-test',
        userId: 'user-emotional-sovereignty',
        emotionalState: {
          primaryEmotion: 'empowered',
          intensity: 0.9,
          trustScore: 4.6,
          context: 'emotional_sovereignty_validation',
          timestamp: Date.now() - (6 * 60 * 60 * 1000) // 6 hours ago
        },
        interactions: [
          { type: 'sovereignty_assertion', emotion: 'empowered', intensity: 0.9, timestamp: Date.now() - (6 * 60 * 60 * 1000) },
          { type: 'autonomy_validation', emotion: 'confident', intensity: 0.8, timestamp: Date.now() - (6 * 60 * 60 * 1000) + 1000 }
        ]
      };

      await memoryManager.persistEmotionalSession(autonomySession);
      const retrievedMemory = await memoryManager.retrieveEmotionalMemory('user-emotional-sovereignty', Date.now());
      
      // Verify sovereignty preservation
      expect(retrievedMemory.memoryFound).toBe(true);
      expect(retrievedMemory.decayedState.emotion).toBe('empowered');
      expect(retrievedMemory.emotionalContinuity).toBeGreaterThan(0.85);
      expect(retrievedMemory.trustCarryover).toBeGreaterThan(4.0);

      // Verify no emotional manipulation or override
      expect(retrievedMemory.decayedState.intensity).toBeGreaterThan(0.6); // Maintains empowerment
      expect(retrievedMemory.contextualRelevance).toBeGreaterThan(0.8);

      const metrics = performanceMonitor.endSession();
      expect(metrics.duration).toBeLessThan(70);
    });
  });

  describe('⚡ Performance and Resilience', () => {
    test('should maintain performance under memory load', async () => {
      performanceMonitor.startSession();

      // Create multiple concurrent memory operations
      const promises = [];
      for (let i = 0; i < 50; i++) {
        const session: EmotionalSession = {
          sessionId: `load-test-${i}`,
          userId: `user-${i}`,
          emotionalState: {
            primaryEmotion: 'neutral',
            intensity: 0.5,
            trustScore: 3.0,
            context: 'load_testing',
            timestamp: Date.now() - (i * 1000)
          },
          interactions: [
            { type: 'load_test', emotion: 'neutral', intensity: 0.5, timestamp: Date.now() - (i * 1000) }
          ]
        };
        
        promises.push(memoryManager.persistEmotionalSession(session));
      }

      const results = await Promise.all(promises);
      
      // Verify all operations succeeded
      results.forEach(result => {
        expect(result.sessionStored).toBe(true);
        expect(result.persistenceQuality).toBeGreaterThan(0.7);
      });

      const metrics = performanceMonitor.endSession();
      expect(metrics.duration).toBeLessThan(500); // 50 operations under 500ms
    });

    test('should handle memory corruption gracefully', async () => {
      performanceMonitor.startSession();

      // Test resilience to corrupted memory data
      const corruptedSession: EmotionalSession = {
        sessionId: 'corrupted-test',
        userId: 'user-corruption-test',
        emotionalState: {
          primaryEmotion: '', // Empty emotion
          intensity: -1, // Invalid intensity
          trustScore: 10, // Out of range trust score
          context: 'corruption_test',
          timestamp: Date.now()
        },
        interactions: []
      };

      // Should handle gracefully without throwing
      const result = await memoryManager.persistEmotionalSession(corruptedSession);
      expect(result.sessionStored).toBe(true); // Should still store with corrections
      expect(result.persistenceQuality).toBeLessThan(0.5); // Low quality due to corruption

      const retrievedMemory = await memoryManager.retrieveEmotionalMemory('user-corruption-test', Date.now());
      expect(retrievedMemory.memoryFound).toBe(true);
      expect(retrievedMemory.emotionalContinuity).toBeGreaterThan(0.3); // Some continuity maintained

      const metrics = performanceMonitor.endSession();
      expect(metrics.duration).toBeLessThan(100);
    });
  });

  describe('🎯 Integration Validation', () => {
    test('should integrate with existing emotional sovereignty systems', async () => {
      performanceMonitor.startSession();

      // Test integration with emotional transition engine
      const integrationSession: EmotionalSession = {
        sessionId: 'integration-test',
        userId: 'user-integration',
        emotionalState: {
          primaryEmotion: 'confident',
          intensity: 0.8,
          trustScore: 4.2,
          context: 'system_integration_validation',
          timestamp: Date.now()
        },
        interactions: [
          { type: 'integration_test', emotion: 'confident', intensity: 0.8, timestamp: Date.now() }
        ]
      };

      const persistResult = await memoryManager.persistEmotionalSession(integrationSession);
      expect(persistResult.sessionStored).toBe(true);
      expect(persistResult.emotionalContinuity).toBe(true);

      // Verify seamless integration
      const retrievedMemory = await memoryManager.retrieveEmotionalMemory('user-integration', Date.now());
      expect(retrievedMemory.memoryFound).toBe(true);
      expect(retrievedMemory.emotionalContinuity).toBeGreaterThan(0.8);

      const metrics = performanceMonitor.endSession();
      expect(metrics.duration).toBeLessThan(80);
    });
  });
}); 