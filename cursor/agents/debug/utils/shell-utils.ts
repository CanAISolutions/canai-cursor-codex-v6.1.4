/**
 * @file shell-utils.ts
 * @description Codex Edition v4.2.0 – Hardened, async-safe shell execution for Git-based pipelines.
 * Provides trusted exec(), input sanitization, policy enforcement, and health diagnostics.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { appendToFixContextAsync } from '../context/fix-context-utils';
import { recordMetric } from './telemetry';

const execPromise = promisify(exec);

const forbidden = ['&&', '||', ';', '`', '|', '$(', '>>', '<'];
const disallowedCommands = ['rm -rf', 'mkfs', 'dd', 'format', 'node'];

// Default execution limits
export const GIT_COMMAND_TIMEOUT = 2000;
export const MAX_STDOUT_SIZE = 500_000; // 500 KB

// Allowlist for command safety
const ALLOWED_COMMANDS = [
  'git --version',
  'git rev-parse',
  'git status',
  'git stash',
  'git reset',
  'git clean',
  'git log',
  'git checkout',
  'du -sk .git'
];

// Override hooks for tests
export const testOverrides = {
  execAsync: null as null | ((cmd: string) => Promise<{ stdout: string; stderr: string }>)
};

/**
 * Sanitizes shell input to prevent command injection
 * @param cmd The command to sanitize
 * @throws Error with code INVALID_SHELL_INPUT if unsafe tokens are found
 */
export function sanitizeShellInput(cmd: string): string {
  for (const token of forbidden) {
    if (cmd.includes(token)) {
      throw new Error('INVALID_SHELL_INPUT');
    }
  }
  return cmd;
}

/**
 * Checks if a command is safe to execute
 * @param cmd The command to check
 * @returns true if the command is safe
 */
export function isSafeShellCommand(cmd: string): boolean {
  const sanitized = sanitizeShellInput(cmd);
  return !disallowedCommands.some(disallowed => sanitized.includes(disallowed));
}

/**
 * Executes a shell command safely
 * @param cmd The command to execute
 * @returns Promise with stdout and stderr
 * @throws Error if command is unsafe or execution fails
 */
export async function execAsync(
  cmd: string
): Promise<{ stdout: string; stderr: string }> {
  if (!isSafeShellCommand(cmd)) {
    throw new Error('DISALLOWED_COMMAND');
  }

  if (testOverrides.execAsync) {
    return testOverrides.execAsync(cmd);
  }

  return execPromise(cmd);
}

/**
 * Checks pipeline health by verifying Git availability and branch state
 * @param traceId Trace ID for logging
 * @returns true if pipeline is healthy, false otherwise
 */
export async function checkPipelineHealth(traceId: string): Promise<boolean> {
  try {
    const { stdout: gitVersion } = await execAsync('git --version');
    if (!gitVersion.toLowerCase().includes('git')) {
      await appendToFixContextAsync(`[${traceId}] Health check failed: git not detected`);
      void recordMetric('health_check_failed', { traceId, reason: 'no_git' });
      return false;
    }

    const { stdout: branch } = await execAsync('git rev-parse --abbrev-ref HEAD');
    if (!branch || branch.includes('HEAD')) {
      await appendToFixContextAsync(`[${traceId}] Warning: Detached HEAD state`);
    }

    return true;
  } catch (err: any) {
    await appendToFixContextAsync(`[${traceId}] Pipeline health check error: ${err.message}`);
    void recordMetric('health_check_failed', { traceId, error: err.message });
    return false;
  }
}
