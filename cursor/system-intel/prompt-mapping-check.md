# Prompt Variable Mapping Check — Codex v6.1.4

| FieldName         | AirtableSchema | composePromptVar | TemplateVar      | Enhancer | MappingStatus | Notes                |
|------------------|---------------|------------------|------------------|----------|--------------|----------------------|
| industry         | Yes           | industry         | {{industry}}     | N        | OK           |                      |
| targetAudience   | Yes           | targetAudience   | {{audience}}     | N        | ⚠️           | Var name mismatch    |
| goals            | Yes           | goals            | {{goal}}         | N        | ⚠️           | Plural/singular drift|
| constraints      | Yes           | constraints      | {{constraints}}  | N        | OK           |                      |
| tone             | Yes           | tone             | {{tone}}         | Y        | OK           |                      |
| enhancers        | No            | enhancers        | (various)        | Y        | OK           | Optional, multi-use  |
| companyName      | Yes           | companyName      | {{bizName}}      | N        | ⚠️           | Var name mismatch    |
| values           | Yes           | values           | {{values}}       | N        | OK           |                      |
| goal             | Yes           | goal             | {{goal}}         | N        | OK           |                      |
| targetMarket     | Yes           | targetMarket     | {{audience}}     | N        | ⚠️           | Var name mismatch    |
| budget           | Yes           | budget           | {{budget}}       | N        | OK           |                      |
| timeline         | Yes           | timeline         | {{timeline}}     | N        | OK           |                      |
| financials       | No            | financials       | (none)           | N        | ⚠️           | Not in template      |
| emotionalContext | No            | emotionalContext | (none)           | N        | ⚠️           | Not in template      |
| campaignGoal     | Yes           | campaignGoal     | {{goal}}         | N        | ⚠️           | Var name mismatch    |
| keyMessage       | Yes           | keyMessage       | {{keyMessage}}   | N        | OK           |                      |
| callToAction     | Yes           | callToAction     | {{desiredAction}}| N        | ⚠️           | Var name mismatch    |
| targetOutcome    | Yes           | targetOutcome    | {{goal}}         | N        | ⚠️           | Var name mismatch    |
| currentState     | Yes           | currentState     | {{currentState}} | N        | OK           |                      |
| siteUrl          | Yes           | siteUrl          | {{url}}          | N        | ⚠️           | Var name mismatch    |
| auditType        | Yes           | auditType        | {{contentType}}  | N        | ⚠️           | Var name mismatch    |
| focusAreas       | Yes           | focusAreas       | {{focusAreas}}   | N        | OK           |                      |
| platform         | Yes           | platform         | {{platform}}     | N        | OK           |                      |
| contentType      | Yes           | contentType      | {{contentType}}  | N        | OK           |                      | 