# CanAI Webhook Configuration Answers (Revised) for Cursor

This revised document addresses Cursor’s concerns about `PRODUCTION-WEBHOOK-CONFIGURATION-GUIDE.md` configurations for the CanAI Emotional Sovereignty System, correcting inaccuracies in Questions 3 and 4 (UPSERT/Increment) and clarifying Question 6 (Trust Score Calculation). It aligns with `CanAI_MVP_Orchestration_Blueprint_v1.6.md`, `supabase-schema.json`, and a solo developer workflow (4-6 hours/day, deployment by June 14, 2025).

## 1. Supabase Connection in Make.com

**Question**: In Make.com, when adding the Supabase connection, do you use:
- Connection Name: `supabase` (referenced as `{{connections.supabase}}`)?
- Service Role Key or Anon Key for webhook operations?
- Specific schema setting (public schema in config)?

**Answer** (Unchanged):
- **Connection Name**: Use `supabase` (`{{connections.supabase}}`).
  - In Make.com: *Connections* > *Add Connection* > *Supabase*, set *Connection Name*: `supabase`, URL: `{{secrets.supabase_url}}`.
  - Cursor: Save in `/cursor/system-intel/secrets.json`:
    ```json
    {
      "supabase_connection_name": "supabase",
      "supabase_url": "https://your-project.supabase.co"
    }
    ```
- **Key**: Use **Service Role Key** for webhook operations (full access to `prompt_logs`, `sparksplit_comparisons`, etc.).
  - In Make.com: Paste Service Role Key from Supabase (*Project Settings* > *API* > *Service Role Key*).
  - Cursor: Store in `/cursor/system-intel/secrets.json`:
    ```json
    {
      "supabase_service_key": "your-service-role-key"
    }
    ```
- **Schema**: Use `public` schema (all tables in `supabase-schema.json` are in `public`).
  - In Make.com: Set *Schema* to `public` in Supabase modules.
  - Cursor: Confirm in `/cursor/system-intel/supabase/schema.sql`.

**Action**:
1. Update `/cursor/system-intel/secrets.json` with connection details.
2. Create Supabase connection in Make.com.
3. Test with: `SELECT * FROM prompt_logs LIMIT 1`.

---

## 2. JSONB Field Handling

**Question**: For JSONB fields (`input_fields`, `output`, `analytics_meta`), do we:
- Pass as raw JSON objects: `{{webhook.inputFields}}`?
- Stringify: `{{JSON.stringify(webhook.inputFields)}}`?
- Use a Make.com transformation?

**Answer** (Unchanged):
- **Approach**: Pass as **raw JSON objects** (`{{webhook.inputFields}}`) for Supabase modules.
  - Example (Webhook 1):
    ```json
    {
      "id": 2,
      "module": "supabase:CreateRow",
      "parameters": {
        "table": "prompt_logs",
        "fields": {
          "user_input": "{{1.userInput}}" // Raw JSON for JSONB
        }
      }
    }
    ```
- **Stringification**: Use `{{toJson(1.feedback)}}` for non-Supabase modules (e.g., Google Sheets).
- **Transformations**: Use *JSON: Parse JSON* or *Set Variable* for complex JSON manipulation.
  - Example:
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

**Action**:
1. Verify JSONB fields in `/cursor/system-intel/make/*.json`.
2. Test insertion:
   ```bash
   curl -X POST -d '{"userId":"user_123","sessionId":"session_456","promptType":"business_plan","userInput":{"brief":"test"},"sessionMetrics":{"promptCount":3,"emotionalScores":{"aweScore":4.7}}}' -H "Authorization: Bearer {{secrets.supabase_service_key}}" -H "Content-Type: application/json" {{secrets.supabase_url}}/webhooks/orchestrator
   ```

---

## 3. UPSERT vs INSERT Operations (corrected)

