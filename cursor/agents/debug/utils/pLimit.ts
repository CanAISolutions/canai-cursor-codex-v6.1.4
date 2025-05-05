/**
 * @file pLimit.ts
 * @description Codex Edition v4.1.3 – Concurrency Wrapper with Trace Enforcement.
 * Wraps p-limit for consistent usage and future audit control.
 */

import pLimitOriginal from 'p-limit';

/**
 * Codex-compliant export for controlled async concurrency.
 * Replace all imports of p-limit with this wrapped version to enforce standard usage.
 */
export const pLimit = pLimitOriginal;
