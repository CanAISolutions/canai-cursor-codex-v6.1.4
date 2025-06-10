# 🎯 FIELD STANDARDIZATION PROJECT

**Project Status**: DOCUMENTED - Ready for Implementation  
**Created**: 2025-01-27  
**Priority**: High - Affects all 11 MCP prompts and system integration

---

## 📋 **PROJECT OVERVIEW**

### **Objective**
Standardize field names across all 11 CanAI prompts to create consistent UX, simplified technical architecture, and improved cross-prompt integration.

### **Scope**
- **11 MCP Prompt Files**: All `.mcp.ts` files in `/prompts/` directory
- **Test Files**: `promptBenchmarks.test.ts` and related test suites
- **Variable Mapping**: `cursor/system-intel/variable-alias-map.json`
- **JSONB Flattening**: Webhook and Make.com integration files
- **Interface Catalog**: Alignment with standardized architecture

---

## 🏗️ **STANDARDIZED FIELD ARCHITECTURE**

### **Universal Core Fields** (All 11 Prompts)
```typescript
interface UniversalCoreFields {
  businessName: string;        // Standardized from: bizName, companyName
  targetAudience: string;      // Standardized from: audience, targetMarket
  primaryGoal: string;         // Standardized from: goal, campaignGoal, contentGoal
  brandVoice: string;          // Standardized from: tone, brandPersonality, voice
}
```

### **Universal Professional Fields** (Most Prompts)
```typescript
interface UniversalProfessionalFields {
  industry: string;            // Already standardized
  keyOfferings: string;        // Already standardized
  competitiveContext: string;  // Standardized from: competitors, competitiveDifferentiation
  customerPain: string;        // Already standardized
}
```

### **Universal Enhancement Fields** (Optional)
```typescript
interface UniversalEnhancementFields {
  emotionalContext?: EmotionalContext;
  enhancers?: PromptEnhancers;
  trustSignal?: string;
  differentiator?: string;
}
```

---

## 📊 **FIELD MAPPING REQUIREMENTS**

### **Critical Field Changes Needed**

| Current Field Names | Standardized Name | Affected Prompts | Impact Level |
|-------------------|------------------|------------------|--------------|
| `bizName`, `companyName` | `businessName` | Business Plan, Brand Identity | HIGH |
| `audience`, `targetMarket` | `targetAudience` | All 11 prompts | HIGH |
| `goal`, `campaignGoal`, `contentGoal` | `primaryGoal` | 8+ prompts | HIGH |
| `tone`, `brandPersonality`, `voice` | `brandVoice` | All 11 prompts | HIGH |
| `competitors`, `competitiveDifferentiation` | `competitiveContext` | 6+ prompts | MEDIUM |

### **Backward Compatibility Strategy**
- **Phase 1**: Add alias support in MCP enhancers
- **Phase 2**: Update core systems to use standardized names
- **Phase 3**: Remove old field name support

---

## 🔧 **TECHNICAL IMPACT AREAS**

### **1. MCP Files Requiring Updates**
```
/prompts/business_plan.mcp.ts
/prompts/ai_brand_identity.mcp.ts
/prompts/email_campaign.mcp.ts
/prompts/site_audit.mcp.ts
/prompts/social_content.mcp.ts
/prompts/reverse_strategy.mcp.ts
/prompts/ai_blueprint.mcp.ts
/prompts/profile_makeover.mcp.ts
/prompts/blogblitz.mcp.ts
/prompts/ad_amplify.mcp.ts
/prompts/sparksplit.mcp.ts
```

### **2. Test Files Requiring Updates**
```
/cursor/performance/promptBenchmarks.test.ts
/tests/dreamstate/api/
/tests/integration/
All MCP-related test files
```

### **3. System Integration Files**
```
/cursor/system-intel/variable-alias-map.json
/scripts/json-flattening-makecom.ts
/workspace-organization/02-orchestration/make-com/integration/
/workspace-organization/01-foundation/supabase/functions/jsonb-flattening-functions.sql
```

