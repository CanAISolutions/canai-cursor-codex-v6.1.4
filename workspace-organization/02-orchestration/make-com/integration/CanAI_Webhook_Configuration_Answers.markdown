# CanAI Webhook Configuration Answers for Cursor

This document provides Cursor-specific answers to eight questions about configuring the `PRODUCTION-WEBHOOK-CONFIGURATION-GUIDE.md` for the CanAI Emotional Sovereignty System in Make.com. It aligns with `CanAI_MVP_Orchestration_Blueprint_v1.6.md`, `supabase-schema.json`, and a solo developer workflow (4-6 hours/day, deployment by June 14, 2025).

## 1. Supabase Connection in Make.com

**Question**: In Make.com, when adding the Supabase connection, do you use:
- Connection Name: `supabase` (referenced as `{{connections.supabase}}`)?
- Service Role Key or Anon Key for webhook operations?
- Specific schema setting (public schema in config)?

**Answer**:
- **Connection Name**: Use `supabase` to reference as `{{connections.supabase}}` in all scenarios (Orchestrator, User Intelligence, SparkSplit, Selection Handler).
  - In Make.com:
    1. Go to *Connections* > *Add Connection* > *Supabase*.
    2. Set *Connection Name*: `supabase`.
    3. Enter Supabase URL: `{{secrets.supabase_url}}` (e.g., `https://your-project.supabase.co`).
  - Cursor: Save in `/cursor/system-intel/secrets.json` as:
    ```json
    {
      "supabase_connection_name": "supabase",
      "supabase_url": "https://your-project.supabase.co"
    }
    ```
- **Key**: Use the **Service Role Key** for webhook operations to enable full table access (e.g., `prompt_logs`, `sparksplit_comparisons`) and function execution (`increment_user_stats`, `calculate_trust_delta`).
  - In Make.com: Paste the Service Role Key from Supabase (*Project Settings* > *API* > *Service Role Key*) into the connection setup.
  - Cursor: Store in `/cursor/system-intel/secrets.json`:
    ```json
    {
      "supabase_service_key": "your-service-role-key"
    }
    ```
  - **Why Service Role Key?** Webhooks require elevated permissions for UPSERTs, function calls, and error logging, bypassing Row-Level Security (RLS). The Anon Key is insufficient for these operations.
- **Schema**: Use the `public` schema, as all tables (`user_context`, `session_analytics`, etc.) in `supabase-schema.json` are in `public`.
  - In Make.com: Ensure *Schema* is set to `public` in Supabase modules (default setting).
  - Cursor: Confirm in `/cursor/system-intel/supabase/schema.sql`:
    ```sql
    -- All tables created in public schema
    CREATE TABLE public.prompt_logs (...);
    ```

**Action**:
1. In Cursor, update `secrets.json` with `supabase_connection_name`, `supabase_url`, and `supabase_service_key`.
2. In Make.com, create a Supabase connection named `supabase` using the Service Role Key and `public` schema.
3. Test connection with a simple query (e.g., `SELECT * FROM prompt_logs LIMIT 1`).

---

## 2. JSONB Field Handling

**Question**: For JSONB fields (`input_fields`, `output`, `analytics_meta`), do we:
- Pass as raw JSON objects: `{{webhook.inputFields}}`?
- Stringify: `{{JSON.stringify(webhook.inputFields)}}`?
- Use a Make.com transformation?

**Answer**:
- **Approach**: Pass JSONB fields as **raw JSON objects** (`{{webhook.inputFields}}`) in Make.com Supabase modules, as Supabase natively handles JSONB without stringification.
  - **Why?** The Supabase API and Make.com’s Supabase module automatically serialize JSON objects to JSONB when inserting/updating fields like `user_context.input_fields`, `sparksplit_comparisons.canai_output`, or `session_analytics.analytics_meta` (per `supabase-schema.json`).
  - Example (Webhook 1, `prompt_logs` insertion):
    ```json
    {
      "id": 2,
      "module": "supabase:CreateRow",
      "parameters": {
        "connection": "{{connections.supabase}}",
        "table": "prompt_logs",
        "fields": {
          "session_id": "{{1.sessionId}}",
          "user_id": "{{1.userId}}",
          "prompt_type": "{{1.promptType}}",
          "user_input": "{{1.userInput}}" // JSONB field, raw JSON
        }
      }
    }
    ```
