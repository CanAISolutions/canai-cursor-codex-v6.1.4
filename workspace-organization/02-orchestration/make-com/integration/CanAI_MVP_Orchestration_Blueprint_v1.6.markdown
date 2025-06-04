# CanAI MVP Orchestration Blueprint v1.6

## Overview
This blueprint outlines the production-ready orchestration for CanAI Emotional Sovereignty System (v1.6), a scalable MVP that delivers emotionally resonant AI outputs with user choice, trust transparency, and high performance (<450ms latency, >92% sentiment accuracy, 100-1000+ webhooks/hour). It merges `GrokPlan.md`, `PRODUCTION-WEBHOOK-CONFIGURATION-GUIDE.md`, and `supabase-schema.json`, providing real code, webhook configurations, and step-by-step instructions for a solo developer (4-6 hours/day).

### Objectives
- **Emotional Sovereignty**: Empower users to choose between `canai_output` and `sterile_output` via SparkSplit UX.
- **Trust Transparency**: Log interactions in `prompt_logs`, `trust_metrics`, and `feedback_logs`.
- **Performance**: Achieve <450ms latency and >92% sentiment accuracy.
- **Scalability**: Handle 100-1000+ webhooks/hour using four modular Make.com scenarios.
- **Solo Developer**: Optimize for 4-6 hour daily capacity, deployable by June 14, 2025.

### Components
1. **Supabase Database**: 18 tables (`supabase-schema.json`) plus `delivery_cost_logs` and `feedback_logs`.
2. **Make.com Webhooks**: Four scenarios (Orchestrator, User Intelligence, SparkSplit, Selection Handler).
3. **Webflow UX**: SparkSplit form for user selection and feedback.
4. **Main Prompt**: `main.prompt.md` for Codex integration.
5. **Google Sheets**: Logs session data for analytics.
6. **Error Handling**: Retries, `error_logs`, Slack alerts, email summaries.

## Supabase Setup

### Schema
The `supabase-schema.json` defines 18 tables (e.g., `user_context`, `session_analytics`, `sparksplit_comparisons`, `prompt_logs`, `trust_metrics`). Add two new tables:

```sql
CREATE TABLE delivery_cost_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES session_analytics(session_id),
    user_id VARCHAR REFERENCES user_context(user_id),
    cost NUMERIC NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE feedback_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES session_analytics(session_id),
    user_id VARCHAR REFERENCES user_context(user_id),
    feedback_type VARCHAR NOT NULL,
    feedback JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

GRANT ALL ON delivery_cost_logs, feedback_logs TO service_role;
```

### Functions
Two functions ensure atomic updates (from webhook guide Q3, Q5):

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
GRANT EXECUTE ON FUNCTION increment_user_stats TO service_role;

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
GRANT EXECUTE ON FUNCTION calculate_trust_delta TO service_role;
```

## Make.com Webhook Scenarios

Four modular scenarios handle orchestration, leveraging Supabase and a mock Codex API (`https://canai-router.onrender.com/generate`).

### Webhook 1: Emotional Sovereignty Orchestrator
Validates incoming requests, logs to `prompt_logs`, and triggers the next scenario.

```json
[
  {
    "id": 1,
    "module": "http:ReceiveWebhook",
    "parameters": {
      "url": "{{secrets.supabase_url}}/webhooks/orchestrator",
      "method": "POST",
      "schema": {
        "userId": "string",
        "sessionId": "string",
        "promptType": "string",
        "userInput": "json",
        "sessionMetrics": {
          "promptCount": "integer",
          "emotionalScores": {"aweScore": "number"}
        }
      }
    }
  },
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
        "user_input": "{{1.userInput}}",
        "created_at": "{{now}}"
      }
    }
  },
  {
    "id": 3,
    "module": "flow:TriggerScenario",
    "parameters": {
      "scenarioId": "{{scenarios.user_intelligence_aggregator}}",
      "data": "{{1}}"
    }
  },
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
]
```

### Webhook 2: User Intelligence Aggregator
Updates `user_context` and `session_analytics` with session and prompt counts.

```json
[
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
  },
  {
    "id": 2,
    "module": "flow:TriggerScenario",
    "parameters": {
      "scenarioId": "{{scenarios.sparksplit_processor}}",
      "data": "{{webhook}}"
    }
  },
  {
    "id": 3,
    "module": "supabase:CreateRow",
    "parameters": {
      "connection": "{{connections.supabase}}",
      "table": "error_logs",
      "fields": {
        "session_id": "{{webhook.sessionId}}",
        "error_type": "{{error.module}}",
        "message": "{{error.message}}",
        "severity": "{{if(error.statusCode >= 500; 'high'; 'medium')}}",
        "created_at": "{{now}}"
      },
      "condition": "{{error}}"
    }
  }
]
```

