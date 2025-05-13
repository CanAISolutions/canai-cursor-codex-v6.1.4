# Prompt Field Confirmation — Codex v6.1.4

| FieldName         | FieldType | Required | PromptVariable      | SmartDefault         | PromptType         |
|------------------|-----------|----------|--------------------|---------------------|-------------------|
| industry         | string    | Yes      | industry           | ⚠️ None             | ai_blueprint      |
| targetAudience   | string    | Yes      | targetAudience     | ⚠️ None             | ai_blueprint      |
| goals            | array     | Yes      | goals              | ⚠️ None             | ai_blueprint      |
| constraints      | array     | Yes      | constraints        | ⚠️ None             | ai_blueprint      |
| tone             | string    | Yes      | tone               | 'confident'         | ai_blueprint      |
| enhancers        | object    | No       | enhancers          | {}                  | ai_blueprint      |
| companyName      | string    | Yes      | companyName        | ⚠️ None             | ai_brand_identity |
| industry         | string    | Yes      | industry           | ⚠️ None             | ai_brand_identity |
| targetAudience   | string    | Yes      | targetAudience     | ⚠️ None             | ai_brand_identity |
| values           | array     | Yes      | values             | ⚠️ None             | ai_brand_identity |
| tone             | string    | Yes      | tone               | 'confident'         | ai_brand_identity |
| enhancers        | object    | No       | enhancers          | {}                  | ai_brand_identity |
| industry         | string    | Yes      | industry           | ⚠️ None             | business_plan     |
| goal             | string    | Yes      | goal               | ⚠️ None             | business_plan     |
| tone             | string    | Yes      | tone               | 'professional'      | business_plan     |
| targetMarket     | string    | No       | targetMarket       | ⚠️ None             | business_plan     |
| budget           | number    | No       | budget             | ⚠️ None             | business_plan     |
| timeline         | string    | No       | timeline           | ⚠️ None             | business_plan     |
| financials       | object    | No       | financials         | industry defaults   | business_plan     |
| emotionalContext | object    | No       | emotionalContext   | ⚠️ None             | business_plan     |
| enhancers        | object    | No       | enhancers          | {}                  | business_plan     |
| campaignGoal     | string    | Yes      | campaignGoal       | ⚠️ None             | email_campaign    |
| targetAudience   | string    | Yes      | targetAudience     | ⚠️ None             | email_campaign    |
| keyMessage       | string    | Yes      | keyMessage         | ⚠️ None             | email_campaign    |
| callToAction     | string    | Yes      | callToAction       | ⚠️ None             | email_campaign    |
| tone             | string    | Yes      | tone               | 'warm'              | email_campaign    |
| enhancers        | object    | No       | enhancers          | {}                  | email_campaign    |
| targetOutcome    | string    | Yes      | targetOutcome      | ⚠️ None             | reverse_strategy  |
| currentState     | string    | Yes      | currentState       | ⚠️ None             | reverse_strategy  |
| constraints      | array     | Yes      | constraints        | ⚠️ None             | reverse_strategy  |
| timeline         | string    | Yes      | timeline           | ⚠️ None             | reverse_strategy  |
| tone             | string    | Yes      | tone               | 'analytical'        | reverse_strategy  |
| enhancers        | object    | No       | enhancers          | {}                  | reverse_strategy  |
| siteUrl          | string    | Yes      | siteUrl            | ⚠️ None             | site_audit        |
| auditType        | string    | Yes      | auditType          | ⚠️ None             | site_audit        |
| focusAreas       | array     | Yes      | focusAreas         | ⚠️ None             | site_audit        |
| goals            | array     | Yes      | goals              | ⚠️ None             | site_audit        |
| tone             | string    | Yes      | tone               | 'professional'      | site_audit        |
| enhancers        | object    | No       | enhancers          | {}                  | site_audit        |
| platform         | string    | Yes      | platform           | ⚠️ None             | social_content    |
| contentType      | string    | Yes      | contentType        | ⚠️ None             | social_content    |
| targetAudience   | array     | Yes      | targetAudience     | ⚠️ None             | social_content    |
| keyMessage       | string    | Yes      | keyMessage         | ⚠️ None             | social_content    |
| tone             | string    | Yes      | tone               | 'engaging'          | social_content    |
| enhancers        | object    | No       | enhancers          | {}                  | social_content    | 