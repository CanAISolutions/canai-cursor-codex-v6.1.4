# log-expectation.md – failure-capture

## What
Codex audit log requirements for all recovery, retry, manual override, and fail-closure actions in the failure-capture module.

## Why
To ensure all recovery attempts, retries, manual overrides, and fail-closures are observable, auditable, and Codex-compliant. Prevents silent failures and untracked recovery events.

## How
- All recovery attempts must be logged to `/cursor/auto-actions.log.md` with fingerprint, originModule, recoveryAttempted, and recoveryOutcome.
- All manual override requirements must be logged to `/cursor/system-intel/recovery-deferred.log.md` with fingerprint, originModule, and error context.
- All fail-closure events must be logged with audit tags and context.
- All recovery events must emit to eventBus with originModule, recoveryAttempted, and recoveryOutcome.
- All logs must use CodexMarkdownV2.1 format for traceability.

## Enforcement
- No recovery, retry, or manual override may proceed without logging.
- All logs must be human-readable and machine-parseable.
- Audit compliance is required for all future Codex phases. 