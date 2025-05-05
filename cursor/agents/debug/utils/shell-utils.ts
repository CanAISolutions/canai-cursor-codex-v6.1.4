/**
 * @file shell-utils.ts
 * @description Codex Edition v4.2.0 – Hardened, async-safe shell execution for Git-based pipelines.
 * Provides trusted exec(), input sanitization, policy enforcement, and health diagnostics.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { appendToFixContextAsync } from '../context/fix-context-utils';
import { recordMetric } from '../telemetry';

const execPromise = promisify(exec);

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
  execAsync: null as ((cmd: string, opts?: any) => Promise<{ stdout: string; stderr: string }>) | null
};

/**
 * Sanitizes shell input to block command injection risks.
 */
export function sanitizeShellInput(cmd: string): string {
  const forbidden = ['&&', '||', ';', '`', '|', '$(', '>>', '<'];
  for (const token of forbidden) {
    if (cmd.includes(token)) {
      throw Object.assign(new Error(`Disallowed token in shell input: ${token}`), {
        errorType: 'validation',
        errorCode: 'INVALID_SHELL_INPUT'
      });
    }
  }
  return cmd.trim();
}

/**
 * Validates whether a command is safe and expected for execution.
 */
export function isSafeShellCommand(cmd: string): boolean {
  return ALLOWED_COMMANDS.some(allowed => cmd.trim().startsWith(allowed));
}

/**
 * Executes a shell command safely, with allowlist enforcement, timeout, and max buffer.
 */
export async function execAsync(
  cmd: string,
  opts: { timeout?: number } = {}
): Promise<{ stdout: string; stderr: string }> {
  if (!isSafeShellCommand(cmd)) {
    throw Object.assign(new Error(`Command not permitted: ${cmd}`), {
      errorType: 'validation',
      errorCode: 'DISALLOWED_COMMAND'
    });
  }

  sanitizeShellInput(cmd);
  const execFn = testOverrides.execAsync ?? execPromise;
  const timeout = opts.timeout ?? GIT_COMMAND_TIMEOUT;

  try {
    const { stdout, stderr } = await execFn(cmd, {
      timeout,
      maxBuffer: MAX_STDOUT_SIZE
    });
    return { stdout, stderr };
  } catch (err: any) {
    throw Object.assign(new Error(`Shell execution failed: ${cmd}`), {
      errorType: 'system',
      errorCode: 'SHELL_EXEC_FAILURE',
      details: err.message,
      recovery: 'Check Git availability, permissions, or syntax'
    });
  }
}

/**
 * Health check for Git presence and pipeline readiness.
 */
export async function checkPipelineHealth(traceId: string): Promise<boolean> {
  try {
    const { stdout } = await execAsync('git --version');
    if (!stdout.toLowerCase().includes('git')) {
      await appendToFixContextAsync(`[${traceId}] Health check failed: git not detected`);
      recordMetric('health_check_failed', { traceId, reason: 'no_git' });
      return false;
    }

    const { stdout: branch } = await execAsync('git rev-parse --abbrev-ref HEAD');
    if (!branch || branch.includes('HEAD')) {
      await appendToFixContextAsync(`[${traceId}] Warning: Detached HEAD state`);
    }

    return true;
  } catch (err: any) {
    await appendToFixContextAsync(`[${traceId}] Pipeline health check error: ${err.message}`);
    recordMetric('health_check_failed', { traceId, error: err.message });
    return false;
  }
}