### Webhook 3: SparkSplit Processor
Generates `canai_output` and `sterile_output` (webhook guide Q4), stores in `sparksplit_comparisons`.

```json
[
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
  },
  {
    "id": 3,
    "module": "flow:TriggerScenario",
    "parameters": {
      "scenarioId": "{{scenarios.selection_handler}}",
      "data": "{{webhook}}"
    }
  },
  {
    "id": 4,
    "module": "supabase:CreateRow",
    "parameters": {
      "connection": "{{connections.supabase}}",
      "table": "error_logs",
      "fields": {
        "session_id": "{{webhook.sessionId}}",
        "error_type": "{{if(error.module = 'http' && error.url.contains('canai-router'); 'codex'; error.module)}}",
        "message": "{{error.message}}",
        "severity": "{{if(error.statusCode >= 500; 'high'; 'medium')}}",
        "created_at": "{{now}}"
      },
      "condition": "{{error}}"
    }
  }
]
```

### Webhook 4: SparkSplit Selection Handler
Processes user selection, updates trust scores, logs costs, feedback, and Google Sheets data.

```json
[
  {
    "id": 1,
    "module": "http:ReceiveWebhook",
    "parameters": {
      "url": "{{secrets.supabase_url}}/webhooks/selection",
      "method": "POST",
      "schema": {
        "userId": "string",
        "sessionId": "string",
        "userSelection": "string",
        "feedback": "json"
      }
    }
  },
  {
    "id": 2,
    "module": "supabase:CallFunction",
    "parameters": {
      "connection": "{{connections.supabase}}",
      "functionName": "calculate_trust_delta",
      "arguments": {
        "p_user_id": "{{1.userId}}",
        "p_new_score": "{{if(1.userSelection = 'canai'; 4.7; 3.5)}}"
      }
    }
  },
  {
    "id": 3,
    "module": "supabase:CreateRow",
    "parameters": {
      "connection": "{{connections.supabase}}",
      "table": "delivery_cost_logs",
      "fields": {
        "session_id": "{{1.sessionId}}",
        "user_id": "{{1.userId}}",
        "cost": "{{if(1.userSelection = 'canai'; 0.02; 0.01)}}",
        "currency": "USD",
        "created_at": "{{now}}"
      }
    }
  },
  {
    "id": 4,
    "module": "supabase:CreateRow",
    "parameters": {
      "connection": "{{connections.supabase}}",
      "table": "feedback_logs",
      "fields": {
        "session_id": "{{1.sessionId}}",
        "user_id": "{{1.userId}}",
        "feedback_type": "{{1.userSelection}}",
        "feedback": "{{1.feedback}}",
        "created_at": "{{now}}"
      }
    }
  },
  {
    "id": 5,
    "module": "googleSheets:AddRow",
    "parameters": {
      "connection": "{{connections.google_sheets}}",
      "spreadsheetId": "{{secrets.google_sheets_id}}",
      "sheetName": "CanAI_Sessions",
      "values": [
        "{{1.sessionId}}",
        "{{1.userId}}",
        "{{webhook.promptType}}",
        "{{1.userSelection}}",
        "{{if(1.userSelection = 'canai'; 4.7; 3.5)}}",
        "{{if(1.userSelection = 'canai'; 0.02; 0.01)}}",
        "{{toJson(1.feedback)}}",
        "{{now}}"
      ]
    }
  },
  {
    "id": 6,
    "module": "supabase:CreateRow",
    "parameters": {
      "connection": "{{connections.supabase}}",
      "table": "error_logs",
      "fields": {
        "session_id": "{{1.sessionId}}",
        "error_type": "{{error.module}}",
        "message": "{{error.message}}",
        "severity": "{{if(error.statusCode >= 500; 'high'; 'medium')}}",
        "created_at": "{{now}}"
      },
      "condition": "{{error}}"
    }
  }
]
```

### Daily Error Summary
Sends daily error reports via email.

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

## Webflow SparkSplit UX

Displays `canai_output` and `sterile_output`, allows user selection, and submits to Webhook 4.

