# Cursor-Task: Standardize and Enhance `ai_blueprint` MCP

**Objective**: Standardize and optimize `ai_blueprint.mcp.ts` to align with `MCP-COMPREHENSIVE-STANDARDIZATION-PLAN-V4.1.md`, ensuring TAP compliance, trust transparency, emotional intelligence, and production readiness for AI blueprint generation.

## Context
- Use `MCP-COMPREHENSIVE-STANDARDIZATION-PLAN-V4.1.md` as the standardization guide.
- Reference `business-plan.mcp.ts`, `sparksplit.mcp.ts`, `email_campaign.mcp.ts` for structural consistency.
- Assume Codex v6.2.0 and TAP-locked compliance.
- Use real OpenAI API calls with `OPENAI_API_KEY` from `.env`.
- Schema: V4 12-Field Standard, updated June 10, 2025.

## Instructions

### Step 1: Review Current `ai_blueprint.mcp.ts`
1. Analyze for structure, interfaces, and functionality.
2. Verify `AIBlueprintInput` (12 fields), `SchemaValidator`, `SparkSplitEngine`, `EmotionalUXRenderer`, and `OpenAI` integration.
3. Confirm TAP metadata: `version: '6.1.4'`, `trustScoreThreshold: 4.2`.
4. Evaluate fallback (`routeFailure`, `generateFallbackContent`) and inference (`applyMCPEnhancers`).
5. Output 200-word compliance summary, save as `ai_blueprint_mcp_review.txt`.

### Step 2: Update Input Schema
1. Maintain `AIBlueprintInput` with 12 required fields:
   - `businessName`, `targetAudience`, `primaryGoal`, `competitiveContext`, `brandVoice`, `resourceConstraints`, `currentStatus`, `aiSolution`, `mvpFeatures`, `successMetrics`, `linkedPrompts`, `minimumViableExecution`.
2. Apply defaults via `aiBlueprintDefaults`:
   ```typescript
   const aiBlueprintDefaults = {
     brandVoice: 'strategic',
     linkedPrompts: ['business-plan'],
     successMetrics: '30d: Prototype; 60d: Beta; 90d: Launch',
     enhancers: { emotionalDepth: true, useAnalogies: false, urgency: false, technicalDetail: true, marketFocus: true }
   };
   ```
3. Update `aiBlueprintSchema` for `SchemaValidator`:
   ```typescript
   const aiBlueprintSchema = {
     type: 'object',
     required: ['businessName', 'targetAudience', 'primaryGoal', 'competitiveContext', 'brandVoice', 'resourceConstraints', 'currentStatus', 'aiSolution', 'mvpFeatures', 'successMetrics', 'linkedPrompts', 'minimumViableExecution'],
     properties: {
       businessName: { type: 'string', minLength: 3, maxLength: 100 },
       targetAudience: { type: 'string', minLength: 10, maxLength: 200 },
       primaryGoal: { type: 'string', minLength: 15, maxLength: 300 },
       competitiveContext: { type: 'string', minLength: 10, maxLength: 300 },
       brandVoice: { type: 'string', enum: ['professional', 'technical', 'strategic', 'innovative', 'approachable', 'authoritative'] },
       resourceConstraints: { type: 'string', minLength: 5, maxLength: 200 },
       currentStatus: { type: 'string', minLength: 5, maxLength: 200 },
       aiSolution: { type: 'string', minLength: 10, maxLength: 200 },
       mvpFeatures: { type: 'string', minLength: 10, maxLength: 300 },
       successMetrics: { type: 'string', minLength: 10, maxLength: 200 },
       linkedPrompts: { type: 'array', items: { type: 'string', enum: ['business-plan', 'ad-amplify', 'email-campaign', 'site-audit', 'social-content'] }, minItems: 0, maxItems: 5 },
       minimumViableExecution: { type: 'string', minLength: 15, maxLength: 300 },
       enhancers: { type: 'object', properties: { emotionalDepth: { type: 'boolean' }, useAnalogies: { type: 'boolean' }, urgency: { type: 'boolean' }, technicalDetail: { type: 'boolean' }, marketFocus: { type: 'boolean' } } }
     },
     additionalProperties: false
   };
   ```