- **Stringification**: Only use `{{JSON.stringify(webhook.inputFields)}}` when passing JSONB fields to non-Supabase modules (e.g., HTTP requests or Google Sheets).
  - Example (Webhook 4, Google Sheets):
    ```json
    {
      "id": 5,
      "module": "googleSheets:AddRow",
      "parameters": {
        "values": [
          "{{toJson(1.feedback)}}" // Stringified for Google Sheets
        ]
      }
    }
    ```
- **Transformations**: No specific Make.com transformation is needed for Supabase JSONB fields, as the module handles serialization. For complex JSON manipulation (e.g., extracting keys), use Make.com’s *JSON: Parse JSON* or *Set Variable* modules.
  - Example (if extracting `aweScore` from `emotionalScores`):
    ```json
    {
      "id": 0,
      "module": "tools:SetVariable",
      "parameters": {
        "name": "aweScore",
        "value": "{{webhook.sessionMetrics.emotionalScores.aweScore}}"
      }
    }
    ```
- **Schema Alignment**: Matches `supabase-schema.json` (e.g., `sparksplit_comparisons.canai_output` as JSONB, `feedback_logs.feedback` as JSONB).

**Action**:
1. In Cursor, verify JSONB fields in `/cursor/system-intel/make/*.json` use raw JSON for Supabase modules.
2. In Make.com, test JSONB insertion:
   ```bash
   curl -X POST -d '{"userId":"user_123","sessionId":"session_456","promptType":"business_plan","userInput":{"brief":"test"},"sessionMetrics":{"promptCount":3,"emotionalScores":{"aweScore":4.7}}}' -H "Authorization: Bearer {{secrets.supabase_service_key}}" -H "Content-Type: application/json" {{secrets.supabase_url}}/webhooks/orchestrator
   ```
3. Check `prompt_logs.user_input` in Supabase for correct JSONB storage.

---

## 3. UPSERT vs INSERT Operations

**Question**: For Webhook 2 (User Intelligence Aggregator), is there:
- A dedicated "Upsert Record" action in Make.com?
- Or "Update Record" with "Insert if not exists"?
- How to handle conflict resolution on `user_id`?

**Answer**:
- **Approach**: Use a Supabase function (`increment_user_stats`) for atomic UPSERTs, as implemented in `CanAI_MVP_Orchestration_Blueprint_v1.6.md`, instead of Make.com’s native UPSERT/UPDATE actions.
  - **Why?** The function handles conflict resolution on `user_id` for `user_context.total_sessions` and updates `session_analytics.prompt_count` atomically, avoiding race conditions at scale (100-1000+ webhooks/hour).
  - Function (from blueprint):
    ```sql
    CREATE OR REPLACE FUNCTION increment_user_stats(
        p_user_id VARCHAR,
        p_session_increment INTEGER DEFAULT 1,
        p_prompt_increment INTEGER DEFAULT 1
    ) RETURNS VOID AS $$
    BEGIN
        INSERT INTO user_context (user_id, total_sessions)
        VALUES (p_user_id, p_session_increment)
        ON CONFLICT (user_id)
        DO UPDATE SET
            total_sessions = user_context.total_sessions + p_session_increment,
            updated_at = NOW();
        UPDATE session_analytics
        SET prompt_count = prompt_count + p_prompt_increment,
            updated_at = NOW()
        WHERE session_id = (
            SELECT session_id FROM session_analytics
            WHERE user_id = p_user_id
            ORDER BY created_at DESC LIMIT 1
        );
    END;
    $$ LANGUAGE plpgsql;
    ```