### **4. Interface Catalog Alignment**
```
CANAI-ENHANCED-INTERFACE-CATALOG.json
Interface mapping validation
Cross-prompt integration logic
```

---

## ⚠️ **KNOWN CONFLICTS & RESOLUTIONS**

### **Variable Alias Map Conflicts**
```json
// Current conflicts that align with standardization:
{
  "targetAudience vs audience": "RESOLVE → targetAudience",
  "companyName vs bizName": "RESOLVE → businessName", 
  "campaignGoal vs goal": "RESOLVE → primaryGoal",
  "callToAction vs desiredAction": "RESOLVE → callToAction"
}
```

### **JSONB Flattening Impacts**
- **Make.com Webhooks**: Field name changes affect existing scenarios
- **Supabase Queries**: JSONB path queries need updates
- **Dot Notation**: Flattening logic hardcodes field names

---

## 🎯 **IMPLEMENTATION PHASES**

### **Phase 1: Foundation (Safe Changes)**
- [ ] Update variable-alias-map.json to resolve conflicts
- [ ] Add field aliasing in MCP enhancer functions
- [ ] Update test files to use standardized names
- [ ] Validate no breaking changes

### **Phase 2: Core System Updates**
- [ ] Update JSONB flattening logic
- [ ] Update webhook payload structures  
- [ ] Update Supabase function field references
- [ ] Run comprehensive integration tests

### **Phase 3: Cleanup & Optimization**
- [ ] Remove old field name support
- [ ] Clean up variable alias map
- [ ] Update documentation
- [ ] Validate cross-prompt integration

---

## 🧪 **VALIDATION REQUIREMENTS**

### **Test Coverage Needed**
- [ ] All 11 MCP prompts process with standardized fields
- [ ] Webhook payloads generate correctly
- [ ] Make.com integration maintains compatibility
- [ ] Supabase JSONB queries work with new field paths
- [ ] Cross-prompt data sharing functions properly

### **Performance Validation**
- [ ] Field standardization doesn't impact processing speed
- [ ] JSONB flattening performance maintained
- [ ] Webhook generation stays under performance thresholds

---

## 📈 **SUCCESS METRICS**

### **Technical Metrics**
- **Field Consistency**: 100% standardized field names across all prompts
- **Test Coverage**: 95%+ test pass rate with new field structure
- **Performance**: <5% impact on processing times
- **Integration**: 100% webhook/Make.com compatibility maintained

### **UX Metrics**
- **User Confusion**: Reduced by consistent field naming
- **Cross-Prompt Flow**: Improved data sharing between prompts
- **Developer Experience**: Simplified field mapping and validation

---

## 🔗 **RELATED DOCUMENTATION**

- `PROMPT-BY-PROMPT-FIELD-ANALYSIS.md` - Detailed field analysis
- `CANAI-ENHANCED-INTERFACE-CATALOG.json` - Interface specifications
- `cursor/system-intel/variable-alias-map.json` - Current field mappings
- `mcp-system-architecture-living-documentation.md` - System architecture

---

## 📝 **NOTES FOR IMPLEMENTATION**

### **Key Considerations**
1. **Emotional Sovereignty**: All changes must maintain 4.2+ trust score
2. **Test-First Truth**: Every change requires test validation
3. **Production Velocity**: Minimize disruption to launch timeline
4. **User Experience**: Field changes should feel natural and intuitive

### **Risk Mitigation**
- **Gradual Rollout**: Implement aliasing before removing old fields
- **Comprehensive Testing**: Validate every integration point
- **Rollback Plan**: Maintain ability to revert changes quickly
- **User Communication**: Clear documentation of any UX changes

---

**Status**: READY FOR MCP FILE WORK  
**Next Action**: Focus on MCP file improvements while this project waits for implementation

---

> "Standardization serves not just technical elegance, but user empowerment through consistency."  
> — CanAI Field Standardization Project 