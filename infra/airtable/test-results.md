# Airtable API Test Results

**Generated:** 2025-05-30T19:02:32.227Z
**Base ID:** apph8yM7gVc9QBFtx

🚀 Starting Airtable API Integration Tests

## 🔧 Phase 1: Environment Validation
✅ Environment variables loaded
📊 Testing Base: apph8yM7gVc9QBFtx
✅ API connectivity confirmed - Successfully accessed PromptLogs table

## 📊 Phase 2: Table Discovery
✅ Table found: PromptLogs (13 fields, 11 sample records)
   📋 Fields: promptType, displayName, description, category, isActive...
✅ Table found: SessionAnalytics (7 fields, 10 sample records)
   📋 Fields: stateName, category, intensity, description, recommendedTone...
✅ Table found: SparkSplitAnalytics (7 fields, 10 sample records)
   📋 Fields: factorName, category, impact, description, applicableProducts...

## 🔍 Phase 3: Key Table Field Validation

### 🔍 Validating PromptLogs Fields
   📋 Found 22 fields with data
   ✅ sessionId: string ("sess_001"...)
   ✅ userId: string ("user_001"...)
   ✅ promptType: string ("ad_amplify"...)
   ❌ inputFields: Invalid JSON format
   ❌ output: Invalid JSON format
   ✅ trustScore: score (0.85...)

### 🔍 Validating SessionAnalytics Fields
   📋 Found 21 fields with data
   ✅ sessionId: string ("sess_002"...)
   ✅ userId: string ("user_002"...)
   ✅ startTime: string ("2025-01-27T10:15:00.000Z"...)
   ✅ duration: number (900000...)
   ✅ promptCount: number (1...)
   ✅ status: string ("active"...)

### 🔍 Validating SparkSplitAnalytics Fields
   📋 Found 28 fields with data
   ✅ sessionId: string ("sess_006"...)
   ✅ promptType: string ("blogblitz"...)
   ✅ trustDelta: number (0.08...)
   ✅ userSelection: string ("sterile"...)
   ✅ competitiveAdvantage: number (0.8...)

## 🔄 Phase 4: CRUD Operations Testing

### 🔄 Testing CRUD: PromptLogs (tbloOnbwQ2LG7QVLB)
   📝 Testing CREATE...
   ❌ CRUD test failed: Airtable API error (422): {"error":{"type":"UNKNOWN_FIELD_NAME","message":"Unknown field name: \"sessionId\""}}

## 🔧 Phase 5: Field Type Compatibility Testing
   🔧 Testing PromptLogs.promptType (Single Select)
   ❌ Field type incompatible: promptType - Airtable API error (422): {"error":{"type":"INVALID_VALUE_FOR_COLUMN","message":"Cannot parse value \"false\" for field fallbackTriggered"}}
   🔧 Testing PromptLogs.inputFields (Long Text (JSON))
   ❌ Field type incompatible: inputFields - Airtable API error (422): {"error":{"type":"INVALID_VALUE_FOR_COLUMN","message":"Cannot parse value \"false\" for field fallbackTriggered"}}
   🔧 Testing SessionAnalytics.productsUsed (Multiple Select)
   ❌ Field type incompatible: productsUsed - Airtable API error (422): {"error":{"type":"INVALID_VALUE_FOR_COLUMN","message":"Cannot parse value \"5000\" for field timeToConfirmation"}}

## 📊 Test Summary Report

### Overall Results
- **Total Tests:** 11
- **Passed:** 6
- **Failed:** 5
- **Success Rate:** 54.5%

### Failed Tests
- **Field Validation: PromptLogs**: 4 valid, 2 invalid fields
- **CRUD: PromptLogs**: Airtable API error (422): {"error":{"type":"UNKNOWN_FIELD_NAME","message":"Unknown field name: \"sessionId\""}}
- **Field Type: PromptLogs.promptType**: Airtable API error (422): {"error":{"type":"INVALID_VALUE_FOR_COLUMN","message":"Cannot parse value \"false\" for field fallbackTriggered"}}
- **Field Type: PromptLogs.inputFields**: Airtable API error (422): {"error":{"type":"INVALID_VALUE_FOR_COLUMN","message":"Cannot parse value \"false\" for field fallbackTriggered"}}
- **Field Type: SessionAnalytics.productsUsed**: Airtable API error (422): {"error":{"type":"INVALID_VALUE_FOR_COLUMN","message":"Cannot parse value \"5000\" for field timeToConfirmation"}}

📄 Detailed results saved to:
- Markdown: C:\Projects\canai-cursor-codex-v6.1.4\infra\airtable\test-results.md
- JSON: C:\Projects\canai-cursor-codex-v6.1.4\infra\airtable\test-results.json

⚠️ 5 tests failed. Review the details above to fix issues.
