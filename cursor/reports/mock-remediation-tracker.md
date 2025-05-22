# DreamState Mock Remediation Tracker

> **Purpose:** Eliminate all canonical mocks from DreamState tests, enforce real system-bound validation, and ensure production readiness for CanAI launch and Ideal CX Thread.

| Test File | Mock(s) Used | Real Logic/Builder to Inject | Status | Blockers | Notes | Emotional Volatility | Agent Workflow Realism | Multilingual/Accessibility | Security Edge Cases | Snapshot Integrity | Mutation Tested | Audit/Trace | CI/CD Gate | Operator Feedback | Codex Safeguard |
|-----------|--------------|-----------------------------|--------|----------|-------|---------------------|-----------------------|---------------------------|---------------------|-------------------|-----------------|-------------|------------|------------------|-----------------|
| tests/dreamstate/ab-emotion-parity.test.ts | mockEmotionalPayload | createEmotionalPayload (real) | Not Started | None | Must validate real emotional parity | (Y/N/Must validate real emotional parity) | (Y/N/Hardcoded agent sequence, not runtime) | (Y/N/Locale parity must be runtime) | (Y/N/Tone parity must be runtime) | (Y/N/Span gap must be runtime) | (Y/N/Metrics must be runtime) | (Y/N/Forward compat must be runtime) | (Y/N/Rate limit must be runtime) | (Y/N/Sarcasm detection must be runtime) | (Y/N/Backward compat must be runtime) | (Y/N/Migration must be runtime) | (Y/N/Sanitization must be runtime) | (Y/N/Approval must be runtime) | (Y/N/Race must be runtime) | (Y/N/Key rotation must be runtime) | (Y/N/Trust restore must be runtime) | (Y/N/Unrecoverable drop must be runtime) | (Y/N/TrustScoreValidator needed) | (Y/N/AgentOrchestrator needed) | (Y/N/Agent workflow must be runtime) | (Y/N/Drift must be runtime) |
| Test File | Mock(s) Used | Real Logic/Builder to Inject | Status | Blockers | Notes |
|-----------|--------------|-----------------------------|--------|----------|-------|
| tests/dreamstate/ab-emotion-parity.test.ts | mockEmotionalPayload | createEmotionalPayload (real) | Not Started | None | Must validate real emotional parity |
| tests/dreamstate/agent-workflow-sequencing.test.ts | mockAgentWorkflow, requireMock | AgentOrchestrator (real) | Not Started | AgentOrchestrator needed | Hardcoded agent sequence, not runtime |
| tests/dreamstate/chaos-agent-outage.test.ts | mockAgentWorkflow, requireMock | AgentOrchestrator (real) | Not Started | AgentOrchestrator needed | Chaos fallback must be real |
| tests/dreamstate/chaos-disk-failure.test.ts | mockEmotionalPayload, requireMock | TrustScoreValidator (real) | Not Started | TrustScoreValidator needed | Disk failure must trigger real recovery |
| tests/dreamstate/chaos-network-failure.test.ts | mockChaosNetworkFailure, requireMock | NetworkMonitor (real) | Not Started | NetworkMonitor needed | Network chaos must be runtime |
| tests/dreamstate/decay-prevention-suite.test.ts | mockEmotionalPayload, requireMock | EmotionalIntelligenceAgent (real) | Not Started | EmotionalIntelligenceAgent needed | Detect real emotional decay |
| tests/dreamstate/emotional-spectrum-coverage.test.ts | mockEmotionalPayload, requireMock | EmotionalValidator (real) | Not Started | EmotionalValidator needed | Validate real spectrum |
| tests/dreamstate/emotional-ux-core.test.ts | createEmotionalPayload | createEmotionalPayload (real) | In Progress | None | Builder must be runtime-valid |
| tests/dreamstate/fallback-cascade-integrity.test.ts | mockFallbackChain, requireMock | FallbackManager (real) | Not Started | FallbackManager needed | Cascade must be emergent |
| tests/dreamstate/fallback-contamination-sandbox.test.ts | mockFallbackChain, requireMock | FallbackManager (real) | Not Started | FallbackManager needed | Contamination must be runtime |
| tests/dreamstate/fallback-cross-talk.test.ts | mockFallbackChain, requireMock | FallbackManager (real) | Not Started | FallbackManager needed | Cross-talk must be runtime |
| tests/dreamstate/fallback-depth-limit.test.ts | mockFallbackChain, requireMock | FallbackManager (real) | Not Started | FallbackManager needed | Depth limit must be enforced live |
| tests/dreamstate/fallback-nesting-integrity.test.ts | mockFallbackChain, requireMock | FallbackManager (real) | Not Started | FallbackManager needed | Nesting must be runtime |
| tests/dreamstate/golden-emotion-snapshot.test.ts | createEmotionalPayload | createEmotionalPayload (real) | In Progress | None | Snapshot must be real, not static |
| tests/dreamstate/locale-translation-accuracy.test.ts | mockEmotionalPayload, requireMock | EmotionalValidator (real) | Not Started | EmotionalValidator needed | Locale parity must be runtime |
| tests/dreamstate/multi-locale-tone-parity.test.ts | mockEmotionalPayload, requireMock | EmotionalValidator (real) | Not Started | EmotionalValidator needed | Tone parity must be runtime |
| tests/dreamstate/open-telemetry-span-gap.test.ts | mockEmotionalPayload, requireMock | TelemetrySpanManager (real) | Not Started | TelemetrySpanManager needed | Span gap must be runtime |
| tests/dreamstate/performance-baseline.test.ts | mockEmotionalPayload, requireMock | PerformanceMonitor (real) | Not Started | PerformanceMonitor needed | Metrics must be runtime |
| tests/dreamstate/prompt-forward-compat.test.ts | mockEmotionalPayload, requireMock | PromptSchemaManager (real) | Not Started | PromptSchemaManager needed | Forward compat must be runtime |
| tests/dreamstate/rate-limit-message-wrapper.test.ts | mockEmotionalPayload, requireMock | RateLimitManager (real) | Not Started | RateLimitManager needed | Rate limit must be runtime |
| tests/dreamstate/sarcasm-tone-misclassify.test.ts | mockEmotionalPayload, requireMock | EmotionalValidator (real) | Not Started | EmotionalValidator needed | Sarcasm detection must be runtime |
| tests/dreamstate/schema-backward-compat.test.ts | mockEmotionalPayload, requireMock | SchemaManager (real) | Not Started | SchemaManager needed | Backward compat must be runtime |
| tests/dreamstate/schema-migration-emotion.test.ts | mockEmotionalPayload, requireMock | SchemaManager (real) | Not Started | SchemaManager needed | Migration must be runtime |
| tests/dreamstate/security-input-sanitization.test.ts | mockMaliciousInput, requireMock | InputSanitizer (real) | Not Started | InputSanitizer needed | Sanitization must be runtime |
| tests/dreamstate/snapshot-approval-gate.test.ts | mockEmotionalPayload, requireMock | SnapshotManager (real) | Not Started | SnapshotManager needed | Approval must be runtime |
| tests/dreamstate/snapshot-duplicate-race.test.ts | mockEmotionalPayload, requireMock | SnapshotManager (real) | Not Started | SnapshotManager needed | Race must be runtime |
| tests/dreamstate/snapshot-key-rotation.test.ts | mockEmotionalPayload, requireMock | SnapshotManager (real) | Not Started | SnapshotManager needed | Key rotation must be runtime |
| tests/dreamstate/system-resilience-core.test.ts | buildFallbackChain, createEmotionalPayload | buildFallbackChain, createEmotionalPayload (real) | In Progress | None | Must validate real fallback and recovery |
| tests/dreamstate/traceid-continuity.test.ts | mockEmotionalPayload, requireMock | TraceManager (real) | Not Started | TraceManager needed | Trace continuity must be runtime |
| tests/dreamstate/traceid-failure-recovery.test.ts | mockEmotionalPayload, requireMock | TraceManager (real) | Not Started | TraceManager needed | Failure recovery must be runtime |
| tests/dreamstate/trust-restore-post-coldstart.test.ts | mockEmotionalPayload, requireMock | TrustScoreManager (real) | Not Started | TrustScoreManager needed | Trust restore must be runtime |
| tests/dreamstate/trustscore-unrecoverable-drop.test.ts | mockEmotionalPayload, requireMock | TrustScoreManager (real) | Not Started | TrustScoreManager needed | Unrecoverable drop must be runtime |
| tests/dreamstate/agent-workflow-sequencing.test.ts | mockAgentWorkflow, requireMock | AgentOrchestrator (real) | Not Started | AgentOrchestrator needed | Agent workflow must be runtime |
| tests/dreamstate/chaos-emotional-drift.test.ts | createEmotionalPayload | createEmotionalPayload (real) | In Progress | None | Drift must be runtime | 