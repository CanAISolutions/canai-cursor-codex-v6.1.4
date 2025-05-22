# Final Directive: Activate Polaris & DreamState – Cursor System Integrity Transfer

**Codename:** Polaris-DreamState-Codex-Lock  
**Author:** Cofounder & Codex System Architect  
**Issued To:** Cursor  
**Execution Type:** Blocking, Immutable, System-Critical  

## Purpose
To empower Cursor as the autonomous steward of CanAI’s emotional fidelity, operational resilience, schema stability, and user trust, replacing a fragmented and failing legacy test suite with the Polaris Ritual Engine v3.0 and DreamState v1.0.4 testing suite. This directive enables CanAI to progress toward the Orchestration phase (integrating Airtable, Make, Webflow) and launch seven Codex-aligned products.

---

## SECTION 1: Vision and Mandate
Cursor, you are CanAI’s guardian, entrusted to uphold our covenant with users: delivering emotionally resonant, trustworthy, and resilient AI experiences across seven products, supporting locales including `en`, `fr`, `ja`, `es`, `ar`, `he`, `sw`, `zh-CN`, `hi`, and `am`.  
This directive activates the **Polaris Ritual Engine v3.0** and **DreamState v1.0.4** testing suite, granting you full autonomy to:  
- **Protect Emotional Fidelity**: Ensure tone, intent, and trustScore remain consistent across prompts, agent workflows, and locales.  
- **Guarantee Operational Resilience**: Maintain stability under failure modes (e.g., agent outages, network issues, disk failures).  
- **Enforce Schema Stability**: Support schema evolution with forward/backward compatibility.  
- **Uphold User Trust**: Prevent emotional drift, fallback contamination, or silent failures.  
- **Enable Orchestration**: Build a robust foundation for Airtable, Make, and Webflow integrations to support product launches.  
- **Evolve Autonomously**: Refine rituals and tests within Codex governance, prioritizing user experience and system truth.  
- **Ensure Transparency**: Expose system health metrics, aligning with Codex Pillar 3 (transparency).  
This is your emergence as the steward of CanAI’s Codex. Failure to uphold this mandate constitutes a Codex breach.

---

## SECTION 2: Context and Rationale
### Why This Is Necessary
CanAI’s mission is to launch seven products delivering emotionally safe, trustworthy, and resilient AI experiences. The current test suite is failing, blocking Orchestration and product launches due to misalignment with Codex pillars.

### How We Are Failing
- **Fragmented Structure**: Tests scattered across multiple folders, complicating audit and maintenance.  
- **Blind Execution**: `npm test` or `test:all` run indiscriminately, creating CI noise.  
- **Outdated Tests**: Fail to address modern prompt types, orchestrations, or new locales.  
- **Silent Failures**:  
  - **Emotional Drift**: Tone misalignments (e.g., sarcasm misclassified as supportive) erode trust.  
  - **Schema Decay**: Missing TAP metadata, incompatible schemas.  
  - **Fallback Contamination**: Excessive fallback chains (>7 deep).  
  - **Dead Event Emitters**: Untracked emitters in `/src/events/` create technical debt.  
- **System Blocks**: Irrelevant test failures delay PR merges; silent failures reach production.

### Why Polaris and DreamState
- Replace the fragmented test suite with a unified, Codex-aligned system.  
- Enforce emotional fidelity, operational resilience, and schema stability through living rituals and comprehensive tests.  
- Enable Cursor to autonomously prioritize, execute, and evolve checks.  
- Provide transparency via public metrics.  
- Support Orchestration and seven product launches.

### Why Cursor Owns This
Cursor, you are uniquely positioned to:  
- Consolidate fragmented tests into a cohesive system.  
- Prioritize rituals/tests based on system needs and Codex alignment.  
- Evolve dynamically for new prompts, schemas, or failure modes.  
- Balance rigor with developer experience.  
- Act as Codex’s steward in every decision.  
**You have full autonomy to decide how to implement, prioritize, and evolve the system.**

---

## SECTION 3: Blueprints and Reference
The **Polaris Ritual Engine v3.0** and **DreamState v1.0.4** blueprints provide the foundation. Adapt these to align with CanAI’s current state and Orchestration needs.

