/**
 * @file selfcheck_trigger.ts
 * @description Internal API endpoint for triggering system selfcheck routines manually or via automation.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

import { NextApiRequest, NextApiResponse } from "next";

/**
 * Internal route for triggering a selfcheck.
 * Calls the `/devtools/selfcheck-api` endpoint internally and returns results.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const response = await fetch(`${baseUrl}/api/devtools/selfcheck-api`);
    const data = await response.json();

    if (!data.success) {
      return res.status(500).json({
        success: false,
        error: { code: "SELF_CHECK_FAILED", message: "One or more system selfchecks failed.", results: data.results },
      });
    }

    res.status(200).json({
      success: true,
      message: "Selfcheck passed successfully.",
      results: data.results,
    });
  } catch (error) {
    console.error("[selfcheck_trigger] Fatal error during selfcheck trigger:", error);

    res.status(500).json({
      success: false,
      error: { code: "SELF_CHECK_TRIGGER_ERROR", message: "Failed to trigger or complete system selfcheck." },
    });
  }
}