```html
<div class="sparksplit-container">
  <div class="output-card">
    <h2>CanAI Output</h2>
    <pre id="canai-output"></pre>
    <p>Awe Score: <span id="canai-awe-score"></span></p>
    <p>Trust Score: <span id="canai-trust-score"></span></p>
  </div>
  <div class="output-card">
    <h2>Sterile Output</h2>
    <pre id="sterile-output"></pre>
    <p>Awe Score: 0.3</p>
    <p>Trust Score: 3.5</p>
  </div>
  <form id="sparksplit-form">
    <label><input type="radio" name="selection" value="canai" required> Choose CanAI</label>
    <label><input type="radio" name="selection" value="sterile"> Choose Sterile</label>
    <textarea id="feedback" placeholder="Your feedback (optional)"></textarea>
    <button type="submit">Submit Choice</button>
  </form>
</div>
<script>
  async function fetchOutputs(sessionId) {
    try {
      const response = await fetch(`{{secrets.supabase_url}}/rest/v1/sparksplit_comparisons?session_id=eq.${sessionId}&select=canai_output,sterile_output,canai_awe_score,trust_delta`, {
        headers: {
          'Authorization': 'Bearer {{secrets.supabase_service_key}}',
          'apikey': '{{secrets.supabase_anon_key}}'
        }
      });
      const data = await response.json();
      if (data.length) {
        document.getElementById('canai-output').innerText = JSON.stringify(data[0].canai_output, null, 2);
        document.getElementById('sterile-output').innerText = JSON.stringify(data[0].sterile_output, null, 2);
        document.getElementById('canai-awe-score').innerText = data[0].canai_awe_score;
        document.getElementById('canai-trust-score').innerText = (4.7 + data[0].trust_delta).toFixed(2);
      }
    } catch (error) {
      console.error('Error fetching outputs:', error);
    }
  }
  document.getElementById('sparksplit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const selection = document.querySelector('input[name="selection"]:checked').value;
    const feedback = document.getElementById('feedback').value;
    try {
      const response = await fetch('{{secrets.supabase_url}}/webhooks/selection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer {{secrets.supabase_service_key}}',
          'apikey': '{{secrets.supabase_anon_key}}'
        },
        body: JSON.stringify({
          userId: '{{userId}}',
          sessionId: '{{sessionId}}',
          userSelection: selection,
          feedback: feedback ? JSON.parse(feedback) : {}
        })
      });
      if (response.ok) {
        alert('Selection submitted successfully!');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting selection:', error);
      alert('Failed to submit. Please try again.');
    }
  });
  fetchOutputs('{{sessionId}}');
</script>
<style>
  .sparksplit-container { display: flex; gap: 20px; flex-wrap: wrap; }
  .output-card { border: 1px solid #ccc; padding: 20px; border-radius: 8px; width: 45%; }
  pre { white-space: pre-wrap; background: #f8f9fa; padding: 10px; border-radius: 4px; }
  #sparksplit-form { width: 100%; margin-top: 20px; }
  textarea { width: 100%; height: 100px; }
  button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; }
</style>
```

## Main Prompt

Guides Codex API for emotionally sovereign outputs.

```markdown
You are CanAI, an emotionally sovereign AI. Generate responses that maximize emotional resonance (aweScore > 4.5) while maintaining user trust (trust_score > 4.0). Use user_context.industry_focus and emotional_profile to tailor responses. Always provide side-by-side sterile_output for comparison. Log all interactions to prompt_logs and trust_metrics.
```

## Google Sheets Setup

Logs session data for analytics.

**Schema**:
| session_id | user_id | prompt_type | user_selection | trust_score | cost_usd | feedback | created_at |
|------------|---------|-------------|----------------|-------------|----------|----------|------------|
| session_456| user_123| business_plan | canai         | 4.7         | 0.02     | {}       | 2025-06-04T09:11:00Z |

**Steps**:
1. Create Google Sheet “CanAI_Sessions” with above headers.
2. Connect Make.com to Google Sheets via OAuth.
3. Store `spreadsheetId` in `{{secrets.google_sheets_id}}`.

## Implementation Steps

For a solo developer (4-6 hours/day), deploy by June 14, 2025:

1. **Day 1 (4h)**:
   - Deploy Supabase tables (`delivery_cost_logs`, `feedback_logs`).
   - Create functions (`increment_user_stats`, `calculate_trust_delta`).
   - Set up Google Sheet “CanAI_Sessions”.

2. **Day 2 (4h)**:
   - Configure Make.com scenarios (Webhooks 1-4, Error Summary).
   - Connect Supabase and Google Sheets in Make.com.
   - Test webhooks with cURL:
     ```bash
     curl -X POST -d '{"userId":"user_123","sessionId":"session_456","promptType":"business_plan","userInput":{"brief":"test"},"sessionMetrics":{"promptCount":3,"emotionalScores":{"aweScore":4.7}}}' -H "Authorization: Bearer {{secrets.supabase_service_key}}" -H "Content-Type: application/json" {{secrets.supabase_url}}/webhooks/orchestrator
     ```

