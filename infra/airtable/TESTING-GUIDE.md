# 🧪 Airtable API Integration Testing Guide

**Purpose**: Comprehensive testing strategy to validate Airtable API integration and resolve CSV import issues  
**Date**: 2025-01-27  
**Framework**: Codex v6.1.4 + Test-First Truth  
**Status**: Ready for execution  

## 🎯 **Overview**

This guide provides a complete testing strategy for your Airtable API integration, specifically addressing the CSV import issues you encountered with single select fields, JSON arrays, and field mapping problems.

### **What This Testing Covers**
- ✅ **Environment Setup Validation** - API keys and connectivity
- ✅ **Table Structure Verification** - All 18 tables and field mappings
- ✅ **CRUD Operations Testing** - Create, Read, Update, Delete functionality
- ✅ **Field Type Compatibility** - Addresses CSV import issues
- ✅ **Linked Record Relationships** - Validates table connections
- ✅ **Data Integrity Validation** - Ensures data accuracy

---

## 🚀 **Quick Start**

### **Prerequisites**
1. **Environment Variables**: Ensure your `.env.local` file contains:
   ```bash
   AIRTABLE_API_KEY=your_api_key_here
   AIRTABLE_BASE_ID=your_base_id_here
   ```

2. **Dependencies**: Install required packages:
   ```bash
   npm install node-fetch dotenv
   ```

### **Run Tests Immediately**
```bash
# Quick API validation test
npm run test:airtable-api

# Comprehensive CRUD testing
npm run test:airtable-crud

# Advanced field validation (TypeScript)
npm run test:airtable-fields

# All-in-one validation
npm run validate:airtable
```

---

## 📊 **Testing Phases Explained**

### **Phase 1: Environment Validation** 🔧
**What it tests:**
- API key authentication
- Base ID accessibility
- Network connectivity
- Table discovery

**Expected output:**
```
✅ Environment variables loaded
✅ API connectivity confirmed - Found 18 tables
📋 Table: PromptLogs (tblXXXXXXXXXXXXXX)
📋 Table: SessionAnalytics (tblYYYYYYYYYYYYYY)
...
```

### **Phase 2: Table Discovery** 📊
**What it tests:**
- All 18 expected tables exist
- Field count validation
- Sample data availability

**Expected output:**
```
✅ Table found: PromptLogs (25 fields, 3 sample records)
   📋 Fields: sessionId, userId, promptType, inputFields, output...
✅ Table found: SessionAnalytics (20 fields, 6 sample records)
   📋 Fields: sessionId, userId, startTime, duration, promptCount...
```

### **Phase 3: Field Validation** 🔍
**What it tests:**
- Critical field presence
- Data type validation
- Value range checking
- JSON format validation

**Addresses CSV Issues:**
- Single select field compatibility
- Multiple select array handling
- JSON string storage validation
- Field mapping accuracy

### **Phase 4: CRUD Operations** 🔄
**What it tests:**
- **CREATE**: Record creation with test data
- **READ**: Record retrieval and verification
- **UPDATE**: Record modification
- **DELETE**: Record removal and cleanup

**Test Data Examples:**
```javascript
// PromptLogs test data
{
  sessionId: "test_session_1706356200000",
  userId: "test_user_1706356200000", 
  promptType: "business_plan",
  inputFields: "{\"industry\":\"technology\",\"goal\":\"testing\"}",
  trustScore: 0.85,
  // ... additional fields
}
```

### **Phase 5: Field Type Compatibility** 🔧
**What it tests:**
- Single select field validation
- Multiple select array handling
- JSON string storage
- Numeric precision
- Boolean field handling

**Specifically addresses your CSV import issues:**
```javascript
// Tests that failed during CSV import
{
  table: 'PromptLogs',
  field: 'promptType', 
  type: 'Single Select',
  testValue: 'business_plan'  // Validates select options
},
{
  table: 'SessionAnalytics',
  field: 'productsUsed',
  type: 'Multiple Select', 
  testValue: ['business_plan', 'ad_amplify']  // Validates arrays
}
```

---

## 🔧 **Troubleshooting Common Issues**

### **Issue 1: Single Select Field Errors**
**Problem**: CSV import failed with "Invalid option" errors
**Solution**: 
```javascript
// Test validates that select options exist in Airtable
promptType: 'business_plan'  // Must match exact option in Airtable
```
**Fix**: Ensure Airtable single select fields have all required options configured

