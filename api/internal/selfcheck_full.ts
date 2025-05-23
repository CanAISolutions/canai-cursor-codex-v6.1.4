/**
 * @file selfcheck_full.ts
 * @description Comprehensive system-wide selfcheck endpoint aggregating all core health checks.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

import { NextApiRequest, NextApiResponse } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/**
 * Aggregates multiple subsystem selfchecks and returns unified health status.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const results = await Promise.allSettled([
      fetch(`${baseUrl}/api/devtools/selfcheck-api`).then((res) => res.json()),
      fetch(`${baseUrl}/api/webhook_health`).then((res) => res.json()),
      fetch(`${baseUrl}/api/internal/admin_status`).then((res) => res.json()),
    ]);

    const parsedResults: {
      selfcheck: { success?: boolean } | null;
      webhookHealth: { success?: boolean } | null;
      adminStatus: { success?: boolean } | null;
    } = {
      selfcheck: results[0].status === "fulfilled" ? (results[0].value as { success?: boolean }) : null,
      webhookHealth: results[1].status === "fulfilled" ? (results[1].value as { success?: boolean }) : null,
      adminStatus: results[2].status === "fulfilled" ? (results[2].value as { success?: boolean }) : null,
    };

    const allPassed = parsedResults.selfcheck?.success && parsedResults.webhookHealth?.success && parsedResults.adminStatus?.success;

    if (!allPassed) {
      return res.status(500).json({
        success: false,
        error: { code: "FULL_SELF_CHECK_FAILED", message: "One or more system modules failed selfcheck.", results: parsedResults },
      });
    }

    res.status(200).json({
      success: true,
      message: "All core selfchecks passed successfully.",
      results: parsedResults,
    });
  } catch (error) {
    console.error("[selfcheck_full] Fatal error during full selfcheck:", error);

    res.status(500).json({
      success: false,
      error: { code: "FULL_SELF_CHECK_ERROR", message: "Full selfcheck encountered an unexpected error." },
    });
  }
}
