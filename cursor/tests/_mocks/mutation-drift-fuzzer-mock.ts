// mutation-drift-fuzzer-mock.ts
// WHAT: Version-tagged mock for mutation drift fuzzer integration tests
// WHY: Enables simulation of schema drift, logic mutation, and prompt misalignment for Codex trust validation
// HOW: Provides a mock fuzzer with event logging, mutation simulation, and drift detection

export interface MutationDriftEvent {
  type: 'drift-detected' | 'prompt-inconsistency' | 'schema-blocked' | 'mutation-applied' | 'uncaught-mutation';
  detail?: string;
}

interface MutationDriftFuzzerMockOptions {
  allowUncaught?: boolean;
}

/**
 * MutationDriftFuzzerMockV1 — Simulates mutation and drift across agent, memory, validator, and prompt
 * Version: v1.0.0
 */
export class MutationDriftFuzzerMockV1 {
  public readonly version = 'v1.0.0';
  private opts: MutationDriftFuzzerMockOptions;

  constructor(options: MutationDriftFuzzerMockOptions = {}) {
    this.opts = options;
  }

  async run(
    input: {
      agentConfig: Record<string, any>;
      memoryState: Record<string, any>;
      validatorLogic: Record<string, any>;
      promptText: string;
    },
    onEvent: (event: MutationDriftEvent) => void
  ): Promise<{ output: any; failures: string[] }> {
    const failures: string[] = [];
    let output = { summary: '', version: this.version };
    // Simulate random field drift in memory
    if (Math.random() < 0.5) {
      delete input.memoryState.legacyField;
      onEvent({ type: 'mutation-applied', detail: 'Removed legacyField from memory' });
      onEvent({ type: 'drift-detected', detail: 'Field removal detected' });
    }
    // Simulate logic mutation in validator
    if (input.validatorLogic.schemaVersion < 1) {
      onEvent({ type: 'mutation-applied', detail: 'Validator using outdated schema' });
      onEvent({ type: 'schema-blocked', detail: 'Outdated schema blocked' });
      failures.push('Schema blocked');
    }
    // Simulate prompt text mutation
    if (Math.random() < 0.5) {
      input.promptText = input.promptText.replace('summary', 'overview');
      onEvent({ type: 'mutation-applied', detail: 'Prompt text mutated' });
      onEvent({ type: 'prompt-inconsistency', detail: 'Prompt output diverged' });
    }
    // Simulate agent config mutation
    if (input.agentConfig.mode === 'mutated' && this.opts.allowUncaught) {
      onEvent({ type: 'uncaught-mutation', detail: 'Uncaught agent config mutation' });
      throw new Error('uncaught mutation: agent config drift');
    }
    // Deterministic output if no mutations
    output.summary = input.promptText;
    return { output, failures };
  }
} 