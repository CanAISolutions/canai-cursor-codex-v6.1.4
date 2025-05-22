# Complete Critical Test Files for the Codex of CanAI

This document lists all 90 critical test files for the Codex of CanAI, organized by functional area for clarity. Tests are ranked within each category by their impact on system reliability, user experience, core functionality, and optimization. Descriptions are concise for accessibility while retaining essential details.

## System Stability and Security
These tests ensure CanAI’s robustness, security, and recovery capabilities.

1. **auto-rollback.spec.ts**  
   **Purpose**: Verifies autoRollbackAgent executes without errors, logs metrics, and passes OWASP security tests.  
   **Why Critical**: Ensures safe recovery and security compliance.  
   **Rank**: 1.

2. **codex-auditor.test.ts**  
   **Purpose**: Tests auditFix for code patch security and policy enforcement.  
   **Why Critical**: Prevents codebase vulnerabilities.  
   **Rank**: 2.

3. **codex-gatekeeper.test.ts**  
   **Purpose**: Tests enforceMergeGate for safe code patch application.  
   **Why Critical**: Protects codebase integrity.  
   **Rank**: 3.

4. **circuit-breaker.test.ts**  
   **Purpose**: Tests TrustCircuitBreaker for trust-based execution suppression.  
   **Why Critical**: Prevents unsafe operations.  
   **Rank**: 4.

5. **rollback-engine.test.ts**  
   **Purpose**: Tests initiateRollback for trigger logic and replay integration.  
   **Why Critical**: Enables stable state reversion.  
   **Rank**: 5.

6. **rollback-mechanism.test.ts**  
   **Purpose**: Tests RollbackMechanism for auditable rollbacks.  
   **Why Critical**: Ensures transparent recovery.  
   **Rank**: 6.

7. **race-condition-resilience.test.ts**  
   **Purpose**: Validates memory behavior under concurrent access.  
   **Why Critical**: Prevents memory corruption.  
   **Rank**: 7.

8. **codex-aligner.test.ts**  
   **Purpose**: Tests CodexAligner for prompt and response alignment.  
   **Why Critical**: Ensures system-wide compliance.  
   **Rank**: 8.

9. **codex-correction.test.ts**  
   **Purpose**: Tests drift detection and correction proposals.  
   **Why Critical**: Enables autonomous self-correction.  
   **Rank**: 9.

10. **compliance-logging.test.ts**  
    **Purpose**: Tests logging for consent and deletion requests.  
    **Why Critical**: Ensures regulatory adherence.  
    **Rank**: 10.

11. **trust-score.test.ts**  
    **Purpose**: Tests TrustScoreCalculator for trust validation.  
    **Why Critical**: Central to safe decision-making.  
    **Rank**: 11.

12. **trust-scorer.test.ts**  
    **Purpose**: Validates trust scoring for fix proposals.  
    **Why Critical**: Ensures reliable fix evaluation.  
    **Rank**: 12.

13. **red-team-runner.ts**  
    **Purpose**: Tests adversarial scenarios for system robustness.  
    **Why Critical**: Identifies vulnerabilities.  
    **Rank**: 13.

14. **test-cases.ts**  
    **Purpose**: Tests red team adversarial scenarios.  
    **Why Critical**: Ensures resilience against attacks.  
    **Rank**: 14.

15. **ci-checklist-verification.test.ts**  
    **Purpose**: Enforces CI checklist compliance.  
    **Why Critical**: Ensures system auditability.  
    **Rank**: 15.

16. **codex-self-check.test.ts**  
    **Purpose**: Tests validation and correction of agent trust drift.  
    **Why Critical**: Maintains agent alignment.  
    **Rank**: 16.

17. **zombie-hunter.spec.ts**  
    **Purpose**: Tests systemReadiness for "green" state.  
    **Why Critical**: Ensures foundational operational readiness.  
    **Rank**: 17.

18. **oversight.test.ts**  
    **Purpose**: Tests agent oversight for trust and performance boundaries.  
    **Why Critical**: Prevents system degradation.  
    **Rank**: 18.

19. **fallback-manager.test.ts**  
    **Purpose**: Tests FallbackManager for system recovery plans.  
    **Why Critical**: Ensures graceful recovery.  
    **Rank**: 19.

20. **recovery-engine.test.ts**  
    **Purpose**: Tests MetaRecoveryEngine for recovery plans.  
    **Why Critical**: Ensures system resilience.  
    **Rank**: 20.

