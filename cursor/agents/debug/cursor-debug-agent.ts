/**
 * @file cursor-debug-agent.ts
 * @description Codex Edition v4.1.3 – Main orchestrator for the Cursor Debugging Module.
 * Coordinates the debugging pipeline: log validation, bug detection, fix proposal, auditing, scoring, and PR creation.
 */

import { loadConfig } from "../../config/loadConfig";
import { appendToFixContextAsync, initializeFixContext } from "../../context/fix-context-utils";
import { detectBugs, proposeFix, BugContext, FixProposal, AIProvider } from "../../engines/ai-provider";
import { processLog } from "../../core/logProcessor";
import { proposeFix as proposeFixCore } from "../../core/fixProposer";
import { auditPatch } from "../../core/codex-auditor";
import { computeTrustScore } from "../../core/trust-scorer";
import { enforceMergeGate } from "../../core/codex-gatekeeper";
import { maskSensitive } from "../../utils/maskSensitive";
import { validateLog } from "../../utils/log-validator";
import { recordMetric } from "../../utils/telemetry";
import { pRetryWithTrace as pRetry } from './utils/pRetry';
import { pLimit } from './utils/pLimit';
import * as fs from "fs";

/**
 * Configuration type for the debugging pipeline.
 */
interface PipelineInput {
  rawLog: string;
  traceId?: string;
}

/**
 * Generates a unique trace ID for pipeline execution.
 */
function generateTraceId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `trace-${timestamp}-${random}`;
}

/**
 * Runs the debugging pipeline.
 * @param input - Pipeline input (raw log and optional trace ID).
 * @param signal - Abort signal for cancellation.
 * @throws Error if the pipeline fails critically.
 */
export async function runCursorDebugAgent(input: PipelineInput, signal?: AbortSignal): Promise<void> {
  const traceId = input.traceId || generateTraceId();
  const config = loadConfig();
  const limit = pLimit(5); // Concurrency limit

  try {
    await initializeFixContext(traceId);
    await appendToFixContextAsync(`[${traceId}] Starting debugging pipeline...`);
    recordMetric("pipeline_started", { traceId });

    // Step 1: Validate and mask log
    const validatedLog = validateLog(input.rawLog);
    if (!validatedLog) throw new Error("Invalid log format");
    const maskedLog = maskSensitive(validatedLog);
    await appendToFixContextAsync(`[${traceId}] Log validated and PII masked.`);

    // Step 2: Extract log context
    const logContext = processLog(maskedLog);
    await appendToFixContextAsync(`[${traceId}] Log processed. Detected error: ${logContext.errorType}`);

    // Step 3: Detect bug with AI
    const bugContext = await pRetry(() => limit(() =>
      detectBugs(maskedLog, traceId, signal)), { retries: 3, signal }
    );
    if (!bugContext) throw new Error("No bug detected");
    await appendToFixContextAsync(`[${traceId}] Bug detected: ${bugContext.bugType}`);
    recordMetric("bug_detected", { traceId, bugType: bugContext.bugType });

    // Step 4: Propose fix
    let fixProposal: FixProposal | null = null;
    try {
      fixProposal = await pRetry(() =>
        limit(() => proposeFix(bugContext, traceId, signal)), { retries: 3, signal }
      );
    } catch (err) {
      await appendToFixContextAsync(`[${traceId}] AI fix proposal failed: ${(err as Error).message}`);
    }

    if (!fixProposal) {
      fixProposal = await proposeFixCore(bugContext, traceId);
    }

    if (!fixProposal) throw new Error("No fix proposed");
    await appendToFixContextAsync(`[${traceId}] Fix proposed for ${fixProposal.filepath}`);
    recordMetric("fix_proposed", { traceId, filepath: fixProposal.filepath });

    // Step 5: Audit the patch
    const auditResult = await auditPatch(fixProposal, traceId);
    if (!auditResult.passed) {
      throw new Error(`Patch audit failed: ${auditResult.reason}`);
    }
    await appendToFixContextAsync(`[${traceId}] Patch audit passed ✅`);

    // Step 6: Compute trust score
    const trustScore = await computeTrustScore(
      fixProposal,
      bugContext,
      config.eslintConfig,
      traceId,
      config.aiProviderConfig ? { evaluateFixTrustScore: proposeFix } : undefined // Optional AI provider
    );

    if (trustScore < config.trustScoreThreshold) {
      throw new Error(`Trust score ${trustScore} below threshold ${config.trustScoreThreshold}`);
    }

    await appendToFixContextAsync(`[${traceId}] Trust score: ${trustScore}`);
    recordMetric("trust_score_computed", { traceId, trustScore });

    // Step 7: Merge + create pull request
    const prUrl = await enforceMergeGate(
      fixProposal,
      {
        traceId,
        createBranch: `canai-fix-${traceId}`,
      },
      config.githubConfig
    );

    await appendToFixContextAsync(`[${traceId}] Merge + PR complete: ${prUrl}`);
    recordMetric("pipeline_completed", { traceId, prUrl });

  } catch (err: any) {
    await appendToFixContextAsync(`[${traceId}] Pipeline failed ❌: ${err.message}`);
    recordMetric("pipeline_failed", { traceId, error: err.message });
    throw new Error(`Pipeline failed: ${err.message}`);
  }
}

/**
 * Test overrides for mocking.
 */
export const testOverrides = {
  generateTraceId: () => "trace-test-123",
};

/**
 * Main CLI entrypoint.
 */
if (require.main === module) {
  const rawLog = fs.readFileSync("error.log", "utf8");
  runCursorDebugAgent({ rawLog }).catch((err) => {
    console.error(`[cursor-debug-agent] Error: ${err.message}`);
    process.exit(1);
  });
}
