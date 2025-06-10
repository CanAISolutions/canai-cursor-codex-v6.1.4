# Field Analysis for Social Content

## MCP Information
- File: `prompts/social_content.mcp.ts`
- Commit Hash: Current working version
- Current Fields: 5 core fields + 17 enhancers = 22 total fields

## Current Field Structure
| Field Name | Line Number | Type | Description |
|------------|-------------|------|-------------|
| platform | 406 | string | Target social media platform (Instagram, LinkedIn, Twitter, Facebook) |
| contentType | 407 | string | Type of content (Post, Story, Reel, Thread, Article, Poll) |
| targetAudience | 408 | string[] | Array of target audience segments |
| keyMessage | 409 | string | Core message for the social content |
| tone | 410 | string | Communication tone (engaging, informative, conversational, professional, casual) |
| enhancers | 411 | Record<string, boolean> | 17 enhancement flags for specialized social media features |

## Current Validation Schema
- Schema: Object with required fields ['platform', 'contentType', 'targetAudience', 'keyMessage', 'tone']
- Enhancer Logic: `applyMCPEnhancers()` function with sophisticated platform-specific inference (lines 604-832)
- Platform-specific inference for content type, audience, and messaging
- 17 enhancer flags: hashtagOptimization, platformBestPractices, characterLimitOptimization, visualContentSuggestions, engagementHooks, callToActionOptimization, emotionalTriggers, storytellingElements, timingOptimization, audienceSegmentation, crossPlatformAdaptation, trendingTopicIntegration, engagementTracking, performanceMetrics, abTestingVariants, viralPotentialScoring, influencerCollaboration, communityBuilding, userGeneratedContent

## Target Standardized Fields
- Source: `PROMPT-BY-PROMPT-FIELD-ANALYSIS.md` (lines 1150-1200)
- Target Fields: 12 (matching Social Content strategic complexity)
- Fields: businessName, targetAudience, primaryGoal, competitiveContext, brandVoice, resourceConstraints, currentStatus, platformFeatures, keyMessages, deliveryFormat, technicalRequirements, implementationTimeline

## Current Sophistication Level
- **Field Inference**: Advanced platform-specific inference for 5 core fields
- **Enhancement Logic**: 17 specialized enhancer flags for social media features
- **Platform Intelligence**: Sophisticated platform-specific content optimization
- **Validation**: Comprehensive schema validation with error handling
- **Scoring**: Multi-dimensional scoring with empathy metrics
- **Trust Transparency**: Integrated trust scoring and validation

## Implementation Plan
- Preserve sophisticated `applyMCPEnhancers()` logic (lines 604-832)
- Add SparkSplit integration for social media trust transparency
- Implement emotional sovereignty with 5-axis compass
- Focus on social media strategy and content creation capabilities
- Maintain platform-specific inference patterns
- Enhance with 12 standardized fields while preserving existing sophistication

## Testing Requirements
- API test with proven hardcoded API key solution
- Verify 12 fields with social media strategy sophistication
- Test social media content generation for e-commerce brand
- Generate all verification artifacts following AI Blueprint pattern
- Validate platform-specific inference logic
- Test 3 locales: en-US, es-ES, zh-CN

## Verification Approach
- Check `git diff` for field replacements while preserving enhancer logic
- Validate API response times (>5,000ms)
- Confirm `chatcmpl-*` request IDs
- Test social media content generation across multiple platforms
- Verify platform-specific inference patterns work correctly
- Validate social media strategy and engagement optimization 