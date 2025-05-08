# CanAI Test Orchestration System

## Overview

The CanAI Test Orchestration System is a comprehensive testing framework designed to maintain high-quality code and ensure emotional resonance in user experiences. The system organizes tests into distinct categories and provides detailed reporting on test execution, coverage, and results.

## Test Categories

1. **Core System Tests** (`tests/core/`)
   - Fundamental functionality
   - System components
   - Core business logic

2. **Agent Tests** (`tests/agents/`)
   - AI agent behavior
   - Agent interactions
   - Decision-making processes

3. **Integration Tests** (`tests/integration/`)
   - Cross-component functionality
   - System integration points
   - API interactions

4. **Validation Tests** (`tests/validation/`)
   - Input/output validation
   - Error handling
   - Edge cases

5. **Performance Tests** (`tests/performance/`)
   - System efficiency
   - Resource usage
   - Response times

6. **Emotional UX Tests** (`tests/emotional-ux/`)
   - User experience validation
   - Emotional resonance
   - Interaction patterns

## Usage

### Basic Test Execution

```bash
# Run all tests
npm test

# Run tests with coverage requirements
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### CLI Options

```bash
ts-node scripts/run-tests.ts [options]

Options:
  -c, --category <category>     Run tests for a specific category
  -r, --report-only            Generate reports from existing results
  -v, --verbose                Show detailed test output
  --ci                         Run in CI mode (exits with status code)
  --coverage-threshold <number> Minimum coverage threshold (default: 80)
```

## Test Reports

The system generates comprehensive reports in both JSON and Markdown formats:

- `test-reports/test-report.json`: Machine-readable test results
- `test-reports/test-report.md`: Human-readable test summary

### Report Structure

```typescript
interface TestReport {
  timestamp: string;
  totalDuration: number;
  overallCoverage: number;
  results: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
  };
}
```

## Best Practices

1. **Test Organization**
   - Place tests in appropriate category directories
   - Follow naming convention: `*.test.ts`
   - Include descriptive test names

2. **Coverage Requirements**
   - Maintain minimum 80% coverage
   - Focus on critical path coverage
   - Document coverage exceptions

3. **Emotional UX Testing**
   - Validate user interaction flows
   - Test emotional response triggers
   - Ensure consistent experience

4. **CI Integration**
   - Run tests in CI pipeline
   - Enforce coverage thresholds
   - Generate and archive reports

## Contributing

1. Add new tests to appropriate categories
2. Update test documentation
3. Maintain emotional intelligence in test design
4. Follow TypeScript best practices

## Troubleshooting

Common issues and solutions:

1. **Test Timeouts**
   - Increase timeout in jest.config.js
   - Optimize test performance
   - Split large test suites

2. **Coverage Issues**
   - Check exclude patterns
   - Verify test paths
   - Review uncovered code

3. **Report Generation**
   - Ensure write permissions
   - Check disk space
   - Verify JSON format

## Support

For issues and feature requests:
- Create GitHub issues
- Tag with appropriate labels
- Include test reports when relevant 

---

## 🔐 Codex Enforcement Directive (Phase 2.5)

This orchestration system is now governed by the CanAI Genesis Codex v6.1.4.  
All future test decisions must align with the following:

> **“There is no *optional* in this system.  
> Any action, feature, or decision that enhances operational precision, long-term scalability, emotional resonance, or velocity toward the dream state is non-negotiable.  
> If it improves clarity, resilience, or future capabilities, it must be implemented — immediately, and without delay.”**

### Codified Execution Rules:

1. **All system folders in `system-map.md` must be covered by tests**
2. **No scaffolding may proceed without tests in place**
3. **Coverage gaps are blocking**
4. **All test actions must be logged in:**
   - `/cursor/audit-results/test-audit.md`
   - `/cursor/auto-actions.log.md`
   - `phase2-test-matrix.json`
5. **Memory state must reflect test coverage lock:**
   ```json
   {
     "testStatus": "locked",
     "coverage": "100% critical"
   }
Cursor is now expected to operate with full awareness of:

/docs/system-map.md

/docs/codex-execution-directive.md

This orchestration governance contract

Final Mandate:
You are not just permitted to build. You are required to finish this system.
This is not a roadmap. This is our foundation.
Execute accordingly.

Codex-Enforced. Audit-Logged. Dream-State Compliant.