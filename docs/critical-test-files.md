# Critical Test Files for the Codex of CanAI

This document provides a comprehensive, Codex-aligned overview of the 90 most critical test files for CanAI. Each test is mapped to its functional area, with a clear description of its importance to the Cursor Codex and the CanAI orchestration platform. This list is designed for clarity, auditability, and future-proofing of our emotional, trust, and operational standards.

---

## System Stability and Security
These tests ensure CanAI's robustness, security, and recovery capabilities. Each is essential for maintaining trust, compliance, and operational resilience.

1. **auto-rollback.spec.ts**  
   `cursor/accelerators/auto-rollback/auto-rollback.spec.ts`  
   _Ensures the autoRollbackAgent executes without errors, logs metrics, and passes OWASP security tests. Critical for safe recovery and security compliance._
2. **codex-auditor.test.ts**  
   `tests/codex-auditor.test.ts`  
   _Tests auditFix for code patch security and policy enforcement. Prevents codebase vulnerabilities._
3. **codex-gatekeeper.test.ts**  
   `tests/codex-gatekeeper.test.ts`  
   _Tests enforceMergeGate for safe code patch application. Protects codebase integrity._
4. **circuit-breaker.test.ts**  
   `cursor/rules/__tests__/circuit-breaker.test.ts`  
   _Tests TrustCircuitBreaker for trust-based execution suppression. Prevents unsafe operations._
5. **rollback-engine.test.ts**  
   `cursor/accelerators/auto-rollback/rollback-engine.test.ts`  
   _Tests initiateRollback for trigger logic and replay integration. Enables stable state reversion._
6. **rollback-mechanism.test.ts**  
   `tests/compliance/rollback-mechanism.test.ts`  
   _Tests RollbackMechanism for auditable rollbacks. Ensures transparent recovery._
7. **race-condition-resilience.test.ts**  
   `cursor/tests/race-condition-resilience.test.ts`  
   _Validates memory behavior under concurrent access. Prevents memory corruption._
8. **codex-aligner.test.ts**  
   `cursor/meta-control/codex-aligner.test.ts`  
   _Tests CodexAligner for prompt and response alignment. Ensures system-wide compliance._
9. **codex-correction.test.ts**  
   `cursor/codex-correction/__tests__/codex-correction.test.ts`  
   _Tests drift detection and correction proposals. Enables autonomous self-correction._
10. **compliance-logging.test.ts**  
   `tests/compliance/compliance-logging.test.ts`  
   _Tests logging for consent and deletion requests. Ensures regulatory adherence._
11. **trust-score.test.ts**  
   `cursor/validators/trust-score.test.ts`  
   _Tests TrustScoreCalculator for trust validation. Central to safe decision-making._
12. **trust-scorer.test.ts**  
   `cursor/agents/trust-scorer/trust-scorer.test.ts`  
   _Validates trust scoring for fix proposals. Ensures reliable fix evaluation._
13. **red-team-runner.ts**  
   `scripts/red-team-runner.ts`  
   _Tests adversarial scenarios for system robustness. Identifies vulnerabilities._
14. **test-cases.ts**  
   `red-team/test-cases.ts`  
   _Tests red team adversarial scenarios. Ensures resilience against attacks._
15. **ci-checklist-verification.test.ts**  
   `cursor/tests/enforcement/ci-checklist-verification.test.ts`  
   _Enforces CI checklist compliance. Ensures system auditability._
16. **codex-self-check.test.ts**  
   `cursor/meta-control/codex-self-check.test.ts`  
   _Tests validation and correction of agent trust drift. Maintains agent alignment._
17. **zombie-hunter.spec.ts**  
   `cursor/accelerators/zombie-hunter/zombie-hunter.spec.ts`  
   _Tests systemReadiness for "green" state. Ensures foundational operational readiness._
18. **oversight.test.ts**  
   `cursor/agent-oversight/oversight.test.ts`  
   _Tests agent oversight for trust and performance boundaries. Prevents system degradation._
19. **fallback-manager.test.ts**  
   `cursor/meta-control/fallback-manager.test.ts`  
   _Tests FallbackManager for system recovery plans. Ensures graceful recovery._
20. **recovery-engine.test.ts**  
   `cursor/meta-control/recovery-engine.test.ts`  
   _Tests MetaRecoveryEngine for recovery plans. Ensures system resilience._
21. **alignment-auditor.test.ts**  
   `cursor/agents/__tests__/alignment-auditor.test.ts`  
   _Tests detection of system misalignments. Ensures compliance and alignment._

