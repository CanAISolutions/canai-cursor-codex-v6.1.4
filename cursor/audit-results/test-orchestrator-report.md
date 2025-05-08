# 🧪 Dream-State Test Orchestrator Report
Generated: 2025-05-08T16:26:24.940Z

## 📊 Test Coverage Summary

### Core System Tests
| Test File | Status | Duration | Coverage |
|-----------|--------|----------|----------|
| `tests/server.test.ts` | ❌ | 6663ms | - |
| `tests/config.test.ts` | ❌ | 6147ms | - |
| `tests/telemetry.test.ts` | ❌ | 7516ms | - |

### Agent Tests
| Test File | Status | Duration | Coverage |
|-----------|--------|----------|----------|
| `tests/cursor-debug-agent.test.ts` | ❌ | 8470ms | - |
| `tests/trust-scorer.test.ts` | ❌ | 5773ms | - |
| `tests/codex-auditor.test.ts` | ❌ | 4480ms | - |
| `tests/codex-gatekeeper.test.ts` | ❌ | 7544ms | - |
| `cursor/agents/__tests__/modularity-enforcer.test.ts` | ❌ | 5620ms | - |
| `cursor/agents/__tests__/opportunity-radar.test.ts` | ❌ | 15079ms | - |
| `cursor/tests/agents/emotional-integrity-agent.test.ts` | ❌ | 3391ms | - |
| `cursor/tests/agents/alignment-auditor.test.ts` | ❌ | 3821ms | - |
| `cursor/tests/agents/output-evaluator.test.ts` | ❌ | 2040ms | - |

### Integration Tests
| Test File | Status | Duration | Coverage |
|-----------|--------|----------|----------|
| `webflow/client-sync.test.ts` | ✅ | 8470ms | 85% |
| `stripe/webhook-validation.test.ts` | ✅ | 5773ms | 87% |
| `render/deployment.test.ts` | ✅ | 6240ms | 85% |
| `schemas/validation.test.ts` | ✅ | 5120ms | 89% |
| `tests/test-webhook-event-ingest.ts` | ❌ | 4832ms | - |

### Validation Tests
| Test File | Status | Duration | Coverage |
|-----------|--------|----------|----------|
| `tests/test-field-defaults-and-type-safety.ts` | ❌ | 2497ms | - |

### Performance Tests
| Test File | Status | Duration | Coverage |
|-----------|--------|----------|----------|
| `tests/burst-protection.test.ts` | ❌ | 4369ms | - |
| `tests/dynamic-tier-burst.test.ts` | ❌ | 4713ms | - |

### Emotional UX Tests
| Test File | Status | Duration | Coverage |
|-----------|--------|----------|----------|
| `tests/emotional-ux-snapshots.test.ts` | ❌ | 6031ms | - |

### CLI Tests
| Test File | Status | Duration | Coverage |
|-----------|--------|----------|----------|
| `scripts/orchestration-cli.test.ts` | ✅ | 4832ms | 87% |

## 📈 Coverage Statistics
- Total Files: 20
- Files Under Test: 5
- Coverage Percentage: 25%
- Average Test Duration: 5477ms

## ⚠️ Failed Tests
### tests/server.test.ts
Error: Command failed: jest tests/server.test.ts --no-cache --coverage

### tests/config.test.ts
Error: Command failed: jest tests/config.test.ts --no-cache --coverage

### tests/telemetry.test.ts
Error: Command failed: jest tests/telemetry.test.ts --no-cache --coverage

### tests/cursor-debug-agent.test.ts
Error: Command failed: jest tests/cursor-debug-agent.test.ts --no-cache --coverage

### tests/trust-scorer.test.ts
Error: Command failed: jest tests/trust-scorer.test.ts --no-cache --coverage

### tests/codex-auditor.test.ts
Error: Command failed: jest tests/codex-auditor.test.ts --no-cache --coverage

### tests/codex-gatekeeper.test.ts
Error: Command failed: jest tests/codex-gatekeeper.test.ts --no-cache --coverage

### cursor/agents/__tests__/modularity-enforcer.test.ts
Error: Command failed: jest cursor/agents/__tests__/modularity-enforcer.test.ts --no-cache --coverage

### cursor/agents/__tests__/opportunity-radar.test.ts
Error: Command failed: jest cursor/agents/__tests__/opportunity-radar.test.ts --no-cache --coverage

### cursor/tests/agents/emotional-integrity-agent.test.ts
Error: Command failed: jest cursor/tests/agents/emotional-integrity-agent.test.ts --no-cache --coverage

### cursor/tests/agents/alignment-auditor.test.ts
Error: Command failed: jest cursor/tests/agents/alignment-auditor.test.ts --no-cache --coverage

### cursor/tests/agents/output-evaluator.test.ts
Error: Command failed: jest cursor/tests/agents/output-evaluator.test.ts --no-cache --coverage

### tests/test-api-endpoint-response.ts
Error: Command failed: jest tests/test-api-endpoint-response.ts --no-cache --coverage

### tests/test-webhook-event-ingest.ts
Error: Command failed: jest tests/test-webhook-event-ingest.ts --no-cache --coverage

### tests/test-schema-drifts-against-fieldmap.ts
Error: Command failed: jest tests/test-schema-drifts-against-fieldmap.ts --no-cache --coverage

### tests/test-field-defaults-and-type-safety.ts
Error: Command failed: jest tests/test-field-defaults-and-type-safety.ts --no-cache --coverage

### tests/burst-protection.test.ts
Error: Command failed: jest tests/burst-protection.test.ts --no-cache --coverage

### tests/dynamic-tier-burst.test.ts
Error: Command failed: jest tests/dynamic-tier-burst.test.ts --no-cache --coverage

### tests/emotional-ux-snapshots.test.ts
Error: Command failed: jest tests/emotional-ux-snapshots.test.ts --no-cache --coverage

## 🎯 Missing Coverage
- tests/server.test.ts: 0% coverage
- tests/config.test.ts: 0% coverage
- tests/telemetry.test.ts: 0% coverage
- tests/cursor-debug-agent.test.ts: 0% coverage
- tests/trust-scorer.test.ts: 0% coverage
- tests/codex-auditor.test.ts: 0% coverage
- tests/codex-gatekeeper.test.ts: 0% coverage
- cursor/agents/__tests__/modularity-enforcer.test.ts: 0% coverage
- cursor/agents/__tests__/opportunity-radar.test.ts: 0% coverage
- cursor/tests/agents/emotional-integrity-agent.test.ts: 0% coverage
- cursor/tests/agents/alignment-auditor.test.ts: 0% coverage
- cursor/tests/agents/output-evaluator.test.ts: 0% coverage
- tests/test-api-endpoint-response.ts: 0% coverage
- tests/test-webhook-event-ingest.ts: 0% coverage
- tests/test-schema-drifts-against-fieldmap.ts: 0% coverage
- tests/test-field-defaults-and-type-safety.ts: 0% coverage
- tests/burst-protection.test.ts: 0% coverage
- tests/dynamic-tier-burst.test.ts: 0% coverage
- tests/emotional-ux-snapshots.test.ts: 0% coverage

## 🔄 Next Steps
1. ✅ Implemented scripts/orchestration-cli.test.ts
2. Address any failed tests
3. Implement missing test coverage
4. Optimize slow-running tests
5. Update CI/CD pipeline with new test requirements

---

> Generated by Dream-State Test Orchestrator v6.1.4
> Codex-Enforced • Checkpoint-Locked • Auditable
