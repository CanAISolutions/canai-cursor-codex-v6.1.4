import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const forbidden = ['&&', '||', ';', '`', '|', '$(', '>>', '<'];
const disallowedCommands = ['rm -rf', 'mkfs', 'dd', 'format'];

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

  return execPromise(cmd);
} 