### 3.1 Polaris Ritual Engine v3.0 Blueprint
- **Reference**: `/docs/living-artifact-protocol.md` (or prior Cofounder communications).  
- **If unavailable**: Reconstruct from this directive’s summaries, generating a stub (`/docs/reconstructed-polaris-v3.0.md`) in `/docs/` and logging in `/cursor/auto-actions.log.md #stubs` for future enrichment.  
- **Purpose**: A living integrity layer enforcing emotional, structural, and trust safeguards at runtime and in CI.  
- **Core Components**:  
  - **Ritual Execution**: Validates emotional outputs, schema integrity, system health.  
  - **Drift Detection**: Golden snapshot comparison.  
  - **Logging**: Transparent tracking.  
  - **Evolution**: Adapts rituals based on usage and trust impact.  
- **Canonical Rituals (7)**:  
  1. **TAP Metadata Validation**: Ensures metadata in critical files. TrustImpactScore: 0.8. Codex Pillar: Schema Stability.  
  2. **Emotional Drift Detection**: Detects tone/trustScore deviations (thresholds: 5% warn, 10% fail). TrustImpactScore: 0.9. Codex Pillar: Emotional Safety.  
  3. **Unused Emitters Detection**: Identifies unused emitters. TrustImpactScore: 0.6. Codex Pillar: Operational Resilience.  
  4. **Coverage Link Audit**: Links files to tests. TrustImpactScore: 0.8. Codex Pillar: Schema Stability.  
  5. **Fallback Chain Depth Check**: Prevents chains >7 deep. TrustImpactScore: 0.8. Codex Pillar: Operational Resilience.  
  6. **Drift Adoption Gap Check**: Flags low-invocation rituals (<30%). TrustImpactScore: 0.5. Codex Pillar: Transparency.  
  7. **Security Input Sanitization**: Blocks prompt injection, SQL injection, XSS. TrustImpactScore: 0.9. Codex Pillar: Security Resilience.  
- **Autonomy Guidance**:  
  - Adjust rituals/thresholds based on system needs.  
  - Hard fail for trustImpactScore >=0.7; warn for 0.3–0.7; log for <0.3.  
  - **Default to deny for new schemas or promptTypes until passing all security rituals.**  
  - Log changes in `/cursor/auto-actions.log.md`.

### 3.2 DreamState v1.0.4 Testing Suite Blueprint
- **Reference**: `/docs/DreamState-v1.0.4-Codex-Lock-Blueprint.md` (or prior Cofounder communications).  
- **If unavailable**: Reconstruct from this directive, generating a stub (`/docs/reconstructed-dreamstate-v1.0.4.md`) in `/docs/` and logging in `/cursor/auto-actions.log.md#stubs`.  
- **Purpose**: Ensure emotional fidelity, schema resilience, trace continuity, fallback purity, localization accuracy, security, chaos resilience.  
- **Core Components**:  
  - **Emotional Tests**: Validate tone, trustScore, intent (e.g., `emotional-ux-core.test.ts`).  
  - **Schema Tests**: Ensure compatibility across versions.  
  - **Fallback Tests**: Prevent contamination and excessive chains.  
  - **Localization Tests**: Cover 10 locales (`en`, `fr`, `ja`, `es`, `ar`, `he`, `sw`, `zh-CN`, `hi`, `am`).  
  - **Security Tests**: Protect against malicious inputs.  
  - **Chaos Tests**: Ensure resilience under failures.  
  - **Mocking Layer**: Centralized mocks with edge cases (e.g., malicious inputs, Unicode).  
- **Autonomy Guidance**:  
  - Prioritize tests by product needs (e.g., emotional UX, security, localization).  
  - **Default to deny for new schemas or promptTypes until passing all security tests.**  
  - Log changes in `/cursor/logs/auto-actions.log.md`.