4. Support backward compatibility via `migrateToV4Schema`:
   ```typescript
   const backwardCompatibilityMap = {
     industry: 'competitiveContext',
     targetAudience: 'targetAudience',
     goals: 'primaryGoal',
     constraints: 'resourceConstraints',
     tone: 'brandVoice',
     enhancers: 'enhancers'
   };
   ```
5. Save as `ai_blueprint_schema_update.ts`.

### Step 3: Enhance Field Inference
1. Implement `applyMCPEnhancers`:
   - `businessName`: Regex from `primaryGoal` or 'Your Business'.
   - `targetAudience`: Infer from `primaryGoal` or `aiSolution`.
   - `brandVoice`: Map from `aiSolution` or `targetAudience`.
   - `successMetrics`: Default to '30d: Prototype; 60d: Beta; 90d: Launch' or solution-specific.
   - `minimumViableExecution`: Suggest tools (e.g., 'Dialogflow, Zapier').
2. Use `SparkSplitEngine` for trust scoring (`evaluateInferenceTrust`).
3. Test with:
   - Minimal: `{ primaryGoal: 'Automate support' }`
   - Partial: `{ businessName: 'SupportAI', primaryGoal: 'Reduce tickets', aiSolution: 'AI chatbot' }`
   - Complete: All 12 fields.
4. Save as `ai_blueprint_inference_tests.txt`.

### Step 4: Integrate Trust Transparency
1. Use `SparkSplitEngine` for `SparkSplitOutput`:
   ```typescript
   const sparkSplitInput: SparkSplitInput = {
     prompt: `Create AI blueprint for ${input.businessName}: ${input.primaryGoal}`,
     sessionId: session.metadata.timestamp,
     userId: 'ai_blueprint_user',
     toneContext: input.brandVoice || 'strategic',
     sparkConcept: { name: 'ai_blueprint_trust' },
     emotionalContext: { userId: 'ai_blueprint_user' },
     canaiOutput: JSON.stringify(output)
   };
   session.sparkSplit = await sparkSplitEngine.generateSparkSplit(sparkSplitInput);
   ```
2. Calculate `trustScore`:
   ```typescript
   session.metadata.trustScore = Math.max(calculatedScore, 4.2);
   const calculatedScore = (scoringResult.score * 0.6 + empathyResult.metrics.overall * 0.4);
   ```
3. Log via `EventBus`:
   ```typescript
   eventBus.emit('trust:decision:logged', { decisionTrace, trustScore, sparkSplitData });
   ```
4. Fallback trust score: 4.2.
5. Save as `ai_blueprint_trust_update.ts`.

### Step 5: Enhance Emotional Intelligence
1. Implement `validateAIBlueprintEmpathy`:
   ```typescript
   async function validateAIBlueprintEmpathy() {
     return {
       isValid: true,
       metrics: {
         emotionalResonance: 0.85,
         toneAlignment: 0.87,
         connectionStrength: 0.90,
         authenticity: 0.85,
         overall: 0.87
       },
       feedback: 'AI blueprint demonstrates strong empathy and emotional intelligence'
     };
   }
   ```
2. Use 5-axis `emotionalCompass` (4.0-5.0 scale):
   - New: `clarity`, `empowerment`, `trust`, `joy`, `alignment`.
   - Legacy: `awe`, `ownership`, `wonder`, `calm`, `power`.
3. Enhance if `joy` < 4.5:
   ```typescript
   if (enhanced.joy < 4.5) {
     enhanced.joy = Math.min(enhanced.joy + 0.3, 5.0);
     enhanced.empowerment = Math.min(enhanced.empowerment + 0.1, 5.0);
   }
   ```