- **Make.com Configuration** (Webhook 2):
  ```json
  {
    "id": 1,
    "module": "supabase:CallFunction",
    "parameters": {
      "connection": "{{connections.supabase}}",
      "functionName": "increment_user_stats",
      "arguments": {
        "p_user_id": "{{webhook.userId}}",
        "p_session_increment": 1,
        "p_prompt_increment": "{{webhook.sessionMetrics.promptCount}}"
      }
    }
  }
  ```
- **Conflict Resolution**: The `ON CONFLICT (user_id)` clause in the function ensures `user_context` is updated if `user_id` exists, or inserted if not, using `user_id` as the primary key (per `supabase-schema.json`).
- **Make.com Alternatives**:
  - **No Dedicated Upsert Action**: Make.com’s Supabase module (as of June 2025) lacks a native “Upsert Record” action.
  - **Update with Insert**: The “Update Record” action doesn’t support “Insert if not exists” natively, requiring a GET-then-UPDATE flow, which is error-prone at scale.
  - **Why Function Preferred**: Avoids multiple API calls, ensures atomicity, and simplifies Make.com logic.

**Action**:
1. In Cursor, save function in `/cursor/system-intel/supabase/functions/increment_user_stats.sql`.
2. In Make.com, add `supabase:CallFunction` module to Webhook 2 as above.
3. Test with:
   ```bash
   curl -X POST -d '{"p_user_id":"user_123","p_session_increment":1,"p_prompt_increment":3}' -H "Authorization: Bearer {{secrets.supabase_service_key}}" -H "Content-Type: application/json" {{secrets.supabase_url}}/rest/v1/rpc/increment_user_stats
   ```

---

## 4. Increment Operations

**Question**: How to increment `total_sessions` and `prompt_count` in Make.com? Do we:
- Use `{{add(previousValue, 1)}}`?
- GET then UPDATE?
- Built-in increment function?

**Answer** (Resolved in Q3, reiterated for clarity):
- **Approach**: Use the `increment_user_stats` Supabase function (above) for atomic increments, avoiding Make.com’s `{{add(previousValue, 1)}}` or GET-then-UPDATE.
  - **Why?** Ensures race-condition-free updates for `user_context.total_sessions` and `session_analytics.prompt_count` (INTEGER fields per `supabase-schema.json`).
- **Alternatives**:
  - **`{{add(previousValue, 1)}}`**: Requires a GET to fetch `previousValue`, then an UPDATE, which is inefficient and risky at scale.
    - Example (not recommended):
      ```json
      {
        "id": 0,
        "module": "supabase:SearchRecords",
        "parameters": {
          "table": "user_context",
          "filter": "user_id.eq.{{webhook.userId}}",
          "select": "total_sessions"
        }
      },
      {
        "id": 1,
        "module": "supabase:UpdateRecord",
        "parameters": {
          "table": "user_context",
          "id": "{{0.id}}",
          "fields": {
            "total_sessions": "{{add(0.total_sessions; 1)}}"
          }
        }
      }
      ```
  - **No Built-in Increment**: Make.com’s Supabase module lacks a native increment action.
- **Implementation**: Already in Webhook 2 (see Q3 JSON).

**Action**:
1. In Cursor, verify function in `/cursor/system-intel/supabase/functions/increment_user_stats.sql`.
2. In Make.com, ensure Webhook 2 calls `increment_user_stats`.
3. Test increment with cURL (above).

---

## 5. Sterile Output Generation

**Question**: Where should sterile AI output be generated?
- Option A: CanAI API generates both outputs in webhook.
- Option B: Make.com calls separate endpoint for sterile version.
- Option C: Pre-computed and retrieved by ID.

**Answer** (Resolved in blueprint, reiterated):
- **Approach**: **Option A** – CanAI API (`https://canai-router.onrender.com/generate`) generates both `canai_output` and `sterile_output` in a single call, storing in `sparksplit_comparisons` (JSONB fields per `supabase-schema.json`).
  - **Why?** Simplifies Make.com logic, reduces API calls, and aligns with emotional sovereignty (side-by-side comparison).