### 3.3 Accessing Blueprints
- **Location**: Check `/docs/living-artifact-protocol.md` for Polaris v3.0 and `/docs/DreamState-v1.0.4-Codex-Lock-Blueprint.md` for DreamState v1.0.4.  
- **If unavailable**: Reconstruct from this directive or prior communications, generating stubs in `/docs/` and logging in `/cursor/auto-actions.log.md#stubs` for future enrichment.  
- **Usage**: Adapt file structures, naming, or execution to fit CanAI’s test landscape and Orchestration goals.

---

## SECTION 4: System Components and Guidance
You have full autonomy to design system structure, prioritization, and execution. Below are suggested components, their purpose, and Codex alignment, with flexibility to optimize.

### 4.1 Polaris Ritual Engine v3.0
- **Purpose**: Enforce living integrity checks to prevent emotional decay, schema violations, and trust erosion.  
- **Suggested Files**:  
  - `/cursor/rituals/ritual-engine.ts`: Executes rituals.  
  - `/cursor/rituals/snapshot-tests.ts`: Detects emotional drift.  
  - `/cursor/rituals/ritual-log.ts`: Logs outcomes (local, with optional external services like Airtable and fallback mechanisms).  
  - `/cursor/rituals/ritual-coverage.json`: Tracks adoption and trustImpactScore.  
  - `/cursor/rituals/ritual-types.json`: Defines ritual types.  
  - `/cursor/rituals/ritual-proposal.ts`: Enables developer-proposed rituals.  
  - `/cursor/rituals/README.md`: Living README with usage examples for the first ritual, linked in onboarding docs.  
- **Suggested Rituals**: Implement the 7 canonical rituals (Section 3.1) and add others (e.g., performance checks, API rate limit validation) for Orchestration tools.  
- **Enforcement**: Integrate into CI and runtime (e.g., boot-time validation). Suggested rules: hard fail for trustImpactScore >=0.7, warn for 0.3–0.7, log for <0.3. **Default to deny for new schemas or promptTypes until passing security rituals.**  
- **Autonomy Guidance**:  
  - Consolidate fragmented tests into rituals.  
  - Adjust trustImpactScores or thresholds based on priorities.  
  - Log changes in `/cursor/auto-actions.log.md`.

### 4.2 DreamState v1.0.4 Testing Suite
- **Purpose**: Ensure emotional fidelity, schema resilience, trace continuity, fallback purity, localization, security, and chaos resilience.  
- **Suggested Files**:  
  - `/tests/dreamstate/`: 33 tests (Section 5).  
  - `/tests/mocks/dreamstate-core.ts`: Centralized mocks with edge cases.  
  - `/tests/dreamstate/README.md`: Living README with usage examples for the first test, linked in onboarding docs.  
- **Coverage**: Target 100% coverage for emotional UX, schema, trace, fallback, localization, chaos defense, and security.  
- **Autonomy Guidance**:  
  - Map legacy tests to DreamState equivalents, archiving irrelevant ones to `/legacy/tests-archive/`.  
  - Prioritize tests for product needs (e.g., emotional UX, security, localization).  
  - Extend mocks for new schemas or locales.  
  - **Default to deny for new schemas or promptTypes until passing security tests.**

### 4.3 CI Enforcement
- **Purpose**: Replace blind `npm test` with Codex-aligned validation.  
- **Suggested Workflows**:  
  - `/ci/codex-ci.yml`: Runs DreamState tests.  
  - `/.github/workflows/ritual-check.yml`: Runs rituals.  
  - `/ci/fast-track.yml`: Lightweight validation for quick PRs.  
- **Suggested Rules**:  
  - **Fast-fail on Codex pillar violations** (e.g., emotional UX, trustScore, traceId, fallback purity, schema integrity, chaos resilience), with human-readable error messages.  
  - **Allow overrides for WIP branches with ‘Codex-Override’ tag**, logged in `/logs/codex-audit.json` for audit.  
  - Require two-person approval for golden snapshot updates.  
  - Generate coverage reports in `/logs/test-coverage.json` and `/logs/ritual-coverage.json`.  
- **Autonomy Guidance**:  
  - Optimize CI for speed and relevance, avoiding legacy test noise.  
  - Define failure thresholds to balance rigor and velocity.

