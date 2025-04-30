/**
 * @file admin_status.ts
 * @description Internal API endpoint exposing critical admin system metadata.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

import { NextApiRequest, NextApiResponse } from "next";

const startTime = Date.now();

/**
 * Admin status endpoint for runtime metadata exposure.
 * Includes env, uptime, build info, and safe diagnostic metadata.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

    res.status(200).json({
      success: true,
      environment: process.env.NODE_ENV || "unknown",
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "not_set",
      buildVersion: process.env.BUILD_VERSION || "unknown",
      uptime: `${uptimeSeconds}s`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[admin_status] Fatal error:", error);

    res.status(500).json({
      success: false,
      error: { code: "ADMIN_STATUS_FAILED", message: "Failed to retrieve admin status information." },
    });
  }
}
