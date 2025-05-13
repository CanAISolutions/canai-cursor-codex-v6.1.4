# failure-capture

## Purpose
Codex recovery and failure-capture layer. Handles tactical recovery, retries, manual overrides, and fail-closure logic for all critical modules.

## Ownership
- Owner: Cursor (Codex Sentinel)
- Phase: 2.8.9
- Audit: Required for all recovery, retry, and manual override actions

## Audit Requirements
- All recovery actions must be logged per log-expectation.md
- All modules must emit recovery events to eventBus
- All manual overrides and fail-closures must be logged and auditable

## Notes
- Placeholder logic must be replaced with full recovery routines before Phase 2.9.0
- All changes must be logged in CodexMarkdownV2.1 format 