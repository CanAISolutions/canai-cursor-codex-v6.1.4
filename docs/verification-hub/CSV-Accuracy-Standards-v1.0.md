# 🎯 CSV Accuracy Standards v1.0
**CanAI Airtable Import Validation Framework**

> **Document Type**: DEFINITIVE VALIDATION STANDARDS  
> **Version**: v1.0  
> **Status**: Production Standard  
> **Framework**: Test-First Truth + Codex v6.1.4  
> **Purpose**: Eliminate manual double-checking through systematic validation  

## 📋 Table of Contents
1. [Overview](#overview)
2. [Field Type Standards](#field-type-standards)
3. [Single Select Validation](#single-select-validation)
4. [Decimal Precision Standards](#decimal-precision-standards)
5. [Required vs Optional Fields](#required-vs-optional-fields)
6. [Data Format Standards](#data-format-standards)
7. [Cross-Table Consistency Rules](#cross-table-consistency-rules)
8. [Validation Checklist](#validation-checklist)
9. [Common Issues & Solutions](#common-issues--solutions)
10. [Automated Validation Tools](#automated-validation-tools)

## Overview

This document establishes the definitive standards for CSV accuracy validation across all 18 optimized Airtable tables. Following these standards ensures:
- **100% consistency** across all table imports
- **Zero manual double-checking** required
- **Automated validation** capability
- **Production-ready** data integrity

## Field Type Standards

### Core Field Types Mapping
| Airtable Type | CSV Format | Example | Notes |
|---------------|------------|---------|-------|
| `singleLineText` | Plain text | `user_001` | No quotes unless containing commas |
| `longText` | JSON string | `"{""key"":""value""}"` | Escaped quotes for JSON |
| `number` | Decimal | `0.85` | See precision standards below |
| `checkbox` | Boolean | `true` or `false` | Lowercase only |
| `dateTime` | ISO 8601 | `2025-01-27T10:00:00Z` | UTC timezone required |
| `singleSelect` | Exact match | `ai_blueprint` | Must match options exactly |
| `multipleSelects` | Comma-separated | `engagement_high,trust_building` | No spaces after commas |

### Field Type Validation Rules
1. **singleLineText**: Max 255 characters, no line breaks
2. **longText**: Unlimited length, JSON must be properly escaped
3. **number**: Must follow precision rules (see below)
4. **checkbox**: Only `true` or `false` (lowercase)
5. **dateTime**: Must be valid ISO 8601 format
6. **singleSelect**: Must exactly match one defined option
7. **multipleSelects**: Each value must match defined options

## Single Select Validation

### PromptType Options (11 Total)
**DEFINITIVE LIST** - Must match exactly:
```
ai_blueprint
business_plan
email_campaign
site_audit
social_content
reverse_strategy
ai_brand_identity
profile_makeover
blogblitz
ad_amplify
sparksplit
```

### ProductType Options (SparkSplitAnalytics)
**DEFINITIVE LIST**:
```
discovery_funnel
ai_blueprint
business_plan
email_campaign
site_audit
social_content
reverse_strategy
ai_brand_identity
profile_makeover
blogblitz
ad_amplify
```

### UserSelection Options (SparkSplitAnalytics)
**DEFINITIVE LIST**:
```
sterile
enhanced
both
neither
skip
```

### WinningVariant Options (SparkSplitAnalytics)
**DEFINITIVE LIST**:
```
sterile
enhanced
tie
inconclusive
```

## Decimal Precision Standards

### Precision Requirements by Field Type
| Field Category | Precision | Format | Example |
|----------------|-----------|--------|---------|
| **Trust Scores** | 2 decimal places | `0.00` | `4.20` |
| **Performance Metrics** | 4 decimal places | `0.0000` | `0.8750` |
| **Percentages** | 2 decimal places | `0.00` | `23.00` |
| **Cost Fields** | 4 decimal places | `0.0000` | `0.0045` |
| **Time Fields (seconds)** | 2 decimal places | `0.00` | `15.50` |
| **Counts/Integers** | 0 decimal places | `0` | `1250` |

### Specific Field Precision Map
```json
{
  "trustScore": 2,
  "resonanceScore": 2,
  "momentumScore": 2,
  "outputDeltaScore": 2,
  "emotionalAlignment": 2,
  "promptQualityScore": 2,
  "changeRate": 2,
  "confidenceLevel": 2,
  "sterilePerformance": 4,
  "enhancedPerformance": 4,
  "deliveryCost": 4,
  "costUSD": 4,
  "conversionLift": 2,
  "trustScoreDelta": 2,
  "improvementPercentage": 2,
  "timeToSelection": 2,
  "aweScore": 2,
  "ownershipScore": 2,
  "wonderScore": 2,
  "calmScore": 2,
  "powerScore": 2,
  "tokensUsed": 0,
  "revisionCount": 0,
  "clarityIndex": 0,
  "executionTimeMs": 0,
  "variantIndex": 0
}
```

## Required vs Optional Fields

### Always Required Fields (All Tables)
```
recordId
createdAt
updatedAt
```

### Table-Specific Required Fields
#### PromptLogs
```
sessionId
userId
promptType
```

#### SparkSplitAnalytics
```
sessionId
userId
testId
productType
```

#### SessionAnalytics
```
sessionId
userId
```

### Optional Enhancement Fields
```
tone (enhancer field)
customerPain (enhancer field)
differentiator (enhancer field)
trustSignal (enhancer field)
```

## Data Format Standards

### JSON Field Formatting
**Correct Format**:
```csv
"{""industry"":""SaaS"",""goal"":""growth""}"
```

**Incorrect Formats**:
```csv
"{'industry':'SaaS','goal':'growth'}"  ❌ Single quotes
{"industry":"SaaS","goal":"growth"}     ❌ Unescaped quotes
```

### DateTime Formatting
**Correct Format**:
```csv
2025-01-27T10:00:00Z
```

**Incorrect Formats**:
```csv
2025-01-27 10:00:00     ❌ Missing T and Z
01/27/2025 10:00:00     ❌ US date format
2025-01-27T10:00:00     ❌ Missing timezone
```

### Boolean Formatting
**Correct Format**:
```csv
true
false
```

**Incorrect Formats**:
```csv
True    ❌ Capitalized
TRUE    ❌ All caps
1       ❌ Numeric
0       ❌ Numeric
```

## Cross-Table Consistency Rules

### Session ID Consistency
- **Format**: `session_XXX` where XXX is 3-digit number
- **Example**: `session_001`
- **Rule**: Same sessionId must appear across related tables

### User ID Consistency
- **Format**: `user_XXX` where XXX is 3-digit number
- **Example**: `user_001`
- **Rule**: Same userId must appear across related tables

### Prompt Log ID Consistency
- **Format**: `sample_XXX` where XXX is 3-digit number
- **Example**: `sample_001`
- **Rule**: Referenced in SparkSplitAnalytics.promptLogId

### Test ID Format (SparkSplit)
- **Format**: `sparksplit-{sessionId}-{timestamp}`
- **Example**: `sparksplit-session_001-1738000000000`
- **Rule**: Must be unique per A/B test

## Validation Checklist

### Pre-Import Validation
- [ ] **Field Count**: Header matches expected field count
- [ ] **Field Names**: All field names match table definition exactly
- [ ] **Field Order**: Fields in correct order (recordId, createdAt, updatedAt first)
- [ ] **Data Types**: All values match expected data types
- [ ] **Precision**: Number fields have correct decimal places
- [ ] **Single Selects**: All values match defined options exactly
- [ ] **Required Fields**: All required fields have values
- [ ] **JSON Format**: All JSON fields properly escaped
- [ ] **DateTime Format**: All dates in ISO 8601 format
- [ ] **Cross-References**: Related IDs exist and are consistent

### Post-Import Validation
- [ ] **Record Count**: Expected number of records imported
- [ ] **Field Types**: Airtable recognized field types correctly
- [ ] **Single Select Options**: All options imported correctly
- [ ] **Number Precision**: Decimal places preserved correctly
- [ ] **JSON Parsing**: JSON fields display correctly in Airtable
- [ ] **Relationships**: Linked records connect properly

## Common Issues & Solutions

### Issue: Single Select Values Not Matching
**Problem**: `AI_Blueprint` instead of `ai_blueprint`
**Solution**: Use exact case-sensitive values from standards

### Issue: Decimal Precision Lost
**Problem**: `4.2` instead of `4.20` for trust scores
**Solution**: Format numbers with required decimal places

### Issue: JSON Escaping Errors
**Problem**: Unescaped quotes breaking CSV parsing
**Solution**: Use `"{""key"":""value""}"` format

### Issue: DateTime Format Rejected
**Problem**: Various date formats not recognized
**Solution**: Always use `2025-01-27T10:00:00Z` format

### Issue: Boolean Values Not Recognized
**Problem**: `True`, `1`, `yes` not recognized as boolean
**Solution**: Use only `true` or `false` (lowercase)

## Automated Validation Tools

### CSV Validation Script
```bash
# Run validation before import
npx ts-node scripts/tools/csv-validator.ts --table=PromptLogs --file=01_PromptLogs.csv
```

### Validation Commands
```bash
# Validate all CSV files
npm run validate:csv:all

# Validate specific table
npm run validate:csv:table -- --name=SparkSplitAnalytics

# Validate field consistency
npm run validate:csv:consistency

# Generate validation report
npm run validate:csv:report
```

### Expected Validation Output
```
✅ Field count: 47/47 correct
✅ Field names: All match table definition
✅ Data types: All values valid
✅ Precision: All numbers formatted correctly
✅ Single selects: All values match options
✅ Required fields: All populated
✅ JSON format: All properly escaped
✅ DateTime format: All ISO 8601 compliant
✅ Cross-references: All IDs consistent

🎯 VALIDATION PASSED: Ready for Airtable import
```

## Standards Compliance Verification

### Quick Validation Commands
```bash
# Check promptType options (should return 11)
grep -o '"ai_blueprint\|business_plan\|email_campaign\|site_audit\|social_content\|reverse_strategy\|ai_brand_identity\|profile_makeover\|blogblitz\|ad_amplify\|sparksplit"' airtable-table-definitions.json | wc -l

# Verify decimal precision in CSV
awk -F',' '{print $14}' 01_PromptLogs.csv | grep -E '^[0-9]+\.[0-9]{2}$'

# Check datetime format
awk -F',' '{print $2}' 01_PromptLogs.csv | grep -E '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$'
```

---

## 🎯 Usage Instructions

1. **Before CSV Review**: Reference this document instead of manual checking
2. **During Validation**: Use the checklist systematically
3. **For Issues**: Consult Common Issues & Solutions section
4. **For Automation**: Use provided validation scripts
5. **For Updates**: Update this document when standards change

**This document eliminates the need for manual double-checking by providing systematic, automated validation standards.**

---

**Document Maintenance**: Update this document when:
- New tables are added
- Field types change
- New single select options are added
- Precision requirements change
- New validation rules are established 