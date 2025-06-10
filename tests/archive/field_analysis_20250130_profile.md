# Field Analysis for Profile Makeover

## MCP Information
- File: `prompts/profile_makeover.mcp.ts`
- Commit Hash: Current working directory
- Current Fields: 9 core fields + emotional context + enhancers

## Current Field Structure
| Field Name | Line Number | Type | Description |
|------------|-------------|------|-------------|
| platform | 25 | string | Target social media platform |
| currentBio | 26 | string? | Existing bio content (optional) |
| businessType | 27 | string | Business focus or industry |
| tone | 28 | string | Desired communication tone |
| emotionalGoal | 29 | string | Target emotional response |
| bizName | 31 | string? | Business name (optional) |
| audience | 32 | string? | Target audience (optional) |
| keyOfferings | 33 | string? | Services or products offered |
| industry | 34 | string? | Industry classification |

## Current Validation Schema
- Schema: Platform validation (LinkedIn, Instagram, X, TikTok, Twitter)
- Enhancer Logic: `applyMCPEnhancers()` with audience inference, offerings inference, pain point mapping
- Character Limits: Platform-specific constraints (LinkedIn: 120-2600, Instagram: 50-150, etc.)

## Target Standardized Fields
- Source: `PROMPT-BY-PROMPT-FIELD-ANALYSIS.md` (lines 1065-1075)
- Target Fields: 10 (matching Profile Makeover professional strategy complexity)
- Fields: businessName, targetAudience, primaryGoal, competitiveContext, brandVoice, resourceConstraints, currentStatus, platformFeatures, keyMessages, deliveryFormat

## Implementation Plan
- Replace fields with standardized specifications from field analysis
- Preserve `applyMCPEnhancers()` logic for sophisticated field inference
- Add SparkSplit integration for trust transparency in professional positioning
- Implement emotional sovereignty with 5-axis compass (clarity, empowerment, trust, joy, alignment)
- Maintain platform-specific optimization and character limits

## Testing Requirements
- API test with real OpenAI calls using proven API key solution
- Verify 10 standardized fields with sophisticated enhancement
- Test 3 locales: en-US, es-ES, zh-CN for cultural professional positioning
- Generate all verification artifacts following AI Brand Identity pattern

## Verification Approach
- Check `git diff` for field replacements matching standardized specs
- Validate API response times (>5,000ms) with `chatcmpl-*` request IDs
- Confirm professional brand positioning across cultural contexts
- Test LinkedIn optimization, content strategy, and client acquisition elements 