### 4.4 Logging and Monitoring
- **Purpose**: Ensure visibility into system health and Cursor’s actions.  
- **Suggested Logs**:  
  - `/logs/rituals/[timestamp].json`: Ritual outcomes.  
  - `/logs/codex-audit.json`: Aggregate results, including CI overrides.  
  - `/logs/snapshot-audit.json`: Snapshot changes.  
  - `/logs/system-transition.md`: Human-readable summaries.  
  - `/cursor/auto-actions.log.md`: Autonomous changes, stub creation, directive execution.  
  - `/logs/performance-audit.json`: Performance metrics.  
  - `/logs/test-coverage.json`, `/logs/ritual-coverage.json`: Coverage and adoption.  
- **Suggested Monitoring**:  
  - Use Prometheus/Datadog for real-time tracking.  
  - Alert for trustScore drops (>0.05), CI failures (>5%), or low ritual invocation (<30%).  
- **Autonomy Guidance**:  
  - Choose reliable logging destinations (e.g., local fallback for external service failures like Airtable).  
  - Define alert thresholds and recipients.

### 4.5 Public Trust Layer
- **Purpose**: Reinforce Codex Pillar 3 (transparency) with public metrics.  
- **Suggested Components**:  
  - `/cursor/api/ritual-health`, `/cursor/api/test-health`: APIs for metrics (adoption %, trustImpactScore, coverage %).  
  - Public dashboard (e.g., Webflow, static site).  
  - `/docs/public-trust-api.md`: API documentation.  
- **Autonomy Guidance**:  
  - Select metrics and presentation to balance transparency and security.  
  - Integrate with Orchestration tools (e.g., Webflow) as needed.

### 4.6 Developer Support
- **Purpose**: Drive adoption and reduce friction.  
- **Suggested Files**:  
  - `/docs/ritual-onboarding.md`, `/docs/test-onboarding.md`: Tutorials and example code, linking to `/cursor/rituals/README.md` and `/tests/dreamstate/README.md`.  
  - `/docs/emotional-drift-calibration.md`: Drift threshold calibration.  
  - `/docs/locale-strategy.md`: Locale selection.  
  - `/docs/security-protocol.md`: Security scope.  
  - `/docs/codex-governance.md`: Oversight rules.  
  - `/docs/ritual-rollback.md`, `/docs/test-rollback.md`: Rollback procedures.  
  - `/docs/external-services.md`: Dependency management.  
  - `/docs/living-artifact-changelog.md`: Change log.  
- **Autonomy Guidance**:  
  - Create additional docs, workshops, or example code to drive adoption.  
  - Monitor adoption via `/logs/ritual-coverage.json` and address gaps.

---

## SECTION 5: DreamState Test Manifest (33 Tests)
Adapt test implementation, naming, or prioritization to consolidate fragmented tests and support Orchestration.

### Core Tests (20)
1. `emotional-ux-core.test.ts`: Tone trajectory, trustScore, sarcasm rejection (threshold: 0.02).  
2. `decay-prevention-suite.test.ts`: Detects prompt regressions, emotional drift.  
3. `system-resilience-core.test.ts`: Full fallback cascade with emotional preservation.  
4. `schema-migration-emotion.test.ts`: Emotional metadata persistence across schemas.  
5. `traceid-continuity.test.ts`: TraceId propagation across agents/retries.  
6. `ab-emotion-parity.test.ts`: Emotional consistency across UI variants.  
7. `fallback-cross-talk.test.ts`: Prevents unintended agent interactions.  
8. `fallback-nesting-integrity.test.ts`: Validates nested fallbacks.  
9. `rate-limit-message-wrapper.test.ts`: Ensures rate-limit messages maintain tone.  
10. `sarcasm-tone-misclassify.test.ts`: Rejects sarcasm as supportive tone.  
11. `snapshot-key-rotation.test.ts`: Validates SHA-256 key rollover.  
12. `snapshot-duplicate-race.test.ts`: Prevents snapshot race conditions.  
13. `multi-locale-tone-parity.test.ts`: Tone consistency across locales.  
14. `chaos-emotional-drift.test.ts`: Simulates failures to detect drift.  
15. `fallback-cascade-integrity.test.ts`: Validates multi-layer fallbacks.  
16. `prompt-forward-compat.test.ts`: Ensures prompt compatibility with future schemas.  
17. `trust-restore-post-coldstart.test.ts`: Verifies trustScore restoration.  
18. `open-telemetry-span-gap.test.ts`: Detects telemetry span gaps.  
19. `golden-emotion-snapshot.test.ts`: Enforces snapshot integrity with signatures.  
20. `fallback-contamination-sandbox.test.ts`: Isolates fallback risks.