**Question**: For Webhook 2 (User Intelligence Aggregator), is there:
- A dedicated "Upsert Record" action in Make.com?
- Or "Update Record" with "Insert if not exists"?
- How to handle conflict resolution on `user_id`?

**Answer** (Corrected):
- **Approach**: Leverage the existing `update_user_context()` trigger to handle UPSERT-like behavior for `user_context.total_sessions` when inserting into `session_analytics`. For `user_context`, ensure a row exists via an initial INSERT if needed.
- **Actual Trigger** (per your codebase):
  ```sql
  CREATE OR REPLACE FUNCTION update_user_context()
  RETURNS TRIGGER AS $$
  BEGIN
      UPDATE user_context 
      SET 
          total_sessions = total_sessions + 1,
          updated_at = NOW()
      WHERE user_id = NEW.user_id;
      RETURN NEW.user_id;
  END;
  $$ LANGUAGE plpgsql;

  CREATE TRIGGER session_analytics_trigger
  AFTER INSERT ON session_analytics
  FOR EACH ROW EXECUTE FUNCTION update_user_context();
  ```
- **Make.com Configuration** (Webhook 2):
  - Insert into `session_analytics` to trigger `update_user_context()` for `user_context.total_sessions`.
  - Ensure `user_context` row exists with an initial check/insert.
  ```json
  [
    {
      "id": 1,
      "module": "supabase:SearchRecords",
      "parameters": {
        "connection": "{{connections.supabase}}",
        "table": "user_context",
        "filter": "user_id.eq.{{webhook.userId}}",
        "select": "user_id"
      }
    },
    {
      "id": 2,
      "module": "supabase:CreateRow",
      "parameters": {
        "connection": "{{connections.supabase}}",
        "table": "user_context",
        "fields": {
          "user_id": "{{webhook.userId}}",
          "total_sessions": 0,
          "trust_score_current": 0,
          "created_at": "{{now}}"
        },
        "condition": "{{empty(1)}}" // Insert if user_id not found
      }
    },
    {
      "id": 3,
      "module": "supabase:CreateRow",
      "parameters": {
        "connection": "{{connections.supabase}}",
        "table": "session_analytics",
        "fields": {
          "session_id": "{{webhook.sessionId}}",
          "user_id": "{{webhook.userId}}",
          "prompt_count": "{{webhook.sessionMetrics.promptCount}}",
          "created_at": "{{now}}"
        }
      }
    }
  ]
  ```
- **Conflict Resolution**:
  - The trigger updates `user_context.total_sessions` when a new `session_analytics` row is inserted, using `NEW.user_id` for matching.
  - The initial `SearchRecords` and `CreateRow` ensure a `user_context` row exists, avoiding trigger failures.
- **Make.com Alternatives**:
  - **No Dedicated Upsert Action**: Make.com lacks a native “Upsert Record” action.
  - **Update with Insert**: “Update Record” doesn’t support “Insert if not exists,” requiring the above check/insert flow.
  - **Why Trigger Preferred**: Simplifies logic, ensures atomicity via PostgreSQL.

**Action**:
1. In Cursor, verify trigger in `/cursor/system-intel/supabase/functions/update_user_context.sql`.
2. Update Webhook 2 in `/cursor/system-intel/make/user_intelligence.json` with above config.
3. Test with:
   ```bash
   curl -X POST -d '{"userId":"user_123","sessionId":"session_456","promptType":"business_plan","userInput":{"brief":"test"},"sessionMetrics":{"promptCount":3,"emotionalScores":{"aweScore":4.7}}}' -H "Authorization: Bearer {{secrets.supabase_service_key}}" -H "Content-Type: application/json" {{secrets.supabase_url}}/webhooks/orchestrator
   ```
4. Check `user_context.total_sessions` increment in Supabase.

---

## 4. Increment Operations (corrected)

**Question**: How to increment `total_sessions` and `prompt_count` in Make.com? Do we:
- Use `{{add(previousValue, 1)}}`?
- GET then UPDATE?
- Built-in increment function?