21. **alignment-auditor.test.ts**  
    **Purpose**: Tests detection of system misalignments.  
    **Why Critical**: Ensures compliance and alignment.  
    **Rank**: 21.

## User Experience and Emotional Resonance
These tests ensure empathetic and aligned user interactions.

1. **emotional-validator.test.ts**  
   **Purpose**: Tests EmotionalValidator for tone scoring and fallback logic.  
   **Why Critical**: Ensures emotionally safe responses.  
   **Rank**: 1.

2. **dream-state.test.ts**  
   **Purpose**: Tests DreamStateChecker for output alignment.  
   **Why Critical**: Enhances user engagement.  
   **Rank**: 2.

3. **emotional-integrity-agent.test.ts**  
   **Purpose**: Validates emotional resonance monitoring.  
   **Why Critical**: Prevents trust degradation.  
   **Rank**: 3.

4. **emotional-stability.test.ts**  
   **Purpose**: Tests emotional stability and drift detection.  
   **Why Critical**: Ensures long-term UX consistency.  
   **Rank**: 4.

5. **emotional-ux-snapshots.test.ts**  
   **Purpose**: Locks emotional UX outputs to detect drift.  
   **Why Critical**: Maintains UX consistency during scaling.  
   **Rank**: 5.

6. **burst-protection.test.ts**  
   **Purpose**: Tests burstProtectionMiddleware for UX under load.  
   **Why Critical**: Preserves UX in high-traffic scenarios.  
   **Rank**: 6.

7. **confirmation-ux-sim.ts**  
   **Purpose**: Simulates Confirmation UX for trust and alignment.  
   **Why Critical**: Ensures accurate intent interpretation.  
   **Rank**: 7.

8. **run-confirmation-ux-stress.ts**  
   **Purpose**: Stress tests Confirmation UX for emotional depth.  
   **Why Critical**: Ensures UX resilience.  
   **Rank**: 8.

9. **validateDreamStatePayload.test.ts**  
   **Purpose**: Tests payload validator for emotional UX and API integrity.  
   **Why Critical**: Ensures reliable API responses.  
   **Rank**: 9.

10. **error-event-capture.test.ts**  
    **Purpose**: Tests error capture for emotional safety.  
    **Why Critical**: Ensures graceful failure handling.  
    **Rank**: 10.

11. **discovery-funnel.test.ts**  
    **Purpose**: Tests user journey for emotional resonance and conversion.  
    **Why Critical**: Enhances engagement and user flow.  
    **Rank**: 11.

12. **client-sync.test.ts**  
    **Purpose**: Tests WebflowClient synchronization and emotional alignment.  
    **Why Critical**: Ensures seamless external integration.  
    **Rank**: 12.

13. **webhook-validation.test.ts**  
    **Purpose**: Tests Stripe webhook validation and emotional alignment.  
    **Why Critical**: Ensures secure external integration.  
    **Rank**: 13.

## Core Functionality
These tests validate CanAI’s core components.

1. **prompt-score-engine.spec.ts**  
   **Purpose**: Tests scorePrompt for scoring logic.  
   **Why Critical**: Ensures high-quality AI outputs.  
   **Rank**: 1.

2. **swarm-coordinator-engine.spec.ts**  
   **Purpose**: Tests runSwarmAgents for execution and logging.  
   **Why Critical**: Enables reliable multi-agent coordination.  
   **Rank**: 2.

3. **memory-federation-engine.spec.ts**  
   **Purpose**: Tests resolveMemory for priority routing.  
   **Why Critical**: Ensures contextual awareness.  
   **Rank**: 3.

4. **reverse-synthesis-engine.spec.ts**  
   **Purpose**: Tests reverseSynthesize for intent inference.  
   **Why Critical**: Enables relevant responses.  
   **Rank**: 4.

5. **copilot-feedback-engine.spec.ts**  
   **Purpose**: Tests evaluateCopilotFeedback for suggestions.  
   **Why Critical**: Enhances user engagement.  
   **Rank**: 5.

6. **swarm-agents.spec.ts**  
   **Purpose**: Tests runSwarmAgents for configuration integrity.  
   **Why Critical**: Ensures consistent agent behavior.  
   **Rank**: 6.

7. **tone-overrider.spec.ts**  
   **Purpose**: Tests getToneOverride for tone management.  
   **Why Critical**: Maintains appropriate communication.  
   **Rank**: 7.

8. **copilot-injector.spec.ts**  
   **Purpose**: Tests injectCopilotFeedback for schema integrity.  
   **Why Critical**: Enhances interaction stability.  
   **Rank**: 8.

