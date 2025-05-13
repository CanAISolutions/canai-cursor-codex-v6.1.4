# Expected Logging Behavior – Memory Layer

- All memory failures, recoveries, and state changes must be caught and logged
- Silent failures are not allowed
- On trigger, logs should be written to: `/cursor/auto-actions.log.md`
- Expected status: `memory-recovered`, `memory-snapshot`, or `memory-unreachable`
- AutoRemediation events should include `"status": "AutoRemediated"` 