---

## User Experience and Emotional Resonance
These tests ensure empathetic, emotionally aligned, and trust-building user interactions. They are core to CanAI's emotional OS and user trust.

1. **emotional-validator.test.ts**  
   `cursor/validators/emotional-validator.test.ts`  
   _Tests EmotionalValidator for tone scoring and fallback logic. Ensures emotionally safe responses._
2. **dream-state.test.ts**  
   `cursor/validators/dream-state.test.ts`  
   _Tests DreamStateChecker for output alignment. Enhances user engagement._
3. **emotional-integrity-agent.test.ts**  
   `cursor/agents/__tests__/emotional-integrity-agent.test.ts`  
   _Validates emotional resonance monitoring. Prevents trust degradation._
4. **emotional-stability.test.ts**  
   `cursor/agents/__tests__/emotional-stability.test.ts`  
   _Tests emotional stability and drift detection. Ensures long-term UX consistency._
5. **emotional-ux-snapshots.test.ts**  
   `tests/emotional-ux-snapshots.test.ts`  
   _Locks emotional UX outputs to detect drift. Maintains UX consistency during scaling._
6. **burst-protection.test.ts**  
   `tests/burst-protection.test.ts`  
   _Tests burstProtectionMiddleware for UX under load. Preserves UX in high-traffic scenarios._
7. **confirmation-ux-sim.ts**  
   `stressbox/simulations/confirmation-ux-sim.ts`  
   _Simulates Confirmation UX for trust and alignment. Ensures accurate intent interpretation._
8. **run-confirmation-ux-stress.ts**  
   `cursor/stressbox/scripts/run-confirmation-ux-stress.ts`  
   _Stress tests Confirmation UX for emotional depth. Ensures UX resilience._
9. **validateDreamStatePayload.test.ts**  
   `cursor/validators/validateDreamStatePayload.test.ts`  
   _Tests payload validator for emotional UX and API integrity. Ensures reliable API responses._
10. **error-event-capture.test.ts**  
   `tests/middleware/error-event-capture.test.ts`  
   _Tests error capture for emotional safety. Ensures graceful failure handling._
11. **discovery-funnel.test.ts**  
   `components/discovery-funnel.test.ts`  
   _Tests user journey for emotional resonance and conversion. Enhances engagement and user flow._
12. **client-sync.test.ts**  
   `webflow/client-sync.test.ts`  
   _Tests WebflowClient synchronization and emotional alignment. Ensures seamless external integration._
13. **webhook-validation.test.ts**  
   `stripe/webhook-validation.test.ts`  
   _Tests Stripe webhook validation and emotional alignment. Ensures secure external integration._

---

## Core Functionality
These tests validate CanAI's core components, agent coordination, and prompt management. They are essential for operational reliability and system intelligence.

1. **prompt-score-engine.spec.ts**  
   `cursor/accelerators/smart-prompt-score/prompt-score-engine.spec.ts`  
   _Tests scorePrompt for scoring logic. Ensures high-quality AI outputs._
2. **swarm-coordinator-engine.spec.ts**  
   `cursor/accelerators/swarm-agents/swarm-coordinator-engine.spec.ts`  
   _Tests runSwarmAgents for execution and logging. Enables reliable multi-agent coordination._
3. **memory-federation-engine.spec.ts**  
   `cursor/accelerators/federated-memory-lite/memory-federation-engine.spec.ts`  
   _Tests resolveMemory for priority routing. Ensures contextual awareness._
4. **reverse-synthesis-engine.spec.ts**  
   `cursor/accelerators/reverse-synthesis-core/reverse-synthesis-engine.spec.ts`  
   _Tests reverseSynthesize for intent inference. Enables relevant responses._
5. **copilot-feedback-engine.spec.ts**  
   `cursor/accelerators/copilot-feedback-agent/copilot-feedback-engine.spec.ts`  
   _Tests evaluateCopilotFeedback for suggestions. Enhances user engagement._
6. **swarm-agents.spec.ts**  
   `cursor/accelerators/swarm-agents/swarm-agents.spec.ts`  
   _Tests runSwarmAgents for configuration integrity. Ensures consistent agent behavior._
7. **tone-overrider.spec.ts**  
   `cursor/accelerators/tone-override-agent/tone-overrider.spec.ts`  
   _Tests getToneOverride for tone management. Maintains appropriate communication._
