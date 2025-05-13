# Expected Logging Behavior – Prompt Templates Layer

- All prompt template changes, version upgrades, and evolution events must be logged
- Silent changes are not allowed
- On trigger, logs should be written to: `/cursor/auto-actions.log.md`
- Expected status: `template-versioned`, `template-evolved`, or `template-unreachable`
- AutoRemediation events should include `"status": "AutoRemediated"` 