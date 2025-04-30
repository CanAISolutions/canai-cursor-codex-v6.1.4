/**
 * @file verifySignature.ts
 * @description Cryptographically verifies webhook request signatures.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

import crypto from "crypto";
import { throwApiError } from "../errors/errorResponses";

/**
 * Verifies a webhook signature against a payload and a secret.
 * 
 * @param payload - Raw request body (string or Buffer).
 * @param signatureHeader - Signature header from the request (string).
 * @param secret - Shared secret used to compute HMAC.
 * @throws - Throws API error if verification fails.
 */
export function verifySignature(payload: string | Buffer, signatureHeader: string, secret: string): void {
  if (!signatureHeader) {
    throwApiError("WEBHOOK_VERIFICATION_FAILED");
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  if (expectedSignature !== signatureHeader) {
    throwApiError("WEBHOOK_VERIFICATION_FAILED");
  }
}
