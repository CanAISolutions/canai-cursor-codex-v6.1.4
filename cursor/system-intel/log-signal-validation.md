# Log Table Signal Validation — Codex v6.1.4

| Table         | FieldName         | Required | SignalType   | EmotionalTag | TriggerLogic                | Notes                |
|--------------|-------------------|----------|-------------|--------------|-----------------------------|----------------------|
| PromptLogs   | PromptType        | Yes      | meta         | clarity      | On prompt creation          |                      |
| PromptLogs   | SessionID         | Yes      | id           | safety       | On session start            |                      |
| PromptLogs   | UserID            | No       | id           | safety       | On user action              |                      |
| PromptLogs   | CreatedAt         | Yes      | timestamp    | traceability | On session start            |                      |
| PromptLogs   | OutputURL         | No       | url          | clarity      | On output generation        |                      |
| PromptLogs   | SmartPromptScore  | No       | score        | clarity      | On output scoring           |                      |
| PromptLogs   | bizName           | Yes      | input        | clarity      | On input                    |                      |
| PromptLogs   | goal              | Yes      | input        | motivation   | On input                    |                      |
| PromptLogs   | audience          | Yes      | input        | empathy      | On input                    |                      |
| PromptLogs   | keyOfferings      | Yes      | input        | clarity      | On input                    |                      |
| PromptLogs   | industry          | Yes      | input        | clarity      | On input                    |                      |
| PromptLogs   | tone              | No       | enhancer     | clarity      | On input                    |                      |
| PromptLogs   | customerContent   | Yes      | input        | clarity      | On input                    | site_audit only      |
| PromptLogs   | customerPain      | No       | enhancer     | empathy      | On input                    |                      |
| PromptLogs   | differentiator    | No       | enhancer     | motivation   | On input                    |                      |
| PromptLogs   | desiredAction     | No       | enhancer     | momentum     | On input                    |                      |
| PromptLogs   | soulfireTrigger   | No       | signal       | safety       | On emotional event          | ⚠️ Not always present|
| PromptLogs   | trustFallbackUsed | No       | signal       | safety       | On fallback                 | ⚠️ Not always present|
| PromptLogs   | outputToneScore   | No       | score        | clarity      | On output scoring           | ⚠️ Not always present|
| FeedbackLogs | SessionID         | Yes      | id           | safety       | On feedback submission      |                      |
| FeedbackLogs | UserID            | No       | id           | safety       | On feedback submission      |                      |
| FeedbackLogs | FeedbackType      | Yes      | input        | clarity      | On feedback submission      |                      |
| FeedbackLogs | FeedbackText      | Yes      | input        | empathy      | On feedback submission      |                      |
| FeedbackLogs | CreatedAt         | Yes      | timestamp    | traceability | On feedback submission      |                      |
| FeedbackLogs | soulfireTrigger   | No       | signal       | safety       | On emotional event          | ⚠️ Not always present|
| SessionAnalytics | SessionID      | Yes      | id           | safety       | On session start            |                      |
| SessionAnalytics | UserID         | No       | id           | safety       | On session start            |                      |
| SessionAnalytics | CreatedAt      | Yes      | timestamp    | traceability | On session start            |                      |
| SessionAnalytics | EmotionalDepth | No       | score        | empathy      | On session scoring          | ⚠️ Not always present|
| SessionAnalytics | TrustScore     | No       | score        | safety       | On session scoring          | ⚠️ Not always present|
| SessionAnalytics | soulfireTrigger| No       | signal       | safety       | On emotional event          | ⚠️ Not always present|
| ReferralTriggers | TriggerID      | Yes      | id           | safety       | On referral event           |                      |
| ReferralTriggers | UserID         | No       | id           | safety       | On referral event           |                      |
| ReferralTriggers | CreatedAt      | Yes      | timestamp    | traceability | On referral event           |                      |
| ReferralTriggers | ReferralType   | Yes      | input        | motivation   | On referral event           |                      |
| ReferralTriggers | soulfireTrigger| No       | signal       | safety       | On emotional event          | ⚠️ Not always present|
| DeliveryCostLogs | CostID         | Yes      | id           | safety       | On cost event               |                      |
| DeliveryCostLogs | SessionID      | Yes      | id           | safety       | On cost event               |                      |
| DeliveryCostLogs | CreatedAt      | Yes      | timestamp    | traceability | On cost event               |                      |
| DeliveryCostLogs | CostUSD        | Yes      | input        | clarity      | On cost event               |                      |
| DeliveryCostLogs | soulfireTrigger| No       | signal       | safety       | On emotional event          | ⚠️ Not always present| 