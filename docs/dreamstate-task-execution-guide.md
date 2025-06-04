# 🚀 DreamState Task Execution Guide
**Systematic Implementation with Test-First Truth**

## 📋 **QUICK START**

### **1. Run the Task Runner**
```bash
npm run dreamstate:task-runner
```
This will:
- ✅ Analyze current progress
- 🎯 Identify next sequential task
- 📋 Generate execution plan
- 🛡️ Enforce quality gates
- 🚀 Display next steps

### **2. Follow the Execution Plan**
The script will output a detailed plan like:
```
## TASK: [Task Name]
**Phase**: [Phase Number] - [Phase Name] | **Milestone**: [Task Number]

### IMPLEMENTATION PLAN
1. Write comprehensive tests that define expected behavior
2. Implement production-ready functionality (NO placeholders)
3. Ensure all tests pass with 100% success rate
4. Validate performance requirements (<50ms response times)
5. Update task list with ✅ COMPLETE status
```

### **3. Implement with Test-First Truth**
- 🧪 **Write tests FIRST** - Define expected behavior
- 💻 **Implement REAL code** - No mocks, placeholders, or TODOs
- ✅ **Validate 100% pass rate** - All tests must pass
- 📊 **Update progress** - Mark task as complete

---

## 🚫 **ABSOLUTE PROHIBITIONS**

### **Never Use These:**
- ❌ **Mocks** - All functionality must be real
- ❌ **Placeholders** - Every function fully implemented  
- ❌ **TODO code** - No "implement later" comments
- ❌ **console.log** - Use proper logging infrastructure
- ❌ **Stub implementations** - Every method must work

### **Quality Gates:**
- 🧪 **100% Test Pass Rate** - No exceptions
- 🚀 **Production Ready** - Deployable immediately
- ⚡ **Performance Validated** - <50ms response times
- 🛡️ **Error Handling** - Complete edge case coverage

---

## 📚 **AVAILABLE COMMANDS**

### **Task Management:**
```bash
npm run dreamstate:task-runner    # Run task analysis and planning
npm run dreamstate:next-task      # Same as above (alias)
```

### **Testing:**
```bash
npm run dreamstate:test           # Run DreamState test suite
npm run test:integration          # Run integration tests
npm run test-first-truth:validate # Validate test-first principles
```

### **Progress Tracking:**
```bash
npm run integration:status        # Quick integration status
npm run validate:integration      # Full integration validation
```

---

## 🎯 **WORKFLOW EXAMPLE**

### **Step 1: Check Status**
```bash
npm run dreamstate:task-runner
```
Output shows:
- 📈 Current progress: 85% (85/99 enhancements)
- 🎯 Next task: Task 7.1 - Emotional Trace Intelligence
- ✅ All tests passing: 412/412

### **Step 2: Follow Plan**
Script generates execution plan for Task 7.1:
1. Write tests for distributed trace correlation
2. Implement EmotionalTraceEngine
3. Add cross-session trace correlation
4. Validate performance <50ms
5. Update task list

### **Step 3: Implement**
```bash
# Write tests first
# tests/dreamstate/observability-emotional-context.test.ts

# Implement real functionality  
# src/observability/emotional-trace-engine.ts

# Run tests
npm run dreamstate:test
```

### **Step 4: Validate**
```bash
# Ensure 100% pass rate
npm run dreamstate:test

# Check for prohibited patterns
grep -r "TODO\|placeholder\|mock" src/ tests/

# Validate performance
# (included in tests)
```

### **Step 5: Complete**
- ✅ Mark task as complete in task list
- 📊 Update phase progress
- 🔄 Run task runner for next task

---

## 🛡️ **QUALITY ENFORCEMENT**

### **Pre-Implementation Checks:**
- [ ] All previous tests passing
- [ ] No placeholder code in codebase
- [ ] File structure validated
- [ ] Prerequisites met

### **During Implementation:**
- [ ] Tests written first (failing appropriately)
- [ ] Real implementation (no mocks/placeholders)
- [ ] Performance requirements met
- [ ] Error handling comprehensive

### **Post-Implementation:**
- [ ] 100% test pass rate achieved
- [ ] No prohibited patterns found
- [ ] Integration tests passing
- [ ] Task list updated accurately

---

## 🚨 **TROUBLESHOOTING**

### **Tests Failing?**
```bash
# Run tests to see failures
npm run dreamstate:test

# Fix failing tests before proceeding
# Task runner will block until 100% pass rate
```

### **Found Prohibited Patterns?**
```bash
# Scan for issues
grep -r "TODO\|FIXME\|placeholder\|stub\|mock" src/ tests/

# Fix all instances before proceeding
# Replace with real implementations
```

### **Performance Issues?**
```bash
# Check performance in tests
# Ensure <50ms response times
# Optimize if needed
```

---

## 📈 **SUCCESS METRICS**

Track these for each task:
- ✅ **Test Pass Rate**: 100% (no exceptions)
- 🚀 **Implementation Completeness**: 100% (zero placeholders)
- ⚡ **Performance**: <50ms response times
- 🔗 **Integration**: Works with existing system
- 📊 **Documentation**: Task list reflects reality

---

## 🎯 **REUSABLE PROMPT**

Use this prompt to maintain focus:

> "Run the DreamState task runner to identify the next sequential task. Follow the generated execution plan with absolute adherence to Test-First Truth principles. Implement production-ready code with zero mocks, placeholders, or TODO comments. Ensure 100% test pass rate before marking any task complete. Update the task list with ✅ COMPLETE status and run the task runner again for the next task."

---

**Remember**: We're building production-ready emotional intelligence, not prototypes. Every line of code must be deployable and every test must validate real functionality.

**Test-First Truth**: Nothing is complete until tests prove it works in production conditions. 