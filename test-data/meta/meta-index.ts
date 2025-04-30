// /test-data/meta/meta-index.ts

/**
 * @codex-purpose: Expose all meta files in a single importable object
 * @codex-system: Snapshot Coverage Intelligence Layer
 * @codex-critical: Enables CI tools, test runners, and Copilot systems to load coverage and guardrail data centrally
 * @codex-verified: v1.4.2
 */

import coverage from './coverage.json';
import edgeCaseIndex from './edge-case-index.json';
import promptTypeIndex from './promptType-index.json';

export const meta = {
  coverage,
  edgeCaseIndex,
  promptTypeIndex,
};