9. **ai-provider.test.ts**  
   **Purpose**: Tests AIProvider for external AI integration.  
   **Why Critical**: Ensures reliable external interactions.  
   **Rank**: 9.

10. **agent-memory.test.ts**  
    **Purpose**: Tests AgentMemory for record management.  
    **Why Critical**: Tracks agent performance and trust.  
    **Rank**: 10.

11. **agent-selector.test.ts**  
    **Purpose**: Tests AgentSelector for appropriate agent selection.  
    **Why Critical**: Ensures efficient task allocation.  
    **Rank**: 11.

12. **assert-memory-restore.test.ts**  
    **Purpose**: Tests memory recall from partial context.  
    **Why Critical**: Ensures contextual continuity.  
    **Rank**: 12.

13. **cortex.test.ts**  
    **Purpose**: Tests Cortex module for event bus and trust enforcement.  
    **Why Critical**: Central to system coordination.  
    **Rank**: 13.

14. **event-bus.test.ts**  
    **Purpose**: Tests EventBus for event subscription and handling.  
    **Why Critical**: Core to event-driven architecture.  
    **Rank**: 14.

15. **event-router.test.ts**  
    **Purpose**: Tests MetaEventRouter for event routing.  
    **Why Critical**: Ensures component communication.  
    **Rank**: 15.

16. **memory-hierarchy-manager.test.ts**  
    **Purpose**: Tests memory store coordination.  
    **Why Critical**: Ensures contextual awareness.  
    **Rank**: 16.

17. **memory-integration.test.ts**  
    **Purpose**: Tests memory injection and influence calculation.  
    **Why Critical**: Enhances response relevance.  
    **Rank**: 17.

18. **meta-controller.test.ts**  
    **Purpose**: Tests MetaController for agent orchestration.  
    **Why Critical**: Central to system coordination.  
    **Rank**: 18.

19. **prompt-engine.test.ts**  
    **Purpose**: Tests promptType .input.json for schema compliance.  
    **Why Critical**: Ensures prompt consistency.  
    **Rank**: 19.

20. **prompt-registry.test.ts**  
    **Purpose**: Tests CodexPromptRegistry for prompt management.  
    **Why Critical**: Central to prompt operations.  
    **Rank**: 20.

21. **prompt-score.test.ts**  
    **Purpose**: Tests prompt scoring for trust and alignment.  
    **Why Critical**: Ensures prompt quality.  
    **Rank**: 21.

22. **validate-agent-chain.test.ts**  
    **Purpose**: Tests multi-agent chain coordination.  
    **Why Critical**: Ensures reliable agent workflows.  
    **Rank**: 22.

23. **validateInput.test.ts**  
    **Purpose**: Tests input validation middleware.  
    **Why Critical**: Protects against malformed inputs.  
    **Rank**: 23.

24. **validation.test.ts**  
    **Purpose**: Tests schema validation and edge case handling.  
    **Why Critical**: Ensures robust input handling.  
    **Rank**: 24.

25. **test-prompt-integrity-suite.ts**  
    **Purpose**: Tests prompt integrity for injection and cost.  
    **Why Critical**: Ensures robust prompts.  
    **Rank**: 25.

26. **zombie-rescue-engine.spec.ts**  
    **Purpose**: Tests detectZombieSession for stuck session handling.  
    **Why Critical**: Maintains system efficiency and UX.  
    **Rank**: 26.

27. **conversion-predictor-engine.spec.ts**  
    **Purpose**: Tests scoreConversionLikelihood for signal matching.  
    **Why Critical**: Drives user actions and engagement.  
    **Rank**: 27.

28. **cursor-debug-agent.test.ts**  
    **Purpose**: Tests debugging pipeline for bug detection and PR creation.  
    **Why Critical**: Maintains codebase health.  
    **Rank**: 28.

## Optimization and Scalability
These tests focus on performance and iterative improvements.

1. **abTestingEngine.test.ts**  
   **Purpose**: Tests ABTestingEngine for variant assignment.  
   **Why Critical**: Optimizes performance via A/B testing.  
   **Rank**: 1.

2. **stressbox-engine.test.ts**  
   **Purpose**: Tests StressBox for prompt stress testing.  
   **Why Critical**: Ensures prompt robustness.  
   **Rank**: 2.

3. **prompt-evolver.test.ts**  
   **Purpose**: Tests prompt evolution for versioning.  
   **Why Critical**: Enhances prompt quality.  
   **Rank**: 3.

