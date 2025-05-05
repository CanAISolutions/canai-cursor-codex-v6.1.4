/**
 * @file trust-scorer.ts
 * @description Codex Edition v4.1.3 – Trust Evaluation Engine
 * Scores a fix proposal using heuristics, ESLint static analysis, and optional AI-based scoring.
 */

import { FixProposal, BugContext, AIProvider } from "../engines/ai-provider";
import { recordMetric } from "../utils/telemetry";
import { appendToFixContextAsync } from "../context/fix-context-utils";
import { runESLintAnalysis } from "../utils/eslint-runner";

/**
 * Computes a normalized trust score (0–10) for a proposed fix.
 *
 * @param fixProposal - The fix to evaluate
 * @param bugContext - Log-derived context (e.g. affected files)
 * @param eslintConfig - Config from .cursorrules for static analysis
 * @param aiProvider - Optional AI provider for semantic trust evaluation
 * @param traceId - Trace ID for log attribution
 * @returns Final trust score (0.0 to 10.0)
 */
export async function computeTrustScore(
  fixProposal: FixProposal,
  bugContext: BugContext,
  eslintConfig: {
    enabled: boolean;
    configFile: string;
    maxErrors: number;
    errorPenalty: number;
  },
  traceId: string,
  aiProvider?: AIProvider
): Promise<number> {
  let score = 5.0; // Neutral baseline

  const patchLineCount = fixProposal.patch.split("\n").length;

  // Heuristic: Penalize oversized patches
  if (patchLineCount > 100) {
    score -= 2;
    await appendToFixContextAsync(`[${traceId}] Patch size penalty: -2 (Lines: ${patchLineCount})`);
  }

  // Heuristic: Reward for matching bug context
  const impacted = bugContext.impact || [];
  const aligned = impacted.some((impactedFile) =>
    fixProposal.filepath.includes(impactedFile)
  );
  if (aligned) {
    score += 1.5;
    await appendToFixContextAsync(`[${traceId}] Filepath impact match bonus: +1.5`);
  }

  // Heuristic: Penalize missing rationale
  if (!fixProposal.reason || fixProposal.reason.trim().length < 10) {
    score -= 1;
    await appendToFixContextAsync(`[${traceId}] Weak reasoning penalty: -1`);
  }

  // Heuristic: ESLint static analysis (if enabled)
  if (eslintConfig.enabled) {
    try {
      const lintResult = await runESLintAnalysis(fixProposal.filepath, eslintConfig.configFile, traceId);
      const errorCount = lintResult.errorCount || 0;
      const penalty = Math.min(errorCount * eslintConfig.errorPenalty, 3);

      if (errorCount > 0) {
        score -= penalty;
        await appendToFixContextAsync(
          `[${traceId}] ESLint penalty: -${penalty} (${errorCount} errors @ ${eslintConfig.errorPenalty}/ea)`
        );
      } else {
        await appendToFixContextAsync(`[${traceId}] ESLint clean: No errors`);
      }
    } catch (err: any) {
      await appendToFixContextAsync(`[${traceId}] ESLint analysis failed: ${err.message}`);
      recordMetric("trust_eslint_failed", { traceId, error: err.message });
    }
  }

  // AI scoring (optional)
  if (aiProvider) {
    try {
      const aiScore = await aiProvider.evaluateFixTrustScore(fixProposal, bugContext);
      const aiBonus = Math.min(aiScore / 2, 5.0);
      score += aiBonus;
      await appendToFixContextAsync(
        `[${traceId}] AI trust score bonus: +${aiBonus.toFixed(2)} (Raw: ${aiScore})`
      );
    } catch (err: any) {
      await appendToFixContextAsync(`[${traceId}] AI trust score failed: ${err.message}`);
      recordMetric("trust_ai_failed", { traceId, error: err.message });
    }
  }

  const final = Math.min(Math.max(score, 0), 10);
  await appendToFixContextAsync(`[${traceId}] Final trust score: ${final.toFixed(2)}`);
  recordMetric("trust_computed", {
    traceId,
    score: final,
    patchLineCount,
    reasonLen: fixProposal.reason?.length || 0,
  });

  return final;
}
