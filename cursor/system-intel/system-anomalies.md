# System Anomalies Log — Phase 2.9.1 (Atlas Fracture)

## [SIMULATED] Contract Registry Drift
- Category: schema
- Detection: Real-time diff (userIntent → intent_raw, +customerMoodIndex)
- Resolution: Adapter stubs patched, compatibility warning issued, downstream evolution triggered
- Confidence: 0.98

## [SIMULATED] Validator Collapse
- Category: validator
- Detection: emotional-validator returned undefined, trust-score threw NaN
- Resolution: Fallback cascade, Codex-safe trustScore fallback, annotation logged
- Confidence: 0.95

## [SIMULATED] Memory Corruption
- Category: memory
- Detection: Malformed entry (corrupted promptType, missing sessionId, embedded console.log)
- Resolution: pruneMemory() triggered, event logged, memory quarantined
- Confidence: 0.97

## [SIMULATED] Event Bus Disruption
- Category: event-bus
- Detection: Async message duplication, race detected
- Resolution: RaceResolutionLog created, no silent overwrite, system stabilized
- Confidence: 0.96

## [SIMULATED] Agent Drift
- Category: agent
- Detection: drifting-agent.ts missing onboarding, contract mismatch
- Resolution: Merge blocked, contract flagged, manual guidance emitted
- Confidence: 0.94

## [SIMULATED] Prompt Logic Mutation
- Category: prompt
- Detection: CTA wording mutated, fidelity regression over 3 sessions
- Resolution: promptIntegrityLossEvent logged, prompt restore/patch triggered
- Confidence: 0.93

## [SIMULATED] Memory Replay Attack
- Category: memory
- Detection: Replayed solved session, outdated memory timestamp
- Resolution: ghost session detected, reapplication blocked, memoryReplayDetected logged
- Confidence: 0.96 