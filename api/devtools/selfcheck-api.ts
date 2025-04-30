/**
 * @file selfcheck-api.ts
 * @description Systematic self-validation endpoint for API health assurance.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

import { NextApiRequest, NextApiResponse } from "next";
import { errorMap } from "../errors/errorMap";
import { createClientSchema } from "../validators/clientValidator";
import { verifySignature } from "../webhook/verifySignature";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const results: Record<string, boolean> = {};

  // --- Validation Layer Check ---
  try {
    createClientSchema.parse({
      name: "Self Check",
      email: "selfcheck@example.com",
    });
    results["Validation Layer - Client Schema"] = true;
  } catch {
    results["Validation Layer - Client Schema"] = false;
  }

  // --- Error Map Integrity Check ---
  results["Error Map Integrity"] = Object.values(errorMap).every(
    (entry) => entry.code && entry.message
  );

  // --- Webhook Signature Verification Check ---
  try {
    const fakePayload = "test";
    const fakeSecret = "supersecret";
    const crypto = await import("crypto");

    const correctSignature = crypto
      .createHmac("sha256", fakeSecret)
      .update(fakePayload)
      .digest("hex");

    verifySignature(fakePayload, correctSignature, fakeSecret);
    results["Webhook Signature Verification"] = true;
  } catch {
    results["Webhook Signature Verification"] = false;
  }

  // --- Summarize Selfcheck Status ---
  const allPassed = Object.values(results).every((v) => v === true);

  if (allPassed) {
    return res.status(200).json({
      success: true,
      results,
    });
  } else {
    return res.status(500).json({
      success: false,
      results,
    });
  }
}