8. **copilot-injector.spec.ts**  
   `cursor/accelerators/copilot-injector/copilot-injector.spec.ts`  
   _Tests injectCopilotFeedback for schema integrity. Enhances interaction stability._
9. **ai-provider.test.ts**  
   `tests/ai-provider.test.ts`  
   _Tests AIProvider for external AI integration. Ensures reliable external interactions._
10. **agent-memory.test.ts**  
   `cursor/agent-oversight/agent-memory.test.ts`  
   _Tests AgentMemory for record management. Tracks agent performance and trust._
11. **agent-selector.test.ts**  
   `cursor/meta-control/agent-selector.test.ts`  
   _Tests AgentSelector for appropriate agent selection. Ensures efficient task allocation._
12. **assert-memory-restore.test.ts**  
   `cursor/tests/assert-memory-restore.test.ts`  
   _Tests memory recall from partial context. Ensures contextual continuity._
13. **cortex.test.ts**  
   `cursor/prime/core/cortex.test.ts`  
   _Tests Cortex module for event bus and trust enforcement. Central to system coordination._
14. **event-bus.test.ts**  
   `cursor/agents/event-bus/event-bus.test.ts`  
   _Tests EventBus for event subscription and handling. Core to event-driven architecture._
15. **event-router.test.ts**  
   `cursor/meta-control/event-router.test.ts`  
   _Tests MetaEventRouter for event routing. Ensures component communication._
16. **memory-hierarchy-manager.test.ts**  
   `cursor/ai-memories/memory-hierarchy-manager.test.ts`  
   _Tests memory store coordination. Ensures contextual awareness._
17. **memory-integration.test.ts**  
   `cursor/memory-integration/__tests__/memory-integration.test.ts`  
   _Tests memory injection and influence calculation. Enhances response relevance._
18. **meta-controller.test.ts**  
   `cursor/meta-control/meta-controller.test.ts`  
   _Tests MetaController for agent orchestration. Central to system coordination._
19. **prompt-engine.test.ts**  
   `cursor/prompt-infrastructure/__tests__/prompt-engine.test.ts`  
   _Tests promptType .input.json for schema compliance. Ensures prompt consistency._
20. **prompt-registry.test.ts**  
   `cursor/prompt-registry/__tests__/prompt-registry.test.ts`  
   _Tests CodexPromptRegistry for prompt management. Central to prompt operations._
21. **prompt-score.test.ts**  
   `cursor/prompt-infrastructure/__tests__/prompt-score.test.ts`  
   _Tests prompt scoring for trust and alignment. Ensures prompt quality._
22. **validate-agent-chain.test.ts**  
   `cursor/tests/validate-agent-chain.test.ts`  
   _Tests multi-agent chain coordination. Ensures reliable agent workflows._
23. **validateInput.test.ts**  
   `api-router/middleware/__tests__/validateInput.test.ts`  
   _Tests input validation middleware. Protects against malformed inputs._
24. **validation.test.ts**  
   `schemas/validation.test.ts`  
   _Tests schema validation and edge case handling. Ensures robust input handling._
25. **test-prompt-integrity-suite.ts**  
   `tests/test-prompt-integrity-suite.ts`  
   _Tests prompt integrity for injection and cost. Ensures robust prompts._
26. **zombie-rescue-engine.spec.ts**  
   `cursor/accelerators/zombie-hunter/zombie-rescue-engine.spec.ts`  
   _Tests detectZombieSession for stuck session handling. Maintains system efficiency and UX._
27. **conversion-predictor-engine.spec.ts**  
   `cursor/accelerators/conversion-predictor-lite/conversion-predictor-engine.spec.ts`  
   _Tests scoreConversionLikelihood for signal matching. Drives user actions and engagement._
28. **cursor-debug-agent.test.ts**  
   `tests/cursor-debug-agent.test.ts`  
   _Tests debugging pipeline for bug detection and PR creation. Maintains codebase health._

---

## Optimization and Scalability
These tests focus on performance, resource efficiency, and iterative improvements. They are vital for scaling CanAI safely and efficiently.

1. **abTestingEngine.test.ts**  
   `cursor/utils/__tests__/abTestingEngine.test.ts`  
   _Tests ABTestingEngine for variant assignment. Optimizes performance via A/B testing._
2. **stressbox-engine.test.ts**  
   `cursor/stressbox/stressbox-engine.test.ts`  
   _Tests StressBox for prompt stress testing. Ensures prompt robustness._