- **Implementation** (Webhook 3):
  ```json
  {
    "id": 1,
    "module": "http:ActionMakeRequest",
    "parameters": {
      "method": "POST",
      "url": "https://canai-router.onrender.com/generate",
      "headers": [
        {"name": "Content-Type", "value": "application/json"},
        {"name": "Authorization", "value": "Bearer {{secrets.canai_api_key}}"}
      ],
      "body": "{\"prompt_type\": \"{{webhook.promptType}}\", \"user_input\": {{webhook.userInput}}, \"tone\": \"{{webhook.userInput.tone}}\", \"generate_sterile\": true}",
      "dataStructure": {
        "canai_output": "json",
        "sterile_output": "json",
        "resonance_score": "number",
        "trust_score": "number",
        "tokens_used": "integer"
      },
      "retry": {"maxAttempts": 3, "delayMilliseconds": 2000}
    }
  },
  {
    "id": 2,
    "module": "supabase:CreateRow",
    "parameters": {
      "connection": "{{connections.supabase}}",
      "table": "sparksplit_comparisons",
      "fields": {
        "session_id": "{{webhook.sessionId}}",
        "user_id": "{{webhook.userId}}",
        "prompt_type": "{{webhook.promptType}}",
        "user_input": "{{webhook.userInput}}",
        "canai_output": "{{1.canai_output}}",
        "sterile_output": "{{1.sterile_output}}",
        "canai_awe_score": "{{webhook.emotionalScores.aweScore}}",
        "sterile_awe_score": 0.3,
        "trust_delta": "{{(webhook.emotionalScores.aweScore - 0.3) / 5}}",
        "created_at": "{{now}}"
      }
    }
  }
  ```
- **Alternatives**:
  - **Option B**: Separate endpoint increases latency and complexity.
  - **Option C**: Pre-computation requires storage and retrieval logic, unsuitable for dynamic prompts.
- **Test**:
  ```bash
  curl -X POST -d '{"prompt_type":"business_plan","user_input":{"brief":"test"},"tone":"professional","generate_sterile":true}' -H "Content-Type: application/json" -H "Authorization: Bearer {{secrets.canai_api_key}}" https://canai-router.onrender.com/generate
  ```

**Action**:
1. In Cursor, save Webhook 3 config in `/cursor/system-intel/make/sparksplit_processor.json`.
2. In Make.com, configure HTTP module for Codex API call.
3. Test API response and Supabase insertion.

---

## 6. Error Handling & Retries

**Question**: Preference for error handling?
- Make.com built-in retry logic (how many attempts)?
- Custom error logging to `error_logs`?
- Notification for critical failures (email, Slack)?

**Answer** (Resolved in blueprint, reiterated):
- **Approach**: Use all methods for production reliability:
  - **Retries**: Enable Make.com’s built-in retry logic (3 attempts, 2s delay) for HTTP and Supabase modules.
  - **Error Logging**: Log to `error_logs` table for all errors.
  - **Notifications**: Slack for high-severity errors (statusCode ≥ 500), daily email summaries.
- **Implementation** (All Webhooks, e.g., Webhook 1):
  ```json
  {
    "id": 4,
    "module": "supabase:CreateRow",
    "parameters": {
      "connection": "{{connections.supabase}}",
      "table": "error_logs",
      "fields": {
        "session_id": "{{1.sessionId}}",
        "error_type": "{{if(error.module = 'http' && error.url.contains('canai-router'); 'codex'; error.module)}}",
        "message": "{{error.message}}",
        "severity": "{{if(error.statusCode >= 500; 'high'; 'medium')}}",
        "created_at": "{{now}}"
      },
      "condition": "{{error}}"
    }
  },
  {
    "id": 5,
    "module": "slack:PostMessage",
    "parameters": {
      "webhookUrl": "{{secrets.slack_webhook}}",
      "message": "🚨 CanAI Error: {{error.message}} (Session: {{1.sessionId}}, Type: {{error.error_type}})",
      "condition": "{{error.severity = 'high'}}"
    }
  }
  ```
  - **Retries Example** (Webhook 3 HTTP):
    ```json
    "retry": {"maxAttempts": 3, "delayMilliseconds": 2000}
    ```
  - **Daily Email Summary**:
    ```json
    [
      {
        "id": 1,
        "module": "supabase:SearchRecords",
        "parameters": {
          "connection": "{{connections.supabase}}",
          "table": "error_logs",
          "filter": "created_at.gt.{{subtract(now; 86400000)}}",
          "select": "error_type,message,severity,created_at"
        }
      },
      {
        "id": 2,
        "module": "email:SendEmail",
        "parameters": {
          "to": "{{secrets.admin_email}}",
          "subject": "CanAI Daily Error Report",
          "body": "Errors in last 24h: {{1.length}} errors\nDetails: {{1.map(row; row.error_type + ': ' + row.message + ' (' + row.severity + ')')}}"
        }
      }
    ]
    ```