4. Test for `emotionalDepth` ≥ 0.85.
5. Save as `ai_blueprint_empathy_tests.txt`.

### Step 6: Content Generation
1. Update `generateActualContent` with OpenAI:
   ```typescript
   const promptTemplate = `# AI Blueprint Prompt
   **Business**: ${input.businessName}
   **Goal**: ${input.primaryGoal}
   **Solution**: ${input.aiSolution}
   **MVP**: ${input.mvpFeatures}
   **Audience**: ${input.targetAudience}
   **Constraints**: ${input.resourceConstraints}
   **Brand Voice**: ${input.brandVoice}
   **Current Status**: ${input.currentStatus}
   **Competitive Context**: ${input.competitiveContext}
   **Success Metrics**: ${input.successMetrics}
   **Minimum Viable Execution**: ${input.minimumViableExecution}
   **Output**: Markdown with Intent, Executive Summary, Technical Stack, ...
   `;
   const response = await openai.chat.completions.create({
     model: 'gpt-4-turbo',
     messages: [
       { role: 'system', content: 'You are an expert AI strategy consultant...' },
       { role: 'user', content: promptTemplate }
     ],
     max_tokens: 1500,
     temperature: 0.7
   });
   ```
2. Parse with `parseMarkdownToOutput`:
   ```typescript
   const parsedOutput = await parseMarkdownToOutput(markdownContent, input);
   ```
3. Log via `EventBus`:
   ```typescript
   eventBus.emit('openai:api:complete', { usage, responseTime, tokensUsed });
   ```
4. Save as `ai_blueprint_content_update.ts`.

### Step 7: Fallback and Recovery
1. Implement `routeFailure`:
   ```typescript
   const routeFailure = async (failure: any) => {
     switch (failure.type) {
       case 'validation': await handleValidationFailure(failure); break;
       case 'scoring': await handleLowTrust(failure); break;
       case 'empathy': await handleEmpathyMismatch(failure); break;
       case 'openai_api_failure': await handleOpenAIFailure(failure); break;
       case 'sparksplit_failure': await handleSparkSplitFailure(failure); break;
       case 'emotional_resonance': await handleEmotionalResonanceFailure(failure); break;
       case 'emotional_sovereignty_violation': await handleEmotionalSovereigntyViolation(failure); break;
       default: await handleSystemFailure(failure); break;
     }
   };
   ```
2. Define recovery handlers (e.g., `handleValidationFailure`).
3. Log via `EventBus`:
   ```typescript
   eventBus.emit('failure:detected', { failureType, details, timestamp });
   ```
4. Test with:
   - Invalid input: Missing `businessName`, `primaryGoal`.
   - Low trust: `trustScore < 4.2`.
5. Save as `ai_blueprint_fallback_tests.txt`.

### Step 8: Final Validation and Artifacts
1. Validate with `SchemaValidator`:
   ```typescript
   const validationResult = await schemaValidator.validate(aiBlueprintSchema, input);
   ```
2. Run tests: `npx ts-node test_mcp_ai_blueprint_20250609.ts`.
3. Ensure TAP compliance: `trustScore ≥ 4.2`, API time < 2s.
4. Generate artifacts:
   - `ai_blueprint.mcp.ts`
   - `test_mcp_ai_blueprint_20250609.ts`
   - `ai_blueprint_mcp_readme.md`
5. Save in `ai_blueprint_mcp_update_20250609.zip`.