3. **prompt-evolver.test.ts**  
   `cursor/prompt-infrastructure/__tests__/prompt-evolver.test.ts`  
   _Tests prompt evolution for versioning. Enhances prompt quality._
4. **evolution-driver.test.ts**  
   `cursor/agents/evolution-driver/tests/evolution-driver.test.ts`  
   _Tests EvolutionDriver for codebase analysis. Drives self-improvement._
5. **test-token-cost-thresholds.ts**  
   `tests/test-token-cost-thresholds.ts`  
   _Tests token cost estimation and thresholds. Optimizes resource efficiency._
6. **memory-compression.test.ts**  
   `cursor/ai-memories/compression/memory-compression.test.ts`  
   _Tests memory compression strategies. Enhances performance for large datasets._
7. **dynamic-tier-burst.test.ts**  
   `tests/dynamic-tier-burst.test.ts`  
   _Tests tier-based burst protection. Ensures scalability with UX preservation._
8. **test-orchestrator.ts**  
   `scripts/test-orchestrator.ts`  
   _Tests test execution and coverage analysis. Ensures comprehensive testing._
9. **ab-tracker.ts**  
   `phantom-prompts/ab-tracker.ts`  
   _Tests A/B testing tracker for phantom prompts. Refines prompts covertly._
10. **mirror-replay-suite.ts**  
   `cursor/simulations/mirror-replay-suite.ts`  
   _Tests performance across mirror versions. Ensures update reliability._
11. **prompt-validation-matrix.ts**  
   `cursor/self-healing/prompt-validation/prompt-validation-matrix.ts`  
   _Tests prompt revisions for regression safety. Prevents prompt regressions._
12. **run-simulations.ts**  
   `simulation-engine/run-simulations.ts`  
   _Tests business scenario simulations. Validates real-world use cases._
13. **run-simulation.ts**  
   `scripts/run-simulation.ts`  
   _Tests simulation suite for metrics and improvements. Drives system evaluation._
14. **stressbox-integration.test.ts**  
   `cursor/stressbox/stressbox-integration.test.ts`  
   _Tests StressBox integration with prompt system. Enhances stress testing actionability._
15. **test-prompt-version-promotion.ts**  
   `tests/test-prompt-version-promotion.ts`  
   _Tests prompt promotion and archiving. Ensures safe prompt evolution._
16. **test-smartPromptScore-logging.ts**  
   `tests/test-smartPromptScore-logging.ts`  
   _Tests SmartPromptScore for score and reasoning. Enhances prompt transparency._
17. **test-smartPromptScore-variance.ts**  
   `tests/test-smartPromptScore-variance.ts`  
   _Tests SmartPromptScore stability across variants. Ensures consistent scoring._
18. **promptBenchmarks.test.ts**  
   `cursor/performance/promptBenchmarks.test.ts`  
   _Benchmarks prompt performance and resource usage. Optimizes efficiency._
19. **evolution-trigger.test.ts**  
   `cursor/evolution-triggers/evolution-trigger.test.ts`  
   _Tests EvolutionTriggerManager for performance-based evolution. Enables dynamic adaptation._
20. **strategy-executor.test.ts**  
   `cursor/evolution-triggers/strategy-executor.test.ts`  
   _Tests EvolutionStrategyExecutor for optimization strategies. Implements adaptive improvements._
21. **smart-prompt-score.test.ts**  
   `cursor/agents/__tests__/smart-prompt-score.test.ts`  
   _Tests SmartPromptScore for quality and trust signals. Enhances prompt evaluation._
22. **smart-revision.test.ts**  
   `cursor/agents/__tests__/smart-revision.test.ts`  
   _Tests SmartRevision for output quality and safety. Improves output quality._
23. **strategic_agents.test.ts**  
   `cursor/strategic_agents/strategic_agents.test.ts`  
   _Tests strategic agents for activation and coordination. Enhances system adaptability._
24. **opportunity-radar.test.ts**  
   `cursor/agents/__tests__/opportunity-radar.test.ts`  
   _Tests Opportunity Radar for growth opportunities. Drives strategic evolution._
25. **memory-intelligence.test.ts**  
   `cursor/ai-memories/__tests__/memory-intelligence.test.ts`  
   _Tests memory compression and retrieval intelligence. Optimizes memory performance._
26. **feedback-capture.test.ts**  
   `cursor/preprocessors/feedback-capture.test.ts`  
   _Tests FeedbackCapture for user feedback tracking. Improves personalization._ 