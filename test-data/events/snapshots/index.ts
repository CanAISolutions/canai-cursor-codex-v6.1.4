// /events/snapshots/index.ts

/**
 * @codex-purpose: Centralized registry of all snapshot files for test runners, CI tooling, and Copilot snapshot intelligence.
 * @codex-system: Snapshot Validation Layer
 * @codex-critical: Prevents orphaned snapshots, invalid test imports, and confusion in snapshot-based QA
 * @codex-verified: v1.4.2
 */

import bulkEventBatch from './bulk-event-batch.snapshot.json';
import copilotRevisionRequested from './copilot-revision-requested.snapshot.json';
import crossEventReplay from './cross-event-replay.snapshot.json';
import eventTestTrigger from './event-test-trigger.snapshot.json';
import gptUsageSpikeEvent from './gpt-usage-spike-event.snapshot.json';
import klaviyoLifecycle from './klaviyo-lifecycle.snapshot.json';
import lifecycleTriggeredEvent from './lifecycle-triggered-event.snapshot.json';
import missingEventType from './missing-event-type.snapshot.json';
import referralConversionEvent from './referral-conversion-event.snapshot.json';
import retryFailedFulfillment from './retry-failed-fulfillment.snapshot.json';
import timeoutDetectedEvent from './timeout-detected-event.snapshot.json';
import unhandledErrorEscalation from './unhandled-error-escalation.snapshot.json';
import webhookIngestEvent from './webhook-ingest-event.snapshot.json';

export const snapshots = {
  bulkEventBatch,
  copilotRevisionRequested,
  crossEventReplay,
  eventTestTrigger,
  gptUsageSpikeEvent,
  klaviyoLifecycle,
  lifecycleTriggeredEvent,
  missingEventType,
  referralConversionEvent,
  retryFailedFulfillment,
  timeoutDetectedEvent,
  unhandledErrorEscalation,
  webhookIngestEvent,
};