**Action**:
1. In Cursor, save error handling configs in `/cursor/system-intel/make/*.json`.
2. In Make.com, add error logging and Slack modules to all webhooks.
3. Test error handling by simulating a 500 error:
   ```bash
   curl -X POST -d '{"userId":"user_123","sessionId":"session_456","promptType":"business_plan","userInput":{"brief":"test"},"sessionMetrics":{"promptCount":3,"emotionalScores":{"aweScore":4.7}}}' -H "Authorization: Bearer invalid_key" {{secrets.supabase_url}}/webhooks/orchestrator
   ```

---

## 7. Rate Limiting & Performance

**Question**: For high volume (100-1000+ webhooks/hour):
- Make.com plan limitations?
- Timeout settings for Supabase operations?
- Batch processing preferences?

**Answer**:
- **Make.com Plan**:
  - **Recommendation**: Use Make.com’s *Business Plan* (or higher) to handle 100-1000+ webhooks/hour, as it supports unlimited operations (subject to fair use) and advanced error handling.
  - **Limitations**: The *Core Plan* caps at 10,000 operations/month, insufficient for high volume. Check your plan in Make.com (*Billing* > *Subscription*).
  - **Cost**: Unknown (per xAI guidelines). Visit Make.com’s pricing page for details.
  - Cursor: Note plan in `/cursor/system-intel/make_config.md`:
    ```markdown
    Make.com Plan: Business (verify operations limit for 100-1000+ webhooks/hour)
    ```
- **Timeout Settings**:
  - Set Supabase module timeouts to **10 seconds** to balance reliability and performance.
  - In Make.com: For each Supabase module (e.g., `CreateRow`, `CallFunction`), set *Timeout* to `10000` ms in *Advanced Settings*.
  - For HTTP modules (e.g., Codex API), use `15000` ms to account for AI generation latency.
    ```json
    {
      "id": 1,
      "module": "http:ActionMakeRequest",
      "parameters": {
        "timeout": 15000
      }
    }
    ```
  - Cursor: Document in `/cursor/system-intel/make_config.md`:
    ```markdown
    Supabase Timeout: 10s
    HTTP Timeout: 15s
    ```
- **Batch Processing**:
  - **Preference**: Process webhooks individually (no batching) to ensure real-time updates and emotional sovereignty (immediate SparkSplit UX).
  - **Rationale**: Batching could delay user feedback, impacting trust. Supabase and Make.com handle high throughput without batching (per load tests in blueprint).
  - **Optimization**: Enable *Concurrent Scenarios* in Make.com (*Scenario Settings* > *Max Concurrent Executions*) to process multiple webhooks simultaneously.
  - Cursor: Add to `/cursor/system-intel/make_config.md`:
    ```markdown
    Batch Processing: Disabled (individual processing for real-time UX)
    Concurrent Scenarios: Enabled (max per plan)
    ```

