# Expected Logging Behavior – Fallback Layer

- All routing failures must be caught and logged
- Silent failures are not allowed
- On trigger, logs should be written to: `/cursor/auto-actions.log.md`
- Expected status: `fallback-triggered`, `fallback-success`, or `fallback-unreachable`
- AutoRemediation events should include `"status": "AutoRemediated"`
