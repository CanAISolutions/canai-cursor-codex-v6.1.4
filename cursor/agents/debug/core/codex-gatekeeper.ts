/**
 * @file codex-gatekeeper.ts
 * @description Codex Edition v4.1.3 – Secure Fix Merger and GitHub PR Creator.
 * Applies AI-generated patches to the codebase, commits changes, pushes to a branch,
 * and opens a pull request on GitHub.
 */

import { FixProposal } from "../engines/ai-provider";
import { appendToFixContextAsync } from "../context/fix-context-utils";
import { execAsync, sanitizeShellInput } from "../utils/shell-utils";
import { recordMetric } from "../utils/telemetry";
// import { createPullRequest } from "./codex-github";
import { existsSync } from "fs";

/**
 * Applies a fix proposal by:
 * 1. Stashing current changes
 * 2. Applying patch to repo
 * 3. Committing the change
 * 4. Creating a new branch
 * 5. Pushing to remote
 * 6. Opening a pull request
 *
 * @param fixProposal - AI-generated fix to apply and commit
 * @param opts - Execution options including traceId, AbortSignal, and branch name
 * @param config - GitHub config block from `.cursorrules`
 * @returns Promise<string> - PR URL if successful
 */
export async function enforceMergeGate(
  fixProposal: FixProposal,
  opts: {
    traceId: string;
    signal?: AbortSignal;
    createBranch: string;
  },
  config: {
    token: string;
    owner: string;
    repo: string;
    baseBranch: string;
  }
): Promise<string> {
  const { patch, filepath, reason } = fixProposal;
  const { traceId, signal, createBranch } = opts;

  if (signal?.aborted) {
    throw createPipelineError("Merge cancelled", "MERGE_ABORTED", "cancelled", "Operation was aborted");
  }

  if (!existsSync(".git")) {
    throw createPipelineError("No Git repository found", "NO_GIT_REPO", "merge", "Initialize a Git repository");
  }

  try {
    // Step 1: Stash local changes
    await appendToFixContextAsync(`[${traceId}] Stashing current work...`);
    await execAsync(`git stash push -m "CanAI rollback stash [${traceId}]"`);

    // Step 2: Create new branch
    await appendToFixContextAsync(`[${traceId}] Creating branch ${createBranch}...`);
    await execAsync(`git checkout -b ${sanitizeShellInput(createBranch)}`);

    // Step 3: Verify patch target
    await appendToFixContextAsync(`[${traceId}] Verifying patch for ${filepath}...`);
    // Codex: Write patch to temp file for git apply, since execAsync does not support input piping
    const tmpPatchFile = `canai-fix-${traceId}.patch`;
    require('fs').writeFileSync(tmpPatchFile, patch, 'utf-8');
    const { stdout } = await execAsync(`git apply --numstat ${tmpPatchFile}`);
    const affectedFiles = stdout
      .split("\n")
      .map(line => line.split("\t").pop())
      .filter(Boolean);

    if (!affectedFiles.includes(filepath)) {
      require('fs').unlinkSync(tmpPatchFile);
      throw createPipelineError(
        `Patch modifies unexpected files: ${affectedFiles.join(", ")}`,
        "INVALID_PATCH_TARGETS",
        "merge",
        "Ensure patch targets only the specified filepath"
      );
    }

    // Step 4: Apply the patch
    await appendToFixContextAsync(`[${traceId}] Applying patch to ${filepath}...`);
    await execAsync(`git apply --unidiff-zero --whitespace=fix ${tmpPatchFile}`);
    require('fs').unlinkSync(tmpPatchFile);

    // Step 5: Commit the patch
    await appendToFixContextAsync(`[${traceId}] Committing patch...`);
    await execAsync(`git add ${sanitizeShellInput(filepath)}`);
    await execAsync(`git commit -m "CanAI fix: ${sanitizeShellInput(reason)} [${traceId}]"`);

    // Step 6: Push branch to remote
    await appendToFixContextAsync(`[${traceId}] Pushing branch ${createBranch} to origin...`);
    await execAsync(`git push -u origin ${sanitizeShellInput(createBranch)}`);

    // Step 7: Create PR via GitHub API
    // const prUrl = await createPullRequest(
    //   {
    //     branch: createBranch,
    //     title: `Fix: ${reason} [${traceId}]`,
    //     description: `Automated fix for \`${filepath}\`.\n\nTrace ID: \`${traceId}\``,
    //   },
    //   config,
    //   traceId
    // );
    // Step 8: Record success
    // await appendToFixContextAsync(`[${traceId}] Pull request created: ${prUrl}`);
    // recordMetric("pr_created", { traceId, prUrl });
    // return prUrl;
    // Codex fallback: return branch name as PR URL placeholder
    await appendToFixContextAsync(`[${traceId}] Pull request creation skipped (codex-github not implemented).`);
    recordMetric("pr_created_skipped", { traceId, branch: createBranch });
    return createBranch;
  } catch (err: any) {
    await appendToFixContextAsync(`[${traceId}] Merge failed: ${err.message}`);
    recordMetric("merge_failed", { traceId, filepath, error: err.message });

    throw createPipelineError(
      `Merge failed for ${filepath}: ${err.message}`,
      err.errorCode || "MERGE_FAILED",
      "merge",
      err.recovery || "Check Git status, remote, or patch validity"
    );
  }
}

/**
 * Constructs a typed pipeline error with metadata.
 */
export function createPipelineError(
  message: string,
  errorCode: string,
  errorType: "validation" | "merge" | "cancelled" | "ai" | "system",
  recovery?: string
): Error {
  const error = new Error(message);
  error.name = "PipelineError";
  Object.assign(error, { errorCode, errorType, recovery });
  return error;
}
