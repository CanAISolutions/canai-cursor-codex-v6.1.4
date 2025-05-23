/**
 * @file verifySignature.ts
 * @description Cryptographically verifies webhook request signatures.
 * Version: 1.0.0
 * Codex Enforcement: Prime Directive Compliant
 */

import crypto from "crypto";
import { throwApiError } from "../errors/errorResponses";

/**
 * Verifies webhook signature for security
 * @param payload - Raw webhook payload
 * @param signature - Signature from webhook headers
 * @param secret - Webhook secret for verification
 * @returns True if signature is valid
 */
export function verifySignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): boolean {
  try {
    // Handle Stripe signature format: "t=timestamp,v1=signature"
    if (signature.includes('t=') && signature.includes('v1=')) {
      return verifyStripeSignature(payload, signature, secret);
    }

    // Handle simple HMAC signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');

    // Compare signatures using timing-safe comparison
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.warn('Signature verification failed:', error);
    return false;
  }
}

/**
 * Verifies Stripe-specific webhook signature
 * @param payload - Raw webhook payload
 * @param signature - Stripe signature header
 * @param secret - Stripe webhook secret
 * @returns True if signature is valid
 */
function verifyStripeSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
): boolean {
  try {
    // Parse Stripe signature format
    const elements = signature.split(',');
    let timestamp: string | undefined;
    let v1Signature: string | undefined;

    for (const element of elements) {
      const [key, value] = element.split('=');
      if (key === 't') {
        timestamp = value;
      } else if (key === 'v1') {
        v1Signature = value;
      }
    }

    if (!timestamp || !v1Signature) {
      return false;
    }

    // Check timestamp tolerance (5 minutes)
    const currentTime = Math.floor(Date.now() / 1000);
    const webhookTime = parseInt(timestamp, 10);
    const tolerance = 300; // 5 minutes

    if (Math.abs(currentTime - webhookTime) > tolerance) {
      console.warn('Webhook timestamp outside tolerance');
      return false;
    }

    // Verify signature
    const signedPayload = `${timestamp}.${payload}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(v1Signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.warn('Stripe signature verification failed:', error);
    return false;
  }
}

/**
 * Generates HMAC signature for outgoing webhooks
 * @param payload - Payload to sign
 * @param secret - Secret key for signing
 * @returns HMAC signature
 */
export function generateSignature(payload: string | Buffer, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}