**Answer** (Corrected):
- **Approach**: Use the `update_user_context()` trigger for `user_context.total_sessions` increments, and a direct `supabase:CreateRow` for `session_analytics.prompt_count` (since the trigger doesn’t cover `prompt_count`).
- **Implementation**:
  - **total_sessions**: Automatically incremented by `update_user_context()` when inserting into `session_analytics` (see Q3 config).
  - **prompt_count**: Set directly in `session_analytics` insertion, as `prompt_count` is provided in the webhook payload (`webhook.sessionMetrics.promptCount`).
    ```json
    {
      "id": 3,
      "module": "supabase:CreateRow",
      "parameters": {
        "connection": "{{connections.supabase}}",
        "table": "session_analytics",
        "fields": {
          "session_id": "{{webhook.sessionId}}",
          "user_id": "{{webhook.userId}}",
          "prompt_count": "{{webhook.sessionMetrics.promptCount}}",
          "created_at": "{{now}}"
        }
      }
    }
    ```
  - **Note**: If `prompt_count` needs incremental updates (e.g., adding to existing count), use a separate UPDATE after checking the latest `session_analytics` row.
    ```json
    {
      "id": 4,
      "module": "supabase:UpdateRecord",
      "parameters": {
        "connection": "{{connections.supabase}}",
        "table": "session_analytics",
        "id": "{{(select session_id from session_analytics where user_id = webhook.userId order by created_at desc limit 1).session_id}}",
        "fields": {
          "prompt_count": "{{add((select prompt_count from session_analytics where session_id = (select session_id from session_analytics where user_id = webhook.userId order by created_at desc limit 1)).prompt_count; webhook.sessionMetrics.promptCount)}}"
        }
      }
    }
    ```
- **Alternatives**:
  - **`{{add(previousValue, 1)}}`**: Requires GET-then-UPDATE, inefficient and risky for `prompt_count`.
  - **No Built-in Increment**: Make.com lacks a native increment action.
  - **Why Trigger for total_sessions?**: Ensures atomicity; direct insertion for `prompt_count` leverages webhook data.

**Action**:
1. In Cursor, confirm trigger in `/cursor/system-intel/supabase/functions/update_user_context.sql`.
2. Update Webhook 2 in `/cursor/system-intel/make/user_intelligence.json`.
3. Test `total_sessions` and `prompt_count` updates with cURL (above).
4. If incremental `prompt_count` updates are needed, add the UPDATE module.

---

## 5. Sterile Output Generation

**Question**: Where should sterile AI output be generated?
- Option A: CanAI API generates both outputs in webhook.
- Option B: Make.com calls separate endpoint for sterile version.
- Option C: Pre-computed and retrieved by ID.

**Answer** (Unchanged):
- **Approach**: **Option A** – CanAI API (`https://canai-router.onrender.com/generate`) generates `canai_output` and `sterile_output`.
  - Example (Webhook 3):
    ```json
    {
      "id": 1,
      "module": "http:ActionMakeRequest",
      "parameters": {
        "url": "https://canai-router.onrender.com/generate",
        "body": "{\"prompt_type\": \"{{webhook.promptType}}\", \"user_input\": {{webhook.userInput}}, \"tone\": \"{{webhook.userInput.tone}}\", \"generate_sterile\": true}"
      }
    }
    ```

**Action**:
1. Save Webhook 3 in `/cursor/system-intel/make/sparksplit_processor.json`.
2. Test API:
   ```bash
   curl -X POST -d '{"prompt_type":"business_plan","user_input":{"brief":"test"},"tone":"professional","generate_sterile":true}' -H "Authorization: Bearer {{secrets.canai_api_key}}" https://canai-router.onrender.com/generate
   ```

---

## 6. Error Handling & Retries (clarified)

**Question**: Preference for error handling?
- Make.com built-in retry logic (how many attempts)?
- Custom error logging to `error_logs`?
- Notification for critical failures (email, Slack)?

