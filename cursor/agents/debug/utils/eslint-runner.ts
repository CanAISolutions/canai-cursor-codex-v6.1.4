/**
 * @file eslint-runner.ts
 * @description Runs ESLint programmatically on a target file and returns error counts for scoring.
 */

import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

/**
 * Executes ESLint against a file and returns its error count.
 *
 * @param filepath - Absolute or relative path to file
 * @param configFile - ESLint config file (e.g. .eslintrc.json)
 * @param traceId - Used for logging
 * @returns { errorCount: number }
 */
export async function runESLintAnalysis(
  filepath: string,
  configFile: string,
  traceId: string
): Promise<{ errorCount: number }> {
  try {
    const { stdout } = await execPromise(
      `npx eslint "${filepath}" -c "${configFile}" -f json`
    );

    const [result] = JSON.parse(stdout);
    const errorCount = result.errorCount || 0;

    return { errorCount };
  } catch (err: any) {
    if (err.stdout) {
      // Still parseable even with exit code 1
      try {
        const [result] = JSON.parse(err.stdout);
        const errorCount = result.errorCount || 0;
        return { errorCount };
      } catch (parseErr) {
        throw new Error(
          `ESLint JSON parsing failed for ${filepath}: ${parseErr.message}`
        );
      }
    }

    throw new Error(
      `ESLint execution failed on ${filepath} [${traceId}]: ${err.message}`
    );
  }
}
