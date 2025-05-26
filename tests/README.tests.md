# ✅ CanAI QA Fortress — `/tests/` System

This folder contains **100% test coverage** for every critical system layer of CanAI.

Tests are categorized by:

| Layer             | Coverage Files                                      |
|------------------|-----------------------------------------------------|
| Prompts & Scoring| `test-composePrompt.ts`, `test-smartPromptScore.ts`, `test-prompt-integrity-suite.ts`  
| Automations      | `test-make-scenario-trigger.ts`, `test-lifecycle-triggered-events.ts`  
| Emails & Visuals | `test-email-campaign-format.ts`, `test-output-visual-generation.ts`  
| API & Webhooks   | `test-openaiHandler.test.ts`, `test-api-endpoint-response.ts`  
| Analytics & Logs | `test-delivery-cost-log.ts`, `test-session-analytics.ts`  
| Schema & Fields  | `test-schema-drifts.ts`, `test-unused-fields-in-schema.ts`  
| Components       | `test-component-html-validity.ts`, `test-share-card-output.ts`  
| Assets           | `test-asset-paths-valid.ts`
| Intelligence     | `test-goldmine-logging.ts`, `test-user-traits-sync.ts`  
| Cursor & CI      | `test-cursor-rules-compliance.ts`, `test-.github-workflows-valid.ts`  

## 🛠 How to Run All Tests

```bash
npm run test:all