**Answer** (Clarified with Trust Score Calculation):
- **Error Handling Approach** (Unchanged):
  - **Retries**: 3 attempts, 2s delay for HTTP/Supabase modules.
  - **Logging**: Insert errors into `error_logs`.
  - **Notifications**: Slack for high-severity errors (statusCode ≥ 500), daily email summaries.
  - Example (Webhook 1):
    ```json
    {
      "id": 4,
      "module": "supabase:CreateRow",
      "parameters": {
        "table": "error_logs",
        "fields": {
          "session_id": "{{1.sessionId}}",
          "error_type": "{{if(error.module = 'http' && error.url.contains('canai-router'); 'codex'; error.module)}}",
          "message": "{{error.message}}",
          "severity": "{{if(error.statusCode >= 500; 'high'; 'medium')}}"
        }
      }
    },
    {
      "id": 5,
      "module": "slack:PostMessage",
      "parameters": {
        "webhookUrl": "{{secrets.slack_webhook}}",
        "message": "🚨 CanAI Error: {{error.message}}",
        "condition": "{{error.severity = 'high'}}"
      }
    }
    ```
- **Trust Score Calculation Clarification**:
  - **Context**: In Webhook 4 (Selection Handler), trust scores are updated based on user selection (`canai` or `sterile`). The blueprint uses a `calculate_trust_delta` function:
    ```sql
    CREATE OR REPLACE FUNCTION calculate_trust_delta(
        p_user_id VARCHAR,
        p_new_score NUMERIC
    ) RETURNS NUMERIC AS $$
    DECLARE
        v_previous_score NUMERIC;
        v_delta NUMERIC;
    BEGIN
        SELECT trust_score_current INTO v_previous_score
        FROM user_context
        WHERE user_id = p_user_id
        FOR UPDATE;
        IF v_previous_score IS NULL THEN
            v_previous_score := 0;
        END IF;
        v_delta := p_new_score - v_previous_score;
        UPDATE user_context
        SET trust_score_current = p_new_score,
            updated_at = NOW()
        WHERE user_id = p_user_id;
        RETURN v_delta;
    END;
    $$ LANGUAGE plpgsql;
    ```
  - **Current Logic** (Webhook 4):
    ```json
    {
      "id": 2,
      "module": "supabase:CallFunction",
      "parameters": {
        "functionName": "calculate_trust_delta",
        "arguments": {
          "p_user_id": "{{1.userId}}",
          "p_new_score": "{{if(1.userSelection = 'canai'; 4.7; 3.5)}}"
        }
      }
    }
    ```
  - **Proposed Detailed Logic**: To address Cursor’s concern about complexity, assume trust scores incorporate:
    - **Base Score**: `4.7` for `canai`, `3.5` for `sterile` (per blueprint).
    - **Awe Score Weight**: Adjust based on `sparksplit_comparisons.canai_awe_score` vs. `sterile_awe_score` (e.g., `trust_score = base_score + (awe_score - sterile_awe_score) * 0.1`).
    - **Historical Trust**: Use `user_context.trust_score_current` for smoothing (e.g., weighted average).
  - **Example Calculation** (Webhook 4, updated):
    ```json
    {
      "id": 1.5,
      "module": "supabase:SearchRecords",
      "parameters": {
        "table": "sparksplit_comparisons",
        "filter": "session_id.eq.{{1.sessionId}}",
        "select": "canai_awe_score,sterile_awe_score"
      }
    },
    {
      "id": 2,
      "module": "supabase:CallFunction",
      "parameters": {
        "functionName": "calculate_trust_delta",
        "arguments": {
          "p_user_id": "{{1.userId}}",
          "p_new_score": "{{if(1.userSelection = 'canai'; 4.7 + (1.5.canai_awe_score - 1.5.sterile_awe_score) * 0.1; 3.5 + (1.5.sterile_awe_score - 1.5.canai_awe_score) * 0.1)}}"
        }
      }
    }
    ```
  - **Need Verification**: Please provide your actual trust score calculation code (e.g., from `/cursor/system-intel/supabase/functions/` or Make.com configs) to confirm if additional factors (e.g., `user_context.emotional_profile`, session frequency) are included.

