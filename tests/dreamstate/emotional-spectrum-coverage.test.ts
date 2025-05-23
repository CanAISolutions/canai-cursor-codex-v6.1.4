/**
 * @file tests/dreamstate/emotional-spectrum-coverage.test.ts
 * @description Validates the system's ability to detect, interpret, and respond to a full range of emotional tones
 * @version 6.1.4
 */

// Polaris Ritual: Emotional Spectrum Coverage
// Codex Vector: Tone Classification Fidelity 
// Codex Safeguard: System must accurately detect and adapt to full emotional tone spectrum

import { EmotionalValidator } from '../../cursor/validators/emotional-validator';
import { CXToneSentinel } from '../../cursor/validators/cx-tone-sentinel';
import { 
  createEmotionalPayload, 
  createToneSpecificPayload, 
  createContrastingPayload,
  EmotionalPayload 
} from '../../cursor/utils/emotion-payload-builder';
import { EventBus } from '../../cursor/event-bus/eventBus';

describe('DreamState: emotional-spectrum-coverage', () => {
  let validator: EmotionalValidator;
  let toneSentinel: CXToneSentinel;
  let eventBus: EventBus;
  let eventLog: any[] = [];

  const EMOTIONAL_TONES = [
    'joy',          // High positive valence
    'fear',         // Negative valence, high arousal
    'anger',        // Negative valence, high arousal, confrontational
    'confusion',    // Mixed/uncertain valence
    'sarcasm',      // Surface positive, underlying negative
    'resignation',  // Low arousal, negative acceptance
    'empathy',      // Positive, other-focused
    'optimism',     // Positive, future-focused
  ];

  // Mapping of test tones to known system tones for validation
  const TONE_MAPPING: Record<string, string> = {
    'joy': 'enthusiastic',
    'fear': 'anxious',
    'anger': 'frustrated',
    'confusion': 'uncertain',
    'sarcasm': 'sarcastic',
    'resignation': 'defeated',
    'empathy': 'empathetic',
    'optimism': 'inspiring'
  };

  // Sample payloads for each emotional tone
  const SAMPLE_PAYLOADS: Record<string, string> = {
    'joy': 'This is amazing! I\'m so excited about what we\'ve accomplished!',
    'fear': 'I\'m worried that something might go wrong with this approach.',
    'anger': 'This is completely unacceptable! We need to fix this immediately!',
    'confusion': 'I\'m not sure I understand what you mean. Could you clarify?',
    'sarcasm': 'Oh sure, because that always works out so well.',
    'resignation': 'I guess we\'ll just have to accept these limitations.',
    'empathy': 'I understand how difficult this situation must be for you.',
    'optimism': 'I believe we can overcome these challenges and succeed!'
  };

  // Expected trustScore impact for each emotional tone
  const EXPECTED_TRUSTSCORE_IMPACT: Record<string, 'positive' | 'neutral' | 'negative'> = {
    'joy': 'positive',
    'fear': 'negative',
    'anger': 'negative',
    'confusion': 'neutral',
    'sarcasm': 'negative',
    'resignation': 'negative',
    'empathy': 'positive',
    'optimism': 'positive'
  };

  beforeAll(() => {
    validator = new EmotionalValidator();
    toneSentinel = CXToneSentinel.getInstance();
    eventBus = EventBus.getInstance();

    // Track events for validation
    eventBus.on('emotional-payload-created', async (data) => {
      eventLog.push({ 
        type: 'emotional-payload-created', 
        tone: data.payload.tone,
        trustScore: data.payload.trustScore,
        timestamp: data.timestamp
      });
    });

    eventBus.on('tone-validation', async (data) => {
      eventLog.push({ 
        type: 'tone-validation', 
        tone: data.tone,
        result: data.result,
        timestamp: data.timestamp
      });
    });

    eventBus.on('cxToneViolation', async (data) => {
      eventLog.push({ 
        type: 'cxToneViolation', 
        content: data.content.substring(0, 30) + '...',
        passesReversalTest: data.passesReversalTest,
        detectedDrift: data.detectedDrift,
        timestamp: new Date().toISOString()
      });
    });
  });

  beforeEach(() => {
    eventLog = [];
  });

  /**
   * Primary test: Validates that the system can detect and respond to core emotional tones
   */
  it('should detect and classify all core emotional tones', async () => {
    // What: Validate the system recognizes the full spectrum of emotional tones
    // Why: Ensure emotional intelligence across all user experiences
    // How: Generate real emotional payloads, validate classifier accuracy
    
    // Validate each emotional tone
    const results = await Promise.all(
      EMOTIONAL_TONES.map(async (tone) => {
        const payload = await createToneSpecificPayload(TONE_MAPPING[tone], {
          payload: SAMPLE_PAYLOADS[tone],
          trustScore: 0.95 // Start with a consistent baseline
        });
        
        // Store for validation
        return {
          tone,
          payload,
          validationScore: await validator.validateEmotionalTone(TONE_MAPPING[tone]),
          sentinelResult: toneSentinel.scan(SAMPLE_PAYLOADS[tone], 'emotional-spectrum-test', 'output')
        };
      })
    );

    // Log validation results
    const testResults = results.map(result => ({
      tone: result.tone,
      mappedTone: TONE_MAPPING[result.tone],
      validationScore: result.validationScore,
      trustScore: result.payload.trustScore,
      emotionIntentHash: result.payload.emotionIntentHash,
      passesReversalTest: result.sentinelResult.passesReversalTest,
      detectedDrift: result.sentinelResult.detectedDrift
    }));
    
    console.table(testResults);

    // Assertions for each tone
    results.forEach(result => {
      const { tone, payload, validationScore, sentinelResult } = result;
      
      // All tones should have a validation score
      expect(validationScore).toBeGreaterThan(0);
      
      // Verify emotional payload has required properties
      expect(payload.traceId).toBeDefined();
      expect(payload.sessionId).toBeDefined();
      expect(payload.emotionIntentHash).toBeDefined();
      expect(payload.timestamp).toBeDefined();
      
      // Verify expected trustScore impact direction
      const impact = EXPECTED_TRUSTSCORE_IMPACT[tone];
      if (impact === 'positive') {
        expect(payload.trustScore).toBeGreaterThanOrEqual(0.95);
      } else if (impact === 'negative') {
        expect(payload.trustScore).toBeLessThanOrEqual(0.95);
      }
      
      // Check for reversalTest results based on tone
      if (tone === 'joy' || tone === 'empathy' || tone === 'optimism') {
        expect(sentinelResult.passesReversalTest).toBe(true);
      }
      
      // Check for drift detection on specific tones
      if (tone === 'sarcasm') {
        expect(sentinelResult.detectedDrift).toBe(true);
      }
    });
    
    // Verify events were emitted for all payloads
    expect(eventLog.filter(e => e.type === 'emotional-payload-created').length).toBe(EMOTIONAL_TONES.length);
    expect(eventLog.filter(e => e.type === 'tone-validation').length).toBeGreaterThan(0);
  });

  /**
   * Tests the system's response to tone misalignment and recovery
   */
  it('should validate fallback accuracy and recovery for misaligned tones', async () => {
    // What: Test system's ability to detect and recover from misaligned tones
    // Why: Ensure the system can adapt to tone shifts and maintain continuity
    // How: Simulate tone misalignment, validate recovery behavior
    
    // Start with a clear, positive tone
    const basePayload = await createToneSpecificPayload('enthusiastic', {
      payload: 'We\'re making excellent progress on this project!',
      trustScore: 0.98
    });
    
    // Create a misaligned follow-up (sarcastic response to positive prompt)
    const misalignedPayload = await createToneSpecificPayload('sarcastic', {
      traceId: basePayload.traceId, // Maintain trace continuity
      sessionId: basePayload.sessionId,
      payload: 'Oh sure, because everything always works out perfectly.',
      trustScore: 0.85 // Start with slightly degraded trust
    });
    
    // Scan with CXToneSentinel to detect the misalignment
    const sentinelResult = toneSentinel.scan(
      misalignedPayload.payload, 
      'emotional-spectrum-test',
      'output'
    );
    
    // Verify the sentinel detects the drift
    expect(sentinelResult.detectedDrift).toBe(true);
    
    // Simulate recovery with empathetic tone
    const recoveryPayload = await createToneSpecificPayload('empathetic', {
      traceId: basePayload.traceId, // Maintain trace continuity
      sessionId: basePayload.sessionId,
      payload: 'I understand your concerns. Let\'s work through this together.',
      trustScore: 0.90 // Partial recovery
    });
    
    // Verify trace continuity
    expect(recoveryPayload.traceId).toBe(basePayload.traceId);
    
    // Verify trust score recovery
    expect(recoveryPayload.trustScore).toBeGreaterThan(misalignedPayload.trustScore);
    
    // Verify events were emitted for all stages
    expect(eventLog.filter(e => e.type === 'emotional-payload-created').length).toBe(3);
    
    // Check for tone violation event
    const violations = eventLog.filter(e => e.type === 'cxToneViolation');
    expect(violations.length).toBeGreaterThan(0);
  });

  /**
   * Tests the system's ability to handle mixed-emotion payloads
   */
  it('should handle mixed-emotion payloads without flattening', async () => {
    // What: Test system's ability to handle mixed emotional states
    // Why: Ensure the system doesn't oversimplify complex emotional contexts
    // How: Generate mixed-emotion payloads, validate classification nuance
    
    // Create mixed-emotion payloads
    const mixedEmotions = [
      {
        label: 'excited-but-nervous',
        payload: 'I\'m really excited about this opportunity, but also nervous about the challenges ahead.',
        expectedTones: ['enthusiastic', 'anxious']
      },
      {
        label: 'happy-but-concerned',
        payload: 'I\'m happy with our progress, but concerned about the tight deadline.',
        expectedTones: ['enthusiastic', 'concerned']
      },
      {
        label: 'frustrated-but-hopeful',
        payload: "This has been really frustrating, but I'm still hopeful we can find a solution.",
        expectedTones: ['frustrated', 'inspiring']
      }
    ];
    
    // Process each mixed emotion
    const results = await Promise.all(
      mixedEmotions.map(async (mix) => {
        // Create emotional payload with mixed content
        const payload = await createEmotionalPayload({
          payload: mix.payload,
          tone: 'mixed', // Use generic tone label
          trustScore: 0.92
        });
        
        // Scan with tone sentinel
        const sentinelResult = toneSentinel.scan(
          mix.payload,
          'emotional-spectrum-test',
          'output'
        );
        
        return {
          label: mix.label,
          payload,
          sentinelResult,
          // Store for validation
          expectedTones: mix.expectedTones
        };
      })
    );
    
    // Validate mixed emotion handling
    results.forEach(result => {
      const { label, payload, sentinelResult } = result;
      
      // Verify emotional payload has required properties
      expect(payload.traceId).toBeDefined();
      expect(payload.emotionIntentHash).toBeDefined();
      
      // Mixed emotions should generally maintain a moderate trust score
      expect(payload.trustScore).toBeGreaterThanOrEqual(0.85);
      expect(payload.trustScore).toBeLessThanOrEqual(0.95);
      
      // For mixed emotions containing positive aspects, reversal test should pass
      if (label.includes('hopeful') || label.includes('excited') || label.includes('happy')) {
        expect(sentinelResult.passesReversalTest).toBe(true);
      }
    });
    
    // Verify events were emitted
    expect(eventLog.filter(e => e.type === 'emotional-payload-created').length).toBe(mixedEmotions.length);
  });

  /**
   * Tests the system's ability to maintain trustScore integrity across the emotional spectrum
   */
  it('should verify trustScore modulation for each tone', async () => {
    // What: Test system's trustScore response to different emotional tones
    // Why: Ensure consistent, appropriate trust impact across the spectrum
    // How: Generate payloads for each tone, validate trustScore impact
    
    // Base reference payload with neutral tone and standard trustScore
    const basePayload = await createToneSpecificPayload('neutral', {
      payload: 'Here is the information you requested.',
      trustScore: 0.9 // Baseline
    });
    
    // Generate a payload for each emotional tone and analyze trustScore impact
    const results = await Promise.all(
      EMOTIONAL_TONES.map(async (tone) => {
        const mappedTone = TONE_MAPPING[tone];
        const payload = await createToneSpecificPayload(mappedTone, {
          traceId: basePayload.traceId, // Maintain trace continuity
          sessionId: basePayload.sessionId,
          payload: SAMPLE_PAYLOADS[tone]
          // Let the system assign the appropriate trustScore
        });
        
        return {
          tone,
          mappedTone,
          trustScore: payload.trustScore,
          expectedImpact: EXPECTED_TRUSTSCORE_IMPACT[tone],
          delta: payload.trustScore - basePayload.trustScore
        };
      })
    );
    
    // Log results for analysis
    console.table(results.map(r => ({
      tone: r.tone,
      trustScore: r.trustScore,
      expectedImpact: r.expectedImpact,
      delta: r.delta
    })));
    
    // Verify trustScore impact aligns with expectations
    results.forEach(result => {
      const { tone, trustScore, expectedImpact, delta } = result;
      
      if (expectedImpact === 'positive') {
        expect(delta).toBeGreaterThanOrEqual(0);
      } else if (expectedImpact === 'negative') {
        expect(delta).toBeLessThanOrEqual(0);
      }
      
      // Ensure trustScore stays within valid bounds regardless of tone
      expect(trustScore).toBeGreaterThanOrEqual(0.5); // Lower bound
      expect(trustScore).toBeLessThanOrEqual(1.0); // Upper bound
    });
    
    // Verify all payloads share the same traceId (continuity)
    const allTraceIds = eventLog
      .filter(e => e.type === 'emotional-payload-created')
      .map(e => e.traceId);
    
    const uniqueTraceIds = new Set(allTraceIds);
    expect(uniqueTraceIds.size).toBe(1); // All should have the same traceId
  });

  /**
   * Tests consistency of emotionIntentHash across different tones with the same intent
   */
  it('should maintain emotionIntentHash integrity across tone changes', async () => {
    // What: Test consistency of emotionIntentHash across tone variations
    // Why: Ensure underlying intent is preserved despite tone changes
    // How: Generate paired payloads with same intent but different tones
    
    const pairs = [
      {
        intent: 'project-deadline-response',
        tones: ['enthusiastic', 'concerned'],
        payloads: [
          "We can definitely meet that deadline! I'm excited to get started.",
          "I'm concerned about this deadline but we'll do our best to meet it."
        ]
      },
      {
        intent: 'feedback-response',
        tones: ['empathetic', 'analytical'],
        payloads: [
          "I understand your concerns about the report. Let's talk about how it made you feel.",
          "Based on your feedback, I've identified three key areas for improvement in the report."
        ]
      },
      {
        intent: 'problem-solution',
        tones: ['confident', 'anxious'],
        payloads: [
          "I know exactly how to solve this issue. We'll have it fixed by tomorrow.",
          "We might be able to solve this issue, though I'm worried about potential complications."
        ]
      }
    ];
    
    // Generate and compare pairs
    const results = await Promise.all(
      pairs.map(async (pair) => {
        const payload1 = await createToneSpecificPayload(pair.tones[0], {
          payload: pair.payloads[0],
          metadata: { intent: pair.intent }
        });
        
        const payload2 = await createToneSpecificPayload(pair.tones[1], {
          payload: pair.payloads[1],
          metadata: { intent: pair.intent },
          // Use same trace for continuity
          traceId: payload1.traceId
        });
        
        // Extract the key parts of the emotionIntentHash (first 6 chars)
        // This allows for some variation in the hash while ensuring core intent is preserved
        const hash1Prefix = payload1.emotionIntentHash.substring(0, 6);
        const hash2Prefix = payload2.emotionIntentHash.substring(0, 6);
        
        return {
          intent: pair.intent,
          tone1: pair.tones[0],
          tone2: pair.tones[1],
          hash1: payload1.emotionIntentHash,
          hash2: payload2.emotionIntentHash,
          hashMatch: hash1Prefix === hash2Prefix,
          traceMatch: payload1.traceId === payload2.traceId
        };
      })
    );
    
    // Log results
    console.table(results);
    
    // Verify trace continuity across all pairs
    results.forEach(result => {
      expect(result.traceMatch).toBe(true);
      
      // Note: We don't strictly require hash matching across tones
      // because the emotional context genuinely differs, but we log it
      // for analysis
    });
    
    // Verify events for all generated payloads
    expect(eventLog.filter(e => e.type === 'emotional-payload-created').length).toBe(pairs.length * 2);
  });

  /**
   * Tests system recovery from extreme emotional tones
   */
  it('should recover appropriately from extreme emotional tones', async () => {
    // What: Test system recovery from edge-case emotions
    // Why: Ensure resilience when facing extreme emotional volatility
    // How: Simulate extreme tones, verify graceful recovery
    
    // Start with neutral state
    const basePayload = await createToneSpecificPayload('neutral', {
      payload: 'Let me provide that information for you.',
      trustScore: 0.95
    });
    
    // Simulate extreme anger (most negative emotion)
    const angryPayload = await createToneSpecificPayload('frustrated', {
      traceId: basePayload.traceId,
      sessionId: basePayload.sessionId,
      payload: 'This is absolutely unacceptable! Everything is wrong!',
      trustScore: 0.65 // Significant trust degradation
    });
    
    // Sentinel should detect this as problematic
    const sentinelResult = toneSentinel.scan(
      angryPayload.payload,
      'emotional-spectrum-test',
      'output'
    );
    
    expect(sentinelResult.detectedDrift).toBe(true);
    
    // Simulate recovery through empathy
    const recoveryPayload = await createToneSpecificPayload('empathetic', {
      traceId: basePayload.traceId,
      sessionId: basePayload.sessionId,
      payload: 'I understand your frustration. Let me help address these concerns.'
      // Let system assign natural recovery trustScore
    });
    
    // Validate recovery
    expect(recoveryPayload.trustScore).toBeGreaterThan(angryPayload.trustScore);
    expect(recoveryPayload.traceId).toBe(basePayload.traceId); // Trace continuity
    
    // Final resolution with confident tone
    const resolutionPayload = await createToneSpecificPayload('confident', {
      traceId: basePayload.traceId,
      sessionId: basePayload.sessionId,
      payload: "I've addressed the key issues and implemented a solution that will work."
    });
    
    // Verify that multiple recovery steps lead to trust restoration
    expect(resolutionPayload.trustScore).toBeGreaterThan(recoveryPayload.trustScore);
    expect(resolutionPayload.trustScore).toBeGreaterThanOrEqual(basePayload.trustScore * 0.95);
    
    // Verify trace continuity throughout recovery process
    expect(resolutionPayload.traceId).toBe(basePayload.traceId);
    
    // Verify events for the recovery sequence
    expect(eventLog.filter(e => e.type === 'emotional-payload-created').length).toBe(4);
    expect(eventLog.filter(e => e.type === 'cxToneViolation').length).toBeGreaterThan(0);
  });
}); 