### **Issue 2: JSON Array Handling**
**Problem**: Multiple select fields not accepting arrays from CSV
**Solution**:
```javascript
// Test validates array format compatibility
productsUsed: ['business_plan', 'ad_amplify']  // Array format
// vs CSV format: "business_plan,ad_amplify"    // Comma-separated
```
**Fix**: Use API for array fields instead of CSV import

### **Issue 3: JSON String Storage**
**Problem**: Complex JSON data not importing correctly
**Solution**:
```javascript
// Test validates JSON string storage
inputFields: JSON.stringify({
  industry: 'technology',
  goal: 'testing'
})  // Properly stringified JSON
```
**Fix**: Ensure JSON is properly stringified before storage

### **Issue 4: Field Mapping Mismatches**
**Problem**: Field names don't match between schema and Airtable
**Solution**: Test validates actual field names against expected schema
**Fix**: Update field names in Airtable to match schema specifications

---

## 📈 **Interpreting Test Results**

### **Success Indicators**
```
✅ CREATE successful: recXXXXXXXXXXXXXX
✅ READ successful: recXXXXXXXXXXXXXX  
✅ UPDATE successful: recXXXXXXXXXXXXXX
✅ DELETE successful: recXXXXXXXXXXXXXX
```

### **Failure Indicators**
```
❌ CREATE failed: Invalid option for promptType
❌ Field type incompatible: productsUsed - Array not accepted
❌ Missing critical field: sessionId
```

### **Test Report Example**
```
## 📊 Test Summary Report

### Overall Results
- **Total Tests:** 45
- **Passed:** 42
- **Failed:** 3
- **Success Rate:** 93.3%

### Failed Tests
- **Field Type: SessionAnalytics.productsUsed**: Multiple select array validation
- **CRUD CREATE: SparkSplitAnalytics**: Missing required field
```

---

## 🛠️ **Advanced Testing Options**

### **Custom Field Testing**
```bash
# Test specific table
node infra/airtable/run-airtable-tests.js --table=PromptLogs

# Test specific field types
node infra/airtable/run-airtable-tests.js --test=field-types

# Verbose output
node infra/airtable/run-airtable-tests.js --verbose
```

### **Integration with Make.com Testing**
```bash
# Test webhook compatibility
npm run test:make-scenarios

# Combined Airtable + Make.com validation
npm run test:mvp-flow
```

---

## 📋 **Pre-Production Checklist**

### **Before Going Live**
- [ ] All 18 tables discovered successfully
- [ ] Critical fields validated in key tables
- [ ] CRUD operations working for core tables
- [ ] Field type compatibility confirmed
- [ ] Linked record relationships functional
- [ ] No CSV import issues remaining
- [ ] Test data cleanup completed
- [ ] Error handling validated

### **Success Criteria**
- **95%+ test pass rate**
- **All core tables (PromptLogs, SessionAnalytics, SparkSplitAnalytics) fully functional**
- **Zero field mapping errors**
- **All problematic CSV fields working via API**

---

## 🔄 **Continuous Testing Strategy**

### **Daily Validation**
```bash
# Quick health check
npm run test:airtable-api
```

### **Pre-Deployment Testing**
```bash
# Full validation suite
npm run validate:airtable
npm run test:make-scenarios
```

### **Post-CSV Import Validation**
```bash
# After any CSV import, validate data integrity
npm run test:airtable-fields
```

---

## 📞 **Support & Next Steps**

### **If Tests Pass (95%+ success rate)**
✅ **Ready for Production**: Your Airtable integration is validated  
✅ **Next Phase**: Proceed with Make.com integration development  
✅ **Monitoring**: Set up continuous testing for ongoing validation  

### **If Tests Fail (<95% success rate)**
❌ **Review Failed Tests**: Check test-results.md for detailed error analysis  
❌ **Fix Field Mappings**: Update Airtable field configurations  
❌ **Retry Testing**: Re-run tests after fixes  
❌ **Escalate**: Contact support if persistent issues  

### **Generated Files**
- `infra/airtable/test-results.md` - Detailed test report
- `infra/airtable/test-results.json` - Machine-readable results
- Console output with real-time progress

**🎯 Your Airtable integration testing is now ready to execute!** 