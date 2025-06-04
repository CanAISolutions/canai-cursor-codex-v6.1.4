# Codex v6.1.4 Compliance Guidelines: Production-Ready Code Standards

> **Document Type**: MANDATORY COMPLIANCE FRAMEWORK  
> **Version**: v1.0  
> **Status**: ACTIVE - All code must comply before deployment  
> **Framework**: Test-First Truth + Zero Mock Policy + Production Readiness  

## 🚨 **CRITICAL COMPLIANCE RULES**

### **Rule 1: ZERO PLACEHOLDER CODE**
- **Violation**: Any comment containing "placeholder", "would integrate", "TODO", "FIXME"
- **Enforcement**: Automatic rejection of any code with placeholder language
- **Standard**: All code must be immediately executable in production

### **Rule 2: ZERO MOCK IMPLEMENTATIONS**
- **Codex Setting**: `"mocksPermitted": false`, `"enforceMockZero": true`
- **Violation**: Any simulated, fake, or mock functionality
- **Standard**: All integrations must connect to real services or provide graceful fallbacks

### **Rule 3: PRODUCTION-READY INTEGRATIONS**
- **Requirement**: All API calls must use actual endpoints with proper error handling
- **Standard**: Real authentication, real data persistence, real service connections
- **Fallback**: Graceful degradation with logging, not simulation

## 🛡️ **COMPLIANCE VALIDATION CHECKLIST**

### **Before Code Submission**
- [ ] **No Placeholder Comments**: Search for "placeholder", "would", "TODO", "FIXME"
- [ ] **Real API Endpoints**: All fetch() calls use actual service URLs
- [ ] **Proper Authentication**: All API calls include real auth headers
- [ ] **Error Handling**: Try/catch blocks with real error recovery
- [ ] **Environment Variables**: All secrets use actual env vars
- [ ] **Type Safety**: All API responses properly typed
- [ ] **Logging**: Real event emission, not console.log statements

### **Integration Requirements**
- [ ] **Database Connections**: Real Airtable/database operations
- [ ] **External APIs**: Real OpenAI, Make.com, Webflow connections
- [ ] **Authentication**: Real bearer tokens and API keys
- [ ] **Error Recovery**: Actual retry logic and fallback mechanisms
- [ ] **Data Validation**: Real schema validation and sanitization

## 🔍 **AUTOMATED COMPLIANCE SCANNING**

### **Forbidden Patterns**
```typescript
// ❌ VIOLATIONS - These patterns are FORBIDDEN:
// Placeholder: Would integrate with...
// TODO: Implement actual...
// FIXME: Replace with real...
// Simulated response for...
// Mock implementation of...
return 'fake-data'; // Without real service call
```

