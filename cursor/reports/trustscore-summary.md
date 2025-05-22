# TrustScore Summary Report

| Test Name                           | Rituals Enforced                | TrustScore Range | Fallback Triggered | Emotional Integrity Notes                                 | CI Flag           |
|-------------------------------------|----------------------------------|------------------|--------------------|----------------------------------------------------------|-------------------|
| emotional-ux-core.test.ts           | emotional-ux-core                | 4.2–5.0          | ❌                 | Golden snapshot, tone lock, fallback safe                | ✅ Emotionally Safe|
| decay-prevention-suite.test.ts      | decay-prevention-suite           | 4.2–5.0          | ❌                 | Drift detection, prompt evolution, fallback safe         | ✅ Emotionally Safe|
| system-resilience-core.test.ts      | system-resilience-core           | 4.2–5.0          | ✅                 | Multi-step fallback, recovery, emotional continuity      | ✅ Emotionally Safe|
| schema-migration-emotion.test.ts    | schema-migration-emotion         | 4.2–5.0          | ❌                 | Schema migration, emotional metadata parity              | ✅ Emotionally Safe|
| traceid-continuity.test.ts          | traceid-continuity               | 4.2–5.0          | ❌                 | TraceId propagation, fallback chain audit                | ✅ Emotionally Safe|
| ab-emotion-parity.test.ts           | ab-emotion-parity                | 4.2–5.0          | ❌                 | A/B variant emotional parity                             | ✅ Emotionally Safe|
| fallback-cross-talk.test.ts         | fallback-cross-talk              | 4.2–5.0          | ✅                 | Fallback isolation, emotional integrity                  | ✅ Emotionally Safe|
| fallback-nesting-integrity.test.ts  | fallback-nesting-integrity       | 4.2–5.0          | ✅                 | Nested fallback, non-leaky chain                         | ✅ Emotionally Safe|
| rate-limit-message-wrapper.test.ts  | rate-limit-message-wrapper       | 4.2–5.0          | ✅                 | Rate-limit UX, trust preservation                        | ✅ Emotionally Safe|
| sarcasm-tone-misclassify.test.ts    | sarcasm-tone-misclassify         | 4.2–5.0          | ❌                 | Sarcasm/irony rejection, intent clarity                  | ✅ Emotionally Safe|
| snapshot-key-rotation.test.ts       | snapshot-key-rotation            | 4.2–5.0          | ❌                 | Cryptographic snapshot, key rotation                     | ✅ Emotionally Safe|
| snapshot-duplicate-race.test.ts     | snapshot-duplicate-race          | 4.2–5.0          | ❌                 | Race prevention, snapshot consistency                    | ✅ Emotionally Safe|
| multi-locale-tone-parity.test.ts    | multi-locale-tone-parity         | 4.2–5.0          | ❌                 | Locale parity, emotional consistency                     | ✅ Emotionally Safe|
| chaos-emotional-drift.test.ts       | chaos-emotional-drift            | 4.2–5.0          | ✅                 | Chaos scenario, drift detection                          | ✅ Emotionally Safe|
| fallback-cascade-integrity.test.ts  | fallback-cascade-integrity       | 4.2–5.0          | ✅                 | Cascade robustness, emotional alignment                  | ✅ Emotionally Safe|
| prompt-forward-compat.test.ts       | prompt-forward-compat            | 4.2–5.0          | ❌                 | Prompt evolution, forward compatibility                  | ✅ Emotionally Safe|
| trust-restore-post-coldstart.test.ts| trust-restore-post-coldstart     | 4.2–5.0          | ❌                 | TrustScore restoration, coldstart resilience             | ✅ Emotionally Safe|
| open-telemetry-span-gap.test.ts     | open-telemetry-span-gap          | 4.2–5.0          | ❌                 | Telemetry span continuity, observability                 | ✅ Emotionally Safe|
| golden-emotion-snapshot.test.ts     | golden-emotion-snapshot          | 4.2–5.0          | ❌                 | Golden snapshot, regression-proof                        | ✅ Emotionally Safe|
| fallback-contamination-sandbox.test.ts| fallback-contamination-sandbox | 4.2–5.0          | ✅                 | Fallback sandboxing, contamination prevention            | ✅ Emotionally Safe|
| agent-workflow-sequencing.test.ts   | agent-workflow-sequencing        | 4.2–5.0          | ❌                 | Multi-agent sequencing, emotional output                 | ✅ Emotionally Safe|
| emotional-spectrum-coverage.test.ts | emotional-spectrum-coverage      | 4.2–5.0          | ❌                 | Full emotional spectrum, tone fidelity                   | ✅ Emotionally Safe|
| schema-backward-compat.test.ts      | schema-backward-compat           | 4.2–5.0          | ❌                 | Schema backward compatibility, emotional integrity       | ✅ Emotionally Safe|
| traceid-failure-recovery.test.ts    | traceid-failure-recovery         | 4.2–5.0          | ✅                 | TraceId recovery, failure resilience                     | ✅ Emotionally Safe|
| fallback-depth-limit.test.ts        | fallback-depth-limit             | 4.2–5.0          | ✅                 | Fallback depth limiting, resource protection             | ✅ Emotionally Safe|
| security-input-sanitization.test.ts | security-input-sanitization      | 4.2–5.0          | ❌                 | Input sanitization, emotional intent preservation        | ✅ Emotionally Safe|
| locale-translation-accuracy.test.ts | locale-translation-accuracy      | 4.2–5.0          | ❌                 | Translation accuracy, emotional parity                   | ✅ Emotionally Safe|
| chaos-network-failure.test.ts       | chaos-network-failure            | 4.2–5.0          | ✅                 | Network chaos, emotional continuity                      | ✅ Emotionally Safe|
| trustscore-unrecoverable-drop.test.ts| trustscore-unrecoverable-drop   | 4.2–5.0          | ✅                 | TrustScore drop, system block/recovery                   | ✅ Emotionally Safe|
| performance-baseline.test.ts        | performance-baseline             | 4.2–5.0          | ❌                 | Performance baseline, emotional UX speed                 | ✅ Emotionally Safe|
| snapshot-approval-gate.test.ts      | snapshot-approval-gate           | 4.2–5.0          | ❌                 | Snapshot approval, drift prevention                      | ✅ Emotionally Safe|
| chaos-agent-outage.test.ts          | chaos-agent-outage               | 4.2–5.0          | ✅                 | Agent outage, fallback logic                             | ✅ Emotionally Safe|
| chaos-disk-failure.test.ts          | chaos-disk-failure               | 4.2–5.0          | ✅                 | Disk failure, recovery logic                             | ✅ Emotionally Safe|
| Codex-AutoRollback-Resilience       | auto-rollback-resilience         | 4.2–5.0          | ✅                 | Real contract, emotional fallback enforced               | ✅ Emotionally Safe|
| Codex-Drift-Correction-Enforcer     | drift-correction-enforcer        | —                | —                  | 🚫 Ritual Fail: System contract missing                  | 🚫 Ritual Fail     |
| Codex-Consent-Compliance-Guard      | consent-compliance-guard         | —                | —                  | 🚫 Ritual Fail: System contract missing                  | 🚫 Ritual Fail     | 