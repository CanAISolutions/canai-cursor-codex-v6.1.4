# Claude-Task: Standardize and Enhance `business_plan` MCP

**Objective**: Standardize and optimize the `business_plan.mcp.ts` file to align with the `MCP-COMPREHENSIVE-STANDARDIZATION-PLAN-V4.md`, ensuring TAP compliance, trust transparency, emotional intelligence, and production readiness. Follow the steps below precisely, using the provided context file as the definitive guide. Do not modify other MCP files or assume functionality beyond what is specified.

## Context
- Use `MCP-COMPREHENSIVE-STANDARDIZATION-PLAN-V4.md` as the sole context for standardization requirements.
- Reference `sparksplit.mcp.ts`, `email_campaign.mcp.ts`, `blogblitz.mcp.ts`, and `reverse_strategy.mcp.ts` for structural and feature consistency (e.g., `SparkSplitEngine`, `EmotionalUXRenderer`).
- Assume Codex v6.1.4 and TAP-locked compliance.
- Use real OpenAI API calls for content generation, validated with `OPENAI_API_KEY` from `.env`.

## Instructions

### Step 1: Review and Validate Current `business_plan.mcp.ts`
1. Read the entire `business_plan.mcp.ts` file to understand its structure, interfaces, and functionality.
2. Identify the input schema (`BusinessPlanInput`), validation logic (`PromptSchemaValidator`), scoring (`PromptScoringManager`), and output generation (`generateBusinessPlanContent`).
3. Check for existing TAP metadata, `SparkSplitEngine` integration, and emotional intelligence features (e.g., `emotionalResonance`, `emotionalCompass`).
4. Output a summary (max 200 words) of the file’s current state, noting compliance with V4 plan requirements (e.g., trust transparency, field inference, fallback mechanisms).
5. Save this summary as `business_plan_mcp_review.txt`.

### Step 2: Update Input Schema
1. Ensure `BusinessPlanInput` aligns with the V4 plan’s 7-field standard (`businessName`, `targetAudience`, `primaryGoal`, `keyMessages`, `tone`, `industry`, `culturalContext`).
2. Add missing fields with defaults (e.g., `culturalContext: 'en-US'` if absent).
3. Update `validationSchema` to enforce required fields and types using `PromptSchemaValidator`.
   - Example: `businessName: { type: 'string', required: true }`.
4. Add backward compatibility for legacy fields (e.g., map `bizName` to `businessName`).
5. Save the updated schema as a code snippet in `business_plan_schema_update.ts`.

### Step 3: Enhance Field Inference
1. Implement `applyMCPEnhancers` to infer missing fields per V4 plan.
   - Example: Infer `businessName` from `primaryGoal` (e.g., regex match `/for\s+([A-Z][A-Za-z0-9\s&]+)/`).
   - Infer `tone` from `keyMessages` or `industry` (e.g., 'professional' for 'finance').
2. Ensure inferences align with `SparkSplitEngine` (e.g., use `inferProductTypeFromDelivery` for `industry`).
3. Test inference logic with 3 sample inputs (e.g., minimal, partial, complete data).
4. Save test cases and results in `business_plan_inference_tests.txt`.

### Step 4: Integrate Trust Transparency
1. Add `SparkSplitEngine` integration if missing, using `SparkSplitOutput` for trust metrics.
   - Example: `session.sparkSplitOutput = { trustTransparency: 0.85, emotionalResonance: 0.9 }`.
2. Implement `calculateTrustScore` combining scoring (60%) and empathy (40%) metrics.
   - Example: `trustScore = (scoringScore * 0.6 + empathyScore * 0.4)`.
3. Ensure `trustScore` is logged via `EventBus` with `transparencyFactors`.
4. Add fallback trust score (4.2) for valid outputs per V4 plan.
5. Save updated trust logic as `business_plan_trust_update.ts`.

### Step 5: Enhance Emotional Intelligence
1. Add `validateBusinessPlanEmpathy` to evaluate `emotionalResonance`, `toneAlignment`, `connectionStrength`, and `authenticity`.
   - Example: `const emotionalResonance = calculateEmotionalResonance(content, tone)`.
2. Implement 5-axis `emotionalCompass` (`clarity`, `empowerment`, `trust`, `joy`, `alignment`) with scores (4.0–5.0).
3. Ensure `EmotionalUXRenderer` adjusts outputs for emotional resonance (e.g., rephrase for `joy` if score < 4.5).
4. Test empathy validation with 2 sample outputs, ensuring `emotionalDepth` ≥ 0.85.
5. Save test results in `business_plan_empathy_tests.txt`.

### Step 6: Content Generation with Real API Calls
1. Update `generateBusinessPlanContent` to use OpenAI API (`openai.chat.completions.create`).
   - Example:
     ```typescript
     const response = await openai.chat.completions.create({
       model: 'gpt-4-turbo',
       messages: [{ role: 'user', content: prompt }],
       max_tokens: 1500
     });
     ```
2. Construct prompt using V4 plan templates, including `businessName`, `targetAudience`, and `emotionalCompass`.
3. Validate API response for `trustTransparency` and `emotionalResonance` using `PromptScoringManager`.
4. Log API call details (e.g., tokens used, response time) via `EventBus`.
5. Save updated content generation logic in `business_plan_content_update.ts`.

### Step 7: Implement Fallback and Recovery
1. Add `routeFallback` for validation, scoring, or empathy failures per V4 plan.
   - Example: Trigger fallback for `trustScore` < 4.2 or `emotionalDepth` < 0.85.
2. Implement recovery strategies (e.g., `handleLowScore`, `handleEmotionalMismatch`).
3. Log fallback events with `EventEmitter` for transparency.
4. Test fallback with 2 failure cases (e.g., invalid input, low trust score).
5. Save test results in `business_plan_fallback_tests.txt`.

### Step 8: Final Validation and Artifacts
1. Validate updated `business_plan.mcp.ts` against V4 plan using `PromptSchemaValidator`.
2. Run integration tests with `npx ts-node test_mcp_business_plan_20250607.ts` (create if missing).
3. Ensure TAP compliance (Trust: `trustScore` ≥ 4.2, Alignment: schema adherence, Performance: API response time < 2s).
4. Generate final artifacts:
   - Updated `business_plan.mcp.ts`.
   - Test file: `test_mcp_business_plan_20250607.ts`.
   - Documentation: `business_plan_mcp_readme.md` summarizing changes and usage.
5. Save all artifacts in a ZIP file: `business_plan_mcp_update_20250607.zip`.

## Success Criteria
- Updated `business_plan.mcp.ts` compiles without errors.
- Trust score ≥ 4.2 and emotional depth ≥ 0.85 for 90% of test cases.
- All API calls use real OpenAI endpoints with valid `OPENAI_API_KEY`.
- Artifacts include all required files with clear documentation.
- No assumptions or hallucinations beyond V4 plan or referenced MCPs.

## Output Format
- Provide all text outputs (e.g., summaries, test results) in plain text.
- Provide code snippets in TypeScript with proper formatting.
- Package final artifacts in a ZIP file with a clear directory structure.

## Notes
- Do not simulate API results; use real OpenAI calls with `.env` settings.
- If errors occur, log them via `EventBus` and propose fixes in `business_plan_error_log.txt`.
- For clarification, reference `sparksplit.mcp.ts` for `SparkSplitEngine` or `email_campaign.mcp.ts` for empathy validation.