**Action**:
1. In Cursor, save error handling configs in `/cursor/system-intel/make/*.json`.
2. Update Webhook 4 in `/cursor/system-intel/make/selection_handler.json` with proposed trust score logic (pending verification).
3. Test error handling:
   ```bash
   curl -X POST -d '{"userId":"user_123","sessionId":"session_456","userSelection":"canai","feedback":{}}' -H "Authorization: Bearer invalid_key" {{secrets.supabase_url}}/webhooks/selection
   ```
4. Share trust score calculation code for final confirmation.

---

## 7. Rate Limiting & Performance

**Question**: For high volume (100-1000+ webhooks/hour):
- Make.com plan limitations?
- Timeout settings for Supabase operations?
- Batch processing preferences?

**Answer** (Unchanged):
- **Plan**: Use Make.com *Business Plan* for unlimited operations.
  - Cursor: Note in `/cursor/system-intel/make_config.md`:
    ```markdown
    Make.com Plan: Business
    ```
- **Timeouts**: 10s for Supabase, 15s for HTTP.
  - Example:
    ```json
    {
      "id": 1,
      "module": "http:ActionMakeRequest",
      "parameters": {
        "timeout": 15000
      }
    }
    ```
- **Batch Processing**: Disabled for real-time UX.
  - Cursor: Add to `/cursor/system-intel/make_config.md`:
    ```markdown
    Batch Processing: Disabled
    Concurrent Scenarios: Enabled
    ```

**Action**:
1. Update `/cursor/system-intel/make_config.md`.
2. Set timeouts and concurrent scenarios in Make.com.
3. Test throughput:
   ```bash
   for i in {1..100}; do curl -X POST -d '{"userId":"user_123","sessionId":"session_'$i'","promptType":"business_plan","userInput":{"brief":"test"},"sessionMetrics":{"promptCount":3,"emotionalScores":{"aweScore":4.7}}}' -H "Authorization: Bearer {{secrets.supabase_service_key}}" {{secrets.supabase_url}}/webhooks/orchestrator; done
   ```

---

## 8. Environment Variables

**Question**: In Make.com, are environment variables set as:
- Organization-level?
- Scenario-specific?
- Connection parameters?

**Answer** (Unchanged):
- **Approach**:
  - **Organization-level**: `supabase_url`, `supabase_service_key`, `canai_api_key`, etc.
    ```json
    {
      "supabase_url": "https://your-project.supabase.co",
      "supabase_service_key": "your-service-role-key",
      "canai_api_key": "your-canai-key"
    }
    ```
  - **Connection Parameters**: Supabase/Google Sheets credentials.
  - **Scenario-specific**: e.g., `default_promptType`.
    ```json
    {
      "default_promptType": "business_plan"
    }
    ```
- **Cursor**: Store in `/cursor/system-intel/secrets.json`.

**Action**:
1. Update `/cursor/system-intel/secrets.json`.
2. Set variables in Make.com.
3. Test variable access:
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

This revised document corrects Questions 3 and 4 to use the `update_user_context()` trigger, clarifies Question 6’s trust score logic, and retains accurate answers for Questions 1, 2, 5, 7, and 8. Key actions:
- Update `/cursor/system-intel/supabase/functions/update_user_context.sql` and `/cursor/system-intel/make/user_intelligence.json`.
- Test configurations with provided cURL commands.
- Share trust score calculation code to finalize Question 6.

**Next Steps**:
- Save this in `/cursor/system-intel/CanAI_Webhook_Configuration_Answers_Revised.md`.
- Confirm trust score logic or provide code snippet.
- Request Gantt chart if needed (per blueprint).