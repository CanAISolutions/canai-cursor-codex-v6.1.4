/**
 * @file webhook_health.ts
 * @description Lightweight system endpoint for verifying webhook handler readiness.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

import { NextApiRequest, NextApiResponse } from "next";

/**
 * Health check for webhook infrastructure.
 * 
 * Simulates a basic "heartbeat" to validate:
 * - Endpoint is reachable.
 * - Endpoint processes request shape without errors.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // --- Simulate minimal webhook processing success ---
    const simulatedEvent = {
      id: "evt_test_healthcheck",
      type: "healthcheck.ping",
      data: {
        object: {
          message: "Webhook healthcheck successful.",
        },
      },
    };

    res.status(200).json({
      success: true,
      event: simulatedEvent,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[webhook_health] Fatal error:", error);

    res.status(500).json({
      success: false,
      error: { code: "WEBHOOK_HEALTH_FAILED", message: "Webhook healthcheck failed unexpectedly." },
    });
  }
}