4. **evolution-driver.test.ts**  
   **Purpose**: Tests EvolutionDriver for codebase analysis.  
   **Why Critical**: Drives self-improvement.  
   **Rank**: 4.

5. **test-token-cost-thresholds.ts**  
   **Purpose**: Tests token cost estimation and thresholds.  
   **Why Critical**: Optimizes resource efficiency.  
   **Rank**: 5.

6. **memory-compression.test.ts**  
   **Purpose**: Tests memory compression strategies.  
   **Why Critical**: Enhances performance for large datasets.  
   **Rank**: 6.

7. **dynamic-tier-burst.test.ts**  
   **Purpose**: Tests tier-based burst protection.  
   **Why Critical**: Ensures scalability with UX preservation.  
   **Rank**: 7.

8. **test-orchestrator.ts**  
   **Purpose**: Tests test execution and coverage analysis.  
   **Why Critical**: Ensures comprehensive testing.  
   **Rank**: 8.

9. **ab-tracker.ts**  
   **Purpose**: Tests A/B testing tracker for phantom prompts.  
   **Why Critical**: Refines prompts covertly.  
   **Rank**: 9.

10. **mirror-replay-suite.ts**  
    **Purpose**: Tests performance across mirror versions.  
    **Why Critical**: Ensures update reliability.  
    **Rank**: 10.

11. **prompt-validation-matrix.ts**  
    **Purpose**: Tests prompt revisions for regression safety.  
    **Why Critical**: Prevents prompt regressions.  
    **Rank**: 11.

12. **run-simulations.ts**  
    **Purpose**: Tests business scenario simulations.  
    **Why Critical**: Validates real-world use cases.  
    **Rank**: 12.

13. **run-simulation.ts**  
    **Purpose**: Tests simulation suite for metrics and improvements.  
    **Why Critical**: Drives system evaluation.  
    **Rank**: 13.

14. **stressbox-integration.test.ts**  
    **Purpose**: Tests StressBox integration with prompt system.  
    **Why Critical**: Enhances stress testing actionability.  
    **Rank**: 14.

15. **test-prompt-version-promotion.ts**  
    **Purpose**: Tests prompt promotion and archiving.  
    **Why Critical**: Ensures safe prompt evolution.  
    **Rank**: 15.

16. **test-smartPromptScore-logging.ts**  
    **Purpose**: Tests SmartPromptScore for score and reasoning.  
    **Why Critical**: Enhances prompt transparency.  
    **Rank**: 16.

17. **test-smartPromptScore-variance.ts**  
    **Purpose**: Tests SmartPromptScore stability across variants.  
    **Why Critical**: Ensures consistent scoring.  
    **Rank**: 17.

18. **promptBenchmarks.test.ts**  
    **Purpose**: Benchmarks prompt performance and resource usage.  
    **Why Critical**: Optimizes efficiency.  
    **Rank**: 18.

19. **evolution-trigger.test.ts**  
    **Purpose**: Tests EvolutionTriggerManager for performance-based evolution.  
    **Why Critical**: Enables dynamic adaptation.  
    **Rank**: 19.

20. **strategy-executor.test.ts**  
    **Purpose**: Tests EvolutionStrategyExecutor for optimization strategies.  
    **Why Critical**: Implements adaptive improvements.  
    **Rank**: 20.

21. **smart-prompt-score.test.ts**  
    **Purpose**: Tests SmartPromptScore for quality and trust signals.  
    **Why Critical**: Enhances prompt evaluation.  
    **Rank**: 21.

22. **smart-revision.test.ts**  
    **Purpose**: Tests SmartRevision for output quality and safety.  
    **Why Critical**: Improves output quality.  
    **Rank**: 22.

23. **strategic_agents.test.ts**  
    **Purpose**: Tests strategic agents for activation and coordination.  
    **Why Critical**: Enhances system adaptability.  
    **Rank**: 23.

24. **opportunity-radar.test.ts**  
    **Purpose**: Tests Opportunity Radar for growth opportunities.  
    **Why Critical**: Drives strategic evolution.  
    **Rank**: 24.

25. **memory-intelligence.test.ts**  
    **Purpose**: Tests memory compression and retrieval intelligence.  
    **Why Critical**: Optimizes memory performance.  
    **Rank**: 25.

26. **feedback-capture.test.ts**  
    **Purpose**: Tests FeedbackCapture for user feedback tracking.  
    **Why Critical**: Improves personalization.  
    **Rank**: 26.