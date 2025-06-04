# Schemas Directory

## Overview
Central repository for all schema definitions, validation rules, and data structure specifications across the CanAI Codex v6.1.4 ecosystem.

## Schema Lock v3 (Active)

### Current Status: LOCKED 🔒
- **Version**: v3
- **Status**: Codex-Validated
- **Lock Date**: 2025-05-27
- **Template Coverage**: 100%
- **Trust Level**: Locked

### Schema Lock File: `FIELD-SPECIFICATIONS-REFERENCE.md`
The canonical 18-table schema definition that prevents drift and ensures consistency across all prompt types and optimized Airtable infrastructure.

#### Core Fields
```json
{
  "fields": [
    "idea", "audience", "tone", "problemSolved", "differentiator",
    "customerContent", "founderBio", "archetype", "voice", "vibe"
  ]
}
```

#### Emotional Defaults
```json
{
  "emotionalDefaults": {
    "tone": "supportive",
    "emotionalContext": "confident", 
    "voice": "empowering",
    "vibe": "professional"
  }
}
```

#### MCP Enhancers
```json
{
  "mcpEnhancers": {
    "problemSolved": "inferProblemFromIdea",
    "customerContent": "inferContentFromAudience",
    "differentiator": "inferDifferentiatorFromIdea", 
    "founderBio": "inferFounderFromContext"
  }
}
```

## Drift Protection System

### Enforcement Mechanisms
- **codexValidation**: All schema changes must pass Codex validation
- **driftProtection**: Prevents unauthorized schema modifications
- **mcpEnhancement**: Enables real-time field inference
- **schemaIntegrity**: Maintains consistency across all components

### CI Integration
Schema integrity tests run automatically to prevent:
- Unmapped template variables
- Schema lock violations
- MCP enhancer coverage gaps
- Emotional default inconsistencies

### Test Suite: `/tests/dreamstate/schema-integrity.test.ts`
Comprehensive validation including:
- Template variable mapping verification
- Schema lock structure validation
- MCP enhancer coverage testing
- Drift detection and prevention

## Directory Structure

```
schemas/
├── README.md                    # This file
├── 18-table-schema-reference.md   # Schema reference (18-table optimized)
├── validation.test.ts           # Schema validation tests
└── accelerators/                # Accelerator-specific schemas
    ├── smart-prompt-score.schema.ts
    └── prompt-genetics.schema.ts
```

## Integration Points

### Airtable Infrastructure
- **Tables**: PromptLogs, FeedbackLogs with `codexEnforcement: true`
- **Fields**: All fields mapped to schema lock definitions
- **Validation**: Real-time compliance checking

### MCP Layer
- **BusinessPlan MCP**: Enhanced with intelligent field inference
- **SiteAudit MCP**: Audit-specific enhancement logic
- **Enhancement Logic**: Auto-fills missing fields based on context

### Template System
- **Prompts**: All variables in `/prompts/` mapped to schema
- **GPT Templates**: All variables in `/gpt-templates/` validated
- **Coverage**: 100% template-to-schema alignment

## Usage

### Schema Validation
```typescript
// Run schema integrity tests
npm test tests/dreamstate/schema-integrity.test.ts

// Manual validation
import { validateSchemaLock } from '../tests/dreamstate/schema-integrity.test';
const result = validateSchemaLock();
```

### MCP Enhancement
```typescript
// Enhancement automatically applied in MCP classes
const enhanced = applyMCPEnhancers(input);
// Fields like problemSolved, customerContent auto-filled if missing
```

### Adding New Fields
1. Update `airtable-rewrite-workspace/FIELD-SPECIFICATIONS-REFERENCE.md` with new field
2. Add to appropriate validation rules section
3. Update MCP enhancer logic if needed
4. Run schema integrity tests to verify
5. Update table definitions with new field

## Validation Rules

### Required Fields
- `idea`: Core business concept
- `audience`: Target market definition  
- `tone`: Communication style

### Enhanced Fields (Auto-filled by MCP)
- `problemSolved`: Inferred from idea/context
- `customerContent`: Generated from audience
- `differentiator`: Created from industry/idea
- `founderBio`: Built from emotional context

### Emotional Fields
- `tone`: Communication style
- `voice`: Brand personality
- `vibe`: Overall feeling
- `emotionalContext`: Emotional state

## Monitoring & Maintenance

### Health Checks
- Schema lock integrity validation
- Template mapping verification
- MCP enhancer coverage assessment
- Emotional default consistency

### Performance Metrics
- Enhancement success rates
- Field inference accuracy
- User experience impact
- System reliability scores

### Alerts & Notifications
- Schema drift detection
- Template mapping failures
- MCP enhancer errors
- Validation rule violations

## Best Practices

### Schema Changes
1. Always update schema lock first
2. Run full test suite before deployment
3. Document all changes in auto-actions log
4. Verify MCP enhancer compatibility

### Template Development
1. Use only schema-mapped variables
2. Test against schema integrity suite
3. Provide fallback values for enhanced fields
4. Maintain emotional consistency

### MCP Enhancement
1. Preserve user input precedence
2. Log all enhancements for audit
3. Provide graceful degradation
4. Test inference accuracy regularly

## Codex Compliance
- All schemas maintain Codex v6.1.4 standards
- Schema lock prevents unauthorized drift
- MCP enhancers improve UX without compromising reliability
- Complete audit trail for all schema changes

## Next Steps
1. **Expand Coverage**: Add remaining prompt types to schema lock
2. **ML Enhancement**: Upgrade inference with machine learning
3. **User Feedback**: Incorporate corrections to improve accuracy
4. **Performance**: Optimize enhancement speed and accuracy 