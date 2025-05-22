# Flowlocked Guidelines: Test Remediation and Codex Compliance

## Purpose
This document outlines the standardized process for executing the **Flowlocked Action Plan** (`/cursor/flowlocked-action-plan.md`), ensuring **system-wide integrity**, **Codex compliance**, and **resilience** across all test remediations. It serves as a reference for external audits, operator guidance, and consistent execution.

## Scope
Covers all 19 unresolved tests in the Flowlocked Action Plan, including system-wide tests (IDs 1–4) and `dreamstate` tests (IDs 5–19), with a focus on replacing mocks, enforcing rituals, and maintaining TrustScore targets (≥95).

## Process Overview

### 1. Pre-Test System Validation
Before executing any test:
- **Dependency & Import Check**: Validate all imports and dependency chains for conflicts, outdated versions, or missing references. Ensure shared functions (e.g., `APIHandler`) don’t cause regressions.
- **Legacy Dependency Review (Dreamstate Tests)**: For tests in `/tests/dreamstate/` (IDs 5–19):
  - Identify mappings to legacy tests via file paths, shared functions, or rituals.
  - Review legacy imports and dependencies for compatibility with realified logic.
  - Log discrepancies (e.g., deprecated imports) in `/cursor/auto-actions.log.md`.
  - Escalate unclear legacy logic for operator review.
- **Codex Compliance**: Verify required rituals (e.g., `#ritual-a11y-standards`), measurable TrustScore targets, and Codex-compliant fallback mechanisms.
- **Test Readiness**: Confirm assertions, edge cases, and system-wide impact of mock replacements.
- **Dependency Health**: Run a scan to detect issues and log conflicts.

### 2. Test Execution
- Execute tests in **priority order** (highest risk first, e.g., TrustScore violations).
- **Realify Mocks**: Replace mocks with real logic (e.g., `mockA11yResults` → `A11yChecker`) and implement fallbacks.
- **Log Actions**: Record in `/cursor/auto-actions.log.md` with Test ID, mock removed, replacement logic, rituals, TrustScore, status, and timestamp.
- **Cross-Test Validation**: Ensure no conflicts or Codex violations post-execution.

### 3. Post-Test Validation
- **System Integrity Check**: Revalidate dependencies, imports, and emotional integrity.
- **Escalation Protocol**: Escalate if TrustScore < 95% or fallback triggered, logging in both `/cursor/auto-actions.log.md` and `/cursor/flowlocked-action-plan.md`.
- **Real-Time Sync**: Update action plan and sync every 6 hours to `/cursor/reports/phase-3.6.2-status.md`. Generate daily health reports.

### 4. Continuous Loop
- Iterate until all tests are resolved.
- Add new issues to the action plan with full validation.
- Maintain real-time sync between action plan and logs.

### 5. Escalation Protocol
- Escalate Codex violations (e.g., missing rituals, dependency failures, legacy mismatches).
- Log details, pause execution, and notify operator via webhook/email.

### 6. Operator Responsibilities
- Monitor logs for escalations.
- Intervene if confidence drops or issues persist.
- Ensure real-time sync of action plan and logs.

## Logging Format
For each test action, log in `/cursor/auto-actions.log.md`:
```md
[2025-05-21 11:45 AM MDT] Test ID: [ID]
- Mock Removed: [mockName]
- Replacement Logic: [realFunctionName]
- Fallback: [fallbackMechanism]
- Rituals: [ritual1, ritual2]
- TrustScore: [value]
- Status: [In Progress | Complete | Escalated]
```

## Audit Considerations
- All actions are logged in `/cursor/auto-actions.log.md` and `/cursor/flowlocked-action-plan.md`.
- Daily health reports are available in `/cursor/reports/phase-3.6.2-status.md`.
- Legacy test mappings for `dreamstate` tests are validated to ensure compatibility.

## References
- Flowlocked Action Plan: `/cursor/flowlocked-action-plan.md`
- Auto-Actions Log: `/cursor/auto-actions.log.md`
- Status Reports: `/cursor/reports/phase-3.6.2-status.md`