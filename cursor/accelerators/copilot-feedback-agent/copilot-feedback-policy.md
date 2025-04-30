# Copilot Feedback Policy

## Purpose
This document defines the policies under which the Copilot Feedback Agent triggers feedback, including safety measures, thresholds, and acceptable interventions.

## Feedback Criteria

1. **Emotion Score Below Threshold**: When the emotion score is below 0.3, feedback will be triggered to encourage a warmer tone.
2. **High Revision Count**: If the revision count exceeds 5, feedback will be triggered to either retry the task or shift the conversation direction.

## Feedback Suppression
If the Copilot Feedback Agent has already triggered feedback within the same session, it will not trigger additional feedback unless a major change in context occurs.

## Logging
All feedback events are logged to the `sessionDeltaLogEmitter` to ensure traceability and auditing.