### **Required Patterns**
```typescript
// ✅ COMPLIANT - These patterns are REQUIRED:
try {
  const response = await fetch(process.env.ACTUAL_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.REAL_API_KEY}`
    },
    body: JSON.stringify(realData)
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  
  const data = await response.json() as ExpectedType;
  return data;
} catch (error) {
  emitSystemLog('service-error', {
    error: error instanceof Error ? error.message : 'Unknown error',
    timestamp: new Date().toISOString()
  });
  throw error; // Or provide graceful fallback
}
```

## 📋 **PRODUCTION READINESS STANDARDS**

### **API Integration Standards**
1. **Real Endpoints**: All URLs must be actual service endpoints
2. **Authentication**: Real API keys and bearer tokens
3. **Error Handling**: Comprehensive try/catch with logging
4. **Retry Logic**: Exponential backoff for failed requests
5. **Type Safety**: Proper TypeScript interfaces for responses
6. **Timeout Handling**: Reasonable timeout values with fallbacks

### **Data Persistence Standards**
1. **Real Databases**: Actual Airtable/database connections
2. **Schema Validation**: Real data validation before persistence
3. **Transaction Safety**: Proper error handling for data operations
4. **Backup Strategy**: Data integrity protection
5. **Access Control**: Proper authentication for data operations

### **Service Integration Standards**
1. **Make.com**: Real webhook URLs with actual scenario IDs
2. **OpenAI**: Real API integration with proper model selection
3. **Webflow**: Real CMS connections with actual site IDs
4. **Airtable**: Real base and table connections with proper auth

## 🚨 **IMMEDIATE REMEDIATION PROTOCOL**

### **When Placeholder Code is Detected**
1. **STOP**: Immediately halt development
2. **IDENTIFY**: Document all placeholder implementations
3. **REMEDIATE**: Replace with production-ready code
4. **VALIDATE**: Test all integrations with real services
5. **VERIFY**: Confirm compliance before proceeding

### **Remediation Checklist**
- [ ] Replace all placeholder comments with actual implementations
- [ ] Convert all simulated responses to real API calls
- [ ] Implement proper error handling and retry logic
- [ ] Add comprehensive logging with real event emission
- [ ] Test all integrations with actual services
- [ ] Validate data persistence with real databases
- [ ] Confirm authentication with real credentials

## 🎯 **USER INSTRUCTION GUIDELINES**

### **How to Request Production-Ready Code**
```
"Implement [feature] with PRODUCTION-READY code only. 
No placeholders, no mocks, no simulations. 
All integrations must use real services with proper error handling.
Follow Codex v6.1.4 compliance standards."
```

### **How to Validate Compliance**
```
"Scan all code for placeholder implementations and compliance violations.
Ensure all API calls use real endpoints with proper authentication.
Verify all integrations are production-ready before proceeding."
```

### **How to Prevent Future Violations**
```
"Before implementing any feature, confirm:
1. All services have real endpoints available
2. All authentication credentials are configured
3. All error handling includes real recovery mechanisms
4. All data persistence uses actual databases
5. All integrations follow production standards"
```

## 🔧 **TECHNICAL IMPLEMENTATION STANDARDS**

### **Environment Variable Requirements**
```typescript
// ✅ REQUIRED: All real service credentials
const requiredEnvVars = [
  'OPENAI_API_KEY',
  'MAKE_API_KEY', 
  'AIRTABLE_API_KEY',
  'AIRTABLE_BASE_ID',
  'API_BASE_URL',
  'WEBFLOW_API_KEY'
];
```

### **Error Handling Standards**
```typescript
// ✅ REQUIRED: Comprehensive error handling
try {
  const result = await realServiceCall();
  return result;
} catch (error) {
  emitSystemLog('service-error', {
    service: 'service-name',
    error: error instanceof Error ? error.message : 'Unknown error',
    timestamp: new Date().toISOString()
  });
  
  // Graceful fallback or re-throw
  throw new Error(`Service integration failed: ${error}`);
}
```

### **Type Safety Standards**
```typescript
// ✅ REQUIRED: Proper response typing
interface ServiceResponse {
  data: ExpectedDataType;
  status: string;
  timestamp: string;
}

const response = await fetch(url) as ServiceResponse;
```

## 📊 **COMPLIANCE MONITORING**

### **Automated Checks**
- **Pre-commit**: Scan for forbidden patterns
- **Build-time**: Validate all environment variables
- **Runtime**: Monitor for placeholder errors
- **Deployment**: Verify all integrations before release

### **Manual Reviews**
- **Code Review**: Human verification of compliance
- **Integration Testing**: Real service validation
- **Production Testing**: End-to-end verification
- **Compliance Audit**: Regular compliance assessment

## 🏆 **SUCCESS CRITERIA**

### **Compliance Metrics**
- **Zero Placeholders**: 0 placeholder comments in codebase
- **Real Integrations**: 100% actual service connections
- **Error Handling**: 100% try/catch coverage for external calls
- **Type Safety**: 100% TypeScript compliance
- **Production Readiness**: 100% deployable code

### **Quality Assurance**
- **Immediate Execution**: All code runs in production without modification
- **Service Integration**: All external services properly connected
- **Error Recovery**: All failures handled gracefully
- **Data Integrity**: All persistence operations validated
- **Security Compliance**: All authentication properly implemented

---

**This document is MANDATORY for all development work. Any code that violates these standards must be immediately remediated before proceeding.** 