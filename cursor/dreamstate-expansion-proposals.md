# DreamState Expansion Proposals

## Purpose
This file catalogs additional high-signal DreamState enforcement tests—beyond the canonical 33—that would further enhance trust, resilience, emotional fidelity, and futureproofing for CanAI. Each proposal is mapped to a real system path, function, and Codex pillar, and is prioritized for Cofounder review.

---

| Test Name | Codex Pillar | Gap/Failure Protected | System Path(s)/Function(s) | Priority |
|-----------|--------------|----------------------|----------------------------|----------|
| Codex-AutoRollback-Resilience | Recovery & Rollback Integrity | Detects/blocks failed or partial auto-rollback, ensuring no silent state corruption after failed recovery. | /cursor/accelerators/auto-rollback/auto-rollback.spec.ts, /cursor/accelerators/auto-rollback/rollback-engine.ts | Critical |
| Codex-Drift-Correction-Enforcer | Autonomous Drift Correction | Ensures all detected drift triggers real correction proposals and logs, preventing silent drift accumulation. | /cursor/codex-correction/__tests__/codex-correction.test.ts, /cursor/codex-correction/ | High |
| Codex-Consent-Compliance-Guard | Regulatory & Consent Logging | Detects missing or failed consent/deletion logging, preventing silent regulatory failures. | /tests/compliance/compliance-logging.test.ts, /api/ | Critical |
| Codex-TrustCircuitBreaker-Trigger | Trust Suppression & Circuit Breaking | Ensures trust-based circuit breakers trigger and log on threshold breach, preventing unsafe operations. | /cursor/rules/__tests__/circuit-breaker.test.ts, /cursor/rules/ | High |
| Codex-Agent-Oversight-Boundary | Agent Oversight & Trust Boundaries | Detects agent overreach or performance boundary violations, preventing silent system degradation. | /cursor/agent-oversight/oversight.test.ts, /cursor/agent-oversight/ | Critical |
| Codex-RedTeam-Adversarial-Resilience | Adversarial Robustness | Simulates red team attacks and ensures system logs, blocks, and recovers from adversarial scenarios. | /scripts/red-team-runner.ts, /red-team/test-cases.ts | High |
| Codex-Memory-Recall-Continuity | Memory Recall & Contextual Continuity | Detects failures in memory recall from partial context, preventing context loss in agent workflows. | /cursor/tests/assert-memory-restore.test.ts, /cursor/agent-oversight/agent-memory.ts | High |
| Codex-EventBus-Subscription-Health | Event-Driven Architecture Resilience | Detects dropped or failed event subscriptions, ensuring event-driven flows remain reliable. | /cursor/agents/event-bus/event-bus.test.ts, /cursor/agents/event-bus/event-bus.ts | High |
| Codex-Prompt-Registry-Integrity | Prompt Management & Registry Health | Detects prompt registry corruption or injection, ensuring prompt management is robust and tamper-proof. | /cursor/prompt-registry/__tests__/prompt-registry.test.ts, /cursor/prompt-registry/ | High |
| Codex-AB-PhantomPrompt-Tracker | A/B Testing & Phantom Prompt Coverage | Ensures A/B phantom prompt tracking is accurate and not silently bypassed, preserving experiment integrity. | /phantom-prompts/ab-tracker.ts | Optional |
| Codex-Feedback-Capture-Completeness | Feedback & Personalization | Detects missing or failed feedback capture, ensuring user feedback is always logged and actionable. | /cursor/preprocessors/feedback-capture.test.ts, /cursor/preprocessors/feedback-capture.ts | High |
| Codex-Memory-Compression-Edge | Memory Optimization & Data Integrity | Detects memory compression failures or data loss, ensuring large dataset handling is robust. | /cursor/ai-memories/compression/memory-compression.test.ts, /cursor/ai-memories/compression/ | High |
| Codex-Strategic-Agent-Activation | Strategic Agent Coordination | Detects failures in strategic agent activation or coordination, preventing silent loss of adaptability. | /cursor/strategic_agents/strategic_agents.test.ts, /cursor/strategic_agents/ | High |
| Codex-Token-Cost-Threshold-Enforcer | Resource Efficiency & Cost Control | Detects token cost overruns or threshold breaches, ensuring resource usage is always within safe bounds. | /tests/test-token-cost-thresholds.ts, /cursor/performance/promptBenchmarks.ts | High |
| Codex-Opportunity-Radar-Drift | Growth Opportunity Detection | Detects missed or drifted opportunity radar signals, ensuring system evolution is not silently stalled. | /cursor/agents/__tests__/opportunity-radar.test.ts, /cursor/agents/opportunity-radar/ | Optional |

---

**Paused for Cofounder review. No implementation or enforcement logic will proceed until proposals are validated and prioritized.** 