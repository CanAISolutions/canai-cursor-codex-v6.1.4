# 🚀 DreamState Task Executor Prompt
**Systematic Implementation with Test-First Truth**

## 📋 **EXECUTION DIRECTIVE**

You are implementing DreamState enhancement tasks with absolute adherence to Test-First Truth principles. Follow this systematic approach:

### **1. CURRENT STATUS CHECK**
- [ ] Read `docs/dreamstate-enhancement-implementation-tasks.md` 
- [ ] Identify next incomplete task in sequence
- [ ] Verify current phase completion percentage
- [ ] Check for any failed tests that need fixing first

### **2. TASK SELECTION CRITERIA**
- [ ] Select the NEXT sequential task (no skipping)
- [ ] Ensure all prerequisites are complete
- [ ] Verify no blocking issues exist
- [ ] Confirm task aligns with current phase

### **3. IMPLEMENTATION REQUIREMENTS**

#### **🚫 ABSOLUTE PROHIBITIONS**
- **NO MOCKS** - All functionality must be real and production-ready
- **NO PLACEHOLDERS** - Every function must be fully implemented
- **NO TODO CODE** - No "implement later" or temporary code
- **NO CONSOLE.LOG** - Use proper logging infrastructure
- **NO STUB IMPLEMENTATIONS** - Every method must work completely

#### **✅ MANDATORY REQUIREMENTS**
- **REAL IMPLEMENTATIONS** - Every function fully operational
- **COMPREHENSIVE TESTS** - Test every component before claiming completion
- **PRODUCTION READY** - Code must be deployable immediately
- **ERROR HANDLING** - Complete error handling for all edge cases
- **PERFORMANCE OPTIMIZED** - Sub-50ms response times maintained

### **4. TEST-FIRST TRUTH VALIDATION**

#### **Before Implementation:**
- [ ] Write failing tests that define expected behavior
- [ ] Ensure tests cover all edge cases and error conditions
- [ ] Verify tests fail appropriately before implementation

#### **During Implementation:**
- [ ] Implement ONLY what makes tests pass
- [ ] No code without corresponding test coverage
- [ ] Validate performance requirements in tests

#### **After Implementation:**
- [ ] ALL tests must pass (100% pass rate required)
- [ ] Run full DreamState test suite: `npm run dreamstate:test`
- [ ] Verify integration tests: `npm run test:integration`
- [ ] Check for any regression failures

### **5. PROGRESS TRACKING**

#### **Task Completion Checklist:**
- [ ] Implementation complete with zero placeholders
- [ ] All tests passing (100% pass rate)
- [ ] Performance benchmarks met
- [ ] Error handling comprehensive
- [ ] Documentation updated
- [ ] Integration validated

#### **Update Task List:**
- [ ] Mark task as ✅ **COMPLETE** in `docs/dreamstate-enhancement-implementation-tasks.md`
- [ ] Update phase completion percentage
- [ ] Add implementation details and test results
- [ ] Note any discoveries or optimizations

### **6. QUALITY ENFORCEMENT**

#### **Pre-Completion Audit:**
```bash
# Search for prohibited patterns
grep -r "TODO\|FIXME\|placeholder\|stub\|mock\|console\.log" src/ tests/
```

#### **Test Validation:**
```bash
# Ensure all tests pass
npm run dreamstate:test
npm run test:integration
npm run test-first-truth:validate
```

#### **Performance Validation:**
- [ ] Response times <50ms for emotional processing
- [ ] Memory usage within acceptable limits
- [ ] No performance degradation from baseline

### **7. COMPLETION CRITERIA**

A task is ONLY complete when:
- [ ] **100% Test Pass Rate** - All tests passing
- [ ] **Zero Placeholders** - No incomplete implementations
- [ ] **Production Ready** - Deployable immediately
- [ ] **Performance Validated** - Meets all benchmarks
- [ ] **Documentation Updated** - Task list reflects completion
- [ ] **Integration Confirmed** - Works with existing system

### **8. NEXT TASK IDENTIFICATION**

After completion:
- [ ] Identify next sequential task
- [ ] Check for any dependencies or prerequisites
- [ ] Verify phase progression logic
- [ ] Plan implementation approach

---

## 🎯 **EXECUTION TEMPLATE**

Use this template for each task execution:

```
## TASK: [Task Name from Enhancement List]
**Phase**: [Current Phase] | **Milestone**: [Specific Milestone]

### STATUS CHECK
- Current Phase Progress: [X]% ([Y]/[Z] tasks complete)
- Previous Task Status: ✅ Complete / ⚪ Pending
- Blocking Issues: None / [List any issues]

### IMPLEMENTATION PLAN
1. [Specific implementation steps]
2. [Test strategy]
3. [Integration approach]

### TEST-FIRST TRUTH VALIDATION
- [ ] Tests written and failing appropriately
- [ ] Implementation makes tests pass
- [ ] Full test suite passes
- [ ] Performance validated

### COMPLETION CONFIRMATION
- [ ] Zero placeholders or TODO code
- [ ] All tests passing (100% rate)
- [ ] Performance benchmarks met
- [ ] Task list updated with ✅ COMPLETE
- [ ] Ready for next task

### NEXT TASK
**Next**: [Identify next sequential task]
**Dependencies**: [Any prerequisites]
**Estimated Effort**: [Time/complexity estimate]
```

---

## 🚨 **FAILURE PREVENTION**

### **Common Pitfalls to Avoid:**
- Implementing without tests
- Leaving placeholder code
- Skipping error handling
- Not validating performance
- Incomplete integration testing

### **Quality Gates:**
- Every function must have real implementation
- Every feature must have passing tests
- Every component must integrate properly
- Every task must be 100% complete before moving on

---

## 📈 **SUCCESS METRICS**

Track these metrics for each task:
- **Test Pass Rate**: Must be 100%
- **Implementation Completeness**: Must be 100% (zero placeholders)
- **Performance Compliance**: Must meet all benchmarks
- **Integration Success**: Must work with existing system
- **Documentation Accuracy**: Task list must reflect reality

---

**Remember**: We're building production-ready emotional intelligence, not prototypes. Every line of code must be deployable and every test must validate real functionality.

**Test-First Truth**: Nothing is complete until tests prove it works in production conditions. 