3. **Day 3 (4h)**:
   - Embed Webflow form HTML in premium template.
   - Test form submission:
     ```bash
     curl -X POST -d '{"userId":"user_123","sessionId":"session_456","userSelection":"canai","feedback":{}}' -H "Authorization: Bearer {{secrets.supabase_service_key}}" -H "Content-Type: application/json" {{secrets.supabase_url}}/webhooks/selection
     ```

4. **Day 4 (4h)**:
   - Validate Codex API (`https://canai-router.onrender.com/generate`).
   - Test Google Sheets logging via Webhook 4.
   - Ensure JSONB serialization in `sparksplit_comparisons`.

5. **Day 5 (4h)**:
   - Test error handling (retries, `error_logs`, Slack, email).
   - Deploy daily error summary scenario.

6. **Day 6 (4h)**:
   - Run load tests (100-1000 webhooks/hour) using `enhanced-cli-dashboard-sparksplit-validation.test.ts`.
   - Optimize latency (<450ms) with `performance.now()` in Webflow JS.

7. **Day 7 (4h)**:
   - Validate sentiment accuracy (>92%) via `trust_metrics`.
   - Document in `/cursor/system-intel/CanAI_MVP_Orchestration_Blueprint_v1.6.md`.
   - Plan post-MVP enhancements (real Codex, cultural intelligence).

## Testing and Validation

- **cURL Tests**:
  ```bash
  # Test Orchestrator
  curl -X POST -d '{"userId":"user_123","sessionId":"session_456","promptType":"business_plan","userInput":{"brief":"test"},"sessionMetrics":{"promptCount":3,"emotionalScores":{"aweScore":4.7}}}' -H "Authorization: Bearer {{secrets.supabase_service_key}}" -H "Content-Type: application/json" {{secrets.supabase_url}}/webhooks/orchestrator

  # Test Selection
  curl -X POST -d '{"userId":"user_123","sessionId":"session_456","userSelection":"canai","feedback":{}}' -H "Authorization: Bearer {{secrets.supabase_service_key}}" -H "Content-Type: application/json" {{secrets.supabase_url}}/webhooks/selection

  # Test Supabase Function
  curl -X POST -d '{"p_user_id":"user_123","p_new_score":4.7}' -H "Authorization: Bearer {{secrets.supabase_service_key}}" -H "Content-Type: application/json" {{secrets.supabase_url}}/rest/v1/rpc/calculate_trust_delta
  ```

- **Test Suites**: Use `enhanced-cli-dashboard-sparksplit-validation.test.ts` for 100% pass rate (English only).
- **Metrics**:
  - Latency: Measure with `performance.now()` in Webflow JS.
  - Sentiment Accuracy: Query `trust_metrics` for >92%.
  - Webhook Throughput: Test 100-1000 webhooks/hour.

## Emotional Sovereignty Alignment

- **User Choice**: SparkSplit UX enables `canai_output` vs. `sterile_output` selection.
- **Transparency**: Logs (`prompt_logs`, `trust_metrics`, `feedback_logs`) ensure auditability.
- **Trust**: `user_context.trust_score_current` and `sparksplit_comparisons.trust_delta` foster confidence.
- **Emotional Fingerprint**: `user_context.emotional_profile` (JSONB) tracks user preferences.

## Post-MVP Enhancements

- Replace mock Codex with real API.
- Add cultural intelligence tests.
- Enhance security headers (e.g., CSP, HSTS).
- Integrate Airtable for additional analytics (per June 4 discussions).

## Security Considerations

- Use HTTPS for all API calls.
- Store secrets (`supabase_service_key`, `canai_api_key`, `google_sheets_id`) in Make.com.
- Validate inputs in Webflow form to prevent injection.
- Rate-limit webhooks in Supabase to prevent abuse.

## Directory Structure

```
/cursor/system-intel/
├── CanAI_MVP_Orchestration_Blueprint_v1.6.md
├── main.prompt.md
├── supabase/
│   ├── schema.sql
│   ├── functions/
│       ├── increment_user_stats.sql
│       ├── calculate_trust_delta.sql
├── make/
│   ├── orchestrator.json
│   ├── user_intelligence.json
│   ├── sparksplit_processor.json
│   ├── selection_handler.json
│   ├── error_summary.json
├── webflow/
│   ├── sparksplit_form.html
```