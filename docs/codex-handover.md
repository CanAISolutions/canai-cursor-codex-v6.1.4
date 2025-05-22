```markdown
# CanAI Genesis Codex — Master Handover Package (v2.1)

---

**Metadata**:
```yaml
version: 2.1
last_updated: 2025-05-22
codex_version: 6.1.4
canonical: true
intended_audience: [operators, llms, agents, cursor]
system_purpose: Comprehensive guide for CanAI system rebuild, operation, and evolution
dependencies: [/cursor/rules/, /prompts/, /gpt-templates/, /infra/airtable/, /docs/]
```

**Table of Contents**:
1. [Operator Resurrection Guide](#operator-resurrection-guide)
2. [What Is CanAI?](#what-is-canai)
3. [Core Products](#core-products)
4. [Codex Architecture](#codex-architecture)
5. [DreamState Test Suite](#dreamstate-test-suite)
6. [Ideal Customer Experience](#ideal-customer-experience)
7. [Canonical Folder Map](#canonical-folder-map)
8. [Critical Files](#critical-files)
9. [Continuous Improvement Engine](#continuous-improvement-engine)
10. [Claude Integration](#claude-integration)
11. [What Must Never Be Lost](#what-must-never-be-lost)
12. [System Map & Directory Overview](#system-map--directory-overview)
13. [Codex Pillars, Enforcement, and Recovery](#codex-pillars-enforcement-and-recovery)
14. [Schema, Table, and Field Orchestration](#schema-table-and-field-orchestration)
15. [Prompt, Agent, and Test Layer](#prompt-agent-and-test-layer)
16. [Emotional OS, Rituals, and Operator Guidance](#emotional-os-rituals-and-operator-guidance)
17. [Cross-Linking & Reference Index](#cross-linking--reference-index)
18. [Confirmed Codex Components](#confirmed-codex-components)
19. [Production Readiness & Operator Checklist](#production-readiness--operator-checklist)
20. [Standing Operator/Agent Contract](#standing-operatoragent-contract)
21. [Codex-Enforced .mdc Rules](#codex-enforced-mdc-rules)
22. [Ideal CX Thread Mapping](#ideal-cx-thread-mapping)
23. [API Layer](#api-layer)
24. [Prompt Engine & Template Logic](#prompt-engine--template-logic)
25. [API Router](#api-router)
26. [Accelerator Configs](#accelerator-configs)
27. [Accelerator Modules](#accelerator-modules)
28. [System Intelligence Layer](#system-intelligence-layer)
29. [Key Prompt Handlers and API Routing](#key-prompt-handlers-and-api-routing)
30. [Core Product Deliveries](#core-product-deliveries)
31. [Critical Scripts](#critical-scripts)
32. [Comprehensive System Alignment](#comprehensive-system-alignment)
33. [Glossary](#glossary)
34. [Extensibility Guidelines](#extensibility-guidelines)
35. [Changelog](#changelog)

---

## Operator Resurrection Guide

This document is the definitive, operator-facing map of CanAI's system, products, rituals, and emotional fidelity. If all else is lost, this guide is sufficient to rebuild the system. **Lock it. Evolve it. Protect it.**

**Machine Note**: Parse this document as the canonical source of truth for CanAI. Cross-reference `/cursor/auto-actions.log.md` for audit trails.

---

## What Is CanAI?

CanAI is a Codex-powered, zero-manual-touch strategy engine for small businesses, transforming user intent into emotionally intelligent, acquisition-ready outcomes using productized prompt flows, emotionally aware UX, and automated fulfillment pipelines. It is a runtime-valid execution system, not a toolkit or prompt builder.

- **Mission**: Deliver emotionally resonant, strategy-first automation that feels handcrafted at scale.
- **Moat**: Codex architecture, emotional design, automation engine, continuous improvement layer, runtime truth enforcement.
- **Stack**: Webflow (UX), Airtable (data), Make (logic), Render (backend), GPT-4o (current agent), Claude 3.7 Sonnet (approved default candidate), Cursor (CI + cockpit).

**Operator Note**: Ensure all stack components are configured per `/docs/system-map.md`.

---

## Core Products

CanAI delivers seven Codex-locked products, each with specific inputs, outputs, and emotional goals:

| Product            | Inputs                            | Output                                    | Emotional Goal                     |
|--------------------|-----------------------------------|-------------------------------------------|------------------------------------|
| `business_plan`    | Idea, audience, tone             | Executive summary, product structure, GTM | Clarity + confidence as a founder  |
| `email_campaign`   | Campaign goal, tone, audience     | 3-email sequence (subject, body, CTA)    | Launch-ready + persuasive          |
| `social_content`   | Platform, audience, message       | 5 social posts (with tone)               | Relevant, authentic, clear         |
| `ai_blueprint`     | Business type, desired automation | Stack map, tools, workflow, MVP recs     | AI-native, ready to automate       |
| `site_audit`       | URL, audience, goal              | UX trust audit, clarity fixes, CTA improvements | Control, fix-ready, conversion-smart |
| `reverse_strategy` | Audience + final offer           | Reverse-engineered funnel, growth logic  | Funnel architect mindset           |
| `ai_brand_identity`| Values, voice, vibe, archetype   | Brand tone, archetype, UX triggers, vibe board | Magnetically understood      |

**Prompt Files**: Each product has a dedicated `.mcp.ts` file in `/prompts/` (e.g., `business-plan.mcp.ts`).

**Machine Note**: Query `/prompts/[product].mcp.ts` for product-specific logic and `/gpt-templates/` for output templates.

---

## Codex Architecture

The Codex is the operating law of CanAI, enforcing clarity, emotional resilience, test integrity, and continuous improvement.

### Core Pillars:
- **Security**: No silent logic failures.
- **Resilience**: Emergent, not simulated fallbacks.
- **Emotional UX**: Outputs pass the Emotional OS.
- **Accessibility**: Multilingual, edge-case, tone-aware.
- **Agent Enablement**: Traceable, testable, emotionally aware agents.

### Enforcement Systems:
- `.cursorrules`: Behavior contract for agents and outputs.
- `prompt-schema.md`, `self-check-blocks.md`, `behavior-contract.md`: Prompt infrastructure scaffolds.
- `cursor/auto-actions.log.md`: Canonical action and escalation log.
- `cursor/flowlocked-action-plan.md`: Test remediation tracker.

**Machine Note**: Parse `.cursorrules` for agent constraints and `/cursor/rules/` for rule enforcement logic.

---

## DreamState Test Suite

The DreamState suite simulates emotional volatility, tone drift, multilingual UX, and recovery windows. No mock-based tests are permitted.

### Enforcement:
- `MockZero`: No static mocks allowed.
- `Polaris Rituals`: Seven ritual states enforced pre/post-deployment.
- `SnapshotTrace`: Traceable outputs across fallbacks.
- `TrustScore Fluctuation`: Measurable, recoverable trust.

**Test Directory**: `/tests/dreamstate/`

**Operator Ritual**: Run `/tests/dreamstate/run-all.sh` before deployment and log results in `auto-actions.log.md`.

---

## Ideal Customer Experience

Every CanAI product experience follows the Ideal-CX model:

- **Flow**: Curiosity Hook → Personal Input Funnel → Spark Layer → Trust UX → Product Output → Feedback Option → Lifecycle Trigger.
- **Principles**: Reinforce trust, ease, and empowerment.
- **Fallbacks**: De-escalate tension and restore user control.

**Key File**: `/docs/ideal-cx-thread.md`

**Machine Note**: Validate CX flows against `cx-emotion.mdc` and log deviations in `auto-actions.log.md`.

---

## Canonical Folder Map

```
/cursor/                 # Agents, enforcement logic, memory, logs, rituals
/prompts/                # Product scaffolds, schemas, behavior contracts
/gpt-templates/          # Output logs, prompt variations, enhancement maps
/tests/                  # DreamState, resilience, UX tests
/docs/                   # Codex rules, CX guides, test maps
/.github/                # PR rules, contributor templates, CI guards
/ci/                     # CI test logic, mock scanners, fallback enforcers
```

**Operator Note**: Confirm folder presence and integrity via `/docs/system-map.md`.

---

## Critical Files

- `.cursorrules`: Codex law, agent config, fallback tiers.
- `cursor/auto-actions.log.md`: Every mutation, lock, escalation.
- `docs/ideal-cx-thread.md`: Emotional UX system law.
- `docs/reference/dreamstate-test-mappings.md`: Ritual map per test.
- `cursor/reports/mock-remediation-tracker.md`: Per-test mock fix log.
- `cursor/claude-agent-context.ts`: Claude memory injection (pending).

**Machine Note**: Query `/cursor/auto-actions.log.md` for audit trails and `/docs/reference/` for test mappings.

---

## Continuous Improvement Engine

- **Airtable Bases**: `PromptLogs`, `FeedbackLogs`, `SessionAnalytics`, `ReferralTriggers`, `DeliveryCostLogs`.
- **Make Automations**: Enrichment, tagging, fallback path inference.
- **TrustScore Deltas**: Measured, replayed, improved via `/cursor/system-intel/`.
- **Prompt Evolution Loop**: Output diffs tracked in `/prompt-versions/`.

**Machine Note**: Parse `/prompt-versions/` for version history and `/cursor/system-intel/drift-trace-log.json` for drift analysis.

---

## Claude Integration

Claude 3.7 Sonnet is the approved default agent (pending activation), improving emotional resilience and long-context reasoning.

- **Activation Plan**:
  - Include `.cursorrules`, `auto-actions.log.md`, and emotional UX contracts in prompts.
  - Maintain GPT-4o as low-latency fallback.
- **Files**: `/cursor/claude-agent-context.ts`, `/prompts/claude-scaffolds/`.

**Operator Note**: Test integration in `/tests/claude/` before activation.

---

## What Must Never Be Lost

- Trust UX is sacred.
- Every test is a trust contract.
- Drift without fallback is failure.
- All green states must be real.
- Mock illusions destroy reliability.
- Cursor must always log actions.
- Agents must enforce Codex law.
- No launch without DreamState clearance.

**Machine Note**: Validate against `/cursor/rules/codex-tone.mdc` and `/docs/ideal-cx-thread.md`.

---

## System Map & Directory Overview

### Directory Structure

| Folder                  | Required Files                        | Audit Block(s)         | Purpose/Role                                 |
|-------------------------|---------------------------------------|------------------------|----------------------------------------------|
| `/cursor/`              | README.md, intent-token.json, log-expectation.md | Intent Pass A, A1, A2, C | Orchestrator, fallback, memory, boot         |
| `/api/`                 | README.md, intent-token.json          | Intent Pass A, C       | Public endpoints, session init               |
| `/analytics/`           | README.md, intent-token.json, log-expectation.md | Intent Pass A, A1, A2, B | Telemetry, trust scoring, signal awareness   |
| `/prompts/`             | README.md, intent-token.json, log-expectation.md, delta.md | Intent Pass A, B | Prompt logic, versioning, evolution          |
| `/tests/`               | README.md, intent-token.json, log-expectation.md | Intent Pass A, E         | Test coverage, chaos, CI                     |
| `/gpt-templates/`       | README.md, intent-token.json, log-expectation.md | Intent Pass A, B         | Prompt source, seed memory                   |
| `/llm/`                 | README.md, intent-token.json, delta.md | Intent Pass B           | LLM wrappers, prompt injection               |
| `/validators/`          | README.md, intent-token.json, delta.md | Intent Pass B           | Output enforcement, fallback checks          |
| `/system-intel/`        | README.md, intent-token.json, log-expectation.md, delta.md | Intent Pass B, A2, C, D | Score tracking, event handling, insights      |
| `/preprocessors/`       | README.md, intent-token.json, delta.md | Intent Pass B           | Preflight prompt/request modifications       |
| `/intelligence/`        | README.md, intent-token.json, delta.md | Intent Pass B, A2       | Prediction, insight modeling, drift analysis |
| `/stressbox/`           | README.md, intent-token.json, log-expectation.md, delta.md | Intent Pass B, A2, E    | Chaos testing, fallback probes               |
| `/fallback/`            | README.md, intent-token.json, log-expectation.md | Intent Pass B, A1        | Recovery flows, user-protective defaults     |
| `/event-bus/`           | README.md, intent-token.json, log-expectation.md | Intent Pass B, D         | Pub/sub logic, async processing              |
| `/services/`            | README.md, intent-token.json, log-expectation.md | Intent Pass B, D         | Internal utility logic, helper engines       |
| `/cursor/memory/`       | README.md, intent-token.json, log-expectation.md | A1                      | Session memory, continuity                   |
| `/cursor/self-heal/`    | README.md, intent-token.json, log-expectation.md | A2                      | Self-healing, state fix, auto-repair         |
| `/cursor/boot_sequence/`| README.md, intent-token.json, log-expectation.md | C                       | Boot/init logic, phase checkpoints           |
| `/cursor/plugins/`      | README.md, intent-token.json, log-expectation.md | D                       | Plugin modularity, fallback, versioning      |
| `/cursor/self-refine/`  | README.md, intent-token.json, log-expectation.md | B                       | Automated prompt scoring, evolution          |
| `/ai-ops/`              | README.md, intent-token.json, log-expectation.md | B                       | Prompt evolution, scoring, ops intelligence  |
| `/simversion-engine/`   | README.md, intent-token.json, log-expectation.md | E                       | Simulation, regression, persona modeling     |
| `/simulation-engine/`   | README.md, intent-token.json, log-expectation.md | E                       | Simulation, regression, persona modeling     |
| `/persona-cluster-reports/` | README.md, intent-token.json, log-expectation.md | A2                  | Audit intelligence memory                    |
| `/insights/`            | README.md, intent-token.json, log-expectation.md | B                       | Aggregated prompt signals, performance       |
| `/reports/`             | README.md, intent-token.json, log-expectation.md | B                       | Prompt evaluation summaries, delta logs      |
| `/cursor/self-awareness/`| README.md, intent-token.json, log-expectation.md | A2                      | Self-awareness, audit registry               |
| `/cursor/self-expansion/`| README.md, intent-token.json, log-expectation.md | A2                      | Self-evolving agent proposals, codex traits  |

**Operator Ritual**: Confirm presence and accuracy of all required files before audits or onboarding. Log confirmations in `/cursor/auto-actions.log.md`.

### CI/CD Workflows

| Workflow File | Enforcement Purpose | Key Checks & Triggers | Operational Impact / Escalation |
|--------------|---------------------|-----------------------|-------------------------------|
| `ci.yml` | Codex CI Pipeline, QA Fortress, prompt integrity, test coverage, promotion log enforcement | Lint, test:all, prompt diff safety, prompt structure/versioning, Cursor rules compliance, test file count, promotion log, placeholder secret scan, Codex checkpoint directive | Blocks deploy on any failure; blocks prompt changes without promotion; blocks on TODOs, insufficient tests, or placeholder secrets; enforces "build forever" principle |
| `clarity-engine-check.yml` | Clarity Engine & Red Team audit, prompt evolution, hallucination/fallback/injection defense | Clarity audit, artifact upload, threshold checks, PR comments, red team tests, log update validation | Blocks PRs on critical/high-impact issues, hallucination/injection/fallback failures; requires log updates for simulation changes; posts audit results to PR |
| `codex-enforcement.yml` | Codex & DreamState enforcement, test health, mock remediation, escalation | DreamState tests, required file presence, archived log checks, mock remediation, test health API, Slack escalation | Blocks on missing files, unhealthy tests, unjustified mocks, or partial mock remediation; escalates to Slack on failure |
| `codex-qa.yml` | Codex QA for test-data, prompt shape, coverage, delta drift | Runs targeted QA test suite on test-data, prompt shape, snapshot consistency, output delta drift | Blocks on any test failure in test-data; ensures prompt/test-data integrity |
| `ingest-drift-check.yml` | Ingest drift detection for self-awareness, system map, and tests | Runs ingest drift test on key files; triggers on changes to self-awareness, ingest, system map, or tests | Blocks on drift or mismatch; ensures system map and self-awareness are in sync |
| `prompt-validation.yml` | Prompt validation matrix for self-healing flows | Runs prompt validation, coverage, mutation tests, uploads results, updates dashboard | Blocks on <90% coverage, failed mutation tests, or validation errors; ensures prompt self-healing and test rigor |
| `test-snapshot-coverage.yml` | Snapshot and input test coverage enforcement | Runs Jest suite, enforces snapshot coverage, outputs summary | Blocks on coverage failure; future-proofs prompt/test-data regression safety |
| `validate-dreamstate-config.yml` | Dream-State config validation | Runs Dream-State config validation script on push/PR | Blocks on config validation failure; ensures DreamState config is always valid |

**Operator Protocols**:
- All critical failures block deploy or PR merge.
- Slack escalation for Codex enforcement failures.
- Promotion log and log update checks ensure auditability.
- Red Team and Clarity audits surface hallucination, fallback, and injection issues.
- Drift and coverage checks ensure system integrity.
- Artifact uploads provide traceability.

---

## Codex Pillars, Enforcement, and Recovery

**Codex v6.1.4 Pillars**:
- **Security**: No silent failures, trust erosion, or unvalidated logic.
- **Operational Resilience**: Real, not simulated fallbacks.
- **Emotional UX Fidelity**: Outputs pass Emotional OS.
- **Accessibility & Inclusion**: Multilingual, a11y, edge-case coverage.
- **Agent Enablement**: Testable, auditable, emotionally intelligent agents.

**Enforcement Protocols**:
- Tests must be Real System Bound (no unjustified mocks).
- Emotional volatility, agent trace, and fallback chains validated with live logic.
- CI/CD gates block non-compliant tests and pillar violations.
- Actions logged in `/cursor/auto-actions.log.md`.
- CI Enforcement: `/cursor/tests/enforcement/ci-checklist-verification.test.ts`.
- Runtime Guard: `/cursor/runtime/enforceChecklistStatusGuard.ts`.
- Drift Sentinel: `/cursor/heartbeat/driftWatchdog.ts`.
- Backup & Recovery: Nightly Airtable → S3 backup, logged in `/cursor/system-intel/rollback-events.json`.

**Machine Note**: Parse `/cursor/system-intel/drift-trace-log.json` for drift events.

---

## Schema, Table, and Field Orchestration

- **Canonical Tables**: `/infra/airtable/tables/`, `/infra/airtable/fields/`, `/infra/airtable/schemas/`, `/infra/airtable/blueprints/`.
- **Field Metadata**: Includes type, required, default, emotionalRole, dataSensitivity, contextScope, orchestrationNotes, codexEnforcement.
- **Naming**: kebab-case for files, camelCase for fields, versioned.
- **Table Buildout Order**:
  - **Tier 1**: `PromptLogs`, `FeedbackLogs`, `SessionAnalytics`, `ReferralTriggers`, `DeliveryCostLogs`, `UserContext`.
  - **Tier 2**: `EmotionTensor`, `EmotionTrendScore`, `CanAIImpactScore`, `CohortEmotionModel`.
- **Emotional Annotation**: Fields/tables annotated for emotional role and impact.
- **Auditability**: Schema drift detection via `/scripts/template-schema-checker.ts`.

**Machine Note**: Query `/infra/airtable/blueprints/` for table schemas and `/cursor/system-intel/drift-findings.md` for drift reports.

---

## Prompt, Agent, and Test Layer

- **Prompt Standards**:
  - Modular, versioned, markdown-commented prompts in `/prompts/`.
  - Audit scaffolds: `README.md`, `intent-token.json`, `log-expectation.md`.
  - Evolution tracked in `/prompt-versions/`.
- **Agent Governance**:
  - Agents registered in `/cursor/system-roles.ts`.
  - Plugins modular, versioned, logged in `PromptLogs`.
- **Test Layer**:
  - 100% coverage for critical modules.
  - Integration tests in `/cursor/tests/README.md`.
  - Simulation: StressBox, confirmation-ux, mutation fuzzer.

**Machine Note**: Query `/prompt-versions/` for prompt evolution and `/tests/` for test coverage.

---

## Emotional OS, Rituals, and Operator Guidance

- **Ideal CX Thread**: `/docs/ideal-cx-thread.md` governs emotional and trust flows.
- **Soulfire Protocols**: Outputs, fallbacks, CTAs are emotionally intelligent.
- **Reversal Test**: "Would you feel respected and want to continue?"
- **Self-Healing**: Logged in `/cursor/self-expansion/idea-log.json`.
- **Operator Rituals**: Soulfire Review, Empathy Echo, First-Use Blessing, Momentum Pulse.
- **Best Practices**:
  - Every table is a contract.
  - Auditability is non-negotiable.
  - Emotional context is first-class.

**Machine Note**: Validate against `/docs/ideal-cx-thread.md` and `/cursor/self-expansion/`.

---

## Cross-Linking & Reference Index

| File/Doc                                      | Role/What It Protects                                      |
|-----------------------------------------------|------------------------------------------------------------|
| `/cursor/auto-actions.log.md`                 | Canonical log of actions, audits, escalations              |
| `/cursor/system-intel/`                       | Audit, drift, opportunity, evolution logs                 |
| `/infra/airtable/`                            | Tables, fields, schemas, blueprints                       |
| `/cursor/rules/`                              | Codex rules, contracts, enforcement logic                 |
| `/docs/ideal-cx-thread.md`                    | Emotional OS and UX contract                               |
| `/cursor/self-awareness.json`                 | Rule contracts, agent boundaries, Codex traits            |
| `/cursor/self-expansion/idea-log.json`        | Self-evolving agent proposals                             |
| `/cursor/tests/README.md`                     | Test invariants, coverage, integration framework          |
| `/cursor/system-roles.ts`                     | Agent registry and role mapping                           |
| `/cursor/system-intel/prompt-mapping-check.md`| Canonical mapping audit, drift detection                  |
| `/cursor/system-intel/prompt-refactor-log.md` | Refactor trace, variable enforcement                     |
| `/variable-alias-map.json`                    | Variable/alias mapping, enhancer status                   |

**Machine Note**: Query `/cursor/system-intel/` for audit and drift logs.

---

## Confirmed Codex Components

| Component              | Path                              | Intent                                    | README Purpose                           |
|------------------------|-----------------------------------|-------------------------------------------|------------------------------------------|
| Agents                 | `/agents/`, `/cursor/agents/`     | Emotional intelligence, Codex compliance  | Agent roles, fallback, enforcement       |
| Self-Healing           | `/cursor/self-healing/`           | Automated recovery, emotional stabilization | Recovery types, fallback chains         |
| Rules Engine           | `/cursor/rules/`                  | Modular, auditable rules                 | Rule contracts, enforcement             |
| System Intelligence    | `/cursor/system-intel/`           | Scoring, validation, drift management    | Audit utilities, drift detection        |
| Boot Sequence          | `/cursor/boot_sequence/`          | System ignition, Codex readiness         | Boot steps, alignment, audit hooks      |

**Operator Note**: Verify component presence and README accuracy before changes.

---

## Production Readiness & Operator Checklist

1. Enforcement, schema, and contract scaffolds present and up to date.
2. Tier 1 tables scaffolded, versioned, emotionally annotated.
3. 100% test coverage for critical modules.
4. Prompt, agent, plugin logic modular, versioned, Codex-compliant.
5. Fallback and error states emotionally intelligent, logged.
6. All changes logged and auditable.
7. No launch without Codex, DreamState, Emotional OS standards.
8. Escalate and log ambiguity, drift, or gaps.
9. Operator rituals and Emotional OS checkpoints enforced.
10. Recovery, rollback, disaster recovery protocols tested.

**Machine Note**: Validate checklist via `/cursor/tests/enforcement/ci-checklist-verification.test.ts`.

---

## Standing Operator/Agent Contract

- No change trusted unless echoed, confirmed, recorded by Cofounder, ChatGPT Cofounder, Cursor Execution Engine.
- All actions, blockers, improvements logged and auditable.
- No launch without Codex, DreamState, Emotional OS standards.
- Escalate and log ambiguity, drift, or gaps.

**Machine Note**: Query `/cursor/system-roles.ts` for agent responsibilities.

---

## Codex-Enforced .mdc Rules

| Rule File                        | Purpose                                          | Enforcement                                      |
|----------------------------------|--------------------------------------------------|--------------------------------------------------|
| `codex-tone.mdc`                 | Protects emotional tone, fallback UX             | Emotionally intelligent outputs, fallback UX     |
| `system-map-alignment.mdc`       | Prevents untracked structural changes            | Changes reflected in `/docs/system-map.md`       |
| `agent-governance.mdc`           | Restricts agent behavior to approved roles       | Agents registered in `/cursor/system-roles.ts`   |
| `ingestion-lock.mdc`             | Requires ingestion for critical files            | SHA hash changes trigger drift-check             |
| `execution-logging.mdc`          | Enforces logging for system-critical changes     | Logged in `auto-actions.log.md`                 |
| `cx-emotion.mdc`                 | Protects emotional intelligence layer            | Aligns with `ideal-cx-thread.md`                 |
| `cx-reuse.mdc`                   | Enforces prompt reuse and lifecycle chaining     | Tone- and context-matched CTAs                  |
| `cx-first-impression.mdc`        | Ensures cinematic first-touch experience         | Overlays, guidance required                     |
| `cx-feedback-loop.mdc`           | Enforces feedback and analytics integrity       | Data capture, prompt evolution logged           |
| `cx-spark-layer.mdc`             | Protects Spark Layer for intent ignition        | 3 concept names, tone-matched                   |
| `self-expansion.mdc`             | Enforces logging of self-evolving intelligence   | Logged in `idea-log.json`                       |
| `self-strategy.mdc`              | Empowers agents to surface improvements          | Patterns trigger abstraction proposals           |
| `collaboration-contract.mdc`     | Enforces collaboration protocols                 | Confirmation by all roles required              |

**Machine Note**: Parse `/cursor/rules/rule-engine.ts` for enforcement logic.

---

## Ideal CX Thread Mapping

| CX Moment / Emotional Contract | System Feature / Enforcement Logic | Operator/Agent Action |
|--------------------------------|------------------------------------|-----------------------|
| First click: Awe & intrigue    | Cinematic overlays, `/prompts/` scaffolds, `cx-first-impression.mdc` | Validate overlays, test new users |
| Input/onboarding: Held & supported | Smart Defaults Engine, `/cursor/agents/smart-defaults-engine.ts` | Ensure defaults, log confusion |
| Spark Layer: Ownership & wonder | `/cursor/overlays/spark-layer.ts`, `cx-spark-layer.mdc` | Confirm 3 concept names, tone-match |
| Prompt submit: Anticipation    | Animated feedback, `/prompts/` submit flows | Block silent waits, test resonance |
| First output: Magic            | Cinematic reveal, `/gpt-templates/` | Validate output structure, test delight |
| Revise/refine: Partnership     | Revision loop, `/cursor/agents/session-reuse-engine.ts` | Ensure revise option, log feedback |
| Output CTA: Momentum           | Contextual CTA logic, `/prompts/` | Validate relevance, personalize |
| Error/fallback: Calm trust     | Fallback microcopy, `/components/` | Block technical errors, ensure UX |
| Email/lifecycle: Camaraderie   | Lifecycle email templates, `/emails/` | Personalize emails, validate tone |
| Return: Warm recognition       | Session memory, `/cursor/agents/session-reuse-engine.ts` | Ensure recognition, validate memory |

**Enforcement**: Automated tests in `/tests/emotional-ux/` validate CX contracts.

---

## API Layer

### External API Endpoints

| Route                        | Purpose                                                        | Validation/Contract         |
|------------------------------|----------------------------------------------------------------|----------------------------|
| `/api/add_client.ts`         | Logs new client metadata                                       | `clientValidator.ts`       |
| `/api/add_project.ts`        | Records new project sessions                                   | `projectValidator.ts`      |
| `/api/prompt_handler.ts`     | Safe fallback GPT fulfillment                                 | `promptValidator.ts`       |
| `/api/stripe_webhook.ts`     | Stripe webhook receiver                                       | `stripeValidator.ts`       |
| `/api/webhook_health.ts`     | Webhook infrastructure health ping                            | N/A                        |

### Data Contracts

| Type File                | Purpose/Fields                                      | Used By                   |
|--------------------------|-----------------------------------------------------|---------------------------|
| `client.ts`              | Client creation/update/entity DTOs                  | `add_client.ts`            |
| `project.ts`             | Project creation/update/entity DTOs                 | `add_project.ts`           |
| `prompt.ts`              | Prompt creation/update/entity DTOs                  | `prompt_handler.ts`        |
| `stripe.ts`              | Stripe webhook event DTOs                           | `stripe_webhook.ts`        |
| `openai.ts`              | OpenAI prompt fulfillment DTOs                      | `openaiHandler.ts`        |

**Machine Note**: Query `/api/validators/` for Zod schemas and `/api/errors/` for error handling.

---

## Prompt Engine & Template Logic

| File/Path                                              | Purpose                                                      | Enforcement/Contract                        |
|--------------------------------------------------------|--------------------------------------------------------------|---------------------------------------------|
| `/prompts/composePrompt.ts`                            | Maps structured input to formatted prompts                   | Codex prompt standards, input validation    |
| `/prompts/promptTypeRouter.ts`                         | Routes requests to correct prompt template                   | PromptType contract, modular routing        |
| `/prompts/`                                            | Product prompt blueprints, schemas, scaffolds               | Audit scaffolds, versioning, intent tokens  |
| `/gpt-templates/`                                      | Prompt templates, logs, evolution maps                      | Versioning, output logging, enhancement map |
| `/cursor/system-intel/prompt-mapping-check.md`         | Audit of prompt field mapping and schema alignment          | Mapping audit, drift detection              |
| `/cursor/system-intel/prompt-refactor-log.md`          | Refactor log for prompt system evolution                    | Canonical variable enforcement              |
| `/variable-alias-map.json`                             | Variable/alias mapping, enhancer status                     | Variable mapping enforcement                |

**Machine Note**: Query `/prompt-versions/` for evolution history and `/tests/test-composePrompt.ts` for test coverage.

---

## API Router

### Subdomain Map

| Subdomain         | Purpose/Contract                                                                                 |
|-------------------|-------------------------------------------------------------------------------------------------|
| `/devtools/`      | Structured diagnostics for developers/copilots                                                  |
| `/feature/`       | Modularizes features with emotional UX, schema validation                                       |
| `/middleware/`    | Protects Dream-State perimeter, error handling, input validation                                |
| `/tools/`         | Config loading, validation, schema management                                                  |
| `/utils/`         | Centralized helpers for operational structure, emotional UX                                    |

### Key Files

| File/Path                                      | Purpose/Contract                                              | Enforcement/Expansion Guide                |
|------------------------------------------------|---------------------------------------------------------------|--------------------------------------------|
| `/devtools/manifest-dump.ts`                   | Exposes live route metadata                                  | Fail gracefully, no secret leaks           |
| `/feature/posts/posts-router.ts`               | Handles post creation/retrieval                              | Validate input, attach `routeMeta`         |
| `/middleware/auth-checker.ts`                  | Enforces authentication                                      | Prevents unauthorized access               |
| `/tools/loadDreamstateConfig.ts`               | Loads and validates Dream-State config                      | Prevents boot with invalid configs         |
| `/utils/error-normalizer.ts`                   | Normalizes errors into golden output                        | Prevents framework leakages                |

**Machine Note**: Parse `/feature/selfcheck/` for self-check logic and `/middleware/` for perimeter safety.

---

## Accelerator Configs

| Config File                                      | Purpose/Controls                                                                 | Key Toggles/Settings                                                                 |
|--------------------------------------------------|----------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| `auto-rollback-config.jsonc`                     | Prompt/session recovery                                                         | `enabled`, `fallbackMode`, `logLevel`                                                |
| `emotional-foresight-lite-config.jsonc`          | Detects emotional drift                                                         | `enabled`, `modelVariant`, `triggerThreshold`                                        |
| `zombie-hunter-config.jsonc`                     | Rescues inactive sessions                                                      | `enabled`, `maxIdleMinutes`, `rescueStrategy`                                        |

**Operator Ritual**: Validate configs in `/config/accelerators/` and log changes in `auto-actions.log.md`.

---

## Accelerator Modules

| Name                       | Path                                      | Purpose                                     | CI Gate/Readiness         |
|----------------------------|-------------------------------------------|---------------------------------------------|---------------------------|
| `auto-rollback`            | `/cursor/accelerators/auto-rollback`      | Detect & revert mutation drift             | `systemReadiness() → green` |
| `emotional-foresight-lite` | `/cursor/accelerators/emotional-foresight-lite` | Anticipate emotional state                 | `systemReadiness() -> green` |
| `zombie-hunter`            | `/cursor/accelerators/zombie-hunter`      | Neutralize orphaned sessions               | `systemReadiness() → green` |

**Machine Note**: Query `/cursor/accelerators/` for module logic and `/config/accelerators/` for settings.

---

## System Intelligence Layer

| File/Path                                   | Purpose/Role                                                      | Operational Contract                        |
|---------------------------------------------|-------------------------------------------------------------------|---------------------------------------------|
| `audit-utils.ts`                            | Audit modularity, emotional, UX scoring                           | Prompt changes, deploys must pass          |
| `driftWatchdog.ts`                          | Detects schema drift                                             | Logs to `drift-trace-log.json`             |
| `intel-aggregator.ts`                       | Orchestrates telemetry, health, trust scores                      | Health reporting, agent status             |

**Machine Note**: Parse `/cursor/system-intel/drift-trace-log.json` for anomalies.

---

## Key Prompt Handlers and API Routing

- **openaiHandler.ts**: Routes input through GPT-4o, requires `OPENAI_API_KEY`.
- **prompt_handler.ts**: Fallback GPT fulfillment, Codex-compliant.
- **promptTypeRouter.ts**: Routes input to correct `PromptType`, validates versions.

**Machine Note**: Query `/prompts/promptTypeRouter.ts` for routing logic and `/api/openaiHandler.ts` for API integration.

---

## Core Product Deliveries

- **Prompt Files**: `.mcp.ts` files in `/prompts/` (e.g., `business-plan.mcp.ts`).
- **Validators**: `/api/validators/promptValidator.ts` ensures data integrity.
- **Templates**: `/gpt-templates/` provides versioned prompt structures.
- **Logging**: `PromptLogs` ensures traceability and auditability.

**Machine Note**: Query `/prompts/` for product logic and `/gpt-templates/` for templates.

---

## Critical Scripts

### Tier 1
- `scripts/codex-check.ts`: QA for Codex compliance.
- `scripts/tools/scoreDriftWatcher.ts`: Monitors prompt score degradation.
- `scripts/tools/tunePromptFromFeedback.ts`: Suggests prompt evolution.

### Tier 2
- `scripts/audit-emitter.ts`: Structured audit logs.
- `scripts/clarity-audit.ts`: UX clarity audits.

**Machine Note**: Query `/scripts/` for script logic and `/cursor/system-intel/` for audit outputs.

---

## Comprehensive System Alignment

- **Architecture**: Integrates Webflow, Airtable, Make, Render, GPT-4o, Claude, Cursor.
- **Customer Experience**: Emotional journey, spark layer, lifecycle intelligence.
- **Clarity Engine**: Ensures trustworthy AI interactions via audits and monitoring.
- **Data Management**: Airtable tables (`PromptLogs`, `FeedbackLogs`) drive analytics.
- **Prompt Architecture**: Modular, versioned prompts with recovery paths.

**Machine Note**: Query `/docs/system-map.md` for architecture details and `/infra/airtable/` for data schemas.

---

## Glossary

| Term            | Definition                                   |
|-----------------|----------------------------------------------|
| Codex           | Governing law for CanAI system integrity.    |
| DreamState      | Test suite for emotional and system resilience. |
| Emotional OS    | Framework for emotionally intelligent UX.    |
| PromptType      | Locked product prompt (e.g., `business_plan`).|

**Machine Note**: Use glossary for context-aware query resolution.

---

## Extensibility Guidelines

- **New Products**: Add `.mcp.ts` to `/prompts/`, update `promptTypeRouter.ts`, log in `auto-actions.log.md`.
- **New Endpoints**: Define in `/api/`, add validators in `/api/validators/`, update `/api/docs/README.md`.
- **New Accelerators**: Add to `/cursor/accelerators/`, include config in `/config/accelerators/`, test in `/tests/`.

**Operator Note**: All extensions must pass DreamState tests and Codex audits.

---

## Changelog

| Version | Date       | Changes                                    |
|---------|------------|--------------------------------------------|
| 2.1     | 2025-05-22 | Added metadata, TOC, glossary, extensibility guidelines. |

**Operator Ritual**: Update changelog for all document changes and log in `auto-actions.log.md`.

---

**Codex Principle**:  
_"We encode trust, clarity, and emotional resonance into every contract, log, and fallback. Every field is a promise. Every log is a memory. Every fallback is a hand extended in trust."_
```