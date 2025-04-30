// ✅ test-event-structure.ts
// @codex-purpose: Ensure all event JSON files have full Codex headers, _meta structure, and logic-specific safeguards
// @codex-system: event simulation validator
// @codex-critical: Prevents malformed, empty, or logically broken events from entering CI or runtime
// @codex-verified: v1.4.2

import fs from 'fs';
import path from 'path';

const eventDir = path.resolve(__dirname);
const files = fs.readdirSync(eventDir).filter(f => f.endsWith('.json'));

const requiredMeta = ['description', 'triggerField', 'routeTo', 'assert', 'snapshotCompatible', 'lastVerifiedAgainst'];
const requiredHeaders = ['@codex-purpose', '@codex-system', '@codex-critical', '@codex-verified'];

const errors: string[] = [];

files.forEach(file => {
  const fullPath = path.join(eventDir, file);
  const raw = fs.readFileSync(fullPath, 'utf8');

  // ✅ Check Codex headers
  requiredHeaders.forEach(h => {
    if (!raw.includes(h)) {
      errors.push(`❌ Missing ${h} in header of ${file}`);
    }
  });

  // ✅ Check _meta structure
  const json = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  if (!json._meta) {
    errors.push(`❌ Missing _meta in ${file}`);
  } else {
    requiredMeta.forEach(f => {
      if (!(f in json._meta)) {
        errors.push(`❌ Missing _meta.${f} in ${file}`);
      }
    });
  }

  // ✅ Validate all events include a 'type'
  if (!('type' in json)) {
    errors.push(`❌ ${file} is missing required top-level 'type' field`);
  }

  // ✅ Validate bulk-event payload has non-empty events[]
  if (json.type === "bulk-event" && (!json.payload?.events || json.payload.events.length === 0)) {
    errors.push(`❌ bulk-event in ${file} must include at least one event in 'payload.events[]'`);
  }

  // ✅ Validate event-replay includes replayAttempt > 0
  if (json.type === "event-replay") {
    const attempt = json.payload?.replayAttempt;
    if (typeof attempt !== 'number' || attempt < 1) {
      errors.push(`❌ event-replay in ${file} must include 'payload.replayAttempt' > 0`);
    }
  }

  // ✅ Validate test-trigger payload includes mode: "test-only"
  if (json.type === "test-trigger") {
    const mode = json.payload?.mode;
    if (mode !== "test-only") {
      errors.push(`❌ test-trigger in ${file} must include 'payload.mode' set to 'test-only'`);
    }
  }

  // ✅ Validate klaviyo lifecycle event includes campaignName and userEmail
  if (json.source === "klaviyo" && json.type === "lifecycle-event") {
    const { campaignName, userEmail } = json.payload || {};
    if (!campaignName) {
      errors.push(`❌ klaviyo-lifecycle in ${file} must include 'payload.campaignName'`);
    }
    if (!userEmail) {
      errors.push(`❌ klaviyo-lifecycle in ${file} must include 'payload.userEmail'`);
    }
  }

  // ✅ Validate lifecycle-triggered events include promptType
  if (json.type === "lifecycle-triggered") {
    const promptType = json.payload?.promptType;
    if (!promptType) {
      errors.push(`❌ lifecycle-triggered in ${file} must include 'payload.promptType' to ensure source traceability`);
    }
  }

  // ✅ Validate webhook-ingest events include eventId
  if (json.type === "webhook-ingest") {
    const eventId = json.payload?.eventId;
    if (!eventId) {
      errors.push(`❌ webhook-ingest in ${file} must include 'payload.eventId' for audit traceability`);
    }
  }

  // ✅ Validate referral-conversion includes referrerId and conversionAmount > 0
  if (json.type === "referral-conversion") {
    const { referrerId, conversionAmount } = json.payload || {};
    if (!referrerId) {
      errors.push(`❌ referral-conversion in ${file} must include 'payload.referrerId'`);
    }
    if (typeof conversionAmount !== 'number' || conversionAmount <= 0) {
      errors.push(`❌ referral-conversion in ${file} must include 'payload.conversionAmount' > 0`);
    }
  }

  // ✅ Validate retry-failed-fulfillment includes sessionId and retryCount >= 1
  if (json.type === "retry-failed-fulfillment") {
    const { sessionId, retryCount } = json.payload || {};
    if (!sessionId) {
      errors.push(`❌ retry-failed-fulfillment in ${file} must include 'payload.sessionId'`);
    }
    if (typeof retryCount !== 'number' || retryCount < 1) {
      errors.push(`❌ retry-failed-fulfillment in ${file} must include 'payload.retryCount' >= 1`);
    }
  }

  // ✅ Validate timeout-detected includes sessionId and timeoutMs >= 5000
  if (json.type === "timeout-detected") {
    const { sessionId, timeoutMs } = json.payload || {};
    if (!sessionId) {
      errors.push(`❌ timeout-detected in ${file} must include 'payload.sessionId'`);
    }
    if (typeof timeoutMs !== 'number' || timeoutMs < 5000) {
      errors.push(`❌ timeout-detected in ${file} must include 'payload.timeoutMs' >= 5000`);
    }
  }

  // ✅ Validate gpt-usage-spike includes tokenDelta >= 100000 and sessionsImpacted >= 1
  if (json.type === "gpt-usage-spike") {
    const { tokenDelta, sessionsImpacted } = json.payload || {};
    if (typeof tokenDelta !== 'number' || tokenDelta < 100000) {
      errors.push(`❌ gpt-usage-spike in ${file} must include 'payload.tokenDelta' >= 100000`);
    }
    if (typeof sessionsImpacted !== 'number' || sessionsImpacted < 1) {
      errors.push(`❌ gpt-usage-spike in ${file} must include 'payload.sessionsImpacted' >= 1`);
    }
  }

  // ✅ Validate copilot-revision-requested includes revisionCount >= 1 and revisionType
  if (json.type === "copilot-revision-requested") {
    const { revisionType, revisionCount } = json.payload || {};
    if (!revisionType) {
      errors.push(`❌ copilot-revision-requested in ${file} must include 'payload.revisionType'`);
    }
    if (typeof revisionCount !== 'number' || revisionCount < 1) {
      errors.push(`❌ copilot-revision-requested in ${file} must include 'payload.revisionCount' >= 1`);
    }
  }

  // ✅ Validate unhandled-error-escalation includes errorCode and severity === "critical"
  if (json.type === "unhandled-error-escalation") {
    const { errorCode, severity } = json.payload || {};
    if (!errorCode) {
      errors.push(`❌ unhandled-error-escalation in ${file} must include 'payload.errorCode'`);
    }
    if (severity !== "critical") {
      errors.push(`❌ unhandled-error-escalation in ${file} must include 'payload.severity' set to "critical"`);
    }
  }
});

if (errors.length) {
  errors.forEach(e => console.error(e));
  console.error(`❌ ${errors.length} issue(s) found in event structure.`);
  process.exit(1);
} else {
  console.log('✅ All event payloads are Codex-compliant and structurally valid.');
}