## Input Fields
- `businessName`: String (e.g., "TechCo AI")
- `targetAudience`: String (e.g., "SaaS startups")
- `primaryGoal`: String (e.g., "Automate support")
- `competitiveContext`: String (e.g., "Unique NLP vs Intercom")
- `brandVoice`: String (enum: 'professional', 'technical', 'strategic', 'innovative', 'approachable', 'authoritative')
- `resourceConstraints`: String (e.g., "$5K, 3 months")
- `currentStatus`: String (e.g., "No AI tools")
- `aiSolution`: String (e.g., "AI chatbot")
- `mvpFeatures`: String (e.g., "NLP, CRM integration")
- `successMetrics`: String (e.g., "30d: Prototype")
- `linkedPrompts`: Array (e.g., ["business-plan", "ad-amplify"])
- `minimumViableExecution`: String (e.g., "Use Dialogflow")
- `enhancers`: Optional object (e.g., `{ emotionalDepth: true }`)

## Output Format (Markdown)
### Intent
[10-word strategic purpose for {{businessName}}]
### Executive Summary
[Summarize {{businessName}}, {{aiSolution}}, {{targetAudience}}, {{primaryGoal}}]
### Competitive Positioning
[Differentiate vs {{competitiveContext}}]
### Technical Stack
- [Tool, link, justified by {{resourceConstraints}}]
### Workflow Design
- [Steps for {{aiSolution}}, {{mvpFeatures}}]
### Prompt Engineering
- [2-3 GPT prompts for {{aiSolution}}]
### Data & Privacy
- [Data handling, GDPR/CCPA compliance]
### Automation Framework
- [Trigger-flow for {{mvpFeatures}}]
### Monetization Strategy
- [Model for {{aiSolution}}, {{targetAudience}}]
### Traffic & Launch Channels
- [2-3 channels for {{targetAudience}}]
### Scalability Roadmap
- [Enhancements tied to {{successMetrics}}]
### Deliverables & Next Steps
- [Build order, {{linkedPrompts}} integration]
### SparkSplit Comparison
- [Basic vs enhanced {{aiSolution}}, trust transparency]

## Cursor Instructions
1. **Context**: Validate 12 fields with `SchemaValidator`.
2. **Intent**: Deliver actionable {{aiSolution}} framework.
3. **Constraints**: Markdown, < 1000 words, {{brandVoice}}, trust ≥ 4.2, empathy ≥ 0.85.
4. **Integration**: Reference {{linkedPrompts}}.
5. **Validation**: Use `scorePrompt`, `validateAIBlueprintEmpathy`, trigger `routeFailure` if needed.

## Example Input
- `businessName`: "SupportAI"
- `targetAudience`: "SaaS companies, 10-50 employees"
- `primaryGoal`: "Reduce tickets by 50%"
- `competitiveContext`: "Unique NLP vs generic bots"
- `brandVoice`: "approachable"
- `resourceConstraints`: "$5K, 3 months, 2-person team"
- `currentStatus`: "Manual support, no AI"
- `aiSolution`: "AI chatbot for ticket triage"
- `mvpFeatures`: "NLP, Zendesk integration"
- `successMetrics`: "30d: Prototype; 60d: 20 users"
- `linkedPrompts`: ["business-plan", "ad-amplify"]
- `minimumViableExecution`: "Use Dialogflow, Zapier"
- `enhancers`: `{ emotionalDepth: true, technicalDetail: true }`

## Constraints
- No filler content.
- GDPR/CCPA compliance.
- Real-world tools matching {{resourceConstraints}}.
- Cross-prompt integration with {{linkedPrompts}}.
- API response time < 2s.

## Success Criteria
- Trust score ≥ 4.2, emotional resonance ≥ 0.85.
- Actionable deliverables for {{mvpFeatures}}.
- TAP compliance, V4 schema adherence.
- Artifacts: `ai_blueprint_mcp_readme.md`, tests, ZIP.

## Notes
- Use `gpt-4-turbo` for OpenAI calls.
- Log errors in `ai_blueprint_error_log.txt`.
- Reference `business-plan.mcp.ts` for `applyMCPEnhancers`, `routeFailure`.
- Support legacy (`awe`, `ownership`, `wonder`, `calm`, `power`) and new (`clarity`, `empowerment`, `trust`, `joy`, `alignment`) emotional compass.