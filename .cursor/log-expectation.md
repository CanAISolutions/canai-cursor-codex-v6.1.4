# Expected Logging Behavior – .cursor Layer

- All boot, memory, and orchestration events must be logged
- Silent failures or untracked state changes are not allowed
- On trigger, logs should be written to: `/cursor/auto-actions.log.md`
- Expected status: `boot-initialized`, `memory-state-updated`, `orchestration-event`, or `unreachable`
- AutoRemediation events should include `"status": "AutoRemediated"` 