**Action**:
1. In Cursor, update `/cursor/system-intel/make_config.md` with plan, timeout, and batching details.
2. In Make.com, set timeouts and enable concurrent scenarios.
3. Test throughput with 100 webhooks:
   ```bash
   for i in {1..100}; do curl -X POST -d '{"userId":"user_123","sessionId":"session_'$i'","promptType":"business_plan","userInput":{"brief":"test"},"sessionMetrics":{"promptCount":3,"emotionalScores":{"aweScore":4.7}}}' -H "Authorization: Bearer {{secrets.supabase_service_key}}" -H "Content-Type: application/json" {{secrets.supabase_url}}/webhooks/orchestrator; done
   ```

---

## 8. Environment Variables

**Question**: In Make.com, are environment variables set as:
- Organization-level?
- Scenario-specific?
- Connection parameters?

**Answer**:
- **Approach**: Use **Organization-level environment variables** for shared secrets (e.g., `supabase_service_key`, `canai_api_key`) and **Connection parameters** for Supabase credentials, with **Scenario-specific variables** for webhook-specific settings (e.g., `promptType` defaults).
  - **Organization-level**:
    - Store in Make.com (*Organization* > *Variables*):
      ```json
      {
        "supabase_url": "https://your-project.supabase.co",
        "supabase_service_key": "your-service-role-key",
        "supabase_anon_key": "your-anon-key",
        "canai_api_key": "your-canai-key",
        "slack_webhook": "https://hooks.slack.com/services/...",
        "admin_email": "admin@canai.com",
        "google_sheets_id": "your-sheet-id"
      }
      ```
    - Reference as `{{secrets.supabase_url}}`, etc.
    - **Why?** Centralizes management, reduces duplication across scenarios.
  - **Connection Parameters**:
    - Supabase connection (`supabase`) uses `supabase_url` and `supabase_service_key` (set in Q1).
    - Google Sheets connection uses `google_sheets_id` and OAuth credentials.
    - **Why?** Securely isolates connection-specific credentials.
  - **Scenario-specific**:
    - Define in each scenario’s *Variables* tab for defaults or overrides (e.g., `promptType` fallback).
      ```json
      {
        "default_promptType": "business_plan"
      }
      ```
    - Reference as `{{variables.default_promptType}}`.
    - **Why?** Allows flexibility for scenario-specific configurations.
- **Cursor Integration**:
  - Store all secrets in `/cursor/system-intel/secrets.json`:
    ```json
    {
      "supabase_url": "https://your-project.supabase.co",
      "supabase_service_key": "your-service-role-key",
      "supabase_anon_key": "your-anon-key",
      "canai_api_key": "your-canai-key",
      "slack_webhook": "https://hooks.slack.com/services/...",
      "admin_email": "admin@canai.com",
      "google_sheets_id": "your-sheet-id"
    }
    ```
  - Reference in Cursor prompts: `@secrets.json` to auto-import variables.

**Action**:
1. In Cursor, update `/cursor/system-intel/secrets.json` with all secrets.
2. In Make.com, set organization-level variables and connection parameters.
3. Add scenario-specific variables where needed (e.g., Webhook 3 for `promptType`).
4. Test variable access in a Make.com scenario:
   ```json
   {
     "id": 0,
     "module": "tools:SetVariable",
     "parameters": {
       "name": "test",
       "value": "{{secrets.supabase_url}}"
     }
   }
   ```

---

## Summary

These answers provide a Cursor-specific configuration guide for the `PRODUCTION-WEBHOOK-CONFIGURATION-GUIDE.md`, integrated with `CanAI_MVP_Orchestration_Blueprint_v1.6.md`. Key actions:
- Save configurations in `/cursor/system-intel/` (e.g., `secrets.json`, `make/*.json`, `supabase/functions/*.sql`).
- Set up Make.com with Supabase connection (`supabase`), Service Role Key, and `public` schema.
- Use raw JSON for JSONB fields, Supabase functions for UPSERT/increments, and CanAI API for outputs.
- Implement retries, error logging, Slack/email notifications, and performance optimizations.

**Next Steps**:
- Test all configurations using provided cURL commands.
- Save this document in `/cursor/system-intel/CanAI_Webhook_Configuration_Answers.md`.
- Confirm if you need a Gantt chart for implementation (per blueprint).