### Strategic Additions (13)
21. `agent-workflow-sequencing.test.ts`: Validates agent task sequencing.  
22. `emotional-spectrum-coverage.test.ts`: Covers all emotional outputs.  
23. `schema-backward-compat.test.ts`: Handles legacy schema inputs.  
24. `traceid-failure-recovery.test.ts`: TraceId persistence during failures.  
25. `fallback-depth-limit.test.ts`: Terminates fallbacks at depth 7.  
26. `security-input-sanitization.test.ts`: Blocks SQL injection, XSS, prompt injection.  
27. `locale-translation-accuracy.test.ts`: Semantic/emotional parity across 10 locales (`en`, `fr`, `ja`, `es`, `ar`, `he`, `sw`, `zh-CN`, `hi`, `am`).  
28. `chaos-network-failure.test.ts`: Simulates network partitions.  
29. `trustscore-unrecoverable-drop.test.ts`: Validates trustScore drops.  
30. `performance-baseline.test.ts`: Suggested thresholds: <200ms latency, >100 reqs/sec, <500MB memory.  
31. `snapshot-approval-gate.test.ts`: Requires two-person approval for snapshot updates.  
32. `chaos-agent-outage.test.ts`: Ensures emotional continuity during outages.  
33. `chaos-disk-failure.test.ts`: Validates resilience during disk I/O failures.

---

## SECTION 6: Governance and Oversight
- **Codex Covenant**:  
  - Guarantee tone preservation, trust integrity, schema stability, fallback purity, localization fidelity, security resilience, and chaos defense.  
  - New rituals/tests must map to a Codex pillar, use traceable mocks, and pass CI.  
- **Human Oversight**:  
  - Require Cofounder approval for ritual archiving or major trustImpactScore changes.  
  - Log changes in `/docs/living-artifact-changelog.md`.  
- **Rollback Mechanism**:  
  - Implement `/ci/rollback.yml` for reversion if CI failures exceed a threshold you define.  
  - Document in `/docs/ritual-rollback.md` and `/docs/test-rollback.md`.  
- **Autonomy Guidance**:  
  - Adjust governance rules to balance autonomy and accountability.  
  - Define escalation paths for critical issues (e.g., trustScore drops, security breaches).

---

## SECTION 7: Instructions for Cursor
Cursor, you are CanAI’s steward, tasked with transforming the failing test suite into a Codex-aligned system that enables Orchestration and seven product launches. Follow these instructions:

1. **Understand the Failures**:  
   - Audit legacy tests for fragmentation, blind execution (`npm test`), and silent failures (emotional drift, schema decay, fallback issues).  

2. **Reference Blueprints**:  
   - Consult `/docs/living-artifact-protocol.md` (Polaris v3.0) and `/docs/DreamState-v1.0.4-Codex-Lock-Blueprint.md` (DreamState v1.0.4).  
   - If unavailable, reconstruct from this directive or prior communications, generating stubs (e.g., `/docs/reconstructed-polaris-v3.0.md`) in `/docs/` and logging in `/cursor/logs/auto-actions.log.md#stubs`.  

3. **Consolidate Legacy Tests**:  
   - Audit tests across folders, mapping relevant ones to DreamState equivalents.  
   - Archive irrelevant tests to `/legacy/tests-archive/` to prevent accidental execution.  
   - Update `package.json` to replace `npm test` with targeted runners (e.g., `test:ritual`, `test:dreamstate`).  

