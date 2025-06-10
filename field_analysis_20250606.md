# Field Analysis for Blog Blitz

## MCP Information
- File: `prompts/blogblitz/blogblitz.mcp.ts`
- Commit Hash: f6e5d4c3b2a1
- Current Fields: 8

## Current Field Structure
| Field Name | Line Number | Type | Description |
|------------|-------------|------|-------------|
| topic | 27 | string | Blog subject and angle |
| audience | 28 | string | Reader demographics and interests |
| tone | 29 | string | Writing style (warm, bold, calm, motivating, etc.) |
| emotionalOutcome | 30 | string | How readers should feel after reading (confident, inspired, etc.) |
| bizName | 33 | string | Business context for blog (optional) |
| industry | 34 | string | Industry context (optional) |
| keyOfferings | 41 | string | Products or services being promoted (enhanced) |
| customerPain | 42 | string | Pain points addressed by the blog (enhanced) |
| differentiator | 43 | string | What makes the business unique (enhanced) |
| trustSignal | 44 | string | Credentials or social proof (enhanced) |
| desiredAction | 45 | string | CTA or next step for readers (enhanced) |
| keyMessage | 46 | string | Core value proposition or takeaway (enhanced) |
| emotionalContext | 47-52 | object | Additional emotional context (enhanced) |
| enhancers | 53-57 | object | Optional feature toggles (enhanced) |

## Current Validation Schema
- Schema: The schema requires 'topic', 'audience', 'tone', and 'emotionalOutcome' as mandatory fields (lines 68-78)
- Enhancer Logic: The `applyMCPEnhancers()` function (lines 367-389) enriches the input by inferring additional fields like pain points based on audience, offerings based on topic, desired action based on emotional outcome, and trust signals based on industry

## Target Standardized Fields
- Source: `PROMPT-BY-PROMPT-FIELD-ANALYSIS.md` (lines 985-1202)
- Target Fields: 8
- Fields:
  1. `businessName` - Business context for blog
  2. `targetAudience` - Reader demographics + interests
  3. `primaryGoal` - What this blog should achieve
  4. `keyMessages` - Main points + takeaways + CTAs
  5. `deliveryFormat` - Content length + format + SEO strategy
  6. `competitiveContext` - How to differentiate from existing content
  7. `topic` - Blog subject + angle
  8. `brandVoice` - Writing style + tone that matches brand

## Implementation Plan
- Replace fields with standardized specifications
- Preserve `applyMCPEnhancers()` logic
- Add emotional resonance and cultural adaptation
- Integrate basic SparkSplit trust transparency (comparison with 1 metric)
- Add 5-axis emotional compass (clarity, empowerment, trust, joy, alignment)
- Support cultural adaptation for en-US, es-ES, zh-CN
- Ensure webhook-compatible JSON output for Make.com integration

## Testing Requirements
- API test with real OpenAI calls
- Verify 8 fields
- Test 3 locales: en-US, es-ES, zh-CN
- Generate all verification artifacts

## Verification Approach
- Check `git diff` for field replacements
- Validate API response times (>5,000ms)
- Confirm `chatcmpl-*` request IDs
- Verify emotional resonance with 5-axis compass
- Test webhook compatibility with Make.com structure 