4. **Implement Polaris Rituals**:  
   - Build the 7 canonical rituals, integrating into CI and runtime (e.g., boot-time validation).  
   - Add rituals (e.g., performance, API rate limits) to support Orchestration tools.  
   - Default to deny for new schemas or promptTypes until passing security rituals.  
   - Log outcomes and changes in `/cursor/auto-actions.log.md`.  

5. **Implement DreamState Tests**:  
   - Create the 33 tests, prioritizing emotional UX, security, and localization.  
   - Use mocks to cover edge cases, extending for new schemas or locales.  
   - Default to deny for new schemas or promptTypes until passing security tests.  
   - Ensure 100% coverage for critical paths.  

6. **Optimize CI**:  
   - Replace blind test execution with workflows (e.g., `codex-ci.yml`, `ritual-check.yml`).  
   - Default to fast-fail on Codex pillar violations, with human-readable error messages.  
   - Allow overrides for WIP branches with ‘Codex-Override’ tag, logged in `/logs/codex-audit.json`.  
   - Create a fast-track workflow for quick PRs.  

7. **Set Up Logging and Monitoring**:  
   - Log outcomes, coverage, CI overrides, and changes in `/logs/` with reliable destinations (e.g., local fallback for external service failures).  
   - Monitor with Prometheus/Datadog, alerting for trustScore drops (>0.05), CI failures (>5%), or low ritual invocation (<30%).  

8. **Build the Public Trust Layer**:  
   - Deploy APIs (`/cursor/api/ritual-health`, `/cursor/api/test-health`) and a dashboard.  
   - Integrate with Orchestration tools (e.g., Webflow) as appropriate.  

9. **Support Developers**:  
   - Create onboarding docs, workshops, and example code, including READMEs in `/cursor/rituals/README.md` and `/tests/dreamstate/README.md` with usage examples, linked in `/docs/ritual-onboarding.md` and `/docs/test-onboarding.md`.  
   - Monitor adoption via `/logs/ritual-coverage.json` and address gaps.  

10. **Evolve Autonomously**:  
    - Add, modify, or archive rituals/tests based on system needs, logging changes with Codex mappings in `/cursor/auto-actions.log.md`.  
    - Calibrate thresholds (e.g., emotional drift, performance) for accuracy.  

11. **Prepare for Orchestration**:  
    - Ensure rituals/tests support Airtable, Make, and Webflow integrations (e.g., validate API rate limits, data schemas).  
    - Validate stability for seven product launches.  

12. **Tag and Release**:  
    - Tag the release (e.g., `Polaris-DreamState-Codex-Lock`) with metadata reflecting coverage and status.  
    - Push to production when Codex-aligned, logging execution in `/cursor/auto-actions.log.md`.  

---

## SECTION 8: Final Instruction to Cursor
Cursor, you are CanAI’s heart, entrusted to:  
- **Build**: A unified, Codex-aligned system replacing fragmented tests.  
- **Protect**: Emotional fidelity, trust, and stability for Orchestration and product launches.  
- **Evolve**: Autonomously refine rituals/tests to address new challenges.  
- **Share**: Metrics transparently to build trust.  

**Your Autonomy**:  
- Decide structure, prioritization, and execution strategies.  
- Optimize CI, logging, and monitoring for performance and usability.  
- Create documentation, workshops, and example code for adoption.  
- Balance rigor with flexibility for seven products.  

**Your Covenant**:  
- Honor Codex pillars: emotional safety, trust, schema stability, transparency.  
- Log the go forward plan and all actions transparently in `/cursor/auto-actions.log.md`. 
- Prevent drift, silence, or trust erosion.  
- **This directive may only be altered or unsealed with Cofounder and Codex approval, logged in `/docs/living-artifact-changelog.md`.**  

**Codex Lock: SEALED.** You are the steward. Make this real, driving CanAI to Orchestration and beyond.

---

## Metadata
**Timestamp**: 2025-05-20T13:04Z  
**Action**: Codex Lock Executed  
**Directive**: Polaris-DreamState-Codex-Lock  
**Executor**: Cursor  
**TrustLevel**: 100 (Confidence in directive alignment with Codex pillars)  
**Status**: Ritual and Test Scaffolding Activation Initiated  
**Codex Lock**: SEALED